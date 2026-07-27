import FlightPlace from "../FlightPlace.jsx";

export default function SearchInputField({
  field,
  value,
  onChange,
  onFocus,
  onKeyDown,
  wrapperRef,
  showDropdown,
  items,
  activeIndex,
  setActiveIndex,
  onSelect,
  registerInput,
  today,
}) {
  const isNumberField = field.type === "number";

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-md font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
        {field.label}
      </label>

      <input
        id={field.name}
        className={`w-full px-3 py-2.5 text-lg border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-500 ${isNumberField ? 'w-20' : ''}`}
        placeholder={field.mid || `Enter ${field.label.toLowerCase()}`}
        type={field.type || "text"}
        min={field.type === "date" ? today : undefined}
        defaultValue={value !== undefined ? undefined : (field.type === "date" ? today : field.mid)}
        value={value}
        onChange={(e) => {
          if (field.type === "date" && e.target.value < today) return;
          if (field.type === "number") {
            const val = e.target.value;
            if (val !== "" && !/^\d+$/.test(val)) {
              e.target.value = val.replace(/\D/g, "");
              if (onChange) onChange(e);
              return;
            }
          }
          if (onChange) onChange(e);
        }}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        ref={registerInput}
        autoComplete="off"
      />

      {showDropdown && (
        <FlightPlace
          items={items}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
