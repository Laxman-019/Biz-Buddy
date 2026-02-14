import pandas as pd
import os
import joblib
from prophet import Prophet
from django.conf import settings

DATA_PATH = os.path.join(
    settings.BASE_DIR,
    "ml",
    "datasets",
    "indian_ecommerce.csv" 

)

MODEL_PATH = os.path.join(
    settings.BASE_DIR,
    "ml_models",
    "global_industry_model.pkl",
)

def train_global_industry_model():
    df = pd.read_csv(DATA_PATH)
    df["order_date"] = pd.to_datetime(df["order_date"])

    # aggregate monthly revenue

    monthly = df.groupby(
        pd.Grouper(key='order_date',freq='ME')
    ).agg({
        "revenue": "sum",

    }).reset_index()

    monthly.columns = ["ds","y"]
    model = Prophet()
    model.fit(monthly)

    if not os.path.exists(os.path.dirname(MODEL_PATH)):
        os.makedirs(os.path.dirname(MODEL_PATH))

    joblib.dump(model,MODEL_PATH)
    print("global industry model trained successfully")
    return model
