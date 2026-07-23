export default function MarqueeTicker() {
  return (
    <div className="w-full bg-slate-900/95 text-white/40 py-4 overflow-hidden select-none border-y border-slate-800 backdrop-blur-sm relative z-10">
      <div className="flex whitespace-nowrap gap-20 text-xs font-mono font-bold tracking-widest uppercase">
        <div className="inline-flex gap-20 shrink-0 animate-marquee py-1">
          <span>• FLIGHT NODE: OPEN ACCESS</span>
          <span>• BUS PROTOCOL: VERIFIED 25K ROUTES</span>
          <span>• HOTEL CONTRACTS: MIDDLEMAN EXCLUSION MODEL</span>
          <span>• TRAIN IRCTC GATEWAY: OPERATIONAL 99.4% UPTIME</span>
          <span>• GLOBAL LOGISTICS MATRIX ONLINE</span>
        </div>
      </div>
    </div>
  );
}
