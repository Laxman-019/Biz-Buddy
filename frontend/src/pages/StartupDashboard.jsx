import React, { useState } from "react";
import Layout from "../components/Layout";
import IdeaValidation from "../pages/IdeaValidation";
import { FaLightbulb, FaChartLine, FaCubes, FaRocket, FaChartPie, FaHandshake, FaBullhorn, FaBolt, FaUsers, FaShieldAlt, FaHome, FaChevronRight, FaCalendarAlt, FaBook } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import { MdOutlineChevronRight } from "react-icons/md";
import MarketIntelligence from "./MarketIntelligence";
import BusinessModel from "./BusinessModel";
import MVPPlanner from "./MVPPlanner";
import StartupFinancials from "./StartupFinancials";
import InvestorReadiness from "./InvestorReadiness";
import GoToMarket from "./GoToMarket";
import StartupKPIs from "./StartupKPIs";
import TeamCulture from "./TeamCulture";
import StartupRisks from "./StartupRisks";
import StartupOverview from "./StartupOverview";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    id: "overview",
    label: "Overview",
    icon: <FaHome />,
    active: true,
    gradient: "from-violet-500 to-indigo-500",
    bgGradient: "from-violet-50 to-indigo-50",
  },
  {
    id: "idea-validation",
    label: "Idea Validation",
    icon: <FaLightbulb />,
    active: true,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
  },
  {
    id: "market-intel",
    label: "Market Intelligence",
    icon: <FaChartLine />,
    active: true,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    id: "business-model",
    label: "Business Model",
    icon: <FaCubes />,
    active: true,
    gradient: "from-sky-500 to-blue-500",
    bgGradient: "from-sky-50 to-blue-50",
  },
  {
    id: "mvp-planner",
    label: "MVP Planner",
    icon: <FaRocket />,
    active: true,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    id: "financials",
    label: "Financials",
    icon: <FaChartPie />,
    active: true,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    id: "investor",
    label: "Investor Ready",
    icon: <FaHandshake />,
    active: true,
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  {
    id: "go-to-market",
    label: "Go-To-Market",
    icon: <FaBullhorn />,
    active: true,
    gradient: "from-rose-500 to-red-500",
    bgGradient: "from-rose-50 to-red-50",
  },
  {
    id: "kpis",
    label: "KPIs & Metrics",
    icon: <FaBolt />,
    active: true,
    gradient: "from-yellow-500 to-amber-500",
    bgGradient: "from-yellow-50 to-amber-50",
  },
  {
    id: "team",
    label: "Team & Culture",
    icon: <FaUsers />,
    active: true,
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50",
  },
  {
    id: "risks",
    label: "Risk Analysis",
    icon: <FaShieldAlt />,
    active: true,
    gradient: "from-gray-500 to-slate-500",
    bgGradient: "from-gray-50 to-slate-50",
  },
];

const StartupDashboard = () => {
  const [activeFeature, setActiveFeature] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("startup_active_feature") || "overview";
    }
    return "overview";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const setFeature = (featureId) => {
    setActiveFeature(featureId);
    if (typeof window !== "undefined") {
      localStorage.setItem("startup_active_feature", featureId);
    }
  };

  const activeFeatureData = FEATURES.find((f) => f.id === activeFeature);

  const renderFeature = () => {
    switch (activeFeature) {
      case "overview":
        return <StartupOverview onNavigate={setActiveFeature} />;
      case "idea-validation":
        return <IdeaValidation />;
      case "market-intel":
        return <MarketIntelligence />;
      case "business-model":
        return <BusinessModel />;
      case "mvp-planner":
        return <MVPPlanner />;
      case "financials":
        return <StartupFinancials />;
      case "investor":
        return <InvestorReadiness />;
      case "go-to-market":
        return <GoToMarket />;
      case "kpis":
        return <StartupKPIs />;
      case "team":
        return <TeamCulture />;
      case "risks":
        return <StartupRisks />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative w-28 h-28 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-6">
                <FaRocket className="text-4xl text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h2>
            <p className="text-gray-500 text-center max-w-md">We're working hard to bring you this feature. Stay tuned for updates!</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#FAFBFC] flex">
        <aside className={`${isSidebarOpen ? "w-80" : "w-24"} bg-white border-r border-gray-100 shadow-sm min-h-screen shrink-0 transition-all duration-300 relative`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
          >
            <MdOutlineChevronRight className={`text-gray-500 text-sm transition-transform duration-300 ${!isSidebarOpen ? "rotate-180" : ""}`} />
          </button>

          <div className={`p-6 border-b border-gray-100 ${!isSidebarOpen && "px-3"}`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-40"></div>
                <div className="relative w-11 h-11 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <HiTrendingUp className="text-white text-xl" />
                </div>
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">VentureFlow</h1>
                  <p className="text-[11px] text-gray-500 font-medium tracking-wide">STARTUP STUDIO</p>
                </div>
              )}
            </div>
          </div>

          <nav className={`p-4 space-y-1.5 ${!isSidebarOpen && "px-2"}`}>
            {isSidebarOpen && <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 block">Main Menu</span>}
            {FEATURES.map((f) => (
              <button
                key={f.id}
                onClick={() => f.active && setFeature(f.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
                  ${activeFeature === f.id ? `bg-linear-to-r ${f.bgGradient} text-gray-900 shadow-sm` : f.active ? "text-gray-600 hover:bg-gray-50" : "text-gray-300 cursor-not-allowed"}`}
              >
                {activeFeature === f.id && <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b ${f.gradient} rounded-r-full`}></div>}

                <span className={`text-lg transition-all duration-200 ${activeFeature === f.id ? `text-transparent bg-linear-to-r ${f.gradient} bg-clip-text` : ""}`}>{f.icon}</span>

                {isSidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{f.label}</span>

                    {activeFeature === f.id && (
                      <div className={`w-5 h-5 rounded-full bg-linear-to-r ${f.gradient} flex items-center justify-center`}>
                        <FaChevronRight className="text-white text-[8px]" />
                      </div>
                    )}

                    {!f.active && <span className="text-[10px] font-semibold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Soon</span>}
                  </>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-[#FAFBFC]/80 backdrop-blur-xl border-b border-gray-100">
            <div className="px-8 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-0.5">
                  <span>Dashboard</span>
                  <FaChevronRight className="text-[10px]" />
                  <span className="text-gray-900 font-medium">{activeFeatureData?.label}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{activeFeatureData?.label}</h2>
              </div>

<div className="flex items-center gap-3">
  <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
    <FaCalendarAlt className="text-gray-400 text-sm" />
    <span className="text-sm text-gray-600">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
  </div>
  
  <Link to="/startupdoc">
    <button className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
      <FaBook className="text-gray-400 text-sm" />
      <span className="text-sm text-gray-600">Documentation</span>
    </button>
  </Link>
</div>
            </div>
          </div>

          <div className="p-5">
            <div className="max-w-7xl mx-auto animate-fadeIn">{renderFeature()}</div>
          </div>
        </main>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </Layout>
  );
};

export default StartupDashboard;
