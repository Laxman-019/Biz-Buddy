import React, { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'
import {
  FaLightbulb, FaPlus, FaTrash, FaChevronDown, FaChevronUp,
  FaCheckCircle, FaExclamationTriangle, FaTimesCircle,
  FaArrowRight, FaSpinner, FaStar
} from 'react-icons/fa'



const VERDICT_CONFIG = {
  strong_go: { label: 'Strong GO ✅',        bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  go:        { label: 'GO ✅',               bg: 'bg-green-50',   border: 'border-green-300',   text: 'text-green-700',   bar: 'bg-green-500'   },
  caution:   { label: 'Proceed with Caution ⚠️', bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', bar: 'bg-yellow-500' },
  no_go:     { label: 'NO-GO ❌',            bg: 'bg-red-50',     border: 'border-red-300',     text: 'text-red-700',     bar: 'bg-red-500'     },
  pivot:     { label: 'Pivot Recommended 🔄', bg: 'bg-orange-50', border: 'border-orange-300',  text: 'text-orange-700',  bar: 'bg-orange-500'  },
}

const SCORE_COLOR = (score) => {
  if (score >= 75) return 'bg-emerald-500'
  if (score >= 60) return 'bg-green-400'
  if (score >= 40) return 'bg-yellow-400'
  return 'bg-red-400'
}

const SCORE_TEXT = (score) => {
  if (score >= 75) return 'text-emerald-600'
  if (score >= 60) return 'text-green-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-red-500'
}

const DIMENSIONS = [
  { key: 'Market Demand',     analysisKey: 'market_demand_analysis',   scoreKey: 'score_market_demand'     },
  { key: 'Competition',       analysisKey: 'competition_analysis',      scoreKey: 'score_competition'       },
  { key: 'Profit Potential',  analysisKey: 'profit_analysis',           scoreKey: 'score_profit_potential'  },
  { key: 'Scalability',       analysisKey: 'scalability_analysis',      scoreKey: 'score_scalability'       },
  { key: 'Entry Barriers',    analysisKey: 'entry_barriers_analysis',   scoreKey: 'score_entry_barriers'    },
  { key: 'Founder Fit',       analysisKey: 'founder_fit_analysis',      scoreKey: 'score_founder_fit'       },
  { key: 'Timing Factor',     analysisKey: 'timing_analysis',           scoreKey: 'score_timing_factor'     },
  { key: 'Funding Readiness', analysisKey: 'funding_analysis',          scoreKey: 'score_funding_readiness' },
]


const ScoreBar = ({ label, score, analysis }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className={`text-sm font-bold ${SCORE_TEXT(score)}`}>{score}/100</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${SCORE_COLOR(score)}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
        <span className="text-gray-300 text-xs shrink-0">
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      {open && analysis && (
        <p className="mt-3 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
          {analysis}
        </p>
      )}
    </div>
  )
}


const IdeaReport = ({ idea, onDelete }) => {
  const [expanded, setExpanded] = useState(true)
  const verdict = VERDICT_CONFIG[idea.verdict] || VERDICT_CONFIG['caution']

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${verdict.bg}`}>
          <FaLightbulb className={`text-sm ${verdict.text}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{idea.idea_title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(idea.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </p>
        </div>

        {idea.overall_score != null && (
          <div className={`text-center px-4 py-1.5 rounded-full border ${verdict.bg} ${verdict.border}`}>
            <span className={`text-lg font-bold ${verdict.text}`}>{idea.overall_score}</span>
            <span className={`text-xs ml-1 ${verdict.text}`}>/100</span>
          </div>
        )}

        <span className={`hidden sm:block text-xs font-semibold px-3 py-1.5 rounded-full border
          ${verdict.bg} ${verdict.border} ${verdict.text}`}>
          {verdict.label}
        </span>

        {idea.status === 'analyzing' && (
          <span className="text-xs bg-blue-50 text-blue-500 px-2 py-1 rounded-full flex items-center gap-1">
            <FaSpinner className="animate-spin text-xs" /> Analyzing
          </span>
        )}
        {idea.status === 'failed' && (
          <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full">Failed</span>
        )}

        <button
          onClick={e => { e.stopPropagation(); onDelete(idea.id) }}
          className="text-gray-200 hover:text-red-400 transition p-1 shrink-0"
        >
          <FaTrash />
        </button>

        {expanded
          ? <FaChevronUp className="text-gray-300 shrink-0" />
          : <FaChevronDown className="text-gray-300 shrink-0" />
        }
      </div>

      {expanded && idea.status === 'done' && (
        <div className="border-t border-gray-100 p-5 space-y-6">

          <div className={`rounded-xl border p-4 ${verdict.bg} ${verdict.border}`}>
            <p className={`text-sm font-semibold mb-1 ${verdict.text}`}>
              {verdict.label}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">{idea.verdict_summary}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              📊 Dimension Analysis
            </h4>
            <div className="space-y-2">
              {DIMENSIONS.map(d => (
                <ScoreBar
                  key={d.key}
                  label={d.key}
                  score={idea.dimension_scores?.[d.key] ?? 0}
                  analysis={idea[d.analysisKey]}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                <FaExclamationTriangle /> Key Risks
              </h4>
              <ul className="space-y-2">
                {idea.key_risks?.map((risk, i) => (
                  <li key={i} className="flex gap-2 text-sm text-red-600">
                    <span className="mt-1 shrink-0">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <h4 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                <FaStar /> Opportunities
              </h4>
              <ul className="space-y-2">
                {idea.opportunities?.map((opp, i) => (
                  <li key={i} className="flex gap-2 text-sm text-emerald-700">
                    <span className="mt-1 shrink-0">•</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <FaArrowRight /> Next Steps
              </h4>
              <ol className="space-y-2">
                {idea.next_steps?.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-blue-700">
                    <span className="font-bold shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Your Original Idea
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">{idea.idea_description}</p>
          </div>

        </div>
      )}

      {expanded && idea.status === 'failed' && (
        <div className="border-t border-gray-100 p-5">
          <div className="bg-red-50 rounded-xl p-4 flex items-center gap-3">
            <FaTimesCircle className="text-red-400 text-xl shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-600">Analysis failed</p>
              <p className="text-xs text-red-400 mt-0.5">
                {idea.error_message || 'Something went wrong. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}


const IdeaValidation = () => {
  const [ideas, setIdeas]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData]   = useState({
    idea_title: '',
    idea_description: ''
  })

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      const res = await axiosInstance.get('/api/ideas/')
      setIdeas(res.data)
    } catch {
      toast.error('Failed to load ideas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.idea_description.length < 50) {
      toast.error('Please describe your idea in at least 50 characters')
      return
    }
    setSubmitting(true)
    try {
      const res = await axiosInstance.post('/api/ideas/submit/', formData)
      setIdeas([res.data, ...ideas])
      setFormData({ idea_title: '', idea_description: '' })
      setShowForm(false)
      toast.success('Analysis complete!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Analysis failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis?')) return
    try {
      await axiosInstance.delete(`/api/ideas/${id}/`)
      setIdeas(ideas.filter(i => i.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2500} />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <FaLightbulb className="text-purple-600 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Idea Validation Engine</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Describe your idea — AI will research and validate it instantly
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 
                     rounded-xl hover:bg-purple-700 transition text-sm font-medium shadow-sm"
        >
          <FaPlus /> Validate New Idea
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Describe Your Idea
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Be as specific as possible — who the customer is, what problem you solve,
            how you plan to make money. The more detail you give, the better the analysis.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Idea Title
              </label>
              <input
                type="text"
                placeholder="e.g. AI inventory management for restaurants"
                value={formData.idea_title}
                onChange={e => setFormData({ ...formData, idea_title: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2
                           focus:ring-purple-400 focus:outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Describe Your Idea
                <span className="text-gray-300 font-normal ml-1">(min. 50 characters)</span>
              </label>
              <textarea
                placeholder={`Example: "Restaurant owners in India waste 2-3 hours daily managing inventory manually on paper or Excel. I want to build a mobile app that uses AI to predict stock needs based on past orders, auto-generates purchase orders, and sends WhatsApp alerts when stock is low. Target customers are small restaurants with 1-3 locations. Pricing: ₹999/month subscription."`}
                value={formData.idea_description}
                onChange={e => setFormData({ ...formData, idea_description: e.target.value })}
                rows={6}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2
                           focus:ring-purple-400 focus:outline-none text-sm resize-none"
                required
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-300">
                  Include: who the customer is, what problem, how you make money
                </p>
                <p className={`text-xs ${formData.idea_description.length < 50 ? 'text-red-400' : 'text-emerald-500'}`}>
                  {formData.idea_description.length} chars
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 
                           rounded-xl hover:bg-purple-700 transition text-sm font-medium 
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <><FaSpinner className="animate-spin" /> Analyzing with AI...</>
                  : <><FaLightbulb /> Analyze My Idea</>
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
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center gap-3">
                <FaSpinner className="animate-spin text-purple-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    AI is researching your idea...
                  </p>
                  <p className="text-xs text-purple-400 mt-0.5">
                    Analyzing market demand, competition, profit potential and more.
                    This takes 10–20 seconds.
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
          <p className="text-sm">Loading...</p>
        </div>
      ) : ideas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200
                        flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center 
                          justify-center mx-auto mb-4">
            <FaLightbulb className="text-3xl text-purple-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg">No ideas validated yet</p>
          <p className="text-gray-300 text-sm mt-1 max-w-xs">
            Click "Validate New Idea" and describe your startup idea —
            AI will instantly tell you if it's worth pursuing.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5
                       rounded-xl hover:bg-purple-700 transition text-sm font-medium"
          >
            <FaPlus /> Validate Your First Idea
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map(idea => (
            <IdeaReport
              key={idea.id}
              idea={idea}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default IdeaValidation