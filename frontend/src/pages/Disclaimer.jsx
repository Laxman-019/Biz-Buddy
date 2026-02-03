import React from "react";
import Layout from "../components/Layout";

const Disclaimer = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[#C5C3C6] px-6 py-14 text-[#2b2d42]">

        <div className="max-w-5xl mx-auto animate-fadeIn">

          {/* Header */}
          <h1 className="text-5xl font-extrabold text-center text-[#003C43] mb-6 tracking-wide">
            Disclaimer
          </h1>

          <p className="text-center text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            This Disclaimer outlines the limitations, responsibilities, and usage conditions
            related to our platform. By using our services, you acknowledge and accept the
            statements below.
          </p>

          <section className="space-y-12">

            {/* 1 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                1. No Professional Advice
              </h2>
              <p className="text-gray-800 leading-relaxed">
                The information provided on our platform is for general use only. We do not offer
                legal, financial, medical, or any form of professional advice. Any actions taken
                based on the information found on our platform are done at your own risk.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 2 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                2. Accuracy of Information
              </h2>
              <p className="text-gray-800 leading-relaxed">
                While we strive to keep information accurate and up-to-date, we do not guarantee
                the completeness, reliability, or accuracy of any content displayed on the platform.
                Content may be updated, corrected, or removed without notice.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 3 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                3. Limitation of Liability
              </h2>
              <p className="text-gray-800 leading-relaxed">
                We are not responsible for any direct, indirect, incidental, or consequential damages
                that may arise from:
                <br /><br />
                • Using our platform <br />
                • Inability to access the platform <br />
                • Any errors, bugs, or downtime <br />
                • Misinterpretation of information <br /><br />
                You use the platform at your own risk.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 4 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                4. No Third-Party Influence
              </h2>
              <p className="text-gray-800 leading-relaxed">
                Our platform operates entirely on our own backend server. We do not rely on or
                integrate with any third-party service providers for content, analytics, or
                storage. Therefore, no external party influences our system or its information.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 5 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                5. User Responsibility
              </h2>
              <p className="text-gray-800 leading-relaxed">
                Users are responsible for verifying any information before relying on it. We do not
                take responsibility for misuse, misinterpretation, or actions taken based on the
                content available on our platform.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 6 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                6. External Links (If Any)
              </h2>
              <p className="text-gray-800 leading-relaxed">
                Our platform may include links to external content only when necessary. We do not
                endorse or take responsibility for the content, privacy, or actions of external
                websites since they are beyond our control.
              </p>
            </div>

            <hr className="border-gray-400/40" />

            {/* 7 */}
            <div>
              <h2 className="text-3xl font-semibold text-[#003C43] mb-3">
                7. Changes to This Disclaimer
              </h2>
              <p className="text-gray-800 leading-relaxed">
                We may update or revise this Disclaimer at any time. Any changes will be reflected
                on this page. Continuing to use the platform means you accept the updated terms.
              </p>
            </div>

          </section>

          {/* Footer Date */}
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

export default Disclaimer;
