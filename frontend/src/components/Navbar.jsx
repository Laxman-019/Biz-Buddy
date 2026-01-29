import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-[#003C43] text-white p-5 ">
        <div className='flex items-center justify-around'>
            <h1 className='font-bold text-2xl tracking-wide '>BizBuddy</h1>
            <div className='hidden  md:flex gap-10 text-lg'>
            <Link to="/" className='hover:text-gray-400'>Home</Link>
            <Link to="/login" className='hover:text-gray-400'>Login</Link>
            <Link to="/signup" className='hover:text-gray-400'>Sign up</Link>
            </div>
        </div>

    </nav>
  )
}

export default Navbar