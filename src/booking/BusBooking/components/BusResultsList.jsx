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
}) {
  const hasBuses = sortedAndFilteredBuses.length > 0;

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

      {loading ? (
        <BusLoadingState />
      ) : hasBuses ? (
        sortedAndFilteredBuses.map((schedule) => (
          <div key={schedule.scheduleId} className="bg-white dark:bg-slate-800 w-full h-auto mb-3 rounded-3xl shadow-xl dark:shadow-slate-900/30">
            <BusCard
              busName={schedule.bus?.name}
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
