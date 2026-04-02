import React, { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'
import {
  FaBolt, FaPlus, FaTrash, FaChevronDown, FaChevronUp,
  FaSpinner, FaLightbulb, FaExclamationTriangle, FaStar,
  FaCheckCircle, FaArrowUp, FaUsers, FaChartBar
} from 'react-icons/fa'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine
} from 'recharts'


const BUSINESS_MODELS = [
  { value: 'saas',        label: '💻 SaaS / Software'  },
  { value: 'marketplace', label: '🏪 Marketplace'       },
  { value: 'consumer',    label: '📱 Consumer App'      },
  { value: 'ecommerce',   label: '🛒 E-commerce'        },
  { value: 'service',     label: '🤝 Service-based'     },
]

const PRIMARY_GOALS = [
  { value: 'growth',     label: '🚀 Growth — acquire more users'    },
  { value: 'retention',  label: '🔒 Retention — keep existing users' },
  { value: 'revenue',    label: '💰 Revenue — maximize monetization' },
  { value: 'engagement', label: '⚡ Engagement — increase usage'     },
]

const RETENTION_VERDICT_CONFIG = {
  excellent: { label: 'Excellent ✅', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  good:      { label: 'Good ✅',      bg: 'bg-green-50',   border: 'border-green-200',   text: 'text-green-700',   bar: 'bg-green-500'   },
  average:   { label: 'Average ⚠️',  bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-700',  bar: 'bg-yellow-400'  },
  poor:      { label: 'Poor ❌',      bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700',  bar: 'bg-orange-500'  },
  critical:  { label: 'Critical 🔴', bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700',     bar: 'bg-red-500'     },
}

const VIRAL_VERDICT_CONFIG = {
  viral:       { label: '🚀 Viral!',      bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  near_viral:  { label: '⚡ Near Viral',  bg: 'bg-green-50',   border: 'border-green-200',   text: 'text-green-700'   },
  growing:     { label: '📈 Growing',     bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700'    },
  stagnant:    { label: '➡️ Stagnant',   bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-700'  },
  needs_work:  { label: '🔧 Needs Work', bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700'  },
}

const EFFORT_COLOR = {
  low: 'text-emerald-600',
  medium: 'text-yellow-600',
  high: 'text-red-500',
}

const PROB_COLOR = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low:    'bg-gray-100 text-gray-600',
}

const NorthStarTab = ({ rec }) => {
  const [openMetric, setOpenMetric] = useState(null)

  return (
    <div className="space-y-5">

      <div className="bg-linear-to-br from-indigo-50 to-purple-50
        border border-indigo-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center
            justify-center shrink-0">
            <FaStar className="text-indigo-600 text-xl" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-indigo-500 uppercase
              tracking-wider mb-1">
              Your North Star Metric
            </p>
            <h3 className="text-xl font-bold text-indigo-900 mb-2">
              {rec.north_star_metric || '—'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {rec.north_star_why}
            </p>
          </div>
        </div>
      </div>

      {rec.north_star_how_to_measure && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase
            tracking-wider mb-2">
            📐 How to Measure
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {rec.north_star_how_to_measure}
          </p>
        </div>
      )}

      {rec.supporting_metrics?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            📊 Supporting Metrics
          </p>
          <div className="space-y-2">
            {rec.supporting_metrics.map((m, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenMetric(openMetric === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4
                    hover:bg-gray-50 transition text-left"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-100
                    text-indigo-600 text-xs font-bold flex items-center
                    justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {m.metric}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {m.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-emerald-600">
                      {m.target}
                    </p>
                    <p className="text-xs text-gray-400">{m.frequency}</p>
                  </div>
                  {openMetric === i
                    ? <FaChevronUp className="text-gray-300 shrink-0" />
                    : <FaChevronDown className="text-gray-300 shrink-0" />
                  }
                </button>
                {openMetric === i && (
                  <div className="border-t border-gray-100 p-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {m.description}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <span className="text-xs bg-emerald-50 text-emerald-600
                        border border-emerald-100 px-2.5 py-1 rounded-full">
                        Target: {m.target}
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-600
                        border border-blue-100 px-2.5 py-1 rounded-full">
                        Check: {m.frequency}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.kpi_benchmarks?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            🏁 Industry Benchmarks
          </p>
          <div className="space-y-3">
            {rec.kpi_benchmarks.map((b, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-800">{b.metric}</p>
                  <span className="text-xs text-gray-400">{b.their_stage}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-yellow-50 border border-yellow-100
                    rounded-lg p-2 text-center">
                    <p className="text-xs text-yellow-600 font-medium">Good</p>
                    <p className="text-sm font-bold text-yellow-700">{b.good}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100
                    rounded-lg p-2 text-center">
                    <p className="text-xs text-emerald-600 font-medium">Great</p>
                    <p className="text-sm font-bold text-emerald-700">{b.great}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rec.warning_signs?.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              <FaExclamationTriangle /> Warning Signs
            </p>
            <ul className="space-y-2">
              {rec.warning_signs.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-red-400 mt-1 shrink-0">•</span>{w}
                </li>
              ))}
            </ul>
          </div>
        )}
        {rec.tracking_recommendations?.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              <FaLightbulb /> Tracking Tools
            </p>
            <ul className="space-y-2">
              {rec.tracking_recommendations.map((t, i) => (
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

const RetentionTab = ({ rec }) => {
  const verdict = RETENTION_VERDICT_CONFIG[rec.retention_verdict]
    || RETENTION_VERDICT_CONFIG['average']

  const chartData = rec.benchmark_comparison?.map(b => ({
    period:      b.period,
    'Your Rate': b.their_rate,
    'Avg':       b.industry_avg,
    'Top 25%':   b.top_quartile,
  })) || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg
        p-3 text-xs">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.fill }}>
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">

      <div className={`rounded-xl border p-4 ${verdict.bg} ${verdict.border}`}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider
            ${verdict.text}`}>
            Retention Assessment
          </span>
          <div className="flex items-center gap-3">
            {rec.retention_score != null && (
              <span className={`text-lg font-bold ${verdict.text}`}>
                {rec.retention_score}/100
              </span>
            )}
            <span className={`text-xs font-bold px-3 py-1 rounded-full border
              ${verdict.bg} ${verdict.border} ${verdict.text}`}>
              {verdict.label}
            </span>
          </div>
        </div>
        {rec.retention_score != null && (
          <div className="w-full bg-white bg-opacity-60 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-700
                ${verdict.bar}`}
              style={{ width: `${rec.retention_score}%` }}
            />
          </div>
        )}
        <p className="text-sm text-gray-600 leading-relaxed">
          {rec.retention_summary}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Week 1', value: rec.week1_retention  },
          { label: 'Month 1', value: rec.month1_retention },
          { label: 'Month 3', value: rec.month3_retention },
        ].map((r) => (
          <div key={r.label}
            className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{r.label}</p>
            <p className={`text-2xl font-bold ${
              r.value >= 40 ? 'text-emerald-600' :
              r.value >= 20 ? 'text-yellow-600' : 'text-red-500'
            }`}>
              {r.value}%
            </p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full ${
                  r.value >= 40 ? 'bg-emerald-500' :
                  r.value >= 20 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min(r.value, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-4">
            📊 Benchmark Comparison
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Your Rate" fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="Avg"       fill="#94a3b8" radius={[4,4,0,0]} />
              <Bar dataKey="Top 25%"  fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {rec.benchmark_comparison?.map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="text-gray-500 w-16 shrink-0">{b.period}</span>
                <span className={`font-bold w-12 ${
                  b.their_rate >= b.industry_avg
                    ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {b.their_rate}%
                </span>
                <span className="text-gray-400">
                  avg: {b.industry_avg}% · top: {b.top_quartile}%
                </span>
                <span className={`ml-auto text-xs font-medium px-2 py-0.5
                  rounded-full ${
                  b.verdict === 'above'
                    ? 'bg-emerald-100 text-emerald-700'
                    : b.verdict === 'at'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                }`}>
                  {b.verdict}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.pmf_assessment && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-purple-600 uppercase
            tracking-wider mb-2">
            🎯 Product-Market Fit Assessment
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {rec.pmf_assessment}
          </p>
        </div>
      )}

      {rec.churn_reasons?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            🚪 Likely Churn Reasons
          </p>
          <div className="space-y-2">
            {rec.churn_reasons.map((c, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-sm font-semibold text-gray-800 flex-1">
                    {c.reason}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                    ${PROB_COLOR[c.probability] || PROB_COLOR['medium']}`}>
                    {c.probability} probability
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  🔍 {c.how_to_detect}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rec.retention_strategies?.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              <FaArrowUp /> Retention Strategies
            </p>
            <div className="space-y-3">
              {rec.retention_strategies.map((s, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold text-gray-800">
                    {s.strategy}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {s.description}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    Impact: {s.expected_impact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {rec.retention_quick_wins?.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              <FaBolt /> Quick Wins
            </p>
            <ul className="space-y-2">
              {rec.retention_quick_wins.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-blue-400 shrink-0 mt-0.5" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

const ViralTab = ({ rec }) => {
  const verdict = VIRAL_VERDICT_CONFIG[rec.viral_verdict]
    || VIRAL_VERDICT_CONFIG['needs_work']

  const chartData = rec.growth_projections?.map(p => ({
    month: `M${p.month}`,
    MAU:   p.mau,
  })) || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg
        p-3 text-xs">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-indigo-600">MAU: {payload[0]?.value?.toLocaleString('en-IN')}</p>
      </div>
    )
  }

  const kColor = rec.k_factor >= 1
    ? 'text-emerald-600'
    : rec.k_factor >= 0.5
      ? 'text-yellow-600'
      : 'text-red-500'

  const kBg = rec.k_factor >= 1
    ? 'bg-emerald-50 border-emerald-200'
    : rec.k_factor >= 0.5
      ? 'bg-yellow-50 border-yellow-200'
      : 'bg-red-50 border-red-200'

  return (
    <div className="space-y-5">

      <div className={`rounded-xl border p-5 ${kBg}`}>
        <div className="flex items-center gap-5">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">K-factor</p>
            <p className={`text-5xl font-black ${kColor}`}>
              {rec.k_factor != null
                ? Number(rec.k_factor).toFixed(2)
                : '—'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {rec.k_factor >= 1
                ? '🚀 Viral!'
                : rec.k_factor >= 0.5
                  ? '📈 Growing'
                  : '🔧 Needs work'}
            </p>
          </div>
          <div className="flex-1 border-l border-gray-200 pl-5">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full
              border mb-2 inline-block ${kBg} ${kColor}`}>
              {verdict.label}
            </span>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              {rec.viral_summary}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-current border-opacity-10
          grid grid-cols-3 gap-3 text-center">
          {[
            {
              label: 'Invites / User',
              value: rec.avg_invites_per_user,
              suffix: '',
            },
            {
              label: 'Conversion Rate',
              value: rec.invite_conversion_rate,
              suffix: '%',
            },
            {
              label: 'K-factor',
              value: rec.k_factor != null
                ? Number(rec.k_factor).toFixed(3) : '—',
              suffix: '',
              highlight: true,
            },
          ].map((m) => (
            <div key={m.label}
              className={`rounded-lg p-2 ${
                m.highlight ? 'bg-white bg-opacity-60' : ''
              }`}>
              <p className="text-xs text-gray-400">{m.label}</p>
              <p className={`text-lg font-bold ${
                m.highlight ? kColor : 'text-gray-700'
              }`}>
                {m.value}{m.suffix}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-3 text-xs flex-wrap">
          {[
            { k: 'K > 1',    label: 'Viral growth',    color: 'bg-emerald-100 text-emerald-700' },
            { k: 'K = 1',    label: 'Steady state',    color: 'bg-blue-100 text-blue-700'       },
            { k: '0.5–1',    label: 'Paid acquisition needed', color: 'bg-yellow-100 text-yellow-700' },
            { k: 'K < 0.5',  label: 'Low viral',       color: 'bg-red-100 text-red-700'         },
          ].map(r => (
            <span key={r.k}
              className={`px-2.5 py-1 rounded-full font-medium ${r.color}`}>
              {r.k}: {r.label}
            </span>
          ))}
        </div>
      </div>

      {rec.viral_loop_design && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-600 uppercase
            tracking-wider mb-2">
            🔄 Viral Loop Design
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {rec.viral_loop_design}
          </p>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase
              tracking-wider">
              📈 MAU Growth Projection
            </p>
            <span className="text-xs text-gray-400">
              Starting from {rec.monthly_active_users?.toLocaleString('en-IN')} MAU
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={v =>
                  v >= 1000 ? `${(v/1000).toFixed(0)}K` : v
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="MAU"
                stroke="#6366f1" strokeWidth={2.5}
                dot={{ fill: '#6366f1', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {rec.growth_projections?.map((p, i) => (
              <div key={i}
                className="bg-indigo-50 border border-indigo-100 rounded-lg
                  p-2 text-center">
                <p className="text-xs text-indigo-400">Month {p.month}</p>
                <p className="text-sm font-bold text-indigo-700">
                  {p.mau?.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-400">K={p.k_assumption}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.k_factor_improvements?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaArrowUp className="text-emerald-500" /> Improve Your K-factor
          </p>
          <div className="space-y-2">
            {rec.k_factor_improvements.map((imp, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100
                    text-emerald-600 text-xs font-bold flex items-center
                    justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {imp.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {imp.current_impact}
                    </p>
                    <div className="flex gap-3 mt-2 flex-wrap">
                      <span className="text-xs text-emerald-600 font-medium">
                        +K: {imp.potential_k_increase}
                      </span>
                      <span className={`text-xs font-medium
                        ${EFFORT_COLOR[imp.effort] || 'text-gray-600'}`}>
                        Effort: {imp.effort}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.viral_examples?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            💡 Learn From These
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rec.viral_examples.map((ex, i) => (
              <div key={i}
                className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                <p className="text-sm font-bold text-gray-800 mb-1">
                  {ex.company}
                </p>
                <p className="text-xs text-gray-600 mb-2">{ex.their_loop}</p>
                <p className="text-xs text-yellow-700 font-medium flex gap-1">
                  <FaLightbulb className="shrink-0 mt-0.5" />
                  {ex.lesson}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const KPICard = ({ rec, onDelete }) => {
  const [expanded, setExpanded]   = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const TABS = ['North Star', 'Cohort Retention', 'Viral Coefficient']
  const retVerdict = RETENTION_VERDICT_CONFIG[rec.retention_verdict]
    || RETENTION_VERDICT_CONFIG['average']

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Header */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center
          justify-center shrink-0">
          <FaBolt className="text-indigo-600 text-sm" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{rec.idea_title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {BUSINESS_MODELS.find(b => b.value === rec.business_model_type)?.label}
            {' · '}
            {PRIMARY_GOALS.find(g => g.value === rec.primary_goal)?.label}
          </p>
        </div>

        {rec.north_star_metric && (
          <span className="hidden sm:block text-xs font-semibold px-3 py-1.5
            rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700
            max-w-45 truncate">
            ⭐ {rec.north_star_metric}
          </span>
        )}

        {rec.retention_score != null && (
          <span className={`hidden sm:block text-xs font-semibold px-3 py-1.5
            rounded-full border ${retVerdict.bg} ${retVerdict.border}
            ${retVerdict.text}`}>
            Ret: {rec.retention_score}/100
          </span>
        )}

        {rec.k_factor != null && (
          <span className={`hidden sm:block text-xs font-semibold px-3 py-1.5
            rounded-full border ${
            rec.k_factor >= 1
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : rec.k_factor >= 0.5
                ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            K={Number(rec.k_factor).toFixed(2)}
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
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === 0 && <NorthStarTab rec={rec} />}
            {activeTab === 1 && <RetentionTab rec={rec} />}
            {activeTab === 2 && <ViralTab rec={rec} />}
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

const StartupKPIs = () => {
  const [records, setRecords]       = useState([])
  const [ideas, setIdeas]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData]     = useState({
    idea_id:                '',
    business_model_type:    'saas',
    primary_goal:           'growth',
    currently_tracking:     '',
    week1_retention:        '',
    month1_retention:       '',
    month3_retention:       '',
    avg_invites_per_user:   '',
    invite_conversion_rate: '',
    monthly_active_users:   '',
  })

  useEffect(() => {
    Promise.all([fetchRecords(), fetchIdeas()])
      .finally(() => setLoading(false))
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get('/api/kpis/')
      setRecords(res.data)
    } catch {
      toast.error('Failed to load KPI reports')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.idea_id) { toast.error('Please select an idea'); return }
    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        week1_retention:        parseFloat(formData.week1_retention)        || 0,
        month1_retention:       parseFloat(formData.month1_retention)       || 0,
        month3_retention:       parseFloat(formData.month3_retention)       || 0,
        avg_invites_per_user:   parseFloat(formData.avg_invites_per_user)   || 0,
        invite_conversion_rate: parseFloat(formData.invite_conversion_rate) || 0,
        monthly_active_users:   parseInt(formData.monthly_active_users)     || 0,
      }
      const res = await axiosInstance.post('/api/kpis/submit/', payload)
      setRecords([res.data, ...records])
      setFormData({
        idea_id: '', business_model_type: 'saas', primary_goal: 'growth',
        currently_tracking: '', week1_retention: '', month1_retention: '',
        month3_retention: '', avg_invites_per_user: '',
        invite_conversion_rate: '', monthly_active_users: '',
      })
      setShowForm(false)
      toast.success('KPI analysis complete!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Analysis failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this KPI report?')) return
    try {
      await axiosInstance.delete(`/api/kpis/${id}/`)
      setRecords(records.filter(r => r.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const set = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value })

  const kPreview = formData.avg_invites_per_user && formData.invite_conversion_rate
    ? ((parseFloat(formData.avg_invites_per_user) *
        parseFloat(formData.invite_conversion_rate)) / 100).toFixed(3)
    : null

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2500} />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center
            justify-center">
            <FaBolt className="text-indigo-600 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Startup KPIs</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              North Star · Cohort Retention · Viral Coefficient — AI generated
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5
                     rounded-xl hover:bg-indigo-700 transition text-sm font-medium
                     shadow-sm"
        >
          <FaPlus /> Analyze KPIs
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100
          p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            KPI Analysis
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Enter your metrics — AI will recommend your North Star,
            analyze retention against benchmarks, and calculate your
            viral coefficient.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Select Validated Idea
                </label>
                <select
                  value={formData.idea_id}
                  onChange={set('idea_id')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Business Model
                </label>
                <select
                  value={formData.business_model_type}
                  onChange={set('business_model_type')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  {BUSINESS_MODELS.map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Primary Goal
                </label>
                <select
                  value={formData.primary_goal}
                  onChange={set('primary_goal')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  {PRIMARY_GOALS.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  What are you currently tracking?
                  <span className="text-gray-300 font-normal ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. signups, DAU, revenue, churn rate"
                  value={formData.currently_tracking}
                  onChange={set('currently_tracking')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase
                tracking-wider mb-3 flex items-center gap-2">
                <FaUsers className="text-blue-500" /> Cohort Retention
                <span className="text-gray-300 font-normal normal-case
                  tracking-normal">
                  — enter 0 if no data yet
                </span>
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { field: 'week1_retention',  label: 'Week 1 Retention (%)'  },
                  { field: 'month1_retention', label: 'Month 1 Retention (%)' },
                  { field: 'month3_retention', label: 'Month 3 Retention (%)' },
                ].map(f => (
                  <div key={f.field}>
                    <label className="block text-xs text-gray-500 mb-1.5">
                      {f.label}
                    </label>
                    <input
                      type="number" min="0" max="100"
                      placeholder="e.g. 40"
                      value={formData[f.field]}
                      onChange={set(f.field)}
                      className="w-full border border-gray-300 p-3 rounded-xl
                                 text-sm focus:ring-2 focus:ring-indigo-400
                                 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase
                tracking-wider mb-3 flex items-center gap-2">
                <FaChartBar className="text-emerald-500" /> Viral Coefficient
                <span className="text-gray-300 font-normal normal-case
                  tracking-normal">
                  — enter 0 if no data yet
                </span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Avg Invites per User
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 2.5"
                    value={formData.avg_invites_per_user}
                    onChange={set('avg_invites_per_user')}
                    className="w-full border border-gray-300 p-3 rounded-xl
                               text-sm focus:ring-2 focus:ring-indigo-400
                               focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Invite Conversion Rate (%)
                  </label>
                  <input
                    type="number" min="0" max="100"
                    placeholder="e.g. 20"
                    value={formData.invite_conversion_rate}
                    onChange={set('invite_conversion_rate')}
                    className="w-full border border-gray-300 p-3 rounded-xl
                               text-sm focus:ring-2 focus:ring-indigo-400
                               focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Monthly Active Users
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 150"
                    value={formData.monthly_active_users}
                    onChange={set('monthly_active_users')}
                    className="w-full border border-gray-300 p-3 rounded-xl
                               text-sm focus:ring-2 focus:ring-indigo-400
                               focus:outline-none"
                  />
                </div>
              </div>

              {kPreview && (
                <div className={`mt-3 inline-flex items-center gap-2 px-4 py-2
                  rounded-xl border text-sm font-semibold ${
                  parseFloat(kPreview) >= 1
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : parseFloat(kPreview) >= 0.5
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                      : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <FaBolt />
                  Live K-factor: {kPreview}
                  {parseFloat(kPreview) >= 1
                    ? ' 🚀 Viral!'
                    : parseFloat(kPreview) >= 0.5
                      ? ' 📈 Growing'
                      : ' 🔧 Below 0.5'}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting || ideas.length === 0}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5
                           rounded-xl hover:bg-indigo-700 transition text-sm font-medium
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <><FaSpinner className="animate-spin" /> Analyzing...</>
                  : <><FaBolt /> Analyze KPIs</>
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
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4
                flex items-center gap-3">
                <FaSpinner className="animate-spin text-indigo-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-indigo-700">
                    AI is analyzing your KPIs...
                  </p>
                  <p className="text-xs text-indigo-400 mt-0.5">
                    Recommending North Star, benchmarking retention,
                    calculating viral growth. Takes 15–25 seconds.
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
          <p className="text-sm">Loading KPI reports...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200
                        flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
            <FaBolt className="text-3xl text-indigo-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg">No KPI reports yet</p>
          <p className="text-gray-300 text-sm mt-1 max-w-xs">
            Enter your retention and viral data — AI will find your
            North Star, benchmark retention, and calculate your K-factor.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 bg-indigo-600 text-white
                       px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition
                       text-sm font-medium"
          >
            <FaPlus /> Analyze First KPIs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(rec => (
            <KPICard
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

export default StartupKPIs;
