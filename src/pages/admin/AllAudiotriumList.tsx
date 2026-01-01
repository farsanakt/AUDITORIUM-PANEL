import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Check, X, Eye } from 'lucide-react';
import Header from '../../component/user/Header';
import { getAllAuditoriums, acceptAuditorium, rejectAuditorium, existingUserSubscription} from '../../api/userApi';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

interface Auditorium {
  _id: string;
  role: string;
  email: string;
  isVerified: boolean;
  isBlocked: boolean;
  auditoriumName: string;
  ownerName: string;
  address: string;
  district: string;
  panchayat: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  acceptedBy?: string;
}

interface Subscription {
  user: {
    id: string;
  };
  status: string;
  subscription: {
    duration: number;
    durationUnits: string;
  };
  subscriptionDates: {
    endDate: string;
  };
}

const AuditoriumList: React.FC = () => {
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAuditorium, setSelectedAuditorium] = useState<Auditorium | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showExpiring, setShowExpiring] = useState<boolean>(false);
  const hasFetchedSubscriptions = useRef<boolean>(false); // Prevent multiple calls

  const { currentUser } = useSelector((state: RootState) => state.auth);

  const fetchAuditoriums = async () => {
    try {
      console.log('Fetching auditoriums...');
      setIsLoading(true);
      const response = await getAllAuditoriums();
      console.log('Auditoriums response:', response);
      setAuditoriums(response.data || []);
      setError(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching auditoriums';
      console.error('Error in fetchAuditoriums:', error);
      setError(errorMessage);
      toast.error(errorMessage);
      setAuditoriums([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUserSubscriptions = async () => {
    if (hasFetchedSubscriptions.current) {
      console.log('Subscriptions already fetched, skipping...');
      return;
    }
    hasFetchedSubscriptions.current = true;

    try {
      console.log('Fetching all user subscriptions...');
      const response = await existingUserSubscription();
      console.log('Subscriptions response:', response);
      setSubscriptions(response.data?.data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching subscriptions';
      console.error('Full error in fetchAllUserSubscriptions:', error);
      // Only show toast once, not on every render
      toast.error(`Subscriptions fetch failed: ${errorMessage}. Auditoriums still loading normally.`, {
        toastId: 'subscriptions-error' // Prevent duplicate toasts
      });
      setSubscriptions([]);
    }
  };

  const getAuditoriumSubscription = (auditoriumId: string) => {
    const sub = subscriptions.find((sub: Subscription) => sub.user.id === auditoriumId && sub.status === 'active');
    if (!sub) return null;
    const endDate = new Date(sub.subscriptionDates.endDate);
    if (endDate <= new Date()) return null;
    return sub;
  };

  const isExpiring = (auditoriumId: string) => {
    const sub = getAuditoriumSubscription(auditoriumId);
    if (!sub) return false;
    const endDate = new Date(sub.subscriptionDates.endDate);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return endDate <= thirtyDaysFromNow;
  };

  const filteredAuditoriums = auditoriums.filter((aud) => {
    if (!showExpiring) return true;
    return isExpiring(aud._id);
  });

  const getSubscriptionDuration = (auditoriumId: string) => {
    const sub = getAuditoriumSubscription(auditoriumId);
    if (!sub) return 'No Active Subscription';
    const { duration, durationUnits } = sub.subscription;
    return `${duration} ${durationUnits}${duration > 1 ? 's' : ''}`;
  };

  useEffect(() => {
    fetchAuditoriums();
  }, []);

  // Separate effect for subscriptions to run after auditoriums
  useEffect(() => {
    if (!isLoading && auditoriums.length >= 0) { // Run after auditoriums fetch completes
      fetchAllUserSubscriptions();
    }
  }, [isLoading, auditoriums.length]); // Depend on loading state

  const handleAccept = async (id: string) => {
    try {
      await acceptAuditorium(id, currentUser?.id || currentUser?.name);
      toast.success('Auditorium accepted successfully');
      fetchAuditoriums();
    } catch (error) {
      toast.error('Failed to accept auditorium');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectAuditorium(id);
      toast.success('Auditorium rejected');
      fetchAuditoriums();
    } catch (error) {
      toast.error('Failed to reject auditorium');
    }
  };

  const openDetails = (auditorium: Auditorium) => {
    setSelectedAuditorium(auditorium);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAuditorium(null);
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
            All Auditoriums
          </h2>

          {/* Filter */}
          <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <label className="flex items-center gap-2 text-[#78533F] font-medium">
              <input
                type="checkbox"
                checked={showExpiring}
                onChange={(e) => setShowExpiring(e.target.checked)}
                className="rounded"
              />
              Show Expiring Subscriptions Only
            </label>
          </div>

          {isLoading ? (
            <p className="text-center text-[#78533F] text-lg py-12">Loading auditoriums...</p>
          ) : error ? (
            <p className="text-center text-[#ED695A] text-lg py-12">{error}</p>
          ) : filteredAuditoriums.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-12">
              {showExpiring ? 'No expiring subscriptions found.' : 'No auditoriums found.'}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-lg border border-[#b09d94]">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-[#FDF8F1] text-[#78533F] text-sm md:text-base font-semibold">
                    <th className="p-4 text-left">Auditorium Name</th><th className="p-4 text-left">Owner</th><th className="p-4 text-left hidden sm:table-cell">Email</th><th className="p-4 text-left hidden md:table-cell">Phone</th><th className="p-4 text-left hidden lg:table-cell">District</th><th className="p-4 text-left hidden lg:table-cell">Subscription Duration</th><th className="p-4 text-center">Verified</th><th className="p-4 text-left hidden xl:table-cell">Accepted By</th><th className="p-4 text-center">Blocked</th><th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditoriums.map((aud) => (
                    <tr
                      key={aud._id}
                      className="border-b border-[#b09d94]/30 hover:bg-[#FDF8F1] transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-800">{aud.auditoriumName}</td><td className="p-4 text-gray-700">{aud.ownerName}</td><td className="p-4 text-gray-600 hidden sm:table-cell">{aud.email}</td><td className="p-4 text-gray-600 hidden md:table-cell">{aud.phone}</td><td className="p-4 text-gray-600 hidden lg:table-cell">{aud.district}</td><td className="p-4 text-gray-600 hidden lg:table-cell">
                        {getSubscriptionDuration(aud._id)}
                      </td>

                      <td className="p-4 text-center">
                        {aud.isVerified ? (
                          <span className="text-green-600 font-bold">Yes</span>
                        ) : (
                          <span className="text-red-600 font-bold">No</span>
                        )}
                      </td>

                      {/* Accepted By — ONLY shown when isVerified === true */}
                      <td className="p-4 hidden xl:table-cell">
                        {aud.isVerified && aud.acceptedBy ? (
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-amber-100 text-[#78533F] border border-amber-300">
                            {aud.acceptedBy}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        {aud.isBlocked ? (
                          <span className="text-red-600 font-medium">Yes</span>
                        ) : (
                          <span className="text-green-600 font-medium">No</span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <button
                            onClick={() => openDetails(aud)}
                            className="flex items-center justify-center gap-1 bg-[#ED695A] hover:bg-[#d65a4f] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                          >
                            <Eye size={16} />
                            Details
                          </button>

                          {!aud.isVerified && (
                            <>
                              <button
                                onClick={() => handleAccept(aud._id)}
                                className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                              >
                                <Check size={16} />
                                Accept
                              </button>
                              <button
                                onClick={() => handleReject(aud._id)}
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

      {/* Modal - Details Modal - Accepted By only if verified */}
      {isModalOpen && selectedAuditorium && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#b09d94] max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-[#78533F] font-serif mb-6">
                Auditorium Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <p><strong>Auditorium Name:</strong> {selectedAuditorium.auditoriumName}</p>
                  <p><strong>Owner Name:</strong> {selectedAuditorium.ownerName}</p>
                  <p><strong>Email:</strong> {selectedAuditorium.email}</p>
                  <p><strong>Phone:</strong> {selectedAuditorium.phone}</p>
                  <p><strong>Address:</strong> {selectedAuditorium.address}</p>
                </div>
                <div className="space-y-3">
                  <p><strong>District:</strong> {selectedAuditorium.district}</p>
                  <p><strong>Panchayat:</strong> {selectedAuditorium.panchayat || '—'}</p>
                  <p>
                    <strong>Verified:</strong>{' '}
                    <span className={selectedAuditorium.isVerified ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {selectedAuditorium.isVerified ? 'Yes' : 'No'}
                    </span>
                  </p>

                  {/* Only show Accepted By if verified */}
                  {selectedAuditorium.isVerified && selectedAuditorium.acceptedBy && (
                    <p>
                      <strong>Accepted By:</strong>{' '}
                      <span className="inline-block px-4 py-2 bg-amber-100 text-[#78533F] font-bold rounded-full">
                        {selectedAuditorium.acceptedBy}
                      </span>
                    </p>
                  )}

                  <p><strong>Blocked:</strong> {selectedAuditorium.isBlocked ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="mt-6 text-xs text-gray-500 space-y-1">
                <p><strong>Created:</strong> {formatDate(selectedAuditorium.createdAt)}</p>
                <p><strong>Updated:</strong> {formatDate(selectedAuditorium.updatedAt)}</p>
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

export default AuditoriumList;