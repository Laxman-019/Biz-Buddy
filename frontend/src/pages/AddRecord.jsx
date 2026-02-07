import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../components/Layout";
import { FaMoneyBillWave, FaChartLine, FaLightbulb, FaBolt } from "react-icons/fa";


const AddRecord = () => {
  const [formData, setFormData] = useState({
    business_name: "",
    date: "",
    sales: "",
    expenses: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/api/add-record/", formData);

      toast.success("Record Added Successfully");

      setFormData({
        business_name: "",
        date: "",
        sales: "",
        expenses: "",
      });
    } catch (error) {
        toast.error("Failed to add record");
        console.log(error)
    }
  };

  return (
   <Layout>
  <ToastContainer position="top-center" autoClose={2000} />

  <div className="min-h-screen bg-[#E3FEF7] p-6 flex justify-center items-center">

    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* LEFT — FORM */}
      <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-semibold mb-6 text-gray-700">Add Business Record</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="business_name"
            placeholder="Business Name"
            value={formData.business_name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="number"
            min="1"
            name="sales"
            placeholder="Sales"
            value={formData.sales}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="number"
            min="1"
            name="expenses"
            placeholder="Expenses"
            value={formData.expenses}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />

          <button className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition">
            Add Record
          </button>
        </form>
      </div>

      {/* RIGHT — INTERESTING ANIMATED PANEL */}
      <div className="hidden md:flex items-center justify-center">
        <div className="relative bg-white/70 backdrop-blur-xl border border-gray-300 rounded-2xl shadow-xl p-10 w-full h-full overflow-hidden">

          {/* Floating blobs */}
          <div className="absolute top-4 left-4 w-36 h-36 bg-blue-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-44 h-44 bg-blue-300 rounded-full blur-3xl opacity-50 animate-ping"></div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Interesting Facts ✨
            </h2>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-5">

              {/* Card 1 */}
              <div className="bg-white/80 p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1">
                <FaMoneyBillWave className="text-3xl text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-800 mt-2">
                  Did You Know?
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Businesses grow 35% faster when they track expenses weekly.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/80 p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1">
                <FaChartLine className="text-3xl text-green-600" />
                <h4 className="text-lg font-semibold text-gray-800 mt-2">
                  Smart Tracking
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Daily sales tracking increases accuracy by up to 82%.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/80 p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1">
                <FaLightbulb className="text-3xl text-yellow-500" />
                <h4 className="text-lg font-semibold text-gray-800 mt-2">
                  Pro Tip
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Consistency beats perfection. Add small records daily.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white/80 p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1">
                <FaBolt className="text-3xl text-purple-600" />
                <h4 className="text-lg font-semibold text-gray-800 mt-2">
                  Boost Efficiency
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  10 mins a day in BizBuddy can save hours every month.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</Layout>


  );
};

export default AddRecord;
