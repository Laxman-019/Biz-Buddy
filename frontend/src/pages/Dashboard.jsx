import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
} from "lucide-react";


const formatCurrency = (num) => {
  if (num === null || num === undefined) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatPercent = (num) => {
  if (num === null || num === undefined) return "-";
  return `${Number(num).toFixed(1)}%`;
};


const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [intelligence, setIntelligence] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "Fetching intelligence status from /api/intelligence/status/...",
      );
      const statusRes = await axiosInstance.get("/api/intelligence/status/");
      console.log("Status response:", statusRes.data);
      setStatus(statusRes.data);

      console.log(
        "Fetching dashboard overview from /api/dashboard/overview/...",
      );
      const overviewRes = await axiosInstance.get("/api/dashboard/overview/");
      console.log("Overview response:", overviewRes.data);
      setOverview(overviewRes.data);

      if (statusRes.data.has_enough_data) {
        console.log(
          "Fetching complete intelligence from /api/intelligence/...",
        );
        const intelligenceRes = await axiosInstance.get("/api/intelligence/");
        console.log("Intelligence response:", intelligenceRes.data);
        setIntelligence(intelligenceRes.data);
      }
    } catch (error) {
      console.error("Dashboard Load Error:", error);
      console.error("Error response:", error.response);
      console.error("Error config:", error.config);

      if (error.response?.status === 404) {
        setError(
          `API endpoint not found: ${error.config.url}. Please check backend configuration.`,
        );
      } else if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        setError(
          error.response?.data?.message || "Failed to load dashboard data",
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading && !refreshing) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">
              Loading your business intelligence...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center bg-red-50 p-8 rounded-xl max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleRefresh}
                className="w-full bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Business Intelligence Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              AI-powered insights to grow your business smarter
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {status && !status.has_enough_data && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <Calendar className="w-6 h-6 text-blue-600 mt-0.5 mr-4 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">
                 Unlock AI-Powered Insights
                </h3>
                <p className="text-blue-700 mb-3">{status.message}</p>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${status.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-blue-600 mt-2">
                  <span>{status.current_records} records</span>
                  <span>{status.required_records} required</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4 mb-8 border-b bg-white px-4 rounded-t-lg">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "overview"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
          Overview
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "insights"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            AI Insights
            {status?.has_enough_data && (
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("strategy")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "strategy"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            Growth Strategy
            {status?.has_enough_data && (
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </button>
        </div>

        {activeTab === "overview" && overview && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="Total Sales"
                value={formatCurrency(overview.overview?.total_sales)}
                icon=""
              />
              <KPICard
                title="Total Expenses"
                value={formatCurrency(overview.overview?.total_expenses)}
                icon=""
              />
              <KPICard
                title="Total Profit"
                value={formatCurrency(overview.overview?.total_profit)}
                subtitle={`Margin: ${formatPercent(overview.overview?.profit_margin / 100)}`}
                icon=""
              />
              <KPICard
                title="Total Records"
                value={overview.overview?.total_records}
                subtitle={`Avg: ${formatCurrency(overview.overview?.avg_daily_sales)}/day`}
                icon=""
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">
                  Monthly Sales Performance
                </h2>
                {overview.monthly_trend?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={overview.monthly_trend}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar
                        dataKey="sales"
                        fill="#4F46E5"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-75 flex items-center justify-center text-gray-400">
                    No monthly data available
                  </div>
                )}
              </div>

              {/* Monthly Profit Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">
                  Monthly Profit Trend
                </h2>
                {overview.monthly_trend?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={overview.monthly_trend}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="#10B981"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-75 flex items-center justify-center text-gray-400">
                    No profit data available
                  </div>
                )}
              </div>
            </div>

            {/* BUSINESS LIST */}
            {overview.business_names?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Your Businesses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {overview.business_names.map((name, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <p className="font-medium text-gray-800">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* AI INSIGHTS TAB */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            {!status?.has_enough_data ? (
              <InsufficientDataCard
                remaining={status?.remaining}
                message="Add more records to unlock AI-powered insights about your business performance, market position, and growth opportunities."
              />
            ) : (
              <>
                {/* AI Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AIMetricCard
                    title="Forecast Trend"
                    value={
                      intelligence?.intelligence?.forecast?.trend?.toUpperCase() ||
                      "N/A"
                    }
                    icon={<TrendingUp className="w-5 h-5" />}
                    color={
                      intelligence?.intelligence?.forecast?.trend === "growing"
                        ? "green"
                        : intelligence?.intelligence?.forecast?.trend ===
                            "declining"
                          ? "red"
                          : "yellow"
                    }
                  />
                  <AIMetricCard
                    title="30-Day Forecast"
                    value={formatCurrency(
                      intelligence?.intelligence?.forecast
                        ?.predicted_30_day_demand,
                    )}
                    subtitle={`${intelligence?.intelligence?.forecast?.confidence_score || 0}% confidence`}
                    icon={<Target className="w-5 h-5" />}
                  />
                  <AIMetricCard
                    title="Market Share"
                    value={`${intelligence?.intelligence?.market?.market_share_percent || 0}%`}
                    subtitle={
                      intelligence?.intelligence?.market?.share_status ||
                      "Unknown"
                    }
                    icon={<Shield className="w-5 h-5" />}
                  />
                  <AIMetricCard
                    title="Risk Score"
                    value={`${intelligence?.intelligence?.risk?.risk_score || 0}/100`}
                    subtitle={
                      intelligence?.intelligence?.risk?.risk_level || "Unknown"
                    }
                    icon={<AlertTriangle className="w-5 h-5" />}
                    color={
                      intelligence?.intelligence?.risk?.risk_level ===
                      "Low Risk"
                        ? "green"
                        : intelligence?.intelligence?.risk?.risk_level ===
                            "Moderate Risk"
                          ? "yellow"
                          : intelligence?.intelligence?.risk?.risk_level ===
                              "High Risk"
                            ? "red"
                            : "blue"
                    }
                  />
                </div>

                {/* Diagnostics */}
                {intelligence?.intelligence?.diagnostics && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-semibold text-lg mb-4">
                    Diagnostic Analysis
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Observations */}
                      <div>
                        <h4 className="font-medium text-indigo-600 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                          Key Observations
                        </h4>
                        <div className="space-y-2">
                          {intelligence.intelligence.diagnostics.diagnostics?.map(
                            (d, i) => (
                              <p
                                key={i}
                                className="text-gray-600 text-sm bg-indigo-50 p-2 rounded"
                              >
                                • {d}
                              </p>
                            ),
                          )}
                          {!intelligence.intelligence.diagnostics.diagnostics
                            ?.length && (
                            <p className="text-gray-400 text-sm">
                              No observations available
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Risks */}
                      <div>
                        <h4 className="font-medium text-red-600 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Risk Factors
                        </h4>
                        <div className="space-y-2">
                          {intelligence.intelligence.diagnostics.risks?.map(
                            (r, i) => (
                              <p
                                key={i}
                                className="text-gray-600 text-sm bg-red-50 p-2 rounded"
                              >
                                ⚠ {r}
                              </p>
                            ),
                          )}
                          {!intelligence.intelligence.diagnostics.risks
                            ?.length && (
                            <p className="text-gray-400 text-sm">
                              No major risks detected
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Strengths */}
                      <div>
                        <h4 className="font-medium text-green-600 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Strengths
                        </h4>
                        <div className="space-y-2">
                          {intelligence.intelligence.diagnostics.strengths?.map(
                            (s, i) => (
                              <p
                                key={i}
                                className="text-gray-600 text-sm bg-green-50 p-2 rounded"
                              >
                                ✓ {s}
                              </p>
                            ),
                          )}
                          {!intelligence.intelligence.diagnostics.strengths
                            ?.length && (
                            <p className="text-gray-400 text-sm">
                              No strengths identified yet
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Competitor Analysis */}
                {intelligence?.intelligence?.competitor && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-semibold text-lg mb-4">
                    Competitive Position
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-purple-600 text-sm mb-1">
                          Your Business Cluster
                        </p>
                        <p className="text-2xl font-bold text-purple-900">
                          {intelligence.intelligence.competitor.user_cluster}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-600 text-sm mb-1">
                          Competitors in Analysis
                        </p>
                        <p className="text-2xl font-bold text-blue-900">
                          {
                            intelligence.intelligence.competitor
                              .total_competitors
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* STRATEGY TAB */}
        {activeTab === "strategy" && (
          <div className="space-y-6">
            {!status?.has_enough_data ? (
              <InsufficientDataCard
                remaining={status?.remaining}
                message="Add more records to get personalized growth strategies tailored to your business."
                icon={<Lightbulb className="w-12 h-12" />}
              />
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
                  AI-Generated Growth Strategy
                </h2>

                {/* Strengths */}
                {intelligence?.strategies?.strengths?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-green-600 font-semibold mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Your Strengths
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg space-y-2">
                      {intelligence.strategies.strengths.map((s, i) => (
                        <p key={i} className="text-green-800">
                          ✓ {s}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings/Risks */}
                {intelligence?.strategies?.warnings?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-red-600 font-semibold mb-3 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Areas to Address
                    </h3>
                    <div className="bg-red-50 p-4 rounded-lg space-y-2">
                      {intelligence.strategies.warnings.map((w, i) => (
                        <p key={i} className="text-red-800">
                          ⚠ {w}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {intelligence?.strategies?.recommended_strategies?.length >
                  0 && (
                  <div>
                    <h3 className="text-indigo-600 font-semibold mb-3 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      Recommended Actions
                    </h3>
                    <div className="bg-indigo-50 p-4 rounded-lg space-y-2">
                      {intelligence.strategies.recommended_strategies.map(
                        (r, i) => (
                          <p key={i} className="text-indigo-800">
                            → {r}
                          </p>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;


const KPICard = ({ title, value, subtitle, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <p className="text-gray-500 text-sm">{title}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

const AIMetricCard = ({ title, value, subtitle, icon, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  return (
    <div className={`p-6 rounded-xl border ${colors[color] || colors.blue}`}>
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-lg bg-white bg-opacity-50`}>{icon}</div>
        <p className="text-sm font-medium ml-2 opacity-75">{title}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
    </div>
  );
};

const InsufficientDataCard = ({ remaining, message, icon }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
    {icon || (
      <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
    )}
    <h3 className="text-xl font-semibold text-yellow-800 mb-2">
      Insufficient Data
    </h3>
    <p className="text-yellow-600 mb-4 max-w-md mx-auto">{message}</p>
    {remaining > 0 && (
      <div className="inline-block bg-yellow-100 px-4 py-2 rounded-lg">
        <p className="text-yellow-800 font-medium">
          {remaining} more {remaining === 1 ? "record" : "records"} needed
        </p>
      </div>
    )}
  </div>
);
