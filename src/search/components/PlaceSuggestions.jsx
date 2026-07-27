export default function PlaceSuggestions({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {suggestions.map((place, index) => (
        <div
          key={index}
          onClick={() => onSelect(place)}
          className="px-3 md:px-4 py-2 hover:bg-lime-50 dark:hover:bg-lime-900/20 cursor-pointer border-b border-gray-100 dark:border-slate-700 last:border-b-0"
        >
          <div className="font-medium text-xs md:text-sm text-gray-900 dark:text-slate-100 truncate">
            {place.name}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 dark:text-slate-400 truncate">{place.state}</div>
        </div>
      ))}
    </div>
  );
}
