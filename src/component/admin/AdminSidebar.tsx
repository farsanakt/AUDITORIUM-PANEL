import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Mail, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { path: '/admin/vendors', label: 'Vendors', icon: Users },
    { path: '/admin/enquiries', label: 'Enquiries', icon: Mail },
  ];

  return (
    <div>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-[#78533F] hover:text-[#ED695A] transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-[#b09d94] w-64 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-40`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#78533F] font-serif mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#ED695A] text-white'
                      : 'text-[#78533F] hover:bg-[#FDF8F1] hover:text-[#ED695A]'
                  }`
                }
                onClick={() => setIsOpen(false)} // Close sidebar on mobile after click
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-3 rounded-lg text-sm font-medium text-[#78533F] hover:bg-[#FDF8F1] hover:text-[#ED695A] w-full text-left"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default AdminSidebar;