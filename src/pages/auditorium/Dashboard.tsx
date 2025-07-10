"use client"

import { useState } from "react"

import Header from "../../component/user/Header"

// Sample data for different venues
const venueData = {
  "whole-auditorium": {
    name: "Whole Auditorium",
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
  },
  "main-hall": {
    name: "Main Hall",
    totalBookings: 85,
    earnings: {
      monthly: 245000,
      yearly: 2940000,
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
    ],
    upcomingEvents: [
      { id: 1, name: "Graduation Ceremony", client: "City University", date: "25 Apr, 2025", status: "Confirmed" },
      { id: 2, name: "Corporate Seminar", client: "Global Industries", date: "30 Apr, 2025", status: "Confirmed" },
    ],
  },
  "conference-room": {
    name: "Conference Room",
    totalBookings: 32,
    earnings: {
      monthly: 85000,
      yearly: 1020000,
    },
    pendingRequests: [
      { id: 1, name: "Classical Music Concert", client: "Symphony Arts", date: "22 May, 2025", status: "Pending" },
    ],
    upcomingEvents: [
      { id: 1, name: "Dance Competition", client: "StarDance Academy", date: "05 May, 2025", status: "Confirmed" },
    ],
  },
  "theater": {
    name: "Theater",
    totalBookings: 11,
    earnings: {
      monthly: 26000,
      yearly: 290000,
    },
    pendingRequests: [],
    upcomingEvents: [],
  },
}

const DashboardOverview = () => {
  const [activeSection, setActiveSection] = useState<string>("upcoming")
  const [selectedVenue, setSelectedVenue] = useState<string>("whole-auditorium")

  const currentVenueData = venueData[selectedVenue as keyof typeof venueData]
  const dashboardData = currentVenueData

  return (
    <div className="px-0 md:px-4 py-6 w-full pt-0">
      <Header/>
      <div className="mb-6">
        <h2 className="text-2xl font-bold  text-[#78533F]">Dashboard Overview</h2>
        <p className="text-gray-600">Hello! Here's what's happening with your auditorium today.</p>
      </div>

      {/* Venue Selection */}
      <div className="mb-6">
        <label htmlFor="venue-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Venue
        </label>
        <div className="relative">
          <select
            id="venue-select"
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="block w-full max-w-xs px-4 py-3 pr-10 text-base border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-[#ED695A] transition-colors duration-200"
          >
            {Object.entries(venueData).map(([key, venue]) => (
              <option key={key} value={key}>
                {venue.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Currently viewing: <span className="font-medium text-[#78533F]">{currentVenueData.name}</span>
        </p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
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
            <h2 className="text-3xl font-bold text-gray-800">₹{dashboardData.earnings.monthly.toLocaleString()}</h2>
            <span className="text-green-500 text-sm font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
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
            <h2 className="text-3xl font-bold text-gray-800">₹{dashboardData.earnings.yearly.toLocaleString()}</h2>
            <span className="text-green-500 text-sm font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
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
              className={`flex-1 py-4 text-center text-left ml-7 font-medium ${activeSection === "upcoming" ? "text-[#ED695A] border-b-2 border-[#ED695A]" : "text-gray-500"}`}
              onClick={() => setActiveSection("upcoming")}
            >
              Upcoming Events
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
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
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
                <p className="text-gray-500 font-medium">No upcoming events</p>
                <p className="text-gray-400 text-sm mt-1">for {currentVenueData.name}</p>
              </div>
            )}
          </div>
        )}

        
    
      </div>
    </div>
  )
}

export default DashboardOverview