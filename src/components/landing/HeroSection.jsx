export default function HeroSection({ heroHeaderRef, heroHeaderRevealed, scrollY, mousePosition, setVendorModal }) {
  return (
    <section
      ref={heroHeaderRef}
      className="relative w-full overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-40 bg-gradient-to-b from-white/90 to-slate-50/90 backdrop-blur-sm border-b border-slate-200/40"
    >
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

          <div
            className="mt-12 lg:mt-0 lg:col-span-5 w-full transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(${mousePosition.x * -10}px, ${scrollY * -0.05 + mousePosition.y * -10}px, 0)`,
              perspective: "1000px",
            }}
          >
            <div
              className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-950/95 p-6 sm:p-8 rounded-3xl shadow-2xl relative border border-slate-700/50 w-full backdrop-blur-xl"
              style={{ transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg)` }}
            >
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
  );
}
