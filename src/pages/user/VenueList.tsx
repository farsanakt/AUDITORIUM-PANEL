import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../component/user/Header";
import bgImg from "../../assets/vector.png";
import { FetchAuditoriumById } from "../../api/userApi";

interface Auditorium {
  _id: string;
  name: string;
  cities: string[];
  images: string[];
  acType: string;
  seatingCapacity: string;
  tariff: { wedding: string; reception: string };
  phone: string;
  audiUserId: string;
}

const VenuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchAuditoriums = async () => {
    try {
      setLoading(true);
     
      const response = await FetchAuditoriumById(id!);
      
      const auditoriumData = Array.isArray(response.data)
        ? response.data.filter((item: Auditorium) => item.audiUserId === id)
        : [];
      if (!auditoriumData.length) {
        throw new Error(`No auditoriums found with audiUserId: ${id}`);
      }
      setAuditoriums(auditoriumData);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching auditoriums:", err);
      setError(err.message || "Failed to load venue details. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAuditoriums();
    } else {
      setError("Invalid venue ID.");
      setLoading(false);
    }
  }, [id]);

  
  useEffect(() => {
    if (auditoriums.length > 0 && auditoriums[0].images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === auditoriums[0].images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [auditoriums]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f4]">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !auditoriums.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f4]">
        <p className="text-red-600">{error || "No venues found."}</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#fff9f4] px-4 sm:px-6 lg:px-8 py-12">
      {/* Header and Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-8">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgImg})`,
          }}
        ></div>
        <Header />

        {/* Content */}
        <div className="relative z-20 w-full max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start gap-8 mt-12">
          <div className="text-left md:w-1/2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#5B4336] mb-4">
              Choose
            </h2>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#5B4336] mb-4">
              Your Venue
            </h1>
            <p className="text-gray-700 mb-6 text-sm sm:text-base">
              Your wedding venue sets the stage for one of the most memorable
              days of your life. Whether you envision an intimate garden
              ceremony, a grand ballroom reception, or a picturesque
              beachfront wedding, choosing the right venue is the first step
              in bringing your dream to life.
            </p>
            <button className="bg-[#6e3d2b] text-white px-6 py-2 rounded-full shadow-md hover:bg-[#5a2f20] text-sm sm:text-base">
              View Details
            </button>
          </div>

          <div className="md:w-1/2 flex flex-col gap-4 items-start">
            <div className="flex gap-4 w-full flex-wrap md:flex-nowrap">
              <div className="w-full md:w-1/2">
                <select className="w-full p-3 rounded shadow-md border text-sm sm:text-base">
                  <option>Place</option>
                </select>
              </div>
              <div className="w-full md:w-1/2">
                <input
                  type="date"
                  className="w-full p-3 rounded shadow-md border text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full flex-wrap md:flex-nowrap">
              <div className="w-full md:w-1/2">
                <select className="w-full p-3 rounded shadow-md border text-sm sm:text-base">
                  <option>Event</option>
                </select>
              </div>
              <button className="bg-[#6e3d2b] text-white px-6 py-3 rounded shadow-md hover:bg-[#5a2f20] w-full md:w-1/2 flex items-center justify-center text-sm sm:text-base">
                Find Venues
                <span className="ml-2">🔍</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Result Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
         
          <div className="w-full md:w-1/3 rounded-2xl overflow-hidden shadow-lg relative h-64 sm:h-80 md:h-auto">
            <img
              src={auditoriums[0].images[currentImageIndex] || ""}
              alt={auditoriums[0].name}
              className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
            />
            <span
              className={`absolute bottom-3 left-3 text-white text-xs px-3 py-1 rounded-full shadow ${
                auditoriums[0].acType.toLowerCase() === "ac"
                  ? "bg-blue-600"
                  : auditoriums[0].acType.toLowerCase() === "both"
                  ? "bg-purple-500"
                  : "bg-gray-500"
              }`}
            >
              {auditoriums[0].acType}
            </span>
          </div>

          {/* Venue Details */}
          <div className="w-full md:w-2/3 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#6e3d2b]">
                    {auditoriums[0].name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {auditoriums[0].cities.join(", ")}
                  </p>
                </div>
                <button className="bg-[#9c7c5d] text-white text-sm px-4 py-2 rounded shadow hover:bg-[#483b2f] w-full sm:w-auto">
                  📞 {auditoriums[0].phone}
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-[#6e3d2b] text-white text-left sticky top-0">
                    <tr>
                      <th className="py-3 px-4 sm:min-w-[150px] font-semibold text-xs sm:text-sm">Venue Name</th>
                      <th className="py-3 px-4 sm:min-w-[100px] font-semibold text-xs sm:text-sm">Type</th>
                      <th className="py-3 px-4 sm:min-w-[100px] font-semibold text-xs sm:text-sm">Capacity</th>
                      <th className="py-3 px-4 sm:min-w-[120px] font-semibold text-xs sm:text-sm">Event Type</th>
                      <th className="py-3 px-4 sm:min-w-[100px] font-semibold text-xs sm:text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditoriums.map((auditorium, index) => (
                      <tr
                        key={auditorium._id}
                        className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                      >
                        <td className="py-2 px-4 text-xs sm:text-sm">{auditorium.name}</td>
                        <td className="py-2 px-4 text-xs sm:text-sm">{auditorium.acType}</td>
                        <td className="py-2 px-4 text-xs sm:text-sm">{auditorium.seatingCapacity}</td>
                        <td className="py-2 px-4 text-xs sm:text-sm">
                          {auditorium.tariff.wedding === "t" ? "Wedding" : ""}
                          {auditorium.tariff.wedding === "t" && auditorium.tariff.reception === "t" ? ", " : ""}
                          {auditorium.tariff.reception === "t" ? "Reception" : ""}
                        </td>
                        <td className="py-2 px-4">
                          <button
                            className="text-[#6e3d2b] hover:underline text-xs sm:text-sm"
                            onClick={() => navigate(`/auditoriumdetails/${auditorium._id}`)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button className="w-full px-4 py-2 border rounded text-[#6e3d2b] hover:bg-[#fceee5] text-xs sm:text-base">
                View Details
              </button>
              <button className="w-full px-4 py-2 border rounded text-[#6e3d2b] hover:bg-[#fceee5] text-xs sm:text-base">
                Shortlist
              </button>
              <button className="w-full px-4 py-2 border rounded text-[#6e3d2b] hover:bg-[#fceee5] text-xs sm:text-base">
                Send Query
              </button>
              <button className="w-full px-4 py-2 border rounded text-[#6e3d2b] hover:bg-[#fceee5] text-xs sm:text-base">
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenuePage;