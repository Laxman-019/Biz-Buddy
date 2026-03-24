import os
import json
import re
from google import genai 


def analyze_business_model(idea, revenue_model, price_per_customer,
                            estimated_cac, additional_context, user) -> dict:

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not found in environment variables")
    
    client = genai.Client(api_key=api_key)

    startup_name = user.startup_name or "Not specified"
    industry = user.get_effective_industry() or "Not specified"
    funding_stage = user.get_funding_stage_display() if user.funding_stage else "Not specified"

    prompt = f"""
You are a senior startup business model strategist with expertise in lean methodology,
unit economics, and revenue model optimization — especially for Indian startups.

## Startup Context
- Startup: {startup_name}
- Industry: {industry}
- Funding Stage: {funding_stage}

## Validated Idea
- Title: {idea.idea_title}
- Description: {idea.idea_description}
- Idea Score: {idea.overall_score}/100
- Verdict: {idea.verdict}

## Founder's Inputs
- Chosen Revenue Model: {revenue_model}
- Price per Customer: ₹{price_per_customer}/month
- Estimated CAC: ₹{estimated_cac}
- Additional Context: {additional_context or "None provided"}

## Your Task
Generate a complete business model report with 3 sections:
1. Lean Canvas (all 9 boxes)
2. Revenue Model Analysis
3. Unit Economics

Return ONLY valid JSON. No markdown. No code blocks. No explanation before or after.

{{
  "overall_summary": "<2-3 sentence overview of this business model's strength>",
  "business_model_score": <float 0-100>,
  "overall_verdict": "<one of: strong | good | moderate | weak | unviable>",

  "lean_canvas": {{
    "problem": "<top 3 problems this solves — numbered list as single string>",
    "solution": "<top 3 features of the solution — numbered list as single string>",
    "uvp": "<single clear unique value proposition statement>",
    "unfair_advantage": "<what cannot be easily copied or bought>",
    "customer_segments": "<specific target customer segments>",
    "channels": "<how you reach customers — list as single string>",
    "revenue_streams": "<how you make money — specific to their model and price>",
    "cost_structure": "<main fixed and variable costs for this business>",
    "key_metrics": "<the 3-5 numbers that matter most for this business>"
  }},

  "revenue_model_analysis": {{
    "current_model_analysis": "<analysis of their chosen revenue model for this specific idea>",
    "recommended_model": "<best revenue model for this business>",
    "reasoning": "<why this model works best — specific to their idea>",
    "pricing_recommendation": "<specific pricing advice — tiers, annual discount, etc.>"
  }},

  "unit_economics": {{
    "ltv_estimate": <number — estimated LTV in rupees>,
    "ltv_explanation": "<how LTV was calculated — assumed churn rate, avg lifespan>",
    "cac_analysis": "<analysis of their ₹{estimated_cac} CAC — is it realistic? benchmarks?>",
    "ltv_cac_ratio": <float — LTV divided by CAC>,
    "ltv_cac_verdict": "<one of: excellent | good | acceptable | poor | critical>",
    "payback_period_months": <float — months to recover CAC>,
    "payback_verdict": "<one of: fast | acceptable | slow | very_slow>",
    "contribution_margin": "<estimated contribution margin per customer per month>",
    "unit_economics_score": <float 0-100>
  }},

  "recommendations": [
    "<specific actionable recommendation 1>",
    "<specific actionable recommendation 2>",
    "<specific actionable recommendation 3>",
    "<specific actionable recommendation 4>"
  ],

  "risks": [
    "<business model specific risk 1>",
    "<business model specific risk 2>",
    "<business model specific risk 3>"
  ]
}}

Be specific to THIS idea and THESE numbers.
Use Indian market context and rupee-based benchmarks.
If LTV/CAC ratio < 1, flag it clearly in the verdict.
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

        canvas = data.get("lean_canvas", {})
        revenue = data.get("revenue_model_analysis", {})
        unit = data.get("unit_economics", {})

        return {
            "raw": raw,
            "overall_summary": data.get("overall_summary", ""),
            "business_model_score": data.get("business_model_score"),
            "overall_verdict": data.get("overall_verdict", ""),
            "recommendations": data.get("recommendations", []),
            "risks": data.get("risks", []),

            # Canvas
            "canvas_problem": canvas.get("problem", ""),
            "canvas_solution": canvas.get("solution", ""),
            "canvas_uvp": canvas.get("uvp", ""),
            "canvas_unfair_advantage": canvas.get("unfair_advantage", ""),
            "canvas_customer_segments": canvas.get("customer_segments", ""),
            "canvas_channels": canvas.get("channels", ""),
            "canvas_revenue_streams": canvas.get("revenue_streams", ""),
            "canvas_cost_structure": canvas.get("cost_structure", ""),
            "canvas_key_metrics": canvas.get("key_metrics", ""),

            # Revenue
            "revenue_model_analysis": revenue.get("current_model_analysis", ""),
            "revenue_model_recommended": revenue.get("recommended_model", ""),
            "revenue_model_reasoning": revenue.get("reasoning", ""),
            "pricing_recommendation": revenue.get("pricing_recommendation", ""),

            # Unit economics
            "ltv_estimate": unit.get("ltv_estimate"),
            "ltv_explanation": unit.get("ltv_explanation", ""),
            "cac_analysis": unit.get("cac_analysis", ""),
            "ltv_cac_ratio": unit.get("ltv_cac_ratio"),
            "ltv_cac_verdict": unit.get("ltv_cac_verdict", ""),
            "payback_period_months": unit.get("payback_period_months"),
            "payback_verdict": unit.get("payback_verdict", ""),
            "contribution_margin": unit.get("contribution_margin", ""),
            "unit_economics_score": unit.get("unit_economics_score"),
        }
        
    except Exception as e:
        print(f"Error in analyze_business_model: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Business model analysis failed: {str(e)}")