import React, { useState, FormEvent } from 'react';
import { X } from 'lucide-react';

interface AdminStaff {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const initialStaff: AdminStaff[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', isActive: true },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'editor', isActive: false },
];

const StaffList: React.FC = () => {
  const [staff, setStaff] = useState<AdminStaff[]>(initialStaff);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AdminStaff | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<AdminStaff>({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'admin',
    isActive: true,
  });

  const handleEdit = (staffMember: AdminStaff) => {
    setEditingId(staffMember.id);
    setEditForm({ ...staffMember });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      setStaff(staff.map((item) => (item.id === editForm.id ? editForm : item)));
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleDelete = (id: string) => {
    setStaff(staff.filter((item) => item.id !== id));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (editForm) {
      const { name, value } = e.target;
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleAddInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = (id: string) => {
    setStaff(
      staff.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleAddStaff = (e: FormEvent) => {
    e.preventDefault();
    const newStaff: AdminStaff = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation for demo
      isActive: true,
    };
    setStaff([...staff, newStaff]);
    setFormData({ id: '', name: '', email: '', password: '', role: 'admin', isActive: true });
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: '', name: '', email: '', password: '', role: 'admin', isActive: true });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#78533F]">Staff List</h2>
        <button
          onClick={openModal}
          className="bg-[#78533F] text-white py-2 px-4 rounded-full font-semibold hover:bg-[#634331] transition"
        >
          Add Staff
        </button>
      </div>

      {/* Modal for Adding Staff */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
            <h2 className="text-2xl font-bold text-[#78533F] mb-4 text-center">Add Admin Staff</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#78533F]">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleAddInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A]"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#78533F]">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleAddInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A]"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#78533F]">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleAddInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A]"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-[#78533F]">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleAddInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A]"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddStaff}
                className="w-full bg-[#78533F] text-white py-2 rounded-full font-semibold hover:bg-[#634331] transition"
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Table */}
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4 bg-[#f5e9e2] p-3 rounded-lg">
          <div className="text-[#78533F] font-semibold">Name</div>
          <div className="text-[#78533F] font-semibold">Email</div>
          <div className="text-[#78533F] font-semibold">Role</div>
          <div className="text-[#78533F] font-semibold">Status</div>
          <div className="text-[#78533F] font-semibold">Actions</div>
        </div>
        {staff.map((staffMember) => (
          <div key={staffMember.id} className="grid grid-cols-5 gap-4 p-3 bg-white rounded-lg shadow-sm">
            {editingId === staffMember.id ? (
              <>
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editForm?.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={editForm?.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>
                <div>
                  <select
                    name="role"
                    value={editForm?.role || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A]"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <select
                    name="isActive"
                    value={editForm?.isActive ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm!,
                        isActive: e.target.value === 'true',
                      })
                    }
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:ring-2 focus:ring-[#ED695A]"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-[#78533F] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#634331] transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-[#78533F] py-2">{staffMember.name}</div>
                <div className="text-[#78533F] py-2">{staffMember.email}</div>
                <div className="text-[#78533F] py-2">{staffMember.role}</div>
                <div>
                  <button
                    onClick={() => handleToggleActive(staffMember.id)}
                    className={`px-4 py-2 rounded-full font-semibold ${
                      staffMember.isActive
                        ? 'bg-[#78533F] text-white hover:bg-[#634331]'
                        : 'bg-[#ED695A] text-white hover:bg-[#d45a4e]'
                    } transition`}
                  >
                    {staffMember.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(staffMember)}
                    className="bg-[#78533F] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#634331] transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(staffMember.id)}
                    className="bg-[#ED695A] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#d45a4e] transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffList;