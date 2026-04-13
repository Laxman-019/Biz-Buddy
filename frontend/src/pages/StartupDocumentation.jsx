import React, { useState } from 'react'

const startupSections = [
  {
    id: "idea-validation",
    category: "Idea Validation Engine",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    icon: "fa-lightbulb",
    items: [
      {
        title: "Idea Scorecard",
        badge: "Validation Score",
        badgeColor: "#8B5CF6",
        description: "AI-powered evaluation of your business concept across 8 critical dimensions. Provides a comprehensive viability score with actionable feedback on weak spots.",
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
        ],
        highlight: {
          label: "The Mom Test",
          text: "Your idea score is based on data, not opinions. Avoid asking friends/family if they \"like\" your idea — they will lie to be nice. Validate through real customer behaviour and market signals.",
          color: "#F5F3FF",
          border: "#8B5CF6",
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
        ],
        tips: [
          "If customers aren't already paying for some solution, getting them to pay you will be extremely hard",
          "Workarounds (spreadsheets, manual processes) are actually GOOD — they prove the problem exists",
          "Interview 20–30 potential customers before writing any code",
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
          { label: "Purchase Triggers", value: "What specific event makes someone decide to buy?" },
        ],
        tips: [
          "Create a landing page describing your solution with a \"Buy Now\" or \"Join Waitlist\" button before building",
          "Run smoke tests — can you get people to pay before you build?",
        ],
      },
    ],
  },
  {
    id: "market-research",
    category: "Market Intelligence",
    color: "#0891B2",
    bg: "#ECFEFF",
    icon: "fa-chart-line",
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
          "Use bottom-up (customer count × price) not just top-down (percentage of giant market)",
        ],
        highlight: {
          label: "Bottom-Up Calculation",
          text: "Instead of saying \"we'll capture 1% of a $50B market\", calculate: \"There are 10,000 coffee shops in our city. We can reach 2,000 in year one. At $500/year, our SOM is $1M.\" This is far more credible.",
          color: "#ECFEFF",
          border: "#0891B2",
        },
      },
      {
        title: "Trend Analysis",
        badge: "Market Direction",
        badgeColor: "#0891B2",
        description: "Identifies macro trends affecting your market — tailwinds you can ride and headwinds you must navigate.",
        details: [
          { label: "Growth Rate", value: "Is the market expanding, stable, or shrinking? CAGR over 3–5 years." },
          { label: "Technology Shifts", value: "New technologies that enable solutions previously impossible or too expensive." },
          { label: "Regulatory Changes", value: "Upcoming laws or policies that could help or hurt your business." },
          { label: "Consumer Behavior", value: "Shifts in how people buy — e.g., remote work, sustainability focus." },
        ],
        tips: ["Ride tailwinds — don't fight them.", "Google Trends shows you what people search for over time."],
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
          { label: "Channels", value: "Where they get information — LinkedIn? TikTok? Industry publications?" },
        ],
        tips: [
          "Create 1–3 primary personas — more than that and you lose focus",
          "Interview real people in your target audience to validate personas",
        ],
      },
    ],
  },
  {
    id: "business-model",
    category: "Business Model Builder",
    color: "#059669",
    bg: "#ECFDF5",
    icon: "fa-cubes",
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
          "Update the canvas monthly as you learn from customers",
        ],
        highlight: {
          label: "Canvas vs. Business Plan",
          text: "Traditional business plans take months and become obsolete in weeks. The Lean Canvas takes 20 minutes and evolves with your learning.",
          color: "#ECFDF5",
          border: "#059669",
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
        ],
        tips: [
          "Match revenue model to customer preference — B2B prefers predictable subscriptions",
          "Calculate LTV (Lifetime Value) early — how much a customer pays over their entire relationship",
        ],
      },
      {
        title: "Unit Economics",
        badge: "Per-Customer Math",
        badgeColor: "#059669",
        description: "Breaks down the financials of serving a single customer — the atomic unit of your business model. If unit economics don't work, scale amplifies losses.",
        details: [
          { label: "CAC (Customer Acquisition Cost)", value: "Total sales & marketing spend ÷ number of new customers." },
          { label: "LTV (Lifetime Value)", value: "Average revenue per customer × average customer lifespan." },
          { label: "Contribution Margin", value: "Revenue from customer minus variable costs to serve them." },
          { label: "Payback Period", value: "CAC ÷ monthly contribution margin. Months to recover acquisition cost." },
        ],
        formula: "Healthy SaaS: LTV ≥ 3× CAC, Payback Period ≤ 12 months",
        tips: [
          "If CAC > LTV, you lose money on every customer — business model fails",
          "Track unit economics from day one — don't wait until you have 'enough data'",
        ],
      },
    ],
  },
  {
    id: "mvp-planner",
    category: "MVP & Product Planning",
    color: "#D97706",
    bg: "#FFFBEB",
    icon: "fa-rocket",
    items: [
      {
        title: "MVP Definition",
        badge: "Minimum Viable Product",
        badgeColor: "#D97706",
        description: "Defines the smallest possible version of your product that delivers value and enables learning. Not a half-baked product — a focused solution.",
        details: [
          { label: "Core Features", value: "The 20% of features that deliver 80% of the value — must-haves for launch." },
          { label: "Nice-to-Haves", value: "Features to add post-launch — defer these to accelerate time-to-market." },
          { label: "Learning Goals", value: "What specific questions will this MVP answer?" },
          { label: "Success Metrics", value: "How will you know if the MVP works? 100 signups? 10 paying customers?" },
          { label: "Time to Build", value: "Estimated weeks to launch — if > 12 weeks, scope is too big." },
        ],
        tips: [
          "If you're embarrassed by your first version, you launched too late — Reid Hoffman",
          "Launch before you feel ready — real feedback beats perfect assumptions",
        ],
        highlight: {
          label: "Concierge MVP",
          text: "Before writing code, deliver the service manually. If you're building software for restaurants, process orders by hand for one restaurant first. You'll learn more in a week than months of development.",
          color: "#FFFBEB",
          border: "#D97706",
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
        ],
        tips: ["Ship weekly — long gaps between releases lose momentum", "Build in public — share progress on social media"],
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
        ],
        tips: [
          "Build only what differentiates you — everything else is a tool, buy it",
          "Don't over-architect for scale you won't have for years",
        ],
      },
    ],
  },
  {
    id: "financial-planning",
    category: "Startup Financials",
    color: "#7C3AED",
    bg: "#F5F3FF",
    icon: "fa-chart-pie",
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
          "Runway = freedom. Longer runway = better deals, more leverage",
        ],
        highlight: {
          label: "The 18-Month Rule",
          text: "Always raise money when you have 18 months of runway left. At 12 months, investors sense desperation. At 6 months, you have no leverage.",
          color: "#F5F3FF",
          border: "#7C3AED",
        },
      },
      {
        title: "3-Year Financial Projection",
        badge: "Growth Model",
        badgeColor: "#7C3AED",
        description: "Forward-looking financial model projecting revenue, expenses, and profit for your first three years — essential for planning and fundraising.",
        details: [
          { label: "Revenue Drivers", value: "What creates revenue? Customers × price × frequency." },
          { label: "Cost Structure", value: "Fixed costs + variable costs + one-time expenses." },
          { label: "Headcount Plan", value: "Who you hire and when — biggest expense for most startups." },
          { label: "Growth Assumptions", value: "Customer acquisition rate, churn rate, price changes over time." },
        ],
        tips: [
          "Show three scenarios: Base Case, Best Case, Worst Case",
          "Update monthly as you learn — your first projection will be wrong, that's OK",
        ],
      },
      {
        title: "Funding Requirements",
        badge: "Capital Needed",
        badgeColor: "#7C3AED",
        description: "Calculates exactly how much money you need to raise, what it will be used for, and the milestones it will fund.",
        details: [
          { label: "Use of Funds", value: "Breakdown: 40% product dev, 30% marketing, 20% salaries, 10% ops." },
          { label: "Milestone Funding", value: "What will this money achieve? MVP launch? 100 customers? $10K MRR?" },
          { label: "Valuation Context", value: "Typical valuations for similar stage companies in your space." },
        ],
        tips: [
          "Raise enough to reach the NEXT milestone — not just survive",
          "Too little funding = constant distraction raising more",
        ],
      },
    ],
  },
  {
    id: "investor-readiness",
    category: "Investor Readiness",
    color: "#DC2626",
    bg: "#FEF2F2",
    icon: "fa-handshake",
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
          { label: "4. Why Now", value: "Timing — why hasn't this been built before?" },
          { label: "5. Product", value: "Demo, screenshots, key features — make it tangible." },
          { label: "6. Traction", value: "Revenue, users, partnerships — proof that it's working." },
          { label: "7. Business Model", value: "How you make money — unit economics, pricing." },
          { label: "8. Competition", value: "Honest landscape — and your unfair advantage." },
          { label: "9. Team", value: "Why you're the ones to win — relevant experience." },
          { label: "10. Financials & Ask", value: "Projections, use of funds, amount raising." },
        ],
        tips: [
          "10–12 slides maximum — investors have short attention spans",
          "Practice 100 times — your pitch should feel effortless",
        ],
        highlight: {
          label: "Story > Data",
          text: "Investors fund stories, not spreadsheets. Your deck should tell a compelling story about a massive problem, your unique insight, and why your team is destined to win.",
          color: "#FEF2F2",
          border: "#DC2626",
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
          { label: "Warm Intro Path", value: "Who can introduce you? Mutual connections?" },
        ],
        tips: [
          "Quality over quantity — 20 great fits beat 200 spray-and-pray emails",
          "Warm intros convert 5× better than cold emails",
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
        ],
        tips: [
          "Create a secure virtual data room (Google Drive with restricted access works)",
          "Don't wait until term sheet to prepare — have it ready from day one",
        ],
      },
    ],
  },
  {
    id: "go-to-market",
    category: "Go-To-Market Strategy",
    color: "#0F766E",
    bg: "#F0FDFA",
    icon: "fa-bullhorn",
    items: [
      {
        title: "Launch Strategy",
        badge: "Market Entry",
        badgeColor: "#0F766E",
        description: "Defines how you will enter the market and acquire your first customers — the critical transition from building to selling.",
        details: [
          { label: "Beachhead Market", value: "The specific segment you will dominate first — narrow focus, win completely, then expand." },
          { label: "Launch Channels", value: "Primary channels for first customers: LinkedIn outreach? Content marketing? Partnerships?" },
          { label: "Launch Timeline", value: "Countdown to launch day and first 90 days post-launch activities." },
          { label: "PR Strategy", value: "Media outreach, press release, journalist targeting for coverage." },
        ],
        tips: [
          "Do things that don't scale — hand-serve first customers to learn deeply",
          "First 100 customers should be evangelists — treat them like royalty",
        ],
        highlight: {
          label: "The Beachhead Strategy",
          text: "Dominate a small, specific market completely before expanding. Instead of 'restaurant software', target 'pizza shops in Chicago'. Win them all, then expand.",
          color: "#F0FDFA",
          border: "#0F766E",
        },
      },
      {
        title: "Customer Acquisition Plan",
        badge: "Growth Channels",
        badgeColor: "#0F766E",
        description: "Detailed plan for how you will acquire customers, with channel-specific strategies, budgets, and expected CAC.",
        details: [
          { label: "Outbound Sales", value: "Target accounts, outreach sequence, tools, team, expected conversion." },
          { label: "Content Marketing", value: "Blog posts, SEO, gated content, distribution plan, timeline." },
          { label: "Partnerships", value: "Integration partners, resellers, agencies — structure and incentives." },
          { label: "Paid Ads", value: "Platforms, targeting, budget, creative tests, expected CPC and conversion." },
          { label: "Referrals", value: "Customer referral program design, incentives, promotion plan." },
        ],
        tips: [
          "Test channels cheaply before scaling — $500 tests reveal potential",
          "Double down on what works — kill what doesn't quickly",
        ],
      },
      {
        title: "Pricing Strategy",
        badge: "Monetization",
        badgeColor: "#0F766E",
        description: "Strategic approach to pricing — not just 'how much', but 'how' and 'why' to maximize adoption and revenue.",
        details: [
          { label: "Value-Based Pricing", value: "Price based on customer value delivered, not cost-plus." },
          { label: "Competitive Pricing", value: "Positioning relative to competitors — premium, discount, or match?" },
          { label: "Package Structure", value: "Tiers, features in each, add-ons, annual vs monthly discounts." },
          { label: "Price Testing", value: "Plan for testing different price points — surveys, A/B tests." },
        ],
        tips: [
          "Most startups underprice — charge more than you think is fair",
          "Free trials convert better than freemium for B2B",
        ],
      },
    ],
  },
  {
    id: "startup-metrics",
    category: "Startup KPIs",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    icon: "fa-gauge-high",
    items: [
      {
        title: "North Star Metric",
        badge: "Key Success Indicator",
        badgeColor: "#1D4ED8",
        description: "The single metric that best captures the core value your product delivers to customers — the one number that predicts long-term success.",
        details: [
          { label: "Purpose", value: "Aligns entire team around one meaningful goal, prevents metric fragmentation." },
          { label: "Characteristics", value: "Leading indicator, correlates with retention, reflects customer value." },
          { label: "Examples", value: "Airbnb: Nights booked. Spotify: Time listened. Slack: Messages sent." },
        ],
        tips: [
          "Choose one metric that matters most — not 10",
          "Should measure customer success, not just company success",
        ],
        highlight: {
          label: "Finding Your North Star",
          text: "Ask: What is the single action a customer takes that means they are getting value? For Uber, it's rides completed. For Dropbox, it's files saved. That's your North Star.",
          color: "#EFF6FF",
          border: "#1D4ED8",
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
          { label: "Flattening Curve", value: "When retention stabilizes, you've found product-market fit." },
        ],
        tips: [
          "If retention curve keeps dropping to zero, you don't have product-market fit",
          "Flat retention after initial drop = product-market fit achieved",
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
        ],
      },
    ],
  },
  {
    id: "team-building",
    category: "Team & Culture",
    color: "#9333EA",
    bg: "#FAF5FF",
    icon: "fa-users",
    items: [
      {
        title: "Founding Team",
        badge: "Core Members",
        badgeColor: "#9333EA",
        description: "Defines roles, responsibilities, and equity structure for the founding team — getting this right prevents 90% of startup failures.",
        details: [
          { label: "Role Definition", value: "Clear responsibilities for each founder — CEO, CTO, etc. Avoid overlap." },
          { label: "Equity Split", value: "Founder equity distribution — fair, with vesting schedules." },
          { label: "Vesting Schedule", value: "Standard: 4-year vesting with 1-year cliff — earn equity over time." },
          { label: "Founder Agreements", value: "IP assignment, roles, decision-making, dispute resolution in writing." },
        ],
        tips: [
          "Equal equity only if equal contribution and risk — otherwise differentiate",
          "Founder conflict is #1 startup killer — address early",
        ],
        highlight: {
          label: "Co-Founder Chemistry",
          text: "Choose co-founders based on complementary skills, shared values, and conflict resolution style — not friendship. Test working together on a small project before committing.",
          color: "#FAF5FF",
          border: "#9333EA",
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
          { label: "Recruitment Channels", value: "Where to find candidates — networks, job boards, communities." },
          { label: "Culture Definition", value: "Values, operating principles, work style — attract aligned people." },
        ],
        tips: [
          "Hire slow, fire fast — one bad hire damages culture",
          "First 10 employees set culture — choose carefully",
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
        ],
        tips: [
          "Seek advisors who complement your team's weaknesses",
          "Make it easy to help — specific asks, prepared materials",
        ],
      },
    ],
  },
  {
    id: "risk-management",
    category: "Risk Management",
    color: "#B45309",
    bg: "#FFFBEB",
    icon: "fa-shield-haltered",
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
        ],
        scores: [
          { range: "High", label: "Immediate attention needed", color: "#DC2626" },
          { range: "Medium", label: "Monitor and plan", color: "#CA8A04" },
          { range: "Low", label: "Acceptable risk", color: "#059669" },
        ],
        tips: [
          "Review risks monthly — they change as startup evolves",
          "Don't ignore high risks hoping they disappear — they don't",
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
        ],
        tips: [
          "Spend money on good legal early — fixing mistakes costs 10× more",
          "IP must be owned by company — investors check this",
        ],
      },
      {
        title: "Contingency Planning",
        badge: "Backup Plans",
        badgeColor: "#B45309",
        description: "Prepares for worst-case scenarios — what happens if key assumptions fail?",
        details: [
          { label: "Plan A", value: "Your primary strategy — what you believe will work." },
          { label: "Plan B", value: "What you pivot to if Plan A fails to gain traction." },
          { label: "Plan C", value: "Wind-down scenario — how to preserve value if all else fails." },
          { label: "Key Person Risk", value: "What happens if a critical founder or employee leaves?" },
        ],
        tips: [
          "Hope is not a strategy — have written contingency plans",
          "Run 'pre-mortems' — assume your startup failed, then work backwards to find why",
        ],
      },
    ],
  },
]

const Badge = ({ label, color }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.3,
      background: color + '18',
      color: color,
      border: `1px solid ${color}33`,
    }}
  >
    {label}
  </span>
)

const ScoreRow = ({ range, label, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
    <span style={{
      minWidth: 72, fontWeight: 700, fontSize: 12,
      color, fontFamily: 'monospace',
      background: color + '15', borderRadius: 4,
      padding: '2px 8px', textAlign: 'center'
    }}>{range}</span>
    <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
  </div>
)

const Highlight = ({ item }) =>
  item.highlight ? (
    <div style={{
      marginTop: 16,
      padding: '12px 16px',
      borderRadius: 8,
      background: item.highlight.color,
      borderLeft: `4px solid ${item.highlight.border}`,
    }}>
      <div style={{ fontWeight: 700, fontSize: 12, color: item.highlight.border, marginBottom: 4 }}>
        {item.highlight.label}
      </div>
      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{item.highlight.text}</div>
    </div>
  ) : null

const ItemCard = ({ item, accent }) => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      borderRadius: 12,
      border: `1px solid ${accent}22`,
      overflow: 'hidden',
      marginBottom: 10,
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none',
          border: 'none', cursor: 'pointer',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{item.title}</span>
          <Badge label={item.badge} color={item.badgeColor} />
        </div>
        <i
          className={`fa-solid fa-chevron-down`}
          style={{
            fontSize: 13,
            color: accent,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform .2s',
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${accent}18` }}>
          <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginTop: 12, marginBottom: 12 }}>
            {item.description}
          </p>

          {item.formula && (
            <div style={{
              fontFamily: 'monospace', fontSize: 13, fontWeight: 700,
              background: '#F3F4F6', borderRadius: 6, padding: '8px 14px',
              color: accent, marginBottom: 12,
              border: `1px solid ${accent}30`,
            }}>
              {item.formula}
            </div>
          )}

          {item.details && item.details.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
                <i className="fa-solid fa-list-ul" style={{ marginRight: 6, fontSize: 10 }} />
                Details
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {item.details.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: accent, minWidth: 130, flexShrink: 0 }}>{d.label}:</span>
                    <span style={{ color: '#374151', flex: 1, minWidth: 0 }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.scores && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
                <i className="fa-solid fa-chart-simple" style={{ marginRight: 6, fontSize: 10 }} />
                Score Guide
              </div>
              {item.scores.map((s, i) => <ScoreRow key={i} {...s} />)}
            </div>
          )}

          {item.tips && item.tips.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
                <i className="fa-solid fa-lightbulb" style={{ marginRight: 6, fontSize: 10 }} />
                Pro Tips
              </div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {item.tips.map((t, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, marginBottom: 5 }}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          <Highlight item={item} />
        </div>
      )}
    </div>
  )
}

const StartupDocumentation = () => {
  const [activeSection, setActiveSection] = useState(null)

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
        * { box-sizing: border-box; }
        .doc-wrapper {
          width: 100%;
          padding: 24px 16px 60px;
        }
        @media (min-width: 640px) {
          .doc-wrapper { padding: 32px 24px 60px; }
        }
        @media (min-width: 1024px) {
          .doc-wrapper { max-width: 900px; margin: 0 auto; padding: 32px 0 60px; }
        }
        .nav-scroll {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 14px 14px;
          border-radius: 12px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          margin-bottom: 32px;
        }
        .nav-btn {
          padding: 5px 12px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all .15s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          margin-bottom: 14px;
        }
        .section-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>

      <div className="doc-wrapper">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <i className="fa-solid fa-rocket" style={{ fontSize: 12, color: '#6B7280' }} />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', color: '#6B7280' }}>
              Founder Playbook
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>
            Startup OS Documentation
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 8, lineHeight: 1.6, maxWidth: 560 }}>
            Complete reference for every module, metric, and AI-powered insight in your Startup Operating System.
          </p>
        </div>

        {/* Quick Nav */}
        <div className="nav-scroll">
          <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', alignSelf: 'center', marginRight: 2 }}>Jump to:</span>
          {startupSections.map(s => (
            <button
              key={s.id}
              className="nav-btn"
              onClick={() => {
                setActiveSection(activeSection === s.id ? null : s.id)
                document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              style={{
                border: `1px solid ${s.color}44`,
                background: activeSection === s.id ? s.color : s.bg,
                color: activeSection === s.id ? '#fff' : s.color,
              }}
            >
              <i className={`fa-solid ${s.icon}`} style={{ fontSize: 11 }} />
              {s.category}
            </button>
          ))}
        </div>

        {/* Sections */}
        {startupSections.map(section => (
          <div key={section.id} id={`section-${section.id}`} style={{ marginBottom: 36 }}>
            <div
              className="section-header"
              style={{
                background: section.bg,
                border: `1px solid ${section.color}30`,
              }}
            >
              <div
                className="section-icon"
                style={{ background: section.color + '18' }}
              >
                <i className={`fa-solid ${section.icon}`} style={{ fontSize: 16, color: section.color }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: section.color }}>{section.category}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>
                  {section.items.length} topic{section.items.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {section.items.map((item, i) => (
              <ItemCard key={i} item={item} accent={section.color} />
            ))}
          </div>
        ))}

        {/* Footer */}
        <div style={{
          textAlign: 'center', padding: '20px',
          borderTop: '1px solid #E5E7EB',
          fontSize: 13, color: '#9CA3AF',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <i className="fa-solid fa-sync-alt" style={{ fontSize: 12 }} />
          All sections update as you refine your business model and add real customer data.
        </div>
      </div>
    </div>
  )
}

export default StartupDocumentation