from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from predictions.strategy_engine import generate_business_strategy
from predictions.intelligence_engine import generate_intelligence
from predictions.market_engine import calculate_market_metrics
from predictions.competitor_engine import analyze_competitor_position
from predictions.gemini_engine import (
    generate_gemini_insights,
    generate_gemini_diagnostic_interpretation, 
    generate_gemini_strategy,
)
from rest_framework import status
from businesses.models import BusinessRecord
from django.db.models import Sum, Avg, Count, Q
from django.db.models.functions import TruncDay, TruncMonth, TruncWeek
from django.core.cache import cache
from django.utils import timezone
import logging
from datetime import datetime, timedelta
from functools import wraps

logger = logging.getLogger(__name__)

# Cache decorator for expensive operations
def cache_response(timeout=300):  # 5 minutes default
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Generate cache key based on user and endpoint
            user_id = request.user.id if request.user.is_authenticated else 'anonymous'
            cache_key = f"{view_func.__name__}_{user_id}_{request.get_full_path()}"
            
            # Try to get from cache
            cached_response = cache.get(cache_key)
            if cached_response is not None:
                # Reconstruct the Response object from cached data
                return Response(cached_response.get('data'), status=cached_response.get('status', 200))
            
            # Execute view
            response = view_func(request, *args, **kwargs)
            
            # Cache successful responses only
            if response.status_code == 200 and hasattr(response, 'data'):
                # Store the serializable data, not the Response object
                cache_data = {
                    'data': response.data,
                    'status': response.status_code
                }
                cache.set(cache_key, cache_data, timeout)
            
            return response
        return wrapper
    return decorator


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@cache_response(timeout=300)  # Cache for 5 minutes
def dashboard_overview(request):
    try:
        user = request.user
        records = BusinessRecord.objects.filter(user=user)

        total_records = records.count()
        total_sales = records.aggregate(total=Sum('sales'))["total"] or 0
        total_expenses = records.aggregate(total=Sum('expenses'))["total"] or 0
        total_profit = records.aggregate(total=Sum('profit'))["total"] or 0

        thirty_days_ago = datetime.now().date() - timedelta(days=30)
        recent_records = records.filter(date__gte=thirty_days_ago)
        recent_sales = recent_records.aggregate(total=Sum('sales'))["total"] or 0
        recent_profit = recent_records.aggregate(total=Sum('profit'))["total"] or 0

        business_names = records.values_list("business_name", flat=True).distinct()

        # Monthly data
        monthly_data = []
        monthly = records.annotate(
            month=TruncMonth("date")
        ).values("month").annotate(
            total_sales=Sum("sales"),
            total_profit=Sum("profit"),
        ).order_by("month")

        for item in monthly:
            if item["month"]:
                monthly_data.append({
                    "month": item["month"].strftime("%Y-%m"),
                    "sales": float(item["total_sales"] or 0),
                    "profit": float(item["total_profit"] or 0)
                })

        # Weekly data for trend
        weekly_data = []
        weekly = records.annotate(
            week=TruncWeek("date")
        ).values("week").annotate(
            total_sales=Sum("sales"),
            total_profit=Sum("profit"),
        ).order_by("-week")[:8]  # Last 8 weeks

        for item in weekly:
            if item["week"]:
                weekly_data.append({
                    "week_start": item["week"].strftime("%Y-%m-%d"),
                    "sales": float(item["total_sales"] or 0),
                    "profit": float(item["total_profit"] or 0)
                })

        # Calculate growth metrics
        profit_margin = round((total_profit / total_sales * 100) if total_sales > 0 else 0, 2)
        
        # Month-over-month growth
        current_month = datetime.now().month
        current_year = datetime.now().year
        current_month_sales = records.filter(date__month=current_month, date__year=current_year).aggregate(total=Sum('sales'))['total'] or 0
        last_month = current_month - 1 if current_month > 1 else 12
        last_month_year = current_year if current_month > 1 else current_year - 1
        last_month_sales = records.filter(date__month=last_month, date__year=last_month_year).aggregate(total=Sum('sales'))['total'] or 0
        mom_growth = round(((current_month_sales - last_month_sales) / last_month_sales * 100) if last_month_sales > 0 else 0, 2)

        return Response({
            "status": "success",
            "overview": {
                "total_records": total_records,
                "total_sales": round(total_sales, 2),
                "total_expenses": round(total_expenses, 2),
                "total_profit": round(total_profit, 2),
                "profit_margin": profit_margin,
                "recent_sales_30d": round(recent_sales, 2),
                "recent_profit_30d": round(recent_profit, 2),
                "business_count": business_names.count(),
                "avg_daily_sales": round(total_sales / total_records if total_records > 0 else 0, 2),
                "mom_growth": mom_growth
            },
            "monthly_trend": monthly_data,
            "weekly_trend": weekly_data,
            "business_names": list(business_names),
        })

    except Exception as e:
        logger.error(f"Error in dashboard overview: {str(e)}", exc_info=True)
        return Response({"status": "error", "message": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@cache_response(timeout=300)  # Cache for 5 minutes
def complete_business_intelligence(request):
    try:
        user = request.user
        record_count = BusinessRecord.objects.filter(user=user).count()

        response_data = {
            'status': 'success',
            'record_count': record_count,
            'required_records': 14,
            'progress': min(100, int((record_count / 14) * 100)),
            'has_enough_data': record_count >= 14,
        }

        # Try to get intelligence from cache first
        cache_key = f"intelligence_{user.id}"
        intelligence = cache.get(cache_key)
        
        if intelligence is None:
            intelligence = generate_intelligence(user)
            # Cache for 10 minutes if data is sufficient
            if intelligence.get('status') != "insufficient_data":
                cache.set(cache_key, intelligence, 600)

        if intelligence.get('status') == "insufficient_data":
            response_data.update({
                'data_sufficient': False,
                'message': f"Need {intelligence.get('required_records', 14)} records. You have {record_count}.",
                'intelligence': None,
                'strategies': {
                    'strengths': [],
                    'warnings': [f"Insufficient data ({record_count}/14 records). Add more records to unlock AI Insights."],
                    'recommended_strategies': ['Continue tracking your daily business data to unlock personalized AI insights.']
                }
            })
        else:
            # Generate strategies with caching
            strategies_cache_key = f"strategies_{user.id}"
            strategies = cache.get(strategies_cache_key)
            if strategies is None:
                strategies = generate_business_strategy(user)
                cache.set(strategies_cache_key, strategies, 600)

            # Gemini enhancements - run with timeout protection
            import concurrent.futures
            
            def safe_gemini_call(func, user, intelligence):
                try:
                    return func(user, intelligence)
                except Exception as e:
                    logger.error(f"Gemini call failed for {func.__name__}: {str(e)}")
                    return {"status": "error", "message": str(e)}
            
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
                diagnostic_future = executor.submit(safe_gemini_call, generate_gemini_diagnostic_interpretation, user, intelligence)
                strategy_future = executor.submit(safe_gemini_call, generate_gemini_strategy, user, intelligence)
                
                gemini_diagnostic = diagnostic_future.result(timeout=15)
                gemini_strategy = strategy_future.result(timeout=15)

            response_data.update({
                'data_sufficient': True,
                'intelligence': intelligence,
                'strategies': strategies,
                'gemini_diagnostic': gemini_diagnostic,
                'gemini_strategy': gemini_strategy,
                'market_share': intelligence.get('market', {}).get('market_share_percent', 0),
                'risk_level': intelligence.get('risk', {}).get('risk_level', 'Unknown'),
                'forecast_trend': intelligence.get('forecast', {}).get('trend', 'stable')
            })

        return Response(response_data)

    except concurrent.futures.TimeoutError:
        logger.error("Gemini API call timed out")
        return Response({
            'status': 'partial',
            'message': 'AI insights temporarily unavailable, showing rule-based analysis',
            'data_sufficient': True,
            'intelligence': intelligence if 'intelligence' in locals() else None,
            'strategies': strategies if 'strategies' in locals() else None,
            'gemini_diagnostic': {'status': 'error', 'message': 'AI service timeout'},
            'gemini_strategy': {'status': 'error', 'message': 'AI service timeout'}
        })
    except Exception as e:
        logger.error(f'Error Generating Intelligence: {str(e)}', exc_info=True)
        return Response({'status': 'error', 'message': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def intelligence_status(request):
    try:
        user = request.user
        record_count = BusinessRecord.objects.filter(user=user).count()
        required = 14

        intelligence = generate_intelligence(user)

        if intelligence.get('status') == 'insufficient_data':
            status_type = "insufficient_data"
            message = f'Need {required} records. You have {record_count}.'
        else:
            status_type = 'ready'
            message = 'AI insights are ready!'

        recent_records = BusinessRecord.objects.filter(user=user).order_by('-date')[:5]
        recent_activity = []
        for record in recent_records:
            recent_activity.append({
                'id': record.id,
                'business_name': record.business_name,
                'date': record.date.strftime('%Y-%m-%d'),
                'sales': float(record.sales),
                'profit': float(record.profit)
            })

        # Calculate days needed based on average submission rate
        last_7_days = BusinessRecord.objects.filter(
            user=user, 
            date__gte=datetime.now().date() - timedelta(days=7)
        ).count()
        avg_daily_rate = last_7_days / 7 if last_7_days > 0 else 0
        days_needed = int((required - record_count) / avg_daily_rate) if avg_daily_rate > 0 else required - record_count

        return Response({
            'status': status_type,
            'current_records': record_count,
            'required_records': required,
            'percentage': min(100, int((record_count / required) * 100)),
            'has_enough_data': record_count >= required,
            'remaining': max(0, required - record_count),
            'estimated_days_needed': max(0, days_needed),
            'message': message,
            'recent_activity': recent_activity,
            'next_milestone': {
                'records_needed': max(0, required - record_count),
                'progress_to_next': min(100, int((record_count / required) * 100))
            }
        })

    except Exception as e:
        logger.error(f'Error Checking Intelligence status: {str(e)}', exc_info=True)
        return Response({'status': 'error', 'message': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@cache_response(timeout=600)  # Cache for 10 minutes
def market_analysis(request):
    try:
        user = request.user
        record_count = BusinessRecord.objects.filter(user=user).count()

        if record_count < 30:
            return Response({
                'status': 'insufficient_data',
                'message': 'Need at least 30 records for market analysis',
                'current_records': record_count,
                'required_records': 30,
                'remaining_records': 30 - record_count
            })

        metrics = calculate_market_metrics(user)

        # REMOVED: category field - using business_name instead
        business_breakdown = BusinessRecord.objects.filter(user=user).values('business_name').annotate(
            total_sales=Sum('sales'),
            total_profit=Sum('profit'),
            record_count=Count('id'),
            avg_profit_margin=Sum('profit') / Sum('sales') * 100 if Sum('sales') > 0 else 0
        ).order_by('-total_sales')

        breakdown = []
        for item in business_breakdown:
            breakdown.append({
                'business_name': item['business_name'],
                'total_sales': float(item['total_sales'] or 0),
                'total_profit': float(item['total_profit'] or 0),
                'record_count': item['record_count'],
                'avg_profit_margin': round(float(item['avg_profit_margin'] or 0), 2),
                'contribution_percent': round(
                    (item['total_sales'] or 0) / metrics.get('user_sales', 1) * 100, 2
                ) if metrics.get('user_sales') else 0
            })

        # Market position analysis
        market_position = "Leader" if metrics.get('user_sales', 0) > metrics.get('market_avg_sales', 0) * 1.5 else \
                         "Competitor" if metrics.get('user_sales', 0) > metrics.get('market_avg_sales', 0) else \
                         "Challenger"

        return Response({
            'status': 'success',
            'market_metrics': metrics,
            'business_breakdown': breakdown,
            'market_position': market_position,
            'analysis_date': datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f'Error in market analysis: {str(e)}', exc_info=True)
        return Response({'status': 'error', 'message': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def demand_forecast(request):
    try:
        user = request.user
        intelligence = generate_intelligence(user)

        if intelligence.get('status') == "insufficient_data":
            return Response({
                'status': 'insufficient_data',
                'message': intelligence.get('message', 'Insufficient data for forecast'),
                'current_records': intelligence.get('available_records', 0),
                'required_records': intelligence.get('required_records', 60),
                'confidence': 'low'
            })

        forecast_data = intelligence.get('forecast', {})

        historical = BusinessRecord.objects.filter(user=user).order_by('-date')[:30]
        historical_data = []
        for record in historical:
            historical_data.append({
                'date': record.date.strftime('%Y-%m-%d'),
                'sales': float(record.sales),
                'profit': float(record.profit)
            })

        # Calculate forecast confidence based on data consistency
        recent_variance = 0
        if len(historical_data) >= 7:
            recent_sales = [d['sales'] for d in historical_data[:7]]
            avg = sum(recent_sales) / len(recent_sales)
            variance = sum((s - avg) ** 2 for s in recent_sales) / len(recent_sales)
            recent_variance = round(variance / avg * 100, 2) if avg > 0 else 100

        confidence_level = "high" if recent_variance < 20 else "medium" if recent_variance < 50 else "low"

        # Helper function for recommendations
        def get_forecast_recommendation(trend):
            recommendations = {
                'growing': 'Increase inventory and marketing spend to capture demand',
                'stable': 'Maintain current operations and focus on efficiency',
                'declining': 'Review pricing strategy and explore new markets',
                'volatile': 'Build cash reserves and maintain flexible operations'
            }
            return recommendations.get(trend, 'Monitor market conditions closely')

        return Response({
            'status': 'success',
            'forecast': forecast_data,
            'historical': historical_data,
            'summary': {
                'trend': forecast_data.get('trend', 'stable'),
                'confidence': forecast_data.get('confidence_score', 0),
                'confidence_level': confidence_level,
                'predicted_30_day_demand': forecast_data.get('predicted_30_day_demand', 0),
                'user_growth': forecast_data.get('user_growth', 0),
                'recommended_action': get_forecast_recommendation(forecast_data.get('trend', 'stable'))
            }
        })

    except Exception as e:
        logger.error(f'Error in demand forecast: {str(e)}', exc_info=True)
        return Response({'status': 'error', 'message': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@cache_response(timeout=600)
def competitor_analysis(request):
    try:
        user = request.user
        record_count = BusinessRecord.objects.filter(user=user).count()

        if record_count < 10:
            return Response({
                'status': 'insufficient_data',
                'message': 'Need at least 10 records for competitor analysis',
                'current_records': record_count,
                'required_records': 10
            })

        result = analyze_competitor_position(user)

        user_metrics = BusinessRecord.objects.filter(user=user).aggregate(
            avg_sales=Avg('sales'),
            avg_profit=Avg('profit'),
            total_records=Count('id'),
            total_sales=Sum('sales')
        )

        # Calculate competitive advantage
        competitive_advantage = "Strong" if user_metrics['avg_sales'] and user_metrics['avg_sales'] > result.get('market_avg', 0) * 1.2 else \
                               "Moderate" if user_metrics['avg_sales'] and user_metrics['avg_sales'] > result.get('market_avg', 0) else \
                               "Needs Improvement"

        # Helper function for competitive recommendations
        def get_competitive_recommendations(cluster):
            recommendations = {
                'market_leader': 'Defend position through innovation and customer loyalty programs',
                'growth_stage': 'Aggressively acquire market share and expand distribution',
                'challenger': 'Differentiate through unique value propositions and niche targeting',
                'struggling': 'Re-evaluate business model and consider strategic pivot'
            }
            return recommendations.get(cluster, 'Focus on building competitive moat')

        return Response({
            'status': 'success',
            'competitor_analysis': result,
            'user_metrics': {
                'avg_sales': round(user_metrics['avg_sales'] or 0, 2),
                'avg_profit': round(user_metrics['avg_profit'] or 0, 2),
                'total_records': user_metrics['total_records'],
                'total_sales': round(user_metrics['total_sales'] or 0, 2)
            },
            'competitive_advantage': competitive_advantage,
            'recommendations': get_competitive_recommendations(result.get('user_cluster', 'Unknown'))
        })

    except Exception as e:
        logger.error(f'Error in competitor analysis: {str(e)}', exc_info=True)
        return Response({'status': 'error', 'message': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_strategy(request):
    try:
        user = request.user
        record_count = BusinessRecord.objects.filter(user=user).count()

        if record_count < 30:
            return Response({
                'status': 'insufficient_data',
                'message': f'Need at least 30 records for strategy recommendations. You have {record_count}.',
                'current_records': record_count,
                'required_records': 30,
                'strategies': {
                    'strengths': [],
                    'warnings': [f'Add {30 - record_count} more records to get personalized strategies.'],
                    'recommended_strategies': ['Keep tracking your daily data.']
                }
            })

        # Try to get from cache
        cache_key = f"business_strategy_{user.id}"
        result = cache.get(cache_key)
        
        if result is None:
            result = generate_business_strategy(user)
            cache.set(cache_key, result, 600)  # Cache for 10 minutes

        top_business = BusinessRecord.objects.filter(user=user).values('business_name').annotate(
            total_profit=Sum('profit')
        ).order_by('-total_profit').first()

        return Response({
            'status': 'success',
            'strategies': result,
            'top_business': top_business['business_name'] if top_business else None,
            'analysis_timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f'Error in business strategy: {str(e)}', exc_info=True)
        return Response({'status': 'error', 'message': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_performance_summary(request):
    try:
        user = request.user
        records = BusinessRecord.objects.filter(user=user)
        total_records = records.count()

        if total_records == 0:
            return Response({
                'status': 'no_data',
                'message': 'No business records found',
                'summary': None
            })

        total_sales = records.aggregate(total=Sum('sales'))['total'] or 0
        total_expenses = records.aggregate(total=Sum('expenses'))['total'] or 0
        total_profit = records.aggregate(total=Sum('profit'))['total'] or 0

        best_day = records.order_by('-profit').first()
        worst_day = records.order_by('profit').first()

        # Month-over-month calculations
        current_month = datetime.now().month
        current_year = datetime.now().year
        current_month_records = records.filter(date__month=current_month, date__year=current_year)
        current_month_sales = current_month_records.aggregate(total=Sum('sales'))['total'] or 0

        last_month = current_month - 1 if current_month > 1 else 12
        last_month_year = current_year if current_month > 1 else current_year - 1
        last_month_records = records.filter(date__month=last_month, date__year=last_month_year)
        last_month_sales = last_month_records.aggregate(total=Sum('sales'))['total'] or 0

        month_over_month_growth = 0
        if last_month_sales > 0:
            month_over_month_growth = ((current_month_sales - last_month_sales) / last_month_sales) * 100

        # Best performing business
        top_business = records.values('business_name').annotate(
            total_profit=Sum('profit')
        ).order_by('-total_profit').first()

        # Helper function for performance rating
        def get_performance_rating(profit_margin, growth):
            if profit_margin > 0.2 and growth > 10:
                return "Excellent"
            elif profit_margin > 0.15 and growth > 5:
                return "Good"
            elif profit_margin > 0.1 and growth > 0:
                return "Average"
            elif profit_margin > 0 or growth > 0:
                return "Needs Improvement"
            else:
                return "Critical"

        profit_margin_ratio = total_profit / total_sales if total_sales > 0 else 0

        return Response({
            'status': 'success',
            'summary': {
                'total_records': total_records,
                'total_expenses': round(total_expenses, 2),
                'total_sales': round(total_sales, 2),
                'total_profit': round(total_profit, 2),
                'profit_margin': round((total_profit / total_sales * 100) if total_sales > 0 else 0, 2),
                'avg_daily_sales': round(total_sales / total_records if total_records > 0 else 0, 2),
                'best_performing_day': {
                    'date': best_day.date.strftime('%Y-%m-%d') if best_day else None,
                    'business': best_day.business_name if best_day else None,
                    'profit': float(best_day.profit) if best_day else 0
                } if best_day else None,
                'worst_performing_day': {
                    'date': worst_day.date.strftime('%Y-%m-%d') if worst_day else None,
                    'business': worst_day.business_name if worst_day else None,
                    'profit': float(worst_day.profit) if worst_day else 0
                } if worst_day else None,
                'month_over_month_growth': round(month_over_month_growth, 2),
                'top_business': top_business['business_name'] if top_business else None,
                'performance_rating': get_performance_rating(profit_margin_ratio, month_over_month_growth)
            }
        })

    except Exception as e:
        logger.error(f'Error in performance summary: {str(e)}', exc_info=True)
        return Response({'status': 'error', 'message': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ai_recommendations(request):
    try:
        intelligence_data = generate_intelligence(request.user)

        if intelligence_data.get("status") == "insufficient_data":
            return Response({
                "status": "insufficient_data",
                "message": "Add at least 14 days of records to activate AI recommendations.",
                "required": intelligence_data.get("required_records", 14),
                "available": intelligence_data.get("available_records", 0)
            }, status=200)

        strategy_data = generate_business_strategy(request.user)

        # Try Gemini with timeout
        try:
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(generate_gemini_insights, request.user, intelligence_data)
                gemini_data = future.result(timeout=10)
        except concurrent.futures.TimeoutError:
            gemini_data = {"status": "error", "message": "AI service timeout"}
            logger.warning("Gemini insights timeout in ai_recommendations")

        # Add priority-based recommendations
        priority_recommendations = []
        risk_level = intelligence_data.get('risk', {}).get('risk_level', '')
        
        if risk_level == 'high' or risk_level == 'critical':
            priority_recommendations.append({
                "priority": "URGENT",
                "action": "Address high-risk factors immediately",
                "details": intelligence_data.get('risk', {}).get('risk_factors', [])
            })

        return Response({
            "status": "success",
            "strategy": strategy_data,
            "gemini_analysis": gemini_data,
            "intelligence": intelligence_data,
            "priority_recommendations": priority_recommendations,
            "generated_at": datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Error in ai_recommendations: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=500)


# New endpoint for clearing cache (admin only)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clear_cache(request):
    """Clear cached data for the user (useful after data updates)"""
    try:
        if not request.user.is_staff:
            return Response({"status": "error", "message": "Admin access required"}, status=403)
        
        # Note: Django's cache doesn't have delete_pattern by default
        # You may need to use cache.clear() or implement a custom solution
        cache.clear()
        
        return Response({"status": "success", "message": "Cache cleared successfully"})
    except Exception as e:
        logger.error(f"Error clearing cache: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=500)