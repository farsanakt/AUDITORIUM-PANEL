import { useEffect, useState, useMemo } from "react";
import Header from "../../component/user/Header";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { existingAllVenues, fetchAuditoriumUserdetails, upComingEvents } from "../../api/userApi";
import { X } from "lucide-react";

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
    console.error("Date formatting error:", error);
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
    console.error("Date comparison error:", error);
    return false;
  }
};

const DashboardOverview = () => {
  const [activeSection, setActiveSection] = useState<string>("upcoming");
  const [selectedVenue, setSelectedVenue] = useState<string>("All Venues");
  const [venues, setVenues] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [auditoriumName, setAuditoriumName] = useState<string>("");
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const { currentUser } = useSelector((state: RootState) => state.auth);

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
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const fetchUserData = async (): Promise<void> => {
    try {
      const response = await fetchAuditoriumUserdetails(currentUser?.id);
      if (response.data) {
        setAuditoriumName(response.data.auditoriumName || "");
        setIsVerified(response.data.isVerified);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchAllUpcomingEvents = async () => {
    try {
      if (currentUser) {
        const response = await upComingEvents(currentUser.id);
        if (response.data && Array.isArray(response.data.events)) {
          setUpcomingEvents(response.data.events);
        } else {
          console.warn("No valid events array in response:", response.data);
          setUpcomingEvents([]);
        }
      }
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      setUpcomingEvents([]);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAllVenues();
    fetchAllUpcomingEvents();
  }, [currentUser]);

  const allVenues = [
    ...(venues.length > 1 ? [{ id: "All Venues", name: "All Venues" }] : []),
    ...venues.map((venue) => ({ id: venue._id, name: venue.name })),
  ];

  const getFilteredEvents = () => {
    if (selectedVenue === "All Venues") {
      const allEvents = upcomingEvents
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
        }))
        .sort((a, b) => new Date(a.rawDate || 0).getTime() - new Date(b.rawDate || 0).getTime());

      return allEvents;
    } else {
      const filteredEvents = upcomingEvents
        .filter((event) => {
          const eventVenueId = event.venueId || event.venue_id;
          const eventDate = event.bookeddate || event.eventDate || event.date;
          return eventVenueId === selectedVenue && isTodayOrFuture(eventDate);
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
        }))
        .sort((a, b) => new Date(a.rawDate || 0).getTime() - new Date(b.rawDate || 0).getTime());

      return filteredEvents;
    }
  };

  // Fixed: Use useMemo to ensure currentVenueData reacts to changes
  const currentVenueData = useMemo(() => {
    const filteredEvents = getFilteredEvents();

    return {
      name:
        selectedVenue === "All Venues"
          ? "All Venues"
          : venues.find((v) => v._id === selectedVenue)?.name || "Unknown Venue",
      totalBookings: 0, // Placeholder - can be updated later
      earnings: { monthly: 0, yearly: 0 }, // Placeholder
      upcomingEvents: filteredEvents,
    };
  }, [selectedVenue, upcomingEvents, venues]);

  const eventsToDisplay = showAllEvents
    ? currentVenueData.upcomingEvents
    : currentVenueData.upcomingEvents.slice(0, 4);

  const hasMoreEvents = currentVenueData.upcomingEvents.length > 4;

  useEffect(() => {
    setShowAllEvents(false);
  }, [selectedVenue]);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 p-4 py-6 w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#78533F] sm:text-3xl">
              Welcome to the Auditorium{" "}
              <br />
              <br />
              <span className="text-3xl bg-[#ED695A] text-white px-1 rounded">
                {auditoriumName.toUpperCase() || "N/A"}
              </span>
            </h2>
            <p className={`text-sm font-medium mt-2 ${isVerified ? 'text-green-600' : 'text-red-600'}`}>
              {isVerified ? 'Verified Successfully' : 'Not Verified - Please verify your auditorium'}
            </p>
            <br />
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Hello! Here's what's happening with your venues today.
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="venue-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Venue
            </label>
            <div className="relative">
              <select
                id="venue-select"
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="block w-full max-w-xs px-4 py-3 pr-10 text-base border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-[#ED695A] transition-colors duration-200"
              >
                {allVenues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Currently viewing: <span className="font-medium text-[#78533F]">{currentVenueData.name}</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* ... (your existing 4 stat cards remain unchanged) */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
                <span className="p-2 bg-[#ED695A] bg-opacity-10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ED695A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{currentVenueData.totalBookings}</h2>
                <span className="text-green-500 text-sm font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +12%
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">vs previous month</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Monthly Earnings</h3>
                <span className="p-2 bg-blue-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  ₹{currentVenueData.earnings.monthly.toLocaleString()}
                </h2>
                <span className="text-green-500 text-sm font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +8.5%
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">vs previous month</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Yearly Revenue</h3>
                <span className="p-2 bg-purple-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  ₹{currentVenueData.earnings.yearly.toLocaleString()}
                </h2>
                <span className="text-green-500 text-sm font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +21%
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">vs previous year</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Upcoming Events</h3>
                <span className="p-2 bg-amber-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{currentVenueData.upcomingEvents.length}</h2>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                {selectedVenue === "All Venues" ? "All venues" : "This venue"}
              </p>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`flex-1 py-4 text-center text-left ml-4 sm:ml-7 font-medium ${
                    activeSection === "upcoming" ? "text-[#ED695A] border-b-2 border-[#ED695A]" : "text-gray-500"
                  }`}
                  onClick={() => setActiveSection("upcoming")}
                >
                  Upcoming Events
                  {selectedVenue === "All Venues" && (
                    <span className="ml-2 text-sm text-gray-400">(All Venues)</span>
                  )}
                </button>
              </div>
            </div>

            {activeSection === "upcoming" && (
              <div className="p-4 sm:p-6">
                {eventsToDisplay.length > 0 ? (
                  <div className="space-y-4">
                    {eventsToDisplay.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-[#ED695A] bg-opacity-10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ED695A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{event.name}</h4>
                            {selectedVenue === "All Venues" && event.venueId && (
                              <p className="text-xs text-gray-400">
                                Venue: {venues.find((v) => v._id === event.venueId)?.name || "Unknown Venue"}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:text-right">
                          <div className="font-medium text-gray-800">{event.date}</div>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                              event.status.toLowerCase() === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : event.status.toLowerCase() === "approved"
                                ? "bg-green-100 text-green-800"
                                : event.status.toLowerCase() === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Fixed: Show More / Show Less button with better text visibility */}
                    {hasMoreEvents && (
                      <div className="pt-4 border-t border-gray-100">
                        <button
                          onClick={() => setShowAllEvents(!showAllEvents)}
                          className="w-full sm:w-auto mx-auto flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-[#ED695A] hover:bg-[#d45a4b] rounded-lg transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:ring-opacity-50"
                        >
                          {showAllEvents ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              Show Less
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              Show More ({currentVenueData.upcomingEvents.length - 4} more events)
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No upcoming events</p>
                    <p className="text-gray-400 text-sm mt-1">for {currentVenueData.name}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal */}
          {showModal && selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="text-center flex-1">
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#78533F]">Event Details</h2>
                      <p className="text-gray-600">Details for {selectedEvent.name}</p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700"><strong>Event Name:</strong> {selectedEvent.name}</p>
                      <p className="text-gray-700"><strong>Client:</strong> {selectedEvent.client}</p>
                      <p className="text-gray-700"><strong>Date:</strong> {selectedEvent.date}</p>
                      <p className="text-gray-700"><strong>Time Slot:</strong> {selectedEvent.timeSlot}</p>
                      <p className="text-gray-700">
                        <strong>Venue:</strong>{" "}
                        {venues.find((v) => v._id === selectedEvent.venueId)?.name || "Unknown Venue"}
                      </p>
                      <p className="text-gray-700">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            selectedEvent.status.toLowerCase() === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : selectedEvent.status.toLowerCase() === "approved"
                              ? "bg-green-100 text-green-800"
                              : selectedEvent.status.toLowerCase() === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedEvent.status}
                        </span>
                      </p>
                      <p className="text-gray-700"><strong>Total Amount:</strong> ₹{selectedEvent.totalAmount}</p>
                      <p className="text-gray-700"><strong>Paid Amount:</strong> ₹{selectedEvent.paidAmount}</p>
                      <p className="text-gray-700"><strong>Balance Amount:</strong> ₹{selectedEvent.balanceAmount}</p>
                      <p className="text-gray-700"><strong>Address:</strong> {selectedEvent.address}</p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="w-full mt-6 bg-[#78533F] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6e4e3d] transition-all shadow-md hover:shadow-lg"
                    >
                      Close
                    </button>
                  </div>
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