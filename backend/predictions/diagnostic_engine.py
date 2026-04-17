from django.db.models import Sum
from businesses.models import BusinessRecord
from ml.industry_intelligence_engine import load_industry_metrics
import os
import json
import re
from google import genai


def generate_diagnostics(user, intelligence):
    """
    Enhanced diagnostics with AI-powered recommendations and deeper analysis
    """
    industry = load_industry_metrics()

    diagnostics = []
    risks = []
    strengths = []
    opportunities = []
    recommendations = []

    # User Financial Metrics
    records = BusinessRecord.objects.filter(user=user)
    
    # Get time-series data for trend analysis
    monthly_records = records.values('date__year', 'date__month').annotate(
        month_sales=Sum('sales'),
        month_expenses=Sum('expenses'),
        month_profit=Sum('profit')
    ).order_by('date__year', 'date__month')
    
    total_sales = records.aggregate(total=Sum('sales'))['total'] or 0
    total_expenses = records.aggregate(total=Sum('expenses'))['total'] or 0
    total_profit = records.aggregate(total=Sum('profit'))['total'] or 0

    if total_sales > 0:
        profit_margin = total_profit / total_sales
        expense_ratio = total_expenses / total_sales
    else:
        profit_margin = 0
        expense_ratio = 0

    # Calculate month-over-month growth
    monthly_growth_rate = 0
    if len(monthly_records) >= 2:
        latest = monthly_records[-1]['month_sales'] or 0
        previous = monthly_records[-2]['month_sales'] or 0
        if previous > 0:
            monthly_growth_rate = ((latest - previous) / previous) * 100

    # Forecast Growth Diagnosis
    user_growth = intelligence.get('forecast', {}).get('user_growth', 0)
    performance_gap = intelligence.get('industry', {}).get('performance_gap', 0)
    trend = intelligence.get('forecast', {}).get('trend', 'stable')
    confidence = intelligence.get('forecast', {}).get('confidence_score', 0)

    # Enhanced growth analysis
    if user_growth < 0:
        diagnostics.append("⚠️ Your projected demand is declining.")
        risks.append("Negative growth trend may impact cash flow and sustainability.")
        recommendations.append({
            "title": "Reverse Growth Trend",
            "action": "Review customer feedback and identify pain points",
            "priority": "High"
        })
    elif user_growth > 20 and confidence > 70:
        strengths.append("🚀 Exceptional growth trajectory detected!")
        opportunities.append("Rapid growth suggests strong product-market fit.")
        recommendations.append({
            "title": "Scale Operations",
            "action": "Invest in infrastructure to support growth",
            "priority": "High"
        })

    if performance_gap < -10:
        diagnostics.append("⚠️ You are significantly underperforming relative to industry growth.")
        risks.append("Competitive positioning gap is widening.")
        recommendations.append({
            "title": "Competitive Analysis",
            "action": "Conduct competitor benchmarking and identify differentiation opportunities",
            "priority": "High"
        })
    elif performance_gap > 15 and trend == "growing" and user_growth > 0:
        strengths.append("🏆 You are outperforming industry growth significantly!")
        opportunities.append("Industry tailwinds + your momentum = major expansion opportunity.")

    # Profitability Diagnosis with deeper analysis
    if profit_margin < 0:
        risks.append("🔴 Critical: Business is operating at a loss.")
        diagnostics.append("Immediate action needed to address negative profitability.")
        recommendations.append({
            "title": "Profitability Turnaround",
            "action": "Review pricing strategy and reduce operational costs",
            "priority": "Critical"
        })
    elif profit_margin < 0.10:
        diagnostics.append("Profit margin is thin (below 10%).")
        risks.append("Limited margin buffer for market fluctuations.")
        recommendations.append({
            "title": "Improve Margins",
            "action": "Optimize supplier contracts or increase prices by 5-10%",
            "priority": "Medium"
        })
    elif profit_margin > 0.25:
        strengths.append("💰 Excellent profit margins!")
        opportunities.append("Strong profitability provides resources for growth investment.")

    # Expense analysis
    if expense_ratio > 0.8:
        risks.append("🔥 Critical: Expense ratio is dangerously high (>80%).")
        diagnostics.append("Cost structure needs immediate optimization.")
        recommendations.append({
            "title": "Cost Optimization",
            "action": "Audit all expenses and identify 20% cost reduction opportunities",
            "priority": "High"
        })
    elif expense_ratio > 0.65:
        diagnostics.append("Expense ratio is elevated (>65%).")
        recommendations.append({
            "title": "Efficiency Review",
            "action": "Implement expense tracking and negotiate vendor contracts",
            "priority": "Medium"
        })
    elif expense_ratio < 0.5:
        strengths.append("✅ Lean cost structure - excellent operational efficiency!")

    # Monthly growth momentum
    if monthly_growth_rate > 10:
        strengths.append(f"📈 Strong monthly momentum: {monthly_growth_rate:.1f}% growth")
        opportunities.append("Current momentum suggests favorable conditions for expansion.")
    elif monthly_growth_rate < -10:
        risks.append(f"⚠️ Rapid monthly decline: {monthly_growth_rate:.1f}% drop")
        diagnostics.append("Recent performance shows concerning downward trend.")

    # Discount Intelligence with recommendations
    industry_discount_corr = industry["discount_intelligence"]["correlation"]
    discount_effectiveness = industry["discount_intelligence"].get("effectiveness", "medium")

    if industry_discount_corr > 0.3:
        if profit_margin > 0.2:
            diagnostics.append("Industry shows strong discount-driven demand.")
            opportunities.append("Strategic promotions could accelerate customer acquisition.")
            recommendations.append({
                "title": "Test Promotional Strategy",
                "action": "Run A/B test with 10-15% discount on select products",
                "priority": "Medium"
            })
        elif profit_margin < 0.1:
            risks.append("Discounts could erode already thin margins.")
            diagnostics.append("Alternative growth strategies needed beyond price promotions.")

    # Festival Intelligence with timing recommendations
    festival_lift = industry["festival_intelligence"]["festival_lift_percent"]
    next_festival = industry["festival_intelligence"].get("next_festival", "Unknown")
    days_to_festival = industry["festival_intelligence"].get("days_until_next", 365)

    if festival_lift > 15:
        diagnostics.append(f"🎉 Industry revenue increases ~{festival_lift:.1f}% during festival events.")
        
        if days_to_festival < 60:
            opportunities.append(f"Only {days_to_festival} days until {next_festival} - prime preparation window!")
            recommendations.append({
                "title": "Festival Campaign Ready",
                "action": f"Launch festival-specific marketing campaign {days_to_festival-30} days before {next_festival}",
                "priority": "High"
            })
        
        if user_growth < 0 or performance_gap < 0 or trend == "declining":
            risks.append(f"Missing seasonal campaign opportunities - act before {next_festival}.")
            recommendations.append({
                "title": "Seasonal Planning",
                "action": f"Create inventory and marketing plan for upcoming {next_festival} season",
                "priority": "High"
            })
        elif profit_margin >= 0.2 and performance_gap >= 0 and trend != "declining":
            strengths.append("🎯 Well-positioned to capitalize on upcoming seasonal demand.")

    # Competition Risk with mitigation strategies
    comp_drop = industry["competition_intelligence"]["revenue_drop_high_competition_percent"]
    competition_intensity = industry["competition_intelligence"].get("intensity", "medium")

    if comp_drop > 20:
        risks.append(f"⚠️ Revenue drops {comp_drop:.0f}% under high competition.")
        diagnostics.append("Your industry is highly sensitive to competitive pressure.")
        recommendations.append({
            "title": "Competitive Moat Development",
            "action": "Identify and strengthen unique value propositions",
            "priority": "High"
        })
    elif comp_drop > 10:
        risks.append(f"Competition risk: {comp_drop:.0f}% potential revenue impact.")
        recommendations.append({
            "title": "Competitive Monitoring",
            "action": "Set up competitor price and feature tracking",
            "priority": "Medium"
        })

    # Inventory Intelligence
    inventory_impact = industry["inventory_intelligence"]["inventory_pressure_revenue_change_percent"]
    inventory_optimization = industry["inventory_intelligence"].get("optimization_potential", 0)

    if inventory_impact < 0:
        risks.append("Inventory pressure negatively impacts revenue in your industry.")
        if inventory_optimization > 10:
            opportunities.append(f"Optimizing inventory could improve revenue by {inventory_optimization:.0f}%.")
            recommendations.append({
                "title": "Inventory Optimization",
                "action": "Implement demand forecasting and just-in-time inventory",
                "priority": "Medium"
            })

    # Category Benchmark with actionable insights
    top_categories = industry["category_intelligence"]["top_categories"][:3]
    emerging_categories = industry["category_intelligence"].get("emerging_categories", [])
    
    if top_categories:
        diagnostics.append(f"Top performing categories: {', '.join(top_categories)}.")
        
        # Check if user's categories align
        user_categories = set(records.values_list('category', flat=True).distinct())
        if user_categories:
            aligned = [cat for cat in top_categories if cat in user_categories]
            if aligned:
                strengths.append(f"✅ Operating in high-growth categories: {', '.join(aligned)}")
            elif emerging_categories:
                opportunities.append(f"Consider expanding into emerging categories: {', '.join(emerging_categories[:2])}")

    # New: Liquidity / Cash Flow Analysis
    cash_on_hand = intelligence.get('financial', {}).get('cash_on_hand', 0)
    monthly_burn = intelligence.get('financial', {}).get('monthly_burn_rate', 0)
    
    if monthly_burn > 0 and cash_on_hand > 0:
        runway_months = cash_on_hand / monthly_burn
        if runway_months < 3:
            risks.append(f"🔴 Critical: Only {runway_months:.1f} months of runway remaining.")
            recommendations.append({
                "title": "Extend Runway",
                "action": "Reduce non-essential expenses or accelerate fundraising",
                "priority": "Critical"
            })
        elif runway_months < 6:
            diagnostics.append(f"Runway: {runway_months:.1f} months - consider planning next funding round.")
            recommendations.append({
                "title": "Runway Extension",
                "action": "Review budget and identify 15-20% cost reductions",
                "priority": "High"
            })

    # New: Customer Concentration Risk
    top_customers = records.values('business_name').annotate(
        total=Sum('sales')
    ).order_by('-total')[:3]
    
    if len(top_customers) >= 1:
        top_concentration = (top_customers[0]['total'] / total_sales * 100) if total_sales > 0 else 0
        if top_concentration > 40:
            risks.append(f"⚠️ High customer concentration: Top customer = {top_concentration:.0f}% of revenue.")
            recommendations.append({
                "title": "Diversify Customer Base",
                "action": "Target new customer segments to reduce dependency",
                "priority": "High"
            })
        elif top_concentration > 25:
            diagnostics.append(f"Customer concentration risk: Top customer = {top_concentration:.0f}%.")

    # Remove duplicates while preserving order
    diagnostics = list(dict.fromkeys(diagnostics))
    risks = list(dict.fromkeys(risks))
    strengths = list(dict.fromkeys(strengths))
    opportunities = list(dict.fromkeys(opportunities))

    # Sort recommendations by priority
    priority_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    recommendations.sort(key=lambda x: priority_order.get(x.get("priority", "Low"), 4))

    return {
        "diagnostics": diagnostics,
        "risks": risks,
        "strengths": strengths,
        "opportunities": opportunities,
        "recommendations": recommendations,
        "metrics": {
            "profit_margin": round(profit_margin * 100, 1),
            "expense_ratio": round(expense_ratio * 100, 1),
            "monthly_growth": round(monthly_growth_rate, 1),
            "performance_gap": round(performance_gap, 1),
            "user_growth": round(user_growth, 1),
            "confidence_score": confidence
        }
    }


def get_ai_diagnostic_recommendations(user, diagnostics_data):
    """
    Optional: Get AI-powered recommendations based on diagnostics
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
You are an AI business advisor. Based on these diagnostics, provide 3 specific, actionable recommendations.
Prioritize based on impact and urgency.

Diagnostics: {diagnostics_data.get('diagnostics', [])}
Risks: {diagnostics_data.get('risks', [])}
Strengths: {diagnostics_data.get('strengths', [])}
Opportunities: {diagnostics_data.get('opportunities', [])}
Metrics: {diagnostics_data.get('metrics', {})}

Respond in JSON format:
{{
  "ai_recommendations": [
    {{"title": "string", "description": "string", "impact": "High/Medium/Low", "effort": "High/Medium/Low"}}
  ],
  "next_steps": ["step1", "step2", "step3"]
}}
"""
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=prompt
        )
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip()
        return json.loads(text)
    except Exception as e:
        print(f"AI recommendation error: {e}")
        return None