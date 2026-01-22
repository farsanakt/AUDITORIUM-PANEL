import React, { useEffect, useState } from "react";
import logo from "../../assets/logo-removebg.png";
import logo1 from "../../assets/iBooking-removebg.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { User, ChevronDown, Search } from "lucide-react";
import { adminLogout, fetchAllVendors, getAllAuditoriums } from "../../api/userApi";


const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [vendorOpen, setVendorOpen] = useState(false);
  const [auditoriumOpen, setAuditoriumOpen] = useState(false);

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
      const vendorRes = await fetchAllVendors()
      const auditoriumRes = await getAllAuditoriums()

      setVendors(vendorRes.data || []);
      setAuditoriums(auditoriumRes.data || []);
    };

    fetchData();
  }, []);

  /* ================= DERIVED DATA ================= */

  const vendorTypes = Array.from(
    new Set(vendors.map((v) => v.vendorType))
  );

  useEffect(() => {
    if (search.length < 2) {
      setSearchResults([]);
      return;
    }

    const filtered = auditoriums.filter((a) =>
      a.auditoriumName
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setSearchResults(filtered);
  }, [search, auditoriums]);

  /* ================= ACTIONS ================= */

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/");

    if (
      ["admin", "staff", "superadmin", "vendormanager", "venuemanager"].includes(
        currentUser?.role
      )
    ) {
      await adminLogout(currentUser.id);
    }
  };

  const goToProfile = () => {
    if (!currentUser) return;

    if (currentUser.role === "user") navigate("/userprofile");
    if (currentUser.role === "vendor") navigate("/vendor/profile");
    if (currentUser.role === "auditorium")
      navigate("/auditorium/profile");

    setDropdownOpen(false);
  };

  /* ================= UI ================= */

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#FDF8F1] z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center space-x-6">
            <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-4 cursor-pointer"
        >
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto scale-130"
          />
          <img
            src={logo1}
            alt="Logo2"
            className="h-6 w-auto ml-15 scale-800"
          />
        </div>


            

            {/* Vendor */}
            <div className="relative">
             <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setVendorOpen((prev) => !prev);
                setAuditoriumOpen(false);
              }}
              className="font-bold text-[#825F4C] pl-22 flex items-center gap-1 cursor-pointer"
            >

                Vendor <ChevronDown size={16} />
              </button>

              {vendorOpen && (
                <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md">
                  {vendorTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        navigate(`/vendorslist?type=${type}`)
                      }
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auditorium */}
            <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAuditoriumOpen((prev) => !prev);
                setVendorOpen(false);
              }}
              className="font-bold text-[#825F4C] flex items-center gap-1 cursor-pointer"
            >

                Auditorium <ChevronDown size={16} />
              </button>

              {auditoriumOpen && (
                <div className="absolute mt-2 w-64 bg-white shadow-lg rounded-md max-h-64 overflow-y-auto">
                  {auditoriums.map((a) => (
                    <button
                      key={a._id}
                      onClick={() =>
                        navigate(`/venuelist/${a._id}`)
                      }
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {a.auditoriumName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center space-x-4">

            {/* SEARCH */}
            <div className="relative">
              <div className="flex items-center bg-white border border-[#b09d94] rounded-lg px-3 py-2 w-72 shadow-sm">
                <Search size={16} className="text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search auditorium..."
                  className="ml-2 w-full outline-none text-sm"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="absolute mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-50">
                  {searchResults.map((a) => (
                    <button
                      key={a._id}
                      onClick={() =>
                        navigate(`/venuelist/${a._id}`)
                      }
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {a.auditoriumName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!currentUser ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-[#ED695A] text-white px-4 py-2 rounded-lg"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center gap-2 relative">
                
                {/* USER NAME */}
                <span className="text-sm text-[#825F4C]">
                  {displayName}
                </span>

                {/* USER ICON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="w-10 h-10 rounded-full bg-[#ED695A] text-white flex items-center justify-center"
                >
                  <User size={18} />
                </button>


                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-44 bg-white border border-[#b09d94] rounded-xl shadow-xl z-50">

                    <button
                      onClick={goToProfile}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="h-24 md:h-20" />
    </>
  );
};

export default Header;
