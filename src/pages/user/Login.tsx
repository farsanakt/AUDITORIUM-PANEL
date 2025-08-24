import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';

import img from '../../assets/Beach wedding-pana.png';
import img1 from '../../assets/Divorce-pana.png';
import img2 from '../../assets/Honeymoon-pana.png';
import img3 from '../../assets/Wedding-pana.png';

import Header from '../../component/user/Header';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../../redux/slices/authSlice';
import { userLogin } from '../../api/userApi';
import { toast } from 'react-toastify';

const images: string[] = [img, img1, img2, img3];

const LoginUserPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = () => {
    navigate('/singup');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const response = await userLogin(email, password);
      if (response.data.success === false) {
        dispatch(loginFailure());
        toast.error(response.data.message);
      } else {
        dispatch(
          loginSuccess({
            user: response.data.user,
            accessToken: response.data.accessToken,
          })
        );
        toast.success(response.data.message);
        navigate('/');
      }
    } catch (error: any) {
      dispatch(loginFailure());
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
                <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>

              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-[#78533F] font-serif">Welcome Back</h2>
                <p className="text-sm text-gray-600 mt-1 font-serif">Please login to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                {/* Email input */}
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

                {/* Password input */}
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

                {/* Remember & Forgot */}
                <div className="flex justify-between text-xs text-gray-600 items-center font-serif">
                  <label className="flex items-center space-x-1">
                    <input type="checkbox" className="w-3 h-3 rounded border-[#b09d94]" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="text-[#ED695A] hover:underline">
                    Forgot password?
                  </button>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  className="w-full bg-[#ED695A] text-white py-2 rounded-full font-semibold hover:bg-[#d7584c] transition-all duration-300 font-serif"
                >
                  Sign In
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-3">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="mx-2 text-xs text-gray-500 font-serif">or continue with</span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button className="flex items-center justify-center border border-[#b09d94] rounded-full h-9 w-full hover:bg-gray-50 transition-all duration-200">
                  <FaGoogle className="text-red-500" />
                </button>
                <button className="flex items-center justify-center border border-[#b09d94] rounded-full h-9 w-full hover:bg-gray-50 transition-all duration-200">
                  <FaFacebookF className="text-blue-600" />
                </button>
                <button className="flex items-center justify-center border border-[#b09d94] rounded-full h-9 w-full hover:bg-gray-50 transition-all duration-200">
                  <FaApple className="text-black" />
                </button>
              </div>

              {/* Sign up text */}
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
    </div>
  );
};

export default LoginUserPage;