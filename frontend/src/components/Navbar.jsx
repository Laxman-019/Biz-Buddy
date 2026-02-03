import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

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

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-lg">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/login" className="hover:text-gray-300">
            Login
          </Link>
          <Link to="/signup" className="hover:text-gray-300">
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
  <div className="md:hidden bg-[#002b30] mt-3 divide-y divide-gray-700 rounded-xl overflow-hidden">

    <Link to="/" onClick={() => setOpen(false)} 
      className="block px-6 py-4 text-lg hover:bg-[#01474f] text-center">
      Home
    </Link>

    <Link to="/login" onClick={() => setOpen(false)} 
      className="block px-6 py-4 text-lg hover:bg-[#01474f] text-center">
      Login
    </Link>

    <Link to="/signup" onClick={() => setOpen(false)} 
      className="block px-6 py-4 text-lg hover:bg-[#01474f] text-center">
      Sign up
    </Link>

  </div>
)}

    </nav>
  );
};

export default Navbar;
