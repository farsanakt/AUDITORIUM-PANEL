import React, { useState } from "react";
import logo from "../../assets/logo-removebg.png";
import logo1 from "../../assets/iBooking-removebg.png";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate=useNavigate()

  const  onLoginClick=()=>{
   navigate('/')
  } 
  return (
    <>
      {/* Fixed header */}
      <header className="fixed top-0 mt-0 left-0 right-0 bg-[#FDF8F1]  z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex ml-26 items-center space-x-4">
            <img
              src={logo}
              alt="i Booking Logo"
              className="h-10 w-auto scale-130"
            />
            <img
              src={logo1}
              alt="i Booking Logo 2"
              className="h-6 w-auto ml-15 scale-800"
            />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/user/signup" className="text-[#825F4C] hover:text-gray-800">
              Vendor
            </a>
            <a href="/" className="text-[#825F4C] hover:text-gray-800">
              Auditorium
            </a>
            <a href="#" className="text-[#825F4C] hover:text-gray-800">
              Admin
            </a>
            <button
              onClick={onLoginClick}
              className="bg-[#ED695A] hover:bg-red-400 text-white px-4 py-2 rounded-lg shadow-xl transition-colors"
            >
              Login
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {/* Hamburger icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Content */}
        {menuOpen && (
          <div className="md:hidden bg-[#FDF8F1] px-4 pb-4 space-y-3">
            <a href="#" className="block text-gray-600 hover:text-gray-800">
              Vendor
            </a>
            <a href="#" className="block text-gray-600 hover:text-gray-800">
              Auditorium
            </a>
            <a href="#" className="block text-gray-600 hover:text-gray-800">
              Admin
            </a>
            <button
              onClick={onLoginClick}
              className="block w-full text-center bg-[#ED695A] hover:bg-red-400 text-white px-4 py-2 rounded-lg shadow shadow-2xl transition-colors"
            >
              Login
            </button>
          </div>
        )}
      </header>

      {/* Spacer to push content below header */}
      <div className="h-24 md:h-20"></div>
    </>
  );
};

export default Header;
