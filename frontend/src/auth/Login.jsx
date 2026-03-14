import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("access");
    const userRole = localStorage.getItem("userRole");
    
    if (token) {
      // Redirect to appropriate dashboard if already logged in
      if (userRole === 'startup') {
        navigate("/startup/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login/`, formData);
      
      // Store tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      
      // Store user role for dashboard redirection
      localStorage.setItem("userRole", res.data.role);
      
      // Store user data if needed
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      
      // Show success message
      toast.success(res.data.message || "Login successful!");
      
      // Navigate based on user role
      setTimeout(() => {
        if (res.data.role === 'startup') {
          navigate("/startup/dashboard"); // Redirect startups to new dashboard
        } else {
          navigate("/dashboard"); // Existing businesses go to old dashboard
        }
      }, 1500);
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error
        toast.error(error.response.data?.message || "Invalid email or password");
      } else if (error.request) {
        // Request made but no response
        toast.error("Network error. Please check your connection.");
      } else {
        // Something else happened
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ToastContainer 
        position="top-center" 
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#E8EEF5] to-[#D5E0EB] px-4 sm:px-6">
        {/* Main Card */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT SIDE INFO - Hidden on mobile */}
          <div className="hidden md:flex flex-col justify-center border-r pr-6">
            <h2 className="text-3xl font-bold text-[#1E3A8A]">
              Welcome Back! 👋
            </h2>

            <p className="text-gray-600 mt-3 leading-relaxed text-sm">
              Login to access your personalized dashboard, manage your business activities, and connect with potential partners.
            </p>

            <div className="mt-8 space-y-4">
              {/* Feature list */}
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-circle-check text-[#1E3A8A]"></i>
                <span className="text-sm text-gray-600">Track your investments</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-circle-check text-[#1E3A8A]"></i>
                <span className="text-sm text-gray-600">Connect with startups</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-circle-check text-[#1E3A8A]"></i>
                <span className="text-sm text-gray-600">Real-time analytics</span>
              </div>
            </div>

            <img 
              src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png" 
              alt="Login Illustration" 
              className="w-36 opacity-90 mt-8 mx-auto animate-pulse" 
            />
          </div>

          {/* RIGHT SIDE FORM */}
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#1E3A8A]">Account Login</h2>
              <p className="text-gray-500 text-sm mt-1">Enter your credentials to continue</p>
            </div>

            {/* FORM */}
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="relative group">
                <input
                  type="email"
                  onChange={handleChange}
                  name="email"
                  value={formData.email}
                  required
                  placeholder="Email Address"
                  className="w-full px-12 py-3.5 border-2 border-gray-200 rounded-xl outline-none text-gray-700 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A] focus:ring-opacity-20 transition-all duration-200"
                  disabled={loading}
                />
                <i className="fa-solid fa-envelope absolute left-4 top-4 text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors"></i>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  name="password"
                  value={formData.password}
                  required
                  placeholder="Password"
                  className="w-full px-12 py-3.5 border-2 border-gray-200 rounded-xl outline-none text-gray-700 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A] focus:ring-opacity-20 transition-all duration-200"
                  disabled={loading}
                />

                {/* Lock Icon */}
                <i className="fa-solid fa-lock absolute left-4 top-4 text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors"></i>

                {/* Toggle Password Visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-[#1E3A8A] transition-colors focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a 
                  href="/forgot-password" 
                  className="text-sm text-[#1E3A8A] hover:text-[#142866] hover:underline transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-[#1E3A8A] hover:bg-[#142866] transition-all text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">New to BizBuddy?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <a 
                href="/signup" 
                className="text-[#1E3A8A] font-semibold hover:text-[#142866] hover:underline transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;