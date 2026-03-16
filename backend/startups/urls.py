from django.urls import path
from startups.views import *

urlpatterns = [
    path('ideas/',idea_list),
    path('ideas/submit/',idea_submit),
    path('ideas/<int:idea_id>/',idea_detail),
]