import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
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

        if len(monthly) >= 2:
            prev = monthly[-2]['total_sales']
            curr = monthly[-1]['total_sales']
            growth = ((curr - prev) / prev) if prev > 0 else 0
        else:
            growth = 0

        feature_data.append([
            total_sales,
            profit_margin,
            expense_ratio,
            growth
        ])

        user_map.append(user_id)

    return np.array(feature_data),user_map


# Train clustering
def cluster_businesses():
    X, user_map = build_business_features()

    if len(X) < 3:
        return None,None
    
    model = KMeans(n_clusters=3,random_state=42)
    labels = model.fit_predict(X)

    return model, dict(zip(user_map,labels))


# Analyze user position
def analyze_competitor_position(user):
    model, label_map = cluster_businesses()

    if not model:
        return {'message':'Not enough businesses to compare'}
    
    user_cluster = label_map.get(user.id)

    # Count Businesses in each cluster
    cluster_counts = {}

    for label in label_map.values():
        cluster_counts[label] = cluster_counts.get(label,0) + 1

    total = sum(cluster_counts.values())

    # Determine cluster quality
    cluster_names = {
        0:"Developing Businesses",
        1:"Stable Businesses",
        2:"High Performing Businesses"
    }

    return {
        "user_cluster":cluster_names.get(user_cluster,"Unknown"),
        "cluster_distribution":cluster_counts,
        "total_competitors":total
    }