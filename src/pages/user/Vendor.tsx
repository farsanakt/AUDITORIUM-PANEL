import React, { useState, useEffect } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../component/user/Header";
import bgImg from "../../assets/vector.png";
import { fetchAllVendors } from "../../api/userApi";

interface Vendor {
  id: string;
  name: string;
  address: string;
  cities: string[];
  images: string[];
  rating: number;
  vendorType: string;
}

const VendorList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const vendorType = searchParams.get("type") || "Vendor";
  const [formData, setFormData] = useState({
    place: "",
    date: "",
  });
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const capitalizedType = vendorType
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    console.log(vendorType,'vendor')
    const getVendors = async () => {
      try {
        setLoading(true);
        const response = await fetchAllVendors();
        const allVendors = response.data;
        const typeVendors = allVendors
          .filter((v: any) => v.vendorType === vendorType)
          .map((v: any) => ({
            id: v._id,
            name: v.name,
            address: v.address,
            cities: v.cities || [],
            images: v.images && v.images.length > 0
              ? v.images
              : ["https://via.placeholder.com/400x300"],
            rating: 4.5, 
            vendorType: v.vendorType,
          }));
        setVendors(typeVendors);
        setFilteredVendors(typeVendors);

        // Compute unique cities
        const uniqueCities = [...new Set(typeVendors.flatMap((v: Vendor) => v.cities))].sort();
        setCities(uniqueCities);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setVendors([]);
        setFilteredVendors([]);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };
    getVendors();
  }, [vendorType]);

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
    const filtered = vendors.filter(
      (v) => !formData.place || v.cities.includes(formData.place)
    );
    setFilteredVendors(filtered);
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
            {/* Left Content */}
            <div className="text-left md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-serif text-brown-700 mb-4">
                Choose
              </h2>
              <h1 className="text-5xl font-bold text-[#6e3d2b] mb-4">
                Your {capitalizedType}
              </h1>
              <p className="text-gray-700 mb-6">
                Your {vendorType} sets the stage for one of the most memorable
                days of your life. Whether you envision an intimate garden
                ceremony, a grand ballroom reception, or a picturesque
                beachfront wedding, choosing the right {vendorType} is the first
                step in bringing your dream to life.
              </p>
              <button className="bg-[#6e3d2b] text-white px-6 py-2 rounded-full shadow-md hover:bg-[#5a2f20]">
                View Details
              </button>
            </div>

            {/* Right Content */}
            <div className="w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
              {/* Mobile */}
              <div className="flex flex-col sm:hidden space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <select
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="">All Places</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="h-10 px-4 bg-[#9c7c5d] text-white rounded-md font-medium flex items-center justify-center gap-2 text-sm"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <select
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className="w-full h-12 pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">All Places</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full h-12 pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="h-12 px-4 bg-[#9c7c5d] text-white rounded-md font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Vendors Grid */}
        <div className="space-y-8 mt-8">
          {loading ? (
            <div className="text-center text-gray-600">Loading vendors...</div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center text-gray-600">No vendors found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                  onClick={() => navigate(`/vendordetails/${vendor.id}`)}
                >
                  <div className="relative">
                    <img
                      src={vendor.images[0]}
                      alt={vendor.name}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {capitalizedType}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {vendor.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{vendor.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorList;