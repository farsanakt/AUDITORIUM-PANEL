import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import img from '../../assets/Wedding-pana.png';
import img1 from '../../assets/image1.png';
import img2 from '../../assets/image 11.png';
import Header from '../../component/user/Header';

const LoginUserPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSignUp, setIsSignUp] = useState(true);

  const images = [img, img1, img2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen  flex items-center justify-center p-2 sm:p-4">
      <Header />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
        <div className="flex flex-col sm:flex-row h-full min-h-[400px] sm:min-h-[500px]">
         
          <div className="flex-1 bg-[white] p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute w-full h-full flex items-center justify-center transition-all duration-1000 ease-in-out ${
                    index === currentImageIndex 
                      ? 'opacity-100 transform translate-x-0' 
                      : index === (currentImageIndex - 1 + images.length) % images.length
                      ? 'opacity-0 transform -translate-x-full'
                      : 'opacity-0 transform translate-x-full'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Slide ${index + 1}`}
                    className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
           
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto">
           
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <X className="w-4 h-4 text-gray-400 ml-auto cursor-pointer" />
                </div>
                <h2 className="text-xl font-bold text-[#78533F] mb-2">
                  Welcome Back..!
                </h2>
              </div>

              
              <div className="space-y-3">
                <div>
                  <input
                    type="email"
                    placeholder="JohnTerner.stre@18.design"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    className="w-full px-3 py-2 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#ED695A] text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm"
                >
                  Login
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    <span>didn't have an account? </span>
                    SIGN IN
                  </button>
                </div>

               
                <div className="flex items-start space-x-2 text-xs text-gray-600">
                  <input type="checkbox" className="mt-0.5 w-3 h-3 text-indigo-600" />
                  <span>
                    By registering your details, you agree with our{' '}
                    <a href="#" className="text-indigo-600 hover:underline">
                      Terms & Conditions
                    </a>
                    , and{' '}
                    <a href="#" className="text-indigo-600 hover:underline">
                      Privacy and Cookie Policy
                    </a>
                    .
                  </span>
                </div>

              
                <div className="flex justify-center space-x-4 mt-4">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Facebook
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-blue-700 hover:text-blue-900 font-medium text-sm">
                    LinkedIn
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                    Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUserPage;