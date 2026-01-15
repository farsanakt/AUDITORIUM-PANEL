import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice";
import { currentVendorUserData } from "../../api/userApi";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [activeItem, setActiveItem] = useState<string>("/vendor/dashboard");
  const [vendorData, setVendorData] = useState<any>(null);

  const getUsernameFromEmail = (email: string | undefined): string => {
    if (!email || !email.includes("@")) return "Guest";
    return email.split("@")[0];
  };

  const currentVendor = async () => {
    try {
      const response = await currentVendorUserData(currentUser?.id as string);
      setVendorData(response.data);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }
  };

  useEffect(() => {
    currentVendor();

    const validPaths = [
      "/vendor/dashboard",
      "/vendor/vendorenquires",
      "/vendor/addvendor",
      "/vendor/vouchers",
      "/vendor/subscription",
      "#",
    ];

    if (validPaths.includes(location.pathname)) {
      setActiveItem(location.pathname);
    } else {
      setActiveItem("/vendor/dashboard");
    }
  }, [location.pathname]);

  const baseMenuItems = [
    { title: "Dashboard", path: "/vendor/dashboard" },
    { title: "Enquires", path: "/vendor/vendorenquires" },
    { title: "Vendor", path: "/vendor/addvendor" },
    { title: "Voucher", path: "/vendor/vouchers" },
    { title: "Settings", path: "#" },
  ];

  const menuItems = vendorData?.isVerified
    ? [
        ...baseMenuItems.slice(0, 4),
        { title: "Subscription", path: "/vendor/subscription" },
        ...baseMenuItems.slice(4),
      ]
    : baseMenuItems;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // ✅ NEW: unified navigation handler
  const handleNavigation = (path: string, title: string) => {
    setActiveItem(path);

    if (title === "Subscription") {
      navigate(`${path}?role=vendorside`);
    } else if (path !== "#") {
      navigate(path);
    }
  };

  return (
    <div className="w-64 h-screen bg-[#FDF8F1] text-[#825F4C] p-5 fixed top-20 shadow-lg flex flex-col z-20">
      {/* User Info */}
      <div className="flex items-center mb-8 border-b border-gray-200 pb-4">
        <FaUserCircle className="w-12 h-12 text-[#825F4C] mr-3" />
        <div>
          <p className="font-semibold text-lg">
            {getUsernameFromEmail(currentUser?.email)}
          </p>
          <span className="text-sm text-[#ED695A]">
            {currentUser?.role || "Vendor"}
          </span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigation(item.path, item.title)}
                className={`
                  w-full text-left px-4 py-2 rounded-xl transition-all duration-200
                  ${
                    activeItem === item.path
                      ? "bg-[#ED695A] text-white shadow-md"
                      : "text-[#825F4C] hover:bg-gray-100 hover:text-[#2C5F73]"
                  }
                `}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="w-full bg-white text-[#825F4C] px-4 py-2 rounded-xl font-medium hover:bg-red-50 hover:text-red-600 transition duration-200 shadow"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
