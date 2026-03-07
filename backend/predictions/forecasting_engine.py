import pandas as pd
from businesses.models import BusinessRecord

MIN_RECORDS_REQUIRED = 60


def train_user_model(user_id):

    records = BusinessRecord.objects.filter(
        user_id=user_id
    ).order_by("date")

    total_records = records.count()

    if total_records < MIN_RECORDS_REQUIRED:
        return {
            "status": "insufficient_data",
            "required": MIN_RECORDS_REQUIRED,
            "available": total_records
        }

    df = pd.DataFrame(list(records.values("date","profit")))

    df.columns = ["ds","y"]

    df["ds"] = pd.to_datetime(df["ds"])

    # IMPORTANT: remove duplicate days
    df = df.groupby("ds")["y"].sum().reset_index()

    df = df.sort_values("ds")

    # last 30 days average
    recent_30 = df.tail(30)

    avg_daily_profit = recent_30["y"].mean()

    forecast_total = avg_daily_profit * 30

    # monthly trend
    monthly = df.resample("ME", on="ds").sum()["y"]

    if len(monthly) >= 2:

        prev = monthly.iloc[-2]
        curr = monthly.iloc[-1]

        if prev != 0:
            percent_change = ((curr - prev) / abs(prev)) * 100
        else:
            percent_change = 0

        # Better threshold logic
        if percent_change > 10:
            trend = "growing"
        elif percent_change < -10:
            trend = "declining"
        else:
            trend = "stable"

    else:
        percent_change = 0
        trend = "stable"


    # confidence
    volatility = recent_30["y"].std()

    if avg_daily_profit > 0:
        confidence = max(20, min(90, 80 - (volatility/avg_daily_profit)*40))
    else:
        confidence = 20

    return {
        "status":"success",
        "trend":trend,
        "trend_value":0,
        "forecast_total":round(forecast_total,2),
        "confidence":round(confidence,2)
    }