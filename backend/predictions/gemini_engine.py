import os
import json
import re
from google import genai 
from businesses.models import BusinessRecord
from django.db.models import Sum


def generate_gemini_insights(user, intelligence_data):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {
            "status": "error",
            "message": "GEMINI_API_KEY not found in environment variables",
            "ai_insights": None
        }
    
    client = genai.Client(api_key=api_key)

    # Gather business summary
    records = BusinessRecord.objects.filter(user=user)
    summary = records.aggregate(
        total_sales=Sum('sales'),
        total_expenses=Sum('expenses'),
        total_profit=Sum('profit'),
    )

    total_sales = summary['total_sales'] or 0
    total_expenses = summary['total_expenses'] or 0
    total_profit = summary['total_profit'] or 0
    profit_margin = round((total_profit / total_sales * 100), 2) if total_sales > 0 else 0
    expense_ratio = round((total_expenses / total_sales * 100), 2) if total_sales > 0 else 0

    # Extract from intelligence_data
    forecast = intelligence_data.get("forecast", {})
    industry = intelligence_data.get("industry", {})
    market = intelligence_data.get("market", {})
    competitor = intelligence_data.get("competitor", {})
    diagnostics = intelligence_data.get("diagnostics", {})
    risk = intelligence_data.get("risk", {})

    prompt = f"""
You are an expert business analyst AI. Analyze the following business data and provide:
1. A concise executive summary (2-3 sentences)
2. Top 3 actionable recommendations with clear reasoning
3. Key risk to watch out for (1-2 sentences)
4. One growth opportunity specific to this business's situation

Business Financial Overview:
- Total Sales: ₹{total_sales:,.2f}
- Total Expenses: ₹{total_expenses:,.2f}
- Total Profit: ₹{total_profit:,.2f}
- Profit Margin: {profit_margin}%
- Expense Ratio: {expense_ratio}%

Forecast Intelligence:
- 30-Day Demand Forecast: ₹{forecast.get('predicted_30_day_demand', 0):,.2f}
- Growth Trend: {forecast.get('trend', 'stable')}
- User Growth Rate: {forecast.get('user_growth', 0):.2f}%
- Forecast Confidence: {forecast.get('confidence_score', 0):.1f}%

Industry Comparison:
- Industry Growth Rate: {industry.get('industry_growth', 0):.2f}%
- Performance Gap vs Industry: {industry.get('performance_gap', 0):.2f}%

Market Position:
- Market Share Status: {market.get('share_status', 'Unknown')}

Competitor Position:
- Business Cluster: {competitor.get('user_cluster', 'Unknown')}
- Total Competitors in Cluster: {competitor.get('total_competitors', 0)}

Identified Risks:
{chr(10).join(f"- {r}" for r in diagnostics.get('risks', [])) or "- None identified"}

Identified Strengths:
{chr(10).join(f"- {s}" for s in diagnostics.get('strengths', [])) or "- None identified"}

Risk Score: {risk.get('risk_score', 'N/A')} | Risk Level: {risk.get('risk_level', 'N/A')}

Respond in this exact JSON format with no extra text or markdown:
{{
  "executive_summary": "string",
  "recommendations": [
    {{"title": "string", "action": "string", "reason": "string"}},
    {{"title": "string", "action": "string", "reason": "string"}},
    {{"title": "string", "action": "string", "reason": "string"}}
  ],
  "key_risk": "string",
  "growth_opportunity": "string"
}}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",  
            contents=prompt
        )
        
        text = response.text.strip()

        if text.startswith("```"):
            lines = text.split('\n')
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            text = '\n'.join(lines).strip()
        
        if text.startswith("json"):
            text = text[4:].strip()

        try:
            insights = json.loads(text)
        except json.JSONDecodeError as json_err:
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                insights = json.loads(json_match.group())
            else:
                raise Exception(f"Failed to parse JSON from response: {text[:200]}")

        return {
            "status": "success",
            "ai_insights": insights
        }

    except Exception as e:
        print(f"Error in generate_gemini_insights: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "message": str(e),
            "ai_insights": None
        }