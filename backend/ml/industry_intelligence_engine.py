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
    df["order_date"] = pd.to_datetime(df["order_date"],dayfirst=True)
    metrics = {}
    
    # Discount elasticity
    
    correlation = df["discount_percent"].corr(df["revenue"])
    X = df[["discount_percent"]]
    y = df["revenue"]
    
    model = LinearRegression()
    model.fit(X,y)
    
    elasticity = model.coef_[0]
    
    optimal_discount = df.groupby(
        pd.cut(df["discount_percent"],bins=5)
    )["revenue"].mean().idxmax()
    
    metrics["discount_intelligence"] = {
        "correlation" : round(float(correlation),4),
        "elasticity_coefficient" : round(float(elasticity),4),
        "optimal_discount_range" : str(optimal_discount)
    }
    
    # Festival lift
    
    festival_avg = df[df["sales_event"] != "Normal"]["revenue"].mean()
    normal_avg = df[df["sales_event"] == "Normal"]["revenue"].mean()

    

    
    if normal_avg > 0:
        festival_lift = ((festival_avg - normal_avg) / normal_avg) * 100
        
    else:
        festival_lift = 0
        
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
        "revenue_drop_high_competition_percent" : round(float(competition_drop), 2)
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
    
    top_categories = category_group.sort_values(
        by= "mean" , ascending=False
    ).head(3)
    
    metrics["category_intelligence"] = {
        "top_categories" : top_categories["category"].tolist()
    }
    
    # Save metrics 
    
    os.makedirs(os.path.dirname(OUTPUT_PATH) , exist_ok=True)
    
    with open(OUTPUT_PATH , "w") as f:
        json.dump(metrics , f , indent=4)
        
    return metrics

def load_industry_metrics():
    if not os.path.exists(OUTPUT_PATH):
        return build_industry_metrics()
    
    with open(OUTPUT_PATH , "r") as f:
        return json.load(f)