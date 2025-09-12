import React from 'react';
import { User, Calendar, ShoppingBag, Settings, LogOut, Mail, ChevronRight } from 'lucide-react';
import Header from '../../component/user/Header';

interface UserProfileProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: ""
  }
}) => {
  const menuItems = [
    {
      icon: Calendar,
      label: "My Bookings",
      onClick: () => console.log("Navigate to bookings"),
      color: "text-[#ED695A]"
    },
    {
      icon: ShoppingBag,
      label: "My Orders",
      onClick: () => console.log("Navigate to orders"),
      color: "text-[#ED695A]"
    },
    {
      icon: Settings,
      label: "Change Profile",
      onClick: () => console.log("Navigate to profile settings"),
      color: "text-[#78533F]"
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: () => console.log("Logout user"),
      color: "text-[#ED695A]"
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center px-4 py-6 box-border">
        <Header/>
      <div className="w-full max-w-xs sm:max-w-md bg-white rounded-2xl shadow-2xl border border-[#b09d94] overflow-hidden">
        {/* Profile Header */}
        <div className="bg-white p-4 sm:p-6 border-b border-[#b09d94] flex justify-center">
          <div className="flex items-center space-x-4 max-w-full">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#b09d94] shadow-md"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1519167758481-83f550bb2953";
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#78533F] flex items-center justify-center text-white font-bold text-lg shadow-md font-serif">
                {getInitials(user.name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-[#78533F] truncate text-center font-serif">
                {user.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1 justify-center">
                <Mail className="w-4 h-4 text-[#78533F]" />
                <p className="text-sm text-gray-600 truncate font-serif">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#FDF8F1] transition-colors duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform duration-150`} />
                  <span className="text-[#78533F] font-semibold group-hover:text-[#634331] font-serif">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#b09d94] group-hover:text-[#78533F]" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-white px-4 py-3 border-t border-[#b09d94] text-center">
          <p className="text-xs text-gray-600 font-serif">
            Manage your account and preferences
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;