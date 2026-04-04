from rest_framework import serializers
from startups.models import *


class IdeaValidationSerializer(serializers.ModelSerializer):
    dimension_scores = serializers.ReadOnlyField()

    class Meta:
        model  = IdeaValidation
        fields = [
            'id',
            'idea_title',
            'idea_description',
            'status',
            'overall_score',
            'verdict',
            'verdict_summary',
            'dimension_scores',
            'market_demand_analysis',
            'competition_analysis',
            'profit_analysis',
            'scalability_analysis',
            'entry_barriers_analysis',
            'founder_fit_analysis',
            'timing_analysis',
            'funding_analysis',
            'key_risks',
            'opportunities',
            'next_steps',
            'error_message',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'status', 'overall_score', 'verdict', 'verdict_summary',
            'dimension_scores',
            'market_demand_analysis', 'competition_analysis',
            'profit_analysis', 'scalability_analysis',
            'entry_barriers_analysis', 'founder_fit_analysis',
            'timing_analysis', 'funding_analysis',
            'key_risks', 'opportunities', 'next_steps',
            'error_message', 'created_at', 'updated_at',
        ]


class IdeaSubmitSerializer(serializers.Serializer):
    idea_title = serializers.CharField(max_length=255)
    idea_description = serializers.CharField(min_length=50)
    

class MarketIntelligenceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MarketIntelligence
        fields = [
            'id',
            'product_name', 'industry', 'target_region',
            'customer_type', 'description', 'status',
            'market_summary', 'key_insights',
            'tam_value', 'tam_explanation',
            'sam_value', 'sam_explanation',
            'som_value', 'som_explanation',
            'sizing_methodology',
            'market_growth_rate', 'market_direction', 'trend_summary',
            'tailwinds', 'headwinds', 'tech_shifts',
            'regulatory_factors', 'consumer_shifts',
            'personas',
            'error_message',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'status', 'market_summary', 'key_insights',
            'tam_value', 'tam_explanation',
            'sam_value', 'sam_explanation',
            'som_value', 'som_explanation',
            'sizing_methodology',
            'market_growth_rate', 'market_direction', 'trend_summary',
            'tailwinds', 'headwinds', 'tech_shifts',
            'regulatory_factors', 'consumer_shifts',
            'personas', 'error_message',
            'created_at', 'updated_at',
        ]


class MarketSubmitSerializer(serializers.Serializer):
    product_name  = serializers.CharField(max_length=255)
    industry = serializers.CharField(max_length=100)
    target_region = serializers.ChoiceField(choices=[
        'india', 'global', 'north_india', 'south_india',
        'east_india', 'west_india', 'tier1_cities', 'tier2_cities',
        'southeast_asia', 'us', 'europe',
    ])
    customer_type = serializers.ChoiceField(choices=['b2b', 'b2c', 'both'])
    description   = serializers.CharField(min_length=30)
    


class BusinessModelSerializer(serializers.ModelSerializer):
    idea_title = serializers.CharField(source='idea.idea_title', read_only=True)

    class Meta:
        model  = BusinessModel
        fields = [
            'id', 'idea', 'idea_title',
            'revenue_model', 'price_per_customer',
            'estimated_cac', 'additional_context', 'status',
            'overall_summary', 'business_model_score', 'overall_verdict',
            'canvas_problem', 'canvas_solution', 'canvas_uvp',
            'canvas_unfair_advantage', 'canvas_customer_segments',
            'canvas_channels', 'canvas_revenue_streams',
            'canvas_cost_structure', 'canvas_key_metrics',
            'revenue_model_analysis', 'revenue_model_recommended',
            'revenue_model_reasoning', 'pricing_recommendation',
            'ltv_estimate', 'ltv_explanation', 'cac_analysis',
            'ltv_cac_ratio', 'ltv_cac_verdict',
            'payback_period_months', 'payback_verdict',
            'contribution_margin', 'unit_economics_score',
            'recommendations', 'risks',
            'error_message', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'status', 'overall_summary', 'business_model_score',
            'overall_verdict',
            'canvas_problem', 'canvas_solution', 'canvas_uvp',
            'canvas_unfair_advantage', 'canvas_customer_segments',
            'canvas_channels', 'canvas_revenue_streams',
            'canvas_cost_structure', 'canvas_key_metrics',
            'revenue_model_analysis', 'revenue_model_recommended',
            'revenue_model_reasoning', 'pricing_recommendation',
            'ltv_estimate', 'ltv_explanation', 'cac_analysis',
            'ltv_cac_ratio', 'ltv_cac_verdict',
            'payback_period_months', 'payback_verdict',
            'contribution_margin', 'unit_economics_score',
            'recommendations', 'risks',
            'error_message', 'created_at', 'updated_at',
        ]


class BusinessModelSubmitSerializer(serializers.Serializer):
    idea_id = serializers.IntegerField()
    revenue_model = serializers.ChoiceField(choices=[
        'subscription', 'one_time', 'freemium',
        'marketplace', 'advertising', 'usage_based',
        'licensing', 'not_decided',
    ])
    price_per_customer = serializers.DecimalField(max_digits=10, decimal_places=2)
    estimated_cac = serializers.DecimalField(max_digits=10, decimal_places=2)
    additional_context = serializers.CharField(required=False, allow_blank=True)
    
    
class MVPPlanSerializer(serializers.ModelSerializer):
    idea_title = serializers.CharField(source='idea.idea_title', read_only=True)

    class Meta:
        model  = MVPPlan
        fields = [
            'id', 'idea', 'idea_title',
            'product_type', 'launch_weeks', 'team_size',
            'start_date', 'available_budget', 'tech_skills', 'platform',
            'status',
            'mvp_score', 'mvp_verdict', 'mvp_summary',
            'core_features', 'nice_to_haves', 'learning_goals',
            'success_metrics', 'mvp_risks',
            'total_duration_weeks', 'roadmap_summary', 'phases',
            'tech_summary', 'recommended_stack',
            'build_items', 'buy_items', 'nocode_options',
            'core_ip', 'tech_recommendations',
            'error_message', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'status',
            'mvp_score', 'mvp_verdict', 'mvp_summary',
            'core_features', 'nice_to_haves', 'learning_goals',
            'success_metrics', 'mvp_risks',
            'total_duration_weeks', 'roadmap_summary', 'phases',
            'tech_summary', 'recommended_stack',
            'build_items', 'buy_items', 'nocode_options',
            'core_ip', 'tech_recommendations',
            'error_message', 'created_at', 'updated_at',
        ]


class MVPSubmitSerializer(serializers.Serializer):
    idea_id = serializers.IntegerField()
    product_type = serializers.ChoiceField(choices=[
        'web_app', 'mobile_app', 'both', 'physical', 'service'
    ])
    launch_weeks = serializers.IntegerField(min_value=1, max_value=104)
    team_size = serializers.IntegerField(min_value=1)
    start_date = serializers.DateField(required=False, allow_null=True)
    available_budget = serializers.ChoiceField(choices=[
        'lt_1l', '1l_5l', '5l_20l', '20l_50l', 'gt_50l'
    ])
    tech_skills = serializers.ChoiceField(choices=[
        'fullstack', 'frontend', 'backend', 'no_code', 'none'
    ])
    platform = serializers.ChoiceField(choices=['web', 'mobile', 'both'])


class StartupFinancialsSerializer(serializers.ModelSerializer):
    idea_title = serializers.CharField(source='idea.idea_title', read_only=True)

    class Meta:
        model  = StartupFinancials
        fields = [
            'id', 'idea', 'idea_title', 'status',
            # Inputs
            'cash_on_hand', 'monthly_burn_rate',
            'starting_monthly_revenue', 'monthly_revenue_growth',
            'current_monthly_expenses', 'expense_growth_rate',
            'funding_amount_target',
            'funds_product_pct', 'funds_marketing_pct',
            'funds_salaries_pct', 'funds_ops_pct',
            'funding_milestone',
            # Runway
            'runway_months', 'runway_status', 'zero_date',
            'runway_summary', 'runway_scenarios', 'runway_recommendations',
            # Projection
            'breakeven_month', 'projection_summary',
            'yearly_projections', 'monthly_projections',
            'projection_milestones', 'projection_risks',
            'projection_assumptions',
            # Funding
            'funding_verdict', 'funding_summary', 'funding_score',
            'valuation_context', 'runway_extended_months',
            'funding_milestones', 'funding_tips', 'use_of_funds_analysis',
            # Meta
            'error_message', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'status',
            'runway_months', 'runway_status', 'zero_date',
            'runway_summary', 'runway_scenarios', 'runway_recommendations',
            'breakeven_month', 'projection_summary',
            'yearly_projections', 'monthly_projections',
            'projection_milestones', 'projection_risks',
            'projection_assumptions',
            'funding_verdict', 'funding_summary', 'funding_score',
            'valuation_context', 'runway_extended_months',
            'funding_milestones', 'funding_tips', 'use_of_funds_analysis',
            'error_message', 'created_at', 'updated_at',
        ]

class FinancialsSubmitSerializer(serializers.Serializer):
    idea_id = serializers.IntegerField()
    cash_on_hand = serializers.DecimalField(max_digits=14, decimal_places=2)
    monthly_burn_rate = serializers.DecimalField(max_digits=14, decimal_places=2)
    starting_monthly_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)
    monthly_revenue_growth = serializers.FloatField()
    current_monthly_expenses = serializers.DecimalField(max_digits=14, decimal_places=2)
    expense_growth_rate = serializers.FloatField()
    funding_amount_target = serializers.DecimalField(max_digits=14, decimal_places=2)
    funds_product_pct = serializers.FloatField(default=40)
    funds_marketing_pct = serializers.FloatField(default=30)
    funds_salaries_pct = serializers.FloatField(default=20)
    funds_ops_pct = serializers.FloatField(default=10)
    funding_milestone = serializers.CharField(required=False, allow_blank=True)
    
    
class InvestorReadinessSerializer(serializers.ModelSerializer):
    idea_title = serializers.CharField(source='idea.idea_title', read_only=True)

    class Meta:
        model  = InvestorReadiness
        fields = [
            'id', 'idea', 'idea_title', 'status',
            'funding_stage', 'amount_raising',
            'team_description', 'traction_so_far',
            'company_stage', 'completed_items',
            'pitch_score', 'pitch_verdict', 'pitch_summary',
            'pitch_slides', 'investor_questions', 'storytelling_tips',
            'investor_list', 'outreach_template',
            'warm_intro_strategy', 'investor_tips',
            'dd_score', 'dd_summary', 'dd_checklist',
            'dd_priority_items', 'dd_red_flags', 'dd_preparation_tips',
            'error_message', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'status',
            'pitch_score', 'pitch_verdict', 'pitch_summary',
            'pitch_slides', 'investor_questions', 'storytelling_tips',
            'investor_list', 'outreach_template',
            'warm_intro_strategy', 'investor_tips',
            'dd_score', 'dd_summary', 'dd_checklist',
            'dd_priority_items', 'dd_red_flags', 'dd_preparation_tips',
            'error_message', 'created_at', 'updated_at',
        ]


class InvestorReadinessSubmitSerializer(serializers.Serializer):
    idea_id = serializers.IntegerField()
    funding_stage = serializers.ChoiceField(
        choices=['pre_seed', 'seed', 'series_a']
    )
    amount_raising = serializers.DecimalField(max_digits=14, decimal_places=2)
    team_description = serializers.CharField()
    traction_so_far = serializers.CharField()
    company_stage = serializers.ChoiceField(
        choices=['idea', 'mvp', 'revenue', 'growth']
    )
    completed_items = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )

class GoToMarketSerializer(serializers.ModelSerializer):
    idea_title = serializers.CharField(source='idea.idea_title', read_only=True)

    class Meta:
        model  = GoToMarket
        fields = [
            'id', 'idea', 'idea_title', 'status',
            'beachhead_market', 'launch_weeks', 'launch_budget',
            'monthly_acq_budget', 'target_monthly_customers',
            'preferred_channels',
            'current_price', 'competitor_price_min',
            'competitor_price_max', 'pricing_model',
            'launch_score', 'launch_verdict', 'launch_summary',
            'beachhead_analysis', 'launch_channels',
            'first_90_days', 'pr_strategy',
            'launch_risks', 'launch_tips',
            'acq_summary', 'acq_score', 'projected_cac',
            'channel_priority', 'channel_strategies',
            'budget_allocation', 'growth_hacks',
            'pricing_score', 'pricing_verdict', 'pricing_summary',
            'recommended_price', 'pricing_rationale',
            'package_tiers', 'psychological_tips',
            'price_testing_plan', 'annual_strategy',
            'error_message', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'status',
            'launch_score', 'launch_verdict', 'launch_summary',
            'beachhead_analysis', 'launch_channels',
            'first_90_days', 'pr_strategy',
            'launch_risks', 'launch_tips',
            'acq_summary', 'acq_score', 'projected_cac',
            'channel_priority', 'channel_strategies',
            'budget_allocation', 'growth_hacks',
            'pricing_score', 'pricing_verdict', 'pricing_summary',
            'recommended_price', 'pricing_rationale',
            'package_tiers', 'psychological_tips',
            'price_testing_plan', 'annual_strategy',
            'error_message', 'created_at', 'updated_at',
        ]


class GTMSubmitSerializer(serializers.Serializer):
    idea_id = serializers.IntegerField()
    beachhead_market = serializers.CharField()
    launch_weeks = serializers.IntegerField(min_value=1)
    launch_budget = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_acq_budget = serializers.DecimalField(max_digits=12, decimal_places=2)
    target_monthly_customers = serializers.IntegerField(min_value=1)
    preferred_channels = serializers.ListField(
        child=serializers.CharField(), required=False, default=list
    )
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    competitor_price_min = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, default=0
    )
    competitor_price_max = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, default=0
    )
    pricing_model = serializers.ChoiceField(choices=[
        'subscription', 'one_time', 'freemium',
        'usage_based', 'tiered', 'not_decided',
    ])
    



class StartupKPIsSerializer(serializers.ModelSerializer):
    idea_title = serializers.CharField(source='idea.idea_title', read_only=True)

    class Meta:
        model  = StartupKPIs
        fields = [
            'id', 'idea', 'idea_title', 'status',
            # Inputs
            'business_model_type', 'primary_goal', 'currently_tracking',
            'week1_retention', 'month1_retention', 'month3_retention',
            'avg_invites_per_user', 'invite_conversion_rate',
            'monthly_active_users',
            # North Star
            'north_star_metric', 'north_star_why',
            'north_star_how_to_measure', 'supporting_metrics',
            'kpi_benchmarks', 'warning_signs', 'tracking_recommendations',
            # Retention
            'retention_score', 'retention_verdict', 'retention_summary',
            'pmf_assessment', 'benchmark_comparison',
            'churn_reasons', 'retention_strategies', 'retention_quick_wins',
            # Viral
            'k_factor', 'viral_verdict', 'viral_summary',
            'viral_loop_design', 'k_factor_improvements',
            'growth_projections', 'viral_examples',
            # Meta
            'error_message', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'status',
            'north_star_metric', 'north_star_why',
            'north_star_how_to_measure', 'supporting_metrics',
            'kpi_benchmarks', 'warning_signs', 'tracking_recommendations',
            'retention_score', 'retention_verdict', 'retention_summary',
            'pmf_assessment', 'benchmark_comparison',
            'churn_reasons', 'retention_strategies', 'retention_quick_wins',
            'k_factor', 'viral_verdict', 'viral_summary',
            'viral_loop_design', 'k_factor_improvements',
            'growth_projections', 'viral_examples',
            'error_message', 'created_at', 'updated_at',
        ]


class KPIsSubmitSerializer(serializers.Serializer):
    idea_id = serializers.IntegerField()
    business_model_type = serializers.ChoiceField(choices=[
        'saas', 'marketplace', 'consumer', 'ecommerce', 'service'
    ])
    primary_goal = serializers.ChoiceField(choices=[
        'growth', 'retention', 'revenue', 'engagement'
    ])
    currently_tracking = serializers.CharField(
        required=False, allow_blank=True
    )
    week1_retention = serializers.FloatField(default=0)
    month1_retention = serializers.FloatField(default=0)
    month3_retention = serializers.FloatField(default=0)
    avg_invites_per_user = serializers.FloatField(default=0)
    invite_conversion_rate = serializers.FloatField(default=0)
    monthly_active_users = serializers.IntegerField(default=0)
    
    


class TeamCultureSerializer(serializers.ModelSerializer):
    idea_title = serializers.CharField(source='idea.idea_title', read_only=True)

    class Meta:
        model  = TeamCulture
        fields = [
            'id', 'idea', 'idea_title', 'status',
            'founders', 'is_solo_founder',
            'current_team_size', 'hiring_budget_12m',
            'priority_roles', 'work_mode',
            'current_advisors', 'expertise_gaps',
            'team_score', 'team_verdict', 'team_summary',
            'skills_gap_analysis', 'equity_assessment',
            'vesting_recommendation', 'conflict_risks',
            'team_recommendations', 'founder_agreements',
            'hiring_score', 'hiring_summary', 'hiring_roadmap',
            'recruitment_channels', 'culture_values',
            'first_10_guide', 'compensation_benchmarks',
            'hiring_mistakes',
            'advisory_score', 'advisory_summary', 'ideal_advisors',
            'advisor_equity_guide', 'where_to_find',
            'outreach_approach', 'meeting_cadence', 'advisor_red_flags',
            'error_message', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'status',
            'team_score', 'team_verdict', 'team_summary',
            'skills_gap_analysis', 'equity_assessment',
            'vesting_recommendation', 'conflict_risks',
            'team_recommendations', 'founder_agreements',
            'hiring_score', 'hiring_summary', 'hiring_roadmap',
            'recruitment_channels', 'culture_values',
            'first_10_guide', 'compensation_benchmarks',
            'hiring_mistakes',
            'advisory_score', 'advisory_summary', 'ideal_advisors',
            'advisor_equity_guide', 'where_to_find',
            'outreach_approach', 'meeting_cadence', 'advisor_red_flags',
            'error_message', 'created_at', 'updated_at',
        ]


class TeamCultureSubmitSerializer(serializers.Serializer):
    idea_id = serializers.IntegerField()
    founders = serializers.ListField(
        child=serializers.DictField(), default=list
    )
    is_solo_founder = serializers.BooleanField(default=False)
    current_team_size = serializers.IntegerField(default=1)
    hiring_budget_12m = serializers.DecimalField(
        max_digits=14, decimal_places=2
    )
    priority_roles = serializers.CharField(
        required=False, allow_blank=True
    )
    work_mode = serializers.ChoiceField(
        choices=['remote', 'office', 'hybrid']
    )
    current_advisors = serializers.CharField(
        required=False, allow_blank=True
    )
    expertise_gaps = serializers.CharField(
        required=False, allow_blank=True
    )
    
    


class StartupRisksSerializer(serializers.ModelSerializer):
    idea_title = serializers.CharField(source='idea.idea_title', read_only=True)

    class Meta:
        model  = StartupRisks
        fields = [
            'id', 'idea', 'idea_title', 'status',
            'business_type', 'handles_customer_data',
            'handles_payments', 'regulated_space',
            'regulation_details', 'biggest_worry',
            'overall_risk_score', 'overall_risk_level', 'risk_summary',
            'risk_register',
            'legal_summary', 'legal_checklist', 'immediate_legal_actions',
            'mitigation_summary', 'mitigation_actions',
            'risk_monitoring_plan', 'insurance_recommendations',
            'error_message', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'status',
            'overall_risk_score', 'overall_risk_level', 'risk_summary',
            'risk_register',
            'legal_summary', 'legal_checklist', 'immediate_legal_actions',
            'mitigation_summary', 'mitigation_actions',
            'risk_monitoring_plan', 'insurance_recommendations',
            'error_message', 'created_at', 'updated_at',
        ]


class RisksSubmitSerializer(serializers.Serializer):
    idea_id = serializers.IntegerField()
    business_type = serializers.ChoiceField(choices=[
        'b2b_saas', 'b2c_app', 'marketplace', 'service', 'physical'
    ])
    handles_customer_data = serializers.BooleanField(default=False)
    handles_payments = serializers.BooleanField(default=False)
    regulated_space = serializers.BooleanField(default=False)
    regulation_details = serializers.CharField(
        required=False, allow_blank=True
    )
    biggest_worry = serializers.CharField(
        required=False, allow_blank=True
    )