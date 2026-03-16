import os
import json
import google.generativeai as genai


def analyze_idea(idea_title: str, idea_description: str, user) -> dict:
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Build user context from their profile
    industry      = user.get_effective_industry() or "Not specified"
    funding_stage = user.get_funding_stage_display() if user.funding_stage else "Not specified"
    team_size     = user.team_size or "Not specified"
    startup_name  = user.startup_name or "Not specified"

    prompt = f"""
You are an expert startup analyst with 20 years of experience evaluating startup ideas.
A founder has described their startup idea. Your job is to deeply analyze it and return
a structured JSON report.

## Founder Profile
- Startup Name: {startup_name}
- Industry: {industry}
- Funding Stage: {funding_stage}
- Team Size: {team_size}

## Their Idea
Title: {idea_title}

Description:
{idea_description}

## Your Task
Analyze this idea across 8 dimensions. For each dimension:
- Give a score from 0 to 100
- Write 2-3 sentences of specific analysis

Then give an overall verdict.

## Return ONLY valid JSON in this exact format, no extra text, no markdown, no code blocks:

{{
  "overall_score": <float 0-100>,
  "verdict": "<one of: strong_go | go | caution | no_go | pivot>",
  "verdict_summary": "<2-3 sentence overall assessment>",

  "market_demand": {{
    "score": <float 0-100>,
    "analysis": "<specific analysis of market demand for this idea>"
  }},
  "competition": {{
    "score": <float 0-100>,
    "analysis": "<specific analysis of competitive landscape>"
  }},
  "profit_potential": {{
    "score": <float 0-100>,
    "analysis": "<specific analysis of revenue and margin potential>"
  }},
  "scalability": {{
    "score": <float 0-100>,
    "analysis": "<specific analysis of how scalable this business is>"
  }},
  "entry_barriers": {{
    "score": <float 0-100>,
    "analysis": "<specific analysis of barriers — regulatory, capital, technical>"
  }},
  "founder_fit": {{
    "score": <float 0-100>,
    "analysis": "<specific analysis of how well this fits the founder profile>"
  }},
  "timing_factor": {{
    "score": <float 0-100>,
    "analysis": "<specific analysis of market timing and tailwinds>"
  }},
  "funding_readiness": {{
    "score": <float 0-100>,
    "analysis": "<specific analysis of investor interest and capital requirements>"
  }},

  "key_risks": [
    "<specific risk 1>",
    "<specific risk 2>",
    "<specific risk 3>"
  ],
  "opportunities": [
    "<specific opportunity 1>",
    "<specific opportunity 2>",
    "<specific opportunity 3>"
  ],
  "next_steps": [
    "<concrete actionable step 1>",
    "<concrete actionable step 2>",
    "<concrete actionable step 3>",
    "<concrete actionable step 4>"
  ]
}}

Be specific to THIS idea. Do not give generic advice.
Score honestly — a bad idea should score low.
Return ONLY the JSON object. No explanation before or after.
"""

    response = model.generate_content(prompt)
    raw_response = response.text.strip()

    # Strip markdown code blocks if Gemini adds them
    if raw_response.startswith("```"):
        raw_response = raw_response.split("```")[1]
        if raw_response.startswith("json"):
            raw_response = raw_response[4:]
        raw_response = raw_response.strip()

    data = json.loads(raw_response)

    return {
        "raw":                     raw_response,
        "overall_score":           data.get("overall_score"),
        "verdict":                 data.get("verdict"),
        "verdict_summary":         data.get("verdict_summary", ""),

        "score_market_demand":     data["market_demand"]["score"],
        "score_competition":       data["competition"]["score"],
        "score_profit_potential":  data["profit_potential"]["score"],
        "score_scalability":       data["scalability"]["score"],
        "score_entry_barriers":    data["entry_barriers"]["score"],
        "score_founder_fit":       data["founder_fit"]["score"],
        "score_timing_factor":     data["timing_factor"]["score"],
        "score_funding_readiness": data["funding_readiness"]["score"],

        "market_demand_analysis":  data["market_demand"]["analysis"],
        "competition_analysis":    data["competition"]["analysis"],
        "profit_analysis":         data["profit_potential"]["analysis"],
        "scalability_analysis":    data["scalability"]["analysis"],
        "entry_barriers_analysis": data["entry_barriers"]["analysis"],
        "founder_fit_analysis":    data["founder_fit"]["analysis"],
        "timing_analysis":         data["timing_factor"]["analysis"],
        "funding_analysis":        data["funding_readiness"]["analysis"],

        "key_risks":               data.get("key_risks", []),
        "opportunities":           data.get("opportunities", []),
        "next_steps":              data.get("next_steps", []),
    }