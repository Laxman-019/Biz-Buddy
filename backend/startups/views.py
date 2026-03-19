from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from startups.models import *
from startups.serializers import *
from startups.ai_analyzer import analyze_idea
from startups.market_analyzer import analyze_market


def startup_only(func):
    def wrapper(request, *args, **kwargs):
        if request.user.business_type != 'startup':
            return Response(
                {'error': 'This feature is only available for startup accounts.'},
                status=403
            )
        return func(request, *args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

# Idea Validation
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@startup_only
def idea_list(request):
    ideas = IdeaValidation.objects.filter(user=request.user)
    return Response(IdeaValidationSerializer(ideas, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@startup_only
def idea_submit(request):
    serializer = IdeaSubmitSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    idea = IdeaValidation.objects.create(
        user = request.user,
        idea_title = serializer.validated_data['idea_title'],
        idea_description = serializer.validated_data['idea_description'],
        status = 'analyzing',
    )

    try:
        result = analyze_idea(
            idea_title = idea.idea_title,
            idea_description = idea.idea_description,
            user = request.user,
        )

        idea.status = 'done'
        idea.raw_ai_response = result['raw']
        idea.overall_score = result['overall_score']
        idea.verdict = result['verdict']
        idea.verdict_summary = result['verdict_summary']
        idea.score_market_demand = result['score_market_demand']
        idea.score_competition = result['score_competition']
        idea.score_profit_potential = result['score_profit_potential']
        idea.score_scalability = result['score_scalability']
        idea.score_entry_barriers = result['score_entry_barriers']
        idea.score_founder_fit = result['score_founder_fit']
        idea.score_timing_factor = result['score_timing_factor']
        idea.score_funding_readiness = result['score_funding_readiness']
        idea.market_demand_analysis = result['market_demand_analysis']
        idea.competition_analysis = result['competition_analysis']
        idea.profit_analysis = result['profit_analysis']
        idea.scalability_analysis = result['scalability_analysis']
        idea.entry_barriers_analysis = result['entry_barriers_analysis']
        idea.founder_fit_analysis = result['founder_fit_analysis']
        idea.timing_analysis = result['timing_analysis']
        idea.funding_analysis = result['funding_analysis']
        idea.key_risks = result['key_risks']
        idea.opportunities = result['opportunities']
        idea.next_steps = result['next_steps']
        idea.save()

    except Exception as e:
        idea.status = 'failed'
        idea.error_message = str(e)
        idea.save()
        
        return Response(
            {'error': 'Analysis failed. Please try again.', 'detail': str(e)},
            status=500
        )

    return Response(IdeaValidationSerializer(idea).data, status=201)



@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
@startup_only
def idea_detail(request, idea_id):
    try:
        idea = IdeaValidation.objects.get(id=idea_id, user=request.user)
    except IdeaValidation.DoesNotExist:
        return Response({'error': 'Not found.'}, status=404)

    if request.method == 'DELETE':
        idea.delete()
        return Response(status=204)

    return Response(IdeaValidationSerializer(idea).data)



# Market Intelligence
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@startup_only
def market_list(request):
    reports = MarketIntelligence.objects.filter(user=request.user)
    return Response(MarketIntelligenceSerializer(reports, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@startup_only
def market_submit(request):
    serializer = MarketSubmitSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    d = serializer.validated_data

    report = MarketIntelligence.objects.create(
        user = request.user,
        product_name = d['product_name'],
        industry = d['industry'],
        target_region = d['target_region'],
        customer_type = d['customer_type'],
        description = d['description'],
        status = 'analyzing',
    )

    try:
        result = analyze_market(
            product_name  = report.product_name,
            industry = report.industry,
            target_region = report.target_region,
            customer_type = report.customer_type,
            description = report.description,
            user = request.user,
        )

        report.status = 'done'
        report.raw_ai_response = result['raw']
        report.market_summary = result['market_summary']
        report.key_insights = result['key_insights']
        report.tam_value = result['tam_value']
        report.tam_explanation = result['tam_explanation']
        report.sam_value = result['sam_value']
        report.sam_explanation = result['sam_explanation']
        report.som_value = result['som_value']
        report.som_explanation = result['som_explanation']
        report.sizing_methodology = result['sizing_methodology']
        report.market_growth_rate = result['market_growth_rate']
        report.market_direction = result['market_direction']
        report.trend_summary = result['trend_summary']
        report.tailwinds = result['tailwinds']
        report.headwinds = result['headwinds']
        report.tech_shifts = result['tech_shifts']
        report.regulatory_factors = result['regulatory_factors']
        report.consumer_shifts = result['consumer_shifts']
        report.personas = result['personas']
        report.save()

    except Exception as e:
        report.status = 'failed'
        report.error_message = str(e)
        report.save()
        return Response(
            {'error': 'Analysis failed.', 'detail': str(e)},
            status=500
        )

    return Response(
        MarketIntelligenceSerializer(report).data,
        status=201
    )


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
@startup_only
def market_detail(request, report_id):
    try:
        report = MarketIntelligence.objects.get(id=report_id, user=request.user)
    except MarketIntelligence.DoesNotExist:
        return Response({'error': 'Not found.'}, status=404)

    if request.method == 'DELETE':
        report.delete()
        return Response(status=204)

    return Response(MarketIntelligenceSerializer(report).data)