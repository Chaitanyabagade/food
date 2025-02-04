import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-0 py-2">
        {/* Left-aligned Menu Button and Logo */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-9 h-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          {/* Logo */}
          <img className="w-[80px] h-[50px]" alt="logo" src={logo} />
          <div className="text-2xl p-0 pt-1 flex font-bold text-green-600">
            FastFood
          </div>
        </div>

        {/* Menu Links */}
        <div className="hidden md:flex md:items-center space-x-10">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-bold text-2xl text-gray-600 hover:text-green-600">
            Home
          </Link>
         
          <Link to="/Contact" onClick={() => setIsMenuOpen(false)} className="font-bold text-2xl text-gray-600 hover:text-green-600">
            Contact
          </Link>
         
          <Link to="/Signup" onClick={() => setIsMenuOpen(false)} className="font-bold text-2xl border-2 rounded-lg border-green-600 px-2 pb-[3px] text-gray-600 hover:text-green-600">
            Sign Up
          </Link>
          <Link to="/Login" onClick={() => setIsMenuOpen(false)} className="font-bold text-2xl border-2 rounded-lg border-green-600 px-2 pb-[3px] text-gray-600 hover:text-green-600">
            Login
          </Link>

          <Link to="/AdminLogin" onClick={() => setIsMenuOpen(false)} className="font-bold text-2xl border-2 rounded-lg border-green-600 px-2 pb-[3px]  text-gray-600 hover:text-green-600">
            Admin Login
          </Link>
        </div>
      </div>

      {/* Dropdown Menu for Small Devices */}
      {isMenuOpen && (
        <div className="md:hidden  shadow-md">
          <div className="flex flex-col space-y-2 px-4 py-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block font-bold text-2xl text-gray-600 hover:text-green-600">
              Home
            </Link>
            <Link to="/Contact" onClick={() => setIsMenuOpen(false)} className="block font-bold text-2xl text-gray-600 hover:text-green-600">
            Contact
            </Link>
           
           
            <Link to="/Signup" onClick={() => setIsMenuOpen(false)} className="font-bold text-2xl border-2 rounded-lg border-green-600 px-2 pb-[3px] text-gray-600 hover:text-green-600">
              Sign Up
            </Link>

            <Link to="/Login" onClick={() => setIsMenuOpen(false)} className="font-bold text-2xl border-2 rounded-lg border-green-600 px-2 pb-[3px] text-gray-600 hover:text-green-600">
              Login
            </Link>

            <Link to="/AdminLogin" onClick={() => setIsMenuOpen(false)} className="font-bold text-2xl border-2 rounded-lg border-green-600 px-2 pb-[3px] text-gray-600 hover:text-green-600 ">
              Admin Login
            </Link>

           
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
