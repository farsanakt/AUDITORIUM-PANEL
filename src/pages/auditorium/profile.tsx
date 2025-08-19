import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Mail, Lock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { fetchAuditoriumUserdetails, verifyPswrd } from '../../api/userApi';

// Types
interface AuditoriumUser {
  _id?: string;
  email: string;
  password: string;
  isVerified: boolean;
  isBlocked: boolean;
  auditoriumName: string;
  ownerName: string;
  events: string[];
  locations: string[];
  phone: string;
}

interface EditState {
  [key: string]: boolean;
}

interface FormData {
  [key: string]: any;
}

interface RootState {
  auth: {
    currentUser: {
      id: string;
      role: string;
      email: string;
    } | null;
  };
}

// Mock API function - replace with your actual import
// const fetchAuditoriumUserdetails = async (userId: string) => {
//   // Replace this with your actual API call
//   const response = await fetch(`/api/auditorium/user/${userId}`, {
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('token')}`
//     }
//   });
//   const data = await response.json();
//   return { data: data.data };
// };

const AuditoriumProfile: React.FC = () => {
  const [userData, setUserData] = useState<AuditoriumUser | null>(null);
  const [editState, setEditState] = useState<EditState>({});
  const [formData, setFormData] = useState<FormData>({});
  const { currentUser } = useSelector((state: RootState) => state.auth);
  
  // Email editing states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [newEmailInput, setNewEmailInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      if (!currentUser?.id) return;
      
      setLoading(true);
      const response = await fetchAuditoriumUserdetails(currentUser.id);
      console.log(response.data, 'this profile data');
      
      if (response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Error loading user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  // Show loading state if userData is not loaded
  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading user data...</div>
        </div>
      </div>
    );
  }

  const handleEditToggle = (field: string) => {
    setEditState(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    
    if (!editState[field]) {
      setFormData(prev => ({
        ...prev,
        [field]: userData[field as keyof AuditoriumUser]
      }));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const currentArray = formData[field] || userData[field as keyof AuditoriumUser];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field: string) => {
    const currentArray = formData[field] || userData[field as keyof AuditoriumUser];
    const newArray = [...currentArray, ''];
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = formData[field] || userData[field as keyof AuditoriumUser];
    const newArray = currentArray.filter((_: any, i: number) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSave = async (field: string) => {
    try {
      setLoading(true);
      
      // Use your actual API endpoint
      const response = await fetch(`/api/auditorium/update-profile/${currentUser?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          [field]: formData[field]
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUserData(prev => prev ? ({
          ...prev,
          [field]: formData[field]
        }) : null);
        
        setEditState(prev => ({
          ...prev,
          [field]: false
        }));
        
        alert('Data updated successfully!');
      } else {
        alert(result.message || 'Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Error updating data');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailEditClick = () => {
    setShowPasswordModal(true);
    setPasswordInput('');
    setPasswordError('');
  };

  // const verifyPassword = async () => {
  //   try {
  //     setLoading(true);
  //     setPasswordError('');
      
  //     // const response = await fetch(`/api/auditorium/verify-password/${currentUser?.id}`, {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //     'Authorization': `Bearer ${localStorage.getItem('token')}`
  //     //   },
  //     //   body: JSON.stringify({
  //     //     password: passwordInput
  //     //   }),
  //     // });

  //     const response=await verifyPswrd(currentUser?.id)

  //     const data = await response.json();
      
  //     if (response.ok && data.success) {
  //       setShowPasswordModal(false);
  //       setShowEmailModal(true);
  //       setNewEmailInput(userData?.email || '');
  //     } else {
  //       setPasswordError(data.message || 'Incorrect password');
  //     }
  //   } catch (error) {
  //     console.error('Error verifying password:', error);
  //     setPasswordError('Error verifying password');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const verifyPassword = async () => {
    try {
      setLoading(true);
      setPasswordError('');
      
  
      const response=await verifyPswrd(currentUser?.id,passwordInput)

      // const data = await response.json();
      
      // if (response.ok && data.success) {
      //   setShowPasswordModal(false);
      //   setShowEmailModal(true);
      //   setNewEmailInput(userData?.email || '');
      // } else {
      //   setPasswordError(data.message || 'Incorrect password');
      // }
    } catch (error) {
      console.error('Error verifying password:', error);
      setPasswordError('Error verifying password');
    } finally {
      setLoading(false);
    }
  };

  const updateEmail = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/auditorium/update-email/${currentUser?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          newEmail: newEmailInput
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUserData(prev => prev ? ({
          ...prev,
          email: newEmailInput
        }) : null);
        
        setShowEmailModal(false);
        alert('Email updated successfully!');
      } else {
        alert(result.message || 'Failed to update email');
      }
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Error updating email');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: string, label: string, type: 'text' | 'boolean' | 'array' = 'text') => {
    const isEditing = editState[field];
    const value = formData[field] !== undefined ? formData[field] : userData[field as keyof AuditoriumUser];

    return (
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          {field !== 'email' && (
            <button
              onClick={() => handleEditToggle(field)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              disabled={loading}
            >
              {isEditing ? <X size={16} /> : <Edit2 size={16} />}
            </button>
          )}
        </div>

        {type === 'boolean' ? (
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {value ? 'Yes' : 'No'}
            </span>
            {isEditing && (
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={field}
                    checked={formData[field] === true}
                    onChange={() => handleInputChange(field, true)}
                    className="mr-1"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={field}
                    checked={formData[field] === false}
                    onChange={() => handleInputChange(field, false)}
                    className="mr-1"
                  />
                  No
                </label>
              </div>
            )}
          </div>
        ) : type === 'array' ? (
          <div>
            {isEditing ? (
              <div>
                {(formData[field] || value).map((item: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(field, index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => removeArrayItem(field, index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem(field)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add {label.slice(0, -1)}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {value.map((item: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {isEditing ? (
              <input
                type="text"
                value={formData[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            ) : (
              <span className="text-gray-900">{value}</span>
            )}
          </div>
        )}

        {isEditing && (
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => handleSave(field)}
              disabled={loading}
              className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            <button
              onClick={() => handleEditToggle(field)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Auditorium User Management</h1>

      {/* Email Field with Special Handling */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <button
            onClick={handleEmailEditClick}
            className="flex items-center space-x-1 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            disabled={loading}
          >
            <Mail size={16} />
            <span>Edit Email</span>
          </button>
        </div>
        <span className="text-gray-900">{userData?.email}</span>
      </div>

      {/* Other Fields */}
      {renderField('auditoriumName', 'Auditorium Name')}
      {renderField('ownerName', 'Owner Name')}
      {renderField('phone', 'Phone Number')}
      {renderField('isVerified', 'Verified Status', 'boolean')}
      {renderField('isBlocked', 'Blocked Status', 'boolean')}
      {renderField('events', 'Events', 'array')}
      {renderField('locations', 'Locations', 'array')}

      {/* Password Verification Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Verify Password</h2>
            <p className="text-gray-600 mb-4">Please enter your current password to change email</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded"
                  placeholder="Enter your password"
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={verifyPassword}
                disabled={loading || !passwordInput}
                className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Update Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Email</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded"
                  placeholder="Enter new email"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={updateEmail}
                disabled={loading || !newEmailInput || newEmailInput === userData?.email}
                className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Email'}
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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