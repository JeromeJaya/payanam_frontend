import SelectBox from "../../../filter/SelectBox.jsx";
import Checkbox from "../../../filter/Checkbox.jsx";
import SearchheckBox from "../../../filter/SearchheckBox.jsx";

export default function BusFilterPanel({
  acFilter, setAcFilter,
  seatType, setSeatType,
  pickupTimeFilter, setPickupTimeFilter,
  dropTimeFilter, setDropTimeFilter,
  singleSeatsFilter, setSingleSeatsFilter,
  selectedPickupPoints, setSelectedPickupPoints,
  selectedDropPoints, setSelectedDropPoints,
  selectedOperators, setSelectedOperators,
  pickupPointOptions, dropPointOptions, operatorOptions,
  from, to,
  showMobileFilters, onCloseMobile, onClearAll,
}) {
  return (
    <div
      className={`filter bg-white dark:bg-slate-800 w-full lg:w-[25%] h-auto rounded-lg shadow-xl dark:shadow-slate-900/30 ${showMobileFilters ? 'block' : 'hidden lg:block'} sticky top-16 lg:top-20 max-h-[calc(100vh-80px)] overflow-y-auto`}
    >
      <div className="flex justify-center mt-5 text-xl font-bold text-slate-800 dark:text-slate-200">FILTERS</div>

      {onClearAll && (
        <div className="px-4 py-2">
          <button
            type="button"
            onClick={onClearAll}
            className="w-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
      <SelectBox
        title="AC type"
        text={['ALL', 'AC', 'NON-AC']}
        value={acFilter}
        onChange={setAcFilter}
      />
      <SelectBox
        title="Seat type"
        text={["ALL", "SEATER", "SLEEPER"]}
        value={seatType}
        onChange={setSeatType}
      />
      <SelectBox
        text={["ALL", "12 AM - 6AM", "6 AM - 12 PM", "12 PM - 6 PM", "6 PM - 12 AM"]}
        title="Pick up time"
        value={pickupTimeFilter}
        onChange={setPickupTimeFilter}
      />
      <SelectBox
        text={["ALL", "12 AM - 6AM", "6 AM - 12 PM", "12 PM - 6 PM", "6 PM - 12 AM"]}
        title="Drop time"
        value={dropTimeFilter}
        onChange={setDropTimeFilter}
      />
      <Checkbox title="Single Seater/Sleeper" text="Single Seats" value={singleSeatsFilter} onChange={setSingleSeatsFilter} />
      <SearchheckBox
        title={`Pick up point - ${from || "Source"}`}
        text={pickupPointOptions}
        selectedPoints={selectedPickupPoints}
        onChange={setSelectedPickupPoints}
        onClear={() => setSelectedPickupPoints([])}
      />
      <SearchheckBox
        title="Operators"
        text={operatorOptions}
        selectedPoints={selectedOperators}
        onChange={setSelectedOperators}
        onClear={() => setSelectedOperators([])}
      />
      <SearchheckBox
        title={`Drop point - ${to || "Destination"}`}
        text={dropPointOptions}
        selectedPoints={selectedDropPoints}
        onChange={setSelectedDropPoints}
        onClear={() => setSelectedDropPoints([])}
      />
      <div className="lg:hidden px-4 py-4">
        <button type="button" onClick={onCloseMobile} className="w-full bg-lime-600 text-white py-3 rounded-lg font-medium hover:bg-lime-700 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
