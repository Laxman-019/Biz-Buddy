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