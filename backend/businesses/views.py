from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from businesses.models import *
from businesses.serializers import *
from django.db.models import Sum
from django.db.models.functions import TruncMonth


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_summary(req):
    records = BusinessRecord.objects.filter(user=req.user)
    summary = records.aggregate(
        total_sales = Sum('sales'),
        total_expenses = Sum('expenses'),
        total_profit = Sum('profit'),
    )

    return Response({
        "total_sales":summary["total_sales"] or 0,
        "total_expenses":summary["total_expenses"] or 0,
        "total_profit":summary["total_profit"] or 0,
        "total_records":records.count()
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_summary(req):
    records = (
        BusinessRecord.objects
        .filter(user=req.user)
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(
            total_sales = Sum('sales'),
            total_expenses = Sum('expenses'),
            total_profit = Sum('profit')
        )
        .order_by('month')
    )
    
    data = []
    for i in records:
        data.append({
            "month":i['month'].strftime("%Y-%m"),
            "total_sales":i["total_sales"],
            "total_expenses":i["total_expenses"],
            "total_profit":i["total_profit"],
        })
    return Response(data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_insights(req):

    records = BusinessRecord.objects.filter(user=req.user)

    if not records.exists():
        return Response({
            "status": "info",
            "messages": ["No business data available"],
            "suggestions": ["Start adding sales and expenses"]
        })

    summary = records.aggregate(
        total_sales=Sum('sales'),
        total_expenses=Sum('expenses'),
        total_profit=Sum('profit'),
    )

    sales = summary['total_sales'] or 0
    expenses = summary['total_expenses'] or 0
    profit = summary['total_profit'] or 0

    messages = []
    suggestions = []
    status = "good"   

    if profit < 0:
        status = "danger"
        messages.append("Your business is running at a loss")
        suggestions.append("Reduce unnecessary expenses")

    elif sales > 0 and expenses > 0.7 * sales:
        status = "warning"
        messages.append("Your expenses are very high compared to sales")
        suggestions.append("Optimize operational costs")

    elif sales > 0 and profit / sales < 0.2:
        status = "warning"
        messages.append("Profit margin is low")
        suggestions.append("Increase sales or adjust pricing")

    if not messages:
        messages.append("Your business is performing well")
        suggestions.append("Keep tracking your business data")

    return Response({
        "status": status,
        "messages": messages,
        "suggestions": suggestions
    })
