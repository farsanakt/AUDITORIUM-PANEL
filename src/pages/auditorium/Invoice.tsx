import React, { useEffect, useState } from 'react';
import Header from '../../component/user/Header';
import Sidebar from '../../component/auditorium/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import logo from "../../assets/logo-removebg.png";
import { fetchAllUsers, fetchAuditoriumUserdetails, existingAllVenues, existingBkngs, updateBookingApproval } from '../../api/userApi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

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
  userReferenceId?: string;
  approvalStatus?: 'requested' | 'accepted' | 'rejected'; // ✅ waiting list status
  actionBy?: string; // ✅ who accepted/rejected
}

// ✅ Fallback: if backend doesn't send approvalStatus, derive it from status
const deriveApproval = (booking: any): 'requested' | 'accepted' | 'rejected' => {
  if (booking.approvalStatus) return booking.approvalStatus;
  const s = (booking.status || "").toLowerCase();
  if (s === "confirmed") return "accepted";
  if (s === "cancelled") return "rejected";
  return "requested";
};

const getBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };
    img.onerror = reject;
    img.src = url;
  });
};

const InvoiceFormat: React.FC<{ invoice: Invoice; onClose: () => void; auditoriumDetails: any }> = ({ invoice, onClose, auditoriumDetails }) => {
  const [gstin, setGstin] = useState('');
  const [supplierGstin, setSupplierGstin] = useState(auditoriumDetails?.gstNumber || '');
  const [auditoriumLogoUrl] = useState<string>(auditoriumDetails?.logo || '');

  const downloadPDF = async () => {
    const doc = new jsPDF();
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();

    let auditoriumLogoBase64 = '';
    let iBookingLogoBase64 = '';
    let sealBase64 = '';
    
    // Load iBooking watermark logo
    if (logo) {
      try {
        iBookingLogoBase64 = await getBase64(logo);
        const imgProps = doc.getImageProperties(iBookingLogoBase64);
        const imgWidth = pdfWidth * 0.6;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        doc.setGState(new doc.GState({opacity: 0.08}));
        doc.addImage(iBookingLogoBase64, 'PNG', (pdfWidth - imgWidth) / 2, (pdfHeight - imgHeight) / 2 + 50, imgWidth, imgHeight, '', 'NONE');
        doc.setGState(new doc.GState({opacity: 1}));
      } catch (error) {
        console.error('Failed to load iBooking logo:', error);
      }
    }

    // Load auditorium logo
    if (auditoriumDetails?.logo) {
      try {
        auditoriumLogoBase64 = await getBase64(auditoriumDetails.logo);
      } catch (error) {
        console.error('Failed to load auditorium logo:', error);
      }
    }

    // Add auditorium logo as watermark
    if (auditoriumLogoBase64) {
      try {
        const imgProps = doc.getImageProperties(auditoriumLogoBase64);
        const imgWidth = pdfWidth * 0.6;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        doc.setGState(new doc.GState({opacity: 0.08}));
        doc.addImage(auditoriumLogoBase64, 'PNG', (pdfWidth - imgWidth) / 2, (pdfHeight - imgHeight) / 2 - 50, imgWidth, imgHeight, '', 'NONE');
        doc.setGState(new doc.GState({opacity: 1}));
      } catch (error) {
        console.error('Failed to add auditorium logo to PDF:', error);
      }
    }

    // Load seal
    if (auditoriumDetails?.seal) {
      try {
        sealBase64 = await getBase64(auditoriumDetails.seal);
      } catch (error) {
        console.error('Failed to load seal:', error);
      }
    }

    doc.setFontSize(14);
    doc.text('Invoice Summary', 105, 10, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoice.id}`, 14, 20);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 160, 20);

    doc.text('Product: Auditorium Booking', 14, 30);
    doc.text('HSN/SAC: 998422', 14, 35);
    doc.text('Qty/UOM: 1/Event', 14, 40);
    doc.text(`Billing Address (A): ${invoice.userDetails.name}, ${invoice.userDetails.email}${invoice.userDetails.phone ? `, ${invoice.userDetails.phone}` : ''}`, 14, 45, { maxWidth: 180 });
    doc.text(`Installation/Venue Address (B): ${invoice.bookingDetails.address || 'N/A'}`, 14, 50, { maxWidth: 180 });

    const taxable = invoice.paymentDetails.totalAmount;
    const cgstRate = 9;
    const sgstRate = 9;
    const igstRate = 0;
    const cgstAmount = taxable * (cgstRate / 100);
    const sgstAmount = taxable * (sgstRate / 100);
    const igstAmount = taxable * (igstRate / 100);
    const totalTax = cgstAmount + sgstAmount + igstAmount;
    const grandTotal = taxable + totalTax;

    autoTable(doc, {
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

    finalY += 10;
    doc.text('Tax Details', 14, finalY);
    autoTable(doc, {
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
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Grand Total (Including Tax)', 14, finalY);
    doc.text(grandTotal.toFixed(2), 190, finalY, { align: 'right' });

    finalY += 10;
    doc.text(`Supplier GSTIN: ${supplierGstin || 'N/A'}`, 14, finalY);
    finalY += 5;
    doc.text(`Customer GSTIN: ${gstin || 'N/A'}`, 14, finalY);
    finalY += 5;
    doc.text(`Payment Status: ${invoice.paymentDetails.status}`, 14, finalY);
    doc.text(`Paid Amount: ₹${invoice.paymentDetails.paidAmount.toFixed(2)}`, 14, finalY + 5);
    doc.text(`Balance Amount: ₹${invoice.paymentDetails.balanceAmount.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Payment ID: ${invoice.paymentDetails.paymentId || 'N/A'}`, 14, finalY + 15);

    // ✅ Request status + who accepted/rejected
    finalY += 20;
    doc.text(`Request Status: ${invoice.approvalStatus ? invoice.approvalStatus.toUpperCase() : 'REQUESTED'}`, 14, finalY);
    if (invoice.actionBy) {
      finalY += 5;
      doc.setTextColor(237, 105, 90);
      doc.text(`${invoice.approvalStatus === 'rejected' ? 'Rejected By' : 'Accepted By'}: ${invoice.actionBy}`, 14, finalY);
      doc.setTextColor(0, 0, 0);
    }

    if (invoice.userReferenceId) {
      finalY += 10;
      doc.setTextColor(237, 105, 90);
      doc.text(`Booked By: ${invoice.userReferenceId}`, 14, finalY + 10);
      doc.setTextColor(0, 0, 0);
    }

    finalY += 20;
    doc.text('This is a computer generated invoice not required seal and sign', 105, finalY, { align: 'center' });

    if (sealBase64) {
      const sealProps = doc.getImageProperties(sealBase64);
      const sealWidth = 50;
      const sealHeight = (sealProps.height * sealWidth) / sealProps.width;
      doc.addImage(sealBase64, 'PNG', 140, finalY + 10, sealWidth, sealHeight);
    }

    doc.save(`invoice_${invoice.id}.pdf`);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-hidden rounded-xl shadow-lg">
      <div className="p-4 border-b bg-gradient-to-r from-[#ED695A] to-[#F17C6E] text-white flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold">Invoice Preview</h2>
        <button onClick={onClose} className="text-white hover:opacity-80">
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white">
        {/* Logos Section */}
        <div className="relative bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
          {/* iBooking Watermark Logo */}
          {logo && (
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <img 
                src={logo} 
                alt="iBooking Watermark"
                className="max-w-[60%] h-auto object-contain"
              />
            </div>
          )}
          
          {/* Auditorium Logo */}
          <div className="flex justify-end mb-4">
            {auditoriumLogoUrl && (
              <img 
                src={auditoriumLogoUrl} 
                alt="Auditorium Logo"
                className="h-12 sm:h-16 w-auto object-contain"
              />
            )}
          </div>

          {/* Invoice Header Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700">
            <div>
              <p className="break-all"><strong>Invoice No:</strong> {invoice.id}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
            </div>
            <div className="sm:text-right">
              <p><strong>Product:</strong> Auditorium Booking</p>
              <p><strong>HSN/SAC:</strong> 998422</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm space-y-2 text-xs sm:text-sm text-gray-700">
          <h3 className="font-semibold mb-2">Booking Details</h3>
          <p><strong>Qty/UOM:</strong> 1/Event</p>
          <p className="break-words"><strong>Billing Address (A):</strong> {invoice.userDetails.name}, {invoice.userDetails.email}{invoice.userDetails.phone ? `, ${invoice.userDetails.phone}` : ''}</p>
          <p className="break-words"><strong>Venue Address (B):</strong> {invoice.bookingDetails.address || 'N/A'}</p>
          {/* ✅ Request status + action by */}
          <p>
            <strong>Request Status:</strong>{' '}
            <span className={
              invoice.approvalStatus === 'accepted' ? 'text-green-600 font-semibold'
                : invoice.approvalStatus === 'rejected' ? 'text-red-600 font-semibold'
                : 'text-orange-500 font-semibold'
            }>
              {invoice.approvalStatus ? invoice.approvalStatus.charAt(0).toUpperCase() + invoice.approvalStatus.slice(1) : 'Requested'}
            </span>
          </p>
          {invoice.actionBy && (
            <p className="font-semibold text-[#ED695A]">
              {invoice.approvalStatus === 'rejected' ? 'Rejected By' : 'Accepted By'}: {invoice.actionBy}
            </p>
          )}
          {invoice.userReferenceId && (
            <p className="mt-4 font-semibold text-[#ED695A]">
              Booked By: {invoice.userReferenceId}
            </p>
          )}
        </div>

        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4 text-sm text-gray-800">Charges</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs text-gray-700 min-w-[640px]">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left font-medium">Circuit ID</th>
                  <th className="p-2 text-left font-medium">PO No</th>
                  <th className="p-2 text-left font-medium">Service Period</th>
                  <th className="p-2 text-left font-medium">Description</th>
                  <th className="p-2 text-left font-medium">Charges (₹)</th>
                  <th className="p-2 text-left font-medium">CGST (₹)</th>
                  <th className="p-2 text-left font-medium">SGST (₹)</th>
                  <th className="p-2 text-left font-medium">IGST (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">N/A</td>
                  <td className="p-2">N/A</td>
                  <td className="p-2">{invoice.bookingDetails.date} / {invoice.bookingDetails.timeSlot}</td>
                  <td className="p-2">{invoice.bookingDetails.auditoriumName || 'N/A'}, {invoice.bookingDetails.venueName || 'N/A'}</td>
                  <td className="p-2">{invoice.paymentDetails.totalAmount.toFixed(2)}</td>
                  <td className="p-2">{(invoice.paymentDetails.totalAmount * 0.09).toFixed(2)}</td>
                  <td className="p-2">{(invoice.paymentDetails.totalAmount * 0.09).toFixed(2)}</td>
                  <td className="p-2">0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs sm:text-sm text-gray-800"><strong>Total Excluding Tax:</strong> ₹{invoice.paymentDetails.totalAmount.toFixed(2)}</p>
        </div>

        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4 text-sm text-gray-800">Tax Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs text-gray-700 min-w-[520px]">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left font-medium">Description</th>
                  <th className="p-2 text-left font-medium">HSN</th>
                  <th className="p-2 text-left font-medium">Taxable Value (₹)</th>
                  <th className="p-2 text-left font-medium">Rate</th>
                  <th className="p-2 text-left font-medium">Amount (₹)</th>
                  <th className="p-2 text-left font-medium">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">CGST</td>
                  <td className="p-2">998422</td>
                  <td className="p-2">{invoice.paymentDetails.totalAmount.toFixed(2)}</td>
                  <td className="p-2">9%</td>
                  <td className="p-2">{(invoice.paymentDetails.totalAmount * 0.09).toFixed(2)}</td>
                  <td className="p-2"></td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">SGST/UTGST</td>
                  <td className="p-2">998422</td>
                  <td className="p-2">{invoice.paymentDetails.totalAmount.toFixed(2)}</td>
                  <td className="p-2">9%</td>
                  <td className="p-2">{(invoice.paymentDetails.totalAmount * 0.09).toFixed(2)}</td>
                  <td className="p-2"></td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">IGST</td>
                  <td className="p-2">998422</td>
                  <td className="p-2">{invoice.paymentDetails.totalAmount.toFixed(2)}</td>
                  <td className="p-2">0%</td>
                  <td className="p-2">0.00</td>
                  <td className="p-2"></td>
                </tr>
                <tr>
                  <td className="p-2 font-medium" colSpan={5}>Total Tax</td>
                  <td className="p-2">{((invoice.paymentDetails.totalAmount * 0.09) * 2).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs sm:text-sm text-gray-800"><strong>Grand Total (Including Tax):</strong> ₹{(invoice.paymentDetails.totalAmount + (invoice.paymentDetails.totalAmount * 0.18)).toFixed(2)}</p>
        </div>

        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm text-xs sm:text-sm text-gray-700">
          <h3 className="font-semibold mb-4 text-gray-800">Payment Summary</h3>
          <p><strong>Payment Status:</strong> {invoice.paymentDetails.status}</p>
          <p><strong>Paid Amount:</strong> ₹{invoice.paymentDetails.paidAmount.toFixed(2)}</p>
          <p><strong>Balance Amount:</strong> ₹{invoice.paymentDetails.balanceAmount.toFixed(2)}</p>
          <p className="break-all"><strong>Payment ID:</strong> {invoice.paymentDetails.paymentId || 'N/A'}</p>
          {invoice.actionBy && (
            <p className="mt-2 font-semibold text-[#ED695A]">
              {invoice.approvalStatus === 'rejected' ? 'Rejected By' : 'Accepted By'}: {invoice.actionBy}
            </p>
          )}
          {invoice.userReferenceId && (
            <p className="mt-4 font-semibold text-[#ED695A]">
              Booked By: {invoice.userReferenceId}
            </p>
          )}
        </div>

        {supplierGstin === '' && (
          <input
            type="text"
            value={supplierGstin}
            onChange={(e) => setSupplierGstin(e.target.value)}
            placeholder="Enter Supplier GSTIN (e.g., 24ABCDE1234F1Z5)"
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
          />
        )}
        <input
          type="text"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
          placeholder="Enter Customer GSTIN (e.g., 24ABCDE1234F1Z5)"
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
        />
      </div>

      <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
        <button
          onClick={downloadPDF}
          className="bg-[#ED695A] text-white px-6 py-2 rounded-lg hover:bg-[#d15a4e] text-sm transition duration-200"
        >
          Download Invoice
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 text-sm transition duration-200"
        >
          Close
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
  const [searchApproval, setSearchApproval] = useState<string>('all'); // ✅ approval status filter
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [auditoriumDetails, setAuditoriumDetails] = useState<any>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null); // ✅ toast
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'accepted' | 'rejected' } | null>(null); // ✅ confirm modal
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const bookingsPerPage = 6;

  // ✅ Toast helper
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ NEW SOURCE: fetch the current user's venues, then ALL bookings of each venue
  // (existingBkngs returns every booking regardless of status — same endpoint the
  // user-side calendar uses, so accepted/rejected bookings are always included)
  const fetchData = async () => {
    if (!currentUser) return;

    try {
      const userRes = await fetchAllUsers();
      const allUsersData = userRes.data || [];

      const respo = await fetchAuditoriumUserdetails(currentUser.id);
      setAuditoriumDetails(respo.data);
      const audiName = respo.data?.auditoriumName || 'N/A';

      // 1. All venues of the current auditorium user
      const venueRes = await existingAllVenues(currentUser.id);
      const venueList: any[] = venueRes.data || [];
      const venueMap = new Map(venueList.map((v: any) => [v._id, v]));

      // 2. All bookings of every venue (any status)
      const bookingResults = await Promise.all(
        venueList.map((v: any) =>
          existingBkngs(v._id)
            .then((r) => {
              const d = r.data;
              return Array.isArray(d) ? d : d ? [d] : [];
            })
            .catch(() => [])
        )
      );

      // 3. Merge + dedupe by _id
      const merged = bookingResults.flat();
      const allBookings = Array.from(new Map(merged.map((b: any) => [b._id, b])).values());

      if (allBookings.length === 0) {
        setInvoices([]);
        setFullFiltered([]);
        setFilteredInvoices([]);
        return;
      }

      const bookingsData: Invoice[] = allBookings.map((booking: any) => {
        let name = booking.userName || 'Unknown User';
        let phone = booking.userPhone || 'N/A';
        let email = booking.userEmail || 'N/A';

        const matchedUser = allUsersData.find((u: any) => u.email === email);
        if (matchedUser) {
          name = `${matchedUser.firstName || ''} ${matchedUser.lastName || ''}`.trim() || name;
          phone = matchedUser.phone || phone;
        }

        return {
          id: booking._id || 'N/A',
          userDetails: {
            name,
            email,
            phone,
          },
          bookingDetails: {
            bookingId: booking._id || 'N/A',
            date: booking.bookeddate
              ? new Date(booking.bookeddate).toISOString().split('T')[0]
              : 'N/A',
            timeSlot: booking.timeSlot || 'N/A',
            auditoriumName: booking.auditoriumName || audiName,
            venueName: booking.venueName || venueMap.get(booking.venueId)?.name || 'N/A',
            address: booking.address || 'N/A',
          },
          paymentDetails: {
            totalAmount: parseFloat(booking.totalAmount) || 0,
            paidAmount: parseFloat(booking.paidAmount) || 0,
            balanceAmount: parseFloat(booking.balanceAmount) || 0,
            status: booking.paymentStatus || 'Pending',
            paymentId: booking.paymentId || 'N/A',
          },
          userReferenceId: booking.userReferenceId || undefined,
          approvalStatus: deriveApproval(booking), // ✅ works even if backend misses the field
          actionBy: booking.actionBy || undefined,
        };
      });

      bookingsData.sort((a, b) =>
        new Date(b.bookingDetails.date).getTime() - new Date(a.bookingDetails.date).getTime()
      );

      setInvoices(bookingsData);
      // ✅ Re-apply current filters after refetch so accepted/rejected stay visible with status
      applyFilters(bookingsData, searchEmail, searchDate, searchApproval);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setInvoices([]);
      setFullFiltered([]);
      setFilteredInvoices([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // ✅ Central filter function (email + date + approval status)
  const applyFilters = (source: Invoice[], email: string, date: string, approval: string) => {
    let filtered = source;
    if (email) {
      filtered = filtered.filter((inv) =>
        inv.userDetails.email.toLowerCase().includes(email.toLowerCase())
      );
    }
    if (date) {
      filtered = filtered.filter((inv) =>
        inv.bookingDetails.date.includes(date)
      );
    }
    if (approval !== 'all') {
      filtered = filtered.filter((inv) => (inv.approvalStatus || 'requested') === approval);
    }
    setFullFiltered(filtered);
    setFilteredInvoices(filtered.slice(0, bookingsPerPage));
    setCurrentPage(1);
  };

  // ✅ Step 1: open confirm modal
  const handleApproval = (bookingId: string, action: 'accepted' | 'rejected') => {
    if (!currentUser) return;
    setConfirmAction({ id: bookingId, action });
  };

  // ✅ Step 2: execute after confirmation — saves who did the action (current user)
  const confirmApproval = async () => {
    if (!confirmAction || !currentUser) return;
    const { id, action } = confirmAction;
    setConfirmAction(null);
    try {
      setActionLoadingId(id);
      const actionBy = (currentUser as any).name || currentUser.email || currentUser.id;
      await updateBookingApproval(id, action, actionBy);
      await fetchData();
      if (selectedInvoice && selectedInvoice.id === id) {
        setSelectedInvoice(null);
        setShowInvoice(false);
      }
      showToast(action === 'accepted' ? 'Booking accepted successfully 🎉' : 'Booking rejected', 'success');
    } catch (error) {
      console.error(`Error updating booking to ${action}:`, error);
      showToast('Failed to update the booking request. Please try again.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSearch = () => {
    applyFilters(invoices, searchEmail, searchDate, searchApproval);
  };

  const handleReset = () => {
    setSearchEmail('');
    setSearchDate('');
    setSearchApproval('all');
    applyFilters(invoices, '', '', 'all');
  };

  const totalPages = Math.ceil(fullFiltered.length / bookingsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const start = (page - 1) * bookingsPerPage;
    setFilteredInvoices(fullFiltered.slice(start, start + bookingsPerPage));
  };

  // ✅ Reusable badge for approval status
  const ApprovalBadge = ({ invoice }: { invoice: Invoice }) => (
    <div className="flex flex-col items-start">
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        invoice.approvalStatus === 'accepted' ? 'bg-green-100 text-green-600'
          : invoice.approvalStatus === 'rejected' ? 'bg-red-100 text-red-600'
          : 'bg-orange-100 text-orange-600'
      }`}>
        {invoice.approvalStatus === 'accepted' ? 'Accepted' : invoice.approvalStatus === 'rejected' ? 'Rejected' : 'Requested'}
      </span>
      {invoice.actionBy && (
        <span className="text-[10px] text-gray-500 mt-1">by {invoice.actionBy}</span>
      )}
    </div>
  );

  // ✅ Reusable accept/reject buttons
  const ApprovalActions = ({ invoice }: { invoice: Invoice }) => (
    invoice.approvalStatus === 'requested' ? (
      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); handleApproval(invoice.id, 'accepted'); }}
          disabled={actionLoadingId === invoice.id}
          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 text-xs font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-3 h-3" />
          {actionLoadingId === invoice.id ? '...' : 'Accept'}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleApproval(invoice.id, 'rejected'); }}
          disabled={actionLoadingId === invoice.id}
          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-xs font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircle className="w-3 h-3" />
          {actionLoadingId === invoice.id ? '...' : 'Reject'}
        </button>
      </div>
    ) : (
      <ApprovalBadge invoice={invoice} />
    )
  );

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      {/* ✅ Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
          {toast.message}
        </div>
      )}
      {/* ✅ Confirm modal (replaces window.confirm) */}
      {confirmAction && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmAction(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${confirmAction.action === 'accepted' ? 'bg-green-100' : 'bg-red-100'}`}>
              <AlertTriangle className={`w-7 h-7 ${confirmAction.action === 'accepted' ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {confirmAction.action === 'accepted' ? 'Accept Booking Request?' : 'Reject Booking Request?'}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {confirmAction.action === 'accepted'
                ? 'This will confirm the booking and notify the user by email.'
                : 'This will cancel the request and notify the user by email.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmApproval}
                className={`flex-1 py-2.5 text-white font-semibold rounded-xl transition-colors text-sm ${confirmAction.action === 'accepted' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                Yes, {confirmAction.action === 'accepted' ? 'Accept' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-1">
        <Sidebar className="hidden lg:block w-64" />
        <main className="flex-1 p-3 sm:p-6">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Auditorium Invoice Panel</h1>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:flex-wrap">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] w-full md:w-auto"
                />
                <input
                  type="text"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] w-full md:w-auto"
                  placeholder="Search by Email"
                />
                {/* ✅ Approval status filter */}
                <select
                  value={searchApproval}
                  onChange={(e) => {
                    setSearchApproval(e.target.value);
                    applyFilters(invoices, searchEmail, searchDate, e.target.value);
                  }}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] w-full md:w-auto bg-white cursor-pointer"
                >
                  <option value="all">All Requests</option>
                  <option value="requested">Requested (Waiting)</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="flex gap-2 flex-col sm:flex-row">
                  <button onClick={handleSearch} className="bg-[#ED695A] text-white px-6 py-3 rounded-lg hover:bg-[#d15a4e] w-full sm:w-auto transition duration-200">
                    Search
                  </button>
                  <button onClick={handleReset} className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 w-full sm:w-auto transition duration-200">
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ Desktop table (md and up) */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 text-left text-sm">
                    <th className="p-4">Sl. No</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Time Slot</th>
                    <th className="p-4">Customer Email</th>
                    <th className="p-4">Booked By</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Paid</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Request Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {filteredInvoices.map((invoice, index) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{(currentPage - 1) * bookingsPerPage + index + 1}</td>
                      <td className="p-4 whitespace-nowrap">{invoice.bookingDetails.date}</td>
                      <td className="p-4">{invoice.bookingDetails.timeSlot}</td>
                      <td className="p-4 break-all">{invoice.userDetails.email}</td>
                      <td className="p-4">
                        {invoice.userReferenceId ? (
                          <span className="text-[#ED695A] font-medium">{invoice.userReferenceId}</span>
                        ) : (
                          <span className="text-gray-500">Direct</span>
                        )}
                      </td>
                      <td className="p-4">₹{invoice.paymentDetails.totalAmount}</td>
                      <td className="p-4">₹{invoice.paymentDetails.paidAmount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${invoice.paymentDetails.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {invoice.paymentDetails.status}
                        </span>
                      </td>
                      {/* ✅ Accept / Reject buttons or status badge with actionBy */}
                      <td className="p-4">
                        <ApprovalActions invoice={invoice} />
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="bg-[#ED695A] text-white px-4 py-2 rounded-lg hover:bg-[#d15a4e] text-sm transition duration-200"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Mobile card list (below md) */}
            <div className="md:hidden space-y-3">
              {filteredInvoices.map((invoice, index) => (
                <div key={invoice.id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">#{(currentPage - 1) * bookingsPerPage + index + 1}</p>
                      <p className="text-sm font-semibold text-gray-900 break-all">{invoice.userDetails.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{invoice.bookingDetails.date} • {invoice.bookingDetails.timeSlot}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 ${invoice.paymentDetails.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {invoice.paymentDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 border-t border-gray-100 pt-2 mb-3">
                    <span>Total: <strong className="text-gray-900">₹{invoice.paymentDetails.totalAmount}</strong></span>
                    <span>Paid: <strong className="text-gray-900">₹{invoice.paymentDetails.paidAmount}</strong></span>
                    <span>
                      {invoice.userReferenceId ? (
                        <span className="text-[#ED695A] font-medium">{invoice.userReferenceId}</span>
                      ) : (
                        <span className="text-gray-500">Direct</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <ApprovalActions invoice={invoice} />
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="bg-[#ED695A] text-white px-4 py-2 rounded-lg hover:bg-[#d15a4e] text-xs transition duration-200"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredInvoices.length === 0 && (
              <div className="py-12 text-center text-gray-500 text-sm">No bookings found for the selected filters.</div>
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg text-sm ${currentPage === page ? 'bg-[#ED695A] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}

            {selectedInvoice && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
                  {showInvoice ? (
                    <InvoiceFormat invoice={selectedInvoice} onClose={() => { setSelectedInvoice(null); setShowInvoice(false); }} auditoriumDetails={auditoriumDetails} />
                  ) : (
                    <>
                      <div className="p-4 border-b bg-gradient-to-r from-[#ED695A] to-[#F17C6E] text-white flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-bold">Invoice Details</h2>
                        <button onClick={() => setSelectedInvoice(null)} className="text-white hover:opacity-80">
                          ✕
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                          <h3 className="font-semibold text-gray-800 mb-3">User Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                            <span className="font-medium">Name:</span><span className="break-all">{selectedInvoice.userDetails.name}</span>
                            <span className="font-medium">Email:</span><span className="break-all">{selectedInvoice.userDetails.email}</span>
                            <span className="font-medium">Phone:</span><span>{selectedInvoice.userDetails.phone || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                          <h3 className="font-semibold text-gray-800 mb-3">Booking Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                            <span className="font-medium">Date:</span><span>{selectedInvoice.bookingDetails.date}</span>
                            <span className="font-medium">Time Slot:</span><span>{selectedInvoice.bookingDetails.timeSlot}</span>
                            <span className="font-medium">Auditorium:</span><span>{selectedInvoice.bookingDetails.auditoriumName || 'N/A'}</span>
                            <span className="font-medium">Venue:</span><span>{selectedInvoice.bookingDetails.venueName || 'N/A'}</span>
                            <span className="font-medium">Address:</span><span className="break-words">{selectedInvoice.bookingDetails.address || 'N/A'}</span>
                            {/* ✅ Request status + action by */}
                            <span className="font-medium">Request Status:</span>
                            <span className={
                              selectedInvoice.approvalStatus === 'accepted' ? 'text-green-600 font-semibold'
                                : selectedInvoice.approvalStatus === 'rejected' ? 'text-red-600 font-semibold'
                                : 'text-orange-500 font-semibold'
                            }>
                              {selectedInvoice.approvalStatus ? selectedInvoice.approvalStatus.charAt(0).toUpperCase() + selectedInvoice.approvalStatus.slice(1) : 'Requested'}
                            </span>
                            {selectedInvoice.actionBy && (
                              <>
                                <span className="font-medium text-[#ED695A]">
                                  {selectedInvoice.approvalStatus === 'rejected' ? 'Rejected By:' : 'Accepted By:'}
                                </span>
                                <span className="text-[#ED695A] break-all">{selectedInvoice.actionBy}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                          <h3 className="font-semibold text-gray-800 mb-3">Payment Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                            <span className="font-medium">Total Amount:</span><span>₹{selectedInvoice.paymentDetails.totalAmount}</span>
                            <span className="font-medium">Paid Amount:</span><span>₹{selectedInvoice.paymentDetails.paidAmount}</span>
                            <span className="font-medium">Balance:</span><span>₹{selectedInvoice.paymentDetails.balanceAmount}</span>
                            <span className="font-medium">Status:</span><span>{selectedInvoice.paymentDetails.status}</span>
                            <span className="font-medium">Payment ID:</span><span className="break-all">{selectedInvoice.paymentDetails.paymentId || 'N/A'}</span>
                            {selectedInvoice.userReferenceId && (
                              <>
                                <span className="font-medium text-[#ED695A]">Booked By:</span>
                                <span className="text-[#ED695A]">{selectedInvoice.userReferenceId}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ✅ Accept / Reject also available inside details modal for requested bookings */}
                      <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                        {selectedInvoice.approvalStatus === 'requested' && (
                          <>
                            <button
                              onClick={() => handleApproval(selectedInvoice.id, 'accepted')}
                              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 text-sm transition duration-200 flex items-center justify-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" /> Accept
                            </button>
                            <button
                              onClick={() => handleApproval(selectedInvoice.id, 'rejected')}
                              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 text-sm transition duration-200 flex items-center justify-center gap-1"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </>
                        )}
                        <button onClick={() => setShowInvoice(true)} className="bg-[#ED695A] text-white px-6 py-2 rounded-lg hover:bg-[#d15a4e] text-sm transition duration-200">
                          View Invoice
                        </button>
                        <button onClick={() => setSelectedInvoice(null)} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 text-sm transition duration-200">
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