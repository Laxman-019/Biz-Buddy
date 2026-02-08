from django.urls import path
from users.views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('token/refresh/', TokenRefreshView.as_view()),
]
