import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/user/Header';
import { fetchUserBookingsByEmail, cancelUserBooking } from '../../api/userApi';
import toast, { Toaster } from 'react-hot-toast';

interface Booking {
  _id: string;
  venueName: string;
  bookeddate: string;
  timeSlot: string;
  totalAmount: string;
  paidAmount: string;
  balanceAmount: string;
  paymentStatus: string;
  status: string;
  userEmail: string;
  venueId: string;
  auditoriumId: string;
  address: string;
  eventType?: string;
}

const Bookings: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchUserBookings = async () => {
    if (!currentUser?.email) return;
    setLoading(true);
    try {
      const response = await fetchUserBookingsByEmail(currentUser.email);
      const data = response?.data?.data || response?.data || [];
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [currentUser?.email]);

  const handleDetailsClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleCertificateClick = (booking: Booking) => {
    navigate(`/details/${booking.userEmail}`);
  };

  const isFutureBooking = (bookeddate: string): boolean => {
    if (!bookeddate) return false;
    const bookingDate = new Date(bookeddate);
    if (isNaN(bookingDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    return bookingDate > today;
  };

  const handleCancelBooking = async (booking: Booking) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <p>
        Are you sure you want to cancel your booking for{" "}
        <span className="font-semibold">{booking.venueName}</span>?
      </p>

      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          No
        </button>

        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={async () => {
            toast.dismiss(t.id);

            setIsCancelling(true);
            try {
              const response = await cancelUserBooking(
                booking._id,
                currentUser?.email || ''
              );

              if (response?.data?.success || response?.status === 200) {
                toast.success('Booking cancelled successfully!', {
                  duration: 4000,
                  position: 'top-center',
                });
                setSelectedBooking(null);
                await fetchUserBookings();
              } else {
                toast.error(
                  response?.data?.message || 'Failed to cancel booking'
                );
              }
            } catch (error: any) {
              const errorMsg =
                error.response?.data?.message ||
                'Something went wrong while cancelling the booking.';
              toast.error(errorMsg);
            } finally {
              setIsCancelling(false);
            }
          }}
        >
          Yes, Cancel
        </button>
      </div>
    </div>
  ), {
    duration: 6000,
  });
};

  // Helper to determine status display
  const getStatusDisplay = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'cancelled') {
      return <span className="text-red-600 font-medium">Cancelled</span>;
    }
    if (lowerStatus === 'confirmed') {
      return <span className="text-green-600 font-medium">Confirmed</span>;
    }
    return <span className="text-gray-600 font-medium capitalize">{status}</span>;
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center px-4 py-6 box-border">
      <Header />
      
      {/* Toast Container */}
      <Toaster position="top-center" richColors />

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#b09d94] overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-white p-4 sm:p-6 border-b border-[#b09d94] flex justify-center">
          <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif">Your Bookings</h2>
        </div>

        {/* Bookings List */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <p className="text-center text-gray-600 font-serif py-8">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-center text-gray-600 font-serif py-8">No bookings found.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const isCancelled = booking.status.toLowerCase() === 'cancelled';
                
                return (
                  <div
                    key={booking._id}
                    className={`flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-[#b09d94] rounded-xl transition-all duration-300 ${
                      isCancelled ? 'opacity-75' : 'hover:bg-[#FDF8F1]'
                    }`}
                  >
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <Calendar className="w-5 h-5 text-[#ED695A]" />
                      <div className="text-left">
                        <p className="text-[#78533F] font-semibold font-serif">{booking.venueName}</p>
                        <p className="text-sm text-gray-600 font-serif">
                          {new Date(booking.bookeddate).toLocaleDateString()} • {booking.timeSlot}
                        </p>
                        <p className="text-sm text-gray-600 font-serif">
                          Total: ₹{parseFloat(booking.totalAmount).toLocaleString('en-IN')} • 
                          Paid: ₹{parseFloat(booking.paidAmount).toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          Status: {getStatusDisplay(booking.status)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDetailsClick(booking)}
                      className="mt-2 sm:mt-0 bg-[#ED695A] text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif"
                    >
                      Details
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <>
          <div className="fixed inset-0 bg-black/20 z-10" onClick={() => setSelectedBooking(null)}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs sm:max-w-md bg-white rounded-2xl shadow-2xl border border-[#b09d94] z-20 overflow-hidden">
            
            <div className="bg-white p-4 sm:p-6 border-b border-[#b09d94] flex justify-center">
              <h3 className="text-lg font-bold text-[#78533F] font-serif">Booking Details</h3>
            </div>

            <div className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#ED695A]" />
                <p className="text-[#78533F] font-semibold font-serif">{selectedBooking.venueName}</p>
              </div>
              <p className="text-sm text-gray-600 font-serif">
                Date: {new Date(selectedBooking.bookeddate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 font-serif">Slot: {selectedBooking.timeSlot}</p>
              <p className="text-sm text-gray-600 font-serif">
                Total Amount: ₹{parseFloat(selectedBooking.totalAmount).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-600 font-serif">
                Paid Amount: ₹{parseFloat(selectedBooking.paidAmount).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-600 font-serif">
                Balance Amount: ₹{parseFloat(selectedBooking.balanceAmount).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-600 font-serif">Payment Status: {selectedBooking.paymentStatus}</p>
              <p className="text-sm text-gray-600 font-serif">
                Status: <span className="font-medium">{selectedBooking.status}</span>
              </p>
              <p className="text-sm text-gray-600 font-serif">Address: {selectedBooking.address}</p>
              {selectedBooking.eventType && (
                <p className="text-sm text-gray-600 font-serif">Event Type: {selectedBooking.eventType}</p>
              )}
            </div>

            <div className="bg-white p-4 border-t border-[#b09d94] flex justify-center space-x-4 flex-wrap gap-3">
              {selectedBooking.eventType?.toLowerCase() === 'wedding' && (
                <button
                  onClick={() => handleCertificateClick(selectedBooking)}
                  className="bg-[#78533F] text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-[#634331] transition-all duration-300 font-serif"
                >
                  Certificate
                </button>
              )}

              {isFutureBooking(selectedBooking.bookeddate) && 
               selectedBooking.status.toLowerCase() !== 'cancelled' && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking)}
                  disabled={isCancelling}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 font-serif disabled:cursor-not-allowed"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}

              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-[#ED695A] text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Bookings;