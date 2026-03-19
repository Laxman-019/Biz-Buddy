from django.urls import path
from startups.views import *

urlpatterns = [
    path('ideas/',idea_list),
    path('ideas/submit/',idea_submit),
    path('ideas/<int:idea_id>/',idea_detail),
    path('market/', market_list),
    path('market/submit/', market_submit),
    path('market/<int:report_id>/',market_detail),
]