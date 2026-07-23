export default function FlightCardHeader({
  airlineName,
  flightNumber,
  aircraftType,
  cabinClassesList,
  cabinClass,
  topPromoText,
  isSelected,
}) {
  return (
    <>
      {isSelected && (
        <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Selected
        </div>
      )}

      {topPromoText && (
        <div className="bg-amber-50/80 dark:bg-amber-900/20 px-4 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 border-b border-gray-100/60 dark:border-slate-700 tracking-wide uppercase">
          {topPromoText}
        </div>
      )}

      <div className="flex items-center gap-3 lg:min-w-[180px] w-full lg:w-auto">
        <div className="w-11 h-11 bg-indigo-950 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
          <svg className="w-6 h-6 rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5" />
          </svg>
        </div>
        <div className="min-w-0 flex-1 lg:flex-none">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100 leading-tight truncate">{airlineName}</h3>
          <p className="text-xs text-gray-400 dark:text-slate-500 font-medium tracking-tight mt-0.5">{flightNumber}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {aircraftType && (
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                {aircraftType}
              </span>
            )}
            {cabinClassesList.length > 1 ? cabinClassesList.map((cc) => (
              <span key={cc} className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                {cc.replace(/_/g, " ")}
              </span>
            )) : cabinClass && (
              <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                {cabinClass.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
