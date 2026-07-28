export default function DateInput({ value = "", onChange, min = "" }) {
  return (
    <div className="flex-1 min-w-[120px] sm:min-w-[140px] bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">

      <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
        Depart
      </label>

      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => {
          const newDate = e.target.value;

          if (min && newDate < min) return;

          onChange(newDate);
        }}
        onClick={(e) => {
          try {
            if (typeof e.target.showPicker === "function") {
              e.target.showPicker();
            }
          } catch (err) {}
        }}
        onKeyDown={(e) => {
          if (e.key !== "Tab" && e.key !== "Escape") {
            e.preventDefault();
            try {
              if (typeof e.target.showPicker === "function") {
                e.target.showPicker();
              }
            } catch (err) {}
          }
        }}
        className="
          date-picker-icon
          w-full 
          bg-transparent 
          font-bold 
          text-xs 
          md:text-sm 
          mt-0.5 
          focus:outline-none 
          text-gray-900 
          dark:text-slate-100 
          cursor-pointer
        "
      />

    </div>
  );
}