import React, { useState } from "react";
import Layout from "../components/Layout";

const Contact = () => {
  const [result, setResult] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    setResult("Sending...");

    const formData = new FormData(e.target);
    formData.append("access_key", "66e17234-6e81-4b0f-9f80-34418f942347");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Message Sent Successfully!");
      e.target.reset(); // clear form
    } else {
      setResult("Something went wrong. Please try again!");
    }
  };

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

            <form className="space-y-6" onSubmit={sendMessage}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003C43]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003C43]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  rows="5"
                  name="message"
                  placeholder="Write your message here..."
                  required
                  className="w-full rounded-md px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003C43]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#003C43] text-white py-3 rounded-md font-semibold hover:bg-[#022f35] transition"
              >
                Send Message
              </button>

              <p className="text-center text-sm text-gray-600 font-medium">
                {result}
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
