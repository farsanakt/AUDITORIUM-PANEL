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

const InvoiceFormat: React.FC<{ invoice: Invoice; onClose: () => void }> = ({ invoice, onClose }) => {
  const [gstin, setGstin] = useState('');

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(14);
    doc.text('Invoice Summary', 105, 10, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoice.id}`, 14, 20);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 160, 20);

    // Basic details
    doc.text('Product: Auditorium Booking', 14, 30);
    doc.text('HSN/SAC: 998422', 14, 35);
    doc.text('Qty/UOM: 1/Event', 14, 40);
    doc.text(`Billing Address (A): ${invoice.userDetails.name}, ${invoice.userDetails.email}${invoice.userDetails.phone ? `, ${invoice.userDetails.phone}` : ''}`, 14, 45, { maxWidth: 180 });
    doc.text(`Installation/Venue Address (B): ${invoice.bookingDetails.address || 'N/A'}`, 14, 50, { maxWidth: 180 });

    // Tax calculation
    const taxable = invoice.paymentDetails.totalAmount;
    const cgstRate = 9;
    const sgstRate = 9;
    const igstRate = 0;
    const cgstAmount = taxable * (cgstRate / 100);
    const sgstAmount = taxable * (sgstRate / 100);
    const igstAmount = taxable * (igstRate / 100);
    const totalTax = cgstAmount + sgstAmount + igstAmount;
    const grandTotal = taxable + totalTax;

    // Charges Table
    (doc as any).autoTable({
      startY: 60,
      head: [['Circuit ID', 'PO No / Date', 'Service Period', 'Description', 'Current Charges (₹)', 'CGST (₹)', 'SGST (₹)', 'IGST (₹)']],
      body: [
        [
          'N/A',
          'N/A',
          `${invoice.bookingDetails.date} / ${invoice.bookingDetails.timeSlot}`,
          `Auditorium booking at ${invoice.bookingDetails.auditoriumName || 'N/A'}, ${invoice.bookingDetails.venueName || 'N/A'}`,
          taxable.toFixed(2),
          cgstAmount.toFixed(2),
          sgstAmount.toFixed(2),
          igstAmount.toFixed(2),
        ],
      ],
      theme: 'striped',
      headStyles: { fillColor: [100, 100, 100], textColor: [255, 255, 255], fontSize: 8 },
      bodyStyles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 60, overflow: 'linebreak' },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
      },
    });

    let finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text('Total Excluding Tax', 14, finalY);
    doc.text(taxable.toFixed(2), 190, finalY, { align: 'right' });

    // Tax Details Table
    finalY += 10;
    doc.text('Tax Details', 14, finalY);
    (doc as any).autoTable({
      startY: finalY + 5,
      head: [['Description', 'HSN', 'Taxable Value (₹)', 'Rate', 'Amount (₹)', 'Total (₹)']],
      body: [
        ['CGST', '998422', taxable.toFixed(2), `${cgstRate}%`, cgstAmount.toFixed(2), ''],
        ['SGST/UTGST', '998422', taxable.toFixed(2), `${sgstRate}%`, sgstAmount.toFixed(2), ''],
        ['IGST', '998422', taxable.toFixed(2), `${igstRate}%`, igstAmount.toFixed(2), ''],
        ['', '', '', '', '', totalTax.toFixed(2)],
      ],
      theme: 'striped',
      headStyles: { fillColor: [100, 100, 100], textColor: [255, 255, 255], fontSize: 8 },
      bodyStyles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      },
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Grand Total (Including Tax)', 14, finalY);
    doc.text(grandTotal.toFixed(2), 190, finalY, { align: 'right' });

    // Additional details
    finalY += 10;
    doc.text(`Customer GSTIN: ${gstin || 'N/A'}`, 14, finalY);
    finalY += 5;
    doc.text(`Payment Status: ${invoice.paymentDetails.status}`, 14, finalY);
    doc.text(`Paid Amount: ₹${invoice.paymentDetails.paidAmount.toFixed(2)}`, 14, finalY + 5);
    doc.text(`Balance Amount: ₹${invoice.paymentDetails.balanceAmount.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Payment ID: ${invoice.paymentDetails.paymentId || 'N/A'}`, 14, finalY + 15);

    doc.save(`invoice_${invoice.id}.pdf`);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-hidden">
      <div className="p-4 border-b bg-gradient-to-r from-[#ED695A] to-[#F17C6E] text-white">
        <h2 className="text-lg md:text-xl font-bold">Invoice Preview</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg text-sm">
          <p><strong>Invoice No:</strong> {invoice.id}</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
          <p><strong>Product:</strong> Auditorium Booking</p>
          <p><strong>HSN/SAC:</strong> 998422</p>
          <p><strong>Qty/UOM:</strong> 1/Event</p>
          <p><strong>Billing Address (A):</strong> {invoice.userDetails.name}, {invoice.userDetails.email}{invoice.userDetails.phone ? `, ${invoice.userDetails.phone}` : ''}</p>
          <p><strong>Venue Address (B):</strong> {invoice.bookingDetails.address || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-sm">Charges</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Circuit ID</th>
                  <th className="p-2 text-left">PO No</th>
                  <th className="p-2 text-left">Service Period</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Charges (₹)</th>
                  <th className="p-2 text-left">CGST (₹)</th>
                  <th className="p-2 text-left">SGST (₹)</th>
                  <th className="p-2 text-left">IGST (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">N/A</td>
                  <td className="p-2 border">N/A</td>
                  <td className="p-2 border">{invoice.bookingDetails.date} / {invoice.bookingDetails.timeSlot}</td>
                  <td className="p-2 border break-words">{invoice.bookingDetails.auditoriumName || 'N/A'}, {invoice.bookingDetails.venueName || 'N/A'}</td>
                  <td className="p-2 border">{invoice.paymentDetails.totalAmount.toFixed(2)}</td>
                  <td className="p-2 border">{(invoice.paymentDetails.totalAmount * 0.09).toFixed(2)}</td>
                  <td className="p-2 border">{(invoice.paymentDetails.totalAmount * 0.09).toFixed(2)}</td>
                  <td className="p-2 border">0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm"><strong>Total Excluding Tax:</strong> ₹{invoice.paymentDetails.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-sm">Tax Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">HSN</th>
                  <th className="p-2 text-left">Taxable Value (₹)</th>
                  <th className="p-2 text-left">Rate</th>
                  <th className="p-2 text-left">Amount (₹)</th>
                  <th className="p-2 text-left">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">CGST</td>
                  <td className="p-2 border">998422</td>
                  <td className="p-2 border">{invoice.paymentDetails.totalAmount.toFixed(2)}</td>
                  <td className="p-2 border">9%</td>
                  <td className="p-2 border">{(invoice.paymentDetails.totalAmount * 0.09).toFixed(2)}</td>
                  <td className="p-2 border"></td>
                </tr>
                <tr>
                  <td className="p-2 border">SGST/UTGST</td>
                  <td className="p-2 border">998422</td>
                  <td className="p-2 border">{invoice.paymentDetails.totalAmount.toFixed(2)}</td>
                  <td className="p-2 border">9%</td>
                  <td className="p-2 border">{(invoice.paymentDetails.totalAmount * 0.09).toFixed(2)}</td>
                  <td className="p-2 border"></td>
                </tr>
                <tr>
                  <td className="p-2 border">IGST</td>
                  <td className="p-2 border">998422</td>
                  <td className="p-2 border">{invoice.paymentDetails.totalAmount.toFixed(2)}</td>
                  <td className="p-2 border">0%</td>
                  <td className="p-2 border">0.00</td>
                  <td className="p-2 border"></td>
                </tr>
                <tr>
                  <td className="p-2 border" colSpan={5}><strong>Total Tax</strong></td>
                  <td className="p-2 border">{((invoice.paymentDetails.totalAmount * 0.09) * 2).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm"><strong>Grand Total (Including Tax):</strong> ₹{(invoice.paymentDetails.totalAmount + (invoice.paymentDetails.totalAmount * 0.18)).toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">Payment Summary</h3>
          <p><strong>Payment Status:</strong> {invoice.paymentDetails.status}</p>
          <p><strong>Paid Amount:</strong> ₹{invoice.paymentDetails.paidAmount.toFixed(2)}</p>
          <p><strong>Balance Amount:</strong> ₹{invoice.paymentDetails.balanceAmount.toFixed(2)}</p>
          <p><strong>Payment ID:</strong> {invoice.paymentDetails.paymentId || 'N/A'}</p>
        </div>
        <input
          type="text"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
          placeholder="Enter Customer GSTIN (e.g., 24ABCDE1234F1Z5)"
          className="p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
        />
      </div>
      <div className="p-4 border-t bg-gray-50 flex justify-between">
        <button
          onClick={downloadPDF}
          className="bg-[#ED695A] text-white px-4 py-2 rounded-lg hover:bg-[#d15a4e] text-sm transition-transform transform hover:scale-105"
        >
          Download Invoice
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm transition-transform transform hover:scale-105"
        >
          Back
        </button>
      </div>
    </div>
  );
};

const InvoicePanel: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [fullFiltered, setFullFiltered] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchEmail, setSearchEmail] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const bookingsPerPage = 6;

  // Fetch bookings and sort by date descending (latest first)
  const fetchBookings = async () => {
    if (currentUser) {
      try {
        const response = await upComingEvents(currentUser.id);
        let bookingsData = Array.isArray(response.data.events)
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

        // Sort by date descending (latest first)
        bookingsData.sort((a: Invoice, b: Invoice) => new Date(b.bookingDetails.date).getTime() - new Date(a.bookingDetails.date).getTime());

        setInvoices(bookingsData);
        setFullFiltered(bookingsData);
        setFilteredInvoices(bookingsData.slice(0, bookingsPerPage));
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setInvoices([]);
        setFullFiltered([]);
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
    setFullFiltered(filtered);
    setFilteredInvoices(filtered.slice(0, bookingsPerPage));
    setCurrentPage(1);
  };

  // Reset search
  const handleReset = () => {
    setSearchEmail('');
    setSearchDate('');
    setFullFiltered(invoices);
    setFilteredInvoices(invoices.slice(0, bookingsPerPage));
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(fullFiltered.length / bookingsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * bookingsPerPage;
    setFilteredInvoices(fullFiltered.slice(startIndex, startIndex + bookingsPerPage));
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
                <div className="bg-white rounded-xl w-full max-w-[90vw] sm:max-w-[600px] h-[80vh] sm:h-[600px] flex flex-col shadow-2xl transform transition-all duration-300 scale-100">
                  {showInvoice ? (
                    <InvoiceFormat invoice={selectedInvoice} onClose={() => { setSelectedInvoice(null); setShowInvoice(false); }} />
                  ) : (
                    <>
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
                          onClick={() => setShowInvoice(true)}
                          className="bg-[#ED695A] text-white px-4 py-2 rounded-lg hover:bg-[#d15a4e] text-sm transition-transform transform hover:scale-105"
                        >
                          Invoice
                        </button>
                        <button
                          onClick={() => setSelectedInvoice(null)}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm transition-transform transform hover:scale-105"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
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