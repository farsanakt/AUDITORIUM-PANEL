"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import Sidebar from "../../component/auditorium/Sidebar"
import Header from "../../component/user/Header"


interface CalendarDay {
  date: number
  month: number
  status: "available" | "booked" | "waitlist" | "maintenance" | "other-month"
  hasEvent?: boolean
}

const SlotManagementCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filterValue, setFilterValue] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")

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

  return (
    <div className="flex h-screen bg-[#FDF8F1] ">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header /> */}
        <Header/>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-[#78533F] mb-1">Auditorium Calendar</h1>
                <p className="text-[#78533F] opacity-80 text-sm">Manage Golden Auditorium's availability</p>
              </div>

              <div className="flex mt-3 md:mt-0 space-x-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-3 py-1.5 bg-[#78533F] text-white rounded-md hover:bg-[#8a614b] transition-colors flex items-center text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slot
                </button>
              </div>
            </div>

            {/* Filters */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-full shadow-sm p-1">
                <select
                  className="w-full px-3 py-1.5 rounded-full text-[#78533F] focus:outline-none text-sm"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="all">All Venues</option>
                  <option value="ac">AC Halls</option>
                  <option value="non-ac">Non-AC Halls</option>
                </select>
              </div>
              <div className="bg-white rounded-full shadow-sm p-1">
                <select
                  className="w-full px-3 py-1.5 rounded-full text-[#78533F] focus:outline-none text-sm"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="all">All Times</option>
                  <option value="morning">Morning (6 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 10 PM)</option>
                </select>
              </div>
            </div> */}

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
                    {months[currentMonth]} {currentYear}
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
                      h-14 p-1 bg-white flex flex-col items-center justify-center
                      ${day.status !== "other-month" ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""}
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
          </div>
        </main>
      </div>

      {/* Day Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
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
                <select className="w-full px-3 py-1.5 border rounded-md text-sm">
                  <option>Golden Auditorium - AC</option>
                  <option>Silver Hall - Non-AC</option>
                  <option>Bronze Hall - AC</option>
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
