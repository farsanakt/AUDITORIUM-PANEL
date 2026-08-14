import { useEffect, useState, useMemo, useRef } from "react";
import Header from "../../component/user/Header";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { existingAllVenues, existingUserSubscription, fetchAuditoriumUserdetails, existingBkngs, updateBookingAmount, updateBookingApproval } from "../../api/userApi";
import { X, Calendar, Users, Award, Clock, MapPin, ChevronRight, TrendingUp, Info, Edit3, ClipboardList, Target, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
// Helper Functions
const formatDate = (dateString: string) => {
  if (!dateString) return "Unknown Date";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown Date";
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "Unknown Date";
  }
};
const isTodayOrFuture = (dateString: string) => {
  if (!dateString) return false;
  try {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  } catch (error) {
    return false;
  }
};
// ✅ Fallback: if backend doesn't send approvalStatus, derive it from status
const deriveApproval = (event: any): 'requested' | 'accepted' | 'rejected' => {
  if (event.approvalStatus) return event.approvalStatus;
  const s = (event.status || "").toLowerCase();
  if (s === "confirmed") return "accepted";
  if (s === "cancelled") return "rejected";
  return "requested";
};
const DashboardOverview = () => {
  const [activeSection, setActiveSection] = useState<string>("upcoming");
  const [selectedVenue, setSelectedVenue] = useState<string>("All Venues");
  const [venues, setVenues] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [auditoriumName, setAuditoriumName] = useState<string>("");
  const [logo, setLogo] = useState<string>(""); // Added state for logo
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [editedAmount, setEditedAmount] = useState<string>("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [showStatsTooltip, setShowStatsTooltip] = useState<boolean>(false); // ✅ tap support on mobile
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null); // ✅ toast
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'accepted' | 'rejected' } | null>(null); // ✅ confirm modal
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const hasFetchedSubscriptions = useRef(false);
  const navigate = useNavigate();
  // ✅ Toast helper
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  // API Calls
  const fetchAllVenues = async () => {
    try {
      if (currentUser) {
        const response = await existingAllVenues(currentUser.id);
        if (response.data) {
          setVenues(response.data);
          if (response.data.length === 1) {
            setSelectedVenue(response.data[0]._id);
          }
        }
      }
    } catch (error) {}
  };
  const fetchAllUserSubscriptions = async () => {
    if (hasFetchedSubscriptions.current) return;
    hasFetchedSubscriptions.current = true;
    try {
      const response = await existingUserSubscription();
      setSubscriptions(response.data?.data || []);
    } catch (error) {
      setSubscriptions([]);
    }
  };
  const fetchUserData = async (): Promise<void> => {
    try {
      const response = await fetchAuditoriumUserdetails(currentUser?.id);
      if (response.data) {
        setAuditoriumName(response.data.auditoriumName || "");
        setIsVerified(response.data.isVerified);
        setLogo(response.data.logo || ""); // Assuming 'logo' field exists in response.data
      }
    } catch (error) {}
  };
  const fetchAllUpcomingEvents = async () => {
    try {
      if (currentUser) {
        // ✅ Fetch ALL bookings of every venue (any status) instead of upComingEvents,
        // which was dropping accepted/rejected bookings
        const venueRes = await existingAllVenues(currentUser.id);
        const venueList: any[] = venueRes.data || [];
        const results = await Promise.all(
          venueList.map((v: any) =>
            existingBkngs(v._id)
              .then((r) => {
                const d = r.data;
                return Array.isArray(d) ? d : d ? [d] : [];
              })
              .catch(() => [])
          )
        );
        const merged = results.flat();
        const unique = Array.from(new Map(merged.map((b: any) => [b._id, b])).values());
        setUpcomingEvents(unique);
      }
    } catch (error) {
      setUpcomingEvents([]);
    }
  };
  const handleUpdateAmount = async () => {
    if (!selectedEvent || !editedAmount || editedAmount === selectedEvent.totalAmount) return;
    try {
      await updateBookingAmount(selectedEvent.id, { totalAmount: parseFloat(editedAmount) });
      await fetchAllUpcomingEvents(); // Refetch to update the list
      setShowModal(false);
      setSelectedEvent(null);
      setEditedAmount("");
      showToast("Booking amount updated successfully", "success"); // ✅
    } catch (error) {
      console.error("Failed to update booking amount:", error);
      showToast("Failed to update booking amount", "error"); // ✅
    }
  };
  // ✅ Step 1: open confirm modal
  const handleApproval = (bookingId: string, action: 'accepted' | 'rejected') => {
    if (!currentUser) return;
    setConfirmAction({ id: bookingId, action });
  };
  // ✅ Step 2: execute after confirmation — stores who did the action (current user)
  const confirmApproval = async () => {
    if (!confirmAction || !currentUser) return;
    const { id, action } = confirmAction;
    setConfirmAction(null);
    try {
      setActionLoadingId(id);
      const actionBy = (currentUser as any).name || currentUser.email || currentUser.id;
      await updateBookingApproval(id, action, actionBy);
      await fetchAllUpcomingEvents();
      if (selectedEvent && selectedEvent.id === id) {
        setShowModal(false);
        setSelectedEvent(null);
      }
      showToast(action === 'accepted' ? "Booking accepted successfully 🎉" : "Booking rejected", "success");
    } catch (error) {
      console.error(`Error updating booking to ${action}:`, error);
      showToast("Failed to update the booking request. Please try again.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };
  useEffect(() => {
    fetchUserData();
    fetchAllVenues();
    fetchAllUpcomingEvents();
    fetchAllUserSubscriptions();
  }, [currentUser]);
  // Derived Data
  const allVenues = [
    ...(venues.length > 1 ? [{ id: "All Venues", name: "All Venues" }] : []),
    ...venues.map((venue) => ({ id: venue._id, name: venue.name })),
  ];
  const getFilteredEvents = () => {
    const rawEvents = selectedVenue === "All Venues"
      ? upcomingEvents
      : upcomingEvents.filter(e => (e.venueId || e.venue_id) === selectedVenue);
    return rawEvents
      .filter((event) => {
        const eventDate = event.bookeddate || event.eventDate || event.date;
        return isTodayOrFuture(eventDate);
      })
      .map((event, index) => {
        const venueId = event.venueId || event.venue_id;
        const venue = venues.find(v => v._id === venueId);
        return {
          id: event._id || `fallback-${index}`,
          name: event.eventName || event.name || event.venueName || `Event ${index + 1}`,
          client: event.userEmail || event.clientEmail || event.client || "Unknown Client",
          date: formatDate(event.bookeddate || event.eventDate || event.date),
          status: event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : "Unknown",
          venueId: venueId,
          rawDate: event.bookeddate || event.eventDate || event.date,
          timeSlot: event.timeSlot || "N/A",
          totalAmount: event.totalAmount || "N/A",
          paidAmount: event.paidAmount || "N/A",
          balanceAmount: event.balanceAmount || "N/A",
          address: event.address || "N/A",
          bookingType: event.userReferenceId ? "Offline Booking" : "Online Payment",
          eventType: event.eventType || "N/A",
          isPriceNegotiationNeeded: venue?.isPriceNegotiationNeeded || false,
          approvalStatus: deriveApproval(event), // ✅ works even if backend misses the field
          actionBy: event.actionBy || "",
        };
      })
      .sort((a, b) => new Date(a.rawDate || 0).getTime() - new Date(b.rawDate || 0).getTime());
  };
  // ✅ Booking status counts for the Total Bookings tooltip (with fallback derivation)
  const bookingStats = useMemo(() => {
    const relevant = selectedVenue === "All Venues"
      ? upcomingEvents
      : upcomingEvents.filter(e => (e.venueId || e.venue_id) === selectedVenue);
    const statusOf = (e: any) => (e.status || "").toLowerCase();
    return {
      total: relevant.length,
      requested: relevant.filter(e => deriveApproval(e) === "requested").length,
      accepted: relevant.filter(e => deriveApproval(e) === "accepted").length,
      rejected: relevant.filter(e => deriveApproval(e) === "rejected").length,
      pending: relevant.filter(e => statusOf(e) === "pending").length,
      confirmed: relevant.filter(e => statusOf(e) === "confirmed").length,
      cancelled: relevant.filter(e => statusOf(e) === "cancelled").length,
      completed: relevant.filter(e => statusOf(e) === "completed").length,
    };
  }, [upcomingEvents, selectedVenue]);
  const currentVenueData = useMemo(() => {
    const filteredEvents = getFilteredEvents();
    return {
      name: selectedVenue === "All Venues" ? "All Venues" : venues.find((v) => v._id === selectedVenue)?.name || "Unknown Venue",
      totalBookings: bookingStats.total,
      upcomingEvents: filteredEvents,
    };
  }, [selectedVenue, upcomingEvents, venues, bookingStats]);
  const eventsToDisplay = showAllEvents ? currentVenueData.upcomingEvents : currentVenueData.upcomingEvents.slice(0, 4);
  const hasMoreEvents = currentVenueData.upcomingEvents.length > 4;
  useEffect(() => {
    setShowAllEvents(false);
  }, [selectedVenue]);
  const currentUserSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => sub.user?.email === currentUser?.email);
  }, [subscriptions, currentUser]);
  const calculateDaysLeft = (endDate: string) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setEditedAmount(event.totalAmount?.toString() || "");
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setEditedAmount("");
  };
  const isEditable = selectedEvent && selectedEvent.isPriceNegotiationNeeded && selectedEvent.bookingType === "Online Payment" && 
    (selectedEvent.paidAmount !== "N/A" && parseFloat(selectedEvent.paidAmount) > 0) && 
    (selectedEvent.balanceAmount !== "N/A" && parseFloat(selectedEvent.balanceAmount) > 0);
  const shouldShowEditButton = (event: any) => {
    return event.isPriceNegotiationNeeded && event.bookingType === "Online Payment" && 
      (event.paidAmount !== "N/A" && parseFloat(event.paidAmount) > 0) && 
      (event.balanceAmount !== "N/A" && parseFloat(event.balanceAmount) > 0);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      {/* ✅ Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
          {toast.message}
        </div>
      )}
      {/* ✅ Confirm modal (replaces window.confirm) */}
      {confirmAction && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmAction(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${confirmAction.action === 'accepted' ? 'bg-green-100' : 'bg-red-100'}`}>
              <AlertTriangle className={`w-7 h-7 ${confirmAction.action === 'accepted' ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {confirmAction.action === 'accepted' ? 'Accept Booking Request?' : 'Reject Booking Request?'}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {confirmAction.action === 'accepted'
                ? 'This will confirm the booking and notify the user by email.'
                : 'This will cancel the request and notify the user by email.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmApproval}
                className={`flex-1 py-2.5 text-white font-semibold rounded-xl transition-colors text-sm ${confirmAction.action === 'accepted' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                Yes, {confirmAction.action === 'accepted' ? 'Accept' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-1">
        <main className="flex-1 p-4 py-6 sm:py-8 w-full max-w-7xl mx-auto sm:px-6 lg:px-8 animate-fade-in-up">
         
          {/* Top Section: Welcome & Subscription */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-3"> {/* Added flex for logo and title */}
                {logo && <img src={logo} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200 shadow-sm" />} {/* Conditionally render logo */}
                <h2 className="text-2xl sm:text-3xl font-bold text-[#78533F] tracking-tight font-serif">
                  Welcome, <span className="text-[#ED695A]">{auditoriumName || "Auditorium"}</span>
                </h2>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${isVerified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {isVerified ? (
                  <><Award className="w-3 h-3 mr-1" /> Verified Auditorium</>
                ) : (
                  <><Info className="w-3 h-3 mr-1" /> Not Verified</>
                )}
              </div>
              <p className="text-gray-600 text-base sm:text-lg pt-2 max-w-2xl">
                Here's what's happening with your venues today. manage your bookings and track your performance.
              </p>
            </div>
           
            {/* Subscription Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h3 className="text-[#78533F] text-sm font-semibold uppercase tracking-wider">Subscription Status</h3>
                <Award className="w-5 h-5 text-[#ED695A]" />
              </div>
              {currentUserSubscriptions.length > 0 ? (
                <div className="space-y-3">
                  {currentUserSubscriptions.map((sub, index) => {
                    const daysLeft = calculateDaysLeft(sub.subscriptionDates.endDate);
                    return (
                      <div key={sub._id || index} className="text-sm">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-medium text-gray-900">{sub.subscription.planName || "Standard Plan"}</span>
                           <span className={`px-2 py-0.5 rounded text-xs font-medium ${sub.subscriptionDates.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                             {sub.subscriptionDates.status || "N/A"}
                           </span>
                        </div>
                        <div className="text-gray-500 text-xs flex justify-between mt-2">
                          <span>Expires: {formatDate(sub.subscriptionDates.endDate)}</span>
                          <span className={`${daysLeft < 5 ? 'text-red-600 font-bold' : 'text-[#ED695A] font-medium'}`}>
                            {daysLeft} days left
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-2 text-gray-500 text-sm">No active subscriptions</div>
              )}
            </div>
          </div>
          {/* Filtering & Venue Selection */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 sm:mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-3">
             <div className="flex items-center space-x-2 text-[#78533F] font-medium">
                <span className="bg-[#78533F] bg-opacity-10 p-2 rounded-lg"><Calendar className="w-5 h-5 text-[#78533F]" /></span>
                <span>Dashboard Overview</span>
             </div>
            
             <div className="flex flex-col xs:flex-row sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <label htmlFor="venue-select" className="text-sm font-medium text-gray-600 whitespace-nowrap">
                   Select Venue:
                </label>
                <div className="relative w-full sm:w-64">
                   <select
                     id="venue-select"
                     value={selectedVenue}
                     onChange={(e) => setSelectedVenue(e.target.value)}
                     className="block w-full px-4 py-2.5 pr-8 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED695A]/20 focus:border-[#ED695A] transition-all cursor-pointer appearance-none"
                   >
                     {allVenues.map((venue) => (
                       <option key={venue.id} value={venue.id}>{venue.name}</option>
                     ))}
                   </select>
                   <ChevronRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>
             </div>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {/* Total Bookings — hover (desktop) or tap (mobile) shows status counts tooltip */}
            <div
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-50 group relative cursor-pointer"
              onClick={() => setShowStatsTooltip(!showStatsTooltip)}
              onMouseLeave={() => setShowStatsTooltip(false)}
            >
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Bookings</h3>
                    <div className="mt-1 flex items-baseline space-x-2">
                       <span className="text-2xl sm:text-3xl font-bold text-gray-900">{currentVenueData.totalBookings}</span>
                       <span className="text-green-600 text-xs font-medium flex items-center bg-green-50 px-1.5 py-0.5 rounded-full">
                          <TrendingUp className="w-3 h-3 mr-1" /> +12%
                       </span>
                    </div>
                 </div>
                 <div className="p-3 bg-[#ED695A] bg-opacity-10 rounded-xl group-hover:bg-opacity-20 transition-colors">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#ED695A]" />
                 </div>
              </div>
              <p className="text-xs text-gray-400">Tap or hover for status breakdown</p>
              {/* ✅ Tooltip with booking status counts — group-hover on desktop, tap-toggle on mobile */}
              <div className={`${showStatsTooltip ? 'block' : 'hidden'} group-hover:block absolute z-30 top-full left-1/2 -translate-x-1/2 mt-2 w-56 max-w-[90vw] bg-white rounded-xl shadow-xl border border-gray-100 p-4`}>
                 <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                 <p className="text-xs font-semibold text-[#78533F] uppercase tracking-wider mb-2">Booking Breakdown</p>
                 <div className="space-y-1.5 text-xs text-gray-700">
                    <div className="flex justify-between"><span>Total</span><span className="font-bold">{bookingStats.total}</span></div>
                    <div className="flex justify-between"><span className="text-orange-500">Requested (Waiting)</span><span className="font-bold text-orange-500">{bookingStats.requested}</span></div>
                    <div className="flex justify-between"><span className="text-green-600">Accepted</span><span className="font-bold text-green-600">{bookingStats.accepted}</span></div>
                    <div className="flex justify-between"><span className="text-red-600">Rejected</span><span className="font-bold text-red-600">{bookingStats.rejected}</span></div>
                    <div className="flex justify-between"><span className="text-amber-600">Pending</span><span className="font-bold text-amber-600">{bookingStats.pending}</span></div>
                    <div className="flex justify-between"><span className="text-green-700">Confirmed</span><span className="font-bold text-green-700">{bookingStats.confirmed}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Cancelled</span><span className="font-bold text-gray-500">{bookingStats.cancelled}</span></div>
                    <div className="flex justify-between"><span className="text-blue-600">Completed</span><span className="font-bold text-blue-600">{bookingStats.completed}</span></div>
                 </div>
              </div>
            </div>
            {/* ✅ Booking Management (replaces Monthly Earnings) — redirects to invoice panel */}
            <div
              onClick={() => navigate("/auditorium/invoice")} // ⚠️ adjust to your invoice panel route
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-50 group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Booking Management</h3>
                    <div className="mt-1 flex items-baseline space-x-2">
                       <span className="text-2xl sm:text-3xl font-bold text-gray-900">{bookingStats.requested}</span>
                       <span className="text-orange-500 text-xs font-medium bg-orange-50 px-1.5 py-0.5 rounded-full">
                          Waiting
                       </span>
                    </div>
                 </div>
                 <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                 </div>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                Manage requests <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </div>
            {/* ✅ Lead Management (replaces Yearly Revenue) */}
            <div
              onClick={() => navigate("/auditorium/leads")} // ⚠️ adjust to your leads page route (or remove onClick)
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-50 group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Lead Management</h3>
                    <div className="mt-1 flex items-baseline space-x-2">
                       <span className="text-2xl sm:text-3xl font-bold text-gray-900">{bookingStats.requested + bookingStats.pending}</span>
                       <span className="text-purple-600 text-xs font-medium bg-purple-50 px-1.5 py-0.5 rounded-full">
                          Active Leads
                       </span>
                    </div>
                 </div>
                 <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                 </div>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                Track your leads <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </div>
            {/* Upcoming Events Counter */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-50 group">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Upcoming Events</h3>
                    <div className="mt-1 flex items-baseline space-x-2">
                       <span className="text-2xl sm:text-3xl font-bold text-gray-900">{currentVenueData.upcomingEvents.length}</span>
                    </div>
                 </div>
                 <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                 </div>
              </div>
              <p className="text-xs text-gray-400">{selectedVenue === 'All Venues' ? 'Across all venues' : 'For this venue'}</p>
            </div>
          </div>
          {/* Events List Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                <h3 className="font-bold text-base sm:text-lg text-[#78533F]">Upcoming Bookings</h3>
                <button
                  onClick={() => setShowAllEvents(!showAllEvents)}
                  className="text-sm text-[#ED695A] hover:text-[#c45346] font-medium transition-colors"
                >
                  {showAllEvents ? 'Show Less' : 'View All'}
                </button>
             </div>
             <div className="divide-y divide-gray-100">
               {eventsToDisplay.length > 0 ? (
                 eventsToDisplay.map((event) => (
                   <div
                     key={event.id}
                     onClick={() => handleEventClick(event)}
                     className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer group flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                   >
                     <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#ED695A]/10 flex items-center justify-center text-[#ED695A] shrink-0 group-hover:scale-105 transition-transform">
                           <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0">
                           <h4 className="font-semibold text-gray-900 group-hover:text-[#ED695A] transition-colors truncate">{event.name}</h4>
                           <p className="text-xs sm:text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                             <Clock className="w-3 h-3 shrink-0" /> {event.date} • {event.timeSlot}
                           </p>
                           <p className="text-xs sm:text-sm text-gray-500 mt-0.5 flex items-center gap-2 break-all"> {/* Added client/user details */}
                             <Users className="w-3 h-3 shrink-0" /> Client: {event.client}
                           </p>
                           <p className="text-xs sm:text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                             <Award className="w-3 h-3 shrink-0" /> Type: {event.eventType}
                           </p>
                           {selectedVenue === "All Venues" && event.venueId && (
                             <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                               <MapPin className="w-3 h-3 shrink-0" />
                               {venues.find((v) => v._id === event.venueId)?.name || "Unknown Venue"}
                             </p>
                           )}
                        </div>
                     </div>
                    
                     <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-4 w-full lg:w-auto mt-2 lg:mt-0 flex-wrap">
                        <div className="text-left lg:text-right">
                           <p className="text-sm font-bold text-gray-900">₹{event.totalAmount}</p>
                           <p className="text-xs text-gray-500">Total Amount</p>
                        </div>
                        <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold
                          ${event.bookingType === 'Online Payment' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                        `}>
                          {event.bookingType}
                        </span>
                        <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold capitalize
                          ${event.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-700' :
                            event.status.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700' :
                            event.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}
                        `}>
                          {event.status}
                        </span>
                        {/* ✅ Accept / Reject for requested bookings, badge + actionBy after action */}
                        {event.approvalStatus === 'requested' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproval(event.id, 'accepted');
                              }}
                              disabled={actionLoadingId === event.id}
                              className="flex items-center gap-1 bg-green-500 text-white px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-green-600 text-[10px] sm:text-xs font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle className="w-3 h-3" />
                              {actionLoadingId === event.id ? '...' : 'Accept'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproval(event.id, 'rejected');
                              }}
                              disabled={actionLoadingId === event.id}
                              className="flex items-center gap-1 bg-red-500 text-white px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-red-600 text-[10px] sm:text-xs font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <XCircle className="w-3 h-3" />
                              {actionLoadingId === event.id ? '...' : 'Reject'}
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${event.approvalStatus === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {event.approvalStatus === 'accepted' ? 'Accepted' : 'Rejected'}
                            </span>
                            {event.actionBy && (
                              <span className="text-[10px] text-gray-500 mt-1">by {event.actionBy}</span>
                            )}
                          </div>
                        )}
                        {shouldShowEditButton(event) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                            className="p-1 text-blue-500 hover:text-blue-700 transition-colors rounded-full hover:bg-blue-50"
                            title="Edit Amount"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#ED695A] transition-colors hidden sm:block" />
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                       <Calendar className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Upcoming Events</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mt-1">There are no events scheduled for the selected venue/period.</p>
                 </div>
               )}
             </div>
            
             {hasMoreEvents && (
               <div className="p-4 bg-gray-50/50 text-center border-t border-gray-100">
                  <button
                    onClick={() => setShowAllEvents(!showAllEvents)}
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#ED695A] hover:bg-[#d85849] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED695A] transition-colors shadow-sm hover:shadow"
                  >
                    {showAllEvents ? 'Show Less' : `Show ${currentVenueData.upcomingEvents.length - 4} More Events`}
                  </button>
               </div>
             )}
          </div>
          {/* Event Detail Modal */}
          {showModal && selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
              ></div>
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in-up">
                 <div className="bg-[#78533F] p-5 sm:p-6 text-white relative">
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif pr-10">{selectedEvent.name}</h3>
                    <p className="opacity-90 mt-1 flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" /> {selectedEvent.date}
                    </p>
                 </div>
                
                 <div className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                       <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                          <p className={`font-medium capitalize ${selectedEvent.status === 'Approved' ? 'text-green-600' : 'text-amber-600'}`}>
                            {selectedEvent.status}
                          </p>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 uppercase font-semibold">Time</p>
                          <p className="font-medium text-gray-800">{selectedEvent.timeSlot}</p>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 uppercase font-semibold">Event Type</p>
                          <p className="font-medium text-gray-800">{selectedEvent.eventType}</p>
                       </div>
                       {/* ✅ Request status + who accepted/rejected */}
                       <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 uppercase font-semibold">Request Status</p>
                          <p className={`font-medium capitalize ${
                            selectedEvent.approvalStatus === 'accepted' ? 'text-green-600'
                              : selectedEvent.approvalStatus === 'rejected' ? 'text-red-600'
                              : 'text-orange-500'
                          }`}>
                            {selectedEvent.approvalStatus}
                          </p>
                          {selectedEvent.actionBy && (
                            <p className="text-[10px] text-gray-500 mt-0.5">by {selectedEvent.actionBy}</p>
                          )}
                       </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                       <div className="flex justify-between border-b border-gray-200 pb-2 gap-2">
                          <span className="text-gray-600 text-sm">Client Name</span>
                          <span className="font-medium text-gray-900 text-sm break-all text-right">{selectedEvent.client.replace("@gmail.com", "")}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-600 text-sm">Total</span>
                          <span className="font-bold text-[#78533F] text-sm">₹{selectedEvent.totalAmount}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-600 text-sm">Paid</span>
                          <span className="font-medium text-green-600 text-sm">₹{selectedEvent.paidAmount}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-gray-600 text-sm">Balance</span>
                          <span className="font-medium text-red-600 text-sm">₹{selectedEvent.balanceAmount}</span>
                       </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-xl text-sm">
                       <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                       <div className="min-w-0 break-words">
                          <span className="font-bold block mb-1">Venue Location</span>
                          {selectedEvent.address}
                       </div>
                    </div>
                   
                    {/* ✅ Accept / Reject inside modal for requested bookings */}
                    {selectedEvent.approvalStatus === 'requested' && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleApproval(selectedEvent.id, 'accepted')}
                          disabled={actionLoadingId === selectedEvent.id}
                          className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleApproval(selectedEvent.id, 'rejected')}
                          disabled={actionLoadingId === selectedEvent.id}
                          className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                   
                    {isEditable && (
                      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 space-y-3">
                        <h4 className="font-semibold text-yellow-800 flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          Edit Total Amount (Price Negotiation)
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="number"
                            value={editedAmount}
                            onChange={(e) => setEditedAmount(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Enter new total amount"
                          />
                          <button
                            onClick={handleUpdateAmount}
                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
                          >
                            Update
                          </button>
                        </div>
                        <p className="text-xs text-yellow-700">Only available for online bookings with price negotiation needed.</p>
                      </div>
                    )}
                   
                    <button
                      onClick={closeModal}
                      className="w-full py-3 bg-[#ED695A] hover:bg-[#d85849] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg mt-2"
                    >
                      Close Details
                    </button>
                 </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default DashboardOverview;