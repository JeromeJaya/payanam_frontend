export default function ServicesMatrix({ matrixRef, matrixRevealed, activeTab, setActiveTab, perksGridRef, perksGridRevealed, servicesConfig }) {
  return (
    <section
      id="services-matrix"
      ref={matrixRef}
      className={`py-28 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 scroll-mt-20 w-full transition-all duration-[1000ms] relative z-10 ${
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

        <div className="w-full">
          <div className={`rounded-3xl border border-slate-200 bg-gradient-to-br ${servicesConfig[activeTab].bgGradient} p-8 sm:p-16 shadow-inner w-full transition-all duration-500 backdrop-blur-sm bg-white/50`}>
            <div className="grid lg:grid-cols-12 gap-12 items-center">

              <div className="lg:col-span-8 space-y-6">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight transition-all duration-300">
                  {servicesConfig[activeTab].title}
                </h3>
                <p className="text-slate-600 text-lg sm:text-xl font-medium leading-relaxed">
                  {servicesConfig[activeTab].tagline}
                </p>

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
  );
}
