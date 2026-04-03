import os
import json
import re
from google import genai  


def analyze_team(
    idea, founders, is_solo_founder,
    current_team_size, hiring_budget_12m,
    priority_roles, work_mode,
    current_advisors, expertise_gaps, user
) -> dict:

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not found in environment variables")
    
    client = genai.Client(api_key=api_key)

    startup_name  = user.startup_name or "Not specified"
    industry = user.get_effective_industry() or "Not specified"
    funding_stage = user.get_funding_stage_display() if user.funding_stage else "Not specified"

    founder_summary = "\n".join([
        f"- {f.get('name', 'Founder')}: {f.get('role', 'Role not specified')}, "
        f"Background: {f.get('background', 'Not specified')}, "
        f"Equity: {f.get('equity_pct', 0)}%"
        for f in founders
    ]) if founders else "Solo founder — no co-founders yet"

    total_equity = sum(f.get('equity_pct', 0) for f in founders)

    prompt = f"""
You are a world-class startup talent advisor and culture expert
specializing in early-stage Indian startups. You have helped 200+
startups build their founding teams and scale their organizations.

## Startup Context
- Startup: {startup_name}
- Industry: {industry}
- Funding Stage: {funding_stage}

## Validated Idea
- Title: {idea.idea_title}
- Description: {idea.idea_description}
- Idea Score: {idea.overall_score}/100

## Team Inputs

### Founding Team
Solo Founder: {is_solo_founder}
{founder_summary}
Total Equity Allocated: {total_equity}%

### Hiring
- Current Team Size: {current_team_size}
- 12-Month Hiring Budget: ₹{hiring_budget_12m}
- Priority Roles: {priority_roles or "Not specified"}
- Work Mode: {work_mode}

### Advisory
- Current Advisors: {current_advisors or "None"}
- Expertise Gaps: {expertise_gaps or "Not specified"}

## Your Task
Generate a complete Team & Culture report with 3 sections.

Return ONLY valid JSON. No markdown. No code blocks. No extra text.

{{
  "founding_team": {{
    "team_score": <float 0-100>,
    "team_verdict": "<one of: strong | good | adequate | weak | critical>",
    "team_summary": "<2-3 sentence assessment of this founding team>",
    "skills_gap_analysis": [
      {{
        "skill_area": "<e.g. Sales & Marketing, Technical, Finance>",
        "gap_level": "<one of: critical | important | minor>",
        "description": "<why this gap matters for their startup>",
        "how_to_fill": "<hire / advisor / learn / partner>"
      }}
    ],
    "equity_assessment": "<analysis of their equity split — is it fair and structured?>",
    "vesting_recommendation": "<specific vesting schedule recommendation with cliff>",
    "conflict_risks": [
      {{
        "risk": "<specific co-founder conflict scenario>",
        "probability": "<one of: high | medium | low>",
        "prevention": "<how to prevent this specific risk>"
      }}
    ],
    "team_recommendations": [
      "<specific recommendation for this team>",
      "<another recommendation>",
      "<another recommendation>"
    ],
    "founder_agreements": [
      {{
        "document": "<document name e.g. Founder Agreement>",
        "purpose": "<why this document is critical>",
        "urgency": "<one of: immediate | within_month | within_quarter>"
      }}
    ]
  }},

  "hiring_plan": {{
    "hiring_score": <float 0-100>,
    "hiring_summary": "<2-3 sentence assessment of their hiring plan>",
    "hiring_roadmap": [
      {{
        "role": "<specific role title>",
        "hire_by_month": <integer — which month to hire>,
        "priority": "<one of: critical | high | medium>",
        "why_now": "<why hire this role at this time>",
        "monthly_cost": <float in rupees>,
        "where_to_find": "<specific source for this role>",
        "green_flags": ["<what to look for>"],
        "red_flags": ["<what to avoid>"]
      }}
    ],
    "recruitment_channels": [
      {{
        "channel": "<channel name>",
        "best_for": "<which roles this works for>",
        "cost": "<free / paid / range>",
        "tip": "<specific tip for using this channel>"
      }}
    ],
    "culture_values": [
      {{
        "value": "<culture value>",
        "description": "<what this means in practice>",
        "how_to_hire_for": "<interview question or signal>"
      }}
    ],
    "first_10_guide": [
      "<principle for hiring first 10 employees>",
      "<another principle>",
      "<another principle>"
    ],
    "compensation_benchmarks": [
      {{
        "role": "<role title>",
        "salary_range": "<e.g. ₹8L – ₹15L per year>",
        "equity_range": "<e.g. 0.1% – 0.5%>",
        "stage": "<early stage / growth stage>"
      }}
    ],
    "hiring_mistakes": [
      "<common hiring mistake to avoid>",
      "<another mistake>"
    ]
  }},

  "advisory_board": {{
    "advisory_score": <float 0-100>,
    "advisory_summary": "<2-3 sentence assessment of advisory needs>",
    "ideal_advisors": [
      {{
        "advisor_type": "<e.g. Industry Expert, Technical Advisor>",
        "why_needed": "<specific gap this fills for their startup>",
        "profile": "<what background/experience to look for>",
        "equity_suggested": "<e.g. 0.25% – 0.5%>",
        "commitment": "<expected monthly time commitment>"
      }}
    ],
    "advisor_equity_guide": "<comprehensive guide to advisor equity at their stage>",
    "where_to_find": [
      {{
        "source": "<where to find advisors>",
        "best_for": "<which type of advisor>",
        "approach": "<how to reach out>"
      }}
    ],
    "outreach_approach": "<specific outreach script/template for approaching advisors>",
    "meeting_cadence": "<recommended structure for advisor meetings>",
    "advisor_red_flags": [
      "<red flag to watch for in potential advisors>",
      "<another red flag>"
    ]
  }}
}}

Be specific to THIS startup, THIS team, and THIS industry.
Use Indian context — salary benchmarks in INR, Indian platforms.
If solo founder, emphasize co-founder search and advisory importance.
Minimum 4 roles in hiring_roadmap, 5 advisor types, 5 culture values.
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

        team    = data.get("founding_team", {})
        hiring  = data.get("hiring_plan", {})
        advisory= data.get("advisory_board", {})

        return {
            "raw": raw,
            "team_score": team.get("team_score"),
            "team_verdict": team.get("team_verdict", ""),
            "team_summary": team.get("team_summary", ""),
            "skills_gap_analysis": team.get("skills_gap_analysis", []),
            "equity_assessment": team.get("equity_assessment", ""),
            "vesting_recommendation": team.get("vesting_recommendation", ""),
            "conflict_risks": team.get("conflict_risks", []),
            "team_recommendations": team.get("team_recommendations", []),
            "founder_agreements": team.get("founder_agreements", []),
            "hiring_score": hiring.get("hiring_score"),
            "hiring_summary": hiring.get("hiring_summary", ""),
            "hiring_roadmap": hiring.get("hiring_roadmap", []),
            "recruitment_channels": hiring.get("recruitment_channels", []),
            "culture_values": hiring.get("culture_values", []),
            "first_10_guide": hiring.get("first_10_guide", []),
            "compensation_benchmarks":  hiring.get("compensation_benchmarks", []),
            "hiring_mistakes": hiring.get("hiring_mistakes", []),
            "advisory_score": advisory.get("advisory_score"),
            "advisory_summary": advisory.get("advisory_summary", ""),
            "ideal_advisors": advisory.get("ideal_advisors", []),
            "advisor_equity_guide": advisory.get("advisor_equity_guide", ""),
            "where_to_find": advisory.get("where_to_find", []),
            "outreach_approach": advisory.get("outreach_approach", ""),
            "meeting_cadence": advisory.get("meeting_cadence", ""),
            "advisor_red_flags": advisory.get("advisor_red_flags", []),
        }
        
    except Exception as e:
        print(f"Error in analyze_team: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Team analysis failed: {str(e)}")