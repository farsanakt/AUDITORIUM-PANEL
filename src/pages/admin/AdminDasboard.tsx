import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { Home, Users, Building, DollarSign, Mail } from 'lucide-react';
import Header from '../../component/user/Header';
import { findCount } from '../../api/userApi';

interface DashboardStats {
  totalVendors: number;
  totalAuditoriums: number;
  totalUsers: number;
  totalAmount: number;
  totalEnquiries: number;
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

// Fallback data in case API fails (for debugging)
const fallbackStats: DashboardStats = {
  totalVendors: 5,
  totalAuditoriums: 6,
  totalUsers: 1,
  totalAmount: 0,
  totalEnquiries: 0,
};

const AdminDashboard: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const fetchDashboardStats = async () => {
    
   
    try {
      setIsLoading(true);
      const response = await findCount();

      const backendData = response.data.data || {};
      const dashboardStats: DashboardStats = {
        totalUsers: backendData.totalUsers || 0,
        totalVendors: backendData.totalVendors || 0,
        totalAuditoriums: backendData.totalAuditorium || 0, 
        totalAmount: backendData.totalAmount || 0,
        totalEnquiries: backendData.totalEnquiries || 0,
      };
      console.log('Mapped stats:', dashboardStats);
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
    console.log('Fetching stats on mount or currentUser change');
    fetchDashboardStats();
  }, []);

  const navItems: { path: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; count: string | number | undefined }[] = [
    { path: '/admin/auditoriums', label: 'All Auditoriums', icon: Building, count: stats?.totalAuditoriums },
    { path: '/admin/users', label: 'All Users', icon: Users, count: stats?.totalUsers },
    { path: '/admin/vendors', label: 'All Vendors', icon: Users, count: stats?.totalVendors },
    { path: '/admin/enquiries', label: 'All Enquiries', icon: Mail, count: stats?.totalEnquiries },
    { path: '/admin/finances', label: 'Total Amount', icon: DollarSign, count: stats?.totalAmount ? `₹${stats.totalAmount.toLocaleString()}` : 0 },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <div className="w-full max-w-6xl mx-auto my-8">
          <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif mb-6">
            Admin Dashboard
          </h2>

          {isLoading ? (
            <p className="text-[#78533F] font-serif text-center">Loading dashboard...</p>
          ) : error ? (
            <p className="text-[#ED695A] font-serif text-center">{error} (Using fallback data)</p>
          ) : (
            <div className="space-y-8">
              {/* Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="bg-white p-6 rounded-xl shadow-md border border-[#b09d94] hover:bg-[#FDF8F1] transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={24} className="text-[#ED695A]" />
                      <div>
                        <h3 className="text-sm font-semibold text-[#78533F] font-serif">{item.label}</h3>
                        <p className="text-xl font-bold text-[#ED695A] mt-1">{item.count || 0}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-[#b09d94]">
                <h3 className="text-sm font-semibold text-[#78533F] font-serif mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {dummyRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between border-b border-[#b09d94] pb-2">
                      <div>
                        <p className="text-sm text-[#78533F] font-medium font-serif">{activity.type}</p>
                        <p className="text-sm text-gray-600">{activity.name}</p>
                      </div>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;