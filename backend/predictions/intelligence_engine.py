from predictions.forecasting_engine import train_user_model
from predictions.market_engine import calculate_market_metrics
from predictions.competitor_engine import analyze_competitor_position
from predictions.diagnostic_engine import generate_diagnostics
from ml.benchmark_engine import calculate_industry_growth
from predictions.risk_engine import calculate_business_risk


def generate_intelligence(user):

    # forecast

    forecast_result = train_user_model(user.id)

    if forecast_result["status"] == "insufficient_data":
        return {
            "status":"insufficient_data",
            "required_records": forecast_result.get("required",60),
            "available_records": forecast_result.get("available",0)
        }
    
    user_growth = forecast_result["trend_value"]
    forecast_trend = forecast_result["trend"]
    confidence_score = forecast_result["confidence"]
    user_prediction = forecast_result["forecast_total"]

    #industry comparision

    industry_growth = float(calculate_industry_growth())
    performance_gap = user_growth - industry_growth

    #market + competitor

    market_data = calculate_market_metrics(user)
    competitor_data = analyze_competitor_position(user)

    #diagnostics

    diagnostic_data = generate_diagnostics(user, {
        "forecast": {
            "user_growth": user_growth
        },
        "industry": {
            "performance_gap": performance_gap
        }
    })

    core_data = {
        "forecast": {
            "user_growth": user_growth
        },
        "industry":{
            "performance_gap": performance_gap
        },
        "market": market_data,
        "competitor": competitor_data
    }

    # risk

    risk_data = calculate_business_risk(user,core_data)

    return {
        "status": "success",
        "forecast": {
            "predicted_30_day_demand": round(user_prediction, 2),
            "trend": forecast_trend,
            "user_growth": round(user_growth, 4),
            "confidence_score": confidence_score,

        },
        "industry": {
            "industry_growth": round(industry_growth, 4),
            "performance_gap": round(performance_gap, 4),

        },
        "market": market_data,
        "competitor": competitor_data,
        "diagnostics": diagnostic_data,
        "risk": risk_data
    }
