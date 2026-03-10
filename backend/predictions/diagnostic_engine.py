from django.db.models import Sum
from businesses.models import BusinessRecord
from ml.industry_intelligence_engine import load_industry_metrics


def generate_diagnostics(user, intelligence):
    industry = load_industry_metrics()

    diagnostics = []
    risks = []
    strengths = []

    # User Financial Metrics
    records = BusinessRecord.objects.filter(user=user)

    total_sales = records.aggregate(total=Sum('sales'))['total'] or 0
    total_expenses = records.aggregate(total=Sum('expenses'))['total'] or 0
    total_profit = records.aggregate(total=Sum('profit'))['total'] or 0

    if total_sales > 0:
        profit_margin = total_profit / total_sales
        expense_ratio = total_expenses / total_sales
    else:
        profit_margin = 0
        expense_ratio = 0

    # Forecast Growth Diagnosis
    user_growth = intelligence.get('forecast', {}).get('user_growth', 0)
    performance_gap = intelligence.get('industry', {}).get('performance_gap', 0)
    trend = intelligence.get('forecast', {}).get('trend', 'stable')

    if user_growth < 0:
        diagnostics.append("Your projected demand is declining.")
        risks.append("Negative growth trend may impact cash flow.")

    if performance_gap < 0:
        diagnostics.append("You are underperforming relative to industry growth.")
        risks.append("Competitive positioning may need improvement.")
    elif performance_gap > 0.1 and trend == "growing" and user_growth > 0:
        strengths.append("You are outperforming industry growth.")

    # Profitability Diagnosis
    if profit_margin < 0:
        risks.append("Business is currently operating at a loss.")
    elif profit_margin < 0.15:
        diagnostics.append("Profit margin is below optimal level.")
    else:
        strengths.append("Profitability levels are strong.")

    if expense_ratio > 0.7:
        risks.append("Expense ratio is significantly high.")
        diagnostics.append("Operational efficiency may need optimization.")

    # Discount Intelligence
    industry_discount_corr = industry["discount_intelligence"]["correlation"]

    if industry_discount_corr > 0.3 and profit_margin > 0.2:
        diagnostics.append("Industry shows strong discount-driven demand. You may experiment with promotional pricing.")

    # Festival Intelligence
    festival_lift = industry["festival_intelligence"]["festival_lift_percent"]

    if festival_lift > 15:
        diagnostics.append(f"Industry revenue increases ~{festival_lift:.2f}% during festival events.")

        if user_growth < 0 or performance_gap < 0 or trend == "declining":
            risks.append("Missing seasonal campaign opportunities — act before the next peak.")
        elif profit_margin >= 0.2 and performance_gap >= 0 and trend != "declining":
            strengths.append("You are well-positioned to capitalize on upcoming seasonal demand.")
        else:
            risks.append("Consider planning seasonal campaigns to leverage the festival lift.")

    # Competition Risk
    comp_drop = industry["competition_intelligence"]["revenue_drop_high_competition_percent"]

    if comp_drop > 15:
        diagnostics.append(f"Revenue drops {comp_drop}% under high competition environments.")
        risks.append("High exposure to competitive pressure.")

    # Inventory Intelligence
    inventory_impact = industry["inventory_intelligence"]["inventory_pressure_revenue_change_percent"]

    if inventory_impact < 0:
        risks.append("Inventory pressure negatively impacts revenue in your industry.")

    # Category Benchmark
    top_categories = industry["category_intelligence"]["top_categories"]
    diagnostics.append(f"Top performing industry categories: {', '.join(top_categories)}.")

    diagnostics = list(dict.fromkeys(diagnostics))
    risks = list(dict.fromkeys(risks))
    strengths = list(dict.fromkeys(strengths))

    return {
        "diagnostics": diagnostics,
        "risks": risks,
        "strengths": strengths
    }