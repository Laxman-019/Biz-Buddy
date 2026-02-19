import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from businesses.models import BusinessRecord
from django.db.models import Sum
from django.db.models.functions import TruncMonth

# Build culstering
def build_business_features():
    users = BusinessRecord.objects.values_list('user',flat=True).distinct()

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

        # Growth rate
        monthly = (
            records
            .annotate(month = TruncMonth('date'))
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
    

# Train clustering
def cluster_businesses():
    X, user_map = build_business_features()

    if len(X) < 3:
        return None,None,None
    
    # Feature scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = KMeans(n_clusters=3,random_state=42,n_init=10)
    labels = model.fit_predict(X_scaled)

    return model, dict(zip(user_map,labels)), X_scaled


# Analyze user position
def analyze_competitor_position(user):

    model, label_map, X_scaled = cluster_businesses()

    if model is None or label_map is None:
        return {
            "user_cluster": "Not enough data",
            "cluster_distribution": {},
            "total_competitors": 0
        }

    user_cluster = label_map.get(user.id)

    # Count cluster sizes
    cluster_counts = {}

    for label in label_map.values():
        cluster_counts[label] = cluster_counts.get(label, 0) + 1

    total = sum(cluster_counts.values())

    # Dynamic cluster ranking
    # Rank cluster by centroid avg
    centroids = model.cluster_centers_
    centroids_scores = centroids.mean(axis=1) 

    ranked_clusters = np.argsort(centroids_scores)

    cluster_names = {}
     
    cluster_names[ranked_clusters[0]] = "Developing Businesses"
    cluster_names[ranked_clusters[1]] = "Stable Businesses"
    cluster_names[ranked_clusters[2]] = "High Performing Businesses"

    return {
        "user_cluster":cluster_names.get(user_cluster,"Developing Bussinesses"),
        "cluster_distribution":cluster_counts,
        "total_competitors":total
    }