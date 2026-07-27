export default function FlightPlace({ items, activeIndex, setActiveIndex, onSelect }) {
    if (!items || items.length === 0) return null;

    return (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
            {items.map((item, index) => (
                <li
                    key={index}
                    onClick={() => onSelect(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`px-3 py-2 text-sm cursor-pointer transition-colors border-b border-slate-100 last:border-b-0 ${
                        index === activeIndex
                            ? 'bg-lime-50 text-lime-700'
                            : 'text-slate-700 hover:bg-lime-50 hover:text-lime-700'
                    }`}
                >
                    {typeof item === 'object' ? (
                        <>
                            <div className="font-medium truncate">{item.displayText || `${item.city} (${item.iataCode})`}</div>
                            <div className="text-xs text-slate-500 truncate">{item.name}</div>
                        </>
                    ) : (
                        <div className="truncate">{item}</div>
                    )}
                </li>
            ))}
        </ul>
    )
}
