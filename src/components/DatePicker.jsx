import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export default function DatePicker({ 
  value, 
  onChange, 
  minDate, 
  placeholder = "Select date",
  className = "",
  isDark = false,
  name
}) {
  const todayStr = new Date().toISOString().split("T")[0];
  const effectiveMin = minDate || todayStr;

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [dateError, setDateError] = useState("");
  const wrapperRef = useRef(null);

  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(isNaN(initialDate.getTime()) ? new Date() : initialDate);

  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value);
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setViewDate(parsed);
      }
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

  const handleSelectDate = (dateStr) => {
    if (dateStr < effectiveMin) {
      setDateError("Past dates are not allowed");
      return;
    }
    setDateError("");
    setInputValue(dateStr);
    if (onChange) {
      const event = {
        target: {
          value: dateStr,
          name: name || "date"
        }
      };
      onChange(event);
    }
    setIsOpen(false);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const [y, m, d] = dateString.split("-");
    if (!y || !m || !d) return dateString;
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const monthNum = String(month + 1).padStart(2, "0");
    const dayNum = String(day).padStart(2, "0");
    calendarCells.push(`${year}-${monthNum}-${dayNum}`);
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Input Field Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 text-lg min-h-[52px] border-2 rounded-lg cursor-pointer flex items-center justify-between transition-all bg-white text-slate-800 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 ${className} ${
          dateError
            ? "border-red-500 dark:border-red-400"
            : "border-slate-200 dark:border-slate-600 hover:border-lime-500 dark:hover:border-lime-400"
        }`}
      >
        <span className={inputValue ? "font-semibold text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-400"}>
          {inputValue ? formatDateForDisplay(inputValue) : placeholder}
        </span>
        <CalendarIcon className="w-7 h-7 text-lime-600 dark:text-lime-400 shrink-0" />
      </div>

      {dateError && (
        <p className="text-xs text-red-500 mt-1 ml-1">{dateError}</p>
      )}

      {/* Large Custom Calendar Popup */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-80 sm:w-96 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-fadeIn select-none">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-wide">
              {monthNames[month]} {year}
            </h3>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {weekDays.map((wd) => (
              <span key={wd} className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {wd}
              </span>
            ))}
          </div>

          {/* Large Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarCells.map((dateStr, idx) => {
              if (!dateStr) {
                return <div key={`empty-${idx}`} className="h-10 sm:h-11" />;
              }
              const isPast = dateStr < effectiveMin;
              const isSelected = dateStr === inputValue;
              const isToday = dateStr === todayStr;
              const dayNumber = parseInt(dateStr.split("-")[2], 10);

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDate(dateStr)}
                  className={`h-10 sm:h-11 w-full rounded-lg text-sm sm:text-base font-semibold flex items-center justify-center transition-all ${
                    isPast
                      ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                      : isSelected
                      ? "bg-lime-500 text-white shadow-md shadow-lime-500/40 font-bold scale-105"
                      : isToday
                      ? "border-2 border-lime-500 text-lime-600 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-slate-700"
                      : "text-slate-700 dark:text-slate-200 hover:bg-lime-100 dark:hover:bg-slate-700 hover:text-lime-700 dark:hover:text-lime-300"
                  }`}
                >
                  {dayNumber}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Action Buttons */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => {
                setViewDate(new Date());
                handleSelectDate(todayStr);
              }}
              className="px-3 py-1.5 font-semibold text-lime-600 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const tmr = new Date(Date.now() + 86400000);
                const tmrStr = tmr.toISOString().split("T")[0];
                setViewDate(tmr);
                handleSelectDate(tmrStr);
              }}
              className="px-3 py-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              Tomorrow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}