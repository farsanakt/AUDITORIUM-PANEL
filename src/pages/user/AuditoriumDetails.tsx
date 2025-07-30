import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../component/user/Header";
import Lines from "../../assets/Group 52 (1).png";
import Bshape from "../../assets/02 2.png";
import { singleVenueDetails } from "../../api/userApi";

interface Auditorium {
  _id: string;
  name: string;
  address: string;
  cities: string[];
  pincode: string;
  phone: string;
  altPhone: string;
  email: string;
  images: string[];
  acType: string;
  seatingCapacity: string;
  diningCapacity: string;
  parkingSlots: string;
  changingRooms: string;
  amenities: string[];
  decorPolicy: string;
  foodPolicy: string;
  cancellationPolicy: string;
  timeSlots: any[]; 
  audiUserId: string;
  tariff: { wedding: string; reception: string };
}

const AuditoriumDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [auditorium, setAuditorium] = useState<Auditorium | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  const findVenueDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching venue details with id:", id);
      const response = await singleVenueDetails(id!);
      console.log("API Response:", response.data);
      if (!response.data) {
        throw new Error(`No venue found with id: ${id}`);
      }
      setAuditorium(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching venue details:", err);
      setError(err.message || "Failed to load venue details. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      findVenueDetails();
    } else {
      setError("Invalid venue ID.");
      setLoading(false);
    }
  }, [id]);

  
  useEffect(() => {
    if (auditorium?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % auditorium.images.length);
      }, 3000); 
      return () => clearInterval(interval);
    }
  }, [auditorium?.images]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % (auditorium?.images.length || 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + (auditorium?.images.length || 1)) % (auditorium?.images.length || 1));
  };

  const handleBooking = () => {
    navigate(`/bookings/${id}`);
    // navigate('/bookings')
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F1]">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !auditorium) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F1]">
        <p className="text-red-600">{error || "No venue found."}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF8F1] min-h-screen">
      <img
        src={Lines}
        alt="Lines"
        className="absolute top-0 left-0 h-full object-cover mt-0 z-0 scale-250"
        style={{ maxWidth: "none" }}
      />
      <div className="relative z-10 p-2 sm:p-4">
        <Header />

        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
          {/* Headline */}
          <div className="mb-2 sm:mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-left font-bold text-[#5B4336]">
              {auditorium.name}
            </h1>
          </div>

          {/* Location */}
          <div className="flex items-center mb-4 sm:mb-6">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9c7c5d] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-base text-[#5B4336]">
              {auditorium.address}, {auditorium.cities.join(", ")} {auditorium.pincode}
            </span>
          </div>

          {/* Image Card */}
          <div className="mb-6 sm:mb-8">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
              <img
                src={auditorium.images[current] || ""}
                alt={`Slide ${current + 1}`}
                className="w-full h-60 sm:h-72 md:h-80 lg:h-[400px] object-cover transition-all duration-700 ease-in-out"
                onError={(e) => {
                  console.error("Error loading image:", auditorium.images[current]);
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {auditorium.images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full z-10"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full z-10"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            {auditorium.images.length > 1 && (
              <div className="mt-4 flex justify-center items-center gap-3 overflow-x-auto px-4 scrollbar-hide">
                {auditorium.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`h-16 w-24 rounded-md overflow-hidden border transition-all duration-200 ${
                      index === current ? "border-[#b09d94] shadow-md" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* About Venue and Booking Button */}
          <div className="flex flex-col lg:flex-row justify-between items-start mb-6 sm:mb-8 gap-4 lg:gap-0">
            <div className="flex-1 lg:pr-8 mt-4 sm:mt-9">
              <h3 className="text-lg sm:text-xl font-semibold text-left text-[#5B4336] mt-4 sm:mt-10 mb-3">
                About Venue
              </h3>
              <p className="text-sm sm:text-base text-[#000000] text-left leading-relaxed">
                {auditorium.name} is a premier event venue offering modern amenities and elegant spaces for various events. 
                With a seating capacity of {auditorium.seatingCapacity} and dining capacity of {auditorium.diningCapacity}, 
                it’s ideal for {auditorium.tariff.wedding === "t" ? "weddings" : ""}{auditorium.tariff.wedding === "t" && auditorium.tariff.reception === "t" ? ", " : ""}
                {auditorium.tariff.reception === "t" ? "receptions" : ""}, and other celebrations. 
                The venue supports {auditorium.foodPolicy} food options and {auditorium.decorPolicy} decoration policies.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <button
                onClick={handleBooking}
                className="bg-[#9c7c5d] hover:bg-[#d85c4e] mt-6 sm:mt-15 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors flex items-center space-x-2 w-full lg:w-auto justify-center"
              >
                <span>Go to Booking</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-left mt-8 sm:mt-20 text-[#49516F] mb-4">
              Contact
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A2929] mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-sm sm:text-base text-[#2A2929]">{auditorium.phone}</span>
              </div>
              {auditorium.altPhone && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A2929] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-sm sm:text-base text-[#2A2929]">{auditorium.altPhone}</span>
                </div>
              )}
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A2929] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm sm:text-base text-[#2A2929]">{auditorium.email}</span>
              </div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="relative z-10">
            <img
              src={Bshape}
              alt="Lines"
              className="absolute bottom-0 left-[-80px] h-[90%] object-cover z-0"
              style={{ maxWidth: "none" }}
            />
            <div className="bg-white border mt-8 sm:mt-20 border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 md:p-8 text-gray-800 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
                {/* Timing Slots */}
                <div className="text-left">
                  <h4 className="font-semibold text-base text-[#2A2929] sm:text-lg mb-2">Timing Slots</h4>
                  {auditorium.timeSlots.length > 0 ? (
                    auditorium.timeSlots.map((slot, index) => (
                      <p key={index} className="mb-1">
                        Slot {index + 1}:{" "}
                        <span className="font-semibold">
                          {slot.start && slot.end ? `${slot.start} - ${slot.end}` : JSON.stringify(slot)}
                        </span>
                      </p>
                    ))
                  ) : (
                    <p className="mb-1">No time slots available</p>
                  )}
                </div>

                {/* Lodging */}
                <div>
                  <h4 className="font-semibold text-base text-[#2A2929] sm:text-lg mb-2 text-left">Lodging</h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>{auditorium.changingRooms ? "Rooms Available" : "No Rooms Available"}</li>
                    <li>
                      Number of rooms: <span className="font-semibold">{auditorium.changingRooms || "0"}</span>
                    </li>
                    <li>
                      Average price: <span className="font-semibold">Contact for details</span>
                    </li>
                  </ul>
                </div>

                {/* Changing Rooms */}
                <div>
                  <h4 className="font-semibold text-base text-[#2A2929] sm:text-lg mb-2 text-left">Changing Rooms</h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>{auditorium.changingRooms ? "Changing Rooms Available" : "No Changing Rooms"}</li>
                    <li>{auditorium.acType === "AC" || auditorium.acType === "Both" ? "AC Rooms available" : "Non-AC Rooms"}</li>
                    <li>
                      No. of rooms: <span className="font-semibold">{auditorium.changingRooms || "0"}</span>
                    </li>
                  </ul>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-semibold text-base text-[#2A2929] sm:text-lg mb-2 text-left">Amenities</h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>
                      <span className="text-gray-500">Parking:</span>{" "}
                      <span className="text-gray-800 font-semibold">{auditorium.parkingSlots ? `${auditorium.parkingSlots} Slots` : "Not Available"}</span>
                    </li>
                    <li>Halls are {auditorium.acType === "AC" || auditorium.acType === "Both" ? "Air Conditioned" : "Non-Air Conditioned"}</li>
                    {auditorium.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>

                {/* Decoration and Food Policy */}
                <div>
                  <h4 className="font-semibold text-base text-[#2A2929] sm:text-lg mb-2 text-left">Decoration & Food</h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Decoration: <span className="font-semibold">{auditorium.decorPolicy === "coustom" ? "Custom Allowed" : "Venue Provided"}</span></li>
                    <li>Food: <span className="font-semibold">{auditorium.foodPolicy === "veg" ? "Vegetarian Only" : "Mixed Options"}</span></li>
                    <li>Cancellation: <span className="font-semibold">{auditorium.cancellationPolicy === "partially" ? "Partially Refundable" : "Non-Refundable"}</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-left text-[#5B4336] mt-8 sm:mt-20 mb-4 sm:mb-6">
                Location
              </h2>
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#9c7c5d] mb-4 text-left">
                      Address Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-800 text-sm sm:text-base">{auditorium.name}</p>
                          <p className="text-gray-600 text-sm sm:text-base">
                            {auditorium.address}, {auditorium.cities.join(", ")} {auditorium.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p className="text-gray-600 text-sm sm:text-base">Easily accessible by public transport</p>
                      </div>
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="bg-gray-200 rounded-lg h-48 sm:h-64 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-500 font-medium text-sm sm:text-base">View on Map</p>
                      <p className="text-xs sm:text-sm text-gray-400">Click to open location</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditoriumDetails;