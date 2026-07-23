export default function AirportSuggestions({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {suggestions.map((airport) => (
        <div
          key={airport.iataCode || airport.city}
          onClick={() => onSelect(airport)}
          className="px-3 md:px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
        >
          <div className="font-medium text-xs md:text-sm text-gray-900 truncate">
            <span className="text-blue-600 font-bold">{airport.iataCode}</span> - {airport.city}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 truncate">{airport.name}</div>
        </div>
      ))}
    </div>
  );
}
