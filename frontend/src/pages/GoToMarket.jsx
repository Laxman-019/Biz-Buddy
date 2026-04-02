import React, { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'
import {
  FaBullhorn, FaPlus, FaTrash, FaChevronDown, FaChevronUp,
  FaSpinner, FaLightbulb, FaExclamationTriangle, FaRocket,
  FaCheckCircle, FaBolt, FaArrowRight, FaTag
} from 'react-icons/fa'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts'



const PRICING_MODELS = [
  { value: 'subscription',  label: '🔄 Subscription' },
  { value: 'one_time', label: '💳 One-time Purchase' },
  { value: 'freemium', label: '🆓 Freemium' },
  { value: 'usage_based',   label: '⚡ Usage-based' },
  { value: 'tiered', label: '📊 Tiered Pricing' },
  { value: 'not_decided', label: '🤔 Not decided yet' },
]

const CHANNEL_OPTIONS = [
  'linkedin', 'content_marketing', 'cold_outreach',
  'paid_ads', 'referrals', 'partnerships',
  'product_hunt', 'seo', 'whatsapp', 'events',
  'influencers', 'email_marketing',
]

const LAUNCH_VERDICT_CONFIG = {
  excellent:  { label: 'Excellent ✅',  bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  strong: { label: 'Strong ✅', bg: 'bg-green-50',   border: 'border-green-200',   text: 'text-green-700' },
  good: { label: 'Good 👍', bg: 'bg-blue-50', border:'border-blue-200', text: 'text-blue-700' },
  needs_work: { label: 'Needs Work ⚠️', bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-700'  },
  risky: { label: 'Risky ❌', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
}

const PRICING_VERDICT_CONFIG = {
  optimal: { label: 'Optimal ✅',        bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  slightly_low: { label: 'Slightly Low ⬇️',  bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-700'  },
  slightly_high:  { label: 'Slightly High ⬆️', bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700'  },
  too_low: { label: 'Too Low ❌', bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700' },
  too_high: { label: 'Too High ❌', bg: 'bg-red-50',     border: 'border-red-200', text: 'text-red-700'     },
}

const PRIORITY_CONFIG = {
  primary: { label: 'Primary', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  secondary: { label: 'Secondary', bg: 'bg-blue-100',    text: 'text-blue-700' },
  experimental: { label: 'Experimental', bg: 'bg-purple-100',  text: 'text-purple-700'  },
}

const EFFORT_IMPACT = {
  high: { color: 'text-emerald-600' },
  medium: { color: 'text-yellow-600'  },
  low: { color: 'text-red-500'     },
}

const PIE_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const fmt = (n) => {
  if (!n && n !== 0) return '—'
  const num = Number(n)
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`
  return `₹${num.toFixed(0)}`
}

const LaunchTab = ({ rec }) => {
  const [openChannel, setOpenChannel] = useState(null)
  const [openPeriod, setOpenPeriod]   = useState(0)
  const verdict = LAUNCH_VERDICT_CONFIG[rec.launch_verdict]
    || LAUNCH_VERDICT_CONFIG['good']

  return (
    <div className="space-y-5">
      <div className={`rounded-xl border p-4 ${verdict.bg} ${verdict.border}`}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider ${verdict.text}`}>
            Launch Assessment
          </span>
          <div className="flex items-center gap-3">
            {rec.launch_score != null && (
              <span className={`text-lg font-bold ${verdict.text}`}>
                {rec.launch_score}/100
              </span>
            )}
            <span className={`text-xs font-bold px-3 py-1 rounded-full border
              ${verdict.bg} ${verdict.border} ${verdict.text}`}>
              {verdict.label}
            </span>
          </div>
        </div>
        {rec.launch_score != null && (
          <div className="w-full bg-white bg-opacity-60 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                rec.launch_score >= 75 ? 'bg-emerald-500' :
                rec.launch_score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${rec.launch_score}%` }}
            />
          </div>
        )}
        <p className="text-sm text-gray-600 leading-relaxed">{rec.launch_summary}</p>
      </div>

      {rec.beachhead_analysis && (
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-teal-600 uppercase
            tracking-wider mb-2">
            🎯 Beachhead Market Analysis
          </p>
          <p className="text-xs text-gray-400 mb-1">Your focus:
            <span className="font-medium text-gray-600 ml-1">
              {rec.beachhead_market}
            </span>
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {rec.beachhead_analysis}
          </p>
        </div>
      )}

      {rec.launch_channels?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            📣 Launch Channels
          </p>
          <div className="space-y-2">
            {rec.launch_channels.map((ch, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenChannel(openChannel === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4
                    hover:bg-gray-50 transition text-left"
                >
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center
                    justify-center shrink-0 text-xs font-bold text-teal-700">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">
                      {ch.channel}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {ch.why}
                    </p>
                  </div>
                  {ch.budget && (
                    <span className="text-xs font-medium text-teal-600 shrink-0">
                      {ch.budget}
                    </span>
                  )}
                  {openChannel === i
                    ? <FaChevronUp className="text-gray-300 shrink-0" />
                    : <FaChevronDown className="text-gray-300 shrink-0" />
                  }
                </button>
                {openChannel === i && (
                  <div className="border-t border-gray-100 p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                        <p className="text-xs font-semibold text-blue-600 mb-1">
                          🔧 How
                        </p>
                        <p className="text-sm text-gray-600">{ch.how}</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                        <p className="text-xs font-semibold text-emerald-600 mb-1">
                          📈 Expected Result (30 days)
                        </p>
                        <p className="text-sm text-gray-600">{ch.expected_result}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.first_90_days?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            📅 First 90 Days
          </p>
          <div className="space-y-2">
            {rec.first_90_days.map((period, i) => (
              <div key={i}
                className={`rounded-xl border overflow-hidden ${
                  i === 0 ? 'border-blue-200 bg-blue-50' :
                  i === 1 ? 'border-purple-200 bg-purple-50' :
                            'border-emerald-200 bg-emerald-50'
                }`}>
                <button
                  onClick={() => setOpenPeriod(openPeriod === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg
                    shrink-0 ${
                    i === 0 ? 'bg-blue-200 text-blue-800' :
                    i === 1 ? 'bg-purple-200 text-purple-800' :
                              'bg-emerald-200 text-emerald-800'
                  }`}>
                    {period.period}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${
                      i === 0 ? 'text-blue-800' :
                      i === 1 ? 'text-purple-800' : 'text-emerald-800'
                    }`}>
                      {period.theme}
                    </p>
                  </div>
                  {openPeriod === i
                    ? <FaChevronUp className="text-gray-400 shrink-0" />
                    : <FaChevronDown className="text-gray-400 shrink-0" />
                  }
                </button>
                {openPeriod === i && (
                  <div className="border-t border-current border-opacity-10 p-4 space-y-3">
                    {period.activities?.length > 0 && (
                      <ul className="space-y-1.5">
                        {period.activities.map((a, j) => (
                          <li key={j} className="flex gap-2 text-sm text-gray-600">
                            <span className="mt-1 shrink-0">▸</span>{a}
                          </li>
                        ))}
                      </ul>
                    )}
                    {period.goal && (
                      <div className="flex items-start gap-2 bg-white
                        bg-opacity-60 rounded-lg p-3">
                        <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-0.5">
                            Goal
                          </p>
                          <p className="text-sm text-gray-700">{period.goal}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.pr_strategy && (
        <div className="bg-pink-50 border border-pink-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-pink-600 uppercase
            tracking-wider mb-2">
            📰 PR Strategy
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">{rec.pr_strategy}</p>
        </div>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rec.launch_risks?.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              <FaExclamationTriangle /> Launch Risks
            </p>
            <ul className="space-y-2">
              {rec.launch_risks.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-red-400 mt-1 shrink-0">•</span>{r}
                </li>
              ))}
            </ul>
          </div>
        )}
        {rec.launch_tips?.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              <FaLightbulb /> Launch Tips
            </p>
            <ul className="space-y-2">
              {rec.launch_tips.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-blue-400 font-bold shrink-0">{i+1}.</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

const AcquisitionTab = ({ rec }) => {
  const [openCh, setOpenCh] = useState(null)

  const pieData = rec.budget_allocation?.map(b => ({
    name:  b.channel,
    value: b.percentage,
  })) || []

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const item = rec.budget_allocation?.find(
      b => b.channel === payload[0].name
    )
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700">{payload[0].name}</p>
        <p className="text-gray-500">
          {payload[0].value}% · {fmt(item?.monthly_amount)}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-700">
            Acquisition Overview
          </span>
          {rec.acq_score != null && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              rec.acq_score >= 70
                ? 'bg-emerald-100 text-emerald-700'
                : rec.acq_score >= 50
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            }`}>
              Score: {rec.acq_score}/100
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{rec.acq_summary}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Monthly Budget',
            value: fmt(rec.monthly_acq_budget),
            color: 'text-indigo-600',
          },
          {
            label: 'Target Customers/mo',
            value: rec.target_monthly_customers,
            color: 'text-emerald-600',
          },
          {
            label: 'Projected CAC',
            value: fmt(rec.projected_cac),
            color: 'text-orange-600',
          },
          {
            label: 'Top Channel',
            value: rec.channel_priority?.[0] || '—',
            color: 'text-teal-600',
          },
        ].map((m) => (
          <div key={m.label}
            className="bg-white border border-gray-100 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">{m.label}</p>
            <p className={`text-sm font-bold ${m.color} truncate`}>{m.value}</p>
          </div>
        ))}
      </div>

      {pieData.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-4">
            💰 Budget Allocation
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="shrink-0">
              <PieChart width={180} height={180}>
                <Pie
                  data={pieData}
                  cx={85} cy={85}
                  innerRadius={45}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {rec.budget_allocation?.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {b.channel}
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {b.percentage}% · {fmt(b.monthly_amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${b.percentage}%`,
                          background: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {rec.channel_priority?.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-600 uppercase
            tracking-wider mb-3">
            🏆 Channel Priority Order
          </p>
          <div className="flex flex-wrap gap-2">
            {rec.channel_priority.map((ch, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-white
                border border-indigo-200 text-indigo-700 text-xs font-medium
                px-3 py-1.5 rounded-full">
                <span className="font-bold text-indigo-400">#{i+1}</span>
                {ch}
              </span>
            ))}
          </div>
        </div>
      )}

      {rec.channel_strategies?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            📊 Channel Strategies
          </p>
          <div className="space-y-2">
            {rec.channel_strategies.map((ch, i) => {
              const priority = PRIORITY_CONFIG[ch.priority]
                || PRIORITY_CONFIG['secondary']
              return (
                <div key={i}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenCh(openCh === i ? null : i)}
                    className="w-full flex items-center gap-3 p-4
                      hover:bg-gray-50 transition text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm capitalize">
                          {ch.channel}
                        </p>
                        <span className={`text-xs font-medium px-2 py-0.5
                          rounded-full ${priority.bg} ${priority.text}`}>
                          {priority.label}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-gray-400">
                          Budget: {fmt(ch.monthly_budget)}/mo
                        </span>
                        <span className="text-xs text-gray-400">
                          CAC: {fmt(ch.expected_cac)}
                        </span>
                        <span className="text-xs text-emerald-600">
                          ~{ch.expected_monthly_customers} customers/mo
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {ch.timeline_to_results}
                    </span>
                    {openCh === i
                      ? <FaChevronUp className="text-gray-300 shrink-0" />
                      : <FaChevronDown className="text-gray-300 shrink-0" />
                    }
                  </button>
                  {openCh === i && (
                    <div className="border-t border-gray-100 p-4 space-y-3">
                      {ch.tactics?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400
                            uppercase tracking-wider mb-2">
                            Tactics
                          </p>
                          <ul className="space-y-1">
                            {ch.tactics.map((t, j) => (
                              <li key={j} className="flex gap-2 text-sm text-gray-600">
                                <span className="text-teal-400 mt-1 shrink-0">→</span>
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {ch.tools?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {ch.tools.map((tool, j) => (
                            <span key={j} className="text-xs bg-gray-100
                              text-gray-600 px-2.5 py-1 rounded-full">
                              🛠 {tool}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {rec.growth_hacks?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaBolt className="text-yellow-500" /> Growth Hacks
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rec.growth_hacks.map((hack, i) => (
              <div key={i}
                className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {hack.hack}
                  </p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">
                  {hack.description}
                </p>
                <div className="flex gap-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full
                    bg-white border border-yellow-200">
                    Effort:
                    <span className={`ml-1 font-bold ${EFFORT_IMPACT[hack.effort]?.color || 'text-gray-600'}`}>
                      {hack.effort}
                    </span>
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full
                    bg-white border border-yellow-200">
                    Impact:
                    <span className={`ml-1 font-bold ${EFFORT_IMPACT[hack.impact]?.color || 'text-gray-600'}`}>
                      {hack.impact}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const PricingTab = ({ rec }) => {
  const verdict = PRICING_VERDICT_CONFIG[rec.pricing_verdict]
    || PRICING_VERDICT_CONFIG['optimal']

  return (
    <div className="space-y-5">

      <div className={`rounded-xl border p-4 ${verdict.bg} ${verdict.border}`}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider
            ${verdict.text}`}>
            Pricing Assessment
          </span>
          <div className="flex items-center gap-3">
            {rec.pricing_score != null && (
              <span className={`text-lg font-bold ${verdict.text}`}>
                {rec.pricing_score}/100
              </span>
            )}
            <span className={`text-xs font-bold px-3 py-1 rounded-full border
              ${verdict.bg} ${verdict.border} ${verdict.text}`}>
              {verdict.label}
            </span>
          </div>
        </div>
        {rec.pricing_score != null && (
          <div className="w-full bg-white bg-opacity-60 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                rec.pricing_score >= 75 ? 'bg-emerald-500' :
                rec.pricing_score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${rec.pricing_score}%` }}
            />
          </div>
        )}
        <p className="text-sm text-gray-600 leading-relaxed">{rec.pricing_summary}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Your Price</p>
          <p className="text-lg font-bold text-gray-700">
            {fmt(rec.current_price)}
          </p>
          <p className="text-xs text-gray-300">per month</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${verdict.bg} ${verdict.border}`}>
          <p className={`text-xs mb-1 ${verdict.text}`}>AI Recommended</p>
          <p className={`text-lg font-bold ${verdict.text}`}>
            {fmt(rec.recommended_price)}
          </p>
          <p className={`text-xs ${verdict.text} opacity-70`}>per month</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Competitor Range</p>
          <p className="text-sm font-bold text-gray-700">
            {fmt(rec.competitor_price_min)} – {fmt(rec.competitor_price_max)}
          </p>
          <p className="text-xs text-gray-300">per month</p>
        </div>
      </div>

      {rec.pricing_rationale && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-600 uppercase
            tracking-wider mb-2">
            💡 Pricing Rationale
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {rec.pricing_rationale}
          </p>
        </div>
      )}

      {rec.package_tiers?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaTag /> Pricing Tiers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {rec.package_tiers.map((tier, i) => (
              <div key={i} className={`rounded-2xl border p-5 relative
                transition ${
                tier.is_recommended
                  ? 'border-indigo-400 bg-indigo-50 shadow-md'
                  : 'border-gray-200 bg-white'
              }`}>
                {tier.is_recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white text-xs font-bold
                      px-3 py-1 rounded-full whitespace-nowrap">
                      ⭐ Recommended
                    </span>
                  </div>
                )}
                <p className={`text-sm font-bold mb-1 ${
                  tier.is_recommended ? 'text-indigo-700' : 'text-gray-700'
                }`}>
                  {tier.tier_name}
                </p>
                <div className="mb-3">
                  <span className={`text-2xl font-bold ${
                    tier.is_recommended ? 'text-indigo-800' : 'text-gray-800'
                  }`}>
                    {fmt(tier.price)}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">
                    /{tier.billing || 'month'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{tier.target_customer}</p>
                <ul className="space-y-1.5">
                  {tier.features?.map((f, j) => (
                    <li key={j} className="flex gap-2 text-xs text-gray-600">
                      <FaCheckCircle className={`shrink-0 mt-0.5 ${
                        tier.is_recommended
                          ? 'text-indigo-500' : 'text-emerald-400'
                      }`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.psychological_tips?.length > 0 && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-purple-600 uppercase
            tracking-wider mb-3">
            🧠 Psychological Pricing Tips
          </p>
          <ul className="space-y-2">
            {rec.psychological_tips.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-purple-400 font-bold shrink-0">{i+1}.</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rec.price_testing_plan && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-orange-600 uppercase
              tracking-wider mb-2">
              🧪 Price Testing Plan
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {rec.price_testing_plan}
            </p>
          </div>
        )}
        {rec.annual_strategy && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-600 uppercase
              tracking-wider mb-2">
              📅 Annual Plan Strategy
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {rec.annual_strategy}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const GTMCard = ({ rec, onDelete }) => {
  const [expanded, setExpanded]   = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const TABS = ['Launch Strategy', 'Customer Acquisition', 'Pricing']
  const verdict = LAUNCH_VERDICT_CONFIG[rec.launch_verdict]
    || LAUNCH_VERDICT_CONFIG['good']

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
          shrink-0 ${verdict.bg}`}>
          <FaBullhorn className={`text-sm ${verdict.text}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{rec.idea_title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Launch in {rec.launch_weeks}w
            {' · '}Budget: {fmt(rec.launch_budget)}
            {' · '}Price: {fmt(rec.current_price)}/mo
          </p>
        </div>

        {rec.launch_score != null && (
          <div className={`text-center px-3 py-1.5 rounded-full border
            ${verdict.bg} ${verdict.border}`}>
            <span className={`text-base font-bold ${verdict.text}`}>
              {rec.launch_score}
            </span>
            <span className={`text-xs ml-0.5 ${verdict.text}`}>/100</span>
          </div>
        )}

        <span className={`hidden sm:block text-xs font-semibold px-3 py-1.5
          rounded-full border ${verdict.bg} ${verdict.border} ${verdict.text}`}>
          {verdict.label}
        </span>

        {rec.projected_cac && (
          <span className="hidden sm:block text-xs font-semibold px-3 py-1.5
            rounded-full bg-orange-50 border border-orange-200 text-orange-600">
            CAC {fmt(rec.projected_cac)}
          </span>
        )}


        {rec.status === 'analyzing' && (
          <span className="text-xs bg-blue-50 text-blue-500 px-2 py-1
            rounded-full flex items-center gap-1">
            <FaSpinner className="animate-spin text-xs" /> Analyzing
          </span>
        )}
        {rec.status === 'failed' && (
          <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full">
            Failed
          </span>
        )}

        <p className="text-xs text-gray-300 shrink-0">
          {new Date(rec.created_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          })}
        </p>

        <button
          onClick={e => { e.stopPropagation(); onDelete(rec.id) }}
          className="text-gray-200 hover:text-red-400 transition p-1 shrink-0"
        >
          <FaTrash />
        </button>

        {expanded
          ? <FaChevronUp className="text-gray-300 shrink-0" />
          : <FaChevronDown className="text-gray-300 shrink-0" />
        }
      </div>


      {expanded && rec.status === 'done' && (
        <div className="border-t border-gray-100">
          <div className="flex border-b border-gray-100 px-5">
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`py-3 px-4 text-sm font-medium transition border-b-2
                  ${activeTab === i
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === 0 && <LaunchTab rec={rec} />}
            {activeTab === 1 && <AcquisitionTab rec={rec} />}
            {activeTab === 2 && <PricingTab rec={rec} />}
          </div>
        </div>
      )}

      {expanded && rec.status === 'failed' && (
        <div className="border-t border-gray-100 p-5">
          <div className="bg-red-50 rounded-xl p-4 text-sm text-red-600">
            Analysis failed: {rec.error_message || 'Please try again.'}
          </div>
        </div>
      )}
    </div>
  )
}


const GoToMarket = () => {
  const [records, setRecords] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    idea_id: '',
    beachhead_market: '',
    launch_weeks: '8',
    launch_budget: '',
    monthly_acq_budget: '',
    target_monthly_customers: '',
    preferred_channels: [],
    current_price: '',
    competitor_price_min: '',
    competitor_price_max: '',
    pricing_model: 'subscription',
  })

  useEffect(() => {
    Promise.all([fetchRecords(), fetchIdeas()])
      .finally(() => setLoading(false))
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get('/api/gtm/')
      setRecords(res.data)
    } catch {
      toast.error('Failed to load GTM reports')
    }
  }

  const fetchIdeas = async () => {
    try {
      const res = await axiosInstance.get('/api/business-model/ideas/')
      setIdeas(res.data)
    } catch {
      toast.error('Failed to load ideas')
    }
  }

  const toggleChannel = (ch) => {
    const chs = formData.preferred_channels
    setFormData({
      ...formData,
      preferred_channels: chs.includes(ch)
        ? chs.filter(c => c !== ch)
        : [...chs, ch],
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.idea_id) { toast.error('Please select an idea'); return }
    if (!formData.beachhead_market.trim()) {
      toast.error('Please describe your beachhead market'); return
    }
    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        launch_weeks: parseInt(formData.launch_weeks),
        target_monthly_customers: parseInt(formData.target_monthly_customers),
      }
      const res = await axiosInstance.post('/api/gtm/submit/', payload)
      setRecords([res.data, ...records])
      setFormData({
        idea_id: '', beachhead_market: '', launch_weeks: '8',
        launch_budget: '', monthly_acq_budget: '',
        target_monthly_customers: '', preferred_channels: [],
        current_price: '', competitor_price_min: '',
        competitor_price_max: '', pricing_model: 'subscription',
      })
      setShowForm(false)
      toast.success('GTM strategy generated!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Analysis failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this GTM report?')) return
    try {
      await axiosInstance.delete(`/api/gtm/${id}/`)
      setRecords(records.filter(r => r.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const set = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value })

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2500} />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center
            justify-center">
            <FaBullhorn className="text-teal-600 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Go-To-Market Strategy
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Launch · Customer Acquisition · Pricing — AI generated
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5
                     rounded-xl hover:bg-teal-700 transition text-sm font-medium
                     shadow-sm"
        >
          <FaPlus /> Build GTM Strategy
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-teal-100
          p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Build Your GTM Strategy
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Fill in your launch details — AI will build your full
            Go-To-Market strategy, acquisition plan, and pricing structure.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Select Validated Idea
              </label>
              <select
                value={formData.idea_id}
                onChange={set('idea_id')}
                className="w-full border border-gray-300 p-3 rounded-xl text-sm
                           focus:ring-2 focus:ring-teal-400 focus:outline-none"
                required
              >
                <option value="">— Select an idea —</option>
                {ideas.map(idea => (
                  <option key={idea.id} value={idea.id}>
                    {idea.idea_title}
                    {idea.overall_score ? ` (Score: ${idea.overall_score})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase
                tracking-wider mb-3 flex items-center gap-2">
                <FaRocket className="text-teal-500" /> Launch Strategy
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Beachhead Market
                    <span className="text-gray-300 font-normal ml-1">
                      — who to target first
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pizza shops in Bangalore with 1-3 locations"
                    value={formData.beachhead_market}
                    onChange={set('beachhead_market')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Launch Timeline (weeks)
                  </label>
                  <input
                    type="number" min="1"
                    placeholder="e.g. 8"
                    value={formData.launch_weeks}
                    onChange={set('launch_weeks')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Launch Budget (₹)
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 200000"
                    value={formData.launch_budget}
                    onChange={set('launch_budget')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase
                tracking-wider mb-3 flex items-center gap-2">
                <FaArrowRight className="text-indigo-500" /> Customer Acquisition
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Monthly Acquisition Budget (₹)
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 50000"
                    value={formData.monthly_acq_budget}
                    onChange={set('monthly_acq_budget')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Target New Customers / Month
                  </label>
                  <input
                    type="number" min="1"
                    placeholder="e.g. 20"
                    value={formData.target_monthly_customers}
                    onChange={set('target_monthly_customers')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-2">
                    Preferred Channels
                    <span className="text-gray-300 font-normal ml-1">
                      (select all that apply)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CHANNEL_OPTIONS.map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => toggleChannel(ch)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full
                          border transition ${
                          formData.preferred_channels.includes(ch)
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {ch.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>


            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase
                tracking-wider mb-3 flex items-center gap-2">
                <FaTag className="text-purple-500" /> Pricing
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Your Price (₹/month)
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 999"
                    value={formData.current_price}
                    onChange={set('current_price')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Pricing Model
                  </label>
                  <select
                    value={formData.pricing_model}
                    onChange={set('pricing_model')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  >
                    {PRICING_MODELS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Competitor Min Price (₹)
                    <span className="text-gray-300 font-normal ml-1">(optional)</span>
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 500"
                    value={formData.competitor_price_min}
                    onChange={set('competitor_price_min')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Competitor Max Price (₹)
                    <span className="text-gray-300 font-normal ml-1">(optional)</span>
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 2000"
                    value={formData.competitor_price_max}
                    onChange={set('competitor_price_max')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting || ideas.length === 0}
                className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5
                           rounded-xl hover:bg-teal-700 transition text-sm font-medium
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <><FaSpinner className="animate-spin" /> Generating...</>
                  : <><FaBullhorn /> Generate GTM Strategy</>
                }
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
                className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl
                           hover:bg-gray-200 transition text-sm font-medium
                           disabled:opacity-60"
              >
                Cancel
              </button>
            </div>

            {submitting && (
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4
                flex items-center gap-3">
                <FaSpinner className="animate-spin text-teal-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-teal-700">
                    AI is building your GTM strategy...
                  </p>
                  <p className="text-xs text-teal-400 mt-0.5">
                    Building launch plan, acquisition channels and pricing tiers.
                    This takes 20–30 seconds.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <FaSpinner className="animate-spin text-2xl mx-auto mb-3" />
          <p className="text-sm">Loading GTM strategies...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200
                        flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
            <FaBullhorn className="text-3xl text-teal-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg">
            No GTM strategies yet
          </p>
          <p className="text-gray-300 text-sm mt-1 max-w-xs">
            Fill in your launch details — AI will build your full
            go-to-market strategy, channel plan, and pricing structure.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 bg-teal-600 text-white
                       px-5 py-2.5 rounded-xl hover:bg-teal-700 transition
                       text-sm font-medium"
          >
            <FaPlus /> Build First GTM Strategy
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(rec => (
            <GTMCard
              key={rec.id}
              rec={rec}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default GoToMarket;