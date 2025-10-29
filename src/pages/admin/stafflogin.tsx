"use client";

import React, { useState } from "react";
import { Mail, Lock, Loader2, ArrowLeft, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";


// Types
interface AdminStaff {
  id: string;
  staffid: string;
  email: string;
  role: "admin";
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

const AdminStaffLogin: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ staffid: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(""); // Clear error on input change
  };

  const handleLogin = async () => {
    try {
      if (!formData.staffid || !formData.email || !formData.password) {
        setError("Staff ID, email, and password are required");
        toast.error("Staff ID, email, and password are required");
        return;
      }

      setIsLoading(true);
      const response = await axios.post(
        "/api/adminstaff/login",
        { staffid: formData.staffid, email: formData.email, password: formData.password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const { token, data } = response.data;
        localStorage.setItem("token", token);

        toast.success("Login successful!");
        navigate("/admin/dashboard");
      } else {
        setError(response.data.message || "Login failed");
        toast.error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Error logging in:", error);
      setError(error.response?.data?.message || "Error logging in");
      toast.error(error.response?.data?.message || "Error logging in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-md my-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 text-[#ED695A] hover:text-[#d85c4e] hover:bg-[#ED695A]/10 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#78533F] font-serif text-center flex-1">
            Admin Staff Login
          </h1>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl p-6 border border-[#b09d94]">
          {/* Staff ID Field */}
          <div className="mb-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#b09d94]" />
              <input
                type="text"
                value={formData.staffid}
                onChange={(e) => handleInputChange("staffid", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                placeholder="Enter your staff ID"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#b09d94]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#b09d94]" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 font-serif"
                placeholder="Enter your password"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1 font-serif">{error}</p>}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-1 px-4 py-2 bg-[#ED695A] text-white rounded-full hover:bg-[#d85c4e] font-serif transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStaffLogin;