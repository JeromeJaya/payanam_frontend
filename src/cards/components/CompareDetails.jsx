import { X, Plane } from "lucide-react";

function formatTime(t) {
  if (!t) return "--:--";
  const parts = String(t).split(":");
  return parts.length >= 2 ? `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}` : t;
}

function calcDuration(dep, arr) {
  if (!dep || !arr) return null;
  const [dh, dm] = String(dep).split(":").map(Number);
  const [ah, am] = String(arr).split(":").map(Number);
  if (isNaN(dh)||isNaN(dm)||isNaN(ah)||isNaN(am)) return null;
  let mins = ah * 60 + am - (dh * 60 + dm);
  if (mins < 0) mins += 1440;
  return mins;
}

function fmtDur(m) {
  if (!m) return "--";
  return `${Math.floor(m/60)}h ${m%60}m`;
}

function ComparisonRow({ label, flights, getValue, highlight, getNumericValue }) {
  let bestIndex = -1;
  if (highlight && getNumericValue) {
    const values = flights.map(f => getNumericValue(f));
    if (highlight === "lowest") {
      const min = Math.min(...values.filter(v => v > 0));
      bestIndex = values.indexOf(min);
    } else if (highlight === "highest") {
      bestIndex = values.indexOf(Math.max(...values));
    }
  }

  return (
    <tr className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors">
      <td className="py-3.5 px-4 text-gray-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">{label}</td>
      {flights.map((f, i) => {
        const val = getValue(f);
        const isBest = i === bestIndex;
        return (
          <td key={i} className="py-3.5 px-4 text-center">
            <span className={`text-sm ${isBest ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-800 dark:text-slate-200 font-medium'}`}>
              {val}
            </span>
            {isBest && (
              <span className="block text-[9px] text-emerald-500 font-bold uppercase mt-0.5 tracking-wide">Best</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

export default function CompareDetails({
  comparedFlights,
  showComparison,
  onClose,
}) {
  if (!showComparison || comparedFlights.length < 2) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">Compare Flights</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Side by side comparison of {comparedFlights.length} flights</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-slate-600">
                <th className="text-left py-3 px-4 text-gray-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider min-w-[120px]">Feature</th>
                {comparedFlights.map((f, i) => {
                  const name = f?.flight?.airlineName || f?.operator?.name || "Flight";
                  return (
                    <th key={i} className="py-3 px-4 text-center min-w-[150px]">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-1">
                          <Plane size={18} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{name}</div>
                        <div className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">{f?.flight?.flightNumber || ""}</div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <ComparisonRow label="Price" flights={comparedFlights}
                getValue={f => `₹${(f?.pricing?.calculatedFare || f?.pricing?.baseFare || 0).toLocaleString('en-IN')}`}
                highlight="lowest" getNumericValue={f => f?.pricing?.calculatedFare || f?.pricing?.baseFare || 0} />
              <ComparisonRow label="Departure" flights={comparedFlights}
                getValue={f => formatTime(f?.journey?.departureTime || f?.schedule?.departureTime)} />
              <ComparisonRow label="Arrival" flights={comparedFlights}
                getValue={f => formatTime(f?.journey?.arrivalTime || f?.schedule?.arrivalTime)} />
              <ComparisonRow label="Duration" flights={comparedFlights}
                getValue={f => { const dep = f?.journey?.departureTime || f?.schedule?.departureTime; const arr = f?.journey?.arrivalTime || f?.schedule?.arrivalTime; return fmtDur(calcDuration(dep, arr)); }}
                highlight="lowest" getNumericValue={f => { const dep = f?.journey?.departureTime || f?.schedule?.departureTime; const arr = f?.journey?.arrivalTime || f?.schedule?.arrivalTime; return calcDuration(dep, arr) || 0; }} />
              <ComparisonRow label="From" flights={comparedFlights}
                getValue={f => { const src = f?.journey?.source || f?.route?.origin?.city || "--"; return src.split("(")[0]?.trim() || src; }} />
              <ComparisonRow label="To" flights={comparedFlights}
                getValue={f => { const dst = f?.journey?.destination || f?.route?.destination?.city || "--"; return dst.split("(")[0]?.trim() || dst; }} />
              <ComparisonRow label="Stops" flights={comparedFlights}
                getValue={f => { const stops = f?.journey?.stops || f?.route?.layovers || []; return stops.length === 0 ? "Non-stop" : `${stops.length} stop${stops.length > 1 ? 's' : ''}`; }}
                highlight="lowest" getNumericValue={f => (f?.journey?.stops || f?.route?.layovers || []).length} />
              <ComparisonRow label="Aircraft" flights={comparedFlights}
                getValue={f => f?.flight?.aircraftType || f?.aircraft?.type || "--"} />
              <ComparisonRow label="Seats Left" flights={comparedFlights}
                getValue={f => String(f?.seats?.available ?? f?.availableSeats ?? f?.seatAvailability ?? "N/A")}
                highlight="highest" getNumericValue={f => f?.seats?.available ?? f?.availableSeats ?? f?.seatAvailability ?? 0} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
