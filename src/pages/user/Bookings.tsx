import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Calendar, User, MapPin, Phone, DollarSign, X } from 'lucide-react';
import Header from '../../component/user/Header';
import Lines from '../../assets/vector.png'
import Homeicon from '../../assets/homeIcon.png'
import { useNavigate } from 'react-router-dom';

interface BookingFormData {
  name: string;
  bookingDate: string;
  address: string;
  partyType: string;
  mobile: string;
  totalAmount: string;
  advanceAmount: string;
}

const Bookings: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2021, 11, 1)); // December 2021
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<'calendar' | 'form' | 'details' | 'payment'>('calendar');
  const [acOption, setAcOption] = useState('');
  const [venueTime, setVenueTime] = useState('');
  const [venueHall, setVenueHall] = useState('');
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    bookingDate: '',
    address: '',
    partyType: '',
    mobile: '',
    totalAmount: '',
    advanceAmount: ''
  });
  const navigate=useNavigate()

  // Calendar data - dates with different statuses
  const bookedDates = [6, 10, 15, 24, 29];
  const waitingListDates = [28];
  const maintenanceDates = [30, 31, 1, 2, 3, 4, 5]; // Next month dates

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month's last days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const prevMonthDays = getDaysInMonth(prevMonth);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false
      });
    }

    // Next month's first days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false
      });
    }

    return days;
  };

  const getDateStatus = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return null;
    if (bookedDates.includes(day)) return 'booked';
    if (waitingListDates.includes(day)) return 'waiting';
    if (maintenanceDates.includes(day)) return 'maintenance';
    return 'available';
  };

  const getDateClassName = (day: number, isCurrentMonth: boolean) => {
    const baseClass = "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all hover:scale-105";
    
    if (!isCurrentMonth) {
      return `${baseClass} text-gray-400`;
    }

    const status = getDateStatus(day, isCurrentMonth);
    switch (status) {
      case 'booked':
        return `${baseClass} bg-red-500 text-white`;
      case 'waiting':
        return `${baseClass} bg-yellow-500 text-white`;
      case 'maintenance':
        return `${baseClass} bg-purple-500 text-white`;
      case 'available':
        return selectedDate === day 
          ? `${baseClass} bg-blue-500 text-white`
          : `${baseClass} bg-green-100 text-green-800 hover:bg-green-200`;
      default:
        return selectedDate === day 
          ? `${baseClass} bg-blue-500 text-white`
          : `${baseClass} text-gray-700 hover:bg-gray-100`;
    }
  };

  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth && getDateStatus(day, isCurrentMonth) === 'available') {
      setSelectedDate(day);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !acOption || !venueTime || !venueHall) {
      alert('Please select a date and fill in all booking options');
      return;
    }
    setShowModal(true);
    setCurrentPage('form');
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.bookingDate || !formData.address || 
        !formData.partyType || !formData.mobile || !formData.totalAmount || !formData.advanceAmount) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (formData.partyType === 'wedding') {
      navigate('/details')
    } else {
      setCurrentPage('payment');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPage('calendar');
  };

  const renderCalendar = () => (
 <div className="relative min-h-screen overflow-hidden">
  {/* Background image perfectly aligned to the right */}
  <img
    src={Lines}
    alt="Lines"
    className="fixed top-0 right-0 h-full object-cover z-0 scale-140"
    style={{ maxWidth: 'none' }}
  />
   <div className="relative z-10 p-4">
        
      <div className="max-w-6xl mx-auto">
        <Header/>
        <div className="  overflow-hidden">
          {/* Header */}
          <div className="  p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-[#845e38]">Safa Auditorium</h1>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Kottayil
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Confirm your venue from our</p>
                  <p className="text-sm text-gray-600">calendar and mark your booking date</p>
                </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <img src={Homeicon} alt="Custom Icon" className="w-12 h-12 object-contain" />
                </div>

              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendar Section - LEFT */}
              <div className="space-y-6">
                {/* Square Calendar with Shadow */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 aspect-square flex flex-col">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <button 
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button 
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Days of Week */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <div key={index} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="flex-1">
                    <div className="grid grid-cols-7 gap-1 h-full">
                      {generateCalendarDays().map((dateObj, index) => (
                        <div
                          key={index}
                          className={getDateClassName(dateObj.day, dateObj.isCurrentMonth)}
                          onClick={() => handleDateClick(dateObj.day, dateObj.isCurrentMonth)}
                          style={{ aspectRatio: '1' }}
                        >
                          {dateObj.day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend - Below Calendar */}
                <div className="  p-6">
                  {/* <h4 className="text-lg font-semibold text-gray-800 mb-4">Legend</h4> */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded-full"></div>
                      <span className="text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">Date Booked</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">Waiting List</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">Under Maintenance</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form Section - RIGHT */}
                        <div
                className="rounded-2xl  p-6 "
                
                >
                {/* <h3 className="text-xl font-semibold text-gray-800 mb-6">Book Your Event</h3> */}

                <div className="space-y-4">
                    <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">AC</label> */}
                    <select 
                        value={acOption}
                        onChange={(e) => setAcOption(e.target.value)}
                        className="w-90 p-3 ml-44 mt-20 border border-[#b09d94] text-[#49516F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
                    >
                        <option value=""> AC </option>
                        <option value="ac">With AC</option>
                        <option value="non-ac">Without AC</option>
                    </select>
                    </div>

                    <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Venue Time</label> */}
                    <select 
                        value={venueTime}
                        onChange={(e) => setVenueTime(e.target.value)}
                        className="w-90 p-3 ml-44 mt-8 border border-[#b09d94] text-[#49516F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
                    >
                        <option value=""> Time </option>
                        <option value="morning">Morning (9 AM - 1 PM)</option>
                        <option value="afternoon">Afternoon (2 PM - 6 PM)</option>
                        <option value="evening">Evening (7 PM - 11 PM)</option>
                        <option value="full-day">Full Day</option>
                    </select>
                    </div>

                    <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Venue Hall</label> */}
                    <select 
                        value={venueHall}
                        onChange={(e) => setVenueHall(e.target.value)}
                        className="w-90 p-3 ml-44 border mt-8 border-gray-300  text-[#49516F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
                    >
                        <option value=""> Hall</option>
                        <option value="main-hall">Main Hall</option>
                        <option value="conference-hall">Conference Hall</option>
                        <option value="banquet-hall">Banquet Hall</option>
                    </select>
                    </div>

                    <button
                    onClick={handleConfirmBooking}
                    className="w-90 ml-44 mt-8 bg-[#876553] to-pink-500 text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg"
                    >
                    Confirm your Booking!
                    </button>
                </div>

                {selectedDate && (
                    <div className="mt-4 p-3 ml-44 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                        Selected Date: {selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </p>
                    </div>
                )}

                {/* Booking Requirements (Optional) */}
                {/* 
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700 font-medium">Required for booking:</p>
                    <ul className="text-sm text-yellow-600 mt-1">
                    <li>✓ Select a date</li>
                    <li>✓ Choose AC option</li>
                    <li>✓ Select time slot</li>
                    <li>✓ Choose hall</li>
                    </ul>
                </div> 
                */}
                </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {currentPage === 'form' && renderBookingForm()}
            {currentPage === 'details' && renderDetailsPage()}
            {currentPage === 'payment' && renderPaymentPage()}
          </div>
        </div>
      )}
      </div>
    </div>
  );

  const renderBookingForm = () => (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center flex-1">
          <h2 className="text-3xl font-bold text-[#9c7c5d] mb-2">Complete Your Booking</h2>
          <p className="text-gray-600">Fill in the details to confirm your reservation</p>
        </div>
        <button
          onClick={closeModal}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-3 border border-[#b09d94]0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Booking Date
          </label>
          <input
            type="date"
            required
            value={formData.bookingDate}
            onChange={(e) => handleInputChange('bookingDate', e.target.value)}
            className="w-full p-3 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Address
          </label>
          <textarea
            required
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full p-3 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent h-24 resize-none"
            placeholder="Enter your complete address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Party Type</label>
          <select
            required
            value={formData.partyType}
            onChange={(e) => handleInputChange('partyType', e.target.value)}
            className="w-full p-3 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
          >
            <option value="">Select Party Type</option>
            <option value="wedding">Wedding</option>
            <option value="birthday">Birthday Party</option>
            <option value="corporate">Corporate Event</option>
            <option value="conference">Conference</option>
            <option value="cultural">Cultural Event</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Mobile Number
          </label>
          <input
            type="tel"
            required
            value={formData.mobile}
            onChange={(e) => handleInputChange('mobile', e.target.value)}
            className="w-full p-3 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
            placeholder="Enter your mobile number"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Amount
            </label>
            <input
              type="number"
              required
              value={formData.totalAmount}
              onChange={(e) => handleInputChange('totalAmount', e.target.value)}
              className="w-full p-3 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
              placeholder="₹0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
            <input
              type="number"
              required
              value={formData.advanceAmount}
              onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
              className="w-full p-3 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
              placeholder="₹0"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFormSubmit}
            className="flex-1 bg-[#876553] from-orange-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );

  const renderDetailsPage = () => (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Wedding Details</h2>
          <p className="text-gray-600">Please provide additional wedding information</p>
        </div>
        <button
          onClick={closeModal}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      
      <div className="space-y-4 text-center">
        <p className="text-lg">Wedding arrangements require special coordination.</p>
        <p className="text-gray-600">Our team will contact you within 24 hours to discuss your specific requirements.</p>
        
        <div className="bg-green-50 p-4 rounded-lg mt-6">
          <p className="text-green-800 font-semibold">Booking Confirmed!</p>
          <p className="text-green-700">Reference ID: WED-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>

        <button
          onClick={closeModal}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  );

  const renderPaymentPage = () => (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment</h2>
          <p className="text-gray-600">Complete your booking payment</p>
        </div>
        <button
          onClick={closeModal}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Name: {formData.name}</p>
            <p>Date: {formData.bookingDate}</p>
            <p>Party Type: {formData.partyType}</p>
            <p>Total Amount: ₹{formData.totalAmount}</p>
            <p>Advance Amount: ₹{formData.advanceAmount}</p>
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-lg mb-4">Payment gateway integration would go here</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 font-semibold">Payment Pending</p>
            <p className="text-blue-700">Reference ID: PMT-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>

        <button
          onClick={closeModal}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  );

  return renderCalendar();
};

export default Bookings;