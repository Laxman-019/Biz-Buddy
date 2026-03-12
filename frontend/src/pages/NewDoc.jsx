import { useState, useEffect, useRef } from "react";

const startupSections = [
  {
    id: "idea-validation",
    category: "Idea Validation Engine",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    darkAccent: "#6D28D9",
    icon: "💡",
    items: [
      {
        title: "Idea Scorecard",
        badge: "Validation Score",
        badgeColor: "#8B5CF6",
        description:
          "AI-powered evaluation of your business concept across 8 critical dimensions. Provides a comprehensive viability score with actionable feedback on weak spots.",
        details: [
          { label: "Market Demand", value: "Analyzes search trends, social media conversations, and existing solutions to gauge genuine customer need." },
          { label: "Competition Level", value: "Evaluates market saturation — too many competitors indicates crowded space, too few may signal low demand." },
          { label: "Profit Potential", value: "Estimates realistic margins based on industry benchmarks and your proposed business model." },
          { label: "Scalability", value: "Assesses whether the business can grow without proportional cost increases." },
          { label: "Entry Barriers", value: "Identifies technical, regulatory, or capital requirements that could block progress." },
          { label: "Founder Fit", value: "Measures alignment with your skills, experience, and passion — critical for persistence." },
          { label: "Timing Factor", value: "Evaluates whether market conditions, technology, and consumer behavior favor launch now." },
          { label: "Funding Readiness", value: "Estimates capital requirements vs. typical investor interest in this space." },
        ],
        scores: [
          { range: "90–100", label: "Strong Launch", color: "#059669" },
          { range: "75–89", label: "Promising", color: "#16A34A" },
          { range: "60–74", label: "Needs Refinement", color: "#CA8A04" },
          { range: "40–59", label: "High Risk", color: "#EA580C" },
          { range: "< 40", label: "Pivot Recommended", color: "#DC2626" },
        ],
        tips: [
          "Low Market Demand + High Competition = Avoid entirely",
          "High Demand + Low Competition = Golden opportunity — move fast",
          "Low Profit Potential can be overcome with volume or premium positioning",
          "Weak Founder Fit is the #1 reason startups fail — be honest here",
          "Re-run scorecard after refining your concept to track improvement",
        ],
        highlight: {
          label: "The Mom Test",
          text: "Your idea score is based on data, not opinions. Avoid asking friends/family if they \"like\" your idea — they will lie to be nice. Validate through real customer behaviour and market signals.",
        },
      },
      {
        title: "Problem Validation",
        badge: "Customer Discovery",
        badgeColor: "#8B5CF6",
        description: "Deep-dive analysis into whether the problem you are solving is real, urgent, and widespread enough to build a business around.",
        details: [
          { label: "Problem Frequency", value: "How often does the target customer encounter this problem? Daily > Weekly > Monthly > Rarely" },
          { label: "Problem Severity", value: "Is this a \"painkiller\" (must-solve) or \"vitamin\" (nice-to-have)? Painkillers win." },
          { label: "Current Solutions", value: "What do people use today? Spreadsheets? Manual processes? Competitors? Workarounds signal opportunity." },
          { label: "Willingness to Pay", value: "Have customers already spent money on solutions? Are they paying for alternatives now?" },
          { label: "Search Volume", value: "How many people actively search for solutions to this problem each month?" },
        ],
        tips: [
          "If customers aren't already paying for some solution, getting them to pay you will be extremely hard",
          "Workarounds (spreadsheets, manual processes) are actually GOOD — they prove the problem exists",
          "Interview 20–30 potential customers before writing any code or building anything",
          "Look for emotional language — frustrated, tired of, wasted, struggling — these signal real pain",
        ],
      },
      {
        title: "Solution Fit",
        badge: "Concept Testing",
        badgeColor: "#8B5CF6",
        description: "Evaluates how well your proposed solution addresses the validated problem. Tests assumptions about features, pricing, and delivery before you build.",
        details: [
          { label: "Feature Must-Haves", value: "The 20% of features that will deliver 80% of the value — your MVP core." },
          { label: "Delight Factors", value: "Features that exceed expectations and create differentiation." },
          { label: "Pricing Test", value: "What price points have customers indicated they would pay? Record actual numbers." },
          { label: "Purchase Triggers", value: "What specific event makes someone decide to buy? Onboarding a new employee? Hitting a revenue milestone?" },
          { label: "Objections", value: "Common reasons customers give for NOT buying or delaying decision." },
        ],
        tips: [
          "Create a landing page describing your solution with a \"Buy Now\" or \"Join Waitlist\" button before building",
          "Measure click-through rates — high interest validates the solution",
          "Run smoke tests — can you get people to pay before you build?",
          "If people won't pre-order or join a waitlist, your solution may not be compelling enough",
        ],
      },
    ],
  },
  {
    id: "market-research",
    category: "Market Intelligence",
    color: "#0891B2",
    darkAccent: "#0E7490",
    icon: "📊",
    items: [
      {
        title: "Market Sizing",
        badge: "TAM SAM SOM",
        badgeColor: "#0891B2",
        description: "Calculates your market opportunity at three levels — helping you understand the total potential and set realistic revenue targets.",
        details: [
          { label: "TAM — Total Addressable Market", value: "The total global revenue opportunity if 100% of possible customers bought your solution." },
          { label: "SAM — Serviceable Available Market", value: "The portion of TAM you can realistically reach given geographic, regulatory, and channel constraints." },
          { label: "SOM — Serviceable Obtainable Market", value: "The portion of SAM you can realistically capture in the next 3–5 years — your real target." },
        ],
        formula: "SOM = SAM × Realistic Market Share %",
        tips: [
          "Investors expect you to know your TAM, but they invest in your SOM",
          "TAM that is too small signals a lifestyle business, not a venture-scale opportunity",
          "Be brutally honest about SOM — over-optimistic projections destroy credibility",
          "Use bottom-up (customer count × price) not just top-down (percentage of giant market)",
        ],
        highlight: {
          label: "Bottom-Up Calculation",
          text: "Instead of saying \"we'll capture 1% of a $50B market\", calculate: \"There are 10,000 coffee shops in our city. We can reach 2,000 in year one. At $500/year, our SOM is $1M.\" This is far more credible.",
        },
      },
      {
        title: "Trend Analysis",
        badge: "Market Direction",
        badgeColor: "#0891B2",
        description: "Identifies macro trends affecting your market — tailwinds you can ride and headwinds you must navigate.",
        details: [
          { label: "Growth Rate", value: "Is the market expanding, stable, or shrinking? CAGR (Compound Annual Growth Rate) over 3–5 years." },
          { label: "Technology Shifts", value: "New technologies that enable solutions previously impossible or too expensive." },
          { label: "Regulatory Changes", value: "Upcoming laws or policies that could help or hurt your business." },
          { label: "Consumer Behavior", value: "Shifts in how people buy — e.g., remote work, sustainability focus, subscription fatigue." },
          { label: "Economic Factors", value: "Interest rates, disposable income trends, employment rates affecting spending." },
        ],
        tips: [
          "Ride tailwinds — don't fight them. Entering a shrinking market requires extraordinary reasons",
          "Regulatory changes can create entire new markets (e.g., cannabis, crypto, data privacy)",
          "Google Trends shows you what people search for over time — free market direction data",
        ],
      },
      {
        title: "Customer Personas",
        badge: "Target Audience",
        badgeColor: "#0891B2",
        description: "Creates detailed profiles of your ideal customers — who they are, what drives them, and how to reach them.",
        details: [
          { label: "Demographics", value: "Age, location, income, education, job title, company size." },
          { label: "Psychographics", value: "Values, fears, aspirations, hobbies, media consumption." },
          { label: "Behaviors", value: "Buying patterns, brand loyalty, research process, decision triggers." },
          { label: "Channels", value: "Where they get information — LinkedIn? TikTok? Industry publications? Podcasts?" },
          { label: "Objections", value: "Why they might NOT buy — price, trust, timing, competing priorities." },
        ],
        tips: [
          "Create 1–3 primary personas — more than that and you lose focus",
          "Give each persona a name and photo — make them real",
          "Map the customer journey: Awareness → Consideration → Decision → Retention",
          "Interview real people in your target audience to validate personas",
        ],
      },
    ],
  },
  {
    id: "business-model",
    category: "Business Model Builder",
    color: "#059669",
    darkAccent: "#047857",
    icon: "🧱",
    items: [
      {
        title: "Lean Canvas",
        badge: "One-Page Plan",
        badgeColor: "#059669",
        description: "Interactive Lean Canvas template — the standard one-page business model for startups. Faster and more flexible than traditional business plans.",
        details: [
          { label: "Problem", value: "Top 3 problems your customers face that you will solve." },
          { label: "Solution", value: "Top 3 features your product offers to solve each problem." },
          { label: "Unique Value Proposition", value: "Single, clear, compelling message that turns a visitor into a prospect." },
          { label: "Unfair Advantage", value: "Something that cannot be easily copied or bought." },
          { label: "Customer Segments", value: "Target customers — be specific, not \"everyone\"." },
          { label: "Channels", value: "Path to customers — how will you reach them?" },
          { label: "Revenue Streams", value: "How will you make money? Pricing model, revenue sources." },
          { label: "Cost Structure", value: "Fixed and variable costs to operate." },
          { label: "Key Metrics", value: "Key activities you measure — the numbers that show progress." },
        ],
        tips: [
          "Complete the canvas in 20 minutes — if it takes longer, you're overthinking",
          "The Unfair Advantage is hardest — if you don't have one, build one or accept you're in a competitive grind",
          "Update the canvas monthly as you learn from customers",
          "Share with advisors for feedback — their questions reveal gaps",
        ],
        highlight: {
          label: "Canvas vs. Business Plan",
          text: "Traditional business plans take months and become obsolete in weeks. The Lean Canvas takes 20 minutes and evolves with your learning. Investors now expect canvas thinking — agility over documentation.",
        },
      },
      {
        title: "Revenue Model",
        badge: "Monetization Strategy",
        badgeColor: "#059669",
        description: "Defines exactly how your startup generates income — the engine that turns users into revenue.",
        details: [
          { label: "Transaction", value: "One-time payment per purchase — simple but requires continuous acquisition." },
          { label: "Subscription", value: "Recurring revenue (monthly/annual) — predictable, builds long-term value." },
          { label: "Freemium", value: "Free basic version, paid premium features — high adoption, low initial revenue." },
          { label: "Marketplace", value: "Take rate on transactions between buyers and sellers." },
          { label: "Advertising", value: "Sell access to audience attention — requires massive scale." },
          { label: "Licensing", value: "Charge for rights to use your technology or IP." },
          { label: "Usage-based", value: "Pay per API call, per seat, per unit consumed." },
        ],
        tips: [
          "Match revenue model to customer preference — B2B prefers predictable subscriptions",
          "Multiple revenue streams reduce risk but complicate focus",
          "Test willingness to pay with a simple \"Would you pay $X for this?\" before building",
          "Calculate LTV (Lifetime Value) early — how much a customer pays over their entire relationship",
        ],
      },
      {
        title: "Unit Economics",
        badge: "Per-Customer Math",
        badgeColor: "#059669",
        description: "Breaks down the financials of serving a single customer — the atomic unit of your business model. If unit economics don't work, scale amplifies losses.",
        details: [
          { label: "CAC (Customer Acquisition Cost)", value: "Total sales & marketing spend ÷ number of new customers. What does it cost to get one customer?" },
          { label: "LTV (Lifetime Value)", value: "Average revenue per customer × average customer lifespan. What is one customer worth over time?" },
          { label: "Contribution Margin", value: "Revenue from customer minus variable costs to serve them." },
          { label: "Payback Period", value: "CAC ÷ monthly contribution margin. Months to recover acquisition cost." },
        ],
        formula: "Healthy SaaS: LTV ≥ 3× CAC, Payback Period ≤ 12 months",
        tips: [
          "If CAC > LTV, you lose money on every customer — business model fails",
          "Reduce CAC through organic channels, referrals, product-led growth",
          "Increase LTV through upsells, longer subscriptions, reduced churn",
          "Track unit economics from day one — don't wait until you have \"enough data\"",
        ],
      },
    ],
  },
  {
    id: "mvp-planner",
    category: "MVP & Product Planning",
    color: "#D97706",
    darkAccent: "#B45309",
    icon: "🚀",
    items: [
      {
        title: "MVP Definition",
        badge: "Minimum Viable Product",
        badgeColor: "#D97706",
        description: "Defines the smallest possible version of your product that delivers value and enables learning. Not a half-baked product — a focused solution.",
        details: [
          { label: "Core Features", value: "The 20% of features that deliver 80% of the value — must-haves for launch." },
          { label: "Nice-to-Haves", value: "Features to add post-launch — defer these to accelerate time-to-market." },
          { label: "Learning Goals", value: "What specific questions will this MVP answer? Customer willingness to pay? Usage patterns? Feature importance?" },
          { label: "Success Metrics", value: "How will you know if the MVP works? 100 signups? 10 paying customers? 50% retention?" },
          { label: "Time to Build", value: "Estimated weeks to launch — if > 12 weeks, scope is too big." },
        ],
        tips: [
          "If you're embarrassed by your first version, you launched too late — Reid Hoffman, LinkedIn founder",
          "Build for one customer segment first — don't try to please everyone",
          "Manual back-end is OK — do things that don't scale initially",
          "Launch before you feel ready — real feedback beats perfect assumptions",
        ],
        highlight: {
          label: "Concierge MVP",
          text: "Before writing code, deliver the service manually. If you're building software for restaurants, process orders by hand for one restaurant first. You'll learn more in a week than months of development.",
        },
      },
      {
        title: "Development Roadmap",
        badge: "Build Plan",
        badgeColor: "#D97706",
        description: "Timeline and milestones for taking your product from concept to launch and beyond.",
        details: [
          { label: "Phase 0: Validation", value: "Customer interviews, landing page tests, pre-sales — no code yet." },
          { label: "Phase 1: MVP Build", value: "Core features only — 4–12 weeks of development." },
          { label: "Phase 2: Alpha Launch", value: "5–10 friendly users — test functionality, gather feedback." },
          { label: "Phase 3: Beta Launch", value: "50–100 early adopters — refine based on real usage." },
          { label: "Phase 4: Public Launch", value: "Wider marketing push — start measuring CAC and conversion." },
          { label: "Phase 5: Iterate", value: "Add features based on customer demand, not roadmap assumptions." },
        ],
        tips: [
          "Don't set hard launch dates before validation — you may need to pivot",
          "Build in public — share progress on social media to build early audience",
          "Ship weekly — long gaps between releases lose momentum",
          "Celebrate milestones publicly — builds credibility and team morale",
        ],
      },
      {
        title: "Technical Requirements",
        badge: "Build vs Buy",
        badgeColor: "#D97706",
        description: "Guides technology decisions — what to build custom versus what to use off-the-shelf.",
        details: [
          { label: "Core IP", value: "Build in-house — this is your secret sauce, competitive advantage." },
          { label: "Commodity Features", value: "Use existing tools — authentication, payments, hosting, analytics." },
          { label: "No-Code Options", value: "Can you launch without developers? Bubble, Webflow, Airtable, Zapier." },
          { label: "Tech Stack", value: "Recommended technologies based on your use case and scale requirements." },
        ],
        tips: [
          "Build only what differentiates you — everything else is a tool, buy it",
          "No-code can launch in days, test ideas, then rebuild custom if needed",
          "Don't over-architect for scale you won't have for years",
          "Choose technologies with large communities — easier to hire/find help",
        ],
      },
    ],
  },
  {
    id: "financial-planning",
    category: "Startup Financials",
    color: "#7C3AED",
    darkAccent: "#6D28D9",
    icon: "📈",
    items: [
      {
        title: "Runway Calculator",
        badge: "Cash Position",
        badgeColor: "#7C3AED",
        description: "Calculates how long your startup can survive at current burn rate before needing more funding. The single most important metric for early-stage startups.",
        details: [
          { label: "Cash on Hand", value: "Current bank balance + liquid assets available for operations." },
          { label: "Monthly Burn Rate", value: "Total monthly expenses (gross burn) or net cash consumed after revenue (net burn)." },
          { label: "Runway", value: "Cash on Hand ÷ Monthly Burn Rate = Months until zero." },
          { label: "Zero Date", value: "Calendar date when cash runs out if nothing changes." },
        ],
        formula: "Runway (months) = Current Cash ÷ Monthly Burn Rate",
        scores: [
          { range: "18+ months", label: "Comfortable", color: "#059669" },
          { range: "12–18 months", label: "Healthy", color: "#16A34A" },
          { range: "6–12 months", label: "Raising Soon", color: "#CA8A04" },
          { range: "3–6 months", label: "Urgent", color: "#EA580C" },
          { range: "< 3 months", label: "Critical", color: "#DC2626" },
        ],
        tips: [
          "Fundraising takes 6–9 months — start when you have 12+ months runway",
          "Cut burn before you're forced to — waiting reduces options",
          "Runway = freedom. Longer runway = better deals, more leverage",
          "Model scenarios: what if revenue is 50% lower than planned?",
        ],
        highlight: {
          label: "The 18-Month Rule",
          text: "Always raise money when you have 18 months of runway left. At 12 months, investors sense desperation. At 6 months, you have no leverage. At 3 months, you're likely to fail.",
        },
      },
      {
        title: "3-Year Financial Projection",
        badge: "Growth Model",
        badgeColor: "#7C3AED",
        description: "Forward-looking financial model projecting revenue, expenses, and profit for your first three years — essential for planning and fundraising.",
        details: [
          { label: "Revenue Drivers", value: "What creates revenue? Customers × price × frequency. Model each stream separately." },
          { label: "Cost Structure", value: "Fixed costs (rent, salaries) + variable costs (COGS, marketing) + one-time (equipment)." },
          { label: "Headcount Plan", value: "Who you hire and when — biggest expense for most startups." },
          { label: "Growth Assumptions", value: "Customer acquisition rate, churn rate, price changes over time." },
          { label: "Monthly/Quarterly View", value: "Granular breakdown, not just annual totals — shows cash flow timing." },
        ],
        tips: [
          "Show three scenarios: Base Case, Best Case, Worst Case — investors want to see you've thought about risk",
          "Bottom-up assumptions are more credible than top-down percentages",
          "Link assumptions to real data — if you assume 5% conversion, show similar companies achieving that",
          "Update monthly as you learn — your first projection will be wrong, that's OK",
        ],
      },
      {
        title: "Funding Requirements",
        badge: "Capital Needed",
        badgeColor: "#7C3AED",
        description: "Calculates exactly how much money you need to raise, what it will be used for, and the milestones it will fund.",
        details: [
          { label: "Use of Funds", value: "Breakdown: 40% product dev, 30% marketing, 20% salaries, 10% ops — be specific." },
          { label: "Milestone Funding", value: "What will this money achieve? MVP launch? 100 customers? $10K MRR?" },
          { label: "Runway Extended", value: "How many months of operations does this funding add?" },
          { label: "Valuation Context", value: "Typical valuations for similar stage companies in your space." },
        ],
        tips: [
          "Raise enough to reach the NEXT milestone — not just survive",
          "Too little funding = constant distraction raising more",
          "Too much funding = dilution and pressure to spend inefficiently",
          "Milestones matter more than amount — \"raise $500K to reach $50K MRR\" is clear",
        ],
      },
    ],
  },
  {
    id: "investor-readiness",
    category: "Investor Readiness",
    color: "#DC2626",
    darkAccent: "#B91C1C",
    icon: "🤝",
    items: [
      {
        title: "Pitch Deck Builder",
        badge: "Fundraising Presentation",
        badgeColor: "#DC2626",
        description: "Guided builder for creating a professional investor pitch deck following the proven 10-slide structure used by successful startups.",
        details: [
          { label: "1. Problem", value: "The pain you solve — make it visceral and personal." },
          { label: "2. Solution", value: "Your product as the answer — show, don't just tell." },
          { label: "3. Market Size", value: "TAM, SAM, SOM — prove the opportunity is venture-scale." },
          { label: "4. Why Now", value: "Timing — why hasn't this been built before? Why is now the moment?" },
          { label: "5. Product", value: "Demo, screenshots, key features — make it tangible." },
          { label: "6. Traction", value: "Revenue, users, partnerships — proof that it's working." },
          { label: "7. Business Model", value: "How you make money — unit economics, pricing." },
          { label: "8. Competition", value: "Honest landscape — and your unfair advantage." },
          { label: "9. Team", value: "Why you're the ones to win — relevant experience." },
          { label: "10. Financials & Ask", value: "Projections, use of funds, amount raising." },
        ],
        tips: [
          "10–12 slides maximum — investors have short attention spans",
          "One idea per slide — don't cram multiple concepts",
          "Use images, not walls of text — a picture of your product is worth 1000 words",
          "Practice 100 times — your pitch should feel effortless",
          "Have a 1-page executive summary version for email",
        ],
        highlight: {
          label: "Story > Data",
          text: "Investors fund stories, not spreadsheets. Your deck should tell a compelling story about a massive problem, your unique insight, and why your team is destined to win. Data supports the story — it ISN'T the story.",
        },
      },
      {
        title: "Investor Target List",
        badge: "Who to Pitch",
        badgeColor: "#DC2626",
        description: "Build and manage a list of target investors — angels, VCs, and funds — with details on their focus areas, check sizes, and warm intros.",
        details: [
          { label: "Investor Name", value: "Fund or individual name" },
          { label: "Stage Focus", value: "Pre-seed, Seed, Series A — invest at your stage?" },
          { label: "Industry Focus", value: "Do they invest in your space?" },
          { label: "Check Size", value: "Typical investment amount — is it right for your raise?" },
          { label: "Portfolio", value: "Other companies they've backed — relevant to you?" },
          { label: "Warm Intro Path", value: "Who can introduce you? Mutual connections?" },
          { label: "Status", value: "Cold, Contacted, Meeting Scheduled, Term Sheet, Pass" },
        ],
        tips: [
          "Quality over quantity — 20 great fits beat 200 spray-and-pray emails",
          "Warm intros convert 5× better than cold emails",
          "Follow investors on Twitter/X — engage before pitching",
          "Research portfolio companies — mention relevant ones in your intro",
          "Move fast — if an investor is interested, respond within hours",
        ],
      },
      {
        title: "Due Diligence Room",
        badge: "Data Room",
        badgeColor: "#DC2626",
        description: "Organized repository of all documents investors will request during due diligence — have them ready before they ask.",
        details: [
          { label: "Legal", value: "Incorporation docs, cap table, IP assignments, contracts" },
          { label: "Financial", value: "Historicals, projections, tax returns, bank statements" },
          { label: "Product", value: "Roadmap, technical architecture, user data, analytics" },
          { label: "Team", value: "Resumes, employment agreements, org chart" },
          { label: "Market", value: "Competitive analysis, market research, customer interviews" },
          { label: "Marketing", value: "CAC data, channel performance, retention metrics" },
        ],
        tips: [
          "Create a secure virtual data room (Google Drive with restricted access works)",
          "Organize with clear folder structure — investors appreciate professionalism",
          "Don't wait until term sheet to prepare — have it ready from day one",
          "Update regularly — stale documents create doubt",
          "Track who accesses what — shows what investors care about",
        ],
      },
    ],
  },
  {
    id: "go-to-market",
    category: "Go-To-Market Strategy",
    color: "#0F766E",
    darkAccent: "#0D6B63",
    icon: "📣",
    items: [
      {
        title: "Launch Strategy",
        badge: "Market Entry",
        badgeColor: "#0F766E",
        description: "Defines how you will enter the market and acquire your first customers — the critical transition from building to selling.",
        details: [
          { label: "Beachhead Market", value: "The specific segment you will dominate first — narrow focus, win completely, then expand." },
          { label: "Launch Channels", value: "Primary channels for first customers: LinkedIn outreach? Content marketing? Partnerships? Ads?" },
          { label: "Launch Timeline", value: "Countdown to launch day and first 90 days post-launch activities." },
          { label: "Launch Events", value: "Product Hunt, TechCrunch, industry conferences, webinar — planned activities." },
          { label: "PR Strategy", value: "Media outreach, press release, journalist targeting for coverage." },
        ],
        tips: [
          "Do things that don't scale — hand-serve first customers to learn deeply",
          "Launch is day 1, not day 0 — real work starts after launch",
          "Focus on one channel until it works — then add more",
          "First 100 customers should be evangelists — treat them like royalty",
        ],
        highlight: {
          label: "The Beachhead Strategy",
          text: "Dominate a small, specific market completely before expanding. Instead of \"restaurant software\", target \"pizza shops in Chicago\". Win them all, learn deeply, then expand to \"Italian restaurants in Midwest\", then \"all restaurants in US\".",
        },
      },
      {
        title: "Customer Acquisition Plan",
        badge: "Growth Channels",
        badgeColor: "#0F766E",
        description: "Detailed plan for how you will acquire customers, with channel-specific strategies, budgets, and expected CAC.",
        details: [
          { label: "Channel 1: Outbound Sales", value: "Target accounts, outreach sequence, tools, team, expected conversion." },
          { label: "Channel 2: Content Marketing", value: "Blog posts, SEO, gated content, distribution plan, timeline." },
          { label: "Channel 3: Partnerships", value: "Integration partners, resellers, agencies — structure and incentives." },
          { label: "Channel 4: Paid Ads", value: "Platforms, targeting, budget, creative tests, expected CPC and conversion." },
          { label: "Channel 5: Referrals", value: "Customer referral program design, incentives, promotion plan." },
        ],
        tips: [
          "Test channels cheaply before scaling — $500 tests reveal potential",
          "Double down on what works — kill what doesn't quickly",
          "Track CAC by channel religiously — some channels will surprise you",
          "Build channel moats — proprietary advantages competitors can't copy",
        ],
      },
      {
        title: "Pricing Strategy",
        badge: "Monetization",
        badgeColor: "#0F766E",
        description: "Strategic approach to pricing — not just \"how much\", but \"how\" and \"why\" to maximize adoption and revenue.",
        details: [
          { label: "Value-Based Pricing", value: "Price based on customer value delivered, not cost-plus — captures more upside." },
          { label: "Competitive Pricing", value: "Positioning relative to competitors — premium, discount, or match?" },
          { label: "Package Structure", value: "Tiers, features in each, add-ons, annual vs monthly discounts." },
          { label: "Psychological Pricing", value: "Charm pricing ($99 vs $100), anchoring, decoy effects." },
          { label: "Price Testing", value: "Plan for testing different price points — surveys, A/B tests." },
        ],
        tips: [
          "Most startups underprice — charge more than you think is fair",
          "Raising prices is harder than starting higher",
          "Free trials convert better than freemium for B2B",
          "Annual prepaid improves cash flow dramatically",
          "Enterprise customers expect high prices — low prices signal low quality",
        ],
      },
    ],
  },
  {
    id: "startup-metrics",
    category: "Startup KPIs",
    color: "#1D4ED8",
    darkAccent: "#1E40AF",
    icon: "⚡",
    items: [
      {
        title: "North Star Metric",
        badge: "Key Success Indicator",
        badgeColor: "#1D4ED8",
        description: "The single metric that best captures the core value your product delivers to customers — the one number that predicts long-term success.",
        details: [
          { label: "Purpose", value: "Aligns entire team around one meaningful goal, prevents metric fragmentation." },
          { label: "Characteristics", value: "Leading indicator, correlates with retention, reflects customer value, actionable." },
          { label: "Examples", value: "Airbnb: Nights booked. Spotify: Time listened. Slack: Messages sent." },
        ],
        tips: [
          "Choose one metric that matters most — not 10",
          "Should measure customer success, not just company success",
          "If it goes up, business should eventually succeed",
          "Review quarterly — is it still the right metric?",
        ],
        highlight: {
          label: "Finding Your North Star",
          text: "Ask: What is the single action a customer takes that means they are getting value? For Uber, it's rides completed. For Dropbox, it's files saved. For your startup, what is it? That's your North Star.",
        },
      },
      {
        title: "Cohort Retention",
        badge: "User Behavior",
        badgeColor: "#1D4ED8",
        description: "Tracks how specific groups of customers (cohorts) behave over time — the gold standard for measuring product-market fit.",
        details: [
          { label: "Cohort Definition", value: "Users who signed up in the same week/month — grouped by acquisition date." },
          { label: "Retention Rate", value: "% of cohort still active in week 1, 2, 3, month 1, 2, 3, etc." },
          { label: "Flattening Curve", value: "When retention stabilizes (doesn't drop further), you've found retained users." },
          { label: "Comparison", value: "Compare cohorts to see if newer users retain better (product improving) or worse." },
        ],
        tips: [
          "If retention curve keeps dropping to zero, you don't have product-market fit",
          "Flat retention after initial drop = product-market fit achieved",
          "Analyze what high-retention users do differently — build features that drive that behavior",
          "Track weekly for early-stage, monthly once established",
        ],
      },
      {
        title: "Viral Coefficient",
        badge: "Growth Mechanics",
        badgeColor: "#1D4ED8",
        description: "Measures how many new users each existing user brings in — critical for products relying on word-of-mouth growth.",
        details: [
          { label: "K-factor", value: "Number of invites sent per user × conversion rate of invites." },
          { label: "K > 1", value: "Viral growth — each user brings >1 new user, exponential growth." },
          { label: "K = 1", value: "Steady state — each user replaces themselves." },
          { label: "K < 1", value: "Requires paid acquisition to grow." },
        ],
        formula: "K = (Invites Sent × Invite Conversion Rate)",
        tips: [
          "Increase invites sent — make sharing natural, easy, incentivized",
          "Improve conversion — optimize signup flow, landing pages",
          "Viral loops can be built into product design — don't bolt on after",
          "Even small improvements compound massively",
        ],
      },
    ],
  },
  {
    id: "team-building",
    category: "Team & Culture",
    color: "#9333EA",
    darkAccent: "#7E22CE",
    icon: "👥",
    items: [
      {
        title: "Founding Team",
        badge: "Core Members",
        badgeColor: "#9333EA",
        description: "Defines roles, responsibilities, and equity structure for the founding team — getting this right prevents 90% of startup failures.",
        details: [
          { label: "Role Definition", value: "Clear responsibilities for each founder — CEO, CTO, etc. Avoid overlap." },
          { label: "Equity Split", value: "Founder equity distribution — fair, with vesting schedules to protect against departure." },
          { label: "Vesting Schedule", value: "Standard: 4-year vesting with 1-year cliff — earn equity over time." },
          { label: "Founder Agreements", value: "IP assignment, roles, decision-making, dispute resolution in writing." },
        ],
        tips: [
          "Equal equity only if equal contribution and risk — otherwise differentiate",
          "Vesting protects everyone — agree before you need it",
          "Put everything in writing — even with best friends",
          "Founder conflict is #1 startup killer — address early",
        ],
        highlight: {
          label: "Co-Founder Chemistry",
          text: "Choose co-founders based on complementary skills, shared values, and conflict resolution style — not friendship. You'll spend more time with them than your family. Test working together on a small project before committing.",
        },
      },
      {
        title: "Hiring Plan",
        badge: "Team Growth",
        badgeColor: "#9333EA",
        description: "Strategic plan for building your team — who to hire, when, and how to attract top talent.",
        details: [
          { label: "Role Priority", value: "Critical hires first — revenue-generating roles > support roles." },
          { label: "Hiring Timeline", value: "When each role will be added, tied to funding milestones." },
          { label: "Recruitment Channels", value: "Where to find candidates — networks, job boards, recruiters, communities." },
          { label: "Compensation Strategy", value: "Salary, equity, benefits mix — competitive for your stage." },
          { label: "Culture Definition", value: "Values, operating principles, work style — attract aligned people." },
        ],
        tips: [
          "Hire slow, fire fast — one bad hire damages culture",
          "First 10 employees set culture — choose carefully",
          "Look for adaptability — startup needs change weekly",
          "Equity matters more than salary for early employees",
        ],
      },
      {
        title: "Advisory Board",
        badge: "Strategic Guidance",
        badgeColor: "#9333EA",
        description: "Build and manage relationships with advisors — experienced operators who provide guidance, connections, and credibility.",
        details: [
          { label: "Advisor Roles", value: "Industry expertise, fundraising help, technical guidance, customer introductions." },
          { label: "Advisor Equity", value: "Standard: 0.5–2% equity vested over 2 years for meaningful advisors." },
          { label: "Meeting Cadence", value: "Monthly or quarterly structured calls — make it easy for them to help." },
          { label: "Advisor Agreement", value: "Formal terms — expectations, equity, duration, termination." },
        ],
        tips: [
          "Seek advisors who complement your team's weaknesses",
          "Famous names less valuable than deeply engaged operators",
          "Make it easy to help — specific asks, prepared materials",
          "Update regularly — don't disappear until you need something",
        ],
      },
    ],
  },
  {
    id: "risk-management",
    category: "Startup Risks",
    color: "#B45309",
    darkAccent: "#92400E",
    icon: "🛡️",
    items: [
      {
        title: "Risk Register",
        badge: "Threat Assessment",
        badgeColor: "#B45309",
        description: "Systematic identification and tracking of risks that could derail your startup — with mitigation plans for each.",
        details: [
          { label: "Market Risk", value: "Will customers buy? Risk of no demand — mitigated by pre-sales, validation." },
          { label: "Product Risk", value: "Can we build it? Technical challenges — mitigated by prototyping, expert review." },
          { label: "Team Risk", value: "Founder conflict, key person departure — mitigated by agreements, vesting." },
          { label: "Financial Risk", value: "Running out of money — mitigated by conservative planning, early fundraising." },
          { label: "Competitive Risk", value: "Larger entrants, copycats — mitigated by speed, IP, defensible moats." },
          { label: "Regulatory Risk", value: "Legal/compliance issues — mitigated by expert advice early." },
        ],
        scores: [
          { range: "High", label: "Immediate attention needed", color: "#DC2626" },
          { range: "Medium", label: "Monitor and plan", color: "#CA8A04" },
          { range: "Low", label: "Acceptable risk", color: "#059669" },
        ],
        tips: [
          "Review risks monthly — they change as startup evolves",
          "Don't ignore high risks hoping they disappear — they don't",
          "Mitigation doesn't mean eliminate — means reduce probability or impact",
          "Share risks with board/advisors — they've seen them before",
        ],
      },
      {
        title: "Legal & Compliance",
        badge: "Foundation",
        badgeColor: "#B45309",
        description: "Essential legal structure and compliance requirements for your startup — get right early to avoid painful fixes later.",
        details: [
          { label: "Entity Formation", value: "C-Corp (for VC funding) or LLC (for bootstrapping) — structure matters." },
          { label: "IP Assignment", value: "All founders assign IP to company — no personal ownership." },
          { label: "Founder Agreements", value: "Roles, equity, vesting, decision-making in writing." },
          { label: "Terms of Service / Privacy Policy", value: "Customer-facing legal documents — industry standard." },
          { label: "Regulatory Licenses", value: "Industry-specific requirements — fintech, health, etc." },
        ],
        tips: [
          "Spend money on good legal early — fixing mistakes costs 10× more",
          "Don't incorporate until necessary — but don't wait too long",
          "Keep cap table clean from day one — messy caps scare investors",
          "IP must be owned by company — investors check this",
        ],
      },
    ],
  },
];

// ── Sidebar Nav Link ──────────────────────────────────────────────
function NavItem({ section, activeId, onClick }) {
  const isActive = activeId === section.id;
  return (
    <button
      onClick={() => onClick(section.id)}
      className="w-full text-left px-4 py-2 flex items-center gap-3 rounded-lg transition-all duration-150 group"
      style={{
        background: isActive ? `${section.color}18` : "transparent",
        borderLeft: isActive ? `2px solid ${section.color}` : "2px solid transparent",
      }}
    >
      <span className="text-base leading-none">{section.icon}</span>
      <span
        className="text-sm font-medium truncate"
        style={{ color: isActive ? section.color : "#9ca3af" }}
      >
        {section.category}
      </span>
    </button>
  );
}

// ── Item Card ─────────────────────────────────────────────────────
function ItemCard({ item, accentColor }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300"
      style={{ borderColor: open ? `${accentColor}40` : "#1f2937", background: "#111827" }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full text-left p-6 flex items-start justify-between gap-4 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-white font-semibold text-lg leading-tight">{item.title}</h3>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
              style={{ background: `${accentColor}20`, color: accentColor }}
            >
              {item.badge}
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
        </div>
        <div
          className="mt-1 shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ background: open ? `${accentColor}25` : "#1f2937" }}
        >
          <svg
            className="transition-transform duration-200"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            width="14" height="14" viewBox="0 0 14 14" fill="none"
          >
            <path d="M2 5l5 5 5-5" stroke={open ? accentColor : "#6b7280"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="px-6 pb-6 space-y-6 border-t" style={{ borderColor: "#1f2937" }}>
          {/* Details */}
          {item.details && item.details.length > 0 && (
            <div className="mt-5 space-y-3">
              {item.details.map((d, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: accentColor }}
                  />
                  <div>
                    <span className="text-white text-sm font-medium">{d.label}</span>
                    <span className="text-gray-400 text-sm"> — {d.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formula */}
          {item.formula && (
            <div
              className="rounded-xl px-4 py-3 font-mono text-sm"
              style={{ background: `${accentColor}12`, color: accentColor, border: `1px solid ${accentColor}25` }}
            >
              {item.formula}
            </div>
          )}

          {/* Score Ranges */}
          {item.scores && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">Score Reference</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {item.scores.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg px-3 py-2"
                    style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: s.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold" style={{ color: s.color }}>{s.range}</div>
                      <div className="text-xs text-gray-500 truncate">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlight */}
          {item.highlight && (
            <div
              className="rounded-xl p-4"
              style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}30` }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: accentColor }}
              >
                ✦ {item.highlight.label}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{item.highlight.text}</p>
            </div>
          )}

          {/* Tips */}
          {item.tips && item.tips.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">Pro Tips</p>
              <div className="space-y-2">
                {item.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-xs mt-0.5 shrink-0" style={{ color: accentColor }}>→</span>
                    <p className="text-gray-400 text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────
function Section({ section }) {
  return (
    <section id={section.id} className="mb-16 scroll-mt-8">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: `${section.color}20` }}
        >
          {section.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{section.category}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{section.items.length} topics</p>
        </div>
        <div
          className="ml-auto h-px flex-1 hidden sm:block"
          style={{ background: `linear-gradient(to right, ${section.color}40, transparent)` }}
        />
      </div>

      <div className="space-y-3">
        {section.items.map((item, i) => (
          <ItemCard key={i} item={item} accentColor={section.color} />
        ))}
      </div>
    </section>
  );
}

// ── Main App ──────────────────────────────────────────────────────
export default function NewDoc() {
  const [activeId, setActiveId] = useState(startupSections[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const contentRef = useRef(null);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      setSidebarOpen(false);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    startupSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const filtered = search.trim()
    ? startupSections
        .map((s) => ({
          ...s,
          items: s.items.filter(
            (item) =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              item.description.toLowerCase().includes(search.toLowerCase()) ||
              item.badge.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((s) => s.items.length > 0)
    : startupSections;

  const totalTopics = startupSections.reduce((a, s) => a + s.items.length, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside
        className="fixed top-0 left-0 h-screen w-72 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0"
        style={{
          background: "#0c0c0f",
          borderRight: "1px solid #1f2937",
          transform: sidebarOpen ? "translateX(0)" : undefined,
        }}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-5" style={{ borderBottom: "1px solid #1f2937" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
            >
              S
            </div>
            <div>
              <div className="text-white font-bold text-base tracking-tight">Startup OS</div>
              <div className="text-gray-600 text-xs font-mono mt-0.5">v1.0 documentation</div>
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <div>
              <div className="text-white font-bold text-xl">{startupSections.length}</div>
              <div className="text-gray-600 text-xs">Modules</div>
            </div>
            <div className="w-px bg-gray-800" />
            <div>
              <div className="text-white font-bold text-xl">{totalTopics}</div>
              <div className="text-gray-600 text-xs">Topics</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {startupSections.map((section) => (
            <NavItem
              key={section.id}
              section={section}
              activeId={activeId}
              onClick={scrollTo}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 text-xs text-gray-700 font-mono" style={{ borderTop: "1px solid #1f2937" }}>
          startup-os / docs
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main ── */}
      <main className="flex-1 lg:ml-72 min-w-0" ref={contentRef}>
        {/* Top bar */}
        <div
          className="sticky top-0 z-20 px-6 sm:px-10 py-4 flex items-center gap-4"
          style={{ background: "#09090dcc", backdropFilter: "blur(12px)", borderBottom: "1px solid #1f2937" }}
        >
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M6.5 1a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM0 6.5a6.5 6.5 0 1111.473 4.255l3.386 3.386-.707.707-3.386-3.386A6.5 6.5 0 010 6.5z" fill="currentColor" fillRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-gray-300 placeholder-gray-600 outline-none transition"
              style={{ background: "#1a1a24", border: "1px solid #2a2a38" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
              >×</button>
            )}
          </div>

          {/* Section pill */}
          {!search && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span className="text-gray-700">/</span>
              <span style={{ color: startupSections.find(s => s.id === activeId)?.color || "#9ca3af" }}>
                {startupSections.find(s => s.id === activeId)?.category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 sm:px-10 pt-10 pb-24 max-w-4xl">
          {/* Hero */}
          {!search && (
            <div className="mb-14">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-600 font-mono uppercase tracking-widest">Documentation</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
                Startup OS
                <span
                  className="block text-2xl sm:text-3xl font-normal mt-1"
                  style={{
                    background: "linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  The Complete Founder Playbook
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                Everything you need to validate, build, fund, and grow a startup — structured across{" "}
                <span className="text-white font-medium">{startupSections.length} core modules</span> and{" "}
                <span className="text-white font-medium">{totalTopics} actionable topics</span>.
              </p>

              {/* Module pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                {startupSections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition hover:opacity-80"
                    style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30` }}
                  >
                    <span>{s.icon}</span>
                    {s.category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search results notice */}
          {search && (
            <div className="mb-8">
              <p className="text-gray-400 text-sm">
                {filtered.reduce((a, s) => a + s.items.length, 0)} results for{" "}
                <span className="text-white font-medium">"{search}"</span>
              </p>
            </div>
          )}

          {/* Sections */}
          {filtered.map((section) => (
            <Section key={section.id} section={section} />
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-600">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg font-medium text-gray-500">No results found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
