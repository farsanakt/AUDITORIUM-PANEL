import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Clock,
  MapPin,
  CreditCard,
  Calendar,
  Building2,
} from "lucide-react"
import Header from "../../component/user/Header"
import Sidebar from "../../component/auditorium/Sidebar"
import { useNavigate } from "react-router-dom"
import { checkUserExists, existingAllVenues, existingBookings, userSingUpRequest } from "../../api/userApi"
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
  id: string
  label: string
  startTime: string
  endTime: string
  status: "available" | "booked"
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
  totalamount: string
  advAmnt: string
  images: string[]
  amenities: string[]
  cities: string[]
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
  // Time slot selection states
  const [showTimeSlotsModal, setShowTimeSlotsModal] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [selectedDateForSlots, setSelectedDateForSlots] = useState<Date | null>(null)

  // User authentication states
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [email, setEmail] = useState("")
  // NEW: State to control signup link visibility
  const [showSignupLink, setShowSignupLink] = useState(false)
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Booking confirmation states
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [userAddress, setUserAddress] = useState("")
  const [confirmedUserEmail, setConfirmedUserEmail] = useState("")
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)

  // Main component states
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedVenue, setSelectedVenue] = useState<string>("all")
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<"left" | "right">("right")
  const [venues, setVenues] = useState<Venue[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [emailError, setEmailError] = useState<string>("")

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

  const getTimeSlotsWithStatus = (venueId: string, date: Date): TimeSlot[] => {
    const venue = venues.find((v) => v._id === venueId)
    if (!venue || !venue.timeSlots) {
      return []
    }

    const dateString = date.toISOString().split("T")[0]
    const dateBookings = bookings.filter(
      (booking) => booking.bookeddate === dateString && booking.venueId === venueId && booking.status !== "cancelled",
    )

    return venue.timeSlots.map((slot) => {
      const isSlotBooked = dateBookings.some(
        (booking) =>
          booking.timeSlot.toLowerCase() === slot.id.toLowerCase() ||
          booking.timeSlot.toLowerCase() === slot.label.toLowerCase(),
      )

      return {
        ...slot,
        status: isSlotBooked ? "booked" : "available",
      }
    })
  }

  const getDateStatus = (date: number, venueId?: string, targetMonth?: Date): "available" | "booked" | "partial" => {
    if (venueId === "all") {
      const dayBookings = getBookingsForDate(date, venueId, targetMonth)
      return dayBookings.length > 0 ? "partial" : "available"
    } else {
      const venue = venues.find((v) => v._id === venueId)
      if (!venue) return "available"

      const monthToUse = targetMonth || currentMonth
      const targetDate = new Date(monthToUse.getFullYear(), monthToUse.getMonth(), date)
      const dateString = targetDate.toISOString().split("T")[0]

      const dateBookings = bookings.filter(
        (booking) => booking.bookeddate === dateString && booking.venueId === venueId && booking.status !== "cancelled",
      )

      const totalSlots = venue.timeSlots?.length || 0
      const bookedSlots = dateBookings.length

      if (totalSlots === 0) return "available"
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
    if (isSelectable(status) && selectedVenue !== "all") {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date)
      setSelectedDate(newDate)
      setSelectedDateForSlots(newDate)
      setShowTimeSlotsModal(true)
    } else if (selectedVenue === "all") {
      alert("Please select a specific venue to view available time slots.")
    }
  }

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (timeSlot.status === "available") {
      setSelectedTimeSlot(timeSlot)
      setShowTimeSlotsModal(false)
      setShowEmailModal(true)
      // NEW: Reset signup link visibility when opening email modal
      setShowSignupLink(false)
    }
  }

  const handleEditBooking = (bookingId: string) => {
    console.log(`Edit booking: ${bookingId}`)
    setTooltip(null)
  }

  const handleCancelBooking = (bookingId: string) => {
    console.log(`Cancel booking: ${bookingId}`)
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

  const handleEmailSubmit = async () => {
    if (email.trim()) {
      try {
        const response = await checkUserExists(email)
        if (response.data.success) {
          setConfirmedUserEmail(email)
          setShowEmailModal(false)
          setShowBookingModal(true)
          // NEW: Ensure signup link is hidden when user exists
          setShowSignupLink(false)
        } else {
          setEmailError(response.data.message || "User not found.")
          // NEW: Show signup link only if user not found
          setShowSignupLink(true)
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        setEmailError("Something went wrong. Please try again.")
        // NEW: Show signup link on error
        setShowSignupLink(true)
      }
    } else {
      setEmailError("Please enter a valid email.")
    }
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
        console.log("Signup response:", response)

        if (response.success === true || response.data) {
          console.log("User registered successfully, going to booking modal")
          setConfirmedUserEmail(email)
          setShowSignupModal(false)
          setShowBookingModal(true)
          // Clear signup data
          setSignupData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          })
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

  const handleBookingConfirm = async () => {
    if (!userAddress.trim()) {
      alert("Please enter your address")
      return
    }

    setIsSubmittingBooking(true)

    const currentVenue = getCurrentVenue()
    const bookingData = {
      userEmail: confirmedUserEmail,
      venueId: selectedVenue,
      venueName: currentVenue?.name,
      selectedDate: selectedDate.toISOString().split("T")[0],
      selectedTimeSlot: selectedTimeSlot?.label,
      timeSlotId: selectedTimeSlot?.id,
      totalAmount: currentVenue?.totalamount,
      advanceAmount: currentVenue?.advAmnt,
      address: userAddress,
    }

    try {
      console.log("Submitting booking data:", bookingData)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      navigate("/auditorium/payment", { state: bookingData })
    } catch (error) {
      console.error("Booking submission error:", error)
      alert("Failed to create booking. Please try again.")
    } finally {
      setIsSubmittingBooking(false)
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
      const status = getDateStatus(day, selectedVenue, miniDate)

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
                    key={slot.id || index}
                    className="p-4 rounded-md shadow-sm border border-gray-200 bg-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{slot.label}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          slot.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {slot.status === "available" ? "Available" : "Booked"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {slot.startTime} - {slot.endTime}
                    </div>
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

      {/* Time Slots Modal */}
      {showTimeSlotsModal && selectedDateForSlots && selectedVenue !== "all" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 p-6 border border-gray-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Select Time Slot</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedDateForSlots.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  - {getCurrentVenue()?.name}
                </p>
              </div>
              <button onClick={() => setShowTimeSlotsModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getCurrentVenue() &&
                getTimeSlotsWithStatus(selectedVenue, selectedDateForSlots).map((slot, index) => {
                  const isAvailable = slot.status === "available"
                  return (
                    <div
                      key={slot.id || index}
                      onClick={() => isAvailable && handleTimeSlotSelect(slot)}
                      className={`
                      p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer transform hover:scale-105
                      ${
                        isAvailable
                          ? "border-green-200 bg-green-50 hover:border-green-400 hover:bg-green-100 hover:shadow-md"
                          : "border-red-200 bg-red-50 cursor-not-allowed opacity-60"
                      }
                    `}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-gray-600" />
                          <span className="font-bold text-lg text-gray-800">{slot.label}</span>
                        </div>
                        <span
                          className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      `}
                        >
                          {isAvailable ? "Available" : "Booked"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600 font-medium">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      {isAvailable && (
                        <div className="text-center">
                          <span className="text-sm text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full">
                            Click to select
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>

            {getCurrentVenue() &&
              getTimeSlotsWithStatus(selectedVenue, selectedDateForSlots).every((slot) => slot.status === "booked") && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-gray-600 text-sm">All time slots are booked for this date</p>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 animate-fade-in overflow-hidden border border-[#b09d94]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-[#FDF8F1]">
              <div>
                <h2 className="text-xl font-bold text-[#78533F]">Confirm Your Booking</h2>
                <p className="text-sm text-[#876553] mt-1">Please review your booking details before proceeding.</p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 rounded-full hover:bg-[#f7e7dc] text-[#876553] hover:text-[#78533F] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Booking Details */}
              <div className="bg-[#FDF8F1] border border-[#b09d94] rounded-lg p-5 shadow-sm">
                <h3 className="text-base font-semibold text-[#78533F] flex items-center mb-4">
                  <Building2 className="h-4 w-4 mr-2 text-[#b09d94]" />
                  Booking Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Left */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 mt-1 text-[#b09d94]" />
                      <div>
                        <p className="text-xs text-[#876553] uppercase tracking-wide">Email</p>
                        <p className="text-sm font-medium text-[#3C3A39]">{confirmedUserEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 mt-1 text-[#b09d94]" />
                      <div>
                        <p className="text-xs text-[#876553] uppercase tracking-wide">Venue</p>
                        <p className="text-sm font-medium text-[#3C3A39]">{getCurrentVenue()?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 mt-1 text-[#b09d94]" />
                      <div>
                        <p className="text-xs text-[#876553] uppercase tracking-wide">Date</p>
                        <p className="text-sm font-medium text-[#3C3A39]">
                          {selectedDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 mt-1 text-[#b09d94]" />
                      <div>
                        <p className="text-xs text-[#876553] uppercase tracking-wide">Time Slot</p>
                        <p className="text-sm font-medium text-[#3C3A39] capitalize">{selectedTimeSlot?.label}</p>
                        <p className="text-xs text-[#876553]">
                          {selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-[#b09d94] rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-[#876553]">Total Amount</span>
                        <span className="text-sm font-semibold text-[#3C3A39]">₹{getCurrentVenue()?.totalamount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#876553]">Advance Amount</span>
                        <span className="text-sm font-semibold text-[#ED695A]">₹{getCurrentVenue()?.advAmnt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-[#78533F] mb-2">
                  <MapPin className="inline h-4 w-4 mr-1 text-[#b09d94]" />
                  Complete Address
                </label>
                <textarea
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  placeholder="Enter your complete address including city, state, and postal code"
                  rows={3}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm placeholder-[#b09d94] resize-none transition"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 border-t border-[#b09d94] pt-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-[#b09d94] text-[#78533F] rounded-md hover:bg-[#f7e7dc] transition text-sm font-medium"
                  disabled={isSubmittingBooking}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingConfirm}
                  disabled={isSubmittingBooking || !userAddress.trim()}
                  className="flex-1 px-4 py-2 bg-[#ED695A] text-white rounded-md hover:bg-[#d85c4e] transition text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingBooking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-[#FDF8F1] rounded-lg shadow-lg max-w-md w-full mx-4 p-6 border border-gray-200 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#78533F]">Enter Your Email</h3>
              <button
                onClick={() => {
                  setShowEmailModal(false)
                  setEmailError("")
                  // NEW: Reset signup link visibility on modal close
                  setShowSignupLink(false)
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Booking Details:</p>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Date:</span> {selectedDate.toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Time Slot:</span> {selectedTimeSlot?.label}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Time:</span> {selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Venue:</span> {getCurrentVenue()?.name}
                </p>
              </div>
            </div>

            {/* NEW: Added mandatory email field message */}
            <p className="mb-4 text-gray-600 text-sm">
              Please enter your email to proceed with the booking. This field is mandatory for future processing and mailing activities.
            </p>

            <div className="relative mb-2">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400   h-4 w-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError("")
                  
                  setShowSignupLink(false)
                }}
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#b09d94] border-opacity-50 rounded-md focus:outline-none focus:border-[#ED695A] focus:ring-1 focus:ring-[#ED695A] focus:ring-opacity-20 text-sm"
              />
              {emailError && (
                <p className="text-red-600 text-sm mt-1 px-1">{emailError}</p>
              )}
            </div>

            
            {showSignupLink && (
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">New Coustomer?</p>
                <button
                  onClick={() => {
                    setShowEmailModal(false)
                    setEmailError("")
                    setShowSignupModal(true)
                  }}
                  className="text-[#ED695A] font-semibold hover:underline hover:text-[#d85c4e]"
                >
                  Sign up here
                </button>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEmailModal(false)
                  setEmailError("")
                  // NEW: Reset signup link visibility on cancel
                  setShowSignupLink(false)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-300 text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSubmit}
                className="px-4 py-2 bg-[#ED695A] text-white rounded-md hover:bg-[#fcaca4] transition-all duration-300 text-sm"
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
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Booking Details:</p>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Date:</span> {selectedDate.toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Time Slot:</span> {selectedTimeSlot?.label}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Time:</span> {selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Venue:</span> {getCurrentVenue()?.name}
                </p>
              </div>
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

      {/* Tooltip */}
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
    </div>
  )
}

export default VenueBookingPage