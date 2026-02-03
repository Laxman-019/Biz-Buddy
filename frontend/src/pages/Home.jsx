import React from "react";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      {/*  HOME PAGE FRAMEWORK  */}
      <div className="pt-10 px-4bg-gradient-to-br from-[#EEF2F7] to-[#DDE1E7] text-[#283046] min-h-screen bg-[#E3FEF7]">

        {/* HERO  */}
        <section className="max-w-7xl mx-auto py-20 text-center">
          <h1 className="text-6xl font-extrabold leading-tight text-[#1E293B]">
            Build Smart. Launch Fast. <br /> Grow with Confidence.
          </h1>

          <p className="mt-6 text-xl max-w-3xl mx-auto text-gray-700">
            A simple and powerful platform that helps businesses grow, automate tasks,
            and achieve more with less effort.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <button className="bg-[#4F46E5] hover:bg-[#4338CA] transition px-8 py-4 rounded-xl font-semibold text-white shadow-lg">
              Get Started
            </button>

            <button className="bg-white border-2 border-[#4F46E5] text-[#4F46E5] px-8 py-4 rounded-xl font-semibold shadow hover:bg-[#EEF0FF] transition">
              Learn More
            </button>
          </div>
        </section>


        {/*  HOW IT WORKS  */}
        <section className="max-w-7xl mx-auto py-20">
          <h2 className="text-4xl font-bold text-center">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-10 mt-16 text-center">

            <div className="bg-[#DDF4E7] p-10 rounded-2xl shadow-lg border">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold">Step 1: Enter Details</h3>
              <p className="text-gray-600 mt-3">
                Provide basic business information and goals.
              </p>
            </div>

            <div className="bg-[#DDF4E7] p-10 rounded-2xl shadow-lg border">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-2xl font-semibold">Step 2: System Analysis</h3>
              <p className="text-gray-600 mt-3">
                AI processes and evaluates your business idea.
              </p>
            </div>

            <div className="bg-[#DDF4E7] p-10 rounded-2xl shadow-lg border">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold">Step 3: Get Results</h3>
              <p className="text-gray-600 mt-3">
                Receive insights and success prediction reports.
              </p>
            </div>

          </div>
        </section>



        {/* FEATURES */}
        <section className="max-w-7xl mx-auto py-20">
          <h2 className="text-4xl font-bold text-center">Features</h2>

          <div className="grid md:grid-cols-3 gap-10 mt-16 text-center">

            {/* Feature 1 */}
            <div className="bg-[#DDF4E7] p-10 rounded-2xl shadow-lg border">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold">Market Analytics</h3>
              <p className="text-gray-600 mt-3">
                Get clear insights into market trends and predictions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#DDF4E7] p-10 rounded-2xl shadow-lg border">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold">Fast Evaluation</h3>
              <p className="text-gray-600 mt-3">
                Instant analysis to check if your business idea can grow or not.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#DDF4E7] p-10 rounded-2xl shadow-lg border">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-2xl font-semibold">AI-Based Scoring</h3>
              <p className="text-gray-600 mt-3">
                Smart AI gives you a success score with tips for improvement.
              </p>
            </div>

          </div>
        </section>

        <section className="text-center py-24">
          <h2 className="text-4xl font-extrabold text-[#1E293B]">
            Ready to Take the Next Step?
          </h2>

          <button className="mt-10 bg-[#22C55E] hover:bg-[#77B0AA] text-white px-10 py-4 rounded-xl text-xl shadow-lg transition">
            Start Your Journey
          </button>
        </section>

      </div>
    </Layout>
  );
};

export default Home;
