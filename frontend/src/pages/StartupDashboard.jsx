import React, { useState } from 'react'
import Layout from "../components/Layout"
import IdeaValidation from '../pages/IdeaValidation'
import { FaLightbulb, FaChartLine, FaCubes, FaRocket,
         FaChartPie, FaHandshake, FaBullhorn, FaBolt,
  FaUsers, FaShieldAlt
} from 'react-icons/fa'
import MarketIntelligence from './MarketIntelligence'
import BusinessModel from './BusinessModel'
import MVPPlanner from './MVPPlanner'
import StartupFinancials from './StartupFinancials'
import InvestorReadiness from './InvestorReadiness'
import GoToMarket from './GoToMarket'

const FEATURES = [
  { id: 'idea-validation', label: 'Idea Validation', icon: <FaLightbulb />, active: true  },
  { id: 'market-intel', label: 'Market Intelligence',icon: <FaChartLine />, active: true },
  { id: 'business-model', label: 'Business Model', icon: <FaCubes />, active: true },
  { id: 'mvp-planner', label: 'MVP Planning', icon: <FaRocket />, active: true },
  { id: 'financials', label: 'Financials', icon: <FaChartPie />,  active: true },
  { id: 'investor', label: 'Investor Readiness',icon: <FaHandshake />, active: true },
  { id: 'go-to-market', label: 'Go-To-Market', icon: <FaBullhorn />,  active: true },
  { id: 'kpis', label: 'Startup KPIs', icon: <FaBolt />, active: false },
  { id: 'team', label: 'Team & Culture', icon: <FaUsers />, active: false },
  { id: 'risks', label: 'Startup Risks', icon: <FaShieldAlt />, active: false },
]

const StartupDashboard = () => {
  const [activeFeature, setActiveFeature] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('startup_active_feature') || 'idea-validation';
    }
    return 'idea-validation';
  });

  const setFeature = (featureId) => {
    setActiveFeature(featureId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('startup_active_feature', featureId);
    }
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case 'idea-validation': return <IdeaValidation />
      case 'market-intel': return <MarketIntelligence />
      case 'business-model': return <BusinessModel />
      case 'mvp-planner': return <MVPPlanner />
      case 'financials': return <StartupFinancials />
      case 'investor': return <InvestorReadiness />
      case 'go-to-market': return <GoToMarket />
      default: return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <FaRocket className="text-5xl mb-4 text-gray-300" />
          <p className="text-lg font-medium">Coming Soon</p>
          <p className="text-sm mt-1">This feature is under development</p>
        </div>
      )
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#E3FEF7] flex">

        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm min-h-screen shrink-0">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">🚀 Startup Hub</h2>
            <p className="text-xs text-gray-400 mt-0.5">Your growth toolkit</p>
          </div>
          <nav className="p-3 space-y-1">
            {FEATURES.map((f) => (
              <button
                key={f.id}
                onClick={() => f.active && setFeature(f.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
                  ${activeFeature === f.id
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : f.active
                      ? 'text-gray-600 hover:bg-gray-50'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
              >
                <span className={activeFeature === f.id ? 'text-purple-600' : ''}>{f.icon}</span>
                <span>{f.label}</span>
                {!f.active && (
                  <span className="ml-auto text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          {renderFeature()}
        </main>

      </div>
    </Layout>
  )
}

export default StartupDashboard