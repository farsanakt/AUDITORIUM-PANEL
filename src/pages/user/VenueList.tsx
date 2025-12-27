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
  locations: string[]; // ← Changed from `cities` to `locations`
  images: string[];
  acType: string;
  seatingCapacity: string;
  tariff: { wedding: string; reception: string };
  phone: string;
  audiUserId: string;
  totalamount: string;
  advAmnt?: string;
  advamnt?: string;
  offer?: Offer;
  isVerified?: boolean; // For filtering
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
            .filter((item: Auditorium) => item.isVerified === true) // Only verified
            .map((item: Auditorium) => {
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
                ...item,
                advAmnt: item.advAmnt || item.advamnt,
                offer: matchingOffer,
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

  const getFormattedPrice = (
    amount: string | undefined,
    offer?: Offer,
    isTotalAmount: boolean = false
  ) => {
    if (!amount || isNaN(parseFloat(amount))) {
      return <span className="text-gray-500">N/A</span>;
    }

    const originalPrice = parseFloat(amount);
    const formatted = originalPrice.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (!offer || !isTotalAmount) {
      return <span>₹{formatted}</span>;
    }

    const discountedPrice =
      offer.discountType === "percentage"
        ? originalPrice * (1 - offer.discountValue / 100)
        : originalPrice - offer.discountValue;

    const discountedFormatted = discountedPrice.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <div className="flex flex-col">
        <div>
          <span className="line-through text-gray-500 mr-2">₹{formatted}</span>
          <span className="text-green-600 font-bold">₹{discountedFormatted}</span>
        </div>
        <span className="text-xs text-green-600">
          {offer.discountValue}
          {offer.discountType === "percentage" ? "%" : "₹"} off • {offer.offerCode}
        </span>
      </div>
    );
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
            background: linear-gradient(135deg, #ff4d4f, #ff7878);
            color: white;
            font-weight: bold;
            padding: 8px;
            border-radius: 50%;
            font-size: 0.75rem;
            line-height: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: absolute;
            bottom: -40px;
            right: -40px;
            z-index: 10;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          .venue-image-container { position: relative; overflow: visible; }
        `}
      </style>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden pt-8">
        <div
          className="absolute inset-0 w-full h-full bg-contain sm:bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImg})` }}
        />
        <Header />

        <div className="relative z-20 w-full max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8 mt-12">
          <div className="text-left md:w-1/2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#5B4336] mb-3 sm:mb-4">
              Choose
            </h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#5B4336] mb-4 sm:mb-6">
              Your Venue
            </h1>
            <p className="text-gray-700 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">
              Your wedding venue sets the stage for one of the most memorable
              days of your life. Whether you envision an intimate garden
              ceremony, a grand ballroom reception, or a picturesque
              beachfront wedding, choosing the right venue is the first step
              in bringing your dream to life.
            </p>
            <button className="bg-[#6e3d2b] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md hover:bg-[#5a2f20] transition text-xs sm:text-sm md:text-base">
              View Details
            </button>
          </div>
        </div>
      </section>

      {/* Venue Details */}
      <div className="max-w-7xl mx-auto mt-8 sm:mt-12">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch">
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
            <span
              className={`absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full shadow font-medium ${
                primary.acType.toLowerCase() === "ac"
                  ? "bg-blue-600"
                  : primary.acType.toLowerCase() === "both"
                  ? "bg-purple-600"
                  : "bg-gray-600"
              }`}
            >
              {primary.acType}
            </span>
            {primary.offer && (
              <div className="coupon-badge">
                {primary.offer.offerCode}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full md:w-2/3 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#6e3d2b]">
                    {primary.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                    {safeLocations.length > 0 ? safeLocations.join(", ") : "Location not available"}
                  </p>
                </div>
                <a
                  href={`tel:${primary.phone}`}
                  className="bg-[#9c7c5d] text-white text-xs sm:text-sm md:text-base px-3 sm:px-4 py-2 rounded shadow hover:bg-[#8b6b4e] transition w-full sm:w-auto text-center"
                >
                  Call: {primary.phone}
                </a>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mt-4 sm:mt-6">
                <table className="w-full text-xs sm:text-sm border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-[#6e3d2b] text-white text-left">
                    <tr>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold">Venue Name</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold">Type</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold">Capacity</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold">Total Amount</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold">Advance</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditoriums.map((auditorium, index) => (
                      <tr
                        key={auditorium._id}
                        className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                      >
                        <td className="py-2 px-3 sm:px-4 font-medium">{auditorium.name}</td>
                        <td className="py-2 px-3 sm:px-4">{auditorium.acType}</td>
                        <td className="py-2 px-3 sm:px-4">{auditorium.seatingCapacity}</td>
                        <td className="py-2 px-3 sm:px-4">
                          {getFormattedPrice(auditorium.totalamount, auditorium.offer, true)}
                        </td>
                        <td className="py-2 px-3 sm:px-4">
                          {getFormattedPrice(auditorium.advAmnt)}
                        </td>
                        <td className="py-2 px-3 sm:px-0">
                          <button
                            className="px-5 py-2 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white rounded-full shadow-md hover:from-[#A0522D] hover:to-[#FF8C00] hover:shadow-lg transition-all duration-300 text-sm sm:text-base font-semibold tracking-wide"
                            onClick={() =>
                              navigate(
                                `/auditoriumdetails/${auditorium._id}?date=${encodeURIComponent(
                                  searchParams.get("date") || ""
                                )}`
                              )
                            }
                          >
                            View Details & Book Now
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
    </section>
  );
};

export default VenuePage;