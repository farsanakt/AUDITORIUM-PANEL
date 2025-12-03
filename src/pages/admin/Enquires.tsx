// components/admin/AllEnquiries.tsx
import React, { useEffect, useState } from 'react';
import { Mail, Calendar, Clock, User, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../../component/user/Header';
import { getAllEnquiries } from '../../api/userApi';
import { toast } from 'react-toastify';

interface Enquiry {
  _id: string;
  vendorId: string;
  name: string;
  email: string;
  contact: string;
  eventDate: string;
  eventType: string;
  message: string;
  notification: string;
  vendorUserId: string;
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 5;

const AllEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEnquiries, setTotalEnquiries] = useState(0);

  const totalPages = Math.ceil(totalEnquiries / ITEMS_PER_PAGE);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await getAllEnquiries();
      const data = response.data|| [];

      console.log(response,'da')
      const sorted = data.sort((a: Enquiry, b: Enquiry) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setEnquiries(sorted);
      setTotalEnquiries(sorted.length);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchEnquiries();
  }, []);

  // Pagination logic
  const paginatedEnquiries = enquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getNotificationIcon = (type: string) => {
    return type === 'whatsapp' ? 'WhatsApp' : 'Email';
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#78533F] font-serif flex items-center justify-center sm:justify-start gap-3">
              <Mail className="text-[#ED695A]" size={32} />
              All Enquiries
            </h1>
            <p className="text-gray-600 mt-2">Total: {totalEnquiries} enquiries</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#ED695A]"></div>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-[#b09d94] p-12 text-center">
              <AlertCircle size={60} className="mx-auto text-gray-400 mb-4" />
              <p className="text-[#78533F] font-serif text-lg">No enquiries found</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="block lg:hidden space-y-4">
                {paginatedEnquiries.map((enquiry) => (
                  <div
                    key={enquiry._id}
                    className="bg-white rounded-xl shadow-md border border-[#b09d94] p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-[#78533F] font-serif">{enquiry.name}</h3>
                        <p className="text-sm text-gray-600">{enquiry.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        enquiry.notification === 'whatsapp' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {getNotificationIcon(enquiry.notification)}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone size={16} />
                        <span>{enquiry.contact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} />
                        <span>{format(new Date(enquiry.eventDate), 'dd MMM yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <User size={16} />
                        <span className="font-medium">{enquiry.eventType}</span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-700">
                        <MessageSquare size={16} className="mt-0.5" />
                        <p className="text-gray-600">{enquiry.message || 'No message'}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-200">
                        <Clock size={14} />
                        <span>{format(new Date(enquiry.createdAt), 'dd MMM yyyy, hh:mm a')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-xl shadow-md border border-[#b09d94] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#78533F] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-serif">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-serif">Contact</th>
                        <th className="px-6 py-4 text-left text-sm font-serif">Event</th>
                        <th className="px-6 py-4 text-left text-sm font-serif">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-serif">Message</th>
                        <th className="px-6 py-4 text-left text-sm font-serif">Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEnquiries.map((enquiry) => (
                        <tr key={enquiry._id} className="border-b border-[#b09d94]/20 hover:bg-[#FDF8F1]/50 transition-colors">
                          <td className="px-6 py-5">
                            <div>
                              <p className="font-semibold text-[#78533F] font-serif">{enquiry.name}</p>
                              <p className="text-sm text-gray-600">{enquiry.email}</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                                enquiry.notification === 'whatsapp' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {getNotificationIcon(enquiry.notification)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-gray-700">{enquiry.contact}</td>
                          <td className="px-6 py-5">
                            <span className="font-medium text-[#ED695A]">{enquiry.eventType}</span>
                          </td>
                          <td className="px-6 py-5 text-gray-700">
                            {format(new Date(enquiry.eventDate), 'dd MMM yyyy')}
                          </td>
                          <td className="px-6 py-5 text-gray-600 max-w-xs truncate">
                            {enquiry.message || '—'}
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-600">
                            {format(new Date(enquiry.createdAt), 'dd MMM yyyy, hh:mm a')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalEnquiries)} of {totalEnquiries} enquiries
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-white border border-[#b09d94] text-[#78533F] hover:bg-[#FDF8F1]'
                      }`}
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? 'bg-[#ED695A] text-white'
                              : 'bg-white border border-[#b09d94] text-[#78533F] hover:bg-[#FDF8F1]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === totalPages
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-white border border-[#b09d94] text-[#78533F] hover:bg-[#FDF8F1]'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllEnquiries;