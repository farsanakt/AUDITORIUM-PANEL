import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { createSubscriptionPlan, deleteSubscriptionPlan, fetchAdminPlans, updateSubscriptionPlan } from '../../api/userApi';

interface SubscriptionPlan {
  _id?: string;
  planName: string;
  price: number;
  duration: number;
  durationUnits: string;
  description: string;
  features: string[];
  userType: 'vendorside' | 'auditoriumside' | 'both';
  userId: string;
}

interface RootState {
  auth: {
    currentUser: { id: string } | null;
  };
}

const initialFormData: Omit<SubscriptionPlan, '_id' | 'userId'> = {
  planName: '',
  price: 0,
  duration: 0,
  durationUnits: 'months',
  description: '',
  features: [],
  userType: 'vendorside',
};

const AdminSubscriptionManager: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<Omit<SubscriptionPlan, '_id' | 'userId'>>(initialFormData);
  const [newFeature, setNewFeature] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserPlans();
  }, [currentUser]);

  const fetchUserPlans = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAdminPlans();
      console.log(response.data, 'dateeee');
      if (response.data.success) {
        setPlans(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setError(response.data.message || 'Failed to fetch plans');
        toast.error(response.data.message || 'Failed to fetch plans');
      }
    } catch (error: any) {
      setError('Error fetching plans');
      toast.error('Error fetching plans');
      console.error('Error fetching plans:', error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const openModal = (plan?: SubscriptionPlan) => {
    setCurrentPlan(plan || null);
    setFormData(plan ? { ...plan } : initialFormData);
    setNewFeature('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPlan(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentPlan?._id) {
        console.log('hiiii')
        console.log(currentPlan._id,'ide')
        const response = await updateSubscriptionPlan(currentPlan._id, formData);
        
        if (response.data.message) {
          toast.success('Plan updated successfully');
          await fetchUserPlans();
        } else {
          toast.error(response.data.message || 'Failed to update plan');
          setError(response.data.message || 'Failed to update plan');
        }
      } else {
        const response = await createSubscriptionPlan(formData);
        console.log('res',response)
        if (response.data.message) {
          toast.success('Plan created successfully');
          await fetchUserPlans();
        } else {
          toast.error(response.data.message || 'Failed to create plan');
          setError(response.data.message || 'Failed to create plan');
        }
      }
      closeModal();
    } catch (error: any) {
      toast.error('Error saving plan');
      setError('Error saving plan');
      console.error('Error:', error.message || error);
    }
  };

  const handleDelete = async (planId: string, planName: string) => {
    const result = await Swal.fire({
      title: 'Confirm Deletion',
      text: `Are you sure you want to delete the plan "${planName}"?`,
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
      const response= await deleteSubscriptionPlan(planId);
      if (response.data.success) {
        toast.success('Plan deleted successfully');
        await fetchUserPlans();
      } else {
        toast.error(response.data.message || 'Error deleting plan');
        setError(response.data.message || 'Error deleting plan');
      }
    } catch (error: any) {
      toast.error('Error deleting plan');
      setError('Error deleting plan');
      console.error('Error:', error.message || error);
    }
  };

  const getUserTypeLabel = (userType: 'vendorside' | 'auditoriumside' | 'both') => {
    switch (userType) {
      case 'vendorside':
        return 'Vendor Side';
      case 'auditoriumside':
        return 'Auditorium Side';
      case 'both':
        return 'Both';
      default:
        return userType;
    }
  };

  return (
    <div className="min-h-screen from-slate-50 via-white to-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#78533F] mb-8 sm:mb-12">
          Subscription Plans Management
        </h1>
        {isLoading ? (
          <p className="text-center text-[#78533F] font-serif text-base sm:text-lg">Loading plans...</p>
        ) : error ? (
          <p className="text-center text-[#ED695A] font-serif text-base sm:text-lg">{error}</p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header with Add Button */}
            <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-[#78533F]/5 to-[#ED695A]/5">
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-[#78533F] text-white rounded-full font-semibold text-sm sm:text-base hover:bg-[#634331] transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:ring-offset-2"
              >
                <span className="mr-2">+</span>
                Add New Plan
              </button>
            </div>

            {/* Plans Table */}
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">
                      Plan Name
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">
                      User Type
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">
                      Features
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 sm:px-6 sm:py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg
                            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                            No subscription plans
                          </h3>
                          <p className="text-sm text-gray-500 mb-4 sm:mb-6 max-w-xs sm:max-w-sm mx-auto">
                            Create your first subscription plan to get started.
                          </p>
                          <button
                            onClick={() => openModal()}
                            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-[#78533F] text-white rounded-full font-semibold text-sm sm:text-base hover:bg-[#634331] transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:ring-offset-2"
                          >
                            + Create First Plan
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    plans.map((plan) => (
                      <tr key={plan._id} className="hover:bg-gray-50/50 transition-colors duration-200">
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {plan.planName}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                          ${plan.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                          {plan.duration} {plan.durationUnits}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 sm:px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold ring-1 ring-inset ${
                              plan.userType === 'vendorside'
                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                : plan.userType === 'auditoriumside'
                                ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                                : 'bg-blue-50 text-blue-700 ring-blue-600/20'
                            }`}
                          >
                            {getUserTypeLabel(plan.userType)}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-700 max-w-[150px] sm:max-w-xs" title={plan.description}>
                          <p className="line-clamp-2">{plan.description}</p>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">
                          <div className="flex flex-wrap gap-2 max-w-[150px] sm:max-w-md">
                            {plan.features.slice(0, 3).map((feature, idx) => (
                              <span
                                key={idx}
                                className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                title={feature}
                              >
                                {feature.length > 12 ? `${feature.slice(0, 12)}...` : feature}
                              </span>
                            ))}
                            {plan.features.length > 3 && (
                              <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                                +{plan.features.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              onClick={() => openModal(plan)}
                              className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 border border-transparent rounded-full text-xs sm:text-sm font-medium text-white bg-[#ED695A] hover:bg-[#d95a4a] transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:ring-offset-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(plan._id!, plan.planName)}
                              className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 border border-transparent rounded-full text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={closeModal}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-2xl z-50 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#78533F]">
                {currentPlan ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
              </h2>
              <button
                onClick={closeModal}
                className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Plan Name - Full Width */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  Plan Name *
                </label>
                <input
                  type="text"
                  name="planName"
                  value={formData.planName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-[#b09d94] rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-[#ED695A]"
                  placeholder="Enter plan name"
                  required
                />
              </div>

              {/* Price & Duration - Two Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min={0}
                    step={0.01}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-[#b09d94] rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-[#ED695A]"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Duration *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min={1}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-[#b09d94] rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-[#ED695A]"
                    placeholder="e.g., 12"
                    required
                  />
                </div>
              </div>

              {/* Duration Units & User Type - Two Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Duration Units *
                  </label>
                  <select
                    name="durationUnits"
                    value={formData.durationUnits}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-[#ED695A]"
                    required
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    User Type *
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-[#ED695A]"
                    required
                  >
                    <option value="vendorside">Vendor Side</option>
                    <option value="auditoriumside">Auditorium Side</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              {/* Description - Full Width */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-[#b09d94] rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-[#ED695A]"
                  placeholder="Short description of what this plan offers..."
                  required
                />
              </div>

              {/* Features - Full Width */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  Features
                </label>
                <div className="flex flex-col sm:flex-row mb-3 sm:mb-4 gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddFeature();
                      }
                    }}
                    placeholder="Enter a feature (press Enter or Add)"
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-[#b09d94] rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-[#ED695A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-[#78533F] text-white rounded-full font-semibold text-sm sm:text-base hover:bg-[#634331] transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:ring-offset-2"
                    disabled={!newFeature.trim()}
                  >
                    Add
                  </button>
                </div>
                {formData.features.length > 0 && (
                  <div className="space-y-2 sm:space-y-3 max-h-48 overflow-y-auto pr-2 -mr-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50/80 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200/60"
                      >
                        <span
                          className="text-sm text-gray-700 flex-1 truncate pr-4"
                          title={feature}
                        >
                          {feature}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-red-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 bg-gray-300 text-gray-700 rounded-full font-semibold text-sm sm:text-base hover:bg-gray-400 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 bg-[#78533F] text-white rounded-full font-semibold text-sm sm:text-base hover:bg-[#634331] transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:ring-offset-2"
                >
                  {currentPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSubscriptionManager;