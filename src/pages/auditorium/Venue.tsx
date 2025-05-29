"use client"

import type React from "react"
import { useState } from "react"
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Users,
  Car,
  Wind,
  Utensils,
  Calendar,
  ImageIcon,
  Trash,
  Edit,
  Plus,
  ChevronDown,
  ChevronRight,
  X,
  ArrowLeft,
  Clock,
  Upload,
} from "lucide-react"
import Header from "../../component/user/Header"
import Sidebar from "../../component/auditorium/Sidebar"
import { useNavigate } from "react-router-dom"

// Define types
interface Tariff {
  wedding: string
  reception: string
}

interface TimeSlot {
  id: string
  label: string
  startTime: string
  endTime: string
  isCustom?: boolean
}

interface Venue {
  id: number
  name: string
  address: string
  phone: string
  altPhone?: string
  pincode: string
  email: string
  cities: string[]
  changingRooms: number
  seatingCapacity: number
  parkingSlots: number
  acType: string
  diningCapacity: number
  tariff: Tariff
  cancellationPolicy: string
  stageSize: string
  amenities: string[]
  foodPolicy: string
  decorPolicy: string
  hasLetterhead: boolean
  images: string[]
  timeSlots: TimeSlot[]
}

// Sample data
const sampleVenues: Venue[] = [
  {
    id: 1,
    name: "Rashaj Hall A",
    address: "123 Main Street, Attingal",
    phone: "+91 9876543210",
    altPhone: "+91 9876543211",
    pincode: "695101",
    email: "rashaja@example.com",
    cities: ["Attingal", "Trivandrum"],
    changingRooms: 4,
    seatingCapacity: 300,
    parkingSlots: 80,
    acType: "AC",
    diningCapacity: 250,
    tariff: {
      wedding: "₹50,000",
      reception: "₹40,000",
    },
    cancellationPolicy: "Refundable (48 hours notice)",
    stageSize: "30ft x 20ft",
    amenities: ["WiFi", "Generator Backup", "Valet Parking", "Sound System"],
    foodPolicy: "Both in-house and outside caterers allowed",
    decorPolicy: "Only in-house decorators",
    hasLetterhead: true,
    images: ["/placeholder.svg?height=250&width=400", "/placeholder.svg?height=250&width=400"],
    timeSlots: [
      { id: "morning", label: "Morning", startTime: "06:00", endTime: "12:00" },
      { id: "afternoon", label: "Afternoon", startTime: "12:00", endTime: "18:00" },
    ],
  },
  {
    id: 2,
    name: "Rashaj Hall B",
    address: "123 Main Street, Attingal",
    phone: "+91 9876543210",
    altPhone: "+91 9876543211",
    pincode: "695101",
    email: "rashajb@example.com",
    cities: ["Attingal"],
    changingRooms: 3,
    seatingCapacity: 500,
    parkingSlots: 100,
    acType: "Non-AC",
    diningCapacity: 400,
    tariff: {
      wedding: "₹40,000",
      reception: "₹35,000",
    },
    cancellationPolicy: "Non-refundable",
    stageSize: "40ft x 25ft",
    amenities: ["Generator Backup", "Sound System", "DJ Setup"],
    foodPolicy: "Only in-house catering allowed",
    decorPolicy: "Both in-house and outside decorators allowed",
    hasLetterhead: true,
    images: ["/placeholder.svg?height=250&width=400", "/placeholder.svg?height=250&width=400"],
    timeSlots: [{ id: "evening", label: "Evening", startTime: "18:00", endTime: "23:00" }],
  },
  {
    id: 3,
    name: "Rashaj Mini Hall",
    address: "125 Main Street, Kollam",
    phone: "+91 9876543212",
    altPhone: "+91 9876543213",
    pincode: "691001",
    email: "rashajmini@example.com",
    cities: ["Kollam"],
    changingRooms: 2,
    seatingCapacity: 150,
    parkingSlots: 40,
    acType: "AC",
    diningCapacity: 120,
    tariff: {
      wedding: "₹30,000",
      reception: "₹25,000",
    },
    cancellationPolicy: "Refundable (72 hours notice)",
    stageSize: "20ft x 15ft",
    amenities: ["WiFi", "Generator Backup", "Projector"],
    foodPolicy: "Only in-house catering allowed",
    decorPolicy: "Only in-house decorators",
    hasLetterhead: false,
    images: ["/placeholder.svg?height=250&width=400"],
    timeSlots: [
      { id: "morning", label: "Morning", startTime: "06:00", endTime: "12:00" },
      { id: "afternoon", label: "Afternoon", startTime: "12:00", endTime: "18:00" },
      { id: "evening", label: "Evening", startTime: "18:00", endTime: "23:00" },
    ],
  },
]

// Available cities
const availableCities = [
  "Trivandrum",
  "Kollam",
  "Attingal",
  "Kochi",
  "Kozhikode",
  "Thrissur",
  "Alappuzha",
  "Kottayam",
  "Palakkad",
  "Malappuram",
  "Kannur",
  "Kasaragod",
]

// Fixed time slots
const fixedTimeSlots: TimeSlot[] = [
  { id: "morning", label: "Morning", startTime: "06:00", endTime: "12:00" },
  { id: "afternoon", label: "Afternoon", startTime: "12:00", endTime: "18:00" },
  { id: "evening", label: "Evening", startTime: "18:00", endTime: "23:00" },
]

export default function VenueManagement() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [expandedVenue, setExpandedVenue] = useState<number | null>(null)
  const [venues, setVenues] = useState<Venue[]>(sampleVenues)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [venueTypeFilter, setVenueTypeFilter] = useState<string>("all")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const [activeModalTab, setActiveModalTab] = useState<string>("basic")
  const [modalStep, setModalStep] = useState<number>(1) // 1: Basic Info, 2: Facilities, 3: Policies & Time Slots
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([])
  const [customTimeSlots, setCustomTimeSlots] = useState<TimeSlot[]>([])
  const [newCustomSlot, setNewCustomSlot] = useState<{ label: string; startTime: string; endTime: string }>({
    label: "",
    startTime: "",
    endTime: "",
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const [newVenue, setNewVenue] = useState<{
    name: string
    address: string
    phone: string
    email: string
    pincode: string
    cities: string[]
    acType: string
    seatingCapacity: number
    diningCapacity: number
    parkingSlots: number
    changingRooms: number
    amenities: string[]
    foodPolicy: string
    decorPolicy: string
    tariff: {
      wedding: string
      reception: string
    }
    cancellationPolicy: string
    stageSize: string
    hasLetterhead: boolean
    images: string[]
    altPhone?: string
    timeSlots: TimeSlot[]
  }>({
    name: "",
    address: "",
    phone: "",
    email: "",
    pincode: "",
    cities: [],
    acType: "AC",
    seatingCapacity: 0,
    diningCapacity: 0,
    parkingSlots: 0,
    changingRooms: 0,
    amenities: [],
    foodPolicy: "",
    decorPolicy: "",
    tariff: {
      wedding: "",
      reception: "",
    },
    cancellationPolicy: "",
    stageSize: "",
    hasLetterhead: false,
    images: [],
    altPhone: "",
    timeSlots: [],
  })

  const navigate = useNavigate()

  const toggleVenueExpand = (id: number) => {
    setExpandedVenue(expandedVenue === id ? null : id)
  }

  const selectVenue = (venue: Venue) => {
    setSelectedVenue(venue)
    setIsEditModalOpen(true)
    setActiveModalTab("basic")
  }

  const deleteVenue = (id: number) => {
    setVenues(venues.filter((venue) => venue.id !== id))
    if (selectedVenue && selectedVenue.id === id) {
      setSelectedVenue(null)
    }
  }

  const resetAddModal = () => {
    setModalStep(1)
    setSelectedCities([])
    setSelectedTimeSlots([])
    setCustomTimeSlots([])
    setUploadedImages([])
    setNewCustomSlot({ label: "", startTime: "", endTime: "" })
    setNewVenue({
      name: "",
      address: "",
      phone: "",
      email: "",
      pincode: "",
      cities: [],
      acType: "AC",
      seatingCapacity: 0,
      diningCapacity: 0,
      parkingSlots: 0,
      changingRooms: 0,
      amenities: [],
      foodPolicy: "",
      decorPolicy: "",
      tariff: {
        wedding: "",
        reception: "",
      },
      cancellationPolicy: "",
      stageSize: "",
      hasLetterhead: false,
      images: [],
      altPhone: "",
      timeSlots: [],
    })
  }

  const handleAddVenue = () => {
    const newId = Math.max(...venues.map((v) => v.id)) + 1
    const allTimeSlots = [...selectedTimeSlots, ...customTimeSlots]

    const venueToAdd: Venue = {
      ...newVenue,
      id: newId,
      cities: selectedCities,
      images: uploadedImages,
      timeSlots: allTimeSlots,
      amenities: newVenue.amenities || [],
      tariff: newVenue.tariff || { wedding: "", reception: "" },
      changingRooms: newVenue.changingRooms || 0,
      seatingCapacity: newVenue.seatingCapacity || 0,
      parkingSlots: newVenue.parkingSlots || 0,
      diningCapacity: newVenue.diningCapacity || 0,
      hasLetterhead: newVenue.hasLetterhead || false,
    }

    setVenues([...venues, venueToAdd])
    setIsAddModalOpen(false)
    resetAddModal()
  }

  const handleUpdateVenue = () => {
    if (!selectedVenue) return

    setVenues(venues.map((venue) => (venue.id === selectedVenue.id ? selectedVenue : venue)))
    setIsEditModalOpen(false)
    setSelectedVenue(null)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    isNewVenue = false,
  ) => {
    const { name, value } = e.target

    if (isNewVenue) {
      if (name.includes(".")) {
        const [parent, child] = name.split(".")
        setNewVenue({
          ...newVenue,
          [parent]: {
            ...(newVenue[parent as keyof typeof newVenue] as Record<string, any>),
            [child]: value,
          },
        })
      } else {
        setNewVenue({
          ...newVenue,
          [name]: value,
        })
      }
    } else if (selectedVenue) {
      if (name.includes(".")) {
        const [parent, child] = name.split(".")
        setSelectedVenue({
          ...selectedVenue,
          [parent]: {
            ...(selectedVenue[parent as keyof typeof selectedVenue] as Record<string, any>),
            [child]: value,
          },
        })
      } else {
        setSelectedVenue({
          ...selectedVenue,
          [name]: value,
        })
      }
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleSelectChange = (value: string, name: string, isNewVenue = false) => {
    if (isNewVenue) {
      setNewVenue({
        ...newVenue,
        [name]: value,
      })
    } else if (selectedVenue) {
      setSelectedVenue({
        ...selectedVenue,
        [name]: value,
      })
    }
  }

  const handleCityToggle = (city: string) => {
    setSelectedCities((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]))
  }

  const handleTimeSlotToggle = (timeSlot: TimeSlot) => {
    setSelectedTimeSlots((prev) => {
      const exists = prev.find((slot) => slot.id === timeSlot.id)
      if (exists) {
        return prev.filter((slot) => slot.id !== timeSlot.id)
      } else {
        return [...prev, timeSlot]
      }
    })
  }

  const handleAddCustomTimeSlot = () => {
    if (newCustomSlot.label && newCustomSlot.startTime && newCustomSlot.endTime) {
      const customSlot: TimeSlot = {
        id: `custom-${Date.now()}`,
        label: newCustomSlot.label,
        startTime: newCustomSlot.startTime,
        endTime: newCustomSlot.endTime,
        isCustom: true,
      }
      setCustomTimeSlots((prev) => [...prev, customSlot])
      setNewCustomSlot({ label: "", startTime: "", endTime: "" })
    }
  }

  const handleRemoveCustomTimeSlot = (id: string) => {
    setCustomTimeSlots((prev) => prev.filter((slot) => slot.id !== id))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // In a real application, you would upload these files to a server
      // For now, we'll create placeholder URLs
      const newImages = Array.from(files).map(
        (file, index) => `/placeholder.svg?height=250&width=400&text=${file.name}`,
      )
      setUploadedImages((prev) => [...prev, ...newImages])
    }
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const canProceedToNextStep = () => {
    if (modalStep === 1) {
      return newVenue.name && newVenue.address && newVenue.phone && newVenue.email && selectedCities.length > 0
    }
    if (modalStep === 2) {
      return newVenue.seatingCapacity > 0 && newVenue.diningCapacity > 0
    }
    return true
  }

  const handleNextStep = () => {
    if (canProceedToNextStep() && modalStep < 3) {
      setModalStep(modalStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (modalStep > 1) {
      setModalStep(modalStep - 1)
    }
  }

  // Filter venues based on search term, venue type, and city
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = venueTypeFilter === "all" || venue.acType === venueTypeFilter
    const matchesCity = cityFilter === "all" || venue.cities.includes(cityFilter)

    return matchesSearch && matchesType && matchesCity
  })

  // Get unique cities for filter dropdown
  const allCities = Array.from(new Set(venues.flatMap((venue) => venue.cities)))

  return (
    <div className="flex flex-col h-screen bg-[#FDF8F1] mt-5">
      <Header />

      <div className="min-h-screen w-full flex mt-10 bg-[#FDF8F1]">
        <div className="w-64 shrink-0 h-[calc(100vh-64px)] sticky top-16 hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col mt-5">
          <div className="md:hidden flex bg-white shadow-md w-full">
            <button className="flex-1 py-3 text-center text-[#ED695A] border-b-2 border-[#ED695A]">Venues</button>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-7xl mx-auto w-full p-4 overflow-auto">
            {/* Venue Management Header */}
            <div className="bg-white shadow-sm p-4 rounded-lg mb-4">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div>
                  <h1 className="text-2xl text-[#78533F] font-bold">Auditorium Management</h1>
                  <p className="text-[#796458] font-medium">Manage all your venues in one place</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-[#ED695A] text-white rounded-md hover:bg-opacity-90 flex items-center"
                  >
                    <Plus size={18} className="mr-2" /> Add New Venue
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Venue List */}
              <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Venues</h2>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search venues..."
                        className="w-full pl-9 pr-3 py-2 border border-[#b09d94] rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#ED695A]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    <select
                      className="border border-[#b09d94] rounded-md px-3 py-2 bg-white"
                      value={venueTypeFilter}
                      onChange={(e) => setVenueTypeFilter(e.target.value)}
                    >
                      <option value="all">All Venues</option>
                      <option value="AC">AC Venues</option>
                      <option value="Non-AC">Non-AC Venues</option>
                    </select>

                    {/* <select
                      className="border border-[#b09d94] rounded-md px-3 py-2 bg-white"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                    >
                      <option value="all">All Cities</option>
                      {allCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select> */}
                  </div>
                </div>

                <div className="divide-y divide-[#b09d94]">
                  {filteredVenues.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">No venues match your search criteria</div>
                  ) : (
                    filteredVenues.map((venue) => (
                      <div key={venue.id} className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center cursor-pointer" onClick={() => toggleVenueExpand(venue.id)}>
                            {expandedVenue === venue.id ? (
                              <ChevronDown size={18} className="text-gray-500 mr-2" />
                            ) : (
                              <ChevronRight size={18} className="text-gray-500 mr-2" />
                            )}
                            <div>
                              <h3 className="font-medium">{venue.name}</h3>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin size={14} className="mr-1" />
                                <span>{venue.address}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${venue.acType === "AC" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                            >
                              {venue.acType}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                              <Users size={12} className="inline mr-1" /> {venue.seatingCapacity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                selectVenue(venue)
                              }}
                              className="p-1.5 rounded-md hover:bg-gray-100"
                            >
                              <Edit size={16} className="text-gray-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteVenue(venue.id)
                              }}
                              className="p-1.5 rounded-md hover:bg-gray-100"
                            >
                              <Trash size={16} className="text-gray-500" />
                            </button>
                          </div>
                        </div>

                        {expandedVenue === venue.id && (
                          <div className="mt-3 ml-6 pl-2 border-l-2 border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <Phone size={16} className="text-gray-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Contact</p>
                                    <p className="text-sm">{venue.phone}</p>
                                    {venue.altPhone && <p className="text-sm">{venue.altPhone}</p>}
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <Mail size={16} className="text-gray-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm">{venue.email}</p>
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <MapPin size={16} className="text-gray-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Cities</p>
                                    <p className="text-sm">{venue.cities.join(", ")}</p>
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <Users size={16} className="text-gray-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Capacity</p>
                                    <p className="text-sm">Seating: {venue.seatingCapacity}</p>
                                    <p className="text-sm">Dining: {venue.diningCapacity}</p>
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <Car size={16} className="text-gray-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Parking</p>
                                    <p className="text-sm">{venue.parkingSlots} slots</p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <Wind size={16} className="text-gray-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Amenities</p>
                                    <p className="text-sm">{venue.amenities.join(", ")}</p>
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <Clock size={16} className="text-gray-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Time Slots</p>
                                    {venue.timeSlots.map((slot) => (
                                      <p key={slot.id} className="text-sm">
                                        {slot.label}: {slot.startTime} - {slot.endTime}
                                      </p>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <Utensils size={16} className="text-gray-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Food & Decor</p>
                                    <p className="text-sm">{venue.foodPolicy}</p>
                                    <p className="text-sm">{venue.decorPolicy}</p>
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <Calendar size={16} className="text-gray-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Tariff</p>
                                    <p className="text-sm">Wedding: {venue.tariff.wedding}</p>
                                    <p className="text-sm">Reception: {venue.tariff.reception}</p>
                                    <p className="text-sm text-gray-600">{venue.cancellationPolicy}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3">
                              <p className="text-sm font-medium flex items-center">
                                <ImageIcon size={16} className="text-gray-500 mr-2" />
                                Gallery
                              </p>
                              <div className="mt-2 flex space-x-2 overflow-x-auto pb-2">
                                {venue.images.map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img || "/placeholder.svg"}
                                    alt={`${venue.name} image ${idx + 1}`}
                                    className="w-40 h-24 object-cover rounded-md"
                                  />
                                ))}
                                <button className="w-40 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-400">
                                  <Plus size={20} />
                                  <span className="ml-1 text-sm">Add Photo</span>
                                </button>
                              </div>
                            </div>

                            <div className="mt-3 flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  selectVenue(venue)
                                }}
                                className="px-3 py-1.5 bg-[#ED695A] text-white rounded-md text-sm hover:bg-opacity-90"
                              >
                                Edit Details
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <button
                onClick={handleGoBack}
                className="flex items-center px-4 py-2 text-[#78533F] hover:bg-[#78533F]/10 rounded-md transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Venue Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-[700px] max-h-[90vh] overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-medium">Add New Venue</h2>
                <div className="flex items-center mt-2 space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${modalStep >= 1 ? "bg-[#ED695A] text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    1
                  </div>
                  <div className={`w-16 h-1 ${modalStep >= 2 ? "bg-[#ED695A]" : "bg-gray-200"}`}></div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${modalStep >= 2 ? "bg-[#ED695A] text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    2
                  </div>
                  <div className={`w-16 h-1 ${modalStep >= 3 ? "bg-[#ED695A]" : "bg-gray-200"}`}></div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${modalStep >= 3 ? "bg-[#ED695A] text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    3
                  </div>
                </div>
                <div className="flex items-center mt-1 space-x-2 text-xs text-gray-600">
                  <span className="w-8 text-center">Basic</span>
                  <span className="w-16 text-center">Facilities</span>
                  <span className="w-8 text-center">Policies</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false)
                  resetAddModal()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Step 1: Basic Info */}
            {modalStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Venue Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={newVenue.name}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter venue name"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="acType" className="block text-sm font-medium text-gray-700">
                      Venue Type *
                    </label>
                    <select
                      id="acType"
                      name="acType"
                      value={newVenue.acType}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    >
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={newVenue.address || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter full address"
                      rows={2}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      value={newVenue.phone || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="altPhone" className="block text-sm font-medium text-gray-700">
                      Alternative Phone
                    </label>
                    <input
                      id="altPhone"
                      name="altPhone"
                      value={newVenue.altPhone || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter alternative phone (optional)"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={newVenue.email || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      id="pincode"
                      name="pincode"
                      value={newVenue.pincode || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter pincode"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Cities * (Select at least one)</label>
                    <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-[#b09d94] rounded-md p-3">
                      {availableCities.map((city) => (
                        <label key={city} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCities.includes(city)}
                            onChange={() => handleCityToggle(city)}
                            className="h-4 w-4 rounded border-gray-300 text-[#ED695A] focus:ring-[#ED695A]"
                          />
                          <span className="text-sm">{city}</span>
                        </label>
                      ))}
                    </div>
                    {selectedCities.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Selected: {selectedCities.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Facilities */}
            {modalStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-800 mb-4">Facilities & Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="seatingCapacity" className="block text-sm font-medium text-gray-700">
                      Seating Capacity *
                    </label>
                    <input
                      id="seatingCapacity"
                      name="seatingCapacity"
                      type="number"
                      value={newVenue.seatingCapacity || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter seating capacity"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="diningCapacity" className="block text-sm font-medium text-gray-700">
                      Dining Capacity *
                    </label>
                    <input
                      id="diningCapacity"
                      name="diningCapacity"
                      type="number"
                      value={newVenue.diningCapacity || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter dining capacity"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="parkingSlots" className="block text-sm font-medium text-gray-700">
                      Parking Slots
                    </label>
                    <input
                      id="parkingSlots"
                      name="parkingSlots"
                      type="number"
                      value={newVenue.parkingSlots || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter parking slots"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="changingRooms" className="block text-sm font-medium text-gray-700">
                      Changing Rooms
                    </label>
                    <input
                      id="changingRooms"
                      name="changingRooms"
                      type="number"
                      value={newVenue.changingRooms || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter number of changing rooms"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="stageSize" className="block text-sm font-medium text-gray-700">
                      Stage Size
                    </label>
                    <input
                      id="stageSize"
                      name="stageSize"
                      value={newVenue.stageSize || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter stage size (e.g., 30ft x 20ft)"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">
                      Amenities
                    </label>
                    <textarea
                      id="amenities"
                      name="amenities"
                      value={newVenue.amenities?.join(", ") || ""}
                      onChange={(e) => {
                        const amenitiesArray = e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean)
                        setNewVenue({
                          ...newVenue,
                          amenities: amenitiesArray,
                        })
                      }}
                      placeholder="Enter amenities separated by commas (e.g., WiFi, Generator Backup, Sound System)"
                      rows={2}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Venue Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                      >
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Click to upload images</span>
                        <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
                      </label>
                    </div>
                    {uploadedImages.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {uploadedImages.map((img, index) => (
                            <div key={index} className="relative">
                              <img
                                src={img || "/placeholder.svg"}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-20 object-cover rounded-md"
                              />
                              <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Policies & Time Slots */}
            {modalStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-800 mb-4">Policies & Time Slots</h3>

                {/* Time Slots Section */}
                <div className="space-y-4 border-b border-gray-200 pb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Available Time Slots</h4>

                  {/* Fixed Time Slots - Horizontal Layout */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-600">
                      Select Time Slots (Multiple selection allowed)
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {fixedTimeSlots.map((slot) => {
                        const isSelected = selectedTimeSlots.some((s) => s.id === slot.id)
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleTimeSlotToggle(slot)}
                            className={`relative flex items-center space-x-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                              isSelected
                                ? "border-[#ED695A] bg-[#ED695A]/10 shadow-sm"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            {/* Custom Circle Checkbox */}
                            <div className="relative">
                              <div
                                className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                                  isSelected ? "border-[#ED695A] bg-[#ED695A]" : "border-gray-300 bg-white"
                                }`}
                              >
                                {isSelected && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-left">
                              <div className={`font-medium text-sm ${isSelected ? "text-[#ED695A]" : "text-gray-700"}`}>
                                {slot.label}
                              </div>
                              <div className={`text-xs ${isSelected ? "text-[#ED695A]/80" : "text-gray-500"}`}>
                                {slot.startTime} - {slot.endTime}
                              </div>
                            </div>
                          </button>
                        )
                      })}

                      {/* Custom Time Slot Button */}
                      <button
                        type="button"
                        onClick={() => {
                          // Toggle custom slot form visibility
                          const customForm = document.getElementById("custom-slot-form")
                          if (customForm) {
                            customForm.style.display = customForm.style.display === "none" ? "block" : "none"
                          }
                        }}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg border-2 border-dashed border-[#ED695A] bg-[#ED695A]/5 hover:bg-[#ED695A]/10 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-[#ED695A] bg-white flex items-center justify-center">
                          <Plus size={12} className="text-[#ED695A]" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm text-[#ED695A]">Custom Slot</div>
                          <div className="text-xs text-[#ED695A]/80">Add your own</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Custom Time Slot Form */}
                  <div id="custom-slot-form" className="space-y-3" style={{ display: "none" }}>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Create Custom Time Slot</label>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Slot Name</label>
                          <input
                            type="text"
                            placeholder="e.g., Late Night"
                            value={newCustomSlot.label}
                            onChange={(e) => setNewCustomSlot({ ...newCustomSlot, label: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={newCustomSlot.startTime}
                            onChange={(e) => setNewCustomSlot({ ...newCustomSlot, startTime: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                          <input
                            type="time"
                            value={newCustomSlot.endTime}
                            onChange={(e) => setNewCustomSlot({ ...newCustomSlot, endTime: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => {
                              handleAddCustomTimeSlot()
                              // Hide form after adding
                              const customForm = document.getElementById("custom-slot-form")
                              if (customForm) {
                                customForm.style.display = "none"
                              }
                            }}
                            disabled={!newCustomSlot.label || !newCustomSlot.startTime || !newCustomSlot.endTime}
                            className="w-full px-4 py-2 bg-[#ED695A] text-white rounded-md hover:bg-[#ED695A]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors duration-200"
                          >
                            Add Slot
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Display Custom Time Slots */}
                  {customTimeSlots.length > 0 && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Custom Time Slots</label>
                      <div className="flex flex-wrap gap-2">
                        {customTimeSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg"
                          >
                            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-blue-700">{slot.label}</span>
                            <span className="text-xs text-blue-600">
                              ({slot.startTime} - {slot.endTime})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomTimeSlot(slot.id)}
                              className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected Time Slots Summary */}
                  {(selectedTimeSlots.length > 0 || customTimeSlots.length > 0) && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Selected Time Slots Summary</label>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {selectedTimeSlots.map((slot) => (
                            <div key={slot.id} className="flex items-center space-x-2 text-sm text-green-700">
                              <Clock size={14} className="text-green-600" />
                              <span className="font-medium">{slot.label}:</span>
                              <span>
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          ))}
                          {customTimeSlots.map((slot) => (
                            <div key={slot.id} className="flex items-center space-x-2 text-sm text-green-700">
                              <Clock size={14} className="text-green-600" />
                              <span className="font-medium">{slot.label}:</span>
                              <span>
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">Custom</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-green-600">
                          Total slots selected: {selectedTimeSlots.length + customTimeSlots.length}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Policies Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="tariff.wedding" className="block text-sm font-medium text-gray-700">
                      Wedding Tariff
                    </label>
                    <input
                      id="tariff.wedding"
                      name="tariff.wedding"
                      value={newVenue.tariff?.wedding || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter wedding tariff (e.g., ₹50,000)"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="tariff.reception" className="block text-sm font-medium text-gray-700">
                      Reception Tariff
                    </label>
                    <input
                      id="tariff.reception"
                      name="tariff.reception"
                      value={newVenue.tariff?.reception || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter reception tariff (e.g., ₹40,000)"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700">
                      Cancellation Policy
                    </label>
                    <input
                      id="cancellationPolicy"
                      name="cancellationPolicy"
                      value={newVenue.cancellationPolicy || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter cancellation policy"
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="foodPolicy" className="block text-sm font-medium text-gray-700">
                      Food Policy
                    </label>
                    <textarea
                      id="foodPolicy"
                      name="foodPolicy"
                      value={newVenue.foodPolicy || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter food policy"
                      rows={2}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="decorPolicy" className="block text-sm font-medium text-gray-700">
                      Decoration Policy
                    </label>
                    <textarea
                      id="decorPolicy"
                      name="decorPolicy"
                      value={newVenue.decorPolicy || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter decoration policy"
                      rows={2}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hasLetterhead"
                        checked={newVenue.hasLetterhead || false}
                        onChange={(e) => {
                          setNewVenue({
                            ...newVenue,
                            hasLetterhead: e.target.checked,
                          })
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-[#ED695A] focus:ring-[#ED695A]"
                      />
                      <label htmlFor="hasLetterhead" className="block text-sm font-medium text-gray-700">
                        Has Letterhead
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-6 flex justify-between">
              <div>
                {modalStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Previous
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false)
                    resetAddModal()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                {modalStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={!canProceedToNextStep()}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      canProceedToNextStep()
                        ? "bg-[#ED695A] text-white hover:bg-opacity-90"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                    <ChevronRight size={16} className="ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleAddVenue}
                    className="px-4 py-2 bg-[#ED695A] text-white rounded-md hover:bg-opacity-90"
                  >
                    Add Venue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Venue Modal (keeping existing functionality) */}
      {isEditModalOpen && selectedVenue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-[600px] max-h-[90vh] overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Edit Venue: {selectedVenue.name}</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 ${activeModalTab === "basic" ? "border-b-2 border-[#ED695A] text-[#ED695A]" : "text-gray-500"}`}
                  onClick={() => setActiveModalTab("basic")}
                >
                  Basic Info
                </button>
                <button
                  className={`px-4 py-2 ${activeModalTab === "facilities" ? "border-b-2 border-[#ED695A] text-[#ED695A]" : "text-gray-500"}`}
                  onClick={() => setActiveModalTab("facilities")}
                >
                  Facilities
                </button>
                <button
                  className={`px-4 py-2 ${activeModalTab === "policies" ? "border-b-2 border-[#ED695A] text-[#ED695A]" : "text-gray-500"}`}
                  onClick={() => setActiveModalTab("policies")}
                >
                  Policies & Pricing
                </button>
              </div>
            </div>

            {activeModalTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                      Venue Name
                    </label>
                    <input
                      id="edit-name"
                      name="name"
                      value={selectedVenue.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-acType" className="block text-sm font-medium text-gray-700">
                      Venue Type
                    </label>
                    <select
                      id="edit-acType"
                      name="acType"
                      value={selectedVenue.acType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="edit-address"
                      name="address"
                      value={selectedVenue.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      id="edit-phone"
                      name="phone"
                      value={selectedVenue.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-altPhone" className="block text-sm font-medium text-gray-700">
                      Alternative Phone
                    </label>
                    <input
                      id="edit-altPhone"
                      name="altPhone"
                      value={selectedVenue.altPhone || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={selectedVenue.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-pincode" className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      id="edit-pincode"
                      name="pincode"
                      value={selectedVenue.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Cities</label>
                    <div className="p-3 border rounded-md bg-gray-50">
                      <p className="text-sm">{selectedVenue.cities.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModalTab === "facilities" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-seatingCapacity" className="block text-sm font-medium text-gray-700">
                      Seating Capacity
                    </label>
                    <input
                      id="edit-seatingCapacity"
                      name="seatingCapacity"
                      type="number"
                      value={selectedVenue.seatingCapacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-diningCapacity" className="block text-sm font-medium text-gray-700">
                      Dining Capacity
                    </label>
                    <input
                      id="edit-diningCapacity"
                      name="diningCapacity"
                      type="number"
                      value={selectedVenue.diningCapacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-parkingSlots" className="block text-sm font-medium text-gray-700">
                      Parking Slots
                    </label>
                    <input
                      id="edit-parkingSlots"
                      name="parkingSlots"
                      type="number"
                      value={selectedVenue.parkingSlots}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-changingRooms" className="block text-sm font-medium text-gray-700">
                      Changing Rooms
                    </label>
                    <input
                      id="edit-changingRooms"
                      name="changingRooms"
                      type="number"
                      value={selectedVenue.changingRooms}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="edit-stageSize" className="block text-sm font-medium text-gray-700">
                      Stage Size
                    </label>
                    <input
                      id="edit-stageSize"
                      name="stageSize"
                      value={selectedVenue.stageSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="edit-amenities" className="block text-sm font-medium text-gray-700">
                      Amenities
                    </label>
                    <textarea
                      id="edit-amenities"
                      name="amenities"
                      value={selectedVenue.amenities.join(", ")}
                      onChange={(e) => {
                        const amenitiesArray = e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean)
                        setSelectedVenue({
                          ...selectedVenue,
                          amenities: amenitiesArray,
                        })
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Time Slots</label>
                    <div className="p-3 border rounded-md bg-gray-50">
                      {selectedVenue.timeSlots.length > 0 ? (
                        <div className="space-y-1">
                          {selectedVenue.timeSlots.map((slot) => (
                            <div key={slot.id} className="text-sm flex items-center">
                              <Clock size={14} className="mr-2" />
                              {slot.label}: {slot.startTime} - {slot.endTime}
                              {slot.isCustom && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 rounded">Custom</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No time slots configured</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModalTab === "policies" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-tariff.wedding" className="block text-sm font-medium text-gray-700">
                      Wedding Tariff
                    </label>
                    <input
                      id="edit-tariff.wedding"
                      name="tariff.wedding"
                      value={selectedVenue.tariff.wedding}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-tariff.reception" className="block text-sm font-medium text-gray-700">
                      Reception Tariff
                    </label>
                    <input
                      id="edit-tariff.reception"
                      name="tariff.reception"
                      value={selectedVenue.tariff.reception}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="edit-cancellationPolicy" className="block text-sm font-medium text-gray-700">
                      Cancellation Policy
                    </label>
                    <input
                      id="edit-cancellationPolicy"
                      name="cancellationPolicy"
                      value={selectedVenue.cancellationPolicy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="edit-foodPolicy" className="block text-sm font-medium text-gray-700">
                      Food Policy
                    </label>
                    <textarea
                      id="edit-foodPolicy"
                      name="foodPolicy"
                      value={selectedVenue.foodPolicy}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="edit-decorPolicy" className="block text-sm font-medium text-gray-700">
                      Decoration Policy
                    </label>
                    <textarea
                      id="edit-decorPolicy"
                      name="decorPolicy"
                      value={selectedVenue.decorPolicy}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit-hasLetterhead"
                        checked={selectedVenue.hasLetterhead}
                        onChange={(e) => {
                          setSelectedVenue({
                            ...selectedVenue,
                            hasLetterhead: e.target.checked,
                          })
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-[#ED695A] focus:ring-[#ED695A]"
                      />
                      <label htmlFor="edit-hasLetterhead" className="block text-sm font-medium text-gray-700">
                        Has Letterhead
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateVenue}
                className="px-4 py-2 bg-[#ED695A] text-white rounded-md hover:bg-opacity-90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
