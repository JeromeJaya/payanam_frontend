import { Lock } from "lucide-react";

export default function FlightFareSection({
  calculatedFare,
  originalPrice,
  availableSeats,
  onSelect,
  isSelected,
  onLockClick,
  onViewPriceClick,
}) {
  return (
    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 w-full lg:w-auto lg:min-w-[220px] pt-2 lg:pt-0 border-t sm:border-t-0 lg:border-t-0 border-gray-100 dark:border-slate-700 sm:pt-0">
      <div className="flex flex-col sm:items-start lg:items-end w-full sm:w-auto">
        <div className="flex items-baseline gap-2">
          {originalPrice && originalPrice !== calculatedFare && (
            <span className="text-xs line-through text-gray-400 dark:text-slate-500 font-medium">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
            ₹{calculatedFare.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">/adult</span>
          {availableSeats !== "N/A" && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
              {availableSeats} left
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-stretch sm:justify-end">
        <button
          onClick={onLockClick}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 hover:bg-blue-100/80 dark:hover:bg-blue-900/30 transition-colors px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold focus:outline-none"
        >
          <Lock size={10} className="text-blue-500 shrink-0" />
          <span className="whitespace-nowrap">Lock</span>
        </button>

        <button
          onClick={onViewPriceClick}
          className="flex-1 sm:flex-none bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] font-extrabold text-[10px] sm:text-xs px-3 sm:px-5 py-2 rounded-lg sm:rounded-xl transition-all uppercase tracking-wide shadow-md shadow-blue-100 whitespace-nowrap focus:outline-none text-center"
        >
          {onSelect ? (isSelected ? 'Selected' : 'Select') : 'View Price'}
        </button>
      </div>
    </div>
  );
}
