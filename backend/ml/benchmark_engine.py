import pandas as pd
import os 
from django.conf import settings

DATA_PATH = os.path.join(
    settings.BASE_DIR,
    "ml",
    "datasets",
    "indian_ecommerce.csv"
)

def calculate_industry_growth():
    df = pd.read_csv(DATA_PATH)
    df["order_date"] = pd.to_datetime(df["order_date"])

    monthly = df.groupby(
        pd.Grouper(key= "order_date",freq= "ME")
    ).agg({
        "revenue": "sum",

    }).reset_index()

    monthly["growth"] = monthly["revenue"].pct_change()
    return monthly["growth"].mean()

