import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check, X, Eye } from 'lucide-react';
import Header from '../../component/user/Header';
import {  activateVoucher, deactivateVoucher, fetchAllExistingVouchers } from '../../api/userApi'; // Assume these API functions exist

interface Voucher {
  _id: string;
  voucherCode: string;
  discountType: string;
  discountValue: number;
  limit: number;
  validFrom: string;
  validTo: string;
  audiName: string;
  auditoriumId: string;
  isActive: boolean;
  isVeriffed:boolean
  userId: string;
  termsAndConditions: string[];
  createdAt: string;
}

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllExistingVouchers();
      setVouchers(response.data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching vouchers';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleActivate = async (id: string) => {
    try {
      await activateVoucher(id);
      toast.success('Voucher activated');
      fetchVouchers();
    } catch (error: unknown) {
      toast.error('Error activating voucher');
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateVoucher(id);
      toast.success('Voucher deactivated');
      fetchVouchers();
    } catch (error: unknown) {
      toast.error('Error deactivating voucher');
    }
  };

  const openDetails = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVoucher(null);
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
            All Vouchers
          </h2>

          {isLoading ? (
            <p className="text-[#78533F] font-serif text-center">Loading vouchers...</p>
          ) : error ? (
            <p className="text-[#ED695A] font-serif text-center">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-[#b09d94] rounded-xl shadow-md">
                <thead>
                  <tr className="bg-[#FDF8F1] text-left text-sm font-semibold text-[#78533F]">
                    <th className="p-4">Voucher Code</th>
                    <th className="p-4">Discount Type</th>
                    <th className="p-4 hidden md:table-cell">Discount Value</th>
                    <th className="p-4 hidden lg:table-cell">Auditorium Name</th>
                    <th className="p-4">Valid From</th>
                    <th className="p-4">Valid To</th>
                    <th className="p-4">Accept</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((voucher) => (
                    <tr key={voucher._id} className="border-b border-[#b09d94] hover:bg-[#FDF8F1]">
                      <td className="p-4">{voucher.voucherCode}</td>
                      <td className="p-4">{voucher.discountType}</td>
                      <td className="p-4 hidden md:table-cell">{voucher.discountValue}</td>
                      <td className="p-4 hidden lg:table-cell">{voucher.audiName}</td>
                      <td className="p-4">{formatDate(voucher.validFrom)}</td>
                      <td className="p-4">{formatDate(voucher.validTo)}</td>
                      <td className="p-4">
                        {voucher.isVeriffed? (
                          <span className="text-green-600">Yes</span>
                        ) : (
                          <span className="text-red-600">No</span>
                        )}
                      </td>
                      <td className="p-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => openDetails(voucher)}
                          className="bg-[#ED695A] text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-[#d65a4f] transition-colors"
                        >
                          <Eye size={16} />
                          <span>Details</span>
                        </button>
                        {!voucher.isVeriffed ? (
                          <>
                            <button
                              onClick={() => handleActivate(voucher._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-green-700 transition-colors"
                            >
                              <Check size={16} />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleDeactivate(voucher._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-red-700 transition-colors"
                            >
                              <X size={16} />
                              <span>reject</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDeactivate(voucher._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-red-700 transition-colors"
                          >
                            <X size={16} />
                            <span>reject</span>
                          </button>
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
      {isModalOpen && selectedVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#b09d94] max-w-lg w-full mx-4 overflow-y-auto max-h-[80vh]">
            <h3 className="text-lg font-bold text-[#78533F] font-serif mb-4">Voucher Details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>ID:</strong> {selectedVoucher._id}</p>
              <p><strong>Voucher Code:</strong> {selectedVoucher.voucherCode}</p>
              <p><strong>Discount Type:</strong> {selectedVoucher.discountType}</p>
              <p><strong>Discount Value:</strong> {selectedVoucher.discountValue}</p>
              <p><strong>Limit:</strong> {selectedVoucher.limit}</p>
              <p><strong>Valid From:</strong> {formatDate(selectedVoucher.validFrom)}</p>
              <p><strong>Valid To:</strong> {formatDate(selectedVoucher.validTo)}</p>
              <p><strong>Auditorium Name:</strong> {selectedVoucher.audiName}</p>
              <p><strong>Auditorium ID:</strong> {selectedVoucher.auditoriumId}</p>
              <p><strong>Active:</strong> {selectedVoucher.isVeriffed ? 'Yes' : 'No'}</p>
              <p><strong>User ID:</strong> {selectedVoucher.userId}</p>
              <p><strong>Terms and Conditions:</strong> {selectedVoucher.termsAndConditions.join(', ')}</p>
              <p><strong>Created At:</strong> {formatDate(selectedVoucher.createdAt)}</p>
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

export default VoucherList;