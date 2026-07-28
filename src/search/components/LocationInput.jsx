import PlaceSuggestions from './PlaceSuggestions';

export default function LocationInput({
  label,
  value,
  onChange,
  placeholder = "City",
  suggestions,
  showSuggestions,
  onSelectSuggestion,
  hasError = false
}) {
  return (
    <div className={`flex-[2] min-w-[160px] sm:min-w-[200px] border rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors relative ${
      hasError ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700'
    }`}>
      <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent font-bold text-sm md:text-base mt-0.5 focus:outline-none text-gray-900 dark:text-slate-100"
        autoComplete="off"
      />
      {value && hasError && (
        <div className="text-[9px] md:text-[10px] text-red-500 font-medium mt-0.5">Select from suggestions below</div>
      )}
      {showSuggestions && (
        <PlaceSuggestions suggestions={suggestions} onSelect={onSelectSuggestion} />
      )}
    </div>
  );
}
