"use client"

import React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Edit, Phone, DollarSign, X } from "lucide-react"
import { Button } from "../../component/ui/button"
import { cn } from "../../component/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../component/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../component/ui/dialog"
import { Input } from "../../component/ui/input"

interface CalendarProps {
  onDateSelect: (date: Date) => void
  className?: string
}

interface BookingDetails {
  customerName: string
  phoneNumber: string
  balancePayable: number
}

export function CustomCalendar({ onDateSelect, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [password, setPassword] = useState("")
  const [selectedBookingDate, setSelectedBookingDate] = useState<Date | null>(null)

  
  const bookingDetails: Record<number, BookingDetails> = {
    6: { customerName: "John Doe", phoneNumber: "+91 9876543210", balancePayable: 2500 },
    10: { customerName: "Jane Smith", phoneNumber: "+91 8765432109", balancePayable: 1800 },
  }

  const bookedDates = [6, 10]
  const waitlistDates = [15, 24, 28]
  const maintenanceDates = [29, 30, 31]

  const getMonthData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const prevMonthDays = []
    const prevMonth = month === 0 ? 11 : month - 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push({
        date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - i),
        isCurrentMonth: false,
      })
    }

    const currentMonthDays = []
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    const nextMonthDays = []
    const nextMonth = month === 11 ? 0 : month + 1
    const nextMonthYear = month === 11 ? year + 1 : year
    const totalDaysShown = prevMonthDays.length + currentMonthDays.length
    const remainingDays = 42 - totalDaysShown

    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        date: new Date(nextMonthYear, nextMonth, i),
        isCurrentMonth: false,
      })
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }

  const monthData = getMonthData(currentDate.getFullYear(), currentDate.getMonth())
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect(date)
  }

  const getDateStatus = (date: Date) => {
    const day = date.getDate()

    if (bookedDates.includes(day)) {
      return "booked"
    } else if (waitlistDates.includes(day)) {
      return "waitlist"
    } else if (maintenanceDates.includes(day)) {
      return "maintenance"
    }

    return "available"
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-red-400 text-white"
      case "waitlist":
        return "bg-yellow-400 text-white"
      case "maintenance":
        return "bg-purple-400 text-white"
      default:
        return ""
    }
  }

  const handleEditCustomer = (date: Date) => {
    // Redirect to edit customer page
    window.location.href = `/edit-customer/${date.getDate()}`
  }

  const handleCancelBooking = (date: Date) => {
    setSelectedBookingDate(date)
    setShowCancelDialog(true)
  }

  const confirmCancellation = () => {
    if (password === "admin123") {
     
      alert(`Booking for ${selectedBookingDate?.toLocaleDateString()} has been cancelled`)
      setShowCancelDialog(false)
      setPassword("")
    } else {
      alert("Incorrect password")
    }
  }

  return (
    <div className={cn("w-full max-w-sm border border-[#b09d94] rounded-lg p-4 bg-white", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium">{currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2>
        <div className="flex space-x-1">
          <Button variant="outline" size="icon" className="h-7 w-7 border border-[#b09d94]" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7 border border-[#b09d94]" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
        {weekDays.map((day) => (
          <div key={day} className="py-1 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthData.map((item, index) => {
          const status = getDateStatus(item.date)
          const statusClass = getStatusClass(status)
          const isSelected =
            selectedDate &&
            selectedDate.getDate() === item.date.getDate() &&
            selectedDate.getMonth() === item.date.getMonth() &&
            selectedDate.getFullYear() === item.date.getFullYear()

          const day = item.date.getDate()
          const hasBookingDetails = status === "booked" && bookingDetails[day]

          return (
            <React.Fragment key={index}>
              {hasBookingDetails ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleDateClick(item.date)}
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-sm",
                          !item.isCurrentMonth && "text-gray-400",
                          statusClass,
                          isSelected && !statusClass && "bg-[#78533F] text-white",
                          isSelected && statusClass && "ring-2 ring-[#78533F]",
                        )}
                      >
                        {item.date.getDate()}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="p-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-[#78533F]">Booking Details</h3>
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Customer:</span>
                            <span>{bookingDetails[day].customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-gray-500" />
                            <span>{bookingDetails[day].phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                            <span>Balance: ₹{bookingDetails[day].balancePayable}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditCustomer(item.date)
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit Details
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancelBooking(item.date)
                            }}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <button
                  onClick={() => handleDateClick(item.date)}
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm",
                    !item.isCurrentMonth && "text-gray-400",
                    statusClass,
                    isSelected && !statusClass && "bg-[#78533F] text-white",
                    isSelected && statusClass && "ring-2 ring-[#78533F]",
                  )}
                >
                  {item.date.getDate()}
                </button>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Status Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span>Waiting List</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-purple-400"></div>
          <span>Maintenance</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full border"></div>
          <span>Available</span>
        </div>
      </div>

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Booking Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">Please enter your admin password to confirm:</p>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmCancellation}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
