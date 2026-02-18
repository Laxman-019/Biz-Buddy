from businesses.models import BusinessRecord
from django.db.models import Sum
from ml.industry_intelligence_engine import load_industry_metrics


def calculate_business_risk(user,intelligence):

    industry = load_industry_metrics()
    risk_score = 0

    # Forecast risk

    user_growth = intelligence["forecast"]["user_growth"] 
    performance_gap = intelligence["industry"]["performance_gap"] 
    
    if user_growth < 0:
        risk_score += 20

    if performance_gap < 0:
        risk_score += 10

    # Financial Risk

    records = BusinessRecord.objects.filter(user=user)

    total_sales = records.aggregate(total = Sum("sales"))["total"] or 0
    total_expenses = records.aggregate(total = Sum("expenses"))["total"] or 0
    total_profit = records.aggregate(total = Sum("profit"))["total"] or 0

    if total_sales > 0:
        profit_margin = total_profit / total_sales
        expense_ratio = total_expenses / total_sales

    else:
        profit_margin = 0
        expense_ratio = 1

    if profit_margin < 0:
        risk_score += 25

    elif profit_margin < 0.15:
        risk_score += 15

    if expense_ratio > 0.7:
        risk_score += 15

    # market share risk

    share_status = intelligence["market"].get("share_status")

    if share_status == "Losing Market Share":
        risk_score += 15

    # competitor cluster risk

    cluster = intelligence["competitor"].get("user_cluster")

    if cluster == "Developing Businesses":
        risk_score += 10

    # industry_competitor_sensitivity

    comp_drop = industry["competition_intelligence"]["revenue_drop_high_competition_percent"]

    if comp_drop > 15:
        risk_score += 10

    # cap and categorize

    risk_score = min(100,risk_score)

    # risk catagory

    if risk_score <= 30:
        level = "Low Risk"
    elif risk_score <= 60:
        level = "Moderate Risk"
    elif risk_score <= 80:
        level = "High Risk"
    else:
        level = "Critical Risk"

    return {
        "risk_score": risk_score,
        "risk_level": level,

    }



