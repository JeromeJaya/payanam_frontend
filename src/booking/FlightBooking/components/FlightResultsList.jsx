import FlightCard from "../../../cards/FlightCard.jsx"
import FlightFareSelector from "../FlightFareSelector.jsx"
import FlightLoadingState from "./FlightLoadingState.jsx"
import FlightEmptyState from "./FlightEmptyState.jsx"

export default function FlightResultsList({
  loading,
  flights,
  date,
  sortBy,
  onDateSelect,
  onSortSelect,
  onAddToCompare,
  onRemoveFromCompare,
  isFlightCompared,
  openCompareSidebar,
}) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800 w-full lg:w-[80%] lg:ml-[2%] px-2 sm:px-3 md:px-5 rounded-lg shadow-xl dark:shadow-slate-900/30 flex flex-col">
      <div className="bg-white dark:bg-slate-800 w-full h-auto my-5 rounded-3xl shadow-xl dark:shadow-slate-900/30">
        <FlightFareSelector
          NoOfFlights={flights.length}
          selectedDate={date}
          onDateSelect={onDateSelect}
          selectedSort={sortBy}
          onSortSelect={onSortSelect}
        />
      </div>
      {loading ? (
        <FlightLoadingState />
      ) : Array.isArray(flights) && flights.length > 0 ? (
        flights.map((flight) => (
          <div key={flight.scheduleId || flight.id || flight.flightNumber} className="bg-white dark:bg-slate-800 w-full h-auto mb-3 rounded-3xl shadow-xl dark:shadow-slate-900/30">
            <FlightCard
              flight={flight}
              isCompared={isFlightCompared(flight)}
              onAddToCompare={() => onAddToCompare(flight)}
              onRemoveFromCompare={() => onRemoveFromCompare(flight)}
              onToggleCompareSidebar={openCompareSidebar}
            />
          </div>
        ))
      ) : (
        <FlightEmptyState />
      )}
    </div>
  );
}
