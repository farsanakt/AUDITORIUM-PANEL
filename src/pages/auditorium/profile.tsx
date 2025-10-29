"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Save, X, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAuditoriumUserdetails, verifyPswrd, updateEmaill, updateProfile } from "../../api/userApi";
import { toast } from "react-toastify";

// Types
interface AuditoriumUser {
  _id?: string;
  email: string;
  password: string;
  role: "user" | "auditorium" | "admin";
  isVerified: boolean;
  isOtp: boolean;
  isBlocked: boolean;
  auditoriumName?: string;
  ownerName?: string;
  address?: string;
  district?: string;
  panchayat?: string;
  corporation?: string;
  municipality?: string;
  phone?: string;
  events?: string[];
  locations?: string[];
}

interface EditState {
  [key: string]: boolean;
}

interface FormData {
  [key: string]: any;
}

interface RootState {
  auth: {
    currentUser: {
      id: string;
      role: string;
      email: string;
    } | null;
  };
}

const AuditoriumProfile: React.FC = () => {
  const [userData, setUserData] = useState<AuditoriumUser | null>(null);
  const [editState, setEditState] = useState<EditState>({});
  const [formData, setFormData] = useState<FormData>({});
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // Email editing states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [newEmailInput, setNewEmailInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      if (!currentUser?.id) return;

      setIsLoading(true);
      const response = await fetchAuditoriumUserdetails(currentUser.id);

      if (response.data.success === false) {
        toast.error(response.data.message || "Error loading user data");
      } else {
        setUserData(response.data);
        // toast.success("Profile data loaded successfully");
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      toast.error(error.response?.data?.message || "Error loading user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center px-4 py-6">
        <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-3xl w-full flex items-center justify-center h-64">
          <div className="text-[#78533F] font-serif">Loading user data...</div>
        </div>
      </div>
    );
  }

  const handleEditToggle = (field: string) => {
    setEditState((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    if (!editState[field]) {
      setFormData((prev) => ({
        ...prev,
        [field]: userData[field as keyof AuditoriumUser],
      }));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const currentArray = formData[field] || userData[field as keyof AuditoriumUser] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const addArrayItem = (field: string) => {
    const currentArray = formData[field] || userData[field as keyof AuditoriumUser] || [];
    const newArray = [...currentArray, ""];
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = formData[field] || userData[field as keyof AuditoriumUser] || [];
    const newArray = currentArray.filter((_: any, i: number) => i !== index);
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const handleSave = async (field: string) => {
    try {
      if (!currentUser?.id) {
        toast.error("User ID not found");
        return;
      }

      setIsLoading(true);
      const response = await updateProfile(currentUser.id, { [field]: formData[field] });

      if (response.data.success) {
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                [field]: formData[field],
              }
            : null
        );

        setEditState((prev) => ({
          ...prev,
          [field]: false,
        }));

        toast.success("Data updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update data");
      }
    } catch (error: any) {
      console.error("Error updating data:", error);
      toast.error(error.response?.data?.message || "Error updating data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailEditClick = () => {
    setShowPasswordModal(true);
    setPasswordInput("");
    setPasswordError("");
  };

  const verifyPassword = async () => {
    try {
      if (!currentUser?.id) {
        toast.error("User ID not found");
        return;
      }

      setIsLoading(true);
      setPasswordError("");

      const response = await verifyPswrd(currentUser.id, passwordInput);

      if (response.data.success) {
        setShowPasswordModal(false);
        setShowEmailModal(true);
        setNewEmailInput(userData?.email || "");
        toast.success("Password verified successfully");
      } else {
        setPasswordError(response.data.message || "Incorrect password");
        toast.error(response.data.message || "Incorrect password");
      }
    } catch (error: any) {
      console.error("Error verifying password:", error);
      setPasswordError(error.response?.data?.message || "Error verifying password");
      toast.error(error.response?.data?.message || "Error verifying password");
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmail = async () => {
    try {
      if (!currentUser?.id) {
        toast.error("User ID not found");
        return;
      }

      setIsLoading(true);
      const response = await updateEmaill(currentUser.id, newEmailInput);

      if (response.data.success) {
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                email: newEmailInput,
              }
            : null
        );

        setShowEmailModal(false);
        toast.success("Email updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update email");
      }
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error(error.response?.data?.message || "Error updating email");
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: string, label: string, type: "text" | "boolean" | "array" = "text") => {
    const isEditing = editState[field];
    const value = formData[field] !== undefined ? formData[field] : userData[field as keyof AuditoriumUser];

    return (
      <div className="mb-4 bg-white shadow-2xl rounded-2xl p-4 border border-[#b09d94]">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-[#78533F] font-serif">{label}</label>
          {field !== "email" && field !== "isOtp" && (
            <button
              onClick={() => handleEditToggle(field)}
              className="p-2 text-[#ED695A] hover:text-[#d85c4e] hover:bg-[#ED695A]/10 rounded-full"
              disabled={isLoading}
            >
              {isEditing ? <X size={16} /> : <Edit2 size={16} />}
            </button>
          )}
        </div>

        {type === "boolean" ? (
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium font-serif ${
                value ? "bg-[#ED695A]/20 text-[#ED695A]" : "bg-gray-100 text-gray-600"
              }`}
            >
              {value ? "Yes" : "No"}
            </span>
            {isEditing && (
              <div className="flex items-center space-x-2">
                <label className="flex items-center text-[#78533F] font-serif">
                  <input
                    type="radio"
                    name={field}
                    checked={formData[field] === true}
                    onChange={() => handleInputChange(field, true)}
                    className="mr-1 text-[#ED695A] border-[#b09d94]"
                  />
                  Yes
                </label>
                <label className="flex items-center text-[#78533F] font-serif">
                  <input
                    type="radio"
                    name={field}
                    checked={formData[field] === false}
                    onChange={() => handleInputChange(field, false)}
                    className="mr-1 text-[#ED695A] border-[#b09d94]"
                  />
                  No
                </label>
              </div>
            )}
          </div>
        ) : type === "array" ? (
          <div>
            {isEditing ? (
              <div>
                {(formData[field] || value || []).map((item: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(field, index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                    />
                    <button
                      onClick={() => removeArrayItem(field, index)}
                      className="p-2 text-[#ED695A] hover:text-[#d85c4e] hover:bg-[#ED695A]/10 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem(field)}
                  className="text-[#ED695A] hover:text-[#d85c4e] hover:underline text-sm font-serif"
                >
                  + Add {label.slice(0, -1)}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(value || []).map((item: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#ED695A]/20 text-[#ED695A] rounded-full text-sm font-serif"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {isEditing ? (
              <input
                type="text"
                value={formData[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
              />
            ) : (
              <span className="text-[#78533F] font-serif">{value || "Not set"}</span>
            )}
          </div>
        )}

        {isEditing && (
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => handleSave(field)}
              disabled={isLoading}
              className="flex items-center space-x-1 px-4 py-1.5 bg-[#ED695A] text-white rounded-full hover:bg-[#d85c4e] font-serif transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleEditToggle(field)}
              className="px-4 py-1.5 bg-gray-300 text-[#78533F] rounded-full hover:bg-gray-400 font-serif"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl my-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/auditorium/dashboard")}
            className="p-2 text-[#ED695A] hover:text-[#d85c4e] hover:bg-[#ED695A]/10 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#78533F] font-serif text-center flex-1">
            Auditorium User Management
          </h1>
        </div>

        {/* Email Field with Special Handling */}
        <div className="mb-4 bg-white shadow-2xl rounded-2xl p-4 border border-[#b09d94]">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[#78533F] font-serif">Email</label>
            <button
              onClick={handleEmailEditClick}
              className="flex items-center space-x-1 p-2 text-[#ED695A] hover:text-[#d85c4e] hover:bg-[#ED695A]/10 rounded-full"
              disabled={isLoading}
            >
              <Edit2 size={16} />
              <span className="hidden sm:inline text-xs font-serif">Edit</span>
            </button>
          </div>
          <span className="text-[#78533F] font-serif">{userData?.email}</span>
        </div>

        {/* Other Fields - No Role Field */}
        {renderField("auditoriumName", "Auditorium Name")}
        {renderField("ownerName", "Owner Name")}
        {renderField("phone", "Phone Number")}
        {renderField("address", "Address")}
        {renderField("district", "District")}
        {renderField("panchayat", "Panchayat")}
        {renderField("corporation", "Corporation")}
        {renderField("municipality", "Municipality")}
        {/* {renderField("isVerified", "Verified Status", "boolean")}
        {renderField("isOtp", "OTP Status", "boolean")}
        {renderField("isBlocked", "Blocked Status", "boolean")}
        {renderField("events", "Events", "array")} */}
        {renderField("locations", "Locations", "array")}

        {/* Password Verification Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
            <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#78533F] mb-3 font-serif">Verify Password</h2>
              <p className="text-gray-600 text-sm mb-3 font-serif">Please enter your current password to change email</p>

              <div className="mb-3">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#b09d94]" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>
                {passwordError && <p className="text-red-500 text-sm mt-1 font-serif">{passwordError}</p>}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-1.5 bg-gray-300 text-[#78533F] rounded-full hover:bg-gray-400 font-serif"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyPassword}
                  disabled={isLoading || !passwordInput}
                  className="px-4 py-1.5 bg-[#ED695A] text-white rounded-full hover:bg-[#d85c4e] font-serif flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Update Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
            <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#78533F] mb-3 font-serif">Update Email</h2>

              <div className="mb-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#b09d94]" />
                  <input
                    type="email"
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                    placeholder="Enter new email"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-1.5 bg-gray-300 text-[#78533F] rounded-full hover:bg-gray-400 font-serif"
                >
                  Cancel
                </button>
                <button
                  onClick={updateEmail}
                  disabled={isLoading || !newEmailInput || newEmailInput === userData?.email}
                  className="px-4 py-1.5 bg-[#ED695A] text-white rounded-full hover:bg-[#d85c4e] font-serif flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Email"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditoriumProfile;