from rest_framework.response import Response
from rest_framework.decorators import api_view
from users.serializers import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['POST'])
def register(req):
    serializer = RegisterSerializer(data=req.data)
    serializer.is_valid(raise_exception=True)

    user = User.objects.create_user(
        username=serializer.validated_data['user_name'],
        email=serializer.validated_data['email'],
        password=serializer.validated_data['password'],
    )

    return Response(
        {
            "message":"User Register Successfully",
            "user_id":user.id,
            "email":user.email

        },status=201)


@api_view(['POST'])
def login(req):
    serializer = LoginSerializer(data=req.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']

    user = authenticate(username=email, password=password)

    if user is None:
        return Response(
            {"error": "Invalid email or password"},
            status=401
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "message":"Login Sucessful",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    })

