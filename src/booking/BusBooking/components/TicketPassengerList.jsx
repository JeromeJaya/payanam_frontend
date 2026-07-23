import { User, Armchair } from "lucide-react";

export default function TicketPassengerList({ passengers }) {
  if (!passengers || passengers.length === 0) return null;

  return (
    <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-700/20 print:bg-transparent">
      <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 sm:mb-3 flex items-center gap-1">
        <User size={11} /> Passenger Details
      </h4>
      <div className="space-y-2">
        {passengers.map((p, index) => (
          <div key={index} className="flex justify-between items-center bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-2 sm:p-3 shadow-3xs print:shadow-none gap-2">
            <div className="min-w-0">
              <p className="text-sm sm:text-md font-bold text-slate-900 dark:text-slate-100 truncate">{p.name}</p>
              <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 font-medium uppercase mt-0.5">Age: {p.age} • Gender: {p.gender}</p>
            </div>
            <span className="text-[10px] sm:text-xs font-extrabold text-lime-800 dark:text-lime-300 bg-lime-50 dark:bg-lime-900/30 border border-lime-200 dark:border-lime-700 rounded-lg px-2 sm:px-2.5 py-1 flex items-center gap-1 print:bg-transparent print:border-slate-300 print:text-slate-900 shrink-0">
              <Armchair size={11} /> Seat {p.seatNumber}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
