import AirportSuggestions from './AirportSuggestions';

export default function LocationInput({
  label,
  value,
  onChange,
  placeholder = "City or IATA code",
  suggestions,
  showSuggestions,
  onSelectSuggestion,
  resolvedIata,
  resolvedName,
  hasError = false
}) {
  return (
    <div className={`flex-[2] min-w-[160px] sm:min-w-[200px] border rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 transition-colors relative ${
      hasError ? 'border-red-400 bg-red-50' : 'bg-gray-50 border-gray-200'
    }`}>
      <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent font-bold text-sm md:text-base mt-0.5 focus:outline-none text-gray-900"
      />
      {resolvedIata && resolvedName && (
        <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 truncate">
          {resolvedIata} - {resolvedName}
        </div>
      )}
      {value && hasError && (
        <div className="text-[9px] md:text-[10px] text-red-500 font-medium mt-0.5">Select from suggestions below</div>
      )}
      {showSuggestions && (
        <AirportSuggestions suggestions={suggestions} onSelect={onSelectSuggestion} />
      )}
    </div>
  );
}
