import React, { useState } from "react";
import tk from "../../assets/Rectangle 50.png";
import { useNavigate } from "react-router-dom";
import Header from "../../component/user/Header";
import { userLogin } from "../../api/userApi";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from "../../redux/slices/authSlice";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const response = await userLogin(email, password);
      if (response.data.success === false) {
        dispatch(loginFailure());
        toast.error(response.data.message);
      } else {
        dispatch(loginSuccess({
          user: response.data.user,
          accessToken: response.data.accessToken,
        }));
        toast.success(response.data.message);
        navigate('/dashboard');
      }
    } catch (error: any) {
      dispatch(loginFailure());
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="fixed inset-0 bg-[#FDF8F1] flex items-center justify-center min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl mx-auto my-4">
        {/* Left Section */}
        <div className="md:w-1/2 relative h-72 md:h-auto">
          <div className="relative w-full h-full">
            <img
              src={tk}
              alt="Platform Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-opacity-40">
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="text-center mb-2">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-[#ED695A] text-xl font-bold">TK</span>
                  </div>
                  <h2 className="text-[#78533F] text-xl md:text-2xl font-bold mb-1">Welcome Back</h2>
                  <div className="w-16 h-1 bg-[#ED695A] mx-auto mb-1"></div>
                </div>
                <p className="text-[#3C3A39] text-sm mb-2 text-center px-2">
                  Experience a seamless and intuitive interface designed to enhance your productivity and creativity.
                </p>
                <div className="p-2 rounded-lg backdrop-blur-sm mb-2">
                  <p className="text-[rgb(237,105,90)] font-bold text-base mb-2 text-center">Why choose us?</p>
                  <ul className="text-[#3C3A39] space-y-1">
                    <li className="flex items-center"><span className="mr-1">✦</span> Intuitive and user-friendly interface</li>
                    <li className="flex items-center"><span className="mr-1">✦</span> Powerful features for enhanced productivity</li>
                    <li className="flex items-center"><span className="mr-1">✦</span> Secure and reliable platform</li>
                    <li className="flex items-center"><span className="mr-1">✦</span> Dedicated support team</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="md:w-1/2 p-4 md:p-6 flex justify-center items-center">
          <div className="w-full max-w-sm">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-[#78533F]">WELCOME BACK!</h2>
              <p className="text-gray-600 mt-1">Please login to your account</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm text-[#78533F] font-medium">Email</label>
                <div className="relative">
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-3 pr-8 py-1.5 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#876553]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#b09d94]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm text-[#78533F] font-medium">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-3 pr-8 py-1.5 border border-[#b09d94] rounded-md focus:outline-none focus:ring-2 focus:ring-[#876553]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#b09d94]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-700">
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
                  className="text-sm font-medium text-[#ED695A] hover:text-[#78533F]"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-[#ED695A] text-white font-semibold py-2 rounded-md shadow hover:bg-[#d85c4e] transition"
              >
                Sign In
              </button>
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#b09d94]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-[#b09d94]">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" className="flex justify-center items-center py-1 px-2 border border-[#b09d94] rounded-md bg-white hover:bg-gray-50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 11.7v2.6h5.4c-.2 1.3-.8 2.4-1.7 3.1v2.6h2.8c1.6-1.4 2.5-3.5 2.5-5.9 0-.6-.1-1.2-.2-1.8H12z"/>
                    <path fill="#34A853" d="M12 23c2.4 0 4.5-.8 6.1-2.2l-2.8-2.6c-.8.5-1.9.8-3.3.8-2.5 0-4.7-1.7-5.5-4.1H3.5v2.6C5.1 20.9 8.3 23 12 23z"/>
                    <path fill="#FBBC05" d="M6.5 14.9c-.2-.5-.3-1-.3-1.6s.1-1.1.3-1.6V9.1H3.5C2.8 10.6 2.4 12.3 2.4 14s.4 3.4 1.1 4.9l3-2.6z"/>
                    <path fill="#4285F4" d="M12 6.3c1.3 0 2.5.5 3.4 1.3l2.5-2.5C16.5 3.3 14.4 2.4 12 2.4 8.3 2.4 5.1 4.5 3.5 7.4l3 2.6c.8-2.4 3-4.1 5.5-4.1z"/>
                  </svg>
                </button>
                <button type="button" className="flex justify-center items-center py-1 px-2 border border-[#b09d94] rounded-md bg-white hover:bg-gray-50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.12 8.44 9.88v-7h-2.54v-2.88h2.54V9.88c0-2.51 1.49-3.88 3.78-3.88 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.63.77-1.63 1.56v1.88h2.78L16.1 14.88h-2.26v7C18.34 21.12 22 17 22 12z"/>
                  </svg>
                </button>
                <button type="button" className="flex justify-center items-center py-1 px-2 border border-[#b09d94] rounded-md bg-white hover:bg-gray-50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#000000">
                    <path d="M16.365 1.43c0 1.14-.48 2.26-1.32 3.06-.9.86-2.16 1.38-3.36 1.3-.03-1.15.45-2.28 1.29-3.08.45-.44 1.07-.8 1.74-1.01.15-.04.29-.07.44-.07.27 0 .53.06.77.17.16.08.31.2.44.34zM20.25 17.01c-.24.58-.49 1.15-.76 1.69-.43.86-.88 1.7-1.52 2.39-.61.67-1.22 1.34-2.12 1.36-.82.02-1.08-.52-2.23-.51-1.15.01-1.45.52-2.27.51-.91-.02-1.5-.68-2.1-1.34-.67-.74-1.17-1.61-1.6-2.5-.71-1.48-1.29-3.08-1.04-4.76.19-1.29.74-2.4 1.61-3.27.83-.82 2.12-1.43 3.11-1.27.61.1 1.05.33 1.37.33.29 0 .85-.42 1.59-.36.27.01 1.16.11 1.7.86-.05.03-1.02.6-1 1.77.03 1.43 1.23 1.91 1.28 1.93-.01.04-1.26.88-1.24 2.34.01 1.85 1.54 2.47 1.56 2.47z"/>
                  </svg>
                </button>
              </div>
              <div className="text-center mt-3">
                <span className="text-sm text-gray-700">Don't have an account?</span>
                <button
                  type="button"
                  onClick={handleSignup}
                  className="text-sm text-[#ED695A] ml-1 hover:text-[#78533F] font-semibold"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;