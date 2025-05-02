"use client"

import { useState } from "react"
import { Calendar, Check, CreditCard, Download, Landmark, Printer, Wallet } from "lucide-react"
import { Button } from "../../component/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../component/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../component/ui/tabs"
import { RadioGroup, RadioGroupItem } from "../../component/ui/radio-group"
import { Label } from "../../component/ui/label"
import { Input } from "../../component/ui/input"
import { cn } from "../../component/lib/utils"
import Header from "../../component/user/Header"

export default function PaymentDetails() {
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">("pending")
  const [activeTab, setActiveTab] = useState("advance")

  const handlePayment = () => {
    // Simulate payment processing
    setPaymentStatus("success")
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Reset payment status when changing tabs
    setPaymentStatus("pending")
  }

  const bookingDetails = {
    auditoriumName: "Grand Celebration Hall",
    bookingDate: "May 15, 2025",
    bookingTime: "6:00 PM - 10:00 PM",
    eventType: "Wedding Reception",
    capacity: "250 Guests",
    amenities: "Sound System, Projector, Catering",
    bookingId: "BK-2025051501",
  }

  const paymentDetails = {
    fullAmount: 25000,
    advanceAmount: 10000,
    tax: activeTab === "advance" ? 1000 : 2500,
    total: activeTab === "advance" ? 11000 : 27500,
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1] p-4 md:p-8">
      <Header/>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#78533F]">Auditorium Booking Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Side - Booking Details */}
          <div className="space-y-6">
            <Card className="border-[#b09d94] shadow-md bg-white">
              <CardHeader className="bg-gradient-to-r from-[#78533F]/10 to-[#ED695A]/10 rounded-t-lg border-b border-[#b09d94]">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#78533F]" />
                  <span>Booking Details</span>
                </CardTitle>
                <CardDescription>Auditorium reservation information</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Auditorium</h3>
                      <p className="text-base font-semibold">{bookingDetails.auditoriumName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Booking ID</h3>
                      <p className="text-base font-semibold">{bookingDetails.bookingId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                      <p className="text-base">{bookingDetails.bookingDate}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                      <p className="text-base">{bookingDetails.bookingTime}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Event Type</h3>
                      <p className="text-base">{bookingDetails.eventType}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Capacity</h3>
                      <p className="text-base">{bookingDetails.capacity}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Amenities</h3>
                    <p className="text-base">{bookingDetails.amenities}</p>
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
                    <Input id="name" placeholder="John Doe" className="bg-white border-[#b09d94]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="bg-white border-[#b09d94]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" className="bg-white border-[#b09d94]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St" className="bg-white border-[#b09d94]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Payment Details */}
          <div>
            <Tabs defaultValue="advance" onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-2 w-full bg-amber-50 p-1">
                <TabsTrigger
                  value="advance"
                  className="data-[state=active]:bg-[#78533F] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 font-medium"
                >
                  Advance Booking
                </TabsTrigger>
                <TabsTrigger
                  value="full"
                  className="data-[state=active]:bg-[#78533F] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 font-medium"
                >
                  Full Booking
                </TabsTrigger>
              </TabsList>

              <TabsContent value="advance" className="mt-4">
                <Card className="border-[#b09d94] shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-[#78533F]/10 to-[#ED695A]/10 rounded-t-lg border-b border-[#b09d94]">
                    <CardTitle className="text-xl">Advance Booking Payment</CardTitle>
                    <CardDescription>Pay the advance amount to secure your booking</CardDescription>
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
                              <span className="text-muted-foreground">Advance Amount</span>
                              <span>₹{paymentDetails.advanceAmount.toLocaleString()}</span>
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
                        <h3 className="text-xl font-bold text-[#78533F]">Payment Successful!</h3>
                        <p className="text-center text-muted-foreground">
                          Your advance payment of ₹{paymentDetails.total.toLocaleString()} has been received.
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
              </TabsContent>

              <TabsContent value="full" className="mt-4">
                <Card className="border-[#b09d94] shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-[#78533F]/10 to-[#ED695A]/10 rounded-t-lg border-b border-[#b09d94]">
                    <CardTitle className="text-xl">Full Booking Payment</CardTitle>
                    <CardDescription>Pay the full amount for your booking</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {paymentStatus === "pending" ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-base font-medium mb-3">Select Payment Method</h3>
                          <RadioGroup defaultValue="credit" className="space-y-3">
                            <div className="flex items-center space-x-3 border border-[#b09d94] p-3 rounded-md hover:bg-amber-50 transition-colors hover:border-[#78533F] cursor-pointer shadow-sm">
                              <RadioGroupItem value="credit" id="credit-full" />
                              <Label htmlFor="credit-full" className="flex items-center gap-2 cursor-pointer">
                                <CreditCard className="h-5 w-5 text-[#78533F]" />
                                <span>Credit Card</span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border border-[#b09d94] p-3 rounded-md hover:bg-amber-50 transition-colors hover:border-[#78533F] cursor-pointer shadow-sm">
                              <RadioGroupItem value="debit" id="debit-full" />
                              <Label htmlFor="debit-full" className="flex items-center gap-2 cursor-pointer">
                                <Landmark className="h-5 w-5 text-[#78533F]" />
                                <span>Debit Card</span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border border-[#b09d94] p-3 rounded-md hover:bg-amber-50 transition-colors hover:border-[#78533F] cursor-pointer shadow-sm">
                              <RadioGroupItem value="upi" id="upi-full" />
                              <Label htmlFor="upi-full" className="flex items-center gap-2 cursor-pointer">
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
                              <RadioGroupItem value="cash" id="cash-full" />
                              <Label htmlFor="cash-full" className="flex items-center gap-2 cursor-pointer">
                                <Wallet className="h-5 w-5 text-[#78533F]" />
                                <span>Cash</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="border-t border-[#b09d94] pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Full Amount</span>
                              <span>₹{paymentDetails.fullAmount.toLocaleString()}</span>
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
                        <h3 className="text-xl font-bold text-[#78533F]">Payment Successful!</h3>
                        <p className="text-center text-muted-foreground">
                          Your full payment of ₹{paymentDetails.total.toLocaleString()} has been received.
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}