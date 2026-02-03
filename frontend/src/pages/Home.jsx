import React from "react";
import Layout from "../components/Layout";
import { MdAnalytics } from "react-icons/md";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BsShieldCheck } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaCogs, FaChartLine } from "react-icons/fa";

const Home = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[#E3FEF7] text-[#283046] px-3 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="max-w-7xl mx-auto py-14 sm:py-20 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#1E293B]">
            Build Smart. Launch Fast.
            <br className="hidden sm:block" />
            Grow with Confidence.
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl max-w-3xl mx-auto text-gray-700">
            A simple and powerful platform that helps businesses grow, automate
            tasks, and achieve more with less effort.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="
              w-full sm:w-auto
              bg-[#4F46E5] text-white
              px-6 py-3 sm:px-8 sm:py-4
              rounded-xl font-semibold
              shadow-lg
              transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-2xl
            "
            >
              Get Started
            </button>

            <button
              className="
              w-full sm:w-auto
              bg-white border-2 border-[#4F46E5]
              text-[#4F46E5]
              px-6 py-3 sm:px-8 sm:py-4
              rounded-xl font-semibold
              shadow
              transition-all duration-300 ease-out
              hover:bg-[#EEF0FF] hover:scale-105
            "
            >
              Learn More
            </button>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-7xl mx-auto py-14 sm:py-20">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-10 mt-10 sm:mt-16">
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
                className="
                  group bg-[#DDF4E7]
                  p-5 sm:p-10 rounded-2xl border
                  shadow-md
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:shadow-xl
                "
              >
                <div
                  className="
                  flex justify-center mb-3 sm:mb-4
                  text-indigo-600 text-4xl sm:text-5xl
                  transition-transform duration-300
                  group-hover:scale-110 group-hover:rotate-6
                "
                >
                  {step.icon}
                </div>

                <h3 className="text-lg sm:text-2xl font-semibold text-center">
                  {step.title}
                </h3>

                <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base text-center">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto py-14 sm:py-20">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-center">
            Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-10 mt-10 sm:mt-16">
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
        <section className="text-center py-16 sm:py-24">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1E293B]">
            Ready to Take the Next Step?
          </h2>

          <button
            className="
            mt-6 sm:mt-10
            w-full sm:w-auto
            bg-[#22C55E] text-white
            px-8 py-3 sm:px-10 sm:py-4
            rounded-xl text-base sm:text-xl font-semibold
            animate-pulse
            hover:animate-none
            transition-transform duration-300
            hover:scale-105
          "
          >
            Start Your Journey
          </button>
        </section>
      </div>
    </Layout>
  );
};

const Feature = ({ icon, title, desc, color }) => (
  <div
    className="
    group bg-[#DDF4E7]
    p-5 sm:p-10 rounded-2xl border
    shadow-md
    transition-all duration-300 ease-out
    hover:-translate-y-2 hover:shadow-xl
  "
  >
    <div
      className={`
      flex justify-center mb-3 sm:mb-4
      text-4xl sm:text-5xl ${color}
      transition-transform duration-300
      group-hover:scale-110 group-hover:rotate-6
    `}
    >
      {icon}
    </div>

    <h3 className="text-lg sm:text-2xl font-semibold text-center">{title}</h3>

    <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base text-center">
      {desc}
    </p>
  </div>
);

export default Home;
