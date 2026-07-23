export default function CitySuggestions({ suggestions, loading, onSelect, onClose }) {
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
      {loading ? (
        <div className="px-4 py-3 text-sm text-slate-500 text-center">Loading...</div>
      ) : suggestions.length > 0 ? (
        suggestions.map((city, index) => (
          <button
            key={index}
            type="button"
            onClick={() => { onSelect(city); onClose?.(); }}
            className="w-full text-left px-4 py-2 hover:bg-lime-50 transition-colors border-b border-slate-100 last:border-b-0"
          >
            <div className="text-sm font-semibold text-slate-900">{city.name}</div>
            <div className="text-xs text-slate-500">{city.state}</div>
          </button>
        ))
      ) : (
        <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
      )}
    </div>
  );
}
