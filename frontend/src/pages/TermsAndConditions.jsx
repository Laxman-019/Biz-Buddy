import React from "react";
import Layout from "../components/Layout";

const TermsAndConditions = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[#C5C3C6] px-6 py-14 text-[#2b2d42]">

        <div className="max-w-5xl mx-auto animate-fadeIn">

          {/* Header */}
          <h1 className="text-5xl font-extrabold text-center text-[#003C43] mb-6 tracking-wide">
            Terms & Conditions
          </h1>

          <p className="text-center text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            These Terms & Conditions govern the use of our platform. By accessing or using our
            services, you agree to follow the terms outlined below.
          </p>

          <section className="space-y-12">

            {/* 1 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-800 leading-relaxed">
                By creating an account, accessing, or using our platform, you agree to these Terms &
                Conditions. If you do not agree with any part of these terms, you must discontinue
                using the service.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 2 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                2. Use of Our Platform
              </h2>
              <p className="text-gray-800 leading-relaxed">
                You agree to use our platform only for lawful purposes. You must not:
                <br /><br />
                • Misuse or attempt to hack our system <br />
                • Upload harmful or malicious content <br />
                • Create fake accounts or impersonate others <br />
                • Interfere with the proper functioning of our services <br /><br />
                Any misuse may result in account termination.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 3 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                3. Accounts & Security
              </h2>
              <p className="text-gray-800 leading-relaxed">
                When you register, you are responsible for:
                <br />
                • Keeping your account credentials confidential <br />
                • Ensuring account activity is lawful <br />
                • Not sharing your login details with others <br /><br />
                Since we manage our own backend server, your data is stored securely within our
                infrastructure.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 4 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                4. Data Storage & Privacy
              </h2>
              <p className="text-gray-800 leading-relaxed">
                All user data is handled exclusively by our own backend system. We do not use,
                share, or rely on third-party services for storing or processing your information.
                <br /><br />
                For more details, please review our Privacy Policy.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 5 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                5. User Responsibilities
              </h2>
              <p className="text-gray-800 leading-relaxed">
                You agree that you will:
                <br /><br />
                • Provide accurate information <br />
                • Not use the platform for illegal activities <br />
                • Respect intellectual property rights <br />
                • Not attempt to modify, reverse-engineer, or exploit our system <br /><br />
                Violations may lead to suspension or permanent removal of your account.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 6 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                6. Intellectual Property
              </h2>
              <p className="text-gray-800 leading-relaxed">
                All content, code, design, and functionality on this platform are the intellectual
                property of our development team. You may not copy, distribute, or reuse any part of
                the system without permission.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 7 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                7. Service Availability
              </h2>
              <p className="text-gray-800 leading-relaxed">
                We aim to ensure uninterrupted service, but occasional downtime may occur due to
                maintenance or system updates. We do not guarantee 100% uptime.
                <br /><br />
                Since everything is hosted on our own backend, we regularly optimize performance.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 8 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                8. Termination of Access
              </h2>
              <p className="text-gray-800 leading-relaxed">
                We reserve the right to suspend or terminate user accounts that violate these terms,
                behave unlawfully, or threaten the security/integrity of our platform.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 9 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                9. Changes to Terms
              </h2>
              <p className="text-gray-800 leading-relaxed">
                We may update these Terms & Conditions from time to time. Any changes will be posted
                on this page. Continued use of the platform indicates acceptance of updated terms.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 10 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                10. Contact Us
              </h2>
              <p className="text-gray-800 leading-relaxed">
                If you have questions about these Terms & Conditions, you may contact our support
                team or developers directly.
              </p>
            </div>

          </section>

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

export default TermsAndConditions;
