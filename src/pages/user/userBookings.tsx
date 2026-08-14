import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Wallet, CheckCircle, XCircle, Hourglass, FileText, X } from 'lucide-react';
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
  approvalStatus?: 'requested' | 'accepted' | 'rejected'; // ✅ waiting list status
  actionBy?: string;
}

// ✅ Fallback: if backend doesn't send approvalStatus, derive it from status
const deriveApproval = (booking: Booking): 'requested' | 'accepted' | 'rejected' => {
  if (booking.approvalStatus) return booking.approvalStatus;
  const s = (booking.status || '').toLowerCase();
  if (s === 'confirmed') return 'accepted';
  if (s === 'cancelled') return 'rejected';
  return 'requested';
};

const formatINR = (amount: string) => {
  const num = parseFloat(amount);
  return isNaN(num) ? 'N/A' : `₹${num.toLocaleString('en-IN')}`;
};

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
    const isWaiting = deriveApproval(booking) === 'requested';
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm">
          Are you sure you want to cancel your {isWaiting ? 'booking request' : 'booking'} for{' '}
          <span className="font-semibold">{booking.venueName}</span>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>

          <button
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
            onClick={async () => {
              toast.dismiss(t.id);

              setIsCancelling(true);
              try {
                const response = await cancelUserBooking(
                  booking._id,
                  currentUser?.email || ''
                );

                if (response?.data?.success || response?.status === 200) {
                  toast.success(
                    isWaiting ? 'Booking request cancelled!' : 'Booking cancelled successfully!',
                    {
                      duration: 4000,
                      position: 'top-center',
                    }
                  );
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

  // ✅ Request status badge (waiting list)
  const ApprovalBadge: React.FC<{ booking: Booking }> = ({ booking }) => {
    const approval = deriveApproval(booking);
    if (booking.status.toLowerCase() === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
          <XCircle className="w-3 h-3" /> Cancelled
        </span>
      );
    }
    if (approval === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
          <CheckCircle className="w-3 h-3" /> Accepted
        </span>
      );
    }
    if (approval === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-600 border border-orange-200">
        <Hourglass className="w-3 h-3" /> Waiting for Approval
      </span>
    );
  };

  // ✅ Payment status badge
  const PaymentBadge: React.FC<{ status: string }> = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
      status.toLowerCase() === 'paid'
        ? 'bg-green-50 text-green-700 border-green-200'
        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const canCancel = (booking: Booking) =>
    isFutureBooking(booking.bookeddate) &&
    booking.status.toLowerCase() !== 'cancelled' &&
    deriveApproval(booking) !== 'rejected';

  return (
    <div className="min-h-screen bg-[#FDF8F1]">
      <Header />

      {/* Toast Container */}
      <Toaster position="top-center" />

      <div className="px-3 sm:px-6 lg:px-8 py-6 sm:py-10 flex justify-center">
        <div className="w-full max-w-4xl">

          {/* Page heading */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#78533F] font-serif tracking-tight">Your Bookings</h2>
            <p className="text-sm sm:text-base text-gray-500 font-serif mt-1">
              Track your booking requests, confirmations and payments
            </p>
            <div className="w-16 h-1 bg-[#ED695A] rounded-full mx-auto mt-3"></div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-[#b09d94] p-10 text-center">
              <p className="text-gray-600 font-serif">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-[#b09d94] p-10 sm:p-14 text-center">
              <div className="w-16 h-16 bg-[#FDF8F1] border-2 border-[#b09d94] rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-[#9c7c5d]" />
              </div>
              <h3 className="text-lg font-bold text-[#78533F] font-serif">No bookings yet</h3>
              <p className="text-sm text-gray-500 font-serif mt-1">Your booking requests will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const isCancelled = booking.status.toLowerCase() === 'cancelled';

                return (
                  <div
                    key={booking._id}
                    className={`bg-white border-2 border-[#b09d94] rounded-2xl shadow-sm transition-all duration-300 overflow-hidden ${
                      isCancelled ? 'opacity-70' : 'hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Icon + main info */}
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#ED695A]/10 border border-[#ED695A]/20 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#ED695A]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[#78533F] font-bold font-serif text-base sm:text-lg truncate">
                              {booking.venueName}
                            </p>
                            <ApprovalBadge booking={booking} />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 font-serif mt-1 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#9c7c5d] shrink-0" />
                            {new Date(booking.bookeddate).toLocaleDateString()} • {booking.timeSlot}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 font-serif mt-0.5 flex items-center gap-1.5">
                            <Wallet className="w-3.5 h-3.5 text-[#9c7c5d] shrink-0" />
                            Total: {formatINR(booking.totalAmount)} • Paid: {formatINR(booking.paidAmount)}
                          </p>
                          <div className="mt-2">
                            <PaymentBadge status={booking.paymentStatus} />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                        <button
                          onClick={() => handleDetailsClick(booking)}
                          className="flex-1 sm:flex-none bg-[#ED695A] text-white font-semibold py-2 px-5 rounded-full shadow-md hover:bg-[#d85c4e] hover:shadow-lg transition-all duration-300 font-serif text-sm"
                        >
                          Details
                        </button>
                        {canCancel(booking) && (
                          <button
                            onClick={() => handleCancelBooking(booking)}
                            disabled={isCancelling}
                            className="flex-1 sm:flex-none bg-white border-2 border-red-400 text-red-500 font-semibold py-2 px-5 rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 font-serif text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Waiting strip for requested bookings */}
                    {!isCancelled && deriveApproval(booking) === 'requested' && (
                      <div className="bg-orange-50 border-t border-orange-100 px-4 sm:px-5 py-2 flex items-center gap-2">
                        <Hourglass className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <p className="text-[11px] sm:text-xs text-orange-600 font-serif">
                          Your request is in the waiting list. The venue team will accept or reject it shortly — you'll be notified by email.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          ></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-[#b09d94] overflow-hidden max-h-[90vh] flex flex-col">

            {/* Modal header */}
            <div className="bg-[#78533F] p-4 sm:p-5 text-white relative shrink-0">
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-lg sm:text-xl font-bold font-serif pr-8">{selectedBooking.venueName}</h3>
              <p className="text-xs sm:text-sm opacity-90 font-serif mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(selectedBooking.bookeddate).toLocaleDateString()} • {selectedBooking.timeSlot}
              </p>
              <div className="mt-3">
                <ApprovalBadge booking={selectedBooking} />
              </div>
            </div>

            {/* Modal body */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              {/* Waiting notice */}
              {selectedBooking.status.toLowerCase() !== 'cancelled' &&
                deriveApproval(selectedBooking) === 'requested' && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-2">
                  <Hourglass className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-orange-700 font-serif">
                    This booking request is in the waiting list. You'll receive an email once the venue team accepts or rejects it.
                  </p>
                </div>
              )}

              {/* Payment summary */}
              <div className="bg-[#FDF8F1] border border-[#b09d94] rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 font-serif">Total Amount</span>
                  <span className="text-sm font-bold text-[#78533F] font-serif">{formatINR(selectedBooking.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#b09d94]/40 pt-2.5">
                  <span className="text-xs sm:text-sm text-gray-600 font-serif">Paid Amount</span>
                  <span className="text-sm font-semibold text-green-600 font-serif">{formatINR(selectedBooking.paidAmount)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#b09d94]/40 pt-2.5">
                  <span className="text-xs sm:text-sm text-gray-600 font-serif">Balance Amount</span>
                  <span className="text-sm font-semibold text-red-500 font-serif">{formatINR(selectedBooking.balanceAmount)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#b09d94]/40 pt-2.5">
                  <span className="text-xs sm:text-sm text-gray-600 font-serif">Payment Status</span>
                  <PaymentBadge status={selectedBooking.paymentStatus} />
                </div>
              </div>

              {/* Other details */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#9c7c5d] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-gray-600 font-serif break-words">{selectedBooking.address}</p>
                </div>
                {selectedBooking.eventType && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#9c7c5d] shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-600 font-serif">Event Type: {selectedBooking.eventType}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#9c7c5d] shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-600 font-serif capitalize">Booking Status: {selectedBooking.status}</p>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="bg-[#FDF8F1] p-4 border-t border-[#b09d94] flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3 shrink-0">
              {selectedBooking.eventType?.toLowerCase() === 'wedding' && (
                <button
                  onClick={() => handleCertificateClick(selectedBooking)}
                  className="bg-[#78533F] text-white font-semibold py-2 px-5 rounded-full shadow-md hover:bg-[#634331] transition-all duration-300 font-serif text-sm"
                >
                  Certificate
                </button>
              )}

              {canCancel(selectedBooking) && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking)}
                  disabled={isCancelling}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-2 px-5 rounded-full shadow-md transition-all duration-300 font-serif text-sm disabled:cursor-not-allowed"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}

              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-[#ED695A] text-white font-semibold py-2 px-5 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;