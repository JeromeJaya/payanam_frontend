export default function FlightPlace({service, from, to, selectFrom, selectTo, fromAirportSuggestions,toAirportSuggestions, allDestinations, isFromField, isToField }) {
    return (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                        {service === 'flight' && isFromField && fromAirportSuggestions.map((airport, index) => (
                          <li
                            key={index}
                            onClick={() => selectFrom(airport)}
                            className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-medium">{airport.displayText || `${airport.city} (${airport.iataCode})`}</div>
                            <div className="text-xs text-slate-500">{airport.name}</div>
                          </li>
                        ))}
                        {service === 'flight' && isToField && toAirportSuggestions.map((airport, index) => (
                          <li
                            key={index}
                            onClick={() => selectTo(airport)}
                            className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-medium">{airport.displayText || `${airport.city} (${airport.iataCode})`}</div>
                            <div className="text-xs text-slate-500">{airport.name}</div>
                          </li>
                        ))}
                        {service !== 'flight' && (isFromField ? 
                          allDestinations.filter(d => d.toLowerCase().includes(from.toLowerCase())) :
                          allDestinations.filter(d => d.toLowerCase().includes(to.toLowerCase()))
                        ).slice(0, 5).map((item, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              if (isFromField) selectFrom(item);
                              else if (isToField) selectTo(item);
                            }}
                            className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
    )
}
