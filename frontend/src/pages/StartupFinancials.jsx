import React, { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'
import {
  FaChartPie, FaPlus, FaTrash, FaChevronDown, FaChevronUp,
  FaSpinner, FaLightbulb, FaExclamationTriangle, FaArrowRight,
  FaRocket, FaFire, FaCheckCircle
} from 'react-icons/fa'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, PieChart,
  Pie, Cell
} from 'recharts'


const RUNWAY_CONFIG = {
  comfortable:  { label: 'Comfortable 😊',  bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500', months: '18+' },
  healthy:      { label: 'Healthy ✅',       bg: 'bg-green-50',   border: 'border-green-200',   text: 'text-green-700',   bar: 'bg-green-500',   months: '12–18' },
  raising_soon: { label: 'Raise Soon ⚠️',   bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-700',  bar: 'bg-yellow-400',  months: '6–12' },
  urgent:       { label: 'Urgent 🚨',        bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700',  bar: 'bg-orange-500',  months: '3–6' },
  critical:     { label: 'Critical 🔴',      bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700',     bar: 'bg-red-500',     months: '<3' },
}

const FUNDING_VERDICT_CONFIG = {
  well_sized:     { label: 'Well Sized ✅',      bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  slightly_low:   { label: 'Slightly Low ⚠️',   bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-700'  },
  slightly_high:  { label: 'Slightly High ⚠️',  bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-700'  },
  too_low:        { label: 'Too Low ❌',          bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700'     },
  too_high:       { label: 'Too High ⚠️',        bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700'  },
}

const PIE_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b']

const fmt = (n) => {
  if (!n && n !== 0) return '—'
  const num = Number(n)
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`
  if (num >= 100000)   return `₹${(num / 100000).toFixed(1)}L`
  if (num >= 1000)     return `₹${(num / 1000).toFixed(1)}K`
  return `₹${num.toFixed(0)}`
}

// ── Runway Section ─────────────────────────────────────────────────
const RunwaySection = ({ rec }) => {
  const config = RUNWAY_CONFIG[rec.runway_status] || RUNWAY_CONFIG['healthy']
  const months = Math.min(rec.runway_months || 0, 24)
  const pct    = Math.min((months / 24) * 100, 100)

  return (
    <div className="space-y-5">

      {/* Main runway display */}
      <div className={`rounded-xl border p-5 ${config.bg} ${config.border}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${config.text}`}>
              Runway Status
            </p>
            <p className={`text-3xl font-bold mt-1 ${config.text}`}>
              {rec.runway_months >= 999
                ? '∞'
                : `${Number(rec.runway_months).toFixed(1)}`}
              <span className="text-lg font-normal ml-1">months</span>
            </p>
          </div>
          <div className="text-right">
            <span className={`text-sm font-bold px-3 py-1.5 rounded-full
              border ${config.bg} ${config.border} ${config.text}`}>
              {config.label}
            </span>
            {rec.zero_date && rec.runway_months < 999 && (
              <p className={`text-xs mt-2 ${config.text}`}>
                Zero date: <strong>{rec.zero_date}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Bar */}
        {rec.runway_months < 999 && (
          <div className="w-full bg-white bg-opacity-60 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${config.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
        <p className={`text-sm mt-3 leading-relaxed ${config.text} opacity-80`}>
          {rec.runway_summary}
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Cash on Hand',   value: fmt(rec.cash_on_hand),      color: 'text-emerald-600' },
          { label: 'Monthly Burn',   value: fmt(rec.monthly_burn_rate),  color: 'text-red-500'     },
          { label: 'Runway',         value: rec.runway_months >= 999 ? '∞ months' : `${Number(rec.runway_months).toFixed(1)} mo`, color: config.text },
          { label: 'Zero Date',      value: rec.runway_months >= 999 ? 'Never'   : rec.zero_date, color: 'text-gray-600' },
        ].map((m) => (
          <div key={m.label}
            className="bg-white border border-gray-100 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">{m.label}</p>
            <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Scenarios */}
      {rec.runway_scenarios?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            📊 Scenarios
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {rec.runway_scenarios.map((s, i) => (
              <div key={i} className={`rounded-xl border p-4 ${
                i === 0 ? 'bg-gray-50 border-gray-200' :
                i === 1 ? 'bg-emerald-50 border-emerald-200' :
                          'bg-red-50 border-red-200'
              }`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                  i === 0 ? 'text-gray-600' :
                  i === 1 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {s.name}
                </p>
                <p className={`text-2xl font-bold ${
                  i === 0 ? 'text-gray-800' :
                  i === 1 ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {Number(s.runway_months).toFixed(1)}
                  <span className="text-sm font-normal ml-1">mo</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{s.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Burn: {fmt(s.monthly_burn)}/mo
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {rec.runway_recommendations?.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaLightbulb /> How to Extend Runway
          </p>
          <ul className="space-y-2">
            {rec.runway_recommendations.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-blue-400 font-bold shrink-0">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── Projection Section ─────────────────────────────────────────────
const ProjectionSection = ({ rec }) => {
  const [view, setView] = useState('chart')

  // Format monthly data for chart
  const chartData = rec.monthly_projections?.map((m) => ({
    month:    `M${m.month}`,
    Revenue:  Math.round(m.revenue),
    Expenses: Math.round(m.expenses),
    Profit:   Math.round(m.profit),
  })) || []

  // Yearly summary data
  const yearlyData = rec.yearly_projections?.map((y) => ({
    name:     `Year ${y.year}`,
    Revenue:  Math.round(y.total_revenue),
    Expenses: Math.round(y.total_expenses),
    Profit:   Math.round(y.net_profit),
  })) || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {fmt(p.value)}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-700">
            3-Year Financial Projection
          </span>
          {rec.breakeven_month && (
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold
              px-3 py-1 rounded-full">
              Break-even: Month {rec.breakeven_month}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {rec.projection_summary}
        </p>
      </div>

      {/* Yearly Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {rec.yearly_projections?.map((y, i) => (
          <div key={i} className={`rounded-xl border p-4 ${
            y.net_profit >= 0
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              y.net_profit >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              Year {y.year}
            </p>
            <div className="space-y-1.5">
              {[
                { label: 'Revenue',   value: fmt(y.total_revenue),  color: 'text-emerald-700' },
                { label: 'Expenses',  value: fmt(y.total_expenses),  color: 'text-red-600'     },
                { label: 'Net Profit',value: fmt(y.net_profit),      color: y.net_profit >= 0 ? 'text-emerald-800' : 'text-red-700' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-xs text-gray-500">{row.label}</span>
                  <span className={`text-xs font-bold ${row.color}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Chart toggle */}
      <div className="flex gap-2 mb-2">
        {['chart', 'yearly', 'table'].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
              view === v
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {v === 'chart' ? '📈 Monthly Chart'
             : v === 'yearly' ? '📊 Yearly Chart'
             : '📋 Table'}
          </button>
        ))}
      </div>

      {/* Monthly Line Chart */}
      {view === 'chart' && (
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-4">
            Monthly Revenue vs Expenses (36 months)
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10 }}
                interval={5}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => fmt(v)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              {rec.breakeven_month && (
                <ReferenceLine
                  x={`M${rec.breakeven_month}`}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{ value: 'Break-even', fontSize: 10, fill: '#10b981' }}
                />
              )}
              <Line
                type="monotone" dataKey="Revenue"
                stroke="#6366f1" strokeWidth={2} dot={false}
              />
              <Line
                type="monotone" dataKey="Expenses"
                stroke="#ef4444" strokeWidth={2} dot={false}
              />
              <Line
                type="monotone" dataKey="Profit"
                stroke="#10b981" strokeWidth={2} dot={false}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Yearly Bar Chart */}
      {view === 'yearly' && (
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-4">
            Yearly Revenue vs Expenses
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={yearlyData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmt(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="Revenue"  fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Profit"   fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Month', 'Revenue', 'Expenses', 'Profit', 'Cumulative'].map(h => (
                  <th key={h} className="text-left p-3 text-gray-500 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rec.monthly_projections?.map((m, i) => (
                <tr key={i} className={`hover:bg-gray-50 ${
                  m.month === rec.breakeven_month
                    ? 'bg-emerald-50' : ''
                }`}>
                  <td className="p-3 font-medium text-gray-700">
                    M{m.month}
                    {m.month === rec.breakeven_month && (
                      <span className="ml-1 text-emerald-600 text-xs">★</span>
                    )}
                  </td>
                  <td className="p-3 text-emerald-600">{fmt(m.revenue)}</td>
                  <td className="p-3 text-red-500">{fmt(m.expenses)}</td>
                  <td className={`p-3 font-semibold ${
                    m.profit >= 0 ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {fmt(m.profit)}
                  </td>
                  <td className={`p-3 ${
                    m.cumulative_profit >= 0 ? 'text-gray-700' : 'text-red-400'
                  }`}>
                    {fmt(m.cumulative_profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Milestones */}
      {rec.projection_milestones?.length > 0 && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-purple-600 uppercase
            tracking-wider mb-3">
            🏁 Key Milestones
          </p>
          <div className="space-y-2">
            {rec.projection_milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs bg-purple-200 text-purple-700 font-bold
                  px-2 py-0.5 rounded-md shrink-0">
                  M{m.month}
                </span>
                <span className="text-sm text-gray-600">{m.milestone}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks + Assumptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rec.projection_risks?.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              <FaExclamationTriangle /> Projection Risks
            </p>
            <ul className="space-y-1.5">
              {rec.projection_risks.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-red-400 mt-1 shrink-0">•</span>{r}
                </li>
              ))}
            </ul>
          </div>
        )}
        {rec.projection_assumptions?.length > 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase
              tracking-wider mb-3">
              📌 Key Assumptions
            </p>
            <ul className="space-y-1.5">
              {rec.projection_assumptions.map((a, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-gray-400 mt-1 shrink-0">•</span>{a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Funding Section ────────────────────────────────────────────────
const FundingSection = ({ rec }) => {
  const verdict = FUNDING_VERDICT_CONFIG[rec.funding_verdict]
    || FUNDING_VERDICT_CONFIG['well_sized']

  const pieData = [
    { name: 'Product',   value: rec.funds_product_pct   },
    { name: 'Marketing', value: rec.funds_marketing_pct },
    { name: 'Salaries',  value: rec.funds_salaries_pct  },
    { name: 'Ops',       value: rec.funds_ops_pct       },
  ]

  const CustomLabel = ({ cx, cy, midAngle, innerRadius,
                          outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
      <text x={x} y={y} fill="white" textAnchor="middle"
        dominantBaseline="central" fontSize={11} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-5">

      {/* Verdict */}
      <div className={`rounded-xl border p-4 ${verdict.bg} ${verdict.border}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-semibold uppercase tracking-wider ${verdict.text}`}>
            Funding Assessment
          </span>
          <span className={`text-sm font-bold px-3 py-1 rounded-full border
            ${verdict.bg} ${verdict.border} ${verdict.text}`}>
            {verdict.label}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {rec.funding_summary}
        </p>
      </div>

      {/* Score + key numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: 'Target Raise',
            value: fmt(rec.funding_amount_target),
            color: 'text-indigo-600',
          },
          {
            label: 'Runway Extended',
            value: rec.runway_extended_months
              ? `+${Number(rec.runway_extended_months).toFixed(1)} mo`
              : '—',
            color: 'text-emerald-600',
          },
          {
            label: 'Funding Score',
            value: rec.funding_score ? `${rec.funding_score}/100` : '—',
            color: rec.funding_score >= 70 ? 'text-emerald-600'
                 : rec.funding_score >= 50 ? 'text-yellow-600' : 'text-red-500',
          },
        ].map((m) => (
          <div key={m.label}
            className="bg-white border border-gray-100 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">{m.label}</p>
            <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Use of Funds — Pie + breakdown */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase
          tracking-wider mb-4">
          💰 Use of Funds
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-6">

          {/* Pie */}
          <div className="shrink-0">
            <PieChart width={180} height={180}>
              <Pie
                data={pieData}
                cx={85} cy={85}
                innerRadius={45}
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={<CustomLabel />}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>

          {/* Legend + amounts */}
          <div className="flex-1 space-y-3 w-full">
            {pieData.map((item, i) => {
              const amount = (Number(rec.funding_amount_target) * item.value) / 100
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: PIE_COLORS[i] }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {item.value}% · {fmt(amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${item.value}%`,
                          background: PIE_COLORS[i],
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {rec.use_of_funds_analysis && (
          <p className="text-sm text-gray-500 leading-relaxed mt-4 pt-4
            border-t border-gray-100">
            {rec.use_of_funds_analysis}
          </p>
        )}
      </div>

      {/* Valuation Context */}
      {rec.valuation_context && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-600 uppercase
            tracking-wider mb-2">
            📐 Valuation Context
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {rec.valuation_context}
          </p>
        </div>
      )}

      {/* Milestones + Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rec.funding_milestones?.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              <FaCheckCircle /> Milestones Unlocked
            </p>
            <ul className="space-y-2">
              {rec.funding_milestones.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-emerald-400 mt-1 shrink-0">→</span>{m}
                </li>
              ))}
            </ul>
          </div>
        )}
        {rec.funding_tips?.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              <FaLightbulb /> Fundraising Tips
            </p>
            <ul className="space-y-2">
              {rec.funding_tips.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-blue-400 font-bold shrink-0">{i + 1}.</span>
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

// ── Full Report Card ───────────────────────────────────────────────
const FinancialsCard = ({ rec, onDelete }) => {
  const [expanded, setExpanded]   = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const TABS = ['Runway', '3-Year Projection', 'Funding']
  const runwayConfig = RUNWAY_CONFIG[rec.runway_status] || RUNWAY_CONFIG['healthy']

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Header */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
          shrink-0 ${runwayConfig.bg}`}>
          <FaChartPie className={`text-sm ${runwayConfig.text}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{rec.idea_title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Burn: {fmt(rec.monthly_burn_rate)}/mo
            {' · '}Raise: {fmt(rec.funding_amount_target)}
          </p>
        </div>

        {/* Runway badge */}
        {rec.runway_months != null && (
          <span className={`hidden sm:block text-xs font-semibold px-3 py-1.5
            rounded-full border ${runwayConfig.bg} ${runwayConfig.border}
            ${runwayConfig.text}`}>
            {rec.runway_months >= 999
              ? '∞ runway'
              : `${Number(rec.runway_months).toFixed(1)}mo runway`}
          </span>
        )}

        {/* Breakeven badge */}
        {rec.breakeven_month && (
          <span className="hidden sm:block text-xs font-semibold px-3 py-1.5
            rounded-full bg-purple-50 border border-purple-200 text-purple-600">
            Break-even M{rec.breakeven_month}
          </span>
        )}

        {/* Status */}
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

      {/* Body */}
      {expanded && rec.status === 'done' && (
        <div className="border-t border-gray-100">

          {/* Tabs */}
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
            {activeTab === 0 && <RunwaySection rec={rec} />}
            {activeTab === 1 && <ProjectionSection rec={rec} />}
            {activeTab === 2 && <FundingSection rec={rec} />}
          </div>
        </div>
      )}

      {/* Failed */}
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

// ── Main Component ─────────────────────────────────────────────────
const StartupFinancials = () => {
  const [records, setRecords]       = useState([])
  const [ideas, setIdeas]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData]     = useState({
    idea_id:                  '',
    cash_on_hand:             '',
    monthly_burn_rate:        '',
    starting_monthly_revenue: '',
    monthly_revenue_growth:   '',
    current_monthly_expenses: '',
    expense_growth_rate:      '',
    funding_amount_target:    '',
    funds_product_pct:        '40',
    funds_marketing_pct:      '30',
    funds_salaries_pct:       '20',
    funds_ops_pct:            '10',
    funding_milestone:        '',
  })

  useEffect(() => {
    Promise.all([fetchRecords(), fetchIdeas()])
      .finally(() => setLoading(false))
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get('/api/financials/')
      setRecords(res.data)
    } catch {
      toast.error('Failed to load financials')
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

  // Auto-balance use of funds to 100%
  const handleFundsPct = (field, value) => {
    const val = parseFloat(value) || 0
    const others = {
      funds_product_pct:   parseFloat(formData.funds_product_pct)   || 0,
      funds_marketing_pct: parseFloat(formData.funds_marketing_pct) || 0,
      funds_salaries_pct:  parseFloat(formData.funds_salaries_pct)  || 0,
      funds_ops_pct:       parseFloat(formData.funds_ops_pct)       || 0,
    }
    others[field] = val
    const total = Object.values(others).reduce((a, b) => a + b, 0)
    setFormData({ ...formData, [field]: value, _pctTotal: total })
  }

  const pctTotal = ['funds_product_pct', 'funds_marketing_pct',
                     'funds_salaries_pct', 'funds_ops_pct']
    .reduce((sum, k) => sum + (parseFloat(formData[k]) || 0), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.idea_id) { toast.error('Please select an idea'); return }
    if (Math.abs(pctTotal - 100) > 0.1) {
      toast.error(`Use of funds must total 100% (currently ${pctTotal}%)`)
      return
    }
    setSubmitting(true)
    try {
      const res = await axiosInstance.post(
        '/api/financials/submit/', formData
      )
      setRecords([res.data, ...records])
      setFormData({
        idea_id: '', cash_on_hand: '', monthly_burn_rate: '',
        starting_monthly_revenue: '', monthly_revenue_growth: '',
        current_monthly_expenses: '', expense_growth_rate: '',
        funding_amount_target: '', funds_product_pct: '40',
        funds_marketing_pct: '30', funds_salaries_pct: '20',
        funds_ops_pct: '10', funding_milestone: '',
      })
      setShowForm(false)
      toast.success('Financial analysis complete!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Analysis failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this financial report?')) return
    try {
      await axiosInstance.delete(`/api/financials/${id}/`)
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

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center
            justify-center">
            <FaChartPie className="text-indigo-600 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Startup Financials</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Runway · 3-Year Projection · Funding Requirements — AI generated
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5
                     rounded-xl hover:bg-indigo-700 transition text-sm font-medium
                     shadow-sm"
        >
          <FaPlus /> Analyze Financials
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100
          p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Financial Analysis
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Enter your financial details — AI will calculate runway,
            project 3-year growth, and analyze your funding requirements.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Idea */}
            <div>
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

            {/* Runway */}
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase
                tracking-wider mb-3 flex items-center gap-2">
                <FaFire className="text-red-400" /> Runway
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Cash on Hand (₹)
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 500000"
                    value={formData.cash_on_hand}
                    onChange={set('cash_on_hand')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Monthly Burn Rate (₹)
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 80000"
                    value={formData.monthly_burn_rate}
                    onChange={set('monthly_burn_rate')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Projection */}
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase
                tracking-wider mb-3 flex items-center gap-2">
                <FaRocket className="text-indigo-400" /> 3-Year Projection
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Starting Monthly Revenue (₹)
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 20000"
                    value={formData.starting_monthly_revenue}
                    onChange={set('starting_monthly_revenue')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Monthly Revenue Growth (%)
                  </label>
                  <input
                    type="number" min="0" max="200"
                    placeholder="e.g. 15"
                    value={formData.monthly_revenue_growth}
                    onChange={set('monthly_revenue_growth')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Current Monthly Expenses (₹)
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 80000"
                    value={formData.current_monthly_expenses}
                    onChange={set('current_monthly_expenses')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Monthly Expense Growth (%)
                  </label>
                  <input
                    type="number" min="0" max="100"
                    placeholder="e.g. 5"
                    value={formData.expense_growth_rate}
                    onChange={set('expense_growth_rate')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Funding */}
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase
                tracking-wider mb-3 flex items-center gap-2">
                <FaArrowRight className="text-emerald-500" /> Funding Requirements
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Amount to Raise (₹)
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 2000000"
                    value={formData.funding_amount_target}
                    onChange={set('funding_amount_target')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Use of funds */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500 font-medium">
                      Use of Funds (must total 100%)
                    </label>
                    <span className={`text-xs font-bold ${
                      Math.abs(pctTotal - 100) < 0.1
                        ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      Total: {pctTotal}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { field: 'funds_product_pct',   label: '🛠 Product'   },
                      { field: 'funds_marketing_pct', label: '📢 Marketing' },
                      { field: 'funds_salaries_pct',  label: '👥 Salaries'  },
                      { field: 'funds_ops_pct',       label: '⚙️ Ops'       },
                    ].map((f) => (
                      <div key={f.field}>
                        <label className="block text-xs text-gray-400 mb-1">
                          {f.label}
                        </label>
                        <div className="relative">
                          <input
                            type="number" min="0" max="100"
                            value={formData[f.field]}
                            onChange={(e) =>
                              handleFundsPct(f.field, e.target.value)
                            }
                            className="w-full border border-gray-300 p-2.5 pr-7
                              rounded-xl text-sm focus:ring-2 focus:ring-indigo-400
                              focus:outline-none"
                          />
                          <span className="absolute right-2.5 top-2.5 text-xs
                            text-gray-400">
                            %
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Target Milestone
                    <span className="text-gray-300 font-normal ml-1">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Reach ₹1L MRR and 100 paying customers"
                    value={formData.funding_milestone}
                    onChange={set('funding_milestone')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
              </div>
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
                  : <><FaChartPie /> Analyze Financials</>
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
                    AI is crunching your numbers...
                  </p>
                  <p className="text-xs text-indigo-400 mt-0.5">
                    Calculating runway, 36-month projections and funding analysis.
                    This takes 20–30 seconds.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Records List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <FaSpinner className="animate-spin text-2xl mx-auto mb-3" />
          <p className="text-sm">Loading financials...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200
                        flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
            <FaChartPie className="text-3xl text-indigo-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg">No financial reports yet</p>
          <p className="text-gray-300 text-sm mt-1 max-w-xs">
            Enter your numbers — AI will calculate runway, project 3 years
            of growth and analyze your funding requirements.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 bg-indigo-600 text-white
                       px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition
                       text-sm font-medium"
          >
            <FaPlus /> Analyze First Financials
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(rec => (
            <FinancialsCard
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

export default StartupFinancials;