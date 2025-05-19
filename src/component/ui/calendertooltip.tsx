"use client"
import { useState } from "react"
import { Edit, Phone, DollarSign, X } from "lucide-react"
import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"
import { Input } from "./input"

interface BookingDetails {
  customerName: string
  phoneNumber: string
  balancePayable: number
}

export function BookingTooltipExample() {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [password, setPassword] = useState("")

  // Sample booking details
  const bookingDetails: BookingDetails = {
    customerName: "John Doe",
    phoneNumber: "+91 9876543210",
    balancePayable: 2500,
  }

  const handleEditCustomer = () => {
    // Redirect to edit customer page
    window.location.href = `/edit-customer/123`
  }

  const handleCancelBooking = () => {
    setShowCancelDialog(true)
  }

  const confirmCancellation = () => {
    if (password === "admin123") {
      // Replace with actual password validation
      alert("Booking has been cancelled")
      setShowCancelDialog(false)
      setPassword("")
    } else {
      alert("Incorrect password")
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="h-8 w-8 rounded-full flex items-center justify-center text-sm bg-red-400 text-white">
              6
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="p-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[#78533F]">Booking Details</h3>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Customer:</span>
                  <span>{bookingDetails.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gray-500" />
                  <span>{bookingDetails.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                  <span>Balance: ₹{bookingDetails.balancePayable}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditCustomer()
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
                    handleCancelBooking()
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

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
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
    </>
  )
}
