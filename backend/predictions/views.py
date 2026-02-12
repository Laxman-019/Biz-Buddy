from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from predictions.model_manager import load_model
from predictions.forecasting_engine import train_user_model
from predictions.market_engine import calculate_market_metrics
from predictions.competitor_engine import analyze_competitor_position
from predictions.strategy_engine import generate_business_strategy
from ml.benchmark_engine import calculate_industry_growth


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def demand_forecast(request):

    user_id = request.user.id
    model = load_model(user_id)

    if not model:
        model = train_user_model(user_id)

        if not model:
            return Response({
                "message": "Not enough data to generate forecast. Please add more sales records."
            })

    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)

    next_30 = forecast.tail(30)
    total_predicted = next_30['yhat'].sum()

    trend = 'increasing' if forecast['trend'].iloc[-1] > forecast['trend'].iloc[-30] else 'declining'

    industry_growth = calculate_industry_growth()

    user_growth = next_30['yhat'].pct_change().mean()

    performance_gap = user_growth - industry_growth

    return Response({
        "predicted_30_day_demand": round(float(total_predicted), 2),
        "trend": trend,
        "industry_avg_growth": round(float(industry_growth), 4),
        "user_projected_growth": round(float(user_growth), 4),
        "performance_gap": round(float(performance_gap), 4)
    })



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def market_analysis(req):
    
    metrics = calculate_market_metrics(req.user)
    
    return Response(metrics)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def competitor_analysis(req):
    result = analyze_competitor_position(req.user)

    return Response(result)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_strategy(req):
    result = generate_business_strategy(req.user)

    return Response(result)