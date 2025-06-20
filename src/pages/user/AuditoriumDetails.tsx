import React, { useState } from "react";
import Header from "../../component/user/Header";
import image from "../../assets/image1.png";
import { useNavigate } from "react-router-dom";
import Lines from "../../assets/Group 52 (1).png";
import Bshape from "../../assets/02 2.png";
import img1 from "../../assets/image 16.png"
import img2 from "../../assets/Rectangle 30.png"
import { useEffect } from "react";


const images = [
  image,
  img1, 
  img2, 
 
];

const AuditoriumDetails: React.FC = () => {
  const navigate = useNavigate();
  // const [current, setCurrent] = useState(0);

  // const handleBooking = () => {
  //   navigate("/user/bookings");
  // };

  // const nextSlide = () => {
  //   setCurrent((prev: number) => (prev + 1) % images.length);
  // };

  // const prevSlide = () => {
  //   setCurrent((prev: number) => (prev - 1 + images.length) % images.length);
  // };

    const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBooking=async()=>{

  }

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  return (
    <div className="bg-[#FDF8F1]  min-h-screen">
      <img
        src={Lines}
        alt="Lines"
        className="absolute top-0 left-0 h-full object-cover mt-0 z-0 scale-250"
        style={{ maxWidth: "none" }}
      />
      <div className="relative z-10  p-2 sm:p-4">
        <Header />

        <div className="container mx-auto px-2  sm:px-4 py-4 sm:py-8 max-w-6xl">
          {/* Headline - Left Aligned */}
          <div className="mb-2  sm:mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-left  font-bold text-[#5B4336]">
              Safa Auditorium
            </h1>
          </div>

          {/* Location - Left Aligned */}
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
            <span className="text-sm sm:text-base text-[#5B4336]">
              MG Road, Kochi, Kerala 682016
            </span>
          </div>

          {/* Image Card - Left Aligned */}
        <div className="mb-6 sm:mb-8">
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
        <img
          src={images[current]}
          alt={`Slide ${current + 1}`}
          className="w-full h-60 sm:h-72 md:h-80 lg:h-[400px] object-cover transition-all duration-700 ease-in-out"
          onError={(e) => {
            console.error("Error loading image:", images[current]);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-3 transform -translate-y-1/2  bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full z-10"
              aria-label="Previous image"
            >
              
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-3 transform -translate-y-1/2  bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full z-10"
              aria-label="Next image"
            >
              
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex justify-center items-center gap-3 overflow-x-auto px-4 scrollbar-hide">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-16 w-24 rounded-md overflow-hidden border transition-all duration-200 ${
                index === current ? 'border-[#b09d94] shadow-md' : 'border-gray-200 hover:border-gray-400'
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
      )}
    </div>


          {/* About Venue (Left) and Go to Booking Button (Right) */}
          <div className="flex flex-col lg:flex-row justify-between items-start mb-6 sm:mb-8 gap-4 lg:gap-0">
            <div className="flex-1 lg:pr-8 mt-4 sm:mt-9">
              <h3 className="text-lg sm:text-xl font-semibold text-left text-[#5B4336] mt-4 sm:mt-10 mb-3">
                About Venue
              </h3>
              <p className="text-sm sm:text-base text-[#000000] text-left leading-relaxed">
                Safa Auditorium is a premier event venue located in the heart of
                Kochi, Kerala. With its elegant architecture and modern
                amenities, it provides the perfect setting for weddings,
                corporate events, conferences, and special celebrations. The
                venue offers exceptional service and creates memorable
                experiences for all occasions.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <button
                onClick={handleBooking}
                className="bg-[#9c7c5d] hover:bg-[#d85c4e] mt-6 sm:mt-15 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors flex items-center space-x-2 w-full lg:w-auto justify-center"
              >
                <span>Go to Booking</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Contact - Left Aligned */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-left mt-8 sm:mt-20 text-[#49516F] mb-4">
              Contact
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A2929] mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-sm sm:text-base text-[#2A2929]">
                  +91 9876543210
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#fef9f5] p-0 rounded-md w-fit">
            <p className="text-xs sm:text-sm text-[#49516F] mb-3 text-left">
              Price per plate
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Veg Option */}
              <div className="flex items-center gap-2 border border-[#b09d94] rounded-md px-3 sm:px-4 py-2">
                <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500 inline-block"></span>
                <span className="text-xs sm:text-sm font-medium">Veg</span>
                <span className="font-bold text-base sm:text-lg">1299/-</span>
                <span className="text-gray-400 line-through ml-1 text-xs sm:text-sm">
                  1600/-
                </span>
              </div>

              {/* Non Veg Option */}
              <div className="flex items-center gap-2 border border-[#b09d94] rounded-md px-3 sm:px-4 py-2">
                <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500 inline-block"></span>
                <span className="text-xs sm:text-sm font-medium">Non Veg</span>
                <span className="font-bold text-base sm:text-lg">1499/-</span>
                <span className="text-gray-400 line-through ml-1 text-xs sm:text-sm">
                  1800/-
                </span>
              </div>
            </div>
          </div>

          {/* Table - Hall Details */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white rounded-lg mt-8 sm:mt-20 border border-[#b09d94] shadow-sm overflow-hidden">
              {/* Mobile Card Layout */}
              <div className="block sm:hidden">
                <div className="bg-[#9c7c5d] px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Hall Details
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="p-4 space-y-2">
                    <div className="font-medium text-gray-800">Main Hall</div>
                    <div className="text-sm text-gray-600">
                      Type: Banquet Hall
                    </div>
                    <div className="text-sm text-gray-600">
                      Capacity: 500 Guests
                    </div>
                    <div className="text-sm text-gray-600">Price: ₹25,000</div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="font-medium text-gray-800">
                      Conference Room
                    </div>
                    <div className="text-sm text-gray-600">
                      Type: Meeting Room
                    </div>
                    <div className="text-sm text-gray-600">
                      Capacity: 50 Guests
                    </div>
                    <div className="text-sm text-gray-600">Price: ₹5,000</div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="font-medium text-gray-800">VIP Hall</div>
                    <div className="text-sm text-gray-600">
                      Type: Premium Hall
                    </div>
                    <div className="text-sm text-gray-600">
                      Capacity: 200 Guests
                    </div>
                    <div className="text-sm text-gray-600">Price: ₹15,000</div>
                  </div>
                </div>
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border border-[#b09d94] min-w-[600px]">
                  <thead className="bg-[#9c7c5d]">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800 border border-[#b09d94]">
                        Hall Name
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800 border border-[#b09d94]">
                        Type
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800 border border-[#b09d94]">
                        Capacity
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800 border border-[#b09d94]">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 font-medium border border-[#b09d94]">
                        Main Hall
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 border border-[#b09d94]">
                        Banquet Hall
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 border border-[#b09d94]">
                        500 Guests
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 border border-[#b09d94]">
                        ₹25,000
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 font-medium border border-[#b09d94]">
                        Conference Room
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 border border-[#b09d94]">
                        Meeting Room
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 border border-[#b09d94]">
                        50 Guests
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 border border-[#b09d94]">
                        ₹5,000
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 font-medium border border-[#b09d94]">
                        VIP Hall
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 border border-[#b09d94]">
                        Premium Hall
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 border border-[#b09d94]">
                        200 Guests
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 border border-[#b09d94]">
                        ₹15,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="bg-[#FDF8F1] min-h-screen bg-no-repeat left-0 bg-left bg-contain">
            <img
              src={Bshape}
              alt="Lines"
              className="absolute bottom-0 left-[-80px] h-90% object-cover z-0"
              style={{ maxWidth: "none" }}
            />

            <div className="relative z-10">
              <div className="bg-white border mt-8 sm:mt-20 border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 md:p-8 text-gray-800 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
                  {/* Timing Slot */}
                  <div className="text-left">
                    <h4 className="font-semibold text-base text-[#2A2929] sm:text-lg mb-2">
                      Timing Slot
                    </h4>
                    <p className="mb-1">
                      Morning : <span className="font-semibold">NA</span>
                    </p>
                    <p className="mb-1">
                      Evening : <span className="font-semibold">NA</span>
                    </p>
                    <p className="mb-1">
                      Closing time : <span className="font-semibold">NA</span>
                    </p>
                  </div>

                  {/* Lodging */}
                  <div>
                    <h4 className="font-semibold text-base text-[#2A2929] sm:text-lg mb-2 text-left">
                      Lodging
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-left">
                      <li>Rooms Available</li>
                      <li>
                        Number of rooms:{" "}
                        <span className="font-semibold text-left">180</span>
                      </li>
                      <li>
                        Average price:{" "}
                        <span className="font-semibold text-left">7900/-</span>
                      </li>
                    </ul>
                  </div>

                  {/* Changing Rooms */}
                  <div>
                    <h4 className="font-semibold text-base text-[#2A2929] sm:text-lg mb-2 text-left">
                      Changing Rooms
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-left">
                      <li>Changing Rooms Available</li>
                      <li>AC Rooms available</li>
                      <li>
                        No. of rooms: <span className="font-semibold">2</span>
                      </li>
                    </ul>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="font-semibold text-base text-[#2A2929] sm:text-lg mb-2 text-left">
                      Amenities
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-left">
                      <li>
                        <span className="text-gray-500">Parking:</span>{" "}
                        <span className="text-gray-800 font-semibold">
                          Available
                        </span>
                      </li>
                      <li>Halls are Air Conditioned</li>
                    </ul>
                  </div>

                  {/* Decoration */}
                  <div>
                    <h4 className="font-semibold text-base text-[#2A2929] sm:text-lg mb-2 text-left">
                      Decoration
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-left">
                      <li>Outside decoration allowed</li>
                      <li>Decor provided by the venue</li>
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
                            <p className="font-medium text-gray-800 text-sm sm:text-base">
                              Safa Auditorium
                            </p>
                            <p className="text-gray-600 text-sm sm:text-base">
                              MG Road, Kochi, Kerala 682016
                            </p>
                            <p className="text-gray-600 text-sm sm:text-base">
                              Near Metro Station
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
                          <p className="text-gray-600 text-sm sm:text-base">
                            Easily accessible by public transport
                          </p>
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
                        <p className="text-gray-500 font-medium text-sm sm:text-base">
                          View on Map
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400">
                          Click to open location
                        </p>
                      </div>
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