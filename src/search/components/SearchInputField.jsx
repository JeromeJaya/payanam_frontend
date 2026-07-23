import FlightPlace from "../FlightPlace.jsx";

export default function SearchInputField({
  field,
  value,
  onChange,
  onFocus,
  wrapperRef,
  showDropdown,
  service,
  from,
  to,
  selectFrom,
  selectTo,
  fromAirportSuggestions,
  toAirportSuggestions,
  allDestinations,
  isFromField,
  isToField,
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
          if (onChange) onChange(e);
        }}
        onFocus={onFocus}
        ref={registerInput}
        autoComplete="off"
      />

      {showDropdown && (
        <FlightPlace
          service={service}
          from={from}
          to={to}
          selectFrom={selectFrom}
          selectTo={selectTo}
          fromAirportSuggestions={fromAirportSuggestions}
          toAirportSuggestions={toAirportSuggestions}
          allDestinations={allDestinations}
          isFromField={isFromField}
          isToField={isToField}
        />
      )}
    </div>
  );
}
