import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
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
    navigate("/login");
  };

  return (
    <nav className="bg-[#003C43] text-white p-5 shadow-md">
      <div className="flex justify-between items-center md:px-10 lg:px-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="BizBuddy Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-2xl tracking-wide">BizBuddy</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-lg">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-[#002b30] mt-3 divide-y divide-gray-700 rounded-xl overflow-hidden">
          <Link to="/" onClick={() => setOpen(false)} className="block px-6 py-4 text-lg hover:bg-[#01474f] text-center">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block py-3 text-center">
                Dashboard
              </Link>

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
              <Link to="/login" onClick={() => setOpen(false)} className="block py-3 text-center">
                Login
              </Link>

              <Link to="/signup" onClick={() => setOpen(false)} className="block py-3 text-center">
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
