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
def complete_business_intelligence(req):
    # Get complete business intelligence dashboard data
    try:
        user = req.user
        record_count = BusinessRecord.objects.filter(user=user).count()

        # Initialize response structure
        response_data = {
            'status':'success',
            'record_count':record_count,
            'required_records':60,
            'progress':min(100,int((record_count / 60) * 100)),
            'has_enough_data':record_count >= 60,
        }

        # Generate intelligence
        intelligence = generate_intelligence(user)

        # Check if we have enough data
        if intelligence.get('status') == "insufficient_data":
            response_data.update({
                'data_sufficient':False,
                'message':f"Need {intelligence.get('required_records',60)} records. You have {record_count}.",
                'intelligence':None,
                'strategies':{
                    'strengths':[],
                    'warnings':[f"Insufficient data ({record_count}/60 records). Add more records to unlock AI Insights."],
                    'recommended_strategies':['Continue tracking your daily business data to unlock personalized AI insights.']
                }
            })
        else:
            # Generate strategies
            strategies = generate_business_strategy(user)
            response_data.update({
                'data_sufficient':True,
                'intelligence':intelligence,
                'strategies':strategies,
                'market_share':intelligence.get('market',{}).get('market_share_percent',0),
                'risk_level':intelligence.get('risk',{}).get('risk_level','Unknown'),
                'forecast_trend':intelligence.get('forecast',{}).get('trend','stable')
            })
        
        return Response(response_data)
    
    except Exception as e:
        logger.error(f'Error Generating Intelligence: {str(e)}')

        return Response(
            {
                'status':'error',
                'message':str(e)
            },status=500
        )




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def intelligence_status(req):
    # Check if user has enough data for AI insights

    try:
        user = req.user
        record_count = BusinessRecord.objects.filter(user=user).count()
        required = 60

        # Try to generate intelligence to check status
        intelligence = generate_intelligence(user)

        if intelligence.get('status') == 'insufficient_data':
            status_type = "insufficient_data"

            message = f'Need {required} records. You have {record_count}.'
            remaining = intelligence.get('required_records',60) - record_count
        else:
            status_type = 'ready'
            message = 'AI insights are ready!'
            remaining = 0

        # Get recent activity
        recent_records = BusinessRecord.objects.filter(user=user).order_by('-date')[:5]
        recent_activity = []

        for record in recent_records:
            recent_activity.append({
                'id':record.id,
                'business_name':record.business_name,
                'date':record.date.strftime('%Y-%m-%d'),
                'sales':record.sales,
                'profit':record.profit
            })

        return Response({
            'status':status_type,
            'current_records':record_count,
            'required_records':required,
            'percentage': min(100,int((record_count / required) * 100)),
            'has_enough_data':record_count >= required,
            'remaining':max(0,required - record_count),
            'message':message,
            'recent_activity':recent_activity,
            'next_milestone':{
                'records_needed':max(0,required - record_count),
                'progress_to_next':min(100,int((record_count / required) * 100))
            }
        })
    except Exception as e:
        logger.error(f'Error Checking Intelligence status: {str(e)}')

        return Response(
            {
                'status':'error',
                'message':str(e)
            },status=500
        )
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def market_analysis(req):
    # Get market analysis for user's business
    try:
        user = req.user
        record_count = BusinessRecord.objects.filter(user=user).count()

        if record_count < 30:
            return Response({
                'status': 'insufficient_data',
                'message':'Need at least 30 records for market analysis',
                'current_records':record_count,
                'required_records':30
            })
        
        metrics = calculate_market_metrics(user)

        # Add business breakdown
        business_breakdown = BusinessRecord.objects.filter(user=user).values('business_name').annotate(
            total_sales = Sum('sales'),
            total_profit = Sum('profit'),
            record_count = Count('id'),
        ).order_by('-total_sales')

        breakdown = []
        for item in business_breakdown:
            breakdown.append({
                'business_name':item['business_name'],
                'total_sales':float(item['total_sales'] or 0),
                'total_profit':float(item['total_profit'] or 0),
                'record_count':item['record_count'],
                'contribution_percent':round((item['total_sales'] or 0) / metrics.get('user_sales',1) * 100, 2) if metrics.get('user_sales') else 0
            })
        
        return Response({
            'status':'success',
            'market_metrics':metrics,
            'business_breakdown':breakdown
        })
    
    except Exception as e:
        logger.error(f'Error in market analysis: {str(e)}')

        return Response(
            {
                'status':'error',
                'message':str(e)
            },status=500
        )
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def demand_forecast(req):
    # Get demand forcast

    try:
        user = req.user
        intelligence = generate_intelligence(user)

        if intelligence.get('status') == "insufficient_data":
            return Response({
                'status': 'insufficient_data',
                'message':intelligence.get('message','insufficient data for forecast'),
                'current_records':intelligence.get('available_records',0),
                'required_records':intelligence.get('required_records',60)
            })
        
        forecast_data = intelligence.get('forecast',{})

        # Get Historical data for context

        historical = BusinessRecord.objects.filter(user=user).order_by('-date')[:30]

        historical_data = []
        for record in historical:
            historical_data.append({
                'date':record.date.strftime('%Y-%m-%d'),
                'sales':record.sales,
                'profit':record.profit
            })
        
        return Response({
            'status':'success',
            'forecast':forecast_data,
            'historical':historical_data,
            'summary':{
                'trend':forecast_data.get('trend','stable'),
                'confidence':forecast_data.get('confidence_score',0),
                'predicted_30_day_demand':forecast_data.get('predicted_30_day_demand',0),
                'user_growth':forecast_data.get('user_growth',0)
            }
        })
    
    except Exception as e:
        logger.error(f'Error in demand forecast: {str(e)}')

        return Response(
            {
                'status':'error',
                'message':str(e)
            },status=500
        )
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def competitor_analysis(req):
    # Get competitor analysis for user's business 

    try:
        user = req.user
        record_count = BusinessRecord.objects.filter(user=user).count()

        if record_count < 10:
            return Response({
                'status': 'insufficient_data',
                'message':'Need at least 10 records for market analysis',
                'current_records':record_count,
                'required_records':10
            })
        
        result = analyze_competitor_position(user)

        # Get user's performace metrics

        user_metrics = BusinessRecord.objects.filter(user=user).aggregate(
            avg_sales = Avg('sales'),
            avg_profit = Avg('profit'),
            total_records = Count('id')
        )

        return Response({
            'status':'success',
            'competitor_analysis':result,
            'user_metrics':{
                'avg_sales':round(user_metrics['avg_sales'] or 0, 2),
                'avg_profit':round(user_metrics['avg_profit'] or 0, 2),
                'total_records':user_metrics['total_records']
            }
        })
    
    except Exception as e:
        logger.error(f'Error in competitor analysis: {str(e)}')

        return Response(
            {
                'status':'error',
                'message':str(e)
            },status=500
        )
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_strategy(req):

    # Get business strategy recommadation

    try:
        user = req.user
        record_count = BusinessRecord.objects.filter(user=user).count()

        if record_count < 30:
            return Response({
                'status': 'insufficient_data',
                'message':f'Need at least 30 records for strategy recommendation. You have {record_count}.',
                'current_records':record_count,
                'required_records':30,
                'strategies':{
                    'strengths':[],
                    'warnings':[f'Add {30 - record_count} more records to get personalized strategies.'],
                    'recommended_startgies':['Keep tracking your daily data.']
                }
            })
        
        result = generate_business_strategy(user)

        # Get top performing Bussiness

        top_business = BusinessRecord.objects.filter(user=user).values('business_name').annotate(
            total_profit = Sum('profit')
        ).order_by('-total_profit').first()

        return Response({
            'status':'success',
            'strategies':result,
            'top_business':top_business['business_name'] if top_business else None
        })
    
    except Exception as e:
        logger.error(f'Error in business strategy: {str(e)}')

        return Response(
            {
                'status':'error',
                'message':str(e)
            },status=500
        )
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_performance_summary(req):
    # Get a quick summary of business performance

    try:
        user = req.user
        records = BusinessRecord.objects.filter(user=user)

        total_records = records.count()

        if total_records == 0:
            return Response({
                'status':'no_data',
                'message':'No business records found',
                'summary':None
            })
        
        # Calculate key metrics
        total_sales = records.aggregate(total = Sum('sales'))['total'] or 0
        total_expenses = records.aggregate(total = Sum('expenses'))['total'] or 0
        total_profit = records.aggregate(total = Sum('profit'))['total'] or 0

        # Best & worst days
        best_day = records.order_by('-profit').first()
        worst_day = records.order_by('profit').first()

        # Monthly Comparison
        current_month = datetime.now().month
        current_month_records = records.filter(date__month = current_month)
        current_month_sales = current_month_records.aggregate(total = Sum('sales'))['total'] or 0

        last_month = current_month - 1 if current_month > 1 else 12
        last_month_records = records.filter(date__month=last_month)
        last_month_sales = last_month_records.aggregate(total=Sum('sales'))['total'] or 0


        month_over_month_growth = 0
        if last_month_sales > 0:
            month_over_month_growth = ((current_month_sales - last_month_sales) / last_month_sales) * 100

            return Response({
                'status':'success',
                'summary':{
                    'total_records':total_records,
                    'total_expenses':round(total_expenses,2),
                    'total_sales':round(total_sales,2),
                    'total_profit':round(total_profit,2),
                    'profit_margin':round((total_profit / total_sales * 100) if total_sales > 0 else 0,2),
                    'avg_daily_sales':round(total_sales / total_records if total_records > 0 else 0,2),
                    'best_performing_day':{
                        'date':best_day.date.strftime('%Y-%m-%d') if best_day else None,
                        'business':best_day.business_name if best_day else None,
                        'profit':best_day.profit if best_day else 0
                    } if best_day else None,

                    'worst_performing_day':{
                        'date':worst_day.date.strftime('%Y-%m-%d') if worst_day else None,
                        'business':worst_day.business_name if worst_day else None,
                        'profit':worst_day.profit if worst_day else 0
                    } if worst_day else None,
                    
                    'month_over_month_growth':round(month_over_month_growth,2)
                }
            })
        
    except Exception as e:
        logger.error(f'Error in performance summary: {str(e)}')

    return Response(
        {
            'status':'error',
            'message':str(e)
        },status=500
    )
