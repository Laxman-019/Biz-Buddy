from django.urls import path
from predictions.views import *

urlpatterns = [
    path('forecast/', demand_forecast),
    path('market-analysis/', market_analysis),
    path('competitor-analysis/', competitor_analysis),
    path('strategy/', business_strategy)
]
