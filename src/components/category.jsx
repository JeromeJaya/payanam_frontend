export default function Category({ icon, title, onClick, active }) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`
        flex flex-col items-center justify-center gap-1 px-2 py-2 
        xs:px-2.5 xs:py-2.5 sm:px-3.5 sm:py-3 md:px-4 md:py-3.5
        rounded-xl transition-all duration-200
        /* Using fluid width with a safe min-width on mobile */
        min-w-[64px] xs:min-w-[72px] sm:min-w-[88px] md:min-w-[100px] lg:min-w-[112px]
        max-w-[80px] xs:max-w-[90px] sm:max-w-[104px] md:max-w-[120px] lg:max-w-[132px]
        touch-manipulation select-none
        ${active
          ? "bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/25 scale-100 hover:scale-[1.02] active:scale-[0.98]"
          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
        }
      `}
    >
      <div className={`
        w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12
        flex items-center justify-center rounded-lg
        ${active ? "bg-white/20" : "bg-slate-50 dark:bg-slate-700"}
        transition-colors duration-200
      `}>
        {/* Support both string icons and React components */}
        {typeof icon === "string" ? (
          <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl leading-none">
            {icon}
          </span>
        ) : (
          <span className="w-4.5 h-4.5 xs:w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-current">
            {icon}
          </span>
        )}
      </div>
      <span className={`
        /* Fixed mobile font hierarchy (xs -> sm -> md -> lg) */
        text-[10px] xs:text-xs sm:text-sm md:text-base
        font-medium leading-tight whitespace-nowrap
        overflow-hidden text-ellipsis max-w-full
        ${active ? "font-semibold" : "font-medium"}
      `}>
        {title}
      </span>
    </button>
  );
}