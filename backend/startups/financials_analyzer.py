import os
import json
import re
from google import genai  


def analyze_financials(idea, cash_on_hand, monthly_burn_rate,
                       starting_monthly_revenue, monthly_revenue_growth,
                       current_monthly_expenses, expense_growth_rate,
                       funding_amount_target, funds_product_pct,
                       funds_marketing_pct, funds_salaries_pct,
                       funds_ops_pct, funding_milestone, user) -> dict:

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not found in environment variables")
    
    client = genai.Client(api_key=api_key)

    startup_name  = user.startup_name or "Not specified"
    industry      = user.get_effective_industry() or "Not specified"
    funding_stage = user.get_funding_stage_display() if user.funding_stage else "Not specified"

    prompt = f"""
You are a senior startup CFO and financial analyst specializing in early-stage
Indian startups. You are an expert in runway management, financial projections,
and fundraising strategy.

## Startup Context
- Startup: {startup_name}
- Industry: {industry}
- Funding Stage: {funding_stage}

## Validated Idea
- Title: {idea.idea_title}
- Description: {idea.idea_description}
- Idea Score: {idea.overall_score}/100
- Verdict: {idea.verdict}

## Founder's Financial Inputs

### Runway
- Cash on Hand: ₹{cash_on_hand}
- Monthly Burn Rate: ₹{monthly_burn_rate}

### 3-Year Projection
- Starting Monthly Revenue: ₹{starting_monthly_revenue}
- Monthly Revenue Growth Rate: {monthly_revenue_growth}%
- Current Monthly Expenses: ₹{current_monthly_expenses}
- Monthly Expense Growth Rate: {expense_growth_rate}%

### Funding Requirements
- Target Raise: ₹{funding_amount_target}
- Use of Funds: {funds_product_pct}% product, {funds_marketing_pct}% marketing,
  {funds_salaries_pct}% salaries, {funds_ops_pct}% ops
- Target Milestone: {funding_milestone or "Not specified"}

## Your Task
Generate a complete financial report with 3 sections.
For monthly projections, generate exactly 36 months (3 years).

Return ONLY valid JSON. No markdown. No code blocks. No extra text.

{{
  "runway": {{
    "runway_months": <float>,
    "runway_status": "<one of: comfortable | healthy | raising_soon | urgent | critical>",
    "zero_date": "<e.g. March 2026>",
    "runway_summary": "<2-3 sentence burn rate assessment>",
    "scenarios": [
      {{
        "name": "Base Case",
        "description": "<current trajectory>",
        "runway_months": <float>,
        "monthly_burn": <float>
      }},
      {{
        "name": "Optimistic",
        "description": "<if revenue grows 20% faster>",
        "runway_months": <float>,
        "monthly_burn": <float>
      }},
      {{
        "name": "Pessimistic",
        "description": "<if burn increases 20%>",
        "runway_months": <float>,
        "monthly_burn": <float>
      }}
    ],
    "recommendations": [
      "<specific action to extend runway>",
      "<another recommendation>",
      "<another recommendation>"
    ]
  }},

  "projection": {{
    "breakeven_month": <integer — month number from start when profit turns positive>,
    "projection_summary": "<2-3 sentence projection assessment>",
    "yearly_projections": [
      {{
        "year": 1,
        "total_revenue": <float>,
        "total_expenses": <float>,
        "net_profit": <float>,
        "ending_cash": <float>
      }},
      {{
        "year": 2,
        "total_revenue": <float>,
        "total_expenses": <float>,
        "net_profit": <float>,
        "ending_cash": <float>
      }},
      {{
        "year": 3,
        "total_revenue": <float>,
        "total_expenses": <float>,
        "net_profit": <float>,
        "ending_cash": <float>
      }}
    ],
    "monthly_projections": [
      {{
        "month": 1,
        "revenue": <float>,
        "expenses": <float>,
        "profit": <float>,
        "cumulative_profit": <float>
      }}
      ... repeat for all 36 months
    ],
    "milestones": [
      {{
        "month": <int>,
        "milestone": "<e.g. Break-even reached>"
      }}
    ],
    "risks": [
      "<projection risk 1>",
      "<projection risk 2>"
    ],
    "assumptions": [
      "<key assumption 1>",
      "<key assumption 2>",
      "<key assumption 3>"
    ]
  }},

  "funding": {{
    "funding_verdict": "<one of: well_sized | slightly_low | slightly_high | too_low | too_high>",
    "funding_summary": "<2-3 sentence funding assessment>",
    "funding_score": <float 0-100>,
    "valuation_context": "<what valuation range is typical for this stage and industry>",
    "runway_extended_months": <float — how many months this funding adds>,
    "milestones": [
      "<milestone this funding unlocks>",
      "<another milestone>"
    ],
    "tips": [
      "<specific fundraising tip for this startup>",
      "<another tip>",
      "<another tip>"
    ],
    "use_of_funds_analysis": "<analysis of their proposed fund allocation>"
  }}
}}

Be specific to THIS startup and THESE numbers.
Use Indian rupee context and Indian startup benchmarks.
Monthly projections must have exactly 36 entries.
If burn rate is 0, set runway_months to 999 (infinite).
"""

    try:
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",  
            contents=prompt
        )
        
        raw = response.text.strip()

        
        if raw.startswith("```"):
            lines = raw.split('\n')
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            raw = '\n'.join(lines).strip()
        
        if raw.startswith("json"):
            raw = raw[4:].strip()

        
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as json_err:
            json_match = re.search(r'\{.*\}', raw, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
            else:
                raise Exception(f"Failed to parse JSON from response: {raw[:200]}")

        runway = data.get("runway", {})
        projection = data.get("projection", {})
        funding = data.get("funding", {})

        return {
            "raw": raw,

            # Runway
            "runway_months": runway.get("runway_months"),
            "runway_status": runway.get("runway_status", ""),
            "zero_date": runway.get("zero_date", ""),
            "runway_summary": runway.get("runway_summary", ""),
            "runway_scenarios": runway.get("scenarios", []),
            "runway_recommendations": runway.get("recommendations", []),

            # Projection
            "breakeven_month": projection.get("breakeven_month"),
            "projection_summary": projection.get("projection_summary", ""),
            "yearly_projections": projection.get("yearly_projections", []),
            "monthly_projections": projection.get("monthly_projections", []),
            "projection_milestones": projection.get("milestones", []),
            "projection_risks": projection.get("risks", []),
            "projection_assumptions": projection.get("assumptions", []),

            # Funding
            "funding_verdict":funding.get("funding_verdict", ""),
            "funding_summary":funding.get("funding_summary", ""),
            "funding_score": funding.get("funding_score"),
            "valuation_context":funding.get("valuation_context", ""),
            "runway_extended_months": funding.get("runway_extended_months"),
            "funding_milestones":funding.get("milestones", []),
            "funding_tips":funding.get("tips", []),
            "use_of_funds_analysis":  funding.get("use_of_funds_analysis", ""),
        }
        
    except Exception as e:
        print(f"Error in analyze_financials: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Financial analysis failed: {str(e)}")