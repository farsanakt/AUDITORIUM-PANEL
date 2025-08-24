
import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import tk from '../../assets/Honeymoon-pana.png'
import { useNavigate } from "react-router-dom"
import Header from "../../component/user/Header"
import { userSingUpRequest } from "../../api/userApi"
import { toast } from 'react-toastify'

const UserRegistrationPage: React.FC = () => {
  const navigate = useNavigate()
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleOtpModal = async () => {
    setShowOtpModal(false)
    navigate('/login')
  }

  const handleSignup = async () => {
    const response = await userSingUpRequest(formData)
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
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <Header />
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] my-8 mx-auto">
        <div className="md:w-2/5 hidden md:block relative h-[400px] md:h-auto">
          <img src={tk} alt="Auditorium Preview" className="w-full h-full object-cover absolute inset-0" />
          <div className="absolute inset-0 bg-opacity-40 p-4 flex flex-col justify-between">
            <div className="text-center mt-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-[#ED695A] text-2xl font-bold font-serif">TK</span>
              </div>
              <h2 className="text-[#78533F] text-xl md:text-2xl font-bold font-serif mb-2">Create New Account</h2>
              <div className="w-16 h-1 bg-[#ED695A] mx-auto mb-2"></div>
            </div>
            <div className="mb-4">
              <p className="text-[#3C3A39] text-sm md:text-base text-center px-2 font-serif">
                Join our platform and start showcasing your auditorium to potential clients today.
              </p>
            </div>
            <div className="bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <p className="text-[#ED695A] font-bold text-base md:text-lg mb-2 text-center font-serif">Benefits of registering</p>
              <ul className="text-[#3C3A39] text-xs md:text-sm space-y-2 font-serif">
                <li className="flex items-center">
                  <span className="mr-2 text-[#ED695A]">✦</span>
                  <span>Reach thousands of potential customers</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-[#ED695A]">✦</span>
                  <span>Easy booking management system</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-[#ED695A]">✦</span>
                  <span>Get featured in our recommended venues</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-[#ED695A]">✦</span>
                  <span>Increase your venue's visibility online</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="md:w-3/5 p-4 sm:p-6 flex justify-center items-start bg-white">
          <div className="w-full max-w-md py-4">
            <div className="text-center mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#78533F] font-serif">USER REGISTRATION</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="firstName" className="text-left block text-[#78533F] font-medium text-sm font-serif">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="lastName" className="text-left block text-[#78533F] font-medium text-sm font-serif">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-left block text-[#78533F] font-medium text-sm font-serif">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-left block text-[#78533F] font-medium text-sm font-serif">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="password" className="text-left block text-[#78533F] font-medium text-sm font-serif">
                      Password
                    </label>
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
                    <label htmlFor="confirmPassword" className="text-left block text-[#78533F] font-medium text-sm font-serif">
                      Confirm Password
                    </label>
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
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-[#b09d94] rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 font-serif">
                  I agree to the <span className="text-[#ED695A] hover:underline cursor-pointer">Terms of Service</span>{" "}
                  and <span className="text-[#ED695A] hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ED695A] text-white font-semibold py-2 rounded-full shadow hover:bg-[#d85c4e] transition-all duration-300 font-serif"
              >
                Register Auditorium
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm font-serif">
                Already registered?{" "}
                <button onClick={handleLogin} className="text-[#ED695A] font-medium hover:underline">
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>

        {showOtpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-xs sm:max-w-sm">
              <h2 className="text-lg sm:text-xl font-bold text-[#6D4C41] mb-3 font-serif">Enter OTP</h2>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
              />
              <div className="mt-3 flex justify-end">
                <button
                  className="bg-[#EB5E28] text-white px-3 py-1.5 rounded-full hover:bg-[#d44f1f] font-serif"
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

export default UserRegistrationPage