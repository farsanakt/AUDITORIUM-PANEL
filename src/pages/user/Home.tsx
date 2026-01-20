'use client';

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { MapPin, Calendar, Flag, Search, ChevronLeft, ChevronRight, Star, X } from "lucide-react"
import Header from "../../component/user/Header"
import bgImg from "../../assets/Rectangle 50.png"
import pjct from "../../assets/image 16.png"
import pjct1 from "../../assets/Rectangle 30.png"
import dum from '../../assets/dum3.webp'
import dumm from '../../assets/dum2.jpg'
import dum1 from '../../assets/dum2.jpg'
import dum2 from '../../assets/dum4.jpg'
import dum3 from '../../assets/dum5.jpg'
import dum4 from '../../assets/dum6.jpg'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { existingVenues, fetchAllExistingOffer, fetchAllExistingVouchers, fetchAllVendors, getItems } from "../../api/userApi"
import LocationAutocomplete from "../../component/LocationAutocomplete/LocationAutocomplete" 
import Footer from "../../component/user/Footer"
import { LocationResult } from "../../component/LocationAutocomplete/types"
import { Project } from "../../types/project"; 

const Toast = ({ message, type = "error", onClose }: { message: string; type?: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${type === "error" ? "bg-red-600" : "bg-green-600"}`}>
      {message}
    </div>
  );
};

interface Service {
  id: number
  title: string
  description: string
  image: string
}

interface Artist {
  id: number
  name: string
  role: string
  image: string
  rating: number
  location: string
  review: string
  startingPrice?: string
}

interface Offer {
  _id: string
  userId: string
  offerCode: string
  discountType: "percentage" | "fixed"
  discountValue: number
  validFrom: string
  validTo: string
  isActive: boolean
}

interface Voucher {
  _id: string
  auditoriumId: string
  voucherCode: string
  discountType: "percentage" | "fixed"
  discountValue: number
  validFrom: string
  validTo: string
  isActive: boolean
  audiName: string
  limit: number
}

interface Venue {
  id: string
  name: string
  location: string
  images: string[]
  price: string
  rating: number
  review: string
  audiUserId: string
  offer?: Offer
  voucher?: Voucher
}

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    district: "",
    place: "",
    date: "",
    event: "",
    location: "",
    latitude: "",
    longitude: "",
  })
  const [venues, setVenues] = useState<Venue[]>([])
  const [vendorsByType, setVendorsByType] = useState<Record<string, Artist[]>>({})
  const [vendorTypes, setVendorTypes] = useState<string[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [vendorLoading, setVendorLoading] = useState<boolean>(true)
  const [vendorError, setVendorError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null)
  const [showAd, setShowAd] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [adImages, setAdImages] = useState<string[]>([])
  const [heroCurrentSlide, setHeroCurrentSlide] = useState<number>(0)
  const navigate = useNavigate()

  const { currentUser } = useSelector((state: any) => state.auth);
  const displayName = currentUser?.email ? currentUser.email.split('@')[0] : '';

  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [loadingDropdowns, setLoadingDropdowns] = useState<boolean>(true)
  const [projectImages, setProjectImages] = useState<Project[]>([])

  const venuesRef = useRef<HTMLDivElement>(null)
  const vendorRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const adTimerRef = useRef<NodeJS.Timeout | null>(null)
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const heroSlideTimerRef = useRef<NodeJS.Timeout | null>(null)


  const heroImages = [dumm,bgImg, dum1,dum3,dum4]; 

  const fetchALLExitingItems = async () => {
    try {
      const response = await getItems('hi')
      console.log("Admin items response:", response.data)
      
      if (response.data?.success && response.data?.items?.events) {
        const events = response.data.items.events.filter((e: string) => e && e.trim()).sort()
        setEventTypes(events)
      }
    } catch (error) {
      console.error("Error fetching admin items:", error)
    }
  }

  // Fetch project images from backend
  const fetchProjectImages = async () => {
    try {
      // Replace with your actual API endpoint
      // For now, using local fallback
      const defaultProjects: Project[] = [
        {
          id: 1,
          title: "Romantic Beach Wedding",
          image: pjct1,
          category: "Beach Wedding",
        },
        {
          id: 2,
          title: "Garden Party Reception",
          image: dum1,
          category: "Garden Wedding",
        },
        {
          id: 3,
          title: "Grand Ballroom Event",
          image: dum,
          category: "Ballroom Wedding",
        },
      ]
      setProjectImages(defaultProjects)
    } catch (error) {
      console.error("Error fetching project images:", error)
    }
  }

  useEffect(() => {
    fetchProjectImages()
  }, [])

  const fetchAllOffers = async () => {
    try {
      const response = await fetchAllExistingOffer()
      console.log("Fetched offers:", response.data)
      setOffers(response.data || [])
    } catch (err) {
      console.error("Error fetching offers:", err)
      setError("Failed to load offers. Please try again.")
      setOffers([])
    }
  }

  const fetchAllVouchers = async () => {
    try {
      const response = await fetchAllExistingVouchers()
      console.log("Fetched vouchers:", response.data)
      setVouchers(response.data || [])
    } catch (err) {
      console.error("Error fetching vouchers:", err)
      setError("Failed to load vouchers. Please try again.")
      setVouchers([])
    }
  }

  const fetchVenues = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await existingVenues()
      console.log("Venues API response:", response.data)
      const mappedVenues = response.data
        .filter((venue: any) => venue.isVerified === true)
        .map((venue: any) => {
          const matchingOffer = offers.find((offer) => offer.userId === venue.audiUserId && offer.isActive)
          const matchingVoucher = vouchers.find(
            (voucher) => voucher.auditoriumId === venue.audiUserId && voucher.isActive,
          )
          return {
            id: venue._id || venue.id || "unknown-" + Math.random().toString(36).substring(2),
            name: venue.name || venue.venueName || "Unknown Venue",
            location: venue.address || "Unknown Location",
            images:
              venue.images && Array.isArray(venue.images) && venue.images.length > 0
                ? venue.images
                : ["/placeholder.svg?height=200&width=300"],
            price: venue.totalamount || venue.tariff?.wedding || "Price not available",
            rating: venue.rating || 4.5,
            review: venue.review || "Great venue with excellent amenities!",
            audiUserId: venue.audiUserId || "",
            offer: matchingOffer,
            voucher: matchingVoucher,
          }
        })
      console.log("Mapped venues:", mappedVenues)
      setVenues(mappedVenues)
    } catch (err) {
      console.error("Error fetching venues:", err)
      setError("Failed to load venues. Please try again.")
      setVenues([])
    } finally {
      setLoading(false)
    }
  }

  const fetchVendors = async () => {
    try {
      setVendorLoading(true)
      setVendorError(null)
      const response = await fetchAllVendors()
      console.log("Vendors API response:", response.data)
      const vendors = response.data

      const groupedVendors: Record<string, Artist[]> = {}
      vendors.forEach((v: any) => {
        const type = v.vendorType.toLowerCase()
        if (!groupedVendors[type]) {
          groupedVendors[type] = []
        }
        groupedVendors[type].push({
          id: v._id || v.id || "unknown-" + Math.random().toString(36).substring(2),
          name: v.name,
          role: capitalizeWords(type),
          image: v.images[0] || "/placeholder.svg",
          rating: v.rating || 4.5,
          location:
            v.cities && v.cities.length > 0
              ? v.cities[0]
              : v.address && v.address !== "No address provided"
                ? v.address
                : "Unknown",
          review: v.review || "",
          startingPrice: v.startingPrice || "N/A",
        })
      })

      const types = Object.keys(groupedVendors).sort()
      setVendorTypes(types)
      setVendorsByType(groupedVendors)
      console.log("Grouped Vendors:", groupedVendors)
    } catch (err) {
      console.error("Error fetching vendors:", err)
      setVendorError("Failed to load vendors. Please try again.")
    } finally {
      setVendorLoading(false)
    }
  }

 
  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Helper to get pluralized section title
  const getSectionTitle = (type: string) => {
    const capitalized = capitalizeWords(type)
    if (capitalized.endsWith("er") || capitalized.endsWith("or")) {
      return capitalized + "s"
    } else if (capitalized === "Event Management") {
      return "Event Management"
    } else if (capitalized === "Makeup Artist") {
      return "Makeup Artists"
    }
    return capitalized
  }


  const getSectionDescription = (type: string) => {
    if (type === "event management") {
      return "Our expert event management teams ensure every detail of your special day is perfectly executed."
    } else if (type === "makeup artist") {
      return "Transform your look with our skilled makeup artists for your special occasion."
    } else if (type === "caterer") {
      return "Our caterers provide delicious and customized menus for your event."
    } else if (type === "decorator") {
      return "Our decorators create beautiful and thematic setups for your special occasions."
    }
    return `Explore our ${getSectionTitle(type).toLowerCase()} for your event needs.`
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchAllOffers(), fetchAllVouchers(), fetchVendors()])
    }
    loadData()
  }, [])

  useEffect(() => {
    fetchVenues()
  }, [offers, vouchers])

  useEffect(() => {
    const loadDropdownData = async () => {
      setLoadingDropdowns(true)
      await fetchALLExitingItems()
      setLoadingDropdowns(false)
    }
    loadDropdownData()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    
    adTimerRef.current = setTimeout(() => {
      setShowAd(true)
     
      adTimerRef.current = setInterval(() => {
        setShowAd(true)
        setCurrentSlide(0)
      }, 600000) 
    }, 10000) 
    return () => {
      if (adTimerRef.current) clearTimeout(adTimerRef.current)
    }
  }, [])

  // Auto-slide carousel for projects
  useEffect(() => {
    if (projectImages.length > 1) {
      slideTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % projectImages.length)
      }, 5000) // Change slide every 5 seconds
      return () => {
        if (slideTimerRef.current) clearInterval(slideTimerRef.current)
      }
    }
  }, [projectImages])

  // Auto-slide for hero section
  useEffect(() => {
    if (heroImages.length > 1) {
      heroSlideTimerRef.current = setInterval(() => {
        setHeroCurrentSlide((prev) => (prev + 1) % heroImages.length)
      }, 5000) // Change every 5 seconds
      return () => {
        if (heroSlideTimerRef.current) clearInterval(heroSlideTimerRef.current)
      }
    }
  }, [heroImages.length])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLocationSelect = (location: LocationResult) => {
    const parts = location.displayName.split(',').map(p => p.trim());
    if (parts.length < 3 || parts[2] !== "Kerala") {
      setToast({ message: "Please select a location in Kerala.", type: "error" });
      return;
    }
    setFormData(prev => ({
      ...prev,
      location: location.displayName,
      place: parts[0],
      district: parts[1],
      latitude: location.latitude ? location.latitude.toString() : "",
      longitude: location.longitude ? location.longitude.toString() : "",
    }));
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    const { district, place, date, event, latitude, longitude } = formData
    if (!district || !place || !date || !event) {
      setToast({ message: "Please fill in all fields: location, date, and event.", type: "error" })
      return
    }
    navigate(
      `/auditoriumlist?district=${encodeURIComponent(district)}&place=${encodeURIComponent(place)}&date=${encodeURIComponent(date)}&event=${encodeURIComponent(event)}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`,
    )
  }

  const scrollLeft = (type: string) => {
    if (vendorRefs.current[type]) {
      vendorRefs.current[type]?.scrollBy({ left: -300, behavior: "smooth" })
    } else if (type === "venues" && venuesRef.current) {
      venuesRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = (type: string) => {
    if (vendorRefs.current[type]) {
      vendorRefs.current[type]?.scrollBy({ left: 300, behavior: "smooth" })
    } else if (type === "venues" && venuesRef.current) {
      venuesRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const handleSectionClick = (section: string) => {
    setActiveSection(section)
    const sectionElement = document.getElementById(section)
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openTermsModal = (voucher: Voucher) => {
    setSelectedVoucher(voucher)
    setIsModalOpen(true)
  }

  const getFormattedPrice = (venue: Venue) => {
    if (!venue.price || venue.price === "Price not available") {
      return <span>{venue.price}</span>
    }

    const originalPrice = Number.parseFloat(venue.price)
    if (isNaN(originalPrice)) {
      return <span>{venue.price}</span>
    }

    let discountedPrice = originalPrice
    let discountText = ""

    if (venue.offer) {
      if (venue.offer.discountType === "percentage") {
        discountedPrice *= 1 - venue.offer.discountValue / 100
      } else {
        discountedPrice -= venue.offer.discountValue
      }
      discountText = `${venue.offer.discountValue}${venue.offer.discountType === "percentage" ? "%" : "₹"} off with ${venue.offer.offerCode}`
    }

    let voucherText = ""
    if (venue.voucher) {
      voucherText = `Earn ${venue.voucher.discountValue}${venue.voucher.discountType === "percentage" ? "%" : "₹"} voucher (${venue.voucher.voucherCode}) for vendor bookings`
    }

    return (
      <div className="flex flex-col">
        {venue.offer ? (
          <div>
            <span className="line-through text-gray-500 mr-2">₹{originalPrice.toFixed(2)}</span>
            <span className="text-green-600">₹{discountedPrice.toFixed(2)}</span>
          </div>
        ) : (
          <span className="text-green-600">₹{originalPrice.toFixed(2)}</span>
        )}
        {discountText && <span className="text-xs text-green-600">{discountText}</span>}
        {voucherText && <span className="text-xs text-blue-600 mt-1">{voucherText}</span>}
      </div>
    )
  }

  const renderVendorSection = (type: string) => {
    const vendors = vendorsByType[type] || []
    const sectionId = type.replace(/\s+/g, "")

    if (vendors.length === 0) return null

    return (
      <section key={type} id={sectionId} className="py-12 sm:py-16 lg:py-20 w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-left mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
              {getSectionTitle(type)}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl">
              {getSectionDescription(type)}
            </p>
          </div>

          {vendorLoading ? (
            <div className="text-center text-gray-600">Loading {type} vendors...</div>
          ) : vendorError ? (
            <div className="text-center text-red-600">{vendorError}</div>
          ) : vendors.length === 0 ? (
            <div className="text-center text-gray-600">No {type} vendors available.</div>
          ) : (
            <div className="relative">
              {vendors.length > 4 && (
                <div className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 z-10">
                  <button
                    onClick={() => scrollLeft(type)}
                    className="scroll-button bg-[#9c7c5d] text-white rounded-full p-2 sm:p-3 hover:bg-[#8b6b4a] transition duration-300"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              )}
              <div
                ref={(el) => (vendorRefs.current[type] = el)}
                className="scroll-container flex overflow-x-auto space-x-4 sm:space-x-6 pb-4"
              >
                {vendors.map((artist, index) => (
                  <div
                    key={artist.id}
                    className="group rounded-xl overflow-hidden hover:shadow-xl transition duration-300 transform opacity-0 scale-95 flex-shrink-0 w-[240px] sm:w-[280px]"
                    style={{
                      animation: `fadeInScale 0.6s ease ${index * 0.15}s forwards`,
                    }}
                  >
                    <div className="relative h-48 sm:h-56">
                      <img
                        src={artist.image || "/placeholder.svg"}
                        alt={artist.name}
                        className="w-full h-full object-cover rounded-xl cursor-pointer z-20"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log(`Navigating to vendor details with ID: ${artist.id}`)
                          if (artist.id) {
                            try {
                              navigate(`/vendordetails/${artist.id}`)
                            } catch (err) {
                              console.error("Navigation error:", err)
                              alert("Failed to navigate to vendor details. Please try again.")
                            }
                          } else {
                            console.error("Vendor ID is undefined")
                            alert("Vendor ID is missing.")
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition duration-300 rounded-xl pointer-events-none"></div>
                    </div>
                    <div className="p-3 text-left card-content transition-transform duration-300">
                      <h3 className="text-lg sm:text-xl font-medium text-[#5B4336]">{artist.name}</h3>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <MapPin className="h-4 w-4 text-gray-600 mr-1" />
                        {artist.location}
                      </p>
                      <div className="text-sm text-gray-600 mb-1">Starting Price: ₹{artist.startingPrice}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{artist.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {vendors.length > 4 && (
                <div className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 z-10">
                  <button
                    onClick={() => scrollRight(type)}
                    className="scroll-button bg-[#9c7c5d] text-white rounded-full p-2 sm:p-3 hover:bg-[#8b6b4a] transition duration-300"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="text-right mt-6">
            <button
              onClick={() => navigate(`/vendorslist?type=${type}`)}
              className="px-4 py-2 bg-gray-200 text-[#9c7c5d] rounded-lg hover:bg-gray-300 transition duration-300"
            >
              View All
            </button>
          </div>
        </div>
      </section>
    )
  }

  const closeAd = () => {
    setShowAd(false)
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-screen relative">
      {/* Ad Banner Modal */}
      {showAd && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 w-full">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fade-in">
            {/* Close Button */}
            <button
              onClick={closeAd}
              className="absolute top-4 right-4 z-10 bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white rounded-full p-2 transition duration-300"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Ad Banner with Blurred Background */}
            <div className="relative h-60 sm:h-80 w-full overflow-hidden">
              {/* Blurred Background Image */}
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center blur-sm"
                style={{
                  backgroundImage: `url(${bgImg})`,
                }}
              ></div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Ad Content */}
              <div className="relative h-full flex items-center justify-center p-4">
                {adImages.length > 0 ? (
                  <img
                    src={adImages[0] || "/placeholder.svg"}
                    alt="Special Offer"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="text-center text-white">
                    <h3 className="text-3xl sm:text-4xl font-bold mb-4">Special Offer</h3>
                    <p className="text-lg sm:text-xl">Get exclusive deals on your wedding services!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ad Info Section */}
            <div className="p-6 sm:p-8 bg-white">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#5B4336] mb-3">Limited Time Offer</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Book your wedding with us today and get up to 30% off on your selected services. Don't miss this amazing opportunity!
              </p>
              <button className="w-full bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                Claim Offer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          .scroll-container {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
          .scroll-container::-webkit-scrollbar {
            display: none;
          }
          .scroll-button {
            opacity: 0.7;
            transition: opacity 0.3s;
          }
          .scroll-button:hover {
            opacity: 1;
          }
          @keyframes fadeInScale {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .group:hover .card-content {
            transform: translateY(-5px);
          }
          .offer-badge, .voucher-badge {
            color: white;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            line-height: 1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            pointer-events: none;
          }
          .offer-badge {
            background-color: #ef4444;
          }
          .voucher-badge {
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
            pointer-events: none;
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
            pointer-events: auto;
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
          @keyframes marquee {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
            display: flex;
          }
        `}
      </style>

      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
                index === heroCurrentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${image})` }}
            ></div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 w-full h-full pointer-events-none"></div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 w-full">
          <Header />
        </div>

        {/* Welcome Message - Top Center (only if logged in) */}
        {currentUser && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 text-center">
            <div
              className={`text-xl sm:text-xl md:text-xl font-medium text-[#9c7c5d] transition-all duration-1000 delay-600 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Welcome back, {displayName}!
            </div>
          </div>
        )}

        {/* Main Hero Content */}
        <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 pt-32 sm:pt-36">
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-left space-y-4 sm:space-y-6 lg:space-y-8 mb-8 lg:mb-0">
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl font-light text-amber-900 leading-tight transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <div
                className={`transition-all duration-1000 delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Make Every Moment
              </div>
              <div
                className={`transition-all duration-1000 delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Unforgettable!
              </div>
            </h1>

            <div
              className={`text-[#9c7c5d] text-xs sm:text-sm font-medium space-y-1 transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div>HURRY UP TO</div>
              <div>BOOK YOUR WEDDING</div>
            </div>
          </div>

          <div
            className={`w-full lg:w-1/2 flex flex-col items-center lg:items-end justify-center space-y-4 sm:space-y-6 text-center lg:text-right transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
           <div className="w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4">

  {/* ---------- MOBILE VIEW ---------- */}
  <div className="flex flex-col sm:hidden space-y-3">

    <LocationAutocomplete
      value={formData.location}
      placeholder="Enter your location"
      onSelect={handleLocationSelect}
    />

    {/* DATE FIELD (UPDATED) */}
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
      <input
        type="text"
        name="date"
        value={formData.date}
        placeholder="Select your venue date"
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => {
          if (!e.target.value) e.target.type = "text"
        }}
        onChange={handleInputChange}
        min={new Date().toISOString().split("T")[0]}
        className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>

    <div className="relative">
      <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
      <select
        name="event"
        value={formData.event}
        onChange={handleInputChange}
        disabled={loadingDropdowns}
        className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <option value="">Select Event</option>
        {eventTypes.map((event) => (
          <option key={event} value={event}>{event}</option>
        ))}
      </select>
    </div>

    <button
      onClick={handleSubmit}
      disabled={loadingDropdowns}
      className="h-10 px-4 w-full bg-[#9c7c5d] text-white rounded-md font-medium hover:bg-[#8b6b4a] transition duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
    >
      <span>Find Venues</span>
      <Search className="w-4 h-4" />
    </button>
  </div>

  {/* ---------- DESKTOP VIEW ---------- */}
  <div className="hidden sm:grid grid-cols-2 gap-3 sm:gap-4">

    <div className="col-span-2">
      <LocationAutocomplete
        value={formData.location}
        placeholder="Enter your location"
        onSelect={handleLocationSelect}
      />
    </div>

    {/* DATE FIELD (UPDATED) */}
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
      <input
        type="text"
        name="date"
        value={formData.date}
        placeholder="Select your venue date"
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => {
          if (!e.target.value) e.target.type = "text"
        }}
        onChange={handleInputChange}
        min={new Date().toISOString().split("T")[0]}
        className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>

    <div className="relative">
      <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
      <select
        name="event"
        value={formData.event}
        onChange={handleInputChange}
        disabled={loadingDropdowns}
        className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <option value="">Select Event</option>
        {eventTypes.map((event) => (
          <option key={event} value={event}>{event}</option>
        ))}
      </select>
    </div>

    <button
      onClick={handleSubmit}
      disabled={loadingDropdowns}
      className="h-10 sm:h-12 px-4 w-full col-span-2 bg-[#9c7c5d] text-white rounded-md font-medium hover:bg-[#8b6b4a] transition duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
    >
      <span>Find Venues</span>
      <Search className="w-4 h-4" />
    </button>

  </div>
</div>


            <div
              className={`text-[#9c7c5d] text-xs sm:text-sm font-medium space-y-1 transition-all duration-1000 delay-800 cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div onClick={() => handleSectionClick("venues")}>VENUE</div>
              {vendorTypes.map((type) => (
                <div
                  key={type}
                  onClick={() => handleSectionClick(type.replace(/\s+/g, ""))}
                >
                  {getSectionTitle(type).toUpperCase()}
                </div>
              ))}
              <div onClick={() => handleSectionClick("projects")}>DESIGNS</div>
              <div onClick={() => handleSectionClick("all")} className="mt-2">
                SHOW ALL
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 flex items-center gap-2 sm:gap-4 z-40">
          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border border-gray-400 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
            </div>
            <span>Restart</span>
          </div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium">{heroCurrentSlide + 1}/{heroImages.length}</div>
        </div>

        {/* Hero Navigation Arrows */}
        {heroImages.length > 1 && (
          <>
            <button
              onClick={() => setHeroCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white rounded-full p-2 sm:p-3 transition duration-300 opacity-70 hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => setHeroCurrentSlide((prev) => (prev + 1) % heroImages.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white rounded-full p-2 sm:p-3 transition duration-300 opacity-70 hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </section>

      {(activeSection === "all" || activeSection === "venues") && (
        <section id="venues" className="py-12 sm:py-16 lg:py-20 w-full bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-right mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
                Perfect Venues
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl ml-auto">
                Choose from our collection of stunning venues that will provide the perfect backdrop for your wedding.
                Book and earn vouchers for your vendor bookings!
              </p>
            </div>

            {loading ? (
              <div className="text-center text-gray-600">Loading venues...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : venues.length === 0 ? (
              <div className="text-center text-gray-600">No verified venues available.</div>
            ) : (
              <div className="relative">
                {venues.length > 4 && (
                  <div className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 z-10">
                    <button
                      onClick={() => scrollLeft("venues")}
                      className="scroll-button bg-[#9c7c5d] text-white rounded-full p-2 sm:p-3 hover:bg-[#8b6b4a] transition duration-300"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                )}
                <div
                  ref={venuesRef}
                  className="scroll-container flex overflow-x-auto overflow-y-visible space-x-4 sm:space-x-6 pb-4"
                >
                  {venues.map((venue, index) => (
                    <div
                      key={venue.id}
                      className={`group rounded-xl overflow-visible hover:shadow-xl transition duration-300 transform opacity-0 scale-95 flex-shrink-0 w-[240px] sm:w-[280px]`}
                      style={{
                        animation: `fadeInScale 0.6s ease ${index * 0.15}s forwards`,
                      }}
                    >
                      <div className="relative h-48 sm:h-56 overflow-visible">
                        <img
                          src={venue.images[0] || "/placeholder.svg"}
                          alt={venue.name}
                          className="w-full h-full object-cover rounded-xl cursor-pointer z-20"
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log(`Navigating to venue details with ID: ${venue.id}`)
                            if (venue.id) {
                              try {
                                navigate(`/auditoriumdetails/${venue.id}`)
                              } catch (err) {
                                console.error("Navigation error:", err)
                                alert("Failed to navigate to venue details. Please try again.")
                              }
                            } else {
                              console.error("Venue ID is undefined")
                              alert("Venue ID is missing.")
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition duration-300 rounded-xl pointer-events-none"></div>
                        <div className="absolute top-2 left-2 space-y-1 z-10">
                          {venue.offer && (
                            <div className="offer-badge">
                              {venue.offer.discountValue}
                              {venue.offer.discountType === "percentage" ? "%" : "₹"} OFF
                            </div>
                          )}
                          {venue.voucher && (
                            <div className="voucher-badge">
                              EARN {venue.voucher.discountValue}
                              {venue.voucher.discountType === "percentage" ? "%" : "₹"} VOUCHER
                            </div>
                          )}
                        </div>
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
                              <div className="terms-link" onClick={() => openTermsModal(venue.voucher!)}>
                                click here for terms and conditions
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-3 text-left card-content transition-transform duration-300 pt-10 sm:pt-12">
                        <h3 className="text-lg sm:text-xl font-medium text-[#5B4336]">{venue.name}</h3>
                        <p className="text-gray-600 text-sm flex items-center mb-1">
                          <MapPin className="h-4 w-4 text-gray-600 mr-1" />
                          {venue.location}
                        </p>
                        <div className="text-sm text-gray-600 mb-1">{getFormattedPrice(venue)}</div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{venue.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {venues.length > 4 && (
                  <div className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 z-10">
                    <button
                      onClick={() => scrollRight("venues")}
                      className="scroll-button bg-[#9c7c5d] text-white rounded-full p-2 sm:p-3 hover:bg-[#8b6b4a] transition duration-300"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {(activeSection === "all" || vendorTypes.includes(activeSection)) && (
        <>
          {vendorTypes.map((type) => renderVendorSection(type))}
        </>
      )}

      {(activeSection === "all" || activeSection === "projects") && (
        <section id="projects" className="py-12 sm:py-16 lg:py-20 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

            {/* Image Carousel */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
                Our Beautiful Designs
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our stunning collection of wedding projects and designs.
              </p>
            </div>

            {projectImages.length > 0 && (
              <div className="relative w-full h-60 sm:h-80 lg:h-[400px] mb-8 rounded-2xl overflow-hidden group">
                {/* Carousel Container */}
                <div className="relative w-full h-full">
                  {projectImages.map((project, index) => (
                    <div
                      key={project.id}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300"></div>
                      
                      {/* Caption Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-end p-6 sm:p-8 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-center text-balance">
                          {project.title}
                        </h3>
                        <span className="bg-[#9c7c5d] text-white px-4 py-2 rounded-full text-sm font-medium">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {projectImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + projectImages.length) % projectImages.length)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white rounded-full p-2 sm:p-3 transition duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % projectImages.length)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white rounded-full p-2 sm:p-3 transition duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                {projectImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 bg-black/40 px-4 py-2 rounded-full">
                    {projectImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition duration-300 ${
                          index === currentSlide ? "bg-[#9c7c5d] scale-125" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {(activeSection === "all" || activeSection === "services") && (
        <section id="services" className="py-12 sm:py-16 lg:py-20 bg-gray-50 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
                Our Services
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl">
                We specialize in creating seamless, unforgettable events tailored to your vision. From corporate
                gatherings and weddings to private celebrations and brand activations, our expert team ensures every
                detail is flawlessly executed.
              </p>
            </div>
          </div>
        </section>
      )}

      {(activeSection === "all" || activeSection === "projects") && (
        <section id="projects" className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
                Our Projects
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl">
                Take a look at some of our recent wedding projects and get inspired for your own special day
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projectImages.map((project) => (
                <div
                  key={project.id}
                  className="group rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 sm:h-56 lg:h-64">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition duration-300"></div>
                  </div>

                  <div className="p-4 sm:p-6 text-left">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#5B4336] mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{project.category}</p>
                    <button className="bg-[#9c7c5d] text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm hover:bg-[#8b6b4a] transition duration-300">
                      View Gallery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeSection === "all" && (
        <section id="categories" className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-8 text-center">
              Event Categories
            </h2>
            <div className="overflow-hidden">
              <div className="animate-marquee">
                {eventTypes.concat(eventTypes).map((event, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 mx-4 sm:mx-8 w-32 h-32 sm:w-48 sm:h-48 bg-[#9c7c5d] text-white rounded-full flex items-center justify-center text-center text-base sm:text-lg font-medium shadow-xl hover:bg-[#8b6b4a] transition duration-300 cursor-pointer"
                  >
                    {event}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {isModalOpen && selectedVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-[#5B4336]">Terms and Conditions</h2>
            <p className="mb-2 text-gray-700">
              <strong>Voucher Code:</strong> {selectedVoucher.voucherCode}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Discount:</strong> {selectedVoucher.discountValue}
              {selectedVoucher.discountType === "percentage" ? "%" : "₹"}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Valid From:</strong> {new Date(selectedVoucher.validFrom).toLocaleDateString()}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Valid To:</strong> {new Date(selectedVoucher.validTo).toLocaleDateString()}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Limit:</strong> {selectedVoucher.limit} uses
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Vendor Name:</strong> {selectedVoucher.audiName}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Status:</strong> {selectedVoucher.isActive ? "Active" : "Inactive"}
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-[#9c7c5d] text-white px-4 py-2 rounded-md font-medium hover:bg-[#8b6b4a] transition duration-300 w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Full Width Footer */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  )
}

export default HomePage