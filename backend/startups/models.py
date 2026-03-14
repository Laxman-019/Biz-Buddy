from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

User = settings.AUTH_USER_MODEL

class IdeaValidation(models.Model):
    STATUS_CHOICES = [
        ('draft',     'Draft'),
        ('active',    'Active'),
        ('archived',  'Archived'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='idea_validations'
    )

    idea_title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_idea_validations'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.idea_title}"
    
    @property
    def overall_score(self):
        if hasattr(self,'scorecard'):
            return self.scorecard.total_score
        return None
    

# Idea Scorecard
class IdeaScorecard(models.Model):
    idea = models.OneToOneField(
        IdeaValidation,
        on_delete=models.CASCADE,
        related_name='scorecard'
    )
    market_demand = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(100)],
        help_text='Search trends, Social signals, Existing demand'
    )
    competition_level = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(100)],
        help_text='Market saturation score (Higher = less saturated = better)'
    )
    profit_potential = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(100)],
        help_text='Estimated margins vs industry benchmarks'
    )
    scalability = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(100)],
        help_text='Can it grow without proportional cost increase ?'
    )
    entry_barriers = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(100)],
        help_text='Technical, Regulatory, Capital Barriers (higher = low barrier = better)'
    )
    founder_fit = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(100)],
        help_text='Skills, Experiences, Passion alignment'
    )
    timing_factor = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(100)],
        help_text='Market conditions fevor launch now ?'
    )
    funding_readiness = models.IntegerField(
        validators=[MinValueValidator(0),MaxValueValidator(100)],
        help_text='Capital requirements vs typical investor interest'
    )

    # Computeted - do not set manually
    total_score = models.FloatField(default=0,editable=False)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_idea_scorecard'
        
    def date_save(self,*args, **kwargs):
        self.total_score = round((
            self.market_demand +
            self.competition_level +
            self.profit_potential +
            self.scalability +
            self.entry_barriers +
            self.founder_fit +
            self.timing_factor +
            self.funding_readiness
        )/8,2)
        super().save(*args, **kwargs)

        @property
        def score_lebel(self):
            if self.total_score >= 90:
                return 'Score launch'
            
            if self.total_score >= 75:
                return 'Promising'
            
            if self.total_score >= 60:
                return 'Needs refinement'
            
            if self.total_score >= 40:
                return 'High risk'
            
            return 'Pivot recommended'
        
        def __str__(self):
            return f"Score card - {self.idea.idea_title} ({self.total_score})"
        

# Problemvalidation
class ProblemValidation(models.Model):
    FREQUENCY_CHOICES = [
        ('daily','Daily'),
        ('weekly','Weekly'),
        ('monthly','Monthly'),
        ('rarely','Rarely')
    ]

    SEVERITY_CHOICES = [
        ('painkiller','Painkiller - must solved'),
        ('vitamin','Vitamin - nice to have'),
    ]
    
    idea = models.OneToOneField(
        IdeaValidation,
        on_delete=models.CASCADE,
        related_name='problem_validation'
    )
    problem_frequency = models.CharField(
        max_length=20,
        choices=FREQUENCY_CHOICES,
        help_text='How often does the customer face this problem ?'
    )
    problem_severity = models.CharField(
        max_length=20,
        choices=SEVERITY_CHOICES,
        help_text='Painkiller or Vitamin'
    )
    current_solution = models.TextField(
        help_text='What do people used today ? Spreadsheets, manual processes, competitors?'
    )
    willingness_to_pay = models.BooleanField(
        default=False,
        help_text="Are customers already paying for some solution?"
    )
    willingness_details = models.TextField(
        blank=True,
        help_text="Details on what they currently pay for"
    )
    monthly_search_volume = models.IntegerField(
        default=0,
        help_text="Estimated monthly searches for this problem's solution"
    )

    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_problem_validations'

        def __str__(self):
            return f"Problem - {self.idea.idea_title}"
        

# Solution Fit
class SolutionFit(models.Model):
    idea = models.OneToOneField(
        IdeaValidation,
        on_delete=models.CASCADE,
        related_name='solution_fit'
    )
    core_features = models.TextField(
        help_text='The 20% of features delivering 80% of value - MVP core'
    )
    delight_factors = models.TextField(
        blank=True,
        help_text='Features that exceed expectations and differentiate'
    )
    min_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Lowest price customers indicate they would pay'
    )
    max_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Highest price customers indicate they would pay'
    )
    purchase_trigger = models.TextField(
        help_text='What specific event makes someone decide to buy ?'
    )
    commen_objections = models.TextField(
        blank=True,
        help_text='Common reasons customer give for NOT buying'
    )
    landing_page_url = models.URLField(
        blank=True,
        help_text='Smoke test landing page url if created'
    )
    waitlist_signups = models.IntegerField(
        default=0,
        help_text='Number of wait list / pre-order signup collected'
    )

    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'startup_solution_fits'

        def __str__(self):
            return f"Solution fit - {self.idea.idea_title}"
        