import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../component/user/Header"
import { vendorSingUpRequest, getItems } from "../../api/userApi"
import tk from "../../assets/k.png"
import { toast } from 'react-toastify'

const VendorRegistration: React.FC = () => {
  const navigate = useNavigate()
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [vendorTypes, setVendorTypes] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: "",
    vendortype: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    confirmPassword: "",
  })

  // Fetch vendor types from backend
  const fetchVendorTypes = async () => {
    try {
      const response = await getItems('hi') // Assuming 'hi' is used to fetch admin items including vendor types
      console.log("Admin items response:", response.data)

      if (response.data?.success && response.data?.items?.vendorTypes) {
        const types = response.data.items.vendorTypes
          .filter((type: string) => type && type.trim())
          .sort()
        setVendorTypes(types)
      }
    } catch (error) {
      console.error("Error fetching vendor types:", error)
      // Fallback to static list if API fails
      setVendorTypes([
        "Caterer",
        "Photographer",
        "Decorator",
        "Event Planner",
        "Venue Provider",
        "Entertainer"
      ])
    }
  }

  useEffect(() => {
    fetchVendorTypes()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleOtpModal = async () => {
    setShowOtpModal(false)
    navigate('/vendor/login')
  }

  const handleSignup = async () => {
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    if (!formData.vendortype) {
      toast.error("Please select a vendor type.")
      return
    }

    try {
      const response = await vendorSingUpRequest(formData)
      if (response.data.success === false) {
        toast.error(response.data.message || 'Signup failed!')
      } else {
        toast.success(response.data.message || "OTP sent to your email")
        setShowOtpModal(true)
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      toast.error(error.response?.data?.message || "Error during signup")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSignup()
  }

  const handleLogin = () => {
    navigate('/vendor/login')
  }

  return (
    <div className="min-h-screen h-screen flex flex-col items-center justify-center px-4 py-6 box-border">
      <Header />
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto box-border">
        {/* Form Section */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto space-y-5">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#78533F]">Vendor Registration</h2>
              <p className="text-sm text-gray-600 mt-1">Start your vendor journey today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-[#78533F] font-medium text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-sm"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="vendortype" className="block text-[#78533F] font-medium text-sm">
                    Vendor Type
                  </label>
                  <select
                    id="vendortype"
                    name="vendortype"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-sm"
                    value={formData.vendortype}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select vendor type</option>
                    {vendorTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-[#78533F] font-medium text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-sm"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-[#78533F] font-medium text-sm">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-sm"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-[#78533F] font-medium text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-sm"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-[#78533F] font-medium text-sm">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-sm"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="address" className="block text-[#78533F] font-medium text-sm">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-sm"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-[#b09d94] rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                  I agree to the <span className="text-[#ED695A] hover:underline cursor-pointer">Terms of Service</span>{" "}
                  and <span className="text-[#ED695A] hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#78533F] text-white font-semibold py-2 rounded-full shadow-md hover:bg-[#634331] transition-all duration-300"
              >
                Register as Vendor
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="text-gray-600 text-sm">
                Already a vendor?{" "}
                <button onClick={handleLogin} className="text-[#ED695A] font-medium hover:underline">
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="md:w-1/2 p-6 sm:p-8 bg-[#78533F] text-white flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto space-y-5">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold">Join as a Vendor</h2>
              <p className="text-sm mt-2">Elevate your business with our platform</p>
            </div>
            <div className="space-y-4">
              <p className="font-semibold text-lg">Why Register?</p>
              <ul className="text-sm space-y-3">
                <li className="flex items-center">
                  <span className="mr-2 text-[#ED695A]">Check</span>
                  <span>Connect with thousands of clients</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-[#ED695A]">Check</span>
                  <span>Streamline your booking process</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-[#ED695A]">Check</span>
                  <span>Showcase your services elegantly</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-[#ED695A]">Check</span>
                  <span>Boost your online visibility</span>
                </li>
              </ul>
            </div>
            <div className="mt-4">
              <img
                src={tk}
                alt="Vendor Preview"
                className="w-full h-48 object-cover rounded-md shadow-md"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1519167758481-83f550bb2953"
                }}
              />
            </div>
          </div>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-xs">
              <h2 className="text-lg font-bold text-[#78533F] mb-3">Verify OTP</h2>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
              />
              <div className="mt-3 flex justify-end">
                <button
                  className="bg-[#78533F] text-white px-4 py-1.5 rounded-full hover:bg-[#634331]"
                  onClick={handleOtpModal}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VendorRegistration