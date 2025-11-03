"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Header from "../../component/user/Header"
import { loginStart, loginSuccess, loginFailure } from "../../redux/slices/authSlice";
import { AdminStaffLogin } from "../../api/userApi";

interface AdminStaff {
  id: string;
  staffid?: string;
  role: "admin" | "staff";
  email: string;
}

interface LoginFormData {
  staffid: string;
  email: string;
  password: string;
}

interface RootState {
  auth: {
    currentUser: AdminStaff | null;
  };
}

const AdminLogin: React.FC = () => {
  const [loginMode, setLoginMode] = useState<"admin" | "staff">("admin");
  const [formData, setFormData] = useState<LoginFormData>({ staffid: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (loginMode === "staff" && !formData.staffid) {
      toast.error("Staff ID is required");
      return false;
    }
    if (!formData.email) {
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoggingIn(true);

  try {
    dispatch(loginStart());

    const response = await AdminStaffLogin(
      loginMode,                // ✅ first argument: loginMode
      formData.email,           // ✅ second: email
      formData.password,        // ✅ third: password
      formData.staffid || ""    // ✅ fourth: staffid (optional)
    );

    const data = response.data; // ✅ always use response.data for Axios

    if (data.success) {
      dispatch(
        loginSuccess({
          user: {
            id: data.user.id,
            staffid: data.user.staffid,
            role: data.user.role,
            email: data.user.email,
          },
          accessToken: data.accessToken,
        })
      );
      toast.success(data.message);
      navigate("/admin/dashboard");
    } else {
      dispatch(loginFailure());
      toast.error(data.message || "Login failed");
    }

  } catch (error: any) {
    dispatch(loginFailure());
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    setIsLoggingIn(false);
  }
};

  const handleSignup = () => {
    navigate("/admin/signup");
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center px-4 py-6 box-border">
      <Header />
      <div className="w-full max-w-md my-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 text-[#ED695A] hover:text-[#d85c4e] hover:bg-[#ED695A]/10 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-[#78533F] font-serif text-center flex-1">
            {loginMode === "admin" ? "Admin Login" : "Staff Login"}
          </h2>
        </div>
        <div className="bg-white shadow-2xl rounded-2xl p-6 border border-[#b09d94]">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setLoginMode("admin")}
              className={`px-4 py-2 font-serif text-sm rounded-full ${
                loginMode === "admin"
                  ? "bg-[#ED695A] text-white"
                  : "bg-gray-200 text-[#78533F] hover:bg-gray-300"
              } transition-all duration-300`}
              disabled={isLoggingIn}
            >
              Admin
            </button>
            <button
              onClick={() => setLoginMode("staff")}
              className={`px-4 py-2 font-serif text-sm rounded-full ${
                loginMode === "staff"
                  ? "bg-[#ED695A] text-white"
                  : "bg-gray-200 text-[#78533F] hover:bg-gray-300"
              } transition-all duration-300`}
              disabled={isLoggingIn}
            >
              Staff
            </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginMode === "staff" && (
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="text"
                    id="staffid"
                    value={formData.staffid}
                    onChange={(e) => handleInputChange("staffid", e.target.value)}
                    placeholder="Enter your staff ID"
                    required
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <User size={16} className="text-[#b09d94]" />
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[#b09d94]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#ED695A] text-white font-semibold py-2 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif flex items-center justify-center"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
            <div className="text-center mt-3">
              <span className="text-sm text-gray-600 font-serif">Don't have an account?</span>
              <button
                type="button"
                onClick={handleSignup}
                className="text-sm text-[#ED695A] ml-1 hover:text-[#78533F] hover:underline font-semibold font-serif"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;