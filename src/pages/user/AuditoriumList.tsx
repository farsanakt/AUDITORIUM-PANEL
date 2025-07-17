import React, { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import Header from "../../component/user/Header";
import bgImg from '../../assets/vector.png'

interface Venue {
  id: number;
  name: string;
  location: string;
  image: string;
  category: string;
  tag: string;
}

const VenueSelector: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const venues: Venue[] = [
    {
      id: 1,
      name: "Sofa Auditorium",
      location: "Anthiyur",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
      category: "Auditorium",
      tag: "Outdoor",
    },
    {
      id: 2,
      name: "Rashaj Auditorium",
      location: "Tiruvallam",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      category: "Auditorium",
      tag: "Indoor",
    },
    {
      id: 3,
      name: "Nomadic",
      location: "Lorem Ipsum",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
      category: "Restaurant",
      tag: "Hybrid",
    },
    {
      id: 4,
      name: "Tropical",
      location: "Trivandrum",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      category: "Restaurant",
      tag: "Outdoor",
    },
    {
      id: 5,
      name: "Sofa Auditorium",
      location: "Anthiyur",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
      category: "Auditorium",
      tag: "Outdoor",
    },
    {
      id: 6,
      name: "Rashaj Auditorium",
      location: "Tiruvallam",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      category: "Auditorium",
      tag: "Indoor",
    },
    {
      id: 7,
      name: "Nomadic",
      location: "Lorem Ipsum",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
      category: "Restaurant",
      tag: "Hybrid",
    },
    {
      id: 8,
      name: "Tropical",
      location: "Trivandrum",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      category: "Restaurant",
      tag: "Outdoor",
    },
  ];

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
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
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
            {/* Left Content */}
            <div className="text-left md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-serif text-brown-700 mb-4">
                Choose
              </h2>
              <h1 className="text-5xl font-bold text-[#6e3d2b] mb-4">
                Your Venue
              </h1>
              <p className="text-gray-700 mb-6">
                Your wedding venue sets the stage for one of the most memorable
                days of your life. Whether you envision an intimate garden
                ceremony, a grand ballroom reception, or a picturesque
                beachfront wedding, choosing the right venue is the first step
                in bringing your dream to life.
              </p>
              <button className="bg-[#6e3d2b] text-white px-6 py-2 rounded-full shadow-md hover:bg-[#5a2f20]">
                View Details
              </button>
            </div>

            {/* Right Content */}
            <div className="md:w-1/2 flex flex-col gap-4 items-start">
              <div className="flex gap-4 w-full flex-wrap md:flex-nowrap">
                <div className="w-full md:w-1/2">
                  <select className="w-full p-3 rounded shadow-md border">
                    <option>Place</option>
                  </select>
                </div>
                <div className="w-full md:w-1/2">
                  <input
                    type="date"
                    className="w-full p-3 rounded shadow-md border"
                  />
                </div>
              </div>
              <div className="flex gap-4 w-full flex-wrap md:flex-nowrap">
                <div className="w-full md:w-1/2">
                  <select className="w-full p-3 rounded shadow-md border">
                    <option>Event</option>
                  </select>
                </div>
                <button className="bg-[#6e3d2b] text-white px-6 py-3 rounded shadow-md hover:bg-[#5a2f20] w-full md:w-1/2 flex items-center justify-center">
                  Find Venues
                  <span className="ml-2">🔍</span>
                </button>
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
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
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
                    )} text-white px-3 py-1 rounded-full text-xs font-medium`}
                  >
                    {venue.tag}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
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
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
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
                    )} text-white px-3 py-1 rounded-full text-xs font-medium`}
                  >
                    {venue.tag}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
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
