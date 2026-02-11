from predictions.forecasting_engine import train_user_model
from predictions.model_manager import load_model
from predictions.market_engine import calculate_market_metrics
from predictions.competitor_engine import analyze_competitor_position
from businesses.models import BusinessRecord
from django.db.models import Sum

def generate_business_strategy(user):
    strategies = []
    warnings = []
    strengths = []
    
    # Forcast Analysis
    model = load_model(user.id)
    if not model:
        model = train_user_model(user.id)

    if model:
        future = model.make_future_dataframe(periods = 30)
        forecast = model.predict(future)

        if len(forecast) >= 30:
            trend = "increasing" if forecast['trend'].iloc[-1] > forecast['trend'].iloc[-30] else "declining"
        else:
            trend = "stable"

        
        if trend == "increasing":
            strengths.append("Sales demand is expected to grow soon.")
            strategies.append("Increase inventory and prepare for higher customer demand.")
        elif trend == "declining":
            warnings.append("Demand trend show decline.") 
            strategies.append("Focus on marketing campaigns and customer retention.") 
    else:
        warnings.append("Forcast model not available yet. Add more records")
        

    # Market share analysis
    market_data = calculate_market_metrics(user)

    if market_data.get("share_status") == "Gaining Market Share":

        strengths.append("You are outperforming market growth.")
        strategies.append("Reinvest profits to scale operations.")
        
    elif market_data.get("share_status") == "Losing Market Share":

        warnings.append("You are losing market competitivenes.")
        strategies.append("Improve marketing and differentiate your products.")
        

    # Competitor analysis
    competitor_data = analyze_competitor_position(user)
    cluster = competitor_data.get("user_cluster")

    if cluster:

        if cluster == "High Performing Businesses":

            strengths.append("You belong to top-performing business group.")
            strategies.append("Expand business scale and explore new markets.")
        
        elif cluster == "Stable Businesses":

            strategies.append("Improve efficiency and cost optimization to move into top-performing group.")
        
        elif cluster == "Developing Businesses":

            warnings.append("Your business is below industry performance level.")     
            strategies.append("Focus on improving profit margin and reducing costs.")


    # Finencial health check
    records = BusinessRecord.objects.filter(user = user)

    total_sales = records.aggregate(total = Sum('sales'))['total'] or 0
    total_expenses = records.aggregate(total = Sum('expenses'))['total'] or 0
    total_profit = records.aggregate(total = Sum('profit'))['total'] or 0
    
    if total_sales > 0:
        margin = total_profit / total_sales
        expense_ratio = total_expenses / total_sales
        
        if margin < 0.15:
            warnings.append("Profit margin is low.")
            strategies.append("Review pricing strategy and reduce unnecessary expenses.")
            
        if expense_ratio > 0.7:
            warnings.append("Expenses are consuming most of revenue.")
            strategies.append("Optimize operational and supply chain costs.")        

    return {
        "strengths" : strengths,
        "warnings" : warnings,
        "recommended_strategies" : strategies
    }