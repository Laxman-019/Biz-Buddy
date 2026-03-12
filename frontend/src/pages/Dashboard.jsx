import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Area, AreaChart,
} from "recharts";
import Layout from "../components/Layout";
import {
  TrendingUp, TrendingDown, AlertTriangle, Lightbulb,
  Target, Shield, Calendar, RefreshCw, BarChart2,
  Brain, Zap, ChevronRight, ArrowUpRight, ArrowDownRight,
  Building2, CheckCircle2, XCircle, ArrowLeft, Sparkles,
} from "lucide-react";

const formatCurrency = (num) => {
  if (num === null || num === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(num);
};
const formatPercent = (num) => {
  if (num === null || num === undefined) return "—";
  return `${Number(num).toFixed(1)}%`;
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

const KPICard = ({ title, value, subtitle, icon, gradient, trend }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 text-white ${gradient} shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}>
    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
    <div className="absolute -bottom-4 -right-2 w-16 h-16 rounded-full bg-white/5" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">{title}</span>
        <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm">{icon}</div>
      </div>
      <p className="text-3xl font-black tracking-tight mb-1">{value}</p>
      {subtitle && (
        <p className="text-white/60 text-xs font-medium flex items-center gap-1">
          {trend === "up" && <ArrowUpRight className="w-3 h-3 text-white/80" />}
          {trend === "down" && <ArrowDownRight className="w-3 h-3 text-white/80" />}
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const AIMetricCard = ({ title, value, subtitle, icon, color = "blue" }) => {
  const palette = {
    blue: { card: "bg-blue-50 border-blue-100", icon: "bg-blue-100 text-blue-600", val: "text-blue-900", sub: "text-blue-500" },
    green: { card: "bg-green-50 border-green-100", icon: "bg-green-100 text-green-600", val: "text-green-900", sub: "text-green-500" },
    red: { card: "bg-red-50 border-red-100", icon: "bg-red-100 text-red-600", val: "text-red-900", sub: "text-red-500" },
    yellow: { card: "bg-amber-50 border-amber-100", icon: "bg-amber-100 text-amber-600", val: "text-amber-900", sub: "text-amber-500" },
  };
  const p = palette[color] || palette.blue;
  return (
    <div className={`rounded-2xl border p-5 ${p.card} hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">{title}</p>
        <div className={`p-2 rounded-xl ${p.icon}`}>{icon}</div>
      </div>
      <p className={`text-2xl font-black ${p.val} mb-1`}>{value}</p>
      {subtitle && <p className={`text-xs font-medium ${p.sub}`}>{subtitle}</p>}
    </div>
  );
};

const InsufficientDataCard = ({ remaining, message }) => (
  <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-10 text-center shadow-sm">
    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <AlertTriangle className="w-8 h-8 text-amber-500" />
    </div>
    <h3 className="text-xl font-bold text-amber-900 mb-2">Insufficient Data</h3>
    <p className="text-amber-700 mb-5 max-w-md mx-auto text-sm leading-relaxed">{message}</p>
    {remaining > 0 && (
      <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 px-5 py-2.5 rounded-xl">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        <p className="text-amber-800 font-semibold text-sm">
          {remaining} more {remaining === 1 ? "record" : "records"} needed
        </p>
      </div>
    )}
  </div>
);

const SectionHeading = ({ icon, title, subtitle, badge }) => (
  <div className="flex items-start justify-between mb-6">
    <div className="flex items-center gap-3">
      {icon && <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">{icon}</div>}
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
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${c[color]}`}>
      {children}
    </span>
  );
};

const DiagRow = ({ text, type }) => {
  const styles = {
    obs: { bg: "bg-indigo-50 border-indigo-100", dot: "bg-indigo-500", icon: "•", text: "text-indigo-800" },
    risk: { bg: "bg-red-50 border-red-100", dot: "bg-red-500", icon: "⚠", text: "text-red-800" },
    strength: { bg: "bg-green-50 border-green-100", dot: "bg-green-500", icon: "✓", text: "text-green-800" },
  };
  const s = styles[type] || styles.obs;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${s.bg} mb-2 last:mb-0`}>
      <span className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0 ${s.dot}`}>
        {s.icon}
      </span>
      <p className={`text-sm ${s.text} leading-relaxed`}>{text}</p>
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

  const fetchBusinessData = async (businessName) => {
    try {
      const response = await axiosInstance.get("/api/list/");
      const allRecords = response.data;
      const businessRecords = allRecords.filter((r) => r.business_name === businessName);
      const total_sales = businessRecords.reduce((s, r) => s + r.sales, 0);
      const total_expenses = businessRecords.reduce((s, r) => s + r.expenses, 0);
      const total_profit = businessRecords.reduce((s, r) => s + r.profit, 0);
      const monthlyData = {};
      businessRecords.forEach((record) => {
        const month = record.date.substring(0, 7);
        if (!monthlyData[month]) monthlyData[month] = { sales: 0, profit: 0 };
        monthlyData[month].sales += record.sales;
        monthlyData[month].profit += record.profit;
      });
      const monthly_trend = Object.keys(monthlyData)
        .map((m) => ({ month: m, sales: monthlyData[m].sales, profit: monthlyData[m].profit }))
        .sort((a, b) => a.month.localeCompare(b.month));
      let businessInsightsData = null;
      try {
        const res = await axiosInstance.get(
          `/api/business-insights/by-name/?business_name=${encodeURIComponent(businessName)}`
        );
        businessInsightsData = res.data;
      } catch (e) { console.error(e); }
      setFilteredRecords({
        overview: {
          total_sales, total_expenses, total_profit,
          total_records: businessRecords.length,
          profit_margin: total_sales > 0 ? (total_profit / total_sales) * 100 : 0,
          avg_daily_sales: total_sales / businessRecords.length,
        },
        monthly_trend,
        insights: businessInsightsData,
      });
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true); setError(null);
      const insightsRes = await axiosInstance.get("/api/business-insights/");
      setBusinessInsights(insightsRes.data);
      const statusRes = await axiosInstance.get("/api/intelligence/status/");
      setStatus(statusRes.data);
      const overviewRes = await axiosInstance.get("/api/dashboard/overview/");
      setOverview(overviewRes.data);
      if (statusRes.data.has_enough_data) {
        const intelligenceRes = await axiosInstance.get("/api/intelligence/");
        setIntelligence(intelligenceRes.data);
      }
    } catch (err) {
      if (err.response?.status === 404) setError(`API endpoint not found: ${err.config.url}`);
      else if (err.response?.status === 401) setError("Authentication failed. Please login again.");
      else setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  const handleRefresh = () => { setRefreshing(true); loadDashboardData(); };

  if (loading && !refreshing) {
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
            <h3 className="text-gray-800 font-semibold text-lg">Loading Intelligence</h3>
            <p className="text-gray-400 text-sm mt-1">Crunching your business data…</p>
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{error}</p>
            <div className="space-y-3">
              <button onClick={handleRefresh} className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                Try Again
              </button>
              <button onClick={() => (window.location.href = "/dashboard")} className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const currentData = filteredRecords ? filteredRecords.overview : overview?.overview;
  const currentTrend = filteredRecords ? filteredRecords.monthly_trend : overview?.monthly_trend;
  const currentBizInsights = selectedBusiness !== "all" ? filteredRecords?.insights : businessInsights;

  const TABS = [
    { id: "overview", label: "Overview", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "insights", label: "AI Insights", icon: <Brain className="w-4 h-4" />, dot: status?.has_enough_data },
    { id: "strategy", label: "Growth Strategy", icon: <Zap className="w-4 h-4" />, dot: status?.has_enough_data },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/80">

        <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Business Intelligence</h1>
                <p className="text-gray-400 text-xs">AI-powered insights to grow smarter</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/doc"
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
              >
                Documentation
              </Link>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="px-4 flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === t.id
                    ? "text-indigo-600 border-indigo-600"
                    : "text-gray-500 border-transparent hover:text-indigo-500"
                  }`}
              >
                {t.icon}
                {t.label}
                {t.dot && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        <div className="py-5 px-4 space-y-6">

          {selectedBusiness !== "all" && (
            <div className="flex items-center justify-between bg-indigo-600 text-white rounded-2xl px-5 py-3 shadow-md shadow-indigo-200">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-indigo-200" />
                <span className="text-sm text-indigo-100">Viewing:</span>
                <span className="font-bold text-white">{selectedBusiness}</span>
              </div>
              <button
                onClick={() => { setSelectedBusiness("all"); setFilteredRecords(null); }}
                className="flex items-center gap-1.5 text-xs text-indigo-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft className="w-3 h-3" /> All Businesses
              </button>
            </div>
          )}

          {status && !status.has_enough_data && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-100 rounded-xl shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 mb-1">Unlock AI-Powered Insights</h3>
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

              {/* KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KPICard
                  title="Total Sales"
                  value={formatCurrency(currentData?.total_sales)}
                  icon={<TrendingUp className="w-5 h-5 text-white" />}
                  gradient="bg-linear-to-br from-indigo-500 to-indigo-700"
                  trend="up"
                />
                <KPICard
                  title="Total Expenses"
                  value={formatCurrency(currentData?.total_expenses)}
                  icon={<TrendingDown className="w-5 h-5 text-white" />}
                  gradient="bg-linear-to-br from-rose-500 to-rose-700"
                />
                <KPICard
                  title="Total Profit"
                  value={formatCurrency(currentData?.total_profit)}
                  subtitle={`Margin: ${formatPercent(currentData?.profit_margin / 100)}`}
                  icon={<Target className="w-5 h-5 text-white" />}
                  gradient="bg-linear-to-br from-emerald-500 to-teal-600"
                  trend="up"
                />
                <KPICard
                  title="Total Records"
                  value={currentData?.total_records ?? "—"}
                  subtitle={`Avg: ${formatCurrency(currentData?.avg_daily_sales)}/day`}
                  icon={<BarChart2 className="w-5 h-5 text-white" />}
                  gradient="bg-linear-to-br from-violet-500 to-purple-700"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <SectionHeading
                    title={`${selectedBusiness !== "all" ? selectedBusiness + " – " : ""}Monthly Sales`}
                    subtitle="Revenue performance over time"
                    icon={<BarChart2 className="w-4 h-4" />}
                  />
                  {currentTrend?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={currentTrend} barSize={28}>
                        <defs>
                          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity={1} />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity={0.7} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="sales" fill="url(#salesGrad)" radius={[6, 6, 0, 0]} name="Sales" />
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
                    title={`${selectedBusiness !== "all" ? selectedBusiness + " – " : ""}Profit Trend`}
                    subtitle="Net profit movement"
                    icon={<TrendingUp className="w-4 h-4" />}
                  />
                  {currentTrend?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={currentTrend}>
                        <defs>
                          <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2.5}
                          fill="url(#profitGrad)"
                          dot={{ fill: "#10B981", r: 4, strokeWidth: 2, stroke: "#fff" }}
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

              {currentBizInsights && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <SectionHeading
                    title={`${selectedBusiness !== "all" ? selectedBusiness + " – " : ""}Business Health`}
                    subtitle="AI-assessed performance & suggestions"
                    icon={<Zap className="w-4 h-4" />}
                    badge={
                      <Pill color={currentBizInsights?.status === "danger" ? "red" : currentBizInsights?.status === "warning" ? "amber" : "green"}>
                        {currentBizInsights?.status === "danger" ? "⚠ Needs Attention" : currentBizInsights?.status === "warning" ? "⚡ Watch Closely" : "✓ On Track"}
                      </Pill>
                    }
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Performance</p>
                      {currentBizInsights?.messages?.map((msg, i) => {
                        const s = currentBizInsights?.status;
                        return (
                          <DiagRow key={i} text={msg}
                            type={s === "danger" ? "risk" : s === "warning" ? "obs" : "strength"}
                          />
                        );
                      })}
                      {!currentBizInsights?.messages?.length && (
                        <p className="text-sm text-gray-400">No performance data yet.</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Suggestions</p>
                      {currentBizInsights?.suggestions?.map((sug, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100 mb-2 last:mb-0">
                          <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-amber-800 leading-relaxed">{sug}</p>
                        </div>
                      ))}
                      {!currentBizInsights?.suggestions?.length && (
                        <p className="text-sm text-gray-400">No suggestions yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {overview.business_names?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <SectionHeading
                    title="Your Businesses"
                    subtitle={`${overview.business_names.length} active ${overview.business_names.length === 1 ? "business" : "businesses"}`}
                    icon={<Building2 className="w-4 h-4" />}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {overview.business_names.map((name, i) => {
                      const isActive = selectedBusiness === name;
                      return (
                        <button
                          key={i}
                          onClick={() => { setSelectedBusiness(name); fetchBusinessData(name); }}
                          className={`group w-full text-left p-4 rounded-xl border transition-all duration-200 ${isActive
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                              : "bg-gray-50 border-gray-100 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm"
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isActive ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"}`}>
                                {name[0]?.toUpperCase()}
                              </div>
                              <p className={`font-semibold text-sm truncate max-w-30 ${isActive ? "text-white" : "text-gray-800"}`}>{name}</p>
                            </div>
                            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${isActive ? "text-white/70" : "text-gray-300"}`} />
                          </div>
                          {isActive && (
                            <div className="mt-2 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                              <span className="text-xs text-indigo-200">Currently viewing</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedBusiness !== "all" && (
                    <button
                      onClick={() => { setSelectedBusiness("all"); setFilteredRecords(null); }}
                      className="mt-5 text-sm text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> View All Businesses
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "insights" && (
            <div className="space-y-6">
              {!status?.has_enough_data ? (
                <InsufficientDataCard
                  remaining={status?.remaining}
                  message="Add more records to unlock AI-powered insights about your business performance, market position, and growth opportunities."
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <AIMetricCard
                      title="Forecast Trend"
                      value={intelligence?.intelligence?.forecast?.trend?.toUpperCase() || "N/A"}
                      icon={intelligence?.intelligence?.forecast?.trend === "declining"
                        ? <TrendingDown className="w-5 h-5" />
                        : <TrendingUp className="w-5 h-5" />}
                      color={
                        intelligence?.intelligence?.forecast?.trend === "growing" ? "green"
                          : intelligence?.intelligence?.forecast?.trend === "declining" ? "red"
                            : "yellow"
                      }
                    />
                    <AIMetricCard
                      title="30-Day Forecast"
                      value={formatCurrency(intelligence?.intelligence?.forecast?.predicted_30_day_demand)}
                      subtitle={`${intelligence?.intelligence?.forecast?.confidence_score || 0}% confidence`}
                      icon={<Target className="w-5 h-5" />}
                      color="blue"
                    />
                    <AIMetricCard
                      title="Market Share"
                      value={`${intelligence?.intelligence?.market?.market_share_percent || 0}%`}
                      subtitle={intelligence?.intelligence?.market?.share_status || "Unknown"}
                      icon={<Shield className="w-5 h-5" />}
                      color="blue"
                    />
                    <AIMetricCard
                      title="Risk Score"
                      value={`${intelligence?.intelligence?.risk?.risk_score || 0}/100`}
                      subtitle={intelligence?.intelligence?.risk?.risk_level || "Unknown"}
                      icon={<AlertTriangle className="w-5 h-5" />}
                      color={
                        intelligence?.intelligence?.risk?.risk_level === "Low Risk" ? "green"
                          : intelligence?.intelligence?.risk?.risk_level === "Moderate Risk" ? "yellow"
                            : intelligence?.intelligence?.risk?.risk_level === "High Risk" ? "red"
                              : "blue"
                      }
                    />
                  </div>

                  {intelligence?.intelligence?.diagnostics && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <SectionHeading
                        title="Diagnostic Analysis"
                        subtitle="Deep-dive into what's driving your results"
                        icon={<Brain className="w-4 h-4" />}
                      />
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Key Observations</p>
                          {intelligence.intelligence.diagnostics.diagnostics?.map((d, i) => (
                            <DiagRow key={i} text={d} type="obs" />
                          ))}
                          {!intelligence.intelligence.diagnostics.diagnostics?.length && (
                            <p className="text-sm text-gray-400">No observations available</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">Risk Factors</p>
                          {intelligence.intelligence.diagnostics.risks?.map((r, i) => (
                            <DiagRow key={i} text={r} type="risk" />
                          ))}
                          {!intelligence.intelligence.diagnostics.risks?.length && (
                            <p className="text-sm text-gray-400">No major risks detected</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">Strengths</p>
                          {intelligence.intelligence.diagnostics.strengths?.map((s, i) => (
                            <DiagRow key={i} text={s} type="strength" />
                          ))}
                          {!intelligence.intelligence.diagnostics.strengths?.length && (
                            <p className="text-sm text-gray-400">No strengths identified yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {intelligence?.intelligence?.competitor && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <SectionHeading
                        title="Competitive Position"
                        subtitle="How you compare in the broader market"
                        icon={<Shield className="w-4 h-4" />}
                      />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-linear-to-br from-violet-50 to-purple-50 border border-violet-100 p-5 rounded-2xl">
                          <p className="text-violet-500 text-xs font-bold uppercase tracking-widest mb-2">Your Business Cluster</p>
                          <p className="text-3xl font-black text-violet-900">{intelligence.intelligence.competitor.user_cluster}</p>
                        </div>
                        <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-2xl">
                          <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-2">Competitors in Analysis</p>
                          <p className="text-3xl font-black text-blue-900">{intelligence.intelligence.competitor.total_competitors}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "strategy" && (
            <div className="space-y-6">
              {!status?.has_enough_data ? (
                <InsufficientDataCard
                  remaining={status?.remaining}
                  message="Add more records to get personalized AI growth strategies tailored specifically to your business."
                />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <SectionHeading
                    title="AI-Generated Growth Strategy"
                    subtitle="Personalized action plan based on your data"
                    icon={<Lightbulb className="w-4 h-4" />}
                    badge={<Pill color="indigo"><Sparkles className="w-3 h-3" /> AI Powered</Pill>}
                  />

                  <div className="space-y-6">
                    {intelligence?.strategies?.strengths?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Your Strengths
                        </p>
                        <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-100 p-5 rounded-2xl space-y-2">
                          {intelligence.strategies.strengths.map((s, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="mt-1 w-5 h-5 shrink-0 rounded-md bg-green-500 text-white text-xs flex items-center justify-center font-bold">✓</span>
                              <p className="text-green-800 text-sm leading-relaxed">{s}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {intelligence?.strategies?.warnings?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> Areas to Address
                        </p>
                        <div className="bg-linear-to-br from-red-50 to-rose-50 border border-red-100 p-5 rounded-2xl space-y-2">
                          {intelligence.strategies.warnings.map((w, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="mt-1 w-5 h-5 shrink-0 rounded-md bg-red-500 text-white text-xs flex items-center justify-center font-bold">⚠</span>
                              <p className="text-red-800 text-sm leading-relaxed">{w}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {intelligence?.strategies?.recommended_strategies?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" /> Recommended Actions
                        </p>
                        <div className="bg-linear-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-5 rounded-2xl space-y-3">
                          {intelligence.strategies.recommended_strategies.map((r, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="mt-1 w-5 h-5 shrink-0 rounded-md bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                                {i + 1}
                              </span>
                              <p className="text-indigo-800 text-sm leading-relaxed">{r}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!intelligence?.strategies?.strengths?.length &&
                      !intelligence?.strategies?.warnings?.length &&
                      !intelligence?.strategies?.recommended_strategies?.length && (
                        <div className="text-center py-8 text-gray-400">
                          <Lightbulb className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No strategies generated yet. Check back soon.</p>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;