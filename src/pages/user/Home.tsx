"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Heart,
  Camera,
  Users,
  MapPin,
  Calendar,
  Star,
  Flag,
  Search,
} from "lucide-react";
import Header from "../../component/user/Header";
import bgImg from "../../assets/Rectangle 50.png";
import makeup1 from "../../assets/makeup1.png";
import makeup2 from "../../assets/makeup2.png";
import makeup3 from "../../assets/makeup3.png";
import makeup4 from "../../assets/makeup4.png";
import pic1 from "../../assets/pic1.png";
import pic2 from "../../assets/pic2.png";
import pic3 from "../../assets/pic3.png";
import pic4 from "../../assets/pic4.png";
import venue1 from "../../assets/image 11.png";
import venue2 from "../../assets/image 12.png";
import venue3 from "../../assets/image 13.png";
import venue4 from "../../assets/image 15.png";
import pjct from "../../assets/image 16.png";
import pjct1 from "../../assets/Rectangle 30.png";
import vector from '../../assets/vector.png'
import { useNavigate } from "react-router-dom";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface Artist {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  location: string;
}

interface Venue {
  id: number;
  name: string;
  location: string;
  image: string;
  price: string;
}

interface Project {
  id: number;
  title: string;
  image: string;
  category: string;
}

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    place: "",
    date: "",
    event: "",
  });

  const navigate=useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    navigate(`/auditoriumlist?place=${formData.place}&date=${formData.date}&event=${formData.event}`);

  };

  const services: Service[] = [
    {
      id: 1,
      title: "Wedding Photography",
      description:
        "Capture your special moments with professional wedding photography that tells your unique love story.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Event Planning",
      description:
        "Complete wedding planning services to make your dream wedding come true with attention to every detail.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Venue Decoration",
      description:
        "Transform any space into a magical wedding venue with our expert decoration and design services.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Catering Services",
      description:
        "Delicious cuisine and professional catering services to satisfy all your guests' culinary needs.",
      image: "/placeholder.svg?height=200&width=300",
    },
  ];

  const artists: Artist[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Wedding Photographer",
      image: makeup1,
      rating: 4.9,
      location: "Kochi",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Event Planner",
      image: makeup2,
      rating: 4.8,
      location: "Delhi",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Decorator",
      image: makeup3,
      rating: 4.9,
      location: "Trivandrum",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Videographer",
      image: makeup4,
      rating: 4.7,
      location: "Kochui",
    },
  ];

  const Photes: Artist[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Wedding Photographer",
      image: pic1,
      rating: 4.9,
      location: "Kochi",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Event Planner",
      image: pic2,
      rating: 4.8,
      location: "Delhi",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Decorator",
      image: pic3,
      rating: 4.9,
      location: "Trivandrum",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Videographer",
      image: pic4,
      rating: 4.7,
      location: "Kochui",
    },
  ];

  const venues: Venue[] = [
    {
      id: 1,
      name: "Garden Paradise",
      location: "Beverly Hills, CA",
      image: venue1,
      price: "$5,000",
    },
    {
      id: 2,
      name: "Ocean View Resort",
      location: "Malibu, CA",
      image: venue2,
      price: "$8,000",
    },
    {
      id: 3,
      name: "Mountain Lodge",
      location: "Aspen, CO",
      image: venue3,
      price: "$6,500",
    },
    {
      id: 4,
      name: "Historic Mansion",
      location: "Napa Valley, CA",
      image: venue4,
      price: "$7,200",
    },
  ];

  const projects: Project[] = [
    {
      id: 1,
      title: "Romantic Beach Wedding",
      image: pjct1,
      category: "Beach Wedding",
    },
    {
      id: 2,
      title: "Garden Party Reception",
      image: pjct,
      category: "Garden Wedding",
    },
    {
      id: 3,
      title: "Garden Party Reception",
      image: venue2,
      category: "Garden Wedding",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white overflow-x-hidden">
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute  inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgImg})`,
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 w-full h-full"></div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <Header />
        </div>

        {/* Top Labels */}
        <div className="absolute top-16 sm:top-20 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-20 text-[#9c7c5d] text-xs sm:text-sm font-medium z-40">
          <div>EVENT DESIGN</div>
          <div>COMPANY</div>
        </div>

        <div className="absolute top-16 sm:top-20 right-4 sm:right-6 md:right-8 lg:right-12 xl:right-20 text-[#9c7c5d] text-xs sm:text-sm font-medium z-40">
          Find Local Venues
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 pt-20 sm:pt-24">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-left space-y-4 sm:space-y-6 lg:space-y-8 mb-8 lg:mb-0">
            <h1
              className={`text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-amber-900 leading-tight transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div
                className={`transition-all duration-1000 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Make Every Moment
              </div>
              <div
                className={`transition-all duration-1000 delay-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Unforgettable!
              </div>
            </h1>

            <div
              className={`text-[#9c7c5d] text-xs sm:text-sm font-medium space-y-1 transition-all duration-1000 delay-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div>HURRY UP TO</div>
              <div>BOOK YOUR WEDDING</div>
            </div>
          </div>

          {/* Right Content */}
          <div
            className={`w-full lg:w-1/2 flex flex-col items-center lg:items-end justify-center space-y-4 sm:space-y-6 text-center lg:text-right transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {/* Form */}
            <div className="w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
           
              <div className="flex flex-col sm:hidden space-y-3">
               
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <select
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">Place</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Trivandrum">Trivandrum</option>
                    <option value="Kannur">Kannur</option>
                    <option value="Calicut">Calicut</option>
                  </select>
                </div>

                {/* Date */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Event */}
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <select
                    name="event"
                    value={formData.event}
                    onChange={handleInputChange}
                    className="w-full h-10 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="engagement">Engagement</option>
                    <option value="reception">Reception</option>
                    <option value="anniversary">Anniversary</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="h-10 px-4 w-full bg-[#9c7c5d] text-white rounded-md font-medium hover:bg-[#9c7c5d] transition duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <span>Find Venues</span>
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Tablet and Desktop: 2x2 Grid */}
              <div className="hidden sm:grid grid-cols-2 gap-3 sm:gap-4">
                {/* Place */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <select
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                     <option value="">Place</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Trivandrum">Trivandrum</option>
                    <option value="Kannur">Kannur</option>
                    <option value="Calicut">Calicut</option>
                  </select>
                </div>

                {/* Date */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Event */}
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <select
                    name="event"
                    value={formData.event}
                    onChange={handleInputChange}
                    className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md text-[#9c7c5d] text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="engagement">Engagement</option>
                    <option value="reception">Reception</option>
                    <option value="anniversary">Anniversary</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="h-10 sm:h-12 px-4 w-full bg-[#9c7c5d] text-white rounded-md font-medium bg-[#9c7c5d] transition duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <span>Find Venues</span>
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div
              className={`text-[#9c7c5d] text-xs sm:text-sm font-medium space-y-1 transition-all duration-1000 delay-800 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div>VENUE</div>
              <div>PHOTOGRAPHERS</div>
              <div>MAKEUP-ARTISTS</div>
              <div>DESIGNS</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 flex items-center gap-2 sm:gap-4 z-40">
          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border border-gray-400 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
            </div>
            <span>Restart</span>
          </div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium">
            1/6
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 lg:py-20 ">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
              Our Services
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl">
              we specialize in creating seamless, unforgettable events tailored
              to your vision. From corporate gatherings and weddings to private
              celebrations and brand activations, our expert team ensures every
              detail is flawlessly executed. With a passion for creativity and
              precision, we handle everything from planning and design to
              logistics and on-site coordination so you can enjoy a stress-free
              experience. Let us bring your ideas to life and craft an event
              that leaves a lasting impression.
            </p>
          </div>
        </div>
      </section>

      {/* photographers Section */}
      <section
        id="photographers"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b  "
      >
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
              Latest Photographers
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl">
              Whether you love classic, candid, documentary, or artistic
              photography, we have the perfect match for your vision. Find your
              photographers offering flexible packages to fit your budget and
              needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Photes.map((artist, index) => (
              <div
                key={artist.id}
                className="group  rounded-xl overflow-hidden hover:shadow-xl transition duration-300 transform opacity-0 scale-95"
                style={{
                  animation: `fadeInScale 0.6s ease ${index * 0.15}s forwards`,
                }}
              >
                <style>
                  {`
                    @keyframes fadeInScale {
                      to {
                        opacity: 1;
                        transform: scale(1);
                      }
                    }
                    .group:hover .card-content {
                      transform: translateY(-5px);
                    }
                  `}
                </style>
                <div
                  className="relative h-48 sm:h-56 lg:h-64 bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url(${artist.image})` }}
                >
                  <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
                <div className="p-3 text-left flex items-center card-content transition-transform duration-300">
                  <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-medium text-[#5B4336] mb-1">
                      {artist.name}
                    </h3>
                    <p className="text-gray-600 text-sm flex items-center">
                      <MapPin className="h-4 w-4 text-gray-600 mr-1" />
                      {artist.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right mt-6">
            <button className="px-4 py-2 bg-gray-200 text-[#9c7c5d] rounded-lg hover:bg-gray-300 transition duration-300">
              View All
            </button>
          </div>
        </div>
      </section>

      {/* Artists Section */}
      <section id="photographers" className="py-12 sm:py-16 lg:py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
              Our Makeup artist
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl">
              Whether you love classic, candid, documentary, or artistic
              photography, we have the perfect match for your vision. Find your
              photographers offering flexible packages to fit your budget and
              needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {artists.map((artist, index) => (
              <div
                key={artist.id}
                className="group  rounded-xl overflow-hidden hover:shadow-xl transition duration-300 transform opacity-0 scale-95"
                style={{
                  animation: `fadeInScale 0.6s ease ${index * 0.15}s forwards`,
                }}
              >
                <style>
                  {`
                  @keyframes fadeInScale {
                    to {
                      opacity: 1;
                      transform: scale(1);
                    }
                  }
                  .group:hover .card-content {
                    transform: translateY(-5px);
                  }
                `}
                </style>
                <div
                  className="relative h-48 sm:h-56 lg:h-64 bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url(${artist.image})` }}
                >
                  <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
                <div className="p-3 text-left flex items-center card-content transition-transform duration-300">
                  <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-medium text-[#5B4336] mb-1">
                      {artist.name}
                    </h3>
                    <p className="text-gray-600 text-sm flex items-center">
                      <MapPin className="h-4 w-4 text-gray-600 mr-1" />
                      {artist.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right mt-6">
            <button className="px-4 py-2 bg-gray-200 text-[#9c7c5d] rounded-lg hover:bg-gray-300 transition duration-300">
              View All
            </button>
          </div>
        </div>
      </section>

      {/* Venues Section */}
      <section id="venues" className="py-12 sm:py-16 lg:py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-right mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
              Perfect Venues
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl ml-auto">
              Choose from our collection of stunning venues that will provide
              the perfect backdrop for your wedding
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {venues.map((artist, index) => (
              <div
                key={artist.id}
                className="group  rounded-xl overflow-hidden hover:shadow-xl transition duration-300 transform opacity-0 scale-95"
                style={{
                  animation: `fadeInScale 0.6s ease ${index * 0.15}s forwards`,
                }}
              >
                <style>
                  {`
              @keyframes fadeInScale {
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              .group:hover .card-content {
                transform: translateY(-5px);
              }
            `}
                </style>
                <div
                  className="relative h-48 sm:h-56 lg:h-64 bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url(${artist.image})` }}
                >
                  <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
                <div className="p-3 text-left flex items-center card-content transition-transform duration-300">
                  <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-medium text-[#5B4336] mb-1">
                      {artist.name}
                    </h3>
                    <p className="text-gray-600 text-sm flex items-center">
                      <MapPin className="h-4 w-4 text-gray-600 mr-1" />
                      {artist.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-12 sm:py-16 lg:py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B4336] mb-4">
              Our Projects
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl">
              Take a look at some of our recent wedding projects and get
              inspired for your own special day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group  rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48 sm:h-56 lg:h-64">
                  <img
                    src={project.image} // ✅ Use actual project image
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition duration-300"></div>
                </div>

                <div className="p-4 sm:p-6 text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#5B4336] mb-2">
                    {project.title}
                  </h3>
                  <p className="text-black-600 text-sm mb-4">
                    {project.category}
                  </p>
                  <button className="bg-[#9c7c5d] text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm hover:bg-pink-700 transition duration-300">
                    View Gallery
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Plan Your Dream Wedding?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-pink-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Let us help you create the perfect wedding day that you and your loved ones will remember forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className=" text-pink-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-pink-50 transition duration-300">
              Start Planning
            </button>
            <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-white hover:text-pink-600 transition duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-left">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600 mr-2" />
                <span className="text-xl sm:text-2xl font-bold">UnforgettableI</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                Creating magical wedding experiences that you'll treasure forever.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    Wedding Photography
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    Event Planning
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    Venue Decoration
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    Catering
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-600 transition duration-300">
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
            <p>&copy; 2024 UnforgettableI. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default HomePage;
