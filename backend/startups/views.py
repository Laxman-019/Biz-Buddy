from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from startups.models import *
from startups.serializers import *
from startups.ai_analyzer import analyze_idea
from startups.market_analyzer import analyze_market
from startups.business_analyzer import analyze_business_model
from startups.mvp_analyzer import analyze_mvp
from startups.financials_analyzer import analyze_financials
from startups.investor_analyzer import analyze_investor_readiness
from startups.gtm_analyzer import analyze_gtm
from startups.kpi_analyzer import analyze_kpis
from startups.team_analyzer import analyze_team
from startups.risk_analyzer import analyze_risks


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
    reports = MarketIntelligence.objects.filter(user=request.user).order_by('-created_at')
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



# Business models
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@startup_only
def business_model_list(req):
    models_qs = BusinessModel.objects.filter(user=req.user)
    return Response(BusinessModelSerializer(models_qs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@startup_only
def ideas_for_dropdown(req):
    ideas = IdeaValidation.objects.filter(
        user=req.user, status__in=['active', 'done']
    ).values('id', 'idea_title', 'overall_score', 'verdict')
    return Response(list(ideas))



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@startup_only
def business_model_submit(request):
    serializer = BusinessModelSubmitSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    d = serializer.validated_data

    # Validate idea belongs to user
    try:
        idea = IdeaValidation.objects.get(id=d['idea_id'], user=request.user)
    except IdeaValidation.DoesNotExist:
        return Response({'error': 'Idea not found.'}, status=404)

    bm = BusinessModel.objects.create(
        user = request.user,
        idea = idea,
        revenue_model = d['revenue_model'],
        price_per_customer = d['price_per_customer'],
        estimated_cac = d['estimated_cac'],
        additional_context = d.get('additional_context', ''),
        status = 'analyzing',
    )

    try:
        result = analyze_business_model(
            idea = idea,
            revenue_model = d['revenue_model'],
            price_per_customer = d['price_per_customer'],
            estimated_cac = d['estimated_cac'],
            additional_context = d.get('additional_context', ''),
            user = request.user,
        )

        bm.status = 'done'
        bm.raw_ai_response = result['raw']
        bm.overall_summary = result['overall_summary']
        bm.business_model_score = result['business_model_score']
        bm.overall_verdict = result['overall_verdict']
        bm.recommendations = result['recommendations']
        bm.risks = result['risks']
        bm.canvas_problem = result['canvas_problem']
        bm.canvas_solution = result['canvas_solution']
        bm.canvas_uvp = result['canvas_uvp']
        bm.canvas_unfair_advantage = result['canvas_unfair_advantage']
        bm.canvas_customer_segments = result['canvas_customer_segments']
        bm.canvas_channels = result['canvas_channels']
        bm.canvas_revenue_streams = result['canvas_revenue_streams']
        bm.canvas_cost_structure = result['canvas_cost_structure']
        bm.canvas_key_metrics = result['canvas_key_metrics']
        bm.revenue_model_analysis = result['revenue_model_analysis']
        bm.revenue_model_recommended = result['revenue_model_recommended']
        bm.revenue_model_reasoning = result['revenue_model_reasoning']
        bm.pricing_recommendation = result['pricing_recommendation']
        bm.ltv_estimate = result['ltv_estimate']
        bm.ltv_explanation = result['ltv_explanation']
        bm.cac_analysis = result['cac_analysis']
        bm.ltv_cac_ratio = result['ltv_cac_ratio']
        bm.ltv_cac_verdict = result['ltv_cac_verdict']
        bm.payback_period_months = result['payback_period_months']
        bm.payback_verdict = result['payback_verdict']
        bm.contribution_margin = result['contribution_margin']
        bm.unit_economics_score = result['unit_economics_score']
        bm.save()

    except Exception as e:
        bm.status = 'failed'
        bm.error_message = str(e)
        bm.save()
        return Response(
            {'error': 'Analysis failed.', 'detail': str(e)},
            status=500
        )

    return Response(BusinessModelSerializer(bm).data, status=201)


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
@startup_only
def business_model_detail(request, bm_id):
    try:
        bm = BusinessModel.objects.get(id=bm_id, user=request.user)
    except BusinessModel.DoesNotExist:
        return Response({'error': 'Not found.'}, status=404)

    if request.method == 'DELETE':
        bm.delete()
        return Response(status=204)

    return Response(BusinessModelSerializer(bm).data)


# MVP plans 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@startup_only
def mvp_list(req):
    plans = MVPPlan.objects.filter(user=req.user)
    return Response(MVPPlanSerializer(plans, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@startup_only
def mvp_submit(req):
    serializer = MVPSubmitSerializer(data=req.data)
    if not serializer.is_valid():
        return Response(serializer.errors,status=400)
    
    d = serializer.validated_data

    try:
        idea = IdeaValidation.objects.get(id=d['idea_id'],user=req.user)

    except IdeaValidation.DoesNotExist:
        return Response({'error':"Idea not found"},status=404)
    
    plan = MVPPlan.objects.create(
        user = req.user,
        idea = idea,
        product_type = d['product_type'],
        launch_weeks = d['launch_weeks'],
        team_size = d['team_size'],
        start_date = d.get('start_date'),
        available_budget = d['available_budget'],
        tech_skills = d['tech_skills'],
        platform = d['platform'],
        status = 'analyzing'
    )

    try:
        result = analyze_mvp(
            idea = idea,
            product_type = d['product_type'],
            launch_weeks = d['launch_weeks'],
            team_size = d['team_size'],
            start_date = d.get('start_date'),
            available_budget = d['available_budget'],
            tech_skills = d['tech_skills'],
            platform = d['platform'],
            user = req.user
        )

        plan.status = 'done'
        plan.raw_ai_response = result['raw']
        plan.mvp_score = result['mvp_score']
        plan.mvp_verdict = result['mvp_verdict']
        plan.mvp_summary = result['mvp_summary']
        plan.core_features = result['core_features']
        plan.nice_to_haves = result['nice_to_haves']
        plan.learning_goals = result['learning_goals']
        plan.success_metrics = result['success_metrics']
        plan.mvp_risks = result['mvp_risks']
        plan.total_duration_weeks = result['total_duration_weeks']
        plan.roadmap_summary = result['roadmap_summary']
        plan.phases = result['phases']
        plan.tech_summary = result['tech_summary']
        plan.recommended_stack = result['recommended_stack']
        plan.build_items = result['build_items']
        plan.buy_items = result['buy_items']
        plan.nocode_options = result['nocode_options']
        plan.core_ip = result['core_ip']
        plan.tech_recommendations = result['tech_recommendations']
        plan.save()

    except Exception as e:
        plan.status = "failed"
        plan.error_message = str(e)
        plan.save()
        return Response(
            {
                'error':'Analysis Failed.',
                'detail':str(e)
            },
            status=500
        )
    
    return Response(MVPPlanSerializer(plan).data,status=201)



@api_view(['GET','DELETE'])
@permission_classes([IsAuthenticated])
@startup_only
def mvp_detail(req,plan_id):
    try:
        plan = MVPPlan.objects.get(id=plan_id,user=req.user)
    except MVPPlan.DoesNotExist:
        return Response({'error':'Not Found.'},status=404)
    
    if req.method == 'DELETE':
        plan.delete()
        return Response(status=204)
    
    return Response(MVPPlanSerializer(plan).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@startup_only
def financials_list(req):
    records = StartupFinancials.objects.filter(user=req.user)
    return Response(StartupFinancialsSerializer(records, many=True).data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@startup_only
def financials_submit(req):
    serializer = FinancialsSubmitSerializer(data=req.data)
    if not serializer.is_valid():
        return Response(serializer.errors,status=400)
    
    d = serializer.validated_data

    try:
        idea = IdeaValidation.objects.get(id=d['idea_id'],user=req.user)

    except IdeaValidation.DoesNotExist:
        return Response({'error':"Idea not found"},status=404)
    
    record = StartupFinancials.objects.create(
        user = req.user,
        idea = idea,
        cash_on_hand = d['cash_on_hand'],
        monthly_burn_rate = d['monthly_burn_rate'],
        starting_monthly_revenue = d['starting_monthly_revenue'],
        monthly_revenue_growth = d['monthly_revenue_growth'],
        current_monthly_expenses = d['current_monthly_expenses'],
        expense_growth_rate = d['expense_growth_rate'],
        funding_amount_target = d['funding_amount_target'],
        funds_product_pct = d.get('funds_product_pct',40),
        funds_marketing_pct = d.get('funds_marketing_pct',30),
        funds_salaries_pct = d.get('funds_salaries_pct',20),
        funds_ops_pct = d.get('funds_ops_pct',10),
        funding_milestone = d.get('funding_milestone',''),
        status = 'analyzing'
    ) 

    try:
        result = analyze_financials(
            idea = idea,
            cash_on_hand = d['cash_on_hand'],
            monthly_burn_rate = d['monthly_burn_rate'],
            starting_monthly_revenue = d['starting_monthly_revenue'],
            monthly_revenue_growth = d['monthly_revenue_growth'],
            current_monthly_expenses = d['current_monthly_expenses'],
            expense_growth_rate = d['expense_growth_rate'],
            funding_amount_target = d['funding_amount_target'],
            funds_product_pct = d.get('funds_product_pct',40),
            funds_marketing_pct = d.get('funds_marketing_pct',30),
            funds_salaries_pct = d.get('funds_salaries_pct',20),
            funds_ops_pct = d.get('funds_ops_pct',10),
            funding_milestone = d.get('funding_milestone',''),
            user = req.user
        )
        record.status = 'done'
        record.raw_ai_response = result['raw']
        record.runway_months = result['runway_months']
        record.runway_status = result['runway_status']
        record.zero_date = result['zero_date']
        record.runway_summary = result['runway_summary']
        record.runway_scenarios = result['runway_scenarios']
        record.runway_recommendations = result['runway_recommendations']
        record.breakeven_month = result['breakeven_month']
        record.projection_summary = result['projection_summary']
        record.yearly_projections = result['yearly_projections']
        record.monthly_projections = result['monthly_projections']
        record.projection_milestones = result['projection_milestones']
        record.projection_risks = result['projection_risks']
        record.projection_assumptions = result['projection_assumptions']
        record.funding_verdict = result['funding_verdict']
        record.funding_summary = result['funding_summary']
        record.funding_score = result['funding_score']
        record.valuation_context = result['valuation_context']
        record.runway_extended_months = result['runway_extended_months']
        record.funding_milestones = result['funding_milestones']
        record.funding_tips = result['funding_tips']
        record.use_of_funds_analysis = result['use_of_funds_analysis']
        record.save()

    except Exception as e:
        record.status = "failed"
        record.error_message = str(e)
        record.save()
        return Response({'error':'Analysis Failed.','detail':str(e)},status=500)
    
    return Response(StartupFinancialsSerializer(record).data,status=201)



@api_view(['GET','DELETE'])
@permission_classes([IsAuthenticated])
@startup_only
def financials_detail(req,record_id):
    try:
        record = StartupFinancials.objects.get(id=record_id,user=req.user)
    except StartupFinancials.DoesNotExist:
        return Response({'error':'Not Found.'},status=404)
    
    if req.method == 'DELETE':
        record.delete()
        return Response(status=204)
    
    return Response(StartupFinancialsSerializer(record).data)

# Investor Intelligence

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@startup_only
def investor_list(req):
    records = InvestorReadiness.objects.filter(user=req.user)
    return Response(InvestorReadinessSerializer(records,many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@startup_only
def investor_submit(req):
    serializer = InvestorReadinessSubmitSerializer(data=req.data)

    if not serializer.is_valid():
        return Response(serializer.errors,status=400)
    
    d = serializer.validated_data

    try:
        idea = IdeaValidation.objects.get(id=d['idea_id'],user=req.user)
    except IdeaValidation.DoesNotExist:
        return Response({'error':'Idea Not Found.'},status=404)
    
    record = InvestorReadiness.objects.create(
        user = req.user,
        idea = idea,
        funding_stage = d['funding_stage'],
        amount_raising = d['amount_raising'],
        team_description = d['team_description'],
        traction_so_far = d['traction_so_far'],
        company_stage = d['company_stage'],
        completed_items = d.get('completed_items',[]),
        status = 'analyzing'
    )

    try:
        result = analyze_investor_readiness(
            idea = idea,
            funding_stage = d['funding_stage'],
            amount_raising = d['amount_raising'],
            team_description = d['team_description'],
            traction_so_far = d['traction_so_far'],
            company_stage = d['company_stage'],
            completed_items = d.get('completed_items',[]),
            user = req.user,
        )

        record.status = 'done'
        record.raw_ai_response = result['raw']
        record.pitch_score = result['pitch_score']
        record.pitch_verdict = result['pitch_verdict']
        record.pitch_summary = result['pitch_summary']
        record.pitch_slides = result['pitch_slides']
        record.investor_questions = result['investor_questions']
        record.storytelling_tips = result['storytelling_tips']
        record.investor_list = result['investor_list']
        record.outreach_template = result['outreach_template']
        record.warm_intro_strategy = result['warm_intro_strategy']
        record.investor_tips = result['investor_tips']
        record.dd_score = result['dd_score']
        record.dd_summary = result['dd_summary']
        record.dd_checklist = result['dd_checklist']
        record.dd_priority_items = result['dd_priority_items']
        record.dd_red_flags = result['dd_red_flags']
        record.dd_preparation_tips = result['dd_preparation_tips']
        record.save()       

    except Exception as e:
        record.status = 'failed'
        record.error_message = str(e)
        record.save()
        return Response({
            'error':'Analysis Failed',
            'detail':str(e), 
        },status=500)
    
    return Response(
        InvestorReadinessSerializer(record).data,
        status=201
    )
        
    
@api_view(['GET','DELETE'])
@permission_classes([IsAuthenticated])
@startup_only
def investor_detail(req,record_id):
    try:
        record = InvestorReadiness.objects.get(id=record_id, user=req.user)

    except InvestorReadiness.DoesNotExist:
        return Response({
            'error':'Not Found.',
        },status=404)
    
    if req.method == 'DELETE':
        req.delete()
        return Response(status=204)
    
    return Response(InvestorReadinessSerializer(record).data)



# GO-TO Market

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@startup_only
def gtm_list(req):
    records = GoToMarket.objects.filter(user=req.user)
    return Response(GoToMarketSerializer(records, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@startup_only
def gtm_submit(req):
    serializer = GTMSubmitSerializer(data=req.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status= 400)
    d = serializer.validated_data
    
    try:
        idea = IdeaValidation.objects.get(id=d['idea_id'], user=req.user)
    except IdeaValidation.DoesNotExist:
        return Response({'error': 'Idea not found.'},status=404)

    record = GoToMarket.objects.create(
        user = req.user,
        idea = idea,
        beachhead_market = d['beachhead_market'],
        launch_weeks = d['launch_weeks'],
        launch_budget = d['launch_budget'],
        monthly_acq_budget = d['monthly_acq_budget'],
        target_monthly_customers = d['target_monthly_customers'],
        preferred_channels = d.get('preferred_channels', []),
        current_price = d['current_price'],
        competitor_price_min = d.get('competitor_price_min', 0),
        competitor_price_max = d.get('competitor_price_max', 0),
        pricing_model = d['pricing_model'],
        status = 'analyzing'
    )
    
    try:
        result = analyze_gtm(
            idea = idea,
            beachhead_market = d['beachhead_market'],
            launch_weeks = d['launch_weeks'],
            launch_budget = d['launch_budget'],
            monthly_acq_budget = d['monthly_acq_budget'],
            target_monthly_customers = d['target_monthly_customers'],
            preferred_channels = d.get('preferred_channels', []),
            current_price = d['current_price'],
            competitor_price_min = d.get('competitor_price_min', 0),
            competitor_price_max = d.get('competitor_price_max', 0),
            pricing_model = d['pricing_model'],
            user = req.user,
        )
        
        record.status = 'done'
        record.raw_ai_response = result['raw']
        record.launch_score = result['launch_score']
        record.launch_verdict = result['launch_verdict']
        record.launch_summary = result['launch_summary']
        record.beachhead_analysis = result['beachhead_analysis']
        record.launch_channels = result['launch_channels']
        record.first_90_days = result['first_90_days']
        record.pr_strategy = result['pr_strategy']
        record.launch_risks = result['launch_risks']
        record.launch_tips = result['launch_tips']
        record.acq_score = result['acq_score']
        record.acq_summary = result['acq_summary']
        record.projected_cac = result['projected_cac']
        record.channel_priority = result['channel_priority']
        record.channel_strategies = result['channel_strategies']
        record.budget_allocation = result['budget_allocation']
        record.growth_hacks = result['growth_hacks']
        record.pricing_score = result['pricing_score']
        record.pricing_verdict = result['pricing_verdict']
        record.pricing_summary = result['pricing_summary']
        record.recommended_price = result['recommended_price']
        record.pricing_rationale = result['pricing_rationale']
        record.package_tiers = result['package_tiers']
        record.psychological_tips = result['psychological_tips']
        record.price_testing_plan = result['price_testing_plan']
        record.annual_strategy = result['annual_strategy']
        record.save()
    except Exception as e:
        record.status = 'Failed'
        record.error_message = str(e)
        record.save()
        return Response(
            {
                'error': 'Analysis failed.',
                'detail': str(e)
            }, 
            status = 500
        )
        
    return Response(GoToMarketSerializer(record).data, status= 201)

@api_view(['GET','DELETE'])
@permission_classes([IsAuthenticated])
@startup_only
def gtm_detail(req, record_id):
    try:
        record = GoToMarket.objects.get(id = record_id, user = req.user)
    except GoToMarket.DoesNotExist:
        return Response(
            {
                'error': 'Not Found.'
            }, status = 404
        ) 
    
    if req.method == 'DELETE':
        record.delete()
        return Response(status=204)

    return Response(GoToMarketSerializer(record).data)


# Startup KPI Intelligence
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@startup_only
def kpis_list(req):
    records = StartupKPIs.objects.filter(user=req.user)
    return Response(StartupKPIsSerializer(records,many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@startup_only
def kpis_submit(req):
    serializer = KPIsSubmitSerializer(data=req.data)
    if not serializer.is_valid():
        return Response(serializer.errors,status=400)
    
    d = serializer.validated_data
    try:
        idea = IdeaValidation.objects.get(id=d['idea_id'],user=req.user)
    except IdeaValidation.DoesNotExist:
        return Response({
            'error':'Idea Not Found',
        },status=404)
    
    record = StartupKPIs.objects.create(
        user=req.user,
        idea = idea,
        business_model_type = d['business_model_type'],
        primary_goal = d['primary_goal'],
        currently_tracking = d.get('currently_tracking',""),
        week1_retention = d.get('week_1_retention',0),
        month1_retention = d.get('month1_retention',0),
        month3_retention = d.get('month3_retention',0),
        avg_invites_per_user = d.get('avg_invites_per_user',0),
        invite_conversion_rate = d.get('invite_conversion_rate',0),
        monthly_active_users = d.get('monthly_active_users',0),
        status = 'analyzing'
    )
    try:
        result = analyze_kpis(
            idea = idea,
            business_model_type = d['business_model_type'],
            primary_goal = d['primary_goal'],
            currently_tracking = d.get('currently_tracking',""),
            week1_retention = d.get('week_1_retention',0),
            month1_retention = d.get('month1_retention',0),
            month3_retention = d.get('month3_retention',0),
            avg_invites_per_user = d.get('avg_invites_per_user',0),
            invite_conversion_rate = d.get('invite_conversion_rate',0),
            monthly_active_users = d.get('monthly_active_users',0),
            user = req.user
        )

        record.status = 'done'
        record.raw_ai_response = result['raw']
        record.north_star_metric = result['north_star_metric']
        record.north_star_why = result['north_star_why']
        record.north_star_how_to_measure = result['north_star_how_to_measure']
        record.supporting_metrics = result['supporting_metrics']
        record.kpi_benchmarks = result['kpi_benchmarks']
        record.warning_signs = result['warning_signs']
        record.tracking_recommendations = result['tracking_recommendations']
        record.retention_score = result['retention_score']
        record.retention_verdict = result['retention_verdict']
        record.retention_summary = result['retention_summary']
        record.pmf_assessment = result['pmf_assessment']
        record.benchmark_comparison = result['benchmark_comparison']
        record.churn_reasons = result['churn_reasons']
        record.retention_strategies = result['retention_strategies']
        record.retention_quick_wins = result['retention_quick_wins']
        record.k_factor = result['k_factor']
        record.viral_verdict = result['viral_verdict']
        record.viral_summary = result['viral_summary']
        record.viral_loop_design = result['viral_loop_design']
        record.k_factor_improvements = result['k_factor_improvements']
        record.growth_projections = result['growth_projections']
        record.viral_examples = result['viral_examples']
        record.save()
    except Exception as e:
        record.status = 'failed'
        record.error_message = str(e)
        record.save()
        return Response({
            'error':'Analysis failed',
            'detail':str(e)
        },status=500)
    
    return Response(StartupKPIsSerializer(record).data,status=201)


@api_view(['GET','DELETE'])
@permission_classes([IsAuthenticated])
@startup_only
def kpis_detail(req, record_id):
    try:
        record = StartupKPIs.objects.get(id = record_id, user = req.user)
    except StartupKPIs.DoesNotExist:
        return Response(
            {
                'error': 'Not Found.'
            }, status = 404
        ) 
    
    if req.method == 'DELETE':
        record.delete()
        return Response(status=204)

    return Response(StartupKPIsSerializer(record).data)


#Team culture intelligence
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@startup_only
def team_list(req):
    records = TeamCulture.objects.filter(user=req.user)
    return Response(TeamCultureSerializer(records,many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@startup_only
def team_submit(req):
    serializer = TeamCultureSubmitSerializer(data=req.data)
    if not serializer.is_valid():
        return Response(serializer.errors,status=400)
    
    d = serializer.validated_data
    try:
        idea = IdeaValidation.objects.get(id=d['idea_id'],user=req.user)
    except IdeaValidation.DoesNotExist:
        return Response({
            'error':'Idea Not Found',
        },status=404)
    2
    record = TeamCulture.objects.create(
        user = req.user,
        idea = idea,
        founders = d.get('founders',[]),
        is_solo_founder = d.get('is_solo_founder',False),
        current_team_size = d.get('current_team_size',1),
        hiring_budget_12m = d['hiring_budget_12m'],
        priority_roles = d.get('priority_roles',''),
        work_mode = d['work_mode'],
        current_advisors = d.get('current_advisors',''),
        expertise_gaps = d.get('expertise_gaps',''),
        status = 'analyzing'
    )
    try:
        result = analyze_team(
            idea = idea,
            founders = d.get('founders',[]),
            is_solo_founder = d.get('is_solo_founder',False),
            current_team_size = d.get('current_team_size',1),
            hiring_budget_12m = d['hiring_budget_12m'],
            priority_roles = d.get('priority_roles',''),
            work_mode = d['work_mode'],
            current_advisors = d.get('current_advisors',''),
            expertise_gaps = d.get('expertise_gaps',''),
            user = req.user
        )
    
        record.status = 'done'
        record.raw_ai_response = result['raw']
        record.team_score = result['team_score']
        record.team_verdict = result['team_verdict']
        record.team_summary = result['team_summary']
        record.skills_gap_analysis = result['skills_gap_analysis']
        record.equity_assessment = result['equity_assessment']
        record.vesting_recommendation = result['vesting_recommendation']
        record.conflict_risks = result['conflict_risks']
        record.team_recommendations = result['team_recommendations']
        record.founder_agreements = result['founder_agreements']
        record.hiring_score = result['hiring_score']
        record.hiring_summary = result['hiring_summary']
        record.hiring_roadmap = result['hiring_roadmap']
        record.recruitment_channels = result['recruitment_channels']
        record.culture_values = result['culture_values']
        record.first_10_guide = result['first_10_guide']
        record.compensation_benchmarks = result['compensation_benchmarks']
        record.hiring_mistakes = result['hiring_mistakes']
        record.advisory_score = result['advisory_score']
        record.ideal_advisors = result['ideal_advisors']
        record.advisor_equity_guide = result['advisor_equity_guide']
        record.where_to_find = result['where_to_find']
        record.outreach_approach = result['outreach_approach']
        record.meeting_cadence = result['meeting_cadence']
        record.advisor_red_flags = result['advisor_red_flags']
        record.save()

    except Exception as e:
        record.status = 'failed'
        record.error_message = str(e)
        record.save()
        return Response({
            'error':'Analysis Failed.',
            'detail':str(e)
        },status=500)
    
    return Response(TeamCultureSerializer(record).data,status=201)


@api_view(['GET','DELETE'])
@permission_classes([IsAuthenticated])
@startup_only
def team_detail(req, record_id):
    try:
        record = TeamCulture.objects.get(id = record_id, user = req.user)
    except TeamCulture.DoesNotExist:
        return Response(
            {
                'error': 'Not Found.'
            }, status = 404
        ) 
    
    if req.method == 'DELETE':
        record.delete()
        return Response(status=204)

    return Response(TeamCultureSerializer(record).data)



# Startup Risks intelligence

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@startup_only
def risks_list(req):
    records = StartupRisks.objects.filter(user=req.user)
    return Response(StartupRisksSerializer(records,many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@startup_only
def risks_submit(req):
    serializer = RisksSubmitSerializer(data=req.data)
    if not serializer.is_valid():
        return Response(serializer.errors,status=400)
    
    d = serializer.validated_data
    try:
        idea = IdeaValidation.objects.get(id=d['idea_id'],user=req.user)
    except IdeaValidation.DoesNotExist:
        return Response({
            'error':'Idea Not Found',
        },status=404)
    
    record = StartupRisks.objects.create(
        user = req.user,
        idea = idea,
        business_type = d['business_type'],
        handles_customer_data = d.get('handles_customer_data'),
        handles_payment = d.get('handles_payment'),
        regulated_space = d.get('regulated_space'),
        regulation_details = d.get('regulation_details'),
        biggest_worry = d.get('biggest_worry'),
        status = 'analyzing',
    )
    
    try:
        result = analyze_risks(
            idea = idea,
            business_type = d['business_type'],
            handles_customer_data = d.get('handles_customer_data'),
            handles_payment = d.get('handles_payment'),
            regulated_space = d.get('regulated_space'),
            regulation_details = d.get('regulation_details'),
            biggest_worry = d.get('biggest_worry'),
            user = req.user,
        )
        
        record.status = 'done'
        record.raw_ai_response = result['raw']
        record.overall_risk_score = result['overall_risk_score']
        record.overall_risk_level = result['overall_risk_level']
        record.risk_summary = result['risk_summary']
        record.risk_register = result['risk_register']
        record.legal_summary = result['legal_summary']
        record.legal_checklist = result['legal_checklist']
        record.immediate_legal_actions = result['immediate_legal_actions']
        record.mitigation_summary = result['mitigation_summary']
        record.mitigation_actions = result['mitigation_actions']
        record.risk_monitoring_plan = result['risk_monitoring_plan']
        record.insurance_recommendations = result['insurance_recommendations']
        record.save()
        
        
    except Exception as e:
        record.status = 'failed'
        record.error_message = str(e)
        record.save()
        return Response({'error' : 'Analysis failed','detail': str(e)}, status = 500)

    return Response(StartupRisksSerializer(record).data, status = 201)


@api_view(['GET','DELETE'])
@permission_classes([IsAuthenticated])
@startup_only
def risks_detail(req, record_id):
    try:
        record = StartupRisks.objects.get(id = record_id, user = req.user)
    except StartupRisks.DoesNotExist:
        return Response(
            {
                'error': 'Not Found.'
            }, status = 404
        ) 
    
    if req.method == 'DELETE':
        record.delete()
        return Response(status=204)

    return Response(StartupRisksSerializer(record).data)