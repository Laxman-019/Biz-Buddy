import os
import json
import google.genai as genai


def analyze_market(product_name, industry, target_region,
                   customer_type, description, user) -> dict:

    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")

    startup_name  = user.startup_name or "Not specified"
    user_industry = user.get_effective_industry() or industry

    prompt = f"""
You are a senior market research analyst specializing in startup markets,
especially in the Indian and global startup ecosystem.

## Product Being Analyzed
- Product/Service: {product_name}
- Industry: {industry}
- Target Region: {target_region}
- Customer Type: {customer_type}
- Description: {description}

## Founder Context
- Startup: {startup_name}
- Founder's Industry Background: {user_industry}

## Your Task
Generate a comprehensive market intelligence report with 3 sections:
1. Market Sizing (TAM, SAM, SOM)
2. Trend Analysis
3. Customer Personas (exactly 3 personas)

Return ONLY valid JSON. No markdown. No code blocks. No explanation.

{{
  "market_summary": "<2-3 sentence overview of this market opportunity>",

  "market_sizing": {{
    "tam_value": "<e.g. ₹45,000 Crore or $12B>",
    "tam_explanation": "<how TAM was estimated, what it represents>",
    "sam_value": "<e.g. ₹8,000 Crore>",
    "sam_explanation": "<why this portion is serviceable given region and model>",
    "som_value": "<e.g. ₹200 Crore in year 3>",
    "som_explanation": "<realistic capture based on stage and competition>",
    "methodology": "<brief note on how these numbers were calculated>"
  }},

  "trend_analysis": {{
    "market_growth_rate": "<e.g. 24% CAGR>",
    "market_direction": "<one of: growing | stable | declining>",
    "trend_summary": "<2-3 sentences on overall market direction>",
    "tailwinds": [
      "<specific positive trend 1>",
      "<specific positive trend 2>",
      "<specific positive trend 3>"
    ],
    "headwinds": [
      "<specific challenge or negative trend 1>",
      "<specific challenge or negative trend 2>"
    ],
    "tech_shifts": [
      "<technology change impacting this market>",
      "<another tech shift>"
    ],
    "regulatory_factors": [
      "<relevant government policy or regulation>",
      "<another regulatory factor>"
    ],
    "consumer_shifts": [
      "<how consumer behavior is changing in this space>",
      "<another behavioral shift>"
    ]
  }},

  "customer_personas": [
    {{
      "persona_name": "<give a realistic Indian name>",
      "persona_title": "<e.g. The Struggling Restaurant Owner>",
      "age_range": "<e.g. 32-45>",
      "location": "<e.g. Tier 2 cities — Pune, Indore, Jaipur>",
      "income": "<e.g. ₹8L – ₹20L per year>",
      "job_title": "<e.g. Restaurant Owner / F&B Entrepreneur>",
      "education": "<e.g. Graduate>",
      "goals": [
        "<what they want to achieve>",
        "<another goal>"
      ],
      "pain_points": [
        "<specific frustration>",
        "<another pain point>"
      ],
      "current_solutions": "<what they use today to solve this problem>",
      "buying_trigger": "<what makes them finally decide to buy a solution>",
      "channels": [
        "<where they discover products — e.g. WhatsApp groups>",
        "<another channel>"
      ],
      "objections": [
        "<reason they might not buy>",
        "<another objection>"
      ],
      "willingness_to_pay": "<e.g. ₹500 – ₹2,000/month>"
    }},
    {{
      "persona_name": "<second persona name>",
      "persona_title": "<second persona title>",
      "age_range": "<age range>",
      "location": "<location>",
      "income": "<income range>",
      "job_title": "<job title>",
      "education": "<education>",
      "goals": ["<goal 1>", "<goal 2>"],
      "pain_points": ["<pain 1>", "<pain 2>"],
      "current_solutions": "<current solution>",
      "buying_trigger": "<trigger>",
      "channels": ["<channel 1>", "<channel 2>"],
      "objections": ["<objection 1>", "<objection 2>"],
      "willingness_to_pay": "<price range>"
    }},
    {{
      "persona_name": "<third persona name>",
      "persona_title": "<third persona title>",
      "age_range": "<age range>",
      "location": "<location>",
      "income": "<income range>",
      "job_title": "<job title>",
      "education": "<education>",
      "goals": ["<goal 1>", "<goal 2>"],
      "pain_points": ["<pain 1>", "<pain 2>"],
      "current_solutions": "<current solution>",
      "buying_trigger": "<trigger>",
      "channels": ["<channel 1>", "<channel 2>"],
      "objections": ["<objection 1>", "<objection 2>"],
      "willingness_to_pay": "<price range>"
    }}
  ],

  "key_insights": [
    "<most important market insight>",
    "<second key insight>",
    "<third key insight>",
    "<fourth key insight>"
  ]
}}

Be specific to THIS product and THIS region.
Use Indian market context where region is India.
Use real market data and realistic estimates.
"""

    response = model.generate_content(prompt)
    raw = response.text.strip()

    # Strip markdown if Gemini adds it
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    data = json.loads(raw)

    sizing = data.get("market_sizing", {})
    trends = data.get("trend_analysis", {})
    personas = data.get("customer_personas", [])

    return {
        "raw":raw,
        "market_summary":data.get("market_summary", ""),
        "key_insights":data.get("key_insights", []),

        # Sizing
        "tam_value":sizing.get("tam_value", ""),
        "tam_explanation":sizing.get("tam_explanation", ""),
        "sam_value":sizing.get("sam_value", ""),
        "sam_explanation":sizing.get("sam_explanation", ""),
        "som_value":sizing.get("som_value", ""),
        "som_explanation":sizing.get("som_explanation", ""),
        "sizing_methodology": sizing.get("methodology", ""),

        # Trends
        "market_growth_rate":trends.get("market_growth_rate",""),
        "market_direction":trends.get("market_direction", ""),
        "trend_summary":trends.get("trend_summary", ""),
        "tailwinds":trends.get("tailwinds", []),
        "headwinds":trends.get("headwinds", []),
        "tech_shifts":trends.get("tech_shifts", []),
        "regulatory_factors":trends.get("regulatory_factors", []),
        "consumer_shifts":trends.get("consumer_shifts", []),

        # Personas
        "personas": personas,
    }