from django.urls import path
from startups.views import *

urlpatterns = [
    path('ideas/',idea_list),
    path('ideas/submit/',idea_submit),
    path('ideas/<int:idea_id>/',idea_detail),
    path('market/', market_list),
    path('market/submit/', market_submit),
    path('market/<int:report_id>/',market_detail),
    path('business-model/',business_model_list),
    path('business-model/ideas/',ideas_for_dropdown),
    path('business-model/submit/',business_model_submit),
    path('business-model/<int:bm_id>/',business_model_detail),
    path('mvp/',mvp_list),
    path('mvp/submit/',mvp_submit),
    path('mvp/<int:plan_id>/',mvp_detail),
    path('financials/', financials_list),
    path('financials/submit/', financials_submit),
    path('financials/<int:record_id>/', financials_detail),
]