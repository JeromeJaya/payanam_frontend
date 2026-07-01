import React, { useState, useEffect, useRef, useCallback } from "react";
import {useNavigate} from "react-router-dom";
import Scene3D from "./components/3d/Scene3D";
import { Plane, Bus, Building, Train, Shield, Zap, Clock, Globe, Star, MapPin, Heart, Users, Award, Smartphone, Headphones } from "lucide-react";
import { useAuth } from "./context/AuthContext";

// Performance optimized scroll-reveal hook
function useScrollReveal(thresholdValue = 0.1) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: thresholdValue, rootMargin: "0px 0px -40px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [thresholdValue]);

  return [ref, isRevealed];
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("flight");
  const [vendorModal, setVendorModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  
  // Check if user is a vendor
  const isVendor = user?.role === "vendor"

  // Monitor continuous scroll positioning for smooth parallax translation elements
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track mouse position for 3D interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    setIsClient(true);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate scroll progress for 3D scene
  const scrollProgress = scrollY;

  // Structural view reveal handles
  const [heroHeaderRef, heroHeaderRevealed] = useScrollReveal(0.05);
  const [introTextRef, introTextRevealed] = useScrollReveal(0.1);
  const [matrixRef, matrixRevealed] = useScrollReveal(0.1);
  const [perksGridRef, perksGridRevealed] = useScrollReveal(0.15);
  const [pipelineRef, pipelineRevealed] = useScrollReveal(0.1);
  const [metricsRef, metricsRevealed] = useScrollReveal(0.15);
  const [whyChooseRef, whyChooseRevealed] = useScrollReveal(0.1);
  const [destinationsRef, destinationsRevealed] = useScrollReveal(0.1);
  const [testimonialsRef, testimonialsRevealed] = useScrollReveal(0.1);

  const servicesConfig = {
    flight: {
      title: "Domestic & International Flight Booking",
      tagline: "Compare and lock real-time pricing across 500+ global air carriers.",
      usp: ["Real-time Fare Lock Guarantee", "Instant automated seat upgrades", "Zero-convenience fee windows", "Multi-routing tier split pricing"],
      metrics: { primary: "500+", label: "Airlines Integrated" },
      color: "from-lime-600 to-emerald-500",
      accent: "text-lime-600",
      bgGradient: "from-lime-500/5 to-emerald-500/5"
    },
    bus: {
      title: "Intercity Smart Bus Network",
      tagline: "Reserve verified fleet seats with onboard live tracking & predictive ETA.",
      usp: ["Live vehicle GPS coordinates tracking", "Premium multi-axle sleeper options", "Gender-segregated row configuration", "Predictive dynamic arrival alerts"],
      metrics: { primary: "25K+", label: "Routes Active Daily" },
      color: "from-lime-600 to-lime-700",
      accent: "text-lime-600",
      bgGradient: "from-lime-600/5 to-lime-700/5"
    },
    hotel: {
      title: "Curated Luxury Stay Accommodations",
      tagline: "Direct connection infrastructure ensuring the lowest prices with zero middleman markup.",
      usp: ["100% direct property sourcing model", "Flexible check-in/check-out options", "Complimentary hyper-local meals", "Instant tier loyalty credit updates"],
      metrics: { primary: "1.2M+", label: "Rooms Monitored" },
      color: "from-lime-600 to-yellow-500",
      accent: "text-lime-600",
      bgGradient: "from-lime-500/5 to-yellow-500/5"
    },
    train: {
      title: "Authorized Rail Ticketing Pipeline",
      tagline: "Direct server-to-server reservation links for maximum success rates.",
      usp: ["CNF predictive seat forecasting algorithm", "One-tap instant cancellation refund processing", "Alternative route auto-discovery system", "High-priority quota sync access"],
      metrics: { primary: "99.4%", label: "Platform API Success Rate" },
      color: "from-lime-600 to-teal-500",
      accent: "text-lime-600",
      bgGradient: "from-lime-500/5 to-teal-500/5"
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans selection:bg-lime-500 selection:text-white antialiased overflow-x-hidden relative">
      
      {/* 3D Background Scene */}
      {isClient && <Scene3D scrollProgress={scrollProgress} mousePosition={mousePosition} />}
      
      {/* 1. STICKY INTERACTIVE NAVIGATION */}
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
              // Vendor is logged in - show Vendor Dashboard
              <button 
                onClick={() => navigate("/vendor-dashboard")}
                className="text-sm font-bold text-slate-700 hover:text-lime-600 border border-slate-200 hover:border-lime-200 bg-white hover:bg-lime-50/30 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm focus:ring-4 focus:ring-slate-100"
              >
                Vendor Dashboard
              </button>
            ) : isAuthenticated ? (
              // Regular user is logged in - show Switch to Vendor
              <button 
                onClick={() => navigate("/vendor-dashboard")}
                className="text-sm font-bold text-lime-600 hover:text-lime-700 border border-lime-200 hover:border-lime-300 bg-lime-50 hover:bg-lime-100 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm focus:ring-4 focus:ring-lime-500/20"
              >
                Switch to Vendor
              </button>
            ) : (
              // No user logged in - show Login as Vendor
              <button 
                onClick={() => navigate("/vendor-dashboard")}
                className="text-sm font-bold text-lime-600 hover:text-lime-700 border border-lime-200 hover:border-lime-300 bg-lime-50 hover:bg-lime-100 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm focus:ring-4 focus:ring-lime-500/20"
              >
                Login as Vendor
              </button>
            )}
            {!isAuthenticated && (
              <button className="hidden sm:inline-flex text-sm font-bold text-white bg-lime-600 hover:bg-lime-700 px-5 py-2.5 rounded-xl transition-colors shadow-md focus:ring-4 focus:ring-lime-500/20"
              onClick = {()=>navigate("/login")}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="w-full relative z-10">
        
        {/* 2. PARALLAX HERO VIEW WITH DYNAMIC GRADIENT DRIFT & 3D ELEMENTS */}
        <section 
          ref={heroHeaderRef}
          className="relative w-full overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-40 bg-gradient-to-b from-white/90 to-slate-50/90 backdrop-blur-sm border-b border-slate-200/40"
        >
          {/* Enhanced Ambient Parallax Background Blobs */}
          <div 
            className="absolute top-12 left-1/2 w-[600px] h-[600px] bg-lime-400/10 blur-[120px] rounded-full pointer-events-none transition-transform duration-100 ease-out"
            style={{ transform: `translate3d(${-50 + scrollY * 0.15}px, ${scrollY * 0.05}px, 0)` }}
          ></div>

          <div 
            className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-400/8 blur-[100px] rounded-full pointer-events-none transition-transform duration-150 ease-out"
            style={{ transform: `translate3d(${scrollY * 0.1}px, ${-scrollY * 0.08}px, 0)` }}
          ></div>

          <div className="w-full px-6 sm:px-12 lg:px-20 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              <div 
                className={`space-y-6 sm:space-y-8 lg:col-span-7 text-center lg:text-left transition-all duration-1000 ease-out transform ${
                  heroHeaderRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                <div className="inline-flex items-center gap-2 bg-lime-50 text-lime-700 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full border border-lime-100 tracking-wide uppercase scale-100 hover:scale-105 transition-transform">
                  ⚡ Comprehensive Transit Node Engine
                </div>
                <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 leading-[1.05]">
                  Unified Infrastructure for Transit & Lodging
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl">
                  Consolidate, provision, and track your travel routing configurations natively. Eliminate fragmented systems with high-speed direct carrier protocols.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                  <a href="#services-matrix" className="bg-gradient-to-r from-lime-600 to-lime-500 text-white font-black text-base px-10 py-4 rounded-xl shadow-xl shadow-lime-600/20 hover:shadow-lime-600/30 transition-all duration-300 text-center hover:-translate-y-1">
                    Launch Interactive Console
                  </a>
                  <button onClick={() => setVendorModal(true)} className="bg-white text-slate-800 font-bold text-base px-10 py-4 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all text-center">
                    Onboard Partner Vendor
                  </button>
                </div>
              </div>

              {/* Reactive Floating Mock Window (Moves on Page Scroll with 3D parallax) */}
              <div 
                className="mt-12 lg:mt-0 lg:col-span-5 w-full transition-transform duration-300 ease-out"
                style={{ 
                  transform: `translate3d(${mousePosition.x * -10}px, ${scrollY * -0.05 + mousePosition.y * -10}px, 0)`,
                  perspective: '1000px'
                }}
              >
                <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-950/95 p-6 sm:p-8 rounded-3xl shadow-2xl relative border border-slate-700/50 w-full backdrop-blur-xl"
                     style={{ transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg)` }}>
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-4 mb-6">
                    <div className="flex gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 block animate-pulse"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
                      <span className="w-3 h-3 rounded-full bg-lime-500 block"></span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-md">
                      viasmart_core_v4.sys
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="bg-slate-800/40 border border-slate-700/30 p-5 rounded-xl">
                      <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                        <span>active_service_worker</span>
                        <span className="text-lime-400 font-bold tracking-widest text-[10px]">ACTIVE INJECT</span>
                      </div>
                      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-lime-500 to-emerald-400 rounded-full transition-all duration-[1800ms] delay-300 ease-out ${heroHeaderRevealed ? "w-11/12" : "w-0"}`}></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/40 border border-slate-700/30 p-5 rounded-xl">
                        <span className="block text-2xl font-bold font-mono text-white">2.04ms</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide font-extrabold mt-1 block">Latency Cap</span>
                      </div>
                      <div className="bg-slate-800/40 border border-slate-700/30 p-5 rounded-xl">
                        <span className="block text-2xl font-bold font-mono text-lime-400">99.99%</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide font-extrabold mt-1 block">API Success rate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. INFINITE TEXT TICKER OVERLAY MARQUEE */}
        <div className="w-full bg-slate-900/95 text-white/40 py-4 overflow-hidden select-none border-y border-slate-800 backdrop-blur-sm relative z-10">
          <div className="flex whitespace-nowrap gap-20 text-xs font-mono font-bold tracking-widest uppercase tracking-normal">
            <div className="inline-flex gap-20 shrink-0 animate-marquee py-1">
              <span>• FLIGHT NODE: OPEN ACCESS</span>
              <span>• BUS PROTOCOL: VERIFIED 25K ROUTES</span>
              <span>• HOTEL CONTRACTS: MIDDLEMAN EXCLUSION MODEL</span>
              <span>• TRAIN IRCTC GATEWAY: OPERATIONAL 99.4% UPTIME</span>
              <span>• GLOBAL LOGISTICS MATRIX ONLINE</span>
            </div>
          </div>
        </div>

        {/* 4. INTERACTIVE SERVICE CONSOLE WITH DYNAMIC SMOOTH TRANSITION SCALING */}
        <section 
          id="services-matrix" 
          ref={matrixRef}
          className={`py-28 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 scroll-mt-20 w-full transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) relative z-10 ${
            matrixRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
        >
          <div className="w-full px-6 sm:px-12 lg:px-20">
            <div className="text-center lg:text-left mb-16 space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                Granular Engine Specification Logs
              </h2>
              <p className="text-slate-600 text-lg sm:text-xl max-w-3xl">
                Select a structural system module to inspect active API pipelines, data caching policies, and latency thresholds.
              </p>
            </div>

            {/* Segment Controller Selectors */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-12">
              {Object.keys(servicesConfig).map((key) => {
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center justify-center gap-3 py-5 px-8 rounded-2xl font-extrabold text-lg transition-all duration-300 relative uppercase tracking-wider overflow-hidden border ${
                      isActive
                        ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02] z-10"
                        : "bg-white/50 hover:bg-slate-100 text-slate-600 border-slate-200/80 hover:text-slate-900 backdrop-blur-sm"
                    }`}
                  >
                    <span>{key}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400 to-lime-300 animate-fade-in"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Panel Card Layout containing specific micro-triggers */}
            <div className="w-full">
              <div className={`rounded-3xl border border-slate-200 bg-gradient-to-br ${servicesConfig[activeTab].bgGradient} p-8 sm:p-16 shadow-inner w-full transition-all duration-500 transition-opacity backdrop-blur-sm bg-white/50`}>
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  <div className="lg:col-span-8 space-y-6">
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight transition-all duration-300">
                      {servicesConfig[activeTab].title}
                    </h3>
                    <p className="text-slate-600 text-lg sm:text-xl font-medium leading-relaxed">
                      {servicesConfig[activeTab].tagline}
                    </p>
                    
                    {/* Interactive Bullet points reveal layout */}
                    <div ref={perksGridRef} className="space-y-4 pt-4">
                      <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 block">Core Pipeline Threshold benefits:</span>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {servicesConfig[activeTab].usp.map((perk, i) => (
                          <div 
                            key={i} 
                            className={`flex items-start gap-3 text-slate-700 text-base font-bold transition-all duration-700 transform ${
                              perksGridRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                            }`}
                            style={{ transitionDelay: `${i * 100}ms` }}
                          >
                            <span className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-lime-600 shrink-0 mt-0.5 shadow-sm">
                              ✓
                            </span>
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-white/80 border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm h-full min-h-[260px] transition-transform duration-500 hover:rotate-1 backdrop-blur-sm">
                    <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2">
                      {servicesConfig[activeTab].metrics.label}
                    </span>
                    <span className={`text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-r ${servicesConfig[activeTab].color} bg-clip-text text-transparent font-mono`}>
                      {servicesConfig[activeTab].metrics.primary}
                    </span>
                    <hr className="w-full my-6 border-slate-100" />
                    <button className="w-full bg-slate-900 hover:bg-lime-600 hover:text-white text-white text-sm font-black py-4 px-6 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-sm">
                      Initialize Routing Node
                    </button>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. CASCADING STEPPER TIMELINE FLOW WITH INTERSECTION DELAY HOOKS */}
        <section 
          id="platform-deepdive" 
          ref={pipelineRef}
          className="py-28 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/40 w-full scroll-mt-20 relative z-10"
        >
          <div className="w-full px-6 sm:px-12 lg:px-20">
            <div className={`text-center lg:text-left mb-20 space-y-3 transition-all duration-[1000ms] ${pipelineRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                End-to-End Pipeline Infrastructure
              </h2>
              <p className="text-slate-600 text-lg sm:text-xl max-w-3xl">
                Trace how consumer inventory inquiries translate directly into atomic confirmation blocks across our vendor networks.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative w-full">
              {/* Dynamic Line reveal overlay */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-6 z-0 overflow-hidden">
                <div className={`h-full bg-lime-500 transition-all duration-[2000ms] ease-in-out ${pipelineRevealed ? "w-full" : "w-0"}`}></div>
              </div>
              
              {[
                { step: "01", title: "API Request Query Payload", desc: "User triggers query parameters. System sanitizes memory registers and initiates high-speed geolocation lookups across server memory arrays." },
                { step: "02", title: "Vendor Virtualization Node", desc: "Queries hit supplier nodes asynchronously. Distributed computing architecture isolates inventory locks under 5ms." },
                { step: "03", title: "Atomic Confirmation Ledger", desc: "Data payload compiles natively into merchant instances, emitting an immutable cryptographically signed reservation ticket." }
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 sm:p-10 relative z-10 shadow-sm group hover:border-lime-500 hover:shadow-xl transition-all duration-500 transform ${
                    pipelineRevealed ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"
                  }`}
                  style={{ transitionDelay: `${idx * 200}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white font-mono text-xl font-bold flex items-center justify-center mb-8 border border-slate-700/20 group-hover:from-lime-600 group-hover:to-lime-500 transition-all duration-300 shadow-sm">
                    {card.step}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-lime-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. ECOSYSTEM STATS SECTION WITH DYNAMIC LOAD ACCENT STAGGER */}
        <section 
          id="analytical-stats" 
          ref={metricsRef}
          className="py-28 bg-slate-900/95 backdrop-blur-md text-white w-full relative overflow-hidden z-10"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-lime-900/20 via-transparent to-emerald-900/20"></div>
          
          <div className="w-full px-6 sm:px-12 lg:px-20 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {[
                { val: "Rs. 1.4B+", label: "Gross Volume Logged" },
                { val: "18.4M", label: "Invocations / Hour" },
                { val: "12,450", label: "Active Micro-Vendors" },
                { val: "< 14ms", label: "Query Resolution" }
              ].map((stat, i) => {
                const revealClass = metricsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";
                const delayStyle = { transitionDelay: `${i * 120}ms` };
                const fillWidth = metricsRevealed ? "w-full" : "w-0";
                
                return (
                  <div 
                    key={i} 
                    className={`transition-all duration-1000 transform ${revealClass}`}
                    style={delayStyle}
                  >
                    <span className="block text-4xl sm:text-6xl font-black font-mono tracking-tight bg-gradient-to-r from-lime-400 to-lime-200 bg-clip-text text-transparent">
                      {stat.val}
                    </span>
                    <div className="w-12 h-1 bg-lime-500/20 mx-auto my-3 rounded-full overflow-hidden">
                      <div className={`h-full bg-lime-400 transition-all duration-1000 delay-500 ${fillWidth}`}></div>
                    </div>
                    <span className="block text-xs uppercase font-extrabold text-slate-400 tracking-widest">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. WHY CHOOSE US - ANIMATED FEATURE CARDS */}
        <section 
          ref={whyChooseRef}
          className="py-28 bg-white/80 backdrop-blur-sm relative z-10"
        >
          <div className="w-full px-6 sm:px-12 lg:px-20">
            <div className={`text-center mb-16 space-y-3 transition-all duration-1000 ${whyChooseRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                Why Travelers Trust ViaSmart
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Experience seamless travel booking with industry-leading features designed for modern travelers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "Secure Payments", desc: "Bank-grade encryption for all transactions with PCI DSS compliance.", color: "lime" },
                { icon: Zap, title: "Instant Booking", desc: "Real-time confirmation with e-tickets delivered in under 30 seconds.", color: "emerald" },
                { icon: Clock, title: "24/7 Support", desc: "Round-the-clock customer assistance via chat, call, and email.", color: "green" },
                { icon: Globe, title: "Global Coverage", desc: "Access to 500+ airlines and 1.2M+ hotels across 190 countries.", color: "teal" },
                { icon: Award, title: "Best Price Guarantee", desc: "Find a lower price elsewhere and we'll match it instantly.", color: "lime" },
                { icon: Smartphone, title: "Mobile First", desc: "Dedicated apps for iOS and Android with exclusive mobile deals.", color: "emerald" },
                { icon: Headphones, title: "Personalized Service", desc: "AI-powered recommendations based on your travel preferences.", color: "green" },
                { icon: Heart, title: "Flexible Policies", desc: "Free cancellations and easy rescheduling on most bookings.", color: "teal" },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                const colorClasses = {
                  lime: "from-lime-500 to-lime-600",
                  emerald: "from-emerald-500 to-emerald-600",
                  green: "from-green-500 to-green-600",
                  teal: "from-teal-500 to-teal-600",
                };
                
                return (
                  <div
                    key={idx}
                    className={`group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                      whyChooseRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[feature.color]} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[feature.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8. POPULAR DESTINATIONS - SCROLL ANIMATED CARDS */}
        <section 
          ref={destinationsRef}
          className="py-28 bg-slate-50/80 backdrop-blur-sm relative z-10"
        >
          <div className="w-full px-6 sm:px-12 lg:px-20">
            <div className={`text-center mb-16 space-y-3 transition-all duration-1000 ${destinationsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                Popular Destinations
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Discover trending travel destinations booked by millions of travelers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { city: "Goa", country: "India", image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop", price: "₹4,999", rating: 4.8 },
                { city: "Manali", country: "India", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", price: "₹7,499", rating: 4.7 },
                { city: "Kerala", country: "India", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop", price: "₹12,999", rating: 4.9 },
                { city: "Jaipur", country: "India", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop", price: "₹6,499", rating: 4.6 },
                { city: "Singapore", country: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop", price: "₹24,999", rating: 4.9 },
                { city: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop", price: "₹29,999", rating: 4.8 },
              ].map((dest, idx) => (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-700 transform hover:scale-[1.02] ${
                    destinationsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className="absolute inset-0">
                    <img 
                      src={dest.image} 
                      alt={dest.city}
                      className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/800x600/84cc16/ffffff?text=${dest.city}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-lime-400" />
                      <span className="text-sm text-lime-300">{dest.country}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{dest.city}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-300">Starting from</span>
                        <p className="text-xl font-bold text-lime-400">{dest.price}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold">{dest.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-lime-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Book Now
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. TESTIMONIALS - ANIMATED CARDS */}
        <section 
          ref={testimonialsRef}
          className="py-28 bg-white relative z-10"
        >
          <div className="w-full px-6 sm:px-12 lg:px-20">
            <div className={`text-center mb-16 space-y-3 transition-all duration-1000 ${testimonialsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                What Our Customers Say
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Join millions of satisfied travelers who trust ViaSmart for their journeys.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Priya Sharma", role: "Frequent Traveler", content: "ViaSmart has completely transformed how I book my travels. The instant confirmation and real-time tracking features are absolutely game-changing!", rating: 5, avatar: "PS" },
                { name: "Rahul Mehta", role: "Business Traveler", content: "As someone who travels weekly for work, I appreciate the seamless experience. The API integrations work flawlessly and customer support is top-notch.", rating: 5, avatar: "RM" },
                { name: "Ananya Reddy", role: "Family Traveler", content: "Booking family vacations has never been easier. The flexible cancellation policy and best price guarantee give us peace of mind.", rating: 5, avatar: "AR" },
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className={`group bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                    testimonialsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${idx * 200}ms` }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 10. REVENUE LAYER FOOTER */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 py-16 text-center text-xs text-slate-500 font-medium w-full relative z-10">
        <div className="w-full px-6 sm:px-12 space-y-4">
          <p className="text-sm font-semibold text-slate-600">© 2026 ViaSmart Logistics Core Infrastructure Network (NCT). All rights reserved.</p>
        </div>
      </footer>

      {/* 8. MERCHANT VENDOR AUTH CONTROL LAYER MODAL */}
      {vendorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity" role="dialog" aria-modal="true">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200/80 p-8 shadow-2xl relative transition-transform animate-zoom-in">
            <button 
              onClick={() => setVendorModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors font-bold text-sm bg-white"
            >
              ✕
            </button>

            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Merchant Gateway Node</h2>
              <p className="text-slate-500 text-sm font-medium">Provide encrypted merchant tokens to access inventory distribution analytics.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="vendor-id">Registered Merchant ID</label>
                <input 
                  type="text" 
                  id="vendor-id" 
                  placeholder="MID-000000000" 
                  className="w-full border border-slate-200 rounded-xl p-3 font-mono font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="vendor-key">Secure Authorization Key</label>
                <input 
                  type="password" 
                  id="vendor-key" 
                  placeholder="••••••••••••••••••••" 
                  className="w-full border border-slate-200 rounded-xl p-3 font-mono font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all text-sm"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-lime-600 focus:ring-lime-500/20 w-4 h-4 border-slate-300" />
                  Keep Session Alive
                </label>
                <a href="#" className="text-lime-600 hover:underline">Revoke Access Key</a>
              </div>

              <button 
                type="submit"
                className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider text-sm transition-colors shadow-md"
              >
                Establish Secure Connection
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500 font-medium">New supplier? </span>
              <a href="#" className="text-xs text-lime-600 font-bold hover:underline">Apply for Node Provisioning</a>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}