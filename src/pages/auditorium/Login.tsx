"use client"

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import tk from "../../assets/Rectangle 50.png";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../component/user/Header";
import { AuditoriumLogin, forgotPassword, verifyOTP, resetPassword } from "../../api/userApi";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from "../../redux/slices/authSlice";

const LoginPage: React.FC = () => {
  const location = useLocation();
  const [loginMode, setLoginMode] = useState<"owner" | "staff">("owner"); // New: tab state
  const [email, setEmail] = useState(location.state?.email || "");
  const [staffId, setStaffId] = useState(""); // New: for staff login
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState(email);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    let interval: any;
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    // Validation for staff
    if (loginMode === "staff" && !staffId.trim()) {
      toast.error("Staff ID is required");
      setIsLoggingIn(false);
      return;
    }

    try {
      dispatch(loginStart());

      
      const response = await AuditoriumLogin(
        email,
        password,
        loginMode,
        loginMode === "staff" ? staffId : undefined
      );

      if (response.data.success === false) {
        dispatch(loginFailure());
        toast.error(response.data.message);
      } else {
        dispatch(loginSuccess({
          user: response.data.user,
          accessToken: response.data.accessToken,
        }));
        toast.success(response.data.message);
        navigate('/auditorium/dashboard');
      }
    } catch (error: any) {
      dispatch(loginFailure());
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotEmail(email);
    setShowForgotModal(true);
  };

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    try {
      await forgotPassword(forgotEmail);
      toast.success("OTP sent to your email");
      setShowForgotModal(false);
      setShowOtpModal(true);
      setTimer(60);
      setIsResendDisabled(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    try {
      await verifyOTP(forgotEmail, otp);
      toast.success("OTP verified");
      setShowOtpModal(false);
      setShowResetModal(true);
      setOtp("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    try {
      await forgotPassword(forgotEmail);
      toast.success("OTP resent");
      setTimer(60);
      setIsResendDisabled(true);
      setOtp("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error resending OTP");
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsResettingPassword(true);
    try {
      await resetPassword(newPassword, forgotEmail);
      toast.success("Password reset successful");
      setShowResetModal(false);
      setNewPassword("");
      setConfirmNewPassword("");
      setForgotEmail("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSignup = () => {
    navigate("/auditorium/signup");
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center justify-center px-4 py-6 box-border">
      <Header />
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto box-border my-8 mx-auto">
        {/* Left Section - Image */}
        <div className="md:w-1/2 hidden md:block relative h-64 md:h-auto">
          <div className="relative w-full h-full">
            <img
              src={tk}
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
                    <span className="text-[#ED695A] text-xl font-bold font-serif">TK</span>
                  </div>
                  <h2 className="text-[#78533F] text-lg md:text-2xl font-bold mb-1 font-serif">Welcome to Auditorium</h2>
                  <div className="w-16 h-1 bg-[#ED695A] mx-auto mb-1"></div>
                </div>
                <p className="text-[#78533F] text-xs md:text-sm text-center px-2 font-serif">
                  Manage your auditorium bookings seamlessly with our intuitive platform.
                </p>
                <div className="p-2 rounded-xl backdrop-blur-sm">
                  <p className="text-[#ED695A] font-bold text-sm md:text-base mb-2 text-center font-serif">Why Choose Us?</p>
                  <ul className="text-white text-xs md:text-sm space-y-2 font-serif">
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Intuitive and user-friendly interface</li>
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Streamlined booking management</li>
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Secure and reliable platform</li>
                    <li className="flex items-center"><span className="mr-2 text-[#ED695A]">✔</span> Dedicated support for auditorium owners</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="md:w-1/2 p-4 sm:p-6 flex justify-center items-center">
          <div className="w-full max-w-xs">
            <div className="text-center mb-4">
              <h2 className="text-lg md:text-2xl font-bold text-[#78533F] font-serif">
                {loginMode === "owner" ? "Auditorium Owner Login" : "Staff Login"}
              </h2>
              <p className="text-gray-600 text-sm mt-1 font-serif">Sign in to your account</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center space-x-3 mb-5">
              <button
                type="button"
                onClick={() => setLoginMode("owner")}
                className={`px-5 py-2 rounded-full font-serif text-sm transition-all duration-300 ${
                  loginMode === "owner"
                    ? "bg-[#ED695A] text-white shadow-md"
                    : "bg-gray-200 text-[#78533F] hover:bg-gray-300"
                }`}
                disabled={isLoggingIn}
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("staff")}
                className={`px-5 py-2 rounded-full font-serif text-sm transition-all duration-300 ${
                  loginMode === "staff"
                    ? "bg-[#ED695A] text-white shadow-md"
                    : "bg-gray-200 text-[#78533F] hover:bg-gray-300"
                }`}
                disabled={isLoggingIn}
              >
                Staff
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Staff ID Field - Only for Staff */}
              {loginMode === "staff" && (
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      placeholder="Enter your Staff ID"
                      required
                      className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <User size={16} className="text-[#b09d94]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A] transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#b09d94]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
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
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600 font-serif">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#ED695A] border-[#b09d94] rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[#ED695A] hover:text-[#78533F] hover:underline font-serif"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ED695A] text-white font-semibold py-2 rounded-full shadow-md hover:bg-[#d85c4e] transition-all duration-300 font-serif flex items-center justify-center"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="text-center mt-3">
                <span className="text-sm text-gray-600 font-serif">Don't have an account?</span>
                <button
                  type="button"
                  onClick={handleSignup}
                  className="text-sm text-[#ED695A] ml-1 hover:text-[#78533F] hover:underline font-semibold font-serif"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* === All Modals Remain Unchanged === */}
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
              className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
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
              className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
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
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
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
                  type={showConfirmNewPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#ED695A]"
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

export default LoginPage;