export default function Category({ icon, title, onClick, active }) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`
        flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl transition-all duration-200
        min-w-[72px] sm:min-w-[88px] touch-manipulation
        ${active
          ? "bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg scale-100 hover:scale-105"
          : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"
        }
      `}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-slate-50 active:bg-white/20">{icon}</div>
      <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{title}</span>
    </button>
  );
}