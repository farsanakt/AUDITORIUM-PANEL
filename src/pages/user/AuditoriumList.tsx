import React, { useEffect, useState } from "react";
import { MapPin, Flag } from "lucide-react";
import Header from "../../component/user/Header";
import bgImg from '../../assets/vector.png';
import { useNavigate, useSearchParams } from "react-router-dom";
import { FindAuidtorium, existingVenues, fetchAllExistingVouchers, getAllAuditoriums} from "../../api/userApi"; // Assuming getAllVenues exists based on logs

interface Voucher {
  _id: string;
  auditoriumId: string;
  voucherCode: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  audiName: string;
  limit: number;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  image: string;
  category: string;
  tag: string;
  locations: { name: string }[]; // Added to store all locations
  voucher?: Voucher;
}

const VenueSelector: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [district, setDistrict] = useState(searchParams.get("district") || "");
  const userLat = parseFloat(searchParams.get("latitude") || "0") || null;
  const userLon = parseFloat(searchParams.get("longitude") || "0") || null;
  const placeName = searchParams.get("place")?.toLowerCase() || "";
  const date = searchParams.get("date") || "";
  const event = searchParams.get("event") || "";
  const [radius, setRadius] = useState(searchParams.get("radius") || (userLat && userLon ? "20" : "0"));
  const [venues, setVenues] = useState<Venue[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [auditoriums, setAuditoriums] = useState<any[]>([]);
  const [venuesData, setVenuesData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const fetchVouchers = async () => {
    try {
      const response = await fetchAllExistingVouchers();
      console.log("Fetched vouchers:", response.data);
      setVouchers(response.data || []);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
      setVouchers([]);
    }
  };

  const fetchAuditoriums = async () => {
    try {
      const response = await getAllAuditoriums();
      console.log(response, 'lope');
      setAuditoriums(response.data || []);
    } catch (error) {
      console.error("Error fetching auditoriums:", error);
      setAuditoriums([]);
    }
  };

  const fetchVenuesData = async () => {
    try {
      const response = await existingVenues()
      console.log(response, 'venues');
      setVenuesData(response.data || []);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setVenuesData([]);
    }
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return value * Math.PI / 180;
  };

  useEffect(() => {
    fetchVouchers();
    fetchAuditoriums();
    fetchVenuesData();
  }, []);

  useEffect(() => {
    if (auditoriums.length === 0 || venuesData.length === 0) return;

    const selectedRadius = parseFloat(radius) || 0;

    let filtered = auditoriums.filter((aud: any) => {
      let matchesDistrict = true;
      if (district) {
        matchesDistrict = aud.district === district;
      }

      let matchesPlace = true;
      if (placeName) {
        matchesPlace = aud.locations.some((loc: any) => loc.name.toLowerCase().includes(placeName));
      }

      let matchesRadius = true;
      if (selectedRadius > 0 && userLat && userLon) {
        matchesRadius = aud.locations.some((loc: any) => {
          const dist = getDistance(userLat, userLon, loc.lat, loc.lon);
          return dist <= selectedRadius;
        });
      }

      return matchesDistrict && matchesPlace && matchesRadius;
    });

    if (filtered.length === 0) {
      filtered = auditoriums;
    }

    const mappedVenues: Venue[] = filtered.map((aud: any, index: number) => {
      const matchingVoucher = vouchers.find(
        (voucher) => voucher.auditoriumId === aud._id && voucher.isActive
      );
      const matchingVenues = venuesData.filter((v: any) => v.audiUserId === aud._id);
      const image = matchingVenues.length > 0 && matchingVenues[0].images && matchingVenues[0].images.length > 0 
        ? matchingVenues[0].images[0] 
        : "https://via.placeholder.com/400x300?text=No+Image+Available";

      return {
        id: aud._id,
        name: aud.auditoriumName || `Auditorium ${index + 1}`,
        location: aud.district || "Unknown Location",
        image,
        category: "Auditorium",
        tag: aud.tag || "Indoor", // Assuming tag might exist; default to "Indoor"
        locations: aud.locations || [], // Store all locations
        voucher: matchingVoucher,
      };
    });

    setVenues(mappedVenues);
  }, [district, radius, placeName, vouchers, auditoriums, venuesData, userLat, userLon]);

  const handleCardClick = (id: string) => {
    navigate(`/venuelist/${id}?date=${encodeURIComponent(date)}&event=${encodeURIComponent(event)}`);
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

  const openTermsModal = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <style>
        {`
          .voucher-badge {
            color: white;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            line-height: 1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            background-color: #10b981;
          }
          .voucher-card {
            position: absolute;
            bottom: 10px;
            right: 10px;
            width: 180px;
            height: 85px;
            display: flex;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            font-family: Arial, sans-serif;
            z-index: 10;
            border: 3px dashed #ED695A;
          }
          .voucher-left {
            width: 50px;
            background: linear-gradient(135deg, #ED695A 0%, #d85545 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          .voucher-code-vertical {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            color: white;
            font-weight: bold;
            font-size: 0.75rem;
            letter-spacing: 1px;
          }
          .voucher-right {
            flex: 1;
            background: linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%);
            padding: 8px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          .voucher-title {
            color: #5B4336;
            font-size: 0.7rem;
            font-weight: bold;
            margin-bottom: 3px;
            text-align: center;
          }
          .voucher-discount {
            color: #ef4444;
            font-size: 0.65rem;
            font-weight: 700;
            margin-bottom: 3px;
            text-align: center;
            line-height: 1.2;
          }
          .voucher-vendor {
            color: #5B4336;
            font-size: 0.6rem;
            display: flex;
            align-items: center;
            gap: 3px;
            margin-bottom: 3px;
          }
          .terms-link {
            color: #9c7c5d;
            font-size: 0.5rem;
            text-decoration: underline;
            cursor: pointer;
            text-align: center;
          }
          .voucher-card::before {
            content: '';
            position: absolute;
            left: 50%;
            top: -6px;
            transform: translateX(-50%);
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            box-shadow: inset 0 0 0 2px #ED695A;
          }
          .voucher-card::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -6px;
            transform: translateX(-50%);
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            box-shadow: inset 0 0 0 2px #ED695A;
          }
        `}
      </style>

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
              <p className="mt-6 text-[#6e3d2b] font-serif text-xl italic">
                Search Results for {district || "Any District"} - {radius === "0" ? "All" : radius} km Radius
              </p>
            </div>

            {/* Right Content - District and Radius in same line for desktop, stacked for mobile */}
            <div className="w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
              {/* Mobile: stacked */}
              <div className="flex flex-col sm:hidden space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif"
                  >
                    <option value="">Any District</option>
                    <option value="Alappuzha">Alappuzha</option>
                    <option value="Ernakulam">Ernakulam</option>
                    <option value="Idukki">Idukki</option>
                    <option value="Kannur">Kannur</option>
                    <option value="Kasaragod">Kasaragod</option>
                    <option value="Kollam">Kollam</option>
                    <option value="Kottayam">Kottayam</option>
                    <option value="Kozhikode">Kozhikode</option>
                    <option value="Malappuram">Malappuram</option>
                    <option value="Palakkad">Palakkad</option>
                    <option value="Pathanamthitta">Pathanamthitta</option>
                    <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                    <option value="Thrissur">Thrissur</option>
                    <option value="Wayanad">Wayanad</option>
                  </select>
                </div>

                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <select
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif"
                  >
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="20">20 km</option>
                    <option value="50">50 km</option>
                    <option value="100">100 km</option>
                    <option value="0">All</option>
                  </select>
                </div>
              </div>

              {/* Desktop: side by side */}
              <div className="hidden sm:flex space-x-4">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif"
                  >
                    <option value="">Any District</option>
                    <option value="Alappuzha">Alappuzha</option>
                    <option value="Ernakulam">Ernakulam</option>
                    <option value="Idukki">Idukki</option>
                    <option value="Kannur">Kannur</option>
                    <option value="Kasaragod">Kasaragod</option>
                    <option value="Kollam">Kollam</option>
                    <option value="Kottayam">Kottayam</option>
                    <option value="Kozhikode">Kozhikode</option>
                    <option value="Malappuram">Malappuram</option>
                    <option value="Palakkad">Palakkad</option>
                    <option value="Pathanamthitta">Pathanamthitta</option>
                    <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                    <option value="Thrissur">Thrissur</option>
                    <option value="Wayanad">Wayanad</option>
                  </select>
                </div>

                <div className="relative flex-1">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <select
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif"
                  >
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="20">20 km</option>
                    <option value="50">50 km</option>
                    <option value="100">100 km</option>
                    <option value="0">All</option>
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
                  {venue.voucher && (
                    <div className="absolute top-3 left-3 mt-10 voucher-badge">
                      EARN {venue.voucher.discountValue}
                      {venue.voucher.discountType === "percentage" ? "%" : "₹"} VOUCHER
                    </div>
                  )}
                  {venue.voucher && (
                    <div className="voucher-card">
                      <div className="voucher-left">
                        <div className="voucher-code-vertical">{venue.voucher.voucherCode}</div>
                      </div>
                      <div className="voucher-right">
                        <div className="voucher-title">Book now and grab a</div>
                        <div className="voucher-discount">
                          {venue.voucher.discountValue}
                          {venue.voucher.discountType === "percentage" ? "%" : "₹"} on your purchase
                        </div>
                        <div className="voucher-vendor">
                          <span>🎫</span>
                          <span>{venue.voucher.audiName}</span>
                        </div>
                        <div className="terms-link" onClick={(e) => { e.stopPropagation(); openTermsModal(venue.voucher!); }}>
                          click here for terms and conditions
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 font-serif">
                    {venue.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{venue.location}</span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    Locations: {venue.locations.map(loc => loc.name).join(', ') || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {venues.slice(4).map((venue) => (
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
                  {venue.voucher && (
                    <div className="absolute top-3 left-3 mt-10 voucher-badge">
                      EARN {venue.voucher.discountValue}
                      {venue.voucher.discountType === "percentage" ? "%" : "₹"} VOUCHER
                    </div>
                  )}
                  {venue.voucher && (
                    <div className="voucher-card">
                      <div className="voucher-left">
                        <div className="voucher-code-vertical">{venue.voucher.voucherCode}</div>
                      </div>
                      <div className="voucher-right">
                        <div className="voucher-title">Book now and grab a</div>
                        <div className="voucher-discount">
                          {venue.voucher.discountValue}
                          {venue.voucher.discountType === "percentage" ? "%" : "₹"} on your purchase
                        </div>
                        <div className="voucher-vendor">
                          <span>🎫</span>
                          <span>{venue.voucher.audiName}</span>
                        </div>
                        <div className="terms-link" onClick={(e) => { e.stopPropagation(); openTermsModal(venue.voucher!); }}>
                          click here for terms and conditions
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 font-serif">
                    {venue.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{venue.location}</span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    Locations: {venue.locations.map(loc => loc.name).join(', ') || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && selectedVoucher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 text-[#5B4336] font-serif">Terms and Conditions</h2>
              <p className="mb-2 text-gray-700 font-serif">
                <strong>Voucher Code:</strong> {selectedVoucher.voucherCode}
              </p>
              <p className="mb-2 text-gray-700 font-serif">
                <strong>Discount:</strong> {selectedVoucher.discountValue}
                {selectedVoucher.discountType === "percentage" ? "%" : "₹"}
              </p>
              <p className="mb-2 text-gray-700 font-serif">
                <strong>Valid From:</strong> {new Date(selectedVoucher.validFrom).toLocaleDateString()}
              </p>
              <p className="mb-2 text-gray-700 font-serif">
                <strong>Valid To:</strong> {new Date(selectedVoucher.validTo).toLocaleDateString()}
              </p>
              <p className="mb-2 text-gray-700 font-serif">
                <strong>Limit:</strong> {selectedVoucher.limit} uses
              </p>
              <p className="mb-2 text-gray-700 font-serif">
                <strong>Vendor Name:</strong> {selectedVoucher.audiName}
              </p>
              <p className="mb-2 text-gray-700 font-serif">
                <strong>Status:</strong> {selectedVoucher.isActive ? "Active" : "Inactive"}
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 bg-[#6e3d2b] text-white px-4 py-2 rounded-md font-medium hover:bg-[#5a2f20] font-serif"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueSelector;