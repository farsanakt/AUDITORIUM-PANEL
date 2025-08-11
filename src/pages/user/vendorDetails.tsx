import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../component/user/Header";
import Lines from "../../assets/Group 52 (1).png";
import Bshape from "../../assets/02 2.png";
import { singleVendorDetails } from "../../api/userApi";

interface Vendor {
  _id: string;
  name: string;
  address: string;
  audiUserId: string;
  phone: string;
  advAmnt: string;
  altPhone: string;
  cancellationPolicy: string;
  cities: string[];
  createdAt: string;
  email: string;
  images: string[];
  pincode: string;
  timeSlots: { label: string; startTime: string; endTime: string }[];
  totalamount: string;
  updatedAt: string;
  vendorType: string;
  __v: number;
}

const VendorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // August 2025
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    address: "",
    timeSlot: "",
  });

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const response = await singleVendorDetails(id!);
      setVendor(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching vendor details:", err);
      setError("Failed to load vendor details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVendorDetails();
    }
  }, [id]);

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(direction === 'next' ? prev.getMonth() + 1 : prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleDateClick = (date: number) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking submitted:", { ...formData, selectedDate, vendorName: vendor?.name });
    setIsModalOpen(false);
    setFormData({ email: "", address: "", timeSlot: "" });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !vendor) {
    return <div className="text-center py-8 text-red-600">{error || "No vendor found."}</div>;
  }

  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="bg-[#FDF8F1] min-h-screen">
      <img
        src={Lines}
        alt="Lines"
        className="absolute top-0 left-0 h-full object-cover mt-0 z-0 scale-125 sm:scale-150"
        style={{ maxWidth: "none" }}
      />
      <div className="relative z-10 p-2 sm:p-4">
        <Header />
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
          <div className="mb-2 sm:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-left font-bold text-[#5B4336]">
              {vendor.name}
            </h1>
          </div>
          <div className="flex items-center mb-4 sm:mb-6">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#9c7c5d] mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs sm:text-sm md:text-base text-[#5B4336]">
              {vendor.address}, {vendor.cities.join(", ")} {vendor.pincode}
            </span>
          </div>
          <div className="mb-6 sm:mb-8">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
              <img
                src={
                  vendor.images[currentImageIndex] ||
                  "/placeholder.svg?height=400&width=600"
                }
                alt={`Slide ${currentImageIndex + 1}`}
                className="w-full h-48 sm:h-64 md:h-80 lg:h-[400px] object-cover transition-all duration-700 ease-in-out"
              />
            </div>
            <div className="mt-3 sm:mt-4 flex justify-center items-center gap-2 sm:gap-3 overflow-x-auto px-2 sm:px-4 scrollbar-hide">
              {vendor.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-12 w-16 sm:h-16 sm:w-24 md:h-20 md:w-28 rounded-md overflow-hidden border transition-all duration-200 ${
                    index === currentImageIndex
                      ? "border-[#b09d94] shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start mb-6 sm:mb-8 gap-4 lg:gap-6">
            <div className="flex-1 lg:pr-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#5B4336] mt-4 sm:mt-6 mb-3">
                About {vendor.vendorType.charAt(0).toUpperCase() + vendor.vendorType.slice(1)}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-[#000000] text-left leading-relaxed">
                {vendor.name} is a premier {vendor.vendorType} offering modern amenities and elegant services.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <button className="bg-[#9c7c5d] hover:bg-[#d85c4e] mt-4 sm:mt-6 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors flex items-center space-x-2 w-full lg:w-auto justify-center text-xs sm:text-sm md:text-base">
                <span>Go to Booking</span>
              </button>
            </div>
          </div>
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#49516F] mt-6 sm:mt-8 mb-3 sm:mb-4">
              Contact
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">
                  {vendor.phone}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">
                  {vendor.altPhone}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">
                  {vendor.email}
                </span>
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <img
              src={Bshape}
              alt="Lines"
              className="absolute bottom-0 left-[-40px] sm:left-[-60px] h-[80%] sm:h-[90%] object-cover z-0"
              style={{ maxWidth: "none" }}
            />
            <div className="bg-white border mt-6 border-gray-200 rounded-xl shadow-sm p-3 sm:p-4 md:p-6 text-gray-800 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base">
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">
                    Cancellation Policy
                  </h4>
                  <p className="text-left">{vendor.cancellationPolicy}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">
                    Pricing
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Total Amount: ₹{Number(vendor.totalamount).toLocaleString("en-IN")}</li>
                    <li>Advance Amount: ₹{Number(vendor.advAmnt).toLocaleString("en-IN")}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">
                    Time Slots
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    {vendor.timeSlots.map((slot, index) => (
                      <li key={index}>{slot.label}: {slot.startTime} - {slot.endTime}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 mb-6 sm:mb-8 flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#49516F] mb-3 sm:mb-4">
                  Availability Calendar
                </h3>
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth('prev')} className="text-gray-600 hover:text-gray-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="text-center font-medium text-gray-600 text-base">
                      {monthName} {year}
                    </div>
                    <button onClick={() => changeMonth('next')} className="text-gray-600 hover:text-gray-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    <div className="text-gray-500 font-medium">Sun</div>
                    <div className="text-gray-500 font-medium">Mon</div>
                    <div className="text-gray-500 font-medium">Tue</div>
                    <div className="text-gray-500 font-medium">Wed</div>
                    <div className="text-gray-500 font-medium">Thu</div>
                    <div className="text-gray-500 font-medium">Fri</div>
                    <div className="text-gray-500 font-medium">Sat</div>
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="w-8 h-8"></div>
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(date => (
                      <button
                        key={date}
                        onClick={() => handleDateClick(date)}
                        className="w-8 h-8 mx-auto rounded-full flex items-center justify-center bg-green-200 text-gray-800 hover:bg-green-300"
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-[#5B4336] mb-4">Book {vendor.name}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                <input
                  type="text"
                  value={vendor.name}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Selected Date</label>
                <input
                  type="text"
                  value={`${monthName} ${selectedDate}, ${year}`}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 text-sm"
                >
                  <option value="" disabled>Select a time slot</option>
                  {vendor.timeSlots.map((slot, index) => (
                    <option key={index} value={`${slot.label}: ${slot.startTime} - ${slot.endTime}`}>
                      {slot.label}: {slot.startTime} - {slot.endTime}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <input
                  type="text"
                  value={`₹${Number(vendor.totalamount).toLocaleString("en-IN")}`}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Advance Amount</label>
                <input
                  type="text"
                  value={`₹${Number(vendor.advAmnt).toLocaleString("en-IN")}`}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#9c7c5d] text-white rounded-md text-sm hover:bg-[#d85c4e]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetails;