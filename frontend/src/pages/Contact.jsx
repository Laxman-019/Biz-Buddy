import React from "react";
import Layout from "../components/Layout";

const Contact = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[#E8EEF5] px-6 py-14 text-[#2b2d42]">
        <div className="max-w-5xl mx-auto animate-fadeIn">
          {/* Header */}
          <h1 className="text-5xl font-extrabold text-center text-[#003C43] mb-6 tracking-wide">
            Contact Us
          </h1>

          <p className="text-center text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            Have a question, suggestion, or need help using BizBuddy? We’re here
            to help and would love to hear from you.
          </p>

          {/* Contact Form */}
          <div className="mt-16 bg-[#F4F3F2] rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-semibold text-[#003C43] mb-6 text-center">
              Send Us a Message
            </h3>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003C43]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003C43]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  rows="5"
                  placeholder="Write your message here..."
                  className="w-full rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003C43]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#003C43] text-white py-3 rounded-md font-semibold hover:bg-[#022f35] transition"
              >
                Send Message
              </button>

              <p className="text-xs text-center text-gray-600">
                Your information is safe and will only be used to respond to
                your inquiry.
              </p>
            </form>
          </div>
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

export default Contact;
