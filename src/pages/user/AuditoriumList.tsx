import React, { useEffect, useState } from "react";
import { MapPin, Flag } from "lucide-react";
import Header from "../../component/user/Header";
import bgImg from '../../assets/vector.png';
import { useNavigate, useSearchParams } from "react-router-dom";
import { FindAuidtorium } from "../../api/userApi";

interface Venue {
  id: string;
  name: string;
  location: string;
  image: string;
  category: string;
  tag: string;
}

const VenueSelector: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(searchParams.get("place") || "");
  const [event, setEvent] = useState(searchParams.get("event") || "");
  const [venues, setVenues] = useState<Venue[]>([]);

  const findAuditorium = async () => {
    try {
      const response = await FindAuidtorium(place, event);
      console.log(response, 'lope');

      const mappedVenues: Venue[] = response.map((item: any, index: number) => ({
        id: item.auditorium._id,
        name: item.auditorium.auditoriumName || `Auditorium ${index + 1}`,
        location: Array.isArray(item.auditorium.locations) 
          ? item.auditorium.locations.join(", ") 
          : item.auditorium.locations || "Unknown Location",
        image: item.images && item.images.length > 0 ? item.images[0] : "https://via.placeholder.com/400x300",
        category: "Auditorium",
        tag: item.auditorium.tag || "Indoor",
      }));

      setVenues(mappedVenues);
    } catch (error) {
      console.error("Error fetching auditoriums:", error);
    }
  };

  useEffect(() => {
    findAuditorium();
  }, [place, event]);

  const handleCardClick = (id: string) => {
    navigate(`/venuelist/${id}`);
  };

  const getTagColor = (tag: string): string => {
    switch (tag.toLowerCase()) {
      case "outdoor":
        return "bg-blue-500";
      case "indoor":
        return "bg-yellow-500";
      case "hybrid":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-8">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${bgImg})`,
            }}
          ></div>
          <Header />

          {/* Content */}
          <div className="relative z-20 w-full max-w-7xl px-6 flex flex-col md:flex-row justify-between items-start gap-10 mt-12">
            {/* Left Content - Classic look with serif fonts and elegant styling */}
            <div className="text-left md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-serif text-brown-700 mb-4 italic">
                Choose
              </h2>
              <h1 className="text-5xl font-serif font-bold text-[#6e3d2b] mb-4">
                Your Venue
              </h1>
              <p className="text-gray-700 mb-6 font-serif text-lg">
                Your wedding venue sets the stage for one of the most memorable
                days of your life. Whether you envision an intimate garden
                ceremony, a grand ballroom reception, or a picturesque
                beachfront wedding, choosing the right venue is the first step
                in bringing your dream to life.
              </p>
              <button className="bg-[#6e3d2b] text-white px-6 py-2 rounded-full shadow-md hover:bg-[#5a2f20] font-serif">
                View Details
              </button>
              <p className="mt-6 text-[#6e3d2b] font-serif text-xl italic">
                Search Results for {place || "Any Place"} - {event || "Any Event"}
              </p>
            </div>

            {/* Right Content - Place and Event in same line for desktop, stacked for mobile */}
            <div className="w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
              {/* Mobile: stacked */}
              <div className="flex flex-col sm:hidden space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <select
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif"
                  >
                    <option value="">Place</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Trivandrum">Trivandrum</option>
                    <option value="Kannur">Kannur</option>
                    <option value="Calicut">Calicut</option>
                  </select>
                </div>

                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <select
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif"
                  >
                    <option value="">Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="engagement">Engagement</option>
                    <option value="reception">Reception</option>
                    <option value="anniversary">Anniversary</option>
                  </select>
                </div>
              </div>

              {/* Desktop: side by side */}
              <div className="hidden sm:flex space-x-4">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <select
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif"
                  >
                    <option value="">Place</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Trivandrum">Trivandrum</option>
                    <option value="Kannur">Kannur</option>
                    <option value="Calicut">Calicut</option>
                  </select>
                </div>

                <div className="relative flex-1">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <select
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif"
                  >
                    <option value="">Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="engagement">Engagement</option>
                    <option value="reception">Reception</option>
                    <option value="anniversary">Anniversary</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Venues Grid */}
        <div className="space-y-8">
          {/* First row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {venues.slice(0, 4).map((venue) => (
              <div
                key={venue.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                onClick={() => handleCardClick(venue.id)}
              >
                <div className="relative">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    className={`absolute top-3 left-3 ${getTagColor(
                      venue.tag
                    )} text-white px-3 py-1 rounded-full text-xs font-medium font-serif`}
                  >
                    {venue.tag}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 font-serif">
                    {venue.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{venue.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {venues.slice(4, 8).map((venue) => (
              <div
                key={venue.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                onClick={() => handleCardClick(venue.id)}
              >
                <div className="relative">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    className={`absolute top-3 left-3 ${getTagColor(
                      venue.tag
                    )} text-white px-3 py-1 rounded-full text-xs font-medium font-serif`}
                  >
                    {venue.tag}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 font-serif">
                    {venue.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{venue.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueSelector;