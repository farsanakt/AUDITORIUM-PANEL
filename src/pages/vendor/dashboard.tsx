import React from "react";
import Sidebar from "../../component/user/VendorSidebar";
import Header from "../../component/user/Header";

const Dashboard: React.FC = () => {
  const upcomingEvents = [
    { id: 1, name: "Wedding Ceremony", date: "2025-08-20", location: "City Hall" },
    { id: 2, name: "Corporate Conference", date: "2025-09-05", location: "Grand Hotel" },
    { id: 3, name: "Birthday Party", date: "2025-09-15", location: "Sunset Garden" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDF8F1]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-[#825F4C]">Dashboard</h1>
              <span className="text-sm text-[#2C5F73] bg-[#ED695A]/10 px-3 py-1 rounded-full">
                Logged as Vendor
              </span>
            </div>
            <div className="space-x-2">
              <button className="px-3 py-1 bg-white text-[#825F4C] rounded-full hover:bg-gray-100 hover:text-[#2C5F73] shadow">
                This month
              </button>
              <button className="px-3 py-1 bg-white text-[#825F4C] rounded-full hover:bg-gray-100 hover:text-[#2C5F73] shadow">
                This year
              </button>
              <button className="px-3 py-1 bg-white text-[#825F4C] rounded-full hover:bg-gray-100 hover:text-[#2C5F73] shadow">
                Custom
              </button>
            </div>
          </div>

          {/* Total Balance */}
          <div className="text-xl font-semibold text-[#825F4C] mb-4">
            Total balance: <span className="text-[#ED695A]">₹12,245</span>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2C5F73] text-white p-4 rounded-xl shadow">
              <p className="text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">120</p>
            </div>
            <div className="bg-[#ED695A] text-white p-4 rounded-xl shadow">
              <p className="text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">₹45,000</p>
            </div>
            <div className="bg-[#825F4C] text-white p-4 rounded-xl shadow">
              <p className="text-sm">Upcoming Events</p>
              <p className="text-2xl font-bold">{upcomingEvents.length}</p>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold text-[#825F4C] mb-4">Upcoming Events</h2>
            <ul className="divide-y divide-gray-200">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-[#825F4C]">{event.name}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                  <span className="text-sm bg-[#ED695A]/10 text-[#2C5F73] px-3 py-1 rounded-full">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;