from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from businesses.models import *
from businesses.serializers import *


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_record(req):
    serializer = BusinessRecordSerializer(data=req.data)
    serializer.is_valid(raise_exception=True)

    record = BusinessRecord.objects.create(
        user = req.user,
        business_name = serializer.validated_data['business_name'],
        date = serializer.validated_data['date'],
        sales = serializer.validated_data['sales'],
        expenses = serializer.validated_data['expenses']
    )

    return Response(BusinessRecordSerializer(record).data,status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_records(req):
    records = BusinessRecord.objects.filter(user=req.user)
    serializer = BusinessRecordSerializer(records,many=True)
    return Response(serializer.data)