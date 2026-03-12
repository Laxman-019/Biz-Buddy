import React, { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBuilding, FaRocket, FaUser, FaEnvelope, FaLock, FaPhone, FaGlobe, FaCalendarAlt } from "react-icons/fa";

const Signup = () => {
  const [businessType, setBusinessType] = useState("startup"); 
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    
    startup_name: "",
    industry: "",
    other_industry: "", 
    funding_stage: "",
    team_size: "",
    
    company_name: "",
    registration_number: "",
    year_established: "",
    employee_count: "",
    annual_revenue: "",
    website: "",
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "industry") {
      setShowOtherIndustry(e.target.value === "other");
    }
  };

  const handleBusinessTypeChange = (type) => {
    setBusinessType(type);
  };

 const handleSignup = async (e) => {
   e.preventDefault();

   if (formData.password !== formData.confirmPassword) {
     toast.error("Passwords do not match!");
     return;
   }

   const submitData = {
     user_name: formData.user_name,
     email: formData.email,
     password: formData.password,
     confirmPassword: formData.confirmPassword, 
     phone_number: formData.phone_number || "",

     business_type: businessType,

     industry:
       formData.industry === "other"
         ? formData.other_industry
         : formData.industry,
   };

   if (businessType === "startup") {
     submitData.startup_name = formData.startup_name || "";
     submitData.funding_stage = formData.funding_stage || "";
     submitData.team_size = formData.team_size
       ? parseInt(formData.team_size)
       : null;
   } else {
     submitData.company_name = formData.company_name || "";
     submitData.registration_number = formData.registration_number || "";
     submitData.year_established = formData.year_established
       ? parseInt(formData.year_established)
       : null;
     submitData.employee_count = formData.employee_count
       ? parseInt(formData.employee_count)
       : null;
     submitData.annual_revenue = formData.annual_revenue || "";
     submitData.website = formData.website || "";
   }

   delete submitData.other_industry;

   console.log("Submitting data:", submitData);

   try {
     const res = await axios.post(
       `${import.meta.env.VITE_API_URL}/api/register/`,
       submitData,
     );

     console.log("Response:", res.data); 
     toast.success(res.data.message);

     setTimeout(() => {
       navigate("/login");
     }, 3000);
   } catch (error) {
     console.log("Error response:", error.response?.data);
     console.log("Error status:", error.response?.status);

     if (error.response?.data?.errors) {
       const errors = error.response.data.errors;
       const firstError = Object.values(errors)[0];
       toast.error(firstError || "Registration failed");
     } else {
       toast.error(error.response?.data?.message || "Registration failed");
     }
   }
 };

  return (
    <Layout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="min-h-screen flex justify-center items-center bg-[#E8EEF5] py-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-4">Create Your Business Account</h2>
          
          <div className="flex gap-4 mb-8 justify-center">
            <button
              type="button"
              onClick={() => handleBusinessTypeChange("startup")}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                businessType === "startup"
                  ? "bg-[#1E3A8A] text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaRocket className="text-xl" />
              <div className="text-left">
                <div>Startup Business</div>
                <div className="text-xs font-normal opacity-80">New ventures & early stage</div>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => handleBusinessTypeChange("existing")}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                businessType === "existing"
                  ? "bg-[#1E3A8A] text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaBuilding className="text-xl" />
              <div className="text-left">
                <div>Existing Business</div>
                <div className="text-xs font-normal opacity-80">Established companies</div>
              </div>
            </button>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-[#1E3A8A] mb-4 flex items-center gap-2">
                <FaUser /> Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#1E3A8A] font-semibold text-sm">Full Name *</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#1E3A8A] font-semibold text-sm">Email *</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#1E3A8A] font-semibold text-sm">Phone Number</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      placeholder="+91 234 567 8900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#1E3A8A] font-semibold text-sm">Password *</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[#1E3A8A] font-semibold text-sm">Confirm Password *</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>
            </div>

            {businessType === "startup" && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-[#1E3A8A] mb-4 flex items-center gap-2">
                  <FaRocket /> Startup Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#1E3A8A] font-semibold text-sm">Startup Name *</label>
                    <input
                      type="text"
                      name="startup_name"
                      value={formData.startup_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      placeholder="Enter your startup name"
                    />
                  </div>

                  <div>
                    <label className="text-[#1E3A8A] font-semibold text-sm">Industry *</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    >
                      <option value="">Select Industry</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="realestate">Real Estate</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other (Specify)</option>
                    </select>
                  </div>

                  {showOtherIndustry && (
                    <div className="md:col-span-2 animate-fadeIn">
                      <label className="text-[#1E3A8A] font-semibold text-sm">Specify Industry *</label>
                      <input
                        type="text"
                        name="other_industry"
                        value={formData.other_industry}
                        onChange={handleChange}
                        required={showOtherIndustry}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="Please specify your industry"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter your specific industry</p>
                    </div>
                  )}

                  <div>
                    <label className="text-[#1E3A8A] font-semibold text-sm">Funding Stage</label>
                    <select
                      name="funding_stage"
                      value={formData.funding_stage}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    >
                      <option value="">Select Stage</option>
                      <option value="pre_seed">Pre-seed</option>
                      <option value="seed">Seed</option>
                      <option value="series_a">Series A</option>
                      <option value="series_b">Series B</option>
                      <option value="series_c">Series C+</option>
                      <option value="bootstrapped">Bootstrapped</option>
                      <option value="not_applicable">Not Applicable</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#1E3A8A] font-semibold text-sm">Team Size</label>
                    <input
                      type="number"
                      name="team_size"
                      value={formData.team_size}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      placeholder="Number of team members"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            )}

            {businessType === "existing" && (
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-[#1E3A8A] mb-4 flex items-center gap-2">
                  <FaBuilding /> Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#1E3A8A] font-semibold text-sm">Company Name *</label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="text-[#1E3A8A] font-semibold text-sm">Industry *</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    >
                      <option value="">Select Industry</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="realestate">Real Estate</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="consulting">Consulting</option>
                      <option value="retail">Retail</option>
                      <option value="construction">Construction</option>
                      <option value="transportation">Transportation</option>
                      <option value="other">Other (Specify)</option>
                    </select>
                  </div>

                  {showOtherIndustry && (
                    <div className="md:col-span-2 animate-fadeIn">
                      <label className="text-[#1E3A8A] font-semibold text-sm">Specify Industry *</label>
                      <input
                        type="text"
                        name="other_industry"
                        value={formData.other_industry}
                        onChange={handleChange}
                        required={showOtherIndustry}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="Please specify your industry"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter your specific industry</p>
                    </div>
                  )}

                  <div>
                    <label className="text-[#1E3A8A] font-semibold text-sm">Registration Number</label>
                    <input
                      type="text"
                      name="registration_number"
                      value={formData.registration_number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      placeholder="Business registration number"
                    />
                  </div>

                  <div>
                    <label className="text-[#1E3A8A] font-semibold text-sm">Year Established</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="year_established"
                        value={formData.year_established}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="YYYY"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#1E3A8A] font-semibold text-sm">Employee Count</label>
                    <input
                      type="number"
                      name="employee_count"
                      value={formData.employee_count}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      placeholder="Number of employees"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="text-[#1E3A8A] font-semibold text-sm">Annual Revenue</label>
                    <input
                      type="text"
                      name="annual_revenue"
                      value={formData.annual_revenue}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      placeholder="e.g., ₹1cr - ₹5cr"
                    />
                  </div>

                  <div>
                    <label className="text-[#1E3A8A] font-semibold text-sm">Website</label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-semibold hover:bg-[#142866] transition-all duration-200 text-lg"
            >
              Create {businessType === "startup" ? "Startup" : "Business"} Account
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1E3A8A] font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </Layout>
  );
};

export default Signup;