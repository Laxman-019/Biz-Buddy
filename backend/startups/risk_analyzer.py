import os
import json
import re
from google import genai  


def analyze_risks(
    idea, business_type, handles_customer_data,
    handles_payments, regulated_space, regulation_details,
    biggest_worry, user
) -> dict:

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not found in environment variables")
    
    client = genai.Client(api_key=api_key)

    startup_name  = user.startup_name or "Not specified"
    industry      = user.get_effective_industry() or "Not specified"
    funding_stage = user.get_funding_stage_display() if user.funding_stage else "Not specified"
    team_size     = user.team_size or 1

    prompt = f"""
You are a senior startup risk consultant and legal advisor specializing
in Indian startups. You have 20 years of experience identifying, assessing,
and mitigating risks for early-stage companies across all industries in India.

## Startup Context
- Startup: {startup_name}
- Industry: {industry}
- Funding Stage: {funding_stage}
- Team Size: {team_size}
- Business Type: {business_type}

## Validated Idea
- Title: {idea.idea_title}
- Description: {idea.idea_description}
- Idea Score: {idea.overall_score}/100
- Verdict: {idea.verdict}

## Risk Profile Inputs
- Handles Customer Data: {handles_customer_data}
- Handles Payments: {handles_payments}
- Regulated Space: {regulated_space}
- Regulation Details: {regulation_details or "None specified"}
- Founder's Biggest Worry: {biggest_worry or "Not specified"}

## Your Task
Generate a comprehensive startup risk report with 3 sections.
Be specific to THIS startup and THIS industry in India.

Return ONLY valid JSON. No markdown. No code blocks. No extra text.

{{
  "overall": {{
    "risk_score": <float 0-100, where 100 = highest risk>,
    "risk_level": "<one of: low | moderate | high | critical>",
    "risk_summary": "<2-3 sentence overall risk assessment for this specific startup>"
  }},

  "risk_register": [
    {{
      "category": "Market Risk",
      "icon": "📊",
      "severity": "<one of: low | medium | high | critical>",
      "probability": "<one of: low | medium | high>",
      "risk_score": <float 0-100>,
      "description": "<specific market risks for this startup>",
      "key_risks": [
        {{
          "risk": "<specific risk>",
          "impact": "<what happens if this materializes>",
          "early_warning": "<signal to watch for>"
        }}
      ]
    }},
    {{
      "category": "Product Risk",
      "icon": "🛠️",
      "severity": "<severity>",
      "probability": "<probability>",
      "risk_score": <float>,
      "description": "<specific product risks>",
      "key_risks": [
        {{
          "risk": "<risk>",
          "impact": "<impact>",
          "early_warning": "<warning signal>"
        }}
      ]
    }},
    {{
      "category": "Team Risk",
      "icon": "👥",
      "severity": "<severity>",
      "probability": "<probability>",
      "risk_score": <float>,
      "description": "<specific team risks>",
      "key_risks": [
        {{
          "risk": "<risk>",
          "impact": "<impact>",
          "early_warning": "<warning signal>"
        }}
      ]
    }},
    {{
      "category": "Financial Risk",
      "icon": "💰",
      "severity": "<severity>",
      "probability": "<probability>",
      "risk_score": <float>,
      "description": "<specific financial risks>",
      "key_risks": [
        {{
          "risk": "<risk>",
          "impact": "<impact>",
          "early_warning": "<warning signal>"
        }}
      ]
    }},
    {{
      "category": "Competitive Risk",
      "icon": "⚔️",
      "severity": "<severity>",
      "probability": "<probability>",
      "risk_score": <float>,
      "description": "<specific competitive risks>",
      "key_risks": [
        {{
          "risk": "<risk>",
          "impact": "<impact>",
          "early_warning": "<warning signal>"
        }}
      ]
    }},
    {{
      "category": "Regulatory Risk",
      "icon": "⚖️",
      "severity": "<severity>",
      "probability": "<probability>",
      "risk_score": <float>,
      "description": "<specific regulatory risks for India>",
      "key_risks": [
        {{
          "risk": "<risk>",
          "impact": "<impact>",
          "early_warning": "<warning signal>"
        }}
      ]
    }}
  ],

  "legal_compliance": {{
    "legal_summary": "<2-3 sentence legal status assessment>",
    "checklist": [
      {{
        "category": "Entity & Structure",
        "items": [
          {{
            "item": "<legal requirement>",
            "description": "<why this matters>",
            "priority": "<one of: immediate | high | medium | low>",
            "cost_estimate": "<rough cost in INR>",
            "how_to_do": "<specific steps to complete this>"
          }}
        ]
      }},
      {{
        "category": "Intellectual Property",
        "items": [
          {{
            "item": "<IP requirement>",
            "description": "<why this matters>",
            "priority": "<priority>",
            "cost_estimate": "<cost>",
            "how_to_do": "<steps>"
          }}
        ]
      }},
      {{
        "category": "Data & Privacy",
        "items": [
          {{
            "item": "<data requirement>",
            "description": "<why this matters>",
            "priority": "<priority>",
            "cost_estimate": "<cost>",
            "how_to_do": "<steps>"
          }}
        ]
      }},
      {{
        "category": "Financial & Tax",
        "items": [
          {{
            "item": "<financial requirement>",
            "description": "<why this matters>",
            "priority": "<priority>",
            "cost_estimate": "<cost>",
            "how_to_do": "<steps>"
          }}
        ]
      }},
      {{
        "category": "Contracts & Agreements",
        "items": [
          {{
            "item": "<contract requirement>",
            "description": "<why this matters>",
            "priority": "<priority>",
            "cost_estimate": "<cost>",
            "how_to_do": "<steps>"
          }}
        ]
      }}
    ],
    "immediate_legal_actions": [
      {{
        "action": "<specific action>",
        "deadline": "<when to do this>",
        "consequence_of_delay": "<what happens if ignored>"
      }}
    ]
  }},

  "mitigation_plan": {{
    "mitigation_summary": "<2-3 sentence overall mitigation strategy>",
    "actions": [
      {{
        "risk_category": "<which risk this addresses>",
        "action": "<specific mitigation action>",
        "priority": "<one of: immediate | this_month | this_quarter | ongoing>",
        "effort": "<one of: low | medium | high>",
        "impact": "<expected risk reduction>",
        "owner": "<who should own this — CEO/CTO/Legal/etc>"
      }}
    ],
    "monitoring_plan": [
      {{
        "risk": "<risk to monitor>",
        "metric": "<what to measure>",
        "frequency": "<how often to check>",
        "threshold": "<when to act>"
      }}
    ],
    "insurance_recommendations": [
      {{
        "type": "<insurance type>",
        "why_needed": "<why this startup needs it>",
        "estimated_premium": "<rough annual premium in INR>",
        "provider_hint": "<Indian providers to check>"
      }}
    ]
  }}
}}

Be specific to THIS startup. Use Indian legal context throughout.
If handles_customer_data is true, add strong data privacy risks.
If handles_payments is true, add PCI-DSS and RBI payment gateway risks.
If regulated_space is true, prioritize regulatory risks heavily.
Minimum 3 items per legal category, minimum 6 mitigation actions.
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

        overall = data.get("overall", {})
        legal = data.get("legal_compliance", {})
        mit = data.get("mitigation_plan", {})

        return {
            "raw": raw,
            "overall_risk_score": overall.get("risk_score"),
            "overall_risk_level": overall.get("risk_level", ""),
            "risk_summary":overall.get("risk_summary", ""),
            "risk_register": data.get("risk_register", []),
            "legal_summary":legal.get("legal_summary", ""),
            "legal_checklist":legal.get("checklist", []),
            "immediate_legal_actions":legal.get("immediate_legal_actions", []),
            "mitigation_summary":mit.get("mitigation_summary", ""),
            "mitigation_actions":mit.get("actions", []),
            "risk_monitoring_plan":mit.get("monitoring_plan", []),
            "insurance_recommendations": mit.get("insurance_recommendations", []),
        }
        
    except Exception as e:
        print(f"Error in analyze_risks: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Risk analysis failed: {str(e)}")