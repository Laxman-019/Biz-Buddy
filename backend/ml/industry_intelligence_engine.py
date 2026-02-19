import pandas as pd
import numpy as np
import json 
import os
from django.conf import settings
from sklearn.linear_model import LinearRegression

DATA_PATH = os.path.join(
    settings.BASE_DIR,
    "ml",
    "datasets",
    "indian_ecommerce.csv"
)

OUTPUT_PATH = os.path.join(
    settings.BASE_DIR,
    "ml_models",
    "industry_metrics.json"
)

def build_industry_metrics():
    df = pd.read_csv(DATA_PATH)

    # Data validation
    required_columns = [
        "order_date",
        "discount_percent",
        "revenue",
        "sales_event",
        "competition_intensity",
        "inventory_pressure",
        "category"
    ]
    
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"Missing required column - {col}.")
    
    df["order_date"] = pd.to_datetime(df["order_date"],dayfirst=True)
    df = df.dropna(subset=["discount_percent","revenue"])

    metrics = {}

    # Discount Intelligence
    
    correlation = df["discount_percent"].corr(df["revenue"])

    # Use quantile bins insted of fixed bins
    df["discount_bin"] = pd.qcut(df["discount_percent"],q=5,duplicates="drop")
    optimal_discount = (
        df.groupby("discount_bin")["revenue"].mean().idxmax()
    )

    # Multivariable regression

    X = df[["discount_percent"]]
    y = df["revenue"]
    
    model = LinearRegression()
    model.fit(X,y)
    
    elasticity = model.coef_[0]
    
    
    metrics["discount_intelligence"] = {
        "correlation" : round(float(correlation),4),
        "elasticity_coefficient" : round(float(elasticity),4),
        "optimal_discount_range" : str(optimal_discount)
    }
    
    # Festival lift
    
    festival_avg = df[df["sales_event"] != "Normal"]["revenue"].mean()
    normal_avg = df[df["sales_event"] == "Normal"]["revenue"].mean()


    festival_lift = (
        ((festival_avg - normal_avg) / normal_avg) * 100
        if normal_avg > 0 else 0
    )
    
        
    metrics["festival_intelligence"] = {
        "festival_lift_percent" : round(float(festival_lift),2)
    }
    
    # Competition Sensitivity
    
    comp_group = df.groupby("competition_intensity")["revenue"].mean()
    low = comp_group.get("Low", 0 )
    high = comp_group.get("High" , 0)
    
    if low > 0:
        competition_drop = ((low - high) / low ) * 100
        
    else:
        competition_drop = 0
        
    metrics["competition_intelligence"] = {
        "revenue_drop_high_competition_percent" : round(float(competition_drop), 2),
        "competition_pressure" : round(float(competition_drop / 2), 2),
    }      
    
    # Inventory Pressure effect
    
    inv_group = df.groupby("inventory_pressure")["revenue"].mean() 
    low_inv = inv_group.get("Low", 0 )
    high_inv = inv_group.get("High" , 0)
    
    if low_inv > 0:
        inventory_impact = ((low_inv - high_inv) / low_inv ) * 100
        
    else:
        inventory_impact = 0
        
    metrics["inventory_intelligence"] = {
        "inventory_pressure_revenue_change_percent" : round(float(inventory_impact), 2)
    }      
    
    # Category strength index
    
    category_group = df.groupby("category")["revenue"].agg(
        ["mean","std"]
    ).reset_index()
    
    category_group["volatility"] = category_group["std"] / (
        category_group["mean"] + 1
    )
    
    top_categories = (
            category_group.sort_values(
            by = "mean" , ascending=False
        ).head(3)['category'].tolist()
    )

    
    metrics["category_intelligence"] = {
        "top_categories" : top_categories
    }

    # Dataset & Meta Info
    metrics['meta'] = {
        "total_records": int(len(df)),
        "date_range":{
            "start":str(df['order_date'].min()),
            "end" :str(df['order_date'].max())
        }
    }
    
    # Save metrics 
    
    os.makedirs(os.path.dirname(OUTPUT_PATH) , exist_ok=True)
    
    with open(OUTPUT_PATH , "w") as f:
        json.dump(metrics , f , indent=4)
        
    return metrics

def load_industry_metrics():
    if not os.path.exists(OUTPUT_PATH):
        return build_industry_metrics()

    with open(OUTPUT_PATH, "r") as f:
        return json.load(f)