from django.urls import path
from startups.views import *

urlpatterns = [
    path('ideas/',idea_list_create),
    path('ideas/<int:idea_id>/',idea_detail),
    path('ideas/<int:idea_id>/scorecard/',scorecard),
    path('ideas/<int:idea_id>/problem-validation/', problem_validation),
    path('ideas/<int:idea_id>/solution-fit/', solution_fit)
]