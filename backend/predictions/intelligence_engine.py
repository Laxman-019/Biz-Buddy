from predictions.model_manager import load_model
from predictions.forecasting_engine import train_user_model
from predictions.market_engine import calculate_market_metrics
from predictions.competitor_engine import analyze_competitor_position
from ml.benchmark_engine import calculate_industry_growth,load_global_industry_model

def generate_intelligence(user):
    model = load_model(user.id)

    if not model:
        model = train_user_model(user.id)
    
    forecast_trend="stable"
    user_prediction = 0
    industry_prediction = 0
    user_growth = 0

    if model:
        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)
        next_30 = forecast.tail(30)
        next_30["yhat"]=next_30["yhat"].clip(lower=0)
        user_prediction = float(next_30["yhat"].sum())
        forecast_trend = (
            "increasing"
            if forecast["trend"].iloc[-1]>forecast["trend"].iloc[-30] else "declining"
        )

        # stable growth calculation 
        historical_sum = forecast.iloc[:-30]["yhat"].sum()
        future_sum = next_30["yhat"].sum()

        if historical_sum>0:
            user_growth = (future_sum-historical_sum)/historical_sum
        else:
            user_growth = 0
    
    # industry model prediction
    industry_model = load_global_industry_model()
    if industry_model:
        future_industry = industry_model.make_future_dataframe(periods=30)
        industry_forecast = industry_model.predict(future_industry)

        industry_next_30 = industry_forecast.tail(30)
        industry_next_30["yhat"] = industry_next_30["yhat"].clip(lower=0)

        industry_prediction = float(industry_next_30["yhat"].sum())

    # hybrid model
    hybrid_prediction = (
        (user_prediction * 0.7) + (industry_prediction * 0.3)
    )

    industry_growth = float(calculate_industry_growth())
    performance_gap = user_growth - industry_growth

    market_data = calculate_market_metrics(user)
    competitor_data = analyze_competitor_position(user)

    return {
        "forecast":{
            "predicted_30_day_demand":round(hybrid_prediction,2),
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