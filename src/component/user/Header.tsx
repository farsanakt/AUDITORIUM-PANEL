import React from 'react';
import logo from '../../assets/Logo v6 1.png'
import logo1 from '../../assets/Logo v6 2.png'
interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  return (
    <>
      {/* Fixed header with shadow */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 mx-auto py-5 bg-[#FDF8F1] ">
      {/* container mx-auto  px-4 max-w-6xl flex justify-between items-center py-5 */}
        {/* Logo/image on the left */}
        <div className="flex items-center pl-12 mx-14 ">
          <img 
            src={logo} 
            alt="i Booking Venue" 
            className="h-10 mr-2"
          />
          <img 
            src={logo1} 
            alt="i Booking Venue" 
            className="h-10 mr-2"
          />
       
        </div>
        
        {/* Navigation links moved to the right */}
        <div className="flex items-center space-x-6 mx-17">
          <a href="#" className="text-gray-600 hover:text-gray-800">Vendor</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Auditorium</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Admin</a>
          
          {/* Login button with enhanced shadow */}
          <button 
            onClick={onLoginClick}
            className="bg-[#ED695A] hover:bg-red-400 text-white px-6 py-2 rounded-lg shadow-lg ml-6 transition-colors"
          >
            Login
          </button>
        </div>
      </header>
      
      {/* Spacer div to create gap between header and content */}
      <div className="h-24"></div>
    </>
  );
};

export default Header;