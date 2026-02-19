from predictions.intelligence_engine import generate_intelligence
from businesses.models import BusinessRecord
from django.db.models import Sum
from ml.industry_intelligence_engine import load_industry_metrics

MAX_STRATEGIES = 5

def generate_business_strategy(user):

    data = generate_intelligence(user)

    #handle insufficient data

    if data.get("status") == "insufficient_data":
        return {
            "strengths":[],
            "warnings":["Insufficient data available for strategic AI insights."],
            "recommended_strategy":["Add atleast 60 days of bussiness record to activate AI-driven strategy recommendations."]
        }
    

    industry_data = load_industry_metrics()

    strategies = []
    warnings = []
    strengths = []

    trend = data["forecast"]["trend"]
    performance_gap = data["industry"]["performance_gap"]
    market_data = data.get("market", {})
    competitor_data = data.get("competitor", {})


    records = BusinessRecord.objects.filter(user=user)

    total_sales = records.aggregate(total=Sum('sales'))['total'] or 0
    total_expenses = records.aggregate(total=Sum('expenses'))['total'] or 0
    total_profit = records.aggregate(total=Sum('profit'))['total'] or 0

    if total_sales > 0:
        profit_margin = total_profit / total_sales
        expense_ratio = total_expenses / total_sales

        if total_profit < 0:
            warnings.append(("High","Your business is currently running at a loss."))
            strategies.append(("High","Immediately reduce non-essential expense and review pricing strategy."))

        elif profit_margin < 0.15:
            warnings.append(("medium","Profit margin is relatively low."))
            strategies.append(("medium","Improve pricing and reduce operational inefficiencies."))

        if expense_ratio > 0.7:
            warnings.append(("medium","Expense consume large portion of revenue."))
            strategies.append(("medium","Optimize cost structure and supplier contracts."))

        if profit_margin >= 0.2:
            strengths.append("Your profit margin is healthy.")

    
    #trend + industry

    if trend == "declining":
        warnings.append(("High","Demand trend is declining."))

        if performance_gap < 0:
            warnings.append(("High","Declining faster than industry average."))
            strategies.append(("High","Reposition product strategy and evaluate pricing competitiveness."))

        else:
            strengths.append("Despite decline, you outperform industry average.")

    elif trend == "increasing":
        strengths.append("Sales demand is expected to grow.")
        strategies.append(("Medium","Increase inventory and prepare for higher demand."))

    # market share

    share_status = market_data.get("share_status")

    if share_status == "Gaining Market Share":
        strengths.append("You are gaining market share.")
    elif share_status == "Losing Market Share":
        warnings.append(("High","You are losing market share."))
        strategies.append(("High","Strengthen marketing and product differentiation."))

    # competitor position

    cluster = competitor_data.get("user_cluster")

    if cluster == "High Performing Businesses":
        strengths.append("You belong to a high-performing business group.")

    elif cluster == "Developing Businesses":
        warnings.append(("Medium","Performance below top competitor group."))
        strategies.append(("Medium","Focus on margin improvement and operational efficiency."))
        
    # Industry Intelligence 

    if trend != "stable":
        discount_corr = industry_data["discount_intelligence"]["correlation"]   
        festival_lift = industry_data["festival_intelligence"]["festival_lift_percent"]
 
    
        if discount_corr > 0.3:
            strategies.append(("Low","Industry data suggest discounts can boost revenue when applied strategically.") )
    
    
        if festival_lift > 10:
            strategies.append(
                ("Low",f"Industry revenue increases approximately {festival_lift}% during festivals. Plan seasonal campaigns.")
            )

    # priority sorting

    strategies = sorted(strategies,key=lambda x:x[0])
    warnings = sorted(warnings,key=lambda x:x[0])

    strengths = list(dict.fromkeys(strengths))

    strategies = [s[1] for s in strategies[:MAX_STRATEGIES]]
    warnings = [s[1] for s in warnings[:MAX_STRATEGIES]]

    return {
        "strengths": strengths,
        "warnings": warnings,
        "recommended_strategies": strategies
    }
