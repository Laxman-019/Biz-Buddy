from predictions.model_manager import load_model
from predictions.forecasting_engine import train_user_model
from predictions.market_engine import calculate_market_metrics
from predictions.competitor_engine import analyze_competitor_position
from predictions.diagnostic_engine import generate_diagnostics
from ml.benchmark_engine import calculate_industry_growth
from predictions.risk_engine import calculate_business_risk


def generate_intelligence(user):
    model = load_model(user.id)
    competitor_data = analyze_competitor_position(user)

    if not model:
        model = train_user_model(user.id)

    forecast_trend = "stable"
    user_prediction = 0
    user_growth = 0
    confidence_score = 0.5

    if model:
        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)

        next_30 = forecast.tail(30).copy()
        next_30["yhat"] = next_30["yhat"].clip(lower=0)
        user_prediction = float(next_30["yhat"].sum())

        # compare last 30 days vs next 30 days
        previous_30 = forecast.iloc[-60:-30]["yhat"].clip(lower=0).sum()

        if previous_30 > 0:
            user_growth = (user_prediction - previous_30) / previous_30
        else:
            user_growth = 0

        # Volatility based confidence score
        volatility = forecast["yhat"].std() / (forecast["yhat"].mean() + 1)
        confidence_score = max(0.3, min(1, 1 - volatility))

        forecast_trend = "increasing" if user_growth > 0 else "declining"

    industry_growth = float(calculate_industry_growth())
    performance_gap = user_growth - industry_growth

    market_data = calculate_market_metrics(user)
    competitor_data = analyze_competitor_position(user)

    # New Dignostics engine integration
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

    risk_data = calculate_business_risk(user,core_data)

    return {
        "forecast": {
            "predicted_30_day_demand": round(user_prediction, 2),
            "trend": forecast_trend,
            "user_growth": round(user_growth, 4),
            "confidence_score": round(confidence_score, 2),

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
