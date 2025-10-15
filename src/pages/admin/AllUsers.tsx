import React, { useState, useEffect } from 'react';
import { Search, Trash, Edit, Lock, Unlock, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Header from '../../component/user/Header';
import { fetchAllUsers } from '../../api/userApi';

interface User {
  _id: string;
  role: string;
  email: string;
  password: string;
  isVerified: boolean;
  isBlocked: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

const toggleBlockUserAPI = async (id: string, isBlocked: boolean): Promise<{ success: boolean; message: string }> => ({
  success: true,
  message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
});

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 5;

  const { currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchAllUsers();
        const sortedUsers = Array.isArray(response.data)
          ? response.data.sort((a: User, b: User) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          : [];
        setUsers(sortedUsers);
      } catch (error: unknown) {
        toast.error('Failed to load users.');
      }
    };
    fetchUsers();
  }, [currentUser]);

  const toggleUserExpand = (id: string) => {
    setExpandedUser(expandedUser === id ? null : id);
  };

  const toggleBlockUser = async (id: string, isBlocked: boolean, name: string) => {
    const action = isBlocked ? 'block' : 'unblock';
    const result = await Swal.fire({
      title: `Are you sure?`,
      html: `Do you want to ${action} <b>${name}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Yes, ${action} user!`,
    });

    if (result.isConfirmed) {
      try {
        const response = await toggleBlockUserAPI(id, isBlocked);
        if (response.success) {
          setUsers(
            users.map((user) =>
              user._id === id ? { ...user, isBlocked } : user
            )
          );
          toast.success(response.message);
        } else {
          toast.error(`Failed to ${action} user.`);
        }
      } catch (error: unknown) {
        toast.error(`Something went wrong while ${action}ing user.`);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setExpandedUser(null); // Collapse any expanded user when changing pages
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-[#b09d94]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold text-[#78533F] font-serif">Users ({filteredUsers.length})</h2>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#b09d94]">
          {currentUsers.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 font-serif text-lg">No users found</p>
            </div>
          ) : (
            currentUsers.map((user) => (
              <div key={user._id} className="p-4 hover:bg-[#FDF8F1] transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div
                    className="flex items-center cursor-pointer flex-1 min-w-0"
                    onClick={() => toggleUserExpand(user._id)}
                  >
                    <div className="mr-3 flex-shrink-0">
                      {expandedUser === user._id ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg text-[#78533F] font-serif truncate">{`${user.firstName} ${user.lastName}`}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <span className="text-sm truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="text-sm text-gray-600">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => toggleBlockUser(user._id, !user.isBlocked, `${user.firstName} ${user.lastName}`)}
                      className={`p-2 rounded-lg ${user.isBlocked ? 'hover:bg-green-50 text-green-600' : 'hover:bg-red-50 text-red-600'}`}
                    >
                      {user.isBlocked ? <Unlock size={16} /> : <Lock size={16} />}
                    </button>
                  </div>
                </div>
                {expandedUser === user._id && (
                  <div className="mt-4 pl-8 border-l-2 border-[#ED695A]/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Email</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Phone</p>
                        <p className="text-sm text-gray-600">{user.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Role</p>
                        <p className="text-sm text-gray-600">{user.role}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Status</p>
                        <p className="text-sm text-gray-600">{user.isBlocked ? 'Blocked' : 'Active'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Verified</p>
                        <p className="text-sm text-gray-600">{user.isVerified ? 'Verified' : 'Not Verified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#78533F] font-serif">Created At</p>
                        <p className="text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-[#b09d94] rounded-lg text-sm font-medium text-[#78533F] disabled:opacity-50 hover:bg-[#FDF8F1]"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border border-[#b09d94] rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? 'bg-[#78533F] text-white'
                    : 'text-[#78533F] hover:bg-[#FDF8F1]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-[#b09d94] rounded-lg text-sm font-medium text-[#78533F] disabled:opacity-50 hover:bg-[#FDF8F1]"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default UsersManagement;