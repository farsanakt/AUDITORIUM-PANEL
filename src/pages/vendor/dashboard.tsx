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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full">
    <Sidebar />
  </div>

      {/* Main Content Area */}
     <div className="flex-1 ml-64">
    <Header />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="space-x-2">
              <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                This month
              </button>
              <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                This year
              </button>
              <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                Custom
              </button>
            </div>
          </div>

          {/* Total Balance */}
          <div className="text-xl font-semibold mb-4">
            Total balance: <span className="text-green-600">$12,245</span>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-600 text-white p-4 rounded shadow">
              <p className="text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">120</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded shadow">
              <p className="text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">$45,000</p>
            </div>
            <div className="bg-purple-800 text-white p-4 rounded shadow">
              <p className="text-sm">Upcoming Events</p>
              <p className="text-2xl font-bold">{upcomingEvents.length}</p>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-bold mb-4">Upcoming Events</h2>
            <ul className="divide-y divide-gray-200">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{event.name}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
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
