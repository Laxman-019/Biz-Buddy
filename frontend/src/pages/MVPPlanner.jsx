import React, { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'
import {
  FaRocket, FaPlus, FaTrash, FaChevronDown, FaChevronUp,
  FaSpinner, FaCheckCircle, FaExclamationTriangle,
  FaLightbulb, FaCode, FaShoppingCart, FaMagic,
  FaFlag, FaLock
} from 'react-icons/fa'


const PRODUCT_TYPES = [
  { value: 'web_app',    label: '🌐 Web Application'    },
  { value: 'mobile_app', label: '📱 Mobile App'          },
  { value: 'both',       label: '🌐📱 Web + Mobile'      },
  { value: 'physical',   label: '📦 Physical Product'    },
  { value: 'service',    label: '🤝 Service-based'       },
]

const TECH_SKILLS = [
  { value: 'fullstack', label: '💻 Full-stack Developer' },
  { value: 'frontend',  label: '🎨 Frontend Only'        },
  { value: 'backend',   label: '⚙️ Backend Only'         },
  { value: 'no_code',   label: '🔧 No-code Tools Only'   },
  { value: 'none',      label: '🙋 No Technical Skills'  },
]

const PLATFORMS = [
  { value: 'web',    label: '🌐 Web'          },
  { value: 'mobile', label: '📱 Mobile'        },
  { value: 'both',   label: '🌐📱 Web + Mobile'},
]

const BUDGETS = [
  { value: 'lt_1l',   label: 'Under ₹1 Lakh'   },
  { value: '1l_5l',   label: '₹1L – ₹5L'        },
  { value: '5l_20l',  label: '₹5L – ₹20L'       },
  { value: '20l_50l', label: '₹20L – ₹50L'      },
  { value: 'gt_50l',  label: 'Above ₹50L'        },
]

const VERDICT_CONFIG = {
  excellent:   { label: 'Excellent ✅',   bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  good:        { label: 'Good ✅',        bg: 'bg-green-50',   border: 'border-green-200',   text: 'text-green-700'   },
  tight:       { label: 'Tight ⚠️',      bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-700'  },
  risky:       { label: 'Risky ⚠️',      bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700'  },
  unrealistic: { label: 'Unrealistic ❌', bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700'     },
}

const EFFORT_CONFIG = {
  low:    { label: 'Low',    bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  medium: { label: 'Medium', bg: 'bg-yellow-50',  text: 'text-yellow-600',  border: 'border-yellow-200'  },
  high:   { label: 'High',   bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200'     },
}

const PHASE_COLORS = [
  'border-gray-300   bg-gray-50   text-gray-700',
  'border-blue-300   bg-blue-50   text-blue-700',
  'border-purple-300 bg-purple-50 text-purple-700',
  'border-cyan-300   bg-cyan-50   text-cyan-700',
  'border-emerald-300 bg-emerald-50 text-emerald-700',
  'border-orange-300 bg-orange-50 text-orange-700',
]

const PHASE_DOT = [
  'bg-gray-400',
  'bg-blue-500',
  'bg-purple-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-orange-500',
]

const MVPDefinition = ({ plan }) => {
  const verdict = VERDICT_CONFIG[plan.mvp_verdict] || VERDICT_CONFIG['good']

  return (
    <div className="space-y-5">
      <div className={`rounded-xl border p-4 ${verdict.bg} ${verdict.border}`}>
        <p className={`text-xs font-semibold mb-1 ${verdict.text}`}>
          {verdict.label}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">{plan.mvp_summary}</p>
      </div>

      {plan.mvp_score != null && (
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">MVP Score</span>
            <span className={`text-sm font-bold ${
              plan.mvp_score >= 70 ? 'text-emerald-600' :
              plan.mvp_score >= 50 ? 'text-yellow-600' : 'text-red-500'
            }`}>
              {plan.mvp_score}/100
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                plan.mvp_score >= 70 ? 'bg-emerald-500' :
                plan.mvp_score >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${plan.mvp_score}%` }}
            />
          </div>
        </div>
      )}
      {plan.core_features?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaCheckCircle className="text-emerald-500" /> Core Features (Must-Have)
          </p>
          <div className="space-y-2">
            {plan.core_features.map((f, i) => {
              const effort = EFFORT_CONFIG[f.effort] || EFFORT_CONFIG['medium']
              return (
                <div key={i} className="bg-white border border-gray-100
                  rounded-xl p-4 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600
                    text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800">{f.feature}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                        border ${effort.bg} ${effort.text} ${effort.border}`}>
                        {effort.label} effort
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{f.reason}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {plan.nice_to_haves?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaLightbulb className="text-yellow-400" /> Nice-to-Haves (Post-MVP)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {plan.nice_to_haves.map((f, i) => (
              <div key={i} className="bg-yellow-50 border border-yellow-100
                rounded-xl p-3 flex gap-2">
                <span className="text-yellow-400 mt-0.5 shrink-0">→</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">{f.feature}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {plan.learning_goals?.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase
              tracking-wider mb-3">
              🎯 Learning Goals
            </p>
            <ul className="space-y-2">
              {plan.learning_goals.map((g, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-blue-400 mt-1 shrink-0">•</span>{g}
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.success_metrics?.length > 0 && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-600 uppercase
              tracking-wider mb-3">
              📊 Success Metrics
            </p>
            <ul className="space-y-2">
              {plan.success_metrics.map((m, i) => (
                <li key={i} className="text-sm text-gray-600">
                  <span className="font-semibold text-purple-700">{m.metric}</span>
                  {m.target && (
                    <span className="text-xs text-gray-400 block mt-0.5">
                      Target: {m.target}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {plan.mvp_risks?.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-600 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaExclamationTriangle /> MVP Risks
          </p>
          <ul className="space-y-1.5">
            {plan.mvp_risks.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-red-400 mt-1 shrink-0">•</span>{r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Roadmap Tab 
const Roadmap = ({ plan }) => {
  const [openPhase, setOpenPhase] = useState(null)

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Total Duration
          </span>
          <span className="bg-orange-100 text-orange-700 text-xs font-bold
            px-3 py-1 rounded-full">
            {plan.total_duration_weeks} weeks
          </span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {plan.roadmap_summary}
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />

        <div className="space-y-3">
          {plan.phases?.map((phase, i) => {
            const isOpen = openPhase === i
            return (
              <div key={i} className="relative pl-12">
                <div className={`absolute left-3.5 top-4 w-3 h-3 rounded-full
                  border-2 border-white shadow-sm ${PHASE_DOT[i] || 'bg-gray-400'}`}
                />

                <div className={`rounded-xl border overflow-hidden
                  ${PHASE_COLORS[i] || PHASE_COLORS[0]}`}>
                  <button
                    onClick={() => setOpenPhase(isOpen ? null : i)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <span className="text-xs font-bold opacity-60 shrink-0">
                      Phase {phase.phase}
                    </span>
                    <span className="flex-1 font-semibold text-sm">
                      {phase.name}
                    </span>
                    <span className="text-xs font-medium opacity-70 shrink-0">
                      {phase.duration_weeks}w
                    </span>
                    {isOpen
                      ? <FaChevronUp className="text-xs opacity-50 shrink-0" />
                      : <FaChevronDown className="text-xs opacity-50 shrink-0" />
                    }
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 space-y-3 border-t border-current
                      border-opacity-10">
                      <p className="text-sm text-gray-600 leading-relaxed pt-3">
                        {phase.description}
                      </p>

                      {phase.key_activities?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500
                            uppercase tracking-wider mb-2">
                            Key Activities
                          </p>
                          <ul className="space-y-1">
                            {phase.key_activities.map((a, j) => (
                              <li key={j} className="flex gap-2 text-sm text-gray-600">
                                <span className="mt-1 shrink-0">▸</span>{a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {phase.milestone && (
                        <div className="flex items-start gap-2 bg-white
                          bg-opacity-60 rounded-lg p-3">
                          <FaFlag className="text-current opacity-60 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold opacity-60
                              uppercase tracking-wider">
                              Milestone
                            </p>
                            <p className="text-sm font-medium text-gray-700 mt-0.5">
                              {phase.milestone}
                            </p>
                          </div>
                        </div>
                      )}

                      {phase.risks?.length > 0 && (
                        <div className="bg-red-50 border border-red-100
                          rounded-lg p-3">
                          <p className="text-xs font-semibold text-red-500 mb-1">
                            ⚠️ Risks
                          </p>
                          {phase.risks.map((r, j) => (
                            <p key={j} className="text-xs text-red-600">{r}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const TechRequirements = ({ plan }) => (
  <div className="space-y-5">
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <p className="text-sm text-gray-600 leading-relaxed">{plan.tech_summary}</p>
    </div>

    {plan.recommended_stack?.length > 0 && (
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase
          tracking-wider mb-3 flex items-center gap-2">
          <FaCode className="text-blue-500" /> Recommended Tech Stack
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {plan.recommended_stack.map((s, i) => (
            <div key={i} className="bg-blue-50 border border-blue-100
              rounded-xl p-3">
              <span className="text-xs font-semibold text-blue-500 uppercase
                tracking-wider">
                {s.category}
              </span>
              <p className="text-sm font-bold text-gray-800 mt-0.5">{s.technology}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.reason}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {plan.build_items?.length > 0 && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-purple-600 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaCode /> Build (Your Core IP)
          </p>
          <ul className="space-y-2">
            {plan.build_items.map((b, i) => (
              <li key={i}>
                <p className="text-sm font-medium text-gray-700">{b.item}</p>
                <p className="text-xs text-gray-400 mt-0.5">{b.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {plan.buy_items?.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-emerald-600 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaShoppingCart /> Buy (Off-the-Shelf)
          </p>
          <ul className="space-y-2">
            {plan.buy_items.map((b, i) => (
              <li key={i}>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-700">{b.item}</p>
                  <span className="text-xs bg-emerald-100 text-emerald-600
                    px-2 py-0.5 rounded-full shrink-0">
                    {b.tool}
                  </span>
                </div>
                {b.cost && (
                  <p className="text-xs text-gray-400 mt-0.5">{b.cost}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    {plan.nocode_options?.length > 0 && (
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-yellow-600 uppercase
          tracking-wider mb-3 flex items-center gap-2">
          <FaMagic /> No-Code Options
        </p>
        <div className="space-y-3">
          {plan.nocode_options.map((n, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="bg-yellow-200 text-yellow-800 text-xs font-bold
                px-2 py-0.5 rounded-md shrink-0 mt-0.5">
                {n.tool}
              </span>
              <div>
                <p className="text-sm text-gray-700">{n.use_case}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ⚠️ Limitation: {n.limitation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {plan.core_ip?.length > 0 && (
      <div className="bg-gray-800 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-300 uppercase
          tracking-wider mb-3 flex items-center gap-2">
          <FaLock className="text-yellow-400" /> Protect as Core IP
        </p>
        <ul className="space-y-1.5">
          {plan.core_ip.map((ip, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-300">
              <span className="text-yellow-400 mt-1 shrink-0">★</span>{ip}
            </li>
          ))}
        </ul>
      </div>
    )}

    {plan.tech_recommendations?.length > 0 && (
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-blue-600 uppercase
          tracking-wider mb-3">
          💡 Tech Recommendations
        </p>
        <ul className="space-y-2">
          {plan.tech_recommendations.map((r, i) => (
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

// Full Plan Card 
const MVPPlanCard = ({ plan, onDelete }) => {
  const [expanded, setExpanded]   = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const TABS = ['MVP Definition', 'Roadmap', 'Tech Requirements']
  const verdict = VERDICT_CONFIG[plan.mvp_verdict] || VERDICT_CONFIG['good']

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
          shrink-0 ${verdict.bg}`}>
          <FaRocket className={`text-sm ${verdict.text}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{plan.idea_title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {PRODUCT_TYPES.find(p => p.value === plan.product_type)?.label}
            {' · '}{plan.launch_weeks}w target
            {' · '}{plan.team_size} person{plan.team_size > 1 ? 's' : ''}
          </p>
        </div>
        
        {plan.mvp_score != null && (
          <div className={`text-center px-3 py-1.5 rounded-full border
            ${verdict.bg} ${verdict.border}`}>
            <span className={`text-base font-bold ${verdict.text}`}>
              {plan.mvp_score}
            </span>
            <span className={`text-xs ml-0.5 ${verdict.text}`}>/100</span>
          </div>
        )}

        <span className={`hidden sm:block text-xs font-semibold px-3 py-1.5
          rounded-full border ${verdict.bg} ${verdict.border} ${verdict.text}`}>
          {verdict.label}
        </span>

        {plan.total_duration_weeks && (
          <span className="hidden sm:block text-xs font-semibold px-3 py-1.5
            rounded-full bg-orange-50 border border-orange-200 text-orange-600">
            ⏱ {plan.total_duration_weeks}w total
          </span>
        )}

        {plan.status === 'analyzing' && (
          <span className="text-xs bg-blue-50 text-blue-500 px-2 py-1
            rounded-full flex items-center gap-1">
            <FaSpinner className="animate-spin text-xs" /> Analyzing
          </span>
        )}
        {plan.status === 'failed' && (
          <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full">
            Failed
          </span>
        )}

        <p className="text-xs text-gray-300 shrink-0">
          {new Date(plan.created_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          })}
        </p>

        <button
          onClick={e => { e.stopPropagation(); onDelete(plan.id) }}
          className="text-gray-200 hover:text-red-400 transition p-1 shrink-0"
        >
          <FaTrash />
        </button>

        {expanded
          ? <FaChevronUp className="text-gray-300 shrink-0" />
          : <FaChevronDown className="text-gray-300 shrink-0" />
        }
      </div>

      {expanded && plan.status === 'done' && (
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
            {activeTab === 0 && <MVPDefinition plan={plan} />}
            {activeTab === 1 && <Roadmap plan={plan} />}
            {activeTab === 2 && <TechRequirements plan={plan} />}
          </div>
        </div>
      )}

      {/* Failed */}
      {expanded && plan.status === 'failed' && (
        <div className="border-t border-gray-100 p-5">
          <div className="bg-red-50 rounded-xl p-4 text-sm text-red-600">
            Analysis failed: {plan.error_message || 'Please try again.'}
          </div>
        </div>
      )}
    </div>
  )
}

const MVPPlanner = () => {
  const [plans, setPlans] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    idea_id: '',
    product_type: 'web_app',
    launch_weeks: '12',
    team_size: '1',
    start_date: '',
    available_budget: '1l_5l',
    tech_skills: 'fullstack',
    platform: 'web',
  })

  useEffect(() => {
    Promise.all([fetchPlans(), fetchIdeas()])
      .finally(() => setLoading(false))
  }, [])

  const fetchPlans = async () => {
    try {
      const res = await axiosInstance.get('/api/mvp/')
      setPlans(res.data)
    } catch {
      toast.error('Failed to load MVP plans')
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
      const payload = {
        ...formData,
        launch_weeks: parseInt(formData.launch_weeks),
        team_size:    parseInt(formData.team_size),
        start_date:   formData.start_date || null,
      }
      const res = await axiosInstance.post('/api/mvp/submit/', payload)
      setPlans([res.data, ...plans])
      setFormData({
        idea_id: '', product_type: 'web_app', launch_weeks: '12',
        team_size: '1', start_date: '', available_budget: '1l_5l',
        tech_skills: 'fullstack', platform: 'web',
      })
      setShowForm(false)
      toast.success('MVP plan generated!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Analysis failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this MVP plan?')) return
    try {
      await axiosInstance.delete(`/api/mvp/${id}/`)
      setPlans(plans.filter(p => p.id !== id))
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
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center
            justify-center">
            <FaRocket className="text-orange-600 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">MVP Planning</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              MVP Definition · Roadmap · Tech Requirements — AI generated
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5
                     rounded-xl hover:bg-orange-600 transition text-sm font-medium
                     shadow-sm"
        >
          <FaPlus /> Plan MVP
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100
          p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Plan Your MVP
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Select your validated idea and fill in your constraints —
            AI will generate your MVP definition, development roadmap,
            and tech requirements.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Select Validated Idea
                </label>
                {ideas.length === 0 ? (
                  <div className="w-full border border-dashed border-gray-200 p-3
                    rounded-xl text-sm text-gray-400 text-center">
                    No validated ideas yet — validate an idea first
                  </div>
                ) : (
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
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Product Type
                </label>
                <select
                  value={formData.product_type}
                  onChange={set('product_type')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-orange-400 focus:outline-none"
                >
                  {PRODUCT_TYPES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Target Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={set('platform')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-orange-400 focus:outline-none"
                >
                  {PLATFORMS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Your Tech Skills
                </label>
                <select
                  value={formData.tech_skills}
                  onChange={set('tech_skills')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-orange-400 focus:outline-none"
                >
                  {TECH_SKILLS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>


              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Available Budget
                </label>
                <select
                  value={formData.available_budget}
                  onChange={set('available_budget')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-orange-400 focus:outline-none"
                >
                  {BUDGETS.map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Target Launch Timeline (weeks)
                </label>
                <input
                  type="number"
                  min="1"
                  max="104"
                  placeholder="e.g. 12"
                  value={formData.launch_weeks}
                  onChange={set('launch_weeks')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Team Size (people available to build)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 2"
                  value={formData.team_size}
                  onChange={set('team_size')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Planned Start Date
                  <span className="text-gray-300 font-normal ml-1">(optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={set('start_date')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>

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
                  ? <><FaSpinner className="animate-spin" /> Generating Plan...</>
                  : <><FaRocket /> Generate MVP Plan</>
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
                    AI is building your MVP plan...
                  </p>
                  <p className="text-xs text-orange-400 mt-0.5">
                    Generating features, 6-phase roadmap and tech requirements.
                    This takes 15–25 seconds.
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
          <p className="text-sm">Loading plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200
                        flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
            <FaRocket className="text-3xl text-orange-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg">No MVP plans yet</p>
          <p className="text-gray-300 text-sm mt-1 max-w-xs">
            Select a validated idea and your constraints — AI will plan
            your MVP features, roadmap and tech stack.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 bg-orange-500 text-white
                       px-5 py-2.5 rounded-xl hover:bg-orange-600 transition
                       text-sm font-medium"
          >
            <FaPlus /> Plan First MVP
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map(plan => (
            <MVPPlanCard
              key={plan.id}
              plan={plan}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MVPPlanner
