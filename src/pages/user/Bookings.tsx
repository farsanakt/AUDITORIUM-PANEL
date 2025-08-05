import React, { useEffect, useState, Component, ErrorInfo } from 'react';
import { ChevronLeft, ChevronRight, MapPin, X, CheckCircle } from 'lucide-react';
import Header from '../../component/user/Header';
import Lines from '../../assets/vector.png';
import Homeicon from '../../assets/homeIcon.png';
import { useNavigate, useParams } from 'react-router-dom';
import { singleVenueDetails, createBooking, existingBkngs } from '../../api/userApi';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600">
          <h2>Something went wrong!</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button
            className="mt-4 bg-[#876553] text-white py-2 px-4 rounded-lg"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface BookingFormData {
  userEmail: string;
  venueName: string;
  bookingDate: string;
  timeSlot: string;
  totalAmount: string;
  advanceAmount: string;
  venueId: string;
  address: string;
  paymentType: 'full' | 'advance';
  paidAmount: string;
  balanceAmount: string;
}

interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Venue {
  name: string;
  address: string;
  acType: string;
  timeSlots: TimeSlot[];
  tariff: { [key: string]: string };
  bookedDates?: string[];
}

interface Booking {
  bookeddate: string;
  timeSlot: string;
  status: string;
}

const Bookings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<'calendar' | 'form' | 'payment' | 'success'>('calendar');
  const [acOption, setAcOption] = useState('');
  const [venueTime, setVenueTime] = useState('');
  const [eventType, setEventType] = useState('');
  const [venue, setVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    userEmail: '',
    venueName: '',
    bookingDate: '',
    timeSlot: '',
    totalAmount: '',
    advanceAmount: '',
    venueId: id || '',
    address: '',
    paymentType: 'advance',
    paidAmount: '',
    balanceAmount: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const fetchVenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await singleVenueDetails(id!);
      console.log('Venue API response:', response);
      if (response.data) {
        const venueData = response.data;
        const eventTypes = Object.keys(venueData.tariff || {}).filter(key => venueData.tariff[key] === 't');
        setVenue({
          ...venueData,
          eventTypes,
        });
        setFormData(prev => ({
          ...prev,
          venueName: venueData.name || '',
          totalAmount: venueData.totalamount || '',
          advanceAmount: venueData.advAmnt || '',
          venueId: id || '',
          paidAmount: venueData.advAmnt || '',
          balanceAmount: venueData.totalamount ? 
            (parseFloat(venueData.totalamount) - parseFloat(venueData.advAmnt || '0')).toString() : '',
        }));
      } else {
        setError('No venue data received');
      }
    } catch (error) {
      console.error('Error fetching venue data:', error);
      setError('Failed to load venue data');
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingBookings = async () => {
    try {
      const response = await existingBkngs(id!);
      console.log('Existing bookings:', response);
      if (response.data) {
        const bookingData = Array.isArray(response.data) ? response.data : [response.data];
        setBookings(bookingData);
      } else {
        console.warn('Existing bookings response is empty:', response.data);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching existing bookings:', error);
      setBookings([]);
      setError('Failed to load existing bookings');
    }
  };

  useEffect(() => {
    if (id) {
      fetchVenueData();
      fetchExistingBookings();
    } else {
      setError('Invalid venue ID');
      setLoading(false);
    }
  }, [id]);

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const prevMonthDays = getDaysInMonth(prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push({
        day,
        date,
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getTimeSlotStatus = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const bookedSlots = bookings
      .filter(booking => booking.bookeddate === dateString && booking.status !== 'cancelled')
      .map(booking => booking.timeSlot);
    
    return venue?.timeSlots?.map(slot => ({
      ...slot,
      isBooked: bookedSlots.includes(slot.id),
    })) || [];
  };

  const getDateStatus = (date: Date | null) => {
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = date < today;
    const dateString = date.toISOString().split('T')[0];
    const bookedSlots = bookings.filter(booking => 
      booking.bookeddate === dateString && booking.status !== 'cancelled'
    );
    
    if (isPast) return 'past';
    if (bookedSlots.length >= (venue?.timeSlots?.length || 0)) return 'booked';
    return 'available';
  };

  const getDateClassName = (date: Date | null, isCurrentMonth: boolean) => {
    const baseClass = "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all relative group";
    
    if (!isCurrentMonth || !date) {
      return `${baseClass} text-gray-400 cursor-not-allowed`;
    }

    const status = getDateStatus(date);
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    
    if (status === 'past') {
      return `${baseClass} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }
    if (status === 'booked') {
      return `${baseClass} bg-red-500 text-white cursor-not-allowed`;
    }
    
    return isSelected 
      ? `${baseClass} bg-blue-600 text-white cursor-pointer hover:scale-105`
      : `${baseClass} bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 hover:scale-105`;
  };

  const getTooltipContent = (date: Date) => {
    const slots = getTimeSlotStatus(date);
    return (
      <div className="absolute z-20 bg-white p-3 rounded-lg shadow-xl border border-gray-200 top-full mt-2 text-sm max-w-xs sm:max-w-sm bg-opacity-95 transform -translate-x-1/2 left-1/2">
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
        <p className="font-semibold text-gray-800 mb-2">Time Slots:</p>
        {slots.length > 0 ? (
          slots.map(slot => (
            <div key={slot.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${slot.isBooked ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <p className={slot.isBooked ? 'text-red-600' : 'text-green-600'}>
                {slot.label}: {slot.isBooked ? 'Booked' : 'Available'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No time slots available</p>
        )}
      </div>
    );
  };

  const isSlotBooked = (date: Date | null, slotId: string) => {
    if (!date) return false;
    const dateString = date.toISOString().split('T')[0];
    return bookings.some(booking => 
      booking.bookeddate === dateString && 
      booking.timeSlot === slotId && 
      booking.status !== 'cancelled'
    );
  };

  const handleDateClick = (date: Date | null) => {
    if (date && getDateStatus(date) === 'available') {
      setSelectedDate(date);
      setFormData(prev => ({
        ...prev,
        bookingDate: date.toISOString().split('T')[0],
      }));
      setVenueTime('');
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(direction === 'prev' ? prev.getMonth() - 1 : prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !acOption || !venueTime || !eventType) {
      alert('Please select a date and fill in all booking options');
      return;
    }
    if (isSlotBooked(selectedDate, venueTime)) {
      alert('This time slot is already booked. Please select another slot.');
      return;
    }
    setShowModal(true);
    setCurrentPage('form');
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentTypeChange = (type: 'full' | 'advance') => {
    setFormData(prev => ({
      ...prev,
      paymentType: type,
      paidAmount: type === 'full' ? prev.totalAmount : prev.advanceAmount,
      balanceAmount: type === 'full' ? '0' : 
        (parseFloat(prev.totalAmount || '0') - parseFloat(prev.advanceAmount || '0')).toString(),
    }));
  };

  const handleFormSubmit = async () => {
    if (!formData.userEmail || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      setCurrentPage('payment');
    } catch (error) {
      alert('Error submitting booking. Please try again.');
      console.error('Booking submission error:', error);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    if (isSlotBooked(selectedDate, formData.timeSlot)) {
      alert('This time slot is already booked. Please select another slot.');
      return;
    }

    try {
      const bookingData = {
        venueName: formData.venueName,
        venueId: formData.venueId,
        totalAmount: formData.totalAmount,
        paidAmount: formData.paidAmount,
        balanceAmount: formData.balanceAmount,
        userEmail: formData.userEmail,
        bookedDate: formData.bookingDate,
        timeSlot: formData.timeSlot,
        address: formData.address,
      };
      const response = await createBooking(bookingData);
      console.log('Booking data sent to backend:', response);
      await fetchExistingBookings();
      setCurrentPage('success');
    } catch (error) {
      alert('Error processing payment. Please try again.');
      console.error('Payment error:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPage('calendar');
    setSelectedPaymentMethod('');
    setVenueTime('');
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <h2>Error</h2>
        <p>{error}</p>
        <button
          className="mt-4 bg-[#876553] text-white py-2 px-4 rounded-lg"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const renderCalendar = () => (
    <ErrorBoundary>
      <div className="relative min-h-screen overflow-hidden bg-gray-50">
        <img
          src={Lines}
          alt="Lines"
          className="fixed top-0 right-0 h-full object-cover z-0 scale-140 sm:scale-100 opacity-10"
          style={{ maxWidth: 'none' }}
        />
        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Header />
            <div className="overflow-hidden">
              <div className="p-2 sm:p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-[#845e38]">{venue?.name || 'Venue'}</h1>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {venue?.address || 'Location'}
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

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 aspect-square flex flex-col border border-gray-100">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <button 
                          onClick={() => navigateMonth('prev')}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button 
                          onClick={() => navigateMonth('next')}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-4">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                          <div key={index} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="flex-1">
                        <div className="grid grid-cols-7 gap-1 h-full">
                          {generateCalendarDays().map((dateObj, index) => (
                            <div
                              key={index}
                              className={getDateClassName(dateObj.date, dateObj.isCurrentMonth)}
                              onClick={() => handleDateClick(dateObj.date)}
                              style={{ aspectRatio: '1' }}
                            >
                              {dateObj.day || ''}
                              {dateObj.isCurrentMonth && dateObj.date && (
                                <div className="hidden group-hover:block">
                                  {getTooltipContent(dateObj.date)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded-full"></div>
                          <span className="text-gray-600">Available</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600">Booked</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-4 bg-gray-100 border-2 border-gray-400 rounded-full"></div>
                          <span className="text-gray-600">Past</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 sm:p-6 bg-white shadow-xl border border-gray-100">
                    <div className="space-y-4">
                      <select 
                        value={acOption}
                        onChange={(e) => setAcOption(e.target.value)}
                        className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent transition-all"
                      >
                        <option value="">Select AC Option</option>
                        {venue?.acType ? <option value={venue.acType}>{venue.acType}</option> : <option value="">No AC option available</option>}
                      </select>

                      <select 
                        value={venueTime}
                        onChange={(e) => {
                          setVenueTime(e.target.value);
                          setFormData(prev => ({ ...prev, timeSlot: e.target.value }));
                        }}
                        className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent transition-all"
                      >
                        <option value="">Select Time Slot</option>
                        {selectedDate ? (
                          getTimeSlotStatus(selectedDate).map((slot, index) => (
                            <option 
                              key={index} 
                              value={slot.id} 
                              disabled={slot.isBooked}
                              className={slot.isBooked ? 'text-red-500' : 'text-green-500'}
                            >
                              {slot.label} {slot.isBooked ? '(Booked)' : '(Available)'}
                            </option>
                          ))
                        ) : (
                          <option value="">Select a date first</option>
                        )}
                      </select>

                      <select 
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent transition-all"
                      >
                        <option value="">Select Event Type</option>
                        {venue?.eventTypes?.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        )) || <option value="">No event types available</option>}
                      </select>

                      <button
                        onClick={handleConfirmBooking}
                        className="w-full mt-6 bg-[#876553] text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-md hover:bg-[#6e4e3d] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!venue}
                      >
                        Confirm your Booking!
                      </button>
                    </div>

                    {selectedDate && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700 font-medium">
                          Selected Date: {selectedDate.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-blue-700 font-medium">
                          Available Slots: {getTimeSlotStatus(selectedDate).filter(slot => !slot.isBooked).length}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  {currentPage === 'form' && (
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="text-center flex-1">
                          <h2 className="text-2xl sm:text-3xl font-bold text-[#845e38]">Booking Form</h2>
                          <p className="text-gray-600">Please fill in your booking details</p>
                        </div>
                        <button
                          onClick={closeModal}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            value={formData.userEmail}
                            onChange={(e) => handleInputChange('userEmail', e.target.value)}
                            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] transition-all"
                            placeholder="Enter your email"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] transition-all"
                            placeholder="Enter your address"
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name</label>
                          <input
                            type="text"
                            value={formData.venueName}
                            readOnly
                            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Booking Date</label>
                          <input
                            type="text"
                            value={formData.bookingDate}
                            readOnly
                            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                          <input
                            type="text"
                            value={formData.timeSlot}
                            readOnly
                            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                          <input
                            type="text"
                            value={formData.totalAmount}
                            onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
                          <input
                            type="text"
                            value={formData.advanceAmount}
                            onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
                            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] transition-all"
                          />
                        </div>
                        <button
                          onClick={handleFormSubmit}
                          className="w-full mt-6 bg-[#876553] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6e4e3d] transition-all shadow-md hover:shadow-lg"
                        >
                          Proceed to Payment
                        </button>
                      </div>
                    </div>
                  )}

                  {currentPage === 'payment' && (
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="text-center flex-1">
                          <h2 className="text-2xl sm:text-3xl font-bold text-[#845e38]">Payment</h2>
                          <p className="text-gray-600">Select your payment method</p>
                        </div>
                        <button
                          onClick={closeModal}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">Venue: {formData.venueName}</p>
                          <p className="text-gray-700">Date: {formData.bookingDate}</p>
                          <p className="text-gray-700">Time: {formData.timeSlot}</p>
                          <p className="text-gray-700">Total Amount: {formData.totalAmount}</p>
                          <p className="text-gray-700">Advance Amount: {formData.advanceAmount}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="flex items-center gap-2 p-4 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="paymentType"
                                value="full"
                                checked={formData.paymentType === 'full'}
                                onChange={() => handlePaymentTypeChange('full')}
                                className="text-[#876553] focus:ring-[#876553]"
                              />
                              <span>Full Payment ({formData.totalAmount})</span>
                            </label>
                            <label className="flex items-center gap-2 p-4 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="paymentType"
                                value="advance"
                                checked={formData.paymentType === 'advance'}
                                onChange={() => handlePaymentTypeChange('advance')}
                                className="text-[#876553] focus:ring-[#876553]"
                              />
                              <span>Advance Payment ({formData.advanceAmount})</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {['Credit/Debit Card', 'UPI', 'Net Banking'].map((method) => (
                              <button
                                key={method}
                                onClick={() => setSelectedPaymentMethod(method)}
                                className={`p-4 rounded-lg border text-gray-700 transition-all shadow-sm ${
                                  selectedPaymentMethod === method
                                    ? 'bg-[#876553] text-white border-[#876553]'
                                    : 'bg-white border-gray-300 hover:bg-[#f5e8df] hover:border-[#876553]'
                                }`}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={handlePaymentSubmit}
                          className="w-full mt-6 bg-[#876553] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6e4e3d] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!selectedPaymentMethod}
                        >
                          Complete Payment
                        </button>
                      </div>
                    </div>
                  )}

                  {currentPage === 'success' && (
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="text-center flex-1">
                          <h2 className="text-2xl sm:text-3xl font-bold text-[#845e38]">Booking Confirmed!</h2>
                          <p className="text-gray-600">Your booking has been successfully completed</p>
                        </div>
                        <button
                          onClick={() => {
                            closeModal();
                            navigate('/');
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="space-y-4 text-center">
                        <div className="flex justify-center">
                          <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">Venue: {formData.venueName}</p>
                          <p className="text-gray-700">Date: {formData.bookingDate}</p>
                          <p className="text-gray-700">Time: {formData.timeSlot}</p>
                          <p className="text-gray-700">Event Type: {eventType}</p>
                          <p className="text-gray-700">AC Option: {acOption}</p>
                          <p className="text-gray-700">Address: {formData.address}</p>
                          <p className="text-gray-700">Total Amount: {formData.totalAmount}</p>
                          <p className="text-gray-700">Paid Amount: {formData.paidAmount}</p>
                          <p className="text-gray-700">Balance Amount: {formData.balanceAmount}</p>
                          <p className="text-gray-700">Payment Method: {selectedPaymentMethod}</p>
                          <p className="text-gray-700">Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </div>
                        <button
                          onClick={() => {
                            closeModal();
                            navigate('/');
                          }}
                          className="w-full mt-6 bg-[#876553] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6e4e3d] transition-all shadow-md hover:shadow-lg"
                        >
                          Okay
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );

  return renderCalendar();
};

export default Bookings;