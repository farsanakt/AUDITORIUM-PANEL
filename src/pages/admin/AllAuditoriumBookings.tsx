import React, { useState, useEffect } from 'react';
import { Search, Trash, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Header from '../../component/user/Header';
import { allAuditoriumBookings } from '../../api/userApi';

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
      <main className="flex-1 p-4 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-[#b09d94]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold text-[#78533F] font-serif">Auditorium Bookings ({filteredBookings.length})</h2>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by email, venue, event, or status..."
                className="w-full pl-10 pr-4 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#b09d94]">
          {currentBookings.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 font-serif text-lg">No bookings found</p>
            </div>
          ) : (
            currentBookings.map((booking) => (
              <div
                key={booking._id}
                className="p-4 hover:bg-[#FDF8F1] transition-colors border-b border-[#b09d94]/20 last:border-b-0"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div
                    className="flex items-center cursor-pointer flex-1 min-w-0"
                    onClick={() => toggleBookingExpand(booking._id)}
                  >
                    <div className="mr-3 flex-shrink-0">
                      {expandedBooking === booking._id ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg text-[#78533F] font-serif truncate">{booking.venueName}</h3>
                      <div className="flex items-center text-gray-600 mt-1 space-x-3">
                        <span className="text-sm truncate">{booking.userEmail}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeClass(booking.status)}`}>
                          {capitalize(booking.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="text-sm text-gray-600">
                      Booked: {formatDate(getDateFromObjectId(booking._id))}
                    </div>
                    {booking.status.toLowerCase() !== 'cancelled' && (
                      <button
                        onClick={() => cancelBooking(booking._id, booking.userEmail)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        title="Cancel Booking"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                </div>
                {expandedBooking === booking._id && (
                  <div className="mt-4 pl-8 border-l-2 border-[#ED695A]/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">User Email</p>
                        <p className="text-sm text-gray-600">{booking.userEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Venue</p>
                        <p className="text-sm text-gray-600">{booking.venueName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Event Type</p>
                        <p className="text-sm text-gray-600">{capitalize(booking.eventType)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Status</p>
                        <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${getStatusBadgeClass(booking.status)}`}>
                          {capitalize(booking.status)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Payment Status</p>
                        <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${getStatusBadgeClass(booking.paymentStatus)}`}>
                          {capitalize(booking.paymentStatus)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Event Date</p>
                        <p className="text-sm text-gray-600">{formatDate(booking.bookeddate)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Time Slot</p>
                        <p className="text-sm text-gray-600">{capitalize(booking.timeSlot)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Total Amount</p>
                        <p className="text-sm text-gray-600">{formatCurrency(booking.totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Paid Amount</p>
                        <p className="text-sm text-gray-600">{formatCurrency(booking.paidAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Balance Amount</p>
                        <p className="text-sm text-gray-600">{formatCurrency(booking.balanceAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Address</p>
                        <p className="text-sm text-gray-600">{booking.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Booking Date</p>
                        <p className="text-sm text-gray-600">{formatDate(getDateFromObjectId(booking._id))}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-[#b09d94] rounded-lg text-sm font-medium text-[#78533F] disabled:opacity-50 hover:bg-[#FDF8F1]"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border border-[#b09d94] rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? 'bg-[#78533F] text-white'
                    : 'text-[#78533F] hover:bg-[#FDF8F1]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-[#b09d94] rounded-lg text-sm font-medium text-[#78533F] disabled:opacity-50 hover:bg-[#FDF8F1]"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllAuditoriumBookings;