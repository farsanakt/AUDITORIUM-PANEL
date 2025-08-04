"use client"
import { useEffect, useState } from "react"
import { ArrowLeft, Calendar, Check, CreditCard, Download, Landmark, Printer, Wallet } from "lucide-react"
import { Button } from "../../component/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../component/ui/card"
import { RadioGroup, RadioGroupItem } from "../../component/ui/radio-group"
import { Label } from "../../component/ui/label"
import { Input } from "../../component/ui/input"
import { cn } from "../../component/lib/utils"
import Header from "../../component/user/Header"
import Sidebar from "../../component/auditorium/Sidebar"
import { useLocation, useNavigate } from "react-router-dom"
import { userDetails } from "../../api/userApi"
import axios from "axios" // Added for backend API call

export default function PaymentDetails() {
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">("pending")
  const [paymentType, setPaymentType] = useState<"advance" | "full">("advance")
  const [customer, setCustomer] = useState<any>(null)
  
  const location = useLocation()
  const bookingData = location.state
  const navigate = useNavigate()

  const handlePayment = async () => {
    try {
      // Prepare payment data for backend
      const paymentData = {
        userEmail: bookingData.userEmail,
        venueId: bookingData.venueId,
        venueName: bookingData.venueName,
        paidAmount: paymentType === "advance" ? bookingData.advanceAmount : bookingData.totalAmount,
        balanceAmount: paymentType === "advance" ? 
          parseInt(bookingData.totalAmount) - parseInt(bookingData.advanceAmount) : 0,
        bookedDate: bookingData.selectedDate,
        timeSlot: bookingData.selectedTimeSlot,
        address: bookingData.address,
        paymentType: paymentType
      }

      // Send payment data to backend
      await axios.post("/api/payment", paymentData)
      setPaymentStatus("success")
    } catch (error) {
      console.error("Payment processing failed:", error)
      alert("Payment processing failed. Please try again.")
    }
  }

  const customerDetails = async () => {
    try {
      console.log(bookingData.userEmail, 'm')
      const response = await userDetails(bookingData.userEmail)
      console.log(response.data, 'customerDetails')
      setCustomer(response.data)
    } catch (error) {
      console.error("Failed to fetch customer details:", error)
    }
  }

  useEffect(() => {
    console.log(bookingData, 'booking data')
    customerDetails()
  }, [])

  const handleGoBack = () => {
    navigate(-1)
  }

  const paymentDetails = {
    fullAmount: parseInt(bookingData.totalAmount),
    advanceAmount: parseInt(bookingData.advanceAmount),
    tax: paymentType === "advance" ? parseInt(bookingData.advanceAmount) * 0.1 : parseInt(bookingData.totalAmount) * 0.1,
    total: paymentType === "advance" ? 
      parseInt(bookingData.advanceAmount) + (parseInt(bookingData.advanceAmount) * 0.1) : 
      parseInt(bookingData.totalAmount) + (parseInt(bookingData.totalAmount) * 0.1),
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1]">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 shrink-0 h-[calc(100vh-64px)] sticky top-16 hidden md:block">
          <Sidebar />
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
           
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 border-b border-[#b09d94] pb-4">
              <h1 className="text-2xl font-bold text-[#78533F]">Auditorium Booking Payment</h1>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <span className="text-sm text-[#78533F]">Payment Type:</span>
                <div className="flex bg-amber-50 rounded-md p-1">
                  <button
                    onClick={() => setPaymentType("advance")}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                      paymentType === "advance"
                        ? "bg-[#78533F] text-white shadow-md"
                        : "text-[#78533F] hover:bg-amber-100",
                    )}
                  >
                    Advance
                  </button>
                  <button
                    onClick={() => setPaymentType("full")}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                      paymentType === "full"
                        ? "bg-[#78533F] text-white shadow-md"
                        : "text-[#78533F] hover:bg-amber-100",
                    )}
                  >
                    Full
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side - Booking Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-[#b09d94] shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-[#78533F]/10 to-[#ED695A]/10 rounded-t-lg border-b border-[#b09d94]">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[#78533F]" />
                      <span>Booking Details</span>
                    </CardTitle>
                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                      <span className="bg-amber-100 text-[#78533F] px-3 py-1 rounded-md font-medium inline-flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {bookingData.selectedDate}
                      </span>
                      <span className="bg-amber-100 text-[#78533F] px-3 py-1 rounded-md font-medium">
                        {bookingData.selectedTimeSlot}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Auditorium</h3>
                          <p className="text-base font-semibold">{bookingData.venueName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Booking ID</h3>
                          <p className="text-base font-semibold">{bookingData.venueId}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Event Type</h3>
                          <p className="text-base">Not specified</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Capacity</h3>
                          <p className="text-base">Not specified</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Amenities</h3>
                        <p className="text-base">Not specified</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-[#b09d94] shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-[#78533F]/10 to-[#ED695A]/10 rounded-t-lg border-b border-[#b09d94]">
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-[#78533F]" />
                      <span>Customer Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={customer?.ownerName || ""} 
                          readOnly 
                          className="bg-white border-[#b09d94]" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingData.userEmail}
                          readOnly
                          className="bg-white border-[#b09d94]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={customer?.phone || ""} 
                          readOnly 
                          className="bg-white border-[#b09d94]" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          value={bookingData.address} 
                          readOnly 
                          className="bg-white border-[#b09d94]" 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Right Side - Payment Details */}
              <div className="lg:col-span-1">
                <Card className="border-[#b09d94] shadow-md bg-white sticky top-20">
                  <CardHeader className="bg-gradient-to-r from-[#78533F]/10 to-[#ED695A]/10 rounded-t-lg border-b border-[#b09d94]">
                    <CardTitle className="text-xl">
                      {paymentType === "advance" ? "Advance Booking Payment" : "Full Booking Payment"}
                    </CardTitle>
                    <CardDescription>
                      {paymentType === "advance"
                        ? "Pay the advance amount to secure your booking"
                        : "Pay the full amount for your booking"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {paymentStatus === "pending" ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-base font-medium mb-3">Select Payment Method</h3>
                          <RadioGroup defaultValue="credit" className="space-y-3">
                            <div className="flex items-center space-x-3 border border-[#b09d94] p-3 rounded-md hover:bg-amber-50 transition-colors hover:border-[#78533F] cursor-pointer shadow-sm">
                              <RadioGroupItem value="credit" id="credit" />
                              <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer">
                                <CreditCard className="h-5 w-5 text-[#78533F]" />
                                <span>Credit Card</span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border border-[#b09d94] p-3 rounded-md hover:bg-amber-50 transition-colors hover:border-[#78533F] cursor-pointer shadow-sm">
                              <RadioGroupItem value="debit" id="debit" />
                              <Label htmlFor="debit" className="flex items-center gap-2 cursor-pointer">
                                <Landmark className="h-5 w-5 text-[#78533F]" />
                                <span>Debit Card</span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border border-[#b09d94] p-3 rounded-md hover:bg-amber-50 transition-colors hover:border-[#78533F] cursor-pointer shadow-sm">
                              <RadioGroupItem value="upi" id="upi" />
                              <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                                <svg
                                  className="h-5 w-5 text-[#78533F]"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect
                                    x="3"
                                    y="6"
                                    width="18"
                                    height="12"
                                    rx="2"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                  <path
                                    d="M7 15H8.5M12 15H17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                <span>UPI</span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border border-[#b09d94] p-3 rounded-md hover:bg-amber-50 transition-colors hover:border-[#78533F] cursor-pointer shadow-sm">
                              <RadioGroupItem value="cash" id="cash" />
                              <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                                <Wallet className="h-5 w-5 text-[#78533F]" />
                                <span>Cash</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="border-t border-[#b09d94] pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {paymentType === "advance" ? "Advance Amount" : "Full Amount"}
                              </span>
                              <span>
                                ₹
                                {(paymentType === "advance"
                                  ? paymentDetails.advanceAmount
                                  : paymentDetails.fullAmount
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tax (GST)</span>
                              <span>₹{paymentDetails.tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#b09d94]">
                              <span>Total</span>
                              <span>₹{paymentDetails.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-[#ED695A]/20 flex items-center justify-center">
                          <Check className="h-8 w-8 text-[#ED695A]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#78533F]">
                          {paymentType === "advance" ? "Advance Payment Successful!" : "Full Payment Successful!"}
                        </h3>
                        <p className="text-center text-muted-foreground">
                          Your {paymentType === "advance" ? "advance" : "full"} payment of ₹
                          {paymentDetails.total.toLocaleString()} has been received.
                          <br />
                          Your booking is now confirmed.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter
                    className={cn("flex gap-3", paymentStatus === "success" ? "justify-center" : "justify-end")}
                  >
                    {paymentStatus === "pending" ? (
                      <Button onClick={handlePayment} className="bg-[#ED695A] hover:bg-[#d85a4b] text-white">
                        Confirm Payment
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" className="border-[#b09d94] flex items-center gap-2">
                          <Printer className="h-4 w-4" />
                          Print Receipt
                        </Button>
                        <Button className="bg-[#ED695A] hover:bg-[#d85a4b] text-white flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </div>
            {/* Back Button */}
            <div className="mt-8 mb-4">
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="flex items-center gap-2 border-[#b09d94] hover:bg-amber-50 hover:text-[#78533F] hover:border-[#78533F]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Previous Page
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Sidebar Toggle - Only visible on mobile */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <Button
            className="rounded-full w-12 h-12 bg-[#78533F] hover:bg-[#5d3f30] shadow-lg"
            onClick={() => {
              alert("Mobile sidebar would open here")
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}