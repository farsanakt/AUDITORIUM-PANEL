"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, X, Eye, EyeOff } from "lucide-react"
import Header from "../../component/user/Header"
import Sidebar from "../../component/auditorium/Sidebar"
import { useNavigate } from "react-router-dom"

interface TimeSlot {
  id: string
  time: string
  status: "available" | "booked" | "waitlist" | "maintenance"
  price: number
}

interface Venue {
  id: string
  name: string
  timeSlots: TimeSlot[]
}

interface BookingDetails {
  customerName: string
  contactNumber: string
  balancePayable: number
  bookingId: string
}

interface TooltipData {
  x: number
  y: number
  date: number
  status: string
  bookingDetails?: BookingDetails
}

const VenueBookingPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedVenue, setSelectedVenue] = useState<string>("auditorium")
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [acOption, setAcOption] = useState<"ac" | "non-ac">("ac")
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [cancellingDate, setCancellingDate] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<"left" | "right">("right")
  const navigate = useNavigate()

  const hideTimeoutRef = useRef<number | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const venues: Venue[] = [
    {
      id: "auditorium",
      name: "Golden Auditorium",
      timeSlots: [
        { id: "1", time: "Morning (6 AM - 10 AM)", status: "available", price: 500 },
        { id: "2", time: "Late Morning (10 AM - 2 PM)", status: "booked", price: 700 },
        { id: "3", time: "Afternoon (2 PM - 6 PM)", status: "waitlist", price: 600 },
        { id: "4", time: "Evening (6 PM - 9 PM)", status: "maintenance", price: 800 },
      ],
    },
    {
      id: "conference",
      name: "Conference Hall",
      timeSlots: [
        { id: "1", time: "Morning (6 AM - 10 AM)", status: "booked", price: 400 },
        { id: "2", time: "Late Morning (10 AM - 2 PM)", status: "available", price: 600 },
        { id: "3", time: "Afternoon (2 PM - 6 PM)", status: "available", price: 500 },
        { id: "4", time: "Evening (6 PM - 9 PM)", status: "waitlist", price: 700 },
      ],
    },
  ]

  const getBookingDetails = (date: number): BookingDetails | undefined => {
    const sampleBookings: { [key: number]: BookingDetails } = {
      7: { customerName: "John Doe", contactNumber: "+1-234-567-8901", balancePayable: 350, bookingId: "BK001" },
      14: { customerName: "Jane Smith", contactNumber: "+1-234-567-8902", balancePayable: 250, bookingId: "BK002" },
      21: { customerName: "Mike Johnson", contactNumber: "+1-234-567-8903", balancePayable: 450, bookingId: "BK003" },
      9: { customerName: "Sarah Wilson", contactNumber: "+1-234-567-8904", balancePayable: 200, bookingId: "BK004" },
      23: { customerName: "David Brown", contactNumber: "+1-234-567-8905", balancePayable: 300, bookingId: "BK005" },
      3: { customerName: "Alice Johnson", contactNumber: "+1-234-567-8906", balancePayable: 180, bookingId: "BK006" },
      16: { customerName: "Bob Smith", contactNumber: "+1-234-567-8907", balancePayable: 220, bookingId: "BK007" },
    }
    return sampleBookings[date]
  }

  const getDateStatus = (date: number): "available" | "booked" | "waitlist" | "maintenance" => {
    const sampleStatuses: { [key: number]: "available" | "booked" | "waitlist" | "maintenance" } = {
      3: "waitlist",
      5: "available",
      7: "booked",
      9: "maintenance",
      11: "booked",
      13: "available",
      16: "waitlist",
      26: "booked",
      28: "booked",
      30: "maintenance",
    }
    return sampleStatuses[date] || "available"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500 hover:bg-emerald-600"
      case "booked":
        return "bg-red-500 hover:bg-red-600"
      case "waitlist":
        return "bg-amber-500 hover:bg-amber-600"
      case "maintenance":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-emerald-500 hover:bg-emerald-600"
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
        return "Available"
    }
  }

  const isSelectable = (status: string) => {
    return status === "available" || status === "waitlist"
  }

  const handleDateClick = (date: number) => {
    const status = getDateStatus(date)
    if (isSelectable(status)) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date)
      setSelectedDate(newDate)
      setShowConfirmation(true)
    }
  }

  const handleMouseEnter = (event: React.MouseEvent, date: number) => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }

    const status = getDateStatus(date)
    if (status === "booked" || status === "waitlist" || status === "maintenance") {
      const rect = event.currentTarget.getBoundingClientRect()
      setTooltip({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        date,
        status,
        bookingDetails: getBookingDetails(date),
      })
    }
  }

  const handleMouseLeave = () => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setTooltip(null)
    }, 200)
  }

  const handleTooltipMouseEnter = () => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }

  const handleTooltipMouseLeave = () => {
    setTooltip(null)
  }

  const handleCancelBooking = (date: number) => {
    setCancellingDate(date)
    setShowCancelConfirm(true)
    setTooltip(null)
  }

  const handleEditDetails = (date: number) => {
    console.log(`Edit details for date ${date}`)
    setTooltip(null)
  }

  const handleConfirmBooking = (date: number) => {
    console.log(`Confirm booking for date ${date}`)
    setTooltip(null)
  }

  const confirmCancellation = () => {
    setShowCancelConfirm(false)
    setShowPasswordModal(true)
  }

  const handlePasswordSubmit = () => {
    if (password === "admin123") {
      console.log(`Booking cancelled for date ${cancellingDate}`)
      setShowPasswordModal(false)
      setPassword("")
      setCancellingDate(null)
    } else {
      alert("Incorrect password!")
    }
  }

  const handleConfirmSlot = () => {
    console.log("Proceeding to booking confirmation")
    navigate("/Bookingconfirmation")
    setShowConfirmation(false)
    setSelectedSlot(null)
  }

  const handleCancelSlot = () => {
    setShowConfirmation(false)
    setSelectedSlot(null)
  }

  const getCurrentVenue = () => {
    return venues.find((venue) => venue.id === selectedVenue)
  }

  const handleGoBack = () => {
    console.log("Going back")
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setIsAnimating(true)
    setAnimationDirection(direction === "prev" ? "left" : "right")

    setTimeout(() => {
      setCurrentMonth((prev) => {
        const newMonth = new Date(prev)
        if (direction === "prev") {
          newMonth.setMonth(prev.getMonth() - 1)
        } else {
          newMonth.setMonth(prev.getMonth() + 1)
        }
        return newMonth
      })

      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }, 300)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const status = getDateStatus(day)
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear()

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          onMouseEnter={(e) => handleMouseEnter(e, day)}
          onMouseLeave={handleMouseLeave}
          className={`
            h-10 w-10 rounded-sm flex items-center justify-center text-sm font-semibold cursor-pointer
            transition-all duration-300 ease-in-out hover:scale-110 relative border-2 border-transparent
            ${getStatusColor(status)} text-white shadow-md hover:shadow-lg
            ${isSelected ? "ring-4 ring-offset-2 ring-indigo-400" : ""}
            ${isSelectable(status) ? "hover:shadow-xl" : "cursor-not-allowed opacity-90"}
          `}
        >
          {day}
        </div>,
      )
    }

    return days
  }

  const renderMiniCalendar = (monthOffset: number, title: string) => {
    const miniDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1)
    const miniDaysInMonth = getDaysInMonth(miniDate)
    const miniFirstDay = getFirstDayOfMonth(miniDate)
    const miniDays = []

    for (let i = 0; i < miniFirstDay; i++) {
      miniDays.push(<div key={`mini-empty-${i}`} className="h-6 w-6"></div>)
    }

    for (let day = 1; day <= miniDaysInMonth; day++) {
      const status = getDateStatus(day)
      const getMiniStatusColor = (status: string) => {
        switch (status) {
          case "available":
            return "bg-emerald-500 text-white"
          case "booked":
            return "bg-red-500 text-white"
          case "waitlist":
            return "bg-amber-500 text-white"
          case "maintenance":
            return "bg-blue-500 text-white"
          default:
            return "bg-emerald-500 text-white"
        }
      }

      miniDays.push(
        <div
          key={day}
          className={`h-6 w-6 flex items-center justify-center text-xs font-medium rounded-sm transition-colors ${getMiniStatusColor(status)}`}
        >
          {day}
        </div>,
      )
    }

    return (
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-sm font-bold text-center mb-3 text-gray-700">{title}</h3>
        <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day} className="font-semibold text-gray-500 h-6 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{miniDays}</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-white-150 to-indigo-50">
      <Header />

      <div className="w-64 shrink-0 h-[calc(100vh-64px)] sticky top-16 hidden md:block bg-[#FDF8F1] text-[#78533F]">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col mt-16 overflow-hidden">
        <main className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <select
                value={acOption}
                onChange={(e) => setAcOption(e.target.value as "ac" | "non-ac")}
                className="w-full md:w-48 bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#78533F] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <option value="ac">AC</option>
                <option value="non-ac">Non-AC</option>
              </select>

              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full md:w-64 bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#78533F] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGoBack}
              className="w-full md:w-auto px-6 py-3 bg-white text-[#78533F] border border-gray-200 rounded-xl hover:bg-[#FDF8F1] hover:shadow-md transition-all duration-300 flex items-center justify-center"
            >
              Back
            </button>
          </div>

          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="hidden lg:block">{renderMiniCalendar(-1, new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1).toLocaleDateString("en-US", { month: "long" }))}</div>

            <button
              onClick={() => navigateMonth("prev")}
              disabled={isAnimating}
              className="hidden lg:flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="text-[#78533F] hover:text-indigo-600" />
            </button>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex justify-center items-center mb-6">
                  <h2
                    className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ${
                      isAnimating
                        ? animationDirection === "right"
                          ? "transform translate-x-8 opacity-0"
                          : "transform -translate-x-8 opacity-0"
                        : "transform translate-x-0 opacity-100"
                    }`}
                  >
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h2>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-[#796458] py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div
                  className={`grid grid-cols-7 gap-2 transition-all duration-300 ease-in-out ${
                    isAnimating
                      ? animationDirection === "right"
                        ? "transform translate-x-8 opacity-0"
                        : "transform -translate-x-8 opacity-0"
                      : "transform translate-x-0 opacity-100"
                  }`}
                >
                  {renderCalendar()}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateMonth("next")}
              disabled={isAnimating}
              className="hidden lg:flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <ChevronRight className="text-[#78533F] hover:text-indigo-600" />
            </button>

            <div className="hidden lg:block">{renderMiniCalendar(1, new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).toLocaleDateString("en-US", { month: "long" }))}</div>
          </div>

          {/* Display Time Slots for Selected Venue */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-[#78533F] mb-4">Available Time Slots for {getCurrentVenue()?.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getCurrentVenue()?.timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-4 rounded-lg shadow-md border ${getStatusColor(slot.status)} text-white cursor-pointer hover:shadow-lg transition-all duration-300`}
                >
                  <p className="font-medium">{slot.time}</p>
                  <p className="text-sm">Price: ${slot.price}</p>
                  <p className="text-sm">Status: {getStatusText(slot.status)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 shadow-sm"></div>
                  <span className="text-red-600 font-semibold">Booked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-sm"></div>
                  <span className="text-emerald-600 font-semibold">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500 shadow-sm"></div>
                  <span className="text-amber-600 font-semibold">Waiting List</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 shadow-sm"></div>
                  <span className="text-blue-600 font-semibold">Maintenance</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {tooltip && (
        <div
          ref={tooltipRef}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          className="fixed z-50 bg-gray-900 text-white p-4 rounded-xl shadow-2xl border border-gray-700 max-w-xs"
          style={{
            left: tooltip.x - 150,
            top: tooltip.y - 180,
            transform: "translateX(-50%)",
          }}
        >
          <div className="space-y-3">
            <div className="font-semibold text-center border-b border-gray-600 pb-2">
              Date: {tooltip.date} - {getStatusText(tooltip.status)}
            </div>
            {tooltip.bookingDetails && (
              <>
                <div className="text-sm">
                  <strong>Customer:</strong> {tooltip.bookingDetails.customerName}
                </div>
                <div className="text-sm">
                  <strong>Contact:</strong> {tooltip.bookingDetails.contactNumber}
                </div>
                <div className="text-sm">
                  <strong>Balance:</strong> ${tooltip.bookingDetails.balancePayable}
                </div>
                <div className="text-sm">
                  <strong>Booking ID:</strong> {tooltip.bookingDetails.bookingId}
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-600">
                  <button
                    onClick={() => handleEditDetails(tooltip.date)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                  >
                    Edit Details
                  </button>
                  {tooltip.status === "waitlist" ? (
                    <button
                      onClick={() => handleConfirmBooking(tooltip.date)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                    >
                      Confirm Booking
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCancelBooking(tooltip.date)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </>
            )}
            {tooltip.status === "maintenance" && !tooltip.bookingDetails && (
              <div className="text-sm text-center text-gray-300">This date is under maintenance</div>
            )}
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 animate-scaleIn">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Booking</h3>
            <p className="mb-4 text-gray-600">You have selected the following date:</p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-4 border border-blue-100">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Venue:</span>
                  <span className="text-gray-800">{getCurrentVenue()?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="text-gray-800">{acOption.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="text-gray-800">{selectedDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span
                    className={`px-2 py-1 text-sm rounded-full text-white ${getStatusColor(getDateStatus(selectedDate.getDate()))}`}
                  >
                    {getStatusText(getDateStatus(selectedDate.getDate()))}
                  </span>
                </div>
              </div>
            </div>

            <p className="mb-4 text-gray-600">Would you like to proceed with this booking?</p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelSlot}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSlot}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
              >
                Proceed to Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 animate-scaleIn">
            <h3 className="text-2xl font-semibold text-red-600 mb-4">Cancel Booking</h3>
            <p className="mb-4 text-gray-600">Are you sure you want to cancel the booking for date {cancellingDate}?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
              >
                No, Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Enter Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-gray-600">Please enter your password to confirm the cancellation:</p>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPassword("")
                }}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VenueBookingPage