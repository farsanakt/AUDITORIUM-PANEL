'use client';

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Phone,
  Mail,
} from 'lucide-react';
import logo from "../../assets/logo-removebg.png";
import logo1 from "../../assets/iBooking-removebg.png";
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  const navigate=useNavigate()

  return (
    <footer className="w-screen bg-[#78533F] text-gray-200">
      {/* MAIN */}
      <div className="px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">

          {/* BRAND */}
          <div className="space-y-4 text-left">
             <div className="flex ml-0 items-center space-x-4">
            <img src={logo} alt="Logo" className="h-10 w-auto scale-130" />
            <button  className="focus:outline-none">
              <img
                src={logo1}
                alt="Logo2"
                className="h-6 w-auto ml-15 scale-800"
              />
            </button>
          </div>

            <p className="text-sm leading-relaxed text-gray-300">
              iBookingVenue is a next-generation marketplace that simplifies
              event, auditorium, and venue bookings with trusted vendors and
              seamless experiences.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#ED695A]" />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#ED695A]" />
                <span>support@ibookingvenue.com</span>
              </div>
            </div>
          </div>

          {/* INFORMATION */}
          <div className="text-left">
            <h4 className="footer-title">Information</h4>
            <ul className="footer-list">
              <li>About Us</li>
              <li>Contact</li>
              <li>Blog & Guides</li>
              <li>Careers</li>
              <li>FAQs</li>
            </ul>
          </div>

          {/* POLICIES */}
          <div className="text-left">
            <h4 className="footer-title">Policies</h4>
            <ul className="footer-list">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cancellation Policy</li>
              <li>Refund Policy</li>
              <li>Cookie Policy</li>
            </ul>
          </div>

          {/* PARTNER */}
          <div className="text-left space-y-4">
            <h4 className="footer-title">Partner With Us</h4>

            <button onClick={()=>navigate('/vendor/login')} className="btn-primary">
              Register as Vendor
            </button>

            <button onClick={()=>navigate('/auditorium/login')} className="btn-outline">
              Register Auditorium
            </button>
          </div>

          {/* SOCIAL */}
          <div className="text-left">
            <h4 className="footer-title">Follow Us</h4>
            <div className="flex gap-3 mt-4">
              {[Facebook, Instagram, Twitter, Linkedin, Youtube].map(
                (Icon, i) => (
                  <div key={i} className="social-icon">
                    <Icon size={16} />
                  </div>
                )
              )}
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/20 px-12 py-5">
        <div className="flex justify-between text-sm text-gray-300">
          <p>
            © {year}{' '}
            <span className="text-[#ED695A] font-semibold">
              iBookingVenue
            </span>
            . All rights reserved.
          </p>

          <p>
            Powered by{' '}
            <span className="text-[#ED695A] font-semibold">
              iBookingVenue
            </span>
          </p>
        </div>
      </div>

      {/* INTERNAL STYLES */}
      <style jsx>{`
        .footer-title {
          color: #ed695a;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .footer-list li {
          font-size: 13px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .footer-list li:hover {
          color: #ed695a;
        }

        .btn-primary {
          width: 100%;
          background: #ed695a;
          padding: 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .btn-outline {
          width: 100%;
          border: 1.5px solid #ed695a;
          padding: 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #ed695a;
        }

        .social-icon {
          background: #825f4c;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
        }

        .social-icon:hover {
          background: #ed695a;
        }
      `}</style>
    </footer>
  );
}
