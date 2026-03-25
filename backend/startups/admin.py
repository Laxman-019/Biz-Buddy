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
    list_display = ['idea', 'user', 'revenue_model', 'business_model_score', 'overall_verdict', 'status', 'created_at']
    list_filter = ['status', 'revenue_model', 'overall_verdict']
    search_fields = ['idea__idea_title', 'user__email']
    readonly_fields = [
        'status', 'overall_summary', 'business_model_score', 'overall_verdict',
        'canvas_problem', 'canvas_solution', 'canvas_uvp', 'canvas_unfair_advantage', 
        'canvas_customer_segments', 'canvas_channels', 'canvas_revenue_streams', 
        'canvas_cost_structure', 'canvas_key_matrics', 'revenue_model_analysis',
        'revenue_model_recommended', 'revenue_model_reasoning', 'pricing_recommendation',
        'ltv_estimate', 'ltv_explanation', 'cac_analysis', 'ltv_cac_ratio', 'ltv_cac_verdict',
        'payback_period_months', 'payback_verdict', 'contribution_margin', 'unit_economics_score',
        'recommendations', 'risks', 'raw_ai_response', 'error_message', 'created_at', 'updated_at'
    ]