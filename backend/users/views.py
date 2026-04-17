from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.hashers import make_password
import logging
import secrets
from .serializers import *
from .models import User


logger = logging.getLogger(__name__)


def generate_verification_token():
    # Generate a secure random token
    return secrets.token_urlsafe(32)

def send_verification_email(user, token):
    # Send email verification link using Django templates
    try:
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        verification_link = f"{frontend_url}/verify-email?token={token}"
        
        context = {
            'user_name': user.user_name,
            'verification_link': verification_link,
            'expiry_hours': 24,
            'year': timezone.now().year
        }
        
        html_content = render_to_string('users/emails/verification_email.html', context)
        text_content = render_to_string('users/emails/verification_email.txt', context)
        
        subject = "Verify Your Email Address - BizBuddy"
        email = EmailMultiAlternatives(
            subject, text_content, settings.DEFAULT_FROM_EMAIL, [user.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        
        logger.info(f"Verification email sent to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
        return False


def send_password_reset_email(user, token):
    # Send password reset link using Django templates
    try:
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        reset_link = f"{frontend_url}/reset-password?token={token}"
        
        context = {
            'user_name': user.user_name,
            'reset_link': reset_link,
            'expiry_minutes': 60,
            'year': timezone.now().year
        }
        
        html_content = render_to_string('users/emails/password_reset_email.html', context)
        text_content = render_to_string('users/emails/password_reset_email.txt', context)
        
        subject = "Password Reset Request - BizBuddy"
        email = EmailMultiAlternatives(
            subject, text_content, settings.DEFAULT_FROM_EMAIL, [user.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        
        logger.info(f"Password reset email sent to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send password reset email to {user.email}: {str(e)}")
        return False



@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    # Register new user with email verification
    serializer = RegisterSerializer(data=request.data)
    
    if not serializer.is_valid():
        error_messages = {}
        for field, errors in serializer.errors.items():
            error_messages[field] = errors[0] if isinstance(errors, list) else errors
        
        return Response(
            {"message": "Registration failed", "errors": error_messages},
            status=400
        )

    validated_data = serializer.validated_data
    
    # Create user (inactive until email verification)
    user_data = {
        'username': validated_data['user_name'],
        'email': validated_data['email'],
        'password': validated_data['password'],
        'user_name': validated_data['user_name'],
        'phone_number': validated_data.get('phone_number', ''),
        'business_type': validated_data['business_type'],
        'industry': validated_data.get('industry', ''),
        'is_active': False,
        'email_verified': False,
    }
    
    # Handle custom industry
    if validated_data.get('industry') == 'other' and validated_data.get('custom_industry'):
        user_data['custom_industry'] = validated_data['custom_industry']
    
    # Add startup-specific fields
    if validated_data['business_type'] == 'startup':
        user_data.update({
            'startup_name': validated_data.get('startup_name', ''),
            'funding_stage': validated_data.get('funding_stage', ''),
            'team_size': validated_data.get('team_size'),
        })
    
    # Add existing business-specific fields
    else:
        user_data.update({
            'company_name': validated_data.get('company_name', ''),
            'registration_number': validated_data.get('registration_number', ''),
            'year_established': validated_data.get('year_established'),
            'employee_count': validated_data.get('employee_count'),
            'annual_revenue': validated_data.get('annual_revenue', ''),
            'website': validated_data.get('website', ''),
        })

    try:
        user = User.objects.create_user(**user_data)
        
        # Generate and send verification token
        token = generate_verification_token()
        user.email_verification_token = token
        user.email_verification_sent_at = timezone.now()
        user.save()
        
        # Send verification email
        email_sent = send_verification_email(user, token)
        
        response_data = {
            "message": "Registration successful! Please check your email to verify your account.",
            "user_id": user.id,
            "email": user.email,
            "business_type": user.business_type,
            "requires_verification": True
        }
        
        if user.business_type == 'startup' and user.startup_name:
            response_data["business_name"] = user.startup_name
        elif user.business_type == 'existing' and user.company_name:
            response_data["business_name"] = user.company_name
            
        if not email_sent:
            response_data["warning"] = "Could not send verification email. Please contact support."
        
        return Response(response_data, status=201)
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return Response({"message": f"Registration failed: {str(e)}"}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    # Login user with email verification check
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=400
        )

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    try:
        user = User.objects.get(email=email)
        
        # Check if account is locked
        if user.is_account_locked():
            remaining_time = (user.locked_until - timezone.now()).seconds // 60
            return Response(
                {"message": f"Account is locked. Try again in {remaining_time} minutes."},
                status=403
            )
        
        # Authenticate user
        user = authenticate(username=email, password=password)
        
        if user is None:
            try:
                target_user = User.objects.get(email=email)
                target_user.increment_failed_login()
            except User.DoesNotExist:
                pass
            
            return Response(
                {"message": "Invalid email or password"},
                status=401
            )
        
        # Check if email is verified
        if not user.email_verified:
            return Response({
                "message": "Please verify your email before logging in",
                "requires_verification": True,
                "email": user.email
            }, status=403)
        
        # Check if account is active
        if not user.is_active:
            return Response({"message": "Account is deactivated"}, status=403)
        
        # Reset failed login attempts on successful login
        user.reset_failed_login_attempts()
        
        # Update last login IP
        ip_address = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))
        if ip_address:
            user.update_last_login_ip(ip_address.split(',')[0].strip())
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        user_data = {
            "id": user.id,
            "email": user.email,
            "user_name": user.user_name,
            "business_type": user.business_type,
        }
        
        if user.business_type == 'startup' and user.startup_name:
            user_data["business_name"] = user.startup_name
        elif user.business_type == 'existing' and user.company_name:
            user_data["business_name"] = user.company_name
        
        return Response({
            "message": "Login Successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.business_type,
            "user": user_data
        })
        
    except User.DoesNotExist:
        return Response({"message": "Invalid email or password"}, status=401)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    # Verify user's email address with token
    serializer = EmailVerificationSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=400
        )
    
    token = serializer.validated_data['token']
    
    try:
        user = User.objects.get(email_verification_token=token)
        
        if user.email_verified:
            return Response({"message": "Email already verified"}, status=400)
        
        if user.is_verification_token_expired():
            return Response({
                "message": "Verification link has expired. Please request a new one.",
                "expired": True
            }, status=400)
        
        user.email_verified = True
        user.is_active = True
        user.email_verification_token = None
        user.email_verification_sent_at = None
        user.save()
        
        return Response({
            "message": "Email verified successfully! You can now login.",
            "email": user.email
        })
        
    except User.DoesNotExist:
        return Response({"message": "Invalid verification token"}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_email(request):
    # Resend verification email to user
    serializer = ResendVerificationSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=400
        )
    
    email = serializer.validated_data['email']
    
    try:
        user = User.objects.get(email=email)
        
        if user.email_verified:
            return Response({"message": "Email already verified"}, status=400)
        
        token = generate_verification_token()
        user.email_verification_token = token
        user.email_verification_sent_at = timezone.now()
        user.save()
        
        email_sent = send_verification_email(user, token)
        
        if email_sent:
            return Response({
                "message": "Verification email sent successfully",
                "email": user.email
            })
        else:
            return Response({
                "message": "Failed to send email. Please try again later."
            }, status=500)
        
    except User.DoesNotExist:
        return Response({
            "message": "If an account exists with this email, you will receive a verification link"
        })


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    # Send password reset link to user's email
    serializer = ForgotPasswordSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=400
        )
    
    email = serializer.validated_data['email']
    
    try:
        user = User.objects.get(email=email)
        
        if not user.email_verified:
            return Response({
                "message": "Please verify your email first before resetting password"
            }, status=400)
        
        token = generate_verification_token()
        user.password_reset_token = token
        user.password_reset_sent_at = timezone.now()
        user.save()
        
        email_sent = send_password_reset_email(user, token)
        
        if email_sent:
            return Response({
                "message": "Password reset link sent to your email"
            })
        else:
            return Response({
                "message": "Failed to send email. Please try again later."
            }, status=500)
        
    except User.DoesNotExist:
        return Response({
            "message": "If an account exists with this email, you will receive a reset link"
        })

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    # Reset password using token
    serializer = ResetPasswordSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=400
        )
    
    token = serializer.validated_data['token']
    new_password = serializer.validated_data['new_password']
    
    try:
        user = User.objects.get(password_reset_token=token)
        
        if user.is_password_reset_token_expired():
            return Response({
                "message": "Reset link has expired. Please request a new one.",
                "expired": True
            }, status=400)
        
        user.set_password(new_password)
        user.password_reset_token = None
        user.password_reset_sent_at = None
        user.save()
        
        return Response({
            "message": "Password reset successful! You can now login with your new password."
        })
        
    except User.DoesNotExist:
        return Response({"message": "Invalid reset token"}, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    # Get authenticated user's profile
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    # Update authenticated user's profile
    serializer = ProfileUpdateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=400
        )
    
    user = request.user
    validated_data = serializer.validated_data
    
    # Update common fields
    if 'user_name' in validated_data:
        user.user_name = validated_data['user_name']
    if 'phone_number' in validated_data:
        user.phone_number = validated_data['phone_number']
    if 'industry' in validated_data:
        user.industry = validated_data['industry']
    if 'custom_industry' in validated_data:
        user.custom_industry = validated_data['custom_industry']
    
    # Update business-specific fields
    if user.business_type == 'startup':
        if 'startup_name' in validated_data:
            user.startup_name = validated_data['startup_name']
        if 'funding_stage' in validated_data:
            user.funding_stage = validated_data['funding_stage']
        if 'team_size' in validated_data:
            user.team_size = validated_data['team_size']
    else:
        if 'company_name' in validated_data:
            user.company_name = validated_data['company_name']
        if 'registration_number' in validated_data:
            user.registration_number = validated_data['registration_number']
        if 'year_established' in validated_data:
            user.year_established = validated_data['year_established']
        if 'employee_count' in validated_data:
            user.employee_count = validated_data['employee_count']
        if 'annual_revenue' in validated_data:
            user.annual_revenue = validated_data['annual_revenue']
        if 'website' in validated_data:
            user.website = validated_data['website']
    
    user.save()
    
    return Response({"message": "Profile updated successfully"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    # Change user password
    serializer = ChangePasswordSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=400
        )
    
    user = request.user
    old_password = serializer.validated_data['old_password']
    new_password = serializer.validated_data['new_password']
    
    if not user.check_password(old_password):
        return Response({"message": "Old password is incorrect"}, status=400)
    
    user.set_password(new_password)
    user.save()
    
    return Response({"message": "Password changed successfully"})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def startup_dashboard(request):
    user = request.user
    
    if user.business_type != 'startup':
        return Response(
            {"error": "Access denied. This dashboard is only for startups."},
            status=403
        )
    
    return Response({
        "message": "Welcome to Startup Dashboard",
        "business_name": user.startup_name,
        "business_type": user.business_type,
        "email": user.email,
        "user_name": user.user_name,
        "email_verified": user.email_verified
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)