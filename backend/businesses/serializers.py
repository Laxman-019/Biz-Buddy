from rest_framework import serializers
from businesses.models import *

class BusinessRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessRecord
        fields = [
            'id','business_name','date','sales','expenses','profit'
        ]
        read_only_fields = ['profit']