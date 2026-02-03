import React from 'react'
import Layout from '../components/Layout'
import { useNavigate, Link } from 'react-router-dom'

const Signup = () => {

  const navigate = useNavigate()

  const handleSignup = (e) => {
    e.preventDefault()

    // SIGNUP LOGIC HERE (Firebase, API…)
    navigate("/login")
  }

  return (
    <Layout>
      <div className="min-h-screen flex justify-center items-center bg-[#E8EEF5]">

        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">

          <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="flex flex-col gap-5">

            {/* Full Name */}
            <div>
              <label className="text-[#1E3A8A] font-semibold">Full Name</label>
              <input
                type="text"
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
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                placeholder="Create a password"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#1E3A8A] text-white py-2 rounded-lg font-semibold hover:bg-[#142866] transition-all duration-200"
            >
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
  )
}

export default Signup
