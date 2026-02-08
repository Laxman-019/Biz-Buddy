import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    setDashboardOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-[#003C43] text-white p-4 shadow-md">
      <div className="flex justify-between items-center md:px-10 lg:px-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="BizBuddy Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-2xl tracking-wide">BizBuddy</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-10 text-lg items-center">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="block px-4 py-3">
                Dashboard
              </Link>
              <div className="relative">
                <button onClick={() => setDashboardOpen(!dashboardOpen)} className="hover:text-gray-300">
                  Manage ▾
                </button>

                {dashboardOpen && (
                  <div className="absolute top-10 left-0 bg-[#002b30] rounded-lg shadow-lg w-44 overflow-hidden">
                    <Link to="/records" className="block px-4 py-3 hover:bg-[#01474f]" onClick={() => setDashboardOpen(false)}>
                      List Record
                    </Link>

                    <Link to="/add-record" className="block px-4 py-3 hover:bg-[#01474f]" onClick={() => setDashboardOpen(false)}>
                      Add Record
                    </Link>
                  </div>
                )}
              </div>

              <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded-md cursor-pointer hover:bg-red-400">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/signup" className="hover:text-gray-300">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-[#002b30] mt-3 divide-y divide-gray-700 rounded-xl overflow-hidden">
          <Link to="/" onClick={() => setOpen(false)} className="block py-4 text-center hover:bg-[#01474f]">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              {/* Dashboard */}
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block py-4 text-center hover:bg-[#01474f]">
                Dashboard
              </Link>

              {/* Manage Dropdown */}
              <button onClick={() => setDashboardOpen(!dashboardOpen)} className="block w-full py-4 text-center hover:bg-[#01474f]">
                Manage ▾
              </button>

              {dashboardOpen && (
                <div className="bg-[#01474f]">
                  <Link
                    to="/records"
                    onClick={() => {
                      setOpen(false);
                      setDashboardOpen(false);
                    }}
                    className="block py-3 text-center text-sm hover:bg-[#01606a]"
                  >
                    List Record
                  </Link>

                  <Link
                    to="/add-record"
                    onClick={() => {
                      setOpen(false);
                      setDashboardOpen(false);
                    }}
                    className="block py-3 text-center text-sm hover:bg-[#01606a]"
                  >
                    Add Record
                  </Link>
                </div>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="block w-full py-4 text-center bg-red-500 hover:bg-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block py-4 text-center hover:bg-[#01474f]">
                Login
              </Link>

              <Link to="/signup" onClick={() => setOpen(false)} className="block py-4 text-center hover:bg-[#01474f]">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
