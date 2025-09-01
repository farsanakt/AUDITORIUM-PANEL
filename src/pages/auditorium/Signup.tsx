import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import tk from "../../assets/Rectangle 50.png"
import { useNavigate } from "react-router-dom"
import Header from "../../component/user/Header"
import { singUpRequest } from "../../api/userApi"
import { toast } from 'react-toastify'

const AuditoriumRegistrationPage: React.FC = () => {
  const navigate = useNavigate()
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showEventsDropdown, setShowEventsDropdown] = useState(false)
  const [showLocationsDropdown, setShowLocationsDropdown] = useState(false)
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false)
  const [showPanchayatDropdown, setShowPanchayatDropdown] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    auditoriumName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    events: [] as string[],
    locations: [] as string[],
    address: "",
    district: "",
    panchayat: ""
  })

  const eventOptions = [
    { value: "Reception", label: "Reception" },
    { value: "Engagement", label: "Engagement" },
    { value: "Anniversary", label: "Anniversary" },
    { value: "wedding", label: "Wedding" },
    { value: "other", label: "other" },
  ]

  const locationOptions = [
    { value: "Kochi", label: "Kochi" },
    { value: "Trivandrum", label: "Trivandrum" },
    { value: "Kannur", label: "Kannur" },
    { value: "calicut", label: "Calicut" }
  ]

  const districtOptions = [
    { value: "Thiruvananthapuram", label: "Thiruvananthapuram" },
    { value: "Kollam", label: "Kollam" },
    { value: "Pathanamthitta", label: "Pathanamthitta" },
    { value: "Alappuzha", label: "Alappuzha" },
    { value: "Kottayam", label: "Kottayam" },
    { value: "Idukki", label: "Idukki" },
    { value: "Ernakulam", label: "Ernakulam" },
    { value: "Thrissur", label: "Thrissur" },
    { value: "Palakkad", label: "Palakkad" },
    { value: "Malappuram", label: "Malappuram" },
    { value: "Kozhikode", label: "Kozhikode" },
    { value: "Wayanad", label: "Wayanad" },
    { value: "Kannur", label: "Kannur" },
    { value: "Kasaragod", label: "Kasaragod" }
  ]

  // Sample panchayats data (expand with full lists from sources mentioned)
  const panchayatsData: { [key: string]: { value: string; label: string }[] } = {
    "Thiruvananthapuram": [
      { value: "Anjuthengu", label: "Anjuthengu" },
      { value: "Aryanad", label: "Aryanad" },
      // Add more...
    ],
    "Kollam": [
      { value: "Adichanalloor", label: "Adichanalloor" },
      { value: "Alappad", label: "Alappad" },
      // Add more...
    ],
    "Pathanamthitta": [
      { value: "Adoor", label: "Adoor" },
      { value: "Aranmula", label: "Aranmula" },
      // Add more...
    ],
    "Alappuzha": [
      { value: "Arookutty", label: "Arookutty" },
      { value: "Ala", label: "Ala" },
      // Add more...
    ],
    "Kottayam": [
      { value: "Akalakunnam", label: "Akalakunnam" },
      { value: "Ayarkunnam", label: "Ayarkunnam" },
      // Add more...
    ],
    "Idukki": [
      { value: "Adimaly", label: "Adimaly" },
      { value: "Alakode", label: "Alakode" },
      // Add more...
    ],
    "Ernakulam": [
      { value: "Aikaranad", label: "Aikaranad" },
      { value: "Alangad", label: "Alangad" },
      // Add more...
    ],
    "Thrissur": [
      { value: "Adat", label: "Adat" },
      { value: "Alagappanagar", label: "Alagappanagar" },
      // Add more...
    ],
    "Palakkad": [
      { value: "Agali", label: "Agali" },
      { value: "Akathethara", label: "Akathethara" },
      // Add more...
    ],
    "Malappuram": [
      { value: "Alamkode", label: "Alamkode" },
      { value: "Alanallur", label: "Alanallur" },
      // Add more...
    ],
    "Kozhikode": [
      { value: "Arikkulam", label: "Arikkulam" },
      { value: "Azhiyur", label: "Azhiyur" },
      // Add more...
    ],
    "Wayanad": [
      { value: "Ambalavayal", label: "Ambalavayal" },
      { value: "Edavaka", label: "Edavaka" },
      // Add more...
    ],
    "Kannur": [
      { value: "Alakode", label: "Alakode" },
      { value: "Anjarakandy", label: "Anjarakandy" },
      // Add more...
    ],
    "Kasaragod": [
      { value: "Ajanur", label: "Ajanur" },
      { value: "Badiadka", label: "Badiadka" },
      // Add more...
    ]
  }

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

  const handleDistrictSelect = (value: string) => {
    setFormData(prev => ({ ...prev, district: value, panchayat: "" })) // Reset panchayat on district change
    setShowDistrictDropdown(false)
  }

  const handlePanchayatSelect = (value: string) => {
    setFormData(prev => ({ ...prev, panchayat: value }))
    setShowPanchayatDropdown(false)
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
    if (formData.district === "" || formData.panchayat === "") {
      toast.error('Select district and panchayat.')
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

  const selectedPanchayatOptions = formData.district ? panchayatsData[formData.district] || [] : []

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center px-4 py-6 box-border">
      <Header />
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto box-border my-8 mx-auto">
        {/* Left Section */}
        <div className="md:w-1/2 hidden md:block relative h-64 md:h-auto">
          <div className="relative w-full h-full">
            <img
              src={tk}
              alt="Auditorium Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1519167758481-83f550bb2953";
              }}
            />
            <div className="absolute inset-0 bg-opacity-40">
              <div className="p-4 sm:p-6 h-full flex flex-col justify-between">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-[#ED695A] text-xl font-bold font-serif">TK</span>
                  </div>
                  <h2 className="text-[#78533F] text-lg md:text-2xl font-bold mb-1 font-serif">Join as an Auditorium Owner</h2>
                  <div className="w-16 h-1 bg-[#ED695A] mx-auto mb-1"></div>
                </div>
                <p className="text-white text-xs md:text-sm text-center px-2 font-serif">
                  Showcase your venue to clients with our intuitive platform.
                </p>
                <div className="p-2 rounded-xl backdrop-blur-sm">
                  <p className="text-[#ED695A] font-bold text-sm md:text-base mb-2 text-center font-serif">Why Register?</p>
                  <ul className="text-white text-xs md:text-sm space-y-2 font-serif">
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Reach many customers</li>
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Manage bookings easily</li>
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Get featured</li>
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Boost visibility</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="md:w-1/2 p-4 sm:p-6 flex justify-center items-start">
          <div className="w-full max-w-md">
            <div className="text-center mb-4">
              <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif">Auditorium Registration</h2>
              <p className="text-gray-600 text-sm mt-1 font-serif">Sign up to manage your auditorium</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="auditoriumName" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Auditorium Name</label>
                  <input
                    type="text"
                    id="auditoriumName"
                    name="auditoriumName"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-xs sm:text-sm"
                    value={formData.auditoriumName}
                    onChange={handleChange}
                    placeholder="Enter auditorium name"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="ownerName" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Owner Name</label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-xs sm:text-sm"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Enter owner name"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-xs sm:text-sm"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-xs sm:text-sm"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Events</label>
                  <div className="relative">
                    <div
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full bg-white text-xs sm:text-sm cursor-pointer flex items-center justify-between"
                      onClick={() => setShowEventsDropdown(!showEventsDropdown)}
                    >
                      <span className={formData.events.length > 0 ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                        {formData.events.length > 0 ? formData.events.join(", ") : "Select events"}
                      </span>
                      <span className="text-[#78533F]">&#9662;</span>
                    </div>
                    {showEventsDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#b09d94] rounded-md shadow-lg max-h-28 overflow-y-auto">
                        {eventOptions.map(option => (
                          <label
                            key={option.value}
                            className="flex items-center space-x-2 p-1.5 hover:bg-[#FDF8F1] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              name="events"
                              value={option.value}
                              checked={formData.events.includes(option.value)}
                              onChange={handleChange}
                              className="h-3.5 w-3.5 text-[#ED695A] border-[#b09d94] rounded focus:ring-2 focus:ring-[#ED695A]"
                            />
                            <span className="text-[#3C3A39] text-xs sm:text-sm font-serif">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Locations</label>
                  <div className="relative">
                    <div
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full bg-white text-xs sm:text-sm cursor-pointer flex items-center justify-between"
                      onClick={() => setShowLocationsDropdown(!showLocationsDropdown)}
                    >
                      <span className={formData.locations.length > 0 ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                        {formData.locations.length > 0 ? formData.locations.join(", ") : "Select locations"}
                      </span>
                      <span className="text-[#78533F]">&#9662;</span>
                    </div>
                    {showLocationsDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#b09d94] rounded-md shadow-lg max-h-28 overflow-y-auto">
                        {locationOptions.map(option => (
                          <label
                            key={option.value}
                            className="flex items-center space-x-2 p-1.5 hover:bg-[#FDF8F1] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              name="locations"
                              value={option.value}
                              checked={formData.locations.includes(option.value)}
                              onChange={handleChange}
                              className="h-3.5 w-3.5 text-[#ED695A] border-[#b09d94] rounded focus:ring-2 focus:ring-[#ED695A]"
                            />
                            <span className="text-[#3C3A39] text-xs sm:text-sm font-serif">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="address" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-xs sm:text-sm"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">District</label>
                  <div className="relative">
                    <div
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full bg-white text-xs sm:text-sm cursor-pointer flex items-center justify-between"
                      onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
                    >
                      <span className={formData.district ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                        {formData.district || "Select district"}
                      </span>
                      <span className="text-[#78533F]">&#9662;</span>
                    </div>
                    {showDistrictDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#b09d94] rounded-md shadow-lg max-h-28 overflow-y-auto">
                        {districtOptions.map(option => (
                          <div
                            key={option.value}
                            className="p-1.5 hover:bg-[#FDF8F1] cursor-pointer text-[#3C3A39] text-xs sm:text-sm font-serif"
                            onClick={() => handleDistrictSelect(option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Panchayat</label>
                  <div className="relative">
                    <div
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full bg-white text-xs sm:text-sm cursor-pointer flex items-center justify-between"
                      onClick={() => formData.district && setShowPanchayatDropdown(!showPanchayatDropdown)}
                    >
                      <span className={formData.panchayat ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                        {formData.panchayat || (formData.district ? "Select panchayat" : "Select district first")}
                      </span>
                      <span className="text-[#78533F]">&#9662;</span>
                    </div>
                    {showPanchayatDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#b09d94] rounded-md shadow-lg max-h-28 overflow-y-auto">
                        {selectedPanchayatOptions.map(option => (
                          <div
                            key={option.value}
                            className="p-1.5 hover:bg-[#FDF8F1] cursor-pointer text-[#3C3A39] text-xs sm:text-sm font-serif"
                            onClick={() => handlePanchayatSelect(option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-3.5 w-3.5 text-[#ED695A] border-[#b09d94] rounded focus:ring-2 focus:ring-[#ED695A]"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-xs sm:text-sm text-gray-600 font-serif">
                  I agree to the <span className="text-[#ED695A] hover:underline cursor-pointer">Terms of Service</span>{" "}
                  and <span className="text-[#ED695A] hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-[#ED695A] text-white font-semibold py-2 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif"
              >
                Register
              </button>
            </form>
            <div className="text-center mt-3">
              <p className="text-gray-600 text-xs sm:text-sm font-serif">
                Already have an account?{" "}
                <button onClick={handleLogin} className="text-[#ED695A] font-medium hover:underline hover:text-[#d85c4e] font-serif">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
            <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#78533F] mb-3 font-serif">Verify OTP</h2>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                maxLength={6}
              />
              <div className="mt-3 flex justify-end">
                <button
                  className="bg-[#ED695A] text-white px-4 py-1.5 rounded-full hover:bg-[#d85c4e] font-serif"
                  onClick={handleOtpModal}
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditoriumRegistrationPage