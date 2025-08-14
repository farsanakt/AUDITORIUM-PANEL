import React, { useState } from "react";

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("/dashboard");

  const menuItems = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Vendor Bookings", path: "/vendor-bookings" },
    { title: "vendor", path: "/vendor/addvendor" },
    { title: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-[#FDF8F1] text-[#825F4C] p-5 fixed shadow-lg flex flex-col">
      {/* Profile Section */}
      <div className="flex items-center mb-8 border-b border-gray-200 pb-4">
        <div className="w-12 h-12 bg-white rounded-full mr-3 border-2 border-gray-200"></div>
        <div>
          <p className="font-semibold text-lg text-[#825F4C]">Clayton Daniels</p>
          <span className="text-sm text-blue-200">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className={`
                  block px-4 py-2 rounded-xl transition-all duration-200
                  ${
                    activeItem === item.path
                      ? "bg-[#ED695A] text-white shadow-md"
                      : "text-[#825F4C] hover:bg-gray-100 hover:text-[#2C5F73]"
                  }
                `}
                onClick={() => setActiveItem(item.path)}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Buttons */}
      <div className="mt-8 space-y-3">
        <button className="w-full bg-white text-[#825F4C] px-4 py-2 rounded-xl font-medium hover:bg-gray-100 hover:text-[#2C5F73] transition duration-200 shadow">
          + Add Account
        </button>
        <button className="w-full bg-white text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-red-50 hover:text-red-600 transition duration-200 shadow">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;