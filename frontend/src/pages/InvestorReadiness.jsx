import React, { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'
import {
  FaHandshake, FaPlus, FaTrash, FaChevronDown, FaChevronUp,
  FaSpinner, FaLightbulb, FaExclamationTriangle, FaCheckCircle,
  FaTimesCircle, FaEnvelope, FaCopy, FaUsers, FaStar,
  FaLinkedin, FaTwitter
} from 'react-icons/fa'


const FUNDING_STAGES = [
  { value: 'pre_seed', label: '🌱 Pre-seed' },
  { value: 'seed', label: '🌿 Seed' },
  { value: 'series_a', label: '🚀 Series A' },
]

const COMPANY_STAGES = [
  { value: 'idea', label: '💡 Idea Stage' },
  { value: 'mvp', label: '🛠 MVP Built' },
  { value: 'revenue', label: '💰 Early Revenue' },
  { value: 'growth', label: '📈 Growing Revenue' },
]

const PITCH_VERDICT_CONFIG = {
  investor_ready: { label: 'Investor Ready ✅',  bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  nearly_ready: { label: 'Nearly Ready 🟡',   bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700'  },
  needs_work: { label: 'Needs Work ⚠️', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700'  },
  not_ready: { label: 'Not Ready ❌', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700'     },
} 

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', bg: 'bg-red-100', text: 'text-red-700'    },
  high: { label: 'High', bg: 'bg-orange-100', text: 'text-orange-700' },
  medium: { label: 'Medium', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  low: { label: 'Low', bg: 'bg-gray-100',   text: 'text-gray-600'   },
}

const INVESTOR_TYPE_CONFIG = {
  vc: { label: 'VC Fund', bg: 'bg-purple-100', text: 'text-purple-700' },
  angel: { label: 'Angel', bg: 'bg-blue-100', text: 'text-blue-700'   },
  family_office: { label: 'Family Office', bg: 'bg-green-100', text: 'text-green-700'  },
  accelerator: { label: 'Accelerator', bg: 'bg-orange-100', text: 'text-orange-700' },
}

const SLIDE_COLORS = [
  'border-red-200    bg-red-50',
  'border-blue-200   bg-blue-50',
  'border-purple-200 bg-purple-50',
  'border-cyan-200   bg-cyan-50',
  'border-green-200  bg-green-50',
  'border-yellow-200 bg-yellow-50',
  'border-emerald-200 bg-emerald-50',
  'border-gray-200   bg-gray-50',
  'border-indigo-200 bg-indigo-50',
  'border-pink-200   bg-pink-50',
]

const SLIDE_TEXT = [
  'text-red-700', 'text-blue-700', 'text-purple-700', 'text-cyan-700',
  'text-green-700', 'text-yellow-700', 'text-emerald-700', 'text-gray-700',
  'text-indigo-700', 'text-pink-700',
]

const DD_PRESET_ITEMS = [
  'incorporation_docs', 'cap_table', 'ip_assignments',
  'bank_statements', 'tax_returns', 'financial_projections',
  'product_roadmap', 'user_analytics', 'team_resumes',
  'employment_agreements', 'customer_contracts', 'nda_agreements',
]


const PitchDeckTab = ({ rec }) => {
  const [activeSlide, setActiveSlide] = useState(0)
  const verdict = PITCH_VERDICT_CONFIG[rec.pitch_verdict]
    || PITCH_VERDICT_CONFIG['needs_work']

  return (
    <div className="space-y-5">

      
      <div className={`rounded-xl border p-4 ${verdict.bg} ${verdict.border}`}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider
            ${verdict.text}`}>
            Pitch Assessment
          </span>
          <div className="flex items-center gap-3">
            {rec.pitch_score != null && (
              <span className={`text-lg font-bold ${verdict.text}`}>
                {rec.pitch_score}/100
              </span>
            )}
            <span className={`text-xs font-bold px-3 py-1 rounded-full border
              ${verdict.bg} ${verdict.border} ${verdict.text}`}>
              {verdict.label}
            </span>
          </div>
        </div>
        {rec.pitch_score != null && (
          <div className="w-full bg-white bg-opacity-60 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                rec.pitch_score >= 75 ? 'bg-emerald-500' :
                rec.pitch_score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${rec.pitch_score}%` }}
            />
          </div>
        )}
        <p className="text-sm text-gray-600 leading-relaxed">{rec.pitch_summary}</p>
      </div>


      {rec.pitch_slides?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            📊 10-Slide Pitch Deck
          </p>


          <div className="flex gap-1.5 flex-wrap mb-4">
            {rec.pitch_slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg
                  transition border ${
                  activeSlide === i
                    ? `${SLIDE_COLORS[i]} ${SLIDE_TEXT[i]} font-bold`
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {slide.slide_number}. {slide.slide_title}
              </button>
            ))}
          </div>

          
          {rec.pitch_slides[activeSlide] && (() => {
            const slide = rec.pitch_slides[activeSlide]
            const i     = activeSlide
            return (
              <div className={`rounded-2xl border p-6 ${SLIDE_COLORS[i]}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-2xl font-bold opacity-30 ${SLIDE_TEXT[i]}`}>
                    {String(slide.slide_number).padStart(2, '0')}
                  </span>
                  <h3 className={`text-lg font-bold ${SLIDE_TEXT[i]}`}>
                    {slide.slide_title}
                  </h3>
                </div>


                <div className="bg-white bg-opacity-70 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {slide.content}
                  </p>
                </div>


                {slide.tip && (
                  <div className="flex gap-2 items-start">
                    <FaLightbulb className={`shrink-0 mt-0.5 ${SLIDE_TEXT[i]}`} />
                    <p className={`text-xs leading-relaxed ${SLIDE_TEXT[i]}`}>
                      <strong>Tip:</strong> {slide.tip}
                    </p>
                  </div>
                )}


                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setActiveSlide(Math.max(0, i - 1))}
                    disabled={i === 0}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white
                      bg-opacity-60 disabled:opacity-30 hover:bg-opacity-80
                      transition font-medium text-gray-600"
                  >
                    ← Prev
                  </button>
                  <span className={`text-xs font-medium ${SLIDE_TEXT[i]}`}>
                    {i + 1} / {rec.pitch_slides.length}
                  </span>
                  <button
                    onClick={() => setActiveSlide(
                      Math.min(rec.pitch_slides.length - 1, i + 1)
                    )}
                    disabled={i === rec.pitch_slides.length - 1}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white
                      bg-opacity-60 disabled:opacity-30 hover:bg-opacity-80
                      transition font-medium text-gray-600"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      )}


      {rec.investor_questions?.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-orange-600 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaExclamationTriangle /> Tough Questions Investors Will Ask
          </p>
          <ul className="space-y-2">
            {rec.investor_questions.map((q, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-orange-400 font-bold shrink-0">Q{i+1}.</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}


      {rec.storytelling_tips?.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaStar /> Storytelling Tips
          </p>
          <ul className="space-y-2">
            {rec.storytelling_tips.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-blue-400 font-bold shrink-0">{i+1}.</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const InvestorListTab = ({ rec }) => {
  const [copied, setCopied] = useState(false)
  const [openInv, setOpenInv] = useState(null)

  const copyTemplate = () => {
    navigator.clipboard.writeText(rec.outreach_template)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">


      {rec.investor_list?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaUsers /> Matched Investors ({rec.investor_list.length})
          </p>
          <div className="space-y-2">
            {rec.investor_list.map((inv, i) => {
              const typeConfig = INVESTOR_TYPE_CONFIG[inv.type]
                || INVESTOR_TYPE_CONFIG['angel']
              const isOpen = openInv === i

              return (
                <div key={i}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden">


                  <button
                    onClick={() => setOpenInv(isOpen ? null : i)}
                    className="w-full flex items-center gap-3 p-4
                      hover:bg-gray-50 transition text-left"
                  >

                    <div className="w-10 h-10 rounded-full bg-linear-to-br
                      from-indigo-400 to-purple-500 flex items-center justify-center
                      text-white font-bold text-sm shrink-0">
                      {inv.name?.[0] || 'I'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm">
                          {inv.name}
                        </p>
                        <span className={`text-xs font-medium px-2 py-0.5
                          rounded-full ${typeConfig.bg} ${typeConfig.text}`}>
                          {typeConfig.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {inv.fund && `${inv.fund} · `}
                        {inv.stage_focus} · {inv.typical_check_size}
                      </p>
                    </div>

                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-xs text-gray-400">Check Size</p>
                      <p className="text-xs font-semibold text-gray-700">
                        {inv.typical_check_size}
                      </p>
                    </div>

                    {isOpen
                      ? <FaChevronUp className="text-gray-300 shrink-0" />
                      : <FaChevronDown className="text-gray-300 shrink-0" />
                    }
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 p-4 space-y-4">

                      <div className="bg-emerald-50 border border-emerald-100
                        rounded-xl p-3">
                        <p className="text-xs font-semibold text-emerald-600 mb-1">
                          ✅ Why Good Fit
                        </p>
                        <p className="text-sm text-gray-600">
                          {inv.why_good_fit}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">


                        {inv.focus_industries?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-400
                              uppercase tracking-wider mb-2">
                              Focus Areas
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {inv.focus_industries.map((ind, j) => (
                                <span key={j} className="text-xs bg-gray-100
                                  text-gray-600 px-2 py-0.5 rounded-full">
                                  {ind}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}


                        {inv.portfolio_relevant?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-400
                              uppercase tracking-wider mb-2">
                              Relevant Portfolio
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {inv.portfolio_relevant.map((p, j) => (
                                <span key={j} className="text-xs bg-purple-50
                                  text-purple-600 px-2 py-0.5 rounded-full
                                  border border-purple-100">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>


                      <div className="bg-blue-50 border border-blue-100
                        rounded-xl p-3">
                        <p className="text-xs font-semibold text-blue-600 mb-1">
                          📬 How to Approach
                        </p>
                        <p className="text-sm text-gray-600">
                          {inv.approach_strategy}
                        </p>
                      </div>

                      
                      {inv.linkedin_or_twitter && (
                        <p className="text-xs text-gray-400 flex items-center gap-2">
                          <FaLinkedin className="text-blue-500" />
                          {inv.linkedin_or_twitter}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}


      {rec.outreach_template && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3
            border-b border-gray-200 bg-white">
            <p className="text-xs font-semibold text-gray-600 flex items-center gap-2">
              <FaEnvelope /> Cold Email Template
            </p>
            <button
              onClick={copyTemplate}
              className="flex items-center gap-1.5 text-xs text-indigo-600
                hover:text-indigo-800 font-medium transition"
            >
              <FaCopy />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="p-4 text-xs text-gray-700 leading-relaxed
            whitespace-pre-wrap font-sans">
            {rec.outreach_template}
          </pre>
        </div>
      )}

      
      {rec.warm_intro_strategy && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-purple-600 uppercase
            tracking-wider mb-2">
            🤝 Warm Intro Strategy
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {rec.warm_intro_strategy}
          </p>
        </div>
      )}


      {rec.investor_tips?.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaLightbulb /> Outreach Tips
          </p>
          <ul className="space-y-2">
            {rec.investor_tips.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-blue-400 font-bold shrink-0">{i+1}.</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const DueDiligenceTab = ({ rec }) => {
  const [openCat, setOpenCat] = useState(null)

  
  const totalItems = rec.dd_checklist?.reduce(
    (sum, cat) => sum + (cat.items?.length || 0), 0
  ) || 0
  const completedItems = rec.dd_checklist?.reduce(
    (sum, cat) => sum + (cat.items?.filter(i => i.completed)?.length || 0), 0
  ) || 0
  const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="space-y-5">

      
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase
              tracking-wider mb-1">
              Due Diligence Readiness
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {completedItems}
              <span className="text-base font-normal text-gray-400">
                /{totalItems} items ready
              </span>
            </p>
          </div>
          {rec.dd_score != null && (
            <div className={`text-center px-4 py-2 rounded-xl border ${
              rec.dd_score >= 70
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : rec.dd_score >= 50
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <p className="text-xl font-bold">{rec.dd_score}</p>
              <p className="text-xs">/100</p>
            </div>
          )}
        </div>


        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${
              pct >= 70 ? 'bg-emerald-500' :
              pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{pct}% complete</span>
          <span className="text-xs text-gray-400">
            {totalItems - completedItems} remaining
          </span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mt-3">
          {rec.dd_summary}
        </p>
      </div>


      {rec.dd_priority_items?.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-600 uppercase
            tracking-wider mb-3 flex items-center gap-2">
            <FaExclamationTriangle /> Priority — Fix These First
          </p>
          <ul className="space-y-2">
            {rec.dd_priority_items.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-red-500 font-bold shrink-0">{i+1}.</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}


      {rec.dd_checklist?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase
            tracking-wider mb-3">
            📋 Full Checklist
          </p>
          <div className="space-y-2">
            {rec.dd_checklist.map((cat, i) => {
              const isOpen = openCat === i
              const catTotal = cat.items?.length || 0
              const catDone = cat.items?.filter(item => item.completed)?.length || 0
              const catPct = catTotal > 0
                ? Math.round((catDone / catTotal) * 100) : 0

              return (
                <div key={i}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden">


                  <button
                    onClick={() => setOpenCat(isOpen ? null : i)}
                    className="w-full flex items-center gap-3 p-4
                      hover:bg-gray-50 transition text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-sm font-semibold text-gray-800">
                          {cat.category}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5
                          rounded-full ${
                          catPct === 100
                            ? 'bg-emerald-100 text-emerald-700'
                            : catPct >= 50
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-600'
                        }`}>
                          {catDone}/{catTotal}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            catPct === 100 ? 'bg-emerald-500' :
                            catPct >= 50   ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${catPct}%` }}
                        />
                      </div>
                    </div>
                    {isOpen
                      ? <FaChevronUp className="text-gray-300 shrink-0" />
                      : <FaChevronDown className="text-gray-300 shrink-0" />
                    }
                  </button>


                  {isOpen && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50">
                      {cat.items?.map((item, j) => {
                        const priority = PRIORITY_CONFIG[item.priority]
                          || PRIORITY_CONFIG['medium']
                        return (
                          <div key={j} className="p-4">
                            <div className="flex items-start gap-3">
                              {item.completed
                                ? <FaCheckCircle className="text-emerald-500
                                    shrink-0 mt-0.5 text-base" />
                                : <FaTimesCircle className="text-gray-300
                                    shrink-0 mt-0.5 text-base" />
                              }
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className={`text-sm font-medium ${
                                    item.completed
                                      ? 'text-gray-400 line-through'
                                      : 'text-gray-800'
                                  }`}>
                                    {item.item}
                                  </p>
                                  <span className={`text-xs font-medium px-2
                                    py-0.5 rounded-full ${priority.bg}
                                    ${priority.text}`}>
                                    {priority.label}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {item.description}
                                </p>
                                {!item.completed && item.how_to_prepare && (
                                  <div className="mt-2 flex gap-2 bg-blue-50
                                    border border-blue-100 rounded-lg p-2">
                                    <FaLightbulb className="text-blue-400
                                      shrink-0 mt-0.5 text-xs" />
                                    <p className="text-xs text-blue-600">
                                      {item.how_to_prepare}
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
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rec.dd_red_flags?.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              🚩 Red Flags to Avoid
            </p>
            <ul className="space-y-2">
              {rec.dd_red_flags.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-red-400 mt-1 shrink-0">•</span>{f}
                </li>
              ))}
            </ul>
          </div>
        )}
        {rec.dd_preparation_tips?.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase
              tracking-wider mb-3 flex items-center gap-2">
              <FaLightbulb /> Preparation Tips
            </p>
            <ul className="space-y-2">
              {rec.dd_preparation_tips.map((t, i) => (
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


const InvestorCard = ({ rec, onDelete }) => {
  const [expanded, setExpanded]   = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const TABS = ['Pitch Deck', 'Investor List', 'Due Diligence']
  const verdict = PITCH_VERDICT_CONFIG[rec.pitch_verdict]
    || PITCH_VERDICT_CONFIG['needs_work']

  const totalDD    = rec.dd_checklist?.reduce(
    (s, c) => s + (c.items?.length || 0), 0
  ) || 0
  const completedDD = rec.dd_checklist?.reduce(
    (s, c) => s + (c.items?.filter(i => i.completed)?.length || 0), 0
  ) || 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">


      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
          shrink-0 ${verdict.bg}`}>
          <FaHandshake className={`text-sm ${verdict.text}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">
            {rec.idea_title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {FUNDING_STAGES.find(s => s.value === rec.funding_stage)?.label}
            {' · '}₹{Number(rec.amount_raising).toLocaleString('en-IN')} raise
          </p>
        </div>

        {rec.pitch_score != null && (
          <div className={`text-center px-3 py-1.5 rounded-full border
            ${verdict.bg} ${verdict.border}`}>
            <span className={`text-base font-bold ${verdict.text}`}>
              {rec.pitch_score}
            </span>
            <span className={`text-xs ml-0.5 ${verdict.text}`}>/100</span>
          </div>
        )}


        <span className={`hidden sm:block text-xs font-semibold px-3 py-1.5
          rounded-full border ${verdict.bg} ${verdict.border} ${verdict.text}`}>
          {verdict.label}
        </span>


        <span className="hidden sm:block text-xs font-semibold px-3 py-1.5
          rounded-full bg-gray-50 border border-gray-200 text-gray-600">
          DD {completedDD}/{totalDD}
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
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === 0 && <PitchDeckTab rec={rec} />}
            {activeTab === 1 && <InvestorListTab rec={rec} />}
            {activeTab === 2 && <DueDiligenceTab rec={rec} />}
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

const InvestorReadiness = () => {
  const [records, setRecords] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    idea_id:          '',
    funding_stage:    'seed',
    amount_raising:   '',
    team_description: '',
    traction_so_far:  '',
    company_stage:    'mvp',
    completed_items:  [],
  })

  useEffect(() => {
    Promise.all([fetchRecords(), fetchIdeas()])
      .finally(() => setLoading(false))
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get('/api/investor/')
      setRecords(res.data)
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

  const toggleCompletedItem = (item) => {
    const items = formData.completed_items
    setFormData({
      ...formData,
      completed_items: items.includes(item)
        ? items.filter(i => i !== item)
        : [...items, item],
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.idea_id) { toast.error('Please select an idea'); return }
    if (!formData.team_description.trim()) {
      toast.error('Please describe your team'); return
    }
    setSubmitting(true)
    try {
      const res = await axiosInstance.post(
        '/api/investor/submit/', formData
      )
      setRecords([res.data, ...records])
      setFormData({
        idea_id: '', funding_stage: 'seed', amount_raising: '',
        team_description: '', traction_so_far: '',
        company_stage: 'mvp', completed_items: [],
      })
      setShowForm(false)
      toast.success('Investor readiness report generated!')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Analysis failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return
    try {
      await axiosInstance.delete(`/api/investor/${id}/`)
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
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center
            justify-center">
            <FaHandshake className="text-red-600 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Investor Readiness</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Pitch Deck · Investor List · Due Diligence — AI generated
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2.5
                     rounded-xl hover:bg-red-600 transition text-sm font-medium shadow-sm"
        >
          <FaPlus /> Prepare for Investors
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-red-100
          p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Investor Readiness Analysis
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Fill in your details — AI will build your pitch deck, find matched
            investors, and generate a due diligence checklist.
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
                             focus:ring-2 focus:ring-red-400 focus:outline-none"
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
                  Funding Stage
                </label>
                <select
                  value={formData.funding_stage}
                  onChange={set('funding_stage')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-red-400 focus:outline-none"
                >
                  {FUNDING_STAGES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Company Stage
                </label>
                <select
                  value={formData.company_stage}
                  onChange={set('company_stage')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-red-400 focus:outline-none"
                >
                  {COMPANY_STAGES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Amount Raising (₹)
                </label>
                <input
                  type="number" min="0"
                  placeholder="e.g. 5000000"
                  value={formData.amount_raising}
                  onChange={set('amount_raising')}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-red-400 focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Founding Team
                </label>
                <textarea
                  placeholder="e.g. 2 founders — CEO with 5 years in F&B ops, CTO with 8 years building SaaS products. Previously worked at Zomato and Razorpay."
                  value={formData.team_description}
                  onChange={set('team_description')}
                  rows={3}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             resize-none focus:ring-2 focus:ring-red-400 focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Traction So Far
                  <span className="text-gray-300 font-normal ml-1">
                    (users, revenue, pilots, partnerships)
                  </span>
                </label>
                <textarea
                  placeholder="e.g. 3 pilot restaurants, 200 daily active users, ₹15K MRR, LOI from 2 restaurant chains"
                  value={formData.traction_so_far}
                  onChange={set('traction_so_far')}
                  rows={2}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             resize-none focus:ring-2 focus:ring-red-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-3">
                Due Diligence — What have you already prepared?
                <span className="text-gray-300 font-normal ml-1">(check all that apply)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DD_PRESET_ITEMS.map((item) => (
                  <label key={item}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl
                      border cursor-pointer transition text-xs font-medium ${
                      formData.completed_items.includes(item)
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                    }`}>
                    <input
                      type="checkbox"
                      checked={formData.completed_items.includes(item)}
                      onChange={() => toggleCompletedItem(item)}
                      className="accent-emerald-600 w-3.5 h-3.5"
                    />
                    {item.replace(/_/g, ' ')
                      .replace(/\b\w/g, c => c.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting || ideas.length === 0}
                className="flex items-center gap-2 bg-red-500 text-white px-6 py-2.5
                           rounded-xl hover:bg-red-600 transition text-sm font-medium
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <><FaSpinner className="animate-spin" /> Generating...</>
                  : <><FaHandshake /> Generate Investor Report</>
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
              <div className="bg-red-50 border border-red-100 rounded-xl p-4
                flex items-center gap-3">
                <FaSpinner className="animate-spin text-red-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-700">
                    AI is preparing your investor package...
                  </p>
                  <p className="text-xs text-red-400 mt-0.5">
                    Building pitch deck, finding matched investors and DD checklist.
                    This takes 25–35 seconds.
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
          <p className="text-sm">Loading reports...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200
                        flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
            <FaHandshake className="text-3xl text-red-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg">
            No investor reports yet
          </p>
          <p className="text-gray-300 text-sm mt-1 max-w-xs">
            Fill in your team and traction — AI will build your pitch deck,
            find matched investors and a full DD checklist.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 bg-red-500 text-white
                       px-5 py-2.5 rounded-xl hover:bg-red-600 transition
                       text-sm font-medium"
          >
            <FaPlus /> Generate First Report
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(rec => (
            <InvestorCard
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

export default InvestorReadiness;