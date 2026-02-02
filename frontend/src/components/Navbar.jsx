import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#003C43] text-white p-5 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">

        {/* Logo */}
        <h1 className="font-bold text-2xl tracking-wide">BizBuddy</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-lg">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
          <Link to="/signup" className="hover:text-gray-300">Sign up</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-[#003C43] p-5 space-y-4 text-lg animate-slideDown">
          <Link to="/" className="block hover:text-gray-300" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/login" className="block hover:text-gray-300" onClick={() => setOpen(false)}>Login</Link>
          <Link to="/signup" className="block hover:text-gray-300" onClick={() => setOpen(false)}>Sign up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
