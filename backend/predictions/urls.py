from django.urls import path
from predictions.views import demand_forecast

urlpatterns = [
    path('forecast/', demand_forecast ),
]
