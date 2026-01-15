"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type React from "react";
import { JSX } from "react/jsx-runtime";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchAuditoriumUserdetails } from "../../api/userApi";
import { toast } from "react-toastify";

interface MenuItem {
  title: string;
  path: string;
  icon: JSX.Element;
  restrictedForStaff?: boolean;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>("/dashboard");
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
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h4v4H4V6zM14 6h4v4h-4V6zM4 16h4v4H4v-4zM14 16h4v4h-4v-4z" />
        </svg>
      ),
    },
    {
      title: "Bookings",
      path: "/auditorium/bookings",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4v10l8 4 8-4V7z" />
        </svg>
      ),
    },
    {
      title: "Venue",
      path: "/auditorium/venue",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5h7l5 5v11a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "All Bookings",
      path: "/auditorium/invoice",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13m0 0l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0-4a2 2 0 110 4m-8-4a2 2 0 110 4" />
        </svg>
      ),
    },
    {
      title: "Staff",
      path: "/auditorium/staff",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V9a2 2 0 012-2h2a2 2 0 012 2v10H9z" />
        </svg>
      ),
      restrictedForStaff: true,
    },
    // {
    //   title: "Support",
    //   path: "/support",
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m-5.656 5.656L5.636 18.364M12 2.25v2.25m0 13.5v2.25M2.25 12h2.25m13.5 0h2.25" />
    //     </svg>
    //   ),
    // },
  ];

  if (isVerified) {
    menuItems.push({
      title: "Subscription",
      path: "/auditorium/subscription",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      restrictedForStaff: true,
    });
  }

  const handleNavClick = (item: MenuItem) => {
    let errorMsg = "";

    if (item.restrictedForStaff && currentUser?.role === "Staff") {
      errorMsg = "Access restricted. Only admin can manage staff.";
    } else if (!isVerified && item.title === "Staff") {
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
      <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-60 p-2 rounded-lg bg-[#ED695A] text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          inset-y-0 left-0
          transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          transition-transform duration-300 ease-in-out
          w-64 md:w-1/5 lg:w-1/6
          bg-[#FDF8F1]
          min-h-screen
          flex flex-col
          shadow-lg
          z-50
          overflow-y-auto
        `}
      >
        {/* Profile Section */}
        <div className="bg-[#FDF8F1] p-6 flex flex-col items-center rounded-br-3xl">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 overflow-hidden border">
            <img
              src="/api/placeholder/64/64"
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="hidden w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-semibold">
              {auditoriumUser?.auditoriumName?.[0] || "U"}
            </div>
          </div>
          <h3 className="text-[#825F4C] font-semibold text-lg mb-1">
            {auditoriumUser?.auditoriumName || "Auditorium"}
          </h3>
          <p className="text-gray-600 text-sm">{auditoriumUser?.email || currentUser?.email}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isStaffRestricted = currentUser?.role === "Staff" && item.restrictedForStaff;
              const isUnverifiedRestricted = !isVerified && item.title === "Staff";
              const isRestricted = isStaffRestricted || isUnverifiedRestricted;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
                      ${activeItem === item.path
                        ? "bg-[#ED695A] text-white shadow-md"
                        : "text-[#825F4C] hover:bg-gray-100 hover:text-[#2C5F73]"
                      }
                      ${isRestricted
                        ? "cursor-not-allowed opacity-75"
                        : "cursor-pointer"
                      }
                    `}
                    disabled={isRestricted}
                  >
                    <span className={`${activeItem === item.path ? "text-white" : "text-gray-500"}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.title}</span>
                    {isRestricted && (
                      <span className="ml-auto">
                        <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/logout"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            onClick={() => {
              if (window.innerWidth < 768) setIsMobileMenuOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>
    </>
    </>
  );
};

export default Sidebar;
