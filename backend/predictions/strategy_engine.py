from businesses.models import BusinessRecord
from django.db.models import Sum
from predictions.intelligence_engine import generate_intelligence

def generate_business_strategy(user):
    data = generate_intelligence(user)
    strategies = []
    warnings = []
    strengths = []
    
    trend = data["forecast"]["trend"]
    performance_gap = data["industry"]["performance_gap"]
    cluster = data["competitor"].get("user_cluster")

    # forcast_logic
    if trend == "increasing":
        strengths.append("Sales demand is expected to grow soon.")
        strategies.append("Increase inventory and prepare for higher customer demand.")
    elif trend == "declining":
        warnings.append("Demand trend show decline.") 
        strategies.append("Focus on marketing campaigns and customer retention.") 

    # industry_comparision
    if performance_gap>0:
        strengths.append("You are outperforming industry growth.")
    else:
        warnings.append("You are below industry growth level.")
        strategies.append("Improve operational efficiency.")

    # cluster analysis
    if cluster == "High Performing Businesses":

        strengths.append("You belong to top-performing business group.")
        strategies.append("Expand business scale and explore new markets.")
    
    elif cluster == "Developing Businesses":

        warnings.append("Your business is below industry performance level.")     
        strategies.append("Focus on improving profit margin and reducing costs.")


    
    return {
        "strengths" : strengths,
        "warnings" : warnings,
        "recommended_strategies" : strategies
    }