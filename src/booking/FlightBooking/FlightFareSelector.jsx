import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * FlightFareSelector — Date slider + sort pills (matches BusFilterBar pattern)
 *
 * Props:
 *   NoOfFlights   - number of flights to display in header
 *   selectedDate  - currently selected date (YYYY-MM-DD)
 *   onDateSelect  - callback when a date is clicked
 *   selectedSort  - current sort option string
 *   onSortSelect  - callback when a sort option is clicked
 */
export default function FlightFareSelector({
  NoOfFlights = 0,
  selectedDate,
  onDateSelect,
  selectedSort,
  onSortSelect,
}) {
  const [dateOffset, setDateOffset] = useState(0);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const parseLocalDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const base = selectedDate ? parseLocalDate(selectedDate) : new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + dateOffset);

  const dates = Array.from({ length: 8 }, (_, index) => {
    const current = new Date(base);
    current.setDate(base.getDate() + index);
    return {
      label: `${String(current.getDate()).padStart(2, '0')} ${monthNames[current.getMonth()]}, ${dayNames[current.getDay()]}`,
      value: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`,
    };
  });

  const handlePrevious = () => {
    setDateOffset((prev) => prev - 8);
  };

  const handleNext = () => {
    setDateOffset((prev) => prev + 8);
  };

  const sortOptions = [
    'Relevance',
    'Rating',
    'Price',
    'Fastest',
    'Departure',
    'Arrival',
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-xs">
      {/* Date Slider Row - HIDDEN ON MOBILE */}
      <div className="hidden md:flex items-center border-b border-slate-100 dark:border-slate-700">
        <button
          onClick={handlePrevious}
          className="p-3 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition shrink-0"
          type="button"
        >
          <ChevronLeft className="text-sky-500 dark:text-sky-400 w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div className="flex flex-1 overflow-x-auto justify-between gap-1 md:gap-0 px-1 scrollbar-none">
          {dates.map((item) => {
            const active = item.value === selectedDate;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setDateOffset(0);
                  onDateSelect?.(item.value);
                }}
                className={`px-3 md:px-6 py-3 md:py-5 text-center whitespace-nowrap transition text-xs md:text-sm font-semibold tracking-wide shrink-0 md:shrink border-b-2 ${
                  active
                    ? 'border-sky-500 dark:border-sky-400 text-sky-600 dark:text-sky-400 font-bold bg-sky-50/40 dark:bg-sky-900/20 md:bg-transparent'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="p-3 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition shrink-0"
          type="button"
        >
          <ChevronRight className="text-sky-500 dark:text-sky-400 w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Sort Section - Always Visible */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center px-4 md:px-6 py-3 md:py-2 gap-3 md:gap-0 bg-white dark:bg-slate-800 md:bg-slate-50/50 dark:md:bg-slate-900/50">
        <h3 className="font-extrabold text-xs md:text-base text-slate-800 dark:text-slate-200 mr-0 md:mr-8 whitespace-nowrap self-center">
          {NoOfFlights} Flights Found
        </h3>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-black text-[10px] tracking-wider text-slate-400 dark:text-slate-500 uppercase shrink-0">
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
                      ? 'bg-sky-500 dark:bg-sky-600 text-white shadow-xs shadow-sky-500/20'
                      : 'text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600 hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-500 dark:hover:text-sky-400'
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
