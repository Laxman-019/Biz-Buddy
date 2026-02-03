from rest_framework import serializers
from users.models import *


class RegisterSerializer(serializers.Serializer):

    user_name = serializers.CharField(
        required=True,
        max_length=150
    )

    email = serializers.EmailField(required=True)

    password = serializers.CharField(
        required=True,
        write_only=True,
        min_length=6
    )

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
