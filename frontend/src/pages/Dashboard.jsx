import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Layout from "../components/Layout";

// ================== FORMAT HELPERS ==================

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
  return `${(num * 100).toFixed(1)}%`;
};

// ================== DASHBOARD ==================

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [insights, setInsights] = useState(null);

  const [forecast, setForecast] = useState(null);
  const [market, setMarket] = useState(null);
  const [competitor, setCompetitor] = useState(null);
  const [strategy, setStrategy] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [summaryRes, monthlyRes, insightsRes, forecastRes, marketRes, competitorRes, strategyRes] = await Promise.all([
        axiosInstance.get("/api/business-summary/"),
        axiosInstance.get("/api/monthly-summary/"),
        axiosInstance.get("/api/business-insights/"),
        axiosInstance.get("/api/forecast/"),
        axiosInstance.get("/api/market-analysis/"),
        axiosInstance.get("/api/competitor-analysis/"),
        axiosInstance.get("/api/strategy/"),
      ]);

      setSummary(summaryRes.data);
      setMonthlyData(monthlyRes.data);
      setInsights(insightsRes.data);
      setForecast(forecastRes.data);
      setMarket(marketRes.data);
      setCompetitor(competitorRes.data);
      setStrategy(strategyRes.data);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading Dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#E8EEF5] p-8">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Business Intelligence Dashboard</h1>
          <p className="text-gray-500">AI insights to grow your business smarter</p>
        </div>

        {/* KPI SECTION */}
        {summary && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <ModernCard title="Total Sales" value={formatCurrency(summary.total_sales)} />
            <ModernCard title="Expenses" value={formatCurrency(summary.total_expenses)} />
            <ModernCard title="Profit" value={formatCurrency(summary.total_profit)} />
            <ModernCard title="Records" value={summary.total_records} />
          </div>
        )}

        {/* CHART */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border mb-12">
          <h2 className="text-xl font-semibold mb-6">Monthly Sales Performance</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="total_sales" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* BUSINESS INSIGHTS */}
        {insights && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border mb-12">
            <h2 className="text-xl font-semibold mb-6">📊 Business Insights</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Performance Messages</h3>
                {insights?.messages?.map((msg, i) => (
                  <div key={i} className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-3 rounded">
                    {msg}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold mb-3">Suggestions</h3>
                {insights?.suggestions?.map((sug, i) => (
                  <div key={i} className="bg-green-50 border-l-4 border-green-500 p-4 mb-3 rounded">
                    {sug}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI SECTION */}
        <div className="bg-linear-to-r from-indigo-100 via-purple-100 to-pink-100 p-8 rounded-2xl border mb-12">
          <h2 className="text-xl font-semibold mb-6">🤖 AI Intelligence</h2>

          {/* Insufficient Data */}
          {forecast?.status === "insufficient_data" && (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl mb-6">Add at least {forecast.required_records} business records to activate AI insights.</div>
          )}

          <div className="grid md:grid-cols-4 gap-6">
            {forecast?.forecast && (
              <AICard
                title="30-Day Demand Forecast"
                value={formatCurrency(forecast.forecast.predicted_30_day_demand)}
                subtitle={`Trend: ${forecast.forecast.trend} | Growth: ${formatPercent(forecast.forecast.user_growth)}`}
                highlight={forecast.forecast.trend === "declining" ? "danger" : "success"}
              >
                <div className="mt-3">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-md">Confidence: {(forecast.forecast.confidence_score * 100).toFixed(0)}%</span>
                </div>
              </AICard>
            )}

            {market && <AICard title="Market Share" value={`${market.market_share_percent}%`} subtitle={`Status: ${market.share_status}`} />}

            {competitor && <AICard title="Business Category" value={competitor.user_cluster} subtitle={`Total Competitors: ${competitor.total_competitors}`} />}

            {forecast?.risk && (
              <AICard
                title="Business Risk Score"
                value={`${forecast.risk.risk_score}/100`}
                subtitle={forecast.risk.risk_level}
                highlight={forecast.risk.risk_level === "High Risk" ? "danger" : forecast.risk.risk_level === "Low Risk" ? "success" : null}
              />
            )}
          </div>
        </div>

        {/* STRATEGY */}
        {strategy && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border mb-12">
            <h2 className="text-xl font-semibold mb-6">🧠 AI Growth Strategy</h2>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-green-600 font-semibold mb-3">Strengths</h3>
                {strategy?.strengths?.map((s, i) => (
                  <p key={i} className="text-gray-600 mb-2">
                    ✔ {s}
                  </p>
                ))}
              </div>

              <div>
                <h3 className="text-red-500 font-semibold mb-3">Risks</h3>
                {strategy?.warnings?.map((w, i) => (
                  <p key={i} className="text-gray-600 mb-2">
                    ⚠ {w}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-indigo-600 font-semibold mb-3">Recommendations</h3>
              {strategy?.recommended_strategies?.map((r, i) => (
                <p key={i} className="text-gray-700 mb-2">
                  → {r}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* AI DIAGNOSTICS */}
        {forecast?.diagnostics && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border mb-12">
            <h2 className="text-xl font-semibold mb-6">🔬 AI Diagnostic Analysis</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Observations */}
              <div>
                <h3 className="font-semibold mb-3 text-indigo-600">Key Observations</h3>

                {forecast?.diagnostics?.diagnostics?.length > 0 ? (
                  forecast.diagnostics.diagnostics.map((d, i) => (
                    <p key={i} className="text-gray-600 mb-2">
                      • {d}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">No observations available</p>
                )}
              </div>

              {/* Risk Factors */}
              <div>
                <h3 className="font-semibold mb-3 text-red-600">Risk Factors</h3>

                {forecast?.diagnostics?.risks?.length > 0 ? (
                  forecast.diagnostics.risks.map((r, i) => (
                    <p key={i} className="text-gray-600 mb-2">
                      ⚠ {r}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">No major risks detected</p>
                )}
              </div>

              {/* Strategic Strengths */}
              <div>
                <h3 className="font-semibold mb-3 text-green-600">Strategic Strengths</h3>

                {forecast?.diagnostics?.strengths?.length > 0 ? (
                  forecast.diagnostics.strengths.map((s, i) => (
                    <p key={i} className="text-gray-600 mb-2">
                      ✔ {s}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">No strengths identified yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

const ModernCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition duration-300">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

const AICard = ({ title, value, subtitle, highlight, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition duration-300">
    <p className="text-gray-500 text-sm">{title}</p>

    <p className={`text-xl font-bold mt-2 ${highlight === "danger" ? "text-red-600" : highlight === "success" ? "text-green-600" : "text-gray-800"}`}>{value}</p>

    <p className="text-gray-500 text-sm mt-1">{subtitle}</p>

    {children}
  </div>
);
