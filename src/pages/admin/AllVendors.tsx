import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check, X, Eye } from 'lucide-react';
import Header from '../../component/user/Header';
import { acceptVendor, fetchAllVendors, fetchAllVendorUsers, rejectVendor } from '../../api/userApi';
 // Assume these API functions exist

interface Vendor {
  _id: string;
  role: string;
  email: string;
  password?: string;
  address: string;
  isVerified: boolean;
  isBlocked: boolean;
  name: string;
  vendortype: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const VendorsList: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllVendorUsers();
      console.log(response.data,'kope')
      setVendors(response.data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching vendors';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await acceptVendor(id);
      toast.success('Vendor accepted');
      fetchVendors();
    } catch (error: unknown) {
      toast.error('Error accepting vendor');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectVendor(id);
      toast.success('Vendor rejected');
      fetchVendors();
    } catch (error: unknown) {
      toast.error('Error rejecting vendor');
    }
  };

  const openDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVendor(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <div className="w-full max-w-6xl mx-auto my-8">
          <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif mb-6">
            All Vendors
          </h2>

          {isLoading ? (
            <p className="text-[#78533F] font-serif text-center">Loading vendors...</p>
          ) : error ? (
            <p className="text-[#ED695A] font-serif text-center">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-[#b09d94] rounded-xl shadow-md">
                <thead>
                  <tr className="bg-[#FDF8F1] text-left text-sm font-semibold text-[#78533F]">
                    <th className="p-4">Vendor Name</th>
                    <th className="p-4">Vendor Type</th>
                    <th className="p-4 hidden md:table-cell">Email</th>
                    <th className="p-4 hidden lg:table-cell">Phone</th>
                    <th className="p-4 hidden xl:table-cell">Address</th>
                    <th className="p-4">Verified</th>
                    <th className="p-4">Blocked</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor._id} className="border-b border-[#b09d94] hover:bg-[#FDF8F1]">
                      <td className="p-4">{vendor.name}</td>
                      <td className="p-4">{vendor.vendortype}</td>
                      <td className="p-4 hidden md:table-cell">{vendor.email}</td>
                      <td className="p-4 hidden lg:table-cell">{vendor.phone}</td>
                      <td className="p-4 hidden xl:table-cell">{vendor.address}</td>
                      <td className="p-4">
                        {vendor.isVerified ? (
                          <span className="text-green-600">Yes</span>
                        ) : (
                          <span className="text-red-600">No</span>
                        )}
                      </td>
                      <td className="p-4">
                        {vendor.isBlocked ? (
                          <span className="text-red-600">Yes</span>
                        ) : (
                          <span className="text-green-600">No</span>
                        )}
                      </td>
                      <td className="p-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => openDetails(vendor)}
                          className="bg-[#ED695A] text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-[#d65a4f] transition-colors"
                        >
                          <Eye size={16} />
                          <span>Details</span>
                        </button>
                        {!vendor.isVerified && (
                          <>
                            <button
                              onClick={() => handleAccept(vendor._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-green-700 transition-colors"
                            >
                              <Check size={16} />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleReject(vendor._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-red-700 transition-colors"
                            >
                              <X size={16} />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {isModalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#b09d94] max-w-lg w-full mx-4 overflow-y-auto max-h-[80vh]">
            <h3 className="text-lg font-bold text-[#78533F] font-serif mb-4">Vendor Details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>ID:</strong> {selectedVendor._id}</p>
              <p><strong>Role:</strong> {selectedVendor.role}</p>
              <p><strong>Email:</strong> {selectedVendor.email}</p>
              <p><strong>Verified:</strong> {selectedVendor.isVerified ? 'Yes' : 'No'}</p>
              <p><strong>Blocked:</strong> {selectedVendor.isBlocked ? 'Yes' : 'No'}</p>
              <p><strong>Name:</strong> {selectedVendor.name}</p>
              <p><strong>Vendor Type:</strong> {selectedVendor.vendortype}</p>
              <p><strong>Address:</strong> {selectedVendor.address}</p>
              <p><strong>Phone:</strong> {selectedVendor.phone}</p>
              <p><strong>Created At:</strong> {formatDate(selectedVendor.createdAt)}</p>
              <p><strong>Updated At:</strong> {formatDate(selectedVendor.updatedAt)}</p>
              <p><strong>Version (__v):</strong> {selectedVendor.__v}</p>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-[#ED695A] text-white px-4 py-2 rounded-md hover:bg-[#d65a4f] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsList;