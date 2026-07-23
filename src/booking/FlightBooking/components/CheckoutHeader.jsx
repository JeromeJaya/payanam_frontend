export default function CheckoutHeader({ tripType, isMultiLeg, flightList, primaryFlight }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6 mt-15">
      {isMultiLeg ? (
        <>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            {tripType === 'Round Trip' ? 'Round Trip' : 'Multi-City'} Itinerary
          </h1>
          <div className="space-y-2 mt-3">
            {flightList.map((f, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-700 rounded-lg p-2">
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {tripType === 'Multi City' ? `Leg ${idx + 1}` : idx === 0 ? 'Outbound' : 'Return'}:
                </span>
                <span className="font-medium">
                  {f.journey?.source?.split('(')[0]?.trim()} → {f.journey?.destination?.split('(')[0]?.trim()}
                </span>
                <span className="text-gray-400">|</span>
                <span>{f.flight?.airlineName || "Flight"}</span>
                <span className="text-gray-400">|</span>
                <span>{f.journey?.departureDate ? new Date(f.journey.departureDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : ""}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            {primaryFlight.journey?.source?.split('(')[0]?.trim()} → {primaryFlight.journey?.destination?.split('(')[0]?.trim()}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
            <span className="font-medium">{primaryFlight.flight?.airlineName || "Akasa Air"}</span>
            <span>•</span>
            <span>{primaryFlight.journey?.departureDate ? new Date(primaryFlight.journey.departureDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : ""}</span>
          </div>
        </>
      )}
    </div>
  );
}
