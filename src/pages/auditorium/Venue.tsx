"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, MapPin, Phone, Mail, Users, Car, Wind, Trash, Edit, Plus, X, ChevronRight, ChevronDown } from "lucide-react"
import { addVenueAPI, existingAllVenues, updateVenues } from "../../api/userApi"
import { toast } from "react-toastify"
import Header from "../../component/user/Header"
import Sidebar from "../../component/auditorium/Sidebar"

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
}

interface Venue {
  id: string
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
  images: string[]
  timeSlots: TimeSlot[]
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

const fetchVenuesAPI = async (): Promise<Venue[]> => {
  try {
    const response = await existingAllVenues()
    return response.data.map((item: any) => ({
      id: item._id,
      name: item.name,
      address: item.address,
      phone: item.phone,
      altPhone: item.altPhone || "",
      pincode: item.pincode,
      email: item.email,
      cities: item.cities || [],
      changingRooms: parseInt(item.changingRooms) || 0,
      seatingCapacity: parseInt(item.seatingCapacity) || 0,
      parkingSlots: parseInt(item.parkingSlots) || 0,
      acType: item.acType,
      diningCapacity: parseInt(item.diningCapacity) || 0,
      tariff: item.tariff || { wedding: "", reception: "" },
      cancellationPolicy: item.cancellationPolicy || "",
      stageSize: item.stageSize || "",
      amenities: item.amenities || [],
      foodPolicy: item.foodPolicy || "",
      decorPolicy: item.decorPolicy || "",
      images: item.images || [],
      timeSlots: item.timeSlots.map((slot: any, index: number) => ({
        id: slot.id || `db-slot-${index}`,
        label: slot.label || `Slot ${index + 1}`,
        startTime: slot.startTime || "",
        endTime: slot.endTime || "",
      })) || [],
    }))
  } catch (error) {
    console.error("Error fetching venues from API:", error)
    return []
  }
}

// const updateVenueAPI = async (id: string, venue: Venue): Promise<void> => {
//   console.log("Updating venue:", id, venue)
// }

const deleteVenueAPI = async (id: string): Promise<void> => {
  console.log("Deleting venue:", id)
}

export default function VenueManagement() {
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
  })

  const [customTimeSlot, setCustomTimeSlot] = useState({
    label: "",
    startTime: "",
    endTime: "",
  })

  const fetchVenues = async () => {
    const response = await fetchVenuesAPI()
    setVenues(Array.isArray(response) ? response : [])
  }

  useEffect(() => {
    fetchVenues()
  }, [])

  const toggleVenueExpand = (id: string) => {
    setExpandedVenue(expandedVenue === id ? null : id)
  }

  const selectVenue = (venue: Venue) => {
    setSelectedVenue(venue)
    setIsEditModalOpen(true)
  }

  const deleteVenue = async (id: string) => {
    try {
      await deleteVenueAPI(id)
      setVenues(venues.filter((venue) => venue.id !== id))
      if (selectedVenue?.id === id) setSelectedVenue(null)
    } catch (error) {
      console.error("Error deleting venue:", error)
    }
  }

  const resetAddModal = () => {
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
      tariff: { wedding: "", reception: "" },
      cancellationPolicy: "",
      stageSize: "",
      images: [],
      altPhone: "",
      timeSlots: [],
    })
    setCustomTimeSlot({ label: "", startTime: "", endTime: "" })
    setIsAddModalOpen(false)
  }

  const handleAddVenue = async () => {
    try {
      const venueToAdd: Venue = {
        ...newVenue,
        id: "",
        cities: newVenue.cities || [],
        images: newVenue.images || [],
        timeSlots: newVenue.timeSlots || [],
        amenities: newVenue.amenities || [],
        tariff: newVenue.tariff || { wedding: "", reception: "" },
        changingRooms: newVenue.changingRooms || 0,
        seatingCapacity: newVenue.seatingCapacity || 0,
        parkingSlots: newVenue.parkingSlots || 0,
        diningCapacity: newVenue.diningCapacity || 0,
      } as Venue

      const response = await addVenueAPI(venueToAdd)
      toast.success(response.data?.message || "Venue added successfully")
      resetAddModal()
      await fetchVenues()
    } catch (error) {
      console.error("Error adding venue:", error)
    }
  }

 const handleUpdateVenue = async () => {
  if (!selectedVenue) return;

  try {
    const response = await updateVenues(selectedVenue, selectedVenue.id);

    if (response.data.success) {
      toast.success(response.data.message);

      setVenues(
        venues.map((venue) =>
          venue.id === selectedVenue.id ? selectedVenue : venue
        )
      );
      setIsEditModalOpen(false);
      setSelectedVenue(null);
    } else {
      // ✅ If success is false, show error toast
      toast.error(response.data.message || 'Failed to update venue');
    }

  } catch (error) {
    console.error('Error updating venue:', error);
    toast.error('Something went wrong while updating venue');
  }
};


 const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  isNewVenue = false,
) => {
  const { name, value } = e.target;

  const updateState = (prev: Venue): Venue => {
    if (name.includes("tariff.")) {
      const [, tariffType] = name.split(".");

      return {
        ...prev,
        tariff: {
          ...prev.tariff,
          [tariffType]: value ?? "",
        } as Tariff,
      };
    }

    return {
      ...prev,
      [name]: value,
    };
  };

  if (isNewVenue) {
    setNewVenue((prev) => (prev ? updateState(prev) : prev));
  } else if (selectedVenue) {
    setSelectedVenue((prev) => (prev ? updateState(prev) : prev));
  }
};

  const handleCityToggle = (city: string) => {
    setNewVenue((prev) => ({
      ...prev,
      cities: prev.cities?.includes(city) ? prev.cities.filter((c) => c !== city) : [...(prev.cities || []), city],
    }))
  }

  const handleTimeSlotToggle = (timeSlot: TimeSlot) => {
    setNewVenue((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots?.some((s) => s.id === timeSlot.id)
        ? prev.timeSlots.filter((s) => s.id !== timeSlot.id)
        : [...(prev.timeSlots || []), timeSlot],
    }))
  }

  const handleCustomTimeSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomTimeSlot((prev) => ({ ...prev, [name]: value }))
  }

  const addCustomTimeSlot = () => {
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

  const removeCustomTimeSlot = (timeSlotId: string) => {
    setNewVenue((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots?.filter((s) => s.id !== timeSlotId) || [],
    }))
  }

  const filteredVenues = venues.filter(
    (venue) =>
      (venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (venueTypeFilter === "all" || venue.acType === venueTypeFilter),
  )

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-[#78533F]">Auditorium Management</h1>
                <p className="text-[#796458]">Manage your venues</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-[#ED695A] text-white rounded-md flex items-center hover:bg-[#ED695A]/90"
              >
                <Plus size={18} className="mr-2" /> Add Venue
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Venues</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search venues..."
                    className="pl-9 pr-3 py-2 border rounded-md bg-gray-50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <select
                  className="border rounded-md px-3 py-2"
                  value={venueTypeFilter}
                  onChange={(e) => setVenueTypeFilter(e.target.value)}
                >
                  <option value="all">All Venues</option>
                  <option value="AC">AC Venues</option>
                  <option value="Non-AC">Non-AC Venues</option>
                </select>
              </div>
            </div>

            <div className="divide-y">
              {filteredVenues.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No venues found</div>
              ) : (
                filteredVenues.map((venue) => (
                  <div key={`venue-${venue.id}`} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center cursor-pointer" onClick={() => toggleVenueExpand(venue.id)}>
                        {expandedVenue === venue.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        <div className="ml-2">
                          <h3 className="font-medium">{venue.name}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin size={14} className="mr-1" /> {venue.address}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            venue.acType === "AC" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {venue.acType}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                          <Users size={12} className="inline mr-1" /> {venue.seatingCapacity}
                        </span>
                        <button onClick={() => selectVenue(venue)} className="p-1.5 hover:bg-gray-100 rounded-md">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteVenue(venue.id)} className="p-1.5 hover:bg-gray-100 rounded-md">
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>

                    {expandedVenue === venue.id && (
                      <div className="mt-3 ml-6 pl-2 border-l-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <Phone size={16} className="mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Contact</p>
                                <p className="text-sm">{venue.phone}</p>
                                {venue.altPhone && <p className="text-sm">{venue.altPhone}</p>}
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Mail size={16} className="mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm">{venue.email}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <MapPin size={16} className="mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Cities</p>
                                <p className="text-sm">{venue.cities.join(", ")}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <Users size={16} className="mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Capacity</p>
                                <p className="text-sm">Seating: {venue.seatingCapacity}</p>
                                <p className="text-sm">Dining: {venue.diningCapacity}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Car size={16} className="mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Parking</p>
                                <p className="text-sm">{venue.parkingSlots} slots</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Wind size={16} className="mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Amenities</p>
                                <p className="text-sm">{venue.amenities.join(", ")}</p>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-[700px] max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Add New Venue</h2>
              <button onClick={resetAddModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Venue Name *</label>
                  <input
                    name="name"
                    value={newVenue.name || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Venue Type *</label>
                  <select
                    name="acType"
                    value={newVenue.acType || "AC"}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  >
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <textarea
                    name="address"
                    value={newVenue.address || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <input
                    name="phone"
                    value={newVenue.phone || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alternative Phone</label>
                  <input
                    name="altPhone"
                    value={newVenue.altPhone || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={newVenue.email || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode</label>
                  <input
                    name="pincode"
                    value={newVenue.pincode || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Cities *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
                    {availableCities.map((city) => (
                      <label key={city} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newVenue.cities?.includes(city) || false}
                          onChange={() => handleCityToggle(city)}
                          className="h-4 w-4 rounded text-[#ED695A]"
                        />
                        <span className="text-sm">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Seating Capacity *</label>
                  <input
                    name="seatingCapacity"
                    type="number"
                    value={newVenue.seatingCapacity || 0}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dining Capacity *</label>
                  <input
                    name="diningCapacity"
                    type="number"
                    value={newVenue.diningCapacity || 0}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Parking Slots</label>
                  <input
                    name="parkingSlots"
                    type="number"
                    value={newVenue.parkingSlots || 0}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Changing Rooms</label>
                  <input
                    name="changingRooms"
                    type="number"
                    value={newVenue.changingRooms || 0}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Stage Size</label>
                  <input
                    name="stageSize"
                    value={newVenue.stageSize || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Amenities</label>
                  <textarea
                    name="amenities"
                    value={newVenue.amenities?.join(", ") || ""}
                    onChange={(e) =>
                      setNewVenue({
                        ...newVenue,
                        amenities: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                    placeholder="Enter amenities separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Wedding Tariff</label>
                  <input
                    name="tariff.wedding"
                    value={newVenue.tariff?.wedding || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reception Tariff</label>
                  <input
                    name="tariff.reception"
                    value={newVenue.tariff?.reception || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Cancellation Policy</label>
                  <input
                    name="cancellationPolicy"
                    value={newVenue.cancellationPolicy || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Food Policy</label>
                  <textarea
                    name="foodPolicy"
                    value={newVenue.foodPolicy || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Decoration Policy</label>
                  <textarea
                    name="decorPolicy"
                    value={newVenue.decorPolicy || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                {/* Time Slots Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Time Slots</label>

                  {/* Fixed Time Slots */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Fixed Time Slots:</p>
                    <div className="flex flex-wrap gap-2">
                      {fixedTimeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleTimeSlotToggle(slot)}
                          className={`px-3 py-2 rounded-lg border-2 text-sm ${
                            newVenue.timeSlots?.some((s) => s.id === slot.id)
                              ? "border-[#ED695A] bg-[#ED695A]/10 text-[#ED695A]"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {slot.label}: {slot.startTime} - {slot.endTime}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Time Slots */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center mb-3">
                      <p className="text-sm font-medium">Add Custom Time Slot:</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <input
                        name="label"
                        placeholder="Label (e.g., Late Night)"
                        value={customTimeSlot.label}
                        onChange={handleCustomTimeSlotChange}
                        className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                      />
                      <input
                        name="startTime"
                        type="time"
                        value={customTimeSlot.startTime}
                        onChange={handleCustomTimeSlotChange}
                        className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                      />
                      <input
                        name="endTime"
                        type="time"
                        value={customTimeSlot.endTime}
                        onChange={handleCustomTimeSlotChange}
                        className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                      />
                      <button
                        type="button"
                        onClick={addCustomTimeSlot}
                        disabled={!customTimeSlot.label || !customTimeSlot.startTime || !customTimeSlot.endTime}
                        className="px-3 py-2 bg-[#ED695A] text-white rounded-md text-sm hover:bg-[#ED695A]/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>

                    {/* Display Custom Time Slots */}
                    {newVenue.timeSlots?.filter((slot) => slot.id.startsWith("custom-")).length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Custom Time Slots:</p>
                        <div className="flex flex-wrap gap-2">
                          {newVenue.timeSlots
                            ?.filter((slot) => slot.id.startsWith("custom-"))
                            .map((slot) => (
                              <div
                                key={slot.id}
                                className="flex items-center px-3 py-2 bg-white border border-[#ED695A] rounded-lg text-sm"
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

              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={resetAddModal} className="px-4 py-2 border rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleAddVenue}
                  disabled={
                    !newVenue.name ||
                    !newVenue.address ||
                    !newVenue.phone ||
                    !newVenue.email ||
                    !newVenue.cities?.length ||
                    newVenue.seatingCapacity === 0 ||
                    newVenue.diningCapacity === 0
                  }
                  className="px-4 py-2 bg-[#ED695A] text-white rounded-md hover:bg-[#ED695A]/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-[600px] max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Edit Venue: {selectedVenue.name}</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Venue Name</label>
                  <input
                    name="name"
                    value={selectedVenue.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Venue Type</label>
                  <select
                    name="acType"
                    value={selectedVenue.acType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  >
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    name="address"
                    value={selectedVenue.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    name="phone"
                    value={selectedVenue.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alternative Phone</label>
                  <input
                    name="altPhone"
                    value={selectedVenue.altPhone || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={selectedVenue.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode</label>
                  <input
                    name="pincode"
                    value={selectedVenue.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Seating Capacity</label>
                  <input
                    name="seatingCapacity"
                    type="number"
                    value={selectedVenue.seatingCapacity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dining Capacity</label>
                  <input
                    name="diningCapacity"
                    type="number"
                    value={selectedVenue.diningCapacity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Parking Slots</label>
                  <input
                    name="parkingSlots"
                    type="number"
                    value={selectedVenue.parkingSlots}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Changing Rooms</label>
                  <input
                    name="changingRooms"
                    type="number"
                    value={selectedVenue.changingRooms}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Stage Size</label>
                  <input
                    name="stageSize"
                    value={selectedVenue.stageSize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Amenities</label>
                  <textarea
                    name="amenities"
                    value={selectedVenue.amenities.join(", ")}
                    onChange={(e) =>
                      setSelectedVenue({
                        ...selectedVenue,
                        amenities: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Wedding Tariff</label>
                  <input
                    name="tariff.wedding"
                    value={selectedVenue.tariff.wedding}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reception Tariff</label>
                  <input
                    name="tariff.reception"
                    value={selectedVenue.tariff.reception}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Cancellation Policy</label>
                  <input
                    name="cancellationPolicy"
                    value={selectedVenue.cancellationPolicy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Food Policy</label>
                  <textarea
                    name="foodPolicy"
                    value={selectedVenue.foodPolicy}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Decoration Policy</label>
                  <textarea
                    name="decorPolicy"
                    value={selectedVenue.decorPolicy}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleUpdateVenue}
                  className="px-4 py-2 bg-[#ED695A] text-white rounded-md hover:bg-[#ED695A]/90"
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