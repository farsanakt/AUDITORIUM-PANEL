import React, { useEffect, useState } from 'react';
import { X, Edit, Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Header from '../../component/user/Header';
import { createVoucher, updateVoucher, deleteVoucher, fetchVouchers } from '../../api/userApi';

interface Voucher {
  _id: string;
  voucherCode: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  limit: number;
  validFrom: string;
  validTo: string;
  audiName: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  termsAndConditions?: string[]; // Made optional to handle legacy data
}

const Voucher: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState({
    voucherCode: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: 0,
    limit: 0,
    validFrom: '',
    validTo: '',
    audiName: '',
    isActive: true,
    termsAndConditions: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserVouchers = async () => {
    if (!currentUser?.id) {
      setError('User not logged in');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchVouchers(currentUser.id);
      console.log(response.data, 'this is the response');

      if (Array.isArray(response.data)) {
        setVouchers(response.data);
        setError(null);
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setVouchers(response.data.data);
        setError(null);
      } else {
        setError(response.data?.message || 'Failed to fetch vouchers');
        toast.error(response.data?.message || 'Failed to fetch vouchers');
      }
    } catch (error: any) {
      setError('Error fetching vouchers');
      toast.error('Error fetching vouchers');
      console.error('Error fetching vouchers:', error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserVouchers();
  }, [currentUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'discountValue' || name === 'limit' ? parseFloat(value) : value,
      ...(name === 'isActive' ? { isActive: value === 'true' } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) {
      toast.error('User not logged in');
      setError('User not logged in');
      return;
    }

    const termsArray = formData.termsAndConditions
      .split(',')
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    const voucherData: Omit<Voucher, '_id' | 'createdAt' | 'updatedAt' | '__v'> = {
      ...formData,
      userId: currentUser.id,
      termsAndConditions: termsArray,
    };

    try {
      if (isEditing && selectedVoucher?._id) {
        await updateVoucher(selectedVoucher._id, voucherData);
        toast.success('Voucher updated successfully');
      } else {
        const response = await createVoucher(voucherData);
        if (response.data.success) {
          toast.success('Voucher created successfully');
        } else {
          toast.error(response.data.message || 'Failed to create voucher');
          setError(response.data.message || 'Failed to create voucher');
          return;
        }
      }
      await fetchUserVouchers();
      setIsModalOpen(false);
      setFormData({
        voucherCode: '',
        discountType: 'percentage',
        discountValue: 0,
        limit: 0,
        validFrom: '',
        validTo: '',
        audiName: '',
        isActive: true,
        termsAndConditions: '',
      });
      setIsEditing(false);
      setSelectedVoucher(null);
    } catch (error: any) {
      toast.error('Error saving voucher');
      setError('Error saving voucher');
      console.error('Error saving voucher:', error.message || error);
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setFormData({
      voucherCode: voucher.voucherCode,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      limit: voucher.limit,
      validFrom: new Date(voucher.validFrom).toISOString().split('T')[0],
      validTo: new Date(voucher.validTo).toISOString().split('T')[0],
      audiName: voucher.audiName,
      isActive: voucher.isActive,
      termsAndConditions: voucher.termsAndConditions?.join(', ') || '',
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (voucherId: string, voucherCode: string) => {
    const result = await Swal.fire({
      title: 'Confirm Deletion',
      text: `Are you sure you want to delete the voucher "${voucherCode}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ED695A',
      cancelButtonColor: '#b09d94',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      background: '#FDF8F1',
      customClass: {
        title: 'text-[#78533F] font-serif text-lg font-bold',
        htmlContainer: 'text-[#78533F] font-serif',
        confirmButton: 'font-serif',
        cancelButton: 'font-serif',
      },
    });

    if (!result.isConfirmed) return;

    try {
      await deleteVoucher(voucherId);
      await fetchUserVouchers();
      toast.success('Voucher deleted successfully');
    } catch (error: any) {
      toast.error('Error deleting voucher');
      setError('Error deleting voucher');
      console.error('Error deleting voucher:', error.message || error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center px-4 py-6 box-border">
      <Header />
      {isLoading ? (
        <p className="text-[#78533F] font-serif text-center">Loading vouchers...</p>
      ) : error ? (
        <p className="text-[#ED695A] font-serif text-center">{error}</p>
      ) : vouchers.length === 0 ? (
        <p className="text-center text-gray-600 font-serif">No vouchers found.</p>
      ) : (
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#b09d94] overflow-hidden my-8">
          <div className="bg-white p-4 sm:p-6 border-b border-[#b09d94] flex justify-between items-center">
            <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif">Your Vouchers</h2>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsEditing(false);
                setFormData({
                  voucherCode: '',
                  discountType: 'percentage',
                  discountValue: 0,
                  limit: 0,
                  validFrom: '',
                  validTo: '',
                  audiName: '',
                  isActive: true,
                  termsAndConditions: '',
                });
              }}
              className="bg-[#ED695A] text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif"
            >
              Add Voucher
            </button>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {vouchers.map((voucher) => (
                <div
                  key={voucher._id}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-[#b09d94] rounded-xl hover:bg-[#FDF8F1] transition-colors duration-300"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="text-left">
                      <p className="text-[#78533F] font-semibold font-serif">{voucher.voucherCode}</p>
                      <p className="text-sm text-gray-600 font-serif">
                        {voucher.discountType === 'percentage'
                          ? `${voucher.discountValue}% Off`
                          : `₹${voucher.discountValue.toLocaleString('en-IN')} Off`}
                      </p>
                      <p className="text-sm text-gray-600 font-serif">Limit: {voucher.limit}</p>
                      <p className="text-sm text-gray-600 font-serif">Auditorium Name: {voucher.audiName}</p>
                      <p className="text-sm text-gray-600 font-serif">
                        Valid: {new Date(voucher.validFrom).toLocaleDateString()} -{' '}
                        {new Date(voucher.validTo).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 font-serif">
                        Status: {voucher.isActive ? 'Active' : 'Inactive'}
                      </p>
                      <p className="text-sm text-gray-600 font-serif">Terms and Conditions:</p>
                      {voucher.termsAndConditions && voucher.termsAndConditions.length > 0 ? (
                        <ul className="text-sm text-gray-600 font-serif list-disc pl-5">
                          {voucher.termsAndConditions.map((term, index) => (
                            <li key={index}>{term}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600 font-serif pl-5">No terms specified</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleEdit(voucher)}
                      className="bg-[#78533F] text-white font-semibold py-2 px-3 rounded-full shadow-md hover:bg-[#634331] transition-all duration-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(voucher._id, voucher.voucherCode)}
                      className="bg-[#ED695A] text-white font-semibold py-2 px-3 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-10"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#b09d94] z-20 overflow-hidden">
            <div className="bg-white p-4 sm:p-5 border-b border-[#b09d94] flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#78533F] font-serif">
                {isEditing ? 'Edit Voucher' : 'Add Voucher'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-[#78533F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#78533F] font-medium font-serif">
                    Voucher Code
                  </label>
                  <input
                    type="text"
                    name="voucherCode"
                    value={formData.voucherCode}
                    onChange={handleInputChange}
                    placeholder="e.g., VOUCHER10"
                    required
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#78533F] font-medium font-serif">
                    Discount Type
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#78533F] font-medium font-serif">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    placeholder={formData.discountType === 'percentage' ? 'e.g., 10' : 'e.g., 500'}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#78533F] font-medium font-serif">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    name="limit"
                    value={formData.limit}
                    onChange={handleInputChange}
                    placeholder="e.g., 100"
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#78533F] font-medium font-serif">
                    Valid From
                  </label>
                  <input
                    type="date"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#78533F] font-medium font-serif">
                    Valid To
                  </label>
                  <input
                    type="date"
                    name="validTo"
                    value={formData.validTo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#78533F] font-medium font-serif">
                  Audience Name
                </label>
                <input
                  type="text"
                  name="audiName"
                  value={formData.audiName}
                  onChange={handleInputChange}
                  placeholder="e.g., New Users"
                  required
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                />
              </div>
              <div>
                <label className="block text-sm text-[#78533F] font-medium font-serif">
                  Terms and Conditions
                </label>
                <textarea
                  name="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={handleInputChange}
                  placeholder="Enter terms separated by commas, e.g., Valid on first purchase, Minimum purchase ₹1000"
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm text-[#78533F] font-medium font-serif">
                  Status
                </label>
                <select
                  name="isActive"
                  value={formData.isActive.toString()}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="bg-[#ED695A] text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif"
                >
                  {isEditing ? 'Update Voucher' : 'Create Voucher'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Voucher;