export default function PassengerCountSelect({ value, onChange }) {
  return (
    <div className="flex-1 min-w-[100px] sm:min-w-[120px] bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
      <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Seats</label>
      <select
        className="w-full bg-transparent font-bold text-xs md:text-sm mt-0.5 focus:outline-none text-gray-900 dark:text-slate-100 cursor-pointer"
        value={value ?? "1"}
        onChange={(e) => onChange(e.target.value)}
      >
        {Array.from({ length: 35 }, (_, i) => i + 1).map(n => (
          <option key={n} value={n}>{n} {n === 1 ? 'Seat' : 'Seats'}</option>
        ))}
      </select>
    </div>
  );
}
