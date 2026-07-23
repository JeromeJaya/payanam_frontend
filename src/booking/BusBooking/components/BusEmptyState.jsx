import { CalendarDays, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BusEmptyState({ from, to, onClearFilters, onNextDaySearch }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto my-12 w-full px-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center shadow-md dark:shadow-slate-900/30">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-amber-100 dark:border-amber-800">
          <AlertCircle size={32} className="text-amber-500" />
        </div>

        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">
          No Buses Available
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          We couldn't locate any direct bus schedules running between <span className="font-extrabold text-slate-700 dark:text-slate-200">{from || "your origin"}</span> and <span className="font-extrabold text-slate-700 dark:text-slate-200">{to || "your destination"}</span> on this date.
        </p>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-left border border-slate-100 dark:border-slate-600 mb-6 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 font-medium">
          <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-1">Suggested Solutions:</h4>
          <p>• If you applied active filtering sidebar checkboxes, try wiping them clean.</p>
          <p>• Schedules vary significantly by day; consider looking at the next calendar day.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); navigate("/mainpage"); }}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm px-4 py-3 rounded-xl shadow-xs transition-all"
          >
            Main Page
          </button>
          <button
            type="button"
            onClick={onClearFilters}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm px-4 py-3 rounded-xl transition-all"
          >
            <RefreshCw size={14} />
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onNextDaySearch}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm px-4 py-3 rounded-xl shadow-xs transition-all"
          >
            <CalendarDays size={14} />
            Check Next Day
          </button>
        </div>
      </div>
    </div>
  );
}
