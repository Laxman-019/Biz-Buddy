import React from "react";
import Layout from "../components/Layout";
import { MdAnalytics } from "react-icons/md";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BsShieldCheck } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaCogs, FaChartLine } from "react-icons/fa";
import "../app.css"

const Home = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[#E3FEF7] text-[#283046] px-3 sm:px-6 lg:px-8">

        {/* HERO */}
        <section className="max-w-7xl mx-auto py-10 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug text-[#1E293B]">
            Build Smart. Launch Fast.
            <br className="hidden sm:block" />
            Grow with Confidence.
          </h1>

          <p className="mt-3 sm:mt-6 text-sm sm:text-lg md:text-xl max-w-3xl mx-auto text-gray-700 px-3">
            A simple and powerful platform that helps businesses grow, automate
            tasks, and achieve more with less effort.
          </p>

          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3">
            <button className="w-full sm:w-auto bg-[#4F46E5] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition">
              Get Started
            </button>

            <button className="w-full sm:w-auto bg-white border-2 border-[#4F46E5] text-[#4F46E5] px-6 py-3 rounded-xl font-semibold hover:bg-[#EEF0FF] transition">
              Learn More
            </button>
          </div>
        </section>

        {/* HOW IT WORKS (MOBILE AUTO SCROLL + DESKTOP NORMAL GRID) */}
        <section className="max-w-7xl mx-auto py-10 sm:py-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
            How It Works
          </h2>

          {/* MOBILE — AUTO SCROLL INFINITE */}
          <div className="relative overflow-hidden md:hidden mt-10">
            <div
              className="flex gap-5 px-3 animate-scroll-infinite"
              style={{ width: "max-content" }}
            >
              {[
                {
                  icon: <HiOutlineDocumentText />,
                  title: "Step 1: Enter Details",
                  desc: "Provide basic business information and goals.",
                },
                {
                  icon: <FaCogs />,
                  title: "Step 2: System Analysis",
                  desc: "AI processes and evaluates your business idea.",
                },
                {
                  icon: <FaChartLine />,
                  title: "Step 3: Get Results",
                  desc: "Receive insights and success prediction reports.",
                },
                // duplicate for infinite loop
                {
                  icon: <HiOutlineDocumentText />,
                  title: "Step 1: Enter Details",
                  desc: "Provide basic business information and goals.",
                },
                {
                  icon: <FaCogs />,
                  title: "Step 2: System Analysis",
                  desc: "AI processes and evaluates your business idea.",
                },
                {
                  icon: <FaChartLine />,
                  title: "Step 3: Get Results",
                  desc: "Receive insights and success prediction reports.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="bg-[#DDF4E7] p-6 rounded-2xl border shadow-md min-w-[250px]"
                >
                  <div className="flex justify-center mb-4 text-indigo-600 text-4xl">
                    {step.icon}
                  </div>

                  <h3 className="text-lg font-semibold text-center">{step.title}</h3>

                  <p className="text-gray-600 mt-2 text-center text-sm">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* DESKTOP GRID (unchanged) */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 mt-10 px-2">
            {[
              {
                icon: <HiOutlineDocumentText />,
                title: "Step 1: Enter Details",
                desc: "Provide basic business information and goals.",
              },
              {
                icon: <FaCogs />,
                title: "Step 2: System Analysis",
                desc: "AI processes and evaluates your business idea.",
              },
              {
                icon: <FaChartLine />,
                title: "Step 3: Get Results",
                desc: "Receive insights and success prediction reports.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-[#DDF4E7] p-6 rounded-2xl border shadow-md hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className="flex justify-center mb-4 text-indigo-600 text-4xl">
                  {step.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-center">{step.title}</h3>
                <p className="text-gray-600 mt-2 text-center text-sm sm:text-base">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto py-10 sm:py-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 mt-10 px-2">
            <Feature
              icon={<MdAnalytics />}
              color="text-green-600"
              title="Market Analytics"
              desc="Get clear insights into market trends and predictions."
            />

            <Feature
              icon={<AiOutlineThunderbolt />}
              color="text-yellow-500"
              title="Fast Evaluation"
              desc="Instant analysis to check if your business idea can grow or not."
            />

            <Feature
              icon={<BsShieldCheck />}
              color="text-blue-600"
              title="AI-Based Scoring"
              desc="Smart AI gives you a success score with tips for improvement."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 sm:py-24 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E293B]">
            Ready to Take the Next Step?
          </h2>

          <button className="mt-6 sm:mt-10 w-full sm:w-auto bg-[#22C55E] text-white px-8 py-3 rounded-xl text-lg sm:text-xl font-semibold shadow-md hover:shadow-lg transition">
            Start Your Journey
          </button>
        </section>
      </div>
    </Layout>
  );
};

const Feature = ({ icon, title, desc, color }) => (
  <div className="bg-[#DDF4E7] p-6 rounded-2xl border shadow-md transition hover:-translate-y-1 hover:shadow-lg">
    <div className={`flex justify-center mb-4 text-4xl ${color}`}>{icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold text-center">{title}</h3>
    <p className="text-gray-600 mt-2 text-center text-sm sm:text-base">{desc}</p>
  </div>
);

export default Home;
