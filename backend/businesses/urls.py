from django.urls import path
from businesses.views import *

urlpatterns = [
    path('add-record/', add_record),
    path('list-record/', list_records),
    path('business-summary/', business_summary),
    path('monthly-summary/', monthly_summary),
    path('business-insights/', business_insights),
    path('update-record/<int:id>/', update_record),
    path('delete-record/<int:id>/', delete_record),
]
