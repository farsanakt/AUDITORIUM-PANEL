"use client"

import type React from "react"
import { useState } from "react"
import tk from '../../assets/Rectangle 50.png'
import { useNavigate } from "react-router-dom"

const AuditoriumRegistrationPage: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    auditoriumName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    district: "",
    city: "",
    pin: "",
    capacity: "",
    pricePerDay: "",
    description: "",
    images: [] as File[],
    facilities: {
      parking: false,
      ac: false,
      stage: false,
      catering: false,
      wifi: false,
      soundSystem: false,
      lighting: false,
      securityService: false,
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      facilities: {
        ...formData.facilities,
        [name]: checked
      }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5)
      setFormData({
        ...formData,
        images: filesArray
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Registration data:", formData)
    // Add registration logic here
  }

  const handleLogin = () => {
    navigate('/')
  }

  return (
    <div className="fixed inset-0 bg-[#FDF8F1] flex items-center justify-center">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-7xl h-full  md:max-h-[90vh]">
        {/* Left Content Section */}
        <div className="md:w-2/5 relative hidden md:block">
          <div className="relative h-full">
            <img
              src={tk}
              alt="Auditorium Preview"
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-opacity-40">
              <div className="p-8 h-full flex flex-col justify-between">
                {/* Top section with logo and heading */}
                <div className="text-center mb-6 mt-8">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#ED695A] text-3xl font-bold">TK</span>
                  </div>
                  <h2 className="text-[#78533F] text-3xl md:text-4xl font-bold mb-3 tracking-wide">Register Your Auditorium</h2>
                  <div className="w-24 h-1 bg-[#ED695A] mx-auto mb-3"></div>
                </div>

                {/* Middle section with description */}
                <div className="mb-6">
                  <p className="text-[#3C3A39] text-lg mb-6 leading-relaxed text-center px-4">
                    Join our platform and start showcasing your auditorium to potential clients today.
                  </p>
                </div>

                {/* Bottom section with benefits */}
                <div className="bg-opacity-20 p-6 rounded-lg backdrop-blur-sm mb-8">
                  <p className="text-[#ED695A] font-bold text-xl mb-4 text-center">Benefits of registering</p>
                  <ul className="text-[#3C3A39] space-y-3">
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
          </div>
        </div>

        {/* Right Registration Form Section */}
        <div className="md:w-3/5 p-4 md:p-6 flex justify-center items-start bg-white overflow-y-auto h-full">
          <div className="w-full max-w-3xl py-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#78533F]">AUDITORIUM REGISTRATION</h2>
              <p className="text-gray-600 mt-2">Fill in the details below to register your auditorium</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-[#78533F] font-semibold mb-3 border-b border-gray-200 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="auditoriumName" className="text-left block text-[#78533F] font-medium text-sm">
                      Auditorium Name*
                    </label>
                    <input
                      type="text"
                      id="auditoriumName"
                      name="auditoriumName"
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      value={formData.auditoriumName}
                      onChange={handleChange}
                      placeholder="Enter auditorium name"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="ownerName" className="text-left block text-[#78533F] font-medium text-sm">
                      Owner Name*
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Enter owner name"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-left block text-[#78533F] font-medium text-sm">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-left block text-[#78533F] font-medium text-sm">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="text-left block text-[#78533F] font-medium text-sm">
                      Password*
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-[#78533F] font-semibold mb-3 border-b border-gray-200 pb-2">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="district" className="text-left block text-[#78533F] font-medium text-sm">
                      District*
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Enter district"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="city" className="text-left block text-[#78533F] font-medium text-sm">
                      City*
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="pin" className="text-left block text-[#78533F] font-medium text-sm">
                      PIN Code*
                    </label>
                    <input
                      type="text"
                      id="pin"
                      name="pin"
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      value={formData.pin}
                      onChange={handleChange}
                      placeholder="Enter PIN code"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Auditorium Details Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-[#78533F] font-semibold mb-3 border-b border-gray-200 pb-2">Auditorium Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="capacity" className="text-left block text-[#78533F] font-medium text-sm">
                      Capacity (number of people)*
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="Enter seating capacity"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="pricePerDay" className="text-left block text-[#78533F] font-medium text-sm">
                      Price per day (₹)*
                    </label>
                    <input
                      type="number"
                      id="pricePerDay"
                      name="pricePerDay"
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      placeholder="Enter price per day"
                      required
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="description" className="text-left block text-[#78533F] font-medium text-sm">
                      Description*
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your auditorium"
                      required
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="images" className="text-left block text-[#78533F] font-medium text-sm">
                      Upload Images (max 5)*
                    </label>
                    <input
                      type="file"
                      id="images"
                      name="images"
                      accept="image/*"
                      multiple
                      className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent transition-all duration-200"
                      onChange={handleImageChange}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">You can upload up to 5 images</p>
                  </div>
                </div>
              </div>

              {/* Facilities Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-[#78533F] font-semibold mb-3 border-b border-gray-200 pb-2">Facilities Offered</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center">
                    <input
                      id="parking"
                      name="parking"
                      type="checkbox"
                      className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-gray-300 rounded"
                      checked={formData.facilities.parking}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="parking" className="ml-2 block text-sm text-gray-700">
                      Parking
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="ac"
                      name="ac"
                      type="checkbox"
                      className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-gray-300 rounded"
                      checked={formData.facilities.ac}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="ac" className="ml-2 block text-sm text-gray-700">
                      Air Conditioning
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="stage"
                      name="stage"
                      type="checkbox"
                      className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-gray-300 rounded"
                      checked={formData.facilities.stage}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="stage" className="ml-2 block text-sm text-gray-700">
                      Stage
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="catering"
                      name="catering"
                      type="checkbox"
                      className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-gray-300 rounded"
                      checked={formData.facilities.catering}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="catering" className="ml-2 block text-sm text-gray-700">
                      Catering
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="wifi"
                      name="wifi"
                      type="checkbox"
                      className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-gray-300 rounded"
                      checked={formData.facilities.wifi}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="wifi" className="ml-2 block text-sm text-gray-700">
                      WiFi
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="soundSystem"
                      name="soundSystem"
                      type="checkbox"
                      className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-gray-300 rounded"
                      checked={formData.facilities.soundSystem}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="soundSystem" className="ml-2 block text-sm text-gray-700">
                      Sound System
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="lighting"
                      name="lighting"
                      type="checkbox"
                      className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-gray-300 rounded"
                      checked={formData.facilities.lighting}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="lighting" className="ml-2 block text-sm text-gray-700">
                      Lighting
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="securityService"
                      name="securityService"
                      type="checkbox"
                      className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-gray-300 rounded"
                      checked={formData.facilities.securityService}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="securityService" className="ml-2 block text-sm text-gray-700">
                      Security Service
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <span className="text-[#ED695A] hover:underline cursor-pointer">Terms of Service</span>{" "}
                  and <span className="text-[#ED695A] hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ED695A] text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-[#d85c4e] transform hover:scale-[1.02] transition-all duration-300 mt-6"
              >
                Register Auditorium
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already registered?{" "}
                <button onClick={handleLogin} className="text-[#ED695A] font-medium hover:underline transition-all">
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuditoriumRegistrationPage