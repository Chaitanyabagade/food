import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const AdminNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const navigate = useNavigate();
   

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center px-4 py-2">
                
                {/* Left Section (Menu Button & Logo) */}
                <div className="flex items-center space-x-4">
                    {/* Hamburger Menu Button (Only for Mobile) */}
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
                    <div className="text-2xl p-0 pt-1 font-bold text-green-600">
                        FastFood
                    </div>
                </div>

                {/* Menu Links (Pushed to Right) */}
                <div className="hidden md:flex md:items-center space-x-8 ml-auto">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-bold text-2xl text-gray-600 hover:text-green-600">
                        Home
                    </Link>

                    {/* Logout Button */}
                    <button onClick={() => {
                        if (window.confirm("Do You Want To Logout...")) {
                            Cookies.remove('adminEmail');
                            Cookies.remove('admin');
                            navigate('./');
                            window.location.reload();
                        }
                    }}
                        className="font-bold text-2xl border-2 rounded-lg border-green-600 px-3 pb-[3px] text-gray-600 hover:text-green-600">
                        Logout
                    </button>
                </div>

              
            </div>

           
            
            {/* Dropdown Menu for Small Devices */}
            {isMenuOpen && (
                <div className="md:hidden shadow-md">
                    <div className="flex flex-col space-y-2 px-4 py-3">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="block font-bold text-2xl text-gray-600 hover:text-green-600">
                            Home
                        </Link>

                        <button onClick={() => {
                            if (window.confirm("Do You Want To Logout...")) {
                                Cookies.remove('adminEmail');
                                Cookies.remove('admin');
                                navigate('./');
                                window.location.reload();
                            }
                        }}
                            className="font-bold text-2xl border-2 rounded-lg border-green-600 px-2 pb-[3px] text-gray-600 hover:text-green-600">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default AdminNav;
