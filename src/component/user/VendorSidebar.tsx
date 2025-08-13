import React from "react";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-purple-900 to-purple-700 text-white p-5 fixed shadow-lg">
      {/* Profile Section */}
      <div className="flex items-center mb-8 border-b border-purple-500 pb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-3 border-2 border-purple-300"></div>
        <div>
          <p className="font-semibold text-lg">Clayton Daniels</p>
          <span className="text-sm text-purple-200">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="block px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200"
            >
              Vendor Bookings
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200"
            >
              Settings
            </a>
          </li>
        </ul>
      </nav>

      {/* Buttons */}
      <div className="mt-8 space-y-3">
        <button className="w-full bg-white text-purple-900 px-4 py-2 rounded-lg font-medium hover:bg-purple-100 transition duration-200 shadow">
          + Add Account
        </button>
        <button className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-200 shadow">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
