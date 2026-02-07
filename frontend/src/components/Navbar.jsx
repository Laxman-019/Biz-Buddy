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
    <nav className="bg-[#003C43] text-white p-5 shadow-md">
      <div className="flex justify-between items-center md:px-10 lg:px-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="BizBuddy Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="font-bold text-2xl tracking-wide">BizBuddy</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-10 text-lg items-center">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              {/* DASHBOARD DROPDOWN */}
              <div className="relative">
                <div className="flex items-center gap-1">
                  {/* Dashboard Page Link */}
                  <Link
                    to="/dashboard"
                    className="hover:text-gray-300"
                    onClick={() => setDashboardOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {/* Dropdown Toggle */}
                  <button
                    onClick={() => setDashboardOpen(!dashboardOpen)}
                    className="hover:text-gray-300"
                  >
                    ▾
                  </button>
                </div>

                {dashboardOpen && (
                  <div className="absolute top-10 left-0 bg-[#002b30] rounded-lg shadow-lg w-44 overflow-hidden">
                    <Link
                      to="/records"
                      className="block px-4 py-3 hover:bg-[#01474f]"
                      onClick={() => setDashboardOpen(false)}
                    >
                      List Record
                    </Link>

                    <Link
                      to="/add-record"
                      className="block px-4 py-3 hover:bg-[#01474f]"
                      onClick={() => setDashboardOpen(false)}
                    >
                      Add Record
                    </Link>
                  </div>
                )}
              </div>

              <button onClick={handleLogout} className="hover:text-gray-300">
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
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block px-6 py-4 text-lg hover:bg-[#01474f] text-center"
          >
            Home
          </Link>

          {isLoggedIn ? (
            <>
              {/* MOBILE DASHBOARD */}
              <div className="flex items-center gap-1">
                {/* Dashboard Page Link */}
                <Link
                  to="/dashboard"
                  className="hover:text-gray-300 block w-full py-3 text-center"
                  onClick={() => setDashboardOpen(false)}
                >
                  Dashboard
                </Link>

                {/* Dropdown Toggle */}
                <button
                  onClick={() => setDashboardOpen(!dashboardOpen)}
                  className="hover:text-gray-300"
                >
                  ▾
                </button>
              </div>

              {dashboardOpen && (
                <div className="bg-[#01474f]">
                  <Link
                    to="/dashboard/list-record"
                    onClick={() => {
                      setOpen(false);
                      setDashboardOpen(false);
                    }}
                    className="block py-2 text-center text-sm"
                  >
                    List Record
                  </Link>

                  <Link
                    to="/dashboard/add-record"
                    onClick={() => {
                      setOpen(false);
                      setDashboardOpen(false);
                    }}
                    className="block py-2 text-center text-sm"
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
                className="block w-full py-3 text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block py-3 text-center"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="block py-3 text-center"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
