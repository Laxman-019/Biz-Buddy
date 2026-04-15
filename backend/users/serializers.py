from rest_framework import serializers
from users.models import User

class RegisterSerializer(serializers.Serializer):
    user_name = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True, min_length=6)
    confirmPassword = serializers.CharField(required=True, write_only=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=20)
    
    business_type = serializers.ChoiceField(choices=['startup', 'existing'], required=True)

    industry = serializers.CharField(required=False, allow_blank=True, max_length=50)
    custom_industry = serializers.CharField(required=False, allow_blank=True, max_length=255)  # ADD THIS
    
    startup_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    funding_stage = serializers.CharField(required=False, allow_blank=True, max_length=50)
    team_size = serializers.IntegerField(required=False, allow_null=True)
    
    company_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    registration_number = serializers.CharField(required=False, allow_blank=True, max_length=100)
    year_established = serializers.IntegerField(required=False, allow_null=True)
    employee_count = serializers.IntegerField(required=False, allow_null=True)
    annual_revenue = serializers.CharField(required=False, allow_blank=True, max_length=100)
    website = serializers.URLField(required=False, allow_blank=True, max_length=200)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError({"confirmPassword": "Passwords do not match"})

        business_type = data.get('business_type')
        
        if business_type == 'startup':
            if not data.get('startup_name'):
                raise serializers.ValidationError({"startup_name": "Startup name is required for startup accounts"})
            if not data.get('industry'):
                raise serializers.ValidationError({"industry": "Industry is required for startup accounts"})
        
        elif business_type == 'existing':
            if not data.get('company_name'):
                raise serializers.ValidationError({"company_name": "Company name is required for existing business accounts"})
            if not data.get('industry'):
                raise serializers.ValidationError({"industry": "Industry is required for existing business accounts"})
        
        if data.get('industry') == 'other' and not data.get('custom_industry'):
            raise serializers.ValidationError({"custom_industry": "Please specify your industry"})
        
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class UserSerializer(serializers.ModelSerializer):
    # Add computed field for display
    business_name = serializers.SerializerMethodField()
    effective_industry = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'user_name',
            'phone_number',
            'business_type',
            'business_name',  
            'industry',
            'custom_industry',
            'effective_industry',  
            'startup_name',
            'company_name',
            'funding_stage',
            'team_size',
            'registration_number',
            'year_established',
            'employee_count',
            'annual_revenue',
            'website',
            'email_verified',  
            'created_at',
        ]
    
    def get_business_name(self, obj):
        """Get business name based on type"""
        if obj.business_type == 'startup':
            return obj.startup_name
        elif obj.business_type == 'existing':
            return obj.company_name
        return None
    
    def get_effective_industry(self, obj):
        """Get actual industry (custom if 'other')"""
        if obj.industry == 'other' and obj.custom_industry:
            return obj.custom_industry
        return obj.get_industry_display() if obj.industry else None


class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(required=True, help_text="Email verification token")
    
    def validate_token(self, value):
        if not value or len(value) < 10:
            raise serializers.ValidationError("Invalid token format")
        return value


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if user.email_verified:
                raise serializers.ValidationError("Email already verified")
        except User.DoesNotExist:
            pass  
        return value


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if not user.email_verified:
                raise serializers.ValidationError("Please verify your email first")
        except User.DoesNotExist:
            pass  
        return value


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6, write_only=True)
    confirm_password = serializers.CharField(required=True, min_length=6, write_only=True)
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        
        # Additional password strength validation (optional)
        password = data['new_password']
        if len(password) < 8:
            raise serializers.ValidationError({"new_password": "Password must be at least 8 characters long"})
        
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError({"new_password": "Password must contain at least one digit"})
        
        if not any(char.isupper() for char in password):
            raise serializers.ValidationError({"new_password": "Password must contain at least one uppercase letter"})
        
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, min_length=6, write_only=True)
    confirm_password = serializers.CharField(required=True, min_length=6, write_only=True)
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "New passwords do not match"})
        
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError({"new_password": "New password must be different from old password"})
        
        return data


class ProfileUpdateSerializer(serializers.Serializer):
    user_name = serializers.CharField(required=False, max_length=150)
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=20)
    industry = serializers.CharField(required=False, allow_blank=True, max_length=50)
    custom_industry = serializers.CharField(required=False, allow_blank=True, max_length=255)
    
    startup_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    funding_stage = serializers.CharField(required=False, allow_blank=True, max_length=50)
    team_size = serializers.IntegerField(required=False, allow_null=True)
    
    company_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    registration_number = serializers.CharField(required=False, allow_blank=True, max_length=100)
    year_established = serializers.IntegerField(required=False, allow_null=True)
    employee_count = serializers.IntegerField(required=False, allow_null=True)
    annual_revenue = serializers.CharField(required=False, allow_blank=True, max_length=100)
    website = serializers.URLField(required=False, allow_blank=True, max_length=200)
    
    def validate(self, data):
        if data.get('industry') == 'other' and not data.get('custom_industry'):
            raise serializers.ValidationError({"custom_industry": "Please specify your industry"})
        return data