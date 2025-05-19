"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../component/ui/select"
import { Clock, ArrowLeft } from "lucide-react"
import { CustomCalendar } from "../../component/auditorium/Calender"
import Header from "../../component/user/Header"
import Sidebar from "../../component/auditorium/Sidebar"
import { RadioGroup, RadioGroupItem } from "../../component/ui/radio-group"
import { Label } from "../../component/ui/label"

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

export default function VenueBookingPage() {
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedVenue, setSelectedVenue] = useState<string>("auditorium")
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [acOption, setAcOption] = useState<"ac" | "non-ac">("ac")

  
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
    {
      id: "theater",
      name: "Main Hall",
      timeSlots: [
        { id: "1", time: "Morning (6 AM - 10 AM)", status: "maintenance", price: 600 },
        { id: "2", time: "Late Morning (10 AM - 2 PM)", status: "maintenance", price: 800 },
        { id: "3", time: "Afternoon (2 PM - 6 PM)", status: "available", price: 700 },
        { id: "4", time: "Evening (6 PM - 9 PM)", status: "available", price: 900 },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-400"
      case "booked":
        return "bg-red-400"
      case "waitlist":
        return "bg-yellow-400"
      case "maintenance":
        return "bg-purple-400"
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
    // Handle booking confirmation
    alert(`Booking confirmed for ${selectedSlot?.time} at ${getCurrentVenue()?.name} (${acOption.toUpperCase()})`)
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
    navigate(-1)
  }

  // Calculate price adjustment based on AC/Non-AC
  const getPriceAdjustment = (basePrice: number) => {
    return acOption === "ac" ? basePrice : Math.floor(basePrice * 0.8) // 20% discount for non-AC
  }

  return (
    <div className="flex h-screen mt-10 bg-[#FDF8F1]">
      <Header />
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

      <div className="w-64 shrink-0 h-[calc(100vh-64px)] sticky top-16 hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Title moved to left side */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-xl font-bold text-[#78533F]    text-left">Venue Booking</h1>
                <p className="text-[#78533F] opacity-80">Select a venue, date, and time slot to make your booking</p>
              </div>

              {/* Venue Selection */}
              <div className="w-full md:w-[250px]">
                <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                  <SelectTrigger className="bg-white border-[#b09d94] text-[#78533F] h-11 focus:ring-[#78533F]">
                    <SelectValue placeholder="Select a venue" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#78533F]/20 rounded-md shadow-lg">
                    {venues.map((venue) => (
                      <SelectItem
                        key={venue.id}
                        value={venue.id}
                        className="cursor-pointer hover:bg-[#78533F]/10 focus:bg-[#78533F]/10 focus:text-[#78533F]"
                      >
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AC/Non-AC Option */}
            <div className="mb-6">
              {/* <Label className="text-[#78533F] font-medium mb-2 block">Facility Type</Label> */}
              <RadioGroup
                value={acOption}
                onValueChange={(value) => setAcOption(value as "ac" | "non-ac")}
                className="flex gap-4 "
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ac" id="ac" />
                  <Label htmlFor="ac" className="cursor-pointer">
                    AC
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-ac" id="non-ac" />
                  <Label htmlFor="non-ac" className="cursor-pointer">
                    Non-AC
                  </Label>
                </div>
              </RadioGroup>
            </div>

           
            <div className="flex flex-col md:flex-row gap-6">
              
              <div className="md:w-[350px] flex-shrink-0">
                <CustomCalendar onDateSelect={setSelectedDate} />
              </div>

           
              <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-[#78533F]">Available Time Slots</h2>
                  <p className="text-gray-600">
                    {getCurrentVenue()?.name} ({acOption.toUpperCase()}) -{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[500px] pr-2 hide-scrollbar">
                  {getCurrentVenue()?.timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => handleSlotSelect(slot)}
                      className={`
                        p-4 rounded-lg border border-[#b09d94] transition-all duration-300 bg-white
                        ${selectedSlot?.id === slot.id ? "ring-2 ring-[#78533F]" : ""}
                        ${isSelectable(slot.status) ? "cursor-pointer hover:shadow-md hover:translate-y-[-2px]" : "opacity-70 cursor-not-allowed"}
                      `}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-[#78533F]" />
                          <span className="font-medium">{slot.time}</span>
                        </div>
                        <span className={`px-2 py-0.5 text-xs rounded-full text-white ${getStatusColor(slot.status)}`}>
                          {getStatusText(slot.status)}
                        </span>
                      </div>
                      <div className="text-gray-700">
                        <p>Price: ₹{getPriceAdjustment(slot.price)}</p>
                        {acOption === "non-ac" && (
                          <p className="text-xs text-green-600 mt-1">20% discount for Non-AC</p>
                        )}
                        {slot.status === "waitlist" && (
                          <p className="text-xs text-yellow-600 mt-1">Join waiting list</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8 flex justify-start">
              <button
                onClick={handleGoBack}
                className="flex items-center px-4 py-2 text-[#492d1e] hover:bg-[#78533F]/10 rounded-md transition-colors"
              >
                <ArrowLeft className="h-4 text-4xl w-4 mr-2" />
                Back
              </button>
            </div>
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
                <span className="font-medium">Venue:</span>
                <span>{getCurrentVenue()?.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Type:</span>
                <span>{acOption.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Date:</span>
                <span>{selectedDate.toLocaleDateString()}</span>
              </div>
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
                <span>₹{getPriceAdjustment(selectedSlot.price)}</span>
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
    </div>
  )
}
