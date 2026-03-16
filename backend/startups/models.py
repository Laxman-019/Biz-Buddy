from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class IdeaValidation(models.Model):

    STATUS_CHOICES = [
        ('pending',   'Pending Analysis'),
        ('analyzing', 'Analyzing'),
        ('done',      'Done'),
        ('failed',    'Failed'),
    ]

    VERDICT_CHOICES = [
        ('strong_go',  'Strong GO'),
        ('go',         'GO'),
        ('caution',    'Proceed with Caution'),
        ('no_go',      'NO-GO'),
        ('pivot',      'Pivot Recommended'),
    ]

    user            = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='idea_validations'
    )

    # User Input 
    idea_title      = models.CharField(max_length=255)
    idea_description = models.TextField(
        help_text="User describes their idea in plain text"
    )

    # Analysis Status 
    status          = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )

    # AI Report — Scores (0-100)
    score_market_demand     = models.FloatField(null=True, blank=True)
    score_competition       = models.FloatField(null=True, blank=True)
    score_profit_potential  = models.FloatField(null=True, blank=True)
    score_scalability       = models.FloatField(null=True, blank=True)
    score_entry_barriers    = models.FloatField(null=True, blank=True)
    score_founder_fit       = models.FloatField(null=True, blank=True)
    score_timing_factor     = models.FloatField(null=True, blank=True)
    score_funding_readiness = models.FloatField(null=True, blank=True)
    overall_score           = models.FloatField(null=True, blank=True)

    # AI Report — Analysis Text
    verdict              = models.CharField(
        max_length=20, choices=VERDICT_CHOICES, null=True, blank=True
    )
    verdict_summary      = models.TextField(blank=True)
    market_demand_analysis     = models.TextField(blank=True)
    competition_analysis       = models.TextField(blank=True)
    profit_analysis            = models.TextField(blank=True)
    scalability_analysis       = models.TextField(blank=True)
    entry_barriers_analysis    = models.TextField(blank=True)
    founder_fit_analysis       = models.TextField(blank=True)
    timing_analysis            = models.TextField(blank=True)
    funding_analysis           = models.TextField(blank=True)
    key_risks                  = models.JSONField(default=list, blank=True)
    next_steps                 = models.JSONField(default=list, blank=True)
    opportunities              = models.JSONField(default=list, blank=True)

    # Raw AI response (for debugging)
    raw_ai_response     = models.TextField(blank=True)

    error_message       = models.TextField(blank=True)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_idea_validations'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — {self.idea_title}"

    @property
    def dimension_scores(self):
        return {
            'Market Demand':     self.score_market_demand,
            'Competition':       self.score_competition,
            'Profit Potential':  self.score_profit_potential,
            'Scalability':       self.score_scalability,
            'Entry Barriers':    self.score_entry_barriers,
            'Founder Fit':       self.score_founder_fit,
            'Timing Factor':     self.score_timing_factor,
            'Funding Readiness': self.score_funding_readiness,
        }