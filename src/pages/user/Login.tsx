import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../../redux/slices/authSlice';
import { userLogin, userForgotPassword, verifyUserOtp, userResetPassword } from '../../api/userApi';
import { toast } from 'react-toastify';
import Header from '../../component/user/Header';
import img from '../../assets/Beach wedding-pana.png';
import img1 from '../../assets/Divorce-pana.png';
import img2 from '../../assets/Honeymoon-pana.png';
import img3 from '../../assets/Wedding-pana.png';

const images: string[] = [img, img1, img2, img3];

const LoginUserPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [email, setEmail] = useState<string>(location.state?.email || '');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  
  // Modal States
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>(email);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  
  // Reset Password States
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);
  
  // Loading & Timer States
  const [timer, setTimer] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isResendingOtp, setIsResendingOtp] = useState<boolean>(false);
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // OTP resend timer
  useEffect(() => {
    let interval: any
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer]);

  const handleSignUp = () => {
    navigate('/singup');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      dispatch(loginStart());
      const response = await userLogin(email, password);
      const responseData = response.data?.response || response.data || response;
      
      if (!responseData.success) {
        dispatch(loginFailure());
        toast.error(responseData.message || 'Login failed');
      } else {
        dispatch(
          loginSuccess({
            user: responseData.user,
            accessToken: responseData.accessToken,
          })
        );
        toast.success(responseData.message || 'Login successful');
        navigate('/');
      }
    } catch (error: any) {
      dispatch(loginFailure());
      toast.error(error.response?.data?.response?.message || error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotEmail(email);
    setShowForgotModal(true);
  };

  const handleSendOtp = async () => {
    if (!forgotEmail) {
      toast.error('Please enter an email address');
      return;
    }
    setIsSendingOtp(true);
    try {
      const response = await userForgotPassword(forgotEmail);
      const responseData = response.data?.response || response.data || response;
      if (responseData.success) {
        toast.success(responseData.message || 'OTP sent to your email');
        setShowForgotModal(false);
        setShowOtpModal(true);
        setTimer(60);
        setIsResendDisabled(true);
      } else {
        toast.error(responseData.message || 'Error sending OTP');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.response?.message || error.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    setIsVerifyingOtp(true);
    try {
      await verifyUserOtp(forgotEmail, otp);
      // Logic assumes success if no error thrown, adapt based on actual API
      toast.success("OTP verified");
      setShowOtpModal(false);
      setShowResetModal(true);
      setOtp(""); 
    } catch (error: any) {
      toast.error(error.response?.data?.response?.message || error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    try {
      const response = await userForgotPassword(forgotEmail);
      const responseData = response.data?.response || response.data || response;
      if (responseData.success) {
        toast.success(responseData.message || 'OTP resent to your email');
        setTimer(60);
        setIsResendDisabled(true);
        setOtp('');
      } else {
        toast.error(responseData.message || 'Error resending OTP');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.response?.message || error.response?.data?.message || 'Error resending OTP');
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    setIsResettingPassword(true);
    try {
      const response = await userResetPassword(forgotEmail, newPassword);
      const responseData = response.data?.response || response.data || response;
      if (responseData.success) {
        toast.success(responseData.message || 'Password reset successfully');
        setShowResetModal(false);
        setNewPassword('');
        setConfirmNewPassword('');
        setForgotEmail('');
        setOtp('');
      } else {
        toast.error(responseData.message || 'Error resetting password');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.response?.message || error.response?.data?.message || 'Error resetting password');
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-fade-in-up">
          
          {/* Left: Image Slider & Branding */}
          <div className="md:w-1/2 relative bg-[#2C1810] flex flex-col items-center justify-center p-8 text-white text-center overflow-hidden">
             
             {/* Background Slider */}
             {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? 'opacity-40' : 'opacity-0'
                  }`}
                  style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810] via-transparent to-[#2C1810]/50" />

              {/* Content */}
              <div className="relative z-10 space-y-6 max-w-sm">
                 <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#e6d0b5] drop-shadow-lg">
                    Welcome Back
                 </h1>
                 <p className="text-gray-300 text-lg font-light leading-relaxed">
                    Sign in to continue planning your perfect celebration with our premium venues.
                 </p>
                 
                 {/* Carousel Indicators */}
                 <div className="flex justify-center gap-2 mt-8">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-[#9c7c5d] w-6' : 'bg-white/30'
                        }`}
                      />
                    ))}
                 </div>
              </div>
          </div>

          {/* Right: Login Form */}
          <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white relative">
             <button 
               onClick={() => navigate('/')} 
               className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
             >
                <X size={24} />
             </button>

             <div className="max-w-md mx-auto w-full space-y-8">
                <div className="text-left">
                   <h2 className="text-3xl font-bold text-[#5B4336] font-serif mb-2">Sign In</h2>
                   <p className="text-gray-500">Please enter your details to access your account.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9c7c5d]/50 focus:border-[#9c7c5d] transition-all"
                      />
                   </div>

                   <div className="space-y-1 relative">
                       <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                       <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9c7c5d]/50 focus:border-[#9c7c5d] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                       </div>
                   </div>

                   <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-[#9c7c5d] focus:ring-[#9c7c5d]"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="text-[#9c7c5d] hover:text-[#8b6b4a] font-semibold hover:underline transition-colors"
                        onClick={handleForgotPassword}
                      >
                        Forgot Password?
                      </button>
                   </div>

                   <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                   </button>
                </form>

                <div className="relative">
                   <div className="absolute inset-0 flex items-center">
                     <span className="w-full border-t border-gray-200" />
                   </div>
                   <div className="relative flex justify-center text-sm">
                     <span className="bg-white px-4 text-gray-500">Or continue with</span>
                   </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-600">
                     Don't have an account?{' '}
                     <button 
                       onClick={handleSignUp} 
                       className="text-[#9c7c5d] font-bold hover:text-[#8b6b4a] hover:underline transition-colors ml-1"
                     >
                        Sign Up
                     </button>
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#5B4336] mb-4 font-serif">Reset Password</h2>
            <p className="text-gray-500 mb-6 text-sm">Enter your email to receive an OTP for password reset.</p>
            
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9c7c5d]"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                  onClick={() => setShowForgotModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#9c7c5d] text-white px-6 py-2.5 rounded-lg hover:bg-[#8b6b4a] font-medium shadow-md transition-all flex items-center"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  Send OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#5B4336] mb-4 font-serif">New Password</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-[#9c7c5d]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-[#9c7c5d]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#9c7c5d] text-white px-6 py-2.5 rounded-lg hover:bg-[#8b6b4a] font-medium shadow-md flex items-center"
                  onClick={handleResetPassword}
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  Save Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginUserPage;