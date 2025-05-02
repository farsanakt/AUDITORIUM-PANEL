"use client"

import { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import MobileNav from "./MobileNav"
import DashboardOverview from "../../pages/auditorium/Dashboard"
import VenueManagement from "../../pages/auditorium/Venue"


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="bg-[#FDF8F1] min-h-screen w-full overflow-hidden">
      <Header />

      <div className="min-h-screen w-full flex bg-[#FDF8F1]">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 w-full overflow-auto">
            {activeTab === "overview" && <DashboardOverview />}
            {activeTab === "bookings" && <VenueManagement />}
            {activeTab === "calendar" && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#78533F]">Calendar</h2>
                <p className="text-gray-600">Calendar view coming soon.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
