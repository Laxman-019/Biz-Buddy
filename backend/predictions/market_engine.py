from businesses.models import BusinessRecord
from django.db.models import Sum
from django.db.models.functions import TruncMonth


def calculate_market_metrics(user):

    competitor_sales = BusinessRecord.objects.exclude(user=user).aggregate(
        total=Sum('sales')
    )['total'] or 0

    user_sales = BusinessRecord.objects.filter(user=user).aggregate(
        total=Sum('sales')
    )['total'] or 0

    # If no competitors exist, simulate market
    if competitor_sales == 0:
        simulated_market = user_sales * 8   # assume user holds ~12% share
        total_market_sales = simulated_market
    else:
        total_market_sales = competitor_sales + user_sales

    market_share = (
        (user_sales / total_market_sales) * 100
        if total_market_sales > 0 else 0
    )

    market_share = round(market_share, 2)

    # Growth calculation (same as before)
    market_monthly = (
        BusinessRecord.objects
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total_sales=Sum('sales'))
        .order_by('month')
    )

    market_monthly = list(market_monthly)

    if len(market_monthly) >= 2:
        prev = market_monthly[-2]['total_sales']
        curr = market_monthly[-1]['total_sales']
        market_growth = ((curr - prev) / prev) * 100 if prev > 0 else 0
    else:
        market_growth = 0

    user_monthly = (
        BusinessRecord.objects.filter(user=user)
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total_sales=Sum('sales'))
        .order_by('month')
    )

    user_monthly = list(user_monthly)

    if len(user_monthly) >= 2:
        prev = user_monthly[-2]['total_sales']
        curr = user_monthly[-1]['total_sales']
        user_growth = ((curr - prev) / prev) * 100 if prev > 0 else 0
    else:
        user_growth = 0

    if user_growth > market_growth:
        share_status = "Gaining Market Share"
    elif user_growth < market_growth:
        share_status = "Losing Market Share"
    else:
        share_status = "Stable Position"

    return {
        "market_size": round(total_market_sales, 2),
        "user_sales": round(user_sales, 2),
        "market_share_percent": market_share,
        "market_growth_percent": round(market_growth, 2),
        "user_growth_percent": round(user_growth, 2),
        "share_status": share_status
    }