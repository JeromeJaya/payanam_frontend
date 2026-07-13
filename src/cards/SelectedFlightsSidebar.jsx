import { X, Trash2, ArrowLeftRight, ChevronUp, ChevronDown, Plane, GripHorizontal } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

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

export default function SelectedFlightsSidebar({ comparedFlights, show, onClose, onRemoveFromCompare, onClearAll }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  // ─── Drag State ───────────────────────────────────────────────────────
  const panelRef = useRef(null);
  const [position, setPosition] = useState(null); // { x, y } — null means default CSS position
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false); // tracks if pointer actually moved (to suppress click)

  // Initialize position to bottom-right on first render
  const initPosition = useCallback(() => {
    if (position) return;
    const pw = panelRef.current?.offsetWidth || Math.min(340, window.innerWidth - 32);
    setPosition({ x: window.innerWidth - pw - 16, y: window.innerHeight - 56 - 16 });
  }, [position]);

  const handlePointerDown = useCallback((e) => {
    // Only left mouse button
    if (e.button !== 0) return;
    didDrag.current = false;
    initPosition();
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setIsDragging(true);
    e.preventDefault();
  }, [initPosition]);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e) => {
      didDrag.current = true;
      const pw = panelRef.current?.offsetWidth || 340;
      const ph = panelRef.current?.offsetHeight || 56;
      const newX = Math.max(0, Math.min(window.innerWidth - pw, e.clientX - dragOffset.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - ph, e.clientY - dragOffset.current.y));
      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  const handleHeaderClick = () => {
    if (didDrag.current) {
      didDrag.current = false; // consume the flag
      return; // don't toggle
    }
    setIsExpanded(prev => !prev);
  };

  if (!show || comparedFlights.length === 0) return null;

  // Build inline style for positioning
  const panelWidth = typeof window !== 'undefined' ? Math.min(340, window.innerWidth - 32) : 340;
  const panelStyle = position
    ? { position: 'fixed', left: position.x, top: position.y, zIndex: 50, width: panelWidth }
    : { position: 'fixed', bottom: 16, right: 16, zIndex: 50, width: panelWidth };

  return (
    <>
      {/* Draggable Panel */}
      <div
        ref={panelRef}
        style={panelStyle}
        className={`transition-all duration-300 ${
          isExpanded ? 'max-h-[80vh]' : 'max-h-[56px]'
        } ${isDragging ? 'transition-none select-none' : ''}`}
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          
          {/* Drag Handle Header Bar */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onClick={handleHeaderClick}
          >
            <div className="flex items-center gap-2.5">
              {/* Grip indicator */}
              <GripHorizontal size={14} className="text-white/40 shrink-0" />
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <ArrowLeftRight size={14} className="text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-sm">{comparedFlights.length} Flight{comparedFlights.length > 1 ? 's' : ''} to compare</span>
                <span className="text-blue-200 text-xs ml-2">(max 4)</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
              <button
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <>
              {/* Flight List */}
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
                      {/* Airline icon */}
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <Plane size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>

                      {/* Flight info */}
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

                      {/* Price + Remove */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">₹{fare.toLocaleString('en-IN')}</span>
                        <button
                          onClick={() => onRemoveFromCompare(flight)}
                          className="text-[10px] text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Actions */}
              <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex items-center gap-2">
                {comparedFlights.length > 1 && (
                  <button
                    onClick={() => setShowComparison(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wide"
                  >
                    <ArrowLeftRight size={13} />
                    Compare Side by Side
                  </button>
                )}
                {comparedFlights.length === 1 && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 text-center flex-1">Add more flights to compare</p>
                )}
                {comparedFlights.length > 1 && (
                  <button
                    onClick={() => { if (onClearAll) onClearAll(); else onClose(); }}
                    className="p-2 rounded-lg text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Clear all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Comparison Modal */}
      {showComparison && comparedFlights.length >= 2 && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowComparison(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">Compare Flights</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Side by side comparison of {comparedFlights.length} flights</p>
              </div>
              <button onClick={() => setShowComparison(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Comparison Table */}
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
                  <ComparisonRow label="Cabin" flights={comparedFlights}
                    getValue={f => f?.cabin?.class || f?.cabinClass || "--"} />
                  <ComparisonRow label="Seats Left" flights={comparedFlights}
                    getValue={f => String(f?.seats?.available ?? f?.availableSeats ?? f?.seatAvailability ?? "N/A")}
                    highlight="highest" getNumericValue={f => f?.seats?.available ?? f?.availableSeats ?? f?.seatAvailability ?? 0} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Comparison row — highlights best value in green
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
