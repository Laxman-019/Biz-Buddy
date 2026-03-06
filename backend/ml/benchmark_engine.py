# ml/benchmark_engine.py
import pandas as pd
import os
from django.conf import settings
import joblib
import logging
import numpy as np

logger = logging.getLogger(__name__)

GLOBAL_MODEL_PATH = os.path.join(
    settings.BASE_DIR,
    "ml_models",
    "global_industry_model.pkl"
)

DATA_PATH = os.path.join(
    settings.BASE_DIR,
    "ml",
    "datasets",
    "indian_ecommerce.csv"
)

def calculate_industry_growth():
    """
    Calculate industry growth rate from dataset
    """
    try:
        if not os.path.exists(DATA_PATH):
            logger.warning(f"Industry dataset not found at {DATA_PATH}")
            return 0.05  # Default 5% growth
        
        df = pd.read_csv(DATA_PATH)
        
        # Handle date column
        date_col = 'order_date' if 'order_date' in df.columns else 'date'
        df[date_col] = pd.to_datetime(df[date_col], errors='coerce')
        df = df.dropna(subset=[date_col])
        
        # Aggregate monthly revenue
        monthly = df.groupby(
            pd.Grouper(key=date_col, freq='ME')
        ).agg({'revenue': 'sum'}).reset_index()
        
        # Calculate growth rates
        monthly['growth'] = monthly['revenue'].pct_change()
        
        # Remove infinite and NaN values
        growth_rates = monthly['growth'].replace([np.inf, -np.inf], np.nan).dropna()
        
        if len(growth_rates) == 0:
            return 0.03  # Default 3% growth
        
        # Remove outliers (values beyond 3 standard deviations)
        mean_growth = growth_rates.mean()
        std_growth = growth_rates.std()
        
        filtered_rates = growth_rates[
            (growth_rates > mean_growth - 3 * std_growth) &
            (growth_rates < mean_growth + 3 * std_growth)
        ]
        
        if len(filtered_rates) == 0:
            return round(float(mean_growth), 4)
        
        # Use median for robustness
        industry_growth = float(filtered_rates.median())
        
        # Cap at reasonable range (-20% to +20%)
        industry_growth = max(-0.2, min(0.2, industry_growth))
        
        return round(industry_growth, 4)
        
    except Exception as e:
        logger.error(f"Error calculating industry growth: {str(e)}")
        return 0.03  # Default 3% growth on error


def load_global_industry_model():
    """
    Load pre-trained global industry model
    """
    try:
        if os.path.exists(GLOBAL_MODEL_PATH):
            return joblib.load(GLOBAL_MODEL_PATH)
        return None
    except Exception as e:
        logger.error(f"Error loading global model: {str(e)}")
        return None