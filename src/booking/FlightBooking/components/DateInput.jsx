export default function DateInput({ value, onChange, min }) {
  return (
    <div className="flex-1 min-w-[120px] sm:min-w-[140px] bg-gray-50 border border-gray-200 rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 transition-colors">
      <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Depart</label>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => {
          const newDate = e.target.value;
          if (newDate && newDate < min) return;
          onChange(newDate);
        }}
        className="w-full bg-transparent font-bold text-xs md:text-sm mt-0.5 focus:outline-none text-gray-900 cursor-pointer"
      />
    </div>
  );
}
