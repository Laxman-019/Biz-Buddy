import React from "react";
import Layout from "../components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[#E8EEF5] px-6 py-14 text-[#2b2d42]">
        <div className="max-w-5xl mx-auto animate-fadeIn">
          {/* Header */}
          <h1 className="text-5xl font-extrabold text-center text-[#003C43] mb-6 tracking-wide">
            About BizBuddy
          </h1>

          <p className="text-center text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            BizBuddy is a smart business analysis platform designed to help
            entrepreneurs make confident, data-driven decisions before starting
            or growing a business.
          </p>

          {/* Sections */}
          <section className="space-y-12">
            {/* 1 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                1. Why BizBuddy Exists
              </h2>
              <p className="text-gray-800 leading-relaxed">
                Many businesses fail not because the idea is bad, but because
                the market was never properly understood.
                <br />
                <br />
                BizBuddy was created to solve this exact problem — by giving
                entrepreneurs access to clear market insights before they invest
                time, money, and effort.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 2 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                2. What BizBuddy Does
              </h2>
              <p className="text-gray-800 leading-relaxed">
                BizBuddy analyzes market trends, demand patterns, and
                competition to help answer one critical question:
                <br />
                <br />
                <span className="font-semibold italic">
                  “Will this business idea work in the real world?”
                </span>
                <br />
                <br />
                Our platform transforms complex data into simple insights that
                anyone can understand.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 3 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                3. Who BizBuddy Is For
              </h2>
              <p className="text-gray-800 leading-relaxed">
                BizBuddy is built for:
                <br />
                • First-time entrepreneurs <br />
                • Small and local business owners <br />
                • Startup founders validating ideas <br />
                • Students working on business concepts <br />• Anyone who wants
                to reduce business risk
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 4 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                4. Our Mission
              </h2>
              <p className="text-gray-800 leading-relaxed">
                Our mission is to empower entrepreneurs with reliable insights
                so they can make smarter decisions with confidence.
                <br />
                <br />
                We believe every business deserves a fair chance to succeed —
                backed by data, not guesswork.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 5 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                5. Our Vision
              </h2>
              <p className="text-gray-800 leading-relaxed">
                We envision a future where no entrepreneur fails due to lack of
                market knowledge.
                <br />
                <br />
                BizBuddy aims to become a trusted companion for businesses —
                from idea validation to long-term growth.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 6 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                6. Built with Simplicity & Trust
              </h2>
              <p className="text-gray-800 leading-relaxed">
                BizBuddy is designed to be simple, transparent, and accessible.
                <br />
                <br />
                We focus on clarity, ease of use, and practical insights so that
                anyone — even without a business background — can benefit from
                it.
              </p>
            </div>
          </section>
        </div>

        {/* Animation */}
        <style>{`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(12px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default About;
