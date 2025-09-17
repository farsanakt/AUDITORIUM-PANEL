import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, RefreshCw, User, Mail, Shield, Key, X } from 'lucide-react';
import Header from '../../component/user/Header';
import Sidebar from '../../component/auditorium/Sidebar';
import { toast } from 'react-toastify';
import { fetchAllStaff, addStaff, updateStaff, deleteStaff } from '../../api/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';


type StaffRole = 'Admin' | 'Manager' | 'Staff';
type StaffStatus = 'active' | 'inactive';

interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: StaffStatus;
  createdAt: string;
}

interface NewStaffForm {
  name: string;
  email: string;
  role: StaffRole;
  password: string;
  status: StaffStatus;
}

const StaffManagementUI: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editStaffId, setEditStaffId] = useState<string | null>(null);
  const [newStaff, setNewStaff] = useState<NewStaffForm>({
    name: '',
    email: '',
    role: 'Staff',
    password: '',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const { currentUser } = useSelector((state: RootState) => state.auth);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchAllStaff();
      console.log('Staff API response:', response.data); // Debug: Log response
      setStaff(response.data.map((s: any) => ({
        id: s._id,
        name: s.name,
        email: s.email,
        role: s.role as StaffRole,
        audiId:currentUser?.id,
        status: s.status as StaffStatus,
        createdAt: new Date(s.createdAt).toISOString().split('T')[0]
      })));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching staff';
      console.error('Fetch staff error:', error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const generatePassword = (): void => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewStaff({ ...newStaff, password });
  };

  const handleAddStaff = async (): Promise<void> => {
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const staffData = {
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        password: newStaff.password,
        status: newStaff.status,
        audiUserId:currentUser?.id,
      };
      
      if (editStaffId) {
        // Update existing staff
        await updateStaff(editStaffId, staffData);
        toast.success('Staff updated successfully');
      } else {
        // Add new staff
        await addStaff(staffData);
        toast.success('Staff added successfully');
      }
      
      setNewStaff({ name: '', email: '', role: 'Staff', password: '', status: 'active' });
      setEditStaffId(null);
      setShowModal(false);
      await fetchStaff(); // Refresh staff list
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error saving staff';
      console.error('Save staff error:', error);
      toast.error(errorMessage);
    }
  };

  const handleEditStaff = (member: Staff): void => {
    setNewStaff({
      name: member.name,
      email: member.email,
      role: member.role,
      password: '', // Don't prefill password for security
      status: member.status
    });
    setEditStaffId(member.id);
    setShowModal(true);
  };

  const handleDeleteStaff = async (id: string): Promise<void> => {
    try {
      await deleteStaff(id);
      toast.success('Staff deleted successfully');
      await fetchStaff(); // Refresh staff list
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error deleting staff';
      console.error('Delete staff error:', error);
      toast.error(errorMessage);
    }
  };

  const getRoleColor = (role: StaffRole): string => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Staff': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: StaffStatus): string => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const handleInputChange = (field: keyof NewStaffForm, value: string): void => {
    setNewStaff(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl space-y-6">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-[#78533F] mb-2">Staff Management System</h1>
                  <p className="text-gray-600">Manage your staff and track activities</p>
                </div>
                <button
                  onClick={() => {
                    setEditStaffId(null);
                    setNewStaff({ name: '', email: '', role: 'Staff', password: '', status: 'active' });
                    setShowModal(true);
                  }}
                  className="px-4 py-2 bg-[#ED695A] text-white rounded-lg hover:bg-[#f09c87ce] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Staff
                </button>
              </div>
            </div>

            {/* Staff List Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Staff List</h2>
              </div>
              {isLoading ? (
                <div className="p-6 text-center text-gray-600">Loading staff...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-600">{error}</div>
              ) : staff.length === 0 ? (
                <div className="p-6 text-center text-gray-600">No staff members found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {staff.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.createdAt}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditStaff(member)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteStaff(member.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {editStaffId ? 'Edit Staff' : 'Add New Staff'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditStaffId(null);
                    setNewStaff({ name: '', email: '', role: 'Staff', password: '', status: 'active' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Role
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Password
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStaff.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={editStaffId ? "Enter new password (optional)" : "Enter password or generate"}
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newStaff.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditStaffId(null);
                    setNewStaff({ name: '', email: '', role: 'Staff', password: '', status: 'active' });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStaff}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {editStaffId ? 'Update Staff' : 'Add Staff Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagementUI;