import React, { useEffect, useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/user/Header';
import { fetchUserBookingsByEmail } from '../../api/userApi';
// Assuming this API fetches booking data

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
  eventType?: string; // Optional, as it wasn't in the provided data but required for certificate logic
}

const Bookings: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const navigate = useNavigate();

  const fetchUserBookings = async () => {
    if (currentUser?.email) {
      try {
        const response = await fetchUserBookingsByEmail(currentUser.email);
        if (response.data) {
          setBookings(response.data);
        } else {
          console.error('Failed to fetch bookings:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [currentUser]);

  const handleDetailsClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleCertificateClick = (booking: Booking) => {
    // ${currentUser?.email}
    navigate(`/details/${(booking.userEmail)}`);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center px-4 py-6 box-border">
      <Header />
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#b09d94] overflow-hidden my-8">
        {/* Bookings Header */}
        <div className="bg-white p-4 sm:p-6 border-b border-[#b09d94] flex justify-center">
          <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif">Your Bookings</h2>
        </div>

        {/* Bookings List */}
        <div className="p-4 sm:p-6">
          {bookings.length === 0 ? (
            <p className="text-center text-gray-600 font-serif">No bookings found.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-[#b09d94] rounded-xl hover:bg-[#FDF8F1] transition-colors duration-300"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <Calendar className="w-5 h-5 text-[#ED695A]" />
                    <div className="text-left">
                      <p className="text-[#78533F] font-semibold font-serif">{booking.venueName}</p>
                      <p className="text-sm text-gray-600 font-serif">
                        {new Date(booking.bookeddate).toLocaleDateString()} • {booking.timeSlot}
                      </p>
                      <p className="text-sm text-gray-600 font-serif">
                        Total: ₹{parseFloat(booking.totalAmount).toLocaleString('en-IN')} • Paid: ₹{parseFloat(booking.paidAmount).toLocaleString('en-IN')}
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
              ))}
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
              <p className="text-sm text-gray-600 font-serif">Status: {selectedBooking.status}</p>
              <p className="text-sm text-gray-600 font-serif">Address: {selectedBooking.address}</p>
              {selectedBooking.eventType && (
                <p className="text-sm text-gray-600 font-serif">Event Type: {selectedBooking.eventType}</p>
              )}
            </div>
            <div className="bg-white p-4 border-t border-[#b09d94] flex justify-center space-x-4">
              {selectedBooking.eventType?.toLowerCase() === 'wedding' && (
                <button
                  onClick={() => handleCertificateClick(selectedBooking)}
                  className="bg-[#78533F] text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-[#634331] transition-all duration-300 font-serif"
                >
                  Certificate
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