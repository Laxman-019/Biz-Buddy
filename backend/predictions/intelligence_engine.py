from predictions.model_manager import load_model
from predictions.forecasting_engine import train_user_model
from predictions.market_engine import calculate_market_metrics
from predictions.competitor_engine import analyze_competitor_position
from ml.benchmark_engine import calculate_industry_growth

def generate_intelligence(user):
    model = load_model(user.id)

    if not model:
        model = train_user_model(user.id)
    
    forecast_trend="stable"
    prediction_total = 0
    user_growth = 0

    if model:
        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)
        next_30 = forecast.tail(30)
        next_30["yhat"]=next_30["yhat"].clip(lower=0)
        prediction_total = float(next_30["yhat"].sum())
        forecast_trend = (
            "increasing"
            if forecast["trend"].iloc[-1]>forecast["trend"].iloc[-30] else "declining"
        )

        user_growth = float(next_30["yhat"].pct_change().mean())
    
    industry_growth = float(calculate_industry_growth())
    performance_gap = user_growth - industry_growth
    market_data = calculate_market_metrics(user)
    competitor_data = analyze_competitor_position(user)

    return {
        "forecast":{
            "predicted_30_day_demand":round(prediction_total,2),
            "trend":forecast_trend,
            "user_growth":round(user_growth,4),

        },
        "industry":{
            "industry_growth":round(industry_growth,4),
            "performance_gap": round(performance_gap,4),

        },
        "market":market_data,
        "competitor":competitor_data,

    }