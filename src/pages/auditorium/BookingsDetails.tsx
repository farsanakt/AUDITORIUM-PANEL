"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, Check, Clock, Home, MapPin, Phone, User } from "lucide-react"
import Sidebar from "../../component/auditorium/Sidebar"
import Header from "../../component/user/Header"

// Define types for form data
type PartyType = "Wedding" | "Birthday" | "Corporate" | "Anniversary" | "Other"
type ACType = "AC" | "NON AC"

interface BookingFormData {
  name: string
  address: string
  mobileNo: string
  venueName: string
  subName: string
  bookingDate: string
  partyType: PartyType
  venueTime: string
  acType: ACType
  totalAmount: number
  advanceAmount: number
}

export default function BookingConfirmation() {
  const navigate = useNavigate()

  // Initialize form state
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    address: "",
    mobileNo: "",
    venueName: "",
    subName: "",
    bookingDate: "",
    partyType: "Wedding",
    venueTime: "",
    acType: "AC",
    totalAmount: 25000,
    advanceAmount: 10000,
  })

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Handle number inputs
    if (name === "totalAmount" || name === "advanceAmount") {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Redirect based on party type
    if (formData.partyType === "Wedding") {
      navigate("/details")
    } else {
      navigate("/auditorium/payment")
    }
  }

  // Handle back button
  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1]">
        <Header/>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 shrink-0  h-[calc(100vh-64px)]  sticky top-16 hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 border-b border-[#b09d94] pb-4">
              <h1 className="text-2xl font-bold text-[#78533F]">Booking Confirmation</h1>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg border border-[#b09d94] shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-[#78533F]/10 to-[#ED695A]/10 p-4 border-b border-[#b09d94]">
                  <h2 className="text-xl font-semibold text-[#78533F] flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Auditorium Booking Details
                  </h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-[#78533F]">
                          <User className="h-4 w-4 mr-1" />
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#78533F]/50"
                          required
                        />
                      </div>

                      {/* Address */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-[#78533F]">
                          <MapPin className="h-4 w-4 mr-1" />
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#78533F]/50"
                          required
                        />
                      </div>

                      {/* Mobile No */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-[#78533F]">
                          <Phone className="h-4 w-4 mr-1" />
                          Mobile No
                        </label>
                        <input
                          type="tel"
                          name="mobileNo"
                          value={formData.mobileNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#78533F]/50"
                          required
                        />
                      </div>

                      {/* Venue Name */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-[#78533F]">
                          <Home className="h-4 w-4 mr-1" />
                          Venue Name
                        </label>
                        <input
                          type="text"
                          name="venueName"
                          value={formData.venueName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#78533F]/50"
                          required
                        />
                      </div>

                      {/* Sub Name */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-[#78533F]">Sub Name</label>
                        <input
                          type="text"
                          name="subName"
                          value={formData.subName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#78533F]/50"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Booking Date */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-[#78533F]">
                          <Calendar className="h-4 w-4 mr-1" />
                          Booking Date
                        </label>
                        <input
                          type="date"
                          name="bookingDate"
                          value={formData.bookingDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#78533F]/50"
                          required
                        />
                      </div>

                      {/* Party Type (Dropdown) */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-[#78533F]">Party Type</label>
                        <select
                          name="partyType"
                          value={formData.partyType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#78533F]/50 bg-white"
                          required
                        >
                          <option value="Wedding">Wedding</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Corporate">Corporate Event</option>
                          <option value="Anniversary">Anniversary</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Venue Time */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-[#78533F]">
                          <Clock className="h-4 w-4 mr-1" />
                          Venue Time
                        </label>
                        <input
                          type="time"
                          name="venueTime"
                          value={formData.venueTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#78533F]/50"
                          required
                        />
                      </div>

                      {/* AC/NON AC */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-[#78533F]">AC/NON AC</label>
                        <select
                          name="acType"
                          value={formData.acType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#78533F]/50 bg-white"
                          required
                        >
                          <option value="AC">AC</option>
                          <option value="NON AC">NON AC</option>
                        </select>
                      </div>

                      {/* Total Amount */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-[#78533F]">Total Amount</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">₹</span>
                          <input
                            type="number"
                            name="totalAmount"
                            value={formData.totalAmount}
                            onChange={handleInputChange}
                            className="w-full pl-7 pr-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#78533F]/50"
                            required
                          />
                        </div>
                      </div>

                      {/* Advance Amount */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-[#78533F]">Advance</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">₹</span>
                          <input
                            type="number"
                            name="advanceAmount"
                            value={formData.advanceAmount}
                            onChange={handleInputChange}
                            className="w-full pl-7 pr-3 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#78533F]/50"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-[#b09d94] rounded-md text-[#78533F] hover:bg-amber-50 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>

                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 px-6 py-2 bg-[#ED695A] hover:bg-[#d85a4b] text-white rounded-md transition-colors"
                    >
                      Confirm Booking
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <button
            className="rounded-full w-12 h-12 bg-[#78533F] hover:bg-[#5d3f30] text-white shadow-lg flex items-center justify-center"
            onClick={() => {
              // This would typically open a mobile sidebar
              alert("Mobile sidebar would open here")
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
