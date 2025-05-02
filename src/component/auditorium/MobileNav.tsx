"use client"

import type React from "react"

interface MobileNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="md:hidden flex bg-white shadow-md w-full">
      <button
        className={`flex-1 py-3 text-center ${activeTab === "overview" ? "text-[#ED695A] border-b-2 border-[#ED695A]" : "text-gray-500"}`}
        onClick={() => setActiveTab("overview")}
      >
        Overview
      </button>
      <button
        className={`flex-1 py-3 text-center ${activeTab === "bookings" ? "text-[#ED695A] border-b-2 border-[#ED695A]" : "text-gray-500"}`}
        onClick={() => setActiveTab("bookings")}
      >
        Bookings
      </button>
      <button
        className={`flex-1 py-3 text-center ${activeTab === "calendar" ? "text-[#ED695A] border-b-2 border-[#ED695A]" : "text-gray-500"}`}
        onClick={() => setActiveTab("calendar")}
      >
        Calendar
      </button>
    </div>
  )
}

export default MobileNav
