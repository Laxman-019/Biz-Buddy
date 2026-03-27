import os
import json
import re
from google import genai 

def analyze_mvp(idea, product_type, launch_weeks, team_size,
                start_date, available_budget, tech_skills,
                platform, user) -> dict:

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not found in environment variables")
    
    client = genai.Client(api_key=api_key)

    startup_name  = user.startup_name or "Not specified"
    industry = user.get_effective_industry() or "Not specified"
    funding_stage = user.get_funding_stage_display() if user.funding_stage else "Not specified"

    prompt = f"""
You are a senior product manager and startup CTO with 15+ years experience
building MVPs for Indian startups. You specialize in lean product development,
no-code tools, and realistic roadmap planning.

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
- Product Type: {product_type}
- Target Launch Timeline: {launch_weeks} weeks
- Team Size: {team_size} people
- Start Date: {start_date or "Not specified"}
- Available Budget: {available_budget}
- Tech Skills: {tech_skills}
- Target Platform: {platform}

## Your Task
Generate a complete MVP plan with 3 sections:
1. MVP Definition
2. Development Roadmap (6 phases)
3. Tech Requirements

Return ONLY valid JSON. No markdown. No code blocks. No explanation.

{{
  "mvp_definition": {{
    "mvp_score": <float 0-100>,
    "mvp_verdict": "<one of: excellent | good | tight | risky | unrealistic>",
    "mvp_summary": "<2-3 sentence assessment of this MVP plan>",
    "core_features": [
      {{
        "feature": "<feature name>",
        "reason": "<why this is a must-have for MVP>",
        "effort": "<one of: low | medium | high>"
      }}
    ],
    "nice_to_haves": [
      {{
        "feature": "<feature name>",
        "reason": "<why defer this to post-MVP>"
      }}
    ],
    "learning_goals": [
      "<specific question this MVP will answer>",
      "<another learning goal>"
    ],
    "success_metrics": [
      {{
        "metric": "<e.g. 100 signups in first month>",
        "target": "<specific number or threshold>"
      }}
    ],
    "mvp_risks": [
      "<specific risk to this MVP plan>",
      "<another risk>"
    ]
  }},

  "development_roadmap": {{
    "total_duration_weeks": <integer>,
    "roadmap_summary": "<overall roadmap assessment>",
    "phases": [
      {{
        "phase": 0,
        "name": "Validation",
        "duration_weeks": <int>,
        "description": "<what happens in this phase>",
        "key_activities": ["<activity 1>", "<activity 2>"],
        "milestone": "<what marks completion of this phase>",
        "risks": ["<phase-specific risk>"]
      }},
      {{
        "phase": 1,
        "name": "MVP Build",
        "duration_weeks": <int>,
        "description": "<what happens>",
        "key_activities": ["<activity 1>", "<activity 2>"],
        "milestone": "<completion marker>",
        "risks": ["<risk>"]
      }},
      {{
        "phase": 2,
        "name": "Alpha Launch",
        "duration_weeks": <int>,
        "description": "<what happens>",
        "key_activities": ["<activity 1>", "<activity 2>"],
        "milestone": "<completion marker>",
        "risks": ["<risk>"]
      }},
      {{
        "phase": 3,
        "name": "Beta Launch",
        "duration_weeks": <int>,
        "description": "<what happens>",
        "key_activities": ["<activity 1>", "<activity 2>"],
        "milestone": "<completion marker>",
        "risks": ["<risk>"]
      }},
      {{
        "phase": 4,
        "name": "Public Launch",
        "duration_weeks": <int>,
        "description": "<what happens>",
        "key_activities": ["<activity 1>", "<activity 2>"],
        "milestone": "<completion marker>",
        "risks": ["<risk>"]
      }},
      {{
        "phase": 5,
        "name": "Iterate",
        "duration_weeks": <int>,
        "description": "<what happens>",
        "key_activities": ["<activity 1>", "<activity 2>"],
        "milestone": "<completion marker>",
        "risks": ["<risk>"]
      }}
    ]
  }},

  "tech_requirements": {{
    "tech_summary": "<2-3 sentence tech strategy assessment>",
    "recommended_stack": [
      {{
        "category": "<e.g. Frontend, Backend, Database, Hosting>",
        "technology": "<specific tool or framework>",
        "reason": "<why this choice for their context>"
      }}
    ],
    "build_items": [
      {{
        "item": "<what to build custom>",
        "reason": "<why this is core IP>"
      }}
    ],
    "buy_items": [
      {{
        "item": "<commodity feature>",
        "tool": "<recommended tool e.g. Razorpay, Firebase Auth>",
        "cost": "<estimated monthly cost>"
      }}
    ],
    "nocode_options": [
      {{
        "tool": "<no-code tool name>",
        "use_case": "<what it replaces>",
        "limitation": "<when to outgrow it>"
      }}
    ],
    "core_ip": [
      "<what to protect as proprietary>",
      "<another IP item>"
    ],
    "tech_recommendations": [
      "<specific tech advice for their situation>",
      "<another recommendation>"
    ]
  }}
}}

Be specific to THIS idea, THIS team size, and THIS budget.
If timeline is unrealistic, say so clearly in mvp_verdict.
Use Indian market context — prefer tools with INR pricing.
If tech_skills is no_code or none, prioritize no-code solutions heavily.
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

        mvp = data.get("mvp_definition", {})
        road  = data.get("development_roadmap", {})
        tech  = data.get("tech_requirements", {})

        return {
            "raw": raw,

            # MVP Definition
            "mvp_score": mvp.get("mvp_score"),
            "mvp_verdict": mvp.get("mvp_verdict", ""),
            "mvp_summary": mvp.get("mvp_summary", ""),
            "core_features": mvp.get("core_features", []),
            "nice_to_haves": mvp.get("nice_to_haves", []),
            "learning_goals":  mvp.get("learning_goals", []),
            "success_metrics": mvp.get("success_metrics", []),
            "mvp_risks": mvp.get("mvp_risks", []),

            # Roadmap
            "total_duration_weeks": road.get("total_duration_weeks"),
            "roadmap_summary": road.get("roadmap_summary", ""),
            "phases": road.get("phases", []),

            # Tech
            "tech_summary": tech.get("tech_summary", ""),
            "recommended_stack": tech.get("recommended_stack", []),
            "build_items": tech.get("build_items", []),
            "buy_items": tech.get("buy_items", []),
            "nocode_options": tech.get("nocode_options", []),
            "core_ip": tech.get("core_ip", []),
            "tech_recommendations": tech.get("tech_recommendations", []),
        }
        
    except Exception as e:
        print(f"Error in analyze_mvp: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"MVP analysis failed: {str(e)}")