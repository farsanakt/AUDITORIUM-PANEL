'use client';

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { MapPin, Search, ChevronLeft, ChevronRight, Star, X, Sparkles } from "lucide-react"
import Header from "../../component/user/Header"
import bgImg from "../../assets/Rectangle 50.png"
import pjct1 from "../../assets/Rectangle 30.png"
import dum from '../../assets/dum3.webp'
import dumm from '../../assets/dum2.jpg'
import dum1 from '../../assets/dum2.jpg'
import dum3 from '../../assets/dum5.jpg'
import dum4 from '../../assets/dum6.jpg'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { existingVenues, fetchAllExistingOffer, fetchAllExistingVouchers, fetchAllVendors, getItems } from "../../api/userApi"
import LocationAutocomplete from "../../component/LocationAutocomplete/LocationAutocomplete" 
import Footer from "../../component/user/Footer"
import { LocationResult } from "../../component/LocationAutocomplete/types"

interface Project {
  id: number;
  title: string;
  image: string;
  category: string;
}

const Toast = ({ message, type = "error", onClose }: { message: string; type?: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-xl shadow-2xl text-white font-medium ${type === "error" ? "bg-red-500/90 backdrop-blur" : "bg-emerald-600/90 backdrop-blur"} animate-fade-in-up flex items-center gap-3`}>
      {message}
    </div>
  );
};

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

interface RootState {
  auth: {
    currentUser: any;
  }
}

const HomePage: React.FC = () => {
  const [formData, setFormData] = useState({
    district: "",
    place: "",
    date: "",
    event: "",
    location: "",
    latitude: "",
    longitude: "",
  })
  
  const [restoreKey, setRestoreKey] = useState(0) // Forces LocationAutocomplete re-mount after login

  const [venues, setVenues] = useState<Venue[]>([])
  const [vendorsByType, setVendorsByType] = useState<Record<string, Artist[]>>({})
  const [vendorTypes, setVendorTypes] = useState<string[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [vendorLoading, setVendorLoading] = useState<boolean>(true)

  const [activeSection, setActiveSection] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null)
  const [showAd, setShowAd] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [heroCurrentSlide, setHeroCurrentSlide] = useState<number>(0)
  const navigate = useNavigate()

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const displayName = currentUser?.email ? currentUser.email.split('@')[0] : '';
  
  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [loadingDropdowns, setLoadingDropdowns] = useState<boolean>(true)
  const [projectImages, setProjectImages] = useState<Project[]>([])

  const venuesRef = useRef<HTMLDivElement>(null)
  const adTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heroSlideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const heroImages = [dumm, bgImg, dum1, dum3, dum4]; 

  useEffect(() => {
    const pendingSearch = sessionStorage.getItem("pendingSearch");
    if (pendingSearch && currentUser) {
      try {
        const parsedData = JSON.parse(pendingSearch);
        setFormData(parsedData);
        setRestoreKey(prev => prev + 1); // Force re-render of LocationAutocomplete
        sessionStorage.removeItem("pendingSearch");
      } catch (e) {
        console.error("Failed to parse pending search data", e);
      }
    }
  }, [currentUser]);

  const fetchALLExitingItems = async () => {
    try {
      const response = await getItems('hi')
      if (response.data?.success && response.data?.items?.events) {
        const events = response.data.items.events.filter((e: string) => e && e.trim()).sort()
        setEventTypes(events)
      }
    } catch (error) {
      console.error("Error fetching admin items:", error)
    }
  }

  const fetchProjectImages = async () => {
    try {
      const defaultProjects: Project[] = [
        { id: 1, title: "Romantic Beach", image: pjct1, category: "Beach Wedding" },
        { id: 2, title: "Garden Party", image: dum1, category: "Garden Wedding" },
        { id: 3, title: "Grand Ballroom", image: dum, category: "Ballroom Wedding" },
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
      setOffers(response.data || [])
    } catch (err) {
      console.error("Error fetching offers:", err)
      setOffers([])
    }
  }

  const fetchAllVouchers = async () => {
    try {
      const response = await fetchAllExistingVouchers()
      setVouchers(response.data || [])
    } catch (err) {
      console.error("Error fetching vouchers:", err)
      setVouchers([])
    }
  }

  const fetchVenues = async () => {
    try {
      setLoading(true)
      const response = await existingVenues()
      const mappedVenues = response.data
        .filter((venue: any) => venue.isVerified === true)
        .map((venue: any) => {
          const matchingOffer = offers.find((offer) => offer.userId === venue.audiUserId && offer.isActive)
          const matchingVoucher = vouchers.find((voucher) => voucher.auditoriumId === venue.audiUserId && voucher.isActive)
          return {
            id: venue._id || venue.id || "unknown-" + Math.random().toString(36).substring(2),
            name: venue.name || venue.venueName || "Unknown Venue",
            location: venue.address || "Unknown Location",
            images: venue.images && Array.isArray(venue.images) && venue.images.length > 0 ? venue.images : ["/placeholder.svg?height=200&width=300"],
            price: venue.totalamount || venue.tariff?.wedding || "Price not available",
            rating: venue.rating || 4.5,
            review: venue.review || "Great venue with excellent amenities!",
            audiUserId: venue.audiUserId || "",
            offer: matchingOffer,
            voucher: matchingVoucher,
          }
        })
      setVenues(mappedVenues)
    } catch (err) {
      console.error("Error fetching venues:", err)
      setVenues([])
    } finally {
      setLoading(false)
    }
  }

  const fetchVendors = async () => {
    try {
      setVendorLoading(true)
      const response = await fetchAllVendors()
      const vendors = response.data

      const groupedVendors: Record<string, Artist[]> = {}
      vendors.forEach((v: any) => {
        const type = v.vendorType.toLowerCase()
        if (!groupedVendors[type]) groupedVendors[type] = []
        groupedVendors[type].push({
          id: v._id || v.id || "unknown-" + Math.random().toString(36).substring(2),
          name: v.name,
          role: capitalizeWords(type),
          image: v.images[0] || "/placeholder.svg",
          rating: v.rating || 4.5,
          location: v.cities?.[0] || v.address !== "No address provided" ? v.address : "Unknown",
          review: v.review || "",
          startingPrice: v.startingPrice || "N/A",
        })
      })

      const types = Object.keys(groupedVendors).sort()
      setVendorTypes(types)
      setVendorsByType(groupedVendors)
    } catch (err) {
      console.error("Error fetching vendors:", err)
    } finally {
      setVendorLoading(false)
    }
  }

  const capitalizeWords = (str: string) => str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")

  const getSectionTitle = (type: string) => {
    const capitalized = capitalizeWords(type)
    if (capitalized.endsWith("er") || capitalized.endsWith("or")) return capitalized + "s"
    if (capitalized === "Event Management") return "Event Management"
    if (capitalized === "Makeup Artist") return "Makeup Artists"
    return capitalized
  }

  const getSectionDescription = (type: string) => {
    if (type === "event management") return "Expert planning for your perfect day."
    if (type === "makeup artist") return "Enhance your beauty with professional artistry."
    if (type === "caterer") return "Exquisite menus tailored to your taste."
    if (type === "decorator") return "Stunning setups for memorable occasions."
    return `Premium ${getSectionTitle(type).toLowerCase()} services.`
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
    adTimerRef.current = setTimeout(() => {
      setShowAd(true)
      adTimerRef.current = setInterval(() => {
        setShowAd(true)
        setCurrentSlide(0)
      }, 600000)
    }, 10000)
    return () => { if (adTimerRef.current) clearTimeout(adTimerRef.current) }
  }, [])

  useEffect(() => {
    if (projectImages.length > 1) {
      slideTimerRef.current = setInterval(() => setCurrentSlide(prev => (prev + 1) % projectImages.length), 5000)
      return () => { if (slideTimerRef.current) clearInterval(slideTimerRef.current) }
    }
  }, [projectImages])

  useEffect(() => {
    if (heroImages.length > 1) {
      heroSlideTimerRef.current = setInterval(() => setHeroCurrentSlide(prev => (prev + 1) % heroImages.length), 6000)
      return () => { if (heroSlideTimerRef.current) clearInterval(heroSlideTimerRef.current) }
    }
  }, [heroImages.length])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
      latitude: location.lat ? location.lat.toString() : "",
      longitude: location.lon ? location.lon.toString() : "",
    }));
    setRestoreKey(prev => prev + 1);
  }

  const handleSubmit = () => {
    const { district, place, date, event, latitude, longitude } = formData
    if (!currentUser) {
      sessionStorage.setItem("pendingSearch", JSON.stringify(formData));
      setToast({ message: "Please log in to continue searching.", type: "error" });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (!district || !place || !date || !event) {
      setToast({ message: "Please fill in all fields.", type: "error" })
      return
    }
    navigate(`/auditoriumlist?district=${encodeURIComponent(district)}&place=${encodeURIComponent(place)}&date=${encodeURIComponent(date)}&event=${encodeURIComponent(event)}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`)
  }

  const scrollLeft = (type: string) => {
    const container = document.getElementById(`scroll-container-${type}`);
    if (container) container.scrollBy({ left: -280, behavior: "smooth" });
  }

  const scrollRight = (type: string) => {
    const container = document.getElementById(`scroll-container-${type}`);
    if (container) container.scrollBy({ left: 280, behavior: "smooth" });
  }

  const openTermsModal = (voucher: Voucher) => {
    setSelectedVoucher(voucher)
    setIsModalOpen(true)
  }

  const getFormattedPrice = (venue: Venue) => {
    if (!venue.price || venue.price === "Price not available") return <span className="text-gray-500 italic text-sm">{venue.price}</span>
    const originalPrice = Number.parseFloat(venue.price)
    if (isNaN(originalPrice)) return <span className="text-gray-500 italic text-sm">{venue.price}</span>

    let discountedPrice = originalPrice
    if (venue.offer) {
      if (venue.offer.discountType === "percentage") {
        discountedPrice *= 1 - venue.offer.discountValue / 100
      } else {
        discountedPrice -= venue.offer.discountValue
      }
    }

    return (
      <div className="flex flex-col">
        {venue.offer ? (
          <div className="flex items-center gap-2">
            <span className="line-through text-gray-400 text-xs">₹{originalPrice.toFixed(0)}</span>
            <span className="text-emerald-700 font-bold text-base">₹{discountedPrice.toFixed(0)}</span>
          </div>
        ) : (
          <span className="text-gray-800 font-bold text-base">₹{originalPrice.toFixed(0)}</span>
        )}
      </div>
    )
  }

  const renderVendorSection = (type: string) => {
    const vendors = vendorsByType[type] || []
    const sectionId = `${type.toLowerCase().replace(/\s+/g, "-")}`

    return (
      <section key={type} id={sectionId} className="py-12 w-full bg-white border-b border-gray-50 last:border-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-end mb-6 animate-fade-in-up">
            <div>
              <h2 className="text-3xl font-bold text-[#5B4336] mb-1 font-serif tracking-tight">{getSectionTitle(type)}</h2>
              <p className="text-gray-500 font-sans text-sm tracking-wide uppercase">{getSectionDescription(type)}</p>
            </div>
            {vendors.length > 4 && (
              <div className="flex gap-2">
                <button onClick={() => scrollLeft(type)} className="p-2 rounded-full border border-gray-200 text-gray-500 hover:border-[#9c7c5d] hover:text-[#9c7c5d] transition"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => scrollRight(type)} className="p-2 rounded-full border border-gray-200 text-gray-500 hover:border-[#9c7c5d] hover:text-[#9c7c5d] transition"><ChevronRight className="w-5 h-5" /></button>
              </div>
            )}
          </div>

          {vendorLoading ? (
            <div className="flex space-x-4 overflow-hidden py-2">
              {[1,2,3,4].map(i => <div key={i} className="min-w-[260px] h-[320px] bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center text-gray-400 py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No {type} vendors currently available.</div>
          ) : (
            <div id={`scroll-container-${type}`} className="scroll-container flex overflow-x-auto space-x-5 pb-6 snap-x snap-mandatory min-h-[400px]">
              {vendors.map((artist, index) => (
                <div key={artist.id} className="flex-shrink-0 w-[260px] sm:w-[280px] bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 snap-center border border-gray-100 group cursor-pointer hover-lift flex flex-col justify-between" onClick={() => navigate(`/vendordetails/${artist.id}`)} style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Vendor card content unchanged */}
                  <div>
                    <div className="relative h-56 overflow-hidden rounded-t-lg">
                      <img src={artist.image || "/placeholder.svg"} alt={artist.name} className="w-full h-full object-cover animate-zoom-subtle" />
                      <div className="absolute top-2 right-2 badge-premium px-2 py-0.5 rounded text-[10px] font-bold text-[#5B4336] flex items-center uppercase tracking-wider">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" /> {artist.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-[#5B4336] mb-1 font-serif">{artist.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center mb-0"><MapPin className="h-3 w-3 mr-1 text-[#9c7c5d]" /> {artist.location}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0 mt-auto">
                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                      <div>
                        <span className="text-gray-400 text-xs uppercase block">From</span>
                        <span className="text-[#9c7c5d] font-semibold text-lg">₹{artist.startingPrice}</span>
                      </div>
                      <button className="text-[#9c7c5d] text-xs font-bold uppercase tracking-wider border border-[#9c7c5d] px-4 py-2 rounded-full hover:bg-[#9c7c5d] hover:text-white transition">View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-4">
            <button onClick={() => navigate(`/vendorslist?type=${type}`)} className="text-[#9c7c5d] hover:text-[#8b6b4a] text-sm font-medium hover:underline transition underline-offset-4">View all {getSectionTitle(type)}</button>
          </div>
        </div>
      </section>
    )
  }

  const closeAd = () => setShowAd(false)

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-screen relative font-sans text-gray-800">
      <style>{`
        .scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-container::-webkit-scrollbar { display: none; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
          width: max-content;
        }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {showAd && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="relative bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
            <button onClick={closeAd} className="absolute top-4 right-4 z-20 bg-white/30 hover:bg-white/50 backdrop-blur p-2 rounded-full"><X className="w-5 h-5" /></button>
            <div className="relative h-56 w-full" style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="bg-[#ED695A] text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Limited Time</span>
                <h3 className="text-3xl font-serif tracking-wide">Wedding Special</h3>
              </div>
            </div>
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold text-[#5B4336] mb-2 font-serif"><span className="text-[#ED695A] mr-2">30% OFF</span>Venue Booking</h2>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">Book your dream venue today and save big on selected services.</p>
              <button className="w-full bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white font-semibold py-3.5 rounded-lg transition">Claim Offer Now</button>
            </div>
          </div>
        </div>
      )}

      <section className="relative min-h-[90vh] w-full overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 w-full h-full z-0">
          {heroImages.map((image, index) => (
            <div key={index} className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-[1500ms] ${index === heroCurrentSlide ? "opacity-100 scale-105" : "opacity-0"}`} style={{ backgroundImage: `url(${image})` }} />
          ))}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="absolute top-0 w-full z-50"><Header /></div>

        <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 flex flex-col items-center text-center pt-20">
          {currentUser && <div className="animate-fade-in-up mb-6 px-6 py-2 glass rounded-full text-white font-medium text-xs uppercase tracking-widest border border-white/20">Welcome back, {displayName}</div>}

          <div className="space-y-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white font-serif leading-none tracking-tight drop-shadow-lg">Unforgettable <br /><span className="font-normal italic text-[#e6d0b5]">Moments</span></h1>
            <p className="text-white/90 text-lg font-light tracking-wide max-w-xl mx-auto drop-shadow-md">Discover curated venues and premium vendors for your perfect celebration.</p>
          </div>

          {/* Desktop Search */}
          <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-full p-2 shadow-2xl border border-white/40 hidden md:flex items-center gap-2">
            <div className="flex-1 relative pl-6 border-r border-gray-300/50">
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider block mb-0.5">Where</span>
              <LocationAutocomplete
                key={`loc-${restoreKey}`}
                value={formData.location}
                placeholder="Search destinations"
                onSelect={handleLocationSelect}
                className="w-full h-6 bg-transparent border-0 p-0 text-sm font-medium text-gray-900 focus:ring-0 placeholder-gray-600"
              />
            </div>
            <div className="flex-1 relative px-6 border-r border-gray-300/50">
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider block mb-0.5">When</span>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} min={new Date().toISOString().split("T")[0]} className="w-full h-6 bg-transparent border-0 p-0 text-gray-900 text-sm font-medium focus:ring-0 cursor-pointer" />
            </div>
            <div className="flex-1 relative px-6">
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider block mb-0.5">What</span>
              <select name="event" value={formData.event} onChange={handleInputChange} disabled={loadingDropdowns} className="w-full h-6 bg-transparent border-0 p-0 text-gray-900 text-sm font-medium focus:ring-0 cursor-pointer appearance-none">
                <option value="">Select event type</option>
                {eventTypes.map(event => <option key={event} value={event}>{event}</option>)}
              </select>
            </div>
            <button onClick={handleSubmit} className="w-14 h-14 bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-lg"><Search className="w-6 h-6" /></button>
          </div>

          {/* Mobile Search */}
          <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl md:hidden space-y-3 border border-white/50">
            <LocationAutocomplete
              key={`loc-mobile-${restoreKey}`}
              value={formData.location}
              placeholder="Where to?"
              onSelect={handleLocationSelect}
              className="w-full h-12 bg-white/50 rounded-lg px-4 border border-gray-200 text-sm focus:bg-white transition"
            />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full h-12 bg-white/50 rounded-lg px-4 border border-gray-200 text-sm focus:bg-white transition" />
              <select name="event" value={formData.event} onChange={handleInputChange} className="w-full h-12 bg-white/50 rounded-lg px-4 border border-gray-200 text-sm focus:bg-white transition">
                <option value="">Select event type</option>
                {eventTypes.map(event => <option key={event} value={event}>{event}</option>)}
              </select>
            </div>
            <button onClick={handleSubmit} className="w-full h-12 bg-[#9c7c5d] text-white font-bold rounded-lg uppercase tracking-wider text-sm shadow-md">Search</button>
          </div>
        </div>
      </section>

      {/* Venues Section */}
      {(activeSection === "all" || activeSection === "venues") && (
        <section id="venues" className="py-12 w-full bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 animate-fade-in-up">
               <div className="max-w-xl">
                 <h2 className="text-4xl font-bold text-[#5B4336] mb-3 font-serif tracking-tight">Our Venues</h2>
                 <p className="text-gray-500 font-light text-lg">
                    Handpicked locations for your exclusive events.
                 </p>
               </div>
               <div className="flex gap-3 mt-4 md:mt-0">
                  <button onClick={() => scrollLeft("venues")} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#9c7c5d] hover:text-white hover:border-[#9c7c5d] transition">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => scrollRight("venues")} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#9c7c5d] hover:text-white hover:border-[#9c7c5d] transition">
                    <ChevronRight className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {loading ? (
             <div className="flex space-x-6 overflow-hidden py-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="min-w-[260px] md:min-w-[280px] h-[340px] bg-gray-200 rounded-lg animate-pulse skeleton" />
               ))}
             </div>
            ) : venues.length === 0 ? (
               <div className="text-center py-20 text-gray-400">No verified venues found at this time.</div>
            ) : (
              <div
                id="scroll-container-venues"
                ref={venuesRef}
                className="scroll-container scrollbar-hide flex overflow-x-auto space-x-6 pb-6 snap-x snap-mandatory px-2"
              >
                {venues.map((venue, index) => (
                  <div
                    key={venue.id}
                    className="flex-shrink-0 w-[260px] md:w-[300px] bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 snap-center group cursor-pointer overflow-hidden border border-gray-50 hover-lift"
                    onClick={() => navigate(`/auditoriumdetails/${venue.id}`)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-52 overflow-hidden">
                       <img
                          src={venue.images[0] || "/placeholder.svg"}
                          alt={venue.name}
                          className="w-full h-full object-cover animate-zoom-subtle"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                       
                       <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                          {venue.offer && (
                            <span className="badge-premium bg-white/95 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                              {venue.offer.discountValue}{venue.offer.discountType === "percentage" ? "%" : "₹"} OFF
                            </span>
                          )}
                       </div>

                       <div className="absolute bottom-3 right-3 badge-premium px-2 py-0.5 rounded text-[10px] font-bold text-[#5B4336] flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
                          {venue.rating.toFixed(1)}
                       </div>
                    </div>

                    <div className="p-5">
                       <h3 className="text-lg font-bold text-[#5B4336] mb-1 font-serif line-clamp-1">{venue.name}</h3>
                       <p className="text-xs text-gray-500 flex items-center mb-4 uppercase tracking-wide">
                          <MapPin className="h-3 w-3 mr-1 text-[#9c7c5d]" /> {venue.location}
                       </p>
                       <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm">
                          <div>
                              <span className="text-gray-400 text-xs uppercase block">Starts from</span>
                              {getFormattedPrice(venue)}
                              {venue.voucher && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openTermsModal(venue.voucher!)
                                  }}
                                  className="mt-1 text-[10px] font-bold text-[#ED695A] hover:text-[#78533F] hover:underline transition-colors flex items-center gap-1 uppercase tracking-wide"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  View Voucher
                                </button>
                              )}
                          </div>
                          <button className="text-[#9c7c5d] text-xs font-bold uppercase tracking-wider border border-[#9c7c5d] px-3 py-1 rounded-full hover:bg-[#9c7c5d] hover:text-white transition">
                              View
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}


      {/* Services Marquee - Left to Right */}
      {(activeSection === "all" || activeSection === "eventcategories") && (
        <section id="eventcategories" className="py-12 w-full bg-white overflow-hidden border-t border-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#5B4336] mb-2 font-serif">Services</h2>
            <div className="h-0.5 w-12 bg-[#9c7c5d] mx-auto opacity-50"></div>
          </div>
          <div className="w-full relative py-8 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="animate-marquee flex gap-20 items-center pl-8 py-4">
              {[...Array(4)].flatMap((_, i) => 
                Object.entries(vendorsByType).flatMap(([type, vendors]) => 
                  vendors.slice(0, 1).map(vendor => (
                    <div key={`${i}-${type}`} className="flex flex-col items-center group cursor-pointer flex-shrink-0" onClick={() => navigate(`/vendordetails/${vendor.id}`)}>
                      <div className="w-40 h-40 rounded-full overflow-hidden border-3 border-transparent group-hover:border-[#9c7c5d] p-1 transition-all duration-500">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img src={vendor.image || "/placeholder.svg"} alt={type} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" />
                        </div>
                      </div>
                      <h3 className="mt-6 font-bold text-gray-800 text-base font-serif uppercase tracking-widest">{capitalizeWords(type)}</h3>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </section>
      )}
      {/* Vendor Sections */}
      {(activeSection === "all" || vendorTypes.includes(activeSection)) && (
        <>
          {vendorTypes.map((type) => renderVendorSection(type))}
        </>
      )}

      {/* Projects Carousel */}
      {(activeSection === "all" || activeSection === "projects") && (
        <section id="projects" className="pt-16 pb-0 w-full bg-[#111] text-white">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Sparkles className="w-8 h-8 text-[#9c7c5d] mx-auto mb-4 opacity-80" />
              <h2 className="text-4xl font-bold mb-6 font-serif tracking-tight text-white">Signature Designs</h2>
              <p className="text-white/40 mb-10 max-w-lg mx-auto font-light text-sm tracking-wide">
                 Immersive themes and curated setups for your unique story.
              </p>

              <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden shadow-2xl">
                 {projectImages.map((project, index) => (
                    <div
                      key={project.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
                    >
                       <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-full object-cover opacity-60" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-center justify-center">
                          <div className={`text-center transform transition duration-1000 ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                             <h3 className="text-4xl md:text-6xl font-serif font-medium mb-4 italic tracking-tighter text-[#e6d0b5]">{project.title}</h3>
                             <span className="px-6 py-2 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/80 bg-black/40 backdrop-blur-md">{project.category}</span>
                          </div>
                       </div>
                    </div>
                 ))}
                 
                 {/* Carousel Indicators */}
                 <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
                    {projectImages.map((_, idx) => (
                       <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-0.5 transition-all duration-300 ${idx === currentSlide ? "bg-white w-12" : "bg-white/20 w-8"}`}
                       />
                    ))}
                 </div>
              </div>
           </div>
        </section>
      )}
      
      <Footer />
      {/* Terms & Conditions Modal */}
      {isModalOpen && selectedVoucher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
            <div className="bg-[#78533F] p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-white" />
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h3 className="text-2xl font-bold font-serif mb-1">Special Offer</h3>
              <p className="text-white/90 text-sm">Save big on your dream venue!</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-[#ED695A]/10 text-[#ED695A] rounded-full text-sm font-bold border border-[#ED695A]/20 mb-3">
                  CODE: {selectedVoucher.voucherCode}
                </div>
                <div className="text-4xl font-bold text-[#78533F] mb-1">
                  {selectedVoucher.discountType === 'percentage' ? `${selectedVoucher.discountValue}%` : `₹${selectedVoucher.discountValue}`}
                  <span className="text-lg font-normal text-gray-500 ml-1">OFF</span>
                </div>
                <p className="text-gray-500 text-sm">Valid for {selectedVoucher.audiName || "Selected Venue"}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Valid From</span>
                  <span className="font-medium text-gray-900">{new Date(selectedVoucher.validFrom).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Valid Until</span>
                  <span className="font-medium text-gray-900">{new Date(selectedVoucher.validTo).toLocaleDateString()}</span>
                </div>
                {selectedVoucher.limit && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Usage Limit</span>
                    <span className="font-medium text-gray-900">{selectedVoucher.limit} uses</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-[#ED695A] hover:bg-[#d85849] text-white font-bold rounded-xl shadow-lg shadow-[#ED695A]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage;