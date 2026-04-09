import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  FaLightbulb,
  FaChartLine,
  FaCubes,
  FaRocket,
  FaChartPie,
  FaHandshake,
  FaBullhorn,
  FaBolt,
  FaUsers,
  FaShieldAlt,
  FaSpinner,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaFire,
  FaLock,
} from "react-icons/fa";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const FEATURES = [
  {
    id: "idea-validation",
    label: "Idea Validation",
    icon: <FaLightbulb />,
    color: "#8B5CF6",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    endpoint: "/api/ideas/",
    scoreKey: "overall_score",
    verdictKey: "verdict",
    statusKey: "status",
    verdictMap: {
      strong_go: { label: "Strong GO", color: "text-emerald-600" },
      go: { label: "GO", color: "text-green-600" },
      caution: { label: "Caution", color: "text-yellow-600" },
      no_go: { label: "NO-GO", color: "text-red-600" },
      pivot: { label: "Pivot", color: "text-orange-600" },
    },
  },
  {
    id: "market-intel",
    label: "Market Intelligence",
    icon: <FaChartLine />,
    color: "#0891B2",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    endpoint: "/api/startups/market/",
    scoreKey: null,
    verdictKey: "market_direction",
    statusKey: "status",
    verdictMap: {
      growing: { label: "Growing", color: "text-emerald-600" },
      stable: { label: "Stable", color: "text-blue-600" },
      declining: { label: "Declining", color: "text-red-600" },
    },
  },
  {
    id: "business-model",
    label: "Business Model",
    icon: <FaCubes />,
    color: "#059669",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    endpoint: "/api/business-model/",
    scoreKey: "business_model_score",
    verdictKey: "overall_verdict",
    statusKey: "status",
    verdictMap: {
      strong: { label: "Strong", color: "text-emerald-600" },
      good: { label: "Good", color: "text-green-600" },
      moderate: { label: "Moderate", color: "text-yellow-600" },
      weak: { label: "Weak", color: "text-orange-600" },
      unviable: { label: "Unviable", color: "text-red-600" },
    },
  },
  {
    id: "mvp-planner",
    label: "MVP Planning",
    icon: <FaRocket />,
    color: "#D97706",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    endpoint: "/api/mvp/",
    scoreKey: "mvp_score",
    verdictKey: "mvp_verdict",
    statusKey: "status",
    verdictMap: {
      excellent: { label: "Excellent", color: "text-emerald-600" },
      good: { label: "Good", color: "text-green-600" },
      tight: { label: "Tight", color: "text-yellow-600" },
      risky: { label: "Risky", color: "text-orange-600" },
      unrealistic: { label: "Unrealistic", color: "text-red-600" },
    },
  },
  {
    id: "financials",
    label: "Financials",
    icon: <FaChartPie />,
    color: "#7C3AED",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    endpoint: "/api/financials/",
    scoreKey: "funding_score",
    verdictKey: "runway_status",
    statusKey: "status",
    verdictMap: {
      comfortable: { label: "Comfortable", color: "text-emerald-600" },
      healthy: { label: "Healthy", color: "text-green-600" },
      raising_soon: { label: "Raise Soon", color: "text-yellow-600" },
      urgent: { label: "Urgent", color: "text-orange-600" },
      critical: { label: "Critical", color: "text-red-600" },
    },
  },
  {
    id: "investor",
    label: "Investor Readiness",
    icon: <FaHandshake />,
    color: "#DC2626",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    endpoint: "/api/investor/",
    scoreKey: "pitch_score",
    verdictKey: "pitch_verdict",
    statusKey: "status",
    verdictMap: {
      investor_ready: { label: "Investor Ready", color: "text-emerald-600" },
      nearly_ready: { label: "Nearly Ready", color: "text-green-600" },
      needs_work: { label: "Needs Work", color: "text-yellow-600" },
      not_ready: { label: "Not Ready", color: "text-red-600" },
    },
  },
  {
    id: "go-to-market",
    label: "Go-To-Market",
    icon: <FaBullhorn />,
    color: "#0F766E",
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    endpoint: "/api/gtm/",
    scoreKey: "launch_score",
    verdictKey: "launch_verdict",
    statusKey: "status",
    verdictMap: {
      excellent: { label: "Excellent", color: "text-emerald-600" },
      strong: { label: "Strong", color: "text-green-600" },
      good: { label: "Good", color: "text-blue-600" },
      needs_work: { label: "Needs Work", color: "text-yellow-600" },
      risky: { label: "Risky", color: "text-red-600" },
    },
  },
  {
    id: "kpis",
    label: "Startup KPIs",
    icon: <FaBolt />,
    color: "#1D4ED8",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    endpoint: "/api/kpis/",
    scoreKey: "retention_score",
    verdictKey: "retention_verdict",
    statusKey: "status",
    verdictMap: {
      excellent: { label: "Excellent", color: "text-emerald-600" },
      good: { label: "Good", color: "text-green-600" },
      average: { label: "Average", color: "text-yellow-600" },
      poor: { label: "Poor", color: "text-orange-600" },
      critical: { label: "Critical", color: "text-red-600" },
    },
  },
  {
    id: "team",
    label: "Team & Culture",
    icon: <FaUsers />,
    color: "#9333EA",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    endpoint: "/api/team/",
    scoreKey: "team_score",
    verdictKey: "team_verdict",
    statusKey: "status",
    verdictMap: {
      strong: { label: "Strong", color: "text-emerald-600" },
      good: { label: "Good", color: "text-green-600" },
      adequate: { label: "Adequate", color: "text-yellow-600" },
      weak: { label: "Weak", color: "text-orange-600" },
      critical: { label: "Critical", color: "text-red-600" },
    },
  },
  {
    id: "risks",
    label: "Startup Risks",
    icon: <FaShieldAlt />,
    color: "#B45309",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    endpoint: "/api/risks/",
    scoreKey: "overall_risk_score",
    verdictKey: "overall_risk_level",
    statusKey: "status",
    verdictMap: {
      low: { label: "Low Risk", color: "text-emerald-600" },
      moderate: { label: "Moderate Risk", color: "text-yellow-600" },
      high: { label: "High Risk", color: "text-orange-600" },
      critical: { label: "Critical Risk", color: "text-red-600" },
    },
    invertScore: true, // lower risk score is better
  },
];

const getScoreColor = (score, invert = false) => {
  const s = invert ? 100 - score : score;
  if (s >= 75) return "text-emerald-600";
  if (s >= 60) return "text-green-600";
  if (s >= 40) return "text-yellow-600";
  if (s >= 25) return "text-orange-600";
  return "text-red-500";
};

const getBarColor = (score, invert = false) => {
  const s = invert ? 100 - score : score;
  if (s >= 75) return "bg-emerald-500";
  if (s >= 60) return "bg-green-400";
  if (s >= 40) return "bg-yellow-400";
  if (s >= 25) return "bg-orange-400";
  return "bg-red-500";
};

const getHealthScore = (score, invert = false) => {
  return invert ? 100 - score : score;
};

const FeatureCard = ({ feature, data, loading, onNavigate }) => {
  const score = data?.[feature.scoreKey];
  const verdict = data?.[feature.verdictKey];
  const vConfig = feature.verdictMap?.[verdict];
  const done = !!data && data.status === "done";
  const health =
    score != null ? getHealthScore(score, feature.invertScore) : null;

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden cursor-pointer
        hover:shadow-md transition-all duration-200 group ${
          done ? feature.border : "border-gray-100"
        }`}
      onClick={() => onNavigate(feature.id)}
    >
      <div
        className="h-1.5 w-full"
        style={{
          background:
            done && score != null
              ? `linear-gradient(to right, ${feature.color}, ${feature.color}88)`
              : "#e5e7eb",
        }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center
              text-base ${done ? feature.bg : "bg-gray-50"}`}
            style={{ color: done ? feature.color : "#9ca3af" }}
          >
            {feature.icon}
          </div>

          {loading ? (
            <FaSpinner className="animate-spin text-gray-300 text-xs mt-1" />
          ) : done ? (
            <FaCheckCircle className="text-emerald-400 text-sm mt-1" />
          ) : (
            <span className="text-xs text-gray-300 font-medium mt-1">
              Not started
            </span>
          )}
        </div>

        <p className="text-sm font-semibold text-gray-700 mb-3">
          {feature.label}
        </p>

        {done && score != null ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className={`text-2xl font-black
                ${getScoreColor(score, feature.invertScore)}`}
              >
                {Math.round(score)}
              </span>
              {vConfig && (
                <span className={`text-xs font-semibold ${vConfig.color}`}>
                  {vConfig.label}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-1000
                  ${getBarColor(score, feature.invertScore)}`}
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>
          </div>
        ) : done && !score ? (
          <div>
            {vConfig && (
              <span className={`text-sm font-semibold ${vConfig.color}`}>
                {vConfig.label}
              </span>
            )}
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div className="h-1.5 rounded-full bg-blue-400 w-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Click to get started</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5" />
          </div>
        )}

        <div
          className={`flex items-center gap-1 mt-4 text-xs font-medium
          transition-all ${done ? feature.text : "text-gray-400"}
          group-hover:gap-2`}
        >
          <span>{done ? "View Report" : "Start Now"}</span>
          <FaArrowRight className="text-xs" />
        </div>
      </div>
    </div>
  );
};

const ReadinessGauge = ({ score, completed, total }) => {
  const cfg =
    score >= 75
      ? {
          label: "Investor Ready",
          color: "#10b981",
          bg: "bg-emerald-50",
          text: "text-emerald-700",
        }
      : score >= 60
        ? {
            label: "Strong Foundation",
            color: "#22c55e",
            bg: "bg-green-50",
            text: "text-green-700",
          }
        : score >= 40
          ? {
              label: "Work in Progress",
              color: "#f59e0b",
              bg: "bg-yellow-50",
              text: "text-yellow-700",
            }
          : score >= 20
            ? {
                label: "Early Stage",
                color: "#f97316",
                bg: "bg-orange-50",
                text: "text-orange-700",
              }
            : {
                label: "Just Getting Started",
                color: "#6b7280",
                bg: "bg-gray-50",
                text: "text-gray-600",
              };

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col sm:flex-row
      items-center gap-6 ${cfg.bg} border-current border-opacity-20`}
    >
      <div className="relative shrink-0">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle
            cx="65"
            cy="65"
            r="54"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          <circle
            cx="65"
            cy="65"
            r="54"
            fill="none"
            stroke={cfg.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 65 65)"
            style={{ transition: "stroke-dashoffset 1.5s ease" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center
          justify-center"
        >
          <span className="text-3xl font-black text-gray-800">
            {Math.round(score)}
          </span>
          <span className="text-xs text-gray-400 font-medium">/100</span>
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <p
          className="text-xs font-semibold text-gray-400 uppercase
          tracking-widest mb-1"
        >
          Startup Readiness Score
        </p>
        <h2 className={`text-2xl font-bold mb-2 ${cfg.text}`}>{cfg.label}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {completed} of {total} features analyzed · {total - completed}{" "}
          remaining
        </p>

        <div className="grid grid-cols-5 gap-1.5 max-w-xs">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full ${
                i < completed ? "" : "bg-gray-200"
              }`}
              style={{
                background: i < completed ? cfg.color : undefined,
                opacity: i < completed ? 1 - i * 0.05 : 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const OverviewRadar = ({ featureData }) => {
  const radarData = FEATURES.filter((f) => f.scoreKey).map((f) => {
    const data = featureData[f.id];
    const score = data?.[f.scoreKey];
    const val = score != null ? (f.invertScore ? 100 - score : score) : 0;
    return {
      feature: f.label.replace(" Intelligence", "").replace(" & Culture", ""),
      score: Math.round(val),
      full: 100,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className="bg-white border border-gray-100 rounded-xl shadow-lg
        p-3 text-xs"
      >
        <p className="font-semibold text-gray-700">
          {payload[0].payload.feature}
        </p>
        <p className="text-indigo-600">Score: {payload[0].value}/100</p>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <p
        className="text-xs font-semibold text-gray-500 uppercase
        tracking-wider mb-4"
      >
        🕸️ Startup Health Radar
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#f0f0f0" />
          <PolarAngleAxis
            dataKey="feature"
            tick={{ fontSize: 10, fill: "#6b7280" }}
          />
          <Radar
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.12}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TopPriorities = ({ featureData, onNavigate }) => {
  const priorities = [];

  FEATURES.forEach((f) => {
    const data = featureData[f.id];
    if (!data || data.status !== "done") {
      priorities.push({
        feature: f,
        type: "missing",
        message: `${f.label} not analyzed yet`,
        urgency: "high",
      });
    } else if (f.scoreKey) {
      const score = data[f.scoreKey];
      const health = f.invertScore ? 100 - score : score;
      if (health != null && health < 50) {
        const vConfig = f.verdictMap?.[data[f.verdictKey]];
        priorities.push({
          feature: f,
          type: "low_score",
          message: `${f.label} score is ${Math.round(score)}/100 — needs attention`,
          urgency: health < 30 ? "critical" : "medium",
          verdict: vConfig?.label,
        });
      }
    }
  });

  const sorted = priorities
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2 };
      return order[a.urgency] - order[b.urgency];
    })
    .slice(0, 5);

  if (sorted.length === 0) {
    return (
      <div
        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5
        flex items-center gap-4"
      >
        <FaCheckCircle className="text-emerald-500 text-2xl shrink-0" />
        <div>
          <p className="font-semibold text-emerald-700">
            All features look healthy!
          </p>
          <p className="text-sm text-emerald-600 mt-0.5">
            Your startup is well-analyzed across all dimensions. Keep updating
            as you grow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <p
        className="text-xs font-semibold text-gray-500 uppercase
        tracking-wider mb-4 flex items-center gap-2"
      >
        <FaFire className="text-orange-500" /> Top Priorities
      </p>
      <div className="space-y-2">
        {sorted.map((item, i) => (
          <button
            key={i}
            onClick={() => onNavigate(item.feature.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl
              hover:bg-gray-50 transition text-left group"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center
                text-sm shrink-0 ${item.feature.bg}`}
              style={{ color: item.feature.color }}
            >
              {item.feature.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {item.message}
              </p>
              {item.verdict && (
                <p className="text-xs text-gray-400 mt-0.5">{item.verdict}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  item.urgency === "critical"
                    ? "bg-red-100 text-red-700"
                    : item.urgency === "high"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.urgency}
              </span>
              <FaArrowRight
                className="text-gray-300 text-xs
                group-hover:text-gray-500 transition"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const QuickStats = ({ featureData }) => {
  const ideaData = Object.values(featureData).find((d) => d?.overall_score);
  const finData = Object.values(featureData).find((d) => d?.runway_months);
  const kpiData = Object.values(featureData).find((d) => d?.k_factor != null);
  const riskData = Object.values(featureData).find(
    (d) => d?.overall_risk_level,
  );

  const stats = [
    {
      label: "Best Idea Score",
      value: ideaData?.overall_score
        ? `${Math.round(ideaData.overall_score)}/100`
        : "—",
      icon: <FaLightbulb />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Runway",
      value: finData?.runway_months
        ? finData.runway_months >= 999
          ? "∞"
          : `${Number(finData.runway_months).toFixed(1)} mo`
        : "—",
      icon: <FaFire />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "K-factor",
      value:
        kpiData?.k_factor != null ? Number(kpiData.k_factor).toFixed(2) : "—",
      icon: <FaBolt />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Risk Level",
      value: riskData?.overall_risk_level
        ? riskData.overall_risk_level.charAt(0).toUpperCase() +
          riskData.overall_risk_level.slice(1)
        : "—",
      icon: <FaShieldAlt />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white border border-gray-100 rounded-xl p-4"
        >
          <div
            className={`w-8 h-8 rounded-lg ${s.bg} flex items-center
            justify-center mb-2 ${s.color}`}
          >
            {s.icon}
          </div>
          <p className="text-xs text-gray-400">{s.label}</p>
          <p
            className={`text-xl font-bold mt-0.5 ${
              s.value === "—" ? "text-gray-300" : s.color
            }`}
          >
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
};

const StartupOverview = ({ onNavigate }) => {
  const [featureData, setFeatureData] = useState({});
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const requests = FEATURES.map((f) =>
        axiosInstance
          .get(f.endpoint)
          .then((res) => ({ id: f.id, data: res.data }))
          .catch(() => ({ id: f.id, data: [] })),
      );

      const userReq = axiosInstance
        .get("/api/users/me/")
        .then((res) => res.data)
        .catch(() => null);

      const [userData, ...results] = await Promise.all([userReq, ...requests]);

      if (userData) {
        setUserName(userData.startup_name || userData.user_name || "Founder");
      }

      const map = {};
      results.forEach(({ id, data }) => {
        map[id] = Array.isArray(data) && data.length > 0 ? data[0] : null;
      });
      setFeatureData(map);
    } finally {
      setLoading(false);
    }
  };

  const scoredFeatures = FEATURES.filter((f) => {
    const data = featureData[f.id];
    return data?.status === "done" && f.scoreKey && data[f.scoreKey] != null;
  });

  const completedCount = FEATURES.filter(
    (f) => featureData[f.id]?.status === "done",
  ).length;

  const overallScore =
    scoredFeatures.length > 0
      ? Math.round(
          scoredFeatures.reduce((sum, f) => {
            const score = featureData[f.id][f.scoreKey];
            const health = f.invertScore ? 100 - score : score;
            return sum + health;
          }, 0) / scoredFeatures.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {loading
            ? "Loading your dashboard..."
            : `Welcome back${userName ? `, ${userName}` : ""} 👋`}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {completedCount === 0
            ? "Start analyzing your startup across all 10 dimensions"
            : `${completedCount}/10 features analyzed — here's your startup health`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <FaSpinner className="animate-spin text-2xl mr-3" />
          <span>Loading all feature data...</span>
        </div>
      ) : (
        <>
          <ReadinessGauge
            score={overallScore}
            completed={completedCount}
            total={FEATURES.length}
          />

          <QuickStats featureData={featureData} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <OverviewRadar featureData={featureData} />
            <TopPriorities featureData={featureData} onNavigate={onNavigate} />
          </div>

          <div>
            <p
              className="text-xs font-semibold text-gray-500 uppercase
              tracking-wider mb-4 flex items-center gap-2"
            >
              <FaStar className="text-yellow-400" />
              All Features
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {FEATURES.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  data={featureData[feature.id]}
                  loading={loading}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={fetchAllData}
              className="text-xs text-gray-400 hover:text-gray-600 flex
                items-center gap-1.5 transition"
            >
              <FaSpinner className="text-xs" /> Refresh dashboard
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StartupOverview;
