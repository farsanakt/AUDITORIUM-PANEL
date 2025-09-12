"use client"

import { useEffect, useState, Component, ReactNode, useCallback, useRef } from "react"
import { Calendar } from "lucide-react"
import { cn } from "../../component/lib/utils"
import Lines from '../../assets/vector.png'
import Header from "../../component/user/Header"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { submitBrideGroomDetails } from "../../api/userApi"

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: string | null }> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <h2>Something went wrong.</h2>
          <p>{this.state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

type PersonType = "bride" | "groom"

interface FormData {
  fullName: string
  dateOfBirth: string
  fathersName: string
  mothersName: string
  gender: string
  idProof: File | null
  address: string
  pincode: string
  phoneNumber: string
  panchayath: string
  photo: File | null
}

export default function DetailsForm() {
  const [personType, setPersonType] = useState<PersonType>("bride")
  const [brideData, setBrideData] = useState<FormData>({
    fullName: "",
    dateOfBirth: "",
    fathersName: "",
    mothersName: "",
    gender: "",
    idProof: null,
    address: "",
    pincode: "",
    phoneNumber: "",
    panchayath: "",
    photo: null,
  })
  const [groomData, setGroomData] = useState<FormData>({
    fullName: "",
    dateOfBirth: "",
    fathersName: "",
    mothersName: "",
    gender: "",
    idProof: null,
    address: "",
    pincode: "",
    phoneNumber: "",
    panchayath: "",
    photo: null,
  })
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const navigate = useNavigate()
  const { email } = useParams<{ email?: string }>()
  const bridePhotoInputRef = useRef<HTMLInputElement>(null)
  const brideIdProofInputRef = useRef<HTMLInputElement>(null)
  const groomPhotoInputRef = useRef<HTMLInputElement>(null)
  const groomIdProofInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.log("Email from params:", email || "No email provided")
    // Reset file inputs and state when switching personType
    if (personType === "bride") {
      if (groomPhotoInputRef.current) {
        groomPhotoInputRef.current.value = ""
        setGroomData((prev) => ({ ...prev, photo: null }))
      }
      if (groomIdProofInputRef.current) {
        groomIdProofInputRef.current.value = ""
        setGroomData((prev) => ({ ...prev, idProof: null }))
      }
    } else {
      if (bridePhotoInputRef.current) {
        bridePhotoInputRef.current.value = ""
        setBrideData((prev) => ({ ...prev, photo: null }))
      }
      if (brideIdProofInputRef.current) {
        brideIdProofInputRef.current.value = ""
        setBrideData((prev) => ({ ...prev, idProof: null }))
      }
    }
  }, [personType, email])

  const validateForm = useCallback((data: FormData) => {
    const errors: string[] = []
    if (!data.fullName.trim()) errors.push("Full Name is required")
    if (!data.dateOfBirth) errors.push("Date of Birth is required")
    if (!data.fathersName.trim()) errors.push("Father's Name is required")
    if (!data.mothersName.trim()) errors.push("Mother's Name is required")
    if (!data.gender) errors.push("Gender is required")
    if (!data.idProof) errors.push("ID Proof is required")
    if (!data.address.trim()) errors.push("Address is required")
    if (!data.pincode.trim()) errors.push("Pincode is required")
    if (!data.phoneNumber.trim()) errors.push("Phone Number is required")
    if (!data.panchayath.trim()) errors.push("Panchayath is required")
    if (!data.photo) errors.push("Photo is required")
    return errors
  }, [])

  const isFormComplete = useCallback(
    (data: FormData) => {
      const errors = validateForm(data)
      return errors.length === 0
    },
    [validateForm]
  )

  const handleInputChange = (
    field: keyof FormData,
    value: string | File | null,
    isBride: boolean = personType === "bride"
  ) => {
    try {
      const updateData = isBride ? setBrideData : setGroomData
      updateData((prev) => {
        const newData = { ...prev, [field]: value }
        console.log(`Updated ${isBride ? "bride" : "groom"} ${field}:`, value)
        console.log(`New ${isBride ? "brideData" : "groomData"} state:`, newData)
        return newData
      })
      const currentData = isBride ? { ...brideData, [field]: value } : { ...groomData, [field]: value }
      setValidationErrors(validateForm(currentData))
    } catch (err) {
      console.error("Error in handleInputChange:", err)
      setError("Failed to update form data")
    }
  }

  const handleSave = async () => {
    try {
      console.log("Starting handleSave")
      console.log("Bride data:", brideData)
      console.log("Groom data:", groomData)

      const currentData = personType === "bride" ? brideData : groomData
      const otherData = personType === "bride" ? groomData : brideData
      const otherType = personType === "bride" ? "groom" : "bride"

      const currentErrors = validateForm(currentData)
      console.log(`Validation errors for ${personType}:`, currentErrors)
      setValidationErrors(currentErrors)
      if (currentErrors.length > 0) {
        setError(`Please fill in all required fields for ${personType}`)
        return
      }

      setError(null)

      const otherErrors = validateForm(otherData)
      console.log(`Validation errors for ${otherType}:`, otherErrors)
      if (otherErrors.length > 0) {
        setPersonType(otherType)
        setValidationErrors(otherErrors)
        return
      }

      const formData = new FormData()
      formData.append("email", email || "unknown")
      console.log("Appending email:", email || "unknown")

      // Append bride data
      Object.entries(brideData).forEach(([key, value]) => {
        if (key === "photo" && value instanceof File) {
          formData.append("bridePhoto", value)
          console.log("Appending bridePhoto:", value.name)
        } else if (key === "idProof" && value instanceof File) {
          formData.append("brideIdProof", value)
          console.log("Appending brideIdProof:", value.name)
        } else if (value && value !== "") {
          formData.append(`bride[${key}]`, String(value))
          console.log(`Appending bride[${key}]:`, value)
        }
      })

      // Append groom data
      Object.entries(groomData).forEach(([key, value]) => {
        if (key === "photo" && value instanceof File) {
          formData.append("groomPhoto", value)
          console.log("Appending groomPhoto:", value.name)
        } else if (key === "idProof" && value instanceof File) {
          formData.append("groomIdProof", value)
          console.log("Appending groomIdProof:", value.name)
        } else if (value && value !== "") {
          formData.append(`groom[${key}]`, String(value))
          console.log(`Appending groom[${key}]:`, value)
        }
      })

      // Log FormData entries for debugging
      console.log("FormData entries:")
      for (const [key, value] of formData.entries()) {
        console.log(`FormData: ${key} =`, value instanceof File ? value.name : value)
      }

      const response = await submitBrideGroomDetails(formData)
      console.log("API response:", response.data)
      if (response.data.success) {
        toast.success("Bride and groom details submitted successfully!")
        navigate('/')
      } else {
        toast.error(response.data.message || "Failed to submit details")
        setError(response.data.message || "Failed to submit details")
      }
    } catch (err) {
      console.error("Submission error:", err)
      setError("Failed to submit details. Please try again.")
      toast.error("Something went wrong while submitting details")
    }
  }

  const handleBack = () => {
    try {
      navigate(-1)
    } catch (err) {
      console.error("Navigation error:", err)
      setError("Failed to navigate back")
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isBride: boolean) => {
    try {
      const file = e.target.files?.[0]
      if (file) {
        console.log(`${isBride ? "Bride" : "Groom"} photo uploaded:`, file.name)
        handleInputChange("photo", file, isBride)
      } else {
        console.warn(`${isBride ? "Bride" : "Groom"}: No photo file selected`)
        handleInputChange("photo", null, isBride)
      }
    } catch (err) {
      console.error(`Error in handlePhotoUpload (${isBride ? "bride" : "groom"}):`, err)
      setError("Failed to upload photo")
    }
  }

  const handleIdProofUpload = (e: React.ChangeEvent<HTMLInputElement>, isBride: boolean) => {
    try {
      const file = e.target.files?.[0]
      if (file) {
        console.log(`${isBride ? "Bride" : "Groom"} ID proof uploaded:`, file.name)
        handleInputChange("idProof", file, isBride)
      } else {
        console.warn(`${isBride ? "Bride" : "Groom"}: No ID proof file selected`)
        handleInputChange("idProof", null, isBride)
      }
    } catch (err) {
      console.error(`Error in handleIdProofUpload (${isBride ? "bride" : "groom"}):`, err)
      setError("Failed to upload ID proof")
    }
  }

  return (
    <ErrorBoundary>
      <div className="w-full max-w-3xl px-8 py-6 relative bg-[#FDF8F1] mx-auto">
        <img
          src={Lines}
          alt="Lines"
          className="fixed top-0 right-0 h-full object-cover z-0 scale-140"
          style={{ maxWidth: 'none' }}
          onError={() => console.error("Failed to load Lines image")}
        />
        
        <Header />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-serif text-[#9c7c5d]">
              {personType === "bride" ? "Bride Details" : "Groom Details"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="bg-[#9c7c5d] rounded-full p-1 flex w-36">
                <button
                  className={cn(
                    "py-1 px-3 rounded-full text-sm font-medium transition-colors w-1/2 text-center",
                    personType === "bride" ? "bg-white text-[#9c7c5d]" : "bg-transparent text-white"
                  )}
                  onClick={() => setPersonType("bride")}
                >
                  Bride
                </button>
                <button
                  className={cn(
                    "py-1 px-3 rounded-full text-sm font-medium transition-colors w-1/2 text-center",
                    personType === "groom" ? "bg-white text-[#9c7c5d]" : "bg-transparent text-white"
                  )}
                  onClick={() => setPersonType("groom")}
                >
                  Groom
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white relative">
                {(personType === "bride" && brideData.photo) || (personType === "groom" && groomData.photo) ? (
                  <img
                    src={
                      personType === "bride" && brideData.photo instanceof File
                        ? URL.createObjectURL(brideData.photo)
                        : personType === "groom" && groomData.photo instanceof File
                        ? URL.createObjectURL(groomData.photo)
                        : "/placeholder.svg"
                    }
                    alt={personType === "bride" ? "Bride" : "Groom"}
                    className="w-full h-full rounded-full object-cover"
                    onError={() => console.error(`Failed to load ${personType} photo preview`)}
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
                {personType === "bride" ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, true)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    id="bride-photo-upload"
                    ref={bridePhotoInputRef}
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, false)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    id="groom-photo-upload"
                    ref={groomPhotoInputRef}
                  />
                )}
              </div>
              <label
                htmlFor={personType === "bride" ? "bride-photo-upload" : "groom-photo-upload"}
                className="text-sm text-gray-600 mt-2 cursor-pointer"
              >
                Upload photo
              </label>
              {(personType === "bride" && brideData.photo) || (personType === "groom" && groomData.photo) ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-green-600">
                    Selected: {(personType === "bride" ? brideData.photo : groomData.photo)?.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (personType === "bride") {
                        setBrideData((prev) => ({ ...prev, photo: null }))
                        if (bridePhotoInputRef.current) bridePhotoInputRef.current.value = ""
                      } else {
                        setGroomData((prev) => ({ ...prev, photo: null }))
                        if (groomPhotoInputRef.current) groomPhotoInputRef.current.value = ""
                      }
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center">
              <label className="block text-sm font-semibold text-gray-700 mb-2">ID Proof *</label>
              {personType === "bride" ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleIdProofUpload(e, true)}
                  className="w-full px-4 py-2 rounded-md border border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d] bg-white"
                  id="bride-idproof-upload"
                  ref={brideIdProofInputRef}
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleIdProofUpload(e, false)}
                  className="w-full px-4 py-2 rounded-md border border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d] bg-white"
                  id="groom-idproof-upload"
                  ref={groomIdProofInputRef}
                />
              )}
              <span className="text-sm text-gray-600 mt-1 block">Upload ID Proof (PNG, JPG)</span>
              {(personType === "bride" && brideData.idProof) || (personType === "groom" && groomData.idProof) ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-green-600">
                    Selected: {(personType === "bride" ? brideData.idProof : groomData.idProof)?.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (personType === "bride") {
                        setBrideData((prev) => ({ ...prev, idProof: null }))
                        if (brideIdProofInputRef.current) brideIdProofInputRef.current.value = ""
                      } else {
                        setGroomData((prev) => ({ ...prev, idProof: null }))
                        if (groomIdProofInputRef.current) groomIdProofInputRef.current.value = ""
                      }
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <form className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {validationErrors.length > 0 && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                <p>Please fix the following errors:</p>
                <ul className="list-disc ml-5">
                  {validationErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={personType === "bride" ? brideData.fullName : groomData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full px-4 py-2 rounded-md border bg-white border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={personType === "bride" ? brideData.dateOfBirth : groomData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="w-full px-4 py-2 rounded-md border bg-white border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
                  required
                />
                <Calendar className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Father's Name *</label>
                <input
                  type="text"
                  placeholder="Father's name"
                  value={personType === "bride" ? brideData.fathersName : groomData.fathersName}
                  onChange={(e) => handleInputChange("fathersName", e.target.value)}
                  className="w-full px-4 py-2 rounded-md border bg-white border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mother's Name *</label>
                <input
                  type="text"
                  placeholder="Mother's name"
                  value={personType === "bride" ? brideData.mothersName : groomData.mothersName}
                  onChange={(e) => handleInputChange("mothersName", e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-[#b09d94] bg-white focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                <select
                  value={personType === "bride" ? brideData.gender : groomData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d] appearance-none bg-white"
                  required
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Panchayath *</label>
                <input
                  type="text"
                  placeholder="Panchayath"
                  value={personType === "bride" ? brideData.panchayath : groomData.panchayath}
                  onChange={(e) => handleInputChange("panchayath", e.target.value)}
                  className="w-full px-4 py-2 rounded-md border bg-white border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Address *</label>
              <textarea
                placeholder="Full Address"
                rows={4}
                value={personType === "bride" ? brideData.address : groomData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-4 py-2 rounded-md border bg-white border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={personType === "bride" ? brideData.pincode : groomData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className="w-full px-4 py-2 rounded-md border bg-white border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={personType === "bride" ? brideData.phoneNumber : groomData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-white border border-[#b09d94] focus:outline-none focus:ring-1 focus:ring-[#9c7c5d]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-8 py-2 bg-[#e6ddd3] text-[#9c7c5d] rounded-md font-medium"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-8 py-2 bg-[#9c7c5d] text-white rounded-md font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!isFormComplete(personType === "bride" ? brideData : groomData)}
              >
                Save & Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  )
}