import { ArrowLeftRight } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import FlightPriceModal from "../booking/FlightBooking/FlightPriceModal.jsx";
import CompareHeader from "./components/CompareHeader";
import CompareFlightList from "./components/CompareFlightList";
import CompareDetails from "./components/CompareDetails";

export default function SelectedFlightsSidebar({ comparedFlights, show, onClose, onRemoveFromCompare, onClearAll }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [bookFlight, setBookFlight] = useState(null);

  const panelRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);

  const initPosition = useCallback(() => {
    if (position) return;
    const pw = panelRef.current?.offsetWidth || Math.min(340, window.innerWidth - 32);
    setPosition({ x: window.innerWidth - pw - 16, y: window.innerHeight - 56 - 16 });
  }, [position]);

  const handlePointerDown = useCallback((e) => {
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
      didDrag.current = false;
      return;
    }
    setIsExpanded(prev => !prev);
  };

  if (!show || comparedFlights.length === 0) return null;

  const panelWidth = typeof window !== 'undefined' ? Math.min(340, window.innerWidth - 32) : 340;
  const panelStyle = position
    ? { position: 'fixed', left: position.x, top: position.y, zIndex: 50, width: panelWidth }
    : { position: 'fixed', bottom: 16, right: 16, zIndex: 50, width: panelWidth };

  return (
    <>
      <div
        ref={panelRef}
        style={panelStyle}
        className={`transition-all duration-300 ${
          isExpanded ? 'max-h-[80vh]' : 'max-h-[56px]'
        } ${isDragging ? 'transition-none select-none' : ''}`}
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">

          <CompareHeader
            comparedFlights={comparedFlights}
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
            onClearAll={onClearAll || onClose}
            onPointerDown={handlePointerDown}
            handleHeaderClick={handleHeaderClick}
          />

          {isExpanded && (
            <>
              <CompareFlightList
                comparedFlights={comparedFlights}
                onRemoveFromCompare={onRemoveFromCompare}
                onBookFlight={(flight) => setBookFlight(flight)}
              />

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
              </div>
            </>
          )}
        </div>
      </div>

      {bookFlight && (
        <FlightPriceModal
          flight={bookFlight}
          onClose={() => setBookFlight(null)}
        />
      )}

      <CompareDetails
        comparedFlights={comparedFlights}
        showComparison={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </>
  );
}
