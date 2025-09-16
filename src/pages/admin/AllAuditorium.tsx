import React, { useState, useEffect } from 'react';
import { Search, MapPin, Trash, Edit, Plus, X, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Header from '../../component/user/Header';

interface Auditorium {
  _id: string;
  email: string;
  password: string;
  auditoriumName: string;
  ownerName: string;
  events: string[];
  locations: string[];
  phone: string;
}

const availableEvents: string[] = ['Wedding', 'Conference', 'Concert', 'Seminar'];
const availableLocations: string[] = ['Trivandrum', 'Kollam', 'Kochi', 'Kozhikode', 'Thrissur', 'Alappuzha'];


const fetchAllAuditoriums = async (adminId: string): Promise<{ data: Auditorium[] }> => ({
  data: [
    {
      _id: '1',
      email: 'grandhall@example.com',
      password: 'secure123',
      auditoriumName: 'Grand Hall',
      ownerName: 'John Doe',
      events: ['Wedding', 'Conference'],
      locations: ['Trivandrum', 'Kochi'],
      phone: '9876543210',
    },
    {
      _id: '2',
      email: 'staraud@example.com',
      password: 'secure456',
      auditoriumName: 'Star Auditorium',
      ownerName: 'Jane Smith',
      events: ['Concert', 'Seminar'],
      locations: ['Kollam', 'Thrissur'],
      phone: '8765432109',
    },
  ],
});

const addAuditoriumAPI = async (formData: FormData): Promise<{ data: { success: boolean; message: string } }> => ({
  data: { success: true, message: 'Auditorium added successfully' },
});

const updateAuditoriumAPI = async (formData: FormData, id: string): Promise<{ data: { success: boolean; message: string } }> => ({
  data: { success: true, message: 'Auditorium updated successfully' },
});

const deleteAuditoriumAPI = async (id: string): Promise<{ success: boolean }> => ({ success: true });

const AuditoriumManagement: React.FC = () => {
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
  const [selectedAuditorium, setSelectedAuditorium] = useState<Auditorium | null>(null);
  const [expandedAuditorium, setExpandedAuditorium] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newAuditorium, setNewAuditorium] = useState<Partial<Auditorium>>({
    email: '',
    password: '',
    auditoriumName: '',
    ownerName: '',
    events: [],
    locations: [],
    phone: '',
  });

  const { currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchAuditoriums = async () => {
      try {
        const response = await fetchAllAuditoriums(currentUser?.id || '');
        setAuditoriums(Array.isArray(response.data) ? response.data : []);
      } catch (error: unknown) {
        toast.error('Failed to load auditoriums.');
      }
    };
    fetchAuditoriums();
  }, [currentUser]);

  const toggleAuditoriumExpand = (id: string) => {
    setExpandedAuditorium(expandedAuditorium === id ? null : id);
  };

  const selectAuditorium = (auditorium: Auditorium) => {
    setSelectedAuditorium(auditorium);
    setIsEditModalOpen(true);
  };

  const deleteAuditorium = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `Do you want to delete <b>${name}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteAuditoriumAPI(id);
        setAuditoriums(auditoriums.filter((aud) => aud._id !== id));
        if (selectedAuditorium?._id === id) setSelectedAuditorium(null);
        toast.success(`Auditorium "${name}" deleted successfully!`);
      } catch (error: unknown) {
        toast.error('Failed to delete auditorium.');
      }
    }
  };

  const resetAddModal = () => {
    setNewAuditorium({
      email: '',
      password: '',
      auditoriumName: '',
      ownerName: '',
      events: [],
      locations: [],
      phone: '',
    });
    setIsAddModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean = false) => {
    const { name, value } = e.target;
    if (isNew) {
      setNewAuditorium((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (selectedAuditorium) {
      setSelectedAuditorium((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleArrayToggle = (field: 'events' | 'locations', value: string, isNew: boolean = false) => {
    const updateArray = (prevArray: string[] | undefined): string[] =>
      prevArray?.includes(value)
        ? prevArray.filter((v) => v !== value)
        : [...(prevArray || []), value];

    if (isNew) {
      setNewAuditorium((prev) => ({
        ...prev,
        [field]: updateArray(prev[field]),
      }));
    } else if (selectedAuditorium) {
      setSelectedAuditorium((prev) => ({
        ...prev!,
        [field]: updateArray(prev[field]),
      }));
    }
  };

  const validateForm = (aud: Partial<Auditorium>): boolean => {
    if (!aud.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aud.email)) {
      toast.error('Valid email is required.');
      return false;
    }
    if (!aud.password || aud.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return false;
    }
    if (!aud.auditoriumName) {
      toast.error('Auditorium name is required.');
      return false;
    }
    if (!aud.ownerName) {
      toast.error('Owner name is required.');
      return false;
    }
    if (!aud.events?.length) {
      toast.error('At least one event must be selected.');
      return false;
    }
    if (!aud.locations?.length) {
      toast.error('At least one location must be selected.');
      return false;
    }
    if (!aud.phone || !/^\d{10}$/.test(aud.phone)) {
      toast.error('Valid 10-digit phone number is required.');
      return false;
    }
    return true;
  };

  const handleAddAuditorium = async () => {
    if (!validateForm(newAuditorium)) return;

    try {
      const formData = new FormData();
      Object.entries(newAuditorium).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });
      formData.append('adminId', currentUser?.id || '');

      const response = await addAuditoriumAPI(formData);
      if (response.data.success) {
        toast.success(response.data.message);
        resetAddModal();
        const updated = await fetchAllAuditoriums(currentUser?.id || '');
        setAuditoriums(Array.isArray(updated.data) ? updated.data : []);
      } else {
        toast.error('Failed to add auditorium.');
      }
    } catch (error: unknown) {
      toast.error('Something went wrong.');
    }
  };

  const handleUpdateAuditorium = async () => {
    if (!selectedAuditorium || !validateForm(selectedAuditorium)) return;

    try {
      const formData = new FormData();
      Object.entries(selectedAuditorium).forEach(([key, value]) => {
        if (key !== '_id') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      formData.append('adminId', currentUser?.id || '');

      const response = await updateAuditoriumAPI(formData, selectedAuditorium._id);
      if (response.data.success) {
        toast.success(response.data.message);
        setAuditoriums(
          auditoriums.map((aud) =>
            aud._id === selectedAuditorium._id ? selectedAuditorium : aud
          )
        );
        setIsEditModalOpen(false);
        setSelectedAuditorium(null);
      } else {
        toast.error('Failed to update auditorium.');
      }
    } catch (error: unknown) {
      toast.error('Something went wrong while updating auditorium.');
    }
  };

  const filteredAuditoriums = auditoriums.filter(
    (aud) =>
      aud.auditoriumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aud.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-[#b09d94]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold text-[#78533F] font-serif">Auditoriums ({filteredAuditoriums.length})</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto px-6 py-2 bg-[#ED695A] text-white rounded-lg flex items-center justify-center hover:bg-[#D65A4C] transition-all text-sm"
            >
              <Plus size={16} className="mr-2" /> Add New Auditorium
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search auditoriums..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#b09d94]">
          {filteredAuditoriums.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 font-serif text-lg">No auditoriums found</p>
            </div>
          ) : (
            filteredAuditoriums.map((aud) => (
              <div key={aud._id} className="p-4 hover:bg-[#FDF8F1] transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div
                    className="flex items-center cursor-pointer flex-1 min-w-0"
                    onClick={() => toggleAuditoriumExpand(aud._id)}
                  >
                    <div className="mr-3 flex-shrink-0">
                      {expandedAuditorium === aud._id ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg text-[#78533F] font-serif truncate">{aud.auditoriumName}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin size={12} className="mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{aud.locations.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <button
                      onClick={() => selectAuditorium(aud)}
                      className="p-2 hover:bg-[#ED695A]/10 rounded-lg text-[#ED695A]"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteAuditorium(aud._id, aud.auditoriumName)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                {expandedAuditorium === aud._id && (
                  <div className="mt-4 pl-8 border-l-2 border-[#ED695A]/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Owner</p>
                        <p className="text-sm text-gray-600">{aud.ownerName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Email</p>
                        <p className="text-sm text-gray-600">{aud.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Phone</p>
                        <p className="text-sm text-gray-600">{aud.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Events</p>
                        <p className="text-sm text-gray-600">{aud.events.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add Auditorium Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-y-auto">
            <div className="border-b border-[#b09d94] px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#78533F] font-serif">Add New Auditorium</h2>
                <button onClick={resetAddModal} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Email *</label>
                  <input
                    name="email"
                    value={newAuditorium.email || ''}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Password *</label>
                  <input
                    name="password"
                    type="password"
                    value={newAuditorium.password || ''}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Auditorium Name *</label>
                  <input
                    name="auditoriumName"
                    value={newAuditorium.auditoriumName || ''}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter auditorium name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Owner Name *</label>
                  <input
                    name="ownerName"
                    value={newAuditorium.ownerName || ''}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter owner name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Phone *</label>
                  <input
                    name="phone"
                    value={newAuditorium.phone || ''}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Events *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border border-[#b09d94] rounded-lg p-3 bg-gray-50">
                    {availableEvents.map((event) => (
                      <label key={event} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAuditorium.events?.includes(event) || false}
                          onChange={() => handleArrayToggle('events', event, true)}
                          className="h-4 w-4 rounded text-[#ED695A] focus:ring-[#ED695A]"
                        />
                        <span className="text-sm text-[#78533F]">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Locations *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-[#b09d94] rounded-lg p-3 bg-gray-50">
                    {availableLocations.map((loc) => (
                      <label key={loc} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAuditorium.locations?.includes(loc) || false}
                          onChange={() => handleArrayToggle('locations', loc, true)}
                          className="h-4 w-4 rounded text-[#ED695A] focus:ring-[#ED695A]"
                        />
                        <span className="text-sm text-[#78533F]">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-[#b09d94] px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={resetAddModal}
                className="px-4 py-2 border border-[#b09d94] text-[#78533F] rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAuditorium}
                className="px-4 py-2 bg-[#ED695A] text-white rounded-lg hover:bg-[#D65A4C] text-sm"
              >
                Add Auditorium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Auditorium Modal */}
      {isEditModalOpen && selectedAuditorium && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-y-auto">
            <div className="border-b border-[#b09d94] px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#78533F] font-serif">Edit Auditorium: {selectedAuditorium.auditoriumName}</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Email</label>
                  <input
                    name="email"
                    value={selectedAuditorium.email}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={selectedAuditorium.password}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Auditorium Name</label>
                  <input
                    name="auditoriumName"
                    value={selectedAuditorium.auditoriumName}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Owner Name</label>
                  <input
                    name="ownerName"
                    value={selectedAuditorium.ownerName}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Phone</label>
                  <input
                    name="phone"
                    value={selectedAuditorium.phone}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Events</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border border-[#b09d94] rounded-lg p-3 bg-gray-50">
                    {availableEvents.map((event) => (
                      <label key={event} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAuditorium.events.includes(event)}
                          onChange={() => handleArrayToggle('events', event)}
                          className="h-4 w-4 rounded text-[#ED695A] focus:ring-[#ED695A]"
                        />
                        <span className="text-sm text-[#78533F]">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#78533F] font-serif mb-2">Locations</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-[#b09d94] rounded-lg p-3 bg-gray-50">
                    {availableLocations.map((loc) => (
                      <label key={loc} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAuditorium.locations.includes(loc)}
                          onChange={() => handleArrayToggle('locations', loc)}
                          className="h-4 w-4 rounded text-[#ED695A] focus:ring-[#ED695A]"
                        />
                        <span className="text-sm text-[#78533F]">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-[#b09d94] px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-[#b09d94] text-[#78533F] rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAuditorium}
                className="px-4 py-2 bg-[#ED695A] text-white rounded-lg hover:bg-[#D65A4C] text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditoriumManagement;