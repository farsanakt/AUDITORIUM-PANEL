"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Loader2, X, Check } from "lucide-react"
import tk from "../../assets/Rectangle 50.png"
import { useNavigate } from "react-router-dom"
import Header from "../../component/user/Header"
import { singUpRequest, verifyOTP, getItems } from "../../api/userApi"
import { toast } from "react-toastify"
import LocationAutocomplete from "../../component/LocationAutocomplete/LocationAutocomplete"
import type { LocationResult } from "../../component/LocationAutocomplete/types"

interface SelectedLocation {
  name: string
  lat: number
  lon: number
  district: string
}

const AuditoriumRegistrationPage: React.FC = () => {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [eventsList, setEventsList] = useState<string[]>([])
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false)

  const [formData, setFormData] = useState({
    auditoriumName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    district: "",
    locations: [] as SelectedLocation[],
    address: "",
    logo: null as File | null,
    seal: null as File | null,
    events: [] as string[],
    gstNumber: "",
  })

  const districts = [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ]

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await getItems('hi') // Assuming 'hi' is used to fetch admin items including events
      console.log("Admin items response:", response.data)

      if (response.data?.success && response.data?.items?.events) {
        const events = response.data.items.events
          .filter((type: string) => type && type.trim())
          .sort()
        setEventsList(events)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      // Fallback to static list if API fails
    
    }
  }

  /* ---------------- LOCATION HANDLERS ---------------- */

  const handleLocationSelect = (loc: LocationResult) => {
    if (!formData.district) {
      toast.error("Please select a district first")
      return
    }

    if (formData.locations.some((l) => l.name === loc.displayName)) return

    setFormData((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        {
          name: loc.displayName,
          lat: loc.lat,
          lon: loc.lon,
          district: formData.district,
        },
      ],
    }))
  }

  const removeLocation = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((l) => l.name !== name),
    }))
  }

  /* ---------------- VALIDATION ---------------- */

  const isStep1Valid = () => formData.auditoriumName && formData.ownerName && formData.email && formData.phone

  const isStep2Valid = () => formData.district && formData.locations.length > 0 && formData.address && formData.events.length > 0

  const isStep3Valid = () => formData.password && formData.confirmPassword

  /* ---------------- SUBMIT ---------------- */

  const handleSignup = async () => {
    if (!isStep1Valid() || !isStep2Valid() || !isStep3Valid()) {
      toast.error("Please fill all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsSigningUp(true)
    try {
      const signupData = new FormData()
      signupData.append("auditoriumName", formData.auditoriumName)
      signupData.append("ownerName", formData.ownerName)
      signupData.append("email", formData.email)
      signupData.append("phone", formData.phone)
      signupData.append("password", formData.password)
      signupData.append("confirmPassword", formData.confirmPassword)
      signupData.append("district", formData.district)
      signupData.append("locations", JSON.stringify(formData.locations))
      signupData.append("address", formData.address)
      signupData.append("events", JSON.stringify(formData.events))
      signupData.append("gstNumber", formData.gstNumber)
      if (formData.logo) signupData.append("logo", formData.logo)
      if (formData.seal) signupData.append("seal", formData.seal)

      const res = await singUpRequest(signupData)
       if (res.data.success) {
    toast.success(res.data.message);
    navigate("/auditorium/login");
  } else {
    toast.error(res.data.message);
  }
    } catch (err: any) {
     
      toast.error(err.response?.data?.message || "Signup failed")
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return
    setIsVerifyingOtp(true)
    try {
      await verifyOTP(formData.email, otp)
      toast.success("Verified successfully")
      navigate("/auditorium/login")
    } catch {
      toast.error("Invalid OTP")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  /* ---------------- STEP CONTENT ---------------- */

  const inputClass =
    "w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:border-[#ED695A] text-sm"

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className={inputClass}
              placeholder="Enter auditorium name"
              value={formData.auditoriumName}
              onChange={(e) => setFormData({ ...formData, auditoriumName: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Enter owner name"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Enter GST number (optional)"
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
            />
          </div>
        )

      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[#78533F] text-xs font-serif">Address</label>
              <input
                className={inputClass}
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#78533F] text-xs font-serif">District</label>
              <select
                className={inputClass}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value, locations: [] })}
              >
                <option value="">Select district</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[#78533F] text-xs font-serif">Locations</label>
              <div className={inputClass + " bg-white"}>
                <LocationAutocomplete
                  value=""
                  placeholder="Search locations in selected district"
                  onSelect={handleLocationSelect}
                />
              </div>
              {formData.locations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.locations.map((loc) => (
                    <span
                      key={loc.name}
                      className="flex items-center px-2 py-1 rounded-full text-xs font-serif border border-[#ED695A] text-[#ED695A] bg-[#FDF8F1] whitespace-nowrap"
                    >
                      {loc.name}
                      <X
                        size={12}
                        className="ml-2 cursor-pointer flex-shrink-0"
                        onClick={() => removeLocation(loc.name)}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-[#78533F] text-xs font-serif">Events</label>
              <div className="relative">
                <div
                  className={inputClass + " cursor-pointer"}
                  onClick={() => setIsEventsDropdownOpen(!isEventsDropdownOpen)}
                >
                  {formData.events.length > 0 ? `${formData.events.length} selected` : "Select events"}
                </div>
                {isEventsDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-[#b09d94] rounded-md mt-1 max-h-60 overflow-auto">
                    {eventsList.map((event) => (
                      <label key={event} className="flex items-center px-3 py-2 hover:bg-gray-100">
                        <input
                          type="checkbox"
                          checked={formData.events.includes(event)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, events: [...formData.events, event] })
                            } else {
                              setFormData({ ...formData, events: formData.events.filter((ev) => ev !== event) })
                            }
                          }}
                          className="mr-2"
                        />
                        {event}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {formData.events.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.events.map((ev) => (
                    <span
                      key={ev}
                      className="flex items-center px-2 py-1 rounded-full text-xs font-serif border border-[#ED695A] text-[#ED695A] bg-[#FDF8F1] whitespace-nowrap"
                    >
                      {ev}
                      <X
                        size={12}
                        className="ml-2 cursor-pointer flex-shrink-0"
                        onClick={() => setFormData({ ...formData, events: formData.events.filter((e) => e !== ev) })}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[#78533F] text-xs font-serif">Auditorium Logo</label>
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.files?.[0] || null }))}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#78533F] text-xs font-serif">Auditorium Seal</label>
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(e) => setFormData((prev) => ({ ...prev, seal: e.target.files?.[0] || null }))}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#78533F] text-xs font-serif">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={inputClass + " pr-10"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[#78533F] text-xs font-serif">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={inputClass + " pr-10"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        )
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex justify-center items-center px-2 py-4 sm:px-4 sm:py-6">
      <Header />

      <div className="flex flex-col lg:flex-row bg-white shadow-xl rounded-xl max-w-4xl w-full overflow-hidden">
        {/* LEFT SIDE - IMAGE WITH OVERLAY TEXT */}
        <div className="hidden lg:flex lg:w-2/5 relative flex-shrink-0">
          <img
            src={tk || "/placeholder.svg"}
            className="w-full h-full object-cover brightness-75"
            alt="Auditorium background"
          />
          <div className="absolute inset-0 p-4 sm:p-6 text-[#78533F] flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-serif">Join as an Auditorium Owner</h2>
            <div className="w-16 h-1 bg-[#ED695A] mb-4"></div>
            <p className="text-base sm:text-lg mb-6 font-serif">
              Showcase your venue to clients with our intuitive platform.
            </p>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 font-serif">Why Register?</h3>
            <ul className="space-y-2 text-sm sm:text-base font-serif">
              <li className="flex items-center">
                <Check size={18} className="mr-2 text-[#ED695A] flex-shrink-0" /> Reach many customers
              </li>
              <li className="flex items-center">
                <Check size={18} className="mr-2 text-[#ED695A] flex-shrink-0" /> Manage bookings easily
              </li>
              <li className="flex items-center">
                <Check size={18} className="mr-2 text-[#ED695A] flex-shrink-0" /> Get featured
              </li>
              <li className="flex items-center">
                <Check size={18} className="mr-2 text-[#ED695A] flex-shrink-0" /> Boost visibility
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full lg:w-3/5 p-4 sm:p-6 flex flex-col">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-[#78533F] font-serif mb-1">
            Auditorium Registration
          </h2>
          <p className="text-center text-[#78533F] mb-4 font-serif text-sm sm:text-base">
            Sign up to manage your auditorium
          </p>

          {/* Progress Bar */}
          <div className="flex items-center justify-center mb-6">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm ${currentStep >= 1 ? "bg-[#ED695A]" : "bg-gray-300"}`}
            >
              1
            </div>
            <div className={`flex-1 h-1 mx-1.5 sm:mx-2 ${currentStep >= 2 ? "bg-[#ED695A]" : "bg-gray-300"}`}></div>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm ${currentStep >= 2 ? "bg-[#ED695A]" : "bg-gray-300"}`}
            >
              2
            </div>
            <div className={`flex-1 h-1 mx-1.5 sm:mx-2 ${currentStep >= 3 ? "bg-[#ED695A]" : "bg-gray-300"}`}></div>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm ${currentStep >= 3 ? "bg-[#ED695A]" : "bg-gray-300"}`}
            >
              3
            </div>
          </div>

          <div className="flex-grow">{renderStepContent()}</div>

          <div className="mt-6 flex gap-2 justify-between">
            {currentStep > 1 && (
              <button
                className="px-4 sm:px-6 py-2 border border-[#b09d94] text-[#78533F] rounded-full hover:bg-gray-100 text-sm sm:text-base"
                onClick={() => setCurrentStep((p) => p - 1)}
              >
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                className="ml-auto px-6 sm:px-8 py-2 bg-[#ED695A] text-white rounded-full hover:bg-[#d55a4a] text-sm sm:text-base"
                onClick={() => {
                  if (currentStep === 1 && isStep1Valid()) setCurrentStep(2)
                  else if (currentStep === 2 && isStep2Valid()) setCurrentStep(3)
                  else toast.error("Please complete the current step")
                }}
              >
                Next
              </button>
            ) : (
              <button
                className="w-full px-6 sm:px-8 py-2 bg-[#ED695A] text-white rounded-full hover:bg-[#d55a4a] flex items-center justify-center text-sm sm:text-base"
                onClick={handleSignup}
                disabled={isSigningUp}
              >
                {isSigningUp ? <Loader2 className="animate-spin mr-2" size={18} /> : "Register"}
              </button>
            )}
          </div>

          <p className="text-center mt-4 text-[#78533F] font-serif text-xs sm:text-sm">
            Already have an account?{" "}
            <a href="/auditorium/login" className="text-[#ED695A] hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xs">
            <h3 className="text-center text-lg sm:text-xl font-bold text-[#78533F] mb-4">Verify OTP</h3>
            <input
              className={inputClass}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
            <button
              className="w-full mt-4 px-6 py-2 bg-[#ED695A] text-white rounded-full hover:bg-[#d55a4a] flex items-center justify-center text-sm sm:text-base"
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditoriumRegistrationPage