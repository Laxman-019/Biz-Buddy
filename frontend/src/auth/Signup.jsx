import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/register/`, formData);

      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="min-h-screen flex justify-center items-center bg-[#E8EEF5]">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-6">Create Account</h2>

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            {/* Full Name */}
            <div>
              <label className="text-[#1E3A8A] font-semibold">Full Name</label>
              <input
                type="text"
                name="user_name"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-[#1E3A8A] font-semibold">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[#1E3A8A] font-semibold">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                placeholder="Create a password"
              />
            </div>

            {/* Button */}
            <button type="submit" className="w-full bg-[#1E3A8A] text-white py-2 rounded-lg font-semibold hover:bg-[#142866] transition-all duration-200">
              Sign Up
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1E3A8A] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
