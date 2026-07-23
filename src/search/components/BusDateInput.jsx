import { Calendar, Users } from "lucide-react";

export default function BusDateInput({
  date,
  onDateChange,
  passengerCount,
  onPassengerCountChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-1">
      <div className="flex-1 flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg p-1.5 border border-slate-100 dark:border-slate-700 focus-within:border-lime-500 transition-all">
        <Calendar size={15} className="text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" />
        <div className="flex-1 min-w-0">
          <label className="block text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Depart Date</label>
          <input
            type="date"
            className="w-full text-xs sm:text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 focus:outline-none bg-transparent mt-0.5 cursor-pointer accent-lime-600 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            value={date || ""}
            onChange={onDateChange}
            min={new Date().toISOString().slice(0, 10)}
            required
          />
        </div>
      </div>

      {onPassengerCountChange && (
        <div className="flex-1 flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg p-1.5 border border-slate-100 dark:border-slate-700 focus-within:border-lime-500 transition-all">
          <Users size={15} className="text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" />
          <div className="flex-1 min-w-0">
            <label className="block text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Passengers</label>
            <select
              className="w-full text-xs sm:text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 focus:outline-none bg-transparent mt-0.5 cursor-pointer accent-lime-600"
              value={passengerCount ?? "1"}
              onChange={(e) => onPassengerCountChange(e.target.value)}
            >
              {Array.from({ length: 35 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
