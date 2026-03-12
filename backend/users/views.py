from rest_framework.response import Response
from rest_framework.decorators import api_view
from users.serializers import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['POST'])
def register(req):
    serializer = RegisterSerializer(data=req.data)
    
    if not serializer.is_valid():
        error_messages = {}
        for field, errors in serializer.errors.items():
            error_messages[field] = errors[0] if isinstance(errors, list) else errors
        
        return Response(
            {"message": "Registration failed", "errors": error_messages},
            status=400
        )

    validated_data = serializer.validated_data
    
    # Prepare user data
    user_data = {
        'username': validated_data['user_name'],  
        'email': validated_data['email'],
        'password': validated_data['password'],
        'user_name': validated_data['user_name'],
        'phone_number': validated_data.get('phone_number', ''),
        'business_type': validated_data['business_type'],
        'industry': validated_data.get('industry', ''),
    }
    
    # Add startup specific fields
    if validated_data['business_type'] == 'startup':
        user_data.update({
            'startup_name': validated_data.get('startup_name', ''),
            'funding_stage': validated_data.get('funding_stage', ''),
            'team_size': validated_data.get('team_size'),
        })
    
    # Add existing business specific fields
    else: 
        user_data.update({
            'company_name': validated_data.get('company_name', ''),
            'registration_number': validated_data.get('registration_number', ''),
            'year_established': validated_data.get('year_established'),
            'employee_count': validated_data.get('employee_count'),
            'annual_revenue': validated_data.get('annual_revenue', ''),
            'website': validated_data.get('website', ''),
        })

    # Create user
    user = User.objects.create_user(**user_data)

    # Generate response based on business type
    response_data = {
        "message": "User Registered Successfully",
        "user_id": user.id,
        "email": user.email,
        "business_type": user.business_type,
    }
    
    # Add business name to response
    if user.business_type == 'startup' and user.startup_name:
        response_data["business_name"] = user.startup_name
    elif user.business_type == 'existing' and user.company_name:
        response_data["business_name"] = user.company_name

    return Response(response_data, status=201)


@api_view(['POST'])
def login(req):
    serializer = LoginSerializer(data=req.data)
    
    if not serializer.is_valid():
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=400
        )

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']

    # Authenticate using email
    user = authenticate(username=email, password=password)

    if user is None:
        return Response(
            {"message": "Invalid email or password"},
            status=401
        )

    refresh = RefreshToken.for_user(user)

    # Prepare user data for response
    user_data = {
        "id": user.id,
        "email": user.email,
        "user_name": user.user_name,
        "business_type": user.business_type,
    }
    
    # Add business name based on type
    if user.business_type == 'startup' and user.startup_name:
        user_data["business_name"] = user.startup_name
    elif user.business_type == 'existing' and user.company_name:
        user_data["business_name"] = user.company_name

    return Response({
        "message": "Login Successful",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": user_data
    })



@api_view(['GET'])
def get_user_profile(req):
    user = req.user
    
    user_data = {
        "id": user.id,
        "email": user.email,
        "user_name": user.user_name,
        "phone_number": user.phone_number,
        "business_type": user.business_type,
        "industry": user.industry,
    }
    
    # Add type-specific fields
    if user.business_type == 'startup':
        user_data.update({
            "startup_name": user.startup_name,
            "funding_stage": user.funding_stage,
            "team_size": user.team_size,
        })
    else:  # existing business
        user_data.update({
            "company_name": user.company_name,
            "registration_number": user.registration_number,
            "year_established": user.year_established,
            "employee_count": user.employee_count,
            "annual_revenue": user.annual_revenue,
            "website": user.website,
        })
    
    return Response(user_data)