import React, { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'
import {
  FaUsers, FaPlus, FaTrash, FaChevronDown, FaChevronUp,
  FaSpinner, FaLightbulb, FaExclamationTriangle, FaCheckCircle,
  FaTimes, FaUserTie, FaHandshake, FaStar, FaArrowRight
} from 'react-icons/fa'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'


const WORK_MODES = [
  { value: 'remote', label: '🌐 Fully Remote' },
  { value: 'office', label: '🏢 In-Office' },
  { value: 'hybrid', label: '🔀 Hybrid' },
]

const TEAM_VERDICT_CONFIG = {
  strong: { label: 'Strong ✅', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  good: { label: 'Good ✅', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  adequate: { label: 'Adequate ⚠️', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  weak: { label: 'Weak ❌', bg: 'bg-orange-50', border: 'border-orange-200',  text: 'text-orange-700' },
  critical: { label: 'Critical 🔴', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
}

const GAP_CONFIG = {
  critical: { bg: 'bg-red-100', text: 'text-red-700' },
  important: { bg: 'bg-orange-100', text: 'text-orange-700' },
  minor: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
}

const PRIORITY_CONFIG = {
  critical: { bg: 'bg-red-100', text: 'text-red-700' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-700' },
}

const URGENCY_CONFIG = {
  immediate: { bg: 'bg-red-100', text: 'text-red-700', label: 'Immediate' },
  within_month: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Within Month' },
  within_quarter: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'This Quarter' },
}

const EQUITY_COLORS = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6']

const fmt = (n) => {
  if (!n && n !== 0) return '—'
  const num = Number(n)
  if (num >= 10000000) return `₹${(num/10000000).toFixed(1)}Cr`
  if (num >= 100000) return `₹${(num/100000).toFixed(1)}L`
  if (num >= 1000) return `₹${(num/1000).toFixed(1)}K`
  return `₹${num.toFixed(0)}`
}


const FoundingTeamTab = ({ rec }) => {
  const [openRisk, setOpenRisk] = useState(null)
  const verdict = TEAM_VERDICT_CONFIG[rec.team_verdict]
    || TEAM_VERDICT_CONFIG['adequate']

  const pieData = rec.founders?.map(f => ({
    name:  f.name || 'Founder',
    value: f.equity_pct || 0,
  })) || []

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-gray-500">{payload[0].value}% equity</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">


      <div className={`rounded-xl border p-4 ${verdict.bg} ${verdict.border}`}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider
            ${verdict.text}`}>
            Team Assessment
          </span>
          <div className="flex items-center gap-3">
            {rec.team_score != null && (
              <span className={`text-lg font-bold ${verdict.text}`}>
                {rec.team_score}/100
              </span>
            )}
            <span className={`text-xs font-bold px-3 py-1 rounded-full border
              ${verdict.bg} ${verdict.border} ${verdict.text}`}>
              {verdict.label}
            </span>
          </div>
        </div>
        {rec.team_score != null && (
          <div className="w-full bg-white bg-opacity-60 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                rec.team_score >= 70 ? 'bg-emerald-500' :
                rec.team_score >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${rec.team_score}%` }}
            />
          </div>
        )}
        <p className="text-sm text-gray-600 leading-relaxed">{rec.team_summary}</p>
      </div>


      {rec.founders?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-4">
            👥 Founding Team
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Pie */}
            <div className="shrink-0 flex flex-col items-center">
              <PieChart width={160} height={160}>
                <Pie
                  data={pieData}
                  cx={75} cy={75}
                  innerRadius={40}
                  outerRadius={72}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={EQUITY_COLORS[i % EQUITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
              <p className="text-xs text-gray-400 mt-1">Equity Split</p>
            </div>

            {/* Founder list */}
            <div className="flex-1 space-y-3">
              {rec.founders.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center
                      text-white font-bold text-sm shrink-0"
                    style={{ background: EQUITY_COLORS[i % EQUITY_COLORS.length] }}
                  >
                    {(f.name || 'F')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800">
                        {f.name}
                      </p>
                      <span className="text-xs bg-gray-100 text-gray-600
                        px-2 py-0.5 rounded-full">
                        {f.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {f.background}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold"
                      style={{ color: EQUITY_COLORS[i % EQUITY_COLORS.length] }}>
                      {f.equity_pct}%
                    </p>
                    <p className="text-xs text-gray-400">equity</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {rec.skills_gap_analysis?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            🎯 Skills Gap Analysis
          </p>
          <div className="space-y-2">
            {rec.skills_gap_analysis.map((gap, i) => {
              const cfg = GAP_CONFIG[gap.gap_level] || GAP_CONFIG['minor']
              return (
                <div key={i}
                  className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-semibold text-gray-800 flex-1">
                      {gap.skill_area}
                    </p>
                    <span className={`text-xs font-medium px-2.5 py-0.5
                      rounded-full ${cfg.bg} ${cfg.text}`}>
                      {gap.gap_level}
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-600
                      border border-blue-100 px-2.5 py-0.5 rounded-full">
                      {gap.how_to_fill}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{gap.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rec.equity_assessment && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-indigo-600 uppercase
              tracking-wider mb-2">
              💰 Equity Assessment
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {rec.equity_assessment}
            </p>
          </div>
        )}
        {rec.vesting_recommendation && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-600 uppercase
              tracking-wider mb-2">
              📅 Vesting Recommendation
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {rec.vesting_recommendation}
            </p>
          </div>
        )}
      </div>


      {rec.conflict_risks?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaExclamationTriangle className="text-orange-500" />
            Co-founder Conflict Risks
          </p>
          <div className="space-y-2">
            {rec.conflict_risks.map((r, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenRisk(openRisk === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4
                    hover:bg-gray-50 transition text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {r.risk}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5
                    rounded-full shrink-0 ${
                    r.probability === 'high'
                      ? 'bg-red-100 text-red-700'
                      : r.probability === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {r.probability}
                  </span>
                  {openRisk === i
                    ? <FaChevronUp className="text-gray-300 shrink-0" />
                    : <FaChevronDown className="text-gray-300 shrink-0" />
                  }
                </button>
                {openRisk === i && (
                  <div className="border-t border-gray-100 p-4">
                    <p className="text-xs font-semibold text-emerald-600 mb-1">
                      ✅ Prevention
                    </p>
                    <p className="text-sm text-gray-600">{r.prevention}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {rec.founder_agreements?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            📄 Required Documents
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rec.founder_agreements.map((doc, i) => {
              const urgency = URGENCY_CONFIG[doc.urgency]
                || URGENCY_CONFIG['within_quarter']
              return (
                <div key={i}
                  className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {doc.document}
                    </p>
                    <span className={`text-xs font-medium px-2 py-0.5
                      rounded-full shrink-0 ${urgency.bg} ${urgency.text}`}>
                      {urgency.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{doc.purpose}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}


      {rec.team_recommendations?.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaLightbulb /> Team Recommendations
          </p>
          <ul className="space-y-2">
            {rec.team_recommendations.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-blue-400 font-bold shrink-0">{i+1}.</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


const HiringPlanTab = ({ rec }) => {
  const [openRole, setOpenRole] = useState(null)
  const [openChannel, setOpenChannel] = useState(null)
  const [openValue, setOpenValue] = useState(null)

  return (
    <div className="space-y-5">


      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-700">
            Hiring Plan Assessment
          </span>
          {rec.hiring_score != null && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              rec.hiring_score >= 70
                ? 'bg-emerald-100 text-emerald-700'
                : rec.hiring_score >= 50
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            }`}>
              Score: {rec.hiring_score}/100
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {rec.hiring_summary}
        </p>
      </div>


      {rec.hiring_roadmap?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaUserTie className="text-purple-500" /> Hiring Roadmap
          </p>
          <div className="space-y-2">
            {rec.hiring_roadmap
              .sort((a, b) => a.hire_by_month - b.hire_by_month)
              .map((role, i) => {
                const pCfg = PRIORITY_CONFIG[role.priority]
                  || PRIORITY_CONFIG['medium']
                return (
                  <div key={i}
                    className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenRole(openRole === i ? null : i)}
                      className="w-full flex items-center gap-3 p-4
                        hover:bg-gray-50 transition text-left"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-xl
                        flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-purple-700">
                          M{role.hire_by_month}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-800">
                            {role.role}
                          </p>
                          <span className={`text-xs font-medium px-2 py-0.5
                            rounded-full ${pCfg.bg} ${pCfg.text}`}>
                            {role.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {role.why_now}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-700">
                          {fmt(role.monthly_cost)}/mo
                        </p>
                      </div>
                      {openRole === i
                        ? <FaChevronUp className="text-gray-300 shrink-0" />
                        : <FaChevronDown className="text-gray-300 shrink-0" />
                      }
                    </button>
                    {openRole === i && (
                      <div className="border-t border-gray-100 p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {role.green_flags?.length > 0 && (
                            <div className="bg-emerald-50 border border-emerald-100
                              rounded-xl p-3">
                              <p className="text-xs font-semibold text-emerald-600 mb-2">
                                ✅ Green Flags
                              </p>
                              <ul className="space-y-1">
                                {role.green_flags.map((g, j) => (
                                  <li key={j} className="text-xs text-gray-600
                                    flex gap-1.5">
                                    <span className="text-emerald-400 mt-0.5">•</span>
                                    {g}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {role.red_flags?.length > 0 && (
                            <div className="bg-red-50 border border-red-100
                              rounded-xl p-3">
                              <p className="text-xs font-semibold text-red-600 mb-2">
                                🚩 Red Flags
                              </p>
                              <ul className="space-y-1">
                                {role.red_flags.map((r, j) => (
                                  <li key={j} className="text-xs text-gray-600
                                    flex gap-1.5">
                                    <span className="text-red-400 mt-0.5">•</span>
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>Where to find:</span>
                          <span className="text-gray-600 font-medium">
                            {role.where_to_find}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      )}


      {rec.compensation_benchmarks?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            💰 Compensation Benchmarks (India)
          </p>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Role', 'Salary Range', 'Equity', 'Stage'].map(h => (
                    <th key={h} className="text-left p-3 text-gray-500
                      font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rec.compensation_benchmarks.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-700">{b.role}</td>
                    <td className="p-3 text-emerald-600 font-medium">
                      {b.salary_range}
                    </td>
                    <td className="p-3 text-purple-600">{b.equity_range}</td>
                    <td className="p-3 text-gray-400">{b.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {rec.culture_values?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaStar className="text-yellow-500" /> Culture Values
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rec.culture_values.map((v, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenValue(openValue === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4
                    hover:bg-gray-50 transition text-left"
                >
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center
                    justify-center shrink-0">
                    <FaStar className="text-yellow-500 text-xs" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 flex-1">
                    {v.value}
                  </p>
                  {openValue === i
                    ? <FaChevronUp className="text-gray-300 text-xs shrink-0" />
                    : <FaChevronDown className="text-gray-300 text-xs shrink-0" />
                  }
                </button>
                {openValue === i && (
                  <div className="border-t border-gray-100 p-4 space-y-2">
                    <p className="text-xs text-gray-600">{v.description}</p>
                    {v.how_to_hire_for && (
                      <div className="bg-blue-50 border border-blue-100
                        rounded-lg p-2">
                        <p className="text-xs font-semibold text-blue-600 mb-1">
                          🎯 Interview Signal
                        </p>
                        <p className="text-xs text-gray-600">{v.how_to_hire_for}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {rec.recruitment_channels?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            📡 Recruitment Channels
          </p>
          <div className="space-y-2">
            {rec.recruitment_channels.map((ch, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenChannel(openChannel === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4
                    hover:bg-gray-50 transition text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {ch.channel}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Best for: {ch.best_for}
                    </p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600
                    px-2 py-0.5 rounded-full shrink-0">
                    {ch.cost}
                  </span>
                  {openChannel === i
                    ? <FaChevronUp className="text-gray-300 shrink-0" />
                    : <FaChevronDown className="text-gray-300 shrink-0" />
                  }
                </button>
                {openChannel === i && (
                  <div className="border-t border-gray-100 p-4">
                    <p className="text-xs text-gray-600">{ch.tip}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rec.first_10_guide?.length > 0 && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-600 uppercase
              tracking-wider mb-3">
              🔟 First 10 Employees Guide
            </p>
            <ul className="space-y-2">
              {rec.first_10_guide.map((g, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-purple-400 shrink-0 mt-0.5" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}
        {rec.hiring_mistakes?.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              <FaExclamationTriangle /> Hiring Mistakes to Avoid
            </p>
            <ul className="space-y-2">
              {rec.hiring_mistakes.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-red-400 mt-1 shrink-0">•</span>{m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}


const AdvisoryTab = ({ rec }) => {
  const [openAdvisor, setOpenAdvisor] = useState(null)
  const [openSource, setOpenSource] = useState(null)
  const [copied, setCopied] = useState(false)

  const copyOutreach = () => {
    navigator.clipboard.writeText(rec.outreach_approach)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">


      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-700">
            Advisory Board Assessment
          </span>
          {rec.advisory_score != null && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              rec.advisory_score >= 70
                ? 'bg-emerald-100 text-emerald-700'
                : rec.advisory_score >= 50
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            }`}>
              Score: {rec.advisory_score}/100
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {rec.advisory_summary}
        </p>
      </div>


      {rec.ideal_advisors?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaHandshake className="text-teal-500" />
            Ideal Advisor Profiles
          </p>
          <div className="space-y-2">
            {rec.ideal_advisors.map((adv, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenAdvisor(openAdvisor === i ? null : i)}
                  className="w-full flex items-center gap-4 p-4
                    hover:bg-gray-50 transition text-left"
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center
                    justify-center shrink-0">
                    <FaUserTie className="text-teal-600 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {adv.advisor_type}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {adv.why_needed}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-teal-600">
                      {adv.equity_suggested}
                    </p>
                    <p className="text-xs text-gray-400">{adv.commitment}</p>
                  </div>
                  {openAdvisor === i
                    ? <FaChevronUp className="text-gray-300 shrink-0" />
                    : <FaChevronDown className="text-gray-300 shrink-0" />
                  }
                </button>
                {openAdvisor === i && (
                  <div className="border-t border-gray-100 p-4 space-y-3">
                    <div className="bg-teal-50 border border-teal-100
                      rounded-xl p-3">
                      <p className="text-xs font-semibold text-teal-600 mb-1">
                        🎯 Why Needed
                      </p>
                      <p className="text-sm text-gray-600">{adv.why_needed}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-1">
                        Look for this background:
                      </p>
                      <p className="text-sm text-gray-600">{adv.profile}</p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="bg-teal-50 text-teal-700 border
                        border-teal-100 px-2.5 py-1 rounded-full font-medium">
                        Equity: {adv.equity_suggested}
                      </span>
                      <span className="bg-gray-50 text-gray-600 border
                        border-gray-200 px-2.5 py-1 rounded-full">
                        {adv.commitment}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {rec.advisor_equity_guide && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-600 uppercase
            tracking-wider mb-2">
            💰 Advisor Equity Guide
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {rec.advisor_equity_guide}
          </p>
        </div>
      )}


      {rec.where_to_find?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            🔍 Where to Find Advisors
          </p>
          <div className="space-y-2">
            {rec.where_to_find.map((src, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenSource(openSource === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4
                    hover:bg-gray-50 transition text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {src.source}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Best for: {src.best_for}
                    </p>
                  </div>
                  {openSource === i
                    ? <FaChevronUp className="text-gray-300 shrink-0" />
                    : <FaChevronDown className="text-gray-300 shrink-0" />
                  }
                </button>
                {openSource === i && (
                  <div className="border-t border-gray-100 p-4">
                    <p className="text-sm text-gray-600">{src.approach}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {rec.outreach_approach && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3
            border-b border-gray-200 bg-white">
            <p className="text-xs font-semibold text-gray-600">
              📬 Advisor Outreach Template
            </p>
            <button
              onClick={copyOutreach}
              className="text-xs text-indigo-600 hover:text-indigo-800
                font-medium transition"
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <pre className="p-4 text-xs text-gray-700 leading-relaxed
            whitespace-pre-wrap font-sans">
            {rec.outreach_approach}
          </pre>
        </div>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rec.meeting_cadence && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase
              tracking-wider mb-2">
              📅 Meeting Cadence
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {rec.meeting_cadence}
            </p>
          </div>
        )}
        {rec.advisor_red_flags?.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              🚩 Advisor Red Flags
            </p>
            <ul className="space-y-2">
              {rec.advisor_red_flags.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-red-400 mt-1 shrink-0">•</span>{f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}


const TeamCard = ({ rec, onDelete }) => {
  const [expanded, setExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const TABS = ['Founding Team', 'Hiring Plan', 'Advisory Board']
  const verdict = TEAM_VERDICT_CONFIG[rec.team_verdict]
    || TEAM_VERDICT_CONFIG['adequate']

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">


      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
          shrink-0 ${verdict.bg}`}>
          <FaUsers className={`text-sm ${verdict.text}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{rec.idea_title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {rec.founders?.length || 0} founder{rec.founders?.length !== 1 ? 's' : ''}
            {' · '}{rec.current_team_size} team
            {' · '}{WORK_MODES.find(w => w.value === rec.work_mode)?.label}
          </p>
        </div>


        {rec.team_score != null && (
          <div className={`text-center px-3 py-1.5 rounded-full border
            ${verdict.bg} ${verdict.border}`}>
            <span className={`text-base font-bold ${verdict.text}`}>
              {rec.team_score}
            </span>
            <span className={`text-xs ml-0.5 ${verdict.text}`}>/100</span>
          </div>
        )}


        <span className={`hidden sm:block text-xs font-semibold px-3 py-1.5
          rounded-full border ${verdict.bg} ${verdict.border} ${verdict.text}`}>
          {verdict.label}
        </span>

        
        <span className="hidden sm:block text-xs font-semibold px-3 py-1.5
          rounded-full bg-purple-50 border border-purple-200 text-purple-600">
          {fmt(rec.hiring_budget_12m)}/12mo
        </span>


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
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === 0 && <FoundingTeamTab rec={rec} />}
            {activeTab === 1 && <HiringPlanTab rec={rec} />}
            {activeTab === 2 && <AdvisoryTab rec={rec} />}
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


const FounderRow = ({ founder, index, onChange, onRemove, canRemove }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-gray-500">
        Founder {index + 1}
      </span>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-300 hover:text-red-400 transition"
        >
          <FaTimes className="text-xs" />
        </button>
      )}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Name</label>
        <input
          type="text"
          placeholder="Full name"
          value={founder.name}
          onChange={e => onChange({ ...founder, name: e.target.value })}
          className="w-full border border-gray-200 p-2 rounded-lg text-xs
                     focus:ring-2 focus:ring-purple-300 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Role</label>
        <input
          type="text"
          placeholder="e.g. CEO, CTO"
          value={founder.role}
          onChange={e => onChange({ ...founder, role: e.target.value })}
          className="w-full border border-gray-200 p-2 rounded-lg text-xs
                     focus:ring-2 focus:ring-purple-300 focus:outline-none"
        />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-xs text-gray-400 mb-1">Background</label>
        <input
          type="text"
          placeholder="e.g. 5 years in F&B, ex-Zomato"
          value={founder.background}
          onChange={e => onChange({ ...founder, background: e.target.value })}
          className="w-full border border-gray-200 p-2 rounded-lg text-xs
                     focus:ring-2 focus:ring-purple-300 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Equity %</label>
        <input
          type="number"
          min="0" max="100"
          placeholder="e.g. 50"
          value={founder.equity_pct}
          onChange={e => onChange({
            ...founder, equity_pct: parseFloat(e.target.value) || 0
          })}
          className="w-full border border-gray-200 p-2 rounded-lg text-xs
                     focus:ring-2 focus:ring-purple-300 focus:outline-none"
        />
      </div>
    </div>
  </div>
)


const TeamCulture = () => {
  const [records, setRecords] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    idea_id: '',
    is_solo_founder:   false,
    founders: [{ name: '', role: '', background: '', equity_pct: 100 }],
    current_team_size: '1',
    hiring_budget_12m: '',
    priority_roles: '',
    work_mode: 'hybrid',
    current_advisors: '',
    expertise_gaps: '',
  })

  useEffect(() => {
    Promise.all([fetchRecords(), fetchIdeas()])
      .finally(() => setLoading(false))
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get('/api/team/')
      setRecords(res.data)
    } catch {
      toast.error('Failed to load team reports')
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

  const addFounder = () => {
    setFormData({
      ...formData,
      founders: [
        ...formData.founders,
        { name: '', role: '', background: '', equity_pct: 0 }
      ]
    })
  }

  const updateFounder = (i, updated) => {
    const founders = [...formData.founders]
    founders[i] = updated
    setFormData({ ...formData, founders })
  }

  const removeFounder = (i) => {
    setFormData({
      ...formData,
      founders: formData.founders.filter((_, idx) => idx !== i)
    })
  }


  const totalEquity = formData.founders.reduce(
    (sum, f) => sum + (parseFloat(f.equity_pct) || 0), 0
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.idea_id) { toast.error('Please select an idea'); return }
    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        current_team_size: parseInt(formData.current_team_size) || 1,
      }
      const res = await axiosInstance.post('/api/team/submit/', payload)
      setRecords([res.data, ...records])
      setFormData({
        idea_id: '', is_solo_founder: false,
        founders: [{ name: '', role: '', background: '', equity_pct: 100 }],
        current_team_size: '1', hiring_budget_12m: '',
        priority_roles: '', work_mode: 'hybrid',
        current_advisors: '', expertise_gaps: '',
      })
      setShowForm(false)
      toast.success('Team analysis complete!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Analysis failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team report?')) return
    try {
      await axiosInstance.delete(`/api/team/${id}/`)
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
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center
            justify-center">
            <FaUsers className="text-purple-600 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Team & Culture</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Founding Team · Hiring Plan · Advisory Board — AI generated
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5
                     rounded-xl hover:bg-purple-700 transition text-sm font-medium
                     shadow-sm"
        >
          <FaPlus /> Analyze Team
        </button>
      </div>


      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100
          p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Team & Culture Analysis
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Enter your team details — AI will analyze your founding team,
            build a hiring roadmap, and recommend your advisory board.
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
                           focus:ring-2 focus:ring-purple-400 focus:outline-none"
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
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-600 uppercase
                  tracking-wider flex items-center gap-2">
                  <FaUsers className="text-purple-500" /> Founding Team
                </p>
                <label className="flex items-center gap-2 text-xs text-gray-500
                  cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_solo_founder}
                    onChange={e => setFormData({
                      ...formData,
                      is_solo_founder: e.target.checked
                    })}
                    className="accent-purple-600 w-3.5 h-3.5"
                  />
                  Solo founder
                </label>
              </div>

              <div className="space-y-3">
                {formData.founders.map((founder, i) => (
                  <FounderRow
                    key={i}
                    founder={founder}
                    index={i}
                    onChange={(updated) => updateFounder(i, updated)}
                    onRemove={() => removeFounder(i)}
                    canRemove={formData.founders.length > 1}
                  />
                ))}
              </div>


              <div className={`mt-3 flex items-center gap-2 text-xs font-medium ${
                Math.abs(totalEquity - 100) < 0.1
                  ? 'text-emerald-600' : 'text-orange-500'
              }`}>
                <span>Total equity: {totalEquity}%</span>
                {Math.abs(totalEquity - 100) < 0.1
                  ? <span>✅ Adds up to 100%</span>
                  : <span>⚠️ Should total 100%</span>
                }
              </div>

              {!formData.is_solo_founder && formData.founders.length < 4 && (
                <button
                  type="button"
                  onClick={addFounder}
                  className="mt-3 flex items-center gap-2 text-xs text-purple-600
                    hover:text-purple-800 font-medium transition"
                >
                  <FaPlus /> Add Co-founder
                </button>
              )}
            </div>


            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase
                tracking-wider mb-3 flex items-center gap-2">
                <FaArrowRight className="text-blue-500" /> Hiring Plan
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Current Team Size
                  </label>
                  <input
                    type="number" min="1"
                    placeholder="e.g. 2"
                    value={formData.current_team_size}
                    onChange={set('current_team_size')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    12-Month Hiring Budget (₹)
                  </label>
                  <input
                    type="number" min="0"
                    placeholder="e.g. 3600000"
                    value={formData.hiring_budget_12m}
                    onChange={set('hiring_budget_12m')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Priority Roles to Hire
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sales lead, Backend engineer, Customer success"
                    value={formData.priority_roles}
                    onChange={set('priority_roles')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Work Mode
                  </label>
                  <select
                    value={formData.work_mode}
                    onChange={set('work_mode')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  >
                    {WORK_MODES.map(w => (
                      <option key={w.value} value={w.value}>{w.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>


            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase
                tracking-wider mb-3 flex items-center gap-2">
                <FaHandshake className="text-teal-500" /> Advisory Board
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Current Advisors
                    <span className="text-gray-300 font-normal ml-1">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. None / John from IIT alumni network"
                    value={formData.current_advisors}
                    onChange={set('current_advisors')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Key Expertise Gaps
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Marketing, fundraising, enterprise sales"
                    value={formData.expertise_gaps}
                    onChange={set('expertise_gaps')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting || ideas.length === 0}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5
                           rounded-xl hover:bg-purple-700 transition text-sm font-medium
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <><FaSpinner className="animate-spin" /> Analyzing...</>
                  : <><FaUsers /> Analyze Team</>
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
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4
                flex items-center gap-3">
                <FaSpinner className="animate-spin text-purple-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    AI is analyzing your team...
                  </p>
                  <p className="text-xs text-purple-400 mt-0.5">
                    Assessing founders, building hiring roadmap and advisory
                    board. Takes 20–30 seconds.
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
          <p className="text-sm">Loading team reports...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200
                        flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
            <FaUsers className="text-3xl text-purple-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg">No team reports yet</p>
          <p className="text-gray-300 text-sm mt-1 max-w-xs">
            Enter your founders and hiring plans — AI will analyze team
            strength, build a hiring roadmap, and suggest advisors.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 bg-purple-600 text-white
                       px-5 py-2.5 rounded-xl hover:bg-purple-700 transition
                       text-sm font-medium"
          >
            <FaPlus /> Analyze First Team
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(rec => (
            <TeamCard
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

export default TeamCulture;