from django.contrib import admin
from startups.models import *


@admin.register(IdeaValidation)
class IdeaValidationAdmin(admin.ModelAdmin):
    list_display  = ['idea_title', 'user', 'status', 'overall_score', 'verdict', 'created_at']
    list_filter   = ['status', 'verdict']
    search_fields = ['idea_title', 'user__email']
    readonly_fields = [
        'status', 'overall_score', 'verdict', 'verdict_summary',
        'score_market_demand', 'score_competition', 'score_profit_potential',
        'score_scalability', 'score_entry_barriers', 'score_founder_fit',
        'score_timing_factor', 'score_funding_readiness',
        'market_demand_analysis', 'competition_analysis', 'profit_analysis',
        'scalability_analysis', 'entry_barriers_analysis', 'founder_fit_analysis',
        'timing_analysis', 'funding_analysis',
        'key_risks', 'opportunities', 'next_steps',
        'raw_ai_response', 'error_message', 'created_at', 'updated_at',
    ]


@admin.register(MarketIntelligence)
class MarketIntelligenceAdmin(admin.ModelAdmin):
    list_display  = ['product_name', 'user', 'industry', 'target_region', 'status', 'created_at']
    list_filter = ['status', 'target_region', 'customer_type']
    search_fields = ['product_name', 'user__email']
    readonly_fields = [
        'status', 'market_summary', 'key_insights',
        'tam_value', 'tam_explanation', 'sam_value', 'sam_explanation',
        'som_value', 'som_explanation', 'sizing_methodology',
        'market_growth_rate', 'market_direction', 'trend_summary',
        'tailwinds', 'headwinds', 'tech_shifts',
        'regulatory_factors', 'consumer_shifts', 'personas',
        'raw_ai_response', 'error_message', 'created_at', 'updated_at',
    ]


@admin.register(BusinessModel)
class BusinessModelAdmin(admin.ModelAdmin):
    list_display = ['idea', 'user', 'revenue_model',                    'business_model_score', 'overall_verdict', 'status', 'created_at']
    list_filter = ['status', 'revenue_model', 'overall_verdict']
    search_fields = ['idea__idea_title', 'user__email']
    readonly_fields = [
        'status', 'overall_summary', 'business_model_score', 'overall_verdict',
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
        'raw_ai_response', 'error_message', 'created_at', 'updated_at',
    ]



@admin.register(MVPPlan)
class MVPPlanAdmin(admin.ModelAdmin):
    list_display  = ['idea', 'user', 'product_type', 'launch_weeks',         'mvp_score', 'mvp_verdict', 'status', 'created_at']
    list_filter   = ['status', 'product_type', 'mvp_verdict']
    search_fields = ['idea__idea_title', 'user__email']
    readonly_fields = [
        'status', 'mvp_score', 'mvp_verdict', 'mvp_summary',
        'core_features', 'nice_to_haves', 'learning_goals',
        'success_metrics', 'mvp_risks','total_duration_weeks', 'roadmap_summary', 'phases','tech_summary', 'recommended_stack', 'build_items',
        'buy_items', 'nocode_options', 'core_ip', 'tech_recommendations',
        'raw_ai_response', 'error_message', 'created_at', 'updated_at', 
    ]



@admin.register(StartupFinancials)
class StartupFinancialsAdmin(admin.ModelAdmin):
    list_display  = ['idea', 'user', 'runway_months', 'runway_status',         'breakeven_month', 'funding_score', 'status', 'created_at']
    list_filter   = ['status', 'runway_status', 'funding_verdict']
    search_fields = ['idea__idea_title', 'user__email']
    readonly_fields = [
        'status',
        'runway_months', 'runway_status', 'zero_date',
        'runway_summary', 'runway_scenarios', 'runway_recommendations',
        'breakeven_month', 'projection_summary',
        'yearly_projections', 'monthly_projections',
        'projection_milestones', 'projection_risks', 'projection_assumptions',
        'funding_verdict', 'funding_summary', 'funding_score',
        'valuation_context', 'runway_extended_months',
        'funding_milestones', 'funding_tips', 'use_of_funds_analysis',
        'raw_ai_response', 'error_message', 'created_at', 'updated_at',
    ]