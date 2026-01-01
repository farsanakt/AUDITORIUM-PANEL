"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import tk from "../../assets/Rectangle 50.png"
import { useNavigate } from "react-router-dom"
import Header from "../../component/user/Header"
import {  singUpRequest, verifyOTP, getItems } from "../../api/userApi"
import { toast } from 'react-toastify'

const AuditoriumRegistrationPage: React.FC = () => {
  const navigate = useNavigate()
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState("")
  const [showEventsDropdown, setShowEventsDropdown] = useState(false)
  const [showLocationsDropdown, setShowLocationsDropdown] = useState(false)
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false)
  const [showAdminTypeDropdown, setShowAdminTypeDropdown] = useState(false)
  const [showPanchayatDropdown, setShowPanchayatDropdown] = useState(false)
  const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false)
  const [showCorporationDropdown, setShowCorporationDropdown] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  const [formData, setFormData] = useState({
    auditoriumName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    events: [] as string[],
    locations: [] as string[],
    address: "",
    district: "",
    adminType: "",
    panchayat: "",
    municipality: "",
    corporation: ""
  })

  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [districts, setDistricts] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [filteredLocations, setFilteredLocations] = useState<string[]>([])

  const fallbackPlacesByDistrict: Record<string, string[]> = {
    "Alappuzha": ["Ambalappuzha", "Chengannur", "Cherthala", "Karukachal", "Kayamkulam", "Mavelikkara"],
    "Ernakulam": ["Aluva", "Kothamangalam", "Kochi", "Kunnathunad", "Muvattupuzha", "Paravur"],
    "Idukki": ["Devikulam", "Idukki", "Peermade", "Thodupuzha", "Udumbanchola"],
    "Kannur": ["Irikkur", "Kannur", "Koothuparamba", "Payyannur", "Taliparamba", "Thalassery"],
    "Kasaragod": ["Kasaragod", "Hosdurg", "Manjeshwaram", "Vellarikundu"],
    "Kollam": ["Karunagappally", "Kollam", "Kottarakkara", "Kunnathur", "Pathanapuram"],
    "Kottayam": ["Changanassery", "Kanjirappally", "Kottayam", "Meenachil", "Vaikom"],
    "Kozhikode": ["Kozhikode", "Kunnamangalam", "Thamarassery", "Vadakara"],
    "Malappuram": ["Kondotty", "Nilambur", "Perinthalmanna", "Ponnani", "Tirur", "Tirurangadi"],
    "Palakkad": ["Chittur", "Mannarkkad", "Ottappalam", "Palakkad", "Shoranur"],
    "Pathanamthitta": ["Adoor", "Kozhencherry", "Mallappally", "Ranni"],
    "Thiruvananthapuram": ["Chirayinkeezhu", "Nedumangad", "Neyyattinkara", "Thiruvananthapuram", "Varkala"],
    "Thrissur": ["Chavakkad", "Kodungallur", "Mukundapuram", "Talappilly", "Thrissur"],
    "Wayanad": ["Mananthavady", "Sulthanbathery", "Vythiri"]
  }

  const adminTypeOptions = [
    { value: "Panchayat", label: "Panchayat" },
    { value: "Municipality", label: "Municipality" },
    { value: "Corporation", label: "Corporation" }
  ]

  const adminData: { [key: string]: { [key: string]: { value: string; label: string }[] } } = {
    "Thiruvananthapuram": {
      Panchayat: [
        { value: "Anjuthengu", label: "Anjuthengu" },
        { value: "Aryanad", label: "Aryanad" },
      ],
      Municipality: [
        { value: "Neyyattinkara", label: "Neyyattinkara" },
        { value: "Nedumangad", label: "Nedumangad" },
      ],
      Corporation: [
        { value: "Thiruvananthapuram Corporation", label: "Thiruvananthapuram Corporation" }
      ]
    },
    "Kollam": {
      Panchayat: [
        { value: "Adichanalloor", label: "Adichanalloor" },
        { value: "Alappad", label: "Alappad" },
      ],
      Municipality: [
        { value: "Paravur", label: "Paravur" },
        { value: "Punalur", label: "Punalur" },
      ],
      Corporation: [
        { value: "Kollam Corporation", label: "Kollam Corporation" }
      ]
    },
    "Pathanamthitta": {
      Panchayat: [
        { value: "Adoor", label: "Adoor" },
        { value: "Aranmula", label: "Aranmula" },
      ],
      Municipality: [
        { value: "Thiruvalla", label: "Thiruvalla" },
        { value: "Pathanamthitta", label: "Pathanamthitta" },
      ],
      Corporation: []
    },
    "Alappuzha": {
      Panchayat: [
        { value: "Arookutty", label: "Arookutty" },
        { value: "Ala", label: "Ala" },
      ],
      Municipality: [
        { value: "Chengannur", label: "Chengannur" },
        { value: "Kayamkulam", label: "Kayamkulam" },
      ],
      Corporation: [
        { value: "Alappuzha Corporation", label: "Alappuzha Corporation" }
      ]
    },
    "Kottayam": {
      Panchayat: [
        { value: "Akalakunnam", label: "Akalakunnam" },
        { value: "Ayarkunnam", label: "Ayarkunnam" },
      ],
      Municipality: [
        { value: "Kottayam", label: "Kottayam" },
        { value: "Changanassery", label: "Changanassery" },
      ],
      Corporation: []
    },
    "Idukki": {
      Panchayat: [
        { value: "Adimaly", label: "Adimaly" },
        { value: "Alakode", label: "Alakode" },
      ],
      Municipality: [
        { value: "Thodupuzha", label: "Thodupuzha" },
      ],
      Corporation: []
    },
    "Ernakulam": {
      Panchayat: [
        { value: "Aikaranad", label: "Aikaranad" },
        { value: "Alangad", label: "Alangad" },
      ],
      Municipality: [
        { value: "Aluva", label: "Aluva" },
        { value: "Kothamangalam", label: "Kothamangalam" },
      ],
      Corporation: [
        { value: "Kochi Corporation", label: "Kochi Corporation" }
      ]
    },
    "Thrissur": {
      Panchayat: [
        { value: "Adat", label: "Adat" },
        { value: "Alagappanagar", label: "Alagappanagar" },
      ],
      Municipality: [
        { value: "Guruvayur", label: "Guruvayur" },
        { value: "Chavakkad", label: "Chavakkad" },
      ],
      Corporation: [
        { value: "Thrissur Corporation", label: "Thrissur Corporation" }
      ]
    },
    "Palakkad": {
      Panchayat: [
        { value: "Agali", label: "Agali" },
        { value: "Akathethara", label: "Akathethara" },
      ],
      Municipality: [
        { value: "Palakkad", label: "Palakkad" },
        { value: "Ottapalam", label: "Ottapalam" },
      ],
      Corporation: []
    },
    "Malappuram": {
      Panchayat: [
        { value: "Alamkode", label: "Alamkode" },
        { value: "Alanallur", label: "Alanallur" },
      ],
      Municipality: [
        { value: "Manjeri", label: "Manjeri" },
        { value: "Perinthalmanna", label: "Perinthalmanna" },
      ],
      Corporation: []
    },
    "Kozhikode": {
      Panchayat: [
        { value: "Arikkulam", label: "Arikkulam" },
        { value: "Azhiyur", label: "Azhiyur" },
      ],
      Municipality: [
        { value: "Koyilandy", label: "Koyilandy" },
        { value: "Vatakara", label: "Vatakara" },
      ],
      Corporation: [
        { value: "Kozhikode Corporation", label: "Kozhikode Corporation" }
      ]
    },
    "Wayanad": {
      Panchayat: [
        { value: "Ambalavayal", label: "Ambalavayal" },
        { value: "Edavaka", label: "Edavaka" },
      ],
      Municipality: [
        { value: "Kalpetta", label: "Kalpetta" },
      ],
      Corporation: []
    },
    "Kannur": {
      Panchayat: [
        { value: "Alakode", label: "Alakode" },
        { value: "Anjarakandy", label: "Anjarakandy" },
      ],
      Municipality: [
        { value: "Thalassery", label: "Thalassery" },
        { value: "Mattannur", label: "Mattannur" },
      ],
      Corporation: [
        { value: "Kannur Corporation", label: "Kannur Corporation" }
      ]
    },
    "Kasaragod": {
      Panchayat: [
        { value: "Ajanur", label: "Ajanur" },
        { value: "Badiadka", label: "Badiadka" },
      ],
      Municipality: [
        { value: "Kanhangad", label: "Kanhangad" },
        { value: "Kasaragod", label: "Kasaragod" },
      ],
      Corporation: []
    }
  }

  const eventOptions = eventTypes.map((event) => ({ value: event, label: event }))

  const locationOptions = filteredLocations.map((loc) => ({ value: loc, label: loc }))

  const districtOptions = districts.map((dist) => ({ value: dist, label: dist }))

  const fetchDropdownData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/shauryashahi/Indian-State-City-db-json/master/db.json')
      if (!response.ok) throw new Error('Failed to fetch API data')
      const data = await response.json()

      const keralaDistricts = data.districts.filter((d: any) => d.state_id === 16)
      const districtNames = keralaDistricts.map((d: any) => d.name).sort()
      setDistricts(districtNames)

      const keralaDistrictIds = keralaDistricts.map((d: any) => d.id)
      const keralaSubs = data.subdistricts.filter((sd: any) => keralaDistrictIds.includes(sd.district_id))
      const uniqueSubs = [...new Set(keralaSubs.map((sd: any) => sd.name))].sort()
      setLocations(uniqueSubs)
    } catch (error) {
      console.error("Error fetching districts and locations:", error)
      const fallbackDistricts = [
        "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam",
        "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram",
        "Thrissur", "Wayanad"
      ].sort()
      setDistricts(fallbackDistricts)

      const uniquePlaces = [...new Set(Object.values(fallbackPlacesByDistrict).flat())].sort()
      setLocations(uniquePlaces)
    }

    try {
      const response = await getItems('hi')
      console.log("Admin items response:", response.data)

      if (response.data?.success && response.data?.items?.events) {
        const events = response.data.items.events.filter((e: string) => e && e.trim()).sort()
        setEventTypes(events)
      }
    } catch (error) {
      console.error("Error fetching admin items:", error)
      setEventTypes(["Reception", "Engagement", "Anniversary", "wedding", "other"])
    }
  }

  useEffect(() => {
    fetchDropdownData()
  }, [])

  useEffect(() => {
    if (formData.district && fallbackPlacesByDistrict[formData.district]) {
      // Use fallback mapping to filter locations by district
      const districtLocations = fallbackPlacesByDistrict[formData.district].sort()
      setFilteredLocations(districtLocations)
    } else if (formData.district) {
      // If district is selected but not in fallback, try to filter from all locations
      const districtLocations = locations.filter(loc => {
        // Filter locations that match the selected district context
        return fallbackPlacesByDistrict[formData.district]?.includes(loc)
      })
      setFilteredLocations(districtLocations.length > 0 ? districtLocations : [])
    } else {
      // No district selected, show all locations
      setFilteredLocations([])
    }
  }, [formData.district, locations])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name as keyof typeof prev] as string[], value]
          : (prev[name as keyof typeof prev] as string[]).filter(item => item !== value)
      }))
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleDistrictSelect = (value: string) => {
    setFormData(prev => ({ ...prev, district: value, locations: [], adminType: "", panchayat: "", municipality: "", corporation: "" }))
    setShowDistrictDropdown(false)
  }

  const handleAdminTypeSelect = (value: string) => {
    setFormData(prev => ({ ...prev, adminType: value, panchayat: "", municipality: "", corporation: "" }))
    setShowAdminTypeDropdown(false)
    setShowPanchayatDropdown(false)
    setShowMunicipalityDropdown(false)
    setShowCorporationDropdown(false)
  }

  const handlePanchayatSelect = (value: string) => {
    setFormData(prev => ({ ...prev, panchayat: value }))
    setShowPanchayatDropdown(false)
  }

  const handleMunicipalitySelect = (value: string) => {
    setFormData(prev => ({ ...prev, municipality: value }))
    setShowMunicipalityDropdown(false)
  }

  const handleCorporationSelect = (value: string) => {
    setFormData(prev => ({ ...prev, corporation: value }))
    setShowCorporationDropdown(false)
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }
    setIsVerifyingOtp(true)
    try {
      console.log("Verifying OTP for email:", formData.email, "OTP:", otp)
      await verifyOTP(formData.email, otp)
      toast.success("OTP verified successfully")
      setShowOtpModal(false)
      setOtp("")
      navigate('/auditorium/login', { state: { email: formData.email } })
    } catch (error: any) {
      console.error("OTP verification error:", error)
      toast.error(error.response?.data?.message || "Invalid OTP")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const isStep1Valid = () => {
    return formData.auditoriumName && formData.ownerName && formData.email && formData.phone
  }

  const isStep2Valid = () => {
    if (!formData.district || !formData.adminType || formData.locations.length === 0) return false
    if (formData.adminType === "Panchayat" && !formData.panchayat) return false
    if (formData.adminType === "Municipality" && !formData.municipality) return false
    if (formData.adminType === "Corporation" && !formData.corporation) return false
    return true
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!isStep1Valid()) {
        toast.error('Please fill all required fields in Step 1.')
        return
      }
    } else if (currentStep === 2) {
      if (!isStep2Valid()) {
        toast.error('Please fill all required fields in Step 2.')
        return
      }
    }
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

const handleSignup = async () => {
  console.log("handleSignup called with formData:", formData);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    toast.error("Please enter a valid email address.");
    return;
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(formData.phone)) {
    toast.error("Please enter a valid 10-digit Indian mobile number starting with 6-9.");
    return;
  }

  if (formData.events.length === 0 || formData.locations.length === 0) {
    toast.error('Select at least one event and location.');
    return;
  }

  if (!formData.district || !formData.adminType) {
    toast.error('Select district and administrative type.');
    return;
  }

  if (
    (formData.adminType === "Panchayat" && !formData.panchayat) ||
    (formData.adminType === "Municipality" && !formData.municipality) ||
    (formData.adminType === "Corporation" && !formData.corporation)
  ) {
    toast.error('Select a valid administrative area.');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    toast.error('Passwords do not match.');
    return;
  }

  if (!formData.address.trim()) {
    toast.error('Please enter address.');
    return;
  }

  setIsSigningUp(true);

  try {
    console.log("Sending signUpRequest with formData:", formData);
    const response = await singUpRequest(formData);
    console.log("signUpRequest response:", response);

    const { data } = response;


    if (data?.success === true) {
      toast.success(data.message || "OTP sent to your email");
      setShowOtpModal(true);
    }
    else if (data?.success === false) {

      toast.info(data.message || "Signup status update");


      if (
        data.message?.includes("OTP") ||
        data.message?.toLowerCase().includes("verify")
      ) {
        setShowOtpModal(true);
      }
    }
    else if (data?.message) {

      toast.success(data.message);
      setShowOtpModal(true);
    }
    else {
      toast.error("Unexpected response from server.");
    }

  } catch (error: any) {
    console.error("Signup error:", error);
    toast.error(error.response?.data?.message || "Error during signup");
  } finally {
    setIsSigningUp(false);
  }
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted")
    handleSignup()
  }

  const handleLogin = () => {
    console.log("Navigating to login with email:", formData.email)
    navigate('/auditorium/login', { state: { email: formData.email } })
  }

  const selectedPanchayatOptions = formData.district ? adminData[formData.district]?.Panchayat || [] : []
  const selectedMunicipalityOptions = formData.district ? adminData[formData.district]?.Municipality || [] : []
  const selectedCorporationOptions = formData.district ? adminData[formData.district]?.Corporation || [] : []

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center space-x-2 mb-6">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? (currentStep === 1 ? 'bg-[#ED695A] text-white' : 'bg-[#78533F] text-white') : 'bg-gray-200 text-gray-600'}`}>
        1
      </div>
      <div className={`h-1 w-10 ${currentStep > 1 ? 'bg-[#78533F]' : 'bg-gray-200'}`}></div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? (currentStep === 2 ? 'bg-[#ED695A] text-white' : 'bg-[#78533F] text-white') : 'bg-gray-200 text-gray-600'}`}>
        2
      </div>
      <div className={`h-1 w-10 ${currentStep > 2 ? 'bg-[#78533F]' : 'bg-gray-200'}`}></div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 3 ? (currentStep === 3 ? 'bg-[#ED695A] text-white' : 'bg-[#78533F] text-white') : 'bg-gray-200 text-gray-600'}`}>
        3
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="auditoriumName" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Auditorium Name</label>
              <input
                type="text"
                id="auditoriumName"
                name="auditoriumName"
                className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-xs sm:text-sm"
                value={formData.auditoriumName}
                onChange={handleChange}
                placeholder="Enter auditorium name"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="ownerName" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Owner Name</label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-xs sm:text-sm"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Enter owner name"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-xs sm:text-sm"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-xs sm:text-sm"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">District</label>
              <div className="relative">
                <div
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full bg-white text-xs sm:text-sm cursor-pointer flex items-center justify-between"
                  onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
                >
                  <span className={formData.district ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                    {formData.district || "Select district"}
                  </span>
                  <span className="text-[#78533F]">&#9662;</span>
                </div>
                {showDistrictDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#b09d94] rounded-md shadow-lg max-h-28 overflow-y-auto">
                    {districtOptions.map(option => (
                      <div
                        key={option.value}
                        className="p-1.5 hover:bg-[#FDF8F1] cursor-pointer text-[#3C3A39] text-xs sm:text-sm font-serif"
                        onClick={() => handleDistrictSelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Administrative Type</label>
              <div className="relative">
                <div
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full bg-white text-xs sm:text-sm cursor-pointer flex items-center justify-between"
                  onClick={() => formData.district && setShowAdminTypeDropdown(!showAdminTypeDropdown)}
                >
                  <span className={formData.adminType ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                    {formData.adminType || (formData.district ? "Select administrative type" : "Select district first")}
                  </span>
                  <span className="text-[#78533F]">&#9662;</span>
                </div>
                {showAdminTypeDropdown && formData.district && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#b09d94] rounded-md shadow-lg max-h-28 overflow-y-auto">
                    {adminTypeOptions.map(option => (
                      <div
                        key={option.value}
                        className="p-1.5 hover:bg-[#FDF8F1] cursor-pointer text-[#3C3A39] text-xs sm:text-sm font-serif"
                        onClick={() => handleAdminTypeSelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {formData.adminType === "Panchayat" && (
              <div className="space-y-1">
                <label className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Panchayat</label>
                <div className="relative">
                  <div
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full bg-white text-xs sm:text-sm cursor-pointer flex items-center justify-between"
                    onClick={() => formData.district && setShowPanchayatDropdown(!showPanchayatDropdown)}
                  >
                    <span className={formData.panchayat ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                      {formData.panchayat || "Select panchayat"}
                    </span>
                    <span className="text-[#78533F]">&#9662;</span>
                  </div>
                  {showPanchayatDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#b09d94] rounded-md shadow-lg max-h-28 overflow-y-auto">
                      {selectedPanchayatOptions.map(option => (
                        <div
                          key={option.value}
                          className="p-1.5 hover:bg-[#FDF8F1] cursor-pointer text-[#3C3A39] text-xs sm:text-sm font-serif"
                          onClick={() => handlePanchayatSelect(option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {formData.adminType === "Municipality" && (
              <div className="space-y-1">
                <label className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Municipality</label>
                <div className="relative">
                  <div
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full bg-white text-xs sm:text-sm cursor-pointer flex items-center justify-between"
                    onClick={() => formData.district && setShowMunicipalityDropdown(!showMunicipalityDropdown)}
                  >
                    <span className={formData.municipality ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                      {formData.municipality || "Select municipality"}
                    </span>
                    <span className="text-[#78533F]">&#9662;</span>
                  </div>
                  {showMunicipalityDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#b09d94] rounded-md shadow-lg max-h-28 overflow-y-auto">
                      {selectedMunicipalityOptions.map(option => (
                        <div
                          key={option.value}
                          className="p-1.5 hover:bg-[#FDF8F1] cursor-pointer text-[#3C3A39] text-xs sm:text-sm font-serif"
                          onClick={() => handleMunicipalitySelect(option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {formData.adminType === "Corporation" && (
              <div className="space-y-1">
                <label className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Corporation</label>
                <div className="relative">
                  <div
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full bg-white text-xs sm:text-sm cursor-pointer flex items-center justify-between"
                    onClick={() => formData.district && setShowCorporationDropdown(!showCorporationDropdown)}
                  >
                    <span className={formData.corporation ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                      {formData.corporation || "Select corporation"}
                    </span>
                    <span className="text-[#78533F]">&#9662;</span>
                  </div>
                  {showCorporationDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#b09d94] rounded-md shadow-lg max-h-28 overflow-y-auto">
                      {selectedCorporationOptions.map(option => (
                        <div
                          key={option.value}
                          className="p-1.5 hover:bg-[#FDF8F1] cursor-pointer text-[#3C3A39] text-xs sm:text-sm font-serif"
                          onClick={() => handleCorporationSelect(option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="space-y-1">
              <label className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Locations</label>
              <div className="relative">
                <div
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full bg-white text-xs sm:text-sm cursor-pointer flex items-center justify-between"
                  onClick={() => setShowLocationsDropdown(!showLocationsDropdown)}
                >
                  <span className={formData.locations.length > 0 ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                    {formData.locations.length > 0 ? formData.locations.join(", ") : "Select locations"}
                  </span>
                  <span className="text-[#78533F]">&#9662;</span>
                </div>
                {showLocationsDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#b09d94] rounded-md shadow-lg max-h-28 overflow-y-auto">
                    {locationOptions.map(option => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 p-1.5 hover:bg-[#FDF8F1] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="locations"
                          value={option.value}
                          checked={formData.locations.includes(option.value)}
                          onChange={handleChange}
                          className="h-3.5 w-3.5 text-[#ED695A] border-[#b09d94] rounded focus:ring-2 focus:ring-[#ED695A]"
                        />
                        <span className="text-[#3C3A39] text-xs sm:text-sm font-serif">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Events</label>
                <div className="relative">
                  <div
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full bg-white text-xs sm:text-sm cursor-pointer flex items-center justify-between"
                    onClick={() => setShowEventsDropdown(!showEventsDropdown)}
                  >
                    <span className={formData.events.length > 0 ? "text-[#3C3A39]" : "text-[#b09d94]"}>
                      {formData.events.length > 0 ? formData.events.join(", ") : "Select events"}
                    </span>
                    <span className="text-[#78533F]">&#9662;</span>
                  </div>
                  {showEventsDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#b09d94] rounded-md shadow-lg max-h-28 overflow-y-auto">
                      {eventOptions.map(option => (
                        <label
                          key={option.value}
                          className="flex items-center space-x-2 p-1.5 hover:bg-[#FDF8F1] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            name="events"
                            value={option.value}
                            checked={formData.events.includes(option.value)}
                            onChange={handleChange}
                            className="h-3.5 w-3.5 text-[#ED695A] border-[#b09d94] rounded focus:ring-2 focus:ring-[#ED695A]"
                          />
                          <span className="text-[#3C3A39] text-xs sm:text-sm font-serif">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="address" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200 text-xs sm:text-sm"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-[#78533F] font-medium text-xs sm:text-sm font-serif">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-3.5 w-3.5 text-[#ED695A] border-[#b09d94] rounded focus:ring-2 focus:ring-[#ED695A]"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-xs sm:text-sm text-gray-600 font-serif">
                I agree to the <span className="text-[#ED695A] hover:underline cursor-pointer">Terms of Service</span>{" "}
                and <span className="text-[#ED695A] hover:underline cursor-pointer">Privacy Policy</span>
              </label>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center px-4 py-6 box-border">
      <Header />
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto box-border my-8 mx-auto">
        {/* Left Section */}
        <div className="md:w-1/2 hidden md:block relative h-64 md:h-auto">
          <div className="relative w-full h-full">
            <img
              src={tk || "/placeholder.svg"}
              alt="Auditorium Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1519167758481-83f550bb2953";
              }}
            />
            <div className="absolute inset-0 bg-opacity-40">
              <div className="p-4 sm:p-6 h-full flex flex-col justify-between">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                    {/* <span className="text-[#ED695A] text-xl font-bold font-serif">TK</span> */}
                  </div>
                  <h2 className="text-[#78533F] text-lg md:text-2xl font-bold mb-1 font-serif">Join as an Auditorium Owner</h2>
                  <div className="w-16 h-1 bg-[#ED695A] mx-auto mb-1"></div>
                </div>
                <p className="text-white text-xs md:text-sm text-center px-2 font-serif">
                  Showcase your venue to clients with our intuitive platform.
                </p>
                <div className="p-2 rounded-xl backdrop-blur-sm">
                  <p className="text-[#ED695A] font-bold text-sm md:text-base mb-2 text-center font-serif">Why Register?</p>
                  <ul className="text-white text-xs md:text-sm space-y-2 font-serif">
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Reach many customers</li>
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Manage bookings easily</li>
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Get featured</li>
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Boost visibility</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="md:w-1/2 p-4 sm:p-6 flex justify-center items-start">
          <div className="w-full max-w-md">
            <div className="text-center mb-4">
              <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif">Auditorium Registration</h2>
              <p className="text-gray-600 text-sm mt-1 font-serif">Sign up to manage your auditorium</p>
            </div>
            {renderStepIndicator()}
            <form onSubmit={handleSubmit} className="space-y-3">
              {renderStepContent()}
              <div className="flex justify-between mt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-300 text-[#78533F] font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-400 transition-all duration-300 font-serif"
                  >
                    Back
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#ED695A] text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif ml-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-[#ED695A] text-white font-semibold py-2 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif flex items-center justify-center"
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                )}
              </div>
            </form>
            <div className="text-center mt-3">
              <p className="text-gray-600 text-xs sm:text-sm font-serif">
                Already have an account?{" "}
                <button onClick={handleLogin} className="text-[#ED695A] font-medium hover:underline hover:text-[#d85c4e] font-serif">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
            <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#78533F] mb-3 font-serif">Verify OTP</h2>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
              />
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  className="bg-gray-300 text-[#78533F] px-4 py-1.5 rounded-full hover:bg-gray-400 font-serif"
                  onClick={() => {
                    setShowOtpModal(false)
                    setOtp("")
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#ED695A] text-white px-4 py-1.5 rounded-full hover:bg-[#d85c4e] font-serif flex items-center justify-center"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp}
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditoriumRegistrationPage
