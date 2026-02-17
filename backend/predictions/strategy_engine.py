from predictions.intelligence_engine import generate_intelligence
from businesses.models import BusinessRecord
from django.db.models import Sum
from ml.industry_intelligence_engine import load_industry_metrics

def generate_business_strategy(user):

    data = generate_intelligence(user)
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
            warnings.append("Your business is currently running at a loss.")
            strategies.append("Reduce unnecessary expenses and improve pricing strategy.")

        elif profit_margin < 0.15:
            warnings.append("Profit margin is relatively low.")
            strategies.append("Improve pricing strategy and reduce operational costs.")

        if expense_ratio > 0.7:
            warnings.append("Expenses are consuming a large portion of revenue.")
            strategies.append("Optimize operational and supply chain costs.")

        if total_profit > 0 and profit_margin >= 0.2:
            strengths.append("Your profit margin is healthy.")


    if trend == "declining":
        warnings.append("Demand trend is declining.")
        strategies.append("Focus on marketing campaigns and customer retention.")

    elif trend == "increasing":
        strengths.append("Sales demand is expected to grow.")
        strategies.append("Increase inventory and prepare for higher customer demand.")

    else:
        strengths.append("Demand trend is stable.")


    if trend == "declining":
        # Context-aware messaging
        if performance_gap > 0:
            strengths.append(
                "Although demand is declining, you are performing better than the industry average."
            )
        else:
            warnings.append(
                "You are declining faster than industry average."
            )
            strategies.append("Re-evaluate product positioning and pricing strategy.")

    else:
        if performance_gap > 0:
            strengths.append("You are outperforming industry growth.")
        else:
            warnings.append("You are below industry growth level.")
            strategies.append("Improve operational efficiency and market positioning.")

    

    share_status = market_data.get("share_status")

    if share_status == "Gaining Market Share":
        strengths.append("You are gaining market share.")
    elif share_status == "Losing Market Share":
        warnings.append("You are losing market share.")
        strategies.append("Strengthen marketing and improve product differentiation.")


    cluster = competitor_data.get("user_cluster")

    if cluster == "High Performing Businesses":
        strengths.append("You belong to a high-performing business group.")
        strategies.append("Explore expansion opportunities and scale operations.")

    elif cluster == "Developing Businesses":
        warnings.append("Your business performance is below top-performing group.")
        strategies.append("Focus on improving margins and cost control.")
        
    # Industry Intelligence Strategy  layer
    discount_corr = industry_data["discount_intelligence"]["correlation"]   
    festival_lift = industry_data["festival_intelligence"]["festival_lift_percent"]
    competition_drop  = industry_data["competiton_intelligence"]["revenue_drop_high_competition_percent"]
    inventory_effect = industry_data["inventory_intelligence"]["inventory_pressure_revenue_change_percent"]
    top_categories = industry_data["category_intelligence"]["top_categories"]
    
    # Discount Intelligence 
    
    if discount_corr > 0.3:
        strategies.append("Industry data shows strong revenue response to discounting. Consider strategic promotional pricing." )
    
    elif discount_corr < -0.1:
        warnings.append("Heavy discount may reduce revenue effectiveness in current market conditions.") 
        
        
    # Festival Opportunity
    
    if festival_lift > 10:
        strategies.append(
            f"Industry revenue increases approximately {festival_lift}% during festival events. Plan targeted seasonal campaigns."
        )

    # Competition Sensitivity
    
    if competition_drop > 15:
        warnings.append(
            "High competition significantly impacts revenue in the industry."
        )
        strategies.append(
            "Strengthen brand positioning and improve customer retention strategies."
        )

    # Inventory Pressure Effect
    
    if inventory_effect < 0:
        warnings.append(
            "High inventory pressure may compress margins."
        )
        strategies.append(
            "Optimize inventory turnover and avoid overstocking."
        )

    # Category Intelligence
    
    strategies.append(
        f"Top performing industry categories include: {', '.join(top_categories)}. Evaluate your competitive positioning accordingly."
    )


    strengths = list(dict.fromkeys(strengths))
    warnings = list(dict.fromkeys(warnings))
    strategies = list(dict.fromkeys(strategies))

    return {
        "strengths": strengths,
        "warnings": warnings,
        "recommended_strategies": strategies
    }
