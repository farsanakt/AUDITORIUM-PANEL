
import type React from "react"
import { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Users,
  Car,
  Wind,
  Trash,
  Edit,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Upload,
  ImageIcon,
} from "lucide-react"
import { addVenueAPI, deleteVenueAPI, existingAllVenues, updateVenues } from "../../api/userApi"
import { toast } from "react-toastify"
import Swal from 'sweetalert2';

import Header from "../../component/user/Header"
import Sidebar from "../../component/auditorium/Sidebar"
import { useSelector } from "react-redux"

interface Tariff {
  wedding: string
  reception: string
}

interface TimeSlot {
  id: string
  label: string
  startTime: string
  endTime: string
}

interface Venue {
  _id: string
  name: string
  address: string
  phone: string
  altPhone?: string
  pincode: string
  email: string
  panchayat: string
  cities: string[]
  changingRooms: number
  seatingCapacity: number
  parkingSlots: number
  acType: string
  diningCapacity: number
  tariff: Tariff
  cancellationPolicy: string
  stageSize: string
  advAmnt: string
  totalamount: string
  amenities: string[]
  foodPolicy: string
  decorPolicy: string
  images: string[]
  timeSlots: TimeSlot[]
}

interface RootState {
  auth: {
    currentUser: {
      id: string
    }
  }
}

const fixedTimeSlots: TimeSlot[] = [
  { id: "morning", label: "Morning", startTime: "06:00", endTime: "12:00" },
  { id: "afternoon", label: "Afternoon", startTime: "12:00", endTime: "18:00" },
  { id: "evening", label: "Evening", startTime: "18:00", endTime: "23:00" },
]

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

const panchayatOptions = [
  "Nedumangad",
  "Varkala",
  "Kallara",
  "Pothencode",
  "Kilimanoor",
  "Vamanapuram",
  "Kollam",
  "Alappuzha",
  "Kozhikode",
  "Thrissur",
]



export default function VenueManagement() {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [editImages, setEditImages] = useState<File[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [expandedVenue, setExpandedVenue] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [venueTypeFilter, setVenueTypeFilter] = useState("all")
  const [newVenue, setNewVenue] = useState<Partial<Venue>>({
    name: "",
    address: "",
    phone: "",
    email: "",
    pincode: "",
    panchayat: "",
    cities: [],
    acType: "AC",
    seatingCapacity: 0,
    diningCapacity: 0,
    parkingSlots: 0,
    changingRooms: 0,
    amenities: [],
    foodPolicy: "",
    decorPolicy: "",
    tariff: { wedding: "", reception: "" },
    cancellationPolicy: "",
    stageSize: "",
    images: [],
    altPhone: "",
    timeSlots: [],
    totalamount: "",
    advAmnt: "",
  })
  const [customTimeSlot, setCustomTimeSlot] = useState({
    label: "",
    startTime: "",
    endTime: "",
  })

  const { currentUser } = useSelector((state: RootState) => state.auth)

  const fetchVenues = async (): Promise<void> => {
    try {
      const response = await existingAllVenues(currentUser.id)
      console.log(response.data,'cpe')
      setVenues(response.data)
    } catch (error) {
      console.error("Error fetching venues:", error)
      toast.error("Failed to load venues.")
    }
  }

  useEffect(() => {
    fetchVenues()
  }, [])

  const toggleVenueExpand = (id: string): void => {
    setExpandedVenue(expandedVenue === id ? null : id)
  }

  const selectVenue = (venue: Venue): void => {
    setSelectedVenue(venue)
    setEditImages([])
    setIsEditModalOpen(true)
  }

  const deleteVenue = async (id: string): Promise<void> => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this venue? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      try {
        await deleteVenueAPI(id)
        setVenues(venues.filter((venue) => venue._id !== id))
        if (selectedVenue?._id === id) setSelectedVenue(null)
        toast.success("Venue deleted successfully!")
      } catch (error) {
        console.error("Error deleting venue:", error)
        toast.error("Failed to delete venue.")
      }
    }
  }

  const resetAddModal = (): void => {
    setNewVenue({
      name: "",
      address: "",
      phone: "",
      email: "",
      pincode: "",
      panchayat: "",
      cities: [],
      acType: "AC",
      seatingCapacity: 0,
      diningCapacity: 0,
      parkingSlots: 0,
      changingRooms: 0,
      amenities: [],
      foodPolicy: "",
      decorPolicy: "",
      tariff: { wedding: "", reception: "" },
      cancellationPolicy: "",
      stageSize: "",
      images: [],
      altPhone: "",
      timeSlots: [],
      totalamount: "",
      advAmnt: "",
    })
    setCustomTimeSlot({ label: "", startTime: "", endTime: "" })
    setSelectedImages([])
    setIsAddModalOpen(false)
  }

  const handleAddVenue = async (): Promise<void> => {
    try {
      const formData = new FormData()
      formData.append("name", newVenue.name || "")
      formData.append("acType", newVenue.acType || "AC")
      formData.append("address", newVenue.address || "")
      formData.append("phone", newVenue.phone || "")
      formData.append("altPhone", newVenue.altPhone || "")
      formData.append("email", newVenue.email || "")
      formData.append("pincode", newVenue.pincode || "")
      formData.append("panchayat", newVenue.panchayat || "")
      formData.append("seatingCapacity", String(newVenue.seatingCapacity ?? 0))
      formData.append("diningCapacity", String(newVenue.diningCapacity ?? 0))
      formData.append("parkingSlots", String(newVenue.parkingSlots ?? 0))
      formData.append("changingRooms", String(newVenue.changingRooms ?? 0))
      formData.append("stageSize", newVenue.stageSize || "")
      formData.append("cancellationPolicy", newVenue.cancellationPolicy || "")
      formData.append("foodPolicy", newVenue.foodPolicy || "")
      formData.append("decorPolicy", newVenue.decorPolicy || "")
      formData.append("totalamount", newVenue.totalamount || "")
      formData.append("advAmnt", newVenue.advAmnt || "")
      formData.append("cities", JSON.stringify(newVenue.cities || []))
      formData.append("timeSlots", JSON.stringify(newVenue.timeSlots || []))
      formData.append("amenities", JSON.stringify(newVenue.amenities || []))
      formData.append("tariff", JSON.stringify(newVenue.tariff || { wedding: "", reception: "" }))
      formData.append("audiUserId", currentUser.id)

      selectedImages.forEach((file) => {
        if (file) formData.append("images", file)
      })

      const response = await addVenueAPI(formData)
      if (response) {
        toast.success("Venue added successfully!")
        resetAddModal()
        await fetchVenues()
      } else {
        toast.error("Failed to add venue.")
      }
    } catch (error) {
      console.error("Error adding venue:", error)
      toast.error("Something went wrong.")
    }
  }

  const handleUpdateVenue = async (): Promise<void> => {
    if (!selectedVenue) return

    try {
      const formData = new FormData()
      formData.append("name", selectedVenue.name || "")
      formData.append("acType", selectedVenue.acType || "AC")
      formData.append("address", selectedVenue.address || "")
      formData.append("phone", selectedVenue.phone || "")
      formData.append("altPhone", selectedVenue.altPhone || "")
      formData.append("email", selectedVenue.email || "")
      formData.append("pincode", selectedVenue.pincode || "")
      formData.append("panchayat", selectedVenue.panchayat || "")
      formData.append("seatingCapacity", String(selectedVenue.seatingCapacity ?? 0))
      formData.append("diningCapacity", String(selectedVenue.diningCapacity ?? 0))
      formData.append("parkingSlots", String(selectedVenue.parkingSlots ?? 0))
      formData.append("changingRooms", String(selectedVenue.changingRooms ?? 0))
      formData.append("stageSize", selectedVenue.stageSize || "")
      formData.append("cancellationPolicy", selectedVenue.cancellationPolicy || "")
      formData.append("foodPolicy", selectedVenue.foodPolicy || "")
      formData.append("decorPolicy", selectedVenue.decorPolicy || "")
      formData.append("totalamount", selectedVenue.totalamount || "")
      formData.append("advAmnt", selectedVenue.advAmnt || "")
      formData.append("cities", JSON.stringify(selectedVenue.cities || []))
      formData.append("timeSlots", JSON.stringify(selectedVenue.timeSlots || []))
      formData.append("amenities", JSON.stringify(selectedVenue.amenities || []))
      formData.append("tariff", JSON.stringify(selectedVenue.tariff || { wedding: "", reception: "" }))
      formData.append("audiUserId", currentUser.id)

      editImages.forEach((file) => {
        if (file) formData.append("images", file)
      })

      selectedVenue.images.forEach((image, index) => {
        formData.append(`existingImages[${index}]`, image)
      })

      const response = await updateVenues(formData, selectedVenue._id)
      if (response.data.success) {
        toast.success(response.data.message)
        setVenues(
          venues.map((venue) =>
            venue._id === selectedVenue._id
              ? {
                  ...selectedVenue,
                  images: [...selectedVenue.images, ...editImages.map((file) => URL.createObjectURL(file))],
                }
              : venue,
          ),
        )
        setIsEditModalOpen(false)
        setSelectedVenue(null)
        setEditImages([])
      } else {
        toast.error(response.data.message || "Failed to update venue")
      }
    } catch (error) {
      console.error("Error updating venue:", error)
      toast.error("Something went wrong while updating venue")
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    isNewVenue = false,
  ): void => {
    const { name, value } = e.target
    const updateState = (prev: Partial<Venue>): Partial<Venue> => {
      if (name === "amenities") {
        
        const amenitiesArray = value
          ? value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : []
        return {
          ...prev,
          amenities: amenitiesArray,
        }
      }
      if (name.includes("tariff.")) {
        const [, tariffType] = name.split(".")
        return {
          ...prev,
          tariff: {
            ...prev.tariff,
            [tariffType]: value ?? "",
          } as Tariff,
        }
      }
      return {
        ...prev,
        [name]:
          name === "seatingCapacity" ||
          name === "diningCapacity" ||
          name === "parkingSlots" ||
          name === "changingRooms" ||
          name === "totalamount" ||
          name === "advAmnt"
            ? Number(value)
            : value,
      }
    }

    if (isNewVenue) {
      setNewVenue((prev) => updateState(prev))
    } else if (selectedVenue) {
      setSelectedVenue((prev) => (prev ? (updateState(prev) as Venue) : null))
    }
  }

  const handleCityToggle = (city: string): void => {
    setNewVenue((prev) => ({
      ...prev,
      cities: prev.cities?.includes(city) ? prev.cities.filter((c) => c !== city) : [...(prev.cities || []), city],
    }))
  }

  const handleTimeSlotToggle = (timeSlot: TimeSlot): void => {
    setNewVenue((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots?.some((s) => s.id === timeSlot.id)
        ? prev.timeSlots.filter((s) => s.id !== timeSlot.id)
        : [...(prev.timeSlots || []), timeSlot],
    }))
  }

  const handleCustomTimeSlotChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setCustomTimeSlot((prev) => ({ ...prev, [name]: value }))
  }

  const addCustomTimeSlot = (): void => {
    if (customTimeSlot.label && customTimeSlot.startTime && customTimeSlot.endTime) {
      const newTimeSlot: TimeSlot = {
        id: `custom-${Date.now()}`,
        label: customTimeSlot.label,
        startTime: customTimeSlot.startTime,
        endTime: customTimeSlot.endTime,
      }
      setNewVenue((prev) => ({
        ...prev,
        timeSlots: [...(prev.timeSlots || []), newTimeSlot],
      }))
      setCustomTimeSlot({ label: "", startTime: "", endTime: "" })
    }
  }

  const removeCustomTimeSlot = (timeSlotId: string): void => {
    setNewVenue((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots?.filter((s) => s.id !== timeSlotId) || [],
    }))
  }

  const removeExistingImage = (imageIndex: number): void => {
    if (selectedVenue) {
      setSelectedVenue({
        ...selectedVenue,
        images: selectedVenue.images.filter((_, index) => index !== imageIndex),
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || [])
    setSelectedImages((prev) => [...prev, ...files].slice(0, 10))
  }

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || [])
    setEditImages((prev) => [...prev, ...files])
  }

  const handleCityToggleEdit = (city: string): void => {
    if (selectedVenue) {
      setSelectedVenue((prev) =>
        prev
          ? {
              ...prev,
              cities: prev.cities?.includes(city)
                ? prev.cities.filter((c) => c !== city)
                : [...(prev.cities || []), city],
            }
          : null,
      )
    }
  }

  const filteredVenues = venues.filter(
    (venue) =>
      (venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (venueTypeFilter === "all" || venue.acType === venueTypeFilter),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex flex-col">
      <style jsx global>{`
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>

      <Header />

      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-4 sm:mb-6 border border-orange-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#78533F] mb-2">Auditorium Management</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage your venues efficiently</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#ED695A] text-white rounded-lg flex items-center justify-center hover:bg-[#d55a4b] transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Plus size={16} className="mr-2" /> Add New Venue
              </button>
            </div>
          </div>

          {/* Venues List */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Venues ({filteredVenues.length})</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search venues..."
                      className="w-full sm:w-64 pl-8 sm:pl-10 pr-4 py-2 border border-[#b09d94] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-2 sm:left-3 top-2.5 text-gray-400" size={16} />
                  </div>
                  <select
                    className="border border-[#b09d94] rounded-lg px-3 sm:px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    value={venueTypeFilter}
                    onChange={(e) => setVenueTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="AC">AC Venues</option>
                    <option value="Non-AC">Non-AC Venues</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredVenues.length === 0 ? (
                <div className="py-8 sm:py-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <ImageIcon size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-500 text-lg">No venues found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                </div>
              ) : (
                filteredVenues.map((venue) => (
                  <div key={`venue-${venue._id}`} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div
                        className="flex items-center cursor-pointer flex-1 min-w-0"
                        onClick={() => toggleVenueExpand(venue._id)}
                      >
                        <div className="mr-3 flex-shrink-0">
                          {expandedVenue === venue._id ? (
                            <ChevronDown size={16} className="text-gray-400" />
                          ) : (
                            <ChevronRight size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex mr-4 flex-shrink-0">
                          {venue.images.slice(0, 3).map((image, index) => (
                            <div
                              key={index}
                              className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm -ml-2 first:ml-0"
                            >
                              <img
                                src={image || "/placeholder.svg?height=48&width=48"}
                                alt={`${venue.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {venue.images.length > 3 && (
                            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gray-100 border-2 border-white shadow-sm -ml-2 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">+{venue.images.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-base sm:text-lg text-gray-800 truncate">{venue.name}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin size={12} className="mr-1 flex-shrink-0" />
                            <span className="text-xs sm:text-sm truncate">{venue.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            venue.acType === "AC" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {venue.acType}
                        </span>
                        <span className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs font-medium flex items-center">
                          <Users size={12} className="mr-1" /> {venue.seatingCapacity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            selectVenue(venue)
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteVenue(venue._id)
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>

                    {expandedVenue === venue._id && (
                      <div className="mt-4 sm:mt-6 ml-4 sm:ml-8 pl-4 border-l-2 border-orange-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <Phone size={14} className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-700">Contact</p>
                                <p className="text-xs sm:text-sm text-gray-600">{venue.phone}</p>
                                {venue.altPhone && <p className="text-xs sm:text-sm text-gray-600">{venue.altPhone}</p>}
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Mail size={14} className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-700">Email</p>
                                <p className="text-xs sm:text-sm text-gray-600 break-all">{venue.email}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <Users size={14} className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-700">Capacity</p>
                                <p className="text-xs sm:text-sm text-gray-600">Seating: {venue.seatingCapacity}</p>
                                <p className="text-xs sm:text-sm text-gray-600">Dining: {venue.diningCapacity}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Car size={14} className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-700">Parking</p>
                                <p className="text-xs sm:text-sm text-gray-600">{venue.parkingSlots} slots</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <MapPin size={14} className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-700">Location</p>
                                <p className="text-xs sm:text-sm text-gray-600">Panchayat: {venue.panchayat}</p>
                                <p className="text-xs sm:text-sm text-gray-600">Cities: {venue.cities.join(", ")}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Wind size={14} className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-700">Amenities</p>
                                <p className="text-xs sm:text-sm text-gray-600">{venue.amenities.join(", ")}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Venue Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
            {/* Fixed Header */}
            <div className="flex-shrink-0 border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Add New Venue</h2>
                <button onClick={resetAddModal} className="text-gray-500 hover:text-gray-700 p-1">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-custom px-4 sm:px-6 py-4">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Name *</label>
                    <input
                      name="name"
                      value={newVenue.name || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter venue name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Type *</label>
                    <select
                      name="acType"
                      value={newVenue.acType || "AC"}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    >
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                    <textarea
                      name="address"
                      value={newVenue.address || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      rows={3}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm resize-none"
                      placeholder="Enter complete address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      name="phone"
                      value={newVenue.phone || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alternative Phone</label>
                    <input
                      name="altPhone"
                      value={newVenue.altPhone || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter alternative phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={newVenue.email || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                    <input
                      name="pincode"
                      value={newVenue.pincode || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter pincode"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Panchayat *</label>
                    <select
                      name="panchayat"
                      value={newVenue.panchayat || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      required
                    >
                      <option value="" disabled>
                        Select Panchayat
                      </option>
                      {panchayatOptions.map((panchayat) => (
                        <option key={panchayat} value={panchayat}>
                          {panchayat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cities *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-[#b09d94] rounded-lg p-3 bg-gray-50 scrollbar-custom">
                      {availableCities.map((city) => (
                        <label key={city} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newVenue.cities?.includes(city) || false}
                            onChange={() => handleCityToggle(city)}
                            className="h-4 w-4 rounded text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">{city}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Seating Capacity *</label>
                    <input
                      name="seatingCapacity"
                      type="number"
                      value={newVenue.seatingCapacity || 0}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter seating capacity"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dining Capacity *</label>
                    <input
                      name="diningCapacity"
                      type="number"
                      value={newVenue.diningCapacity || 0}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter dining capacity"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Parking Slots</label>
                    <input
                      name="parkingSlots"
                      type="number"
                      value={newVenue.parkingSlots || 0}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter parking slots"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Changing Rooms</label>
                    <input
                      name="changingRooms"
                      type="number"
                      value={newVenue.changingRooms || 0}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter changing rooms"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Amount *</label>
                    <input
                      name="totalamount"
                      type="number"
                      value={newVenue.totalamount || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter total amount"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Advance Amount *</label>
                    <input
                      name="advAmnt"
                      type="number"
                      value={newVenue.advAmnt || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter advance amount"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stage Size</label>
                    <input
                      name="stageSize"
                      value={newVenue.stageSize || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter stage size (e.g., 20x15 feet)"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                    <textarea
                      name="amenities"
                      value={newVenue.amenities?.join(", ") || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      rows={2}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm resize-none"
                      placeholder="Enter amenities separated by commas (e.g., WiFi, Projector, Sound System)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple amenities with commas</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Wedding Tariff</label>
                    <input
                      name="tariff.wedding"
                      value={newVenue.tariff?.wedding || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter wedding tariff"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reception Tariff</label>
                    <input
                      name="tariff.reception"
                      value={newVenue.tariff?.reception || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter reception tariff"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cancellation Policy</label>
                    <input
                      name="cancellationPolicy"
                      value={newVenue.cancellationPolicy || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      placeholder="Enter cancellation policy"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Food Policy</label>
                    <textarea
                      name="foodPolicy"
                      value={newVenue.foodPolicy || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      rows={2}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm resize-none"
                      placeholder="Enter food policy"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Decoration Policy</label>
                    <textarea
                      name="decorPolicy"
                      value={newVenue.decorPolicy || ""}
                      onChange={(e) => handleInputChange(e, true)}
                      rows={2}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm resize-none"
                      placeholder="Enter decoration policy"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Images (minimum 4) *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-600 text-sm">Click to upload images or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each (max 10 images)</p>
                      </label>
                    </div>
                    {selectedImages.length < 4 && (
                      <p className="text-sm text-red-500 mt-2">Please select at least 4 images.</p>
                    )}
                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
                        {selectedImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                              <img
                                src={URL.createObjectURL(file) || "/placeholder.svg"}
                                alt={`preview-${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slots</label>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Fixed Time Slots:</p>
                      <div className="flex flex-wrap gap-2">
                        {fixedTimeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleTimeSlotToggle(slot)}
                            className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                              newVenue.timeSlots?.some((s) => s.id === slot.id)
                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            {slot.label}: {slot.startTime} - {slot.endTime}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="border border-[#b09d94] rounded-lg p-4 bg-gray-50">
                      <p className="text-sm font-medium text-gray-700 mb-3">Add Custom Time Slot:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                        <input
                          name="label"
                          placeholder="Label (e.g., Late Night)"
                          value={customTimeSlot.label}
                          onChange={handleCustomTimeSlotChange}
                          className="px-3 py-2 border border-[#b09d94] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#876553]"
                        />
                        <input
                          name="startTime"
                          type="time"
                          value={customTimeSlot.startTime}
                          onChange={handleCustomTimeSlotChange}
                          className="px-3 py-2 border border-[#b09d94] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#876553]"
                        />
                        <input
                          name="endTime"
                          type="time"
                          value={customTimeSlot.endTime}
                          onChange={handleCustomTimeSlotChange}
                          className="px-3 py-2 border border-[#b09d94] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#876553]"
                        />
                        <button
                          type="button"
                          onClick={addCustomTimeSlot}
                          disabled={!customTimeSlot.label || !customTimeSlot.startTime || !customTimeSlot.endTime}
                          className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          Add Slot
                        </button>
                      </div>
                      {newVenue.timeSlots?.filter((slot) => slot.id.startsWith("custom-")).length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Custom Time Slots:</p>
                          <div className="flex flex-wrap gap-2">
                            {newVenue.timeSlots
                              ?.filter((slot) => slot.id.startsWith("custom-"))
                              .map((slot) => (
                                <div
                                  key={slot.id}
                                  className="flex items-center px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm"
                                >
                                  <span className="mr-2">
                                    {slot.label}: {slot.startTime} - {slot.endTime}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeCustomTimeSlot(slot.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-xl bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={resetAddModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVenue}
                  disabled={
                    !newVenue.name ||
                    !newVenue.address ||
                    !newVenue.phone ||
                    !newVenue.email ||
                    !newVenue.panchayat ||
                    !newVenue.cities?.length ||
                    newVenue.seatingCapacity === 0 ||
                    newVenue.diningCapacity === 0 ||
                    !newVenue.totalamount ||
                    !newVenue.advAmnt ||
                    selectedImages.length < 4
                  }
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Add Venue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Venue Modal */}
      {isEditModalOpen && selectedVenue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
            {/* Fixed Header */}
            <div className="flex-shrink-0 border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Edit Venue: {selectedVenue.name}</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700 p-1">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-custom px-4 sm:px-6 py-4">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Name</label>
                    <input
                      name="name"
                      value={selectedVenue.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Type</label>
                    <select
                      name="acType"
                      value={selectedVenue.acType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    >
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={selectedVenue.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      name="phone"
                      value={selectedVenue.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alternative Phone</label>
                    <input
                      name="altPhone"
                      value={selectedVenue.altPhone || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={selectedVenue.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                    <input
                      name="pincode"
                      value={selectedVenue.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Panchayat</label>
                    <select
                      name="panchayat"
                      value={selectedVenue.panchayat || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    >
                      <option value="" disabled>
                        Select Panchayat
                      </option>
                      {panchayatOptions.map((panchayat) => (
                        <option key={panchayat} value={panchayat}>
                          {panchayat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cities</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-[#b09d94] rounded-lg p-3 bg-gray-50 scrollbar-custom">
                      {availableCities.map((city) => (
                        <label key={city} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedVenue.cities?.includes(city) || false}
                            onChange={() => handleCityToggleEdit(city)}
                            className="h-4 w-4 rounded text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">{city}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Seating Capacity</label>
                    <input
                      name="seatingCapacity"
                      type="number"
                      value={selectedVenue.seatingCapacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dining Capacity</label>
                    <input
                      name="diningCapacity"
                      type="number"
                      value={selectedVenue.diningCapacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Parking Slots</label>
                    <input
                      name="parkingSlots"
                      type="number"
                      value={selectedVenue.parkingSlots}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Changing Rooms</label>
                    <input
                      name="changingRooms"
                      type="number"
                      value={selectedVenue.changingRooms}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Amount</label>
                    <input
                      name="totalamount"
                      type="number"
                      value={selectedVenue.totalamount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Advance Amount</label>
                    <input
                      name="advAmnt"
                      type="number"
                      value={selectedVenue.advAmnt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stage Size</label>
                    <input
                      name="stageSize"
                      value={selectedVenue.stageSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                    <textarea
                      name="amenities"
                      value={selectedVenue.amenities.join(", ") || ""}
                      onChange={(e) => handleInputChange(e)}
                      rows={2}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm resize-none"
                      placeholder="Enter amenities separated by commas (e.g., WiFi, Projector, Sound System)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple amenities with commas</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Wedding Tariff</label>
                    <input
                      name="tariff.wedding"
                      value={selectedVenue.tariff.wedding}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reception Tariff</label>
                    <input
                      name="tariff.reception"
                      value={selectedVenue.tariff.reception}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cancellation Policy</label>
                    <input
                      name="cancellationPolicy"
                      value={selectedVenue.cancellationPolicy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Food Policy</label>
                    <textarea
                      name="foodPolicy"
                      value={selectedVenue.foodPolicy}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Decoration Policy</label>
                    <textarea
                      name="decorPolicy"
                      value={selectedVenue.decorPolicy}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Images</label>
                    {selectedVenue.images.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                          {selectedVenue.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                  src={image || "/placeholder.svg?height=48&width=48"}
                                  alt={`venue-${index}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEditImageUpload}
                        className="hidden"
                        id="edit-image-upload"
                      />
                      <label htmlFor="edit-image-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-600 text-sm">Add more images</p>
                      </label>
                    </div>
                    {editImages.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">New Images to Add:</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                          {editImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-200">
                                <img
                                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                                  alt={`new-${index}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => setEditImages((prev) => prev.filter((_, i) => i !== index))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-xl bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateVenue}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
