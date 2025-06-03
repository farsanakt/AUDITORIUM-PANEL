import React, { useState, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, X, Eye, EyeOff } from 'lucide-react';
import Header from '../../component/user/Header';
import Sidebar from '../../component/auditorium/Sidebar';
import { useNavigate } from 'react-router-dom';

// Import your existing components

interface TimeSlot {
  id: string;
  time: string;
  status: "available" | "booked" | "waitlist" | "maintenance";
  price: number;
}

interface Venue {
  id: string;
  name: string;
  timeSlots: TimeSlot[];
}

interface BookingDetails {
  customerName: string;
  contactNumber: string;
  balancePayable: number;
  bookingId: string;
}

interface TooltipData {
  x: number;
  y: number;
  date: number;
  status: string;
  bookingDetails?: BookingDetails;
}

const VenueBookingPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedVenue, setSelectedVenue] = useState<string>("auditorium");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [acOption, setAcOption] = useState<"ac" | "non-ac">("ac");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cancellingDate, setCancellingDate] = useState<number | null>(null);
  const navigate=useNavigate()
  
  // Add refs for tooltip management
  const hideTimeoutRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const venues: Venue[] = [
    {
      id: "auditorium",
      name: "Golden Auditorium",
      timeSlots: [
        { id: "1", time: "Morning (6 AM - 10 AM)", status: "available", price: 500 },
        { id: "2", time: "Late Morning (10 AM - 2 PM)", status: "booked", price: 700 },
        { id: "3", time: "Afternoon (2 PM - 6 PM)", status: "waitlist", price: 600 },
        { id: "4", time: "Evening (6 PM - 9 PM)", status: "maintenance", price: 800 },
      ],
    },
    {
      id: "conference",
      name: "Conference Hall",
      timeSlots: [
        { id: "1", time: "Morning (6 AM - 10 AM)", status: "booked", price: 400 },
        { id: "2", time: "Late Morning (10 AM - 2 PM)", status: "available", price: 600 },
        { id: "3", time: "Afternoon (2 PM - 6 PM)", status: "available", price: 500 },
        { id: "4", time: "Evening (6 PM - 9 PM)", status: "waitlist", price: 700 },
      ],
    },
  ];

  const timeSlots = [
    { id: "morning", name: "Morning (6 AM - 10 AM)" },
    { id: "late-morning", name: "Late Morning (10 AM - 2 PM)" },
    { id: "afternoon", name: "Afternoon (2 PM - 6 PM)" },
    { id: "evening", name: "Evening (6 PM - 9 PM)" },
  ];

  // Sample booking details for demo
  const getBookingDetails = (date: number): BookingDetails | undefined => {
    const sampleBookings: { [key: number]: BookingDetails } = {
      7: { customerName: "John Doe", contactNumber: "+1-234-567-8901", balancePayable: 350, bookingId: "BK001" },
      14: { customerName: "Jane Smith", contactNumber: "+1-234-567-8902", balancePayable: 250, bookingId: "BK002" },
      21: { customerName: "Mike Johnson", contactNumber: "+1-234-567-8903", balancePayable: 450, bookingId: "BK003" },
      9: { customerName: "Sarah Wilson", contactNumber: "+1-234-567-8904", balancePayable: 200, bookingId: "BK004" },
      23: { customerName: "David Brown", contactNumber: "+1-234-567-8905", balancePayable: 300, bookingId: "BK005" },
    };
    return sampleBookings[date];
  };

  const getDateStatus = (date: number): "available" | "booked" | "waitlist" | "maintenance" | "none" => {
    const sampleStatuses: { [key: number]: "available" | "booked" | "waitlist" | "maintenance" | "none" } = {
      3: "waitlist",
      5: "available",
      7: "booked",
      9: "maintenance",
      11: "booked",
      13: "available",
      16:"waitlist",
      26: "booked",
      28: "booked",
      30: "maintenance",
      
    };
    return sampleStatuses[date] || "none";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "booked":
        return "bg-red-500 hover:bg-red-600";
      case "waitlist":
        return "bg-amber-500 hover:bg-amber-600";
      case "maintenance":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "hover:bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "booked":
        return "Booked";
      case "waitlist":
        return "Waiting List";
      case "maintenance":
        return "Maintenance";
      default:
        return "";
    }
  };

  const isSelectable = (status: string) => {
    return status === "available" || status === "waitlist";
  };

  const handleDateClick = (date: number) => {
    const status = getDateStatus(date);
    if (isSelectable(status)) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
      setSelectedDate(newDate);
      setShowConfirmation(true);
    }
  };

  const handleMouseEnter = (event: React.MouseEvent, date: number) => {
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    const status = getDateStatus(date);
    if (status === "booked" || status === "waitlist") {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        date,
        status,
        bookingDetails: getBookingDetails(date),
      });
    }
  };

  const handleMouseLeave = () => {
    // Add a delay before hiding the tooltip
    hideTimeoutRef.current = window.setTimeout(() => {
      setTooltip(null);
    }, 200); // 200ms delay
  };

  const handleTooltipMouseEnter = () => {
    // Clear the hide timeout when mouse enters tooltip
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    // Hide tooltip when mouse leaves tooltip area
    setTooltip(null);
  };

  const handleCancelBooking = (date: number) => {
    setCancellingDate(date);
    setShowCancelConfirm(true);
    setTooltip(null);
  };

  const confirmCancellation = () => {
    setShowCancelConfirm(false);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = () => {
    if (password === "admin123") {
      console.log(`Booking cancelled for date ${cancellingDate}`);
      setShowPasswordModal(false);
      setPassword("");
      setCancellingDate(null);
      // Here you would update the booking status
    } else {
      alert("Incorrect password!");
    }
  };

  const handleConfirmSlot = () => {
    console.log("Proceeding to booking confirmation");
    navigate('/Bookingconfirmation')
    setShowConfirmation(false);
    setSelectedSlot(null);
  };

  const handleCancelSlot = () => {
    setShowConfirmation(false);
    setSelectedSlot(null);
  };

  const getCurrentVenue = () => {
    return venues.find((venue) => venue.id === selectedVenue);
  };

  const handleGoBack = () => {
    console.log("Going back");
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getDateStatus(day);
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          onMouseEnter={(e) => handleMouseEnter(e, day)}
          onMouseLeave={handleMouseLeave}
          className={`
            h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer
            transition-all duration-200 hover:scale-105 relative
            ${status !== "none" ? getStatusColor(status) + " text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}
            ${isSelected ? "ring-2 ring-offset-2 ring-indigo-500" : ""}
            ${isSelectable(status) ? "hover:shadow-lg" : status !== "none" ? "cursor-not-allowed" : ""}
          `}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const renderMiniCalendar = (monthOffset: number, title: string) => {
    const miniDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const miniDaysInMonth = getDaysInMonth(miniDate);
    const miniFirstDay = getFirstDayOfMonth(miniDate);
    const miniDays = [];

    // Add empty cells
    for (let i = 0; i < miniFirstDay; i++) {
      miniDays.push(<div key={`mini-empty-${i}`} className="h-5"></div>);
    }

    // Add days
    for (let day = 1; day <= miniDaysInMonth; day++) {
      const status = getDateStatus(day);
      const getMiniStatusColor = (status: string) => {
        switch (status) {
          case "available":
            return "bg-emerald-500 text-white";
          case "booked":
            return "bg-red-500 text-white";
          case "waitlist":
            return "bg-amber-500 text-white";
          case "maintenance":
            return "bg-blue-500 text-white";
          default:
            return "text-gray-600 hover:bg-gray-100";
        }
      };

      miniDays.push(
        <div 
          key={day} 
          className={`h-5 w-5 flex items-center justify-center text-xs rounded transition-colors ${getMiniStatusColor(status)}`}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-sm font-semibold text-center mb-3 text-gray-700">{title}</h3>
        <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day} className="font-medium text-gray-500 h-5 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{miniDays}</div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <Header />

      <div className="w-64 shrink-0 h-[calc(100vh-64px)] sticky top-16 hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col mt-12 overflow-hidden">
        <main className="flex-1 p-6  from-blue-50 via-white to-purple-50">
          
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* AC/Non-AC Dropdown */}
            <div className="w-48">
              <select
                value={acOption}
                onChange={(e) => setAcOption(e.target.value as "ac" | "non-ac")}
                className="w-full bg-white border border-[#b09d94] rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              >
                <option value="ac">AC</option>
                <option value="non-ac">Non-AC</option>
              </select>
            </div>

            {/* Venue Time Dropdown */}
            <div className="w-64">
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full bg-white border border-[#b09d94] rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              >
                {timeSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="flex items-center px-6 py-3 bg-white text-gray-700 border border-[#b09d94] rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>

        {/* Calendar Section */}
        <div className="flex justify-center items-center gap-8 mb-8">
          {/* Previous Month Mini Calendar */}
          <div className="hidden lg:block">
            {renderMiniCalendar(
              -1,
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                .toLocaleDateString("en-US", { month: "long" })
                .toUpperCase()
            )}
          </div>

          {/* Main Calendar */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors group"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
              </button>

              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase()}
                </h2>
              </div>

              <button
                onClick={() => navigateMonth("next")}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors group"
              >
                <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-3 mb-6">
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-3">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-3">{renderCalendar()}</div>
          </div>

          {/* Next Month Mini Calendar */}
          <div className="hidden lg:block">
            {renderMiniCalendar(
              1,
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                .toLocaleDateString("en-US", { month: "long" })
                .toUpperCase()
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-red-600 font-medium">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                <span className="text-emerald-600 font-medium">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <span className="text-amber-600 font-medium">Waiting List</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-blue-600 font-medium">Maintenance</span>
              </div>
            </div>
          </div>
        </div>
        </main>
        
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          ref={tooltipRef}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          className="fixed z-50 bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700 max-w-xs"
          style={{
            left: tooltip.x - 150,
            top: tooltip.y - 180,
            transform: "translateX(-50%)",
          }}
        >
          <div className="space-y-2">
            <div className="font-semibold text-center border-b border-gray-600 pb-2">
              Date: {tooltip.date} - {getStatusText(tooltip.status)}
            </div>
            {tooltip.bookingDetails && (
              <>
                <div className="text-sm">
                  <strong>Customer:</strong> {tooltip.bookingDetails.customerName}
                </div>
                <div className="text-sm">
                  <strong>Contact:</strong> {tooltip.bookingDetails.contactNumber}
                </div>
                <div className="text-sm">
                  <strong>Balance:</strong> ${tooltip.bookingDetails.balancePayable}
                </div>
                <div className="text-sm">
                  <strong>Booking ID:</strong> {tooltip.bookingDetails.bookingId}
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-600">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors">
                    Edit Details
                  </button>
                  <button
                    onClick={() => handleCancelBooking(tooltip.date)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Confirm Booking</h3>
            <p className="mb-6 text-gray-600">You have selected the following date:</p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6 border border-blue-100">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Venue:</span>
                  <span className="text-gray-800">{getCurrentVenue()?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="text-gray-800">{acOption.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="text-gray-800">{selectedDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full text-white ${getStatusColor(getDateStatus(selectedDate.getDate()))}`}
                  >
                    {getStatusText(getDateStatus(selectedDate.getDate()))}
                  </span>
                </div>
              </div>
            </div>

            <p className="mb-6 text-gray-600">Would you like to proceed with this booking?</p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelSlot}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSlot}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Proceed to Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-semibold text-red-600 mb-6">Cancel Booking</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to cancel the booking for date {cancellingDate}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
              >
                No, Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">Enter Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-gray-600">Please enter your password to confirm the cancellation:</p>
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueBookingPage;