import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { Home, Users, Building, DollarSign, Mail, Ticket, Calendar, Lock } from 'lucide-react';
import Header from '../../component/user/Header';
import { findCount } from '../../api/userApi';

interface DashboardStats {
  totalVendors: number;
  totalAuditoriums: number;
  totalUsers: number;
  totalAmount: number;
  totalEnquiries: number;
  totalVouchers: number;
  totalBookings: number;
}

interface RecentActivity {
  id: string;
  type: string;
  name: string;
  date: string;
}

const dummyRecentActivity: RecentActivity[] = [
  { id: '1', type: 'Auditorium Added', name: 'Grand Hall', date: '2025-09-14' },
  { id: '2', type: 'User Registered', name: 'John Doe', date: '2025-09-13' },
  { id: '3', type: 'Vendor Updated', name: 'Elite Events', date: '2025-09-12' },
];

const fallbackStats: DashboardStats = {
  totalVendors: 5,
  totalAuditoriums: 6,
  totalUsers: 1,
  totalAmount: 0,
  totalEnquiries: 0,
  totalVouchers: 0,
  totalBookings: 0,
};

const AdminDashboard: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats>(fallbackStats);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const userRole = currentUser?.role?.toLowerCase() || '';

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await findCount();
      console.log('API Response:', response);
      const backendData = response.data?.data || {};
      const dashboardStats: DashboardStats = {
        totalUsers: Number(backendData.totalUsers) || 0,
        totalVendors: Number(backendData.totalVendors) || 0,
        totalAuditoriums: Number(backendData.totalAuditorium) || 0,
        totalAmount: Number(backendData.totalAmount) || 0,
        totalEnquiries: Number(backendData.totalEnquiries) || 0,
        totalVouchers: Number(backendData.totalVouchers) || 0,
        totalBookings: Number(backendData.totalBookings) || 0,
      };
      setStats(dashboardStats);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching dashboard stats';
      console.error('API error:', error);
      setError(errorMessage);
      toast.error(errorMessage);
      setStats(fallbackStats);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Define navigation items with access control
  const navItems = [
    { path: '/admin/allaudilist', label: 'All Auditoriums', icon: Building, count: stats.totalAuditoriums || 0, roles: ['superadmin', 'venuemanager'] },
    { path: '/admin/allusers', label: 'All Users', icon: Users, count: stats.totalUsers || 0, roles: ['superadmin'] },
    { path: '/admin/allvendors', label: 'All Vendors', icon: Users, count: stats.totalVendors || 0, roles: ['superadmin', 'vendormanager'] },
    { path: '/admin/allauditoriumbookings', label: 'All Auditorium Bookings', icon: Calendar, count: stats.totalBookings || 0, roles: ['superadmin', 'venuemanager'] },
    { path: '/admin/enquiries', label: 'All Enquiries', icon: Mail, count: stats.totalEnquiries || 0, roles: ['superadmin', 'vendormanager'] },
    { path: '/admin/finances', label: 'Total Amount', icon: DollarSign, count: stats.totalAmount ? `₹${stats.totalAmount.toLocaleString()}` : '₹0', roles: ['superadmin'] },
    { path: '/admin/allvouchers', label: 'All Vouchers', icon: Ticket, count: stats.totalVouchers || 0, roles: ['superadmin'] },
    { path: '/admin/adminstaff', label: 'Staff', icon: Users, count: 0, roles: ['superadmin'] },
    { path: '/admin/items', label: 'Others', icon: Home, count: 0, roles: ['superadmin'] },
    { path: '/admin/subscriptionmanagement', label: 'Subscription', icon: Home, count: 0, roles: ['superadmin'] },
  ];

  const hasAccess = (allowedRoles: string[]) => {
    return allowedRoles.includes('superadmin') && userRole === 'superadmin' ||
           allowedRoles.includes(userRole);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#78533F] font-serif mb-8 text-center sm:text-left">
            {userRole === 'superadmin' ? 'Super Admin' : userRole === 'venuemanager' ? 'Venue Manager' : 'Vendor Manager'} Dashboard
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-[#78533F] font-serif text-lg">Loading dashboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-[#ED695A] font-serif text-lg">{error}</p>
              <p className="text-sm text-gray-600 mt-2">Showing fallback data</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const canAccess = userRole === 'superadmin' || item.roles.includes(userRole);
                const isRestricted = !canAccess;

                return (
                  <button
                    key={item.path}
                    onClick={() => canAccess && navigate(item.path)}
                    disabled={isRestricted}
                    className={`
                      relative bg-white p-6 rounded-xl shadow-md border 
                      ${isRestricted 
                        ? 'border-gray-300 opacity-70 cursor-not-allowed hover:bg-white' 
                        : 'border-[#b09d94] hover:bg-[#FDF8F1] cursor-pointer'
                      } 
                      transition-all duration-200 text-left flex flex-col justify-between
                      min-h-[120px]
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Icon size={28} className={isRestricted ? 'text-gray-400' : 'text-[#ED695A]'} />
                        <div>
                          <h3 className={`font-semibold font-serif text-sm sm:text-base ${isRestricted ? 'text-gray-500' : 'text-[#78533F]'}`}>
                            {item.label}
                          </h3>
                          <p className={`text-xl sm:text-2xl font-bold mt-2 ${isRestricted ? 'text-gray-400' : 'text-[#ED695A]'}`}>
                            {item.count}
                          </p>
                        </div>
                      </div>
                      {isRestricted && (
                        <Lock size={20} className="text-gray-400 absolute top-3 right-3" />
                      )}
                    </div>
                    {isRestricted && (
                      <p className="text-xs text-gray-500 mt-3 font-medium">Access Restricted</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;