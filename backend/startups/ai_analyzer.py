import os
import json
import re
from google import genai

def analyze_idea(idea_title: str, idea_description: str, user) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not found in environment variables")
    
    client = genai.Client(api_key=api_key)
    
    industry = user.get_effective_industry() or "Not specified"
    funding_stage = user.get_funding_stage_display() if user.funding_stage else "Not specified"
    team_size = user.team_size or "Not specified"
    startup_name = user.startup_name or "Not specified"

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
  "overall_score": 75.5,
  "verdict": "go",
  "verdict_summary": "This is a promising idea with strong market potential...",

  "market_demand": {{
    "score": 82,
    "analysis": "The market demand is high because..."
  }},
  "competition": {{
    "score": 65,
    "analysis": "Competition is moderate with a few key players..."
  }},
  "profit_potential": {{
    "score": 78,
    "analysis": "Profit margins could be healthy due to..."
  }},
  "scalability": {{
    "score": 71,
    "analysis": "The business can scale through..."
  }},
  "entry_barriers": {{
    "score": 45,
    "analysis": "Entry barriers are relatively low because..."
  }},
  "founder_fit": {{
    "score": 88,
    "analysis": "The founder's background aligns well because..."
  }},
  "timing_factor": {{
    "score": 79,
    "analysis": "Market timing is favorable due to..."
  }},
  "funding_readiness": {{
    "score": 62,
    "analysis": "The idea is moderately ready for funding..."
  }},

  "key_risks": [
    "Risk 1: ...",
    "Risk 2: ...",
    "Risk 3: ..."
  ],
  "opportunities": [
    "Opportunity 1: ...",
    "Opportunity 2: ...",
    "Opportunity 3: ..."
  ],
  "next_steps": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ...",
    "Step 4: ..."
  ]
}}

Be specific to THIS idea. Do not give generic advice.
Score honestly — a bad idea should score low.
Return ONLY the JSON object. No explanation before or after.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=prompt
        )
        
        raw_response = response.text.strip()
        # print("Raw Gemini Response:", raw_response)
        
        if raw_response.startswith("```"):
            lines = raw_response.split('\n')

            if lines[0].startswith("```"):
                lines = lines[1:]

            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            raw_response = '\n'.join(lines).strip()
        
        if raw_response.startswith("json"):
            raw_response = raw_response[4:].strip()
        
        # Parse JSON
        try:
            data = json.loads(raw_response)

        except json.JSONDecodeError as json_err:
            # print(f"JSON Parse Error: {json_err}")

            json_match = re.search(r'\{.*\}', raw_response, re.DOTALL)

            if json_match:
                data = json.loads(json_match.group())

            else:
                
                # print("Could not parse JSON, using default response")
                data = {
                    "overall_score": 50,
                    "verdict": "caution",
                    "verdict_summary": "Unable to analyze properly. Please try again.",
                    "market_demand": {"score": 50, "analysis": "Analysis unavailable"},
                    "competition": {"score": 50, "analysis": "Analysis unavailable"},
                    "profit_potential": {"score": 50, "analysis": "Analysis unavailable"},
                    "scalability": {"score": 50, "analysis": "Analysis unavailable"},
                    "entry_barriers": {"score": 50, "analysis": "Analysis unavailable"},
                    "founder_fit": {"score": 50, "analysis": "Analysis unavailable"},
                    "timing_factor": {"score": 50, "analysis": "Analysis unavailable"},
                    "funding_readiness": {"score": 50, "analysis": "Analysis unavailable"},
                    "key_risks": ["Unable to analyze risks"],
                    "opportunities": ["Unable to analyze opportunities"],
                    "next_steps": ["Please try submitting again"]
                }
        

        return {
            "raw": raw_response,
            "overall_score": float(data.get("overall_score", 50)),
            "verdict": data.get("verdict", "caution"),
            "verdict_summary": data.get("verdict_summary", ""),
            
            "score_market_demand": float(data.get("market_demand", {}).get("score", 50)),
            "score_competition": float(data.get("competition", {}).get("score", 50)),
            "score_profit_potential": float(data.get("profit_potential", {}).get("score", 50)),
            "score_scalability": float(data.get("scalability", {}).get("score", 50)),
            "score_entry_barriers": float(data.get("entry_barriers", {}).get("score", 50)),
            "score_founder_fit": float(data.get("founder_fit", {}).get("score", 50)),
            "score_timing_factor": float(data.get("timing_factor", {}).get("score", 50)),
            "score_funding_readiness": float(data.get("funding_readiness", {}).get("score", 50)),
            
            "market_demand_analysis": data.get("market_demand", {}).get("analysis", ""),
            "competition_analysis": data.get("competition", {}).get("analysis", ""),
            "profit_analysis": data.get("profit_potential", {}).get("analysis", ""),
            "scalability_analysis": data.get("scalability", {}).get("analysis", ""),
            "entry_barriers_analysis": data.get("entry_barriers", {}).get("analysis", ""),
            "founder_fit_analysis": data.get("founder_fit", {}).get("analysis", ""),
            "timing_analysis": data.get("timing_factor", {}).get("analysis", ""),
            "funding_analysis": data.get("funding_readiness", {}).get("analysis", ""),
            
            "key_risks": data.get("key_risks", []),
            "opportunities": data.get("opportunities", []),
            "next_steps": data.get("next_steps", []),
        }
        
    except Exception as e:
        print(f"Error in analyze_idea: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"AI analysis failed: {str(e)}")