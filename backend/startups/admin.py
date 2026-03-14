from django.contrib import admin
from startups.models import *


class IdeaScorecardInline(admin.StackedInline):
    model = IdeaScorecard
    extra = 0
    readonly_fields = ['total_score']


class ProblemValidationInline(admin.StackedInline):
    model = ProblemValidation
    extra = 0


class SolutionFitInline(admin.StackedInline):
    model = SolutionFit
    extra = 0


@admin.register(IdeaValidation)
class IdeaValidationAdmin(admin.ModelAdmin):
    list_display  = ['idea_title', 'user', 'status', 'overall_score', 'created_at']
    list_filter   = ['status', 'created_at']
    search_fields = ['idea_title', 'user__email']
    inlines       = [IdeaScorecardInline, ProblemValidationInline, SolutionFitInline]
    readonly_fields = ['created_at', 'updated_at']