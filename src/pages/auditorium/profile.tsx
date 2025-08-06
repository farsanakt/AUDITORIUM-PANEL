import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Building2, Crown, LogOut } from 'lucide-react';

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
  const availableEvents = ['Wedding', 'Engagement', 'Corporate Events', 'Music Concerts'];
  const availableLocations = ['Kochi', 'Trivandrum', 'Calicut', 'Thrissur'];

  // State for general profile editing (excluding email)
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfileData, setTempProfileData] = useState<ProfileData | null>(null);

  // State for email specific editing
  const [editingEmailField, setEditingEmailField] = useState<boolean>(false);
  const [tempEmailValue, setTempEmailValue] = useState<string>('');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Simulated backend API call to fetch user data
  const fetchAuditoriumUser = async () => {
    setLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newProfileData = {
      auditoriumName: 'Malabar Grand Hall',
      ownerName: 'V. P. Amal',
      email: 'vpamal@gmail.com',
      phone: '+91 8606184131',
      events: ['Wedding', 'Engagement'],
      locations: ['Kochi', 'Trivandrum'],
    };
    setProfileData(newProfileData);
    setLoading(false);
    console.log('Fetched profile data:', newProfileData);
  };

  // Simulated backend API call to update profile data (excluding email)
  const updateProfileDataBackend = async (data: ProfileData) => {
    console.log('Simulating backend update for profile data:', data);
    // In a real application, you would make an API call here, e.g.:
    // const response = await fetch('/api/profile', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // if (!response.ok) {
    //   throw new Error('Failed to update profile');
    // }
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
    console.log('Profile data updated successfully on backend (simulated).');
  };

  // Simulated backend API call to verify password and change email
  const verifyPasswordAndChangeEmail = async (email: string, currentPassword: string) => {
    console.log(`Simulating backend call to change email to "${email}" with password verification.`);
    // In a real application, you would make an API call here, e.g.:
    // const response = await fetch('/api/change-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ newEmail: email, password: currentPassword }),
    // });
    // const result = await response.json();
    // return result.success; // Assuming the backend returns { success: true/false }

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    if (currentPassword === 'password123') { // Hardcoded for demonstration, replace with actual backend check
      console.log('Password verified and email changed successfully (simulated).');
      return true;
    } else {
      console.error('Incorrect password (simulated).');
      return false;
    }
  };

  useEffect(() => {
    fetchAuditoriumUser();
  }, []);

  // Handlers for general profile editing
  const handleStartEditing = () => {
    setIsEditing(true);
    setTempProfileData({ ...profileData }); // Create a mutable copy
  };

  const handleSaveChanges = async () => {
    if (tempProfileData) {
      setProfileData(tempProfileData); // Update main state
      await updateProfileDataBackend(tempProfileData); // Send to backend
    }
    setIsEditing(false);
    setTempProfileData(null); // Clear temporary data
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setTempProfileData(null); // Discard changes
  };

  const handleTempInputChange = (field: keyof ProfileData, value: string) => {
    setTempProfileData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // Handlers for email editing (separate flow)
  const handleEditEmail = (currentValue: string) => {
    setEditingEmailField(true);
    setTempEmailValue(currentValue);
  };

  const handleSaveEmail = () => {
    setNewEmail(tempEmailValue);
    setShowPasswordModal(true);
    setEditingEmailField(false); // Exit email editing mode
    setTempEmailValue('');
  };

  const handleCancelEmail = () => {
    setEditingEmailField(false);
    setTempEmailValue('');
  };

  // Handlers for events and locations (immediate update)
  const handleEventToggle = async (event: string) => {
    const updatedEvents = profileData.events.includes(event)
      ? profileData.events.filter((e) => e !== event)
      : [...profileData.events, event];

    const updatedProfile = {
      ...profileData,
      events: updatedEvents,
    };
    setProfileData(updatedProfile);
    await updateProfileDataBackend(updatedProfile); // Send all data to backend
  };

  const handleLocationToggle = async (location: string) => {
    const updatedLocations = profileData.locations.includes(location)
      ? profileData.locations.filter((l) => l !== location)
      : [...profileData.locations, location];

    const updatedProfile = {
      ...profileData,
      locations: updatedLocations,
    };
    setProfileData(updatedProfile);
    await updateProfileDataBackend(updatedProfile); // Send all data to backend
  };

  // Password modal handlers
  const handlePasswordSubmit = async () => {
    setPasswordError('');
    const success = await verifyPasswordAndChangeEmail(newEmail, password);

    if (success) {
      setProfileData((prev) => ({
        ...prev,
        email: newEmail,
      }));
      setShowPasswordModal(false);
      setPassword('');
      setNewEmail('');
      setPasswordError('');
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-3"></div>
          <p className="text-slate-600 text-base font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                <Building2 size={32} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white shadow">
                <Crown size={12} className="text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{profileData.auditoriumName}</h1>
            <p className="text-base sm:text-lg text-indigo-100 flex items-center justify-center gap-2">
              <User size={16} />
              Owned by {profileData.ownerName}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200/50 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200/50">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <User size={16} className="text-indigo-600" />
              </div>
              Basic Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Auditorium Name */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Auditorium Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfileData?.auditoriumName || ''}
                    onChange={(e) => handleTempInputChange('auditoriumName', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-800 font-medium text-base">{profileData.auditoriumName}</span>
                  </div>
                )}
              </div>
              {/* Owner Name */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Owner Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfileData?.ownerName || ''}
                    onChange={(e) => handleTempInputChange('ownerName', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-800 font-medium text-base">{profileData.ownerName}</span>
                  </div>
                )}
              </div>
              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  <Phone size={14} />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempProfileData?.phone || ''}
                    onChange={(e) => handleTempInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-800 font-medium text-base">{profileData.phone}</span>
                  </div>
                )}
              </div>
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  <Mail size={14} />
                  Email Address
                </label>
                {editingEmailField ? (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={tempEmailValue}
                      onChange={(e) => setTempEmailValue(e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <button
                      onClick={handleSaveEmail}
                      className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleCancelEmail}
                      className="px-3 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors shadow"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-800 font-medium text-base">{profileData.email}</span>
                    <button
                      onClick={() => handleEditEmail(profileData.email)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 hover:bg-indigo-50 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Edit/Save/Cancel Buttons for general profile */}
            <div className="mt-6 flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveChanges}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEditing}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors shadow"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStartEditing}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Events and Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Events */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-slate-200/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Calendar size={16} className="text-emerald-600" />
                </div>
                Available Events
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {availableEvents.map((event) => (
                  <label key={event} className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all group">
                    <input
                      type="checkbox"
                      checked={profileData.events.includes(event)}
                      onChange={() => handleEventToggle(event)}
                      className="w-4 h-4 text-emerald-600 border-2 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-700 font-medium text-base group-hover:text-slate-900 transition-colors">{event}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Available Locations */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin size={16} className="text-blue-600" />
                </div>
                Available Locations
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {availableLocations.map((location) => (
                  <label key={location} className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all group">
                    <input
                      type="checkbox"
                      checked={profileData.locations.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                      className="w-4 h-4 text-blue-600 border-2 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-700 font-medium text-base group-hover:text-slate-900 transition-colors">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Logout Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              onLogout();
              onRedirect('/login');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-t-xl">
              <h3 className="text-lg font-bold">Confirm Email Change</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-sm">
                To change your email address, please enter your current password. You will be logged out after the change.
              </p>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Current Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                {passwordError && (
                  <p className="text-red-600 text-xs font-medium">{passwordError}</p>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 rounded-b-xl flex gap-3">
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 font-semibold transition-all"
              >
                Confirm & Logout
              </button>
              <button
                onClick={handlePasswordCancel}
                className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 font-semibold transition-all"
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
