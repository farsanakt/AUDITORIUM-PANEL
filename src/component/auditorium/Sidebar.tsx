"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type React from "react";
import { JSX } from "react/jsx-runtime";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchAuditoriumUserdetails } from "../../api/userApi";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  CalendarRange,
  Building2,
  FileText,
  Users,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Tag
} from "lucide-react";

interface MenuItem {
  title: string;
  path: string;
  icon: JSX.Element;
  restrictedForStaff?: boolean;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>("/auditorium/dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [auditoriumUser, setAuditoriumUser] = useState<any>(null);

  useEffect(() => {
    if (location.pathname) {
      setActiveItem(location.pathname);
    }
  }, [location.pathname]);

  const currentAuditoriumUser = async () => {
    try {
      if (currentUser?.id) {
        const response = await fetchAuditoriumUserdetails(currentUser.id);
        setAuditoriumUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching auditorium user details:", error);
    }
  };

  useEffect(() => {
    currentAuditoriumUser();
  }, [currentUser?.id]);

  const isVerified = auditoriumUser?.isVerified || false;

  let menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      path: "/auditorium/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Bookings",
      path: "/auditorium/bookings",
      icon: <CalendarRange size={20} />,
    },
    {
      title: "Venue & Halls",
      path: "/auditorium/venue",
      icon: <Building2 size={20} />,
    },
    {
      title: "All Bookings",
      path: "/auditorium/invoice",
      icon: <FileText size={20} />,
    },
    {
      title: "Offer",
      path: "/auditorium/offer",
      icon: <Tag size={20} />,
    },
    {
      title: "Staff Management",
      path: "/auditorium/staff",
      icon: <Users size={20} />,
      restrictedForStaff: true,
    },
  ];

  if (isVerified) {
    menuItems.push({
      title: "Subscription",
      path: "/auditorium/subscription",
      icon: <CreditCard size={20} />,
      restrictedForStaff: true,
    });
  }

  const handleNavClick = (item: MenuItem) => {
    let errorMsg = "";

    if (item.restrictedForStaff && currentUser?.role === "Staff") {
      errorMsg = "Access restricted. Only admin can manage staff.";
    } else if (!isVerified && item.title === "Staff Management") {
      errorMsg = "Please verify your account to access this feature.";
    }

    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setActiveItem(item.path);

    if (item.title === "Subscription") {
      navigate(`${item.path}?role=auditoriumside`);
    } else {
      navigate(item.path);
    }

    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-[60] p-2.5 rounded-xl bg-white text-[#78533F] shadow-lg border border-gray-100 active:scale-95 transition-all"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0
          transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
          w-72 md:w-64 lg:w-72
          bg-white min-h-screen
          flex flex-col
          border-r border-gray-100
          shadow-xl md:shadow-none
          z-50 overflow-hidden
        `}
      >
        {/* Profile Section */}
        <div className="relative p-6 pb-8 border-b border-gray-100 bg-gradient-to-b from-[#FFF5F3] to-white">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-md p-1 rotate-3">
                <img
                  src={
                    auditoriumUser?.auditoriumName
                      ? `https://ui-avatars.com/api/?name=${auditoriumUser.auditoriumName}&background=ED695A&color=fff`
                      : "/placeholder.svg"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 border-white ${
                  isVerified ? "bg-green-500" : "bg-amber-400"
                }`}
              >
                {isVerified ? (
                  <ShieldCheck size={12} className="text-white" />
                ) : (
                  <ShieldAlert size={12} className="text-black/60" />
                )}
              </div>
            </div>

            <h3 className="text-[#5B4336] font-bold text-lg text-center mb-1 font-serif">
              {auditoriumUser?.auditoriumName || "Auditorium Panel"}
            </h3>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              {currentUser?.role || "Admin"}
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const isStaffRestricted =
                currentUser?.role === "Staff" && item.restrictedForStaff;
              const isUnverifiedRestricted =
                !isVerified && item.title === "Staff Management";
              const isRestricted = isStaffRestricted || isUnverifiedRestricted;
              const isActive = activeItem.includes(item.path);

              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavClick(item)}
                    disabled={isRestricted}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all
                      ${
                        isActive
                          ? "bg-[#ED695A] text-white"
                          : "text-gray-600 hover:bg-[#FFF5F3] hover:text-[#ED695A]"
                      }
                      ${
                        isRestricted
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      {item.icon}
                      <span className="font-medium text-[15px]">
                        {item.title}
                      </span>
                    </div>
                    {!isRestricted && <ChevronRight size={16} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <Link
            to="/logout"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={18} />
            Logout
          </Link>
          <p className="text-center text-[10px] text-gray-300 mt-3">
            v1.2.0 • Secured Panel
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
