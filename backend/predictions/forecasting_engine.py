import pandas as pd
from businesses.models import BusinessRecord

MIN_RECORDS_REQUIRED = 14


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

    # Weighted moving average forecast
    recent_30 = df.tail(30)
    weights = range(1, len(recent_30) + 1)
    weighted_avg = sum(w * v for w, v in zip(weights, recent_30["y"])) / sum(weights)

    # Trend multiplier so forecast aligns with trend direction
    if percent_change > 10:
        trend_multiplier = min(1.2, 1 + (percent_change / 100) * 0.3)
    elif percent_change < -10:
        trend_multiplier = max(0.8, 1 + (percent_change / 100) * 0.3)
    else:
        trend_multiplier = 1.0

    forecast_total = weighted_avg * 30 * trend_multiplier

    # confidence
    volatility = recent_30["y"].std()

    if weighted_avg > 0:
        confidence = max(20, min(90, 80 - (volatility/weighted_avg)*40))
    else:
        confidence = 20
    
    # If business is in loss, confidence should be low
    if weighted_avg < 0:
        confidence = min(confidence, 30)

    return {
        "status":"success",
        "trend":trend,
        "trend_value": round(float(percent_change), 4),
        "forecast_total":round(forecast_total,2),
        "confidence":round(confidence,2)
    }