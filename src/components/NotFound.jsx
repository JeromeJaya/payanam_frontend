import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, LogIn, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-lime-950 flex items-center justify-center px-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-lime-400/10 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-[500px] h-[500px] rounded-full border border-lime-500/10 transition-all duration-[2000ms] ${
            mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
        <div
          className={`absolute w-[350px] h-[350px] rounded-full border border-lime-400/15 transition-all duration-[1800ms] delay-200 ${
            mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
        <div
          className={`absolute w-[200px] h-[200px] rounded-full border border-lime-300/20 transition-all duration-[1500ms] delay-400 ${
            mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
      </div>

      {/* Main content */}
      <div
        className={`relative z-10 text-center transition-all duration-700 delay-300 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Animated 404 number */}
        <div className="relative mb-6">
          <h1
            className={`text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter transition-all duration-1000 ${
              mounted ? "scale-100 opacity-100" : "scale-150 opacity-0"
            }`}
            style={{
              background: "linear-gradient(135deg, #84cc16 0%, #22d3ee 50%, #84cc16 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 4s ease infinite",
            }}
          >
            404
          </h1>
          {/* Glow effect behind the number */}
          <div
            className="absolute inset-0 text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-lime-400 blur-3xl opacity-20 -z-10"
            aria-hidden="true"
          >
            404
          </div>
        </div>

        {/* Message */}
        <div
          className={`space-y-3 mb-10 transition-all duration-700 delay-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Looks like you're lost, traveler!
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto">
            This page doesn't exist — but your next journey does.
          </p>
        </div>

        {/* Action buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <button
            onClick={() => navigate("/MainPage")}
            className="group relative flex items-center gap-2.5 rounded-xl bg-lime-500 px-7 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-lime-500/25 hover:bg-lime-400 hover:shadow-lime-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Home size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Go to Homepage
          </button>

          <button
            onClick={() => navigate("/login")}
            className="group flex items-center gap-2.5 rounded-xl border-2 border-slate-700 bg-slate-800/60 backdrop-blur px-7 py-3.5 text-base font-bold text-slate-200 hover:border-lime-500/50 hover:text-lime-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <LogIn size={18} className="group-hover:translate-x-0.5 transition-transform" />
            Login
          </button>

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2.5 rounded-xl border-2 border-slate-700 bg-slate-800/60 backdrop-blur px-7 py-3.5 text-base font-bold text-slate-200 hover:border-sky-500/50 hover:text-sky-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>
      </div>

      {/* Inline keyframes for gradient animation */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
