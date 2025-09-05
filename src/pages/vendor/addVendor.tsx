import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Trash,
  Edit,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Upload,
  ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { addVendorAPI, existingAllVendors } from "../../api/userApi";
import Header from "../../component/user/Header";
import VendorSidebar from "../../component/user/VendorSidebar";

// Define interfaces
interface TimeSlot {
  id: string;
  label: string;
  startTime?: string;
  endTime?: string;
}

interface Vendor {
  _id: string;
  name: string;
  address: string;
  phone: string;
  altPhone?: string;
  pincode: string;
  email: string;
  cities: string[];
  cancellationPolicy: string;
  totalAmount: number;
  advanceAmount: number;
  images: string[];
  timeSlots: TimeSlot[];
  vendorType: string;
}

interface RootState {
  auth: {
    currentUser: {
      id: string;
    };
  };
}

// Mock API functions (replace with actual implementations)
const deleteVendorAPI = async (id: string) => ({ success: true });

const updateVendorAPI = async (formData: FormData, id: string) => ({
  data: { success: true, message: "Vendor updated successfully" },
});

const availableCities = [
  "Trivandrum",
  "Kollam",
  "Kochi",
  "Kozhikode",
  "Thrissur",
  "Alappuzha",
];

const fixedTimeSlots: TimeSlot[] = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
];

const vendorTypes = ["Caterer", "Decorator", "Photographer", "Event Planner"];

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: "",
    address: "",
    phone: "",
    altPhone: "",
    email: "",
    pincode: "",
    cities: [],
    cancellationPolicy: "",
    totalAmount: 0,
    advanceAmount: 0,
    images: [],
    timeSlots: [],
    vendorType: "",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [editImages, setEditImages] = useState<File[]>([]);

  const { currentUser } = useSelector((state: RootState) => state.auth);

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await existingAllVendors(currentUser.id);
        setVendors(response.data);
      } catch (error) {
        toast.error("Failed to load vendors.");
      }
    };
    fetchVendors();
  }, [currentUser.id]);

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleVendorExpand = (id: string) => {
    setExpandedVendor(expandedVendor === id ? null : id);
  };

  const selectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setEditImages([]);
    setIsEditModalOpen(true);
  };

  const deleteVendor = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      html: `Do you want to delete <b>${name}</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteVendorAPI(id);
        setVendors(vendors.filter((vendor) => vendor._id !== id));
        if (selectedVendor?._id === id) setSelectedVendor(null);
        toast.success(`Vendor "${name}" deleted successfully!`);
      } catch (error) {
        toast.error("Failed to delete vendor.");
      }
    }
  };

  const resetAddModal = () => {
    setNewVendor({
      name: "",
      address: "",
      phone: "",
      altPhone: "",
      email: "",
      pincode: "",
      cities: [],
      cancellationPolicy: "",
      totalAmount: 0,
      advanceAmount: 0,
      images: [],
      timeSlots: [],
      vendorType: "",
    });
    setSelectedImages([]);
    setIsAddModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    isNewVendor = false
  ) => {
    const { name, value } = e.target;
    const updateState = (prev: Partial<Vendor>): Partial<Vendor> => ({
      ...prev,
      [name]: name === "totalAmount" || name === "advanceAmount" ? Number(value) : value,
    });

    if (isNewVendor) {
      setNewVendor((prev) => updateState(prev));
    } else if (selectedVendor) {
      setSelectedVendor((prev) => (prev ? updateState(prev) : null));
    }
  };

  const handleCityToggle = (city: string) => {
    setNewVendor((prev) => ({
      ...prev,
      cities: prev.cities?.includes(city)
        ? prev.cities.filter((c) => c !== city)
        : [...(prev.cities || []), city],
    }));
  };

  const handleTimeSlotToggle = (timeSlot: TimeSlot) => {
    setNewVendor((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots?.some((s) => s.id === timeSlot.id)
        ? prev.timeSlots.filter((s) => s.id !== timeSlot.id)
        : [...(prev.timeSlots || []), { ...timeSlot, startTime: "", endTime: "" }],
    }));
  };

  const updateAddTimeSlot = (index: number, field: "startTime" | "endTime", value: string) => {
    setNewVendor((prev) => {
      const newSlots = [...(prev.timeSlots || [])];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return { ...prev, timeSlots: newSlots };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files].slice(0, 4));
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEditImages((prev) => [...prev, ...files].slice(0, 4 - (selectedVendor?.images.length || 0)));
  };

  const removeExistingImage = (index: number) => {
    if (selectedVendor) {
      setSelectedVendor({
        ...selectedVendor,
        images: selectedVendor.images.filter((_, i) => i !== index),
      });
    }
  };

  const handleAddVendor = async () => {
    if (!validateForm(newVendor, selectedImages)) return;

    try {
      const formData = new FormData();
      formData.append("name", newVendor.name || "");
      formData.append("address", newVendor.address || "");
      formData.append("phone", newVendor.phone || "");
      formData.append("altPhone", newVendor.altPhone || "");
      formData.append("email", newVendor.email || "");
      formData.append("pincode", newVendor.pincode || "");
      formData.append("cancellationPolicy", newVendor.cancellationPolicy || "");
      formData.append("totalAmount", String(newVendor.totalAmount || 0));
      formData.append("advanceAmount", String(newVendor.advanceAmount || 0));
      formData.append("cities", JSON.stringify(newVendor.cities || []));
      formData.append("timeSlots", JSON.stringify(newVendor.timeSlots || []));
      formData.append("vendorType", newVendor.vendorType || "");
      formData.append("userId", currentUser.id);

      selectedImages.forEach((file) => formData.append("images", file));

      const response = await addVendorAPI(formData);
      if (response.data.success) {
        toast.success(response.data.success || "Vendor added successfully!");
        resetAddModal();
        const updatedVendors = await existingAllVendors(currentUser.id);
        setVendors(updatedVendors.data);
      } else {
        toast.error("Failed to add vendor.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleUpdateVendor = async () => {
    if (!selectedVendor || !validateForm(selectedVendor, editImages)) return;

    try {
      const formData = new FormData();
      Object.entries(selectedVendor).forEach(([key, value]) => {
        if (key !== "_id" && key !== "images") {
          formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        }
      });
      formData.append("userId", currentUser.id);

      editImages.forEach((file) => formData.append("images", file));
      selectedVendor.images.forEach((image, index) => {
        formData.append(`existingImages[${index}]`, image);
      });

      const response = await updateVendorAPI(formData, selectedVendor._id);
      if (response.data.success) {
        toast.success(response.data.message);
        setVendors(
          vendors.map((vendor) =>
            vendor._id === selectedVendor._id
              ? { ...selectedVendor, images: [...selectedVendor.images, ...editImages.map((file) => URL.createObjectURL(file))] }
              : vendor
          )
        );
        setIsEditModalOpen(false);
        setSelectedVendor(null);
        setEditImages([]);
      } else {
        toast.error("Failed to update vendor.");
      }
    } catch (error) {
      toast.error("Something went wrong while updating vendor.");
    }
  };

  const validateForm = (vendor: Partial<Vendor>, images: File[]) => {
    if (!vendor.name) {
      toast.error("Vendor name is required.");
      return false;
    }
    if (!vendor.address) {
      toast.error("Address is required.");
      return false;
    }
    if (!vendor.phone || !/^\d{10}$/.test(vendor.phone)) {
      toast.error("Valid phone number is required.");
      return false;
    }
    if (!vendor.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendor.email)) {
      toast.error("Valid email is required.");
      return false;
    }
    if (!vendor.pincode || !/^\d{6}$/.test(vendor.pincode)) {
      toast.error("Valid 6-digit pincode is required.");
      return false;
    }
    if (!vendor.cities?.length) {
      toast.error("At least one city must be selected.");
      return false;
    }
    if (!vendor.cancellationPolicy) {
      toast.error("Cancellation policy is required.");
      return false;
    }
    if (!vendor.totalAmount || vendor.totalAmount <= 0) {
      toast.error("Valid total amount is required.");
      return false;
    }
    if (!vendor.advanceAmount || vendor.advanceAmount <= 0 || vendor.advanceAmount > (vendor.totalAmount || 0)) {
      toast.error("Valid advance amount (less than total) is required.");
      return false;
    }
    if (!vendor.timeSlots?.length) {
      toast.error("At least one time slot must be selected.");
      return false;
    }
    for (const slot of vendor.timeSlots) {
      if (!slot.startTime || !slot.endTime) {
        toast.error("Start and end times are required for all selected time slots.");
        return false;
      }
      if (slot.startTime >= slot.endTime) {
        toast.error("Start time must be before end time for all time slots.");
        return false;
      }
    }
    if (!vendor.vendorType) {
      toast.error("Vendor type is required.");
      return false;
    }
    if (images.length + (vendor.images?.length || 0) !== 4) {
      toast.error("Exactly 4 images are required.");
      return false;
    }
    return true;
  };

  const handleCityToggleEdit = (city: string) => {
    if (selectedVendor) {
      setSelectedVendor({
        ...selectedVendor,
        cities: selectedVendor.cities.includes(city)
          ? selectedVendor.cities.filter((c) => c !== city)
          : [...selectedVendor.cities, city],
      });
    }
  };

  const handleTimeSlotToggleEdit = (timeSlot: TimeSlot) => {
    if (selectedVendor) {
      setSelectedVendor({
        ...selectedVendor,
        timeSlots: selectedVendor.timeSlots.some((s) => s.id === timeSlot.id)
          ? selectedVendor.timeSlots.filter((s) => s.id !== timeSlot.id)
          : [...selectedVendor.timeSlots, { ...timeSlot, startTime: "", endTime: "" }],
      });
    }
  };

  const updateEditTimeSlot = (index: number, field: "startTime" | "endTime", value: string) => {
    if (selectedVendor) {
      setSelectedVendor((prev) => {
        if (!prev) return null;
        const newSlots = [...prev.timeSlots];
        newSlots[index] = { ...newSlots[index], [field]: value };
        return { ...prev, timeSlots: newSlots };
      });
    }
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <style jsx global>{`
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>

      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <VendorSidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:ml-64">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#825F4C]">Products({filteredVendors.length})</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2 bg-[#ED695A] text-white rounded-lg flex items-center justify-center hover:bg-[#D65A4C] transition-all text-sm"
              >
                <Plus size={16} className="mr-2" /> Add New Vendor
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search vendors..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          {/* Vendors List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            {filteredVendors.length === 0 ? (
              <div className="py-12 text-center">
                <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No vendors found</p>
              </div>
            ) : (
              filteredVendors.map((vendor) => (
                <div key={vendor._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div
                      className="flex items-center cursor-pointer flex-1 min-w-0"
                      onClick={() => toggleVendorExpand(vendor._id)}
                    >
                      <div className="mr-3 flex-shrink-0">
                        {expandedVendor === vendor._id ? (
                          <ChevronDown size={16} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex mr-4 flex-shrink-0">
                        {vendor.images.map((image, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm -ml-2 first:ml-0"
                          >
                            <img src={image} alt={`${vendor.name} ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg text-[#825F4C] truncate">{vendor.name}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin size={12} className="mr-1 flex-shrink-0" />
                          <span className="text-sm truncate">{vendor.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="px-3 py-1 bg-[#ED695A]/10 text-[#ED695A] rounded-full text-xs font-medium">
                        {vendor.vendorType}
                      </span>
                      <button
                        onClick={() => selectVendor(vendor)}
                        className="p-2 hover:bg-[#ED695A]/10 rounded-lg text-[#ED695A]"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteVendor(vendor._id, vendor.name)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                  {expandedVendor === vendor._id && (
                    <div className="mt-4 pl-8 border-l-2 border-[#ED695A]/20">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#825F4C]">Contact</p>
                          <p className="text-sm text-gray-600">{vendor.phone}</p>
                          {vendor.altPhone && <p className="text-sm text-gray-600">{vendor.altPhone}</p>}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#825F4C]">Email</p>
                          <p className="text-sm text-gray-600">{vendor.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#825F4C]">Cities</p>
                          <p className="text-sm text-gray-600">{vendor.cities.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#825F4C]">Time Slots</p>
                          <p className="text-sm text-gray-600">
                            {vendor.timeSlots.map((s) => `${s.label} (${s.startTime} - ${s.endTime})`).join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#825F4C]">Add New Vendor</h2>
                <button onClick={resetAddModal} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-custom px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Vendor Name *</label>
                  <input
                    name="name"
                    value={newVendor.name || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter vendor name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Vendor Type *</label>
                  <select
                    name="vendorType"
                    value={newVendor.vendorType || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    required
                  >
                    <option value="" disabled>Select Vendor Type</option>
                    {vendorTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Address *</label>
                  <textarea
                    name="address"
                    value={newVendor.address || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm resize-none"
                    placeholder="Enter address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Phone Number *</label>
                  <input
                    name="phone"
                    value={newVendor.phone || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Alternative Phone</label>
                  <input
                    name="altPhone"
                    value={newVendor.altPhone || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter alternative phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={newVendor.email || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Pincode *</label>
                  <input
                    name="pincode"
                    value={newVendor.pincode || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter pincode"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Cities *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50 scrollbar-custom">
                    {availableCities.map((city) => (
                      <label key={city} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newVendor.cities?.includes(city) || false}
                          onChange={() => handleCityToggle(city)}
                          className="h-4 w-4 rounded text-[#ED695A] focus:ring-[#ED695A]"
                        />
                        <span className="text-sm text-[#825F4C]">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Cancellation Policy *</label>
                  <input
                    name="cancellationPolicy"
                    value={newVendor.cancellationPolicy || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter cancellation policy"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Total Amount *</label>
                  <input
                    name="totalAmount"
                    type="number"
                    value={newVendor.totalAmount || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter total amount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Advance Amount *</label>
                  <input
                    name="advanceAmount"
                    type="number"
                    value={newVendor.advanceAmount || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                    placeholder="Enter advance amount"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Time Slots *</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {fixedTimeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleTimeSlotToggle(slot)}
                        className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          newVendor.timeSlots?.some((s) => s.id === slot.id)
                            ? "border-[#ED695A] bg-[#ED695A]/10 text-[#ED695A]"
                            : "border-gray-200 hover:border-gray-300 text-[#825F4C]"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                  {newVendor.timeSlots?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-[#825F4C] mb-2">Set Times for Selected Slots *</p>
                      {newVendor.timeSlots.map((slot, index) => (
                        <div key={slot.id} className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="w-24 text-sm text-[#825F4C]">{slot.label}</span>
                          <input
                            type="time"
                            value={slot.startTime || ""}
                            onChange={(e) => updateAddTimeSlot(index, "startTime", e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                            required
                          />
                          <span className="text-sm text-[#825F4C]">to</span>
                          <input
                            type="time"
                            value={slot.endTime || ""}
                            onChange={(e) => updateAddTimeSlot(index, "endTime", e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Vendor Images (exactly 4) *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#ED695A] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-600 text-sm">Click to upload images or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                    </label>
                  </div>
                  {selectedImages.length !== 4 && (
                    <p className="text-sm text-red-500 mt-2">Exactly 4 images are required.</p>
                  )}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview-${index}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={resetAddModal}
                  className="px-4 py-2 border border-gray-300 text-[#825F4C] rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVendor}
                  disabled={
                    !newVendor.name ||
                    !newVendor.address ||
                    !newVendor.phone ||
                    !newVendor.email ||
                    !newVendor.pincode ||
                    !newVendor.cities?.length ||
                    !newVendor.cancellationPolicy ||
                    !newVendor.totalAmount ||
                    !newVendor.advanceAmount ||
                    !newVendor.timeSlots?.length ||
                    !newVendor.vendorType ||
                    selectedImages.length !== 4 ||
                    newVendor.timeSlots?.some((slot) => !slot.startTime || !slot.endTime)
                  }
                  className="px-4 py-2 bg-[#ED695A] text-white rounded-lg hover:bg-[#D65A4C] disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {isEditModalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#825F4C]">Edit Vendor: {selectedVendor.name}</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-custom px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Vendor Name</label>
                  <input
                    name="name"
                    value={selectedVendor.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Vendor Type</label>
                  <select
                    name="vendorType"
                    value={selectedVendor.vendorType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  >
                    <option value="" disabled>Select Vendor Type</option>
                    {vendorTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Address</label>
                  <textarea
                    name="address"
                    value={selectedVendor.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Phone Number</label>
                  <input
                    name="phone"
                    value={selectedVendor.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Alternative Phone</label>
                  <input
                    name="altPhone"
                    value={selectedVendor.altPhone || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={selectedVendor.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Pincode</label>
                  <input
                    name="pincode"
                    value={selectedVendor.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Cities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50 scrollbar-custom">
                    {availableCities.map((city) => (
                      <label key={city} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedVendor.cities.includes(city)}
                          onChange={() => handleCityToggleEdit(city)}
                          className="h-4 w-4 rounded text-[#ED695A] focus:ring-[#ED695A]"
                        />
                        <span className="text-sm text-[#825F4C]">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Cancellation Policy</label>
                  <input
                    name="cancellationPolicy"
                    value={selectedVendor.cancellationPolicy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Total Amount</label>
                  <input
                    name="totalAmount"
                    type="number"
                    value={selectedVendor.totalAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Advance Amount</label>
                  <input
                    name="advanceAmount"
                    type="number"
                    value={selectedVendor.advanceAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Time Slots</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {fixedTimeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleTimeSlotToggleEdit(slot)}
                        className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedVendor.timeSlots.some((s) => s.id === slot.id)
                            ? "border-[#ED695A] bg-[#ED695A]/10 text-[#ED695A]"
                            : "border-gray-200 hover:border-gray-300 text-[#825F4C]"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                  {selectedVendor.timeSlots.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-[#825F4C] mb-2">Set Times for Selected Slots</p>
                      {selectedVendor.timeSlots.map((slot, index) => (
                        <div key={slot.id} className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="w-24 text-sm text-[#825F4C]">{slot.label}</span>
                          <input
                            type="time"
                            value={slot.startTime || ""}
                            onChange={(e) => updateEditTimeSlot(index, "startTime", e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                          />
                          <span className="text-sm text-[#825F4C]">to</span>
                          <input
                            type="time"
                            value={slot.endTime || ""}
                            onChange={(e) => updateEditTimeSlot(index, "endTime", e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A] text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#825F4C] mb-2">Vendor Images (exactly 4)</label>
                  {selectedVendor.images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-[#825F4C] mb-2">Current Images:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedVendor.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                              <img src={image} alt={`vendor-${index}`} className="w-full h-full object-cover" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#ED695A] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEditImageUpload}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label htmlFor="edit-image-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-600 text-sm">Add more images</p>
                    </label>
                  </div>
                  {editImages.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-[#825F4C] mb-2">New Images:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {editImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-200">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`new-${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setEditImages((prev) => prev.filter((_, i) => i !== index))}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {(selectedVendor.images.length + editImages.length) !== 4 && (
                    <p className="text-sm text-red-500 mt-2">Exactly 4 images are required.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-[#825F4C] rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateVendor}
                  className="px-4 py-2 bg-[#ED695A] text-white rounded-lg hover:bg-[#D65A4C] text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}