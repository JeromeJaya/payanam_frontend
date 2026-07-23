import { Plane } from "lucide-react";

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

export default function CompareFlightList({
  comparedFlights,
  onRemoveFromCompare,
  onBookFlight,
}) {
  return (
    <div className="overflow-y-auto max-h-[40vh] divide-y divide-gray-100 dark:divide-slate-700">
      {comparedFlights.map((flight, index) => {
        const airlineName = flight?.flight?.airlineName || flight?.operator?.name || "Unknown";
        const flightNum = flight?.flight?.flightNumber || "";
        const depTime = formatTime(flight?.journey?.departureTime || flight?.schedule?.departureTime);
        const arrTime = formatTime(flight?.journey?.arrivalTime || flight?.schedule?.arrivalTime);
        const fare = flight?.pricing?.calculatedFare || flight?.pricing?.baseFare || 0;
        const duration = calcDuration(flight?.journey?.departureTime, flight?.journey?.arrivalTime);

        return (
          <div key={flight.scheduleId || flight._id || flight.id || index} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Plane size={16} className="text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-gray-900 dark:text-slate-100 truncate">{airlineName}</span>
                {flightNum && <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">{flightNum}</span>}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{depTime}</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500">→</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{arrTime}</span>
                {duration > 0 && <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-1">({fmtDur(duration)})</span>}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">₹{fare.toLocaleString('en-IN')}</span>
              <button
                onClick={() => onBookFlight(flight)}
                className="text-[10px] bg-blue-600 text-white hover:bg-blue-700 font-bold px-2 py-1 rounded-md transition-colors"
                title="Book this flight"
              >
                Book Now
              </button>
              <button
                onClick={() => onRemoveFromCompare(flight)}
                className="text-[10px] text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
                title="Remove"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
