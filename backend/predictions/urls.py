from django.urls import path
from predictions.views import *

urlpatterns = [
    path('dashboard/overview/',dashboard_overview),
    path('performance/summary/',business_performance_summary),
    path('intelligence/',complete_business_intelligence),
    path('intelligence/status/',intelligence_status),
    path('forecast/',demand_forecast),
    path('market/',market_analysis),
    path('competitor/',competitor_analysis),
    path('strategy/',business_strategy),
]
