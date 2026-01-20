import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../component/user/Header";
import Lines from "../../assets/Group 52 (1).png";
import Bshape from "../../assets/02 2.png";
import { singleVenueDetails, fetchAllExistingOffer } from "../../api/userApi";

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
  address: string;
  locations?: { name: string; lat: number; lon: number; district: string }[];
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
  totalamount: string;
  advAmnt?: string;
  advamnt?: string;
  offer?: Offer;
  youtubeLink?: string;
  termsAndConditions?: string[]; // e.g., ["cfff,ddd"]
  acAdvanceAmount?: string;
  acCompleteAmount?: string;
  nonAcAdvanceAmount?: string;
  nonAcCompleteAmount?: string;
  guestroom?: string;
  stageSize?: string;
  events?: string[];
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface PolicyCardProps {
  title: string;
  content: string;
  maxLines?: number;
}

interface ExpandableTextProps {
  content: string;
  maxLines?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ content, maxLines = 3 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Split by \r\n or \n to get actual lines
  const lines = content.split(/\r\n|\n/).filter(line => line.trim());
  const shouldShowMore = lines.length > maxLines;
  const displayLines = isExpanded ? lines : lines.slice(0, maxLines);

  return (
    <div>
      <div className="text-xs sm:text-sm md:text-base text-gray-700 text-left space-y-2">
        {displayLines.map((line, idx) => (
          <p key={idx} className="leading-relaxed">{line}</p>
        ))}
      </div>
      {shouldShowMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-[#9c7c5d] hover:text-[#d85c4e] font-medium text-xs sm:text-sm transition-colors"
        >
          {isExpanded ? '↑ Show Less' : '↓ Show More'}
        </button>
      )}
    </div>
  );
};

const PolicyCard: React.FC<PolicyCardProps> = ({ title, content, maxLines = 3 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Split by \r\n or \n to get actual lines from backend
  const lines = content.split(/\r\n|\n/).filter(line => line.trim());
  const shouldShowMore = lines.length > maxLines;
  const displayLines = isExpanded ? lines : lines.slice(0, maxLines);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
      <h4 className="font-semibold text-base md:text-lg text-[#2A2929] mb-3 text-left">{title}</h4>
      <div className="text-xs sm:text-sm md:text-base text-gray-700 text-left space-y-2">
        {displayLines.map((line, idx) => (
          <p key={idx} className="leading-relaxed">{line}</p>
        ))}
      </div>
      {shouldShowMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-[#9c7c5d] hover:text-[#d85c4e] font-medium text-xs sm:text-sm transition-colors"
        >
          {isExpanded ? '↑ Show Less' : '↓ Show More'}
        </button>
      )}
    </div>
  );
};


const AuditoriumDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [auditorium, setAuditorium] = useState<Auditorium | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  const findVenueDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching venue details with id:", id);
      const [venueResponse, offerResponse] = await Promise.all([
        singleVenueDetails(id!),
        fetchAllExistingOffer(),
      ]);
      console.log("Venue API Response:", JSON.stringify(venueResponse.data, null, 2));
      console.log("Fetched offers:", JSON.stringify(offerResponse.data, null, 2));

      if (!venueResponse.data) {
        throw new Error(`No venue found with id: ${id}`);
      }

      const currentDate = new Date();
      console.log("Current date:", currentDate.toISOString());

      const matchingOffer = offerResponse.data.find((offer: Offer) => {
        const isMatch = offer.userId === venueResponse.data.audiUserId && offer.isActive;
        console.log(
          `Checking auditorium ${venueResponse.data._id}: audiUserId=${venueResponse.data.audiUserId}, offer.userId=${
            offer.userId
          }, isActive=${offer.isActive}, validFrom=${offer.validFrom}, validTo=${offer.validTo}, match=${isMatch}`
        );
        return isMatch;
      });

      const auditoriumData = {
        ...venueResponse.data,
        advAmnt: venueResponse.data.acAdvanceAmount || venueResponse.data.nonAcAdvanceAmount || venueResponse.data.advAmnt || venueResponse.data.advamnt,
        totalamount: venueResponse.data.acCompleteAmount || venueResponse.data.nonAcCompleteAmount || venueResponse.data.tariff?.wedding || venueResponse.data.tariff?.reception || "0",
        locations: venueResponse.data.locations?.map((loc: any) => loc.name) || [],
        offer: matchingOffer,
        termsAndConditions: venueResponse.data.termsAndConditions || [],
      };
      console.log("Mapped auditorium with offer:", JSON.stringify(auditoriumData, null, 2));
      setAuditorium(auditoriumData);
      setOffers(offerResponse.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching venue details or offers:", err);
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
        setCurrent((prev) => (prev + 1) % auditorium?.images.length);
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
    const date = searchParams.get("date") || "";
    const event = searchParams.get("event") || "";
    navigate(`/bookings/${id}?date=${encodeURIComponent(date)}&event=${encodeURIComponent(event)}`);
  };

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
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F1]">
        <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
      </div>
    );
  }

  if (error || !auditorium) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F1]">
        <p className="text-red-600 text-sm sm:text-base">{error || "No venue found."}</p>
      </div>
    );
  }

  // Parse comma-separated terms: ["cfff,ddd"] → ["cfff", "ddd"]
  const parseTerms = (terms: string[] = []): string[] => {
    const result: string[] = [];
    terms.forEach((term) => {
      if (typeof term === "string" && term.includes(",")) {
        const parts = term.split(",").map((t) => t.trim()).filter((t) => t);
        result.push(...parts);
      } else if (term && term.trim()) {
        result.push(term.trim());
      }
    });
    return result;
  };

  const termsList = parseTerms(auditorium.termsAndConditions);

  return (
    <div className="bg-[#FDF8F1] min-h-screen">
      <style>
        {`
          .offer-badge {
            background-color: #ef4444;
            color: white;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            line-height: 1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .location-card {
            min-height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .location-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        `}
      </style>
      <img
        src={Lines || "/placeholder.svg"}
        alt="Lines"
        className="absolute top-0 left-0 h-full object-cover mt-0 z-0 sm:scale-150 scale-125"
        style={{ maxWidth: "none" }}
      />
      <div className="relative z-10 p-2 sm:p-4">
        <Header />

        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
          {/* Headline */}
          <div className="mb-2 sm:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-left font-bold text-[#5B4336]">
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
            <span className="text-xs sm:text-sm md:text-base text-[#5B4336]">
              {auditorium.address},{' '}
              {Array.isArray(auditorium.locations) && auditorium.locations.length > 0
                ? auditorium.locations.map(loc => loc.name).join(", ")
                : "City not specified"}{' '}
              {auditorium.pincode}
            </span>
          </div>

          {/* Image Card */}
          <div className="mb-6 sm:mb-8">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
              <img
                src={auditorium.images[current] || "/placeholder.svg?height=400&width=600"}
                alt={`Slide ${current + 1}`}
                className="w-full h-48 sm:h-64 md:h-80 lg:h-[400px] object-cover transition-all duration-700 ease-in-out"
                onError={(e) => {
                  console.error("Error loading image:", auditorium.images[current]);
                  (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=600";
                }}
              />
              {auditorium.offer && (
                <span className="absolute top-2 sm:top-3 left-3 offer-badge">
                  {auditorium.offer.discountValue}
                  {auditorium.offer.discountType === "percentage" ? "%" : "₹"} OFF
                </span>
              )}
              {auditorium.images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-2 sm:left-3 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white p-2 sm:p-3 rounded-full z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                    aria-label="Previous image"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-2 sm:right-3 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white p-2 sm:p-3 rounded-lg z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                    aria-label="Next image"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            {auditorium.images.length > 1 && (
              <div className="mt-3 sm:mt-4 flex justify-center items-center gap-2 sm:gap-3 overflow-x-auto px-2 sm:px-4 scrollbar-hide">
                {auditorium.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`h-12 w-16 sm:h-16 sm:w-24 md:h-20 md:w-28 rounded-md overflow-hidden border transition-all duration-200 ${
                      index === current ? "border-[#b09d94] shadow-md" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img src={img || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* About Venue and Booking Button */}
          <div className="flex flex-col lg:flex-row justify-between items-start mb-6 sm:mb-8 gap-4 lg:gap-6">
            <div className="flex-1 lg:pr-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#5B4336] mt-4 sm:mt-6 mb-3">
                About Venue
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 text-left">
                {auditorium.name} is located at {auditorium.address}, {auditorium.district}, {auditorium.pincode}. 
                It offers {auditorium.acType} facilities with a seating capacity of {auditorium.seatingCapacity} and dining capacity of {auditorium.diningCapacity}.
                Available events: {auditorium.events?.join(", ") || "N/A"}.
                Amenities include: {auditorium.amenities.join(", ")}.
                Stage size: {auditorium.stageSize || "N/A"}.
                Guest rooms: {auditorium.guestroom || "N/A"}.
                Changing rooms: {auditorium.changingRooms}.
                Parking slots: {auditorium.parkingSlots}.
                Time slots: {auditorium.timeSlots.map(slot => slot.label).join(", ")}.
                Created at: {new Date(auditorium.createdAt || "").toLocaleDateString()}.
                Updated at: {new Date(auditorium.updatedAt || "").toLocaleDateString()}.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <button
                onClick={handleBooking}
                className="bg-[#9c7c5d] hover:bg-[#d85c4e] mt-4 sm:mt-6 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors flex items-center space-x-2 w-full lg:w-auto justify-center text-xs sm:text-sm md:text-base"
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
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-left text-[#49516F] mt-6 sm:mt-8 mb-3 sm:mb-4">
              Contact
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A2929] mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">{auditorium.phone}</span>
              </div>
              {auditorium.altPhone && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A2929] mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">{auditorium.altPhone}</span>
                </div>
              )}
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A2929] mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xs sm:text-sm md:text-base text-[#2A2929]">{auditorium.email}</span>
              </div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="relative z-10">
            <img
              src={Bshape || "/placeholder.svg"}
              alt="Lines"
              className="absolute bottom-0 left-[-40px] sm:left-[-60px] h-[80%] sm:h-[90%] object-cover z-0"
              style={{ maxWidth: "none" }}
            />
            <div className="bg-white border mt-6 sm:mt-8 md:mt-10 border-gray-200 rounded-xl shadow-sm p-3 sm:p-4 md:p-6 text-gray-800 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base">
                {/* Lodging */}
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">Lodging</h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>{auditorium.guestroom ? "Rooms Available" : "No Rooms Available"}</li>
                    <li>
                      Number of rooms: <span className="font-semibold">{auditorium.guestroom || "0"}</span>
                    </li>
                    <li>
                      Average price: <span className="font-semibold">Contact for details</span>
                    </li>
                  </ul>
                </div>

                {/* Changing Rooms */}
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">Changing Rooms</h4>
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
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">Amenities</h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>
                      <span className="text-gray-500">Parking:</span>{" "}
                      <span className="font-semibold">{auditorium.parkingSlots ? `${auditorium.parkingSlots} Slots` : "Not Available"}</span>
                    </li>
                    <li>Halls are {auditorium.acType === "AC" || auditorium.acType === "Both" ? "Air Conditioned" : "Non-Air Conditioned"}</li>
                    {auditorium.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>

                {/* Decoration and Food Policy */}
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">Decoration & Food</h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Decoration: <span className="font-semibold">{auditorium.decorPolicy}</span></li>
                    <li>Food: <span className="font-semibold">{auditorium.foodPolicy}</span></li>
                    <li>Cancellation: <span className="font-semibold">{auditorium.cancellationPolicy}</span></li>
                  </ul>
                </div>

                {/* Pricing */}
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">Pricing</h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>
                      Total Amount: {getFormattedPrice(auditorium.totalamount, auditorium.offer, true)}
                    </li>
                    <li>
                      Advance Amount: {getFormattedPrice(auditorium.advAmnt, undefined, false)}
                    </li>
                    <li>
                      AC Advance: {getFormattedPrice(auditorium.acAdvanceAmount, undefined, false)}
                    </li>
                    <li>
                      AC Complete: {getFormattedPrice(auditorium.acCompleteAmount, auditorium.offer, true)}
                    </li>
                    <li>
                      Non-AC Advance: {getFormattedPrice(auditorium.nonAcAdvanceAmount, undefined, false)}
                    </li>
                    <li>
                      Non-AC Complete: {getFormattedPrice(auditorium.nonAcCompleteAmount, auditorium.offer, true)}
                    </li>
                    <li>Tariff Wedding: {getFormattedPrice(auditorium.tariff?.wedding, undefined, false)}</li>
                    <li>Tariff Reception: {getFormattedPrice(auditorium.tariff?.reception, undefined, false)}</li>
                  </ul>
                </div>

                {/* Other Details */}
                <div>
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-[#2A2929] mb-2 text-left">Other Details</h4>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Stage Size: {auditorium.stageSize || "N/A"}</li>
                    <li>Events: {auditorium.events?.join(", ") || "N/A"}</li>
                    <li>Time Slots: {auditorium.timeSlots.map(slot => slot.label).join(", ")}</li>
                    <li>Created At: {new Date(auditorium.createdAt || "").toLocaleDateString()}</li>
                    <li>Updated At: {new Date(auditorium.updatedAt || "").toLocaleDateString()}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 md:mt-12 max-w-6xl mx-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-left text-[#5B4336] mb-4 sm:mb-6">
              Venue Policies
            </h2>

            {/* Food Policy */}
            {auditorium.foodPolicy && (
              <PolicyCard title="Food Policy" content={auditorium.foodPolicy} maxLines={3} />
            )}

            {/* Decoration Policy */}
            {auditorium.decorPolicy && (
              <PolicyCard title="Decoration Policy" content={auditorium.decorPolicy} maxLines={3} />
            )}

            {/* Cancellation Policy */}
            {auditorium.cancellationPolicy && (
              <PolicyCard title="Cancellation Policy" content={auditorium.cancellationPolicy} maxLines={3} />
            )}

            {/* Terms & Conditions */}
            {termsList.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
                <h4 className="font-semibold text-base md:text-lg text-[#2A2929] mb-3 text-left">
                  Terms & Conditions
                </h4>
                <ExpandableText 
                  content={termsList.join("\n")}
                  maxLines={3}
                />
              </div>
            )}
          </div>

          {/* Location Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-left text-[#5B4336] mt-6 sm:mt-8 md:mt-10 mb-3 sm:mb-4">
              Location
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 location-card">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <div className="order-1">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#9c7c5d] mb-3 sm:mb-4 text-left">
                    Venue Video
                  </h3>
                  <div className="relative w-full h-88 location-content">
                    {auditorium.youtubeLink ? (
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={auditorium.youtubeLink.replace("watch?v=", "embed/").split("&")[0]}
                        title="Venue Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="bg-gray-200 rounded-lg h-full flex items-center justify-center">
                        <p className="text-gray-500 font-medium text-xs sm:text-sm md:text-base">No video available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="order-2">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#9c7c5d] mb-3 sm:mb-4 text-left">
                    Address Details
                  </h3>
                  <div className="space-y-2 sm:space-y-3 location-content">
                    <div className="flex items-start space-x-2 sm:space-x-3">
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
                        <p className="font-medium text-gray-800 text-xs sm:text-sm md:text-base">{auditorium.name}</p>
                        <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                          {auditorium.address},{' '}
                          {Array.isArray(auditorium.locations) && auditorium.locations.length > 0
                            ? auditorium.locations.map(loc => loc.name).join(", ")
                            : "City not specified"}{' '}
                          {auditorium.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base">Easily accessible by public transport</p>
                    </div>
                    <div className="bg-gray-200 rounded-lg h-40 sm:h-48 md:h-64 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                      <div className="text-center">
                        <svg
                          className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-gray-500 font-medium text-xs sm:text-sm md:text-base">View on Map</p>
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
    </div>
  );
};

export default AuditoriumDetails;