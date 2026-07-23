import { X, Lock, Plane, ArrowRight, TrendingUp } from "lucide-react";

export default function PriceLockHeader({
  onClose,
  airlineName,
  flightNumber,
  source,
  destination,
  departureDate,
  departureTime,
  arrivalTime,
  stopsInfo,
  cabinClass,
  availableSeats,
}) {
  return (
    <>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-1.5 rounded-full text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-slate-200 transition-colors z-10"
      >
        <X size={20} strokeWidth={2} />
      </button>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
          <Lock size={18} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
            Lock this price & pay later!
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Freeze the fare. Book when you're ready.</p>
        </div>
      </div>

      <div className="border border-gray-100 dark:border-slate-700 rounded-xl p-4 space-y-3 bg-gray-50/50 dark:bg-slate-700/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-800 dark:text-slate-200 font-bold text-sm">
            <Plane size={15} className="text-blue-900 dark:text-blue-400 rotate-45" />
            <span>{source.split('(')[0]?.trim()}</span>
            <ArrowRight size={14} className="text-gray-400 dark:text-slate-500" />
            <span>{destination.split('(')[0]?.trim()}</span>
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-slate-400 pl-6">
            {departureDate} | {departureTime} - {arrivalTime} | {stopsInfo} | {cabinClass}
          </p>
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 pl-6">
            {airlineName} · {flightNumber}
          </p>
        </div>

        {availableSeats !== "N/A" && availableSeats <= 15 && (
          <div className="bg-amber-50/70 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-700 rounded-lg p-2.5 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300">
            <TrendingUp size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="font-medium">
              Only <span className="font-black">{availableSeats} seat(s)</span> left! Prices may increase soon.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
