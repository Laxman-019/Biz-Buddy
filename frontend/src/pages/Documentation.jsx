import React, { useState } from 'react'
import Layout from '../components/Layout'


const sections = [
  {
    id: 'kpi',
    category: 'KPI Cards',
    color: '#2563EB',
    bg: '#EFF6FF',
    icon: 'fa-chart-bar',
    items: [
      {
        title: 'Total Sales',
        badge: 'Revenue Metric',
        badgeColor: '#2563EB',
        description:
          'Displays the cumulative revenue generated across all your registered businesses within the selected analysis period — the single most important top-line indicator of commercial performance.',
        details: [
          { label: 'What it measures', value: 'Sum of all income/revenue entries before any expenses or deductions.' },
          { label: 'Unit', value: 'Local currency (e.g. ₹, $). Large values auto-format (e.g. 1.2M).' },
          { label: 'Updates', value: 'Recalculates automatically whenever a record is added, edited, or deleted.' },
        ],
        tips: [
          'A rising Total Sales figure indicates business growth and demand expansion.',
          'A flat or declining figure signals issues with customer acquisition, pricing, or market conditions.',
          'Always read alongside Total Expenses — high sales with low profit indicates a cost or pricing problem.',
        ],
        highlight: {
          label: 'Pro Tip',
          text: 'Revenue is only meaningful when compared against what it cost to generate it. Never read Total Sales in isolation.',
          color: '#DBEAFE',
          border: '#2563EB',
        },
      },
      {
        title: 'Total Expenses',
        badge: 'Cost Metric',
        badgeColor: '#7C3AED',
        description:
          'Shows the total cost burden across all your businesses — including operational costs, overhead, payroll, raw materials, marketing spend, and all other outgoings recorded in the period.',
        details: [
          { label: 'What it measures', value: 'Aggregate of all expense entries across every business in the analysis period.' },
          { label: 'Purpose', value: 'Critical for cost control and margin management.' },
        ],
        tips: [
          'Expenses should always be tracked against the revenue they generate.',
          'A low expense ratio relative to Sales indicates operational efficiency.',
          'Sudden spikes require drill-down into individual business records.',
          'Fixed vs. variable composition affects how the business behaves during revenue fluctuations.',
        ],
      },
      {
        title: 'Total Profit',
        badge: 'Profitability Metric',
        badgeColor: '#059669',
        description:
          'The net result after subtracting Total Expenses from Total Sales. The most direct measure of financial health and business viability — the actual wealth created during the period.',
        formula: 'Total Profit = Total Sales − Total Expenses',
        details: [
          { label: 'Positive value', value: 'Business is profitable — revenues exceed costs.' },
          { label: 'Negative value', value: 'Expenses exceed revenues. Immediate corrective action required.' },
          { label: 'Zero', value: 'Break-even. All revenue is consumed by costs.' },
        ],
        tips: [
          'A high profit figure alone is insufficient without understanding margin percentage.',
          'Track profit trends over time — are margins expanding or compressing?',
          'Seasonal dips in off-peak months are normal if annual totals are positive.',
        ],
      },
      {
        title: 'Total Records',
        badge: 'Data Metric',
        badgeColor: '#D97706',
        description:
          'Displays the number of individual business data entries in the system. Each record typically represents one business or one periodic data submission.',
        details: [
          { label: 'What it counts', value: 'Distinct business entries or data rows in the analysis dataset.' },
          { label: 'Why it matters', value: 'Higher record counts produce more statistically reliable forecasts and benchmarks.' },
        ],
        tips: [
          '1–2 records: Indicative only. Add more data for reliable insights.',
          '3–9 records: Basic patterns visible. Trends emerging.',
          '10+ records: Solid basis for trend analysis and forecasting.',
          '50+ records: High-confidence analysis with robust statistical significance.',
        ],
      },
    ],
  },
  {
    id: 'charts',
    category: 'Charts & Visual Analytics',
    color: '#0891B2',
    bg: '#ECFEFF',
    icon: 'fa-chart-line',
    items: [
      {
        title: 'Monthly Sales Performance',
        badge: 'Time-Series Chart',
        badgeColor: '#0891B2',
        description:
          'A time-series bar chart plotting total sales revenue for each calendar month. The primary tool for understanding revenue seasonality, growth trajectory, and identifying high- and low-performing periods.',
        details: [
          { label: 'Chart type', value: 'Bar chart (with optional line overlay for trend)' },
          { label: 'X-axis', value: 'Calendar months (Jan, Feb, Mar…)' },
          { label: 'Y-axis', value: 'Total sales value in your currency' },
        ],
        tips: [
          'Consistent upward trend → healthy revenue growth.',
          'Recurring dips in specific months → seasonality. Plan inventory and marketing accordingly.',
          'Sudden large spikes → one-time bulk orders or promotions. Worth verifying.',
          'Plateaus → possible market saturation or need for new products/services.',
        ],
        highlight: {
          label: 'Seasonality vs. Decline',
          text: 'A monthly drop is not automatically a problem. Compare the same month across years. If January is consistently 30% lower than December, that is seasonality — not decline.',
          color: '#FFF7ED',
          border: '#EA580C',
        },
      },
      {
        title: 'Monthly Profit Trend',
        badge: 'Trend Chart',
        badgeColor: '#0891B2',
        description:
          'Shows how net profit evolves month by month. Accounts for costs, revealing whether the business is becoming more or less efficient — not just whether it is selling more.',
        details: [
          { label: 'Chart type', value: 'Line chart with fill area' },
          { label: 'Positive area', value: 'Months where the business was profitable' },
          { label: 'Negative area', value: 'Months below zero — loss-making periods' },
        ],
        tips: [
          'Profit growing faster than sales: Margins expanding — excellent signal.',
          'Sales growing but profit flat: Cost structure is worsening. Review expenses urgently.',
          'Volatile month-to-month profit: Inconsistent cost management. Explore smoothing strategies.',
          'Sustained negative months: Structural problem. Business model needs revision.',
        ],
      },
    ],
  },
  {
    id: 'health',
    category: 'Business Health Panel',
    color: '#059669',
    bg: '#ECFDF5',
    icon: 'fa-heart-pulse',
    items: [
      {
        title: 'Business Health',
        badge: 'Composite Score',
        badgeColor: '#059669',
        description:
          'A composite index calculated from multiple financial and operational indicators. Provides a single-number summary of overall performance on a scale of 0 to 100.',
        details: [
          { label: 'Scale', value: '0–100 (higher is better)' },
          { label: 'Inputs', value: 'Profit margin %, revenue growth rate, expense-to-revenue ratio, trend consistency, and sales volume vs benchmarks.' },
        ],
        scores: [
          { range: '90–100', label: 'Excellent', color: '#059669' },
          { range: '75–89', label: 'Good', color: '#16A34A' },
          { range: '60–74', label: 'Average', color: '#CA8A04' },
          { range: '40–59', label: 'Below Average', color: '#EA580C' },
          { range: '< 40', label: 'Poor', color: '#DC2626' },
        ],
      },
      {
        title: 'Performance',
        badge: 'Dimensional Breakdown',
        badgeColor: '#059669',
        description:
          'Breaks the health score into individual components, giving visibility into which specific areas are driving or dragging on the overall rating.',
        details: [
          { label: 'Revenue Performance', value: 'How actual sales compare to expected levels for the business type and scale.' },
          { label: 'Cost Efficiency', value: 'The ratio of expenses to revenue. Lower expense ratios score higher.' },
          { label: 'Profit Margin', value: 'Net profit as a percentage of total sales vs. industry benchmarks.' },
          { label: 'Growth Consistency', value: 'Whether revenue and profit are growing steadily or erratically.' },
          { label: 'Market Penetration', value: 'Estimated share of available market captured based on competitive data.' },
        ],
      },
      {
        title: 'Suggestions',
        badge: 'AI Recommendations',
        badgeColor: '#059669',
        description:
          'An AI-powered recommendation engine that analyses your business data and generates specific, actionable recommendations tailored to your situation — derived directly from your numbers.',
        details: [
          { label: 'Generation', value: 'AI analysis of your specific financial data patterns, compared against performance benchmarks.' },
          { label: 'Priority', value: 'Suggestions are ordered from highest to lowest potential impact.' },
          { label: 'Update cycle', value: 'Refreshes automatically when business data changes.' },
        ],
        tips: [
          'Cost reduction: Specific expense categories where reduction appears feasible.',
          'Revenue growth: Strategies to increase sales based on your trajectory and market position.',
          'Efficiency improvements: Operational changes to improve margins without increasing sales.',
          'Risk mitigation: Actions to reduce identified vulnerabilities.',
        ],
        highlight: {
          label: 'How to Use Suggestions',
          text: 'Prioritise the top 1–2 items, implement them over 30–60 days, then re-assess. The dashboard updates suggestions as your data changes. Apply them with your own business context in mind.',
          color: '#ECFDF5',
          border: '#059669',
        },
      },
    ],
  },
  {
    id: 'directory',
    category: 'Business Directory',
    color: '#7C3AED',
    bg: '#F5F3FF',
    icon: 'fa-building',
    items: [
      {
        title: 'Your Businesses',
        badge: 'Data Registry',
        badgeColor: '#7C3AED',
        description:
          'The central registry of all businesses you have entered. Each entry contains the financial and operational data that feeds the entire analytics engine.',
        details: [
          { label: 'Business Name', value: 'Identifier for the business entity.' },
          { label: 'Category / Industry', value: 'Sector (e.g. Retail, Food & Beverage, Technology, Services).' },
          { label: 'Monthly Sales', value: 'Revenue figures for each month in the analysis period.' },
          { label: 'Monthly Expenses', value: 'Cost figures corresponding to each sales period.' },
          { label: 'Start Date / Period', value: 'When the business started or the data period it represents.' },
        ],
        tips: [
          'Each card shows: name, category, most recent monthly performance, and health indicator.',
          'Clicking a record reveals full historical data, charts, and individual analysis.',
          'Records can be sorted by name, sales, profit, or health score.',
          'Total record count is reflected in the Total Records KPI at the top.',
        ],
      },
    ],
  },
  {
    id: 'forecast',
    category: 'Forecasting Module',
    color: '#DC2626',
    bg: '#FEF2F2',
    icon: 'fa-crystal-ball',
    items: [
      {
        title: 'Forecast Trend',
        badge: 'Long-Range Projection',
        badgeColor: '#DC2626',
        description:
          'Visualises the projected direction of business performance extending beyond the current data range — both historical actuals and the predicted future path in a single continuous view.',
        details: [
          { label: 'Chart type', value: 'Line chart — solid for historical data, dashed for forecast' },
          { label: 'Method', value: 'Weighted moving average combined with trend regression analysis' },
          { label: 'Confidence band', value: 'Shaded area around the forecast line showing uncertainty range' },
        ],
        tips: [
          'Upward forecast line → growth momentum expected to continue.',
          'Flat forecast line → plateau without strategic intervention.',
          'Downward forecast line → declining trend projected. Strategic review recommended.',
          'Wide confidence band → high uncertainty. More data needed for precision.',
          'Narrow confidence band → high confidence. Strong, consistent historical patterns exist.',
        ],
        highlight: {
          label: '⚠ Forecasts Are Probabilistic',
          text: 'The forecast represents the most likely outcome based on historical patterns — not a guarantee. External factors can alter the actual trajectory. Use forecasts as planning guides, not absolute predictions.',
          color: '#FFF7ED',
          border: '#EA580C',
        },
      },
      {
        title: '30-Day Forecast',
        badge: 'Short-Range Operational',
        badgeColor: '#DC2626',
        description:
          'A short-range, high-detail projection of expected sales and profit for the next 30 calendar days. Your operational planning tool for immediate tactical decisions about cash flow, inventory, and staffing.',
        details: [
          { label: 'Time horizon', value: '30 days from today' },
          { label: 'Granularity', value: 'Daily or weekly breakdown within the window' },
          { label: 'Metrics projected', value: 'Expected daily/weekly sales, expenses, net profit, and cash position estimate' },
        ],
        tips: [
          'Cash flow: Anticipate low-cash periods and arrange bridge financing before a shortfall.',
          'Inventory: Stock for expected demand rather than reacting after stockouts.',
          'Staffing: Scale labour up or down ahead of projected busy/quiet periods.',
          'Marketing: Front-load promotions in projected low periods to lift performance.',
          'More historical data = higher accuracy. At least 3 months recommended.',
        ],
      },
    ],
  },
  {
    id: 'competitive',
    category: 'Competitive Analysis',
    color: '#D97706',
    bg: '#FFFBEB',
    icon: 'fa-swords',
    items: [
      {
        title: 'Market Share',
        badge: 'Competitive Metric',
        badgeColor: '#D97706',
        description:
          'Estimates each business\'s proportional share of the total revenue pool within its category. Answers: out of all the revenue generated in this space, what percentage belongs to you?',
        details: [
          { label: 'Calculation', value: 'Your sales as a percentage of combined sales across all businesses in the same category.' },
          { label: 'Display', value: 'Pie/donut chart with exact percentage table.' },
        ],
        scores: [
          { range: '40%+', label: 'Market Leader', color: '#059669' },
          { range: '20–40%', label: 'Strong Competitor', color: '#16A34A' },
          { range: '10–20%', label: 'Competitive', color: '#CA8A04' },
          { range: '< 10%', label: 'Early Stage / Niche', color: '#7C3AED' },
        ],
      },
      {
        title: 'Risk Score',
        badge: 'Vulnerability Index',
        badgeColor: '#DC2626',
        description:
          'A quantified assessment of your business\'s vulnerability. Synthesises multiple risk dimensions into a single score (0–100) indicating likelihood of significant performance deterioration.',
        details: [
          { label: 'Scale', value: '0–100 (lower is better — higher means more risk)' },
          { label: 'Financial Risk', value: 'Profit margin compression, high expense ratios, negative profitability trend.' },
          { label: 'Market Risk', value: 'Competitive pressure, shrinking share, dependence on single revenue streams.' },
          { label: 'Operational Risk', value: 'Volatility in monthly performance suggesting unstable operations.' },
          { label: 'Trend Risk', value: 'Historical trajectory pointing toward deteriorating performance.' },
        ],
        scores: [
          { range: '0–20', label: 'Low Risk', color: '#059669' },
          { range: '21–40', label: 'Moderate-Low', color: '#16A34A' },
          { range: '41–60', label: 'Moderate', color: '#CA8A04' },
          { range: '61–80', label: 'High Risk', color: '#EA580C' },
          { range: '81–100', label: 'Critical Risk', color: '#DC2626' },
        ],
      },
    ],
  },
  {
    id: 'diagnostic',
    category: 'Diagnostic Analysis',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    icon: 'fa-microscope',
    items: [
      {
        title: 'Diagnostic Analysis',
        badge: 'Root Cause Engine',
        badgeColor: '#1D4ED8',
        description:
          'Runs a systematic examination of your business data across multiple analytical dimensions. Identifies patterns, anomalies, and structural issues not visible from surface-level metrics alone.',
        details: [
          { label: 'Financial diagnosis', value: 'Assessment of revenue quality, cost structure, and profit sustainability.' },
          { label: 'Trend diagnosis', value: 'Whether current trends are cyclical, structural, or anomalous.' },
          { label: 'Competitive diagnosis', value: 'Benchmarking against peers to identify relative strengths and weaknesses.' },
          { label: 'Operational diagnosis', value: 'Detection of inconsistencies or inefficiencies in monthly patterns.' },
          { label: 'Strategic diagnosis', value: 'Assessment of long-term positioning and growth potential.' },
        ],
      },
      {
        title: 'Key Observations',
        badge: 'Top Findings',
        badgeColor: '#1D4ED8',
        description:
          'A curated list of the most significant findings from the diagnostic engine — data-driven facts and patterns identified as strategically important. Ranked by significance and actionability.',
        details: [
          { label: 'Count', value: '2–8 observations ranked by significance and actionability.' },
          { label: 'Format', value: 'Concise statements with supporting data points and brief context.' },
          { label: 'Update cycle', value: 'Regenerated each time business data is updated.' },
        ],
        tips: [
          '"Sales have grown 18% over 3 months, but profit margin declined from 24% to 17% — cost inflation outpacing revenue growth."',
          '"Business A generates 73% of total revenue but only 41% of total expenses — your highest-efficiency asset."',
          '"December and March consistently show the highest sales — these months should receive elevated investment."',
        ],
      },
      {
        title: 'Risk Factors',
        badge: 'Named Threats',
        badgeColor: '#DC2626',
        description:
          'Identifies specific, named threats and vulnerabilities — explaining exactly what is driving the Risk Score and giving you specific targets for mitigation action.',
        details: [
          { label: 'Revenue concentration', value: 'Excessive dependence on a single business, product, or customer segment.' },
          { label: 'Margin compression', value: 'Declining profit margin trend heading toward losses.' },
          { label: 'Liquidity risk', value: 'Cash flow patterns suggesting inability to cover short-term expenses.' },
          { label: 'Competitive displacement', value: 'Market share loss to competitors.' },
          { label: 'Cost overrun', value: 'Specific expense categories growing disproportionately to revenue.' },
        ],
      },
      {
        title: 'Strengths',
        badge: 'Competitive Advantages',
        badgeColor: '#059669',
        description:
          'Identifies specific competitive and operational advantages revealed by your data — the positive differentiators you should consciously protect, leverage, and build upon in strategic planning.',
        details: [
          { label: 'Purpose', value: 'Surface genuine advantages so you can amplify them, not just fix problems.' },
          { label: 'Format', value: 'Ranked list of strengths with data evidence and strategic implication.' },
        ],
        tips: [
          '"Profit margins consistently above industry benchmark — superior cost efficiency vs. similar businesses."',
          '"Revenue diversification — income spread across multiple categories, reducing single-point-of-failure risk."',
          '"7 consecutive months of revenue growth — strong operational execution and market acceptance."',
        ],
        highlight: {
          label: 'Strengths-Based Strategy',
          text: 'Most businesses spend 80% of attention fixing weaknesses. Research shows amplifying strengths delivers better results. Fixing weaknesses prevents failure; amplifying strengths drives excellence.',
          color: '#ECFDF5',
          border: '#059669',
        },
      },
    ],
  },
  {
    id: 'positioning',
    category: 'Competitive Positioning',
    color: '#0F766E',
    bg: '#F0FDFA',
    icon: 'fa-bullseye',
    items: [
      {
        title: 'Competitive Position',
        badge: 'Market Tier Ranking',
        badgeColor: '#0F766E',
        description:
          'Ranks your businesses against comparable entities and places each business in a competitive tier, explaining what that position means for strategy.',
        scores: [
          { range: 'Market Leader', label: 'Defend + expand adjacent markets', color: '#059669' },
          { range: 'Strong Challenger', label: "Differentiate and attack leader's weakest segment", color: '#0891B2' },
          { range: 'Established Player', label: 'Find niche advantages, avoid direct confrontation', color: '#CA8A04' },
          { range: 'Emerging Competitor', label: 'Accelerate growth, prioritise customer acquisition', color: '#7C3AED' },
          { range: 'Vulnerable Player', label: 'Restructure, pivot, or consider exit', color: '#DC2626' },
        ],
      },
      {
        title: 'Your Business Cluster',
        badge: 'Landscape Map',
        badgeColor: '#0F766E',
        description:
          'A scatter/bubble chart grouping your businesses alongside competitors based on two or more key performance dimensions simultaneously — a spatial map of the competitive landscape.',
        details: [
          { label: 'X-axis', value: 'Revenue or Sales Volume' },
          { label: 'Y-axis', value: 'Profit Margin or Efficiency Score' },
          { label: 'Bubble size', value: 'Market share or total record count' },
        ],
        tips: [
          'Top-right quadrant (high revenue + high margin) → star performers.',
          'Top-left (high margin, low revenue) → profitable niche with growth potential.',
          'Bottom-right (high revenue, low margin) → volume players under cost pressure.',
          'Bottom-left (low revenue, low margin) → urgent strategic attention required.',
        ],
      },
      {
        title: 'Competitors in Analysis',
        badge: 'Benchmark Peers',
        badgeColor: '#0F766E',
        description:
          'Detailed breakdown of each competitor or peer business included in competitive benchmarking — showing exactly which businesses are used as comparison points and their key metrics.',
        details: [
          { label: 'Per competitor', value: 'Business name, category, sales range, profit margin range, market share, and competitive tier.' },
          { label: 'Selection criteria', value: 'Businesses in the same or adjacent category with comparable scale and market focus.' },
        ],
        tips: [
          'Verify the comparison group is genuinely relevant to your business.',
          'Identify which competitors are most similar — the most meaningful benchmarks.',
          'If a competitor significantly outperforms, analyse their data pattern for strategic lessons.',
        ],
      },
    ],
  },
  {
    id: 'strategy',
    category: 'AI Growth Strategy',
    color: '#9333EA',
    bg: '#FAF5FF',
    icon: 'fa-rocket',
    items: [
      {
        title: 'AI-Generated Growth Strategy',
        badge: 'Synthesised Strategy',
        badgeColor: '#9333EA',
        description:
          'The highest-level output of the analytics engine. Synthesises all available data — financial performance, trends, competitive positioning, risk, and diagnostics — into a cohesive personalised strategic plan.',
        details: [
          { label: 'Step 1', value: 'Data ingestion — all financial records, metrics, and trend data are analysed.' },
          { label: 'Step 2', value: 'Pattern recognition — AI identifies key patterns, anomalies, and strategic signals.' },
          { label: 'Step 3', value: 'Competitive context — performance benchmarked against peers and industry norms.' },
          { label: 'Step 4', value: 'Strategy synthesis — recommendations formulated using proven strategic frameworks.' },
          { label: 'Step 5', value: 'Prioritisation — recommendations ranked by expected impact and feasibility.' },
        ],
        highlight: {
          label: 'Translating Strategy into Action',
          text: 'Take the top 2–3 recommendations, validate them against your operational constraints, define measurable success metrics, assign ownership, and set a 90-day implementation timeline. Return after 90 days for updated recommendations.',
          color: '#FAF5FF',
          border: '#9333EA',
        },
      },
      {
        title: 'Your Strengths',
        badge: 'Growth Levers',
        badgeColor: '#9333EA',
        description:
          'Within the AI Growth Strategy, Strengths are framed explicitly as foundations for future strategy — forward-looking capabilities that can be amplified to drive growth.',
        details: [
          { label: 'Efficiency advantages', value: 'Leaner cost structure enabling competitive pricing or higher margins.' },
          { label: 'Revenue quality', value: 'Recurring, predictable revenue streams that scale with lower incremental cost.' },
          { label: 'Customer retention', value: 'High repeat purchase rates indicating strong product-market fit.' },
          { label: 'Category dominance', value: 'A specific category where you significantly outperform peers.' },
          { label: 'Operational scalability', value: 'Model elements that grow revenue without proportional cost increases.' },
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
                <i className="fa-solid fa-gauge" style={{ marginRight: 6, fontSize: 10 }} />
                Score Guide
              </div>
              {item.scores.map((s, i) => <ScoreRow key={i} {...s} />)}
            </div>
          )}

          {item.tips && item.tips.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
                <i className="fa-solid fa-lightbulb" style={{ marginRight: 6, fontSize: 10 }} />
                Key Points
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

const Documentation = () => {
  const [activeSection, setActiveSection] = useState(null)

  return (
    <Layout>
      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

        * { box-sizing: border-box; }

        .doc-wrapper {
          width: 100%;
          padding: 24px 16px 60px;
        }

        @media (min-width: 640px) {
          .doc-wrapper {
            padding: 32px 24px 60px;
          }
        }

        @media (min-width: 1024px) {
          .doc-wrapper {
            max-width: 900px;
            margin: 0 auto;
            padding: 32px 0 60px;
          }
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
            <i className="fa-solid fa-book-open" style={{ fontSize: 12, color: '#6B7280' }} />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', color: '#6B7280' }}>
              Reference Guide
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>
            Dashboard Documentation
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 8, lineHeight: 1.6, maxWidth: 560 }}>
            Complete explanation of every heading, metric, chart, and AI-generated section in your Business Analytics Dashboard.
          </p>
        </div>

        {/* Quick Nav */}
        <div className="nav-scroll">
          <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', alignSelf: 'center', marginRight: 2 }}>Jump to:</span>
          {sections.map(s => (
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
        {sections.map(section => (
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
                  {section.items.length} heading{section.items.length > 1 ? 's' : ''} in this section
                </div>
              </div>
            </div>

            {section.items.map((item, i) => (
              <ItemCard key={i} item={item} accent={section.color} />
            ))}
          </div>
        ))}

        {/* Footer note */}
        <div style={{
          textAlign: 'center', padding: '20px',
          borderTop: '1px solid #E5E7EB',
          fontSize: 13, color: '#9CA3AF',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <i className="fa-solid fa-rotate" style={{ fontSize: 12 }} />
          All sections update automatically as you add or edit business data.
        </div>
      </div>
    </Layout>
  )
}

export default Documentation
