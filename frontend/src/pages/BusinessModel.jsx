import React, { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'
import {
  FaCubes, FaPlus, FaTrash, FaChevronDown, FaChevronUp,
  FaSpinner, FaLightbulb, FaExclamationTriangle,
  FaCheckCircle, FaArrowRight
} from 'react-icons/fa'


const REVENUE_MODELS = [
  { value: 'subscription', label: '🔄 Subscription (Monthly/Annual)' },
  { value: 'one_time',     label: '💳 One-time Purchase'             },
  { value: 'freemium',     label: '🆓 Freemium'                      },
  { value: 'marketplace',  label: '🏪 Marketplace (Take Rate)'       },
  { value: 'advertising',  label: '📢 Advertising'                   },
  { value: 'usage_based',  label: '⚡ Usage-based / Pay per use'     },
  { value: 'licensing',    label: '📄 Licensing'                     },
  { value: 'not_decided',  label: '🤔 Not decided yet'               },
]

const VERDICT_CONFIG = {
  strong:   { label: 'Strong ✅',   bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  good:     { label: 'Good ✅',     bg: 'bg-green-50',   border: 'border-green-200',   text: 'text-green-700'   },
  moderate: { label: 'Moderate ⚠️', bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-700'  },
  weak:     { label: 'Weak ❌',     bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700'  },
  unviable: { label: 'Unviable ❌', bg: 'bg-red-50',border: 'border-red-200',     text: 'text-red-700'     },
}

const LTV_CAC_CONFIG = {
  excellent:{ label: 'Excellent',color: 'text-emerald-600', bg: 'bg-emerald-50' },
  good:{ label: 'Good',color: 'text-green-600',   bg: 'bg-green-50'   },
  acceptable: { label: 'Acceptable',  color: 'text-yellow-600',  bg: 'bg-yellow-50'  },
  poor:{ label: 'Poor',color: 'text-orange-600',  bg: 'bg-orange-50'  },
  critical:{ label: 'Critical',color: 'text-red-600',     bg: 'bg-red-50'     },
}

const PAYBACK_CONFIG = {
  fast:      { label: 'Fast',color: 'text-emerald-600'},
  acceptable:{ label: 'Acceptable',color: 'text-green-600'},
  slow:      { label: 'Slow',color: 'text-yellow-600'},
  very_slow: { label: 'Very Slow', color: 'text-red-600'},
}

// Lean Canvas Grid 
const CANVAS_BOXES = [
  {
    key:   'canvas_problem',
    label: '😤 Problem',
    desc:  'Top problems being solved',
    color: 'border-red-200 bg-red-50',
    text:  'text-red-700',
  },
  {
    key:   'canvas_solution',
    label: '💡 Solution',
    desc:  'Top features of the solution',
    color: 'border-blue-200 bg-blue-50',
    text:  'text-blue-700',
  },
  {
    key:   'canvas_uvp',
    label: '⭐ Unique Value Proposition',
    desc:  'Clear compelling message',
    color: 'border-purple-200 bg-purple-50',
    text:  'text-purple-700',
    wide:  true,
  },
  {
    key:   'canvas_unfair_advantage',
    label: '🔒 Unfair Advantage',
    desc:  'Cannot be copied or bought',
    color: 'border-gray-200 bg-gray-50',
    text:  'text-gray-700',
  },
  {
    key:   'canvas_customer_segments',
    label: '👥 Customer Segments',
    desc:  'Target customers',
    color: 'border-emerald-200 bg-emerald-50',
    text:  'text-emerald-700',
  },
  {
    key:   'canvas_channels',
    label: '📣 Channels',
    desc:  'Path to customers',
    color: 'border-cyan-200 bg-cyan-50',
    text:  'text-cyan-700',
  },
  {
    key:   'canvas_revenue_streams',
    label: '💰 Revenue Streams',
    desc:  'How you make money',
    color: 'border-green-200 bg-green-50',
    text:  'text-green-700',
  },
  {
    key:   'canvas_cost_structure',
    label: '🏗️ Cost Structure',
    desc:  'Fixed and variable costs',
    color: 'border-orange-200 bg-orange-50',
    text:  'text-orange-700',
  },
  {
    key:   'canvas_key_metrics',
    label: '📊 Key Metrics',
    desc:  'Numbers that matter most',
    color: 'border-yellow-200 bg-yellow-50',
    text:  'text-yellow-700',
  },
]

const LeanCanvas = ({ bm }) => (
  <div>
    <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <FaCubes className="text-green-500" /> Lean Canvas
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {CANVAS_BOXES.map((box) => (
        <div
          key={box.key}
          className={`rounded-xl border p-4 ${box.color} ${box.wide ? 'sm:col-span-2 lg:col-span-1' : ''}`}
        >
          <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${box.text}`}>
            {box.label}
          </p>
          <p className="text-xs text-gray-400 mb-2">{box.desc}</p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {bm[box.key] || '—'}
          </p>
        </div>
      ))}
    </div>
  </div>
)

// Unit Economics
const UnitEconomics = ({ bm }) => {
  const ltvCac  = LTV_CAC_CONFIG[bm.ltv_cac_verdict]  || LTV_CAC_CONFIG['acceptable']
  const payback = PAYBACK_CONFIG[bm.payback_verdict]   || PAYBACK_CONFIG['acceptable']

  const metrics = [
    {
      label:   'LTV',
      value:   bm.ltv_estimate ? `₹${Number(bm.ltv_estimate).toLocaleString('en-IN')}` : '—',
      sub:     'Lifetime Value',
      color:   'bg-emerald-50 border-emerald-200',
      text:    'text-emerald-700',
    },
    {
      label:   'CAC',
      value:   bm.estimated_cac ? `₹${Number(bm.estimated_cac).toLocaleString('en-IN')}` : '—',
      sub:     'Acquisition Cost',
      color:   'bg-blue-50 border-blue-200',
      text:    'text-blue-700',
    },
    {
      label:   'LTV:CAC',
      value:   bm.ltv_cac_ratio ? `${Number(bm.ltv_cac_ratio).toFixed(1)}x` : '—',
      sub:     ltvCac.label,
      color:   `${ltvCac.bg} border-gray-200`,
      text:    ltvCac.color,
    },
    {
      label:   'Payback',
      value:   bm.payback_period_months
                 ? `${Number(bm.payback_period_months).toFixed(1)} mo`
                 : '—',
      sub:     payback.label,
      color:   'bg-purple-50 border-purple-200',
      text:    payback.color,
    },
  ]

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-4">
        📐 Unit Economics
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {metrics.map((m) => (
          <div key={m.label}
            className={`rounded-xl border p-4 text-center ${m.color}`}>
            <p className="text-xs text-gray-400 mb-1">{m.label}</p>
            <p className={`text-xl font-bold ${m.text}`}>{m.value}</p>
            <p className={`text-xs mt-0.5 font-medium ${m.text}`}>{m.sub}</p>
          </div>
        ))}
      </div>

      {bm.unit_economics_score != null && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Unit Economics Score
            </span>
            <span className={`text-sm font-bold ${
              bm.unit_economics_score >= 70 ? 'text-emerald-600' :
              bm.unit_economics_score >= 50 ? 'text-yellow-600' : 'text-red-500'
            }`}>
              {bm.unit_economics_score}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                bm.unit_economics_score >= 70 ? 'bg-emerald-500' :
                bm.unit_economics_score >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${bm.unit_economics_score}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {[
          { label: 'LTV Calculation',text: bm.ltv_explanation},
          { label: 'CAC Analysis',text: bm.cac_analysis},
          { label: 'Contribution Margin',text: bm.contribution_margin },
        ].map((item) => item.text && (
          <div key={item.label}
            className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase
              tracking-wider mb-1">
              {item.label}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2">
        <FaLightbulb className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-600 leading-relaxed">
          <strong>Healthy SaaS benchmark:</strong> LTV ≥ 3× CAC,
          Payback period ≤ 12 months. B2B India benchmarks may vary
          by segment and sales motion.
        </p>
      </div>
    </div>
  )
}

// Revenue Model Section 
const RevenueSection = ({ bm }) => (
  <div className="space-y-4">
    <h4 className="text-sm font-semibold text-gray-700 mb-1">
      💰 Revenue Model Analysis
    </h4>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase
          tracking-wider mb-2">
          Your Chosen Model
        </p>
        <p className="text-sm font-semibold text-gray-700">
          {REVENUE_MODELS.find(r => r.value === bm.revenue_model)?.label
            || bm.revenue_model}
        </p>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          {bm.revenue_model_analysis}
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-emerald-600 uppercase
          tracking-wider mb-2">
          AI Recommended Model
        </p>
        <p className="text-sm font-semibold text-emerald-700">
          {bm.revenue_model_recommended}
        </p>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {bm.revenue_model_reasoning}
        </p>
      </div>
    </div>

    {bm.pricing_recommendation && (
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-purple-600 uppercase
          tracking-wider mb-2">
          💡 Pricing Recommendation
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {bm.pricing_recommendation}
        </p>
      </div>
    )}

    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
        <p className="text-xs text-gray-400">Your Price / Customer</p>
        <p className="text-lg font-bold text-gray-800 mt-1">
          ₹{Number(bm.price_per_customer).toLocaleString('en-IN')}
          <span className="text-xs font-normal text-gray-400">/mo</span>
        </p>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
        <p className="text-xs text-gray-400">Estimated CAC</p>
        <p className="text-lg font-bold text-gray-800 mt-1">
          ₹{Number(bm.estimated_cac).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  </div>
)

// Full Report Card 
const BusinessModelReport = ({ bm, onDelete }) => {
  const [expanded, setExpanded]   = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const TABS = ['Lean Canvas', 'Revenue Model', 'Unit Economics']
  const verdict = VERDICT_CONFIG[bm.overall_verdict] || VERDICT_CONFIG['moderate']

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          ${verdict.bg}`}>
          <FaCubes className={`text-sm ${verdict.text}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">
            {bm.idea_title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {REVENUE_MODELS.find(r => r.value === bm.revenue_model)?.label}
            {' · '}₹{Number(bm.price_per_customer).toLocaleString('en-IN')}/mo
          </p>
        </div>

        {bm.business_model_score != null && (
          <div className={`text-center px-3 py-1.5 rounded-full border
            ${verdict.bg} ${verdict.border}`}>
            <span className={`text-base font-bold ${verdict.text}`}>
              {bm.business_model_score}
            </span>
            <span className={`text-xs ml-0.5 ${verdict.text}`}>/100</span>
          </div>
        )}

        <span className={`hidden sm:block text-xs font-semibold px-3 py-1.5
          rounded-full border ${verdict.bg} ${verdict.border} ${verdict.text}`}>
          {verdict.label}
        </span>

        {bm.ltv_cac_ratio && (
          <span className={`hidden sm:block text-xs font-semibold px-3 py-1.5
            rounded-full border bg-gray-50 border-gray-200 text-gray-600`}>
            LTV:CAC {Number(bm.ltv_cac_ratio).toFixed(1)}x
          </span>
        )}

        {/* Status */}
        {bm.status === 'analyzing' && (
          <span className="text-xs bg-blue-50 text-blue-500 px-2 py-1
            rounded-full flex items-center gap-1">
            <FaSpinner className="animate-spin text-xs" /> Analyzing
          </span>
        )}
        {bm.status === 'failed' && (
          <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full">
            Failed
          </span>
        )}

        <p className="text-xs text-gray-300 shrink-0">
          {new Date(bm.created_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          })}
        </p>

        <button
          onClick={e => { e.stopPropagation(); onDelete(bm.id) }}
          className="text-gray-200 hover:text-red-400 transition p-1 shrink-0"
        >
          <FaTrash />
        </button>

        {expanded
          ? <FaChevronUp className="text-gray-300 shrink-0" />
          : <FaChevronDown className="text-gray-300 shrink-0" />
        }
      </div>

      {/* Report Body */}
      {expanded && bm.status === 'done' && (
        <div className="border-t border-gray-100">

          <div className="p-5 pb-0">
            <div className={`rounded-xl border p-4 mb-4 ${verdict.bg} ${verdict.border}`}>
              <p className={`text-xs font-semibold mb-1 ${verdict.text}`}>
                Business Model Assessment
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {bm.overall_summary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-600 uppercase
                  tracking-wider mb-3 flex items-center gap-1">
                  <FaArrowRight /> Recommendations
                </p>
                <ol className="space-y-1.5">
                  {bm.recommendations?.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="font-bold text-blue-500 shrink-0">
                        {i + 1}.
                      </span>
                      {r}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-600 uppercase
                  tracking-wider mb-3 flex items-center gap-1">
                  <FaExclamationTriangle /> Risks
                </p>
                <ul className="space-y-1.5">
                  {bm.risks?.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-red-400 mt-1 shrink-0">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-5">
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`py-3 px-4 text-sm font-medium transition border-b-2
                  ${activeTab === i
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === 0 && <LeanCanvas bm={bm} />}
            {activeTab === 1 && <RevenueSection bm={bm} />}
            {activeTab === 2 && <UnitEconomics bm={bm} />}
          </div>
        </div>
      )}

      {expanded && bm.status === 'failed' && (
        <div className="border-t border-gray-100 p-5">
          <div className="bg-red-50 rounded-xl p-4 text-sm text-red-600">
            Analysis failed: {bm.error_message || 'Please try again.'}
          </div>
        </div>
      )}
    </div>
  )
}

// Main Component 
const BusinessModel = () => {
  const [reports, setReports] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    idea_id: '',
    revenue_model: 'subscription',
    price_per_customer: '',
    estimated_cac: '',
    additional_context: '',
  })

  useEffect(() => {
    Promise.all([fetchReports(), fetchIdeas()])
      .finally(() => setLoading(false))
  }, [])

  const fetchReports = async () => {
    try {
      const res = await axiosInstance.get('/api/business-model/')
      setReports(res.data)
    } catch {
      toast.error('Failed to load reports')
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
    if (!formData.idea_id) {
      toast.error('Please select a validated idea')
      return
    }
    setSubmitting(true)
    try {
      const res = await axiosInstance.post(
        '/api/business-model/submit/', formData
      )
      setReports([res.data, ...reports])
      setFormData({
        idea_id: '', revenue_model: 'subscription',
        price_per_customer: '', estimated_cac: '',
        additional_context: '',
      })
      setShowForm(false)
      toast.success('Business model analysis complete!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Analysis failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this business model?')) return
    try {
      await axiosInstance.delete(`/api/business-model/${id}/`)
      setReports(reports.filter(r => r.id !== id))
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
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <FaCubes className="text-green-600 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Business Model Builder</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Lean Canvas · Revenue Model · Unit Economics — AI generated
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5
                     rounded-xl hover:bg-green-700 transition text-sm font-medium shadow-sm"
        >
          <FaPlus /> Build Model
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Build Your Business Model
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Select your validated idea, enter your pricing and CAC estimate —
            AI will generate your full Lean Canvas, revenue analysis, and unit economics.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Idea selector */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Select Validated Idea
                </label>
                {ideas.length === 0 ? (
                  <div className="w-full border border-dashed border-gray-200 p-3
                    rounded-xl text-sm text-gray-400 text-center">
                    No validated ideas yet —
                    <button
                      type="button"
                      className="text-purple-500 underline ml-1"
                      onClick={() => window.location.href = '/startup/dashboard'}
                    >
                      validate an idea first
                    </button>
                  </div>
                ) : (
                  <select
                    value={formData.idea_id}
                    onChange={set('idea_id')}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm
                               focus:ring-2 focus:ring-green-400 focus:outline-none"
                    required
                  >
                    <option value="">— Select an idea —</option>
                    {ideas.map(idea => (
                      <option key={idea.id} value={idea.id}>
                        {idea.idea_title}
                        {idea.overall_score
                          ? ` (Score: ${idea.overall_score})`
                          : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Revenue model */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Revenue Model
                </label>
                <select
                  value={formData.revenue_model}
                  onChange={set('revenue_model')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-green-400 focus:outline-none"
                >
                  {REVENUE_MODELS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Price per Customer (₹/month)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 999"
                  value={formData.price_per_customer}
                  onChange={set('price_per_customer')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
                />
              </div>

              {/* CAC */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Estimated CAC (₹)
                  <span className="text-gray-300 font-normal ml-1">
                    — cost to acquire one customer
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 1500"
                  value={formData.estimated_cac}
                  onChange={set('estimated_cac')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
                />
              </div>

              {/* Context */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Additional Context
                  <span className="text-gray-300 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  placeholder="Any extra details — target segment, delivery method, key partnerships, etc."
                  value={formData.additional_context}
                  onChange={set('additional_context')}
                  rows={2}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             resize-none focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting || ideas.length === 0}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5
                           rounded-xl hover:bg-green-700 transition text-sm font-medium
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <><FaSpinner className="animate-spin" /> Building Model...</>
                  : <><FaCubes /> Generate Business Model</>
                }
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
                className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl
                           hover:bg-gray-200 transition text-sm font-medium disabled:opacity-60"
              >
                Cancel
              </button>
            </div>

            {submitting && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4
                flex items-center gap-3">
                <FaSpinner className="animate-spin text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-700">
                    AI is building your business model...
                  </p>
                  <p className="text-xs text-green-400 mt-0.5">
                    Generating Lean Canvas, revenue analysis and unit economics.
                    This takes 15–25 seconds.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Reports List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <FaSpinner className="animate-spin text-2xl mx-auto mb-3" />
          <p className="text-sm">Loading...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200
                        flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
            <FaCubes className="text-3xl text-green-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg">No business models yet</p>
          <p className="text-gray-300 text-sm mt-1 max-w-xs">
            Select a validated idea, enter your pricing — AI will generate
            your full Lean Canvas and unit economics instantly.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 bg-green-600 text-white px-5 py-2.5
                       rounded-xl hover:bg-green-700 transition text-sm font-medium"
          >
            <FaPlus /> Build First Model
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(bm => (
            <BusinessModelReport
              key={bm.id}
              bm={bm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BusinessModel
