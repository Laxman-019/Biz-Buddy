import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../components/Layout";

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
      <div className="min-h-screen bg-[#E3FEF7] p-6 flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6">Add Business Record</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="business_name" placeholder="Business Name" value={formData.business_name} onChange={handleChange} className="w-full border p-2 rounded" required />

            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border p-2 rounded" required />

            <input type="number" min="1" name="sales" placeholder="Sales" value={formData.sales} onChange={handleChange} className="w-full border p-2 rounded" required />

            <input type="number" name="expenses" min="1" placeholder="Expenses" value={formData.expenses} onChange={handleChange} className="w-full border p-2 rounded" required />

            <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Record</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddRecord;
