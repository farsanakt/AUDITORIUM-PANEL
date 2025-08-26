import React, { useEffect, useState } from 'react';
import Header from '../../component/user/Header';
import Sidebar from '../../component/auditorium/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { upComingEvents } from '../../api/userApi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// TypeScript interfaces
interface UserDetails {
  name: string;
  email: string;
  phone?: string;
}

interface BookingDetails {
  bookingId: string;
  date: string;
  timeSlot: string;
  auditoriumName?: string;
  venueName?: string;
  address?: string;
}

interface PaymentDetails {
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: string;
  paymentId?: string;
}

interface Invoice {
  id: string;
  userDetails: UserDetails;
  bookingDetails: BookingDetails;
  paymentDetails: PaymentDetails;
}

const InvoicePanel: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchEmail, setSearchEmail] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const bookingsPerPage = 6;

  // Fetch bookings
  const fetchBookings = async () => {
    if (currentUser) {
      try {
        const response = await upComingEvents(currentUser.id);
        const bookingsData = Array.isArray(response.data.events)
          ? response.data.events.map((booking: any) => ({
              id: booking._id || 'N/A',
              userDetails: {
                name: booking.userName || 'Unknown',
                email: booking.userEmail || 'N/A',
                phone: booking.userPhone || 'N/A',
              },
              bookingDetails: {
                bookingId: booking._id || 'N/A',
                date: booking.bookeddate
                  ? new Date(booking.bookeddate).toISOString().split('T')[0]
                  : 'N/A',
                timeSlot: booking.timeSlot || 'N/A',
                auditoriumName: booking.auditoriumName || response.data.auditoriumName || 'N/A',
                venueName: booking.venueName || 'N/A',
                address: booking.address || 'N/A',
              },
              paymentDetails: {
                totalAmount: parseFloat(booking.totalAmount) || 0,
                paidAmount: parseFloat(booking.paidAmount) || 0,
                balanceAmount: parseFloat(booking.balanceAmount) || 0,
                status: booking.paymentStatus || 'Pending',
                paymentId: booking.paymentId || 'N/A',
              },
            }))
          : [];
        setInvoices(bookingsData);
        setFilteredInvoices(bookingsData.slice(0, bookingsPerPage));
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setInvoices([]);
        setFilteredInvoices([]);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle search by email and date
  const handleSearch = () => {
    let filtered = invoices;
    if (searchEmail) {
      filtered = filtered.filter((invoice) =>
        invoice.userDetails.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }
    if (searchDate) {
      filtered = filtered.filter((invoice) =>
        invoice.bookingDetails.date.includes(searchDate)
      );
    }
    setFilteredInvoices(filtered.slice(0, bookingsPerPage));
    setCurrentPage(1);
  };

  // Reset search
  const handleReset = () => {
    setSearchEmail('');
    setSearchDate('');
    setFilteredInvoices(invoices.slice(0, bookingsPerPage));
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(invoices.length / bookingsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * bookingsPerPage;
    setFilteredInvoices(invoices.slice(startIndex, startIndex + bookingsPerPage));
  };

  // Download invoice as PDF
  const downloadInvoice = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Invoice Details', 20, 20);

    // User Details Table
    doc.setFontSize(12);
    doc.text('User Details', 20, 30);
    (doc as any).autoTable({
      startY: 35,
      head: [['Field', 'Value']],
      body: [
        ['Name', invoice.userDetails.name],
        ['Email', invoice.userDetails.email],
        ['Phone', invoice.userDetails.phone || 'N/A'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [237, 105, 90], textColor: [255, 255, 255] },
      bodyStyles: { textColor: [51, 51, 51] },
    });

    // Booking Details Table
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Booking Details', 20, finalY);
    (doc as any).autoTable({
      startY: finalY + 5,
      head: [['Field', 'Value']],
      body: [
        ['Booking ID', invoice.bookingDetails.bookingId],
        ['Date', invoice.bookingDetails.date],
        ['Time Slot', invoice.bookingDetails.timeSlot],
        ['Auditorium', invoice.bookingDetails.auditoriumName || 'N/A'],
        ['Venue', invoice.bookingDetails.venueName || 'N/A'],
        ['Address', invoice.bookingDetails.address || 'N/A'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [237, 105, 90], textColor: [255, 255, 255] },
      bodyStyles: { textColor: [51, 51, 51] },
    });

    // Payment Details Table
    finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Payment Details', 20, finalY);
    (doc as any).autoTable({
      startY: finalY + 5,
      head: [['Field', 'Value']],
      body: [
        ['Total Amount', `$${invoice.paymentDetails.totalAmount}`],
        ['Paid Amount', `$${invoice.paymentDetails.paidAmount}`],
        ['Balance Amount', `$${invoice.paymentDetails.balanceAmount}`],
        ['Status', invoice.paymentDetails.status],
        ['Payment ID', invoice.paymentDetails.paymentId || 'N/A'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [237, 105, 90], textColor: [255, 255, 255] },
      bodyStyles: { textColor: [51, 51, 51] },
    });

    doc.save(`invoice_${invoice.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Auditorium Invoice Panel</h1>

            {/* Search Section */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  placeholder="Search by Date"
                />
                <input
                  type="text"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  placeholder="Search by Email"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="bg-[#ED695A] text-white px-4 py-2 rounded-lg hover:bg-[#d15a4e] transition"
                  >
                    Search
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Invoice List */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600">
                    <th className="p-3 text-left">Sl. No</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Time Slot</th>
                    <th className="p-3 text-left">Customer Email</th>
                    <th className="p-3 text-left">Total Amount</th>
                    <th className="p-3 text-left">Paid Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice, index) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{(currentPage - 1) * bookingsPerPage + index + 1}</td>
                      <td className="p-3">{invoice.bookingDetails.date}</td>
                      <td className="p-3">{invoice.bookingDetails.timeSlot}</td>
                      <td className="p-3">{invoice.userDetails.email}</td>
                      <td className="p-3">₹{invoice.paymentDetails.totalAmount}</td>
                      <td className="p-3">₹{invoice.paymentDetails.paidAmount}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            invoice.paymentDetails.status === 'Paid'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}
                        >
                          {invoice.paymentDetails.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="bg-[#ED695A] text-white px-3 py-1 rounded-lg hover:bg-[#d15a4e] transition"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === page
                        ? 'bg-[#ED695A] text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}

            {/* Details Modal */}
            {selectedInvoice && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
                <div className="bg-white rounded-xl w-[500px] h-[500px] flex flex-col shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]">
                  <div className="p-4 border-b bg-gradient-to-r from-[#ED695A] to-[#F17C6E] text-white rounded-t-xl">
                    <h2 className="text-xl font-bold">Invoice Details</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* User Details */}
                    <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-gray-800 text-base mb-2">User Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <span className="font-medium">Name:</span>
                        <span>{selectedInvoice.userDetails.name}</span>
                        <span className="font-medium">Email:</span>
                        <span>{selectedInvoice.userDetails.email}</span>
                        <span className="font-medium">Phone:</span>
                        <span>{selectedInvoice.userDetails.phone || 'N/A'}</span>
                      </div>
                    </div>
                    {/* Booking Details */}
                    <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-gray-800 text-base mb-2">Booking Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <span className="font-medium">Booking ID:</span>
                        <span>{selectedInvoice.bookingDetails.bookingId}</span>
                        <span className="font-medium">Date:</span>
                        <span>{selectedInvoice.bookingDetails.date}</span>
                        <span className="font-medium">Time Slot:</span>
                        <span>{selectedInvoice.bookingDetails.timeSlot}</span>
                        <span className="font-medium">Auditorium:</span>
                        <span>{selectedInvoice.bookingDetails.auditoriumName || 'N/A'}</span>
                        <span className="font-medium">Venue:</span>
                        <span>{selectedInvoice.bookingDetails.venueName || 'N/A'}</span>
                        <span className="font-medium">Address:</span>
                        <span>{selectedInvoice.bookingDetails.address || 'N/A'}</span>
                      </div>
                    </div>
                    {/* Payment Details */}
                    <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-gray-800 text-base mb-2">Payment Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <span className="font-medium">Total Amount:</span>
                        <span>₹{selectedInvoice.paymentDetails.totalAmount}</span>
                        <span className="font-medium">Paid Amount:</span>
                        <span>₹{selectedInvoice.paymentDetails.paidAmount}</span>
                        <span className="font-medium">Balance Amount:</span>
                        <span>₹{selectedInvoice.paymentDetails.balanceAmount}</span>
                        <span className="font-medium">Status:</span>
                        <span>{selectedInvoice.paymentDetails.status}</span>
                        <span className="font-medium">Payment ID:</span>
                        <span>{selectedInvoice.paymentDetails.paymentId || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-between">
                    <button
                      onClick={() => downloadInvoice(selectedInvoice)}
                      className="bg-[#ED695A] text-white px-4 py-2 rounded-lg hover:bg-[#d15a4e] text-sm transition-transform transform hover:scale-105"
                    >
                      Download Invoice
                    </button>
                    <button
                      onClick={() => setSelectedInvoice(null)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm transition-transform transform hover:scale-105"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvoicePanel;