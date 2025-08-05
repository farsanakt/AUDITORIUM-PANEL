import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface AuditoriumProfileProps {
  onLogout?: () => void;
  onRedirect?: (path: string) => void;
}

interface ProfileData {
  auditoriumName: string;
  ownerName: string;
  email: string;
  phone: string;
  events: string[];
  locations: string[];
}

const AuditoriumProfile: React.FC<AuditoriumProfileProps> = ({
  onLogout = () => console.log('Logout function called'),
  onRedirect = (path) => console.log(`Redirecting to ${path}`),
}) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    auditoriumName: '',
    ownerName: '',
    email: '',
    phone: '',
    events: [],
    locations: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const availableEvents = ['wedding', 'Engagement', 'Corporate Events', 'Music Concerts'];
  const availableLocations = ['Kochi', 'Trivandrum', 'Calicut', 'Thrissur'];

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchAuditoriumUser = async () => {
    console.log('Starting fetchAuditoriumUser with currentUser:', currentUser);
    if (!currentUser?.id) {
      console.log('No currentUser or id, redirecting to login');
      onRedirect('/login');
      setLoading(false);
      return;
    }

    // Use mock data to bypass API call
    console.log('Using mock data for profile');
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
    const newProfileData = {
      auditoriumName: 'malabar',
      ownerName: 'vpamal',
      email: 'vpamal@gmail.com',
      phone: '08606184131',
      events: ['wedding', 'Engagement'],
      locations: ['Kochi', 'Trivandrum'],
    };
    console.log('Setting profileData:', newProfileData);
    setProfileData(newProfileData);
    setLoading(false);
  };

  useEffect(() => {
    console.log('useEffect triggered with currentUser:', currentUser);
    fetchAuditoriumUser();
  }, [currentUser]);

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = (field: string) => {
    if (field === 'email') {
      setNewEmail(tempValue);
      setShowPasswordModal(true);
      return;
    }

    setProfileData((prev) => ({
      ...prev,
      [field]: tempValue,
    }));
    setEditingField(null);
    setTempValue('');
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleEventToggle = (event: string) => {
    setProfileData((prev) => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter((e) => e !== event)
        : [...prev.events, event],
    }));
  };

  const handleLocationToggle = (location: string) => {
    setProfileData((prev) => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter((l) => l !== location)
        : [...prev.locations, location],
    }));
  };

  const handlePasswordSubmit = () => {
    // Mock password validation (replace with actual API call)
    if (password === 'password123') {
      setProfileData((prev) => ({
        ...prev,
        email: newEmail,
      }));
      setShowPasswordModal(false);
      setPassword('');
      setNewEmail('');
      setPasswordError('');
      setEditingField(null);
      setTempValue('');
      onLogout();
      setTimeout(() => {
        onRedirect('/login');
      }, 1000);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPassword('');
    setNewEmail('');
    setPasswordError('');
    setEditingField(null);
    setTempValue('');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {loading && <div className="text-center text-gray-600 text-lg">Loading profile...</div>}
      {!loading && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User size={32} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.auditoriumName}</h1>
            <p className="text-lg text-gray-600">Owned by {profileData.ownerName}</p>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auditorium Name
                </label>
                {editingField === 'auditoriumName' ? (
                  <div className="flex space-x-2 max-w-md mx-auto">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                    />
                    <button
                      onClick={() => handleSave('auditoriumName')}
                      className="px-3 py-2 bg-[#ED695A] text-white rounded-md hover:bg-[#d15a4e] transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between max-w-md mx-auto">
                    <span className="text-gray-900">{profileData.auditoriumName}</span>
                    <button
                      onClick={() => handleEdit('auditoriumName', profileData.auditoriumName)}
                      className="text-[#ED695A] hover:text-[#d15a4e] transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name
                </label>
                {editingField === 'ownerName' ? (
                  <div className="flex space-x-2 max-w-md mx-auto">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                    />
                    <button
                      onClick={() => handleSave('ownerName')}
                      className="px-3 py-2 bg-[#ED695A] text-white rounded-md hover:bg-[#d15a4e] transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between max-w-md mx-auto">
                    <span className="text-gray-900">{profileData.ownerName}</span>
                    <button
                      onClick={() => handleEdit('ownerName', profileData.ownerName)}
                      className="text-[#ED695A] hover:text-[#d15a4e] transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number
                </label>
                {editingField === 'phone' ? (
                  <div className="flex space-x-2 max-w-md mx-auto">
                    <input
                      type="tel"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                    />
                    <button
                      onClick={() => handleSave('phone')}
                      className="px-3 py-2 bg-[#ED695A] text-white rounded-md hover:bg-[#d15a4e] transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between max-w-md mx-auto">
                    <span className="text-gray-900">{profileData.phone}</span>
                    <button
                      onClick={() => handleEdit('phone', profileData.phone)}
                      className="text-[#ED695A] hover:text-[#d15a4e] transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                {editingField === 'email' ? (
                  <div className="flex space-x-2 max-w-md mx-auto">
                    <input
                      type="email"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                    />
                    <button
                      onClick={() => handleSave('email')}
                      className="px-3 py-2 bg-[#ED695A] text-white rounded-md hover:bg-[#d15a4e] transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between max-w-md mx-auto">
                    <span className="text-gray-900">{profileData.email}</span>
                    <button
                      onClick={() => handleEdit('email', profileData.email)}
                      className="text-[#ED695A] hover:text-[#d15a4e] transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Available Events */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Calendar size={20} className="inline mr-2" />
              Available Events
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              {availableEvents.map((event) => (
                <label key={event} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.events.includes(event)}
                    onChange={() => handleEventToggle(event)}
                    className="rounded border-gray-300 text-[#ED695A] focus:ring-[#ED695A] focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">{event}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Available Locations */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <MapPin size={20} className="inline mr-2" />
              Available Locations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              {availableLocations.map((location) => (
                <label key={location} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.locations.includes(location)}
                    onChange={() => handleLocationToggle(location)}
                    className="rounded border-gray-300 text-[#ED695A] focus:ring-[#ED695A] focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="text-center">
            <button
              onClick={() => {
                onLogout();
                onRedirect('/login');
              }}
              className="px-4 py-2 bg-[#ED695A] text-white rounded-md hover:bg-[#d15a4e] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl w-[500px] flex flex-col shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]">
            <div className="p-4 border-b bg-gradient-to-r from-[#ED695A] to-[#F17C6E] text-white rounded-t-xl">
              <h3 className="text-lg font-semibold">Confirm Email Change</h3>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-gray-600">To change your email address, please enter your current password. You will be logged out after the change.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  placeholder="Enter your password"
                />
                {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-between">
              <button
                onClick={handlePasswordSubmit}
                className="bg-[#ED695A] text-white px-4 py-2 rounded-lg hover:bg-[#d15a4e] text-sm transition-transform transform hover:scale-105"
              >
                Confirm & Logout
              </button>
              <button
                onClick={handlePasswordCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm transition-transform transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditoriumProfile;