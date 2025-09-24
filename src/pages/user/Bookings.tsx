"use client"

import type React from "react"
import { useEffect, useState, Component, type ErrorInfo } from "react"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Tag,
  Gift,
  Copy,
  Check,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { singleVenueDetails, createBooking, existingBkngs, fetchAllExistingOffer } from "../../api/userApi"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import Header from "../../component/user/Header"
import Lines from "../../assets/vector.png"
import Homeicon from "../../assets/homeIcon.png"

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-[#3C3A39]">
          <h2 className="text-xl font-bold text-[#78533F]">Something went wrong!</h2>
          <p className="text-[#3C3A39]">{ "An unexpected error occurred"}</p>
          <button
            className="mt-4 bg-[#ED695A] hover:bg-[#d85c4e] text-white py-2 px-4 rounded-xl shadow-lg transition-all transform hover:scale-105 text-sm"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

interface Offer {
  _id: string
  userId: string
  offerCode: string
  discountType: "percentage" | "fixed"
  discountValue: number
  validFrom: string
  validTo: string
  isActive: boolean
  description?: string
  minAmount?: number
}

interface BookingFormData {
  userEmail: string
  venueName: string
  bookingDate: string
  timeSlot: string
  totalAmount: string
  advanceAmount: string
  venueId: string
  address: string
  paymentType: "full" | "advance"
  paidAmount: string
  balanceAmount: string
  exactBookingTime?: string
  couponCode?: string
}

interface TimeSlot {
  id: string
  label: string
  startTime: string
  endTime: string
  status: string
}

interface Venue {
  name: string
  address: string
  acType: string
  timeSlots: TimeSlot[]
  tariff: { [key: string]: string }
  bookedDates?: string[]
  eventTypes?: string[]
  audiUserId?: string
  totalamount?: string
  advAmnt?: string
  advamnt?: string
  offer?: Offer
}

interface Booking {
  bookeddate: string
  timeSlot: string
  status: string
}

const Bookings: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState<"calendar" | "form" | "payment" | "success">("calendar")
  const [acOption, setAcOption] = useState("")
  const [venueTime, setVenueTime] = useState("")
  const [eventType, setEventType] = useState("")
  const [venue, setVenue] = useState<Venue | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState<string | null>(null)
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null)
  const [showOffers, setShowOffers] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [originalAmounts, setOriginalAmounts] = useState({
    total: "",
    advance: "",
  })
  const [formData, setFormData] = useState<BookingFormData>({
    userEmail: "",
    venueName: "",
    bookingDate: "",
    timeSlot: "",
    totalAmount: "",
    advanceAmount: "",
    venueId: id || "",
    address: "",
    paymentType: "advance",
    paidAmount: "",
    balanceAmount: "",
    exactBookingTime: "",
    couponCode: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const navigate = useNavigate()
  const { currentUser } = useSelector((state: RootState) => state.auth)

  const monthNames = [
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

  const formatDateForBackend = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const formatExactTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getFormattedPrice = (amount: string | undefined, showOriginal = false) => {
    if (!amount || isNaN(Number.parseFloat(amount))) {
      return <span>Price not available</span>
    }

    const price = Number.parseFloat(amount)
    const formattedPrice = `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    if (!appliedOffer || showOriginal) {
      return <span>{formattedPrice}</span>
    }

    const originalPrice = Number.parseFloat(showOriginal ? amount : originalAmounts.total || amount)
    const originalFormatted = `₹${originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="line-through text-gray-500 text-sm">{originalFormatted}</span>
          <span className="text-green-600 font-semibold">{formattedPrice}</span>
        </div>
        <span className="text-xs text-green-600">
          ({appliedOffer.discountValue}
          {appliedOffer.discountType === "percentage" ? "%" : "₹"} off with {appliedOffer.offerCode})
        </span>
      </div>
    )
  }

  const calculateDiscountedAmount = (originalAmount: string, offer: Offer): number => {
    const amount = Number.parseFloat(originalAmount)
    if (offer.discountType === "percentage") {
      return amount * (1 - offer.discountValue / 100)
    } else {
      return Math.max(0, amount - offer.discountValue)
    }
  }

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const applyCouponCode = (offerToApply?: Offer) => {
    setCouponError(null)
    const codeToApply = offerToApply?.offerCode || couponCode

    if (!codeToApply) {
      // Remove applied offer
      setAppliedOffer(null)
      setFormData((prev) => ({
        ...prev,
        couponCode: "",
        totalAmount: originalAmounts.total,
        advanceAmount: originalAmounts.advance,
        paidAmount: prev.paymentType === "full" ? originalAmounts.total : originalAmounts.advance,
        balanceAmount:
          prev.paymentType === "full"
            ? "0"
            : (Number.parseFloat(originalAmounts.total) - Number.parseFloat(originalAmounts.advance)).toString(),
      }))
      setCouponCode("")
      return
    }

    const matchedOffer =
      offerToApply ||
      offers.find(
        (offer) =>
          offer.offerCode.toLowerCase() === codeToApply.toLowerCase() &&
          offer.userId === venue?.audiUserId &&
          offer.isActive,
      )

    if (!matchedOffer) {
      setCouponError("Invalid or inactive coupon code")
      setAppliedOffer(null)
      return
    }

    // Check minimum amount if specified
    if (matchedOffer.minAmount && Number.parseFloat(originalAmounts.total) < matchedOffer.minAmount) {
      setCouponError(`Minimum order amount should be ₹${matchedOffer.minAmount}`)
      return
    }

    const discountedTotal = calculateDiscountedAmount(originalAmounts.total, matchedOffer)
    const discountedAdvance = calculateDiscountedAmount(originalAmounts.advance, matchedOffer)

    setAppliedOffer(matchedOffer)
    setCouponCode(matchedOffer.offerCode)
    setFormData((prev) => ({
      ...prev,
      couponCode: matchedOffer.offerCode,
      totalAmount: discountedTotal.toString(),
      advanceAmount: discountedAdvance.toString(),
      paidAmount: prev.paymentType === "full" ? discountedTotal.toString() : discountedAdvance.toString(),
      balanceAmount: prev.paymentType === "full" ? "0" : (discountedTotal - discountedAdvance).toString(),
    }))
    setShowOffers(false)
  }

  const fetchVenueData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [venueResponse, offerResponse] = await Promise.all([singleVenueDetails(id!), fetchAllExistingOffer()])

      if (venueResponse.data) {
        const venueData = venueResponse.data
        const eventTypes = Object.keys(venueData.tariff || {}).filter((key) => venueData.tariff[key] === "t")

        // Store original amounts
        const originalTotal = venueData.totalamount || ""
        const originalAdvance = venueData.advAmnt || venueData.advamnt || ""

        setOriginalAmounts({
          total: originalTotal,
          advance: originalAdvance,
        })

        setVenue({
          ...venueData,
          eventTypes,
        })

        // Filter offers for this venue
        const venueOffers = offerResponse.data.filter(
          (offer: Offer) => offer.userId === venueData.audiUserId && offer.isActive,
        )
        setOffers(venueOffers)

        setFormData((prev) => ({
          ...prev,
          userEmail: currentUser?.email || "",
          venueName: venueData.name || "",
          totalAmount: originalTotal,
          advanceAmount: originalAdvance,
          venueId: id || "",
          paidAmount: originalAdvance,
          balanceAmount:
            originalTotal && originalAdvance
              ? (Number.parseFloat(originalTotal) - Number.parseFloat(originalAdvance)).toString()
              : "",
        }))
      } else {
        setError("No venue data received")
      }
    } catch (error) {
      console.error("Error fetching venue data or offers:", error)
      setError("Failed to load venue data")
    } finally {
      setLoading(false)
    }
  }

  const fetchExistingBookings = async () => {
    try {
      const response = await existingBkngs(id!)
      if (response.data) {
        const bookingData = Array.isArray(response.data) ? response.data : [response.data]
        setBookings(bookingData)
      } else {
        setBookings([])
      }
    } catch (error) {
      console.error("Error fetching existing bookings:", error)
      setBookings([])
    }
  }

  useEffect(() => {
    if (id) {
      fetchVenueData()
      fetchExistingBookings()
    } else {
      setError("Invalid venue ID")
      setLoading(false)
    }
  }, [id])

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0)
    const prevMonthDays = getDaysInMonth(prevMonth)

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i),
        isCurrentMonth: false,
      })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      days.push({
        day,
        date,
        isCurrentMonth: true,
      })
    }

    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day),
        isCurrentMonth: false,
      })
    }

    return days
  }

  const getTimeSlotStatus = (date: Date) => {
    const dateString = formatDateForBackend(date)
    const bookedSlots = bookings
      .filter((booking) => booking.bookeddate === dateString && booking.status !== "cancelled")
      .map((booking) => booking.timeSlot)

    return (
      venue?.timeSlots?.map((slot) => ({
        ...slot,
        isBooked: bookedSlots.includes(slot.id),
      })) || []
    )
  }

  const getDateStatus = (date: Date | null) => {
    if (!date) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isPast = date < today
    const dateString = formatDateForBackend(date)
    const bookedSlots = bookings.filter(
      (booking) => booking.bookeddate === dateString && booking.status !== "cancelled",
    )

    if (isPast) return "past"

    const totalSlots = venue?.timeSlots?.length || 0
    const bookedSlotsCount = bookedSlots.length

    if (bookedSlotsCount === 0) return "available"
    if (bookedSlotsCount >= totalSlots) return "booked"
    return "partial"
  }

  const getDateClassName = (date: Date | null, isCurrentMonth: boolean) => {
    const baseClass =
      "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-base font-medium transition-all relative group"

    if (!isCurrentMonth || !date) {
      return `${baseClass} text-gray-400 cursor-not-allowed`
    }

    const status = getDateStatus(date)
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

    if (status === "past") {
      return `${baseClass} bg-gray-100 text-gray-400 cursor-not-allowed`
    }
    if (status === "booked") {
      return `${baseClass} bg-red-500 text-white cursor-not-allowed`
    }
    if (status === "partial") {
      return isSelected
        ? `${baseClass} bg-[#ED695A] text-white cursor-pointer hover:scale-105`
        : `${baseClass} bg-yellow-400 text-yellow-900 cursor-pointer hover:bg-yellow-500 hover:scale-105`
    }

    return isSelected
      ? `${baseClass} bg-[#ED695A] text-white cursor-pointer hover:scale-105`
      : `${baseClass} bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 hover:scale-105`
  }

  const getTooltipContent = (date: Date) => {
    const slots = getTimeSlotStatus(date)
    return (
      <div className="absolute z-20 bg-white p-3 rounded-lg shadow-lg border-2 border-[#b09d94] bottom-full mb-2 text-xs sm:text-sm max-w-[90vw] sm:max-w-xs bg-opacity-95 transform -translate-x-1/2 left-1/2">
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        <p className="font-semibold text-[#78533F] mb-2">Time Slots:</p>
        {slots.length > 0 ? (
          slots.map((slot) => (
            <div key={slot.id} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${slot.isBooked ? "bg-red-500" : "bg-green-500"}`}
              ></div>
              <p className={slot.isBooked ? "text-red-600" : "text-green-600"}>
                {slot.label}: {slot.isBooked ? "Booked" : "Available"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-[#3C3A39]">No time slots available</p>
        )}
      </div>
    )
  }

  const isSlotBooked = (date: Date | null, slotId: string) => {
    if (!date) return false
    const dateString = formatDateForBackend(date)
    return bookings.some(
      (booking) => booking.bookeddate === dateString && booking.timeSlot === slotId && booking.status !== "cancelled",
    )
  }

  const handleDateClick = (date: Date | null) => {
    if (date && ["available", "partial"].includes(getDateStatus(date) || "")) {
      setSelectedDate(date)
      setFormData((prev) => ({
        ...prev,
        bookingDate: formatDateForBackend(date),
      }))
      setVenueTime("")
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(direction === "prev" ? prev.getMonth() - 1 : prev.getMonth() + 1)
      return newDate
    })
  }

  const navigateYear = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      const currentYear = new Date().getFullYear()
      const newYear = direction === "prev" ? prev.getFullYear() - 1 : prev.getFullYear() + 1

      if (newYear >= currentYear) {
        newDate.setFullYear(newYear)
      }
      return newDate
    })
  }

  const handleConfirmBooking = () => {
    if (!selectedDate || !acOption || !venueTime || !eventType) {
      alert("Please select a date and fill in all booking options")
      return
    }
    if (isSlotBooked(selectedDate, venueTime)) {
      alert("This time slot is already booked. Please select another slot.")
      return
    }
    setShowModal(true)
    setCurrentPage("form")
    setFormData((prev) => ({
      ...prev,
      exactBookingTime: formatExactTime(new Date()),
    }))
  }

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePaymentTypeChange = (type: "full" | "advance") => {
    setFormData((prev) => {
      const total = Number.parseFloat(prev.totalAmount || "0")
      const advance = Number.parseFloat(prev.advanceAmount || "0")
      return {
        ...prev,
        paymentType: type,
        paidAmount: type === "full" ? prev.totalAmount : prev.advanceAmount,
        balanceAmount: type === "full" ? "0" : (total - advance).toString(),
      }
    })
  }

  const handleFormSubmit = async () => {
    if (!formData.userEmail || !formData.address) {
      alert("Please fill in all required fields")
      return
    }
    try {
      setCurrentPage("payment")
    } catch (error) {
      alert("Error submitting booking. Please try again.")
      console.error("Booking submission error:", error)
    }
  }

  const handlePaymentSubmit = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method")
      return
    }
    if (isSlotBooked(selectedDate, formData.timeSlot)) {
      alert("This time slot is already booked. Please select another slot.")
      return
    }
    try {
      const bookingData = {
        venueName: formData.venueName,
        venueId: formData.venueId,
        totalAmount: formData.totalAmount, // This will be the discounted amount if offer applied
        paidAmount: formData.paidAmount, // This will be the discounted amount if offer applied
        balanceAmount: formData.balanceAmount, // This will be the discounted balance if offer applied
        userEmail: formData.userEmail,
        bookedDate: formData.bookingDate,
        timeSlot: formData.timeSlot,
        address: formData.address,
        exactBookingTime: formData.exactBookingTime,
        eventType: eventType,
        couponCode: formData.couponCode,
        originalTotalAmount: originalAmounts.total, // Send original amounts for reference
        originalAdvanceAmount: originalAmounts.advance,
        discountApplied: appliedOffer
          ? {
              code: appliedOffer.offerCode,
              type: appliedOffer.discountType,
              value: appliedOffer.discountValue,
            }
          : null,
      }

      console.log("Booking data sent to backend:", JSON.stringify(bookingData, null, 2))
      const response = await createBooking(bookingData)
      console.log("Booking response:", JSON.stringify(response, null, 2))
      await fetchExistingBookings()
      setCurrentPage("success")
    } catch (error) {
      alert("Error processing payment. Please try again.")
      console.error("Payment error:", error)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setCurrentPage("calendar")
    setSelectedPaymentMethod("")
    setVenueTime("")
    setCouponCode("")
    setCouponError(null)
    setAppliedOffer(null)
    setShowOffers(false)
    // Reset to original amounts
    setFormData((prev) => ({
      ...prev,
      couponCode: "",
      totalAmount: originalAmounts.total,
      advanceAmount: originalAmounts.advance,
      paidAmount: prev.paymentType === "full" ? originalAmounts.total : originalAmounts.advance,
      balanceAmount:
        prev.paymentType === "full"
          ? "0"
          : (Number.parseFloat(originalAmounts.total) - Number.parseFloat(originalAmounts.advance)).toString(),
    }))
  }

  if (loading) {
    return <div className="p-4 text-center text-[#3C3A39] text-sm sm:text-base">Loading...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-[#78533F]">Error</h2>
        <p className="text-[#3C3A39] text-sm sm:text-base">{error}</p>
        <button
          className="mt-4 bg-[#ED695A] hover:bg-[#d85c4e] text-white py-2 px-4 rounded-xl shadow-lg transition-all transform hover:scale-105 text-sm"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  const renderOfferCard = (offer: Offer) => (
    <div
      key={offer._id}
      className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-800 text-lg">{offer.offerCode}</span>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Get {offer.discountValue}
            {offer.discountType === "percentage" ? "%" : "₹"} off
          </p>
          {offer.description && <p className="text-xs text-gray-600 mb-2">{offer.description}</p>}
          {offer.minAmount && <p className="text-xs text-gray-600 mb-3">Minimum order: ₹{offer.minAmount}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => applyCouponCode(offer)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Apply
            </button>
            <button
              onClick={() => copyToClipboard(offer.offerCode)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-1"
            >
              {copiedCode === offer.offerCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedCode === offer.offerCode ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCalendar = () => (
    <ErrorBoundary>
      <div className="bg-[#FDF8F1] min-h-screen">
        <img
          src={Lines || "/placeholder.svg"}
          alt="Lines"
          className="absolute top-0 left-0 h-full object-cover z-0 scale-125 sm:scale-150 opacity-10"
          style={{ maxWidth: "none" }}
        />
        <div className="relative z-10 p-2 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Header />
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#78533F]">
                      {venue?.name || "Venue"}
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-[#3C3A39] flex items-center gap-1">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#9c7c5d]" />
                      {venue?.address || "Location"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs sm:text-sm text-[#3C3A39]">Confirm your venue from our</p>
                    <p className="text-xs sm:text-sm text-[#3C3A39]">calendar and mark your booking date</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-white border-2 border-[#b09d94]">
                    <img
                      src={Homeicon || "/placeholder.svg"}
                      alt="Custom Icon"
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#78533F]">Availability Calendar</h3>
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-[#b09d94]">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <button
                      onClick={() => navigateMonth("prev")}
                      className="p-2 hover:bg-[#FDF8F1] rounded-full transition-all transform hover:scale-105"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#3C3A39]" />
                    </button>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-lg md:text-xl font-semibold text-[#78533F]">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </h2>
                      <div className="flex flex-col">
                        <button
                          onClick={() => navigateYear("next")}
                          className="p-1 hover:bg-[#FDF8F1] rounded transition-all"
                          disabled={currentDate.getFullYear() >= new Date().getFullYear() + 10}
                        >
                          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#3C3A39]" />
                        </button>
                        <button
                          onClick={() => navigateYear("prev")}
                          className="p-1 hover:bg-[#FDF8F1] rounded transition-all"
                          disabled={currentDate.getFullYear() <= new Date().getFullYear()}
                        >
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#3C3A39]" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => navigateMonth("next")}
                      className="p-2 hover:bg-[#FDF8F1] rounded-full transition-all transform hover:scale-105"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#3C3A39]" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 overflow-hidden">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                      <div
                        key={index}
                        className="h-6 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-medium text-[#3C3A39]"
                      >
                        {day}
                      </div>
                    ))}
                    {generateCalendarDays().map((dateObj, index) => (
                      <div
                        key={index}
                        className={getDateClassName(dateObj.date, dateObj.isCurrentMonth)}
                        onClick={() => handleDateClick(dateObj.date)}
                        style={{ aspectRatio: "1" }}
                      >
                        {dateObj.day || ""}
                        {dateObj.isCurrentMonth && dateObj.date && (
                          <div className="hidden group-hover:block">{getTooltipContent(dateObj.date)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 sm:p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-100 border-2 border-green-400 rounded-full"></div>
                        <span className="text-[#3C3A39]">Available</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full"></div>
                        <span className="text-[#3C3A39]">Partial</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
                        <span className="text-[#3C3A39]">Booked</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-100 border-2 border-gray-400 rounded-full"></div>
                        <span className="text-[#3C3A39]">Past</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#78533F]">Booking Options</h3>
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-[#b09d94]">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                        <span className="mr-2">❄️</span>AC Option
                      </label>
                      <select
                        value={acOption}
                        onChange={(e) => setAcOption(e.target.value)}
                        className="w-full p-2 sm:p-3 border-2 border-[#b09d94] text-[#3C3A39] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all text-xs sm:text-sm"
                      >
                        <option value="">Select AC Option</option>
                        {venue?.acType ? (
                          <option value={venue.acType}>{venue.acType}</option>
                        ) : (
                          <option value="">No AC option available</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                        <span className="mr-2">⏰</span>Time Slot
                      </label>
                      <select
                        value={venueTime}
                        onChange={(e) => {
                          setVenueTime(e.target.value)
                          setFormData((prev) => ({ ...prev, timeSlot: e.target.value }))
                        }}
                        className="w-full p-2 sm:p-3 border-2 border-[#b09d94] text-[#3C3A39] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all text-xs sm:text-sm"
                      >
                        <option value="">Select Time Slot</option>
                        {selectedDate ? (
                          getTimeSlotStatus(selectedDate).map((slot, index) => (
                            <option
                              key={index}
                              value={slot.id}
                              disabled={slot.isBooked}
                              className={slot.isBooked ? "text-red-500" : "text-green-500"}
                            >
                              {slot.label} {slot.isBooked ? "(Booked)" : "(Available)"}
                            </option>
                          ))
                        ) : (
                          <option value="">Select a date first</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                        <span className="mr-2">🎉</span>Event Type
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full p-2 sm:p-3 border-2 border-[#b09d94] text-[#3C3A39] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all text-xs sm:text-sm"
                      >
                        <option value="">Select Event Type</option>
                        {venue?.eventTypes?.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        )) || <option value="">No event types available</option>}
                      </select>
                    </div>
                    <button
                      onClick={handleConfirmBooking}
                      className="w-full mt-4 sm:mt-6 bg-[#ED695A] hover:bg-[#d85c4e] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                      disabled={!venue}
                    >
                      Confirm your Booking!
                    </button>
                  </div>
                  {selectedDate && (
                    <div className="mt-4 p-3 sm:p-4 bg-[#FDF8F1] rounded-xl border-2 border-[#b09d94]">
                      <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                        Selected Date: {selectedDate.toLocaleDateString()}
                      </p>
                      <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                        Available Slots: {getTimeSlotStatus(selectedDate).filter((slot) => !slot.isBooked).length}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
                <div className="bg-[#FDF8F1] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#b09d94]">
                  {currentPage === "form" && (
                    <div className="p-4 sm:p-6 lg:p-8">
                      <div className="flex items-center justify-between mb-4 sm:mb-6 border-b-2 border-[#b09d94] pb-4">
                        <div className="text-center flex-1">
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#78533F]">📅 Booking Form</h2>
                          <p className="text-xs sm:text-sm text-[#3C3A39]">Please fill in your booking details</p>
                        </div>
                        <button
                          onClick={closeModal}
                          className="p-2 hover:bg-[#FDF8F1] rounded-full transition-all transform hover:scale-105"
                        >
                          <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#3C3A39]" />
                        </button>
                      </div>
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                            <span className="mr-2">📧</span>Email
                          </label>
                          <input
                            type="email"
                            value={formData.userEmail}
                            onChange={(e) => handleInputChange("userEmail", e.target.value)}
                            className="w-full p-2 sm:p-3 border-2 border-[#b09d94] text-[#3C3A39] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all text-xs sm:text-sm"
                            placeholder="Enter your email"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                            <span className="mr-2">📍</span>Address
                          </label>
                          <textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className="w-full p-2 sm:p-3 border-2 border-[#b09d94] text-[#3C3A39] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all text-xs sm:text-sm"
                            placeholder="Enter your address"
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                            <span className="mr-2">🏛️</span>Venue Name
                          </label>
                          <input
                            type="text"
                            value={formData.venueName}
                            readOnly
                            className="w-full p-2 sm:p-3 border-2 border-[#b09d94] text-[#3C3A39] rounded-xl bg-[#f5f5f5] text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                            <span className="mr-2">📅</span>Booking Date
                          </label>
                          <input
                            type="text"
                            value={formData.bookingDate}
                            readOnly
                            className="w-full p-2 sm:p-3 border-2 border-[#b09d94] text-[#3C3A39] rounded-xl bg-[#f5f5f5] text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                            <span className="mr-2">⏰</span>Time Slot
                          </label>
                          <input
                            type="text"
                            value={formData.timeSlot}
                            readOnly
                            className="w-full p-2 sm:p-3 border-2 border-[#b09d94] text-[#3C3A39] rounded-xl bg-[#f5f5f5] text-xs sm:text-sm"
                          />
                        </div>

                        {/* Enhanced Coupon Section */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                            <span className="mr-2">🎟️</span>Coupon Code
                          </label>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="flex-1 p-2 sm:p-3 border-2 border-[#b09d94] text-[#3C3A39] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all text-xs sm:text-sm"
                                placeholder="Enter coupon code"
                              />
                              <button
                                onClick={() => applyCouponCode()}
                                className="bg-[#ED695A] hover:bg-[#d85c4e] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
                              >
                                Apply
                              </button>
                            </div>
                            {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
                            {appliedOffer && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-green-600 text-xs font-medium flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Coupon applied: {appliedOffer.discountValue}
                                  {appliedOffer.discountType === "percentage" ? "%" : "₹"} off with{" "}
                                  {appliedOffer.offerCode}
                                </p>
                                <button
                                  onClick={() => applyCouponCode()}
                                  className="text-red-500 text-xs hover:text-red-700 mt-1"
                                >
                                  Remove coupon
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Available Offers Section */}
                        {offers.length > 0 && (
                          <div className="mb-6 bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-[#b09d94]">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#78533F] flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Available Offers
                              </h3>
                              <button
                                onClick={() => setShowOffers(!showOffers)}
                                className="text-[#ED695A] hover:text-[#d85c4e] text-sm font-medium"
                              >
                                {showOffers ? "Hide" : "View All"}
                              </button>
                            </div>
                            {showOffers ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{offers.map(renderOfferCard)}</div>
                            ) : (
                              <div className="flex gap-4 overflow-x-auto pb-2">
                                {offers.slice(0, 2).map(renderOfferCard)}
                                {offers.length > 2 && (
                                  <div className="flex-shrink-0 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center min-w-[200px]">
                                    <button
                                      onClick={() => setShowOffers(true)}
                                      className="text-gray-600 hover:text-[#ED695A] text-sm font-medium"
                                    >
                                      +{offers.length - 2} more offers
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                            <span className="mr-2">💰</span>Total Amount
                          </label>
                          <div className="w-full p-2 sm:p-3 border-2 border-[#b09d94] text-[#3C3A39] rounded-xl bg-[#f5f5f5] text-xs sm:text-sm">
                            {getFormattedPrice(formData.totalAmount)}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                            <span className="mr-2">💸</span>Advance Amount
                          </label>
                          <div className="w-full p-2 sm:p-3 border-2 border-[#b09d94] text-[#3C3A39] rounded-xl bg-[#f5f5f5] text-xs sm:text-sm">
                            {getFormattedPrice(formData.advanceAmount)}
                          </div>
                        </div>
                        <button
                          onClick={handleFormSubmit}
                          className="w-full mt-4 sm:mt-6 bg-[#ED695A] hover:bg-[#d85c4e] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
                        >
                          Proceed to Payment
                        </button>
                      </div>
                    </div>
                  )}
                  {currentPage === "payment" && (
                    <div className="p-4 sm:p-6 lg:p-8">
                      <div className="flex items-center justify-between mb-4 sm:mb-6 border-b-2 border-[#b09d94] pb-4">
                        <div className="text-center flex-1">
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#78533F]">💳 Payment</h2>
                          <p className="text-xs sm:text-sm text-[#3C3A39]">Select your payment method</p>
                        </div>
                        <button
                          onClick={closeModal}
                          className="p-2 hover:bg-[#FDF8F1] rounded-full transition-all transform hover:scale-105"
                        >
                          <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#3C3A39]" />
                        </button>
                      </div>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="bg-white p-3 sm:p-4 rounded-xl border-2 border-[#b09d94]">
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">Venue: {formData.venueName}</p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">Date: {formData.bookingDate}</p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                            Time:{" "}
                            {venue?.timeSlots.find((slot) => slot.id === formData.timeSlot)?.label || formData.timeSlot}
                          </p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                            Total Amount: {getFormattedPrice(formData.totalAmount)}
                          </p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                            Advance Amount: {getFormattedPrice(formData.advanceAmount)}
                          </p>
                          {/* {appliedOffer && (
                            <p className="text-xs sm:text-sm text-green-600 font-medium">
                              Discount Applied: {appliedOffer.offerCode} ({appliedOffer.discountValue}
                              {appliedOffer.discountType === "percentage" ? "%" : "₹"} off)
                            </p>
                          )} */}
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                            <span className="mr-2">💰</span>Payment Type
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <label className="flex items-center gap-2 p-3 sm:p-4 rounded-xl border-2 border-[#b09d94] cursor-pointer hover:bg-[#FDF8F1] transition-all transform hover:scale-105">
                              <input
                                type="radio"
                                name="paymentType"
                                value="full"
                                checked={formData.paymentType === "full"}
                                onChange={() => handlePaymentTypeChange("full")}
                                className="text-[#ED695A] focus:ring-[#ED695A]"
                              />
                              <span className="text-xs sm:text-sm text-[#3C3A39]">
                                Full Payment ({getFormattedPrice(formData.totalAmount)})
                              </span>
                            </label>
                            <label className="flex items-center gap-2 p-3 sm:p-4 rounded-xl border-2 border-[#b09d94] cursor-pointer hover:bg-[#FDF8F1] transition-all transform hover:scale-105">
                              <input
                                type="radio"
                                name="paymentType"
                                value="advance"
                                checked={formData.paymentType === "advance"}
                                onChange={() => handlePaymentTypeChange("advance")}
                                className="text-[#ED695A] focus:ring-[#ED695A]"
                              />
                              <span className="text-xs sm:text-sm text-[#3C3A39]">
                                Advance Payment ({getFormattedPrice(formData.advanceAmount)})
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#78533F] flex items-center mb-2">
                            <span className="mr-2">🏦</span>Payment Method
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            {[
                              { id: "Credit/Debit Card", icon: "💳" },
                              { id: "UPI", icon: "📱" },
                              { id: "Net Banking", icon: "🏦" },
                            ].map((method) => (
                              <button
                                key={method.id}
                                onClick={() => setSelectedPaymentMethod(method.id)}
                                className={`p-3 sm:p-4 rounded-xl border-2 border-[#b09d94] text-[#3C3A39] transition-all shadow-lg text-xs sm:text-sm ${
                                  selectedPaymentMethod === method.id
                                    ? "bg-[#ED695A] text-white border-[#ED695A]"
                                    : "bg-white hover:bg-[#FDF8F1] hover:border-[#ED695A] hover:scale-105"
                                }`}
                              >
                                <span className="mr-2">{method.icon}</span>
                                {method.id}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={handlePaymentSubmit}
                          className="w-full mt-4 sm:mt-6 bg-[#ED695A] hover:bg-[#d85c4e] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                          disabled={!selectedPaymentMethod}
                        >
                          Complete Payment
                        </button>
                      </div>
                    </div>
                  )}
                  {currentPage === "success" && (
                    <div className="p-4 sm:p-6 lg:p-8">
                      <div className="flex items-center justify-between mb-4 sm:mb-6 border-b-2 border-[#b09d94] pb-4">
                        <div className="text-center flex-1">
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#78533F]">
                            🎉 Booking Confirmed!
                          </h2>
                          <p className="text-xs sm:text-sm text-[#3C3A39]">
                            Your booking has been successfully completed
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            closeModal()
                            navigate("/")
                          }}
                          className="p-2 hover:bg-[#FDF8F1] rounded-full transition-all transform hover:scale-105"
                        >
                          <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#3C3A39]" />
                        </button>
                      </div>
                      <div className="space-y-4 sm:space-y-6 text-center">
                        <div className="flex justify-center">
                          {/* <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" /> */}
                        </div>
                        <div className="bg-white p-3 sm:p-4 rounded-xl border-2 border-[#b09d94]">
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">Venue: {formData.venueName}</p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">Date: {formData.bookingDate}</p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                            Time Slot: {formData.timeSlot}
                          </p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                            Booking Time: {formData.exactBookingTime}
                          </p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">Event Type: {eventType}</p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">AC Option: {acOption}</p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">Address: {formData.address}</p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                            Total Amount: {getFormattedPrice(formData.totalAmount)}
                          </p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                            Paid Amount: {getFormattedPrice(formData.paidAmount)}
                          </p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                            Balance Amount: {getFormattedPrice(formData.balanceAmount)}
                          </p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                            Payment Method: {selectedPaymentMethod}
                          </p>
                          <p className="text-xs sm:text-sm text-[#78533F] font-medium">
                            Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                          </p>
                          {/* {formData.couponCode && (
                            <p className="text-xs sm:text-sm text-green-600 font-medium">
                              Coupon Applied: {formData.couponCode}
                            </p>
                          )} */}
                        </div>
                        {eventType.toLowerCase() === "wedding" ? (
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4 sm:mt-6">
                            <button
                              onClick={() => {
                                closeModal()
                                navigate("/")
                              }}
                              className="w-full sm:w-auto bg-[#ED695A] hover:bg-[#d85c4e] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
                            >
                              Later
                            </button>
                            <button
                              onClick={() => {
                                closeModal()
                                navigate(`/details/${currentUser?.email}`)
                              }}
                              className="w-full sm:w-auto bg-[#ED695A] hover:bg-[#d85c4e] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
                            >
                              Marriage Certificate Details
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              closeModal()
                              navigate("/")
                            }}
                            className="w-full mt-4 sm:mt-6 bg-[#ED695A] hover:bg-[#d85c4e] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
                          >
                            Okay
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )

  return renderCalendar()
}

export default Bookings