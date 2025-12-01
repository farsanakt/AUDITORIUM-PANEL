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
  id: string;           // MongoDB _id
  staffId: string;      // Real staffId from backend (e.g., xxxx974)
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
  const [showModal, setShowModal] = useState(false);
  const [editStaffId, setEditStaffId] = useState<string | null>(null);
  const [newStaff, setNewStaff] = useState<NewStaffForm>({
    name: '',
    email: '',
    role: 'Staff',
    password: '',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentUser } = useSelector((state: RootState) => state.auth);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchAllStaff(currentUser?.id);

      const staffList: Staff[] = response.data.map((s: any) => ({
        id: s._id,
        staffId: s.staffId || 'N/A', // Use real staffId from DB
        name: s.name,
        email: s.email,
        role: s.role as StaffRole,
        status: s.status as StaffStatus,
        createdAt: new Date(s.createdAt).toLocaleDateString('en-GB') // e.g., 21/11/2025
      }));

      // Optional: Sort by createdAt or staffId if needed
      staffList.sort((a, b) => a.staffId.localeCompare(b.staffId));

      setStaff(staffList);
    } catch (error: any) {
      const message = error?.message || 'Failed to fetch staff';
      setError(message);
      toast.error(message);
      console.error('Fetch staff error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchStaff();
    }
  }, [currentUser?.id]);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewStaff(prev => ({ ...prev, password }));
  };

  const handleAddStaff = async () => {
    if (!newStaff.name.trim() || !newStaff.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    if (!editStaffId && !newStaff.password) {
      toast.error('Password is required for new staff');
      return;
    }

    try {
      const staffData = {
        name: newStaff.name.trim(),
        email: newStaff.email.trim(),
        role: newStaff.role,
        password: editStaffId ? undefined : newStaff.password,
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

      // Reset form
      setNewStaff({ name: '', email: '', role: 'Staff', password: '', status: 'active' });
      setEditStaffId(null);
      setShowModal(false);
      await fetchStaff(); // Refresh list with real staffId from backend
    } catch (error: any) {
      toast.error(error?.message || 'Operation failed');
    }
  };

  const handleEditStaff = (member: Staff) => {
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

  const handleDeleteStaff = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Staff?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ED695A',
      cancelButtonColor: '#78533F',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-xl',
        title: 'text-[#78533F] font-bold',
        confirmButton: 'rounded-full px-5 py-2',
        cancelButton: 'rounded-full px-5 py-2'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await deleteStaff(id);
      toast.success('Staff deleted');
      await fetchStaff();
    } catch (error: any) {
      toast.error(error?.message || 'Delete failed');
    }
  };

  const getRoleColor = (role: StaffRole) => {
    switch (role) {
      case 'Admin': return 'bg-[#ED695A]/20 text-[#ED695A]';
      case 'Manager': return 'bg-[#78533F]/20 text-[#78533F]';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getStatusColor = (status: StaffStatus) => {
    return status === 'active'
      ? 'bg-[#ED695A]/20 text-[#ED695A]'
      : 'bg-gray-200 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col px-2 sm:px-4 py-4">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6">
          <div className="bg-white rounded-xl shadow-lg max-w-7xl mx-auto">
            {/* Header */}
            <div className="p-6 border-b border-[#b09d94]/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#78533F]">Staff Management</h1>
                  <p className="text-sm text-gray-600 mt-1">Manage your team members</p>
                </div>
                <button
                  onClick={() => {
                    setEditStaffId(null);
                    setNewStaff({ name: '', email: '', role: 'Staff', password: '', status: 'active' });
                    setShowModal(true);
                  }}
                  className="px-5 py-2.5 bg-[#ED695A] text-white rounded-full font-semibold hover:bg-[#d45a4e] transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Staff
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#78533F] mb-4">All Staff Members</h2>

              {isLoading ? (
                <p className="text-center text-gray-500 py-8">Loading staff...</p>
              ) : error ? (
                <p className="text-center text-red-600 py-8">{error}</p>
              ) : staff.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No staff members found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#FDF8F1]">
                      <tr>
                        <th className="text-left text-xs font-semibold text-[#78533F uppercase tracking-wider px-4 py-3">Staff ID</th>
                        <th className="text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider px-4 py-3">Name</th>
                        <th className="text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider px-4 py-3">Email</th>
                        <th className="text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider px-4 py-3">Role</th>
                        <th className="text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider px-4 py-3">Status</th>
                        <th className="text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider px-4 py-3">Joined</th>
                        <th className="text-left text-xs font-semibold text-[#78533F] uppercase tracking-wider px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#b09d94]/30">
                      {staff.map((member) => (
                        <tr key={member.id} className="hover:bg-[#FDF8F1] transition">
                          <td className="px-4 py-4">
                            <span className="font-mono font-bold text-[#78533F] text-sm">
                              {member.staffId}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{member.name}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{member.email}</td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{member.createdAt}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleEditStaff(member)}
                                className="text-[#78533F] hover:text-[#634331] transition"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(member.id)}
                                className="text-[#ED695A] hover:text-red-700 transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="text-gray-500 hover:text-gray-700 transition" title="View">
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

      {/* Modal - Same as before */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#b09d94]/30">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#78533F]">
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

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#78533F] mb-2">Name</label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-[#b09d94] rounded-full focus:ring-2 focus:ring-[#ED695A] outline-none"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#78533F] mb-2">Email</label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-[#b09d94] rounded-full focus:ring-2 focus:ring-[#ED695A] outline-none"
                    placeholder="Email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#78533F] mb-2">Role</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, role: e.target.value as StaffRole }))}
                    className="w-full px-4 py-2 border border-[#b09d94] rounded-full focus:ring-2 focus:ring-[#ED695A] outline-none"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#78533F] mb-2">Password</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStaff.password}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, password: e.target.value }))}
                      placeholder={editStaffId ? "Leave blank to keep current" : "Generate or type"}
                      className="flex-1 px-4 py-2 border border-[#b09d94] rounded-full focus:ring-2 focus:ring-[#ED695A] outline-none"
                    />
                    {!editStaffId && (
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="px-4 bg-[#78533F] text-white rounded-full hover:bg-[#634331]"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#78533F] mb-2">Status</label>
                  <select
                    value={newStaff.status}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, status: e.target.value as StaffStatus }))}
                    className="w-full px-4 py-2 border border-[#b09d94 rounded-full focus:ring-2 focus:ring-[#ED695A] outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditStaffId(null);
                    setNewStaff({ name: '', email: '', role: 'Staff', password: '', status: 'active' });
                  }}
                  className="px-5 py-2 text-[#78533F] bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStaff}
                  className="px-6 py-2 bg-[#ED695A] text-white rounded-full font-semibold hover:bg-[#d45a4e] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {editStaffId ? 'Update' : 'Add Staff'}
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