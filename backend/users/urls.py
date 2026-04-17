from django.urls import path
from .views import *

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('verify-email/', verify_email, name='verify_email'),
    path('resend-verification/', resend_verification_email, name='resend_verification'),
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('reset-password/', reset_password, name='reset_password'),
    path('change-password/', change_password, name='change_password'),
    path('user/profile/', get_user_profile, name='user_profile'),
    path('user/profile/update/', update_user_profile, name='update_profile'),
    path('me/', me, name='me'),
    path('startup/dashboard/', startup_dashboard, name='startup_dashboard'),
]