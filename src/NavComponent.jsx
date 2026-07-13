// 1. Import NavLink instead of Link from react-router-dom
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { useState } from "react";
import api from "./api/axios";

export default function Nav() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [pnrQuery, setPnrQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await api.post("/api/auth/logout");
      if (response.status === 200) {
        console.log("Logout successful");
      }
    } catch (err) {
      console.warn("Logout API failed:", err);
    } finally {
      logout();
      try {
        localStorage.removeItem("payanam_user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } catch (e) {}
      navigate("/login");
    }
  };

  const handlePnrSearch = async (e) => {
    e.preventDefault();
    const cleanPnr = pnrQuery.trim();
    if (!cleanPnr) return;

    setIsSearching(true);
    try {
      const res = await api.get(`/api/v1/bookings/${cleanPnr}`);
      if (res.data?.success || res.data) {
        const bookingData = res.data.data || res.data;
        navigate("/ticketdetails", {
          state: {
            ticket: {
              bookingId: bookingData.bookingId || cleanPnr,
              bookingStatus: bookingData.bookingStatus || bookingData.status || "CONFIRMED",
              paymentStatus: bookingData.paymentStatus || "SUCCESS",
              paymentReference: bookingData.paymentReference || "MOCK-REF",
              totalFare: bookingData.totalFare || bookingData.totalAmount || bookingData.fare || 0,
              bookedSeats: bookingData.bookedSeats || (bookingData.passengerDetails ? bookingData.passengerDetails.map(p => p.seatNumber) : []),
              bookedAt: bookingData.bookedAt || bookingData.createdAt || new Date().toISOString()
            },
            meta: {
              busName: bookingData.busName || bookingData.scheduleId?.busId?.name || "Payanam Cruiser",
              boarding: bookingData.boardingPoint || { city: bookingData.source || "Origin", name: "Main Stand", time: "N/A" },
              dropping: bookingData.droppingPoint || { city: bookingData.destination || "Destination", name: "Terminal Drop", time: "N/A" },
              passengers: bookingData.passengerDetails || []
            }
          }
        });
        setPnrQuery("");
        closeMobileMenu();
      }
    } catch (err) {
      console.error("PNR retrieval malfunction:", err);
      const errMsg = err.response?.data?.errors?.[0] || err.response?.data?.message || "No matching PNR record identified under your profile.";
      alert(`⚠️ PNR Search Error: ${errMsg}`);
    } finally {
      setIsSearching(false);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const getDesktopNavLinkStyle = ({ isActive }) => 
    isActive
      ? "rounded-xl bg-lime-100/70 px-4 py-2.5 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300 transition block"
      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-4 py-2.5 transition block";

  const getMobileNavLinkStyle = ({ isActive }) =>
    isActive
      ? "block rounded-xl bg-lime-50 dark:bg-lime-950/30 text-lime-700 px-4 py-3.5 font-bold"
      : "block rounded-xl px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold";

  return (
    <>
    {/* FIXED: Enforced strict h-20 size property matching on header shell level container wrapper */}
    <header className="fixed top-0 left-0 right-0 h-20 z-50 border-b border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-900/70 backdrop-blur-md shadow-xs">
        <div className="flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 mx-auto">
          
          {/* Left Side Branding & Aligned Search Input */}
          <div className="flex items-center gap-8 flex-1 max-w-2xl">
            <Link className="flex shrink-0 items-center gap-1 text-teal-600 dark:text-teal-500" to="/" onClick={closeMobileMenu}>
              <span className="text-2xl font-black tracking-widest text-slate-800 dark:text-slate-200">PAYANAM</span>
            </Link>
          </div>

          {/* Right Side Navigation Utilities */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? (
                // Moon icon for dark mode
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                // Sun icon for light mode
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9H21m-9-9V3m-6.364 2.364l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-2 lg:gap-4 text-base font-bold">
                <li>
                  <button onClick={() => { navigate("/", { state: { service: 'flight' } }); closeMobileMenu(); }} className={getDesktopNavLinkStyle({ isActive: false })}> Flights </button>
                </li>
                <li>
                  <button onClick={() => { navigate("/", { state: { service: 'bus' } }); closeMobileMenu(); }} className={getDesktopNavLinkStyle({ isActive: false })}> Buses </button>
                </li>
              </ul>
            </nav>

            <span aria-hidden="true" className="hidden h-6 w-px rounded-full bg-slate-200 md:block dark:bg-slate-700" />

            {isAuthenticated && (
              <Link className="flex items-center gap-3 shrink-0 group" to="/profile" onClick={closeMobileMenu}>
                <span className="sr-only">Profile</span>
                {user?.profileImage ? (
                  <img
                    alt="Profile avatar"
                    src={user.profileImage}
                    className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:border-lime-500 transition-colors"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-lime-600 to-lime-500 text-xs font-bold text-lime-950 border border-slate-200 dark:border-slate-700 group-hover:border-lime-500 transition-colors">
                    {(user?.name || user?.userName || "TR").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                )}
              </Link>
            )}

            {!isAuthenticated ? (
              <Link to="/login" onClick={closeMobileMenu} className="hidden sm:block text-base font-extrabold rounded-xl bg-lime-500 px-5 py-2.5 text-white shadow-sm hover:bg-lime-600 transition">
                Login
              </Link>
            ) : (
              <button className="hidden sm:block text-base font-extrabold rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-red-600 hover:bg-red-100 transition" onClick={handleLogout}>
                Logout
              </button>
            )}

            <button
              className="md:hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Dropdown Drawer Menu Layout */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ease-in-out bg-white dark:bg-slate-900 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation drawer"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
            <span className="text-2xl font-black tracking-wider text-slate-800 dark:text-slate-200">PAYANAM</span>
            <button onClick={closeMobileMenu} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6" aria-label="Mobile menu tracking options">
            <form onSubmit={handlePnrSearch} className="relative block w-full">
              <input
                className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 px-4 pe-12 text-base font-semibold"
                type="text"
                placeholder="Lookup Ticket PNR..."
                value={pnrQuery}
                onChange={(e) => setPnrQuery(e.target.value)}
              />
              <button type="submit" className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            <ul className="space-y-2 text-lg">
              <li><button onClick={() => { navigate("/", { state: { service: 'flight' } }); closeMobileMenu(); }} className={getMobileNavLinkStyle({ isActive: false })}> Flights </button></li>
              <li><button onClick={() => { navigate("/", { state: { service: 'bus' } }); closeMobileMenu(); }} className={getMobileNavLinkStyle({ isActive: false })}> Buses </button></li>
            </ul>

            {/* Theme Toggle in Mobile Menu */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold"
              >
                {theme === "light" ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Dark Mode
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9H21m-9-9V3m-6.364 2.364l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Light Mode
                  </>
                )}
              </button>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              {!isAuthenticated ? (
                <Link to="/login" className="block w-full rounded-xl bg-lime-500 py-3.5 font-bold text-white text-center text-base shadow-md shadow-lime-500/10" onClick={closeMobileMenu}>
                  Login
                </Link>
              ) : (
                <button className="block w-full rounded-xl bg-red-100 py-3.5 font-bold text-red-700 text-base hover:bg-red-200" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden backdrop:blur-xs" onClick={closeMobileMenu} aria-hidden="true" />
      )}
    </>
  );
}