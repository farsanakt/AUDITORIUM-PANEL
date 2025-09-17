import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check, X, Eye } from 'lucide-react';
import Header from '../../component/user/Header';
import { getAllAuditoriums, acceptAuditorium, rejectAuditorium } from '../../api/userApi'; // Assume these API functions exist

interface Auditorium {
  _id: string;
  role: string;
  email: string;
  password?: string
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
  __v: number;
}

const AuditoriumList: React.FC = () => {
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAuditorium, setSelectedAuditorium] = useState<Auditorium | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchAuditoriums = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAuditoriums()
      setAuditoriums(response.data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching auditoriums';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditoriums();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await acceptAuditorium(id);
      toast.success('Auditorium accepted');
      fetchAuditoriums();
    } catch (error: unknown) {
      toast.error('Error accepting auditorium');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectAuditorium(id);
      toast.success('Auditorium rejected');
      fetchAuditoriums()
    } catch (error: unknown) {
      toast.error('Error rejecting auditorium');
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
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <div className="w-full max-w-6xl mx-auto my-8">
          <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif mb-6">
            All Auditoriums
          </h2>

          {isLoading ? (
            <p className="text-[#78533F] font-serif text-center">Loading auditoriums...</p>
          ) : error ? (
            <p className="text-[#ED695A] font-serif text-center">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-[#b09d94] rounded-xl shadow-md">
                <thead>
                  <tr className="bg-[#FDF8F1] text-left text-sm font-semibold text-[#78533F]">
                    <th className="p-4">Auditorium Name</th>
                    <th className="p-4">Owner Name</th>
                    <th className="p-4 hidden md:table-cell">Email</th>
                    <th className="p-4 hidden lg:table-cell">Phone</th>
                    <th className="p-4 hidden xl:table-cell">District</th>
                    <th className="p-4">Verified</th>
                    <th className="p-4">Blocked</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auditoriums.map((aud) => (
                    <tr key={aud._id} className="border-b border-[#b09d94] hover:bg-[#FDF8F1]">
                      <td className="p-4">{aud.auditoriumName}</td>
                      <td className="p-4">{aud.ownerName}</td>
                      <td className="p-4 hidden md:table-cell">{aud.email}</td>
                      <td className="p-4 hidden lg:table-cell">{aud.phone}</td>
                      <td className="p-4 hidden xl:table-cell">{aud.district}</td>
                      <td className="p-4">
                        {aud.isVerified ? (
                          <span className="text-green-600">Yes</span>
                        ) : (
                          <span className="text-red-600">No</span>
                        )}
                      </td>
                      <td className="p-4">
                        {aud.isBlocked ? (
                          <span className="text-red-600">Yes</span>
                        ) : (
                          <span className="text-green-600">No</span>
                        )}
                      </td>
                      <td className="p-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        {/* <button
                          onClick={() => openDetails(aud)}
                          className="bg-[#ED695A] text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-[#d65a4f] transition-colors"
                        >
                          <Eye size={16} />
                          <span>Details</span>
                        </button> */}
                        {!aud.isVerified && (
                          <>
                            <button
                              onClick={() => handleAccept(aud._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-green-700 transition-colors"
                            >
                              <Check size={16} />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleReject(aud._id)}
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
      {isModalOpen && selectedAuditorium && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#b09d94] max-w-lg w-full mx-4 overflow-y-auto max-h-[80vh]">
            <h3 className="text-lg font-bold text-[#78533F] font-serif mb-4">Auditorium Details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>ID:</strong> {selectedAuditorium._id}</p>
              <p><strong>Role:</strong> {selectedAuditorium.role}</p>
              <p><strong>Email:</strong> {selectedAuditorium.email}</p>
              <p><strong>Verified:</strong> {selectedAuditorium.isVerified ? 'Yes' : 'No'}</p>
              <p><strong>Blocked:</strong> {selectedAuditorium.isBlocked ? 'Yes' : 'No'}</p>
              <p><strong>Auditorium Name:</strong> {selectedAuditorium.auditoriumName}</p>
              <p><strong>Owner Name:</strong> {selectedAuditorium.ownerName}</p>
              <p><strong>Address:</strong> {selectedAuditorium.address}</p>
              <p><strong>District:</strong> {selectedAuditorium.district}</p>
              <p><strong>Panchayat:</strong> {selectedAuditorium.panchayat}</p>
              <p><strong>Phone:</strong> {selectedAuditorium.phone}</p>
              <p><strong>Created At:</strong> {formatDate(selectedAuditorium.createdAt)}</p>
              <p><strong>Updated At:</strong> {formatDate(selectedAuditorium.updatedAt)}</p>
              <p><strong>Version (__v):</strong> {selectedAuditorium.__v}</p>
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

export default AuditoriumList;