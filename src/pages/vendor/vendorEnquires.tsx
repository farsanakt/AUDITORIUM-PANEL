import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import Header from '../../component/user/Header';
import VendorSidebar from '../../component/user/VendorSidebar';
import { fetchEnquiries } from '../../api/userApi';

interface Enquiry {
  _id: string;
  vendorId: string;
  vendorUserId: string;
  name: string;
  email: string;
  contact: string;
  eventDate: string;
  eventType: string;
  message: string;
  notification: string;
  createdAt: string;
  updatedAt: string;
}

const VendorEnquiries: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [enquiriesPerPage] = useState(5); // Adjustable
  const navigate = useNavigate();

  const fetchVendorEnquiries = async () => {
    if (!currentUser?.id) {
      setError('Vendor not logged in');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchEnquiries(currentUser.id);
      console.log('fetchEnquiries response:', response.data);
      if (Array.isArray(response.data)) {
        setEnquiries(response.data);
      } else {
        setError('Unexpected response format');
        toast.error('Unexpected response format');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error fetching enquiries';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching enquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorEnquiries();
  }, [currentUser]);

  // Pagination logic
  const indexOfLastEnquiry = currentPage * enquiriesPerPage;
  const indexOfFirstEnquiry = indexOfLastEnquiry - enquiriesPerPage;
  const currentEnquiries = enquiries.slice(indexOfFirstEnquiry, indexOfLastEnquiry);
  const totalPages = Math.ceil(enquiries.length / enquiriesPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <VendorSidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:ml-64">
          {isLoading ? (
            <p className="text-[#78533F] font-serif text-center">Loading enquiries...</p>
          ) : error ? (
            <p className="text-[#ED695A] font-serif text-center">{error}</p>
          ) : (
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-[#b09d94] overflow-hidden my-8 mx-auto">
              {/* Enquiries Header */}
              <div className="bg-white p-4 sm:p-6 border-b border-[#b09d94] flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="text-[#78533F] hover:text-[#ED695A] transition-colors"
                  title="Go Back"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif">Vendor Enquiries</h2>
              </div>

              {/* Enquiries List */}
              <div className="p-4 sm:p-6">
                {enquiries.length === 0 ? (
                  <p className="text-center text-gray-600 font-serif">No enquiries found.</p>
                ) : (
                  <div className="space-y-4">
                    {currentEnquiries.map((enquiry) => (
                      <div
                        key={enquiry._id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-[#b09d94] rounded-xl hover:bg-[#FDF8F1] transition-colors duration-300"
                      >
                        <div className="flex flex-col space-y-2 w-full sm:w-auto">
                          <div className="text-left">
                            <p className="text-[#78533F] font-semibold font-serif">
                              {enquiry.name} ({enquiry.email})
                            </p>
                            <p className="text-sm text-gray-600 font-serif">Contact: {enquiry.contact}</p>
                            <p className="text-sm text-gray-600 font-serif">
                              Event Type: {enquiry.eventType}
                            </p>
                            <p className="text-sm text-gray-600 font-serif">
                              Event Date: {new Date(enquiry.eventDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 font-serif">
                              Message: {enquiry.message}
                            </p>
                            <p className="text-sm text-gray-600 font-serif">
                              Notification: {enquiry.notification}
                            </p>
                            <p className="text-sm text-gray-600 font-serif">
                              Received: {new Date(enquiry.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 font-serif">
                              Updated: {new Date(enquiry.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {enquiries.length > enquiriesPerPage && (
                <div className="p-4 sm:p-6 border-t border-[#b09d94] flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-[#ED695A] text-white rounded-lg hover:bg-[#D65A4C] disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                  >
                    Previous
                  </button>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          currentPage === index + 1
                            ? 'bg-[#ED695A] text-white'
                            : 'bg-white border border-[#b09d94] text-[#78533F] hover:bg-[#FDF8F1]'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-[#ED695A] text-white rounded-lg hover:bg-[#D65A4C] disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VendorEnquiries;