import React, { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-[#E8EEF5] px-6">

        {/* Main Card */}
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT SIDE INFO */}
          <div className="hidden md:flex flex-col justify-center border-r pr-6">
            <h2 className="text-3xl font-bold text-[#1E3A8A]">
              Welcome Back 👋
            </h2>

            <p className="text-gray-600 mt-3 leading-relaxed">
              Login to access your dashboard, manage your activity, and stay connected.
            </p>

            <img
              src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
              alt="Login Illustration"
              className="w-40 opacity-90 mt-6 mx-auto"
            />
          </div>

          {/* RIGHT SIDE FORM */}
          <div>
            <h2 className="text-2xl font-bold text-center text-[#1E3A8A]">
              Account Login
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Enter your credentials to continue
            </p>

            {/* FORM */}
            <form className="space-y-5" onSubmit={handleLogin}>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full px-12 py-3 border border-gray-300 rounded-xl outline-none text-gray-700 focus:ring-2 focus:ring-[#1E3A8A]"
                />
                <i className="fa-solid fa-envelope absolute left-4 top-3.5 text-gray-500"></i>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full px-12 py-3 border border-gray-300 rounded-xl outline-none text-gray-700 focus:ring-2 focus:ring-[#1E3A8A]"
                />

                {/* Lock Icon */}
                <i className="fa-solid fa-lock absolute left-4 top-3.5 text-gray-500"></i>

                {/* Toggle Password */}
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 cursor-pointer text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-[#1E3A8A] hover:bg-[#142866] transition text-white py-3 rounded-xl font-semibold shadow-md"
              >
                Login
              </button>
            </form>

            {/* Bottom Text */}
            <p className="text-center text-gray-600 mt-6">
              Don’t have an account?
              <a
                href="/signup"
                className="text-[#1E3A8A] font-semibold ml-1 hover:underline"
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
