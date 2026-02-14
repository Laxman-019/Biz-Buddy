import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Layout from "../components/Layout";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [insights, setInsights] = useState(null);

  const [forecast, setForecast] = useState(null);
  const [market, setMarket] = useState(null);
  const [competitor, setCompetitor] = useState(null);
  const [strategy, setStrategy] = useState(null);

  useEffect(() => {
    fetchSummary();
    fetchMonthly();
    fetchInsights();
    fetchForecast();
    fetchMarket();
    fetchCompetitor();
    fetchStrategy();
  }, []);

  //  Business APIs 

  const fetchSummary = async () => {
    const res = await axiosInstance.get("/api/business-summary/");
    setSummary(res.data);
  };

  const fetchMonthly = async () => {
    const res = await axiosInstance.get("/api/monthly-summary/");
    setMonthlyData(res.data);
  };

  const fetchInsights = async () => {
    const res = await axiosInstance.get("/api/business-insights/");
    setInsights(res.data);
  };

  //  AI APIs 

  const fetchForecast = async () => {
    const res = await axiosInstance.get("/api/forecast/");
    setForecast(res.data);
  };

  const fetchMarket = async () => {
    const res = await axiosInstance.get("/api/market-analysis/");
    setMarket(res.data);
  };

  const fetchCompetitor = async () => {
    const res = await axiosInstance.get("/api/competitor-analysis/");
    setCompetitor(res.data);
  };

  const fetchStrategy = async () => {
    const res = await axiosInstance.get("/api/strategy/");
    setStrategy(res.data);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#E8EEF5] p-8">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Business Intelligence Dashboard
          </h1>
          <p className="text-gray-500">
            AI insights to grow your business smarter
          </p>
        </div>

        {/* KPI SECTION */}
        {summary && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <ModernCard
              title="Total Sales"
              value={`₹ ${summary.total_sales}`}
            />
            <ModernCard
              title="Expenses"
              value={`₹ ${summary.total_expenses}`}
            />
            <ModernCard title="Profit" value={`₹ ${summary.total_profit}`} />
            <ModernCard title="Records" value={summary.total_records} />
          </div>
        )}

        {/* CHART */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border mb-12">
          <h2 className="text-xl font-semibold mb-6">
            Monthly Sales Performance
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* BUSINESS INSIGHTS */}
        {insights && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border mb-12">
            <h2 className="text-xl font-semibold mb-6">📊 Business Insights</h2>

            <div className="mb-6">
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold
                ${
                  insights.status === "good"
                    ? "bg-green-100 text-green-700"
                    : insights.status === "warning"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {insights.status.toUpperCase()}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Performance Messages</h3>
                {insights.messages?.map((msg, i) => (
                  <div
                    key={i}
                    className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-3 rounded"
                  >
                    {msg}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold mb-3">Suggestions</h3>
                {insights.suggestions?.map((sug, i) => (
                  <div
                    key={i}
                    className="bg-green-50 border-l-4 border-green-500 p-4 mb-3 rounded"
                  >
                    {sug}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI INTELLIGENCE */}
        <div className="bg-linear-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl border mb-12">
          <h2 className="text-xl font-semibold mb-6">🤖 AI Intelligence</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {forecast?.forecast && (
              <AICard
                title="Demand Forecast"
                value={`₹ ${forecast.forecast.predicted_30_day_demand}`}
                subtitle={`Trend: ${forecast.forecast.trend}`}
              />
            )}

            {market && (
              <AICard
                title="Market Share"
                value={`${market.market_share_percent}%`}
                subtitle={market.share_status}
              />
            )}

            {competitor && (
              <AICard
                title="Competitor Category"
                value={competitor.user_cluster}
                subtitle={`Competitors: ${competitor.total_competitors}`}
              />
            )}
          </div>
        </div>

        {/* AI STRATEGY */}
        {strategy && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-6">
              🧠 AI Growth Strategy
            </h2>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-green-600 font-semibold mb-3">Strengths</h3>

                {strategy.strengths.map((s, i) => (
                  <p key={i} className="text-gray-600 mb-2">
                    ✔ {s}
                  </p>
                ))}
              </div>

              <div>
                <h3 className="text-red-500 font-semibold mb-3">Risks</h3>

                {strategy.warnings.map((w, i) => (
                  <p key={i} className="text-gray-600 mb-2">
                    ⚠ {w}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-indigo-600 font-semibold mb-3">
                Recommendations
              </h3>

              {strategy.recommended_strategies.map((r, i) => (
                <p key={i} className="text-gray-700 mb-2">
                  → {r}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;


const ModernCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

const AICard = ({ title, value, subtitle }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-xl font-bold mt-2">{value}</p>
    <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
  </div>
);
