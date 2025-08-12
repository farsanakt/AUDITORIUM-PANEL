"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../../component/user/Header"
import Lines from "../../assets/Group 52 (1).png"
import Bshape from "../../assets/02 2.png"
import { singleVendorDetails, createVendorBooking, fetchExistingVendorBookings } from "../../api/userApi"
import Swal from 'sweetalert2'

interface Vendor {
  _id: string
  name: string
  address: string
  phone: string
  advAmnt: string
  altPhone: string
  cancellationPolicy: string
  cities: string[]
  email: string
  images: string[]
  pincode: string
  timeSlots: { label: string; startTime: string; endTime: string }[]
  totalamount: string
  vendorType: string
}

interface Booking {
  bookeddate: string
  timeSlot: string
  status: string
}

interface BookingData {
  vendorName: string
  userEmail: string
  vendorId: string
  totalAmount: number
  advanceAmount: number
  address: string
  bookedDate: string
  timeSlot: string
}

const VendorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentType, setPaymentType] = useState<"advance" | "full">("advance")
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    address: "",
    timeSlot: "",
  })
  const [bookings, setBookings] = useState<Booking[]>([])

  const fetchVendorDetails = async () => {
    try {
      setLoading(true)
      const [vendorResponse, bookingsResponse] = await Promise.all([
        singleVendorDetails(id!),
        fetchExistingVendorBookings(id!)
      ])
      setVendor(vendorResponse.data)
      setBookings(bookingsResponse.data || [])
    } catch (err) {
      console.error("Error fetching vendor details or bookings:", err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load vendor details or bookings.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchVendorDetails()
    }
  }, [id])

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const formatDateForBackend = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days: { day: number; date: Date; isCurrentMonth: boolean }[] = []
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
      vendor?.timeSlots?.map((slot) => ({
        ...slot,
        isBooked: bookedSlots.includes(`${slot.label}: ${slot.startTime} - ${slot.endTime}`),
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

    const totalSlots = vendor?.timeSlots?.length || 0
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
        ? `${baseClass} bg-blue-600 text-white cursor-pointer hover:scale-105`
        : `${baseClass} bg-yellow-400 text-yellow-900 cursor-pointer hover:bg-yellow-500 hover:scale-105`
    }
    return isSelected
      ? `${baseClass} bg-blue-600 text-white cursor-pointer hover:scale-105`
      : `${baseClass} bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 hover:scale-105`
  }

  const getTooltipContent = (date: Date) => {
    const slots = getTimeSlotStatus(date)
    return (
      <div className="absolute z-20 bg-white p-3 rounded-lg shadow-xl border border-gray-200 bottom-full mb-2 text-xs sm:text-sm max-w-[90vw] sm:max-w-xs bg-opacity-95 transform -translate-x-1/2 left-1/2">
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        <p className="font-semibold text-gray-800 mb-2">Time Slots:</p>
        {slots.length > 0 ? (
          slots.map((slot) => (
            <div key={slot.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${slot.isBooked ? "bg-red-500" : "bg-green-500"}`}></div>
              <p className={slot.isBooked ? "text-red-600" : "text-green-600"}>
                {slot.label}: {slot.startTime} - {slot.endTime} {slot.isBooked ? "(Booked)" : "(Available)"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No time slots available</p>
        )}
      </div>
    )
  }

  const handleDateClick = (date: Date | null) => {
    if (date && ["available", "partial"].includes(getDateStatus(date) || "")) {
      setSelectedDate(date)
      setFormData((prev) => ({
        ...prev,
        timeSlot: "",
      }))
      setIsModalOpen(true)
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()
      newDate.setMonth(direction === "prev" ? prev.getMonth() - 1 : prev.getMonth() + 1)
      if (newDate.getFullYear() < currentYear || 
          (newDate.getFullYear() === currentYear && newDate.getMonth() < currentMonth)) {
        return prev
      }
      setSelectedDate(null)
      return newDate
    })
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !vendor) return
    const bookedDate = formatDateForBackend(selectedDate)
    setBookingData({
      vendorName: vendor.name,
      userEmail: formData.email,
      vendorId: vendor._id,
      totalAmount: Number(vendor.totalamount),
      advanceAmount: Number(vendor.advAmnt),
      address: formData.address,
      bookedDate,
      timeSlot: formData.timeSlot,
    })
    setIsModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentMethod || !bookingData) return

    const paidAmount = paymentType === "advance" ? bookingData.advanceAmount : bookingData.totalAmount
    const balanceAmount = paymentType === "advance" ? (bookingData.totalAmount - bookingData.advanceAmount) : 0

    const dataToSend = {
      ...bookingData,
      paidAmount,
      balanceAmount,
      paymentMethod,
      paymentType,
    }

    try {
      const response = await createVendorBooking(dataToSend)
      setIsPaymentModalOpen(false)
      setFormData({ email: "", address: "", timeSlot: "" })
      setPaymentMethod("")
      setPaymentType("advance")
      setBookingData(null)
      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: 'Booking Confirmed',
          text: response.message || 'Your booking has been successfully created!',
        })
        await fetchVendorDetails()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: response.message || 'There was an issue with your booking. Please try again.',
        })
      }
    } catch (err) {
      console.error("Error submitting booking:", err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again later.',
      })
    }
  }

  const monthName = monthNames[currentDate.getMonth()]
  const year = currentDate.getFullYear()

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!vendor) {
    return <div className="text-center py-8 text-red-600">No vendor found.</div>
  }

  return (
    <div className="bg-[#FDF8F1] min-h-screen">
      <img
        src={Lines || "/placeholder.svg"}
        alt="Lines"
        className="absolute top-0 left-0 h-full object-cover mt-0 z-0 scale-125 sm:scale-150"
        style={{ maxWidth: "none" }}
      />
      <div className="relative z-10 p-2 sm:p-4">
        <Header />
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
          <div className="mb-2 sm:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-left font-bold text-[#5B4336]">
              {vendor.name}
            </h1>
          </div>
          <div className="flex items-center mb-4 sm:mb-6">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9c7c5d] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs sm:text-sm md:text-base text-[#5B4336]">
              {vendor.address}, {vendor.cities.join(", ")} {vendor.pincode}
            </span>
          </div>
          <div className="mb-6 sm:mb-8">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
              <img
                src={vendor.images[0] || "/placeholder.svg?height=400&width=600"}
                alt="Vendor"
                className="w-full h-48 sm:h-64 md:h-80 lg:h-[400px] object-cover transition-all duration-700 ease-in-out"
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start mb-6 sm:mb-8 gap-4 lg:gap-6">
            <div className="flex-1 lg:pr-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#5B4336] mt-4 sm:mt-6 mb-3">
                About {vendor.vendorType.charAt(0).toUpperCase() + vendor.vendorType.slice(1)}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-[#000000] text-left leading-relaxed">
                {vendor.name} is a premier {vendor.vendorType} offering modern amenities and elegant services.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <button className="bg-[#9c7c5d] hover:bg-[#d85c4e] mt-4 sm:mt-6 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors flex items-center space-x-2 w-full lg:w-auto justify-center text-xs sm:text-sm md:text-base">
                <span>Go to Booking</span>
              </button>
            </div>
          </div>
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#49516F] mt-6 sm:mt-8 mb-3 sm:mb-4">
              Contact
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">{vendor.phone}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">{vendor.altPhone}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">{vendor.email}</span>
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <img
              src={Bshape || "/placeholder.svg"}
              alt="Lines"
              className="absolute bottom-0 left-[-40px] sm:left-[-60px] h-[80%] sm:h-[90%] object-cover z-0"
              style={{ maxWidth: "none" }}
            />
            <div className="bg-white border mt-6 border-gray-200 rounded-xl shadow-sm p-3 sm:p-4 md:p-6 text-gray-800 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base">
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">
                    Cancellation Policy
                  </h4>
                  <p className="text-left">{vendor.cancellationPolicy}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">
                    Pricing
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Total Amount: ₹{Number(vendor.totalamount).toLocaleString("en-IN")}</li>
                    <li>Advance Amount: ₹{Number(vendor.advAmnt).toLocaleString("en-IN")}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">
                    Time Slots
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    {vendor.timeSlots.map((slot, index) => (
                      <li key={index}>
                        {slot.label}: {slot.startTime} - {slot.endTime}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 mb-6 sm:mb-8 flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#49516F] mb-3 sm:mb-4">
                  Availability Calendar
                </h3>
                <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => navigateMonth("prev")} 
                      className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                      disabled={currentDate.getFullYear() === new Date().getFullYear() && 
                               currentDate.getMonth() === new Date().getMonth()}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="text-center font-medium text-gray-600 text-base sm:text-lg md:text-xl">
                      {monthName} {year}
                    </div>
                    <button 
                      onClick={() => navigateMonth("next")} 
                      className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                      <div key={day} className="h-6 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-500">
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
                  <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-100 border-2 border-green-400 rounded-full"></div>
                        <span className="text-gray-600">Available</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full"></div>
                        <span className="text-gray-600">Partial</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">Booked</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-100 border-2 border-gray-400 rounded-full"></div>
                        <span className="text-gray-600">Past</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-2 sm:px-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl border-2 border-amber-200 p-4 sm:p-6 md:p-8 w-full max-w-2xl overflow-auto max-h-[90vh] transform transition-all">
            <div className="text-center mb-4 sm:mb-6 pb-4 border-b-2 border-amber-300">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent mb-2">
                📅 Book {vendor.name}
              </h2>
              <p className="text-amber-700 text-xs sm:text-sm font-medium">Complete your booking details below</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-amber-800 flex items-center">
                    <span className="mr-2">🏪</span>Vendor Name
                  </label>
                  <input
                    type="text"
                    value={vendor.name}
                    disabled
                    className="w-full rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100 p-2 sm:p-3 text-xs sm:text-sm font-medium text-amber-900 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-amber-800 flex items-center">
                    <span className="mr-2">📅</span>Selected Date
                  </label>
                  <input
                    type="text"
                    value={`${monthName} ${selectedDate.getDate()}, ${year}`}
                    disabled
                    className="w-full rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100 p-2 sm:p-3 text-xs sm:text-sm font-medium text-amber-900 shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-amber-800 flex items-center">
                    <span className="mr-2">⏰</span>Time Slot
                  </label>
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-xl border-2 border-amber-300 bg-white p-2 sm:p-3 text-xs sm:text-sm font-medium text-amber-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all"
                  >
                    <option value="" disabled>
                      Select a time slot
                    </option>
                    {getTimeSlotStatus(selectedDate).map((slot, index) => (
                      <option
                        key={index}
                        value={`${slot.label}: ${slot.startTime} - ${slot.endTime}`}
                        disabled={slot.isBooked}
                        className={slot.isBooked ? "text-red-500" : "text-green-500"}
                      >
                        {slot.label}: {slot.startTime} - {slot.endTime} {slot.isBooked ? "(Booked)" : "(Available)"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-amber-800 flex items-center">
                    <span className="mr-2">📧</span>Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-xl border-2 border-amber-300 bg-white p-2 sm:p-3 text-xs sm:text-sm font-medium text-amber-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-amber-800 flex items-center">
                  <span className="mr-2">📍</span>Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border-2 border-amber-300 bg-white p-2 sm:p-3 text-xs sm:text-sm font-medium text-amber-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-amber-800 flex items-center">
                    <span className="mr-2">💰</span>Total Amount
                  </label>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300 p-2 sm:p-3">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-green-800">
                      ₹{Number(vendor.totalamount).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-amber-800 flex items-center">
                    <span className="mr-2">💳</span>Advance Amount
                  </label>
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl border-2 border-blue-300 p-2 sm:p-3">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-blue-800">
                      ₹{Number(vendor.advAmnt).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 sm:pt-6 border-t-2 border-amber-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  💳 Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPaymentModalOpen && bookingData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-2 sm:px-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-2xl border-2 border-emerald-200 p-4 sm:p-6 md:p-8 w-full max-w-2xl overflow-auto max-h-[90vh] transform transition-all">
            <div className="text-center mb-4 sm:mb-6 pb-4 border-b-2 border-emerald-200">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent mb-2">
                💳 Payment for Booking
              </h2>
              <p className="text-emerald-700 text-xs sm:text-sm font-medium">Secure payment gateway</p>
            </div>

            <div className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border-2 border-blue-200">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">📋</span>Booking Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="font-semibold text-blue-700">Vendor:</span>{" "}
                    <span className="text-blue-900">{bookingData.vendorName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-blue-700">Email:</span>{" "}
                    <span className="text-blue-900">{bookingData.userEmail}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-blue-700">Date:</span>{" "}
                    <span className="text-blue-900">{bookingData.bookedDate}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-blue-700">Time:</span>{" "}
                    <span className="text-blue-900">{bookingData.timeSlot}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="font-semibold text-green-700">Total:</span>{" "}
                    <span className="text-green-900 font-bold">
                      ₹{bookingData.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-blue-700">Advance:</span>{" "}
                    <span className="text-blue-900 font-bold">
                      ₹{bookingData.advanceAmount.toLocaleString("en-IN")}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-purple-700">Paying:</span>{" "}
                    <span className="text-purple-900 font-bold">
                      ₹
                      {paymentType === "advance"
                        ? bookingData.advanceAmount.toLocaleString("en-IN")
                        : bookingData.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-orange-700">Balance:</span>{" "}
                    <span className="text-orange-900 font-bold">
                      ₹
                      {paymentType === "advance"
                        ? (bookingData.totalAmount - bookingData.advanceAmount).toLocaleString("en-IN")
                        : "0"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-4">
                <label className="block text-sm sm:text-base md:text-lg font-bold text-emerald-800 flex items-center">
                  <span className="mr-2">💰</span>Payment Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      id="advance"
                      name="paymentType"
                      type="radio"
                      value="advance"
                      checked={paymentType === "advance"}
                      onChange={(e) => setPaymentType(e.target.value as "advance" | "full")}
                      className="sr-only"
                    />
                    <label
                      htmlFor="advance"
                      className={`block p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${paymentType === "advance" ? "border-blue-400 bg-gradient-to-r from-blue-100 to-cyan-100 shadow-lg" : "border-gray-300 bg-white hover:border-blue-300"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm sm:text-base md:text-lg font-bold text-blue-800">💳 Advance</span>
                          <p className="text-xs sm:text-sm text-blue-600">Pay partial amount</p>
                        </div>
                        <span className="text-sm sm:text-base md:text-lg font-bold text-blue-900">
                          ₹{bookingData.advanceAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="full"
                      name="paymentType"
                      type="radio"
                      value="full"
                      checked={paymentType === "full"}
                      onChange={(e) => setPaymentType(e.target.value as "advance" | "full")}
                      className="sr-only"
                    />
                    <label
                      htmlFor="full"
                      className={`block p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${paymentType === "full" ? "border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 shadow-lg" : "border-gray-300 bg-white hover:border-green-300"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm sm:text-base md:text-lg font-bold text-green-800">💰 Full Payment</span>
                          <p className="text-xs sm:text-sm text-green-600">Pay complete amount</p>
                        </div>
                        <span className="text-sm sm:text-base md:text-lg font-bold text-green-900">
                          ₹{bookingData.totalAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm sm:text-base md:text-lg font-bold text-emerald-800 flex items-center">
                  <span className="mr-2">🏦</span>Payment Method
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "credit", label: "Credit Card", icon: "💳", color: "purple" },
                    { id: "debit", label: "Debit Card", icon: "💳", color: "blue" },
                    { id: "upi", label: "UPI", icon: "📱", color: "green" },
                    { id: "netbanking", label: "Net Banking", icon: "🏦", color: "orange" },
                  ].map((method) => (
                    <div key={method.id} className="relative">
                      <input
                        id={method.id}
                        name="paymentMethod"
                        type="radio"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={method.id}
                        className={`block p-2 sm:p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 text-center ${paymentMethod === method.id ? `border-${method.color}-400 bg-gradient-to-r from-${method.color}-100 to-${method.color}-200 shadow-lg` : "border-gray-300 bg-white hover:border-gray-400"}`}
                      >
                        <div className="text-lg sm:text-xl md:text-2xl mb-1">{method.icon}</div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-800">{method.label}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 sm:pt-6 border-t-2 border-emerald-200">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center text-xs sm:text-sm"
                >
                  <span className="mr-2">🔒</span>Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default VendorDetails