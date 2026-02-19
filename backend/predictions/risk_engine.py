from businesses.models import BusinessRecord
from django.db.models import Sum
import numpy as np


def calculate_business_risk(user,intelligence):


    # Growth Risk

    user_growth = intelligence["forecast"].get("user_growth", 0) 
    performance_gap = intelligence["industry"].get("performance_gap", 0) 
    
    growth_risk = 0
    
    if user_growth < 0:
        growth_risk += min(abs(user_growth) * 2 , 50)

    if performance_gap < 0:
        growth_risk += min(abs(performance_gap) * 1.5 , 50)
        
    growth_risk = min(100, growth_risk)    

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
        
    financial_risk = 0    
    
    # Profit margin risk

    if profit_margin < 0:
        financial_risk += 60

    elif profit_margin < 0.05:
        financial_risk += 40
    elif expense_ratio > 0.20:
        financial_risk += 20
        
    # Expense Ratio risk
    
    if expense_ratio > 0.8:
        financial_risk += 40
    elif expense_ratio > 0.6:
        financial_risk += 20
        
    financial_risk = min(100 , financial_risk)               

    # market risk

    share_status = intelligence["market"].get("share_status")
    
    market_risk = 0

    if share_status == "Losing Market Share":
        market_risk = 70
        
    elif share_status == "Stable Position":
        market_risk = 30
    elif share_status == "Growing Market Share":
        market_risk = 10
    else:
        market_risk = 50    

    # competitive  risk

    cluster = intelligence["competitor"].get("user_cluster")
    competition_pressure = intelligence["industry"].get("competition_pressure" ,0)
    
    competitive_risk = 0

    if cluster == "Developing Businesses":
        competitive_risk += 40
    elif cluster == "High Growth Businesses":
        competitive_risk += 20
        
    competitive_risk += min(competition_pressure, 60)    
    
    competitive_risk = min(100, competitive_risk)    

    # Final Weighted Score
    
    final_risk = (
        growth_risk * 0.30 +
        financial_risk * 0.30 +
        market_risk * 0.20 +
        competitive_risk * 0.20
    )
    
    final_risk = round(min(100, final_risk) , 2)
    
    # Categorization
 
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
            "growth_risk" : growth_risk,
            "financial_risk" : financial_risk,
            "market_risk" : market_risk,
            "competitive_risk" : competitive_risk
        }

    }