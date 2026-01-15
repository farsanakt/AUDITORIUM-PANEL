import React, { useState, useEffect } from 'react';
import { Search, Trash, ChevronRight, ChevronDown, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Header from '../../component/user/Header';
import { allAuditoriumBookings } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

interface Booking {
  _id: string;
  userEmail: string;
  venueId: string;
  auditoriumId: string;
  totalAmount: string;
  status: string;
  paymentStatus: string;
  venueName: string;
  bookeddate: string;
  timeSlot: string;
  paidAmount: string;
  balanceAmount: string;
  address: string;
  eventType: string;
}

const getDateFromObjectId = (id: string): Date => {
  const timestamp = id.substring(0, 8);
  return new Date(parseInt(timestamp, 16) * 1000);
};

const cancelBookingAPI = async (id: string): Promise<{ success: boolean; message: string }> => ({
  success: true,
  message: 'Booking cancelled successfully',
});

const AllAuditoriumBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const bookingsPerPage = 5;

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await allAuditoriumBookings();
        console.log(response.data, 'resss');
        let bookingsData: Booking[] = Array.isArray(response.data) ? response.data : [];
        bookingsData = bookingsData.sort((a, b) => {
          const dateA = getDateFromObjectId(a._id);
          const dateB = getDateFromObjectId(b._id);
          return dateB.getTime() - dateA.getTime();
        });
        setBookings(bookingsData);
      } catch (error: unknown) {
        toast.error('Failed to load bookings.');
      }
    };
    fetchBookings();
  }, [currentUser]);

  const toggleBookingExpand = (id: string) => {
    setExpandedBooking(expandedBooking === id ? null : id);
  };

  const cancelBooking = async (id: string, userEmail: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `Do you want to cancel the booking for <b>${userEmail}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel booking!',
    });

    if (result.isConfirmed) {
      try {
        const response = await cancelBookingAPI(id);
        if (response.success) {
          setBookings(
            bookings.map((booking) =>
              booking._id === id ? { ...booking, status: 'cancelled' } : booking
            )
          );
          toast.success(response.message);
        } else {
          toast.error('Failed to cancel booking.');
        }
      } catch (error: unknown) {
        toast.error('Something went wrong while cancelling booking.');
      }
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setExpandedBooking(null);
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const formatCurrency = (amount: string) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(amount));

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <main className="flex-1 p-4 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#78533F] hover:text-[#ED695A] transition-colors"
            >
              <ArrowLeft size={24} />
              Back
            </button>
          </div>

          <div className="bg-white p-6 lg:p-8 rounded-xl shadow-lg mb-8 border border-[#b09d94]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#78533F] font-serif">
                Auditorium Bookings ({filteredBookings.length})
              </h2>
              <div className="relative w-full sm:w-80 lg:w-96">
                <input
                  type="text"
                  placeholder="Search by email, venue, event, or status..."
                  className="w-full pl-12 pr-6 py-3 border-2 border-[#b09d94] rounded-full focus:outline-none focus:ring-4 focus:ring-[#ED695A]/20 text-base placeholder-gray-500 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 text-[#78533F]" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-[#b09d94]">
            {currentBookings.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-600 font-serif text-xl">No bookings found</p>
              </div>
            ) : (
              currentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-6 hover:bg-[#FDF8F1] transition-all duration-300 border-b border-[#b09d94]/30 last:border-b-0"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div
                      className="flex items-center cursor-pointer flex-1 min-w-0"
                      onClick={() => toggleBookingExpand(booking._id)}
                    >
                      <div className="mr-4 flex-shrink-0">
                        {expandedBooking === booking._id ? (
                          <ChevronDown size={20} className="text-[#78533F]" />
                        ) : (
                          <ChevronRight size={20} className="text-[#78533F]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-xl text-[#78533F] font-serif truncate">{booking.venueName}</h3>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-gray-600 mt-2 gap-3 sm:gap-4">
                          <span className="text-base truncate">{booking.userEmail}</span>
                          <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${getStatusBadgeClass(booking.status)}`}>
                            {capitalize(booking.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 flex-shrink-0 mt-4 sm:mt-0">
                      <div className="text-base text-gray-600 font-medium">
                        Booked: {formatDate(getDateFromObjectId(booking._id))}
                      </div>
                      {booking.status.toLowerCase() !== 'cancelled' && (
                        <button
                          onClick={() => cancelBooking(booking._id, booking.userEmail)}
                          className="p-3 rounded-full hover:bg-red-50 text-red-600 transition-all duration-200 hover:scale-105 shadow-sm"
                          title="Cancel Booking"
                        >
                          <Trash size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  {expandedBooking === booking._id && (
                    <div className="mt-6 pl-10 border-l-4 border-[#ED695A]/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">User Email</p>
                          <p className="text-base text-gray-600 mt-1 break-words">{booking.userEmail}</p>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">Venue</p>
                          <p className="text-base text-gray-600 mt-1 break-words">{booking.venueName}</p>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">Event Type</p>
                          <p className="text-base text-gray-600 mt-1">{capitalize(booking.eventType)}</p>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">Status</p>
                          <p className={`text-base font-semibold px-3 py-1.5 rounded-full inline-block mt-1 ${getStatusBadgeClass(booking.status)}`}>
                            {capitalize(booking.status)}
                          </p>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">Payment Status</p>
                          <p className={`text-base font-semibold px-3 py-1.5 rounded-full inline-block mt-1 ${getStatusBadgeClass(booking.paymentStatus)}`}>
                            {capitalize(booking.paymentStatus)}
                          </p>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">Event Date</p>
                          <p className="text-base text-gray-600 mt-1">{formatDate(booking.bookeddate)}</p>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">Time Slot</p>
                          <p className="text-base text-gray-600 mt-1">{capitalize(booking.timeSlot)}</p>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">Total Amount</p>
                          <p className="text-base text-gray-600 mt-1">{formatCurrency(booking.totalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">Paid Amount</p>
                          <p className="text-base text-gray-600 mt-1">{formatCurrency(booking.paidAmount)}</p>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">Balance Amount</p>
                          <p className="text-base text-gray-600 mt-1">{formatCurrency(booking.balanceAmount)}</p>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">Address</p>
                          <p className="text-base text-gray-600 mt-1 break-words">{booking.address}</p>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#78533F] font-serif">Booking Date</p>
                          <p className="text-base text-gray-600 mt-1">{formatDate(getDateFromObjectId(booking._id))}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center flex-wrap gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-[#ED695A] text-white rounded-lg disabled:opacity-50 hover:bg-[#d65a4f] transition-all duration-200 shadow-sm"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-3 rounded-lg text-base font-semibold ${
                    currentPage === page
                      ? 'bg-[#78533F] text-white shadow-md'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } transition-all duration-200`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-6 py-3 bg-[#ED695A] text-white rounded-lg disabled:opacity-50 hover:bg-[#d65a4f] transition-all duration-200 shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllAuditoriumBookings;