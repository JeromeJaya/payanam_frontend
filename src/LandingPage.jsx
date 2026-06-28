import { useState, useEffect, useRef } from "react";
import { SearchCard } from "./cards/SearchCard.jsx";
import { useNavigate } from "react-router-dom";

// ================= CUSTOM SCROLL REVEAL HOOK =================
function useScrollReveal() {
  const [hasRevealed, setHasRevealed] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const currentRef = elementRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  return [elementRef, hasRevealed];
}

// ================= REUSABLE WRAPPER COMPONENT =================
function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, hasRevealed] = useScrollReveal();

  const directionStyles = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transition-all duration-[800ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] ${
        hasRevealed 
          ? "opacity-100 translate-y-0 translate-x-0 filter blur-0" 
          : `opacity-0 filter blur-[2px] ${directionStyles[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ================= KINETIC GLYPH BRANDING LOGO =================
function KineticBranding() {
  const [text, setText] = useState("PAYANAM");
  const target = "PAYANAM";
  const glyphs = "X_/[*+$&█<>#";

  const triggerDecryptionAnimation = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setText((prev) =>
        target
          .split("")
          .map((char, index) => {
            if (index < iterations) return target[index];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("")
      );
      
      iterations += 1 / 3;
      if (iterations >= target.length) {
        clearInterval(interval);
        setText(target);
      }
    }, 30);
  };

  useEffect(() => {
    triggerDecryptionAnimation();
  }, []);

  return (
    <div 
      onMouseEnter={triggerDecryptionAnimation}
      className="group flex items-center font-mono tracking-[0.25em] text-xl font-black select-none cursor-pointer border border-lime-950/60 bg-black/40 rounded-xl px-5 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-lime-500/30 hover:shadow-[0_0_20px_rgba(163,230,53,0.1)]"
    >
      <span className="text-white">
        {text.slice(0, 4)}
      </span>
      <span className="text-lime-400 relative">
        {text.slice(4)}
        <span className="absolute -right-3 top-1 w-[3px] h-4 bg-lime-400 animate-pulse" />
      </span>
    </div>
  );
}

// ================= MAIN LANDING COMPONENT =================
export function LandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeSearchTab, setActiveSearchTab] = useState("flights");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const curatedDestinations = [
    { id: 1, title: "Kyoto, Japan", category: "Cultural", description: "Experience serene bamboo forests and ancient imperial shrines.", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", size: "md:col-span-2 md:row-span-2" },
    { id: 2, title: "Santorini, Greece", category: "Coastal", description: "Iconic blue-domed villas facing the Aegean Sea.", img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800", size: "md:col-span-1 md:row-span-1" },
    { id: 3, title: "Reykjavík, Iceland", category: "Adventure", description: "Chasing the Northern Lights across surreal volcanic fields.", img: "https://images.unsplash.com/photo-1504893524553-ac55fce698be?w=800", size: "md:col-span-1 md:row-span-2" },
    { id: 4, title: "Amalfi Coast, Italy", category: "Coastal", description: "Cliffside luxury hotels overlooking pristine crystal waters.", img: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800", size: "md:col-span-1 md:row-span-1" },
  ];

  const logisticsData = [
    { title: "01 / Unified Aggregation", desc: "Input your destination and our algorithms scan structural logistics networks instantly—cross-checking airliners against rail channels." },
    { title: "02 / Price Lock Verification", desc: "Bypass high-occupancy automated market price inflation. Our system freezes regular fare rates directly at clean wholesale cost signatures." },
    { title: "03 / Tokenized Safeguards", desc: "Receive instant digital receipts directly on your interface. If a route drops offline, automated re-routing systems handle the adjustments seamlessly." }
  ];

  const filteredDestinations = selectedCategory === "All" 
    ? curatedDestinations 
    : curatedDestinations.filter(item => item.category === selectedCategory);

  return (
    <main className="min-h-screen bg-[#050702] text-slate-100 font-sans antialiased selection:bg-lime-500/30 selection:text-lime-200 overflow-x-hidden">
      
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-30 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-lime-500/20 rounded-full blur-[140px]" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 lg:px-8 pt-20 pb-12 z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* New Interactive Kinetic Branding Element */}
          <div className="mb-10">
            <KineticBranding />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-lime-950 bg-lime-950/40 px-4 py-1.5 backdrop-blur-md">
            <span className="flex h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-lime-400">
              The Next Generation of Global Travel
            </span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Engineered For
            <br />
            <span className="bg-gradient-to-r from-white via-slate-200 to-lime-400 bg-clip-text text-transparent">
              Flawless Journeys.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-slate-400 leading-relaxed">
            An advanced ecosystem tailored to parse flights, hyper-curated stays, and rapid rail cross-connections into one unified, instant-confirmation interface.
          </p>

          <div className="mt-8 flex justify-center w-full">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl bg-lime-400 text-black font-bold text-sm px-8 py-3.5 transition-all duration-300 hover:bg-lime-300 hover:shadow-[0_0_30px_rgba(163,230,53,0.25)]"
            >
              Initialize Booking
            </button>
          </div>

        </div>
      </section>

      {/* ================= SEARCH MODULE TERMINAL ================= */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 -mt-12">
        <Reveal direction="up" delay={100}>
          <div className="bg-[#0b0f04] border border-lime-950/40 rounded-3xl p-2 shadow-2xl shadow-black/80">
            <div className="flex border-b border-slate-900/60 p-4 gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {["flights", "hotels", "trains"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSearchTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-all duration-150 ${
                    activeSearchTab === tab 
                      ? "bg-lime-950/40 text-lime-400 border border-lime-900/50 shadow-sm" 
                      : "hover:text-slate-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================= STAGGERED INFO BOXES ================= */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-20 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {logisticsData.map((item, index) => (
            <Reveal 
              key={index} 
              direction={index % 2 === 0 ? "left" : "right"} 
              delay={index * 150}
            >
              <div className="bg-slate-950/60 border border-slate-900/80 p-6 rounded-2xl h-full transition-colors duration-300 hover:border-slate-800">
                <h3 className="text-base font-bold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= BENTO GALLERY ================= */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <Reveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-lime-400 block mb-1">02 / Curated Topography</span>
              <h2 className="text-2xl md:text-4xl font-black text-white">Signature Experiences</h2>
            </div>
            <div className="flex flex-wrap gap-1 text-[11px] font-bold uppercase tracking-wider">
              {["All", "Cultural", "Coastal", "Adventure"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md border transition-all duration-200 ${
                    selectedCategory === cat ? "border-lime-400 bg-lime-400 text-black" : "border-slate-900 bg-slate-950 text-slate-400 hover:border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {filteredDestinations.map((place, index) => (
            <Reveal 
              key={place.id} 
              direction="up" 
              delay={(index % 3) * 100} 
              className={place.size}
            >
              <article
                className="group relative rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 cursor-pointer h-full w-full"
                onClick={() => navigate("/ExplorePlace")}
              >
                <img
                  src={place.img}
                  alt={place.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050702] via-[#050702]/30 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-lime-400 mb-1">{place.category}</span>
                  <h3 className="text-lg font-bold text-white tracking-tight">{place.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm line-clamp-1 opacity-90">
                    {place.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= FAQ ACCORDION ================= */}
      <section className="max-w-3xl mx-auto px-6 py-20 border-t border-slate-900">
        <Reveal direction="down">
          <h2 className="text-2xl font-black text-white text-center mb-8">System Operations FAQ</h2>
        </Reveal>
        <div className="space-y-3">
          {[
            { q: "How does the consolidated multi-modal transit engine aggregate pricing?", a: "Our enterprise-grade API pairs directly with Global Distribution Systems (GDS) and local transit networks, running advanced predictive caching to compile synchronized flight, rail, and hotel bundles at lowest market rates." },
            { q: "What tier of encryption guarantees transaction security?", a: "All tokenized data pipelines utilize PCI-DSS Level 1 compliance alongside AES-256 bank-grade network tunnels, backed by our comprehensive ticket protection and zero-liability travel assurance policies." }
          ].map((faq, index) => (
            <Reveal key={index} direction="up" delay={index * 100}>
              <div className="border border-slate-900 rounded-xl bg-slate-950/40 overflow-hidden">
                <button
                  className="w-full text-left p-5 font-semibold text-sm sm:text-base flex justify-between items-center gap-4 text-slate-200 hover:text-white"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span>{faq.q}</span>
                  <span className={`text-lime-400 transition-transform duration-200 ${activeFaq === index ? "rotate-45" : ""}`}>＋</span>
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-5 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-900/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-900 bg-[#050702] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-mono tracking-wider font-bold text-white">PAYANAM_<span className="text-lime-400">EXP</span>.</span>
            <span>© {new Date().getFullYear()} Payanam Global System Distribution.</span>
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}