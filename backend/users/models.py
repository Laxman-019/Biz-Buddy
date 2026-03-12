from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Business type choices
    BUSINESS_TYPE_CHOICES = [
        ('startup', 'Startup'),
        ('existing', 'Existing Business'),
    ]
    
    # Funding stage choices for startups
    FUNDING_STAGE_CHOICES = [
        ('pre_seed', 'Pre-seed'),
        ('seed', 'Seed'),
        ('series_a', 'Series A'),
        ('series_b', 'Series B'),
        ('series_c', 'Series C+'),
        ('bootstrapped', 'Bootstrapped'),
        ('not_applicable', 'Not Applicable'),
    ]
    
    # Industry choices
    INDUSTRY_CHOICES = [
        ('technology', 'Technology'),
        ('healthcare', 'Healthcare'),
        ('finance', 'Finance'),
        ('education', 'Education'),
        ('ecommerce', 'E-commerce'),
        ('manufacturing', 'Manufacturing'),
        ('realestate', 'Real Estate'),
        ('hospitality', 'Hospitality'),
        ('consulting', 'Consulting'),
        ('retail', 'Retail'),
        ('construction', 'Construction'),
        ('transportation', 'Transportation'),
        ('other', 'Other'),
    ]
    
    username = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique=True)
    
    # Common fields (from your signup form)
    user_name = models.CharField(max_length=255, verbose_name="Full Name")
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    # Business type
    business_type = models.CharField(max_length=20, choices=BUSINESS_TYPE_CHOICES)
    
    # Common business fields
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES, blank=True, null=True)
    custom_industry = models.CharField(max_length=255, blank=True, null=True, help_text="Custom industry if 'other' is selected")
    
    # Startup specific fields
    startup_name = models.CharField(max_length=255, blank=True, null=True)
    funding_stage = models.CharField(max_length=20, choices=FUNDING_STAGE_CHOICES, blank=True, null=True)
    team_size = models.IntegerField(blank=True, null=True, help_text="Number of team members")
    
    # Existing business specific fields
    company_name = models.CharField(max_length=255, blank=True, null=True)
    registration_number = models.CharField(max_length=100, blank=True, null=True)
    year_established = models.IntegerField(blank=True, null=True)
    employee_count = models.IntegerField(blank=True, null=True)
    annual_revenue = models.CharField(max_length=100, blank=True, null=True, help_text="e.g., ₹1cr - ₹5cr")
    website = models.URLField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['user_name', 'business_type']

    def __str__(self):
        if self.business_type == 'startup' and self.startup_name:
            return f"{self.startup_name} ({self.email})"
        elif self.business_type == 'existing' and self.company_name:
            return f"{self.company_name} ({self.email})"
        return self.email

    def get_business_name(self):
        """Get the appropriate business name based on business type"""
        if self.business_type == 'startup':
            return self.startup_name
        elif self.business_type == 'existing':
            return self.company_name
        return None

    def get_effective_industry(self):
        """Get the actual industry (custom if other was selected)"""
        if self.industry == 'other' and self.custom_industry:
            return self.custom_industry
        return self.get_industry_display() if self.industry else None

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'