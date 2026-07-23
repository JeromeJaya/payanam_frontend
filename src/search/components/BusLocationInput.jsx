import { MapPin, ArrowRightLeft } from "lucide-react";

export default function BusLocationInput({
  from,
  to,
  onFromChange,
  onToChange,
  onSwap,
  showFromSuggestions,
  showToSuggestions,
  fromSuggestions,
  toSuggestions,
  loadingFrom,
  loadingTo,
  onSelectFrom,
  onSelectTo,
  fromRef,
  toRef,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-1 mb-1">
      <div className="flex-1 flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg p-1.5 border border-slate-100 dark:border-slate-700 focus-within:border-lime-500 transition-all relative" ref={fromRef}>
        <MapPin size={15} className="text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" />
        <div className="flex-1 min-w-0">
          <label className="block text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">From</label>
          <input
            type="text"
            className="w-full text-xs sm:text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-500 focus:outline-none bg-transparent mt-0.5 truncate"
            placeholder="Origin"
            onChange={onFromChange}
            value={from}
            required
            autoComplete="off"
          />
        </div>
        {showFromSuggestions && (
          <div className="absolute top-full left-0 w-[85vw] md:w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-[60] max-h-60 overflow-y-auto">
            {loadingFrom ? (
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 text-center">Searching...</div>
            ) : fromSuggestions.length > 0 ? (
              fromSuggestions.map((place, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelectFrom(place)}
                  className="w-full text-left px-3 py-2 hover:bg-lime-50/80 dark:hover:bg-lime-900/20 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                >
                  <div className="text-md font-bold text-slate-900 dark:text-slate-100">{place.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{place.state}</div>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 text-center">No results</div>
            )}
          </div>
        )}
      </div>

      <div className="self-center flex items-center justify-center z-20 shrink-0 -mx-1 sm:mx-0">
        <button
          type="button"
          className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-lime-600 dark:hover:text-lime-400 shadow-sm transition active:scale-90"
          onClick={onSwap}
          title="Swap Locations"
        >
          <ArrowRightLeft size={12} />
        </button>
      </div>

      <div className="flex-1 flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg p-1.5 border border-slate-100 dark:border-slate-700 focus-within:border-lime-500 transition-all relative" ref={toRef}>
        <MapPin size={15} className="text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" />
        <div className="flex-1 min-w-0">
          <label className="block text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">To</label>
          <input
            type="text"
            className="w-full text-xs sm:text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-500 focus:outline-none bg-transparent mt-0.5 truncate"
            placeholder="Destination"
            value={to}
            onChange={onToChange}
            required
            autoComplete="off"
          />
        </div>
        {showToSuggestions && (
          <div className="absolute top-full right-0 w-[85vw] md:w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-[60] max-h-60 overflow-y-auto">
            {loadingTo ? (
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 text-center">Searching...</div>
            ) : toSuggestions.length > 0 ? (
              toSuggestions.map((place, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelectTo(place)}
                  className="w-full text-left px-3 py-2 hover:bg-lime-50/80 dark:hover:bg-lime-900/20 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                >
                  <div className="text-md font-bold text-slate-900 dark:text-slate-100">{place.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{place.state}</div>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 text-center">No results</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
