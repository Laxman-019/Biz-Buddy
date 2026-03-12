from rest_framework import serializers
from users.models import User

class RegisterSerializer(serializers.Serializer):
    # Common fields
    user_name = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True, min_length=6)
    confirmPassword = serializers.CharField(required=True, write_only=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=20)
    
    # Business type
    business_type = serializers.ChoiceField(choices=['startup', 'existing'], required=True)
    
    # Common business fields
    industry = serializers.CharField(required=False, allow_blank=True, max_length=50)
    
    # Startup specific fields
    startup_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    funding_stage = serializers.CharField(required=False, allow_blank=True, max_length=50)
    team_size = serializers.IntegerField(required=False, allow_null=True)
    
    # Existing business specific fields
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
        # Password confirmation check
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError({"confirmPassword": "Passwords do not match"})

        # Validate based on business type
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
        
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)