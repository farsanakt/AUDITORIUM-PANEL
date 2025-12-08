import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Check, X, Eye } from 'lucide-react';
import Header from '../../component/user/Header';
import { acceptVendor, fetchAllVendorUsers, rejectVendor } from '../../api/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface Vendor {
  _id: string;
  role: string;
  email: string;
  address: string;
  isVerified: boolean;
  isBlocked: boolean;
  name: string;
  vendortype: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  acceptedBy?: string; // New field - who accepted this vendor
}

const VendorsList: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { currentUser } = useSelector((state: RootState) => state.auth);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllVendorUsers();
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
      await acceptVendor(id, currentUser?.id || '');
      toast.success('Vendor accepted successfully');
      fetchVendors(); // Refresh to show acceptedBy
    } catch (error) {
      toast.error('Failed to accept vendor');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectVendor(id);
      toast.success('Vendor rejected');
      fetchVendors();
    } catch (error) {
      toast.error('Failed to reject vendor');
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
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />

      <main className="flex-1 p-4 md:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#78533F] font-serif mb-8 text-center md:text-left">
            All Vendors
          </h2>

          {isLoading ? (
            <p className="text-center text-[#78533F] text-lg py-12">Loading vendors...</p>
          ) : error ? (
            <p className="text-center text-[#ED695A] text-lg py-12">{error}</p>
          ) : vendors.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-12">No vendors found.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-lg border border-[#b09d94]">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-[#FDF8F1] text-[#78533F] text-sm md:text-base font-semibold">
                    <th className="p-4 text-left">Vendor Name</th>
                    <th className="p-4 text-left">Type</th>
                    <th className="p-4 text-left hidden sm:table-cell">Email</th>
                    <th className="p-4 text-left hidden md:table-cell">Phone</th>
                    <th className="p-4 text-left hidden lg:table-cell">Address</th>
                    <th className="p-4 text-center">Verified</th>
                    <th className="p-4 text-left hidden xl:table-cell">Accepted By</th>
                    <th className="p-4 text-center">Blocked</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr
                      key={vendor._id}
                      className="border-b border-[#b09d94]/30 hover:bg-[#FDF8F1] transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-800">{vendor.name}</td>
                      <td className="p-4 text-gray-700 capitalize">{vendor.vendortype}</td>
                      <td className="p-4 text-gray-600 hidden sm:table-cell">{vendor.email}</td>
                      <td className="p-4 text-gray-600 hidden md:table-cell">{vendor.phone}</td>
                      <td className="p-4 text-gray-600 hidden lg:table-cell">{vendor.address}</td>

                      <td className="p-4 text-center">
                        {vendor.isVerified ? (
                          <span className="text-green-600 font-bold">Yes</span>
                        ) : (
                          <span className="text-red-600 font-bold">No</span>
                        )}
                      </td>

                      {/* Accepted By — Only shown when isVerified === true */}
                      <td className="p-4 hidden xl:table-cell">
                        {vendor.isVerified && vendor.acceptedBy ? (
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-amber-100 text-[#78533F] border border-amber-300">
                            {vendor.acceptedBy}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm italic">—</span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        {vendor.isBlocked ? (
                          <span className="text-red-600 font-medium">Yes</span>
                        ) : (
                          <span className="text-green-600 font-medium">No</span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <button
                            onClick={() => openDetails(vendor)}
                            className="flex items-center justify-center gap-1 bg-[#ED695A] hover:bg-[#d65a4f] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                          >
                            <Eye size={16} />
                            Details
                          </button>

                          {!vendor.isVerified && (
                            <>
                              <button
                                onClick={() => handleAccept(vendor._id)}
                                className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                              >
                                <Check size={16} />
                                Accept
                              </button>
                              <button
                                onClick={() => handleReject(vendor._id)}
                                className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                              >
                                <X size={16} />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Details Modal - Shows Accepted By only if verified */}
      {isModalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#b09d94] max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-[#78533F] font-serif mb-6">
                Vendor Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <p><strong>Name:</strong> {selectedVendor.name}</p>
                  <p><strong>Type:</strong> {selectedVendor.vendortype}</p>
                  <p><strong>Email:</strong> {selectedVendor.email}</p>
                  <p><strong>Phone:</strong> {selectedVendor.phone}</p>
                  <p><strong>Address:</strong> {selectedVendor.address}</p>
                </div>
                <div className="space-y-3">
                  <p>
                    <strong>Verified:</strong>{' '}
                    <span className={selectedVendor.isVerified ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {selectedVendor.isVerified ? 'Yes' : 'No'}
                    </span>
                  </p>

                  {/* Show only when verified */}
                  {selectedVendor.isVerified && selectedVendor.acceptedBy && (
                    <p>
                      <strong>Accepted By:</strong>{' '}
                      <span className="inline-block px-4 py-2 bg-amber-100 text-[#78533F] font-bold rounded-full">
                        {selectedVendor.acceptedBy}
                      </span>
                    </p>
                  )}

                  <p><strong>Blocked:</strong> {selectedVendor.isBlocked ? 'Yes' : 'No'}</p>
                  <p><strong>Created:</strong> {formatDate(selectedVendor.createdAt)}</p>
                  <p><strong>Updated:</strong> {formatDate(selectedVendor.updatedAt)}</p>
                </div>
              </div>

              <div className="mt-8 text-right">
                <button
                  onClick={closeModal}
                  className="bg-[#ED695A] hover:bg-[#d65a4f] text-white font-medium px-8 py-3 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsList;