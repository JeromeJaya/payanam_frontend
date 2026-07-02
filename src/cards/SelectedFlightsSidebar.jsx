import { X, Minimize2, Maximize2 } from "lucide-react";
import { useState } from "react";

export default function SelectedFlightsSidebar({ comparedFlights, show, onClose, onRemoveFromCompare }) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!show || comparedFlights.length === 0) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 ${isMinimized ? 'h-16' : 'h-full'} w-80 bg-slate-800 text-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
        <div>
          <h3 className="font-black text-lg text-white">Selected flights</h3>
          {!isMinimized && <p className="text-xs text-slate-400">{comparedFlights.length} flight(s) to compare</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Flight List - Hidden when minimized */}
      {!isMinimized && (
        <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {comparedFlights.map((flight, index) => {
          const airlineName = flight?.flight?.airlineName || flight?.operator?.name || "Unknown Airline";
          const departureTime = flight?.journey?.departureTime || flight?.schedule?.departureTime || "--:--";
          const arrivalTime = flight?.journey?.arrivalTime || flight?.schedule?.arrivalTime || "--:--";
          
          // Extract IATA codes from journey.source/destination if available
          const source = flight?.journey?.source || "--";
          const destination = flight?.journey?.destination || "--";
          const departureIATA = source.match(/\(([^)]+)\)/)?.[1] || source.split(' ').pop() || "--";
          const arrivalIATA = destination.match(/\(([^)]+)\)/)?.[1] || destination.split(' ').pop() || "--";
          
          const calculatedFare = flight?.pricing?.calculatedFare || flight?.pricing?.baseFare || 0;

          return (
            <div key={flight.scheduleId || flight.id || index} className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 flex items-center justify-between hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Airline Logo */}
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white shrink-0">
                  <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5" />
                  </svg>
                </div>
                
                {/* Flight Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm text-white">{airlineName}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Time */}
                <div className="text-right">
                  <div className="font-bold text-sm text-white">{departureTime}</div>
                </div>
                
                <span className="text-slate-400">→</span>
                
                <div className="text-right">
                  <div className="font-bold text-sm text-white">{arrivalTime}</div>
                </div>
                
                {/* Price */}
                <div className="text-right">
                  <div className="font-bold text-sm text-blue-400">
                    ₹ {calculatedFare.toLocaleString('en-IN')}
                  </div>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => onRemoveFromCompare(flight)}
                  className="text-slate-400 hover:text-red-400 transition-colors p-1"
                  title="Remove from compare"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Footer with Compare Button - Hidden when minimized */}
      {!isMinimized && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-800">
          <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm uppercase tracking-wide">
            Compare Flights
          </button>
        </div>
      )}
    </div>
    </>
  );
}
