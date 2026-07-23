export default function PipelineSection({ pipelineRef, pipelineRevealed }) {
  const steps = [
    { step: "01", title: "API Request Query Payload", desc: "User triggers query parameters. System sanitizes memory registers and initiates high-speed geolocation lookups across server memory arrays." },
    { step: "02", title: "Vendor Virtualization Node", desc: "Queries hit supplier nodes asynchronously. Distributed computing architecture isolates inventory locks under 5ms." },
    { step: "03", title: "Atomic Confirmation Ledger", desc: "Data payload compiles natively into merchant instances, emitting an immutable cryptographically signed reservation ticket." }
  ];

  return (
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
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-6 z-0 overflow-hidden">
            <div className={`h-full bg-lime-500 transition-all duration-[2000ms] ease-in-out ${pipelineRevealed ? "w-full" : "w-0"}`}></div>
          </div>

          {steps.map((card, idx) => (
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
  );
}
