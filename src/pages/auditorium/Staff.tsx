import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, RefreshCw, User, Mail, Shield, Key, X } from 'lucide-react';
import Header from '../../component/user/Header';
import Sidebar from '../../component/auditorium/Sidebar';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
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
      const response = await fetchAllStaff(currentUser?.id);
      setStaff(response.data.map((s: any) => ({
        id: s._id,
        name: s.name,
        email: s.email,
        role: s.role as StaffRole,
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
    if (!newStaff.name || !newStaff.email) {
      toast.error('Please fill in name and email fields');
      return;
    }

    if (!editStaffId && !newStaff.password) {
      toast.error('Password is required for new staff');
      return;
    }

    try {
      const staffData = {
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        password: newStaff.password || undefined,
        status: newStaff.status,
        audiUserId: currentUser?.id,
      };
      
      if (editStaffId) {
        await updateStaff(editStaffId, staffData);
        toast.success('Staff updated successfully');
      } else {
        await addStaff(staffData);
        toast.success('Staff added successfully');
      }
      
      setNewStaff({ name: '', email: '', role: 'Staff', password: '', status: 'active' });
      setEditStaffId(null);
      setShowModal(false);
      await fetchStaff();
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
      password: '',
      status: member.status
    });
    setEditStaffId(member.id);
    setShowModal(true);
  };

  const handleDeleteStaff = async (id: string): Promise<void> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this staff member?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ED695A',
      cancelButtonColor: '#78533F',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      buttonsStyling: true,
      customClass: {
        popup: 'rounded-xl',
        title: 'text-[#78533F] text-lg font-bold',
        htmlContainer: 'text-gray-600 text-sm',
        confirmButton: 'px-4 py-2 rounded-full text-white font-semibold',
        cancelButton: 'px-4 py-2 rounded-full text-white font-semibold'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await deleteStaff(id);
      toast.success('Staff deleted successfully');
      await fetchStaff();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error deleting staff';
      console.error('Delete staff error:', error);
      toast.error(errorMessage);
    }
  };

  const getRoleColor = (role: StaffRole): string => {
    switch (role) {
      case 'Admin': return 'bg-[#ED695A]/20 text-[#ED695A]';
      case 'Manager': return 'bg-[#78533F]/20 text-[#78533F]';
      case 'Staff': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getStatusColor = (status: StaffStatus): string => {
    return status === 'active' ? 'bg-[#ED695A]/20 text-[#ED695A]' : 'bg-gray-200 text-gray-700';
  };

  const handleInputChange = (field: keyof NewStaffForm, value: string): void => {
    setNewStaff(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col px-2 sm:px-4 py-4">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6">
          <div className="bg-white rounded-xl shadow-lg max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#78533F] mb-2">Staff Management System</h1>
                  <p className="text-sm text-gray-600">Manage your staff and track activities</p>
                </div>
                <button
                  onClick={() => {
                    setEditStaffId(null);
                    setNewStaff({ name: '', email: '', role: 'Staff', password: '', status: 'active' });
                    setShowModal(true);
                  }}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-[#ED695A] text-white rounded-full font-semibold hover:bg-[#f09c87ce] transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Staff
                </button>
              </div>
            </div>

            {/* Staff List Table */}
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-bold text-[#78533F] mb-4">Staff List</h2>
              {isLoading ? (
                <div className="p-6 text-center text-gray-600">Loading staff...</div>
              ) : error ? (
                <div className="p-6 text-center text-[#ED695A]">{error}</div>
              ) : staff.length === 0 ? (
                <div className="p-6 text-center text-gray-600">No staff members found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#FDF8F1]">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">Email</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">Role</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">Created</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#b09d94]">
                      {staff.map((member) => (
                        <tr key={member.id} className="hover:bg-[#FDF8F1] transition">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.email}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.createdAt}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditStaff(member)}
                                className="text-[#78533F] hover:text-[#634331] p-1 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteStaff(member.id)}
                                className="text-[#ED695A] hover:text-[#f09c87ce] p-1 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2 sm:px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-[#b09d94]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-[#78533F] flex items-center gap-2">
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
            
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#78533F]" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#78533F]" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#78533F]" />
                    Role
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#78533F]" />
                    Password
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStaff.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent"
                      placeholder={editStaffId ? "Enter new password (optional)" : "Enter password or generate"}
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-3 py-2 bg-[#78533F] text-white rounded-full font-semibold hover:bg-[#634331] transition"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] mb-2">Status</label>
                  <select
                    value={newStaff.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A] focus:border-transparent"
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
                  className="px-4 py-2 text-[#78533F] bg-gray-200 rounded-full font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStaff}
                  className="px-4 py-2 bg-[#ED695A] text-white rounded-full font-semibold hover:bg-[#f09c87ce] transition flex items-center gap-2"
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