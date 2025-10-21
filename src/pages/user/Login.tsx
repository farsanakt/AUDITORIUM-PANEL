import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../../redux/slices/authSlice';
import { userLogin, forgotPassword, verifyOTP, resetPassword, userForgotPassword, verifyUserOtp, userResetPassword } from '../../api/userApi';
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
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>(email);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isResendingOtp, setIsResendingOtp] = useState<boolean>(false);
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);

  // Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
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
    console.log('Navigating to signup');
    navigate('/singup');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      console.log('Sending userLogin with:', { email, password });
      const response = await userLogin(email, password);
      console.log('userLogin response:', response);
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
      console.error('Login error:', error);
      dispatch(loginFailure());
      toast.error(error.response?.data?.response?.message || error.response?.data?.message || 'Login failed');
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
      console.log('Sending forgotPassword with email:', forgotEmail);
      const response = await userForgotPassword(forgotEmail);
      console.log('forgotPassword response:', response);
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
      console.error('Forgot password error:', error);
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
      console.log('Verifying OTP for email:', forgotEmail, 'OTP:', otp);
      const response = await verifyUserOtp(forgotEmail, otp);
      console.log('verifyOTP response:', response);
      const responseData = response.data?.response || response.data || response;

      toast.success("OTP verified");
      setShowOtpModal(false);
      setShowResetModal(true);
      setOtp(""); // Clear OTP after verification
      // if (responseData.success) {
      //   toast.success(responseData.message || 'OTP verified successfully');
      //   setShowOtpModal(false);
      //   setShowResetModal(true);
      //   setOtp('');
      // } else {
      //   toast.error(responseData.message || 'Invalid OTP');
      // }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.response?.message || error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    try {
      console.log('Resending OTP for email:', forgotEmail);
      const response = await userForgotPassword(forgotEmail);
      console.log('Resend OTP response:', response);
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
      console.error('Resend OTP error:', error);
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
      console.log('Resetting password for email:', forgotEmail);
      const response = await userResetPassword(forgotEmail, newPassword);
      console.log('resetPassword response:', response);
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
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.response?.message || error.response?.data?.message || 'Error resetting password');
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <Header />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden my-8 mx-auto">
        <div className="flex flex-col sm:flex-row">
          {/* Left image section */}
          <div className="flex-1 relative bg-white flex flex-col items-center justify-center p-2 sm:p-4">
            <h1 className="text-xl sm:text-2xl font-bold text-center text-[#78533F] mb-2 font-serif">
              Capture Your Moments
            </h1>
            <div className="relative w-full h-56 sm:h-64 flex items-center justify-center overflow-hidden">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute w-full h-full flex items-center justify-center transition-all duration-1000 ease-in-out ${
                    index === currentImageIndex
                      ? 'opacity-100 scale-100 translate-x-0'
                      : 'opacity-0 scale-95 translate-x-full'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-40 h-40 sm:w-56 sm:h-56 object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-600 text-center font-serif">
              Memories that last forever – log in and make new ones.
            </p>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-[#ED695A]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right form section */}
          <div className="flex-1 p-4 sm:p-6 bg-white flex flex-col justify-center">
            <div className="w-full max-w-xs mx-auto space-y-4">
              <div className="text-right">
                <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => navigate('/')} />
              </div>
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-[#78533F] font-serif">Welcome Back</h2>
                <p className="text-sm text-gray-600 mt-1 font-serif">Please login to continue</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex justify-between text-xs text-gray-600 items-center font-serif">
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      className="w-3 h-3 rounded border-[#b09d94]"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-[#ED695A] hover:underline"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#ED695A] text-white py-2 rounded-full font-semibold hover:bg-[#d7584c] transition-all duration-300 font-serif"
                >
                  Sign In
                </button>
              </form>
              <div className="text-center text-xs text-gray-600 font-serif">
                <span>Don't have an account? </span>
                <button className="text-[#ED695A] hover:underline" onClick={handleSignUp}>
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-xs">
            <h2 className="text-base sm:text-lg font-bold text-[#78533F] mb-3 font-serif">Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
            />
            <div className="mt-3 flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-[#78533F] px-4 py-1.5 rounded-full hover:bg-gray-400 font-serif"
                onClick={() => setShowForgotModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#ED695A] text-white px-4 py-1.5 rounded-full hover:bg-[#d85c4e] font-serif flex items-center justify-center"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
                onClick={() => setShowOtpModal(false)}
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
            <div className="mt-2 text-center">
              {timer > 0 ? (
                <p className="text-sm text-gray-600 font-serif">
                  Resend in {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                </p>
              ) : (
                <button
                  className={`text-[#ED695A] hover:underline font-serif ${isResendDisabled || isResendingOtp ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleResendOtp}
                  disabled={isResendDisabled || isResendingOtp}
                >
                  {isResendingOtp ? 'Resending...' : 'Resend OTP'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-xs">
            <h2 className="text-base sm:text-lg font-bold text-[#78533F] mb-3 font-serif">Reset Password</h2>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-[#78533F] px-4 py-1.5 rounded-full hover:bg-gray-400 font-serif"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#ED695A] text-white px-4 py-1.5 rounded-full hover:bg-[#d85c4e] font-serif flex items-center justify-center"
                onClick={handleResetPassword}
                disabled={isResettingPassword}
              >
                {isResettingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginUserPage;