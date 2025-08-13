import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-purple-800 text-white p-4 fixed">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-2"></div>
        <span>Clayton Daniels</span>
      </div>
      <nav>
        <ul>
          <li className="mb-2"><a href="#" className="text-white">Dashboard</a></li>
          <li className="mb-2"><a href="#" className="text-white">Planning</a></li>
          <li className="mb-2"><a href="#" className="text-white">Settings</a></li>
        </ul>
      </nav>
      <button className="mt-4 bg-gray-200 text-black px-4 py-2 rounded">+ Add account</button>
      <button className="mt-2 bg-gray-200 text-black px-4 py-2 rounded">Log out</button>
    </div>
  );
};

export default Sidebar