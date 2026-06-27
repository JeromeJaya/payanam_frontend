import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import api from "./api/axios";

export default function Nav() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await api.post("/api/auth/logout");
      if (response.status === 200) {
        console.log("Logout successful");
      }
    } catch (err) {
      console.warn("Logout API failed:", err);
      // Continue with logout even if API fails
    } finally {
      // Clear all auth data
      logout();
      // Clear any cached auth data
      try {
        localStorage.removeItem("payanam_user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } catch (e) {
        // ignore storage errors
      }
      // Redirect to login
      navigate("/login");
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center justify-start gap-4">
            <Link className="flex gap-1 text-teal-600 dark:text-teal-500" to="/" onClick={closeMobileMenu}>
              <span className="text-xl font-medium tracking-wider text-slate-700 dark:text-slate-200">PAYANAM</span>
            </Link>

            <div className="relative hidden sm:block flex-1 max-w-md">
              <label className="sr-only" htmlFor="search"> Search </label>
              <input
                className="h-10 w-full rounded-full border-none bg-slate-100 ps-4 pe-10 text-sm shadow-sm sm:w-64 dark:bg-slate-800 dark:text-white"
                id="search"
                type="search"
                placeholder="Search..."
              />
              <button type="button" className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                <span className="sr-only">Search</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-1 sm:gap-3 text-sm sm:text-base">
                <li>
                  <Link className="rounded-md bg-lime-100 px-3 py-2 font-medium text-lime-700 dark:bg-lime-900/50 dark:text-lime-300 hover:bg-lime-200 dark:hover:bg-lime-900" to="/" onClick={closeMobileMenu}> Flights </Link>
                </li>
                <li>
                  <Link className="text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2" to="/" onClick={closeMobileMenu}> Hotels </Link>
                </li>
                <li>
                  <Link className="text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2" to="/" onClick={closeMobileMenu}> Trains </Link>
                </li>
                <li>
                  <Link className="text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2" to="/" onClick={closeMobileMenu}> Buses </Link>
                </li>
                <li>
                  <Link className="text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2" to="/" onClick={closeMobileMenu}> Holiday </Link>
                </li>
              </ul>
            </nav>

            <span aria-hidden="true" className="hidden h-6 w-px rounded-full bg-slate-200 md:block dark:bg-slate-700" />

            <Link className="block shrink-0" to="/profile" onClick={closeMobileMenu}>
              <span className="sr-only">Profile</span>
              <img alt="Profile" src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" className="h-9 w-9 rounded-full object-cover" />
            </Link>

            {!isAuthenticated ? (
              <Link to="/login" onClick={closeMobileMenu} className="hidden sm:block rounded-lg bg-lime-100 px-4 py-2 font-medium text-lime-700 dark:bg-lime-900/50 dark:text-lime-300 hover:bg-lime-200 dark:hover:bg-lime-900">
                Login
              </Link>
            ) : (
              <button className="hidden sm:block rounded-lg bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-500 hover:text-white" onClick={handleLogout}>
                Logout
              </button>
            )}

            <button
              className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out bg-white dark:bg-slate-900 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
            <span className="text-xl font-medium text-teal-600 dark:text-teal-500">PAYANAM</span>
            <button
              onClick={closeMobileMenu}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-4" aria-label="Mobile navigation">
            <ul className="space-y-1">
              <li>
                <Link to="/" className="block rounded-lg bg-lime-100 px-4 py-3 font-medium text-lime-700 dark:bg-lime-900/50 dark:text-lime-300" onClick={closeMobileMenu}> Flights </Link>
              </li>
              <li>
                <Link to="/" className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" onClick={closeMobileMenu}> Hotels </Link>
              </li>
              <li>
                <Link to="/" className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" onClick={closeMobileMenu}> Trains </Link>
              </li>
              <li>
                <Link to="/" className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" onClick={closeMobileMenu}> Buses </Link>
              </li>
              <li>
                <Link to="/" className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" onClick={closeMobileMenu}> Holiday </Link>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              {!isAuthenticated ? (
                <Link to="/login" className="block w-full rounded-lg bg-lime-100 px-4 py-3 font-medium text-lime-700 text-center dark:bg-lime-900/50 dark:text-lime-300" onClick={closeMobileMenu}>
                  Login
                </Link>
              ) : (
                <button className="block w-full rounded-lg bg-red-100 px-4 py-3 font-medium text-red-700 hover:bg-red-500 hover:text-white" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={closeMobileMenu} aria-hidden="true" />
      )}
    </>
  );
}