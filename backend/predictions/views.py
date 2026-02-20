from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from predictions.strategy_engine import generate_business_strategy
from predictions.intelligence_engine import generate_intelligence
from predictions.market_engine import calculate_market_metrics
from predictions.competitor_engine import analyze_competitor_position
from rest_framework import status
from businesses.models import BusinessRecord
from django.db.models import Sum,Avg,Count
from django.db.models.functions import TruncDay,TruncMonth
import logging
from datetime import datetime,timedelta

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_overview(request):

    # get overview data for the dashboard

    try:
        user = request.user
        records = BusinessRecord.objects.filter(user = user)

        # calculate basic stats
        total_records = records.count()
        total_sales = records.aggregate(total = Sum('sales'))["total"] or 0
        total_expenses = records.aggregate(total = Sum('expenses'))["total"] or 0
        total_profit = records.aggregate(total = Sum('profit'))["total"] or 0

        # get last 30 days record
        thirty_days_ago = datetime.now().date() - timedelta(days=30)
        recent_records = records.filter(date__gte = thirty_days_ago)
        recent_sales = recent_records.aaggregate(total = Sum('sales'))["total"] or 0
        recent_profit = recent_records.aaggregate(total = Sum('profit'))["total"] or 0

        # get unique business name
        business_names = records.values_list("business_name", flat=True).distinct()
        
        # monthly trend
        monthly_data = []
        monthly = records.annotate(
            month = TruncMonth("date")

        ).values("month").annotate(
            total_sales = Sum("sales"), 
            total_profit = Sum("profit"),

        ).order_by("month")

        for item in monthly:
            if item["month"]:
                monthly_data.append({
                    "month": item["month"].strftime("%Y-%m"),
                    "sales": float(item["total_sales"] or 0),
                    "profit": float(item["total_profit"] or 0)
                })

        response_data = {
            "status": "success",
            "overview": {
                "total_records":total_records,
                "total_sales": round(total_sales,2),
                "total_expenses": round(total_expenses,2),
                "total_profit": round(total_profit,2),
                "profit_margin": round((total_profit / total_sales * 100) if total_sales > 0 else 0,2),
                "recent_sales_30d": round(recent_sales,2),
                "recent_profit_30d" : round(recent_profit,2),
                "business_count": business_names.count(),
                "avg_daily_sales": round(total_sales / total_records if total_records > 0 else 0,2)
            },
            "monthly_trend": monthly_data,
            "business_names": list(business_names),

        }
        return Response(response_data)
    
    except Exception as e:
        logger.error(f"error in dashboard overview: {str(e)}")
        return Response({
            "status":"error",
            "message": str(e)
        },status=500)

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