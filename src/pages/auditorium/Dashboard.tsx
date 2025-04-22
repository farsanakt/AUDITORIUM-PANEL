"use client"

import { useState } from "react"

const AuditoriumDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeSection, setActiveSection] = useState("upcoming")

  // Sample data for dashboard
  const dashboardData = {
    totalBookings: 128,
    earnings: {
      monthly: 356000,
      yearly: 4250000,
    },
    pendingRequests: [
      {
        id: 1,
        name: "Annual College Function",
        client: "St. Xavier's College",
        date: "28 Apr, 2025",
        status: "Pending",
      },
      { id: 2, name: "Tech Conference 2025", client: "TechMinds Corp", date: "15 May, 2025", status: "Pending" },
      { id: 3, name: "Classical Music Concert", client: "Symphony Arts", date: "22 May, 2025", status: "Pending" },
    ],
    upcomingEvents: [
      { id: 1, name: "Graduation Ceremony", client: "City University", date: "25 Apr, 2025", status: "Confirmed" },
      { id: 2, name: "Corporate Seminar", client: "Global Industries", date: "30 Apr, 2025", status: "Confirmed" },
      { id: 3, name: "Dance Competition", client: "StarDance Academy", date: "05 May, 2025", status: "Confirmed" },
    ],
  }

  return (
    <div className="bg-[#FDF8F1] min-h-screen w-full overflow-hidden ">
      {/* Top Navigation */}
      <header className="bg-white shadow-md py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#ED695A] rounded-full flex items-center justify-center">
              <span className="text-white font-bold">TK</span>
            </div>
            <h1 className="text-[#78533F] font-bold text-xl hidden md:block">Auditorium Dashboard</h1>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-0">
            <div className="relative">
              <button className="relative p-2 text-gray-500 hover:text-[#ED695A] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ED695A] rounded-full text-white text-xs flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#78533F] rounded-full"></div>
              <span className="text-gray-700 hidden md:block">Golden Auditorium</span>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen w-full flex bg-[#FDF8F1]">
        {/* Sidebar Navigation - Hidden on mobile */}
        <aside className="hidden md:block w-64 bg-white shadow-md min-h-screen p-4 flex-shrink-0">
          <nav className="mt-6">
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#ED695A] bg-opacity-10 text-[#ED695A] font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  <span>Overview</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Bookings</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Finances</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Settings</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden flex bg-white shadow-md w-full">
          <button
            className={`flex-1 py-3 text-center ${activeTab === "overview" ? "text-[#ED695A] border-b-2 border-[#ED695A]" : "text-gray-500"}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`flex-1 py-3 text-center ${activeTab === "bookings" ? "text-[#ED695A] border-b-2 border-[#ED695A]" : "text-gray-500"}`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
          <button
            className={`flex-1 py-3 text-center ${activeTab === "calendar" ? "text-[#ED695A] border-b-2 border-[#ED695A]" : "text-gray-500"}`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          <div className="px-0 md:px-4 py-6 w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#78533F]">Dashboard Overview</h2>
              <p className="text-gray-600">Hello! Here's what's happening with your auditorium today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
                  <span className="p-2 bg-[#ED695A] bg-opacity-10 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#ED695A]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="flex items-end space-x-2">
                  <h2 className="text-3xl font-bold text-gray-800">{dashboardData.totalBookings}</h2>
                  <span className="text-green-500 text-sm font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    +12%
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2">vs previous month</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium">Monthly Earnings</h3>
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="flex items-end space-x-2">
                  <h2 className="text-3xl font-bold text-gray-800">
                    ₹{dashboardData.earnings.monthly.toLocaleString()}
                  </h2>
                  <span className="text-green-500 text-sm font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    +8.5%
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2">vs previous month</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium">Yearly Revenue</h3>
                  <span className="p-2 bg-purple-100 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="flex items-end space-x-2">
                  <h2 className="text-3xl font-bold text-gray-800">
                    ₹{dashboardData.earnings.yearly.toLocaleString()}
                  </h2>
                  <span className="text-green-500 text-sm font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    +21%
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2">vs previous year</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium">Pending Requests</h3>
                  <span className="p-2 bg-amber-100 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="flex items-end space-x-2">
                  <h2 className="text-3xl font-bold text-gray-800">{dashboardData.pendingRequests.length}</h2>
                </div>
                <p className="text-gray-500 text-sm mt-2">Need your attention</p>
              </div>
            </div>

            {/* Toggle for Upcoming Events and Pending Requests */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    className={`flex-1 py-4 text-center font-medium ${activeSection === "upcoming" ? "text-[#ED695A] border-b-2 border-[#ED695A]" : "text-gray-500"}`}
                    onClick={() => setActiveSection("upcoming")}
                  >
                    Upcoming Events
                  </button>
                  <button
                    className={`flex-1 py-4 text-center font-medium ${activeSection === "pending" ? "text-[#ED695A] border-b-2 border-[#ED695A]" : "text-gray-500"}`}
                    onClick={() => setActiveSection("pending")}
                  >
                    Pending Requests
                  </button>
                </div>
              </div>

              {/* Upcoming Events Content */}
              {activeSection === "upcoming" && (
                <div className="p-6">
                  {dashboardData.upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-lg bg-[#ED695A] bg-opacity-10 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-[#ED695A]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{event.name}</h4>
                              <p className="text-sm text-gray-500">Client: {event.client}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-800">{event.date}</div>
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              {event.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No upcoming events.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pending Requests Content */}
              {activeSection === "pending" && (
                <div className="p-6">
                  {dashboardData.pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.pendingRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-amber-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{request.name}</h4>
                              <p className="text-sm text-gray-500">Client: {request.client}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-800">{request.date}</div>
                            <div className="flex space-x-2 mt-2">
                              <button className="px-3 py-1 text-xs rounded bg-[#ED695A] text-white hover:bg-[#d85c4e] transition-colors">
                                Accept
                              </button>
                              <button className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
                                Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No pending requests.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AuditoriumDashboard
