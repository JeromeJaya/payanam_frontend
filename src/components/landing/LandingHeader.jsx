import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LandingHeader() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isVendor = user?.role === "vendor";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300">
      <div className="w-full px-6 sm:px-12 lg:px-20 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-lime-500/40 rounded-lg p-1">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-600 to-lime-500 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:rotate-6 transition-transform duration-300">
            V
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Pya<span className="text-lime-600">nam</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          <a href="#services-matrix" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Services</a>
          <a href="#platform-deepdive" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
          <a href="#analytical-stats" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Ecosystem Stats</a>
        </nav>

        <div className="flex items-center gap-4">
          {isVendor ? (
            <button
              onClick={() => navigate("/vendordashboard")}
              className="text-sm font-bold text-slate-700 hover:text-lime-600 border border-slate-200 hover:border-lime-200 bg-white hover:bg-lime-50/30 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm focus:ring-4 focus:ring-slate-100"
            >
              Vendor Dashboard
            </button>
          ) : isAuthenticated ? (
            <button
              onClick={() => navigate("/vendordashboard")}
              className="text-sm font-bold text-lime-600 hover:text-lime-700 border border-lime-200 hover:border-lime-300 bg-lime-50 hover:bg-lime-100 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm focus:ring-4 focus:ring-lime-500/20"
            >
              Switch to Vendor
            </button>
          ) : (
            <button
              onClick={() => navigate("/vendordashboard")}
              className="text-sm font-bold text-lime-600 hover:text-lime-700 border border-lime-200 hover:border-lime-300 bg-lime-50 hover:bg-lime-100 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm focus:ring-4 focus:ring-lime-500/20"
            >
              Login as Vendor
            </button>
          )}
          {!isAuthenticated && (
            <button
              className="hidden sm:inline-flex text-sm font-bold text-white bg-lime-600 hover:bg-lime-700 px-5 py-2.5 rounded-xl transition-colors shadow-md focus:ring-4 focus:ring-lime-500/20"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
