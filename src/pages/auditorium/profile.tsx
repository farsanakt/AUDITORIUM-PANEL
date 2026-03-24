"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Save, X, Mail, Lock, Loader2, ArrowLeft, ShieldCheck, Image as ImageIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAuditoriumUserdetails, secureUpdate, verifyPswrd } from "../../api/userApi";
import { toast } from "react-toastify";

interface AuditoriumUser {
  _id: string;
  email: string;
  gstNumber?: string;
  phone?: string;
  auditoriumName?: string;
  ownerName?: string;
  address?: string;
  district?: string;
  events?: string[];
  locations?: Array<{ name: string } | string>;
  logo?: string;
  seal?: string;
}

const AuditoriumProfile: React.FC = () => {
  const [userData, setUserData] = useState<AuditoriumUser | null>(null);
  const [editState, setEditState] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingField, setPendingField] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    if (!currentUser?.id) return;

    setIsLoading(true);
    try {
      const response = await fetchAuditoriumUserdetails(currentUser.id);
      let user = null;

      if (response?.data) {
        if (response.data.data) user = response.data.data;
        else if (response.data.user) user = response.data.user;
        else if (response.data._id) user = response.data;
      }

      if (user && user._id) {
        setUserData(user);
        console.log("✅ Profile loaded:", user);
      } else {
        toast.error("Failed to load profile data");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error loading user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [currentUser?.id]);

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-2xl p-8 text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-[#ED695A]" />
          <p className="mt-4 text-[#78533F] font-serif">Loading profile...</p>
        </div>
      </div>
    );
  }

  const requestEditWithPassword = (field: string) => {
    setPendingField(field);
    setPasswordInput("");
    setPasswordError("");
    setShowPasswordModal(true);
  };

  const verifyPasswordAndEnableEdit = async () => {
    if (!pendingField) return;
    try {
      setIsLoading(true);
      const res = await verifyPswrd(currentUser.id, passwordInput);
      if (res.data?.success) {
        setShowPasswordModal(false);
        setEditState(prev => ({ ...prev, [pendingField]: true }));
        setFormData(prev => ({ ...prev, [pendingField]: userData[pendingField as keyof AuditoriumUser] }));
        toast.success("Password verified");
      } else {
        setPasswordError("Incorrect password");
        toast.error("Incorrect password");
      }
    } catch (error) {
      setPasswordError("Verification failed");
      toast.error("Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

 const handleSave = async (field: string) => {
  try {
    setIsLoading(true);

    const res = await secureUpdate(currentUser.id, {
      password: passwordInput,
      [field]: formData[field],
    });

    if (res.data?.success) {
      setUserData(res.data.data);
      setEditState(prev => ({ ...prev, [field]: false }));
      setFormData(prev => ({ ...prev, [field]: undefined }));
      toast.success("Updated successfully!");
    } else {
      toast.error(res.data?.message || "Update failed");
    }

  } catch (error) {
    toast.error("Update failed");
  } finally {
    setIsLoading(false);
  }
};

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const current = formData[field] || userData[field as keyof AuditoriumUser] || [];
    const newArr = [...current];
    if (typeof newArr[index] === "object") newArr[index] = { ...newArr[index], name: value };
    else newArr[index] = value;
    handleInputChange(field, newArr);
  };

  const addArrayItem = (field: string) => {
    const current = formData[field] || userData[field as keyof AuditoriumUser] || [];
    handleInputChange(field, [...current, { name: "" }]);
  };

  const removeArrayItem = (field: string, index: number) => {
    const current = formData[field] || userData[field as keyof AuditoriumUser] || [];
    handleInputChange(field, current.filter((_: any, i: number) => i !== index));
  };

  const renderField = (field: string, label: string, type: "text" | "array" = "text") => {
    const isEditing = editState[field];
    const value = formData[field] !== undefined ? formData[field] : userData[field as keyof AuditoriumUser];

    return (
      <div className="mb-6 bg-white shadow-2xl rounded-2xl p-6 border border-[#b09d94]">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-[#78533F] font-serif">{label}</label>
          {!isEditing && (
            <button
              onClick={() => requestEditWithPassword(field)}
              className="flex items-center gap-2 px-4 py-2 text-[#ED695A] hover:bg-[#ED695A]/10 rounded-full"
            >
              <ShieldCheck size={18} />
              <span className="text-sm font-serif">Edit Securely</span>
            </button>
          )}
        </div>

        {type === "array" ? (
          <div>
            {isEditing ? (
              <div className="space-y-3">
                {(value || []).map((item: any, index: number) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item?.name ?? item ?? ""}
                      onChange={(e) => handleArrayChange(field, index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-[#b09d94] rounded-full focus:ring-2 focus:ring-[#ED695A]"
                    />
                    <button onClick={() => removeArrayItem(field, index)} className="p-3 text-red-500 hover:bg-red-50 rounded-full">
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button onClick={() => addArrayItem(field)} className="text-[#ED695A] text-sm font-serif mt-2 hover:underline">
                  + Add {label.slice(0, -1)}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(value || []).length === 0 ? (
                  <span className="text-gray-500 italic">No {label.toLowerCase()} added</span>
                ) : (
                  (value || []).map((item: any, i:any) => (
                    <span key={i} className="px-4 py-1.5 bg-[#ED695A]/10 text-[#ED695A] rounded-full text-sm">
                      {item?.name || item}
                    </span>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {isEditing ? (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full px-4 py-3 border border-[#b09d94] rounded-full focus:ring-2 focus:ring-[#ED695A]"
              />
            ) : (
              <span className="text-[#78533F] font-serif text-lg">{value || "Not provided"}</span>
            )}
          </div>
        )}

        {isEditing && (
          <div className="flex gap-3 mt-6">
            <button onClick={() => handleSave(field)} disabled={isLoading} className="flex-1 bg-[#ED695A] text-white py-3 rounded-full hover:bg-[#d85c4e] flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save
            </button>
            <button onClick={() => { setEditState(p => ({...p, [field]: false})); setFormData(p => ({...p, [field]: undefined})); }}
              className="flex-1 bg-gray-200 text-[#78533F] py-3 rounded-full hover:bg-gray-300">
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderImageField = (field: "logo" | "seal", label: string) => {
    const url = userData[field];
    return (
      <div className="mb-6 bg-white shadow-2xl rounded-2xl p-6 border border-[#b09d94]">
        <label className="text-sm font-medium text-[#78533F] font-serif block mb-3">{label}</label>
        {url ? (
          <img src={url} alt={label} className="max-h-48 rounded-lg border border-gray-200" />
        ) : (
          <div className="flex items-center gap-3 text-gray-500">
            <ImageIcon size={24} />
            <span>No {label.toLowerCase()} uploaded</span>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">To change {label.toLowerCase()}, contact admin</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate("/auditorium/dashboard")} className="p-3 text-[#ED695A]">
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-3xl font-bold text-[#78533F] font-serif flex-1 text-center">Auditorium Profile</h1>
        </div>

        {/* Email */}
        <div className="mb-6 bg-white shadow-2xl rounded-2xl p-6 border border-[#b09d94]">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[#78533F]">Email Address</label>
            <button onClick={() => { setNewEmailInput(userData.email); setShowEmailModal(true); }} className="flex items-center gap-1 text-[#ED695A]">
              <Edit2 size={18} /> Change Email
            </button>
          </div>
          <p className="text-lg text-[#78533F] mt-1">{userData.email}</p>
        </div>

        {/* Text & Array Fields */}
        {renderField("auditoriumName", "Auditorium Name")}
        {renderField("ownerName", "Owner Name")}
        {renderField("gstNumber", "GST Number")}
        {renderField("phone", "Phone Number")}
        {renderField("address", "Address")}
        {renderField("district", "District")}
        {renderField("events", "Events", "array")}
        {renderField("locations", "Locations", "array")}

        {/* Image Fields */}
        {renderImageField("logo", "Logo")}
        {renderImageField("seal", "Seal")}

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
              <h2 className="text-2xl font-bold text-[#78533F]">Verify Password</h2>
              <p className="text-gray-600 my-4">Enter your current password to edit</p>
              <div className="relative mb-6">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-12 py-3 border border-[#b09d94] rounded-2xl focus:ring-2 focus:ring-[#ED695A]"
                  placeholder="Password"
                />
              </div>
              {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
              <div className="flex gap-4">
                <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 bg-gray-200 rounded-2xl">Cancel</button>
                <button onClick={verifyPasswordAndEnableEdit} disabled={!passwordInput} className="flex-1 py-3 bg-[#ED695A] text-white rounded-2xl">
                  Verify
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