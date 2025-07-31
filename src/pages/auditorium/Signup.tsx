"use client"

import type React from "react"
import { useState } from "react"
import tk from '../../assets/Rectangle 50.png'
import { useNavigate } from "react-router-dom"
import Header from "../../component/user/Header"
import { singUpRequest } from "../../api/userApi"
import { toast } from 'react-toastify'

const AuditoriumRegistrationPage: React.FC = () => {
  const navigate = useNavigate()
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showEventsDropdown, setShowEventsDropdown] = useState(false)
  const [showLocationsDropdown, setShowLocationsDropdown] = useState(false)

  const [formData, setFormData] = useState({
    auditoriumName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    events: [] as string[],
    locations: [] as string[]
  })

  const eventOptions = [
    { value: "Reception", label: "Reception" },
    { value: "Engagement", label: "Engagement" },
    { value: "Anniversary", label: "Anniversary" },
    { value: "wedding", label: "Wedding" },
  ]

  const locationOptions = [
    { value: "Kochi", label: "Kochi" },
    { value: "Trivandrum", label: "Trivandrum" },
    { value: "Kannur", label: "Kannur" },
    { value: "calicut", label: "calicut" }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name as keyof typeof prev] as string[], value]
          : (prev[name as keyof typeof prev] as string[]).filter(item => item !== value)
      }))
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleOtpModal = () => {
    setShowOtpModal(false)
    navigate('/auditorium/login')
  }

  const handleSignup = async () => {
    if (formData.events.length === 0 || formData.locations.length === 0) {
      toast.error('Select at least one event and location.')
      return
    }
    const response = await singUpRequest(formData)
    if (response.data.success === false) {
      toast.error(response.data.message || 'Signup failed!')
    } else {
      setShowOtpModal(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSignup()
  }

  const handleLogin = () => {
    navigate('/auditorium/login')
  }

  return (
    <div className="h-screen bg-[#FDF8F1] relative overflow-hidden flex flex-col">
      <Header />
      
      <div className="container mx-auto px-2 py-3 pt-12 max-w-screen-md flex-1">
        <div className="w-full mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
            <div className="flex flex-col lg:flex-row h-full">
              
              {/* Left Side - Image and Benefits */}
              <div className="lg:w-2/5 relative bg-gradient-to-br from-[#78533F] to-[#5d4032] hidden lg:flex flex-col">
                <div className="absolute inset-0 opacity-20">
                  <img src={tk} alt="Auditorium Preview" className="w-full h-full object-cover" />
                </div>
                
                <div className="relative z-10 flex flex-col justify-between h-full p-3">
                  {/* Header Section */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm border border-white border-opacity-30">
                      <span className="text-[#FDF8F1] text-xl font-bold">TK</span>
                    </div>
                    <h1 className="text-white text-lg font-bold leading-tight mb-1">
                      Register Auditorium
                    </h1>
                    <div className="w-12 h-0.5 bg-[#ED695A] mx-auto rounded-full"></div>
                  </div>

                  {/* Middle Section */}
                  <div className="text-center">
                    <p className="text-white text-xs leading-tight opacity-90">
                      Showcase your venue to clients.
                    </p>
                  </div>

                  {/* Benefits Section */}
                  <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-3 border border-white border-opacity-20">
                    <h3 className="text-[#FDF8F1] font-bold text-sm mb-2 text-center">Why Register?</h3>
                    <div className="space-y-1">
                      {[
                        "Reach many customers",
                        "Manage bookings easily", 
                        "Get featured",
                        "Boost visibility"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-1">
                          <div className="w-4 h-4 bg-[#ED695A] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <span className="text-white text-xs leading-tight">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Registration Form */}
              <div className="lg:w-3/5 p-3 flex items-start justify-center">
                <div className="w-full max-w-sm">
                  
                  {/* Mobile Header */}
                  <div className="lg:hidden text-center mb-3">
                    <div className="w-10 h-10 bg-[#78533F] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-[#78533F] text-lg font-bold">TK</span>
                    </div>
                    <h2 className="text-sm font-bold text-[#78533F] mb-1">Register Auditorium</h2>
                    <div className="w-12 h-0.5 bg-[#ED695A] mx-auto rounded-full"></div>
                  </div>

                  {/* Desktop Header */}
                  <div className="hidden lg:block text-center mb-3">
                    <h2 className="text-sm font-bold text-[#78533F] mb-1">REGISTER AUDITORIUM</h2>
                    <div className="w-12 h-0.5 bg-[#ED695A] mx-auto rounded-full"></div>
                    <p className="text-[#78533F] opacity-70 mt-1 text-xs">Fill in details</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-2">
                    
                    {/* Personal Information Section */}
                    <div className="bg-gradient-to-r from-[#FDF8F1] to-white p-2 rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label htmlFor="auditoriumName" className="block text-[#78533F] font-semibold text-xs uppercase tracking-tight">
                            Auditorium *
                          </label>
                          <input
                            type="text"
                            id="auditoriumName"
                            name="auditoriumName"
                            className="w-full px-2 py-1 border-2 border-[#b09d94] border-opacity-50 rounded-md focus:outline-none focus:border-[#ED695A] focus:ring-1 focus:ring-[#ED695A] focus:ring-opacity-20 transition-all duration-200 bg-white text-sm"
                            value={formData.auditoriumName}
                            onChange={handleChange}
                            placeholder="Name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label htmlFor="ownerName" className="block text-[#78533F] font-semibold text-xs uppercase tracking-tight">
                            Owner *
                          </label>
                          <input
                            type="text"
                            id="ownerName"
                            name="ownerName"
                            className="w-full px-2 py-1 border-2 border-[#b09d94] border-opacity-50 rounded-md focus:outline-none focus:border-[#ED695A] focus:ring-1 focus:ring-[#ED695A] focus:ring-opacity-20 transition-all duration-200 bg-white text-sm"
                            value={formData.ownerName}
                            onChange={handleChange}
                            placeholder="Full name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label htmlFor="email" className="block text-[#78533F] font-semibold text-xs uppercase tracking-tight">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-2 py-1 border-2 border-[#b09d94] border-opacity-50 rounded-md focus:outline-none focus:border-[#ED695A] focus:ring-1 focus:ring-[#ED695A] focus:ring-opacity-20 transition-all duration-200 bg-white text-sm"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label htmlFor="phone" className="block text-[#78533F] font-semibold text-xs uppercase tracking-tight">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="w-full px-2 py-1 border-2 border-[#b09d94] border-opacity-50 rounded-md focus:outline-none focus:border-[#ED695A] focus:ring-1 focus:ring-[#ED695A] focus:ring-opacity-20 transition-all duration-200 bg-white text-sm"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Venue Details Section */}
                    <div className="bg-gradient-to-r from-white to-[#FDF8F1] p-2 rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-[#78533F] font-semibold text-xs uppercase tracking-tight">
                            Events *
                          </label>
                          <div className="relative">
                            <div
                              className="w-full px-2 py-1 border-2 border-[#b09d94] border-opacity-50 rounded-md bg-white text-sm cursor-pointer flex items-center justify-between"
                              onClick={() => setShowEventsDropdown(!showEventsDropdown)}
                            >
                              <span className={formData.events.length > 0 ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                                {formData.events.length > 0 ? formData.events.join(", ") : "Select events"}
                              </span>
                              <span className="text-[#78533F]">&#9662;</span>
                            </div>
                            {showEventsDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-[#b09d94] border-opacity-50 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {eventOptions.map(option => (
                                  <label
                                    key={option.value}
                                    className="flex items-center space-x-1 p-1.5 hover:bg-[#FDF8F1] cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      name="events"
                                      value={option.value}
                                      checked={formData.events.includes(option.value)}
                                      onChange={handleChange}
                                      className="w-3 h-3 text-[#ED695A] bg-white border-2 border-[#b09d94] rounded focus:ring-[#ED695A] focus:ring-1"
                                    />
                                    <span className="text-[#3C3A39] text-sm">{option.label}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-[#78533F] font-semibold text-xs uppercase tracking-tight">
                            Locations *
                          </label>
                          <div className="relative">
                            <div
                              className="w-full px-2 py-1 border-2 border-[#b09d94] border-opacity-50 rounded-md bg-white text-sm cursor-pointer flex items-center justify-between"
                              onClick={() => setShowLocationsDropdown(!showLocationsDropdown)}
                            >
                              <span className={formData.locations.length > 0 ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                                {formData.locations.length > 0 ? formData.locations.join(", ") : "Select locations"}
                              </span>
                              <span className="text-[#78533F]">&#9662;</span>
                            </div>
                            {showLocationsDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-[#b09d94] border-opacity-50 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {locationOptions.map(option => (
                                  <label
                                    key={option.value}
                                    className="flex items-center space-x-1 p-1.5 hover:bg-[#FDF8F1] cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      name="locations"
                                      value={option.value}
                                      checked={formData.locations.includes(option.value)}
                                      onChange={handleChange}
                                      className="w-3 h-3 text-[#ED695A] bg-white border-2 border-[#b09d94] rounded focus:ring-[#ED695A] focus:ring-1"
                                    />
                                    <span className="text-[#3C3A39] text-sm">{option.label}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security Section */}
                    <div className="bg-gradient-to-r from-[#FDF8F1] to-white p-2 rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label htmlFor="password" className="block text-[#78533F] font-semibold text-xs uppercase tracking-tight">
                            Password *
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-2 py-1 border-2 border-[#b09d94] border-opacity-50 rounded-md focus:outline-none focus:border-[#ED695A] focus:ring-1 focus:ring-[#ED695A] focus:ring-opacity-20 transition-all duration-200 bg-white text-sm"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label htmlFor="confirmPassword" className="block text-[#78533F] font-semibold text-xs uppercase tracking-tight">
                            Confirm *
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="w-full px-2 py-1 border-2 border-[#b09d94] border-opacity-50 rounded-md focus:outline-none focus:border-[#ED695A] focus:ring-1 focus:ring-[#ED695A] focus:ring-opacity-20 transition-all duration-200 bg-white text-sm"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Terms and Submit */}
                    <div className="space-y-2">
                      <div className="flex items-start space-x-1 p-1 bg-[#FDF8F1] rounded-md">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          className="w-3 h-3 text-[#ED695A] bg-white rounded focus:ring-[#ED695A] focus:ring-1"
                          required
                        />
                        <label htmlFor="terms" className="text-xs text-[#3C3A39] leading-tight">
                          I agree to{" "}
                          <span className="text-[#ED695A] font-semibold hover:underline cursor-pointer">
                            Terms
                          </span>{" "}
                          &{" "}
                          <span className="text-[#ED695A] font-semibold hover:underline cursor-pointer">
                            Privacy
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#ED695A] to-[#d85c4e] text-white font-bold py-1 px-3 rounded-md shadow-md hover:shadow-lg hover:from-[#d85c4e] hover:to-[#c8553e] transform hover:-translate-y-0.5 transition-all duration-200 text-xs uppercase"
                      >
                        Register
                      </button>
                    </div>
                  </form>

                  {/* Login Link */}
                  <div className="text-center mt-2 pt-1">
                    <p className="text-[#3C3A39] text-xs">
                      Have account?{" "}
                      <button 
                        onClick={handleLogin} 
                        className="text-[#ED695A] font-semibold hover:underline hover:text-[#d85c4e] transition-colors duration-200"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-xl p-3 w-full max-w-[240px] transform transition-all duration-200">
            <div className="text-center mb-2">
              <div className="w-8 h-8 bg-[#ED695A] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-1">
                <span className="text-[#ED695A] text-sm font-bold">✓</span>
              </div>
              <h2 className="text-sm font-bold text-[#78533F] mb-1">Verify</h2>
              <p className="text-[#3C3A39] opacity-70 text-xs">Enter OTP</p>
            </div>
            
            <div className="space-y-2">
              <input
                type="text"
                placeholder="6-digit OTP"
                className="w-full px-2 py-1 border-2 border-[#b09d94] border-opacity-50 rounded-md focus:outline-none focus:border-[#ED695A] focus:ring-1 focus:ring-[#ED695A] focus:ring-opacity-20 transition-all duration-200 text-center text-sm tracking-wide"
                maxLength={6}
              />
              
              <button
                className="w-full bg-gradient-to-r from-[#ED695A] to-[#d85c4e] text-white font-bold py-0.5 px-3 rounded-md shadow-md hover:shadow-lg hover:from-[#d85c4e] hover:to-[#c8553e] transform hover:-translate-y-0.5 transition-all duration-200 text-xs"
                onClick={handleOtpModal}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditoriumRegistrationPage