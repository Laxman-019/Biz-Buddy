import React from "react";
import Layout from "../components/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[#E8EEF5] px-6 py-14 text-[#2b2d42]">
        <div className="max-w-5xl mx-auto animate-fadeIn">
          {/* Header */}
          <h1 className="text-5xl font-extrabold text-center text-[#003C43] mb-6 tracking-wide">
            Privacy Policy
          </h1>

          <p className="text-center text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            This Privacy Policy explains how we handle and protect your data
            while using our platform. Since this is our own self-developed
            system, we do not rely on any third-party services for data storage
            or processing.
          </p>

          {/* Sections */}
          <section className="space-y-12">
            {/* 1 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                1. Information We Collect
              </h2>
              <p className="text-gray-800 leading-relaxed">
                We collect only the information necessary to provide our
                services. This may include your name, email address, phone
                number, and any details you voluntarily submit during signup or
                while using the platform.
                <br />
                <br />
                We do <span className="font-semibold">not</span> collect
                unnecessary data, and we do{" "}
                <span className="font-semibold">not</span> use any external
                tracking tools.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 2 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-800 leading-relaxed">
                Your information is used solely for:
                <br />
                • Creating and managing your account <br />
                • Providing access to our platform features <br />
                • Improving system performance and functionality
                <br />
                <br />
                All operations are performed within our own backend
                infrastructure.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 3 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                3. No Third-Party Sharing
              </h2>
              <p className="text-gray-800 leading-relaxed">
                We do <span className="font-bold">not</span> share, sell, or
                transfer your data to any third-party service, organization, or
                external company.
                <br />
                <br />
                Everything — authentication, data storage, and communication —
                is handled entirely within our own secure backend system created
                by our team.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 4 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                4. Cookies & Tracking
              </h2>
              <p className="text-gray-800 leading-relaxed">
                We only use essential cookies if required for login sessions.
                <br />
                No analytics cookies, no third-party trackers, and no external
                scripts are used.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 5 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                5. Data Storage & Protection
              </h2>
              <p className="text-gray-800 leading-relaxed">
                All user data is stored securely on our own backend server. We
                implement encryption, authentication, and strict security
                practices to safeguard your information.
                <br />
                <br />
                Although we follow strong security standards, no system is
                completely perfect. But we continuously update our backend to
                maintain maximum protection.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 6 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                6. Changes to This Policy
              </h2>
              <p className="text-gray-800 leading-relaxed">
                If we update this Privacy Policy, we will post the revised
                version on this page. Continued use of the platform means you
                accept the updated terms.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 7 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                7. Contact Us
              </h2>
              <p className="text-gray-800 leading-relaxed">
                If you have questions regarding this Privacy Policy, feel free
                to reach out to our support or development team. We are always
                happy to help.
              </p>
            </div>
          </section>

          {/* Date */}
          <p className="text-center mt-12 text-sm text-gray-700">
            Last updated: {new Date().getFullYear()}
          </p>
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

export default PrivacyPolicy;
