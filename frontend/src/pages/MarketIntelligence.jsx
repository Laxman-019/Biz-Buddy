import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { FaChartLine, FaPlus, FaTrash, FaChevronDown, FaChevronUp, FaSpinner, FaArrowUp, FaArrowDown, FaMicrochip, FaBalanceScale, FaUsers, FaLightbulb, FaGlobe } from "react-icons/fa";

const REGIONS = [
  { value: "india", label: "🇮🇳 India" },
  { value: "global", label: "🌍 Global" },
  { value: "tier1_cities", label: "🏙️ Tier 1 Cities" },
  { value: "tier2_cities", label: "🏘️ Tier 2 & 3 Cities" },
  { value: "north_india", label: "📍 North India" },
  { value: "south_india", label: "📍 South India" },
  { value: "east_india", label: "📍 East India" },
  { value: "west_india", label: "📍 West India" },
  { value: "southeast_asia", label: "🌏 Southeast Asia" },
  { value: "us", label: "🇺🇸 United States" },
  { value: "europe", label: "🇪🇺 Europe" },
];

const CUSTOMER_TYPES = [
  { value: "b2b", label: "B2B — Business to Business" },
  { value: "b2c", label: "B2C — Business to Consumer" },
  { value: "both", label: "Both B2B and B2C" },
];

const DIRECTION_CONFIG = {
  growing: { label: "📈 Growing", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  stable: { label: "➡️ Stable", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  declining: { label: "📉 Declining", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const AVATAR_COLORS = ["bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600"];

// TAM SAM SOM Funnel
const MarketFunnel = ({ tam_value, sam_value, som_value, tam_explanation, sam_explanation, som_explanation, methodology }) => {
  const [expanded, setExpanded] = useState(null);

  const levels = [
    {
      key: "TAM",
      label: "Total Addressable Market",
      value: tam_value,
      explanation: tam_explanation,
      color: "bg-blue-500",
      light: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      width: "w-full",
    },
    {
      key: "SAM",
      label: "Serviceable Available Market",
      value: sam_value,
      explanation: sam_explanation,
      color: "bg-purple-500",
      light: "bg-purple-50 border-purple-200",
      text: "text-purple-700",
      width: "w-4/5",
    },
    {
      key: "SOM",
      label: "Serviceable Obtainable Market",
      value: som_value,
      explanation: som_explanation,
      color: "bg-emerald-500",
      light: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      width: "w-3/5",
    },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <FaGlobe className="text-blue-500" /> Market Sizing
      </h4>

      {/* Funnel */}
      <div className="flex flex-col items-center gap-1 mb-5">
        {levels.map((l) => (
          <div key={l.key} className={`${l.width} transition-all duration-300`}>
            <button
              onClick={() => setExpanded(expanded === l.key ? null : l.key)}
              className={`w-full rounded-xl px-5 py-3 border flex items-center
                          justify-between transition hover:opacity-90 ${l.light}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md
                  text-white ${l.color}`}
                >
                  {l.key}
                </span>
                <span className={`text-sm font-medium ${l.text}`}>{l.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-base font-bold ${l.text}`}>{l.value}</span>
                {expanded === l.key ? <FaChevronUp className="text-xs text-gray-400" /> : <FaChevronDown className="text-xs text-gray-400" />}
              </div>
            </button>
            {expanded === l.key && (
              <div
                className={`mx-2 px-4 py-3 rounded-b-xl border-x border-b
                text-sm text-gray-600 leading-relaxed ${l.light}`}
              >
                {l.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Methodology */}
      {methodology && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Methodology</p>
          <p className="text-sm text-gray-500 leading-relaxed">{methodology}</p>
        </div>
      )}
    </div>
  );
};

// Trend Section
const TrendSection = ({ market_growth_rate, market_direction, trend_summary, tailwinds, headwinds, tech_shifts, regulatory_factors, consumer_shifts }) => {
  const direction = DIRECTION_CONFIG[market_direction] || DIRECTION_CONFIG["stable"];

  const groups = [
    {
      label: "🌬️ Tailwinds",
      items: tailwinds,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-400",
    },
    {
      label: "⛔ Headwinds",
      items: headwinds,
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-700",
      dot: "bg-red-400",
    },
    {
      label: "💻 Tech Shifts",
      items: tech_shifts,
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      dot: "bg-blue-400",
    },
    {
      label: "⚖️ Regulatory",
      items: regulatory_factors,
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      text: "text-yellow-700",
      dot: "bg-yellow-400",
    },
    {
      label: "👥 Consumer Shifts",
      items: consumer_shifts,
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-700",
      dot: "bg-purple-400",
    },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <FaChartLine className="text-purple-500" /> Trend Analysis
      </h4>

      {/* Direction + Growth */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm
          font-semibold ${direction.bg} ${direction.border} ${direction.text}`}
        >
          {direction.label}
        </div>
        {market_growth_rate && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl border
            bg-gray-50 border-gray-200 text-sm font-semibold text-gray-700"
          >
            📊 {market_growth_rate}
          </div>
        )}
      </div>

      {/* Summary */}
      {trend_summary && (
        <p
          className="text-sm text-gray-500 leading-relaxed mb-5 bg-gray-50
          border border-gray-100 rounded-xl p-4"
        >
          {trend_summary}
        </p>
      )}

      {/* Trend Groups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {groups
          .filter((g) => g.items?.length > 0)
          .map((g) => (
            <div key={g.label} className={`rounded-xl border p-4 ${g.bg} ${g.border}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${g.text}`}>{g.label}</p>
              <ul className="space-y-2">
                {g.items.map((item, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${g.dot}`} />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};

// Persona Card
const PersonaCard = ({ persona, colorClass }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition text-left">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center
          font-bold text-lg shrink-0 ${colorClass}`}
        >
          {persona.persona_name?.[0] || "P"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">{persona.persona_name}</p>
          <p className="text-xs text-gray-400 truncate">{persona.persona_title}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-500">{persona.age_range}</p>
          <p className="text-xs text-gray-400">{persona.location}</p>
        </div>
        {open ? <FaChevronUp className="text-gray-300 shrink-0" /> : <FaChevronDown className="text-gray-300 shrink-0" />}
      </button>

      {/* Detail */}
      {open && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Job Title", value: persona.job_title },
              { label: "Income", value: persona.income },
              { label: "Education", value: persona.education },
              { label: "Will Pay", value: persona.willingness_to_pay },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Goals */}
          {persona.goals?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">🎯 Goals</p>
              <ul className="space-y-1">
                {persona.goals.map((g, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pain Points */}
          {persona.pain_points?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">😤 Pain Points</p>
              <ul className="space-y-1">
                {persona.pain_points.map((p, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-yellow-600 mb-1">🔧 Currently Uses</p>
              <p className="text-sm text-gray-600">{persona.current_solutions}</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-600 mb-1">⚡ Buying Trigger</p>
              <p className="text-sm text-gray-600">{persona.buying_trigger}</p>
            </div>
          </div>

          {/* Channels */}
          {persona.channels?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">📡 Discovery Channels</p>
              <div className="flex flex-wrap gap-2">
                {persona.channels.map((c, i) => (
                  <span
                    key={i}
                    className="text-xs bg-purple-50 text-purple-600
                    border border-purple-100 px-2.5 py-1 rounded-full"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Objections */}
          {persona.objections?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2">🚫 Objections</p>
              <ul className="space-y-1">
                {persona.objections.map((o, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Full Report Card
const MarketReport = ({ report, onDelete }) => {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const TABS = ["Market Sizing", "Trend Analysis", "Customer Personas"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition" onClick={() => setExpanded(!expanded)}>
        <div
          className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center
          justify-center shrink-0"
        >
          <FaChartLine className="text-cyan-600" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{report.product_name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {report.industry} · {REGIONS.find((r) => r.value === report.target_region)?.label}· {CUSTOMER_TYPES.find((c) => c.value === report.customer_type)?.label}
          </p>
        </div>

        {/* Growth rate badge */}
        {report.market_growth_rate && (
          <span
            className="hidden sm:block text-xs font-semibold px-3 py-1.5
            rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700"
          >
            📊 {report.market_growth_rate}
          </span>
        )}

        {/* SAM badge */}
        {report.sam_value && (
          <span
            className="hidden sm:block text-xs font-semibold px-3 py-1.5
            rounded-full bg-purple-50 border border-purple-200 text-purple-700"
          >
            SAM {report.sam_value}
          </span>
        )}

        {/* Status */}
        {report.status === "analyzing" && (
          <span
            className="text-xs bg-blue-50 text-blue-500 px-2 py-1
            rounded-full flex items-center gap-1"
          >
            <FaSpinner className="animate-spin text-xs" /> Analyzing
          </span>
        )}
        {report.status === "failed" && <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full">Failed</span>}

        <p className="text-xs text-gray-300 shrink-0">
          {new Date(report.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(report.id);
          }}
          className="text-gray-200 hover:text-red-400 transition p-1 shrink-0"
        >
          <FaTrash />
        </button>

        {expanded ? <FaChevronUp className="text-gray-300 shrink-0" /> : <FaChevronDown className="text-gray-300 shrink-0" />}
      </div>

      {expanded && report.status === "done" && (
        <div className="border-t border-gray-100">
          {/* Market Summary */}
          <div className="p-5 pb-0">
            <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-cyan-600 mb-1">Market Overview</p>
              <p className="text-sm text-gray-600 leading-relaxed">{report.market_summary}</p>
            </div>

            {report.key_insights?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {report.key_insights.map((insight, i) => (
                  <div
                    key={i}
                    className="flex gap-2 bg-gray-50 border border-gray-100
                    rounded-xl p-3"
                  >
                    <FaLightbulb className="text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">{insight}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex border-b border-gray-100 px-5">
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`py-3 px-4 text-sm font-medium transition border-b-2
                  ${activeTab === i ? "border-cyan-500 text-cyan-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === 0 && (
              <MarketFunnel
                tam_value={report.tam_value}
                sam_value={report.sam_value}
                som_value={report.som_value}
                tam_explanation={report.tam_explanation}
                sam_explanation={report.sam_explanation}
                som_explanation={report.som_explanation}
                methodology={report.sizing_methodology}
              />
            )}
            {activeTab === 1 && (
              <TrendSection
                market_growth_rate={report.market_growth_rate}
                market_direction={report.market_direction}
                trend_summary={report.trend_summary}
                tailwinds={report.tailwinds}
                headwinds={report.headwinds}
                tech_shifts={report.tech_shifts}
                regulatory_factors={report.regulatory_factors}
                consumer_shifts={report.consumer_shifts}
              />
            )}
            {activeTab === 2 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaUsers className="text-cyan-500" /> Customer Personas
                </h4>
                <div className="space-y-3">
                  {report.personas?.map((persona, i) => (
                    <PersonaCard key={i} persona={persona} colorClass={AVATAR_COLORS[i % AVATAR_COLORS.length]} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {expanded && report.status === "failed" && (
        <div className="border-t border-gray-100 p-5">
          <div className="bg-red-50 rounded-xl p-4 text-sm text-red-600">Analysis failed: {report.error_message || "Please try again."}</div>
        </div>
      )}
    </div>
  );
};

const REPORTS_STORAGE_KEY = "market_intelligence_reports";

const MarketIntelligence = () => {
  const [reports, setReports] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (err) {
          console.warn("Failed to parse cached market reports", err);
        }
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    industry: "",
    target_region: "india",
    customer_type: "b2c",
    description: "",
  });

  const cacheReports = (data) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(data));
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axiosInstance.get("/api/market/");
      console.log("API Response:", res.data);
      const reportsData = Array.isArray(res.data) ? res.data : res.data?.results && Array.isArray(res.data.results) ? res.data.results : [];

      if (reportsData.length > 0 || reports.length === 0) {
        setReports(reportsData);
        cacheReports(reportsData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load reports");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.description.length < 30) {
      toast.error("Please add more description (min 30 characters)");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/api/market/submit/", formData);
      const newReport = res.data;
      setReports((prevReports) => {
        const updated = [newReport, ...prevReports];
        cacheReports(updated);
        return updated;
      });
      setFormData({
        product_name: "",
        industry: "",
        target_region: "india",
        customer_type: "b2c",
        description: "",
      });
      setShowForm(false);
      toast.success("Market analysis complete!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err?.response?.data?.error || "Analysis failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this market report?")) return;
    try {
      await axiosInstance.delete(`/api/market/${id}/`);
      const updated = reports.filter((r) => r.id !== id);
      setReports(updated);
      cacheReports(updated);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2500} />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
            <FaChartLine className="text-cyan-600 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Market Intelligence</h1>
            <p className="text-sm text-gray-400 mt-0.5">AI-powered market sizing, trends and customer personas</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2.5
                     rounded-xl hover:bg-cyan-700 transition text-sm font-medium shadow-sm"
        >
          <FaPlus /> Analyze Market
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-cyan-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Tell us about your product</h3>
          <p className="text-sm text-gray-400 mb-5">AI will research the market size, current trends, and build customer personas specific to your product and region.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Product / Service Name</label>
                <input
                  type="text"
                  placeholder="e.g. AI inventory app for restaurants"
                  value={formData.product_name}
                  onChange={set("product_name")}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Industry / Sector</label>
                <input
                  type="text"
                  placeholder="e.g. Food & Beverage Technology"
                  value={formData.industry}
                  onChange={set("industry")}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Target Region</label>
                <select
                  value={formData.target_region}
                  onChange={set("target_region")}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  {REGIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Customer Type</label>
                <select
                  value={formData.customer_type}
                  onChange={set("customer_type")}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  {CUSTOMER_TYPES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Brief Description
                  <span className="text-gray-300 font-normal ml-1">(min 30 chars)</span>
                </label>
                <textarea
                  placeholder="Describe your product and who it's for. e.g. A mobile app that helps restaurant owners manage inventory using AI — targeting small restaurants with 1-3 locations in Indian Tier 2 cities."
                  value={formData.description}
                  onChange={set("description")}
                  rows={3}
                  className="w-full border border-gray-300 p-3 rounded-xl text-sm
                             resize-none focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  required
                />
                <p
                  className={`text-xs mt-1 text-right
                  ${formData.description.length < 30 ? "text-red-400" : "text-emerald-500"}`}
                >
                  {formData.description.length} chars
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-cyan-600 text-white px-6 py-2.5
                           rounded-xl hover:bg-cyan-700 transition text-sm font-medium
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> Analyzing Market...
                  </>
                ) : (
                  <>
                    <FaChartLine /> Generate Market Report
                  </>
                )}
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
              <div
                className="bg-cyan-50 border border-cyan-100 rounded-xl p-4
                flex items-center gap-3"
              >
                <FaSpinner className="animate-spin text-cyan-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-cyan-700">AI is researching your market...</p>
                  <p className="text-xs text-cyan-400 mt-0.5">Building market sizing, trend analysis and customer personas. This takes 15–25 seconds.</p>
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
      ) : reports.length === 0 ? (
        <div
          className="bg-white rounded-2xl border border-dashed border-gray-200
                        flex flex-col items-center justify-center py-20 text-center"
        >
          <div
            className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center
                          justify-center mx-auto mb-4"
          >
            <FaChartLine className="text-3xl text-cyan-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg">No market reports yet</p>
          <p className="text-gray-300 text-sm mt-1 max-w-xs">Click "Analyze Market" — AI will research your market size, trends, and build customer personas instantly.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 bg-cyan-600 text-white px-5 py-2.5
                       rounded-xl hover:bg-cyan-700 transition text-sm font-medium"
          >
            <FaPlus /> Generate First Report
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <MarketReport key={report.id} report={report} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence;
