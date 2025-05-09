"use client"

import type React from "react"
import { useState } from "react"
import tk from '../../assets/Rectangle 50.png'
import { useNavigate } from "react-router-dom"
import Header from "../../component/user/Header"
// import vector from '../../assets/lines.png'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const navigate=useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login with:", username, password, "Remember me:", rememberMe)
    navigate('/dashboard')
  }

  const handleForgotPassword = () => {
    console.log("Forgot password clicked")
  }

  
  const handleSignup = () => {
    console.log("Navigate to login page")
    navigate('/signup');
  }

  return (
    <div className="fixed inset-0 bg-[#FDF8F1] flex items-center mt-10 justify-center">
      <Header/>
      
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden max-w-5xl w-full">
   
        {/* Left Content Section */}
        <div className="md:w-1/2 relative hidden md:block">
          <div className="relative h-full">



            <img
              src={tk}
              alt="Platform Preview"
              className="w-full h-full object-cover absolute inset-0"
            />
            
            <div className="absolute inset-0 bg-opacity-40">
              <div className="p-8 h-full flex flex-col justify-between">
                {/* Top section with logo and heading */}
                <div className="text-center mb-6 mt-8">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#ED695A] text-3xl font-bold">TK</span>
                  </div>
                  <h2 className="text-[#78533F] text-3xl md:text-4xl font-bold mb-3 tracking-wide">Welcome Back</h2>
                  <div className="w-24 h-1 bg-[#ED695A] mx-auto mb-3"></div>
                </div>

                {/* Middle section with description */}
                <div className="mb-6">
                  <p className="text-[#3C3A39] text-lg mb-6 leading-relaxed text-center px-4">
                    Experience a seamless and intuitive interface designed to enhance your productivity and creativity.
                  </p>
                </div>

                {/* Bottom section with benefits */}
                <div className=" bg-opacity-20 p-6 rounded-lg backdrop-blur-sm mb-8">
                  <p className="text-[rgb(237,105,90)] font-bold text-xl mb-4 text-center">Why choose us?</p>
                  <ul className="text-[#3C3A39] space-y-3">
                    <li className="flex items-center">
                      <span className="mr-2 text-[#3C3A39]">✦</span>
                      <span>Intuitive and user-friendly interface</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-[#3C3A39]">✦</span>
                      <span>Powerful features for enhanced productivity</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-[#3C3A39]">✦</span>
                      <span>Secure and reliable platform</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-[#3C3A39]">✦</span>
                      <span>Dedicated support team</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Login Form Section */}
        <div className="md:w-1/2 p-6 md:p-8 flex justify-center items-center bg-white">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#78533F]">WELCOME BACK!</h2>
              <p className="text-gray-600 mt-2">Please login to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="username" className="text-left block text-[#78533F] font-medium text-sm">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    className="w-full pl-4 pr-10 py-3 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent transition-all duration-200"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#b09d94]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-left block text-[#78533F] font-medium text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-4 pr-10 py-3 border border-[#b09d94] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#876553] focus:border-transparent transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#b09d94]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#ED695A] focus:ring-[#ED695A] border-[#b09d94] rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-[#ED695A] hover:text-[#78533F] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ED695A] text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-[#d85c4e] transform hover:scale-[1.02] transition-all duration-300"
              >
                Sign In
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#b09d94]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#b09d94]">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="flex justify-center items-center py-2 px-4 border border-[#b09d94] rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" fill="#4285F4" viewBox="0 0 24 24">
                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.082z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="flex justify-center items-center py-2 px-4 border border-[#b09d94] rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="flex justify-center items-center py-2 px-4 border border-[#b09d94] rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" fill="#000000" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button onClick={handleSignup} className="text-[#ED695A] font-medium hover:underline transition-all">Sign up now</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
