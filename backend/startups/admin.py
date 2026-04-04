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
    
    


@admin.register(InvestorReadiness)
class InvestorReadinessAdmin(admin.ModelAdmin):
    list_display = ['idea', 'user', 'funding_stage',                     'pitch_score', 'pitch_verdict', 'dd_score', 'status', 'created_at']
    list_filter = ['status', 'funding_stage', 'pitch_verdict']
    search_fields = ['idea__idea_title', 'user__email']
    readonly_fields = [
        'status',
        'pitch_score', 'pitch_verdict', 'pitch_summary',
        'pitch_slides', 'investor_questions', 'storytelling_tips',
        'investor_list', 'outreach_template',
        'warm_intro_strategy', 'investor_tips',
        'dd_score', 'dd_summary', 'dd_checklist',
        'dd_priority_items', 'dd_red_flags', 'dd_preparation_tips',
        'raw_ai_response', 'error_message', 'created_at', 'updated_at',
    ]



@admin.register(GoToMarket)
class GoToMarketAdmin(admin.ModelAdmin):
    list_display  = ['idea', 'user', 'launch_weeks',                    'launch_score', 'launch_verdict','pricing_score', 'status', 'created_at']
    list_filter   = ['status', 'launch_verdict', 'pricing_verdict']
    search_fields = ['idea__idea_title', 'user__email']
    readonly_fields = [
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
        'raw_ai_response', 'error_message', 'created_at', 'updated_at',
    ]



@admin.register(StartupKPIs)
class StartupKPIsAdmin(admin.ModelAdmin):
    list_display  = ['idea', 'user', 'north_star_metric', 'retention_score', 'k_factor', 'status', 'created_at']
    list_filter   = ['status', 'retention_verdict', 'viral_verdict']
    search_fields = ['idea__idea_title', 'user__email']
    readonly_fields = [
        'status', 'north_star_metric', 'north_star_why',
        'north_star_how_to_measure', 'supporting_metrics',
        'kpi_benchmarks', 'warning_signs', 'tracking_recommendations',
        'retention_score', 'retention_verdict', 'retention_summary',
        'pmf_assessment', 'benchmark_comparison',
        'churn_reasons', 'retention_strategies', 'retention_quick_wins',
        'k_factor', 'viral_verdict', 'viral_summary',
        'viral_loop_design', 'k_factor_improvements',
        'growth_projections', 'viral_examples',
        'raw_ai_response', 'error_message', 'created_at', 'updated_at',
    ]


@admin.register(TeamCulture)
class TeamCultureAdmin(admin.ModelAdmin):
    list_display  = ['idea', 'user', 'team_score', 'team_verdict',
                     'hiring_score', 'advisory_score', 'status', 'created_at']
    list_filter   = ['status', 'team_verdict', 'work_mode']
    search_fields = ['idea__idea_title', 'user__email']
    readonly_fields = [
        'status',
        'team_score', 'team_verdict', 'team_summary',
        'skills_gap_analysis', 'equity_assessment',
        'vesting_recommendation', 'conflict_risks',
        'team_recommendations', 'founder_agreements',
        'hiring_score', 'hiring_summary', 'hiring_roadmap',
        'recruitment_channels', 'culture_values',
        'first_10_guide', 'compensation_benchmarks', 'hiring_mistakes',
        'advisory_score', 'advisory_summary', 'ideal_advisors',
        'advisor_equity_guide', 'where_to_find',
        'outreach_approach', 'meeting_cadence', 'advisor_red_flags',
        'raw_ai_response', 'error_message', 'created_at', 'updated_at',
    ]



@admin.register(StartupRisks)
class StartupRisksAdmin(admin.ModelAdmin):
    list_display  = ['idea', 'user', 'overall_risk_score',                     'overall_risk_level', 'status', 'created_at']
    list_filter   = ['status', 'overall_risk_level', 'business_type']
    search_fields = ['idea__idea_title', 'user__email']
    readonly_fields = [
        'status',
        'overall_risk_score', 'overall_risk_level', 'risk_summary',
        'risk_register', 'legal_summary', 'legal_checklist', 'immediate_legal_actions', 'mitigation_summary', 'mitigation_actions',
        'risk_monitoring_plan', 'insurance_recommendations',
        'raw_ai_response', 'error_message', 'created_at', 'updated_at',
    ]