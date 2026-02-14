from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from predictions.market_engine import calculate_market_metrics
from predictions.competitor_engine import analyze_competitor_position
from predictions.strategy_engine import generate_business_strategy
from predictions.intelligence_engine import generate_intelligence


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def demand_forecast(request):

    data = generate_intelligence(request.user)
    return Response(data)



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