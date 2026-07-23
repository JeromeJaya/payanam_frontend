import SearchheckBox from "../../../filter/SearchheckBox.jsx"
import SelectBox from "../../../filter/SelectBox.jsx"

export default function FlightFilterPanel({
  filters,
  cabinClassOptions,
  airlineOptions,
  priceMsg,
  onFilterChange,
  onMinPriceBlur,
  onMaxPriceBlur,
  onResetFilters,
  showMobileFilters,
}) {
  return (
    <div className={`filter bg-white dark:bg-slate-800 w-full lg:w-[25%] rounded-lg shadow-xl dark:shadow-slate-900/30 p-4 ${showMobileFilters ? 'block' : 'hidden lg:block'} lg:sticky lg:top-40 lg:self-start lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto z-[5]`}>
      <div className="flex justify-center mb-4 font-bold text-lg text-slate-800 dark:text-slate-200">FILTERS</div>

      <SelectBox
        text={["ANY", ...cabinClassOptions]}
        title="Cabin Class"
        value={filters.cabinClass}
        onChange={(option) => onFilterChange("cabinClass", option)}
      />

      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg m-2">
        <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">Price Range</label>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
            onBlur={onMinPriceBlur}
            className={`w-1/2 p-2 border rounded text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 ${
              filters.minPrice && filters.maxPrice && Number(filters.minPrice) > Number(filters.maxPrice)
                ? 'border-red-500 dark:border-red-400'
                : Number(filters.minPrice) < 0
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-gray-300 dark:border-slate-600'
            }`}
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
            onBlur={onMaxPriceBlur}
            className={`w-1/2 p-2 border rounded text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 ${
              filters.minPrice && filters.maxPrice && Number(filters.minPrice) > Number(filters.maxPrice)
                ? 'border-red-500 dark:border-red-400'
                : Number(filters.maxPrice) < 0
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-gray-300 dark:border-slate-600'
            }`}
          />
        </div>
        {priceMsg && (
          <p className={`text-xs mt-1 ${priceMsg.startsWith('Range') ? 'text-gray-500 dark:text-slate-400' : 'text-red-500 dark:text-red-400'}`}>
            {priceMsg}
          </p>
        )}
      </div>

      <SearchheckBox
        title="Airlines"
        text={airlineOptions}
        selectedPoints={filters.airlines}
        onChange={(selected) => onFilterChange("airlines", selected)}
        onClear={() => onFilterChange("airlines", [])}
      />

      <div className="p-4 flex gap-2">
        <button
          onClick={onResetFilters}
          className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
