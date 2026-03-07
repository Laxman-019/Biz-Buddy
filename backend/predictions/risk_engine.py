from businesses.models import BusinessRecord
from django.db.models import Sum


def calculate_business_risk(user, intelligence):

    forecast = intelligence.get("forecast", {})
    market = intelligence.get("market", {})
    competitor = intelligence.get("competitor", {})

    forecast_total = forecast.get("predicted_30_day_demand", 0)
    trend = forecast.get("trend", "stable")
    confidence = forecast.get("confidence_score", 0)

      
    # Growth Risk
      

    growth_risk = 10  # base risk always exists

    # Trend impact
    if trend == "declining":
        growth_risk += 30
    elif trend == "stable":
        growth_risk += 10
    else:  # growing
        growth_risk += 5

    # Forecast loss risk
    if forecast_total < 0:
        growth_risk += 40

    # Confidence risk
    if confidence < 30:
        growth_risk += 30
    elif confidence < 50:
        growth_risk += 20
    elif confidence < 70:
        growth_risk += 10

    growth_risk = min(100, growth_risk)

      
    # Financial Risk
      

    records = BusinessRecord.objects.filter(user=user)

    total_sales = records.aggregate(total=Sum("sales"))["total"] or 0
    total_expenses = records.aggregate(total=Sum("expenses"))["total"] or 0
    total_profit = records.aggregate(total=Sum("profit"))["total"] or 0

    if total_sales > 0:
        profit_margin = total_profit / total_sales
        expense_ratio = total_expenses / total_sales
    else:
        profit_margin = 0
        expense_ratio = 1

    financial_risk = 0

    # profit margin risk
    if total_profit < 0:
        financial_risk += 60
    elif profit_margin < 0.05:
        financial_risk += 40
    elif profit_margin < 0.15:
        financial_risk += 20

    # expense ratio risk
    if expense_ratio > 0.8:
        financial_risk += 30
    elif expense_ratio > 0.6:
        financial_risk += 20
    elif expense_ratio > 0.4:
        financial_risk += 10

    financial_risk = min(100, financial_risk)

      
    # Market Risk
      

    share_status = market.get("share_status")

    if share_status == "Losing Market Share":
        market_risk = 40
    elif share_status == "Stable Position":
        market_risk = 20
    elif share_status == "Gaining Market Share":
        market_risk = 10
    else:
        market_risk = 25

      
    # Competitor Risk
      

    cluster = competitor.get("user_cluster")

    if cluster == "Developing Businesses":
        competitor_risk = 40
    elif cluster == "Stable Businesses":
        competitor_risk = 20
    elif cluster == "High Performing Businesses":
        competitor_risk = 10
    else:
        competitor_risk = 25

      
    # Final Risk Score
      

    final_risk = (
        growth_risk * 0.35 +
        financial_risk * 0.35 +
        market_risk * 0.15 +
        competitor_risk * 0.15
    )

    final_risk = round(min(100, final_risk), 2)

      
    # Risk Level
      

    if final_risk <= 25:
        level = "Low Risk"
    elif final_risk <= 50:
        level = "Moderate Risk"
    elif final_risk <= 75:
        level = "High Risk"
    else:
        level = "Critical Risk"

    return {
        "risk_score": final_risk,
        "risk_level": level,
        "breakdown": {
            "growth_risk": growth_risk,
            "financial_risk": financial_risk,
            "market_risk": market_risk,
            "competitor_risk": competitor_risk
        }
    }