import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';


const adminLoginAPI = async (email: string, password: string) => {

  return new Promise<{ success: boolean; message: string }>((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@gmail.com' && password === 'admin123') {
        resolve({ success: true, message: 'Login successful' });
      } else {
        reject({ success: false, message: 'Invalid email or password' });
      }
    }, 1000);
  });
};

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await adminLoginAPI(email, password);
      if (response.success) {
        toast.success(response.message);
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#b09d94] p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#78533F] font-serif text-center mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-semibold text-[#78533F] mb-2">
              Email
            </label>
            <div className="flex items-center border border-[#b09d94] rounded-lg focus-within:ring-2 focus-within:ring-[#ED695A]">
              <Mail size={20} className="ml-3 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-none rounded-lg focus:outline-none text-sm text-[#78533F] bg-transparent"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-[#78533F] mb-2">
              Password
            </label>
            <div className="flex items-center border border-[#b09d94] rounded-lg focus-within:ring-2 focus-within:ring-[#ED695A]">
              <Lock size={20} className="ml-3 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-none rounded-lg focus:outline-none text-sm text-[#78533F] bg-transparent"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-[#ED695A] font-serif text-center">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#ED695A] text-white rounded-lg hover:bg-[#D65A4C] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;