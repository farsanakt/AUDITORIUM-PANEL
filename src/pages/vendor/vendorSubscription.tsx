"use client"

import React, { useState, useEffect } from "react"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { fetchAdminPlans } from "../../api/userApi"


interface Plan {
  _id: string
  planName: string
  price: number
  duration: number
  durationUnits: string
  description: string
  features: string[]
  userType: string
}


interface User {
  id: string
  email: string
  name: string
}

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "paypal" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  
  const currentUser: User = {
    id: "user123",
    email: "user@example.com",
    name: "John Doe",
  }

 
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetchAdminPlans()
        if (!response || !response.data.success) {
          throw new Error("Failed to fetch plans")
        }
        const data: Plan[] = response.data.data 
        console.log(data, "Fetched plans")
        setPlans(data)
      } catch (error) {
        console.error("Error fetching plans:", error)
      }
    }
    fetchPlans()
  }, [])

  const formatPrice = (priceInCents: number): string => {
    return (priceInCents).toFixed(2) 
  }

  const handleSelectPlan = (plan: Plan): void => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const handlePayment = async () => {
    if (!selectedPlan || !paymentMethod) return

    setIsLoading(true)
    try {
      
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: currentUser,
          planId: selectedPlan._id,
          paymentMethod,
        }),
      })

      if (response.ok) {
        console.log("Subscription successful for plan:", selectedPlan.planName)
        setIsModalOpen(false)
        setPaymentMethod(null)
      } else {
        console.error("Subscription failed")
      }
    } catch (error) {
      console.error("Error processing payment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const cardsPerPage = 3
  const totalPages = Math.ceil(plans.length / cardsPerPage)

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }


  const visiblePlans = plans.slice(currentIndex * cardsPerPage, (currentIndex + 1) * cardsPerPage)

  return (
    <div className="min-h-screen bg-[#FDF8F1] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#78533F] mb-4 text-balance font-serif">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg sm:text-xl text-[#b09d94] text-balance font-serif">Choose the perfect plan for your business needs</p>
        </div>

        {/* Pricing Cards with Navigation */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {visiblePlans.length > 0 ? (
              visiblePlans.map((plan, index) => {
                const isRecommended = index === 1 && currentIndex === 0 
                return (
                  <div
                    key={plan._id}
                    className={`relative group transition-all duration-300 transform hover:scale-105 max-w-xs mx-auto ${
                      isRecommended ? "md:scale-105" : ""
                    }`}
                  >
                    {/* Recommended Badge */}
                    {isRecommended && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="bg-[#ED695A] text-white px-4 py-1 rounded-full text-sm font-semibold font-serif">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Card */}
                    <div
                      className={`h-full rounded-2xl transition-all duration-300 bg-white shadow-lg border border-[#b09d94] ${
                        isRecommended ? "shadow-2xl border-2 border-[#ED695A]" : "hover:shadow-xl hover:border-[#78533F]"
                      }`}
                    >
                      <div className="p-4 sm:p-6">
                        {/* Plan Name */}
                        <h3 className="text-xl sm:text-2xl font-bold text-[#78533F] mb-2 font-serif">{plan.planName}</h3>
                        <p className="text-[#b09d94] text-sm mb-4 sm:mb-6 font-serif">{plan.description}</p>

                        {/* Price */}
                        <div className="mb-4 sm:mb-6">
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl sm:text-4xl font-bold text-[#78533F] font-serif">${formatPrice(plan.price)}</span>
                            <span className="text-[#b09d94] font-serif">/{plan.durationUnits}</span>
                          </div>
                          <p className="text-[#b09d94] text-sm mt-2 font-serif">
                            Billed for {plan.duration} {plan.durationUnits}
                            {plan.duration > 1 ? "s" : ""}
                          </p>
                        </div>

                        {/* CTA Button */}
                        <button
                          onClick={() => handleSelectPlan(plan)}
                          className={`w-full py-2 sm:py-3 px-4 rounded-full font-semibold transition-all duration-300 mb-4 sm:mb-8 font-serif ${
                            isRecommended
                              ? "bg-[#ED695A] text-white hover:bg-[#d85c4e] shadow-md hover:shadow-lg"
                              : "bg-[#FDF8F1] text-[#78533F] hover:bg-[#f0e6de] border border-[#b09d94]"
                          }`}
                        >
                          Get Started
                        </button>

                        {/* Features List */}
                        <div className="space-y-4">
                          <p className="text-sm font-semibold text-[#78533F] uppercase tracking-wide font-serif">What's Included</p>
                          <ul className="space-y-3">
                            {plan.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 group/item animate-fade-in"
                                style={{
                                  animationDelay: `${idx * 50}ms`,
                                }}
                              >
                                <Check className="w-5 h-5 text-[#ED695A] flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                                <span className="text-[#78533F] font-serif">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-center text-[#b09d94] col-span-full font-serif">No plans available. Please try again later.</p>
            )}
          </div>

          {/* Navigation Arrows */}
          {plans.length > cardsPerPage && (
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`p-2 rounded-full ${
                  currentIndex === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#ED695A] hover:bg-[#d85c4e]"
                } text-white`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === totalPages - 1}
                className={`p-2 rounded-full ${
                  currentIndex === totalPages - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#ED695A] hover:bg-[#d85c4e]"
                } text-white`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-[#b09d94] mb-4 font-serif">All plans include a 14-day free trial. No credit card required.</p>
          <p className="text-sm text-[#b09d94] font-serif">
            Need a custom plan?{" "}
            <span className="text-[#ED695A] font-semibold cursor-pointer hover:underline font-serif">Contact our sales team</span>
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-full sm:max-w-md w-full mx-4 overflow-auto max-h-[90vh] shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-[#78533F] mb-4 font-serif">Complete Your Subscription</h2>
            <p className="text-[#b09d94] mb-4 font-serif">Plan: {selectedPlan.planName}</p>
            <p className="text-[#b09d94] mb-4 font-serif">Price: ${formatPrice(selectedPlan.price)}/{selectedPlan.durationUnits}</p>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-[#78533F] uppercase tracking-wide mb-2 font-serif">Select Payment Method</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={() => setPaymentMethod("credit_card")}
                    className="text-[#ED695A] focus:ring-[#ED695A] border-[#b09d94]"
                  />
                  <span className="text-[#78533F] font-serif">Credit Card</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    className="text-[#ED695A] focus:ring-[#ED695A] border-[#b09d94]"
                  />
                  <span className="text-[#78533F] font-serif">PayPal</span>
                </label>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setPaymentMethod(null)
                }}
                className="py-2 px-4 rounded-full bg-gray-300 text-[#78533F] hover:bg-gray-400 font-serif"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={!paymentMethod || isLoading}
                className={`py-2 px-4 rounded-full font-semibold font-serif ${
                  !paymentMethod || isLoading
                    ? "bg-[#ED695A] opacity-50 text-white cursor-not-allowed"
                    : "bg-[#ED695A] text-white hover:bg-[#d85c4e]"
                }`}
              >
                {isLoading ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

export default SubscriptionPlans