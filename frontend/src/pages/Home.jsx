import React from "react";
import Layout from "../components/Layout";
import { MdAnalytics } from "react-icons/md";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BsShieldCheck } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaCogs, FaChartLine, FaArrowRight, FaPlay } from "react-icons/fa";
import "../app.css"
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="min-h-screen bg-[#E3FEF7] text-[#283046]">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-1 bg-indigo-100 rounded-full mb-6">
                <span className="px-4 py-1 text-sm font-medium text-[#4F46E5]">
                  Next-Generation Business Platform
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1E293B] leading-tight">
                Build Smart.
                <br className="hidden sm:block" />
                <span className="text-[#4F46E5]">Launch Fast.</span>
                <br />
                Grow with Confidence.
              </h1>

              <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                A simple and powerful platform that helps businesses grow, automate
                tasks, and achieve more with less effort.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  className="group w-full sm:w-auto bg-[#4F46E5] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  className="group w-full sm:w-auto bg-white border-2 border-[#4F46E5] text-[#4F46E5] px-8 py-3 rounded-xl font-semibold hover:bg-[#EEF0FF] transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => navigate("/about")}
                >
                  <FaPlay className="text-sm" />
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* DECORATIVE BACKGROUND ELEMENTS */}
          <div className="absolute top-20 left-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-16 sm:py-24 bg-white/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
                How It Works
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Three simple steps to transform your business idea into reality
              </p>
            </div>

            {/* MOBILE CAROUSEL */}
            <div className="relative overflow-hidden md:hidden">
              <div className="flex gap-5 animate-scroll-infinite" style={{ width: "max-content" }}>
                {[
                  {
                    icon: <HiOutlineDocumentText />,
                    number: "01",
                    title: "Enter Details",
                    desc: "Provide basic business information and goals",
                    gradient: "from-blue-500 to-indigo-600"
                  },
                  {
                    icon: <FaCogs />,
                    number: "02",
                    title: "System Analysis",
                    desc: "AI processes and evaluates your business idea",
                    gradient: "from-indigo-500 to-purple-600"
                  },
                  {
                    icon: <FaChartLine />,
                    number: "03",
                    title: "Get Results",
                    desc: "Receive insights and success prediction reports",
                    gradient: "from-purple-500 to-pink-600"
                  },
                  ...Array(3).fill(null).map((_, idx) => ({
                    icon: idx === 0 ? <HiOutlineDocumentText /> : idx === 1 ? <FaCogs /> : <FaChartLine />,
                    number: idx === 0 ? "01" : idx === 1 ? "02" : "03",
                    title: idx === 0 ? "Enter Details" : idx === 1 ? "System Analysis" : "Get Results",
                    desc: idx === 0 ? "Provide basic business information and goals" : idx === 1 ? "AI processes and evaluates your business idea" : "Receive insights and success prediction reports",
                    gradient: idx === 0 ? "from-blue-500 to-indigo-600" : idx === 1 ? "from-indigo-500 to-purple-600" : "from-purple-500 to-pink-600"
                  }))
                ].map((step, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-xl min-w-70 shrink-0">
                    <div className={`bg-linear-to-r ${step.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                      <div className="text-white text-3xl font-bold">{step.number}</div>
                    </div>
                    <div className="text-indigo-600 text-4xl mb-4">{step.icon}</div>
                    <h3 className="text-xl font-bold text-[#1E293B] mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DESKTOP GRID */}
            <div className="hidden md:grid grid-cols-3 gap-8 relative">
              <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-200 via-indigo-400 to-indigo-200 -translate-y-1/2"></div>
              {[
                {
                  icon: <HiOutlineDocumentText />,
                  number: "01",
                  title: "Enter Details",
                  desc: "Provide basic business information and goals",
                  gradient: "from-blue-500 to-indigo-600"
                },
                {
                  icon: <FaCogs />,
                  number: "02",
                  title: "System Analysis",
                  desc: "AI processes and evaluates your business idea",
                  gradient: "from-indigo-500 to-purple-600"
                },
                {
                  icon: <FaChartLine />,
                  number: "03",
                  title: "Get Results",
                  desc: "Receive insights and success prediction reports",
                  gradient: "from-purple-500 to-pink-600"
                }
              ].map((step, i) => (
                <div key={i} className="relative group">
                  <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative z-10">
                    <div className={`bg-linear-to-r ${step.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                      <div className="text-white text-3xl font-bold">{step.number}</div>
                    </div>
                    <div className="text-indigo-600 text-5xl mb-4 flex justify-center">{step.icon}</div>
                    <h3 className="text-2xl font-bold text-[#1E293B] text-center mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-center leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
                Features
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Everything you need to succeed in one intelligent platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<MdAnalytics />}
                color="text-green-600"
                bgGradient="from-green-50 to-green-100"
                title="Market Analytics"
                desc="Get clear insights into market trends and predictions."
              />

              <FeatureCard
                icon={<AiOutlineThunderbolt />}
                color="text-yellow-500"
                bgGradient="from-yellow-50 to-yellow-100"
                title="Fast Evaluation"
                desc="Instant analysis to check if your business idea can grow or not."
              />

              <FeatureCard
                icon={<BsShieldCheck />}
                color="text-blue-600"
                bgGradient="from-blue-50 to-blue-100"
                title="AI-Based Scoring"
                desc="Smart AI gives you a success score with tips for improvement."
              />
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-linear-to-r from-[#4F46E5] to-[#22C55E] rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
                Ready to Take the Next Step?
              </h2>
              <button
                className="bg-white text-[#4F46E5] px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate("/signup")}
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const FeatureCard = ({ icon, title, desc, color, bgGradient }) => (
  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
    <div className={`bg-linear-to-br ${bgGradient} p-6`}>
      <div className={`text-5xl mb-4 ${color} flex justify-center`}>{icon}</div>
      <h3 className="text-2xl font-bold text-[#1E293B] text-center mb-3">{title}</h3>
    </div>
    <div className="p-6">
      <p className="text-gray-600 text-center leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Home;