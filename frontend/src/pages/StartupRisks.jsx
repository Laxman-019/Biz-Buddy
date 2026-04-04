import React, { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'
import {
  FaPlus, FaTrash, FaChevronDown, FaChevronUp,
  FaSpinner, FaLightbulb, FaExclamationTriangle, FaCheckCircle,
  FaTimesCircle, FaBolt, FaGavel, FaEye
} from 'react-icons/fa'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip
} from 'recharts'


const BUSINESS_TYPES = [
  { value: 'b2b_saas', label: '💻 B2B SaaS'},
  { value: 'b2c_app', label: '📱 B2C App'},
  { value: 'marketplace', label: '🏪 Marketplace'},
  { value: 'service', label: '🤝 Service-based'},
  { value: 'physical', label: '📦 Physical Product'},
]

const RISK_LEVEL_CONFIG = {
  low: { label: 'Low Risk ✅', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500'},
  moderate: { label: 'Moderate ⚠️', bg: 'bg-yellow-50',  border: 'border-yellow-200', text: 'text-yellow-700',  bar: 'bg-yellow-400'   },
  high: { label: 'High Risk 🚨', bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700',  bar: 'bg-orange-500'},
  critical: { label: 'Critical Risk 🔴',bg: 'bg-red-50',     border: 'border-red-200',text: 'text-red-700',     bar: 'bg-red-500'},
}

const SEVERITY_CONFIG = {
  low: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500'},
  medium: { bg: 'bg-yellow-100',  text: 'text-yellow-700', dot: 'bg-yellow-400'   },
  high: { bg: 'bg-orange-100',  text: 'text-orange-700',dot:'bg-orange-500'},
  critical: { bg:'bg-red-100', text: 'text-red-700',dot: 'bg-red-500'},
}

const PRIORITY_CONFIG = {
  immediate: { label: 'Immediate',bg: 'bg-red-100',text: 'text-red-700'    },
  high: { label: 'High', bg: 'bg-orange-100', text: 'text-orange-700' },
  medium: { label: 'Medium', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  low: { label: 'Low', bg: 'bg-gray-100',   text: 'text-gray-600'},
  this_month: { label: 'This Month', bg: 'bg-orange-100', text: 'text-orange-700' },
  this_quarter: { label: 'This Quarter',  bg: 'bg-yellow-100', text: 'text-yellow-700' },
  ongoing: { label: 'Ongoing', bg: 'bg-blue-100',   text: 'text-blue-700'},
}

const EFFORT_COLOR = {
  low: 'text-emerald-600',
  medium: 'text-yellow-600',
  high: 'text-red-500',
}

const RADAR_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
}

const RiskRegisterTab = ({ rec }) => {
  const [openCat, setOpenCat] = useState(null)

  const radarData = rec.risk_register?.map(r => ({
    category: r.category.replace(' Risk', ''),
    score:    r.risk_score || 0,
  })) || []

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700">{payload[0].payload.category}</p>
        <p className="text-orange-600">Risk Score: {payload[0].value}/100</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {(() => {
        const cfg = RISK_LEVEL_CONFIG[rec.overall_risk_level]
          || RISK_LEVEL_CONFIG['moderate']
        return (
          <div className={`rounded-xl border p-5 ${cfg.bg} ${cfg.border}`}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className={`text-xs font-semibold uppercase tracking-wider
                ${cfg.text}`}>
                Overall Risk Assessment
              </span>
              <div className="flex items-center gap-3">
                {rec.overall_risk_score != null && (
                  <span className={`text-lg font-bold ${cfg.text}`}>
                    {rec.overall_risk_score}/100
                  </span>
                )}
                <span className={`text-xs font-bold px-3 py-1 rounded-full
                  border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                  {cfg.label}
                </span>
              </div>
            </div>
            {rec.overall_risk_score != null && (
              <div className="w-full bg-white bg-opacity-60 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${cfg.bar}`}
                  style={{ width: `${rec.overall_risk_score}%` }}
                />
              </div>
            )}
            <p className="text-sm text-gray-600 leading-relaxed">
              {rec.risk_summary}
            </p>
          </div>
        )
      })()}
      {radarData.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-4">
            🕸️ Risk Radar
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f0f0f0" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: '#6b7280' }}
              />
              <Radar
                dataKey="score"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {rec.risk_register?.length > 0 && (
        <div className="space-y-2">
          {rec.risk_register
            .sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
            .map((cat, i) => {
              const sev = SEVERITY_CONFIG[cat.severity] || SEVERITY_CONFIG['medium']
              const isOpen = openCat === i
              return (
                <div key={i}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden">

                  <button
                    onClick={() => setOpenCat(isOpen ? null : i)}
                    className="w-full flex items-center gap-3 p-4
                      hover:bg-gray-50 transition text-left"
                  >
                    <span className="text-xl shrink-0">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <p className="text-sm font-semibold text-gray-800">
                          {cat.category}
                        </p>
                        <span className={`text-xs font-medium px-2 py-0.5
                          rounded-full ${sev.bg} ${sev.text}`}>
                          {cat.severity} severity
                        </span>
                        <span className="text-xs text-gray-400">
                          prob: {cat.probability}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              (cat.risk_score || 0) >= 70 ? 'bg-red-500' :
                              (cat.risk_score || 0) >= 50 ? 'bg-orange-400' :
                              (cat.risk_score || 0) >= 30 ? 'bg-yellow-400' :
                                                             'bg-emerald-400'
                            }`}
                            style={{ width: `${cat.risk_score || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-500 shrink-0">
                          {cat.risk_score}/100
                        </span>
                      </div>
                    </div>
                    {isOpen
                      ? <FaChevronUp className="text-gray-300 shrink-0" />
                      : <FaChevronDown className="text-gray-300 shrink-0" />
                    }
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 p-4 space-y-4">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {cat.description}
                      </p>
                      {cat.key_risks?.length > 0 && (
                        <div className="space-y-3">
                          {cat.key_risks.map((r, j) => (
                            <div key={j}
                              className="bg-gray-50 border border-gray-100
                                rounded-xl p-4">
                              <div className="flex items-start gap-2 mb-2">
                                <span className={`w-2 h-2 rounded-full shrink-0
                                  mt-1.5 ${sev.dot}`} />
                                <p className="text-sm font-semibold text-gray-800">
                                  {r.risk}
                                </p>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2
                                gap-2 ml-4">
                                <div className="bg-red-50 border border-red-100
                                  rounded-lg p-2">
                                  <p className="text-xs font-semibold text-red-600 mb-1">
                                    💥 Impact
                                  </p>
                                  <p className="text-xs text-gray-600">{r.impact}</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-100
                                  rounded-lg p-2">
                                  <p className="text-xs font-semibold text-blue-600 mb-1">
                                    👁️ Early Warning
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {r.early_warning}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

const LegalTab = ({ rec }) => {
  const [openCat, setOpenCat] = useState(null)

  const totalItems = rec.legal_checklist?.reduce(
    (sum, cat) => sum + (cat.items?.length || 0), 0
  ) || 0

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <p className="text-sm text-gray-600 leading-relaxed">{rec.legal_summary}</p>
      </div>
      {rec.immediate_legal_actions?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-600 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaExclamationTriangle /> Immediate Legal Actions Required
          </p>
          <div className="space-y-3">
            {rec.immediate_legal_actions.map((action, i) => (
              <div key={i}
                className="bg-white border border-red-100 rounded-xl p-3">
                <div className="flex items-start gap-2 mb-1">
                  <FaBolt className="text-red-500 shrink-0 mt-0.5 text-xs" />
                  <p className="text-sm font-semibold text-gray-800">
                    {action.action}
                  </p>
                </div>
                <div className="flex gap-3 ml-4 flex-wrap">
                  <span className="text-xs text-orange-600 font-medium">
                    📅 {action.deadline}
                  </span>
                  <span className="text-xs text-red-500">
                    ⚠️ {action.consequence_of_delay}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider flex items-center gap-2">
            <FaGavel className="text-gray-400" />
            Legal Checklist ({totalItems} items)
          </p>
        </div>

        <div className="space-y-2">
          {rec.legal_checklist?.map((cat, i) => {
            const isOpen = openCat === i
            return (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden">

                <button
                  onClick={() => setOpenCat(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 p-4
                    hover:bg-gray-50 transition text-left"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {cat.category}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {cat.items?.length || 0} items
                    </p>
                  </div>
                  {isOpen
                    ? <FaChevronUp className="text-gray-300 shrink-0" />
                    : <FaChevronDown className="text-gray-300 shrink-0" />
                  }
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {cat.items?.map((item, j) => {
                      const pCfg = PRIORITY_CONFIG[item.priority]
                        || PRIORITY_CONFIG['medium']
                      return (
                        <div key={j} className="p-4">
                          <div className="flex items-start gap-3">
                            <FaCheckCircle className="text-gray-200 shrink-0
                              mt-0.5 text-base" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <p className="text-sm font-semibold text-gray-800">
                                  {item.item}
                                </p>
                                <span className={`text-xs font-medium px-2 py-0.5
                                  rounded-full ${pCfg.bg} ${pCfg.text}`}>
                                  {pCfg.label || item.priority}
                                </span>
                                {item.cost_estimate && (
                                  <span className="text-xs bg-gray-100
                                    text-gray-600 px-2 py-0.5 rounded-full">
                                    {item.cost_estimate}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mb-2">
                                {item.description}
                              </p>
                              {item.how_to_do && (
                                <div className="bg-blue-50 border border-blue-100
                                  rounded-lg p-2 flex gap-2">
                                  <FaLightbulb className="text-blue-400 shrink-0
                                    mt-0.5 text-xs" />
                                  <p className="text-xs text-blue-600">
                                    {item.how_to_do}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const MitigationTab = ({ rec }) => {
  const [openMonitor, setOpenMonitor] = useState(null)

  const priorityOrder = ['immediate', 'this_month', 'this_quarter', 'ongoing']

  const sortedActions = [...(rec.mitigation_actions || [])].sort(
    (a, b) =>
      priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  )

  return (
    <div className="space-y-5">

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          {rec.mitigation_summary}
        </p>
      </div>

      {sortedActions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
                      
                      <i className="fa-solid fa-shield text-orange-500"></i>
            Mitigation Actions
          </p>
          <div className="space-y-2">
            {sortedActions.map((action, i) => {
              const pCfg = PRIORITY_CONFIG[action.priority]
                || PRIORITY_CONFIG['ongoing']
              return (
                <div key={i}
                  className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg
                      shrink-0 mt-0.5 ${pCfg.bg} ${pCfg.text}`}>
                      {pCfg.label || action.priority}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        {action.action}
                      </p>
                      <div className="flex gap-3 flex-wrap text-xs">
                        <span className="text-gray-400">
                          Risk: <span className="text-gray-600 font-medium">
                            {action.risk_category}
                          </span>
                        </span>
                        <span className={`font-medium
                          ${EFFORT_COLOR[action.effort] || 'text-gray-600'}`}>
                          Effort: {action.effort}
                        </span>
                        <span className="text-gray-400">
                          Owner: <span className="text-gray-600 font-medium">
                            {action.owner}
                          </span>
                        </span>
                      </div>
                      {action.impact && (
                        <p className="text-xs text-emerald-600 mt-1 font-medium">
                          ✅ {action.impact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {rec.risk_monitoring_plan?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaEye className="text-blue-500" /> Risk Monitoring Plan
          </p>
          <div className="space-y-2">
            {rec.risk_monitoring_plan.map((m, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenMonitor(openMonitor === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4
                    hover:bg-gray-50 transition text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {m.risk}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {m.metric} · {m.frequency}
                    </p>
                  </div>
                  {openMonitor === i
                    ? <FaChevronUp className="text-gray-300 shrink-0" />
                    : <FaChevronDown className="text-gray-300 shrink-0" />
                  }
                </button>
                {openMonitor === i && (
                  <div className="border-t border-gray-100 p-4 grid
                    grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: '📏 Metric',    value: m.metric    },
                      { label: '🔄 Frequency', value: m.frequency },
                      { label: '🚨 Act When',  value: m.threshold },
                    ].map(item => (
                      <div key={item.label}
                        className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-400 mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm text-gray-700">{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.insurance_recommendations?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            🛡️ Insurance Recommendations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rec.insurance_recommendations.map((ins, i) => (
              <div key={i}
                className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  {ins.type}
                </p>
                <p className="text-xs text-gray-500 mb-2">{ins.why_needed}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-medium text-blue-700 bg-blue-100
                    px-2 py-0.5 rounded-full">
                    ~{ins.estimated_premium}/yr
                  </span>
                  {ins.provider_hint && (
                    <span className="text-xs text-gray-400">
                      {ins.provider_hint}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const RisksCard = ({ rec, onDelete }) => {
  const [expanded, setExpanded]   = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const TABS = ['Risk Register', 'Legal & Compliance', 'Mitigation Plan']
  const cfg = RISK_LEVEL_CONFIG[rec.overall_risk_level]
    || RISK_LEVEL_CONFIG['moderate']

  const highRisks = rec.risk_register?.filter(
    r => r.severity === 'critical' || r.severity === 'high'
  ).length || 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
          shrink-0 ${cfg.bg}`}>
                  <i className={`fa-solid fa-shield text-sm ${ cfg.text }`}></i>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{rec.idea_title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {BUSINESS_TYPES.find(b => b.value === rec.business_type)?.label}
            {rec.handles_customer_data && ' · 🗄️ Data'}
            {rec.handles_payments      && ' · 💳 Payments'}
            {rec.regulated_space       && ' · ⚖️ Regulated'}
          </p>
        </div>

        {rec.overall_risk_score != null && (
          <div className={`text-center px-3 py-1.5 rounded-full border
            ${cfg.bg} ${cfg.border}`}>
            <span className={`text-base font-bold ${cfg.text}`}>
              {rec.overall_risk_score}
            </span>
            <span className={`text-xs ml-0.5 ${cfg.text}`}>/100</span>
          </div>
        )}

        <span className={`hidden sm:block text-xs font-semibold px-3 py-1.5
          rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
          {cfg.label}
        </span>

        {highRisks > 0 && (
          <span className="hidden sm:block text-xs font-semibold px-3 py-1.5
            rounded-full bg-red-50 border border-red-200 text-red-600">
            {highRisks} high risk{highRisks > 1 ? 's' : ''}
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
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === 0 && <RiskRegisterTab rec={rec} />}
            {activeTab === 1 && <LegalTab rec={rec} />}
            {activeTab === 2 && <MitigationTab rec={rec} />}
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

const StartupRisks = () => {
  const [records, setRecords] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    idea_id: '',
    business_type: 'b2b_saas',
    handles_customer_data: false,
    handles_payments: false,
    regulated_space: false,
    regulation_details: '',
    biggest_worry: '',
  })

  useEffect(() => {
    Promise.all([fetchRecords(), fetchIdeas()])
      .finally(() => setLoading(false))
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get('/api/risks/')
      setRecords(res.data)
    } catch {
      toast.error('Failed to load risk reports')
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
      const res = await axiosInstance.post('/api/risks/submit/', formData)
      setRecords([res.data, ...records])
      setFormData({
        idea_id: '', business_type: 'b2b_saas',
        handles_customer_data: false, handles_payments: false,
        regulated_space: false, regulation_details: '', biggest_worry: '',
      })
      setShowForm(false)
      toast.success('Risk analysis complete!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Analysis failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this risk report?')) return
    try {
      await axiosInstance.delete(`/api/risks/${id}/`)
      setRecords(records.filter(r => r.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const set = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value })

  const toggle = (field) =>
    setFormData({ ...formData, [field]: !formData[field] })

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2500} />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center
            justify-center">
                <i className="fa-solid fa-shield text-orange-600 text-lg"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Startup Risks</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Risk Register · Legal & Compliance · Mitigation Plan — AI generated
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5
                     rounded-xl hover:bg-orange-600 transition text-sm font-medium
                     shadow-sm"
        >
          <FaPlus /> Analyze Risks
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100
          p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Risk Analysis
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Answer a few questions — AI will generate a full risk register,
            legal checklist, and mitigation plan specific to your startup.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Select Validated Idea
              </label>
              <select
                value={formData.idea_id}
                onChange={set('idea_id')}
                className="w-full border border-gray-300 p-3 rounded-xl text-sm
                           focus:ring-2 focus:ring-orange-400 focus:outline-none"
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
                Business Type
              </label>
              <select
                value={formData.business_type}
                onChange={set('business_type')}
                className="w-full border border-gray-300 p-3 rounded-xl text-sm
                           focus:ring-2 focus:ring-orange-400 focus:outline-none"
              >
                {BUSINESS_TYPES.map(b => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-3">
                Risk Flags — check all that apply
              </label>
              <div className="space-y-2">
                {[
                  {
                    field:   'handles_customer_data',
                    label:   '🗄️ Handles customer personal data',
                    desc:    'User accounts, emails, behavioral data, etc.',
                  },
                  {
                    field:   'handles_payments',
                    label:   '💳 Handles payments or financial transactions',
                    desc:    'Payment gateway, subscriptions, wallets, etc.',
                  },
                  {
                    field:   'regulated_space',
                    label:   '⚖️ Operates in a regulated industry',
                    desc:    'Fintech, health, food, education, logistics, etc.',
                  },
                ].map(item => (
                  <label key={item.field}
                    className={`flex items-start gap-3 p-4 rounded-xl border
                      cursor-pointer transition ${
                      formData[item.field]
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}>
                    <input
                      type="checkbox"
                      checked={formData[item.field]}
                      onChange={() => toggle(item.field)}
                      className="accent-orange-500 w-4 h-4 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {formData.regulated_space && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Which regulations apply?
                </label>
                <input
                  type="text"
                  placeholder="e.g. RBI payment aggregator, FSSAI food safety, SEBI, DPDP Act..."
                  value={formData.regulation_details}
                  onChange={set('regulation_details')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                What's your biggest concern right now?
                <span className="text-gray-300 font-normal ml-1">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. A large competitor entering our space, running out of money, regulatory crackdown..."
                value={formData.biggest_worry}
                onChange={set('biggest_worry')}
                className="w-full border border-gray-300 p-3 rounded-xl text-sm
                           focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting || ideas.length === 0}
                className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2.5
                           rounded-xl hover:bg-orange-600 transition text-sm font-medium
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <><FaSpinner className="animate-spin" /> Analyzing Risks...</>
                  : <><i className="fa-solid fa-shield"></i> Analyze Risks</>
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
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4
                flex items-center gap-3">
                <FaSpinner className="animate-spin text-orange-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-700">
                    AI is scanning for risks...
                  </p>
                  <p className="text-xs text-orange-400 mt-0.5">
                    Building risk register, legal checklist and mitigation plan.
                    Takes 20–30 seconds.
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
          <p className="text-sm">Loading risk reports...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200
                        flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
                          <i className="fa-solid fa-shield text-3xl text-orange-300"></i>
            
          </div>
          <p className="text-gray-500 font-medium text-lg">No risk reports yet</p>
          <p className="text-gray-300 text-sm mt-1 max-w-xs">
            Answer a few questions — AI will identify all risks, build
            a legal checklist, and create a full mitigation plan.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 bg-orange-500 text-white
                       px-5 py-2.5 rounded-xl hover:bg-orange-600 transition
                       text-sm font-medium"
          >
            <FaPlus /> Analyze First Risks
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(rec => (
            <RisksCard
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

export default StartupRisks;