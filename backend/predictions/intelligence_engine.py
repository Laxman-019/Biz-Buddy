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
    user_prediction = 0
    user_growth = 0

    if model:
        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)

        next_30 = forecast.tail(30).copy()
        next_30["yhat"]=next_30["yhat"].clip(lower=0)
        user_prediction = float(next_30["yhat"].sum())

        # compare last 30 days vs next 30 days
        previous_30 = forecast.iloc[-60:-30]["yhat"].clip(lower = 0).sum()

        if previous_30 > 0:
            user_growth = (user_prediction - previous_30)/previous_30
        else:
            user_growth = 0

        forecast_trend = (
            "increasing"
            if next_30["yhat"].mean() > (previous_30/30 if previous_30 else 0) else "declining" 
        )

    industry_growth = float(calculate_industry_growth())
    performance_gap = user_growth - industry_growth

    market_data = calculate_market_metrics(user)
    competitor_data = analyze_competitor_position(user)

    return {
        "forecast":{
            "predicted_30_day_demand":round(user_prediction,2),
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