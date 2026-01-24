import React, { useEffect, useState } from "react";
import logo from "../../assets/logo-removebg.png";
import logo1 from "../../assets/iBooking-removebg.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { User, ChevronDown, Search, Menu, X, LogOut } from "lucide-react";
import { adminLogout, fetchAllVendors, getAllAuditoriums } from "../../api/userApi";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

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
        setVendors(vendorRes.data || []);
        setAuditoriums(auditoriumRes.data || []);
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

  /* ================= UI RENDER ================= */
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 h-20 flex items-center">
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
                className="flex items-center gap-1 font-semibold text-gray-700 hover:text-[#9c7c5d] transition-colors py-2"
              >
                Vendor <ChevronDown size={16} className={`transition-transform duration-300 ${vendorOpen ? "rotate-180" : ""}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top ${vendorOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-2">
                  {vendorTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => navigate(`/vendorslist?type=${type}`)}
                      className="block w-full px-5 py-2.5 text-left text-sm text-gray-600 hover:bg-[#FDF8F1] hover:text-[#9c7c5d] transition-colors capitalize"
                    >
                      {type}
                    </button>
                  ))}
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
                className="flex items-center gap-1 font-semibold text-gray-700 hover:text-[#9c7c5d] transition-colors py-2"
              >
                Auditorium <ChevronDown size={16} className={`transition-transform duration-300 ${auditoriumOpen ? "rotate-180" : ""}`} />
              </button>
              
              <div 
                 className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top max-h-80 overflow-y-auto custom-scrollbar ${auditoriumOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                 onClick={(e) => e.stopPropagation()}
              >
                <div className="py-2">
                  {auditoriums.map((a) => (
                    <button
                      key={a._id}
                      onClick={() => navigate(`/venuelist/${a._id}`)}
                      className="block w-full px-5 py-2.5 text-left text-sm text-gray-600 hover:bg-[#FDF8F1] hover:text-[#9c7c5d] transition-colors truncate"
                    >
                      {a.auditoriumName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
               <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-64 focus-within:w-72 focus-within:border-[#9c7c5d] focus-within:ring-1 focus-within:ring-[#9c7c5d]/20 transition-all duration-300">
                  <Search size={16} className="text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Find venues..."
                    className="ml-2 w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                  />
               </div>

               {/* Search Results Dropdown */}
               {searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-100 max-h-60 overflow-y-auto z-50 animate-fade-in-up">
                    {searchResults.map((a) => (
                      <button
                        key={a._id}
                        onClick={() => {
                          navigate(`/venuelist/${a._id}`);
                          setSearch("");
                        }}
                        className="block w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-50 last:border-0"
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
                  className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                >
                  <span className="text-sm font-medium text-gray-700 hidden lg:block mr-2">
                    {displayName}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#9c7c5d] text-white flex items-center justify-center shadow-md">
                     <User size={18} />
                  </div>
                </div>

                {/* Profile Dropdown */}
                <div 
                  className={`absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top-right ${profileDropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
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
        <div className={`fixed inset-x-0 top-20 bg-white shadow-xl border-t border-gray-100 transform transition-transform duration-300 origin-top md:hidden ${mobileMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}>
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
                     <div className="pl-4 space-y-2 mt-2 border-l-2 border-gray-100">
                        {vendorTypes.map(type => (
                           <button 
                             key={type}
                             onClick={() => {
                               navigate(`/vendorslist?type=${type}`);
                               setMobileMenuOpen(false);
                             }}
                             className="block w-full text-left text-sm text-gray-600 py-1 capitalize"
                           >
                              {type}
                           </button>
                        ))}
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
                     <div className="pl-4 space-y-2 mt-2 border-l-2 border-gray-100 max-h-48 overflow-y-auto">
                        {auditoriums.map(a => (
                           <button 
                             key={a._id}
                             onClick={() => {
                               navigate(`/venuelist/${a._id}`);
                               setMobileMenuOpen(false);
                             }}
                             className="block w-full text-left text-sm text-gray-600 py-1"
                           >
                              {a.auditoriumName}
                           </button>
                        ))}
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
