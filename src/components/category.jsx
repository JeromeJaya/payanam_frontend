export default function Category({ icon, title, onClick, active }) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`
        flex flex-col items-center justify-center gap-1.5 px-2.5 py-2 
        sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 lg:px-5 lg:py-3.5
        rounded-xl rounded-lg transition-all duration-200
        min-w-[68px] sm:min-w-[80px] md:min-w-[96px] lg:min-w-[104px]
        max-w-[72px] sm:max-w-[88px] md:max-w-[108px] lg:max-w-[120px]
        touch-manipulation select-none
        ${active
          ? "bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/25 scale-100 hover:scale-[1.02] active:scale-[0.98]"
          : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
        }
      `}
    >
      <div className={`
        w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12
        flex items-center justify-center rounded-lg
        ${active ? "bg-white/20" : "bg-slate-50"}
        transition-colors duration-200
      `}>
        {/* Support both string icons and React components */}
        {typeof icon === "string" ? (
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl leading-none">{icon}</span>
        ) : (
          <span className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-current">
            {icon}
          </span>
        )}
      </div>
      <span className={`
        text-[10px] sm:text-xs md:text-sm lg:text-base 
        font-medium leading-tight whitespace-nowrap
        overflow-hidden text-ellipsis max-w-full
        ${active ? "font-semibold" : "font-medium"}
      `}>
        {title}
      </span>
    </button>
  );
}