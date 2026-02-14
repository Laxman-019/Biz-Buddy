from businesses.models import BusinessRecord
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from ml.benchmark_engine import calculate_industry_growth
from django.conf import settings
import pandas as pd
import os

DATA_PATH = os.path.join(
    settings.BASE_DIR,
    "ml",
    "datasets",
    "indian_ecommerce.csv"
)

def get_industry_market_size():
    df = pd.read_csv(DATA_PATH)
    return df["revenue"].sum()

def calculate_market_metrics(user):
    # Total market sales(all user)
    total_market_sales = get_industry_market_size()
    
    # User total sales
    user_sales = BusinessRecord.objects.filter(user = user).aggregate(total=Sum("sales"))['total'] or 0

    # Market share
    market_share = (user_sales/total_market_sales)*100 if total_market_sales > 0 else 0

    # Market Growth Calculation
    market_monthly = (BusinessRecord.objects.annotate(month=TruncMonth('date')).values('month').annotate(total_sales=Sum('sales')).order_by('month'))

    market_monthly = list(market_monthly)

    if len(market_monthly) >= 2:
        prev = market_monthly[-2]['total_sales']
        curr = market_monthly[-1]['total_sales']
        market_growth = ((curr - prev) / prev) * 100 if prev > 0 else 0
    else:
        market_growth = 0
        

    # User Growth        
    user_monthly = (BusinessRecord.objects.filter(user=user).annotate(month = TruncMonth('date')).values('month').annotate(total_sales=Sum('sales')).order_by('month'))
    
    user_monthly = list(user_monthly)
    
    if len(user_monthly) >= 2 :
        prev = user_monthly[-2]['total_sales']
        curr = user_monthly[-1]['total_sales']
        user_growth = ((curr - prev) / prev) * 100 if prev > 0 else 0
    else :
        user_growth = 0 
        
    # Share Movement
    if user_growth > market_growth:
        share_status = "Gaining Market Share"
    elif user_growth < market_growth:
        share_status = "Losing Market Share"
    else:
        share_status = "Stable Position"
        
    return {
        "market_size" : total_market_sales,
        "user_sales" : user_sales,
        "market_share_percent" : round(market_share, 2),
        "market_growth_percent" : round(market_growth, 2),
        "user_growth_percent" : round(user_growth, 2),
        "share_status" : share_status
    }    