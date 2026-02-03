import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Loader2, X } from "lucide-react"
import img from '../../assets/Beach wedding-pana.png';
import img1 from '../../assets/Divorce-pana.png';
import img2 from '../../assets/Honeymoon-pana.png';
import img3 from '../../assets/Wedding-pana.png';
import { useNavigate } from "react-router-dom"
import Header from "../../component/user/Header"
import { userSingUpRequest, verifyUserOtp } from "../../api/userApi"
import { toast } from 'react-toastify'

const images: string[] = [img, img1, img2, img3];

const UserRegistrationPage: React.FC = () => {
  const navigate = useNavigate()
  
  // Modal States
  const [showOtpModal, setShowOtpModal] = useState(false)
  
  // Form States
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  // OTP & Timer States
  const [otp, setOtp] = useState("")
  const [timer, setTimer] = useState(60)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  
  // Loading States
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isResendingOtp, setIsResendingOtp] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  // Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Timer for resend OTP
  useEffect(() => {
    let interval: any
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      setIsResendDisabled(false)
    }
    return () => clearInterval(interval)
  }, [showOtpModal, timer])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }
    setIsVerifyingOtp(true)
    try {
      await verifyUserOtp(formData.email, otp)
      toast.success("OTP verified successfully")
      setShowOtpModal(false)
      setOtp("")
      navigate('/login', { state: { email: formData.email } })
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResendingOtp(true)
    try {
      // await resendOTP(formData.email)
      toast.success("OTP resent to your email")
      setTimer(60)
      setIsResendDisabled(true)
      setOtp("")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error resending OTP")
    } finally {
      setIsResendingOtp(false)
    }
  }

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill all required fields")
      return
    }
    setIsSigningUp(true)
    try {
      const response = await userSingUpRequest(formData)
      if (response.data.success === false) {
          toast.error(response.data.message || 'Signup failed!')
      } else {
          // toast.success("OTP sent to your email")
          // setShowOtpModal(true)
          // setTimer(60)
          navigate('/login')
          setIsResendDisabled(true)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error during signup")
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSignup()
  }

  const handleLogin = () => {
    navigate('/login', { state: { email: formData.email } })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[550px] animate-fade-in-up">
          
           {/* Left: Branding & Info */}
           <div className="md:w-2/5 relative bg-[#2C1810] flex flex-col items-center justify-center p-8 text-white text-center overflow-hidden">
              
              {/* Background Slider */}
             {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? 'opacity-30' : 'opacity-0'
                  }`}
                  style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810] via-transparent to-[#2C1810]/50" />

              <div className="relative z-10 space-y-8">
                 <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-white/20">
                    <span className="text-[#ED695A] text-2xl font-bold font-serif">TK</span>
                 </div>
                 
                 <div className="space-y-4">
                    <h2 className="text-3xl font-serif font-bold text-[#e6d0b5]">Join Our Community</h2>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                      Create an account to manage your bookings, discover exclusive venues, and make your events unforgettable.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 gap-4 text-left max-w-xs mx-auto text-sm text-gray-300">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                       <span className="w-8 h-8 rounded-full bg-[#ED695A]/20 flex items-center justify-center text-[#ED695A]">✦</span>
                       <span>Exclusive venue offers</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                       <span className="w-8 h-8 rounded-full bg-[#ED695A]/20 flex items-center justify-center text-[#ED695A]">✦</span>
                       <span>Seamless booking</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                       <span className="w-8 h-8 rounded-full bg-[#ED695A]/20 flex items-center justify-center text-[#ED695A]">✦</span>
                       <span>24/7 Support access</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Registration Form */}
           <div className="md:w-3/5 p-8 sm:p-12 flex flex-col justify-center bg-white relative">
              <button 
                onClick={() => navigate('/')} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                 <X size={24} />
              </button>

              <div className="max-w-xl mx-auto w-full space-y-6">
                 <div>
                    <h2 className="text-3xl font-bold text-[#5B4336] font-serif mb-2">Create Account</h2>
                    <p className="text-gray-500">Fill in your details to get started.</p>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9c7c5d] transition-all"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9c7c5d] transition-all"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9c7c5d] transition-all"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="9876543210"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9c7c5d] transition-all"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="space-y-1 relative">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Create password"
                              required
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9c7c5d] transition-all pr-10"
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
                       
                       <div className="space-y-1 relative">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Confirm</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="Confirm password"
                              required
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9c7c5d] transition-all pr-10"
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

                    <div className="py-2">
                       <label className="flex items-start space-x-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            required
                            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#9c7c5d] focus:ring-[#9c7c5d]"
                          />
                          <span className="text-sm text-gray-600 leading-snug">
                            I agree to the <span className="text-[#9c7c5d] font-semibold hover:underline">Terms of Service</span> and <span className="text-[#9c7c5d] font-semibold hover:underline">Privacy Policy</span>.
                          </span>
                       </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSigningUp}
                      className="w-full bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSigningUp ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                    </button>
                 </form>

                 <div className="text-center pt-2">
                    <p className="text-gray-600 text-sm">
                       Already have an account?{' '}
                       <button 
                         onClick={handleLogin} 
                         className="text-[#9c7c5d] font-bold hover:text-[#8b6b4a] hover:underline transition-colors"
                       >
                          Sign In
                       </button>
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#5B4336] mb-2 font-serif">Verify Email</h2>
            <p className="text-gray-500 mb-6 text-sm">Enter the 6-digit code sent to your email.</p>
            
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-[#9c7c5d]"
            />
            
            <div className="mt-6 flex flex-col gap-3">
              <button
                className="w-full bg-[#9c7c5d] text-white py-3 rounded-lg hover:bg-[#8b6b4a] font-bold shadow-md transition-all flex justify-center items-center"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Verify Code'}
              </button>
              
              <button
                className="w-full text-gray-500 hover:text-gray-800 py-2 text-sm font-medium transition-colors"
                onClick={() => setShowOtpModal(false)}
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-center text-sm">
              {timer > 0 ? (
                <p className="text-gray-400">Resend code in <span className="text-[#9c7c5d] font-medium">{Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</span></p>
              ) : (
                <button
                  className="text-[#9c7c5d] font-bold hover:underline disabled:opacity-50"
                  onClick={handleResendOtp}
                  disabled={isResendDisabled || isResendingOtp}
                >
                  {isResendingOtp ? 'Sending...' : 'Resend Code'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserRegistrationPage