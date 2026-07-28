import { useState, useRef, useEffect } from "react";

export default function DatePicker({ 
  value, 
  onChange, 
  minDate, 
  placeholder = "Select date",
  className = "",
  isDark = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [dateError, setDateError] = useState("");
  const wrapperRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value);
    }
  }, [value, inputValue]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (event) => {
    const selectedDate = event.target.value;
    if (selectedDate < today) {
      setDateError("Past dates are not allowed");
      return;
    }
    setDateError("");
    setInputValue(selectedDate);
    onChange && onChange(event);
    setIsOpen(false);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="date"
          value={inputValue}
          onChange={handleDateSelect}
          min={today}
          className={`w-full px-4 py-3 pr-12 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 ${isDark ? "dark" : ""} ${className} ${dateError ? 'border-red-500 dark:border-red-400' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => {
            const input = wrapperRef.current?.querySelector('input[type="date"]');
            if (input) {
              input.focus();
            }
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          aria-label="Select date"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-6 9h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {dateError && (
        <p className="text-xs text-red-500 mt-1 ml-1">{dateError}</p>
      )}
    </div>
  );
}