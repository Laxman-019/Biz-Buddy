from django.urls import path
from users.views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('profile/', get_user_profile, name='profile'),
    
    path('startup/dashboard/', startup_dashboard, name='startup-dashboard'),
]