import React from 'react';
import Sidebar from '../../component/user/VendorSidebar';

const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="space-x-2">
            <button className="px-2 py-1 bg-gray-200 rounded">This month</button>
            <button className="px-2 py-1 bg-gray-200 rounded">This year</button>
            <button className="px-2 py-1 bg-gray-200 rounded">Custom</button>
          </div>
        </div>
        <div className="text-2xl mb-4">Total balance $12.245</div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-600 text-white p-4 rounded">Earned $3.421</div>
          <div className="bg-red-500 text-white p-4 rounded">Spent $2.509</div>
          <div className="bg-purple-800 text-white p-4 rounded">Saved $1.252</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="bg-blue-200 p-4 rounded">
              <div>Family</div>
              <div>$4.242</div>
            </div>
            <div className="bg-gray-200 p-4 rounded mt-4">
              <div>Savings</div>
              <div>$3.003</div>
            </div>
            <div className="bg-blue-200 p-4 rounded mt-4">
              <div>DIY Business</div>
              <div>$5.000</div>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            {/* Simple chart placeholder */}
            <svg className="w-full h-48">
              <path d="M0 40 L20 20 L40 30 L60 10 L80 25 L100 5" fill="none" stroke="blue" strokeWidth="2"/>
              <circle cx="100" cy="5" r="3" fill="blue"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;