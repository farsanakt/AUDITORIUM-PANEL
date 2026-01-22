"use client"
import { useEffect, useState } from "react"
import { ArrowLeft, Calendar, Check, CreditCard, Download, Landmark, Printer, Wallet, X, CheckCircle, User, MapPin, Phone, Mail, Home, Clock } from 'lucide-react'
import { Button } from "../../component/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../component/ui/card"
import { RadioGroup, RadioGroupItem } from "../../component/ui/radio-group"
import { Label } from "../../component/ui/label"
import { Input } from "../../component/ui/input"
import { cn } from "../../component/lib/utils"
import Header from "../../component/user/Header"
import Sidebar from "../../component/auditorium/Sidebar"
import { useLocation, useNavigate } from "react-router-dom"
import { createBooking, userDetails } from "../../api/userApi"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

export default function PaymentDetails() {
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">("pending")
  const [paymentType, setPaymentType] = useState<"advance" | "full">("advance")
  const [paymentMethod, setPaymentMethod] = useState<string>("credit")
  const [customer, setCustomer] = useState<any>(null)
  const [customerName, setCustomerName] = useState<string>("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
   const { currentUser } = useSelector((state: RootState) => state.auth);

  const location = useLocation()
  const bookingData = location.state
  const navigate = useNavigate()


const handlePayment = async () => {
  setIsProcessing(true)
  try {

    // Determine which ID to send based on role
    const userReferenceId =
      currentUser?.role === "auditorium"
        ? currentUser.id
        : currentUser?.role === "Staff"
        ? currentUser.staffId
        : null

    const paymentData = {
      userEmail: bookingData.userEmail,
      totalAmount: bookingData.totalAmount,
      venueId: bookingData.venueId,
      venueName: bookingData.venueName,
      paidAmount:
        paymentType === "advance"
          ? bookingData.advanceAmount
          : bookingData.totalAmount,
      balanceAmount:
        paymentType === "advance"
          ? parseInt(bookingData.totalAmount) -
            parseInt(bookingData.advanceAmount)
          : 0,
      bookedDate: bookingData.selectedDate,
      timeSlot: bookingData.selectedTimeSlot,
      address: bookingData.address,
      paymentType: paymentType,
      paymentMethod: paymentMethod,
      phone: bookingData.userPhone,
      communicationPrefer: bookingData.communicationType,

      // 👇 new field added
      userReferenceId: userReferenceId,
      customerName: customerName
    }

    const response = await createBooking(paymentData)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setPaymentStatus("success")
    setShowSuccessModal(true)
  } catch (error) {
    console.error("Payment processing failed:", error)
    alert("Payment processing failed. Please try again.")
  } finally {
    setIsProcessing(false)
  }
}


  const customerDetails = async () => {
    try {
      const response = await userDetails(bookingData.userEmail)
      setCustomer(response.data)
      setCustomerName(response.data?.ownerName || "")
    } catch (error) {
      console.error("Failed to fetch customer details:", error)
    }
  }

  useEffect(() => {
    customerDetails()
    console.log('gfgfgg',bookingData.communicationType
)
  }, [])

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    navigate("/auditorium/bookings")
  }

  const paymentDetails = {
    fullAmount: parseInt(bookingData.totalAmount),
    advanceAmount: parseInt(bookingData.advanceAmount),
    tax: paymentType === "advance" ? parseInt(bookingData.advanceAmount) * 0.1 : parseInt(bookingData.totalAmount) * 0.1,
    total: paymentType === "advance" ? 
      parseInt(bookingData.advanceAmount) + (parseInt(bookingData.advanceAmount) * 0.1) :
      parseInt(bookingData.totalAmount) + (parseInt(bookingData.totalAmount) * 0.1),
  }

  const getPaymentAmount = () => {
    return paymentType === "advance" ? paymentDetails.advanceAmount : paymentDetails.fullAmount
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1]">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        {/* <div className="w-64 shrink-0 h-[calc(100vh-64px)] sticky top-16 hidden md:block">
          <Sidebar />
        </div> */}

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 border-b border-[#b09d94] pb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#78533F] mb-2">
                  {bookingData.venueName}
                </h1>
                <p className="text-sm text-[#78533F]/70">Complete your payment to confirm booking</p>
              </div>
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="flex items-center gap-2 border-[#b09d94] hover:bg-amber-50 hover:text-[#78533F] hover:border-[#78533F] mt-4 md:mt-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {/* Customer Details Section */}
              <Card className="border-[#b09d94] shadow-md bg-white">
                <CardHeader className="bg-gradient-to-r from-[#78533F]/10 to-[#ED695A]/10 rounded-t-lg border-b border-[#b09d94]">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <User className="h-5 w-5 text-[#78533F]" />
                    <span>Customer Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Booking Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Venue</p>
                          <p className="font-medium text-gray-900">{bookingData.venueName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="font-medium text-gray-900">{bookingData.selectedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Time Slot</p>
                          <p className="font-medium text-gray-900">{bookingData.selectedTimeSlot}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-gray-500">Booking ID</p>
                          <p className="font-medium text-gray-900">{bookingData.venueId?.slice(-8)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-1 text-[#78533F]">
                        <User className="h-4 w-4" />
                        Customer Name
                      </Label>
                      <Input
                        id="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="bg-gray-50 border-[#b09d94]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-1 text-[#78533F]">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.userEmail}
                        readOnly
                        className="bg-gray-50 border-[#b09d94]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-1 text-[#78533F]">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={customer?.phone || ""}
                        readOnly
                        className="bg-gray-50 border-[#b09d94]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-1 text-[#78533F]">
                        <MapPin className="h-4 w-4" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={bookingData.address}
                        readOnly
                        className="bg-gray-50 border-[#b09d94]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Section */}
              <Card className="border-[#b09d94] shadow-md bg-white">
                <CardHeader className="bg-gradient-to-r from-[#78533F]/10 to-[#ED695A]/10 rounded-t-lg border-b border-[#b09d94]">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <CreditCard className="h-5 w-5 text-[#78533F]" />
                    <span>Payment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Amount Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#78533F]">Total Amount</label>
                        <div className="text-lg font-semibold text-gray-900">
                          ₹{paymentDetails.fullAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#78533F]">Advance Amount</label>
                        <div className="text-lg font-semibold text-gray-900">
                          ₹{paymentDetails.advanceAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {paymentType === "advance" ? "Advance Amount" : "Full Amount"}
                          </span>
                          <span className="font-medium">
                            ₹{getPaymentAmount().toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax (GST 10%)</span>
                          <span className="font-medium">₹{paymentDetails.tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                          <span>Total Amount</span>
                          <span className="text-[#ED695A]">₹{paymentDetails.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-base font-medium text-[#78533F]">Select Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      <div className="flex items-center space-x-3 border border-[#b09d94] p-3 rounded-md hover:bg-amber-50 transition-colors hover:border-[#78533F] cursor-pointer shadow-sm">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-[#78533F]" />
                          <span>Credit Card</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border border-[#b09d94] p-3 rounded-md hover:bg-amber-50 transition-colors hover:border-[#78533F] cursor-pointer shadow-sm">
                        <RadioGroupItem value="debit" id="debit" />
                        <Label htmlFor="debit" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Landmark className="h-5 w-5 text-[#78533F]" />
                          <span>Debit Card</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border border-[#b09d94] p-3 rounded-md hover:bg-amber-50 transition-colors hover:border-[#78533F] cursor-pointer shadow-sm">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
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
                          <span>UPI Payment</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border border-[#b09d94] p-3 rounded-md hover:bg-amber-50 transition-colors hover:border-[#78533F] cursor-pointer shadow-sm">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Wallet className="h-5 w-5 text-[#78533F]" />
                          <span>Cash Payment</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Payment Type Selection */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-base font-medium text-[#78533F]">Payment Options</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex items-center space-x-3 cursor-pointer p-3 border border-[#b09d94] rounded-lg hover:bg-gray-50 transition-all flex-1">
                        <input
                          type="radio"
                          name="paymentType"
                          value="advance"
                          checked={paymentType === "advance"}
                          onChange={() => setPaymentType("advance")}
                          className="w-4 h-4 text-[#ED695A] focus:ring-[#ED695A]"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-[#78533F]">Pay Advance</div>
                          <div className="text-sm text-gray-600">Pay ₹{paymentDetails.advanceAmount.toLocaleString()} now</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer p-3 border border-[#b09d94] rounded-lg hover:bg-gray-50 transition-all flex-1">
                        <input
                          type="radio"
                          name="paymentType"
                          value="full"
                          checked={paymentType === "full"}
                          onChange={() => setPaymentType("full")}
                          className="w-4 h-4 text-[#ED695A] focus:ring-[#ED695A]"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-[#78533F]">Pay Full Amount</div>
                          <div className="text-sm text-gray-600">Pay ₹{paymentDetails.fullAmount.toLocaleString()} now</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-[#78533F]/5 rounded-lg p-4 mb-6 border border-[#78533F]/20">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-[#78533F]">Amount to Pay:</span>
                      <span className="text-2xl font-bold text-[#ED695A]">₹{paymentDetails.total.toLocaleString()}</span>
                    </div>
                    {paymentType === "advance" && (
                      <p className="text-sm text-gray-600 mt-2">
                        Remaining amount: ₹{(paymentDetails.fullAmount - paymentDetails.advanceAmount).toLocaleString()} (to be paid later)
                      </p>
                    )}
                  </div>

                  {/* Confirm Payment Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-[#ED695A] hover:bg-[#d85a4b] disabled:bg-gray-400 text-white font-medium text-lg py-3"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Confirm Payment - ₹{paymentDetails.total.toLocaleString()}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed bottom-4 right-4 z-40">
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
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your {paymentType === "advance" ? "advance" : "full"} payment has been processed successfully. 
                Your booking is now confirmed.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium text-gray-900 mb-2">Payment Details:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Venue:</span> {bookingData.venueName}</p>
                  <p><span className="font-medium">Date:</span> {bookingData.selectedDate}</p>
                  <p><span className="font-medium">Time:</span> {bookingData.selectedTimeSlot}</p>
                  <p><span className="font-medium">Amount Paid:</span> ₹{paymentDetails.total.toLocaleString()}</p>
                  <p><span className="font-medium">Payment Type:</span> {paymentType === "advance" ? "Advance Payment" : "Full Payment"}</p>
                  <p><span className="font-medium">Payment Method:</span> {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
                  <p><span className="font-medium">Customer Name:</span> {customerName}</p>
                  <p><span className="font-medium">Customer Email:</span> {bookingData.userEmail}</p>
                  <p><span className="font-medium">Customer Phone:</span> {customer?.phone || bookingData.userPhone}</p>
                  <p><span className="font-medium">Customer Address:</span> {bookingData.address}</p>
                  <p><span className="font-medium">Booked By:</span> {currentUser?.email}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-[#b09d94] flex items-center justify-center gap-2"
                  onClick={() => {
                    // Handle print receipt
                    window.print()
                  }}
                >
                  <Printer className="h-4 w-4" />
                  Print Receipt
                </Button>
                <Button
                  onClick={handleSuccessClose}
                  className="flex-1 bg-[#ED695A] hover:bg-[#d85a4b] text-white flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}