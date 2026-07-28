import { useState } from "react";
import FlightPlace from "../FlightPlace.jsx";
import DatePicker from "../../components/DatePicker.jsx";

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
const isDateField = field.type === "date";
  const isNumberField = field.type === "number";
  const [dateError, setDateError] = useState("");
  const [localDateValue, setLocalDateValue] = useState(isDateField ? (value ?? today) : "");

  const displayValue = isDateField ? localDateValue : value;

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-md font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
        {field.label}
      </label>

      {isDateField ? (
        <DatePicker
          value={isDateField ? displayValue || today : value}
          onChange={(e) => {
            if (e.target.value < today) {
              setDateError("Past dates are not allowed");
              return;
            }
            setDateError("");
            setLocalDateValue(e.target.value);
            if (onChange) onChange(e);
          }}
          minDate={today}
          placeholder={field.mid || `Select ${field.label.toLowerCase()}`}
          className="w-full"
          isDark={true}
        />
      ) : (
        <input
          id={field.name}
          className={`w-full px-3 py-2.5 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-500 ${isNumberField ? 'w-20' : ''} ${dateError ? 'border-red-500 dark:border-red-400' : 'border-slate-200'}`}
          placeholder={field.mid || `Enter ${field.label.toLowerCase()}`}
          type={field.type || "text"}
          min={isDateField ? today : undefined}
          value={isDateField ? displayValue : value}
          onChange={(e) => {
            if (isDateField) {
              if (e.target.value < today) {
                setDateError("Past dates are not allowed");
                return;
              }
              setDateError("");
              setLocalDateValue(e.target.value);
              if (onChange) onChange(e);
              return;
            }
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
          onInput={(e) => {
            if (isDateField) {
              e.target.value = e.target.value.replace(/\D/g, '');
            }
          }}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          ref={registerInput}
          autoComplete="off"
        />
      )}

      {dateError && (
        <p className="text-xs text-red-500 mt-1">{dateError}</p>
      )}

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
