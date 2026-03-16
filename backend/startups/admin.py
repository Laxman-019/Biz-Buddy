from django.contrib import admin
from .models import IdeaValidation


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