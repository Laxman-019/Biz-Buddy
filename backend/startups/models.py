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
    score_profit_potential = models.FloatField(null=True, blank=True)
    score_scalability = models.FloatField(null=True, blank=True)
    score_entry_barriers = models.FloatField(null=True, blank=True)
    score_founder_fit = models.FloatField(null=True, blank=True)
    score_timing_factor = models.FloatField(null=True, blank=True)
    score_funding_readiness = models.FloatField(null=True, blank=True)
    overall_score = models.FloatField(null=True, blank=True)

    # AI Report 
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
    
    
    
class MVPPlan(models.Model):

    PRODUCT_TYPE_CHOICES = [
        ('web_app', 'Web Application'),
        ('mobile_app','Mobile App'),
        ('both', 'Web + Mobile'),
        ('physical', 'Physical Product'),
        ('service', 'Service-based'),
    ]

    TECH_SKILL_CHOICES = [
        ('fullstack', 'Full-stack Developer'),
        ('frontend', 'Frontend Only'),
        ('backend', 'Backend Only'),
        ('no_code', 'No Dev Skills — No-code only'),
        ('none', 'No Technical Skills'),
    ]

    PLATFORM_CHOICES = [
        ('web', 'Web'),
        ('mobile', 'Mobile'),
        ('both', 'Web + Mobile'),
    ]

    BUDGET_CHOICES = [
        ('lt_1l', 'Under ₹1 Lakh'),
        ('1l_5l', '₹1L – ₹5L'),
        ('5l_20l', '₹5L – ₹20L'),
        ('20l_50l', '₹20L – ₹50L'),
        ('gt_50l', 'Above ₹50L'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('analyzing', 'Analyzing'),
        ('done', 'Done'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='mvp_plans'
    )
    idea = models.ForeignKey(
        IdeaValidation, on_delete=models.CASCADE,
        related_name='mvp_plans'
    )

    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES)
    launch_weeks = models.IntegerField(help_text="Target weeks to launch")
    team_size = models.IntegerField(help_text="Number of people available to build")
    start_date = models.DateField(null=True, blank=True)
    available_budget = models.CharField(max_length=20, choices=BUDGET_CHOICES, blank=True)
    tech_skills = models.CharField(max_length=20, choices=TECH_SKILL_CHOICES, blank=True)
    platform = models.CharField(max_length=10, choices=PLATFORM_CHOICES, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    mvp_score = models.FloatField(null=True, blank=True)
    mvp_verdict = models.CharField(max_length=50, blank=True)
    mvp_summary = models.TextField(blank=True)
    core_features = models.JSONField(default=list, blank=True)
    nice_to_haves = models.JSONField(default=list, blank=True)
    learning_goals = models.JSONField(default=list, blank=True)
    success_metrics = models.JSONField(default=list, blank=True)
    mvp_risks = models.JSONField(default=list, blank=True)

    total_duration_weeks = models.IntegerField(null=True, blank=True)
    roadmap_summary = models.TextField(blank=True)
    phases = models.JSONField(default=list, blank=True)

    tech_summary = models.TextField(blank=True)
    recommended_stack = models.JSONField(default=list, blank=True)
    build_items = models.JSONField(default=list, blank=True)
    buy_items = models.JSONField(default=list, blank=True)
    nocode_options = models.JSONField(default=list, blank=True)
    core_ip = models.JSONField(default=list, blank=True)
    tech_recommendations = models.JSONField(default=list, blank=True)

    raw_ai_response = models.TextField(blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_mvp_plans'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — MVP: {self.idea.idea_title}"  
    
    
    
class StartupFinancials(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('analyzing', 'Analyzing'),
        ('done', 'Done'),
        ('failed', 'Failed'),
    ]

    RUNWAY_STATUS_CHOICES = [
        ('comfortable', 'Comfortable'),
        ('healthy', 'Healthy'),
        ('raising_soon','Raising Soon'),
        ('urgent', 'Urgent'),
        ('critical', 'Critical'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='startup_financials'
    )
    idea = models.ForeignKey(
        IdeaValidation, on_delete=models.CASCADE,
        related_name='startup_financials'
    )


    cash_on_hand = models.DecimalField(
        max_digits=14, decimal_places=2, default=0
    )
    monthly_burn_rate = models.DecimalField(
        max_digits=14, decimal_places=2, default=0
    )


    starting_monthly_revenue = models.DecimalField(
        max_digits=14, decimal_places=2, default=0
    )
    monthly_revenue_growth = models.FloatField(
        default=0, help_text="Monthly revenue growth rate in %"
    )
    current_monthly_expenses = models.DecimalField(
        max_digits=14, decimal_places=2, default=0
    )
    expense_growth_rate = models.FloatField(
        default=0, help_text="Monthly expense growth rate in %"
    )


    funding_amount_target = models.DecimalField(
        max_digits=14, decimal_places=2, default=0
    )
    funds_product_pct = models.FloatField(default=40)
    funds_marketing_pct = models.FloatField(default=30)
    funds_salaries_pct = models.FloatField(default=20)
    funds_ops_pct = models.FloatField(default=10)
    funding_milestone = models.TextField(
        blank=True, help_text="What milestone will this funding help reach?"
    )


    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )


    runway_months = models.FloatField(null=True, blank=True)
    runway_status = models.CharField(
        max_length=20, choices=RUNWAY_STATUS_CHOICES, blank=True
    )
    zero_date = models.CharField(max_length=50, blank=True)
    runway_summary = models.TextField(blank=True)
    runway_scenarios = models.JSONField(default=list, blank=True)
    runway_recommendations= models.JSONField(default=list, blank=True)


    breakeven_month = models.IntegerField(null=True, blank=True)
    projection_summary = models.TextField(blank=True)
    yearly_projections = models.JSONField(default=list, blank=True)
    monthly_projections = models.JSONField(default=list, blank=True)
    projection_milestones = models.JSONField(default=list, blank=True)
    projection_risks = models.JSONField(default=list, blank=True)
    projection_assumptions= models.JSONField(default=list, blank=True)


    funding_verdict = models.CharField(max_length=50, blank=True)
    funding_summary = models.TextField(blank=True)
    funding_score = models.FloatField(null=True, blank=True)
    valuation_context = models.TextField(blank=True)
    runway_extended_months= models.FloatField(null=True, blank=True)
    funding_milestones = models.JSONField(default=list, blank=True)
    funding_tips = models.JSONField(default=list, blank=True)
    use_of_funds_analysis = models.TextField(blank=True)


    raw_ai_response = models.TextField(blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_financials'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — Financials: {self.idea.idea_title}"
    

class InvestorReadiness(models.Model):

    FUNDING_STAGE_CHOICES = [
        ('pre_seed', 'Pre-seed'),
        ('seed', 'Seed'),
        ('series_a', 'Series A'),
    ]

    COMPANY_STAGE_CHOICES = [
        ('idea', 'Idea Stage'),
        ('mvp', 'MVP Built'),
        ('revenue', 'Early Revenue'),
        ('growth', 'Growing Revenue'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('analyzing', 'Analyzing'),
        ('done', 'Done'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='investor_readiness'
    )
    idea = models.ForeignKey(
        IdeaValidation, on_delete=models.CASCADE,
        related_name='investor_readiness'
    )

    funding_stage = models.CharField(
        max_length=20, choices=FUNDING_STAGE_CHOICES
    )
    amount_raising = models.DecimalField(
        max_digits=14, decimal_places=2
    )
    team_description = models.TextField(
        help_text="Brief description of founding team and their backgrounds"
    )
    traction_so_far = models.TextField(
        help_text="Any traction — users, revenue, partnerships, pilots"
    )

    company_stage = models.CharField(
        max_length=20, choices=COMPANY_STAGE_CHOICES
    )
    completed_items = models.JSONField(
        default=list, blank=True,
        help_text="List of DD items already completed"
    )

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )

    pitch_score = models.FloatField(null=True, blank=True)
    pitch_verdict = models.CharField(max_length=50, blank=True)
    pitch_summary = models.TextField(blank=True)
    pitch_slides  = models.JSONField(default=list, blank=True)
    investor_questions = models.JSONField(default=list, blank=True)
    storytelling_tips = models.JSONField(default=list, blank=True)
    investor_list = models.JSONField(default=list, blank=True)
    outreach_template = models.TextField(blank=True)
    warm_intro_strategy = models.TextField(blank=True)
    investor_tips = models.JSONField(default=list, blank=True)
    dd_score = models.FloatField(null=True, blank=True)
    dd_summary = models.TextField(blank=True)
    dd_checklist  = models.JSONField(default=list, blank=True)
    dd_priority_items = models.JSONField(default=list, blank=True)
    dd_red_flags = models.JSONField(default=list, blank=True)
    dd_preparation_tips = models.JSONField(default=list, blank=True)
    raw_ai_response = models.TextField(blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_investor_readiness'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — Investor: {self.idea.idea_title}"
    
class GoToMarket(models.Model):

    PRICING_MODEL_CHOICES = [
        ('subscription', 'Subscription'),
        ('one_time', 'One-time Purchase'),
        ('freemium', 'Freemium'),
        ('usage_based', 'Usage-based'),
        ('tiered', 'Tiered Pricing'),
        ('not_decided', 'Not decided yet'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('analyzing', 'Analyzing'),
        ('done', 'Done'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='go_to_market'
    )
    idea = models.ForeignKey(
        IdeaValidation, on_delete=models.CASCADE,
        related_name='go_to_market'
    )

    beachhead_market = models.TextField(
        help_text="Specific segment to dominate first"
    )
    launch_weeks = models.IntegerField(
        help_text="Weeks from now to launch"
    )
    launch_budget = models.DecimalField(
        max_digits=12, decimal_places=2,
        help_text="Total launch budget in ₹"
    )

    monthly_acq_budget   = models.DecimalField(
        max_digits=12, decimal_places=2,
        help_text="Monthly customer acquisition budget in ₹"
    )
    target_monthly_customers = models.IntegerField(
        help_text="Target new customers per month"
    )
    preferred_channels = models.JSONField(
        default=list,
        help_text="List of preferred acquisition channels"
    )

    current_price = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Current or planned price per customer (₹)"
    )
    competitor_price_min  = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        help_text="Lowest competitor price (₹)"
    )
    competitor_price_max  = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        help_text="Highest competitor price (₹)"
    )
    pricing_model         = models.CharField(
        max_length=20, choices=PRICING_MODEL_CHOICES
    )


    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )
    launch_score = models.FloatField(null=True, blank=True)
    launch_verdict = models.CharField(max_length=50, blank=True)
    launch_summary = models.TextField(blank=True)
    beachhead_analysis = models.TextField(blank=True)
    launch_channels = models.JSONField(default=list, blank=True)
    first_90_days = models.JSONField(default=list, blank=True)
    pr_strategy = models.TextField(blank=True)
    launch_risks = models.JSONField(default=list, blank=True)
    launch_tips = models.JSONField(default=list, blank=True)
    acq_summary = models.TextField(blank=True)
    acq_score = models.FloatField(null=True, blank=True)
    channel_strategies = models.JSONField(default=list, blank=True)
    budget_allocation = models.JSONField(default=list, blank=True)
    growth_hacks = models.JSONField(default=list, blank=True)
    channel_priority = models.JSONField(default=list, blank=True)
    projected_cac = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    pricing_score = models.FloatField(null=True, blank=True)
    pricing_verdict = models.CharField(max_length=50, blank=True)
    pricing_summary = models.TextField(blank=True)
    recommended_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    pricing_rationale = models.TextField(blank=True)
    package_tiers = models.JSONField(default=list, blank=True)
    psychological_tips = models.JSONField(default=list, blank=True)
    price_testing_plan = models.TextField(blank=True)
    annual_strategy = models.TextField(blank=True)
    raw_ai_response = models.TextField(blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_go_to_market'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — GTM: {self.idea.idea_title}"