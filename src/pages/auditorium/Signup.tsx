"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Loader2, X, Check, Upload, MapPin, Calendar, Lock } from "lucide-react"
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
  })

  // Mock Districts (Kerala)
  const districts = [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur",
    "Kasaragod", "Kollam", "Kottayam", "Kozhikode",
    "Malappuram", "Palakkad", "Pathanamthitta",
    "Thiruvananthapuram", "Thrissur", "Wayanad",
  ]

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await getItems('hi') 
      if (response.data?.success && response.data?.items?.events) {
        const events = response.data.items.events
          .filter((type: string) => type && type.trim())
          .sort()
        setEventsList(events)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
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
  const isStep3Valid = () => formData.password && formData.confirmPassword && formData.logo && formData.seal

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
      if (formData.logo) signupData.append("logo", formData.logo)
      if (formData.seal) signupData.append("seal", formData.seal)

      const res = await singUpRequest(signupData)
       if (res.data.success) {
          toast.success(res.data.message);
          setShowOtpModal(true); // Assuming API flow sends OTP on Signup directly or navigates
          // If the backend sends an OTP and we need to verify right here without navigating: 
          // Uncomment below if navigation is not immediate but OTP verification is required first
          // navigate("/auditorium/login"); // If direct login without OTP modal via API response logic
          // Based on original code: navigate("/auditorium/login") was called.
          // Adjusting to show OTP modal if that is the flow, OR navigate if verify is separate.
          // Original: navigate("/auditorium/login"); 
          // New Plan: Maintain original logic -> Navigate to Login
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

  /* ---------------- UI ---------------- */

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10 w-full max-w-md mx-auto">
       {[1, 2, 3].map((step) => (
         <div key={step} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                ${currentStep >= step ? "bg-[#ED695A] text-white shadow-lg shadow-[#ED695A]/30" : "bg-gray-100 text-gray-400"}
              `}
            >
              {currentStep > step ? <Check size={20} /> : step}
            </div>
            {step < 3 && (
              <div 
                className={`w-16 h-1 mx-2 transition-all duration-300 rounded-full
                  ${currentStep > step ? "bg-[#ED695A]" : "bg-gray-100"}
                `}
              />
            )}
         </div>
       ))}
    </div>
  )

  const renderStepContent = () => {
    const inputBaseClass = "w-full px-5 py-3.5 bg-gray-50 border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#ED695A]/20 focus:border-[#ED695A] transition-all outline-none"
    const labelClass = "block text-sm font-medium text-gray-700 mb-1.5 ml-1"

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 animate-fade-in-up">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className={labelClass}>Auditorium Name</label>
                <input
                  className={inputBaseClass}
                  placeholder="e.g. Grand Convention Center"
                  value={formData.auditoriumName}
                  onChange={(e) => setFormData({ ...formData, auditoriumName: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Owner Name</label>
                <input
                  className={inputBaseClass}
                  placeholder="Full Name"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      className={inputBaseClass}
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                 </div>
                 <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      className={inputBaseClass}
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                 </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-fade-in-up">
             <div>
               <label className={labelClass}>Full Address</label>
               <textarea
                 className={`${inputBaseClass} min-h-[100px] resize-none`}
                 placeholder="Street, City, Zip Code"
                 value={formData.address}
                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
               />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                  <label className={labelClass}>District</label>
                  <select
                    className={inputBaseClass}
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value, locations: [] })}
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
               </div>
               <div>
                  <label className={labelClass}>Supported Events</label>
                  <div className="relative">
                    <button
                      className={`${inputBaseClass} text-left flex justify-between items-center`}
                      onClick={() => setIsEventsDropdownOpen(!isEventsDropdownOpen)}
                    >
                      <span className="truncate text-gray-500">
                        {formData.events.length > 0 ? `${formData.events.length} Selected` : "Select Events"}
                      </span>
                      <Calendar size={18} className="text-gray-400" />
                    </button>
                    
                    {isEventsDropdownOpen && (
                       <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-auto p-2">
                         {eventsList.map((event) => (
                           <label key={event} className="flex items-center px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                             <input
                               type="checkbox"
                               checked={formData.events.includes(event)}
                               onChange={(e) => {
                                 const updated = e.target.checked 
                                   ? [...formData.events, event]
                                   : formData.events.filter(ev => ev !== event);
                                 setFormData({ ...formData, events: updated });
                               }}
                               className="w-4 h-4 text-[#ED695A] border-gray-300 rounded focus:ring-[#ED695A]"
                             />
                             <span className="ml-3 text-sm text-gray-700">{event}</span>
                           </label>
                         ))}
                       </div>
                    )}
                  </div>
               </div>
             </div>

             {formData.events.length > 0 && (
                <div className="flex flex-wrap gap-2">
                   {formData.events.map((ev) => (
                     <span key={ev} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#ED695A]/10 text-[#ED695A] border border-[#ED695A]/20">
                        {ev}
                        <X size={14} className="ml-1.5 cursor-pointer hover:text-[#d85849]" onClick={() => setFormData({ ...formData, events: formData.events.filter((e) => e !== ev) })} />
                     </span>
                   ))}
                </div>
             )}

             <div>
                <label className={labelClass}>Locations (in {formData.district})</label>
                <div className="bg-white rounded-xl">
                   <LocationAutocomplete
                      value=""
                      placeholder="Search and add locations..."
                      onSelect={handleLocationSelect}
                      className={inputBaseClass}
                   />
                </div>
                {formData.locations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                     {formData.locations.map((loc) => (
                       <span key={loc.name} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-white border border-gray-200 shadow-sm text-gray-700">
                          <MapPin size={12} className="mr-1.5 text-gray-400" />
                          {loc.name}
                          <X size={14} className="ml-2 cursor-pointer text-gray-400 hover:text-red-500" onClick={() => removeLocation(loc.name)} />
                       </span>
                     ))}
                  </div>
                )}
             </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-6 text-center hover:bg-gray-100 transition duration-300 group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-[#ED695A]">
                     <Upload size={20} />
                  </div>
                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-gray-900 block mb-1">Upload Logo</span>
                    <span className="text-xs text-gray-500">JPG, PNG up to 5MB</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })} />
                  </label>
                  {formData.logo && <p className="text-xs text-green-600 mt-2 font-medium break-all">{formData.logo.name}</p>}
               </div>

               <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-6 text-center hover:bg-gray-100 transition duration-300 group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-[#ED695A]">
                     <Upload size={20} />
                  </div>
                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-gray-900 block mb-1">Upload Seal</span>
                    <span className="text-xs text-gray-500">Official Seal Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setFormData({ ...formData, seal: e.target.files?.[0] || null })} />
                  </label>
                  {formData.seal && <p className="text-xs text-green-600 mt-2 font-medium break-all">{formData.seal.name}</p>}
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
               <div className="relative">
                  <label className={labelClass}>Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`${inputBaseClass} pr-12`}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    className="absolute right-4 top-[34px] text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
               </div>
               <div className="relative">
                  <label className={labelClass}>Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`${inputBaseClass} pr-12`}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button 
                    className="absolute right-4 top-[34px] text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
               </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4">
         <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[550px] border border-gray-100">
            
            {/* Left Side: Branding */}
            <div className="hidden lg:block w-5/12 relative">
               <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${tk || "/placeholder.svg"})` }}></div>
               <div className="absolute inset-0 bg-[#78533F]/90 flex flex-col justify-center p-8 text-white">
                  <h2 className="text-2xl font-bold font-serif mb-4 leading-tight">Partner With Us</h2>
                  <p className="text-white/80 text-sm mb-8 leading-relaxed">Join our network of premium auditoriums.</p>
                  
                  <div className="space-y-6">
                     <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-[#ED695A]/20 flex items-center justify-center mt-1 mr-4 border border-[#ED695A]/30 text-[#ED695A]">1</div>
                        <div>
                           <h4 className="font-bold text-lg mb-1">Create Profile</h4>
                           <p className="text-sm text-white/60">Set up your venue details</p>
                        </div>
                     </div>
                     <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-[#ED695A]/20 flex items-center justify-center mt-1 mr-4 border border-[#ED695A]/30 text-[#ED695A]">2</div>
                        <div>
                           <h4 className="font-bold text-lg mb-1">Add Location</h4>
                           <p className="text-sm text-white/60">Pinpoint your venue on the map</p>
                        </div>
                     </div>
                     <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-[#ED695A]/20 flex items-center justify-center mt-1 mr-4 border border-[#ED695A]/30 text-[#ED695A]">3</div>
                        <div>
                           <h4 className="font-bold text-lg mb-1">Get Verified</h4>
                           <p className="text-sm text-white/60">Upload documents and start listing</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
               <div className="max-w-2xl mx-auto w-full">
                  <div className="text-center mb-10">
                     <h2 className="text-3xl font-bold text-[#78533F] font-serif mb-2">Auditorium Registration</h2>
                     <p className="text-gray-500">Complete the form below to register your venue</p>
                  </div>

                  {renderStepIndicator()}

                  <div className="min-h-[400px] flex flex-col justify-between">
                     {renderStepContent()}

                     {/* Navigation Buttons */}
                     <div className="flex items-center justify-between pt-8 mt-4 border-t border-gray-100">
                        {currentStep > 1 ? (
                           <button
                             onClick={() => setCurrentStep(prev => prev - 1)}
                             className="px-8 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition"
                           >
                             Back
                           </button>
                        ) : (
                           <div></div> // Spacer
                        )}

                        {currentStep < 3 ? (
                           <button
                             onClick={() => {
                                if (currentStep === 1 && isStep1Valid()) setCurrentStep(2)
                                else if (currentStep === 2 && isStep2Valid()) setCurrentStep(3)
                                else toast.error("Please complete the current step")
                             }}
                             className="px-8 py-3 bg-[#ED695A] hover:bg-[#d85849] text-white rounded-xl font-bold shadow-lg shadow-[#ED695A]/25 transition hover:-translate-y-0.5"
                           >
                             Continue
                           </button>
                        ) : (
                           <button
                             onClick={handleSignup}
                             disabled={isSigningUp}
                             className="px-10 py-3 bg-[#ED695A] hover:bg-[#d85849] text-white rounded-xl font-bold shadow-lg shadow-[#ED695A]/25 transition hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                           >
                             {isSigningUp ? <Loader2 className="animate-spin mr-2" /> : "Complete Registration"}
                           </button>
                        )}
                     </div>
                  </div>

                  <p className="text-center mt-8 text-gray-500 text-sm">
                     Already have an account? 
                     <a href="/auditorium/login" className="text-[#ED695A] font-bold ml-1 hover:underline">Sign In</a>
                  </p>
               </div>
            </div>

         </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up text-center">
            <h3 className="text-xl font-bold text-[#78533F] mb-4">Verify Phone Number</h3>
            <p className="text-gray-500 text-sm mb-6">Enter the code sent to your mobile</p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 border-b-2 border-gray-200 focus:border-[#ED695A] outline-none bg-transparent mb-6"
              placeholder="000000"
            />
            <button
               className="w-full py-3 bg-[#ED695A] text-white font-bold rounded-xl hover:bg-[#d85849] transition disabled:opacity-50"
               onClick={handleVerifyOtp}
               disabled={isVerifyingOtp}
            >
               {isVerifyingOtp ? "Verifying..." : "Verify & Login"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditoriumRegistrationPage