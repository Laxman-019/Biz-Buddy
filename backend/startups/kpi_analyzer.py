import os
import json
import re
from google import genai  


def analyze_kpis(
    idea, business_model_type, primary_goal, currently_tracking,
    week1_retention, month1_retention, month3_retention,
    avg_invites_per_user, invite_conversion_rate,
    monthly_active_users, user
) -> dict:

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not found in environment variables")
    
   
    client = genai.Client(api_key=api_key)

    startup_name  = user.startup_name or "Not specified"
    industry      = user.get_effective_industry() or "Not specified"
    funding_stage = user.get_funding_stage_display() if user.funding_stage else "Not specified"

    k_factor = round(
        (avg_invites_per_user * invite_conversion_rate) / 100, 3
    ) if invite_conversion_rate > 0 else 0

    prompt = f"""
You are a world-class startup growth analyst and KPI expert.
You specialize in helping early-stage Indian startups define,
measure, and improve their key performance indicators.

## Startup Context
- Startup: {startup_name}
- Industry: {industry}
- Funding Stage: {funding_stage}
- Business Model: {business_model_type}
- Primary Goal: {primary_goal}

## Validated Idea
- Title: {idea.idea_title}
- Description: {idea.idea_description}
- Idea Score: {idea.overall_score}/100

## Founder's KPI Data

### Currently Tracking
{currently_tracking or "Nothing specified yet"}

### Retention Data
- Week 1 Retention: {week1_retention}%
- Month 1 Retention: {month1_retention}%
- Month 3 Retention: {month3_retention}%

### Viral Data
- Avg Invites per User: {avg_invites_per_user}
- Invite Conversion Rate: {invite_conversion_rate}%
- Monthly Active Users: {monthly_active_users}
- Calculated K-factor: {k_factor}

## Your Task
Generate a complete KPI analysis with 3 sections.

Return ONLY valid JSON. No markdown. No code blocks. No extra text.

{{
  "north_star": {{
    "north_star_metric": "<specific metric name e.g. Weekly Active Restaurants>",
    "north_star_why": "<2-3 sentences why this is the right north star for this startup>",
    "how_to_measure": "<specific implementation — what to track, how often, which tool>",
    "supporting_metrics": [
      {{
        "metric": "<metric name>",
        "description": "<what it measures and why it matters>",
        "target": "<realistic target for their stage>",
        "frequency": "<how often to check — daily/weekly/monthly>"
      }}
    ],
    "benchmarks": [
      {{
        "metric": "<metric name>",
        "good": "<good benchmark value>",
        "great": "<great benchmark value>",
        "their_stage": "<what to expect at their stage>"
      }}
    ],
    "warning_signs": [
      "<specific warning sign to watch for>",
      "<another warning sign>"
    ],
    "tracking_recommendations": [
      "<specific tool or method to track this>",
      "<another recommendation>"
    ]
  }},

  "retention": {{
    "retention_score": <float 0-100 based on their retention numbers>,
    "retention_verdict": "<one of: excellent | good | average | poor | critical>",
    "retention_summary": "<2-3 sentence analysis of their specific retention numbers>",
    "pmf_assessment": "<assessment of whether their retention signals PMF or not>",
    "benchmark_comparison": [
      {{
        "period": "Week 1",
        "their_rate": {week1_retention},
        "industry_avg": <float — industry average for their type>,
        "top_quartile": <float — top 25% benchmark>,
        "verdict": "<above/below/at benchmark>"
      }},
      {{
        "period": "Month 1",
        "their_rate": {month1_retention},
        "industry_avg": <float>,
        "top_quartile": <float>,
        "verdict": "<verdict>"
      }},
      {{
        "period": "Month 3",
        "their_rate": {month3_retention},
        "industry_avg": <float>,
        "top_quartile": <float>,
        "verdict": "<verdict>"
      }}
    ],
    "churn_reasons": [
      {{
        "reason": "<likely churn reason specific to their product>",
        "probability": "<one of: high | medium | low>",
        "how_to_detect": "<how to identify if this is happening>"
      }}
    ],
    "retention_strategies": [
      {{
        "strategy": "<strategy name>",
        "description": "<how to implement for their specific startup>",
        "expected_impact": "<realistic improvement in retention %>"
      }}
    ],
    "quick_wins": [
      "<immediate action to improve retention>",
      "<another quick win>",
      "<another quick win>"
    ]
  }},

  "viral_coefficient": {{
    "k_factor": {k_factor},
    "viral_verdict": "<one of: viral | near_viral | growing | stagnant | needs_work>",
    "viral_summary": "<2-3 sentence analysis of their K-factor and viral potential>",
    "viral_loop_design": "<specific viral loop design recommendation for their product>",
    "k_factor_improvements": [
      {{
        "action": "<specific action to improve K-factor>",
        "current_impact": "<what this affects>",
        "potential_k_increase": "<estimated K-factor improvement>",
        "effort": "<one of: low | medium | high>"
      }}
    ],
    "growth_projections": [
      {{
        "month": 1,
        "mau": <integer — projected MAU>,
        "k_assumption": <float>
      }},
      {{
        "month": 3,
        "mau": <integer>,
        "k_assumption": <float>
      }},
      {{
        "month": 6,
        "mau": <integer>,
        "k_assumption": <float>
      }},
      {{
        "month": 12,
        "mau": <integer>,
        "k_assumption": <float>
      }}
    ],
    "viral_examples": [
      {{
        "company": "<Indian or global startup example>",
        "their_loop": "<how they built virality>",
        "lesson": "<what to learn from them>"
      }}
    ]
  }}
}}

Be specific to THIS startup and THESE numbers.
Use Indian startup benchmarks where relevant.
If retention numbers are 0, assume early stage with no data yet
and provide targets to aim for.
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

        ns = data.get("north_star", {})
        ret  = data.get("retention", {})
        viral = data.get("viral_coefficient", {})

        return {
            "raw": raw,
            "north_star_metric": ns.get("north_star_metric", ""),
            "north_star_why": ns.get("north_star_why", ""),
            "north_star_how_to_measure":ns.get("how_to_measure", ""),
            "supporting_metrics": ns.get("supporting_metrics", []),
            "kpi_benchmarks": ns.get("benchmarks", []),
            "warning_signs": ns.get("warning_signs", []),
            "tracking_recommendations": ns.get("tracking_recommendations", []),
            "retention_score": ret.get("retention_score"),
            "retention_verdict": ret.get("retention_verdict", ""),
            "retention_summary":     ret.get("retention_summary", ""),
            "pmf_assessment": ret.get("pmf_assessment", ""),
            "benchmark_comparison":  ret.get("benchmark_comparison", []),
            "churn_reasons": ret.get("churn_reasons", []),
            "retention_strategies":  ret.get("retention_strategies", []),
            "retention_quick_wins":  ret.get("quick_wins", []),

            "k_factor": viral.get("k_factor", k_factor),
            "viral_verdict": viral.get("viral_verdict", ""),
            "viral_summary": viral.get("viral_summary", ""),
            "viral_loop_design": viral.get("viral_loop_design", ""),
            "k_factor_improvements":viral.get("k_factor_improvements", []),
            "growth_projections":   viral.get("growth_projections", []),
            "viral_examples":       viral.get("viral_examples", []),
        }
        
    except Exception as e:
        print(f"Error in analyze_kpis: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"KPI analysis failed: {str(e)}")