import React, { useEffect, useState } from 'react';
import { X, Edit, Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import Header from '../../component/user/Header';
import { createOffer, updateOffer, deleteOffer, fetchOffers } from '../../api/userApi';

interface Offer {
  _id?: string;
  offerCode: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  userId: string;
}

const Offer: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    offerCode: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: 0,
    validFrom: '',
    validTo: '',
    isActive: true,
  });

  const fetchUserOffers = async () => {
    if (currentUser?.email) {
      try {
        const response = await fetchOffers(currentUser.id);
        if (response.data.success) {
          setOffers(response.data.offers);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Error fetching offers');
        console.error('Error fetching offers:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserOffers();
  }, [currentUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'discountValue' ? parseFloat(value) : value,
      ...(name === 'isActive' ? { isActive: value === 'true' } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) {
      toast.error('User not logged in');
      return;
    }

    const offerData: Offer = {
      ...formData,
      userId: currentUser.id,
    };

    try {
      if (isEditing && selectedOffer?._id) {
        const response = await updateOffer(selectedOffer._id, offerData);
        if (response.data.success) {
          toast.success('Offer updated successfully');
          setOffers((prev) =>
            prev.map((offer) =>
              offer._id === selectedOffer._id ? { ...offer, ...offerData } : offer
            )
          );
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await createOffer(offerData);
        if (response.data.success) {
          toast.success('Offer created successfully');
          setOffers((prev) => [...prev, response.data.offer]);
        } else {
          toast.error(response.data.message);
        }
      }
      setIsModalOpen(false);
      setFormData({
        offerCode: '',
        discountType: 'percentage',
        discountValue: 0,
        validFrom: '',
        validTo: '',
        isActive: true,
      });
      setIsEditing(false);
      setSelectedOffer(null);
    } catch (error) {
      toast.error('Error saving offer');
      console.error('Error saving offer:', error);
    }
  };

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setFormData({
      offerCode: offer.offerCode,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      validFrom: offer.validFrom.split('T')[0],
      validTo: offer.validTo.split('T')[0],
      isActive: offer.isActive,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (offerId: string) => {
    try {
      const response = await deleteOffer(offerId);
      if (response.data.success) {
        toast.success('Offer deleted successfully');
        setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error deleting offer');
      console.error('Error deleting offer:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center px-4 py-6 box-border">
      <Header />
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#b09d94] overflow-hidden my-8">
        {/* Offers Header */}
        <div className="bg-white p-4 sm:p-6 border-b border-[#b09d94] flex justify-between items-center">
          <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif">Your Offers</h2>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsEditing(false);
              setFormData({
                offerCode: '',
                discountType: 'percentage',
                discountValue: 0,
                validFrom: '',
                validTo: '',
                isActive: true,
              });
            }}
            className="bg-[#ED695A] text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif"
          >
            Add Offer
          </button>
        </div>

        {/* Offers List */}
        <div className="p-4 sm:p-6">
          {offers.length === 0 ? (
            <p className="text-center text-gray-600 font-serif">No offers found.</p>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-[#b09d94] rounded-xl hover:bg-[#FDF8F1] transition-colors duration-300"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="text-left">
                      <p className="text-[#78533F] font-semibold font-serif">{offer.offerCode}</p>
                      <p className="text-sm text-gray-600 font-serif">
                        {offer.discountType === 'percentage'
                          ? `${offer.discountValue}% Off`
                          : `₹${offer.discountValue.toLocaleString('en-IN')} Off`}
                      </p>
                      <p className="text-sm text-gray-600 font-serif">
                        Valid: {new Date(offer.validFrom).toLocaleDateString()} -{' '}
                        {new Date(offer.validTo).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 font-serif">
                        Status: {offer.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="bg-[#78533F] text-white font-semibold py-2 px-3 rounded-full shadow-md hover:bg-[#634331] transition-all duration-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id!)}
                      className="bg-[#ED695A] text-white font-semibold py-2 px-3 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Offer Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-10"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#b09d94] z-20 overflow-hidden">
            <div className="bg-white p-4 sm:p-5 border-b border-[#b09d94] flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#78533F] font-serif">
                {isEditing ? 'Edit Offer' : 'Add Offer'}
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
                    Offer Code
                  </label>
                  <input
                    type="text"
                    name="offerCode"
                    value={formData.offerCode}
                    onChange={handleInputChange}
                    placeholder="e.g., NEWUSER10"
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
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="bg-[#ED695A] text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif"
                >
                  {isEditing ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Offer;