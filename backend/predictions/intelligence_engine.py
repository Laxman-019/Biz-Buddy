from predictions.forecasting_engine import train_user_model
from predictions.market_engine import calculate_market_metrics
from predictions.competitor_engine import analyze_competitor_position
from predictions.diagnostic_engine import generate_diagnostics
from ml.benchmark_engine import calculate_industry_growth
from predictions.risk_engine import calculate_business_risk


def generate_intelligence(user):

    # Forecast
    forecast_result = train_user_model(user.id)

    if forecast_result["status"] == "insufficient_data":
        market_data = calculate_market_metrics(user)
        competitor_data = analyze_competitor_position(user)

    user_growth = forecast_result.get("trend_value", 0)
    forecast_trend = forecast_result.get("trend", "stable")
    confidence_score = forecast_result.get("confidence", 0)
    user_prediction = forecast_result.get("forecast_total", 0)

    # Industry Comparison
    industry_growth = float(calculate_industry_growth())
    performance_gap = user_growth - industry_growth

    # Market + Competitor
    market_data = calculate_market_metrics(user)
    competitor_data = analyze_competitor_position(user)

    # Diagnostics — trend is now passed correctly
    diagnostic_data = generate_diagnostics(user, {
        "forecast": {
            "user_growth": user_growth,
            "trend": forecast_trend
        },
        "industry": {
            "performance_gap": performance_gap
        }
    })

    core_data = {
        "forecast": {
            "user_growth": user_growth,
            "predicted_30_day_demand": user_prediction,
            "trend": forecast_trend,
            "confidence_score": confidence_score
        },
        "industry": {
            "performance_gap": performance_gap
        },
        "market": market_data,
        "competitor": competitor_data
    }

    # Risk
    risk_data = calculate_business_risk(user, core_data)

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
        "risk": risk_data,
        "status": "success",
        "required_records": forecast_result.get("required", 14),
        "available_records": forecast_result.get("available", 0),
        "market": market_data,
        "competitor": competitor_data
    }