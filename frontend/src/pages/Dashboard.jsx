import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";
import Layout from "../components/Layout";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Shield,
  Calendar,
  RefreshCw,
  BarChart2,
  Brain,
  Zap,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
  Clock,
  Database,
  Download,
  Bell,
  Flag,
  Share2,
  Copy,
  Check,
  Sliders,
  DollarSign,
  Globe,
  Users,
  Mail,
  ShoppingCart,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  TrendingUp as TrendIcon,
} from "lucide-react";
import jsPDF from "jspdf";

const formatCurrency = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatPercent = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "—";
  return `${Number(num).toFixed(1)}%`;
};

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "—";
  return new Intl.NumberFormat("en-IN").format(num);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-4 py-3">
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

const KPICard = ({
  title,
  value,
  subtitle,
  icon,
  gradient,
  trend,
  isLoading,
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-6 text-white ${gradient} shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${isLoading ? "opacity-70" : ""}`}
  >
    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
    <div className="absolute -bottom-4 -right-2 w-16 h-16 rounded-full bg-white/5" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">
          {title}
        </span>
        <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
      </div>
      {isLoading ? (
        <div className="h-9 w-32 bg-white/20 rounded-lg animate-pulse" />
      ) : (
        <p className="text-3xl font-black tracking-tight mb-1">{value}</p>
      )}
      {subtitle && !isLoading && (
        <p className="text-white/60 text-xs font-medium flex items-center gap-1">
          {trend === "up" && <ArrowUpRight className="w-3 h-3 text-white/80" />}
          {trend === "down" && (
            <ArrowDownRight className="w-3 h-3 text-white/80" />
          )}
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const AIMetricCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  isLoading,
  onClick,
}) => {
  const palette = {
    blue: {
      card: "bg-blue-50 border-blue-100",
      icon: "bg-blue-100 text-blue-600",
      val: "text-blue-900",
      sub: "text-blue-500",
    },
    green: {
      card: "bg-green-50 border-green-100",
      icon: "bg-green-100 text-green-600",
      val: "text-green-900",
      sub: "text-green-500",
    },
    red: {
      card: "bg-red-50 border-red-100",
      icon: "bg-red-100 text-red-600",
      val: "text-red-900",
      sub: "text-red-500",
    },
    yellow: {
      card: "bg-amber-50 border-amber-100",
      icon: "bg-amber-100 text-amber-600",
      val: "text-amber-900",
      sub: "text-amber-500",
    },
    purple: {
      card: "bg-purple-50 border-purple-100",
      icon: "bg-purple-100 text-purple-600",
      val: "text-purple-900",
      sub: "text-purple-500",
    },
  };
  const p = palette[color] || palette.blue;
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 ${p.card} hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${isLoading ? "opacity-70" : ""} ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
          {title}
        </p>
        <div className={`p-2 rounded-xl ${p.icon}`}>{icon}</div>
      </div>
      {isLoading ? (
        <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse mb-1" />
      ) : (
        <p className={`text-2xl font-black ${p.val} mb-1`}>{value}</p>
      )}
      {subtitle && !isLoading && (
        <p className={`text-xs font-medium ${p.sub}`}>{subtitle}</p>
      )}
    </div>
  );
};

const InsufficientDataCard = ({ remaining, message, onRefresh }) => (
  <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-10 text-center shadow-sm">
    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Database className="w-8 h-8 text-amber-500" />
    </div>
    <h3 className="text-xl font-bold text-amber-900 mb-2">Insufficient Data</h3>
    <p className="text-amber-700 mb-5 max-w-md mx-auto text-sm leading-relaxed">
      {message}
    </p>
    {remaining > 0 && (
      <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 px-5 py-2.5 rounded-xl mb-4">
        <Clock className="w-4 h-4 text-amber-600" />
        <p className="text-amber-800 font-semibold text-sm">
          {remaining} more {remaining === 1 ? "record" : "records"} needed
        </p>
      </div>
    )}
    <button
      onClick={onRefresh}
      className="mt-2 inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-xl hover:bg-amber-700 transition text-sm font-medium"
    >
      <RefreshCw className="w-4 h-4" /> Refresh Data
    </button>
  </div>
);

const SectionHeading = ({ icon, title, subtitle, badge }) => (
  <div className="flex items-start justify-between mb-6">
    <div className="flex items-center gap-3">
      {icon && (
        <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {badge}
  </div>
);

const Pill = ({ color = "indigo", children }) => {
  const c = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${c[color]}`}
    >
      {children}
    </span>
  );
};

const DiagRow = ({ text, type }) => {
  const styles = {
    obs: {
      bg: "bg-indigo-50 border-indigo-100",
      dot: "bg-indigo-500",
      icon: "•",
      text: "text-indigo-800",
    },
    risk: {
      bg: "bg-red-50 border-red-100",
      dot: "bg-red-500",
      icon: "⚠",
      text: "text-red-800",
    },
    strength: {
      bg: "bg-green-50 border-green-100",
      dot: "bg-green-500",
      icon: "✓",
      text: "text-green-800",
    },
  };
  const s = styles[type] || styles.obs;
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border ${s.bg} mb-2 last:mb-0`}
    >
      <span
        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0 ${s.dot}`}
      >
        {s.icon}
      </span>
      <p className={`text-sm ${s.text} leading-relaxed`}>{text}</p>
    </div>
  );
};

const CUSTOMER_ACQUISITION_STRATEGIES = [
  {
    channel: "Social Media Marketing",
    icon: <Instagram className="w-5 h-5" />,
    color: "bg-pink-100 text-pink-600",
    strategies: [
      "Run targeted Instagram/Facebook ads for ₹5,000-10,000/month",
      "Post daily engaging content (reels, stories, posts)",
      "Collaborate with micro-influencers in your niche",
      "Run contests and giveaways to increase engagement",
    ],
    expectedROI: "2-3x",
    timeframe: "2-4 weeks",
  },
    {
      channel: "Email Marketing",
      icon: <Mail className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600",
      strategies: [
        "Build email list from website visitors",
        "Send weekly newsletters with offers",
        "Create automated welcome sequences",
        "Segment customers for personalized campaigns",
      ],
      expectedROI: "3-4x",
      timeframe: "4-6 weeks",
    },
    {
      channel: "Google Ads",
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-600",
      strategies: [
        "Target high-intent keywords related to your product",
        "Start with ₹10,000-15,000 monthly budget",
        "Use retargeting ads for website visitors",
        "Optimize for conversions, not just clicks",
      ],
      expectedROI: "2-3x",
      timeframe: "3-5 weeks",
    },
    {
      channel: "Referral Program",
      icon: <Users className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
      strategies: [
        "Offer discounts for customer referrals",
        "Create a two-sided incentive program",
        "Make sharing easy with unique referral links",
        "Track and reward top referrers monthly",
      ],
      expectedROI: "4-5x",
      timeframe: "6-8 weeks",
    },
    {
      channel: "Content Marketing",
      icon: <TrendIcon className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600",
      strategies: [
        "Start a blog with SEO-optimized articles",
        "Create YouTube tutorials about your product",
        "Guest post on industry websites",
        "Repurpose content across all platforms",
      ],
      expectedROI: "3-4x",
      timeframe: "8-12 weeks",
    },
  ];

const CustomerAcquisitionStrategies = ({ currentData, intelligence }) => {
  const strategies = CUSTOMER_ACQUISITION_STRATEGIES;

  const getPersonalizedRecommendation = () => {
    const profitMargin = currentData?.profit_margin || 0;
    if (profitMargin > 20) {
      return "✅ Your profit margins are strong! Invest 20-30% of profits into Google Ads and Social Media for fastest growth.";
    } else if (profitMargin > 10) {
      return "📈 Focus on organic channels like Content Marketing and Referral programs to acquire customers cost-effectively.";
    } else {
      return "⚠️ Start with low-cost channels like Social Media organic and Referral programs before paid advertising.";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <SectionHeading
        title="Customer Acquisition Strategies"
        subtitle="Proven ways to grow your customer base"
        icon={<Users className="w-4 h-4" />}
      />

      <div className="mb-6 p-4 bg-indigo-50 rounded-xl">
        <p className="text-sm font-semibold text-indigo-800 mb-2">
          🎯 Personalized Recommendation
        </p>
        <p className="text-indigo-700 text-sm">
          {getPersonalizedRecommendation()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {strategies.map((s, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${s.color}`}>{s.icon}</div>
              <div>
                <h3 className="font-bold text-gray-800">{s.channel}</h3>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>ROI: {s.expectedROI}</span>
                  <span>⏱️ {s.timeframe}</span>
                </div>
              </div>
            </div>
            <ul className="space-y-1">
              {s.strategies.map((strategy, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-600 flex items-start gap-2"
                >
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{strategy}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() =>
                alert(
                  `Implementation guide for ${s.channel} will be available soon!`,
                )
              }
              className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Learn More →
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-amber-50 rounded-xl">
        <p className="text-sm font-semibold text-amber-800 mb-2">
          📊 Quick Tips to Increase Customer Acquisition:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <span className="text-amber-600">1.</span>
            <span className="text-xs text-amber-700">
              Optimize your website for conversions (CTR +25%)
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600">2.</span>
            <span className="text-xs text-amber-700">
              Add customer testimonials and case studies
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600">3.</span>
            <span className="text-xs text-amber-700">
              Offer first-purchase discount (10-15%)
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600">4.</span>
            <span className="text-xs text-amber-700">
              Implement live chat for instant support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [intelligence, setIntelligence] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [businessInsights, setBusinessInsights] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState("all");
  const [filteredRecords, setFilteredRecords] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAcquisitionStrategies, setShowAcquisitionStrategies] =
    useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [activeDateFilter, setActiveDateFilter] = useState("all");
  const [filteredTrend, setFilteredTrend] = useState([]);
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Monthly Sales Target",
      target: 500000,
      current: 0,
      deadline: "2024-04-30",
      completed: false,
    },
    {
      id: 2,
      name: "Customer Acquisition",
      target: 100,
      current: 0,
      deadline: "2024-04-30",
      completed: false,
    },
  ]);
  const [actionItems, setActionItems] = useState([]);
  const [whatIfParams, setWhatIfParams] = useState({
    marketingSpend: 50000,
    priceChange: 0,
  });
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New AI insights available!",
      read: false,
      time: "Just now",
    },
  ]);

  // Filter data based on date range
  const applyDateFilter = (data, range) => {
    if (!range.start || !data) return data;
    return data.filter((item) => {
      const itemDate = new Date(item.month);
      return itemDate >= range.start && itemDate <= (range.end || new Date());
    });
  };

  // Date filter handlers - WORKING
  const getDateRange = (filter) => {
    const end = new Date();
    const start = new Date();
    switch (filter) {
      case "30days":
        start.setDate(start.getDate() - 30);
        break;
      case "quarter":
        start.setMonth(start.getMonth() - 3);
        break;
      default:
        return { start: null, end: null };
    }
    return { start, end };
  };

  const handleDateFilter = (filter) => {
    setActiveDateFilter(filter);
    let newRange;
    if (filter === "all") {
      newRange = { start: null, end: null };
    } else {
      newRange = getDateRange(filter);
    }
    setDateRange(newRange);

    const sourceTrend =
      filteredRecords?.monthly_trend || overview?.monthly_trend;
    if (sourceTrend) {
      const filtered =
        filter === "all" ? sourceTrend : applyDateFilter(sourceTrend, newRange);
      setFilteredTrend(filtered);
    }
  };

  const buildExportPayload = () => ({
    businessName:
      selectedBusiness !== "all" ? selectedBusiness : "All Businesses",
    dateRange: activeDateFilter,
    overview,
    intelligence,
    growthStrategy:
      intelligence?.gemini_strategy?.data || intelligence?.strategies || {},
    customerAcquisition: CUSTOMER_ACQUISITION_STRATEGIES.map((item) => ({
      channel: item.channel,
      expectedROI: item.expectedROI,
      timeframe: item.timeframe,
      strategies: item.strategies,
    })),
    exportedAt: new Date().toISOString(),
  });

  const formatCsvValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const createCsvRows = (payload) => {
    const rows = [["Section", "Key", "Value"]];

    rows.push(["Metadata", "Business", payload.businessName]);
    rows.push(["Metadata", "Date Range", payload.dateRange]);
    rows.push(["Metadata", "Exported At", payload.exportedAt]);

    rows.push(["Overview", "Overview Data", ""]);
    if (payload.overview) {
      Object.entries(payload.overview).forEach(([key, value]) => {
        rows.push(["Overview", key, formatCsvValue(value)]);
      });
    }

    rows.push(["AI Insights", "AI Intelligence", ""]);
    if (payload.intelligence) {
      Object.entries(payload.intelligence).forEach(([key, value]) => {
        rows.push(["AI Insights", key, formatCsvValue(value)]);
      });
    }

    rows.push(["Growth Strategy", "Growth Strategy", ""]);
    if (payload.growthStrategy) {
      if (Array.isArray(payload.growthStrategy)) {
        payload.growthStrategy.forEach((item, index) => {
          rows.push([
            "Growth Strategy",
            `Strategy ${index + 1}`,
            formatCsvValue(item),
          ]);
        });
      } else {
        Object.entries(payload.growthStrategy).forEach(([key, value]) => {
          rows.push([
            "Growth Strategy",
            key,
            formatCsvValue(value),
          ]);
        });
      }
    }

    rows.push(["Customer Acquisition", "Strategies", ""]);
    payload.customerAcquisition.forEach((entry, index) => {
      rows.push([
        "Customer Acquisition",
        `Channel ${index + 1}`,
        entry.channel,
      ]);
      rows.push([
        "Customer Acquisition",
        `Channel ${index + 1} ROI`,
        entry.expectedROI,
      ]);
      rows.push([
        "Customer Acquisition",
        `Channel ${index + 1} Timeframe`,
        entry.timeframe,
      ]);
      rows.push([
        "Customer Acquisition",
        `Channel ${index + 1} Steps`,
        formatCsvValue(entry.strategies),
      ]);
    });

    return rows;
  };

  const downloadCsv = (payload) => {
    const csvRows = createCsvRows(payload);
    const csvContent = csvRows
      .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `business_report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = (payload) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let y = 40;
    const pageWidth = doc.internal.pageSize.width;
    const printText = (text, options = {}) => {
      const maxWidth = pageWidth - 40;
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        if (y > doc.internal.pageSize.height - 40) {
          doc.addPage();
          y = 40;
        }
        doc.text(line, 20, y, options);
        y += 14;
      });
    };

    doc.setFontSize(18);
    doc.text("Biz Buddy Dashboard Export", 20, y);
    y += 24;
    doc.setFontSize(11);
    printText(`Business: ${payload.businessName}`);
    printText(`Date Range: ${payload.dateRange}`);
    printText(`Exported At: ${new Date(payload.exportedAt).toLocaleString()}`);
    y += 10;

    printText("Overview:");
    if (payload.overview) {
      printText(JSON.stringify(payload.overview, null, 2));
    }
    y += 8;

    printText("AI Insights:");
    if (payload.intelligence) {
      printText(JSON.stringify(payload.intelligence, null, 2));
    }
    y += 8;

    printText("Growth Strategy:");
    printText(JSON.stringify(payload.growthStrategy, null, 2));
    y += 8;

    printText("Customer Acquisition:");
    printText(JSON.stringify(payload.customerAcquisition, null, 2));

    doc.save(`business_report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleExport = async (format) => {
    setShowExportMenu(false);
    try {
      const payload = buildExportPayload();

      if (format === "json") {
        const dataStr = JSON.stringify(payload, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `business_report_${new Date().toISOString().split("T")[0]}.json`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        alert("✅ Report exported as JSON!");
      } else if (format === "csv") {
        downloadCsv(payload);
        alert("✅ Report exported as CSV!");
      } else if (format === "pdf") {
        downloadPdf(payload);
        alert("✅ Report exported as PDF!");
      } else if (format === "excel") {
        downloadCsv(payload);
        alert("✅ Report exported as Excel-compatible CSV!");
      } else {
        alert("❌ Unknown export format");
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("❌ Export failed. Please try again.");
    }
  };

  // Share handlers
  const generateShareLink = () => {
    const shareId = Date.now();
    const fakeLink = `${window.location.origin}/shared-report/${shareId}`;
    setShareLink(fakeLink);
    // Store in localStorage for demo
    localStorage.setItem(
      `share_${shareId}`,
      JSON.stringify({
        overview: overview,
        intelligence: intelligence,
        createdAt: new Date().toISOString(),
      }),
    );
    alert("✅ Shareable link generated! Share this link with your team.");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert("✅ Link copied to clipboard!");
  };

  // Goal handlers
  const handleAddGoal = () => {
    const goalName = document.getElementById("goalName")?.value;
    const goalTarget = parseFloat(document.getElementById("goalTarget")?.value);
    const goalDeadline = document.getElementById("goalDeadline")?.value;

    if (!goalName || !goalTarget) {
      alert("Please fill all fields");
      return;
    }

    const newGoal = {
      id: goals.length + 1,
      name: goalName,
      target: goalTarget,
      current: 0,
      deadline: goalDeadline || "2024-12-31",
      completed: false,
    };
    setGoals([...goals, newGoal]);
    setShowGoalModal(false);
    alert(`✅ Goal "${goalName}" added successfully!`);
  };

  const handleGoalComplete = (goalId) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal,
      ),
    );
  };

  const handleActionToggle = (actionId) => {
    setActionItems((prev) =>
      prev.map((item) =>
        item.id === actionId ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const calculateProjectedImpact = () => {
    const baseGrowth = intelligence?.intelligence?.forecast?.user_growth || 0;
    const marketingImpact = (whatIfParams.marketingSpend / 50000) * 5;
    const priceImpact = (whatIfParams.priceChange / 10) * 3;
    return (baseGrowth + marketingImpact + priceImpact).toFixed(1);
  };

  const getDataQualityScore = () => {
    const recordCount = status?.current_records || 0;
    const required = status?.required_records || 14;
    return Math.min(100, Math.floor((recordCount / required) * 100));
  };

  const fetchBusinessData = useCallback(async (businessName) => {
    try {
      const response = await axiosInstance.get("/api/list/");
      const allRecords = response.data;
      const businessRecords = allRecords.filter(
        (r) => r.business_name === businessName,
      );
      const total_sales = businessRecords.reduce((s, r) => s + r.sales, 0);
      const total_expenses = businessRecords.reduce(
        (s, r) => s + r.expenses,
        0,
      );
      const total_profit = businessRecords.reduce((s, r) => s + r.profit, 0);
      const monthlyData = {};
      businessRecords.forEach((record) => {
        const month = record.date.substring(0, 7);
        if (!monthlyData[month]) monthlyData[month] = { sales: 0, profit: 0 };
        monthlyData[month].sales += record.sales;
        monthlyData[month].profit += record.profit;
      });
      const monthly_trend = Object.keys(monthlyData)
        .map((m) => ({
          month: m,
          sales: monthlyData[m].sales,
          profit: monthlyData[m].profit,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      let businessInsightsData = null;
      try {
        const res = await axiosInstance.get(
          `/api/business-insights/by-name/?business_name=${encodeURIComponent(businessName)}`,
        );
        businessInsightsData = res.data;
      } catch (e) {
        console.error("Failed to fetch business insights:", e);
      }

      setFilteredRecords({
        overview: {
          total_sales,
          total_expenses,
          total_profit,
          total_records: businessRecords.length,
          profit_margin:
            total_sales > 0 ? (total_profit / total_sales) * 100 : 0,
          avg_daily_sales: total_sales / (businessRecords.length || 1),
        },
        monthly_trend,
        insights: businessInsightsData,
      });
    } catch (e) {
      console.error("Failed to fetch business data:", e);
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const insightsRes = await axiosInstance.get("/api/business-insights/");
      setBusinessInsights(insightsRes.data);

      const statusRes = await axiosInstance.get("/api/intelligence/status/");
      setStatus(statusRes.data);

      const overviewRes = await axiosInstance.get("/api/dashboard/overview/");
      setOverview(overviewRes.data);
      setFilteredTrend(overviewRes.data?.monthly_trend || []);

      if (statusRes.data.has_enough_data) {
        const intelligenceRes = await axiosInstance.get("/api/intelligence/");
        setIntelligence(intelligenceRes.data);

        if (overviewRes.data?.overview?.total_sales) {
          setGoals((prev) =>
            prev.map((goal) =>
              goal.name === "Monthly Sales Target"
                ? { ...goal, current: overviewRes.data.overview.total_sales }
                : goal,
            ),
          );
        }

        const gemData = intelligenceRes.data?.gemini_strategy?.data;
        if (gemData?.recommended_strategies) {
          setActionItems(
            gemData.recommended_strategies.map((strat, idx) => ({
              id: idx,
              title: strat.title,
              description: strat.action,
              priority: strat.priority,
              completed: false,
            })),
          );
        }
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const sourceTrend =
      filteredRecords?.monthly_trend || overview?.monthly_trend;
    if (!sourceTrend) return;
    if (activeDateFilter === "all") {
      setFilteredTrend(sourceTrend);
    } else {
      setFilteredTrend(applyDateFilter(sourceTrend, dateRange));
    }
  }, [overview, filteredRecords, activeDateFilter, dateRange]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const isLoading = loading && !refreshing;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full bg-indigo-50 flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-gray-800 font-semibold text-lg">
              Loading Intelligence
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Crunching your business data…
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white rounded-2xl border border-red-100 shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Failed to Load
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {error}
            </p>
            <button
              onClick={handleRefresh}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const trendSource =
    filteredRecords?.monthly_trend || overview?.monthly_trend || [];
  const currentTrend =
    activeDateFilter === "all"
      ? trendSource
      : applyDateFilter(trendSource, dateRange);

  const currentData = (() => {
    const baseData = filteredRecords?.overview || overview?.overview;
    if (!baseData) return baseData;
    if (activeDateFilter === "all" || currentTrend.length === 0)
      return baseData;

    const total_sales = currentTrend.reduce(
      (sum, item) => sum + (item.sales || 0),
      0,
    );
    const total_profit = currentTrend.reduce(
      (sum, item) => sum + (item.profit || 0),
      0,
    );

    return {
      ...baseData,
      total_sales,
      total_profit,
      profit_margin: total_sales > 0 ? (total_profit / total_sales) * 100 : 0,
    };
  })();

  const dataQualityScore = getDataQualityScore();

  const TABS = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      id: "insights",
      label: "AI Insights",
      icon: <Brain className="w-4 h-4" />,
      dot: status?.has_enough_data,
    },
    {
      id: "strategy",
      label: "Growth Strategy",
      icon: <Zap className="w-4 h-4" />,
      dot: status?.has_enough_data,
    },
    {
      id: "acquisition",
      label: "Customer Acquisition",
      icon: <Users className="w-4 h-4" />,
      dot: true,
    },
  ];

  const gd = intelligence?.gemini_diagnostic;
  const useGemini = gd?.status === "success" && gd?.data;
  const obs = useGemini
    ? gd.data.observations ||
      intelligence?.intelligence?.diagnostics?.diagnostics
    : intelligence?.intelligence?.diagnostics?.diagnostics;
  const risks = useGemini
    ? gd.data.risks || intelligence?.intelligence?.diagnostics?.risks
    : intelligence?.intelligence?.diagnostics?.risks;
  const strengths = useGemini
    ? gd.data.strengths || intelligence?.intelligence?.diagnostics?.strengths
    : intelligence?.intelligence?.diagnostics?.strengths;
  const compInsight = useGemini ? gd.data.competitive_insight : null;

  return (
    <Layout>
      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Share Report</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Share this report with your team members
            </p>
            <div className="flex gap-2 mb-4">
              <input
                value={shareLink || "Click 'Generate Link' first"}
                readOnly
                className="flex-1 border rounded-lg p-2 text-sm bg-gray-50"
              />
              {shareLink && (
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
            {!shareLink && (
              <button
                onClick={generateShareLink}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Generate Link
              </button>
            )}
          </div>
        </div>
      )}

      {/* Goal Modal */}
      {showGoalModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowGoalModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Set New Goal</h3>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <input
              id="goalName"
              type="text"
              placeholder="Goal name (e.g., Reach 50k monthly sales)"
              className="w-full border rounded-lg p-2 mb-3"
            />
            <input
              id="goalTarget"
              type="number"
              placeholder="Target amount (₹)"
              className="w-full border rounded-lg p-2 mb-3"
            />
            <input
              id="goalDeadline"
              type="date"
              className="w-full border rounded-lg p-2 mb-4"
            />
            <button
              onClick={handleAddGoal}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Goal
            </button>
          </div>
        </div>
      )}

      {/* What-If Modal */}
      {showWhatIf && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowWhatIf(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">What-If Analysis</h3>
              <button
                onClick={() => setShowWhatIf(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4" /> Marketing Budget: ₹
                  {whatIfParams.marketingSpend.toLocaleString()}
                </label>
                <input
                  type="range"
                  min={0}
                  max={200000}
                  step={5000}
                  value={whatIfParams.marketingSpend}
                  onChange={(e) =>
                    setWhatIfParams((prev) => ({
                      ...prev,
                      marketingSpend: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" /> Price Change:{" "}
                  {whatIfParams.priceChange > 0 ? "+" : ""}
                  {whatIfParams.priceChange}%
                </label>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  step={1}
                  value={whatIfParams.priceChange}
                  onChange={(e) =>
                    setWhatIfParams((prev) => ({
                      ...prev,
                      priceChange: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">Projected Growth Impact</p>
                <p className="text-2xl font-bold text-indigo-600">
                  +{calculateProjectedImpact()}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50/80">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="px-4 py-4 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  Business Intelligence
                </h1>
                <p className="text-gray-400 text-xs">
                  AI-powered insights to grow smarter
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {lastUpdated && (
                <span className="text-xs text-gray-400 hidden sm:block">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}

              {/* Documentation Link - WORKING */}
              <Link
                to="/doc"
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
              >
                Documentation
              </Link>

              {/* Export Dropdown - WORKING */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-30">
                    <button
                      onClick={() => handleExport("pdf")}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-xl"
                    >
                      📄 PDF Report
                    </button>
                    <button
                      onClick={() => handleExport("excel")}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      📊 Excel Export
                    </button>
                    <button
                      onClick={() => handleExport("csv")}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      📑 CSV Export
                    </button>
                    <button
                      onClick={() => handleExport("json")}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-b-xl"
                    >
                      🔧 JSON Export
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-gray-50 rounded-xl hover:bg-gray-100"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-4 mt-2 w-80 bg-white border rounded-xl shadow-lg z-30">
              <div className="p-3 border-b">
                <p className="font-semibold text-sm">Notifications</p>
              </div>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 border-b last:border-0 hover:bg-gray-50"
                  >
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))
              ) : (
                <p className="p-3 text-sm text-gray-400 text-center">
                  No notifications
                </p>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="px-4 flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === t.id ? "text-indigo-600 border-indigo-600" : "text-gray-500 border-transparent hover:text-indigo-500"}`}
              >
                {t.icon}
                {t.label}
                {t.dot && status?.has_enough_data && (
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="py-5 px-4 space-y-6">
          {/* Date Range Filter - WORKING */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleDateFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${activeDateFilter === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                All Time
              </button>
              <button
                onClick={() => handleDateFilter("30days")}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${activeDateFilter === "30days" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => handleDateFilter("quarter")}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${activeDateFilter === "quarter" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                This Quarter
              </button>
            </div>
            <button
              onClick={() => setShowWhatIf(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm hover:bg-purple-100"
            >
              <Sliders className="w-4 h-4" /> What-If
            </button>
          </div>

          {selectedBusiness !== "all" && (
            <div className="flex items-center justify-between bg-indigo-600 text-white rounded-2xl px-5 py-3 shadow-md">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-indigo-200" />
                <span className="text-sm text-indigo-100">Viewing:</span>
                <span className="font-bold text-white">{selectedBusiness}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedBusiness("all");
                  setFilteredRecords(null);
                }}
                className="flex items-center gap-1.5 text-xs text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft className="w-3 h-3" /> All Businesses
              </button>
            </div>
          )}

          {/* Data Quality Score */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Database className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Data Quality Score
                  </p>
                  <p className="text-xs text-gray-500">
                    Based on {status?.current_records || 0}/
                    {status?.required_records || 14} records
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {dataQualityScore}%
                </p>
                <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${dataQualityScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {status && !status.has_enough_data && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-100 rounded-xl shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 mb-1">
                    Unlock AI-Powered Insights
                  </h3>
                  <p className="text-blue-600 text-sm mb-4">{status.message}</p>
                  <div className="relative w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-blue-500 font-medium mt-2">
                    <span>{status.current_records} records</span>
                    <span>{status.percentage}% complete</span>
                    <span>{status.required_records} required</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "overview" && overview && (
            <div className="space-y-6">
              {/* Goals Section */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <SectionHeading
                    title="Monthly Goals"
                    subtitle="Track your progress"
                    icon={<Flag className="w-4 h-4" />}
                  />
                  <button
                    onClick={() => setShowGoalModal(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    + Set Goal
                  </button>
                </div>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span
                          className={`font-medium ${goal.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                        >
                          {goal.name}
                        </span>
                        <span className="text-gray-500">
                          {formatCurrency(goal.current)} /{" "}
                          {formatCurrency(goal.target)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 rounded-full h-2 transition-all"
                          style={{
                            width: `${Math.min(100, (goal.current / goal.target) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">
                          {Math.min(
                            100,
                            Math.floor((goal.current / goal.target) * 100),
                          )}
                          % complete
                        </span>
                        <button
                          onClick={() => handleGoalComplete(goal.id)}
                          className="text-indigo-500 hover:text-indigo-700"
                        >
                          {goal.completed ? "Undo" : "Mark Complete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KPICard
                  title="Total Sales"
                  value={formatCurrency(currentData?.total_sales)}
                  icon={<TrendingUp className="w-5 h-5 text-white" />}
                  gradient="bg-linear-to-br from-indigo-500 to-indigo-700"
                  trend="up"
                  isLoading={!currentData}
                />
                <KPICard
                  title="Total Expenses"
                  value={formatCurrency(currentData?.total_expenses)}
                  icon={<TrendingDown className="w-5 h-5 text-white" />}
                  gradient="bg-linear-to-br from-rose-500 to-rose-700"
                  isLoading={!currentData}
                />
                <KPICard
                  title="Total Profit"
                  value={formatCurrency(currentData?.total_profit)}
                  subtitle={`Margin: ${formatPercent(currentData?.profit_margin / 100)}`}
                  icon={<Target className="w-5 h-5 text-white" />}
                  gradient="bg-linear-to-br from-emerald-500 to-teal-600"
                  trend="up"
                  isLoading={!currentData}
                />
                <KPICard
                  title="Total Records"
                  value={currentData?.total_records ?? "—"}
                  subtitle={`Avg: ${formatCurrency(currentData?.avg_daily_sales)}/day`}
                  icon={<BarChart2 className="w-5 h-5 text-white" />}
                  gradient="bg-linear-to-br from-violet-500 to-purple-700"
                  isLoading={!currentData}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <SectionHeading
                    title="Monthly Sales"
                    subtitle="Revenue performance over time"
                    icon={<BarChart2 className="w-4 h-4" />}
                  />
                  {currentTrend?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={currentTrend} barSize={28}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="sales"
                          fill="#4F46E5"
                          radius={[6, 6, 0, 0]}
                          name="Sales"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-60 flex flex-col items-center justify-center text-gray-300 gap-2">
                      <BarChart2 className="w-10 h-10" />
                      <p className="text-sm">No monthly data available</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <SectionHeading
                    title="Profit Trend"
                    subtitle="Net profit movement"
                    icon={<TrendingUp className="w-4 h-4" />}
                  />
                  {currentTrend?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={currentTrend}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="profit"
                          stroke="#10B981"
                          strokeWidth={2.5}
                          fill="#10B981"
                          fillOpacity={0.1}
                          dot={{
                            fill: "#10B981",
                            r: 4,
                            strokeWidth: 2,
                            stroke: "#fff",
                          }}
                          name="Profit"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-60 flex flex-col items-center justify-center text-gray-300 gap-2">
                      <TrendingUp className="w-10 h-10" />
                      <p className="text-sm">No profit data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Names */}
              {overview.business_names?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <SectionHeading
                    title="Your Businesses"
                    subtitle={`${overview.business_names.length} active businesses`}
                    icon={<Building2 className="w-4 h-4" />}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {overview.business_names.map((name, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedBusiness(name);
                          fetchBusinessData(name);
                        }}
                        className={`group w-full text-left p-4 rounded-xl border transition-all ${selectedBusiness === name ? "bg-indigo-600 border-indigo-600 text-white" : "bg-gray-50 border-gray-100 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${selectedBusiness === name ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"}`}
                            >
                              {name[0]?.toUpperCase()}
                            </div>
                            <p
                              className={`font-semibold text-sm truncate max-w-30 ${selectedBusiness === name ? "text-white" : "text-gray-800"}`}
                            >
                              {name}
                            </p>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${selectedBusiness === name ? "text-white/70" : "text-gray-300"}`}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "insights" && (
            <div className="space-y-6">
              {!status?.has_enough_data ? (
                <InsufficientDataCard
                  remaining={status?.remaining}
                  message="Add more records to unlock AI-powered insights."
                  onRefresh={handleRefresh}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                    <AIMetricCard
                      title="Forecast Trend"
                      value={
                        intelligence?.intelligence?.forecast?.trend?.toUpperCase() ||
                        "N/A"
                      }
                      icon={
                        intelligence?.intelligence?.forecast?.trend ===
                        "declining" ? (
                          <TrendingDown className="w-5 h-5" />
                        ) : (
                          <TrendingUp className="w-5 h-5" />
                        )
                      }
                      color={
                        intelligence?.intelligence?.forecast?.trend ===
                        "growing"
                          ? "green"
                          : "red"
                      }
                      isLoading={!intelligence}
                    />
                    <AIMetricCard
                      title="30-Day Forecast"
                      value={formatCurrency(
                        intelligence?.intelligence?.forecast
                          ?.predicted_30_day_demand,
                      )}
                      subtitle={`${intelligence?.intelligence?.forecast?.confidence_score || 0}% confidence`}
                      icon={<Target className="w-5 h-5" />}
                      color="blue"
                      isLoading={!intelligence}
                    />
                    <AIMetricCard
                      title="Market Share"
                      value={`${intelligence?.intelligence?.market?.market_share_percent || 0}%`}
                      subtitle={
                        intelligence?.intelligence?.market?.share_status ||
                        "Unknown"
                      }
                      icon={<Shield className="w-5 h-5" />}
                      color="blue"
                      isLoading={!intelligence}
                    />
                    <AIMetricCard
                      title="Risk Score"
                      value={`${intelligence?.intelligence?.risk?.risk_score || 0}/100`}
                      subtitle={
                        intelligence?.intelligence?.risk?.risk_level ||
                        "Unknown"
                      }
                      icon={<AlertTriangle className="w-5 h-5" />}
                      color={
                        intelligence?.intelligence?.risk?.risk_level ===
                        "Low Risk"
                          ? "green"
                          : "red"
                      }
                      isLoading={!intelligence}
                    />
                    <AIMetricCard
                      title="Data Quality"
                      value={`${dataQualityScore}%`}
                      subtitle={`${status?.current_records || 0}/${status?.required_records || 14} records`}
                      icon={<Database className="w-5 h-5" />}
                      color="purple"
                    />
                  </div>

                  {intelligence?.gemini_diagnostic?.status === "success" && (
                    <div className="bg-linear-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-violet-200" />
                        <p className="text-violet-200 text-xs font-bold uppercase tracking-widest">
                          Gemini AI Diagnostic Summary
                        </p>
                      </div>
                      <p className="text-white text-base leading-relaxed font-medium">
                        {intelligence.gemini_diagnostic.data.diagnostic_summary}
                      </p>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <SectionHeading
                      title="Diagnostic Analysis"
                      subtitle="Deep-dive into what's driving your results"
                      icon={<Brain className="w-4 h-4" />}
                      badge={
                        useGemini ? (
                          <Pill color="indigo">
                            <Sparkles className="w-3 h-3" /> Gemini AI
                          </Pill>
                        ) : null
                      }
                    />
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
                          Key Observations
                        </p>
                        {obs?.length > 0 ? (
                          obs.map((d, i) => (
                            <DiagRow key={i} text={d} type="obs" />
                          ))
                        ) : (
                          <p className="text-sm text-gray-400">
                            No observations available
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">
                          Risk Factors
                        </p>
                        {risks?.length > 0 ? (
                          risks.map((r, i) => (
                            <DiagRow key={i} text={r} type="risk" />
                          ))
                        ) : (
                          <p className="text-sm text-gray-400">
                            No major risks detected
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">
                          Strengths
                        </p>
                        {strengths?.length > 0 ? (
                          strengths.map((s, i) => (
                            <DiagRow key={i} text={s} type="strength" />
                          ))
                        ) : (
                          <p className="text-sm text-gray-400">
                            No strengths identified yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <SectionHeading
                      title="Competitive Position"
                      subtitle="How you compare in the broader market"
                      icon={<Shield className="w-4 h-4" />}
                      badge={
                        useGemini ? (
                          <Pill color="indigo">
                            <Sparkles className="w-3 h-3" /> Gemini AI
                          </Pill>
                        ) : null
                      }
                    />
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-linear-to-br from-violet-50 to-purple-50 border border-violet-100 p-5 rounded-2xl">
                        <p className="text-violet-500 text-xs font-bold uppercase tracking-widest mb-2">
                          Your Business Cluster
                        </p>
                        <p className="text-3xl font-black text-violet-900">
                          {intelligence?.intelligence?.competitor
                            ?.user_cluster || "N/A"}
                        </p>
                      </div>
                      <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-2xl">
                        <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-2">
                          Competitors in Analysis
                        </p>
                        <p className="text-3xl font-black text-blue-900">
                          {intelligence?.intelligence?.competitor
                            ?.total_competitors || 0}
                        </p>
                      </div>
                    </div>
                    {compInsight && (
                      <div className="bg-linear-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">
                            AI Analysis
                          </p>
                        </div>
                        <p className="text-violet-900 text-sm leading-relaxed">
                          {compInsight}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Items */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <SectionHeading
                      title="Action Items"
                      subtitle="Based on your AI insights"
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    />
                    <div className="space-y-3">
                      {actionItems.length > 0 ? (
                        actionItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed || false}
                              onChange={() => handleActionToggle(item.id)}
                              className="mt-0.5 w-4 h-4 rounded border-blue-300"
                            />
                            <div className="flex-1">
                              <p
                                className={`font-semibold text-blue-900 text-sm ${item.completed ? "line-through opacity-60" : ""}`}
                              >
                                {item.title}
                              </p>
                              <p className="text-blue-700 text-xs">
                                {item.description}
                              </p>
                            </div>
                            <Pill
                              color={
                                item.priority === "High"
                                  ? "red"
                                  : item.priority === "Medium"
                                    ? "amber"
                                    : "green"
                              }
                            >
                              {item.priority}
                            </Pill>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-4">
                          No action items yet. Generate a strategy to see
                          recommendations.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "strategy" && (
            <div className="space-y-6">
              {!status?.has_enough_data ? (
                <InsufficientDataCard
                  remaining={status?.remaining}
                  message="Add more records to unlock personalized growth strategies."
                  onRefresh={handleRefresh}
                />
              ) : (
                (() => {
                  const gemStrat = intelligence?.gemini_strategy;
                  const gemData =
                    gemStrat?.status === "success" ? gemStrat.data : null;
                  const source = gemData || intelligence?.strategies;
                  const priorities = {
                    High: "bg-red-500",
                    Medium: "bg-amber-500",
                    Low: "bg-green-500",
                  };
                  return (
                    <div className="space-y-6">
                      {gemData && (
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-violet-500" />
                          <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">
                            Powered by Gemini AI
                          </span>
                        </div>
                      )}
                      {source?.strengths?.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                          <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Your Strengths
                          </p>
                          <div className="space-y-2">
                            {source.strengths.map((s, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 p-3 bg-green-50 rounded-xl"
                              >
                                <span className="mt-1 w-5 h-5 shrink-0 rounded-md bg-green-500 text-white text-xs flex items-center justify-center font-bold">
                                  ✓
                                </span>
                                <p className="text-green-800 text-sm leading-relaxed">
                                  {s}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {source?.warnings?.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Areas to
                            Address
                          </p>
                          <div className="space-y-2">
                            {source.warnings.map((w, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 p-3 bg-red-50 rounded-xl"
                              >
                                <span className="mt-1 w-5 h-5 shrink-0 rounded-md bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                                  ⚠
                                </span>
                                <p className="text-red-800 text-sm leading-relaxed">
                                  {w}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {source?.recommended_strategies?.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Recommended Actions
                          </p>
                          <div className="space-y-3">
                            {source.recommended_strategies.map((r, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl"
                              >
                                {gemData ? (
                                  <>
                                    <span
                                      className={`mt-1 shrink-0 px-2 py-0.5 rounded-md text-white text-xs font-bold ${priorities[r.priority] || "bg-indigo-600"}`}
                                    >
                                      {r.priority}
                                    </span>
                                    <div>
                                      <p className="text-indigo-900 font-bold text-sm">
                                        {r.title}
                                      </p>
                                      <p className="text-indigo-700 text-sm leading-relaxed">
                                        {r.action}
                                      </p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <span className="mt-1 w-5 h-5 shrink-0 rounded-md bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                                      {i + 1}
                                    </span>
                                    <p className="text-indigo-800 text-sm leading-relaxed">
                                      {r}
                                    </p>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <SectionHeading
                          title="Industry Benchmarks"
                          subtitle="How you compare"
                          icon={<Globe className="w-4 h-4" />}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500">Your Growth</p>
                            <p
                              className={`text-xl font-bold ${(intelligence?.intelligence?.forecast?.user_growth || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {intelligence?.intelligence?.forecast
                                ?.user_growth > 0
                                ? "+"
                                : ""}
                              {intelligence?.intelligence?.forecast
                                ?.user_growth || 0}
                              %
                            </p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500">
                              Industry Growth
                            </p>
                            <p className="text-xl font-bold text-blue-600">
                              +
                              {intelligence?.intelligence?.industry
                                ?.industry_growth || 0}
                              %
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                          <p className="text-xs text-amber-700">
                            {intelligence?.intelligence?.industry
                              ?.performance_gap > 0
                              ? `You're outperforming industry by ${intelligence.intelligence.industry.performance_gap}%`
                              : `Industry is growing ${Math.abs(intelligence?.intelligence?.industry?.performance_gap || 0)}% faster than you`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* Customer Acquisition Tab - NEW WORKING TAB */}
          {activeTab === "acquisition" && (
            <div className="space-y-6">
              {!status?.has_enough_data ? (
                <InsufficientDataCard
                  remaining={status?.remaining}
                  message="Add more records to unlock personalized customer acquisition strategies."
                  onRefresh={handleRefresh}
                />
              ) : (
                <CustomerAcquisitionStrategies
                  currentData={currentData}
                  intelligence={intelligence}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
