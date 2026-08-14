import React, { useEffect, useState } from "react";
import logo from "../../assets/logo-removebg.png";
import logo1 from "../../assets/iBooking-removebg.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { User, ChevronDown, Search, Menu, X, LogOut, MapPin } from "lucide-react";
import { adminLogout, fetchAllVendors, getAllAuditoriums } from "../../api/userApi";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  

  const [vendorOpen, setVendorOpen] = useState(false);
  const [auditoriumOpen, setAuditoriumOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);


  const [vendors, setVendors] = useState<any[]>([]);
  const [auditoriums, setAuditoriums] = useState<any[]>([]);


  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.auth);

  const displayName = currentUser?.email
    ? currentUser.email.split("@")[0]
    : "";

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorRes = await fetchAllVendors();
        const auditoriumRes = await getAllAuditoriums();
        console.log(auditoriumRes.data)
        // ✅ Vendors: show all (no verification check) | Auditoriums: verified only
        setVendors(vendorRes.data || []);
        setAuditoriums((auditoriumRes.data || []).filter((a: any) => a.isVerified === true));
      } catch (error) {
        console.error("Error fetching header data", error);
      }
    };
    fetchData();
  }, []);

  /* ================= DERIVED DATA ================= */
  const vendorTypes = Array.from(new Set(vendors.map((v) => v.vendorType)));

  /* ================= SEARCH LOGIC ================= */
  useEffect(() => {
    if (search.length < 2) {
      setSearchResults([]);
      return;
    }
    // Auditoriums are already verified-only, so search results are too
    const filtered = auditoriums.filter((a) =>
      a.auditoriumName.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filtered);
  }, [search, auditoriums]);

  /* ================= ACTIONS ================= */
  const handleLogout = async () => {
    dispatch(logout());
    navigate("/");
    if (["admin", "staff", "superadmin", "vendormanager", "venuemanager"].includes(currentUser?.role)) {
      await adminLogout(currentUser.id);
    }
  };

  const goToProfile = () => {
    if (!currentUser) return;
    if (currentUser.role === "user") navigate("/userprofile");
    if (currentUser.role === "vendor") navigate("/vendor/profile");
    if (currentUser.role === "auditorium") navigate("/auditorium/profile");
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const closeDropdowns = () => {
      setVendorOpen(false);
      setAuditoriumOpen(false);
      setProfileDropdownOpen(false);
      setSearchResults([]);
    };
    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, []);

  // Glass effect intensifies slightly once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= UI RENDER ================= */
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-500 border-b ${
          scrolled
            ? "bg-white/70 backdrop-blur-2xl border-white/50 shadow-lg shadow-[#5B4336]/5"
            : "bg-white/40 backdrop-blur-xl border-white/30 shadow-md shadow-[#5B4336]/5"
        }`}
        style={{ WebkitBackdropFilter: "blur(24px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          
          {/* LOGO SECTION (Fixed Size & Position) */}
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center space-x-4 cursor-pointer flex-shrink-0"
          >
            <img src={logo} alt="Logo" className="h-10 w-auto scale-130" />
            <img src={logo1} alt="iBooking" className="h-6 w-auto ml-15 scale-800" />
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-8">
            
            {/* Vendor Dropdown */}
            <div className="relative group">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setVendorOpen(!vendorOpen);
                  setAuditoriumOpen(false);
                }}
                className="flex items-center gap-1 font-semibold text-[#5B4336] hover:text-[#9c7c5d] transition-colors py-2"
              >
                Vendor <ChevronDown size={16} className={`transition-transform duration-300 ${vendorOpen ? "rotate-180" : ""}`} />
              </button>
              
              {/* Dropdown Menu — all vendors, elegant list */}
              <div 
                className={`absolute top-full left-0 mt-3 w-60 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl shadow-[#5B4336]/10 border border-white/60 overflow-hidden transition-all duration-300 origin-top ${vendorOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-5 py-2.5 bg-[#FDF8F1]/70 backdrop-blur-md border-b border-[#9c7c5d]/15">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9c7c5d]">Our Services</p>
                </div>
                <div className="py-1">
                  {vendorTypes.length === 0 ? (
                    <p className="px-5 py-4 text-xs text-gray-400 text-center italic">No vendors available</p>
                  ) : (
                    vendorTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => navigate(`/vendorslist?type=${type}`)}
                        className="w-full px-5 py-2.5 text-left text-sm text-gray-600 hover:bg-[#FDF8F1] hover:text-[#9c7c5d] hover:pl-6 transition-all duration-300 capitalize font-serif flex items-center gap-2 group/item border-b border-gray-50 last:border-0"
                      >
                        <span className="w-1 h-1 bg-[#9c7c5d] rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"></span>
                        {type}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Auditorium Dropdown */}
            <div className="relative group">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAuditoriumOpen(!auditoriumOpen);
                  setVendorOpen(false);
                }}
                className="flex items-center gap-1 font-semibold text-[#5B4336] hover:text-[#9c7c5d] transition-colors py-2"
              >
                Auditorium <ChevronDown size={16} className={`transition-transform duration-300 ${auditoriumOpen ? "rotate-180" : ""}`} />
              </button>
              
              {/* Dropdown Menu — verified auditoriums only, elegant list */}
              <div 
                 className={`absolute top-full left-0 mt-3 w-72 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl shadow-[#5B4336]/10 border border-white/60 overflow-hidden transition-all duration-300 origin-top max-h-80 overflow-y-auto custom-scrollbar ${auditoriumOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                 onClick={(e) => e.stopPropagation()}
              >
                <div className="px-5 py-2.5 bg-[#FDF8F1]/70 backdrop-blur-md border-b border-[#9c7c5d]/15 sticky top-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9c7c5d]">Verified Auditoriums</p>
                </div>
                <div className="py-1">
                  {auditoriums.length === 0 ? (
                    <p className="px-5 py-4 text-xs text-gray-400 text-center italic">No verified auditoriums available</p>
                  ) : (
                    auditoriums.map((a) => (
                      <button
                        key={a._id}
                        onClick={() => navigate(`/venuelist/${a._id}`)}
                        className="w-full px-5 py-3 text-left hover:bg-[#FDF8F1] transition-all duration-300 border-b border-gray-50 last:border-0 group/item"
                      >
                        <p className="text-sm font-serif font-semibold text-[#5B4336] group-hover/item:text-[#9c7c5d] transition-colors truncate">
                          {a.auditoriumName}
                        </p>
                        {(a.district || a.address) && (
                          <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin size={10} className="text-[#9c7c5d] flex-shrink-0" />
                            {a.district || a.address}
                          </p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
               <div className="flex items-center bg-white/50 backdrop-blur-md border border-white/60 rounded-full px-4 py-2 w-64 shadow-sm focus-within:w-72 focus-within:bg-white/80 focus-within:border-[#9c7c5d]/50 focus-within:ring-1 focus-within:ring-[#9c7c5d]/20 transition-all duration-300">
                  <Search size={16} className="text-[#9c7c5d]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Find venues..."
                    className="ml-2 w-full bg-transparent outline-none text-sm text-[#5B4336] placeholder-[#9c7c5d]/60"
                  />
               </div>

               {/* Search Results Dropdown */}
               {searchResults.length > 0 && (
                  <div className="absolute top-full mt-3 w-full bg-white/85 backdrop-blur-2xl shadow-xl shadow-[#5B4336]/10 rounded-2xl border border-white/60 max-h-60 overflow-y-auto z-50 animate-fade-in-up">
                    {searchResults.map((a) => (
                      <button
                        key={a._id}
                        onClick={() => {
                          navigate(`/venuelist/${a._id}`);
                          setSearch("");
                        }}
                        className="block w-full px-4 py-3 text-left hover:bg-[#FDF8F1] text-sm text-[#5B4336] font-serif border-b border-gray-50 last:border-0 transition-colors"
                      >
                        {a.auditoriumName}
                      </button>
                    ))}
                  </div>
               )}
            </div>

            {/* Auth Button */}
            {!currentUser ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-[#9c7c5d] hover:bg-[#8b6b4a] text-white px-6 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <div 
                  className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-white/60 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                >
                  <span className="text-sm font-medium text-[#5B4336] hidden lg:block mr-2">
                    {displayName}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#9c7c5d] text-white flex items-center justify-center shadow-md">
                     <User size={18} />
                  </div>
                </div>

                {/* Profile Dropdown */}
                <div 
                  className={`absolute right-0 top-full mt-3 w-48 bg-white/85 backdrop-blur-2xl rounded-2xl shadow-xl shadow-[#5B4336]/10 border border-white/60 overflow-hidden transition-all duration-300 origin-top-right ${profileDropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-2">
                    <button
                      onClick={goToProfile}
                      className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-[#FDF8F1] hover:text-[#9c7c5d] flex items-center gap-2 transition-colors"
                    >
                      <User size={16} /> Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* MOBILE TOGGLE */}
          <button 
             className="md:hidden text-gray-700 p-2" 
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div className={`fixed inset-x-0 top-20 bg-white/85 backdrop-blur-2xl shadow-xl border-t border-white/50 transform transition-transform duration-300 origin-top md:hidden ${mobileMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}>
            <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
               
               {/* Mobile Search */}
               <div className="relative">
                 <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <Search size={16} className="text-gray-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search auditorium..."
                      className="ml-2 w-full bg-transparent outline-none text-sm"
                    />
                 </div>
                 {/* Mobile Search Results */}
                 {searchResults.length > 0 && (
                    <div className="mt-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                       {searchResults.map((a) => (
                         <button
                           key={a._id}
                           onClick={() => {
                             navigate(`/venuelist/${a._id}`);
                             setSearch("");
                             setMobileMenuOpen(false);
                           }}
                           className="block w-full px-4 py-3 text-left text-sm border-b border-gray-50 last:border-0"
                         >
                           {a.auditoriumName}
                         </button>
                       ))}
                    </div>
                 )}
               </div>

               {/* Mobile Vendor Dropdown */}
               <div>
                  <button 
                    onClick={() => setVendorOpen(!vendorOpen)}
                    className="flex items-center justify-between w-full font-semibold text-gray-800 py-2"
                  >
                     Vendors <ChevronDown size={16} className={`transition-transform ${vendorOpen ? "rotate-180" : ""}`} />
                  </button>
                  {vendorOpen && (
                     <div className="pl-4 space-y-2 mt-2 border-l-2 border-[#9c7c5d]/30">
                        {vendorTypes.length === 0 ? (
                          <p className="text-xs text-gray-400 italic py-1">No vendors available</p>
                        ) : (
                          vendorTypes.map(type => (
                             <button 
                               key={type}
                               onClick={() => {
                                 navigate(`/vendorslist?type=${type}`);
                                 setMobileMenuOpen(false);
                               }}
                               className="block w-full text-left text-sm text-gray-600 py-1 capitalize font-serif"
                             >
                                {type}
                             </button>
                          ))
                        )}
                     </div>
                  )}
               </div>

               {/* Mobile Auditorium Dropdown */}
               <div>
                  <button 
                    onClick={() => setAuditoriumOpen(!auditoriumOpen)}
                    className="flex items-center justify-between w-full font-semibold text-gray-800 py-2"
                  >
                     Auditoriums <ChevronDown size={16} className={`transition-transform ${auditoriumOpen ? "rotate-180" : ""}`} />
                  </button>
                  {auditoriumOpen && (
                     <div className="pl-4 space-y-2 mt-2 border-l-2 border-[#9c7c5d]/30 max-h-48 overflow-y-auto">
                        {auditoriums.length === 0 ? (
                          <p className="text-xs text-gray-400 italic py-1">No verified auditoriums available</p>
                        ) : (
                          auditoriums.map(a => (
                             <button 
                               key={a._id}
                               onClick={() => {
                                 navigate(`/venuelist/${a._id}`);
                                 setMobileMenuOpen(false);
                               }}
                               className="block w-full text-left text-sm text-gray-600 py-1 font-serif"
                             >
                                {a.auditoriumName}
                             </button>
                          ))
                        )}
                     </div>
                  )}
               </div>

               {/* Mobile Auth */}
               <div className="pt-4 border-t border-gray-100">
                  {!currentUser ? (
                     <button
                       onClick={() => {
                          navigate("/login");
                          setMobileMenuOpen(false);
                       }}
                       className="w-full bg-[#9c7c5d] text-white py-3 rounded-lg font-bold shadow-md"
                     >
                        Login
                     </button>
                  ) : (
                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-[#9c7c5d] text-white flex items-center justify-center">
                              <User size={20} />
                           </div>
                           <span className="font-medium text-gray-800">{displayName}</span>
                        </div>
                        <button 
                          onClick={goToProfile} 
                          className="w-full text-left py-2 text-sm font-medium text-gray-600 flex items-center gap-2"
                        >
                           <User size={16} /> Profile
                        </button>
                        <button 
                          onClick={() => {
                             handleLogout();
                             setMobileMenuOpen(false);
                          }}
                          className="w-full text-left py-2 text-sm font-medium text-red-600 flex items-center gap-2"
                        >
                           <LogOut size={16} /> Logout
                        </button>
                     </div>
                  )}
               </div>
            </div>
        </div>

      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
};

export default Header;