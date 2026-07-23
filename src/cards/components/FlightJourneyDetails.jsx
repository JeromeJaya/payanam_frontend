export default function FlightJourneyDetails({
  departureTime,
  departureLocation,
  departureIATA,
  arrivalTime,
  arrivalLocation,
  arrivalIATA,
  durationText,
  stopsCount,
  stopsInfo,
}) {
  return (
    <div className="flex flex-row items-center justify-between gap-1 sm:gap-6 lg:flex-1 w-full border-y border-dashed border-gray-100 dark:border-slate-700 py-2 sm:py-3 lg:py-0 lg:border-none">
      <div className="text-left sm:text-center min-w-[60px] sm:min-w-[90px] max-w-[35%]">
        <h2 className="text-base sm:text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight">{departureTime}</h2>
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 font-bold mt-0.5 truncate">{departureLocation}</p>
        {departureIATA && (
          <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase">({departureIATA})</p>
        )}
      </div>

      <div className="flex-1 max-w-[120px] sm:max-w-[160px] text-center px-0.5 sm:px-1">
        <span className="text-[9px] sm:text-[11px] text-gray-500 dark:text-slate-400 font-bold whitespace-nowrap">{durationText}</span>
        <div className="relative my-1 sm:my-1.5 flex items-center justify-center">
          <div className="w-full h-[2px] sm:h-[3px] bg-amber-400 rounded-full" />
          {stopsCount > 0 && (
            <div className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full border border-white dark:border-slate-800 shadow-sm" style={{ left: '50%' }} />
          )}
          <div className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-slate-500 rounded-full border border-white dark:border-slate-800 shadow-sm right-0" />
        </div>
        <span className="text-[9px] sm:text-[11px] text-blue-600 dark:text-blue-400 font-bold block hover:underline cursor-pointer transition whitespace-nowrap overflow-hidden text-ellipsis">
          {stopsInfo}
        </span>
      </div>

      <div className="text-right sm:text-center min-w-[60px] sm:min-w-[90px] max-w-[35%]">
        <h2 className="text-base sm:text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight">{arrivalTime}</h2>
        <p className="text-[10px] sm:text-xs text-gray-900 dark:text-slate-300 font-bold mt-0.5 truncate">{arrivalLocation}</p>
        {arrivalIATA && (
          <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase">({arrivalIATA})</p>
        )}
      </div>
    </div>
  );
}
