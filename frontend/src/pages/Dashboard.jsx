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
    fetchCompetitor();
    fetchMarket();
    fetchStrategy();
  }, []);

  // Business data
  const fetchSummary = async () => {
    try {
      const res = await axiosInstance.get("/api/business-summary/")
      setSummary(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMonthly = async () => {
    try {
      const res = await axiosInstance.get("/api/monthly-summary/")
      setMonthlyData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await axiosInstance.get("/api/business-insights/")
      setInsights(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // AI calls
  const fetchForecast = async () => {
    try {
      const res = await axiosInstance.get("api/forecast/");
      setForecast(res.data);
    } catch (error) {
      console.log(error)
    }
  };

  const fetchMarket = async () => {
    try {
      const res = await axiosInstance.get("api/market-analysis/");
      setMarket(res.data);
    } catch (error) {
      console.log(error)
    }
  };

  const fetchCompetitor = async () => {
    try {
      const res = await axiosInstance("api/competitor-analysis/")
      setCompetitor(res.data)
    } catch (error) {
      console.log(error)
    }
  };

  const fetchStrategy = async () => {
    try {
      const res = await axiosInstance("api/strategy/")
      setStrategy(res.data)
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <Layout>
      <div className="min-h-screen bg-[#E3FEF7] text-[#283046] p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">Business Dashboard</h1>

        {/* SUMMARY CARDS */}
        {summary && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card title="Total Sales" value={`₹ ${summary.total_sales}`} color="bg-green-500" />

            <Card title="Total Expenses" value={`₹ ${summary.total_expenses}`} color="bg-red-500" />

            <Card title="Total Profit" value={`₹ ${summary.total_profit}`} color="bg-blue-500" />

            <Card title="Total Records" value={summary.total_records} color="bg-purple-500" />
          </div>
        )}

        {/* MONTHLY CHART */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* INSIGHTS */}
        {insights && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-6">Business Insights</h2>

            {/* STATUS BADGE */}
            <div className="mb-6">
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold
          ${insights.status === "good" ? "bg-green-100 text-green-700" : insights.status === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}
        `}
              >
                {insights.status.toUpperCase()}
              </span>
            </div>

            {/* MESSAGES */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">📊 Performance Messages</h3>
              <div className="space-y-3">
                {insights.messages?.map((msg, index) => (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    {msg}
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTIONS */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">💡 Suggestions</h3>

              <div className="space-y-3">
                {insights.suggestions?.map((sug, index) => (
                  <div key={index} className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    {sug}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-6">🤖 AI Business Intelligence</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">

            {forecast && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold mb-3">📈 Demand Forecast</h3>
                <p className="text-xl font-bold">₹ {forecast.predicted_30_day_demand}</p>

                <p className={`mt-2 font-semibold ${
                  forecast.trend === "increasing"
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                  Trend: {forecast.trend}
                </p>
              </div>
            )}

            {market && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold mb-3">📊 Market Position</h3>
                <p>Market Share: {market.market_share_percent}%</p>
                <p>Status: {market.share_status}</p>
              </div>
            )}

            {competitor && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold mb-3">🏆 Competitor Position</h3>
                <p>Category: {competitor.user_cluster}</p>
                <p>Total Competitors: {competitor.total_competitors}</p>
              </div>
            )}

          </div>

          {/* STRATEGY ADVISOR */}
          {strategy && (
            <div className="bg-white p-6 rounded-xl shadow">

              <h3 className="text-xl font-semibold mb-4">🧠 AI Growth Advisor</h3>

              <div className="mb-4">
                <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                {strategy.strengths?.map((s, i) => (
                  <p key={i}>✔ {s}</p>
                ))}
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-red-600 mb-2">Warnings</h4>
                {strategy.warnings?.map((w, i) => (
                  <p key={i}>⚠ {w}</p>
                ))}
              </div>

              <div>
                <h4 className="font-semibold text-blue-600 mb-2">Recommendations</h4>
                {strategy.recommended_strategies?.map((r, i) => (
                  <p key={i}>👉 {r}</p>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;

const Card = ({ title, value, color }) => {
  return (
    <div className={`${color} text-white p-6 rounded-xl shadow`}>
      <h3 className="text-lg">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};
