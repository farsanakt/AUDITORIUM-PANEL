import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../component/user/Header";
import bgImg from "../../assets/vector.png";
import { FetchAuditoriumById, fetchAllExistingOffer } from "../../api/userApi";

interface Offer {
  _id: string;
  userId: string;
  offerCode: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

interface Auditorium {
  _id: string;
  name: string;
  locations: string[];
  images: string[];
  acType: string;
  seatingCapacity: string;
  tariff: { wedding: string; reception: string };
  phone: string;
  audiUserId: string;
  bookingAmount: string; // ✅ Single booking amount
  offer?: Offer;
  isVerified?: boolean; // For filtering
  isPriceNegotiationNeeded?: boolean;
}

const VenuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchAuditoriums = async () => {
    try {
      setLoading(true);
      const [auditoriumResponse, offerResponse] = await Promise.all([
        FetchAuditoriumById(id!),
        fetchAllExistingOffer(),
      ]);

      console.log("Auditorium API:", JSON.stringify(auditoriumResponse.data, null, 2));
      console.log("Offers API:", JSON.stringify(offerResponse.data, null, 2));

      const currentDate = new Date();

      const auditoriumData = Array.isArray(auditoriumResponse.data)
        ? auditoriumResponse.data
            .filter((item: any) => item.isVerified === true) // Only verified
            .map((item: any) => {
              const matchingOffer = offerResponse.data.find((offer: Offer) => {
                const validFrom = new Date(offer.validFrom);
                const validTo = new Date(offer.validTo);
                const isDateValid = validFrom <= currentDate && validTo >= currentDate;

                return (
                  offer.userId === item.audiUserId &&
                  offer.isActive &&
                  isDateValid
                );
              });

              return {
                _id: item._id,
                name: item.name,
                locations: item.locations.map((loc: any) => loc.name), // Map to location names
                images: item.images,
                acType: item.acType,
                seatingCapacity: item.seatingCapacity,
                tariff: item.tariff,
                phone: item.phone,
                audiUserId: item.audiUserId,
                bookingAmount: item.bookingAmount || "0", // ✅ Only the booking amount is shown
                offer: matchingOffer,
                isVerified: item.isVerified,
                isPriceNegotiationNeeded: item.isPriceNegotiationNeeded,
              };
            })
        : [];

      if (!auditoriumData.length) {
        throw new Error("No verified venues found.");
      }

      setAuditoriums(auditoriumData);
      setOffers(offerResponse.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load venue.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAuditoriums();
    else {
      setError("Invalid venue ID.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (auditoriums.length > 0 && auditoriums[0].images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === auditoriums[0].images.length - 1 ? 0 : prev + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [auditoriums]);

  const getFormattedPrice = (amount: string | undefined) => {
    if (!amount || isNaN(parseFloat(amount))) {
      return <span className="text-gray-400 italic">N/A</span>;
    }

    const formatted = parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // ✅ Only the plain booking amount is shown — offer percentage appears as a badge, never as a discounted price
    return <span className="font-semibold text-[#5B4336]">₹{formatted}</span>;
  };

  // === EARLY RETURNS ===
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f4]">
        <p className="text-gray-600 animate-pulse">Loading venue...</p>
      </div>
    );
  }

  if (error || !auditoriums.length || !auditoriums[0]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f4] px-4">
        <p className="text-red-600 text-center">{error || "No verified venues found."}</p>
      </div>
    );
  }

  // === SAFE DATA EXTRACTION ===
  const primary = auditoriums[0];
  const safeLocations = Array.isArray(primary.locations) ? primary.locations : [];
  const safeImages = Array.isArray(primary.images) ? primary.images : [];

  return (
    <section className="min-h-screen bg-[#fff9f4] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <style>
        {`
          .coupon-badge {
            background: linear-gradient(135deg, #ED695A, #ff8f7d);
            color: white;
            font-weight: bold;
            padding: 8px;
            border-radius: 50%;
            font-size: 0.7rem;
            line-height: 1rem;
            box-shadow: 0 6px 16px rgba(237, 105, 90, 0.45);
            width: 84px;
            height: 84px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: absolute;
            bottom: -38px;
            right: -30px;
            z-index: 10;
            border: 3px solid #fff9f4;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          .venue-image-container { position: relative; overflow: visible; }
          .elegant-card {
            background: #ffffff;
            border: 1px solid rgba(156, 124, 93, 0.18);
            border-radius: 1.25rem;
            box-shadow: 0 10px 30px rgba(91, 67, 54, 0.08);
          }
          .elegant-table th {
            white-space: nowrap;
          }
          .elegant-table td {
            vertical-align: middle;
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden pt-8">
        <div
          className="absolute inset-0 w-full h-full bg-contain sm:bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImg})` }}
        />
        <Header />

        <div className="relative z-20 w-full max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8 md:gap-10 mt-12">
          <div className="text-left md:w-1/2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#5B4336] mb-3 sm:mb-4 italic">
              Choose
            </h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-[#5B4336] mb-4 sm:mb-6 tracking-tight">
              Your Venue
            </h1>
            <div className="h-0.5 w-16 bg-[#9c7c5d] opacity-60 mb-4 sm:mb-6" />
            <p className="text-gray-700 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg">
              Your wedding venue sets the stage for one of the most memorable
              days of your life. Whether you envision an intimate garden
              ceremony, a grand ballroom reception, or a picturesque
              beachfront wedding, choosing the right venue is the first step
              in bringing your dream to life.
            </p>
          </div>
        </div>
      </section>

      {/* Venue Details */}
      <div className="max-w-7xl mx-auto mt-8 sm:mt-12">
        <div className="elegant-card p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-stretch">
            {/* Image */}
            <div className="w-full md:w-1/3 venue-image-container rounded-2xl overflow-visible shadow-lg relative h-64 sm:h-80 md:h-96">
              <img
                src={safeImages[currentImageIndex] || "/placeholder.svg?height=400&width=300"}
                alt={primary.name}
                className="w-full h-full object-cover rounded-2xl transition-opacity duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=300";
                }}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <span
                className={`absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white text-xs sm:text-sm px-3 py-1 rounded-full shadow font-medium tracking-wide ${
                  primary.acType.toLowerCase() === "ac"
                    ? "bg-blue-600/90"
                    : primary.acType.toLowerCase() === "both"
                    ? "bg-purple-600/90"
                    : "bg-gray-600/90"
                }`}
              >
                {primary.acType}
              </span>
              {primary.offer && (
                <div className="coupon-badge">
                  {primary.offer.discountType === "percentage"
                    ? `${primary.offer.discountValue}% OFF`
                    : `₹${primary.offer.discountValue} OFF`}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="w-full md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pb-4 border-b border-[#9c7c5d]/15">
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold font-serif text-[#6e3d2b] tracking-tight">
                      {primary.name}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-1 uppercase tracking-wide">
                      {safeLocations.length > 0 ? safeLocations.join(", ") : "Location not available"}
                    </p>
                  </div>
                  <a
                    href={`tel:${primary.phone}`}
                    className="bg-[#9c7c5d] text-white text-xs sm:text-sm md:text-base px-4 sm:px-5 py-2.5 rounded-full shadow-md hover:bg-[#8b6b4e] hover:shadow-lg transition-all w-full sm:w-auto text-center font-medium tracking-wide"
                  >
                    Call: {primary.phone}
                  </a>
                </div>

                {/* Table */}
                <div className="overflow-x-auto mt-5 sm:mt-7 rounded-xl border border-[#9c7c5d]/20 shadow-sm">
                  <table className="elegant-table w-full text-xs sm:text-sm overflow-hidden min-w-max">
                    <thead className="bg-[#6e3d2b] text-white text-left">
                      <tr>
                        <th className="py-3 sm:py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px] sm:text-xs">Venue Name</th>
                        <th className="py-3 sm:py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px] sm:text-xs">Type</th>
                        <th className="py-3 sm:py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px] sm:text-xs">Capacity</th>
                        <th className="py-3 sm:py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px] sm:text-xs">Booking Amount</th>
                        <th className="py-3 sm:py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px] sm:text-xs text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditoriums.map((auditorium, index) => (
                        <tr
                          key={auditorium._id}
                          className={`border-t border-[#9c7c5d]/10 ${index % 2 === 0 ? "bg-white" : "bg-[#fff9f4]"} hover:bg-[#f7efe5] transition-colors`}
                        >
                          <td className="py-3 px-4 sm:px-5 font-semibold text-[#5B4336]">{auditorium.name}</td>
                          <td className="py-3 px-4 sm:px-5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                                auditorium.acType === "AC"
                                  ? "bg-blue-100 text-blue-800"
                                  : auditorium.acType === "Non-AC"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {auditorium.acType}
                            </span>
                          </td>
                          <td className="py-3 px-4 sm:px-5 text-gray-700">{auditorium.seatingCapacity}</td>
                          <td className="py-3 px-4 sm:px-5">
                            <div className="flex items-center">
                              {getFormattedPrice(auditorium.bookingAmount)}
                              {auditorium.isPriceNegotiationNeeded && (
                                <span className="text-blue-600 text-[10px] sm:text-xs font-medium ml-2">(Negotiable)</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 sm:px-5 text-center">
                            <button
                              className="px-5 py-2 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white rounded-full shadow-md hover:from-[#A0522D] hover:to-[#FF8C00] hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-semibold tracking-wide w-full sm:w-auto whitespace-nowrap"
                              onClick={() =>
                                navigate(
                                  `/auditoriumdetails/${auditorium._id}?date=${encodeURIComponent(
                                    searchParams.get("date") || ""
                                  )}&event=${encodeURIComponent(searchParams.get("event") || "")}`
                                )
                              }
                            >
                              View Details &amp; Book Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenuePage;