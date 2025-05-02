"use client"

import { useState, useEffect } from "react"
import Sidebar from "../../component/auditorium/Sidebar"
import Header from "../../component/user/Header"
import { useNavigate } from "react-router-dom"

interface TimeSlot {
  id: string
  time: string
  status: "available" | "booked" | "waitlist" | "maintenance"
  price: number
}

const AuditoriumBooking = () => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingName, setBookingName] = useState("")
  const [bookingEmail, setBookingEmail] = useState("")
  const [bookingPhone, setBookingPhone] = useState("")
  const [bookingPurpose, setBookingPurpose] = useState("")
  const navigate=useNavigate()

  const timeSlots: TimeSlot[] = [
    { id: "1", time: "Morning (6 AM - 10 AM)", status: "available", price: 500 },
    { id: "2", time: "Late Morning (10 AM - 2 PM)", status: "booked", price: 700 },
    { id: "3", time: "Afternoon (2 PM - 6 PM)", status: "waitlist", price: 600 },
    { id: "4", time: "Evening (6 PM - 9 PM)", status: "maintenance", price: 800 },
    { id: "5", time: "Tomorrow Morning (6 AM - 10 AM)", status: "available", price: 500 },
    { id: "6", time: "Tomorrow Afternoon (2 PM - 6 PM)", status: "available", price: 600 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "booked":
        return "bg-red-500"
      case "waitlist":
        return "bg-yellow-500"
      case "maintenance":
        return "bg-blue-500"
      default:
        return "bg-gray-200"
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
        return "Under Maintenance"
      default:
        return ""
    }
  }

  const isSelectable = (status: string) => {
    return status === "available" || status === "waitlist"
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    if (isSelectable(slot.status)) {
      setSelectedSlot(slot)
      setShowConfirmation(true)
    }
  }

  const handleConfirmSlot = () => {
    navigate('/payment')
    setShowConfirmation(false)
    setShowBookingForm(true)
  }

  const handleCancelSlot = () => {
    setShowConfirmation(false)
    setSelectedSlot(null)
  }

  const handleConfirmBooking = () => {
    if (!selectedSlot || !bookingName || !bookingEmail || !bookingPhone) {
      alert("Please fill in all required fields")
      return
    }

    alert(`Booking confirmed for ${selectedSlot.time}`)
    // Here you would typically send the data to your backend

    // Reset form
    setSelectedSlot(null)
    setShowBookingForm(false)
    setBookingName("")
    setBookingEmail("")
    setBookingPhone("")
    setBookingPurpose("")
  }

  const closeBookingForm = () => {
    setShowBookingForm(false)
    setSelectedSlot(null)
  }

  useEffect(() => {
    if (showConfirmation || showBookingForm) {
      document.body.classList.add("modal-open")
    } else {
      document.body.classList.remove("modal-open")
    }

    return () => {
      document.body.classList.remove("modal-open")
    }
  }, [showConfirmation, showBookingForm])

  return (
    <div className="flex h-screen bg-[#FDF8F1]">
      {/* Custom CSS to hide scrollbars */}
      <style jsx global>{`
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
      `}</style>

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-[#78533F] mb-2">Venue Availability</h1>
            <p className="text-[#78533F] opacity-80 mb-8">Select a time slot to book the Golden Auditorium</p>

            {/* Time Slots Grid */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#78533F] mb-4">Available Time Slots</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto max-h-[400px] pr-2 hide-scrollbar">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    className={`
                      p-3 rounded-lg border shadow-sm transition-all duration-300 bg-white
                      ${selectedSlot?.id === slot.id ? "ring-2 ring-[#78533F]" : ""}
                      ${isSelectable(slot.status) ? "cursor-pointer hover:shadow-md hover:translate-y-[-2px]" : "opacity-70 cursor-not-allowed"}
                    `}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{slot.time}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full text-white ${getStatusColor(slot.status)}`}>
                        {getStatusText(slot.status)}
                      </span>
                    </div>
                    <div className="text-gray-700 text-sm">
                      <p>Price: ${slot.price}</p>
                      {slot.status === "waitlist" && <p className="text-xs text-yellow-600 mt-1">Join waiting list</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Legend */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
              <h3 className="text-lg font-medium text-[#78533F] mb-3">Status Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span>Waiting List</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span>Under Maintenance</span>
                </div>
              </div>
            </div>

            {!selectedSlot && !showBookingForm && (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-600">Please select an available time slot to proceed with your booking</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedSlot && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backdropFilter: "blur(2px)" }}
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-[#78533F] mb-4">Confirm Time Slot</h3>
            <p className="mb-4">You have selected the following time slot:</p>

            <div className="bg-[#F8F0E5] p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Time:</span>
                <span>{selectedSlot.time}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-0.5 text-xs rounded-full text-white ${getStatusColor(selectedSlot.status)}`}>
                  {getStatusText(selectedSlot.status)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Price:</span>
                <span>${selectedSlot.price}</span>
              </div>
            </div>

            <p className="mb-6">Would you like to proceed with booking this time slot?</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelSlot}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSlot}
                className="px-4 py-2 bg-[#78533F] text-white rounded-md hover:bg-[#8a614b] transition-colors"
              >
                Proceed to Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      
    </div>
  )
}

export default AuditoriumBooking
