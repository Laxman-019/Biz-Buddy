import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from businesses.models import BusinessRecord
from django.db.models import Sum
from django.db.models.functions import TruncMonth


def build_business_features():
    users = BusinessRecord.objects.values_list('user', flat=True).distinct()

    feature_data = []
    user_map = []

    for user_id in users:
        records = BusinessRecord.objects.filter(user_id=user_id)

        total_sales = records.aggregate(total=Sum('sales'))['total'] or 0
        total_expenses = records.aggregate(total=Sum('expenses'))['total'] or 0
        total_profit = records.aggregate(total=Sum('profit'))['total'] or 0

        if total_sales == 0:
            continue

        profit_margin = total_profit / total_sales
        expense_ratio = total_expenses / total_sales

        monthly = (
            records
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total_sales=Sum('sales'))
            .order_by('month')
        )

        monthly = list(monthly)

        if len(monthly) >= 3:
            last_3 = [m["total_sales"] for m in monthly[-3:]]
            growth = (last_3[-1] - np.mean(last_3[:-1])) / (np.mean(last_3[:-1]) + 1)
        else:
            growth = 0

        feature_data.append([
            total_sales,
            profit_margin,
            expense_ratio,
            growth
        ])
        user_map.append(user_id)

    if len(feature_data) == 0:
        return np.array([]), []

    return np.array(feature_data), user_map


def cluster_businesses():
    X, user_map = build_business_features()

    # Lower threshold from 3 to 2 — works with fewer users
    if len(X) < 2:
        return None, None, None

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Dynamic n_clusters based on available data
    n_clusters = min(3, len(X))
    model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = model.fit_predict(X_scaled)

    return model, dict(zip(user_map, labels)), X_scaled


def analyze_competitor_position(user):
    model, label_map, X_scaled = cluster_businesses()

    if model is None or label_map is None:
        return {
            "user_cluster": "Not enough data",
            "cluster_distribution": {},
            "total_competitors": 0
        }

    user_cluster = label_map.get(user.id)

    cluster_counts = {}
    for label in label_map.values():
        cluster_counts[label] = cluster_counts.get(label, 0) + 1

    #  Exclude user themselves from competitor count
    total_competitors = sum(cluster_counts.values()) - 1

    centroids = model.cluster_centers_
    centroids_scores = centroids.mean(axis=1)
    ranked_clusters = np.argsort(centroids_scores)

    n = len(ranked_clusters)
    cluster_names = {}

    # Handle dynamic n_clusters in naming
    if n == 3:
        cluster_names[ranked_clusters[0]] = "Developing Businesses"
        cluster_names[ranked_clusters[1]] = "Stable Businesses"
        cluster_names[ranked_clusters[2]] = "High Performing Businesses"
    elif n == 2:
        cluster_names[ranked_clusters[0]] = "Developing Businesses"
        cluster_names[ranked_clusters[1]] = "High Performing Businesses"
    else:
        cluster_names[ranked_clusters[0]] = "Stable Businesses"

    return {
        "user_cluster": cluster_names.get(user_cluster, "Developing Businesses"),
        "cluster_distribution": cluster_counts,
        "total_competitors": max(0, total_competitors)
    }