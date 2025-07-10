"use client"

import type React from "react"
import { useState } from "react"
import tk from '../../assets/Rectangle 50.png'
import { useNavigate } from "react-router-dom"
import Header from "../../component/user/Header"
import { userSingUpRequest } from "../../api/userApi"
import { toast } from 'react-toastify';




const UserRegistrationPage: React.FC = () => {
  const navigate = useNavigate()
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword:"",
    // district: "",
    // city: "",
    // pin: "",
    // capacity: "",
    // pricePerDay: "",
    // description: "",
    // images: [] as File[],
    // facilities: {
    //   parking: false,
    //   ac: false,
    //   stage: false,
    //   catering: false,
    //   wifi: false,
    //   soundSystem: false,
    //   lighting: false,
    //   securityService: false,
    // }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleOtpModal=async()=>{

     setShowOtpModal(false)
     navigate('/')

  }

const handleSignup = async () => {
  const response = await userSingUpRequest(formData);

  if (response.data.success === false) {
    toast.error(response.data.message || 'Signup failed!');
  } else {
    // toast.success('Signup successful!');
    setShowOtpModal(true);
   
  }
};



  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    setFormData({
      ...formData,
      // facilities: {
      //   ...formData.facilities,
      //   [name]: checked
      // }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5)
      setFormData({
        ...formData,
        // images: filesArray
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Registration data:", formData)
    
  }

  const handleLogin = () => {
    navigate('/')
  }

  return (
    <div className="fixed inset-0 bg-[#FDF8F1] flex items-center justify-center">
      <Header/>
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-7xl h-full  md:max-h-[90vh]">
       
        <div className="md:w-2/5 relative hidden md:block ">
          <div className="relative h-full ">
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
        <div className="md:w-3/5 p-4 md:p-6 flex justify-center items-start bg-white  h-full">
          <div className="w-full max-w-3xl py-4">
            <div className="text-center mb-6">
              
              <p className="text-gray-600 mt-12"> </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#78533F]">AUDITORIUM REGISTRATION</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                {/* <h3 className="text-[#78533F] font-semibold mb-3 border-b border-[#b09d94] pb-2">Basic Information</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="firstName" className="text-left block text-[#78533F] font-medium text-sm">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full pl-4 pr-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553]  focus:border-transparent transition-all duration-200"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="lastName" className="text-left block text-[#78533F] font-medium text-sm">
                      last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full pl-4 pr-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553]  focus:border-transparent transition-all duration-200"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
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
                      className="w-full pl-4 pr-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553]  focus:border-transparent transition-all duration-200"
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
                      className="w-full pl-4 pr-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553]  focus:border-transparent transition-all duration-200"
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
                      className="w-full pl-4 pr-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553]  focus:border-transparent transition-all duration-200"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                 <div className="space-y-1">
                <label htmlFor="confirmpassword" className="text-left block text-[#78533F] font-medium text-sm">
                  Confirm Password*
                </label>
                <input
                  type="password"
                  id="confirmpassword"
                  name="confirmPassword" 
                  className="w-full pl-4 pr-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553]  focus:border-transparent transition-all duration-200"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
                </div>
              </div>



              <div className="flex items-center mt-4">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-[#ED695A] focus:ring-[#876553]  border-[#b09d94] rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <span className="text-[#ED695A] hover:underline cursor-pointer">Terms of Service</span>{" "}
                  and <span className="text-[#ED695A] hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                onClick={handleSignup}
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
        {showOtpModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-[#6D4C41] mb-4">Enter OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        className="w-full px-4 py-2 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#876553]"
      />
      <div className="mt-4 flex justify-end">
        <button
          className="bg-[#EB5E28] text-white px-4 py-2 rounded hover:bg-[#d44f1f]"
          onClick={() =>handleOtpModal()}
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