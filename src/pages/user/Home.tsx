import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Calendar,
  Flag,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import Header from "../../component/user/Header";
import bgImg from "../../assets/Rectangle 50.png";
import pjct from "../../assets/image 16.png";
import pjct1 from "../../assets/Rectangle 30.png";
import { useNavigate } from "react-router-dom";
import { existingVenues, fetchAllVendors } from "../../api/userApi";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface Artist {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  location: string;
  review: string;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  images: string[];
  price: string;
  rating: number;
  review: string;
}

interface Project {
  id: number;
  title: string;
  image: string;
  category: string;
}

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    place: "",
    date: "",
    event: "",
  });
  const [venues, setVenues] = useState<Venue[]>([]);
  const [makeupArtists, setMakeupArtists] = useState<Artist[]>([]);
  const [eventManagements, setEventManagements] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("all"); // State to track active section
  const navigate = useNavigate();

  const venuesRef = useRef<HTMLDivElement>(null);
  const eventManagementsRef = useRef<HTMLDivElement>(null);
  const artistsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    navigate(`/auditoriumlist?place=${formData.place}&date=${formData.date}&event=${formData.event}`);
  };

  const fetchVendors = async () => {
    const response = await fetchAllVendors();
    console.log(response.data, "vendors data");
    const vendors = response.data;

    const mappedMakeupArtists = vendors
      .filter((v: any) => v.vendorType === "makeup artist")
      .map((v: any) => ({
        id: v._id,
        name: v.name,
        role: "Makeup Artist",
        image: v.images[0],
        rating: 4.5,
        location: v.cities[0] || v.address.split(",").pop()?.trim() || "Unknown",
        review: "",
      }));

    const mappedEventManagements = vendors
      .filter((v: any) => v.vendorType === "event management")
      .map((v: any) => ({
        id: v._id,
        name: v.name,
        role: "Event Management",
        image: v.images[0],
        rating: 4.5,
        location: v.cities[0] || v.address.split(",").pop()?.trim() || "Unknown",
        review: "",
      }));

    setMakeupArtists(mappedMakeupArtists);
    setEventManagements(mappedEventManagements);
  };

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await existingVenues();
      console.log("Venues API response:", response.data);
      const mappedVenues = response.data.map((venue: any) => ({
        id: venue._id,
        name: venue.name || venue.venueName || "Unknown Venue",
        location: venue.address || "Unknown Location",
        images: venue.images && Array.isArray(venue.images) && venue.images.length > 0
          ? venue.images
          : ["/placeholder.svg?height=200&width=300"],
        price: venue.totalamount || venue.tariff?.wedding || "Price not available",
        rating: venue.rating || 4.5,
        review: venue.review || "Great venue with excellent amenities!",
      }));
      setVenues(mappedVenues);
    } catch (err) {
      console.error("Error fetching venues:", err);
      setError("Failed to load venues. Please try again.");
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
    fetchVendors();
  }, []);

  const projects: Project[] = [
    {
      id: 1,
      title: "Romantic Beach Wedding",
      image: pjct1,
      category: "Beach Wedding",
    },
    {
      id: 2,
      title: "Garden Party Reception",
      image: pjct,
      category: "Garden Wedding",
    },
    {
      id: 3,
      title: "Garden Party Reception",
      image: pjct,
      category: "Garden Wedding",
    },
  ];

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Handle section click
  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-transparent overflow-x-hidden">
      <style>
        {`
          .scroll-container {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
          .scroll-container::-webkit-scrollbar {
            display: none;
          }
          .scroll-button {
            opacity: 0.7;
            transition: opacity 0.3s;
          }
          .scroll-button:hover {
            opacity: 1;
          }
          @keyframes fadeInScale {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .group:hover .card-content {
            transform: translateY(-5px);
          }
        `}
      </style>

      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgImg})`,
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 w-full h-full"></div>

        <div className="absolute top-0 left-0 right-0 z-50">
          <Header />
        </div>

        <div className="absolute top-16 sm:top-20 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-20 text-[#9c7c5d] text-xs sm:text-sm font-medium z-40">
          {/* <div>EVENT DESIGN</div>
          <div>COMPANY</div> */}
        </div>

        <div className="absolute top-16 sm:top-20 right-4 sm:right-6 md:right-8 lg:right-12 xl:right-20 text-[#9c7c5d] text-xs sm:text-sm font-medium z-40">
          {/* Find Local Venues */}
        </div>

        <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 pt-20 sm:pt-24">
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-left space-y-4 sm:space-y-6 lg:space-y-8 mb-8 lg:mb-0">
            <h1
              className={`text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-amber-900 leading-tight transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div
                className={`transition-all duration-1000 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Make Every Moment
              </div>
              <div
                className={`transition-all duration-1000 delay-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Unforgettable!
              </div>
            </h1>

            <div
              className={`text-[#9c7c5d] text-xs sm:text-sm font-medium space-y-1 transition-all duration-1000 delay-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div>HURRY UP TO</div>
              <div>BOOK YOUR WEDDING</div>
            </div>
          </div>

          <div
            className={`w-full lg:w-1/2 flex flex-col items-center lg:items-end justify-center space-y-4 sm:space-y-6 text-center lg:text-right transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:hidden space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <select
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">Place</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Trivandrum">Trivandrum</option>
                    <option value="Kannur">Kannur</option>
                    <option value="Calicut">Calicut</option>
                  </select>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <select
                    name="event"
                    value={formData.event}
                    onChange={handleInputChange}
                    className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="engagement">Engagement</option>
                    <option value="reception">Reception</option>
                    <option value="anniversary">Anniversary</option>
                  </select>
                </div>

                <button
                  onClick={handleSubmit}
                  className="h-10 px-4 w-full bg-[#9c7c5d] text-white rounded-md font-medium hover:bg-[#8b6b4a] transition duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <span>Find Venues</span>
                  <Search className="w-4 h-4" />
                </button>
              </div>

              <div className="hidden sm:grid grid-cols-2 gap-3 sm:gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <select
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">Place</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Trivandrum">Trivandrum</option>
                    <option value="Kannur">Kannur</option>
                    <option value="Calicut">Calicut</option>
                  </select>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <select
                    name="event"
                    value={formData.event}
                    onChange={handleInputChange}
                    className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="engagement">Engagement</option>
                    <option value="reception">Reception</option>
                    <option value="anniversary">Anniversary</option>
                  </select>
                </div>

                <button
                  onClick={handleSubmit}
                  className="h-10 sm:h-12 px-4 w-full bg-[#9c7c5d] text-white rounded-md font-medium hover:bg-[#8b6b4a] transition duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <span>Find Venues</span>
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className={`text-[#9c7c5d] text-xs sm:text-sm font-medium space-y-1 transition-all duration-1000 delay-800 cursor-pointer ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div onClick={() => handleSectionClick("venues")}>VENUE</div>
              <div onClick={() => handleSectionClick("eventManagement")}>EVENT-MANAGEMENT</div>
              <div onClick={() => handleSectionClick("artists")}>MAKEUP-ARTISTS</div>
              <div onClick={() => handleSectionClick("projects")}>DESIGNS</div>
              <div onClick={() => handleSectionClick("all")} className="mt-2">SHOW ALL</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 flex items-center gap-2 sm:gap-4 z-40">
          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border border-gray-400 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
            </div>
            <span>Restart</span>
          </div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium">
            1/6
          </div>
        </div>
      </section>

      {(activeSection === "all" || activeSection === "services") && (
        <section id="services" className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
                Our Services
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl">
                We specialize in creating seamless, unforgettable events tailored
                to your vision. From corporate gatherings and weddings to private
                celebrations and brand activations, our expert team ensures every
                detail is flawlessly executed.
              </p>
            </div>
          </div>
        </section>
      )}

      {(activeSection === "all" || activeSection === "venues") && (
        <section id="venues" className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-right mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
                Perfect Venues
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl ml-auto">
                Choose from our collection of stunning venues that will provide
                the perfect backdrop for your wedding
              </p>
            </div>

            {loading ? (
              <div className="text-center text-gray-600">Loading venues...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : venues.length === 0 ? (
              <div className="text-center text-gray-600">No venues available.</div>
            ) : (
              <div className="relative">
                {venues.length > 4 && (
                  <div className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 z-10">
                    <button
                      onClick={() => scrollLeft(venuesRef)}
                      className="scroll-button bg-[#9c7c5d] text-white rounded-full p-2 sm:p-3 hover:bg-[#8b6b4a] transition duration-300"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                )}
                <div
                  ref={venuesRef}
                  className="scroll-container flex overflow-x-auto space-x-4 sm:space-x-6 pb-4"
                >
                  {venues.map((venue, index) => (
                    <div
                      key={venue.id}
                      className="group rounded-xl overflow-hidden hover:shadow-xl transition duration-300 transform opacity-0 scale-95 flex-shrink-0 w-[240px] sm:w-[280px]"
                      style={{
                        animation: `fadeInScale 0.6s ease ${index * 0.15}s forwards`,
                      }}
                    >
                      <div
                        className="relative h-48 sm:h-56 bg-cover bg-center rounded-xl"
                        style={{ backgroundImage: `url(${venue.images[0]})` }}
                      >
                        <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition duration-300"></div>
                        <img
                          src={venue.images[0]}
                          alt={venue.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div className="p-3 text-left card-content transition-transform duration-300">
                        <h3 className="text-lg sm:text-xl font-medium text-[#5B4336]">
                          {venue.name}
                        </h3>
                        <p className="text-gray-600 text-sm flex items-center mb-1">
                          <MapPin className="h-4 w-4 text-gray-600 mr-1" />
                          {venue.location}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{venue.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {venues.length > 4 && (
                  <div className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 z-10">
                    <button
                      onClick={() => scrollRight(venuesRef)}
                      className="scroll-button bg-[#9c7c5d] text-white rounded-full p-2 sm:p-3 hover:bg-[#8b6b4a] transition duration-300"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {(activeSection === "all" || activeSection === "eventManagement") && (
        <section id="eventManagement" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
                Event Management
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl">
                Our expert event management teams ensure every detail of your special day is perfectly executed.
              </p>
            </div>

            <div className="relative">
              {eventManagements.length > 4 && (
                <div className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 z-10">
                  <button
                    onClick={() => scrollLeft(eventManagementsRef)}
                    className="scroll-button bg-[#9c7c5d] text-white rounded-full p-2 sm:p-3 hover:bg-[#8b6b4a] transition duration-300"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              )}
              <div
                ref={eventManagementsRef}
                className="scroll-container flex overflow-x-auto space-x-4 sm:space-x-6 pb-4"
              >
                {eventManagements.map((artist, index) => (
                  <div
                    key={artist.id}
                    className="group rounded-xl overflow-hidden hover:shadow-xl transition duration-300 transform opacity-0 scale-95 flex-shrink-0 w-[240px] sm:w-[280px]"
                    style={{
                      animation: `fadeInScale 0.6s ease ${index * 0.15}s forwards`,
                    }}
                  >
                    <div
                      className="relative h-48 sm:h-56 bg-cover bg-center rounded-xl"
                      style={{ backgroundImage: `url(${artist.image})` }}
                    >
                      <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition duration-300"></div>
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="p-3 text-left card-content transition-transform duration-300">
                      <h3 className="text-lg sm:text-xl font-medium text-[#5B4336]">
                        {artist.name}
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <MapPin className="h-4 w-4 text-gray-600 mr-1" />
                        {artist.location}
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{artist.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {eventManagements.length > 4 && (
                <div className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 z-10">
                  <button
                    onClick={() => scrollRight(eventManagementsRef)}
                    className="scroll-button bg-[#9c7c5d] text-white rounded-full p-2 sm:p-3 hover:bg-[#8b6b4a] transition duration-300"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              )}
            </div>
            <div className="text-right mt-6">
              <button
                onClick={() => navigate("/vendorslist?type=event management")}
                className="px-4 py-2 bg-gray-200 text-[#9c7c5d] rounded-lg hover:bg-gray-300 transition duration-300"
              >
                View All
              </button>
            </div>
          </div>
        </section>
      )}

      {(activeSection === "all" || activeSection === "artists") && (
        <section id="artists" className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
                Our Makeup Artists
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl">
                Whether you love classic, candid, documentary, or artistic
                photography, we have the perfect match for your vision.
              </p>
            </div>

            <div className="relative">
              {makeupArtists.length > 4 && (
                <div className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 z-10">
                  <button
                    onClick={() => scrollLeft(artistsRef)}
                    className="scroll-button bg-[#9c7c5d] text-white rounded-full p-2 sm:p-3 hover:bg-[#8b6b4a] transition duration-300"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              )}
              <div
                ref={artistsRef}
                className="scroll-container flex overflow-x-auto space-x-4 sm:space-x-6 pb-4"
              >
                {makeupArtists.map((artist, index) => (
                  <div
                    key={artist.id}
                    className="group rounded-xl overflow-hidden hover:shadow-xl transition duration-300 transform opacity-0 scale-95 flex-shrink-0 w-[240px] sm:w-[280px]"
                    style={{
                      animation: `fadeInScale 0.6s ease ${index * 0.15}s forwards`,
                    }}
                  >
                    <div
                      className="relative h-48 sm:h-56 bg-cover bg-center rounded-xl"
                      style={{ backgroundImage: `url(${artist.image})` }}
                    >
                      <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition duration-300"></div>
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="p-3 text-left card-content transition-transform duration-300">
                      <h3 className="text-lg sm:text-xl font-medium text-[#5B4336]">
                        {artist.name}
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <MapPin className="h-4 w-4 text-gray-600 mr-1" />
                        {artist.location}
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{artist.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {makeupArtists.length > 4 && (
                <div className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 z-10">
                  <button
                    onClick={() => scrollRight(artistsRef)}
                    className="scroll-button bg-[#9c7c5d] text-white rounded-full p-2 sm:p-3 hover:bg-[#8b6b4a] transition duration-300"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              )}
            </div>
            <div className="text-right mt-6">
              <button
                onClick={() => navigate("/vendorslist?type=makeup artist")}
                className="px-4 py-2 bg-gray-200 text-[#9c7c5d] rounded-lg hover:bg-gray-300 transition duration-300"
              >
                View All
              </button>
            </div>
          </div>
        </section>
      )}

      {(activeSection === "all" || activeSection === "projects") && (
        <section id="projects" className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
                Our Projects
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl">
                Take a look at some of our recent wedding projects and get
                inspired for your own special day
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 sm:h-56 lg:h-64">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition duration-300"></div>
                  </div>

                  <div className="p-4 sm:p-6 text-left">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#5B4336] mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {project.category}
                    </p>
                    <button className="bg-[#9c7c5d] text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm hover:bg-[#8b6b4a] transition duration-300">
                      View Gallery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;