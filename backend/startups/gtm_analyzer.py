import os
import json
import re
from google import genai  


def analyze_gtm(
    idea, beachhead_market, launch_weeks, launch_budget,
    monthly_acq_budget, target_monthly_customers, preferred_channels,
    current_price, competitor_price_min, competitor_price_max,
    pricing_model, user
) -> dict:

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not found in environment variables")
    

    client = genai.Client(api_key=api_key)

    startup_name  = user.startup_name or "Not specified"
    industry = user.get_effective_industry() or "Not specified"
    funding_stage = user.get_funding_stage_display() if user.funding_stage else "Not specified"

    prompt = f"""
You are a senior Go-To-Market strategist specializing in Indian startups.
You have helped 100+ startups launch successfully in India across B2B and B2C spaces.

## Startup Context
- Startup: {startup_name}
- Industry: {industry}
- Funding Stage: {funding_stage}

## Validated Idea
- Title: {idea.idea_title}
- Description: {idea.idea_description}
- Idea Score: {idea.overall_score}/100
- Verdict: {idea.verdict}

## Founder Inputs

### Launch Strategy
- Beachhead Market: {beachhead_market}
- Launch Timeline: {launch_weeks} weeks from now
- Launch Budget: ₹{launch_budget}

### Customer Acquisition
- Monthly Acquisition Budget: ₹{monthly_acq_budget}
- Target Monthly New Customers: {target_monthly_customers}
- Preferred Channels: {preferred_channels}

### Pricing
- Current/Planned Price: ₹{current_price}
- Competitor Price Range: ₹{competitor_price_min} – ₹{competitor_price_max}
- Pricing Model Preference: {pricing_model}

## Your Task
Generate a complete Go-To-Market strategy with 3 sections.

Return ONLY valid JSON. No markdown. No code blocks. No extra text.

{{
  "launch_strategy": {{
    "launch_score": <float 0-100>,
    "launch_verdict": "<one of: excellent | strong | good | needs_work | risky>",
    "launch_summary": "<2-3 sentence assessment of their launch plan>",
    "beachhead_analysis": "<detailed analysis of their beachhead market choice>",
    "launch_channels": [
      {{
        "channel": "<channel name>",
        "why": "<why this channel for their specific idea>",
        "how": "<specific tactics for this channel>",
        "budget": "<estimated budget allocation>",
        "expected_result": "<what to expect in first 30 days>"
      }}
    ],
    "first_90_days": [
      {{
        "period": "Days 1-30",
        "theme": "<focus theme>",
        "activities": ["<activity 1>", "<activity 2>", "<activity 3>"],
        "goal": "<what success looks like>"
      }},
      {{
        "period": "Days 31-60",
        "theme": "<focus theme>",
        "activities": ["<activity 1>", "<activity 2>", "<activity 3>"],
        "goal": "<what success looks like>"
      }},
      {{
        "period": "Days 61-90",
        "theme": "<focus theme>",
        "activities": ["<activity 1>", "<activity 2>", "<activity 3>"],
        "goal": "<what success looks like>"
      }}
    ],
    "pr_strategy": "<specific PR and media strategy for their launch>",
    "launch_risks": [
      "<specific launch risk>",
      "<another risk>"
    ],
    "launch_tips": [
      "<specific actionable launch tip>",
      "<another tip>",
      "<another tip>"
    ]
  }},

  "customer_acquisition": {{
    "acq_summary": "<2-3 sentence assessment of their acquisition plan>",
    "acq_score": <float 0-100>,
    "projected_cac": <float — estimated blended CAC in rupees>,
    "channel_priority": [
      "<channel ranked 1st — highest ROI>",
      "<channel ranked 2nd>",
      "<channel ranked 3rd>"
    ],
    "channel_strategies": [
      {{
        "channel": "<channel name>",
        "priority": "<one of: primary | secondary | experimental>",
        "monthly_budget": <float in rupees>,
        "expected_cac": <float in rupees>,
        "expected_monthly_customers": <integer>,
        "tactics": ["<specific tactic 1>", "<specific tactic 2>"],
        "tools": ["<tool 1>", "<tool 2>"],
        "timeline_to_results": "<e.g. 2-4 weeks>"
      }}
    ],
    "budget_allocation": [
      {{
        "channel": "<channel name>",
        "percentage": <float>,
        "monthly_amount": <float>
      }}
    ],
    "growth_hacks": [
      {{
        "hack": "<growth hack name>",
        "description": "<how to execute this specifically for their startup>",
        "effort": "<one of: low | medium | high>",
        "impact": "<one of: low | medium | high>"
      }}
    ]
  }},

  "pricing_strategy": {{
    "pricing_score": <float 0-100>,
    "pricing_verdict": "<one of: optimal | slightly_low | slightly_high | too_low | too_high>",
    "pricing_summary": "<2-3 sentence pricing assessment>",
    "recommended_price": <float in rupees>,
    "pricing_rationale": "<why this price — value-based reasoning>",
    "package_tiers": [
      {{
        "tier_name": "<e.g. Starter>",
        "price": <float per month>,
        "billing": "<monthly or annual>",
        "features": ["<feature 1>", "<feature 2>", "<feature 3>"],
        "target_customer": "<who this tier is for>",
        "is_recommended": <true or false>
      }},
      {{
        "tier_name": "<e.g. Growth>",
        "price": <float>,
        "billing": "<billing>",
        "features": ["<feature 1>", "<feature 2>", "<feature 3>"],
        "target_customer": "<who>",
        "is_recommended": <true or false>
      }},
      {{
        "tier_name": "<e.g. Enterprise>",
        "price": <float>,
        "billing": "<billing>",
        "features": ["<feature 1>", "<feature 2>", "<feature 3>"],
        "target_customer": "<who>",
        "is_recommended": <true or false>
      }}
    ],
    "psychological_tips": [
      "<specific psychological pricing tip>",
      "<another tip>",
      "<another tip>"
    ],
    "price_testing_plan": "<specific plan to A/B test pricing>",
    "annual_strategy": "<how to incentivize annual plans and improve cash flow>"
  }}
}}

Be specific to THIS idea and THIS market.
Use Indian rupee context throughout.
For channel strategies, only include channels from preferred_channels if specified,
plus 1-2 additional high-ROI recommendations.
Minimum 3 channels in channel_strategies.
"""

    try:
        # Change: use the same API call pattern as analyze_idea
        response = client.models.generate_content(
            model="gemini-2.5-flash",  # or gemini-1.5-flash
            contents=prompt
        )
        
        raw = response.text.strip()

        # Clean markdown if present (same as analyze_idea)
        if raw.startswith("```"):
            lines = raw.split('\n')
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            raw = '\n'.join(lines).strip()
        
        if raw.startswith("json"):
            raw = raw[4:].strip()

        # Parse JSON with error handling (same as analyze_idea)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as json_err:
            # Try to extract JSON with regex
            json_match = re.search(r'\{.*\}', raw, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
            else:
                raise Exception(f"Failed to parse JSON from response: {raw[:200]}")

        launch = data.get("launch_strategy", {})
        acq    = data.get("customer_acquisition", {})
        price  = data.get("pricing_strategy", {})

        return {
            "raw": raw,

            # Launch
            "launch_score":       launch.get("launch_score"),
            "launch_verdict":     launch.get("launch_verdict", ""),
            "launch_summary":     launch.get("launch_summary", ""),
            "beachhead_analysis": launch.get("beachhead_analysis", ""),
            "launch_channels":    launch.get("launch_channels", []),
            "first_90_days":      launch.get("first_90_days", []),
            "pr_strategy":        launch.get("pr_strategy", ""),
            "launch_risks":       launch.get("launch_risks", []),
            "launch_tips":        launch.get("launch_tips", []),

            # Acquisition
            "acq_summary":       acq.get("acq_summary", ""),
            "acq_score":         acq.get("acq_score"),
            "projected_cac":     acq.get("projected_cac"),
            "channel_priority":  acq.get("channel_priority", []),
            "channel_strategies":acq.get("channel_strategies", []),
            "budget_allocation": acq.get("budget_allocation", []),
            "growth_hacks":      acq.get("growth_hacks", []),

            # Pricing
            "pricing_score":      price.get("pricing_score"),
            "pricing_verdict":    price.get("pricing_verdict", ""),
            "pricing_summary":    price.get("pricing_summary", ""),
            "recommended_price":  price.get("recommended_price"),
            "pricing_rationale":  price.get("pricing_rationale", ""),
            "package_tiers":      price.get("package_tiers", []),
            "psychological_tips": price.get("psychological_tips", []),
            "price_testing_plan": price.get("price_testing_plan", ""),
            "annual_strategy":    price.get("annual_strategy", ""),
        }
        
    except Exception as e:
        print(f"Error in analyze_gtm: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Go-to-market analysis failed: {str(e)}")