import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import api from "./api/axios";

export default function Nav() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // New Functional States for PNR Searching
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

  // Handlers for PNR Lookup Actions
  const handlePnrSearch = async (e) => {
    e.preventDefault();
    const cleanPnr = pnrQuery.trim();
    if (!cleanPnr) return;

    setIsSearching(true);
    try {
      const res = await api.get(`/api/v1/bookings/${cleanPnr}`);
      
      if (res.data?.success || res.data) {
        const bookingData = res.data.data || res.data;
        
        // Structure the response to match the target context layer of TicketDetails
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

  return (
    <>
      {/* Increased height to h-20 for better breathing room with larger text balances */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left Side Branding & Aligned Search Input */}
          <div className="flex items-center gap-8 flex-1 max-w-2xl">
            <Link className="flex shrink-0 items-center gap-1 text-teal-600 dark:text-teal-500" to="/" onClick={closeMobileMenu}>
              {/* Brand logo scaled up to text-2xl */}
              <span className="text-2xl font-black tracking-widest text-slate-800 dark:text-slate-200">PAYANAM</span>
            </Link>

            {/* Fixed Vector Aligned Form Layer Container */}
            <form onSubmit={handlePnrSearch} className="relative hidden lg:block w-full max-w-md my-auto">
              <label className="sr-only" htmlFor="search">Search Bookings by PNR</label>
              <input
                className="h-11 w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 ps-5 pe-12 text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all shadow-3xs"
                id="search"
                type="text"
                disabled={isSearching}
                placeholder={isSearching ? "Verifying PNR Token..." : "Verify PNR (e.g., PAY-A3F2B1)..."}
                value={pnrQuery}
                onChange={(e) => setPnrQuery(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={isSearching}
                className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-40"
              >
                {isSearching ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </form>
          </div>

          {/* Right Side Navigation Utilities */}
          <div className="flex items-center justify-end gap-6 shrink-0">
            <nav aria-label="Global" className="hidden md:block">
              {/* Changed list hierarchy text to text-base */}
              <ul className="flex items-center gap-2 lg:gap-4 text-base font-bold">
                <li>
                  <Link className="rounded-xl bg-lime-100/70 px-4 py-2.5 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300 hover:bg-lime-200/80 transition" to="/" onClick={closeMobileMenu}> Flights </Link>
                </li>
                <li>
                  <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2.5 transition" to="/" onClick={closeMobileMenu}> Hotels </Link>
                </li>
                <li>
                  <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2.5 transition" to="/" onClick={closeMobileMenu}> Trains </Link>
                </li>
                <li>
                  <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2.5 transition" to="/" onClick={closeMobileMenu}> Buses </Link>
                </li>
                <li>
                  <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2.5 transition" to="/" onClick={closeMobileMenu}> Holiday </Link>
                </li>
              </ul>
            </nav>

            <span aria-hidden="true" className="hidden h-6 w-px rounded-full bg-slate-200 md:block dark:bg-slate-700" />

            <Link className="flex items-center gap-3 shrink-0 group" to="/profile" onClick={closeMobileMenu}>
              <span className="sr-only">Profile</span>
              <img alt="Profile avatar" src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&q=80" className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:border-lime-500 transition-colors" />
              {/* Profile Account label shifted to text-base */}
              <span className="hidden sm:inline text-base font-extrabold text-slate-700 dark:text-slate-200 max-w-[130px] truncate group-hover:text-slate-900">
                {user?.name || user?.userName || "My Account"}
              </span>
            </Link>

            {/* CTA action buttons updated to text-base */}
            {!isAuthenticated ? (
              <Link to="/login" onClick={closeMobileMenu} className="hidden sm:block text-base font-extrabold rounded-xl bg-lime-500 px-5 py-2.5 text-white shadow-sm hover:bg-lime-600 transition">
                Login
              </Link>
            ) : (
              <button className="hidden sm:block text-base font-extrabold rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-red-600 hover:bg-red-100 transition" onClick={handleLogout}>
                Logout
              </button>
            )}

            {/* Mobile Hamburger toggle link button */}
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

      {/* Mobile Dropdown Overlay Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out bg-white dark:bg-slate-900 ${
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

            {/* Mobile links shifted up to a clear text-lg format */}
            <ul className="space-y-2 text-lg font-bold text-slate-700 dark:text-slate-300">
              <li><Link to="/" className="block rounded-xl bg-lime-50 dark:bg-lime-950/30 text-lime-700 px-4 py-3.5" onClick={closeMobileMenu}> Flights </Link></li>
              <li><Link to="/" className="block rounded-xl px-4 py-3.5 hover:bg-slate-50" onClick={closeMobileMenu}> Hotels </Link></li>
              <li><Link to="/" className="block rounded-xl px-4 py-3.5 hover:bg-slate-50" onClick={closeMobileMenu}> Trains </Link></li>
              <li><Link to="/" className="block rounded-xl px-4 py-3.5 hover:bg-slate-50" onClick={closeMobileMenu}> Buses </Link></li>
              <li><Link to="/" className="block rounded-xl px-4 py-3.5 hover:bg-slate-50" onClick={closeMobileMenu}> Holiday </Link></li>
            </ul>

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

      {/* Background Dimming Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden backdrop-blur-xs" onClick={closeMobileMenu} aria-hidden="true" />
      )}
    </>
  );
}