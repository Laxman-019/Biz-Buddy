from django.contrib.auth.models import AbstractUser
from django.db import models
import secrets
from datetime import timedelta
from django.utils import timezone

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

    email_verified = models.BooleanField(
        default=False, 
        help_text="Whether the user's email has been verified"
    )
    email_verification_token = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Token for email verification"
    )
    email_verification_sent_at = models.DateTimeField(
        blank=True, 
        null=True,
        help_text="Timestamp when verification email was sent"
    )

    password_reset_token = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Token for password reset"
    )
    password_reset_sent_at = models.DateTimeField(
        blank=True, 
        null=True,
        help_text="Timestamp when password reset email was sent"
    )

    failed_login_attempts = models.IntegerField(
        default=0,
        help_text="Number of failed login attempts"
    )
    locked_until = models.DateTimeField(
        blank=True, 
        null=True,
        help_text="Account locked until this timestamp"
    )
    last_login_ip = models.GenericIPAddressField(
        blank=True, 
        null=True,
        help_text="IP address of last login"
    )
    
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

    def generate_verification_token(self):
        """Generate a new email verification token"""
        token = secrets.token_urlsafe(32)
        self.email_verification_token = token
        self.email_verification_sent_at = timezone.now()
        self.save(update_fields=['email_verification_token', 'email_verification_sent_at'])
        return token
    
    def is_verification_token_expired(self):
        """Check if verification token has expired (24 hours)"""
        if not self.email_verification_sent_at:
            return True
        expiry_time = self.email_verification_sent_at + timedelta(hours=24)
        return timezone.now() > expiry_time
    
    def verify_email(self, token):
        """Verify email with token"""
        if (self.email_verification_token == token and 
            not self.email_verified and 
            not self.is_verification_token_expired()):
            self.email_verified = True
            self.is_active = True
            self.email_verification_token = None
            self.email_verification_sent_at = None
            self.save()
            return True
        return False
    
    
    def generate_password_reset_token(self):
        """Generate a new password reset token"""
        token = secrets.token_urlsafe(32)
        self.password_reset_token = token
        self.password_reset_sent_at = timezone.now()
        self.save(update_fields=['password_reset_token', 'password_reset_sent_at'])
        return token
    
    def is_password_reset_token_expired(self):
        """Check if password reset token has expired (1 hour)"""
        if not self.password_reset_sent_at:
            return True
        expiry_time = self.password_reset_sent_at + timedelta(hours=1)
        return timezone.now() > expiry_time
    
    def reset_password(self, token, new_password):
        """Reset password using token"""
        if (self.password_reset_token == token and 
            not self.is_password_reset_token_expired()):
            self.set_password(new_password)
            self.password_reset_token = None
            self.password_reset_sent_at = None
            self.save()
            return True
        return False

    
    def increment_failed_login(self):
        """Increment failed login attempts and lock account if needed"""
        self.failed_login_attempts += 1
        
        # Lock account after 5 failed attempts
        if self.failed_login_attempts >= 5:
            self.locked_until = timezone.now() + timedelta(minutes=30)
        
        self.save(update_fields=['failed_login_attempts', 'locked_until'])
        return self.failed_login_attempts
    
    def reset_failed_login_attempts(self):
        """Reset failed login attempts after successful login"""
        self.failed_login_attempts = 0
        self.locked_until = None
        self.save(update_fields=['failed_login_attempts', 'locked_until'])
    
    def is_account_locked(self):
        """Check if account is currently locked"""
        if self.locked_until and timezone.now() < self.locked_until:
            return True
        elif self.locked_until and timezone.now() >= self.locked_until:
            # Auto-unlock after lock period
            self.locked_until = None
            self.failed_login_attempts = 0
            self.save(update_fields=['locked_until', 'failed_login_attempts'])
        return False
    
    def update_last_login_ip(self, ip_address):
        """Update last login IP address"""
        self.last_login_ip = ip_address
        self.save(update_fields=['last_login_ip'])


    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['email_verification_token']),
            models.Index(fields=['password_reset_token']),
            models.Index(fields=['business_type']),
            models.Index(fields=['created_at']),
        ]