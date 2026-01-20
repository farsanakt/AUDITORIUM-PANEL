"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../../component/user/Header"
import Lines from "../../assets/Group 52 (1).png"
import Bshape from "../../assets/02 2.png"
import { singleVendorDetails, createVendorInquiry, createVendorReview } from "../../api/userApi"
import Swal from 'sweetalert2'
import { Eye, EyeOff } from 'lucide-react'
import Footer from "../../component/user/Footer"

interface Vendor {
  _id: string
  name: string
  address: string
  phone: string
  advAmnt: string
  altPhone: string
  cancellationPolicy: string
  cities: string[]
  email: string
  images: string[]
  pincode: string
  timeSlots: { label: string; startTime: string; endTime: string }[]
  startingPrice: string
  vendorType: string
  about?: string
  summary?: string
  reviews?: { name: string; email: string; rating: number; comment: string }[]
}

interface InquiryData {
  vendorId: string
  name: string
  email: string
  contact: string
  eventDate: string,
  eventType: string,
  message: string,
  notification: string
}

interface ReviewData {
  vendorId: string
  name: string
  email: string
  rating: number
  comment: string
}

const VendorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [inquiryFormData, setInquiryFormData] = useState({
    name: "",
    email: "",
    contact: "",
    eventDate: "",
    eventType: "",
    message: "",
    notification: "",
  })
  const [reviewFormData, setReviewFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    comment: "",
    password: "",
  })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Dummy reviews
  const dummyReviews = [
    {
      name: "John Doe",
      email: "john@example.com",
      rating: 5,
      comment: "Excellent service! The vendor was professional and delivered beyond expectations.",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      rating: 4,
      comment: "Very good experience, though communication could be improved.",
    },
    {
      name: "Alex Brown",
      email: "alex@example.com",
      rating: 3,
      comment: "Decent service, but there were some delays in setup.",
    },
  ]

  const fetchVendorDetails = async () => {
    try {
      setLoading(true)
      const vendorResponse = await singleVendorDetails(id!)
      setVendor({ ...vendorResponse.data, reviews: dummyReviews }) // Inject dummy reviews
    } catch (err) {
      console.error("Error fetching vendor details:", err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load vendor details.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchVendorDetails()
    }
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % (vendor?.images.length || 1))
    }, 3000)
    return () => clearInterval(interval)
  }, [id, vendor?.images.length])

  const handleInquiryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInquiryFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReviewFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setReviewFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendor) return

    const dataToSend: InquiryData = {
      vendorId: vendor._id,
      name: inquiryFormData.name,
      email: inquiryFormData.email,
      contact: inquiryFormData.contact,
      eventDate: inquiryFormData.eventDate,
      eventType: inquiryFormData.eventType,
      message: inquiryFormData.message,
      notification: inquiryFormData.notification,
    }

    try {
      const response = await createVendorInquiry(dataToSend)
      setInquiryFormData({
        name: "",
        email: "",
        contact: "",
        eventDate: "",
        eventType: "",
        message: "",
        notification: "",
      })
        Swal.fire({
    icon: 'success',
    title: 'Thank you!',
    text: 'Your enquiry has been submitted successfully.',
    timer: 2000,
    showConfirmButton: false
  })
    } catch (err) {
      console.error("Error submitting inquiry:", err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'something went wrong, Please try again later.',
      })
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendor) return

    const dataToSend: ReviewData = {
      vendorId: vendor._id,
      name: reviewFormData.name,
      email: reviewFormData.email,
      rating: Number(reviewFormData.rating),
      comment: reviewFormData.comment,
    }

   try {
  const response = await createVendorReview(dataToSend)

  setReviewFormData({
    name: "",
    email: "",
    rating: 0,
    comment: "",
    password: "",
  })

  Swal.fire({
    icon: 'success',
    title: 'Thank you!',
    text: 'Your review has been submitted successfully.',
    timer: 2000,
    showConfirmButton: false
  })
} catch (err) {
  console.error("Error submitting review:", err)
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'An unexpected error occurred. Please try again later.',
  })
}

  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!vendor) {
    return <div className="text-center py-8 text-red-600">No vendor found.</div>
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-[#FDF8F1] min-h-screen">
      <img
        src={Lines || "/placeholder.svg"}
        alt="Lines"
        className="absolute top-0 left-0 h-full object-cover mt-0 z-0 scale-125 sm:scale-150"
        style={{ maxWidth: "none" }}
      />
      <div className="relative z-10 p-2 sm:p-4">
        <Header />
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
          <div className="mb-2 sm:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-left font-bold text-[#5B4336]">
              {vendor.name}
            </h1>
          </div>
          <div className="flex items-center mb-4 sm:mb-6">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9c7c5d] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs sm:text-sm md:text-base text-[#5B4336]">
              {vendor.address}, {vendor.cities.join(", ")} {vendor.pincode}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 mb-6 sm:mb-8">
            <div className="w-full lg:w-2/3">
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden h-[320px] sm:h-[420px] md:h-[520px]">
                <img
                  src={vendor.images[currentImageIndex] || "/placeholder.svg?height=420&width=600"}
                  alt="Vendor"
                  className="w-full h-full object-cover rounded-lg transition-opacity duration-500"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 h-[320px] sm:h-[420px] md:h-[520px] flex flex-col">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#4A2C2A] mb-4">Send Inquiry</h3>
                <form onSubmit={handleInquirySubmit} className="space-y-3 flex-grow">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={inquiryFormData.name}
                      onChange={handleInquiryFormChange}
                      placeholder="Enter your name"
                      required
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-xs sm:text-sm focus:ring-2 focus:ring-[#ED695A]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={inquiryFormData.email}
                      onChange={handleInquiryFormChange}
                      placeholder="Enter your email"
                      required
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-xs sm:text-sm focus:ring-2 focus:ring-[#ED695A]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="contact"
                      value={inquiryFormData.contact}
                      onChange={handleInquiryFormChange}
                      placeholder="Enter your contact"
                      required
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-xs sm:text-sm focus:ring-2 focus:ring-[#ED695A]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="date"
                        name="eventDate"
                        value={inquiryFormData.eventDate}
                        onChange={handleInquiryFormChange}
                        min={today}
                        required
                        className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-xs sm:text-sm focus:ring-2 focus:ring-[#ED695A]"
                      />
                    </div>
                    <div>
                      <select
                        name="eventType"
                        value={inquiryFormData.eventType}
                        onChange={handleInquiryFormChange}
                        required
                        className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-xs sm:text-sm focus:ring-2 focus:ring-[#ED695A] appearance-none"
                      >
                        <option value="" disabled>Select event type</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <textarea
                      name="message"
                      value={inquiryFormData.message}
                      onChange={handleInquiryFormChange}
                      placeholder="Enter your message"
                      required
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#ED695A] min-h-[80px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#78533F] mb-1">Notification</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center text-xs sm:text-sm text-[#4A2C2A]">
                        <input
                          type="radio"
                          name="notification"
                          value="whatsapp"
                          checked={inquiryFormData.notification === 'whatsapp'}
                          onChange={handleInquiryFormChange}
                          className="mr-2 accent-[#ED695A]"
                        />
                        WhatsApp
                      </label>
                      <label className="flex items-center text-xs sm:text-sm text-[#4A2C2A]">
                        <input
                          type="radio"
                          name="notification"
                          value="email"
                          checked={inquiryFormData.notification === 'email'}
                          onChange={handleInquiryFormChange}
                          className="mr-2 accent-[#ED695A]"
                        />
                        Email
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#78533F] text-white py-2 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#634331] transition"
                  >
                    Submit Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#49516F] mt-6 sm:mt-8 mb-3 sm:mb-4">
              Contact
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">{vendor.phone}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">{vendor.altPhone}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">{vendor.email}</span>
              </div>
            </div>
          </div>
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#49516F] mb-3 sm:mb-4">
              About
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#2A2929] text-left">
              {vendor.about || "Our company is a reliable vendor committed to delivering high-quality products and services that meet the needs of every customer. With a strong focus on excellence, affordability, and trust, we ensure that every order is handled with care and professionalism. Over the years, we have built a reputation for timely delivery, customer satisfaction, and consistency in maintaining quality standards."}
            </p>
          </div>
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#49516F] mb-3 sm:mb-4">
              Summary
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#2A2929] text-left">
              {vendor.summary || "As a trusted supplier, we specialize in offering a wide range of products and services to cater to different customer requirements. Our goal is to make every transaction simple, transparent, and reliable while providing the best possible value. Whether it’s for individuals, events, or businesses, we strive to be the go-to vendor by combining experience, efficiency, and dedication in everything we do."}
            </p>
          </div>
          <div className="relative z-10">
            <img
              src={Bshape || "/placeholder.svg"}
              alt="Lines"
              className="absolute bottom-0 left-[-40px] sm:left-[-60px] h-[80%] sm:h-[90%] object-cover z-0"
              style={{ maxWidth: "none" }}
            />
            <div className="bg-white border mt-6 border-gray-200 rounded-xl shadow-sm p-3 sm:p-4 md:p-6 text-gray-800 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base">
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">
                    Cancellation Policy
                  </h4>
                  <p className="text-left">{vendor.cancellationPolicy}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">
                    Pricing
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Total Amount: ₹{Number(vendor.startingPrice).toLocaleString("en-IN")}</li>
                    <li>Advance Amount: ₹{Number(vendor.advAmnt).toLocaleString("en-IN")}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">
                    Time Slots
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    {vendor.timeSlots.map((slot, index) => (
                      <li key={index}>
                        {slot.label}: {slot.startTime} - {slot.endTime}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 sm:mb-8 mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#49516F] mb-3 sm:mb-4">
              Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vendor.images.map((img, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#49516F] mb-3 sm:mb-4">
              Reviews
            </h3>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold text-[#4A2C2A] mb-4">
                    Existing Reviews
                  </h4>
                  {vendor.reviews && vendor.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {vendor.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-[#2A2929]">{review.name}</span>
                            <span className="ml-2 text-[#ED695A]">
                              {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#2A2929]">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-[#2A2929]">No reviews yet.</p>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-1/3">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold text-[#4A2C2A] mb-4">
                    Post a Review
                  </h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-[#78533F] mb-1">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={reviewFormData.name}
                          onChange={handleReviewFormChange}
                          placeholder="Enter your name"
                          required
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-xs sm:text-sm focus:ring-2 focus:ring-[#ED695A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-[#78533F] mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={reviewFormData.email}
                          onChange={handleReviewFormChange}
                          placeholder="Enter your email"
                          required
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-xs sm:text-sm focus:ring-2 focus:ring-[#ED695A]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#78533F] mb-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={reviewFormData.password}
                          onChange={handleReviewFormChange}
                          placeholder="Enter your password"
                          required
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-xs sm:text-sm pr-10 focus:ring-2 focus:ring-[#ED695A]"
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
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-[#78533F] mb-1">Rating</label>
                        <select
                          name="rating"
                          value={reviewFormData.rating}
                          onChange={handleReviewFormChange}
                          required
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-xs sm:text-sm focus:ring-2 focus:ring-[#ED695A] appearance-none"
                        >
                          <option value="" disabled>Select rating</option>
                          <option value="1">1 Star</option>
                          <option value="2">2 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="5">5 Stars</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-[#78533F] mb-1">Comment</label>
                        <input
                          type="text"
                          name="comment"
                          value={reviewFormData.comment}
                          onChange={handleReviewFormChange}
                          placeholder="Enter your comment"
                          required
                          className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-xs sm:text-sm focus:ring-2 focus:ring-[#ED695A]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#78533F] text-white py-2 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#634331] transition"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  )
}

export default VendorDetails