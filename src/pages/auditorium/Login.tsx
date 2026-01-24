"use client"

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, User, ShieldCheck } from "lucide-react";
import tk from "../../assets/Rectangle 50.png";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../component/user/Header";
import { AuditoriumLogin, forgotPassword, verifyOTP, resetPassword } from "../../api/userApi";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from "../../redux/slices/authSlice";

const LoginPage: React.FC = () => {
  const location = useLocation();
  const [loginMode, setLoginMode] = useState<"owner" | "staff">("owner");
  const [email, setEmail] = useState(location.state?.email || "");
  const [staffId, setStaffId] = useState("");
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
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px] border border-gray-100">
          
          {/* Left Section - Image */}
          <div className="hidden md:block w-5/12 relative">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${tk})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
              <h1 className="text-2xl font-bold font-serif mb-2 leading-tight">Manage Your Venue</h1>
              <p className="text-white/90 text-lg font-light max-w-md">Access your dashboard, track bookings, and manage your auditorium seamlessly.</p>
              <div className="flex gap-3 mt-8">
                 <div className="px-4 py-2 bg-white/10 backdrop-blur rounded-lg border border-white/20 text-sm">
                    Verified Security
                 </div>
                 <div className="px-4 py-2 bg-white/10 backdrop-blur rounded-lg border border-white/20 text-sm">
                    Real-time Updates
                 </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                 <div className="w-12 h-12 bg-[#ED695A]/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#ED695A]">
                    <ShieldCheck size={28} />
                 </div>
                 <h2 className="text-3xl font-bold text-[#78533F] font-serif mb-2">Welcome Back</h2>
                 <p className="text-gray-500">Please sign in to continue to your dashboard</p>
              </div>

              {/* Login Mode Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl mb-8 border border-gray-100">
                <button
                  onClick={() => setLoginMode("owner")}
                  className={`py-2.5 text-sm font-medium rounded-lg transition-all ${
                    loginMode === "owner" 
                    ? "bg-white text-[#ED695A] shadow-sm border border-gray-100" 
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Auditorium Owner
                </button>
                <button
                  onClick={() => setLoginMode("staff")}
                  className={`py-2.5 text-sm font-medium rounded-lg transition-all ${
                    loginMode === "staff" 
                    ? "bg-white text-[#ED695A] shadow-sm border border-gray-100" 
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Staff Member
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {loginMode === "staff" && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 ml-1">Staff ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        placeholder="Enter your Staff ID"
                        className="w-full px-5 py-3.5 bg-gray-50 border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#ED695A]/20 focus:border-[#ED695A] transition-all outline-none"
                      />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-5 py-3.5 bg-gray-50 border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#ED695A]/20 focus:border-[#ED695A] transition-all outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-[#ED695A] hover:text-[#78533F] font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 py-3.5 bg-gray-50 border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#ED695A]/20 focus:border-[#ED695A] transition-all outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center ml-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-[#ED695A] border-gray-300 rounded focus:ring-[#ED695A]"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me for 30 days</label>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 px-6 bg-[#ED695A] hover:bg-[#d85849] text-white font-bold rounded-xl shadow-lg shadow-[#ED695A]/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : "Sign In to Dashboard"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Don't have an account? 
                  <button onClick={handleSignup} className="text-[#ED695A] font-bold ml-1 hover:underline">
                    Register Now
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modals remain functionally same but styled */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-bold text-[#78533F] mb-4">Reset Password</h3>
            <p className="text-gray-500 text-sm mb-4">Enter your email to receive an OTP.</p>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 mb-4 focus:border-[#ED695A] outline-none transition"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendOtp}
                disabled={isSendingOtp}
                className="flex-1 py-2.5 bg-[#ED695A] text-white font-bold rounded-lg hover:bg-[#d85849] transition disabled:opacity-50"
              >
                {isSendingOtp ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-bold text-[#78533F] mb-4">Verify OTP</h3>
            <div className="text-center mb-6">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                className="w-full text-center text-2xl font-bold tracking-[0.5em] py-3 border-b-2 border-gray-200 focus:border-[#ED695A] outline-none bg-transparent"
                placeholder="000000"
              />
            </div>
            
            <button 
               onClick={handleVerifyOtp}
               disabled={isVerifyingOtp}
               className="w-full py-3 bg-[#ED695A] text-white font-bold rounded-xl hover:bg-[#d85849] transition disabled:opacity-50 mb-4"
            >
               {isVerifyingOtp ? "Verifying..." : "Verify Code"}
            </button>
            <div className="text-center text-sm">
               {timer > 0 ? (
                 <span className="text-gray-400">Resend in {timer}s</span>
               ) : (
                 <button onClick={handleResendOtp} disabled={isResendDisabled} className="text-[#ED695A] font-medium hover:underline">
                    Resend Code
                 </button>
               )}
            </div>
             <button onClick={() => setShowOtpModal(false)} className="w-full mt-4 text-gray-400 text-sm hover:text-gray-600">Back</button>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-bold text-[#78533F] mb-4">Set New Password</h3>
            <div className="space-y-4 mb-6">
               <input
                 type={showNewPassword ? "text" : "password"}
                 value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)}
                 placeholder="New Password"
                 className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-[#ED695A]"
               />
               <input
                 type={showConfirmNewPassword ? "text" : "password"}
                 value={confirmNewPassword}
                 onChange={(e) => setConfirmNewPassword(e.target.value)}
                 placeholder="Confirm Password"
                 className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-[#ED695A]"
               />
            </div>
            <button 
               onClick={handleResetPassword}
               disabled={isResettingPassword}
               className="w-full py-3 bg-[#ED695A] text-white font-bold rounded-xl hover:bg-[#d85849] transition disabled:opacity-50"
            >
               {isResettingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;