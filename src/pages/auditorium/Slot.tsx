"use client"

import type React from "react"

import { useState } from "react"
import { Plus, ArrowLeft } from "lucide-react"

import { useNavigate } from "react-router-dom"
import Sidebar from "../../component/auditorium/Sidebar"
import Header from "../../component/user/Header"

interface CalendarDay {
  date: number
  month: number
  status: "available" | "booked" | "waitlist" | "maintenance" | "other-month"
  hasEvent?: boolean
}

interface Venue {
  id: string
  name: string
  type: string
  capacity: number
}

const SlotManagementCalendar = () => {
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState("auditorium-1")
 

  
  const venues: Venue[] = [
    { id: "auditorium-1", name: "Golden Auditorium", type: "AC", capacity: 500 },
    { id: "hall-1", name: "Silver Hall", type: "Non-AC", capacity: 300 },
    { id: "theater-1", name: "Main Theater", type: "AC", capacity: 800 },
    { id: "conference-1", name: "Conference Hall", type: "AC", capacity: 200 },
  ]

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = []

    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()

   
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate()

   
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonthDays - i,
        month: currentMonth - 1,
        status: "other-month",
      })
    }

   
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    
    
    const statuses = ["available", "booked", "waitlist", "maintenance"]
    for (let i = 1; i <= daysInMonth; i++) {
      
      const statusIndex = Math.floor((i * 7) % 4)
      days.push({
        date: i,
        month: currentMonth,
        status: statuses[statusIndex] as any,
      })
    }

    
    const remainingSlots = 35 - days.length 
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        date: i,
        month: currentMonth + 1,
        status: "other-month",
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600"
      case "booked":
        return "text-red-600"
      case "waitlist":
        return "text-amber-600"
      case "maintenance":
        return "text-blue-600"
      case "other-month":
        return "text-gray-400"
      default:
        return "text-gray-900"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available"
      case "booked":
        return "Booked"
      case "waitlist":
        return "Waiting List"
      case "maintenance":
        return "Maintenance"
      default:
        return ""
    }
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDayClick = (day: CalendarDay) => {
    if (day.status !== "other-month") {
      setSelectedDay(day)
      setShowModal(true)
    }
  }

  const isToday = (day: CalendarDay) => {
    const today = new Date()
    return day.date === today.getDate() && day.month === today.getMonth() && currentYear === today.getFullYear()
  }

  const handleVenueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVenue(e.target.value)
  }

  const handleGoBack = () => {
    navigate(-1) 
  }

  const getCurrentVenue = () => {
    return venues.find((venue) => venue.id === selectedVenue)
  }

  return (
    <div className="flex h-screen bg-[#FDF8F1]">
      
      <style
  dangerouslySetInnerHTML={{
    __html: `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      body.modal-open {
        overflow: hidden;
      }
      .select-container .select-content {
        width: 100%;
        max-height: 200px;
        overflow-y: auto;
        background-color: white;
        border-radius: 0.375rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                    0 2px 4px -1px rgba(0, 0, 0, 0.06);
        z-index: 50;
      }
      .select-container .select-item {
        padding: 0.5rem 1rem;
        cursor: pointer;
      }
      .select-container .select-item:hover {
        background-color: #f3f4f6;
      }
    `,
  }}
/>


       <div className="w-64 shrink-0  h-[calc(100vh-64px)]  sticky top-25 hidden md:block">
          <Sidebar />
        </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        


        <main className="flex-1  p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header with title and venue dropdown aligned */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#78533F]">Venue Management</h1>
                <p className="text-[#78533F] opacity-80 text-sm">Manage venue availability and bookings</p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Smaller dropdown on the right */}
                <select
                  value={selectedVenue}
                  onChange={handleVenueChange}
                  className="venue-select border border-[#78533F]/20 rounded-md py-1.5 px-3 text-[#78533F] focus:outline-none focus:ring-1 focus:ring-[#78533F]/50 focus:border-[#78533F] text-sm w-48"
                >
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowModal(true)}
                  className="px-3 py-1.5 bg-[#78533F] text-white rounded-md hover:bg-[#8a614b] transition-colors flex items-center text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slot
                </button>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-[#604b43] to-[#8e6e60] p-3 text-white">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    aria-label="Previous month"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <h2 className="text-lg font-bold">
                    {months[currentMonth]} {currentYear} - {getCurrentVenue()?.name}
                  </h2>

                  <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    aria-label="Next month"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 bg-gray-50 border-b text-xs">
                {weekdays.map((day, index) => (
                  <div key={index} className="py-1.5 text-center font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`
                      calendar-day h-14 p-1 bg-white flex flex-col items-center justify-center
                      ${day.status !== "other-month" ? "cursor-pointer transition-colors" : ""}
                      ${isToday(day) ? "ring-1 ring-[#78533F]" : ""}
                    `}
                  >
                    <span className={`text-xs font-medium ${getStatusColor(day.status)}`}>{day.date}</span>
                    {day.status !== "other-month" && (
                      <div className={`mt-0.5 text-[10px] ${getStatusColor(day.status)}`}>
                        {getStatusText(day.status)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Status Legend */}
            <div className="bg-white rounded-lg shadow p-3 mb-4 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-medium">● Green:</span>
                  <span className="text-[#78533F]">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-600 font-medium">● Red:</span>
                  <span className="text-[#78533F]">Booked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-amber-600 font-medium">● Yellow:</span>
                  <span className="text-[#78533F]">Waiting List</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 font-medium">● Blue:</span>
                  <span className="text-[#78533F]">Maintenance</span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={handleGoBack}
                className="flex items-center px-4 py-2 text-[#78533F] hover:bg-[#78533F]/10 rounded-md transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back 
              </button>
            </div>
          </div>
        </main>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-[#78533F]">
                {selectedDay ? `${months[selectedDay.month]} ${selectedDay.date}, ${currentYear}` : "Add New Slot"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Venue</label>
                <select
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                  value={selectedVenue}
                  onChange={handleVenueChange}
                >
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} - {venue.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                  defaultValue={
                    selectedDay
                      ? `${currentYear}-${(selectedDay.month + 1).toString().padStart(2, "0")}-${selectedDay.date.toString().padStart(2, "0")}`
                      : undefined
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Time Slot</label>
                <select className="w-full px-3 py-1.5 border rounded-md text-sm">
                  <option>Morning (6 AM - 12 PM)</option>
                  <option>Afternoon (12 PM - 5 PM)</option>
                  <option>Evening (5 PM - 10 PM)</option>
                  <option>Full Day (6 AM - 10 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                  defaultValue={selectedDay?.status || "available"}
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="waitlist">Waiting List</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Price ($)</label>
                <input type="number" className="w-full px-3 py-1.5 border rounded-md text-sm" defaultValue="500" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                  rows={2}
                  placeholder="Any special details about this slot..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 border rounded-md text-gray-600 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button className="px-3 py-1.5 bg-[#78533F] text-white rounded-md hover:bg-[#8a614b] text-sm">
                  {selectedDay?.status === "other-month" ? "Add Slot" : "Update Slot"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SlotManagementCalendar
