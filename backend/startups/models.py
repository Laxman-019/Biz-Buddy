from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class IdeaValidation(models.Model):

    STATUS_CHOICES = [
        ('pending','Pending Analysis'),
        ('analyzing','Analyzing'),
        ('done','Done'),
        ('failed','Failed'),
    ]

    VERDICT_CHOICES = [
        ('strong_go', 'Strong GO'),
        ('go','GO'),
        ('caution','Proceed with Caution'),
        ('no_go','NO-GO'),
        ('pivot','Pivot Recommended'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='idea_validations'
    )

    # User Input 
    idea_title = models.CharField(max_length=255)
    idea_description = models.TextField(
        help_text="User describes their idea in plain text"
    )

    # Analysis Status 
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )

    # AI Report — Scores (0-100)
    score_market_demand= models.FloatField(null=True, blank=True)
    score_competition= models.FloatField(null=True, blank=True)
    score_profit_potential  = models.FloatField(null=True, blank=True)
    score_scalability       = models.FloatField(null=True, blank=True)
    score_entry_barriers    = models.FloatField(null=True, blank=True)
    score_founder_fit       = models.FloatField(null=True, blank=True)
    score_timing_factor     = models.FloatField(null=True, blank=True)
    score_funding_readiness = models.FloatField(null=True, blank=True)
    overall_score           = models.FloatField(null=True, blank=True)

    # AI Report — Analysis Text
    verdict = models.CharField(
        max_length=20, choices=VERDICT_CHOICES, null=True, blank=True
    )
    verdict_summary = models.TextField(blank=True)
    market_demand_analysis = models.TextField(blank=True)
    competition_analysis = models.TextField(blank=True)
    profit_analysis = models.TextField(blank=True)
    scalability_analysis = models.TextField(blank=True)
    entry_barriers_analysis = models.TextField(blank=True)
    founder_fit_analysis = models.TextField(blank=True)
    timing_analysis = models.TextField(blank=True)
    funding_analysis = models.TextField(blank=True)
    key_risks = models.JSONField(default=list, blank=True)
    next_steps = models.JSONField(default=list, blank=True)
    opportunities = models.JSONField(default=list, blank=True)

    # Raw AI response 
    raw_ai_response = models.TextField(blank=True)

    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_idea_validations'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — {self.idea_title}"

    @property
    def dimension_scores(self):
        return {
            'Market Demand':self.score_market_demand,
            'Competition':self.score_competition,
            'Profit Potential':self.score_profit_potential,
            'Scalability':self.score_scalability,
            'Entry Barriers':self.score_entry_barriers,
            'Founder Fit':self.score_founder_fit,
            'Timing Factor':self.score_timing_factor,
            'Funding Readiness': self.score_funding_readiness,
        }


class MarketIntelligence(models.Model):

    CUSTOMER_TYPE_CHOICES = [
        ('b2b','B2B — Business to Business'),
        ('b2c','B2C — Business to Consumer'),
        ('both','Both B2B and B2C'),
    ]

    REGION_CHOICES = [
        ('india','India'),
        ('global','Global'),
        ('north_india','North India'),
        ('south_india','South India'),
        ('east_india','East India'),
        ('west_india','West India'),
        ('tier1_cities','Tier 1 Cities'),
        ('tier2_cities','Tier 2 & 3 Cities'),
        ('southeast_asia','Southeast Asia'),
        ('us','United States'),
        ('europe','Europe'),
    ]

    STATUS_CHOICES = [
        ('pending','Pending'),
        ('analyzing','Analyzing'),
        ('done','Done'),
        ('failed','Failed'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='market_intelligence'
    )

    product_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    target_region = models.CharField(max_length=50, choices=REGION_CHOICES)
    customer_type = models.CharField(max_length=10, choices=CUSTOMER_TYPE_CHOICES)
    description = models.TextField(
        help_text="Brief description of product and target customer"
    )

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )

    tam_value = models.CharField(max_length=100, blank=True)
    tam_explanation = models.TextField(blank=True)
    sam_value = models.CharField(max_length=100, blank=True)
    sam_explanation = models.TextField(blank=True)
    som_value = models.CharField(max_length=100, blank=True)
    som_explanation = models.TextField(blank=True)
    sizing_methodology = models.TextField(blank=True)

    market_growth_rate = models.CharField(max_length=50, blank=True)
    market_direction = models.CharField(max_length=20, blank=True)
    tailwinds = models.JSONField(default=list, blank=True)
    headwinds = models.JSONField(default=list, blank=True)
    tech_shifts = models.JSONField(default=list, blank=True)
    regulatory_factors = models.JSONField(default=list, blank=True)
    consumer_shifts = models.JSONField(default=list, blank=True)
    trend_summary = models.TextField(blank=True)

    personas = models.JSONField(default=list, blank=True)

    key_insights = models.JSONField(default=list, blank=True)
    market_summary = models.TextField(blank=True)

    raw_ai_response = models.TextField(blank=True)
    error_message = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_market_intelligence'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — {self.product_name}"


class BusinessModel(models.Model):

    REVENUE_MODEL_CHOICES = [
        ('subscription','Subscription (Monthly/Annual)'),
        ('one_time','One-time Purchase'),
        ('freemium','Freemium'),
        ('marketplace','Marketplace (Take Rate)'),
        ('advertising','Advertising'),
        ('usage_based','Usage-based / Pay per use'),
        ('licensing','Licensing'),
        ('not_decided','Not decided yet'),
    ]

    STATUS_CHOICES = [
        ('pending','Pending'),
        ('analyzing', 'Analyzing'),
        ('done','Done'),
        ('failed','Failed'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='business_models'
    )
    idea = models.ForeignKey(
        IdeaValidation, on_delete=models.CASCADE,
        related_name='business_models'
    )

    # User Inputs 
    revenue_model = models.CharField(max_length=20, choices=REVENUE_MODEL_CHOICES)
    price_per_customer = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Estimated price per customer per month (₹)"
    )
    estimated_cac = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Estimated monthly customer acquisition cost (₹)"
    )
    additional_context = models.TextField(
        blank=True,
        help_text="Any extra context — target segment, delivery method, etc."
    )

    # Status 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    canvas_problem = models.TextField(blank=True)
    canvas_solution = models.TextField(blank=True)
    canvas_uvp = models.TextField(blank=True)
    canvas_unfair_advantage = models.TextField(blank=True)
    canvas_customer_segments = models.TextField(blank=True)
    canvas_channels = models.TextField(blank=True)
    canvas_revenue_streams = models.TextField(blank=True)
    canvas_cost_structure = models.TextField(blank=True)
    canvas_key_metrics = models.TextField(blank=True)

    # Revenue Model Analysis
    revenue_model_analysis = models.TextField(blank=True)
    revenue_model_recommended = models.CharField(max_length=100, blank=True)
    revenue_model_reasoning = models.TextField(blank=True)
    pricing_recommendation = models.TextField(blank=True)

    # Unit Economics 
    ltv_estimate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    ltv_explanation = models.TextField(blank=True)
    cac_analysis = models.TextField(blank=True)
    ltv_cac_ratio = models.FloatField(null=True, blank=True)
    ltv_cac_verdict = models.CharField(max_length=50, blank=True)
    payback_period_months = models.FloatField(null=True, blank=True)
    payback_verdict = models.CharField(max_length=50, blank=True)
    contribution_margin = models.TextField(blank=True)
    unit_economics_score  = models.FloatField(null=True, blank=True)

    # Overall 
    business_model_score  = models.FloatField(null=True, blank=True)
    overall_verdict = models.CharField(max_length=50, blank=True)
    overall_summary = models.TextField(blank=True)
    recommendations = models.JSONField(default=list, blank=True)
    risks = models.JSONField(default=list, blank=True)

    raw_ai_response = models.TextField(blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_business_models'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — {self.idea.idea_title}"