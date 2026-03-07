import pandas as pd
import numpy as np
import json
import os
from django.conf import settings
from sklearn.linear_model import LinearRegression
import logging

logger = logging.getLogger(__name__)

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
    """
    Build comprehensive industry metrics from dataset
    """
    try:
        if not os.path.exists(DATA_PATH):
            logger.warning(f"Dataset not found at {DATA_PATH}")
            return get_default_metrics()
        
        df = pd.read_csv(DATA_PATH)
        
        # Validate required columns
        required_columns = [
            "order_date", "discount_percent", "revenue",
            "sales_event", "competition_intensity",
            "inventory_pressure", "category"
        ]
        
        missing_cols = [col for col in required_columns if col not in df.columns]
        if missing_cols:
            logger.warning(f"Missing columns: {missing_cols}")
            return get_default_metrics()
        
        # Process data
        df["order_date"] = pd.to_datetime(df["order_date"], errors='coerce')
        df = df.dropna(subset=["discount_percent", "revenue", "order_date"])
        
        metrics = {}
        
        # 1. Discount Intelligence
        if len(df) > 1:
            correlation = float(df["discount_percent"].corr(df["revenue"]))
            if pd.isna(correlation):
                correlation = 0.0
            
            # Simple regression for elasticity
            X = df[["discount_percent"]].values.reshape(-1, 1)
            y = df["revenue"].values
            
            model = LinearRegression()
            model.fit(X, y)
            elasticity = float(model.coef_[0])
            
            # Find optimal discount range
            df["discount_bin"] = pd.cut(df["discount_percent"], bins=5)
            discount_performance = df.groupby("discount_bin")["revenue"].mean()
            optimal_range = str(discount_performance.idxmax()) if not discount_performance.empty else "5-15%"
        else:
            correlation = 0.0
            elasticity = 0.0
            optimal_range = "5-15%"
        
        metrics["discount_intelligence"] = {
            "correlation": round(correlation, 4),
            "elasticity_coefficient": round(elasticity, 4),
            "optimal_discount_range": optimal_range
        }
        
        # 2. Festival Intelligence
        festival_data = df[df["sales_event"] != "Normal"]
        normal_data = df[df["sales_event"] == "Normal"]
        
        festival_avg = festival_data["revenue"].mean() if len(festival_data) > 0 else 0
        normal_avg = normal_data["revenue"].mean() if len(normal_data) > 0 else 1
        
        if normal_avg > 0:
            festival_lift = ((festival_avg - normal_avg) / normal_avg) * 100
        else:
            festival_lift = 0
        
        metrics["festival_intelligence"] = {
            "festival_lift_percent": round(float(festival_lift), 2)
        }
        
        # 3. Competition Intelligence
        comp_group = df.groupby("competition_intensity")["revenue"].mean()
        low = float(comp_group.get("Low", 0))
        high = float(comp_group.get("High", 0))
        
        if low > 0:
            competition_drop = ((low - high) / low) * 100
            competition_pressure = competition_drop / 2
        else:
            competition_drop = 0
            competition_pressure = 0
        
        metrics["competition_intelligence"] = {
            "revenue_drop_high_competition_percent": round(float(competition_drop), 2),
            "competition_pressure": round(float(competition_pressure), 2),
        }
        
        # 4. Inventory Intelligence
        inv_group = df.groupby("inventory_pressure")["revenue"].mean()
        low_inv = float(inv_group.get("Low", 0))
        high_inv = float(inv_group.get("High", 0))
        
        if low_inv > 0:
            inventory_impact = ((low_inv - high_inv) / low_inv) * 100
        else:
            inventory_impact = 0
        
        metrics["inventory_intelligence"] = {
            "inventory_pressure_revenue_change_percent": round(float(inventory_impact), 2)
        }
        
        # 5. Category Intelligence
        category_group = df.groupby("category")["revenue"].agg(['mean', 'count'])
        category_group = category_group[category_group['count'] >= 5]  # Min samples
        top_categories = category_group.nlargest(3, 'mean')['mean'].index.tolist()
        
        metrics["category_intelligence"] = {
            "top_categories": top_categories if top_categories else ["Electronics", "Fashion", "Home & Living"]
        }
        
        # 6. Meta Info
        metrics['meta'] = {
            "total_records": int(len(df)),
            "date_range": {
                "start": str(df['order_date'].min().date()),
                "end": str(df['order_date'].max().date())
            },
            "last_updated": str(pd.Timestamp.now().date())
        }
        
        # Save metrics
        os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
        with open(OUTPUT_PATH, "w") as f:
            json.dump(metrics, f, indent=4)
        
        return metrics
        
    except Exception as e:
        logger.error(f"Error building industry metrics: {str(e)}")
        return get_default_metrics()


def get_default_metrics():
    """
    Return default industry metrics when dataset is unavailable
    """
    return {
        "discount_intelligence": {
            "correlation": 0.25,
            "elasticity_coefficient": 0.5,
            "optimal_discount_range": "5-15%"
        },
        "festival_intelligence": {
            "festival_lift_percent": 25.0
        },
        "competition_intelligence": {
            "revenue_drop_high_competition_percent": 15.0,
            "competition_pressure": 7.5
        },
        "inventory_intelligence": {
            "inventory_pressure_revenue_change_percent": -10.0
        },
        "category_intelligence": {
            "top_categories": ["Electronics", "Fashion", "Home & Living"]
        },
        "meta": {
            "total_records": 0,
            "date_range": {"start": "N/A", "end": "N/A"},
            "last_updated": str(pd.Timestamp.now().date()),
            "is_default": True
        }
    }


def load_industry_metrics():
    """
    Load industry metrics from file or build if not exists
    """
    try:
        if os.path.exists(OUTPUT_PATH):
            with open(OUTPUT_PATH, "r") as f:
                metrics = json.load(f)
                # Check if file is older than 7 days
                if os.path.getmtime(OUTPUT_PATH) < pd.Timestamp.now().timestamp() - 7*24*60*60:
                    # Refresh if older than 7 days
                    return build_industry_metrics()
                return metrics
        else:
            return build_industry_metrics()
    except Exception as e:
        logger.error(f"Error loading industry metrics: {str(e)}")
        return get_default_metrics()