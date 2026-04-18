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
  LineChart,
  Line,
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
  Instagram,
  TrendingUp as TrendIcon,
  Award,
  PieChart,
  MessageCircle,
  ThumbsUp,
  HelpCircle,
  Loader,
  FileText,
  ExternalLink,
  Settings,
  Filter,
  Star,
  Gift,
  Rocket,
  Heart,
  Coffee,
  Briefcase,
  Home,
  Layers,
  Activity,
  Radio,
  Circle,
  UserPlus,
  PlusCircle,
  Send,
  Phone,
  MapPin,
  Sun,
  Moon,
  Plus,
  Trash2,
  Edit2,
  PartyPopper,
  Gift as GiftIcon,
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

const formatCsvValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
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

// Seasonal Events Data
const SEASONAL_EVENTS = [
  {
    id: 1,
    name: "Diwali Festival",
    icon: <GiftIcon className="w-5 h-5" />,
    date: "October - November",
    expectedLift: 60,
    category: "festival",
    color: "orange",
    bgGradient: "from-orange-500 to-red-600",
    recommendedActions: [
      "Launch festive collections 4 weeks before Diwali",
      "Offer Diwali combo discounts (15-25% off)",
      "Run social media countdown campaigns",
      "Send personalized Diwali greeting emails",
      "Create festive gift guides and bundles",
      "Implement 'Shop now, pay later' options"
    ],
    budgetSuggestion: 50000,
    roi: "3-4x",
    preparationTime: "4 weeks before",
  },
  {
    id: 2,
    name: "New Year Sale",
    icon: <PartyPopper className="w-5 h-5" />,
    date: "December - January",
    expectedLift: 45,
    category: "sale",
    color: "blue",
    bgGradient: "from-blue-500 to-cyan-600",
    recommendedActions: [
      "Year-end clearance promotions (20-40% off)",
      "New Year resolution themed campaigns",
      "Limited time flash sales (24-48 hours)",
      "Loyalty program double points event",
      "Early bird booking discounts for Q1",
      "'12 Days of Sales' campaign"
    ],
    budgetSuggestion: 40000,
    roi: "2.5-3.5x",
    preparationTime: "3 weeks before",
  },
  {
    id: 3,
    name: "Summer Splash",
    icon: <Sun className="w-5 h-5" />,
    date: "March - April",
    expectedLift: 35,
    category: "seasonal",
    color: "yellow",
    bgGradient: "from-yellow-500 to-orange-500",
    recommendedActions: [
      "Launch summer catalog in early March",
      "Heat wave emergency flash sales",
      "Beach/holiday themed content marketing",
      "Collaborate with summer lifestyle influencers",
      "Offer free shipping on summer items",
      "Create summer lookbook videos"
    ],
    budgetSuggestion: 35000,
    roi: "2-3x",
    preparationTime: "3 weeks before",
  },
  {
    id: 4,
    name: "Black Friday",
    icon: <ShoppingCart className="w-5 h-5" />,
    date: "November",
    expectedLift: 75,
    category: "sale",
    color: "purple",
    bgGradient: "from-purple-600 to-pink-600",
    recommendedActions: [
      "Week-long daily deals with increasing discounts",
      "Doorbuster midnight offers (first 100 customers)",
      "Email list VIP early access (24 hours early)",
      "Buy more, save more campaigns (₹5000 = 10% off)",
      "Social media flash giveaways every hour",
      "Abandoned cart recovery with extra 5% off"
    ],
    budgetSuggestion: 60000,
    roi: "4-5x",
    preparationTime: "5 weeks before",
  },
  {
    id: 5,
    name: "Holi Celebration",
    icon: <Heart className="w-5 h-5" />,
    date: "March",
    expectedLift: 40,
    category: "festival",
    color: "pink",
    bgGradient: "from-pink-500 to-rose-600",
    recommendedActions: [
      "Colorful product collection launch",
      "Group buying discounts (buy 3 get 1 free)",
      "Social media color splash contest",
      "Festival recipe/user-generated content campaign",
      "Same-day delivery promise for Holi",
      "Referral program double rewards"
    ],
    budgetSuggestion: 30000,
    roi: "2.5-3.5x",
    preparationTime: "3 weeks before",
  },
  {
    id: 6,
    name: "Year End Clearance",
    icon: <Rocket className="w-5 h-5" />,
    date: "December",
    expectedLift: 50,
    category: "sale",
    color: "teal",
    bgGradient: "from-teal-500 to-emerald-600",
    recommendedActions: [
      "Up to 70% off on old inventory",
      "Mystery boxes with surprise products",
      "Last chance email reminders",
      "Social media stock countdown",
      "Bundle deals with free gift wrapping",
      "Loyalty points redemption event"
    ],
    budgetSuggestion: 45000,
    roi: "3-4x",
    preparationTime: "2 weeks before",
  },
];

// Seasonal Campaign Planner Component
const SeasonalCampaignPlanner = ({ currentData, intelligence, onPlanClick }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [customBudget, setCustomBudget] = useState(25000);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedEventForBudget, setSelectedEventForBudget] = useState(null);

  const calculateProjectedRevenue = (event, budget) => {
    const baseMultiplier = event.expectedLift / 100;
    const budgetMultiplier = budget / event.budgetSuggestion;
    const currentSales = currentData?.total_sales || 100000;
    return currentSales * baseMultiplier * Math.min(budgetMultiplier, 2);
  };

  const handlePlanCampaign = (event) => {
    setSelectedEventForBudget(event);
    setCustomBudget(event.budgetSuggestion);
    setShowBudgetModal(true);
  };

  const handleConfirmPlan = () => {
    if (selectedEventForBudget) {
      alert(`✅ Campaign "${selectedEventForBudget.name}" planned with budget ₹${customBudget.toLocaleString()}!\n\nProjected additional revenue: ${formatCurrency(calculateProjectedRevenue(selectedEventForBudget, customBudget))}\n\nCheck your email for the detailed campaign guide.`);
    }
    setShowBudgetModal(false);
    if (onPlanClick) onPlanClick();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <SectionHeading
        title="🎊 Seasonal & Festival Campaign Planner"
        subtitle="Plan your marketing around upcoming events"
        icon={<Calendar className="w-4 h-4" />}
        badge={<Pill color="purple"><Sparkles className="w-3 h-3" /> Maximize ROI</Pill>}
      />

      {/* Upcoming Events Grid */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" />
          Upcoming Opportunities
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SEASONAL_EVENTS.map((event) => (
            <div
              key={event.id}
              className={`relative overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer ${selectedEvent?.id === event.id ? "border-indigo-500 shadow-md" : "border-gray-100"}`}
              onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
            >
              <div className={`bg-linear-to-r ${event.bgGradient} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                      {event.icon}
                    </div>
                    <p className="font-bold text-sm">{event.name}</p>
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    +{event.expectedLift}% lift
                  </span>
                </div>
                <p className="text-xs text-white/80 mt-2">{event.date}</p>
              </div>
              <div className="p-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-500">Budget range:</span>
                  <span className="font-semibold text-gray-700">
                    ₹{(event.budgetSuggestion * 0.7).toLocaleString()} - ₹{(event.budgetSuggestion * 1.3).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs mb-3">
                  <span className="text-gray-500">Expected ROI:</span>
                  <span className="font-semibold text-green-600">{event.roi}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanCampaign(event);
                  }}
                  className="w-full mt-2 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-1"
                >
                  <Rocket className="w-3 h-3" /> Plan Campaign
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <div className="mt-6 p-5 bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                {selectedEvent.icon}
              </div>
              <h3 className="font-bold text-indigo-900">{selectedEvent.name} Strategy</h3>
            </div>
            <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">
              Prepare {selectedEvent.preparationTime}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-indigo-700 mb-2">📋 Recommended Actions:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedEvent.recommendedActions.map((action, i) => (
                  <li key={i} className="text-xs text-indigo-800 flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">✓</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-indigo-100">
              <div>
                <p className="text-xs text-indigo-500">Expected Lift</p>
                <p className="text-lg font-bold text-indigo-800">+{selectedEvent.expectedLift}%</p>
              </div>
              <div>
                <p className="text-xs text-indigo-500">Suggested Budget</p>
                <p className="text-lg font-bold text-indigo-800">{formatCurrency(selectedEvent.budgetSuggestion)}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-500">Expected ROI</p>
                <p className="text-lg font-bold text-green-600">{selectedEvent.roi}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips Banner */}
      <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <p className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" /> Seasonal Success Tips
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-700">
          <div className="flex items-start gap-2">
            <span className="text-amber-600">1.</span>
            <span>Start planning 4-6 weeks before the event</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600">2.</span>
            <span>Create event-specific landing pages</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600">3.</span>
            <span>Build email sequences for each phase</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600">4.</span>
            <span>Retarget past customers with special offers</span>
          </div>
        </div>
      </div>

      {/* Budget Planning Modal */}
      {showBudgetModal && selectedEventForBudget && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowBudgetModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Plan {selectedEventForBudget.name} Campaign</h3>
              <button
                onClick={() => setShowBudgetModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4" /> Campaign Budget: ₹{customBudget.toLocaleString()}
                </label>
                <input
                  type="range"
                  min={selectedEventForBudget.budgetSuggestion * 0.5}
                  max={selectedEventForBudget.budgetSuggestion * 2}
                  step={5000}
                  value={customBudget}
                  onChange={(e) => setCustomBudget(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹{(selectedEventForBudget.budgetSuggestion * 0.5).toLocaleString()}</span>
                  <span>₹{(selectedEventForBudget.budgetSuggestion).toLocaleString()}</span>
                  <span>₹{(selectedEventForBudget.budgetSuggestion * 2).toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-indigo-800 mb-2">Projected Impact</p>
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-600">Expected Lift:</span>
                  <span className="font-bold text-indigo-800">+{selectedEventForBudget.expectedLift}%</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-indigo-600">Projected Revenue:</span>
                  <span className="font-bold text-indigo-800">
                    {formatCurrency(calculateProjectedRevenue(selectedEventForBudget, customBudget))}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleConfirmPlan}
              className="w-full mt-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Confirm Campaign Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Performance Comparison Component
const PerformanceComparison = ({ currentData, intelligence }) => {
  const userGrowth = intelligence?.intelligence?.forecast?.user_growth || 0;
  const industryGrowth = intelligence?.intelligence?.industry?.industry_growth || 0;
  const performanceGap = userGrowth - industryGrowth;
  const profitMargin = currentData?.profit_margin || 0;

  const metrics = [
    {
      label: "Profit Margin",
      yourValue: profitMargin,
      industryAvg: 18,
      unit: "%",
    },
    {
      label: "Growth Rate",
      yourValue: userGrowth,
      industryAvg: industryGrowth,
      unit: "%",
    },
    {
      label: "Market Share",
      yourValue: intelligence?.intelligence?.market?.market_share_percent || 0,
      industryAvg: 10,
      unit: "%",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <SectionHeading
        title="Performance vs Industry"
        subtitle="How you stack up against benchmarks"
        icon={<Award className="w-4 h-4" />}
      />
      <div className="space-y-4">
        {metrics.map((metric, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{metric.label}</span>
              <div className="flex gap-4">
                <span className="text-gray-400 text-xs">
                  You: {metric.yourValue.toFixed(1)}{metric.unit}
                </span>
                <span className="text-gray-400 text-xs">
                  Avg: {metric.industryAvg.toFixed(1)}{metric.unit}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${metric.yourValue >= metric.industryAvg ? "bg-green-500" : "bg-red-500"}`}
                style={{
                  width: `${Math.min(100, (metric.yourValue / Math.max(metric.industryAvg, 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div
        className={`mt-4 p-3 rounded-xl ${performanceGap >= 0 ? "bg-green-50" : "bg-red-50"}`}
      >
        <p className={`text-xs ${performanceGap >= 0 ? "text-green-700" : "text-red-700"}`}>
          {performanceGap >= 0
            ? `✨ You're outperforming industry by ${performanceGap.toFixed(1)}%`
            : `⚠️ Industry is growing ${Math.abs(performanceGap).toFixed(1)}% faster than you`}
        </p>
      </div>
    </div>
  );
};

// Customer Acquisition Strategies
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
        {CUSTOMER_ACQUISITION_STRATEGIES.map((s, idx) => (
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

// Critical Alert Component
const CriticalAlert = ({ riskLevel, riskScore, warnings }) => {
  if (riskLevel !== "High Risk" && riskScore < 50) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-bold text-red-800">Critical Alert</p>
          <p className="text-red-700 text-sm">
            {riskLevel === "High Risk"
              ? `Your business is at ${riskLevel.toLowerCase()} with a score of ${riskScore}/100. `
              : `Your risk score is ${riskScore}/100. `}
            Review the Growth Strategy tab immediately for recommended actions.
          </p>
          {warnings && warnings.length > 0 && (
            <ul className="mt-2 text-xs text-red-600 list-disc list-inside">
              {warnings.slice(0, 2).map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
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
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [activeDateFilter, setActiveDateFilter] = useState("all");
  const [filteredTrend, setFilteredTrend] = useState([]);
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      source: "Referral",
      date: "2024-04-15",
      value: 15000,
    },
    {
      id: 2,
      name: "Priya Sharma",
      source: "Social Media",
      date: "2024-04-14",
      value: 25000,
    },
    {
      id: 3,
      name: "Amit Patel",
      source: "Organic",
      date: "2024-04-13",
      value: 10000,
    },
  ]);
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
      target: 50,
      current: 3,
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
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    source: "Organic",
    value: 0,
  });

  // Filter data based on date range
  const applyDateFilter = (data, range) => {
    if (!range.start || !data) return data;
    return data.filter((item) => {
      const itemDate = new Date(item.month);
      return itemDate >= range.start && itemDate <= (range.end || new Date());
    });
  };

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
    seasonalEvents: SEASONAL_EVENTS,
    exportedAt: new Date().toISOString(),
  });

  // EXPORT FUNCTIONS
  // CSV Export
  const downloadCsv = (payload) => {
    const csvRows = [];
    
    const addRow = (cells) => {
      csvRows.push(cells.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','));
    };

    addRow(['=== BUSINESS REPORT ===']);
    addRow([]);
    addRow(['Report Information']);
    addRow(['Business', payload.businessName]);
    addRow(['Date Range', payload.dateRange]);
    addRow(['Exported At', payload.exportedAt]);
    addRow([]);
    
    // Overview Section
    addRow(['=== OVERVIEW ===']);
    if (payload.overview?.overview) {
      const ov = payload.overview.overview;
      addRow(['Total Sales', formatCurrency(ov.total_sales)]);
      addRow(['Total Expenses', formatCurrency(ov.total_expenses)]);
      addRow(['Total Profit', formatCurrency(ov.total_profit)]);
      addRow(['Profit Margin', formatPercent(ov.profit_margin / 100)]);
      addRow(['Total Records', ov.total_records || 'N/A']);
      addRow(['Average Daily Sales', formatCurrency(ov.avg_daily_sales)]);
    }
    addRow([]);
    
    // AI Insights Section
    addRow(['=== AI INSIGHTS ===']);
    if (payload.intelligence?.intelligence) {
      const ins = payload.intelligence.intelligence;
      if (ins.forecast) {
        addRow(['Forecast - Trend', ins.forecast.trend?.toUpperCase() || 'N/A']);
        addRow(['Forecast - 30-Day Demand', formatCurrency(ins.forecast.predicted_30_day_demand)]);
        addRow(['Forecast - Confidence', `${ins.forecast.confidence_score || 0}%`]);
        addRow(['Forecast - User Growth', `${ins.forecast.user_growth > 0 ? '+' : ''}${ins.forecast.user_growth || 0}%`]);
      }
      if (ins.risk) {
        addRow(['Risk - Score', `${ins.risk.risk_score || 0}/100`]);
        addRow(['Risk - Level', ins.risk.risk_level || 'N/A']);
      }
      if (ins.market) {
        addRow(['Market - Share', `${ins.market.market_share_percent || 0}%`]);
        addRow(['Market - Status', ins.market.share_status || 'N/A']);
      }
    }
    addRow([]);
    
    // Growth Strategy Section
    addRow(['=== GROWTH STRATEGY ===']);
    if (payload.growthStrategy) {
      if (payload.growthStrategy.recommended_strategies) {
        addRow(['Recommended Actions']);
        payload.growthStrategy.recommended_strategies.forEach((strategy, idx) => {
          addRow([`Strategy ${idx + 1}`, strategy.title || strategy]);
          if (strategy.action) addRow([`  Action`, strategy.action]);
          if (strategy.priority) addRow([`  Priority`, strategy.priority]);
        });
      }
      if (payload.growthStrategy.strengths?.length) {
        addRow(['Strengths', payload.growthStrategy.strengths.join('; ')]);
      }
      if (payload.growthStrategy.warnings?.length) {
        addRow(['Areas to Address', payload.growthStrategy.warnings.join('; ')]);
      }
    }
    addRow([]);
    
    // Seasonal Events Section
    addRow(['=== SEASONAL & FESTIVAL EVENTS ===']);
    payload.seasonalEvents.forEach((event, idx) => {
      addRow([`Event ${idx + 1}`, event.name]);
      addRow([`  Date`, event.date]);
      addRow([`  Expected Lift`, `+${event.expectedLift}%`]);
      addRow([`  Expected ROI`, event.roi]);
      addRow([`  Suggested Budget`, formatCurrency(event.budgetSuggestion)]);
      addRow([`  Recommended Actions`, event.recommendedActions.join('; ')]);
    });
    addRow([]);
    
    // Customer Acquisition Section
    addRow(['=== CUSTOMER ACQUISITION ===']);
    payload.customerAcquisition.forEach((channel, idx) => {
      addRow([`Channel ${idx + 1}`, channel.channel]);
      addRow([`  Expected ROI`, channel.expectedROI]);
      addRow([`  Timeframe`, channel.timeframe]);
      addRow([`  Strategies`, channel.strategies.join('; ')]);
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `business_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // PDF Export
  const downloadPdf = (payload) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 40;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 40;
    const maxWidth = pageWidth - (margin * 2);
    
    const printText = (text, options = {}) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        if (y > doc.internal.pageSize.height - 50) {
          doc.addPage();
          y = 40;
        }
        doc.text(line, margin, y, options);
        y += 16;
      });
    };
    
    const printHeading = (text, level = 1) => {
      if (y > doc.internal.pageSize.height - 60) {
        doc.addPage();
        y = 40;
      }
      if (level === 1) {
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        printText(text);
        y += 8;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
      } else if (level === 2) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        printText(text);
        y += 6;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
      } else {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        printText(text);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
      }
    };
    
    const printSubSection = (title, content) => {
      printHeading(title, 3);
      if (typeof content === 'string') {
        printText(content);
      } else if (Array.isArray(content)) {
        content.forEach(item => {
          printText(`• ${item}`);
        });
      } else if (typeof content === 'object') {
        Object.entries(content).forEach(([key, value]) => {
          if (typeof value !== 'object' && value !== null && value !== undefined) {
            printText(`${key}: ${value}`);
          }
        });
      }
      y += 8;
    };
    
    // Title
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('Biz Buddy Business Report', margin, y);
    y += 35;
    
    // Metadata
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    printText(`Business: ${payload.businessName}`);
    printText(`Date Range: ${payload.dateRange === 'all' ? 'All Time' : payload.dateRange}`);
    printText(`Exported At: ${new Date(payload.exportedAt).toLocaleString()}`);
    y += 20;
    
    // 1. Overview
    printHeading('1. Overview', 1);
    if (payload.overview?.overview) {
      const overview = payload.overview.overview;
      printText(`Total Sales: ${formatCurrency(overview.total_sales)}`);
      printText(`Total Expenses: ${formatCurrency(overview.total_expenses)}`);
      printText(`Total Profit: ${formatCurrency(overview.total_profit)}`);
      printText(`Profit Margin: ${formatPercent(overview.profit_margin / 100)}`);
      printText(`Total Records: ${overview.total_records || 'N/A'}`);
      printText(`Average Daily Sales: ${formatCurrency(overview.avg_daily_sales)}`);
    }
    y += 20;
    
    // 2. AI Insights
    printHeading('2. AI Insights', 1);
    if (payload.intelligence?.intelligence) {
      const insights = payload.intelligence.intelligence;
      if (insights.forecast) {
        printSubSection('Forecast Analysis', {
          'Trend': insights.forecast.trend?.toUpperCase() || 'N/A',
          '30-Day Demand': formatCurrency(insights.forecast.predicted_30_day_demand),
          'Confidence': `${insights.forecast.confidence_score || 0}%`,
          'User Growth': `${insights.forecast.user_growth > 0 ? '+' : ''}${insights.forecast.user_growth || 0}%`
        });
      }
      if (insights.risk) {
        printSubSection('Risk Assessment', {
          'Risk Score': `${insights.risk.risk_score || 0}/100`,
          'Risk Level': insights.risk.risk_level || 'N/A'
        });
      }
      if (insights.market) {
        printSubSection('Market Position', {
          'Market Share': `${insights.market.market_share_percent || 0}%`,
          'Share Status': insights.market.share_status || 'N/A'
        });
      }
    }
    y += 20;
    
    // 3. Growth Strategy
    printHeading('3. Growth Strategy', 1);
    if (payload.growthStrategy) {
      if (payload.growthStrategy.recommended_strategies) {
        printHeading('Recommended Actions', 2);
        payload.growthStrategy.recommended_strategies.forEach((strategy, idx) => {
          printText(`${idx + 1}. ${strategy.title || strategy}`);
          if (strategy.action) printText(`   Action: ${strategy.action}`);
          if (strategy.priority) printText(`   Priority: ${strategy.priority}`);
          y += 6;
        });
        y += 8;
      }
      if (payload.growthStrategy.strengths?.length) {
        printSubSection('Your Strengths', payload.growthStrategy.strengths);
      }
      if (payload.growthStrategy.warnings?.length) {
        printSubSection('Areas to Address', payload.growthStrategy.warnings);
      }
    }
    y += 20;
    
    // 4. Seasonal & Festival Events
    printHeading('4. Seasonal & Festival Opportunities', 1);
    payload.seasonalEvents.forEach((event, idx) => {
      printHeading(`${idx + 1}. ${event.name}`, 2);
      printText(`Date: ${event.date}`);
      printText(`Expected Lift: +${event.expectedLift}%`);
      printText(`Expected ROI: ${event.roi}`);
      printText(`Suggested Budget: ${formatCurrency(event.budgetSuggestion)}`);
      printHeading('Recommended Actions:', 3);
      event.recommendedActions.forEach(action => {
        printText(`  • ${action}`);
      });
      y += 12;
    });
    y += 20;
    
    // 5. Customer Acquisition
    printHeading('5. Customer Acquisition Strategies', 1);
    payload.customerAcquisition.forEach((channel, idx) => {
      printHeading(`${idx + 1}. ${channel.channel}`, 2);
      printText(`Expected ROI: ${channel.expectedROI}`);
      printText(`Timeframe: ${channel.timeframe}`);
      printHeading('Key Strategies:', 3);
      channel.strategies.forEach(strategy => {
        printText(`  • ${strategy}`);
      });
      y += 12;
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated by Biz Buddy - Page ${i} of ${pageCount}`, margin, doc.internal.pageSize.height - 20);
    }
    
    doc.save(`business_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Excel Export (HTML format)
  const downloadExcel = (payload) => {
    let htmlContent = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Business Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; }
        h2 { color: #4F46E5; margin-top: 30px; background-color: #EEF2FF; padding: 8px; }
        h3 { color: #6B21A5; margin-top: 20px; }
        table { border-collapse: collapse; margin-bottom: 20px; width: 100%; }
        th { background-color: #4F46E5; color: white; padding: 10px; text-align: left; }
        td { padding: 8px; border: 1px solid #ddd; }
        .section { margin-bottom: 30px; }
        .label { font-weight: bold; width: 200px; background-color: #F3F4F6; }
        .event-card { background-color: #FEF3C7; margin-bottom: 15px; padding: 10px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <h1>Biz Buddy Business Report</h1>
      <p><strong>Generated:</strong> ${new Date(payload.exportedAt).toLocaleString()}</p>
      <p><strong>Business:</strong> ${payload.businessName}</p>
      <p><strong>Date Range:</strong> ${payload.dateRange === 'all' ? 'All Time' : payload.dateRange}</p>
    `;
    
    // Overview Section
    htmlContent += `<div class="section">
      <h2>1. Overview</h2>
      <table>
        <tr><th class="label">Metric</th><th>Value</th></tr>`;
    if (payload.overview?.overview) {
      const ov = payload.overview.overview;
      htmlContent += `
        <tr><td class="label">Total Sales</td><td>${formatCurrency(ov.total_sales)}</td></tr>
        <tr><td class="label">Total Expenses</td><td>${formatCurrency(ov.total_expenses)}</td></tr>
        <tr><td class="label">Total Profit</td><td>${formatCurrency(ov.total_profit)}</td></tr>
        <tr><td class="label">Profit Margin</td><td>${formatPercent(ov.profit_margin / 100)}</td></tr>
        <tr><td class="label">Total Records</td><td>${ov.total_records || 'N/A'}</td></tr>
        <tr><td class="label">Average Daily Sales</td><td>${formatCurrency(ov.avg_daily_sales)}</td></tr>`;
    }
    htmlContent += `</table></div>`;
    
    // AI Insights Section
    htmlContent += `<div class="section">
      <h2>2. AI Insights</h2>
      <table>
        <tr><th class="label">Category</th><th>Metric</th><th>Value</th></tr>`;
    if (payload.intelligence?.intelligence) {
      const ins = payload.intelligence.intelligence;
      if (ins.forecast) {
        htmlContent += `
          <tr><td rowspan="4">Forecast</td><td>Trend</td><td>${ins.forecast.trend?.toUpperCase() || 'N/A'}</td></tr>
          <tr><td>30-Day Demand</td><td>${formatCurrency(ins.forecast.predicted_30_day_demand)}</td></tr>
          <tr><td>Confidence</td><td>${ins.forecast.confidence_score || 0}%</td></tr>
          <tr><td>User Growth</td><td>${ins.forecast.user_growth > 0 ? '+' : ''}${ins.forecast.user_growth || 0}%</td></tr>`;
      }
      if (ins.risk) {
        htmlContent += `
          <tr><td rowspan="2">Risk</td><td>Risk Score</td><td>${ins.risk.risk_score || 0}/100</td></tr>
          <tr><td>Risk Level</td><td>${ins.risk.risk_level || 'N/A'}</td></tr>`;
      }
      if (ins.market) {
        htmlContent += `
          <tr><td rowspan="2">Market</td><td>Market Share</td><td>${ins.market.market_share_percent || 0}%</td></tr>
          <tr><td>Share Status</td><td>${ins.market.share_status || 'N/A'}</td></tr>`;
      }
    }
    htmlContent += `</table></div>`;
    
    // Growth Strategy Section
    htmlContent += `<div class="section">
      <h2>3. Growth Strategy</h2>`;
    if (payload.growthStrategy?.recommended_strategies) {
      htmlContent += `<table>
        <tr><th>Priority</th><th>Strategy</th><th>Action</th></tr>`;
      payload.growthStrategy.recommended_strategies.forEach(strategy => {
        htmlContent += `
          <tr>
            <td>${strategy.priority || 'N/A'}</td>
            <td>${strategy.title || ''}</td>
            <td>${strategy.action || ''}</td>
          </tr>`;
      });
      htmlContent += `</table>`;
    }
    if (payload.growthStrategy?.strengths?.length) {
      htmlContent += `<p><strong>Strengths:</strong> ${payload.growthStrategy.strengths.join('; ')}</p>`;
    }
    if (payload.growthStrategy?.warnings?.length) {
      htmlContent += `<p><strong>Areas to Address:</strong> ${payload.growthStrategy.warnings.join('; ')}</p>`;
    }
    htmlContent += `</div>`;
    
    // Seasonal Events Section
    htmlContent += `<div class="section">
      <h2>4. Seasonal & Festival Opportunities</h2>`;
    payload.seasonalEvents.forEach(event => {
      htmlContent += `
        <div class="event-card">
          <h3>🎊 ${event.name}</h3>
          <table>
            <tr><td class="label">Date</td><td>${event.date}</td></tr>
            <tr><td class="label">Expected Lift</td><td>+${event.expectedLift}%</td></tr>
            <tr><td class="label">Expected ROI</td><td>${event.roi}</td></tr>
            <tr><td class="label">Suggested Budget</td><td>${formatCurrency(event.budgetSuggestion)}</td></tr>
            <tr><td class="label">Preparation Time</td><td>${event.preparationTime}</td></tr>
            <tr><td class="label">Recommended Actions</td><td>${event.recommendedActions.join('; ')}</td></tr>
          </table>
        </div>`;
    });
    htmlContent += `</div>`;
    
    // Customer Acquisition Section
    htmlContent += `<div class="section">
      <h2>5. Customer Acquisition Strategies</h2>
      <table>
        <tr><th>Channel</th><th>Expected ROI</th><th>Timeframe</th><th>Strategies</th></tr>`;
    payload.customerAcquisition.forEach(channel => {
      htmlContent += `
        <tr>
          <td>${channel.channel}</td>
          <td>${channel.expectedROI}</td>
          <td>${channel.timeframe}</td>
          <td>${channel.strategies.join('; ')}</td>
        </tr>`;
    });
    htmlContent += `</table></div>`;
    
    htmlContent += `
    </body>
    </html>`;
    
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `business_report_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Main Export Handler
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
        downloadExcel(payload);
        alert("✅ Report exported as Excel!");
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

  const addCustomer = () => {
    if (!newCustomer.name) {
      alert("Please enter customer name");
      return;
    }

    const customer = {
      id: customers.length + 1,
      name: newCustomer.name,
      source: newCustomer.source,
      date: new Date().toISOString().split("T")[0],
      value: newCustomer.value || Math.floor(Math.random() * 20000) + 5000,
    };

    setCustomers([customer, ...customers]);

    const customerGoal = goals.find((g) => g.name === "Customer Acquisition");
    if (
      customerGoal &&
      !customerGoal.completed &&
      customerGoal.current < customerGoal.target
    ) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === customerGoal.id ? { ...g, current: g.current + 1 } : g,
        ),
      );
    }

    setNotifications((prev) => [
      {
        id: Date.now(),
        message: `🎉 New customer added: ${newCustomer.name} (via ${newCustomer.source})`,
        read: false,
        time: "Just now",
      },
      ...prev,
    ]);

    setNewCustomer({ name: "", source: "Organic", value: 0 });
    setShowAddCustomerModal(false);
    alert(`✅ Customer "${customer.name}" added successfully!`);
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter((c) => c.id !== id));
    const customerGoal = goals.find((g) => g.name === "Customer Acquisition");
    if (customerGoal && customerGoal.current > 0) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === customerGoal.id
            ? { ...g, current: Math.max(0, g.current - 1) }
            : g,
        ),
      );
    }
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
  const customerGoal = goals.find((g) => g.name === "Customer Acquisition");
  const customerProgress = customerGoal
    ? (customerGoal.current / customerGoal.target) * 100
    : 0;

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

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddCustomerModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Add New Customer</h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Customer name"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-3"
            />
            <select
              value={newCustomer.source}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, source: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-3"
            >
              <option value="Organic">Organic</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Paid Ads">Paid Ads</option>
              <option value="Email">Email</option>
              <option value="Walk-in">Walk-in</option>
            </select>
            <input
              type="number"
              placeholder="Order value (₹)"
              value={newCustomer.value}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  value: parseInt(e.target.value) || 0,
                })
              }
              className="w-full border rounded-lg p-2 mb-4"
            />
            <button
              onClick={addCustomer}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Customer
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

              <Link
                to="/doc"
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
              >
                Documentation
              </Link>

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

          <CriticalAlert
            riskLevel={intelligence?.intelligence?.risk?.risk_level}
            riskScore={intelligence?.intelligence?.risk?.risk_score}
            warnings={risks}
          />

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
                          {goal.name === "Customer Acquisition"
                            ? `${formatNumber(goal.current)} / ${formatNumber(goal.target)}`
                            : `${formatCurrency(goal.current)} / ${formatCurrency(goal.target)}`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${goal.name === "Customer Acquisition" ? "bg-amber-500" : "bg-indigo-600"}`}
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
                        <div className="flex gap-2">
                          {goal.name === "Customer Acquisition" && (
                            <button
                              onClick={() => setShowAddCustomerModal(true)}
                              className="text-green-600 hover:text-green-800 text-xs font-medium"
                              disabled={
                                goal.completed || goal.current >= goal.target
                              }
                            >
                              + Add Customer
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (goal.current >= goal.target) {
                                handleGoalComplete(goal.id);
                                setNotifications((prev) => [
                                  {
                                    id: Date.now(),
                                    message: `🏆 Goal "${goal.name}" completed!`,
                                    read: false,
                                    time: "Just now",
                                  },
                                  ...prev,
                                ]);
                              } else if (goal.name === "Customer Acquisition") {
                                alert(
                                  `Need ${goal.target - goal.current} more customers to complete this goal!`,
                                );
                              } else {
                                alert(
                                  `Need ${formatCurrency(goal.target - goal.current)} more in sales to complete this goal!`,
                                );
                              }
                            }}
                            className="text-indigo-500 hover:text-indigo-700 text-xs font-medium"
                            disabled={goal.completed}
                          >
                            {goal.completed ? "✓ Completed" : "Mark Complete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <SectionHeading
                    title="Customer Acquisition"
                    subtitle="Track your customer growth"
                    icon={<Users className="w-4 h-4" />}
                  />
                  <button
                    onClick={() => setShowAddCustomerModal(true)}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Customer
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">
                      Monthly Customer Goal
                    </span>
                    <span className="text-gray-500">
                      {formatNumber(customerGoal?.current || 0)} /{" "}
                      {formatNumber(customerGoal?.target || 50)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${customerProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {customerProgress.toFixed(0)}% complete
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-700 mb-3">
                    Recent Customers
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {customers.length > 0 ? (
                      customers.map((customer) => (
                        <div
                          key={customer.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-800">
                              {customer.name}
                            </p>
                            <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                              <span>Source: {customer.source}</span>
                              <span>
                                Value: {formatCurrency(customer.value)}
                              </span>
                              <span>Date: {customer.date}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteCustomer(customer.id)}
                            className="p-1 text-red-400 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No customers added yet. Click "Add Customer" to start
                        tracking.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Total Customers</p>
                    <p className="text-lg font-bold text-gray-800">
                      {customers.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Total Value</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(
                        customers.reduce((sum, c) => sum + c.value, 0),
                      )}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Avg. Value</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(
                        customers.length > 0
                          ? customers.reduce((sum, c) => sum + c.value, 0) /
                              customers.length
                          : 0,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Acquisition Sources
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Organic",
                      "Referral",
                      "Social Media",
                      "Paid Ads",
                      "Email",
                      "Walk-in",
                    ].map((source) => {
                      const count = customers.filter(
                        (c) => c.source === source,
                      ).length;
                      if (count === 0) return null;
                      return (
                        <span
                          key={source}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {source}: {count}
                        </span>
                      );
                    })}
                    {customers.length === 0 && (
                      <span className="text-xs text-gray-400">No data yet</span>
                    )}
                  </div>
                </div>
              </div>

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

              <PerformanceComparison
                currentData={currentData}
                intelligence={intelligence}
              />

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
                      
                      <PerformanceComparison
                        currentData={currentData}
                        intelligence={intelligence}
                      />

                      <SeasonalCampaignPlanner
                        currentData={currentData}
                        intelligence={intelligence}
                        onPlanClick={() => {
                          setNotifications((prev) => [
                            {
                              id: Date.now(),
                              message: "🎯 New seasonal campaign planned! Check your dashboard.",
                              read: false,
                              time: "Just now",
                            },
                            ...prev,
                          ]);
                        }}
                      />
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {activeTab === "acquisition" && (
            <div className="space-y-6">
              {!status?.has_enough_data ? (
                <InsufficientDataCard
                  remaining={status?.remaining}
                  message="Add more records to unlock personalized customer acquisition strategies."
                  onRefresh={handleRefresh}
                />
              ) : (
                <>
                  <CustomerAcquisitionStrategies
                    currentData={currentData}
                    intelligence={intelligence}
                  />
                  <PerformanceComparison
                    currentData={currentData}
                    intelligence={intelligence}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;