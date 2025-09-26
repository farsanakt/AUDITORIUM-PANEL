
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
  cities: string[];
  images: string[];
  acType: string;
  seatingCapacity: string;
  tariff: { wedding: string; reception: string };
  phone: string;
  audiUserId: string;
  totalamount: string;
  advAmnt?: string; // Optional to handle typo
  advamnt?: string; // Handle typo in API response
  offer?: Offer;
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
      console.log("Auditorium API response:", JSON.stringify(auditoriumResponse.data, null, 2));
      console.log("Fetched offers:", JSON.stringify(offerResponse.data, null, 2));

      const currentDate = new Date();
      console.log("Current date:", currentDate.toISOString());

      const auditoriumData = Array.isArray(auditoriumResponse.data)
        ? auditoriumResponse.data.map((item: Auditorium) => {
            const matchingOffer = offerResponse.data.find(
              (offer: Offer) => {
                const isMatch = offer.userId === item.audiUserId && offer.isActive;
                console.log(
                  `Checking auditorium ${item._id}: audiUserId=${item.audiUserId}, offer.userId=${
                    offer.userId
                  }, isActive=${offer.isActive}, validFrom=${offer.validFrom}, validTo=${
                    offer.validTo
                  }, match=${isMatch}`
                );
                return isMatch;
              }
            );
            return {
              ...item,
              advAmnt: item.advAmnt || item.advamnt, // Handle typo
              offer: matchingOffer,
            };
          })
        : [];

      if (!auditoriumData.length) {
        throw new Error(`No auditoriums found with audiUserId: ${id}`);
      }
      console.log("Mapped auditoriums with offers:", JSON.stringify(auditoriumData, null, 2));
      setAuditoriums(auditoriumData);
      setOffers(offerResponse.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching auditoriums or offers:", err);
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

  const getFormattedPrice = (amount: string | undefined, offer?: Offer, isTotalAmount: boolean = false) => {
    console.log(`Formatting price:`, { amount, offer, isTotalAmount });
    if (!amount || isNaN(parseFloat(amount))) {
      console.warn(`Invalid price format: ${amount}`);
      return <span>Price not available</span>;
    }

    const originalPrice = parseFloat(amount);
    if (!offer || !isTotalAmount) {
      return <span>₹{originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
    }

    let discountedPrice: number;
    if (offer.discountType === "percentage") {
      discountedPrice = originalPrice * (1 - offer.discountValue / 100);
    } else {
      discountedPrice = originalPrice - offer.discountValue;
    }

    return (
      <div className="flex flex-col">
        <div>
          <span className="line-through text-gray-500 mr-2">
            ₹{originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-green-600">
            ₹{discountedPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <span className="text-xs text-green-600">
          ({offer.discountValue}{offer.discountType === "percentage" ? "%" : "₹"} off with {offer.offerCode})
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f4]">
        <p className="text-gray-600 text-xs sm:text-sm md:text-base">Loading...</p>
      </div>
    );
  }

  if (error || !auditoriums.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f4]">
        <p className="text-red-600 text-xs sm:text-sm md:text-base">{error || "No venues found."}</p>
      </div>
    );
  }

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
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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
          }
          .venue-image-container {
            position: relative;
            overflow: visible;
          }
        `}
      </style>
      {/* Header and Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden pt-8">
        <div
          className="absolute inset-0 w-full h-full bg-contain sm:bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgImg})`,
          }}
        ></div>
        <Header />

        {/* Content */}
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
            <button className="bg-[#6e3d2b] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md hover:bg-[#5a2f20] text-xs sm:text-sm md:text-base">
              View Details
            </button>
          </div>
        </div>
      </section>

      {/* Venue Result Section */}
      <div className="max-w-7xl mx-auto mt-8 sm:mt-12">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch">
          {/* Venue Image */}
          <div className="w-full md:w-1/3 venue-image-container rounded-2xl overflow-visible shadow-lg relative h-64 sm:h-80 md:h-96">
            <img
              src={auditoriums[0].images[currentImageIndex] || "/placeholder.svg?height=400&width=300"}
              alt={auditoriums[0].name}
              className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
              onError={(e) => {
                console.error("Error loading image:", auditoriums[0].images[currentImageIndex]);
                (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=300";
              }}
            />
            <span
              className={`absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full shadow ${
                auditoriums[0].acType.toLowerCase() === "ac"
                  ? "bg-blue-600"
                  : auditoriums[0].acType.toLowerCase() === "both"
                  ? "bg-purple-500"
                  : "bg-gray-500"
              }`}
            >
              {auditoriums[0].acType}
            </span>
            {auditoriums[0].offer && (
              <span className="coupon-badge">
                {auditoriums[0].offer.offerCode}
              </span>
            )}
          </div>

          {/* Venue Details */}
          <div className="w-full md:w-2/3 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#6e3d2b]">
                    {auditoriums[0].name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                    {auditoriums[0].cities.join(", ")}
                  </p>
                </div>
                <button className="bg-[#9c7c5d] text-white text-xs sm:text-sm md:text-base px-3 sm:px-4 py-2 rounded shadow hover:bg-[#483b2f] w-full sm:w-auto">
                  📞 {auditoriums[0].phone}
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mt-4 sm:mt-6">
                <table className="w-full text-xs sm:text-sm border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-[#6e3d2b] text-white text-left sticky top-0">
                    <tr>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 sm:min-w-[120px] font-semibold text-xs sm:text-sm">Venue Name</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 sm:min-w-[80px] font-semibold text-xs sm:text-sm">Type</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 sm:min-w-[80px] font-semibold text-xs sm:text-sm">Capacity</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 sm:min-w-[100px] font-semibold text-xs sm:text-sm">Total Amount</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 sm:min-w-[100px] font-semibold text-xs sm:text-sm">Advance Amount</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-4 sm:min-w-[80px] font-semibold text-xs sm:text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditoriums.map((auditorium, index) => (
                      <tr
                        key={auditorium._id}
                        className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                      >
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">{auditorium.name}</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">{auditorium.acType}</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">{auditorium.seatingCapacity}</td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                          {getFormattedPrice(auditorium.totalamount, auditorium.offer, true)}
                        </td>
                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                          {getFormattedPrice(auditorium.advAmnt, undefined)}
                        </td>
                        <td className="py-2 px-3 sm:px-4">
                          <button
                            className="px-5 py-2 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white rounded-full shadow-md hover:from-[#A0522D] hover:to-[#FF8C00] hover:shadow-lg transition-all duration-300 ease-in-out text-sm sm:text-base font-semibold tracking-wide whitespace-nowrap"
                            onClick={() => navigate(`/auditoriumdetails/${auditorium._id}?date=${encodeURIComponent(searchParams.get("date") || "")}`)}
                          >
                            Book Now
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

export default VenuePage