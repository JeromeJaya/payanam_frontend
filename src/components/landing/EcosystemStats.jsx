export default function EcosystemStats({ metricsRef, metricsRevealed }) {
  const stats = [
    { val: "Rs. 1.4B+", label: "Gross Volume Logged" },
    { val: "18.4M", label: "Invocations / Hour" },
    { val: "12,450", label: "Active Micro-Vendors" },
    { val: "< 14ms", label: "Query Resolution" }
  ];

  return (
    <section
      id="analytical-stats"
      ref={metricsRef}
      className="py-28 bg-slate-900/95 backdrop-blur-md text-white w-full relative overflow-hidden z-10"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-lime-900/20 via-transparent to-emerald-900/20"></div>

      <div className="w-full px-6 sm:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {stats.map((stat, i) => {
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
  );
}
