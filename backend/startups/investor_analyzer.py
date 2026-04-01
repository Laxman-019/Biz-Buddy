import os
import json
import re
from google import genai  


def analyze_investor_readiness(
    idea, funding_stage, amount_raising,
    team_description, traction_so_far,
    company_stage, completed_items, user
) -> dict:

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not found in environment variables")
    
 
    client = genai.Client(api_key=api_key)

    startup_name  = user.startup_name or "Not specified"
    industry      = user.get_effective_industry() or "Not specified"

    prompt = f"""
    You are a top-tier startup fundraising advisor with 20 years of experience
    helping Indian startups raise from angels, VCs and family offices.
    You have deep knowledge of the Indian startup funding ecosystem —
    Sequoia India, Accel, Blume, Elevation, Matrix, angels like Kunal Shah,
    Anupam Mittal, Ronnie Screwvala, etc.

    ## Startup Context
    - Startup: {startup_name}
    - Industry: {industry}
    - Funding Stage: {funding_stage}
    - Amount Raising: ₹{amount_raising}
    - Company Stage: {company_stage}

    ## Validated Idea
    - Title: {idea.idea_title}
    - Description: {idea.idea_description}
    - Idea Score: {idea.overall_score}/100
    - Verdict: {idea.verdict}

    ## Founder Inputs
    - Team: {team_description}
    - Traction: {traction_so_far}
    - Already Completed DD Items: {completed_items}

    ## Your Task
    Generate a complete investor readiness report with 3 sections.

    Return ONLY valid JSON. No markdown. No code blocks. No extra text.

    {{
    "pitch_deck": {{
        "pitch_score": <float 0-100>,
        "pitch_verdict": "<one of: investor_ready | nearly_ready | needs_work | not_ready>",
        "pitch_summary": "<2-3 sentence overall pitch assessment>",
        "slides": [
        {{
            "slide_number": 1,
            "slide_title": "Problem",
            "content": "<full content for this slide — specific to their idea>",
            "tip": "<one specific tip to make this slide stronger>"
        }},
        {{
            "slide_number": 2,
            "slide_title": "Solution",
            "content": "<full content>",
            "tip": "<tip>"
        }},
        {{
            "slide_number": 3,
            "slide_title": "Market Size",
            "content": "<full content with TAM SAM SOM>",
            "tip": "<tip>"
        }},
        {{
            "slide_number": 4,
            "slide_title": "Why Now",
            "content": "<full content>",
            "tip": "<tip>"
        }},
        {{
            "slide_number": 5,
            "slide_title": "Product",
            "content": "<full content>",
            "tip": "<tip>"
        }},
        {{
            "slide_number": 6,
            "slide_title": "Traction",
            "content": "<full content based on traction provided>",
            "tip": "<tip>"
        }},
        {{
            "slide_number": 7,
            "slide_title": "Business Model",
            "content": "<full content>",
            "tip": "<tip>"
        }},
        {{
            "slide_number": 8,
            "slide_title": "Competition",
            "content": "<full content>",
            "tip": "<tip>"
        }},
        {{
            "slide_number": 9,
            "slide_title": "Team",
            "content": "<full content based on team description>",
            "tip": "<tip>"
        }},
        {{
            "slide_number": 10,
            "slide_title": "Financials & Ask",
            "content": "<full content — amount raising, use of funds, milestones>",
            "tip": "<tip>"
        }}
        ],
        "investor_questions": [
        "<tough question investor will ask>",
        "<another question>",
        "<another question>",
        "<another question>",
        "<another question>"
        ],
        "storytelling_tips": [
        "<specific storytelling tip for this pitch>",
        "<another tip>",
        "<another tip>"
        ]
    }},

    "investor_list": {{
        "investors": [
        {{
            "name": "<investor or fund name>",
            "type": "<one of: vc | angel | family_office | accelerator>",
            "fund": "<fund name if VC>",
            "focus_industries": ["<industry 1>", "<industry 2>"],
            "stage_focus": "<pre_seed / seed / series_a>",
            "typical_check_size": "<e.g. ₹50L - ₹2Cr>",
            "portfolio_relevant": ["<relevant portfolio company>"],
            "why_good_fit": "<specific reason this investor fits their startup>",
            "approach_strategy": "<how to approach — cold email / warm intro / event>",
            "linkedin_or_twitter": "<handle or profile hint>"
        }}
        ],
        "outreach_template": "<full cold email template personalized to their startup>",
        "warm_intro_strategy": "<how to find warm intros for their specific space>",
        "tips": [
        "<specific investor outreach tip>",
        "<another tip>",
        "<another tip>"
        ]
    }},

    "due_diligence": {{
        "dd_score": <float 0-100 based on completed_items>,
        "dd_summary": "<assessment of their DD readiness>",
        "checklist": [
        {{
            "category": "Legal",
            "items": [
            {{
                "item": "<document or requirement>",
                "description": "<what this is and why investors need it>",
                "priority": "<one of: critical | high | medium | low>",
                "how_to_prepare": "<specific steps to get this ready>",
                "completed": <true if in completed_items else false>
            }}
            ]
        }},
        {{
            "category": "Financial",
            "items": [
            {{
                "item": "<item>",
                "description": "<description>",
                "priority": "<priority>",
                "how_to_prepare": "<steps>",
                "completed": <boolean>
            }}
            ]
        }},
        {{
            "category": "Product",
            "items": [
            {{
                "item": "<item>",
                "description": "<description>",
                "priority": "<priority>",
                "how_to_prepare": "<steps>",
                "completed": <boolean>
            }}
            ]
        }},
        {{
            "category": "Team",
            "items": [
            {{
                "item": "<item>",
                "description": "<description>",
                "priority": "<priority>",
                "how_to_prepare": "<steps>",
                "completed": <boolean>
            }}
            ]
        }},
        {{
            "category": "Market",
            "items": [
            {{
                "item": "<item>",
                "description": "<description>",
                "priority": "<priority>",
                "how_to_prepare": "<steps>",
                "completed": <boolean>
            }}
            ]
        }}
        ],
        "priority_items": [
        "<most critical missing item>",
        "<second most critical>",
        "<third>"
        ],
        "red_flags": [
        "<red flag investors will spot>",
        "<another red flag>"
        ],
        "preparation_tips": [
        "<specific tip to get DD ready faster>",
        "<another tip>",
        "<another tip>"
        ]
    }}
    }}

    Be specific to THIS startup, THIS industry, and THIS stage.
    For investor list, include real Indian investors active in this space.
    Minimum 8 investors in the list.
    DD checklist must have at least 4 items per category.
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

        pitch    = data.get("pitch_deck", {})
        inv_list = data.get("investor_list", {})
        dd       = data.get("due_diligence", {})

        return {
            "raw": raw,

            # Pitch
            "pitch_score": pitch.get("pitch_score"),
            "pitch_verdict": pitch.get("pitch_verdict", ""),
            "pitch_summary": pitch.get("pitch_summary", ""),
            "pitch_slides": pitch.get("slides", []),
            "investor_questions": pitch.get("investor_questions", []),
            "storytelling_tips":  pitch.get("storytelling_tips", []),

            # Investor List
            "investor_list": inv_list.get("investors", []),
            "outreach_template": inv_list.get("outreach_template", ""),
            "warm_intro_strategy": inv_list.get("warm_intro_strategy", ""),
            "investor_tips":       inv_list.get("tips", []),

            # DD
            "dd_score": dd.get("dd_score"),
            "dd_summary": dd.get("dd_summary", ""),
            "dd_checklist": dd.get("checklist", []),
            "dd_priority_items": dd.get("priority_items", []),
            "dd_red_flags":        dd.get("red_flags", []),
            "dd_preparation_tips": dd.get("preparation_tips", []),
        }
        
    except Exception as e:
        print(f"Error in analyze_investor_readiness: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Investor readiness analysis failed: {str(e)}")