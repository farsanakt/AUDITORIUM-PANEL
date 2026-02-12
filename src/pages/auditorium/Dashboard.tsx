import { useEffect, useState, useMemo, useRef } from "react";
import Header from "../../component/user/Header";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { existingAllVenues, existingUserSubscription, fetchAuditoriumUserdetails, upComingEvents } from "../../api/userApi";
import { X, Calendar, DollarSign, Users, Award, Clock, MapPin, ChevronRight, TrendingUp, Info } from "lucide-react";

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

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const hasFetchedSubscriptions = useRef(false);

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
        const response = await upComingEvents(currentUser.id);
        if (response.data && Array.isArray(response.data.events)) {
          setUpcomingEvents(response.data.events);
        } else {
          setUpcomingEvents([]);
        }
      }
    } catch (error) {
      setUpcomingEvents([]);
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
      .map((event, index) => ({
        id: event._id || `fallback-${index}`,
        name: event.eventName || event.name || event.venueName || `Event ${index + 1}`,
        client: event.userEmail || event.clientEmail || event.client || "Unknown Client",
        date: formatDate(event.bookeddate || event.eventDate || event.date),
        status: event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : "Unknown",
        venueId: event.venueId || event.venue_id || null,
        rawDate: event.bookeddate || event.eventDate || event.date,
        timeSlot: event.timeSlot || "N/A",
        totalAmount: event.totalAmount || "N/A",
        paidAmount: event.paidAmount || "N/A",
        balanceAmount: event.balanceAmount || "N/A",
        address: event.address || "N/A",
        bookingType: event.userReferenceId ? "Offline Booking" : "Online Payment",
        eventType: event.eventType || "N/A",
      }))
      .sort((a, b) => new Date(a.rawDate || 0).getTime() - new Date(b.rawDate || 0).getTime());
  };

  const currentVenueData = useMemo(() => {
    const filteredEvents = getFilteredEvents();
    return {
      name: selectedVenue === "All Venues" ? "All Venues" : venues.find((v) => v._id === selectedVenue)?.name || "Unknown Venue",
      totalBookings: 0, // In a real app, this should be calculated or fetched
      earnings: { monthly: 0, yearly: 0 },
      upcomingEvents: filteredEvents,
    };
  }, [selectedVenue, upcomingEvents, venues]);

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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 p-4 py-8 w-full max-w-7xl mx-auto sm:px-6 lg:px-8 animate-fade-in-up">
          
          {/* Top Section: Welcome & Subscription */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-3"> {/* Added flex for logo and title */}
                {logo && <img src={logo} alt="Logo" className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm" />} {/* Conditionally render logo */}
                <h2 className="text-3xl font-bold text-[#78533F] tracking-tight font-serif">
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
              <p className="text-gray-600 text-lg pt-2 max-w-2xl">
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
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center space-x-2 text-[#78533F] font-medium mb-3 sm:mb-0">
                <span className="bg-[#78533F] bg-opacity-10 p-2 rounded-lg"><Calendar className="w-5 h-5 text-[#78533F]" /></span>
                <span>Dashboard Overview</span>
             </div>
             
             <div className="flex items-center space-x-3 w-full sm:w-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Total Bookings */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-50 group">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Bookings</h3>
                    <div className="mt-1 flex items-baseline space-x-2">
                       <span className="text-3xl font-bold text-gray-900">{currentVenueData.totalBookings}</span>
                       <span className="text-green-600 text-xs font-medium flex items-center bg-green-50 px-1.5 py-0.5 rounded-full">
                          <TrendingUp className="w-3 h-3 mr-1" /> +12%
                       </span>
                    </div>
                 </div>
                 <div className="p-3 bg-[#ED695A] bg-opacity-10 rounded-xl group-hover:bg-opacity-20 transition-colors">
                    <Calendar className="w-6 h-6 text-[#ED695A]" />
                 </div>
              </div>
              <p className="text-xs text-gray-400">vs previous month</p>
            </div>

            {/* Monthly Earnings */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-50 group">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Monthly Earnings</h3>
                    <div className="mt-1 flex items-baseline space-x-2">
                       <span className="text-3xl font-bold text-gray-900">₹{currentVenueData.earnings.monthly.toLocaleString()}</span>
                       <span className="text-green-600 text-xs font-medium flex items-center bg-green-50 px-1.5 py-0.5 rounded-full">
                          <TrendingUp className="w-3 h-3 mr-1" /> +8.5%
                       </span>
                    </div>
                 </div>
                 <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <DollarSign className="w-6 h-6 text-blue-500" />
                 </div>
              </div>
              <p className="text-xs text-gray-400">vs previous month</p>
            </div>

            {/* Yearly Revenue */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-50 group">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Yearly Revenue</h3>
                    <div className="mt-1 flex items-baseline space-x-2">
                       <span className="text-3xl font-bold text-gray-900">₹{currentVenueData.earnings.yearly.toLocaleString()}</span>
                       <span className="text-green-600 text-xs font-medium flex items-center bg-green-50 px-1.5 py-0.5 rounded-full">
                          <TrendingUp className="w-3 h-3 mr-1" /> +21%
                       </span>
                    </div>
                 </div>
                 <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                    <DollarSign className="w-6 h-6 text-purple-500" />
                 </div>
              </div>
              <p className="text-xs text-gray-400">vs previous year</p>
            </div>

            {/* Upcoming Events Counter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-50 group">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Upcoming Events</h3>
                    <div className="mt-1 flex items-baseline space-x-2">
                       <span className="text-3xl font-bold text-gray-900">{currentVenueData.upcomingEvents.length}</span>
                    </div>
                 </div>
                 <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                    <Users className="w-6 h-6 text-amber-500" />
                 </div>
              </div>
              <p className="text-xs text-gray-400">{selectedVenue === 'All Venues' ? 'Across all venues' : 'For this venue'}</p>
            </div>
          </div>

          {/* Events List Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                <h3 className="font-bold text-lg text-[#78533F]">Upcoming Bookings</h3>
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
                     className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                   >
                     <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#ED695A]/10 flex items-center justify-center text-[#ED695A] shrink-0 group-hover:scale-105 transition-transform">
                           <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="font-semibold text-gray-900 group-hover:text-[#ED695A] transition-colors">{event.name}</h4>
                           <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                             <Clock className="w-3 h-3" /> {event.date} • {event.timeSlot}
                           </p>
                           <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2"> {/* Added client/user details */}
                             <Users className="w-3 h-3" /> Client: {event.client}
                           </p>
                           <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                             <Award className="w-3 h-3" /> Type: {event.eventType}
                           </p>
                           {selectedVenue === "All Venues" && event.venueId && (
                             <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                               <MapPin className="w-3 h-3" />
                               {venues.find((v) => v._id === event.venueId)?.name || "Unknown Venue"}
                             </p>
                           )}
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                        <div className="text-right">
                           <p className="text-sm font-bold text-gray-900">₹{event.totalAmount}</p>
                           <p className="text-xs text-gray-500">Total Amount</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                          ${event.bookingType === 'Online Payment' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                        `}>
                          {event.bookingType}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                          ${event.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-700' : 
                            event.status.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700' :
                            event.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}
                        `}>
                          {event.status}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#ED695A] transition-colors" />
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="py-12 flex flex-col items-center justify-center text-center">
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
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                 <div className="bg-[#78533F] p-6 text-white relative">
                    <button 
                      onClick={closeModal}
                      className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                    <h3 className="text-2xl font-bold font-serif">{selectedEvent.name}</h3>
                    <p className="opacity-90 mt-1 flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" /> {selectedEvent.date}
                    </p>
                 </div>
                 
                 <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                       <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-600 text-sm">Client Name</span>
                          <span className="font-medium text-gray-900 text-sm">{selectedEvent.client.replace("@gmail.com", "")}</span>
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
                       <div>
                          <span className="font-bold block mb-1">Venue Location</span>
                          {selectedEvent.address}
                       </div>
                    </div>
                    
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