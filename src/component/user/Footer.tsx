'use client';

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
  ArrowRight
} from 'lucide-react';
import logo from "../../assets/logo-removebg.png";
import logo1 from "../../assets/iBooking-removebg.png";
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#2C1810] text-gray-300 relative overflow-hidden font-sans border-t-4 border-[#9c7c5d]">
      
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#9c7c5d]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 items-start">

          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 space-y-6 text-left animate-fade-in-up">
             <div className="flex items-center gap-4">
                <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
                <img src={logo1} alt="iBooking" className="h-12 w-auto object-contain opacity-90" />
             </div>

            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              iBookingVenue is your premium gateway to exclusive event spaces and trusted vendors. 
              We simplify your celebration planning with seamless experiences and curated choices.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm group cursor-pointer hover:text-[#9c7c5d] transition-colors">
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#9c7c5d]/20 transition-colors">
                   <Phone size={16} className="text-[#9c7c5d]" />
                </div>
                <span>+91 9947299100,9745299100</span>
              </div>

              <div className="flex items-center gap-3 text-sm group cursor-pointer hover:text-[#9c7c5d] transition-colors">
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#9c7c5d]/20 transition-colors">
                   <Mail size={16} className="text-[#9c7c5d]" />
                </div>
                <span>support@ibookingvenue.com</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm group cursor-pointer hover:text-[#9c7c5d] transition-colors">
                 <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#9c7c5d]/20 transition-colors">
                   <MapPin size={16} className="text-[#9c7c5d]" />
                </div>
                <span>Kochi, Kerala, India</span>
              </div>
            </div>
          </div>

          {/* LINKS COLUMNS */}
          <div className="text-left animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-lg font-serif font-bold text-[#e6d0b5] mb-6 relative inline-block">
              Explore
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#9c7c5d]"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              {['About Us', 'Contact', 'Blog & Guides', 'Careers', 'FAQs'].map((item) => (
                <li key={item} className="hover:text-[#9c7c5d] hover:translate-x-1 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                   <span className="w-1 h-1 bg-[#9c7c5d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                   {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-left animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-lg font-serif font-bold text-[#e6d0b5] mb-6 relative inline-block">
              Legal
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#9c7c5d]"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cancellation Policy', 'Refund Policy', 'Cookie Policy'].map((item) => (
                <li key={item} className="hover:text-[#9c7c5d] hover:translate-x-1 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
                   <span className="w-1 h-1 bg-[#9c7c5d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                   {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ACTIONS COLUMN */}
          <div className="text-left space-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h4 className="text-lg font-serif font-bold text-[#e6d0b5] mb-2">Partner With Us</h4>
            <p className="text-xs text-gray-500 mb-4">Join our network of premium venues and vendors.</p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={()=>navigate('/vendor/login')} 
                className="w-full bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-between group"
              >
                <span>Vendor Login</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={()=>navigate('/auditorium/login')} 
                className="w-full border border-[#9c7c5d] text-[#9c7c5d] hover:bg-[#9c7c5d] hover:text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-between group"
              >
                <span>Venue Login</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Social Icons */}
            <div className="pt-4">
                <div className="flex gap-3">
                  {[Facebook, Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                      <div key={i} className="p-2 bg-white/5 rounded-full hover:bg-[#9c7c5d] text-gray-400 hover:text-white transition-all cursor-pointer transform hover:-translate-y-1">
                        <Icon size={18} />
                      </div>
                    )
                  )}
                </div>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="border-t border-white/10 bg-[#24120C]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            © {year} <span className="text-[#e6d0b5] font-semibold">iBookingVenue</span>. All rights reserved.
          </p>
          <div className="flex gap-6">
             <span className="hover:text-gray-300 cursor-pointer">Sitemap</span>
             <span className="hover:text-gray-300 cursor-pointer">Security</span>
             <p>Designed with <span className="text-red-500">♥</span> by Team</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
