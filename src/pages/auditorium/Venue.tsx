"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, MapPin, Trash, Edit, Plus, X, ChevronRight, ChevronDown, ImageIcon, Users } from "lucide-react"
import {
  addVenueAPI,
  deleteVenueAPI,
  existingAllVenues,
  fetchAuditoriumUserdetails,
  updateVenues,
  getItems,
} from "../../api/userApi"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
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
  district: string
  email: string
  panchayat: string
  locations: string[]
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
  events: string[]
  youtubeLink?: string
  guestRooms?: number
  termsAndConditions?: string
  acAdvanceAmount?: string
  acCompleteAmount?: string
  nonAcAdvanceAmount?: string
  nonAcCompleteAmount?: string
}

interface RootState {
  auth: {
    currentUser: {
      id: string
      phone?: string
      email?: string
    }
  }
}

interface UserData {
  address: string
  panchayat: string
  municipality: string
  corporation: string
  phone?: string
  email?: string
  district: string
  locations?: string[]
  events?: string[]
  amenities?: string[]
}

const fixedTimeSlots: TimeSlot[] = [
  { id: "morning", label: "Morning", startTime: "06:00", endTime: "12:00" },
  { id: "afternoon", label: "Afternoon", startTime: "12:00", endTime: "18:00" },
  { id: "evening", label: "Evening", startTime: "18:00", endTime: "23:00" },
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

  const [isAcTypeModalOpen, setIsAcTypeModalOpen] = useState(false)
  const [isEditAcTypeModalOpen, setIsEditAcTypeModalOpen] = useState(false)
  const [acTypeSelection, setAcTypeSelection] = useState<string>("")

  const [availableLocations, setAvailableLocations] = useState<string[]>([])
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([])
  const [availableEvents, setAvailableEvents] = useState<string[]>([])

  const [newVenue, setNewVenue] = useState<Partial<Venue>>({
    name: "",
    address: "",
    phone: "",
    email: "",
    pincode: "",
    panchayat: "",
    locations: [],
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
    events: [],
    youtubeLink: "",
    guestRooms: 0,
    district: "",
    termsAndConditions: "",
    acAdvanceAmount: "",
    acCompleteAmount: "",
    nonAcAdvanceAmount: "",
    nonAcCompleteAmount: "",
  })

  const [customTimeSlot, setCustomTimeSlot] = useState({ label: "", startTime: "", endTime: "" })
  const [customTimeSlotEdit, setCustomTimeSlotEdit] = useState({ label: "", startTime: "", endTime: "" })

  const [userData, setUserData] = useState<UserData | null>(null)
  const [locationLabel, setLocationLabel] = useState("Panchayat")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const { currentUser } = useSelector((state: RootState) => state.auth)

  const fetchBackendItems = async () => {
    try {
      const response = await getItems("all")
      const items = response.data.items || {}
      setAvailableLocations(items.locations || [])
      setAvailableAmenities(items.amenities || [])
      setAvailableEvents(items.events || [])
    } catch (error) {
      console.error("Failed to fetch items:", error)
      toast.error("Failed to load options.")
    }
  }

  const fetchVenues = async (): Promise<void> => {
    try {
      const response = await existingAllVenues(currentUser.id)
      setVenues(response.data)
    } catch (error) {
      console.error("Error fetching venues:", error)
      toast.error("Failed to load venues.")
    }
  }

  const fetchUserData = async (): Promise<void> => {
    try {
      const response = await fetchAuditoriumUserdetails(currentUser.id)
      const data: UserData = {
        address: response.data.address || "",
        panchayat: response.data.panchayat || "",
        municipality: response.data.municipality || "",
        corporation: response.data.corporation || "",
        phone: response.data.phone || "",
        email: currentUser.email || "",
        district: response.data.district || "",
        locations: response.data.locations || [],
        events: response.data.events || [],
        amenities: response.data.amenities || [],
      }
      setUserData(data)

      let defaultLocation = ""
      let label = "Panchayat"
      if (data.municipality && data.municipality !== "") {
        defaultLocation = data.municipality
        label = "Municipality"
      } else if (data.corporation && data.corporation !== "") {
        defaultLocation = data.corporation
        label = "Corporation"
      } else if (data.panchayat && data.panchayat !== "") {
        defaultLocation = data.panchayat
        label = "Panchayat"
      }
      setLocationLabel(label)

      setNewVenue((prev) => ({
        ...prev,
        address: data.address,
        panchayat: defaultLocation,
        district: data.district,
        phone: data.phone,
        email: data.email,
        locations: data.locations?.length ? data.locations : prev.locations || [],
        events: data.events?.length ? data.events : prev.events || [],
        amenities: data.amenities?.length ? data.amenities : prev.amenities || [],
      }))
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast.error("Failed to load user data.")
    }
  }

  useEffect(() => {
    fetchBackendItems()
    fetchVenues()
    fetchUserData()
  }, [currentUser.id])

  useEffect(() => {
    if (availableEvents.length > 0 && newVenue.events?.length === 0) {
      setNewVenue((prev) => ({ ...prev, events: [availableEvents[0]] }))
    }
  }, [availableEvents])

  const mergeUserDefaults = (venue: Partial<Venue>, user: UserData): Partial<Venue> => ({
    ...venue,
    address: user.address || venue.address || "",
    phone: user.phone || venue.phone || "",
    email: user.email || venue.email || "",
    panchayat: user.panchayat || user.municipality || user.corporation || venue.panchayat || "",
    district: user.district || venue.district || "",
    events: venue.events?.length ? venue.events : user.events || [],
    amenities: venue.amenities?.length ? venue.amenities : user.amenities || [],
  })

  const toggleVenueExpand = (id: string): void => {
    setExpandedVenue(expandedVenue === id ? null : id)
  }

  const selectVenue = (venue: Venue): void => {
    let label = "Panchayat"
    if (userData?.municipality) label = "Municipality"
    else if (userData?.corporation) label = "Corporation"
    setLocationLabel(label)

    const merged = mergeUserDefaults(venue, userData!)

    setSelectedVenue({
      ...merged,
      _id: venue._id,
      timeSlots: venue.timeSlots || [],
      termsAndConditions: venue.termsAndConditions || "",
      acAdvanceAmount: venue.acAdvanceAmount || "", // Updated field name
      acCompleteAmount: venue.acCompleteAmount || "", // Updated field name
      nonAcAdvanceAmount: venue.nonAcAdvanceAmount || "", // Updated field name
      nonAcCompleteAmount: venue.nonAcCompleteAmount || "", // Updated field name
    } as Venue)

    setEditImages([])
    setAcTypeSelection(venue.acType || "AC")
    setIsEditModalOpen(true)
  }

  const deleteVenue = async (id: string, name: string): Promise<void> => {
    const result = await Swal.fire({
      title: "Are you sure?",
      html: `Delete <b>${name}</b>? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    })
    if (result.isConfirmed) {
      try {
        await deleteVenueAPI(id)
        setVenues(venues.filter((v) => v._id !== id))
        toast.success(`"${name}" deleted.`)
      } catch (error) {
        toast.error("Failed to delete.")
      }
    }
  }

  const resetAddModal = (): void => {
    if (!userData) return

    const defaults = mergeUserDefaults(
      {
        name: "",
        address: userData.address,
        phone: userData.phone,
        email: userData.email,
        pincode: "",
        panchayat: userData.municipality || userData.corporation || userData.panchayat || "",
        acType: "AC",
        seatingCapacity: 0,
        diningCapacity: 0,
        parkingSlots: 0,
        changingRooms: 0,
        tariff: { wedding: "", reception: "" },
        totalamount: "",
        advAmnt: "",
        stageSize: "",
        guestRooms: 0,
        youtubeLink: "",
        termsAndConditions: "",
        events: userData.events || [],
        amenities: userData.amenities || [],
        acAdvanceAmount: "", // Updated field name
        acCompleteAmount: "", // Updated field name
        nonAcAdvanceAmount: "", // Updated field name
        nonAcCompleteAmount: "", // Updated field name
      },
      userData,
    )

    setNewVenue({
      ...defaults,
      images: [],
      altPhone: "",
      timeSlots: [],
      foodPolicy: "",
      decorPolicy: "",
      cancellationPolicy: "",
    })

    setCustomTimeSlot({ label: "", startTime: "", endTime: "" })
    setSelectedImages([])
    setErrors({})
    setIsAddModalOpen(false)
    setAcTypeSelection("")
    setIsAcTypeModalOpen(false)
  }

  const validateAdd = () => {
    const tempErrors: { [key: string]: string } = {}
    if (!newVenue.name) tempErrors.name = "Required"
    if (!newVenue.address) tempErrors.address = "Required"
    if (!newVenue.phone) tempErrors.phone = "Required"
    if (!newVenue.email) tempErrors.email = "Required"
    if (!newVenue.panchayat) tempErrors.panchayat = "Required"
    if (!newVenue.seatingCapacity || newVenue.seatingCapacity <= 0) tempErrors.seatingCapacity = "Positive number"
    if (!newVenue.diningCapacity || newVenue.diningCapacity <= 0) tempErrors.diningCapacity = "Positive number"
    if (!newVenue.events?.length) tempErrors.events = "Select at least one"
    if (selectedImages.length < 4) tempErrors.images = "At least 4 images"

    // Validate payment fields based on AC type
    if (newVenue.acType === "AC") {
      if (!newVenue.acAdvanceAmount || Number(newVenue.acAdvanceAmount) <= 0)
        tempErrors.acAdvanceAmount = "Positive number" // Updated field name
      if (!newVenue.acCompleteAmount || Number(newVenue.acCompleteAmount) <= 0)
        tempErrors.acCompleteAmount = "Positive number" // Updated field name
    } else if (newVenue.acType === "Non-AC") {
      if (!newVenue.nonAcAdvanceAmount || Number(newVenue.nonAcAdvanceAmount) <= 0)
        tempErrors.nonAcAdvanceAmount = "Positive number" // Updated field name
      if (!newVenue.nonAcCompleteAmount || Number(newVenue.nonAcCompleteAmount) <= 0)
        tempErrors.nonAcCompleteAmount = "Positive number" // Updated field name
    } else if (newVenue.acType === "Both") {
      if (!newVenue.acAdvanceAmount || Number(newVenue.acAdvanceAmount) <= 0)
        tempErrors.acAdvanceAmount = "Positive number" // Updated field name
      if (!newVenue.acCompleteAmount || Number(newVenue.acCompleteAmount) <= 0)
        tempErrors.acCompleteAmount = "Positive number" // Updated field name
      if (!newVenue.nonAcAdvanceAmount || Number(newVenue.nonAcAdvanceAmount) <= 0)
        tempErrors.nonAcAdvanceAmount = "Positive number" // Updated field name
      if (!newVenue.nonAcCompleteAmount || Number(newVenue.nonAcCompleteAmount) <= 0)
        tempErrors.nonAcCompleteAmount = "Positive number" // Updated field name
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const validateEdit = () => {
    if (!selectedVenue) return false
    const tempErrors: { [key: string]: string } = {}
    if (!selectedVenue.name) tempErrors.name = "Required"
    if (!selectedVenue.address) tempErrors.address = "Required"
    if (!selectedVenue.phone) tempErrors.phone = "Required"
    if (!selectedVenue.email) tempErrors.email = "Required"
    if (!selectedVenue.panchayat) tempErrors.panchayat = "Required"
    if (!selectedVenue.seatingCapacity || selectedVenue.seatingCapacity <= 0)
      tempErrors.seatingCapacity = "Positive number"
    if (!selectedVenue.diningCapacity || selectedVenue.diningCapacity <= 0)
      tempErrors.diningCapacity = "Positive number"
    if (!selectedVenue.events?.length) tempErrors.events = "Select at least one"
    if (selectedVenue.images.length + editImages.length < 4) tempErrors.images = "At least 4 images"

    // Validate payment fields based on AC type
    if (selectedVenue.acType === "AC") {
      if (!selectedVenue.acAdvanceAmount || Number(selectedVenue.acAdvanceAmount) <= 0)
        tempErrors.acAdvanceAmount = "Positive number" // Updated field name
      if (!selectedVenue.acCompleteAmount || Number(selectedVenue.acCompleteAmount) <= 0)
        tempErrors.acCompleteAmount = "Positive number" // Updated field name
    } else if (selectedVenue.acType === "Non-AC") {
      if (!selectedVenue.nonAcAdvanceAmount || Number(selectedVenue.nonAcAdvanceAmount) <= 0)
        tempErrors.nonAcAdvanceAmount = "Positive number" // Updated field name
      if (!selectedVenue.nonAcCompleteAmount || Number(selectedVenue.nonAcCompleteAmount) <= 0)
        tempErrors.nonAcCompleteAmount = "Positive number" // Updated field name
    } else if (selectedVenue.acType === "Both") {
      if (!selectedVenue.acAdvanceAmount || Number(selectedVenue.acAdvanceAmount) <= 0)
        tempErrors.acAdvanceAmount = "Positive number" // Updated field name
      if (!selectedVenue.acCompleteAmount || Number(selectedVenue.acCompleteAmount) <= 0)
        tempErrors.acCompleteAmount = "Positive number" // Updated field name
      if (!selectedVenue.nonAcAdvanceAmount || Number(selectedVenue.nonAcAdvanceAmount) <= 0)
        tempErrors.nonAcAdvanceAmount = "Positive number" // Updated field name
      if (!selectedVenue.nonAcCompleteAmount || Number(selectedVenue.nonAcCompleteAmount) <= 0)
        tempErrors.nonAcCompleteAmount = "Positive number" // Updated field name
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleAddVenue = async (): Promise<void> => {
    if (!validateAdd()) return
    try {
      const formData = new FormData()
      Object.entries(newVenue).forEach(([key, value]) => {
        if (["tariff"].includes(key)) {
          formData.append(key, JSON.stringify(value))
        } else if (["locations", "amenities", "timeSlots", "events"].includes(key)) {
          formData.append(key, JSON.stringify(value))
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })
      formData.append("audiUserId", currentUser.id)
      selectedImages.forEach((file) => formData.append("images", file))

      const response = await addVenueAPI(formData)
      if (response) {
        toast.success("Venue added!")
        resetAddModal()
        fetchVenues()
      }
    } catch (error) {
      toast.error("Failed to add venue.")
    }
  }

  const handleUpdateVenue = async (): Promise<void> => {
    if (!selectedVenue || !validateEdit()) return
    try {
      const formData = new FormData()
      Object.entries(selectedVenue).forEach(([key, value]) => {
        if (["tariff"].includes(key)) {
          formData.append(key, JSON.stringify(value))
        } else if (["locations", "amenities", "timeSlots", "events"].includes(key)) {
          formData.append(key, JSON.stringify(value))
        } else if (key !== "_id" && value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })
      formData.append("audiUserId", currentUser.id)
      editImages.forEach((file) => formData.append("images", file))
      selectedVenue.images.forEach((img, i) => formData.append(`existingImages[${i}]`, img))

      const response = await updateVenues(formData, selectedVenue._id)
      if (response.data.success) {
        toast.success("Venue updated!")
        // resetEditModal() // This function doesn't exist, it should be setIsEditModalOpen(false) and setSelectedVenue(null)
        setIsEditModalOpen(false)
        setSelectedVenue(null)
        setEditImages([])
        setErrors({})
        fetchVenues()
      }
    } catch (error) {
      toast.error("Failed to update venue.")
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    isNewVenue = false,
  ): void => {
    const { name, value } = e.target
    const updateState = (prev: any): any => {
      if (name.includes("tariff.")) {
        const [, field] = name.split(".")
        return { ...prev, tariff: { ...prev.tariff, [field]: value } }
      }
      return {
        ...prev,
        [name]: ["seatingCapacity", "diningCapacity", "parkingSlots", "changingRooms", "guestRooms"].includes(name)
          ? Number(value)
          : value,
      }
    }
    if (isNewVenue) setNewVenue(updateState)
    else if (selectedVenue) setSelectedVenue(updateState(selectedVenue))
  }

  const handleAmenityToggle = (amenity: string, isNew = true): void => {
    const toggle = (arr: string[]) => (arr.includes(amenity) ? arr.filter((a) => a !== amenity) : [...arr, amenity])
    if (isNew) setNewVenue((prev) => ({ ...prev, amenities: toggle(prev.amenities || []) }))
    else if (selectedVenue) setSelectedVenue((prev) => (prev ? { ...prev, amenities: toggle(prev.amenities) } : null))
  }

  const handleEventToggle = (event: string, isNew = true): void => {
    const toggle = (arr: string[]) => (arr.includes(event) ? arr.filter((e) => e !== event) : [...arr, event])
    if (isNew) setNewVenue((prev) => ({ ...prev, events: toggle(prev.events || []) }))
    else if (selectedVenue) setSelectedVenue((prev) => (prev ? { ...prev, events: toggle(prev.events) } : null))
  }

  const handleTimeSlotToggle = (slot: TimeSlot, isNew = true): void => {
    const toggle = (arr: TimeSlot[]) =>
      arr.some((s) => s.id === slot.id) ? arr.filter((s) => s.id !== slot.id) : [...arr, slot]
    if (isNew) setNewVenue((prev) => ({ ...prev, timeSlots: toggle(prev.timeSlots || []) }))
    else if (selectedVenue) setSelectedVenue((prev) => (prev ? { ...prev, timeSlots: toggle(prev.timeSlots) } : null))
  }

  const addCustomTimeSlot = (isNew = true): void => {
    const slot = isNew ? customTimeSlot : customTimeSlotEdit

    if (!slot.label || !slot.startTime || !slot.endTime) return

    const generatedId = `custom-${slot.label.toLowerCase().trim().replace(/\s+/g, "-")}-${Date.now()}`

    const newSlot: TimeSlot = {
      id: generatedId,
      label: slot.label,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }

    if (isNew) {
      setNewVenue((prev) => ({
        ...prev,
        timeSlots: [...(prev.timeSlots || []), newSlot],
      }))
      setCustomTimeSlot({ label: "", startTime: "", endTime: "" })
    } else if (selectedVenue) {
      setSelectedVenue((prev) => (prev ? { ...prev, timeSlots: [...(prev.timeSlots || []), newSlot] } : null))
      setCustomTimeSlotEdit({ label: "", startTime: "", endTime: "" })
    }
  }

  const removeCustomTimeSlot = (id: string, isNew = true): void => {
    if (isNew) setNewVenue((prev) => ({ ...prev, timeSlots: prev.timeSlots?.filter((s) => s.id !== id) || [] }))
    else if (selectedVenue)
      setSelectedVenue((prev) =>
        prev ? { ...prev, timeSlots: prev.timeSlots?.filter((s) => s.id !== id) || [] } : null,
      )
  }

  const removeImage = (index: number, isNew = true): void => {
    if (isNew) setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    else setEditImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number): void => {
    if (selectedVenue) {
      setSelectedVenue({ ...selectedVenue, images: selectedVenue.images.filter((_, i) => i !== index) })
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

  const filteredVenues = venues.filter(
    (venue) =>
      (venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (venueTypeFilter === "all" || venue.acType === venueTypeFilter),
  )

  const handleOpenAddModal = () => {
    setAcTypeSelection("")
    setNewVenue((prev) => ({ ...prev, acType: "AC" }))
    setIsAddModalOpen(true)
  }

  // REMOVED handleAcTypeConfirm function - no longer needed with integrated selection

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex flex-col">
      <style jsx global>{`
        .scrollbar-custom { scrollbar-width: thin; scrollbar-color: #d1d5db #f3f4f6; }
        .scrollbar-custom::-webkit-scrollbar { width: 6px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 3px; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>

      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm mb-4 border border-orange-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-[#78533F]">Auditorium Management</h1>
                <p className="text-gray-600 text-sm lg:text-base">Manage your venues efficiently</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="w-full sm:w-auto px-6 py-3 bg-[#ED695A] text-white rounded-lg flex items-center justify-center hover:bg-[#d55a4b] transition-all shadow-md text-base"
              >
                <Plus size={18} className="mr-2" /> Add New Venue
              </button>
            </div>
          </div>

          {/* Venues List */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100">
            <div className="p-4 lg:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Venues ({filteredVenues.length})</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search venues..."
                      className="w-full pl-10 pr-4 py-2 border border-[#b09d94] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  </div>
                  <select
                    className="border border-[#b09d94] rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#876553] text-sm"
                    value={venueTypeFilter}
                    onChange={(e) => setVenueTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredVenues.length === 0 ? (
                <div className="py-12 text-center">
                  <ImageIcon size={40} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">No venues found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your search</p>
                </div>
              ) : (
                filteredVenues.map((venue) => (
                  <div key={venue._id} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div
                        className="flex items-center cursor-pointer flex-1 min-w-0"
                        onClick={() => toggleVenueExpand(venue._id)}
                      >
                        <div className="mr-3">
                          {expandedVenue === venue._id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                        <div className="flex mr-4">
                          {venue.images.slice(0, 3).map((img, i) => (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white -ml-2 first:ml-0"
                            >
                              <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {venue.images.length > 3 && (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white -ml-2 flex items-center justify-center text-xs">
                              +{venue.images.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-lg truncate">{venue.name}</h3>
                          <div className="flex items-center text-gray-600">
                            <MapPin size={12} className="mr-1" />
                            <span className="text-sm truncate">{venue.address}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${venue.acType === "AC" ? "bg-blue-100 text-blue-800" : venue.acType === "Non-AC" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}`}
                        >
                          {venue.acType}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium flex items-center">
                          <Users size={12} className="mr-1" /> {venue.seatingCapacity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            selectVenue(venue)
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteVenue(venue._id, venue.name)
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    {expandedVenue === venue._id && (
                      <div className="mt-4 ml-8 pl-4 border-l-2 border-orange-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <strong>Contact:</strong>{" "}
                            <span className="text-gray-700">
                              {venue.phone} {venue.altPhone && `| ${venue.altPhone}`}
                            </span>
                          </div>
                          <div>
                            <strong>Email:</strong> <span className="text-gray-700">{venue.email}</span>
                          </div>
                          <div>
                            <strong>Capacity:</strong>{" "}
                            <span className="text-gray-700">
                              Seating {venue.seatingCapacity}, Dining {venue.diningCapacity}
                            </span>
                          </div>
                          <div>
                            <strong>Parking:</strong> <span className="text-gray-700">{venue.parkingSlots}</span>
                          </div>
                          <div>
                            <strong>{locationLabel}:</strong> <span className="text-gray-700">{venue.panchayat}</span>
                          </div>
                          <div>
                            <strong>Amenities:</strong>{" "}
                            <span className="text-gray-700">{venue.amenities.join(", ")}</span>
                          </div>
                          <div>
                            <strong>Events:</strong> <span className="text-gray-700">{venue.events.join(", ")}</span>
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

      {/* ====================== AC TYPE SELECTION MODAL FOR ADD ====================== */}
      {/* REMOVED AC TYPE SELECTION MODALS */}
      {/* AC type selection is now integrated into the form itself */}

      {/* ====================== AC TYPE SELECTION MODAL FOR EDIT ====================== */}
      {/* REMOVED AC TYPE SELECTION MODALS */}

      {/* ====================== ADD MODAL ====================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl lg:text-2xl font-bold">Add New Venue</h2>
              <button onClick={resetAddModal}>
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-custom p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ----- Basic Info ----- */}
                <div>
                  <label className="block font-semibold mb-1">Venue Name *</label>
                  <input
                    name="name"
                    value={newVenue.name || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block font-semibold mb-1">{locationLabel} (Current Location) *</label>
                  <input
                    value={newVenue.panchayat || ""}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Address *</label>
                  <textarea
                    name="address"
                    value={newVenue.address}
                    onChange={(e) => handleInputChange(e, true)}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
                    disabled
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone *</label>
                  <input
                    name="phone"
                    value={newVenue.phone}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Alt Phone</label>
                  <input
                    name="altPhone"
                    value={newVenue.altPhone}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={newVenue.email}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Pincode</label>
                  <input
                    name="pincode"
                    value={newVenue.pincode}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">District</label>
                  <input
                    name="district"
                    value={newVenue.district}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>

                {/* ----- Events ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Events *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto border p-3 rounded-lg bg-gray-50">
                    {availableEvents.map((evt) => (
                      <label key={evt} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newVenue.events?.includes(evt)}
                          onChange={() => handleEventToggle(evt, true)}
                          className="rounded text-orange-500"
                        />
                        <span className="text-sm">{evt}</span>
                      </label>
                    ))}
                  </div>
                  {errors.events && <p className="text-red-500 text-xs mt-1">{errors.events}</p>}
                </div>

                {/* ----- Amenities ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto border p-3 rounded-lg bg-gray-50">
                    {availableAmenities.map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newVenue.amenities?.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity, true)}
                          className="rounded text-orange-500"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ----- Time Slots ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Time Slots</label>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Fixed Slots:</p>
                      <div className="flex flex-wrap gap-2">
                        {fixedTimeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleTimeSlotToggle(slot, true)}
                            className={`px-3 py-1 rounded-lg text-sm border transition ${newVenue.timeSlots?.some((s) => s.id === slot.id) ? "bg-orange-100 border-orange-500" : "border-gray-300 hover:border-gray-400"}`}
                          >
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="border p-3 rounded-lg bg-gray-50">
                      <p className="font-medium mb-2">Custom Slot:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          placeholder="Label"
                          value={customTimeSlot.label}
                          onChange={(e) => setCustomTimeSlot({ ...customTimeSlot, label: e.target.value })}
                          className="px-3 py-1 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <input
                          type="time"
                          value={customTimeSlot.startTime}
                          onChange={(e) => setCustomTimeSlot({ ...customTimeSlot, startTime: e.target.value })}
                          className="px-3 py-1 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <input
                          type="time"
                          value={customTimeSlot.endTime}
                          onChange={(e) => setCustomTimeSlot({ ...customTimeSlot, endTime: e.target.value })}
                          className="px-3 py-1 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <button
                          onClick={() => addCustomTimeSlot(true)}
                          className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                        >
                          Add
                        </button>
                      </div>
                      {newVenue.timeSlots?.filter((s) => s.id.startsWith("custom")).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {newVenue.timeSlots
                            ?.filter((s) => s.id.startsWith("custom"))
                            .map((slot) => (
                              <div
                                key={slot.id}
                                className="flex items-center bg-white border px-3 py-1 rounded text-sm"
                              >
                                <span className="mr-2">
                                  {slot.label}: {slot.startTime}-{slot.endTime}
                                </span>
                                <button
                                  onClick={() => removeCustomTimeSlot(slot.id, true)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ----- Capacity ----- */}
                <div>
                  <label className="block font-semibold mb-1">Seating Capacity *</label>
                  <input
                    name="seatingCapacity"
                    type="number"
                    value={newVenue.seatingCapacity}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  {errors.seatingCapacity && <p className="text-red-500 text-xs mt-1">{errors.seatingCapacity}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Dining Capacity *</label>
                  <input
                    name="diningCapacity"
                    type="number"
                    value={newVenue.diningCapacity}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  {errors.diningCapacity && <p className="text-red-500 text-xs mt-1">{errors.diningCapacity}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Parking Slots</label>
                  <input
                    name="parkingSlots"
                    type="number"
                    value={newVenue.parkingSlots}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Changing Rooms</label>
                  <input
                    name="changingRooms"
                    type="number"
                    value={newVenue.changingRooms}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                {/* ADDED AC Type selection as part of the form */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-3">Select Venue Type *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewVenue({ ...newVenue, acType: "AC" })}
                      className={`p-3 rounded-lg border-2 transition font-medium ${
                        newVenue.acType === "AC"
                          ? "border-blue-500 bg-blue-50 text-blue-800"
                          : "border-gray-300 bg-white text-gray-700 hover:border-blue-300"
                      }`}
                    >
                      AC Venue
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVenue({ ...newVenue, acType: "Non-AC" })}
                      className={`p-3 rounded-lg border-2 transition font-medium ${
                        newVenue.acType === "Non-AC"
                          ? "border-green-500 bg-green-50 text-green-800"
                          : "border-gray-300 bg-white text-gray-700 hover:border-green-300"
                      }`}
                    >
                      Non-AC Venue
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVenue({ ...newVenue, acType: "Both" })}
                      className={`p-3 rounded-lg border-2 transition font-medium ${
                        newVenue.acType === "Both"
                          ? "border-purple-500 bg-purple-50 text-purple-800"
                          : "border-gray-300 bg-white text-gray-700 hover:border-purple-300"
                      }`}
                    >
                      Both AC & Non-AC
                    </button>
                  </div>
                </div>

                {/* Payment Fields Based on AC Type */}
                {newVenue.acType === "AC" && (
                  <>
                    <div>
                      <label className="block font-semibold mb-1">AC Advance Amount *</label>
                      <input
                        name="acAdvanceAmount"
                        type="number"
                        value={newVenue.acAdvanceAmount}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.acAdvanceAmount && <p className="text-red-500 text-xs mt-1">{errors.acAdvanceAmount}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">AC Complete Amount *</label>
                      <input
                        name="acCompleteAmount"
                        type="number"
                        value={newVenue.acCompleteAmount}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.acCompleteAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.acCompleteAmount}</p>
                      )}
                    </div>
                  </>
                )}

                {newVenue.acType === "Non-AC" && (
                  <>
                    <div>
                      <label className="block font-semibold mb-1">Non-AC Advance Amount *</label>
                      <input
                        name="nonAcAdvanceAmount"
                        type="number"
                        value={newVenue.nonAcAdvanceAmount}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.nonAcAdvanceAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.nonAcAdvanceAmount}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Non-AC Complete Amount *</label>
                      <input
                        name="nonAcCompleteAmount"
                        type="number"
                        value={newVenue.nonAcCompleteAmount}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.nonAcCompleteAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.nonAcCompleteAmount}</p>
                      )}
                    </div>
                  </>
                )}

                {newVenue.acType === "Both" && (
                  <>
                    <div>
                      <label className="block font-semibold mb-1">AC Advance Amount *</label>
                      <input
                        name="acAdvanceAmount"
                        type="number"
                        value={newVenue.acAdvanceAmount}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.acAdvanceAmount && <p className="text-red-500 text-xs mt-1">{errors.acAdvanceAmount}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">AC Complete Amount *</label>
                      <input
                        name="acCompleteAmount"
                        type="number"
                        value={newVenue.acCompleteAmount}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.acCompleteAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.acCompleteAmount}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Non-AC Advance Amount *</label>
                      <input
                        name="nonAcAdvanceAmount"
                        type="number"
                        value={newVenue.nonAcAdvanceAmount}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.nonAcAdvanceAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.nonAcAdvanceAmount}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Non-AC Complete Amount *</label>
                      <input
                        name="nonAcCompleteAmount"
                        type="number"
                        value={newVenue.nonAcCompleteAmount}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.nonAcCompleteAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.nonAcCompleteAmount}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-semibold mb-1">Wedding Tariff</label>
                  <input
                    name="tariff.wedding"
                    value={newVenue.tariff?.wedding || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Reception Tariff</label>
                  <input
                    name="tariff.reception"
                    value={newVenue.tariff?.reception || ""}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                {/* ----- Policies ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Food Policy</label>
                  <textarea
                    name="foodPolicy"
                    value={newVenue.foodPolicy}
                    onChange={(e) => handleInputChange(e, true)}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Decor Policy</label>
                  <textarea
                    name="decorPolicy"
                    value={newVenue.decorPolicy}
                    onChange={(e) => handleInputChange(e, true)}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Cancellation Policy</label>
                  <textarea
                    name="cancellationPolicy"
                    value={newVenue.cancellationPolicy}
                    onChange={(e) => handleInputChange(e, true)}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                {/* ----- Terms & Conditions ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Terms & Conditions</label>
                  <textarea
                    name="termsAndConditions"
                    value={newVenue.termsAndConditions}
                    onChange={(e) => handleInputChange(e, true)}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Enter terms..."
                  />
                </div>

                {/* ----- Extra Fields ----- */}
                <div>
                  <label className="block font-semibold mb-1">Stage Size</label>
                  <input
                    name="stageSize"
                    value={newVenue.stageSize}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Guest Rooms</label>
                  <input
                    name="guestRooms"
                    type="number"
                    value={newVenue.guestRooms}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">YouTube Link</label>
                  <input
                    name="youtubeLink"
                    value={newVenue.youtubeLink}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                {/* ----- Images ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-2">Upload Images (min 4) *</label>

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 transition">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <p className="text-sm font-medium">Click to upload images</p>
                      <p className="text-xs mt-1">PNG, JPG, JPEG (Multiple allowed)</p>
                    </div>

                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedImages.map((file, i) => (
                      <div key={i} className="w-20 h-20 border rounded overflow-hidden relative">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(i, true)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                </div>
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
              <button onClick={resetAddModal} className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                Cancel
              </button>
              <button
                onClick={handleAddVenue}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition"
              >
                Add Venue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== EDIT MODAL ====================== */}
      {isEditModalOpen && selectedVenue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl lg:text-2xl font-bold">Edit Venue ({selectedVenue.acType})</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false)
                  setSelectedVenue(null)
                  setEditImages([])
                  setErrors({})
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-custom p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ----- Basic Info ----- */}
                <div>
                  <label className="block font-semibold mb-1">Venue Name *</label>
                  <input
                    name="name"
                    value={selectedVenue.name || ""}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block font-semibold mb-1">{locationLabel} (Current Location) *</label>
                  <input
                    value={selectedVenue.panchayat || ""}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Address *</label>
                  <textarea
                    name="address"
                    value={selectedVenue.address}
                    onChange={(e) => handleInputChange(e, false)}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
                    disabled
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone *</label>
                  <input
                    name="phone"
                    value={selectedVenue.phone}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Alt Phone</label>
                  <input
                    name="altPhone"
                    value={selectedVenue.altPhone}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={selectedVenue.email}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Pincode</label>
                  <input
                    name="pincode"
                    value={selectedVenue.pincode}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">District</label>
                  <input
                    name="district"
                    value={selectedVenue.district}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>

                {/* ----- Events ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Events *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto border p-3 rounded-lg bg-gray-50">
                    {availableEvents.map((evt) => (
                      <label key={evt} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedVenue.events?.includes(evt)}
                          onChange={() => handleEventToggle(evt, false)}
                          className="rounded text-orange-500"
                        />
                        <span className="text-sm">{evt}</span>
                      </label>
                    ))}
                  </div>
                  {errors.events && <p className="text-red-500 text-xs mt-1">{errors.events}</p>}
                </div>

                {/* ----- Amenities ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto border p-3 rounded-lg bg-gray-50">
                    {availableAmenities.map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedVenue.amenities?.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity, false)}
                          className="rounded text-orange-500"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ----- Time Slots ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Time Slots</label>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Fixed Slots:</p>
                      <div className="flex flex-wrap gap-2">
                        {fixedTimeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleTimeSlotToggle(slot, false)}
                            className={`px-3 py-1 rounded-lg text-sm border transition ${selectedVenue.timeSlots?.some((s) => s.id === slot.id) ? "bg-orange-100 border-orange-500" : "border-gray-300 hover:border-gray-400"}`}
                          >
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="border p-3 rounded-lg bg-gray-50">
                      <p className="font-medium mb-2">Custom Slot:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          placeholder="Label"
                          value={customTimeSlotEdit.label}
                          onChange={(e) => setCustomTimeSlotEdit({ ...customTimeSlotEdit, label: e.target.value })}
                          className="px-3 py-1 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <input
                          type="time"
                          value={customTimeSlotEdit.startTime}
                          onChange={(e) => setCustomTimeSlotEdit({ ...customTimeSlotEdit, startTime: e.target.value })}
                          className="px-3 py-1 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <input
                          type="time"
                          value={customTimeSlotEdit.endTime}
                          onChange={(e) => setCustomTimeSlotEdit({ ...customTimeSlotEdit, endTime: e.target.value })}
                          className="px-3 py-1 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <button
                          onClick={() => addCustomTimeSlot(false)}
                          className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                        >
                          Add
                        </button>
                      </div>
                      {selectedVenue.timeSlots?.filter((s) => s.id.startsWith("custom")).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedVenue.timeSlots
                            ?.filter((s) => s.id.startsWith("custom"))
                            .map((slot) => (
                              <div
                                key={slot.id}
                                className="flex items-center bg-white border px-3 py-1 rounded text-sm"
                              >
                                <span className="mr-2">
                                  {slot.label}: {slot.startTime}-{slot.endTime}
                                </span>
                                <button
                                  onClick={() => removeCustomTimeSlot(slot.id, false)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ----- Capacity ----- */}
                <div>
                  <label className="block font-semibold mb-1">Seating Capacity *</label>
                  <input
                    name="seatingCapacity"
                    type="number"
                    value={selectedVenue.seatingCapacity}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  {errors.seatingCapacity && <p className="text-red-500 text-xs mt-1">{errors.seatingCapacity}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Dining Capacity *</label>
                  <input
                    name="diningCapacity"
                    type="number"
                    value={selectedVenue.diningCapacity}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  {errors.diningCapacity && <p className="text-red-500 text-xs mt-1">{errors.diningCapacity}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Parking Slots</label>
                  <input
                    name="parkingSlots"
                    type="number"
                    value={selectedVenue.parkingSlots}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Changing Rooms</label>
                  <input
                    name="changingRooms"
                    type="number"
                    value={selectedVenue.changingRooms}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                {selectedVenue.acType === "AC" && (
                  <>
                    <div>
                      <label className="block font-semibold mb-1">AC Advance Amount *</label>
                      <input
                        name="acAdvanceAmount"
                        type="number"
                        value={selectedVenue.acAdvanceAmount}
                        onChange={(e) => handleInputChange(e, false)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.acAdvanceAmount && <p className="text-red-500 text-xs mt-1">{errors.acAdvanceAmount}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">AC Complete Amount *</label>
                      <input
                        name="acCompleteAmount"
                        type="number"
                        value={selectedVenue.acCompleteAmount}
                        onChange={(e) => handleInputChange(e, false)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.acCompleteAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.acCompleteAmount}</p>
                      )}
                    </div>
                  </>
                )}

                {selectedVenue.acType === "Non-AC" && (
                  <>
                    <div>
                      <label className="block font-semibold mb-1">Non-AC Advance Amount *</label>
                      <input
                        name="nonAcAdvanceAmount"
                        type="number"
                        value={selectedVenue.nonAcAdvanceAmount}
                        onChange={(e) => handleInputChange(e, false)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.nonAcAdvanceAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.nonAcAdvanceAmount}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Non-AC Complete Amount *</label>
                      <input
                        name="nonAcCompleteAmount"
                        type="number"
                        value={selectedVenue.nonAcCompleteAmount}
                        onChange={(e) => handleInputChange(e, false)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.nonAcCompleteAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.nonAcCompleteAmount}</p>
                      )}
                    </div>
                  </>
                )}

                {selectedVenue.acType === "Both" && (
                  <>
                    <div>
                      <label className="block font-semibold mb-1">AC Advance Amount *</label>
                      <input
                        name="acAdvanceAmount"
                        type="number"
                        value={selectedVenue.acAdvanceAmount}
                        onChange={(e) => handleInputChange(e, false)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.acAdvanceAmount && <p className="text-red-500 text-xs mt-1">{errors.acAdvanceAmount}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">AC Complete Amount *</label>
                      <input
                        name="acCompleteAmount"
                        type="number"
                        value={selectedVenue.acCompleteAmount}
                        onChange={(e) => handleInputChange(e, false)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.acCompleteAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.acCompleteAmount}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Non-AC Advance Amount *</label>
                      <input
                        name="nonAcAdvanceAmount"
                        type="number"
                        value={selectedVenue.nonAcAdvanceAmount}
                        onChange={(e) => handleInputChange(e, false)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.nonAcAdvanceAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.nonAcAdvanceAmount}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Non-AC Complete Amount *</label>
                      <input
                        name="nonAcCompleteAmount"
                        type="number"
                        value={selectedVenue.nonAcCompleteAmount}
                        onChange={(e) => handleInputChange(e, false)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      {errors.nonAcCompleteAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.nonAcCompleteAmount}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-semibold mb-1">Wedding Tariff</label>
                  <input
                    name="tariff.wedding"
                    value={selectedVenue.tariff?.wedding || ""}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Reception Tariff</label>
                  <input
                    name="tariff.reception"
                    value={selectedVenue.tariff?.reception || ""}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                {/* ----- Policies ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Food Policy</label>
                  <textarea
                    name="foodPolicy"
                    value={selectedVenue.foodPolicy}
                    onChange={(e) => handleInputChange(e, false)}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Decor Policy</label>
                  <textarea
                    name="decorPolicy"
                    value={selectedVenue.decorPolicy}
                    onChange={(e) => handleInputChange(e, false)}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Cancellation Policy</label>
                  <textarea
                    name="cancellationPolicy"
                    value={selectedVenue.cancellationPolicy}
                    onChange={(e) => handleInputChange(e, false)}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                {/* ----- Terms & Conditions ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Terms & Conditions</label>
                  <textarea
                    name="termsAndConditions"
                    value={selectedVenue.termsAndConditions}
                    onChange={(e) => handleInputChange(e, false)}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Enter terms..."
                  />
                </div>

                {/* ----- Extra Fields ----- */}
                <div>
                  <label className="block font-semibold mb-1">Stage Size</label>
                  <input
                    name="stageSize"
                    value={selectedVenue.stageSize}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Guest Rooms</label>
                  <input
                    name="guestRooms"
                    type="number"
                    value={selectedVenue.guestRooms}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">YouTube Link</label>
                  <input
                    name="youtubeLink"
                    value={selectedVenue.youtubeLink}
                    onChange={(e) => handleInputChange(e, false)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                {/* ----- Current Images ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Current Images</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.images.map((img, i) => (
                      <div key={i} className="w-20 h-20 border rounded overflow-hidden relative">
                        <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeExistingImage(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ----- Add More Images ----- */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Add More Images</label>

                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 transition">
                    <span className="text-sm text-gray-500">Click to choose images</span>

                    <input type="file" multiple accept="image/*" onChange={handleEditImageUpload} className="hidden" />
                  </label>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {editImages.map((file, i) => (
                      <div key={i} className="w-20 h-20 border rounded overflow-hidden relative">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(i, false)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                </div>
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setIsEditModalOpen(false)
                  setSelectedVenue(null)
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateVenue}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition"
              >
                Update Venue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
