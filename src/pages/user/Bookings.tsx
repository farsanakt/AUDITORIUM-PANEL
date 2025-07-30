import React, { useEffect, useState, Component, ErrorInfo } from 'react';
import { ChevronLeft, ChevronRight, MapPin, X, CheckCircle } from 'lucide-react';
import Header from '../../component/user/Header';
import Lines from '../../assets/vector.png';
import Homeicon from '../../assets/homeIcon.png';
import { useNavigate, useParams } from 'react-router-dom';
import { singleVenueDetails, createBooking } from '../../api/userApi';


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
          <p>{this.state.error?.message}</p>
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const navigate = useNavigate();
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

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
        }));
        setBookedDates((venueData.bookedDates || []).map((date: string) => new Date(date)).filter((date: Date) => !isNaN(date.getTime())));
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

  useEffect(() => {
    if (id) {
      fetchVenueData();
    } else {
      setError('Invalid venue ID');
      setLoading(false);
    }
  }, [id]);

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add previous month's days to fill the grid
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const prevMonthDays = getDaysInMonth(prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push({
        day,
        date,
        isCurrentMonth: true,
      });
    }

    // Add next month's days to fill the grid
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

  const getDateStatus = (date: Date | null) => {
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = date < today;
    const isBooked = bookedDates.some(bookedDate =>
      bookedDate.toDateString() === date.toDateString()
    );
    if (isPast) return 'past';
    if (isBooked) return 'booked';
    return 'available';
  };

  const getDateClassName = (date: Date | null, isCurrentMonth: boolean) => {
    const baseClass = "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all";
    
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
      ? `${baseClass} bg-blue-500 text-white cursor-pointer hover:scale-105`
      : `${baseClass} bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 hover:scale-105`;
  };

  const handleDateClick = (date: Date | null) => {
    if (date && getDateStatus(date) === 'available') {
      setSelectedDate(date);
      setFormData(prev => ({
        ...prev,
        bookingDate: date.toISOString().split('T')[0],
      }));
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
    setShowModal(true);
    setCurrentPage('form');
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = async () => {
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

    try {
     const response= await createBooking(formData)
      console.log('Booking data sent to backend:', response);
      setCurrentPage('success');
      navigate('/')
    } catch (error) {
      alert('Error processing payment. Please try again.');
      console.error('Payment error:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPage('calendar');
    setSelectedPaymentMethod('');
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
      <div className="relative min-h-screen overflow-hidden">
        <img
          src={Lines}
          alt="Lines"
          className="fixed top-0 right-0 h-full object-cover z-0 scale-140"
          style={{ maxWidth: 'none' }}
        />
        <div className="relative z-10 p-4">
          <div className="max-w-6xl mx-auto">
            <Header />
            <div className="overflow-hidden">
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h1 className="text-2xl font-bold text-[#845e38]">{venue?.name || 'Venue'}</h1>
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

              <div className="p-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 aspect-square flex flex-col">
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
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

                  <div className="rounded-2xl p-6">
                    <div className="space-y-4">
                      <select 
                        value={acOption}
                        onChange={(e) => setAcOption(e.target.value)}
                        className="w-90 p-3 ml-44 mt-20 border border-[#b09d94] text-[#49516F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
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
                        className="w-90 p-3 ml-44 mt-8 border border-[#b09d94] text-[#49516F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
                      >
                        <option value="">Select Time Slot</option>
                        {venue?.timeSlots?.map((slot, index) => (
                          <option key={index} value={slot.id}>{slot.label}</option>
                        )) || <option value="">No time slots available</option>}
                      </select>

                      <select 
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-90 p-3 ml-44 mt-8 border border-[#b09d94] text-[#49516F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent"
                      >
                        <option value="">Select Event Type</option>
                        {venue?.eventTypes?.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        )) || <option value="">No event types available</option>}
                      </select>

                      <button
                        onClick={handleConfirmBooking}
                        className="w-90 ml-44 mt-8 bg-[#876553] text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg hover:bg-[#6e4e3d]"
                        disabled={!venue}
                      >
                        Confirm your Booking!
                      </button>
                    </div>

                    {selectedDate && (
                      <div className="mt-4 p-3 ml-44 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          Selected Date: {selectedDate.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  {currentPage === 'form' && (
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-center flex-1">
                          <h2 className="text-3xl font-bold text-[#845e38]">Booking Form</h2>
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
                            className="w-full p-3 border border-[#b09d94] text-[#49516F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name</label>
                          <input
                            type="text"
                            value={formData.venueName}
                            readOnly
                            className="w-full p-3 border border-[#b09d94] text-[#49516F] rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Booking Date</label>
                          <input
                            type="text"
                            value={formData.bookingDate}
                            readOnly
                            className="w-full p-3 border border-[#b09d94] text-[#49516F] rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                          <input
                            type="text"
                            value={formData.timeSlot}
                            readOnly
                            className="w-full p-3 border border-[#b09d94] text-[#49516F] rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                          <input
                            type="text"
                            value={formData.totalAmount}
                            onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                            className="w-full p-3 border border-[#b09d94] text-[#49516F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
                          <input
                            type="text"
                            value={formData.advanceAmount}
                            onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
                            className="w-full p-3 border border-[#b09d94] text-[#49516F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553]"
                          />
                        </div>
                        <button
                          onClick={handleFormSubmit}
                          className="w-full mt-6 bg-[#876553] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6e4e3d] transition-all shadow-lg"
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </div>
                  )}

                  {currentPage === 'payment' && (
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-center flex-1">
                          <h2 className="text-3xl font-bold text-[#845e38]">Payment</h2>
                          <p className="text-gray-600">Select your payment method</p>
                        </div>
                        <button
                          onClick={closeModal}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">Venue: {formData.venueName}</p>
                          <p className="text-gray-700">Date: {formData.bookingDate}</p>
                          <p className="text-gray-700">Time: {formData.timeSlot}</p>
                          <p className="text-gray-700">Total Amount: {formData.totalAmount}</p>
                          <p className="text-gray-700">Advance Amount: {formData.advanceAmount}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                          <div className="grid grid-cols-3 gap-4">
                            {['Credit/Debit Card', 'UPI', 'Net Banking'].map((method) => (
                              <button
                                key={method}
                                onClick={() => setSelectedPaymentMethod(method)}
                                className={`p-4 rounded-lg border text-[#49516F] transition-all shadow-sm ${
                                  selectedPaymentMethod === method
                                    ? 'bg-[#876553] text-white border-[#876553]'
                                    : 'bg-white border-[#b09d94] hover:bg-[#f5e8df] hover:border-[#876553]'
                                }`}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={handlePaymentSubmit}
                          className="w-full mt-6 bg-[#876553] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6e4e3d] transition-all shadow-lg"
                          disabled={!selectedPaymentMethod}
                        >
                          Complete Payment
                        </button>
                      </div>
                    </div>
                  )}

                  {currentPage === 'success' && (
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-center flex-1">
                          <h2 className="text-3xl font-bold text-[#845e38]">Booking Confirmed!</h2>
                          <p className="text-gray-600">Your booking has been successfully completed</p>
                        </div>
                        <button
                          onClick={() => {
                            closeModal();
                            navigate('/booking-confirmation');
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
                          <p className="text-gray-700">Total Amount: {formData.totalAmount}</p>
                          <p className="text-gray-700">Advance Amount: {formData.advanceAmount}</p>
                          <p className="text-gray-700">Payment Method: {selectedPaymentMethod}</p>
                          <p className="text-gray-700">Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </div>
                        <button
                          onClick={() => {
                            closeModal();
                            navigate('/booking-confirmation');
                          }}
                          className="w-full mt-6 bg-[#876553] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6e4e3d] transition-all shadow-lg"
                        >
                          Close
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