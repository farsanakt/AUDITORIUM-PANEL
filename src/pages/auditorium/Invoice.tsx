import React, { useState } from 'react';
import Header from '../../component/user/Header';
import Sidebar from '../../component/auditorium/Sidebar';

// TypeScript interfaces
interface Invoice {
  id: string;
  bookingId: string;
  date: string;
  customerName: string;
  amount: number;
  status: string;
}

const mockInvoices: Invoice[] = [
  { id: '1', bookingId: 'BK001', date: '2025-07-01', customerName: 'John Doe', amount: 1500, status: 'Paid' },
  { id: '2', bookingId: 'BK002', date: '2025-06-28', customerName: 'Jane Smith', amount: 2000, status: 'Paid' },
  { id: '3', bookingId: 'BK003', date: '2025-06-25', customerName: 'Alice Brown', amount: 1800, status: 'Pending' },
  { id: '4', bookingId: 'BK004', date: '2025-06-20', customerName: 'Bob Wilson', amount: 2200, status: 'Paid' },
  { id: '5', bookingId: 'BK005', date: '2025-06-15', customerName: 'Emma Davis', amount: 1700, status: 'Paid' },
  { id: '6', bookingId: 'BK006', date: '2025-06-10', customerName: 'Michael Lee', amount: 1900, status: 'Pending' },
];

const InvoicePanel: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices.slice(0, 5));
  const [searchDate, setSearchDate] = useState<string>('');
  const [searchBookingId, setSearchBookingId] = useState<string>('');

  // Handle search functionality
  const handleSearch = () => {
    let filtered = mockInvoices;
    if (searchDate) {
      filtered = filtered.filter((invoice) => invoice.date.includes(searchDate));
    }
    if (searchBookingId) {
      filtered = filtered.filter((invoice) =>
        invoice.bookingId.toLowerCase().includes(searchBookingId.toLowerCase())
      );
    }
    setInvoices(filtered.slice(0, 5));
  };

  // Reset search
  const handleReset = () => {
    setSearchDate('');
    setSearchBookingId('');
    setInvoices(mockInvoices.slice(0, 5));
  };

  // Download invoice as a text file
  const downloadInvoice = (invoice: Invoice) => {
    const content = `
      Invoice ID: ${invoice.id}
      Booking ID: ${invoice.bookingId}
      Date: ${invoice.date}
      Customer: ${invoice.customerName}
      Amount: $${invoice.amount}
      Status: ${invoice.status}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${invoice.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1]  flex flex-col">
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
                  placeholder="dd-mm-yyyy"
                />
                <input
                  type="text"
                  value={searchBookingId}
                  onChange={(e) => setSearchBookingId(e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  placeholder="Search by Booking ID"
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
                    <th className="p-3 text-left">Invoice ID</th>
                    <th className="p-3 text-left">Booking ID</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{invoice.id}</td>
                      <td className="p-3">{invoice.bookingId}</td>
                      <td className="p-3">{invoice.date}</td>
                      <td className="p-3">{invoice.customerName}</td>
                      <td className="p-3">${invoice.amount}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            invoice.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => downloadInvoice(invoice)}
                          className="bg-[#ED695A] text-white px-3 py-1 rounded-lg hover:bg-[#d15a4e] transition"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvoicePanel;