import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BusFilterBar({ NoOfBus = 0, selectedDate, onDateSelect, selectedSort, onSortSelect }) {
  const [dateOffset, setDateOffset] = useState(0);
  
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const base = selectedDate ? new Date(selectedDate) : new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + dateOffset);

  const dates = Array.from({ length: 8 }, (_, index) => {
    const current = new Date(base);
    current.setDate(base.getDate() + index);
    return {
      label: `${String(current.getDate()).padStart(2, "0")} ${monthNames[current.getMonth()]}, ${dayNames[current.getDay()]}`,
      value: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`,
    };
  });

  const handlePrevious = () => {
    setDateOffset(prev => prev - 8);
  };

  const handleNext = () => {
    setDateOffset(prev => prev + 8);
  };

  const sortOptions = [
    "Relevance",
    "Rating",
    "Price",
    "Fastest",
    "Departure",
    "Arrival",
  ];

  return (
    <div className="w-full bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-xs">
      {/* Date Slider Row - HIDDEN ON MOBILE (`hidden md:flex`) */}
      <div className="hidden md:flex items-center border-b border-slate-100">
        <button 
          onClick={handlePrevious}
          className="p-3 md:p-6 hover:bg-slate-50 transition shrink-0"
          type="button"
        >
          <ChevronLeft className="text-sky-500 w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div className="flex flex-1 overflow-x-auto justify-between gap-1 md:gap-0 px-1 scrollbar-none">
          {dates.map((item) => {
            const active = item.value === selectedDate;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onDateSelect?.(item.value)}
                className={`px-3 md:px-6 py-3 md:py-5 text-center whitespace-nowrap transition text-xs md:text-sm font-semibold tracking-wide shrink-0 md:shrink border-b-2 ${
                  active 
                    ? "border-sky-500 text-sky-600 font-bold bg-sky-50/40 md:bg-transparent" 
                    : "border-transparent text-slate-500 hover:text-sky-600"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <button 
          onClick={handleNext}
          className="p-3 md:p-6 hover:bg-slate-50 transition shrink-0"
          type="button"
        >
          <ChevronRight className="text-sky-500 w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Sort Section - Always Visible */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center px-4 md:px-6 py-3 md:py-2 gap-3 md:gap-0 bg-white md:bg-slate-50/50">
        <h3 className="font-extrabold text-xs md:text-base text-slate-800 mr-0 md:mr-8 whitespace-nowrap self-center">
          {NoOfBus} Buses Found
        </h3>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-black text-[10px] tracking-wider text-slate-400 uppercase shrink-0">
            SORT BY:
          </span>

          {/* Swipeable Horizontally on Mobile Viewports */}
          <div className="flex gap-1.5 md:gap-4 items-center overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1 -mr-4 pr-4 md:mr-0 md:pr-0">
            {sortOptions.map((option) => {
              const active = option === selectedSort;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSortSelect?.(option)}
                  className={`px-3 py-1.5 rounded-lg transition text-xs font-bold whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-sky-500 text-white shadow-xs shadow-sky-500/20"
                      : "text-slate-600 bg-white border border-slate-200/80 hover:border-sky-500 hover:text-sky-500"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}