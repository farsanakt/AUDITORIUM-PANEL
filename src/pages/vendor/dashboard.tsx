
import React, { useEffect, useState } from "react";
import Sidebar from "../../component/user/VendorSidebar";
import Header from "../../component/user/Header";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { fetchEnquiries } from "../../api/userApi";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  contact: string;
  eventType: string;
  eventDate: string;
  message: string;
  notification: string;
  vendorId: string;
  vendorUserId: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorEnquiries = async () => {
    if (!currentUser?.id) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      console.log("No currentUser.id found");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Fetching enquiries for vendor ID:", currentUser.id);
      const response = await fetchEnquiries(currentUser.id);
      console.log("fetchEnquiries raw response:", response);
      const enquiryData = Array.isArray(response.data) ? response.data : [];
      console.log("Processed enquiry data:", enquiryData);
      setEnquiries(enquiryData);
    } catch (error: any) {
      console.error("Error fetching enquiries:", error);
      setError("Failed to load enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorEnquiries();
  }, [currentUser?.id]);

  // Calculate stats
  const totalBookings = enquiries.length;
  // Placeholder for financial stats (since totalAmount and balanceAmount are not in API response)
  const totalRevenue = "0.00"; // Replace with actual API call if available
  const totalBalance = "0.00"; // Replace with actual API call if available

  return (
    <div className="flex min-h-screen bg-[#FDF8F1]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-[#825F4C]">Dashboard</h1>
              <span className="text-sm text-[#2C5F73] bg-[#ED695A]/10 px-3 py-1 rounded-full">
                Logged as Vendor
              </span>
            </div>
            <div className="space-x-2">
              <button className="px-3 py-1 bg-white text-[#825F4C] rounded-full hover:bg-gray-100 hover:text-[#2C5F73] shadow">
                This month
              </button>
              <button className="px-3 py-1 bg-white text-[#825F4C] rounded-full hover:bg-gray-100 hover:text-[#2C5F73] shadow">
                This year
              </button>
              <button className="px-3 py-1 bg-white text-[#825F4C] rounded-full hover:bg-gray-100 hover:text-[#2C5F73] shadow">
                Custom
              </button>
            </div>
          </div>

          {/* Total Balance */}
          <div className="text-xl font-semibold text-[#825F4C] mb-4">
            Total balance: <span className="text-[#ED695A]">₹{totalBalance}</span>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2C5F73] text-white p-4 rounded-xl shadow">
              <p className="text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">{totalBookings || 0}</p>
            </div>
            <div className="bg-[#ED695A] text-white p-4 rounded-xl shadow">
              <p className="text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">₹{totalRevenue}</p>
            </div>
            <div className="bg-[#825F4C] text-white p-4 rounded-xl shadow">
              <p className="text-sm">Latest Enquiries</p>
              <p className="text-2xl font-bold">{totalBookings || 0}</p>
            </div>
          </div>

          {/* Latest Enquiries Section */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold text-[#825F4C] mb-4">Latest Enquiries</h2>
            {loading ? (
              <p className="text-sm text-[#825F4C]">Loading enquiries...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : enquiries.length === 0 ? (
              <p className="text-sm text-[#825F4C]">No enquiries found.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {enquiries.map((enquiry) => (
                  <li key={enquiry._id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-[#825F4C]">{enquiry.eventType}</p>
                      <p className="text-sm text-gray-500">{enquiry.name}</p>
                    </div>
                    <span className="text-sm bg-[#ED695A]/10 text-[#2C5F73] px-3 py-1 rounded-full">
                      {new Date(enquiry.eventDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
