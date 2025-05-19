"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { cn } from "../../component/lib/utils"
import vector from '../../assets/lines.png'
import Header from "../../component/user/Header"
import { useNavigate } from "react-router-dom"



type PersonType = "bride" | "groom"

export default function DetailsForm() {
  const [personType, setPersonType] = useState<PersonType>("bride")
  const navigate=useNavigate()
  
  const handleSave=()=>{
    navigate('/payment')
  }

  const handleBack=()=>{
    navigate(-1)
  }

  return (
    <div className="w-full max-w-3xl px-8 py-6 relative bg-[#FDF8F1] mx-auto">
        <Header/>
        
        
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
            backgroundImage: `url(${vector})`,  
            backgroundSize: "cover",       
            backgroundPosition: "center",   
          }}
      />

      <div className="relative z-10">
     
        {/* Header and Toggle Row */}
        <div className="flex justify-between items-center mb-8">
        {/* <Sidebar/> */}
          {/* Heading on left */}
          <h1 className="text-2xl font-serif text-[#9c7c5d]">
            {personType === "bride" ? "Bride Details" : "Groom Details"}
          </h1>

          {/* Toggle and tagline on right */}
          <div className="flex items-center gap-4">
            {/* <span className="text-sm text-[#9c7c5d] font-medium">Choose your role</span> */}
            <div className="bg-[#9c7c5d] rounded-full p-1 flex w-36">
              <button
                className={cn(
                  "py-1 px-3 rounded-full text-sm font-medium transition-colors w-1/2 text-center",
                  personType === "bride" ? "bg-white text-[#9c7c5d]" : "bg-transparent text-white",
                )}
                onClick={() => setPersonType("bride")}
              >
                Bride
              </button>
              <button
                className={cn(
                  "py-1 px-3 rounded-full text-sm font-medium transition-colors w-1/2 text-center",
                  personType === "groom" ? "bg-white text-[#9c7c5d]" : "bg-transparent text-white",
                )}
                onClick={() => setPersonType("groom")}
              >
                Groom
              </button>
            </div>
          </div>
        </div>

        {/* Photo upload */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-600 mt-2">Upload photo</span>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full name */}
            <div>
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-4 py-2 rounded-md border bg-white border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
              />
            </div>

            {/* Date of birth */}
            <div className="relative">
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                className="w-full px-4 py-2 rounded-md border bg-white border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>

            {/* Father's name */}
            <div>
              <input
                type="text"
                placeholder="Father's name"
                className="w-full px-4 py-2 rounded-md border bg-white border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
              />
            </div>

            {/* Mother's name */}
            <div>
              <input
                type="text"
                placeholder="Mother's name"
                className="w-full px-4 py-2 rounded-md border border-[#b09d94] bg-white focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
              />
            </div>

            {/* Gender */}
            <div>
              <select className="w-full px-4 py-2 rounded-md border border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d] appearance-none bg-white">
                <option value="" disabled selected>
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* ID Proof */}
            <div>
              <select className="w-full px-4 py-2 rounded-md border border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d] appearance-none bg-white">
                <option value="" disabled selected>
                  Upload ID Proof
                </option>
                <option value="aadhar">Aadhar Card</option>
                <option value="pan">PAN Card</option>
                <option value="passport">Passport</option>
                <option value="driving">Driving License</option>
              </select>
            </div>
          </div>

          {/* Full Address */}
          <div>
            <textarea
              placeholder="Full Address"
              rows={4}
              className="w-full px-4 py-2 rounded-md border bg-white border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pincode */}
            <div>
              <input
                type="text"
                placeholder="Pincode"
                className="w-full px-4 py-2 rounded-md border bg-white border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
              />
            </div>

            {/* Phone Number */}
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded-md bg-white border border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button type="button" onClick={handleBack} className="px-8 py-2 bg-[#e6ddd3] text-[#9c7c5d] rounded-md font-medium">
              Back
            </button>
            <button type="submit" onClick={handleSave} className="px-8 py-2 bg-[#9c7c5d] text-white rounded-md font-medium">
              Save & Next
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
