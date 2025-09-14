import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import Header from '../../component/user/Header';
import { fetchEnquiries } from '../../api/userApi';

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
  createdAt: string;
  updatedAt: string;
}

const VendorEnquiries: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 

  const fetchVendorEnquiries = async () => {
    if (!currentUser?.id) {
      setError('Vendor not logged in');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchEnquiries(currentUser.id);
      console.log('fetchEnquiries response:', response.data); // Debug log
      if (response.data.success) {
        setEnquiries(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setError(response.data.message || 'Failed to fetch enquiries');
        toast.error(response.data.message || 'Failed to fetch enquiries');
      }
    } catch (error: any) {
      setError('Error fetching enquiries');
      toast.error('Error fetching enquiries');
      console.error('Error fetching enquiries:', error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorEnquiries();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center px-4 py-6 box-border">
      <Header />
      {isLoading ? (
        <p className="text-[#78533F] font-serif text-center">Loading enquiries...</p>
      ) : error ? (
        <p className="text-[#ED695A] font-serif text-center">{error}</p>
      ) : (
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-[#b09d94] overflow-hidden my-8">
          {/* Enquiries Header */}
          <div className="bg-white p-4 sm:p-6 border-b border-[#b09d94]">
            <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif">Vendor Enquiries</h2>
          </div>

          {/* Enquiries List */}
          <div className="p-4 sm:p-6">
            {enquiries.length === 0 ? (
              <p className="text-center text-gray-600 font-serif">No enquiries found.</p>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enquiry) => (
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
        </div>
      )}
    </div>
  );
};

export default VendorEnquiries;