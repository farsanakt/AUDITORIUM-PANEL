import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, X, Eye, EyeOff, Mail, User, Lock } from "lucide-react"
import Header from "../../component/user/Header"
import Sidebar from "../../component/auditorium/Sidebar"
import { useNavigate } from "react-router-dom"
import { existingAllVenues, existingBookings, userSingUpRequest } from "../../api/userApi"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"


const signupUser = async (userData: any) => {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    return await response.json()
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}

interface TimeSlot {
  _id?: string
  time: string
  price: number
  isBooked?: boolean
}

interface Venue {
  _id: string
  name: string
  address: string
  timeSlots: TimeSlot[]
  seatingCapacity: string
  acType: string
  phone: string
  email: string
  audiUserId: string
}

interface Booking {
  _id: string
  userEmail: string
  venueId: string
  auditoriumId: string
  amount: string
  advanceAmount: string
  bookeddate: string 
  timeSlot: string
  paymentStatus: string
  status: string
  venueName: string
}

interface TooltipData {
  x: number
  y: number
  date: number
  status: string
  bookingDetails?: Booking[]
}

const VenueBookingPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedVenue, setSelectedVenue] = useState<string>("all")
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<"left" | "right">("right")

  
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [email, setEmail] = useState("")
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

 
  const [venues, setVenues] = useState<Venue[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const hideTimeoutRef = useRef<number | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const fetchAllVenues = async () => {
    try {
      if (currentUser) {
        const response = await existingAllVenues(currentUser.id)
        console.log("Venues response:", response.data)
        if (response.data && Array.isArray(response.data)) {
          setVenues(response.data)
          console.log(
            "Venues set:",
            response.data.map((v) => ({ id: v._id, name: v.name })),
          )
        }
      }
    } catch (error) {
      console.error("Error fetching venues:", error)
    }
  }

  const fetchAllBookings = async () => {
    try {
      if (currentUser) {
        const response = await existingBookings(currentUser.id)
        if (response.data && Array.isArray(response.data)) {
          setBookings(response.data)
          response.data.forEach((booking) => {
          })
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllVenues()
    fetchAllBookings()
  }, [currentUser])

  
  const getBookingsForDate = (date: number, venueId?: string, targetMonth?: Date): Booking[] => {
    const monthToUse = targetMonth || currentMonth
    const targetDate = new Date(monthToUse.getFullYear(), monthToUse.getMonth(), date)
    const dateString = targetDate.toISOString().split("T")[0] 

    return bookings.filter((booking) => {
      const matchesDate = booking.bookeddate === dateString
      const matchesVenue = !venueId || venueId === "all" || booking.venueId === venueId
      return matchesDate && matchesVenue && booking.status !== "cancelled"
    })
  }

  
  const getDateStatus = (date: number, venueId?: string, targetMonth?: Date): "available" | "booked" | "partial" => {
    const dayBookings = getBookingsForDate(date, venueId, targetMonth)

    if (dayBookings.length === 0) return "available"

    if (venueId === "all") {
      return dayBookings.length > 0 ? "partial" : "available"
    } else {
      // For specific venue, check if all time slots are booked
      const venue = venues.find((v) => v._id === venueId)
      if (!venue) return "available"

      const totalSlots = venue.timeSlots?.length || 4 // Default to 4 if no timeSlots
      const bookedSlots = dayBookings.length

      if (bookedSlots >= totalSlots) return "booked"
      if (bookedSlots > 0) return "partial"
      return "available"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-600 hover:bg-green-700"
      case "booked":
        return "bg-red-600 hover:bg-red-700"
      case "partial":
        return "bg-yellow-600 hover:bg-yellow-700"
      default:
        return "bg-green-600 hover:bg-green-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available"
      case "booked":
        return "Fully Booked"
      case "partial":
        return "Partially Booked"
      default:
        return "Available"
    }
  }

  const isSelectable = (status: string) => {
    return status === "available" || status === "partial"
  }

  const handleDateClick = (date: number) => {
    const status = getDateStatus(date, selectedVenue)
    if (isSelectable(status)) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date)
      setSelectedDate(newDate)
      setShowEmailModal(true)
    }
  }

  const handleEditBooking = (bookingId: string) => {
    console.log(`Edit booking: ${bookingId}`)
    // Implement edit booking logic
    setTooltip(null)
  }

  const handleCancelBooking = (bookingId: string) => {
    console.log(`Cancel booking: ${bookingId}`)
    // Implement cancel booking logic
    setTooltip(null)
  }

  const handleMouseEnter = (event: React.MouseEvent, date: number) => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }

    const status = getDateStatus(date, selectedVenue, currentMonth)
    const dayBookings = getBookingsForDate(date, selectedVenue, currentMonth)

    if (status !== "available" || dayBookings.length > 0) {
      const rect = event.currentTarget.getBoundingClientRect()
      setTooltip({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        date,
        status,
        bookingDetails: dayBookings,
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

  const handleEmailSubmit = () => {
    if (email.trim()) {
      // Check if user exists (you can implement this check)
      setSignupData((prev) => ({ ...prev, email }))
      setShowEmailModal(false)
      setShowSignupModal(true)
    }
  }

  const getCurrentVenue = () => {
    if (selectedVenue === "all") return null
    return venues.find((venue) => venue._id === selectedVenue)
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

  const handleSignupSubmit = async () => {
  if (signupData.password !== signupData.confirmPassword) {
    alert("Passwords don't match!")
    return
  }

  const { firstName, lastName, email, password } = signupData

  if (firstName && lastName && email && password) {
    try {
      const response = await userSingUpRequest(signupData) 

      if (response.success) {
        console.log("User registered successfully:", response)

        
        navigate("/bookings", { state: { email } })
      } else {
        alert(response.message || "Signup failed. Please try again.")
      }
    } catch (error) {
      console.error("Signup error:", error)
      alert("An error occurred during signup. Please try again.")
    }
  } else {
    alert("Please fill all fields!")
  }
}


  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const status = getDateStatus(day, selectedVenue, currentMonth)
      const dayBookings = getBookingsForDate(day, selectedVenue, currentMonth)

      // Debug logging
      if (dayBookings.length > 0) {
        console.log(`Day ${day}: ${dayBookings.length} bookings, status: ${status}`)
      }

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
            h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer
            transition-all duration-300 ease-in-out transform hover:scale-110
            ${getStatusColor(status)} text-white shadow-md hover:shadow-lg
            ${isSelected ? "ring-2 ring-offset-2 ring-gray-900" : ""}
            ${isSelectable(status) ? "hover:shadow-xl" : "cursor-not-allowed opacity-80"}
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
      const status = getDateStatus(day, selectedVenue, miniDate) // Pass miniDate here
      const getMiniStatusColor = (status: string) => {
        switch (status) {
          case "available":
            return "bg-green-600 text-white"
          case "booked":
            return "bg-red-600 text-white"
          case "partial":
            return "bg-yellow-600 text-white"
          default:
            return "bg-green-600 text-white"
        }
      }

      miniDays.push(
        <div
          key={day}
          className={`h-6 w-6 flex items-center justify-center text-xs font-medium rounded-full transition-colors ${getMiniStatusColor(status)}`}
        >
          {day}
        </div>,
      )
    }

    return (
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-xs font-semibold text-center mb-2 text-gray-700">{title}</h3>
        <div className="grid grid-cols-7 gap-1 text-xs text-center mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div
              key={`mini-day-${index}-${monthOffset}`}
              className="font-semibold text-gray-500 h-5 flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{miniDays}</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FDF8F1] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading venues and bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#FDF8F1]">
      <Header />
      <div className="w-64 shrink-0 h-[calc(100vh-64px)] sticky top-16 hidden md:block bg-[#FDF8F1] text-[#4A3728]">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col mt-16 overflow-auto">
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full md:w-64 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <option value="all">All Venues</option>
                {venues.map((venue) => (
                  <option key={venue._id} value={venue._id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="hidden lg:block">
              {renderMiniCalendar(
                -1,
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1).toLocaleDateString("en-US", {
                  month: "long",
                }),
              )}
            </div>
            <button
              onClick={() => navigateMonth("prev")}
              disabled={isAnimating}
              className="hidden lg:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="text-gray-700 hover:text-gray-900 w-5 h-5" />
            </button>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-5">
                <div className="flex justify-center items-center mb-4">
                  <h2
                    className={`text-2xl font-semibold text-gray-800 transition-all duration-300 ${
                      isAnimating
                        ? animationDirection === "right"
                          ? "transform translate-x-6 opacity-0"
                          : "transform -translate-x-6 opacity-0"
                        : "transform translate-x-0 opacity-100"
                    }`}
                  >
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h2>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div key={`main-day-${index}`} className="text-center text-sm font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div
                  className={`grid grid-cols-7 gap-2 transition-all duration-300 ease-in-out ${
                    isAnimating
                      ? animationDirection === "right"
                        ? "transform translate-x-6 opacity-0"
                        : "transform -translate-x-6 opacity-0"
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
              className="hidden lg:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300 disabled:opacity-50"
            >
              <ChevronRight className="text-gray-700 hover:text-gray-900 w-5 h-5" />
            </button>
            <div className="hidden lg:block">
              {renderMiniCalendar(
                1,
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).toLocaleDateString("en-US", {
                  month: "long",
                }),
              )}
            </div>
          </div>

          {/* Display Time Slots for Selected Venue */}
          {getCurrentVenue() && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Available Time Slots for {getCurrentVenue()?.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {getCurrentVenue()?.timeSlots.map((slot, index) => (
                  <div
                    key={slot._id || index}
                    className="p-4 rounded-md shadow-sm border border-gray-200 bg-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <p className="font-medium text-sm text-gray-800">{slot.time}</p>
                    <p className="text-xs text-gray-600">Price: ₹{slot.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-600 shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Fully Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-600 shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-600 shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Partially Booked</span>
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
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 max-w-md animate-fade-in"
          style={{
            left: tooltip.x - 200,
            top: tooltip.y - 220,
            transform: "translateX(-50%)",
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), tooltip.date).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tooltip.status === "available"
                    ? "bg-green-100 text-green-800"
                    : tooltip.status === "booked"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {getStatusText(tooltip.status)}
              </span>
            </div>

            {tooltip.bookingDetails && tooltip.bookingDetails.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {tooltip.bookingDetails.map((booking, index) => (
                  <div key={booking._id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Venue</label>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{booking.venueName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Time Slot</label>
                        <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">{booking.timeSlot}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</label>
                        <p className="text-sm text-gray-700 mt-1">{booking.userEmail}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</label>
                        <p className="text-sm font-semibold text-gray-900 mt-1">₹{booking.amount}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment</label>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            booking.paymentStatus === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleEditBooking(booking._id)}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">This date is available for booking</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 border border-gray-200 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Enter Your Email</h3>
              <button onClick={() => setShowEmailModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <p className="mb-4 text-gray-600 text-sm">
              Please enter your email to proceed with the booking for {selectedDate.toLocaleDateString()}
            </p>
            <div className="relative mb-4">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">New user?</p>
              <button
                onClick={() => {
                  setShowEmailModal(false)
                  setShowSignupModal(true)
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Sign up here
              </button>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-300 text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSubmit}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all duration-300 text-sm"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 border border-gray-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Create Account</h3>
              <button onClick={() => setShowSignupModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={signupData.firstName}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, firstName: e.target.value }))}
                    placeholder="First Name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={signupData.lastName}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Last Name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  />
                </div>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={signupData.password}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSignupModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-300 text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSignupSubmit}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all duration-300 text-sm"
              >
                Create Account & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VenueBookingPage
