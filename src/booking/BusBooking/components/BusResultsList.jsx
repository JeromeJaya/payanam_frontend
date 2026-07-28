import { useState, useRef, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import BusFillterBar from "../../../filter/BusFillterBar.jsx";
import BusCard from "../../../cards/BusCard.jsx";
import BusLoadingState from "./BusLoadingState.jsx";
import BusEmptyState from "./BusEmptyState.jsx";

export default function BusResultsList({
  loading,
  sortedAndFilteredBuses,
  allBuses,
  date,
  sortBy,
  from,
  to,
  onDateSelect,
  onSortSelect,
  onClearFilters,
  onNextDaySearch,
  maxSeats,
  busNumberSearch,
  onBusNumberSearchChange,
}) {
  const hasBuses = sortedAndFilteredBuses.length > 0;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const uniqueBusNumbers = useMemo(
    () => [...new Set(allBuses.map((s) => s.bus?.number).filter(Boolean))],
    [allBuses]
  );

  const suggestions = useMemo(
    () => busNumberSearch.trim()
      ? uniqueBusNumbers.filter((num) =>
          num.toLowerCase().includes(busNumberSearch.trim().toLowerCase())
        ).slice(0, 10)
      : uniqueBusNumbers.slice(0, 20),
    [uniqueBusNumbers, busNumberSearch]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionSelect = (num) => {
    onBusNumberSearchChange(num);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleInputChange = (e) => {
    onBusNumberSearchChange(e.target.value);
    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSuggestionSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className={`w-full ${allBuses.length > 0 && !loading ? 'lg:w-[80%] lg:ml-[2%]' : 'lg:w-full'} px-2 sm:px-3 md:px-5 flex flex-col`}>
      {allBuses.length > 0 && !loading && (
        <div className="bg-white dark:bg-slate-800 w-full h-auto my-5 rounded-3xl shadow-xl dark:shadow-slate-900/30">
          <BusFillterBar
            NoOfBus={sortedAndFilteredBuses.length}
            selectedDate={date}
            onDateSelect={onDateSelect}
            selectedSort={sortBy}
            onSortSelect={onSortSelect}
          />
        </div>
      )}

      {!loading && allBuses.length > 0 && (
        <div ref={wrapperRef} className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by bus number e.g. KA-01-1234"
            value={busNumberSearch}
            onChange={handleInputChange}
            onFocus={() => uniqueBusNumbers.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
              {suggestions.map((num, idx) => (
                <li
                  key={num}
                  onClick={() => handleSuggestionSelect(num)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                    idx === activeIndex
                      ? "bg-lime-50 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {num}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {loading ? (
        <BusLoadingState />
      ) : hasBuses ? (
        sortedAndFilteredBuses.map((schedule) => (
          <div key={schedule.scheduleId} className="bg-white dark:bg-slate-800 w-full h-auto mb-3 rounded-3xl shadow-xl dark:shadow-slate-900/30">
            <BusCard
              busName={schedule.bus?.name}
              busNumber={schedule.bus?.number}
              busType={schedule.bus?.type}
              departureTime={schedule.journey?.departureTime}
              arrivalTime={schedule.journey?.arrivalTime}
              travelDuration={schedule.journey?.durationMinutes}
              availableSeats={schedule.seats?.available}
              calculatedFare={schedule.pricing?.calculatedFare}
              operatorName={schedule.operator?.name}
              averageRating={schedule.bus?.rating}
              totalRatings={0}
              amenities={schedule.bus?.amenities}
              scheduleId={schedule.scheduleId}
              boardingPoints={schedule.boardingPoints}
              droppingPoints={schedule.droppingPoints}
              maxSeats={maxSeats}
            />
          </div>
        ))
      ) : (
        <BusEmptyState
          from={from}
          to={to}
          onClearFilters={onClearFilters}
          onNextDaySearch={onNextDaySearch}
        />
      )}
    </div>
  );
}
