import React, { useEffect, useState } from 'react';
import { Calendar, ShoppingBag, Settings, LogOut, Mail, ChevronRight } from 'lucide-react';
import Header from '../../component/user/Header';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { userDetails } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

const UserProfile: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  const findUserDetails = async () => {
    if (currentUser?.email) {
      try {
        const response = await userDetails(currentUser.email);
        console.log(response.data, 'fa');
        if (response.data) {
          setUserData({
            name: response.data.firstName,
            email: response.data.email,
            avatar: response.data.avatar || '',
          });
        } else {
          console.error('Failed to fetch user details:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  };

  useEffect(() => {
    findUserDetails();
  }, [currentUser]);

  const menuItems = [
    {
      icon: Calendar,
      label: 'My Bookings',
      description: 'View requests, confirmations & payments',
      onClick: () => navigate(`/userbookings?email=${encodeURIComponent(userData?.email || '')}`),
      iconBg: 'bg-[#ED695A]/10 border-[#ED695A]/20',
      iconColor: 'text-[#ED695A]',
    },
    {
      icon: ShoppingBag,
      label: 'My Orders',
      description: 'Track your vendor orders',
      onClick: () => console.log('Navigate to orders'),
      iconBg: 'bg-[#9c7c5d]/10 border-[#9c7c5d]/20',
      iconColor: 'text-[#9c7c5d]',
    },
    {
      icon: Settings,
      label: 'Change Profile',
      description: 'Update your personal details',
      onClick: () => console.log('Navigate to profile settings'),
      iconBg: 'bg-[#78533F]/10 border-[#78533F]/20',
      iconColor: 'text-[#78533F]',
    },
    {
      icon: LogOut,
      label: 'Logout',
      description: 'Sign out of your account',
      onClick: () => console.log('Logout user'),
      iconBg: 'bg-red-50 border-red-100',
      iconColor: 'text-red-500',
      danger: true,
    },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#FDF8F1]">
        <Header />
        <div className="flex items-center justify-center py-24 px-4">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[#b09d94] px-10 py-8 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-[#ED695A]/20 border-t-[#ED695A] animate-spin mx-auto mb-4"></div>
            <p className="text-[#78533F] font-serif">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1]">
      <Header />

      <div className="px-3 sm:px-6 py-6 sm:py-12 flex justify-center">
        <div className="w-full max-w-md">

          {/* Page heading */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#78533F] font-serif tracking-tight">My Profile</h2>
            <p className="text-sm sm:text-base text-gray-500 font-serif mt-1">
              Manage your account and preferences
            </p>
            <div className="w-16 h-1 bg-[#ED695A] rounded-full mx-auto mt-3"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#b09d94] overflow-hidden">

            {/* Profile banner */}
            <div className="bg-[#78533F] pt-8 pb-14 px-6 relative">
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle at 20% 30%, #e6d0b5 0, transparent 45%), radial-gradient(circle at 80% 70%, #ED695A 0, transparent 45%)',
                }}
              ></div>
            </div>

            {/* Avatar overlapping the banner */}
            <div className="relative -mt-12 flex flex-col items-center px-4 sm:px-6 pb-5 border-b border-[#b09d94]/40">
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white ring-2 ring-[#b09d94] shadow-lg bg-white"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb2953';
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#ED695A] border-4 border-white ring-2 ring-[#b09d94] shadow-lg flex items-center justify-center text-white font-bold text-2xl font-serif">
                  {getInitials(userData.name)}
                </div>
              )}
              <h3 className="text-lg sm:text-xl font-bold text-[#78533F] font-serif mt-3 text-center break-words max-w-full">
                {userData.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 max-w-full">
                <Mail className="w-3.5 h-3.5 text-[#9c7c5d] shrink-0" />
                <p className="text-xs sm:text-sm text-gray-500 font-serif truncate">{userData.email}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 px-2 sm:px-3">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl transition-all duration-300 group ${
                      item.danger ? 'hover:bg-red-50' : 'hover:bg-[#FDF8F1]'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ${item.iconBg}`}>
                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <div className="text-left min-w-0">
                        <p className={`font-semibold font-serif text-sm sm:text-base ${item.danger ? 'text-red-500 group-hover:text-red-600' : 'text-[#78533F] group-hover:text-[#634331]'}`}>
                          {item.label}
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-400 font-serif truncate">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-all duration-200 group-hover:translate-x-0.5 ${item.danger ? 'text-red-300 group-hover:text-red-500' : 'text-[#b09d94] group-hover:text-[#78533F]'}`} />
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="bg-[#FDF8F1] px-4 py-3 border-t border-[#b09d94]/40 text-center">
              <p className="text-[11px] sm:text-xs text-gray-500 font-serif">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;