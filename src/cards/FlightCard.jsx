import { useState } from "react";
import { Plus, MoveRight, Lock, Check } from "lucide-react";
import FlightPriceModal from "../booking/FlightBooking/FlightPriceModal.jsx";
import PriceLockModal from "../booking/FlightBooking/PriceLockModal.jsx";

/**
 * Formats duration from minutes to "Xh Ym" format
 */
function formatDuration(minutes) {
  if (!minutes || isNaN(minutes)) return "--h --m";
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

/**
 * Formats time from "HH:MM:SS" or "HH:MM" to "HH:MM" format
 */
function formatTime(timeValue) {
  if (!timeValue) return "--:--";
  const parts = String(timeValue).split(":");
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return timeValue;
}

/**
 * Calculates duration between two time strings
 */
function calculateDuration(departure, arrival) {
  if (!departure || !arrival) return null;
  
  const [depH, depM] = String(departure).split(":").map(Number);
  const [arrH, arrM] = String(arrival).split(":").map(Number);
  
  if (isNaN(depH) || isNaN(depM) || isNaN(arrH) || isNaN(arrM)) return null;
  
  const depMinutes = depH * 60 + depM;
  let arrMinutes = arrH * 60 + arrM;
  
  if (arrMinutes < depMinutes) {
    arrMinutes += 24 * 60;
  }
  
  return arrMinutes - depMinutes;
}

export default function FlightCard({ 
  flight, 
  isCompared = false, 
  onAddToCompare = () => {}, 
  onRemoveFromCompare = () => {},
  onToggleCompareSidebar = () => {}
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showPriceLock, setShowPriceLock] = useState(false);

  // Extract flight data with defaults
  const airlineName = flight?.flight?.airlineName || flight?.operator?.name || "Unknown Airline";
  const flightNumber = flight?.flight?.flightNumber || flight?.flightNumber || "--";
  const departureTime = formatTime(flight?.journey?.departureTime || flight?.schedule?.departureTime);
  const departureLocation = flight?.journey?.source?.split('(')[0]?.trim() || flight?.route?.origin?.city || flight?.route?.origin?.iataCode || "--";
  const departureIATA = flight?.journey?.source?.match(/\(([^)]+)\)/)?.[1] || flight?.route?.origin?.iataCode || "";
  const arrivalTime = formatTime(flight?.journey?.arrivalTime || flight?.schedule?.arrivalTime);
  const arrivalLocation = flight?.journey?.destination?.split('(')[0]?.trim() || flight?.route?.destination?.city || flight?.route?.destination?.iataCode || "--";
  const arrivalIATA = flight?.journey?.destination?.match(/\(([^)]+)\)/)?.[1] || flight?.route?.destination?.iataCode || "";
  const travelDuration = calculateDuration(flight?.journey?.departureTime || flight?.schedule?.departureTime, flight?.journey?.arrivalTime || flight?.schedule?.arrivalTime);
  const durationText = formatDuration(travelDuration);
  
  // Handle stops/layovers
  const layovers = flight?.journey?.stops || flight?.route?.layovers || [];
  const stopsCount = layovers.length;
  const stopsInfo = stopsCount === 0 
    ? "Non-stop" 
    : stopsCount === 1 
      ? `1 stop via ${layovers[0]?.city || layovers[0]?.iataCode || 'layover'}`
      : `${stopsCount} stops`;
  
  // Pricing
  const originalPrice = flight?.pricing?.baseFare;
  const calculatedFare = flight?.pricing?.calculatedFare || flight?.pricing?.baseFare || 0;
  const fareType = flight?.pricing?.fareType || "";
  
  // Aircraft details
  const aircraftType = flight?.flight?.aircraftType || flight?.aircraft?.type || "";
  const aircraftModel = flight?.flight?.aircraftModel || flight?.aircraft?.model || "";
  const cabinClass = flight?.cabin?.class || flight?.cabinClass || flight?.flight?.cabinClasses?.[0] || "";
  
  // Available seats
  const availableSeats = flight?.seats?.available ?? flight?.availableSeats ?? flight?.seatAvailability ?? "N/A";
  
  // Promotions
  const topPromoText = fareType ? `${fareType} FARE` : "";
  const bottomPromoText = flight?.promotions?.[0] || "";

  return (
    <div className="w-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-md dark:shadow-slate-900/30 hover:shadow-lg transition-all duration-300 font-sans text-gray-900 dark:text-slate-100 overflow-hidden mb-4">
      
      {/* 1. Top Mini Banner Accent */}
      {topPromoText && (
        <div className="bg-amber-50/80 dark:bg-amber-900/20 px-4 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 border-b border-gray-100/60 dark:border-slate-700 tracking-wide uppercase">
          {topPromoText}
        </div>
      )}

      {/* 2. Main Flight Info Module Container */}
      <div className="p-4 sm:p-5 lg:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-6">
        
        {/* Airline Identity Block */}
        <div className="flex items-center gap-3 lg:min-w-[200px] max-w-full">
          <div className="w-11 h-11 bg-indigo-950 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
            <svg className="w-6 h-6 rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5" />
            </svg>
          </div>
            <div className="min-w-0">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100 leading-tight truncate">{airlineName}</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 font-medium tracking-tight mt-0.5">{flightNumber}</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {aircraftType && (
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                  {aircraftType}
                </span>
              )}
              {cabinClass && (
                <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                  {cabinClass}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Route/Timeline Grid Block */}
        <div className="flex flex-row items-center justify-between sm:justify-center gap-2 sm:gap-6 lg:flex-1 w-full border-y border-dashed border-gray-100 dark:border-slate-700 py-3 lg:py-0 lg:border-none">
          
          {/* Departure block element */}
          <div className="text-left sm:text-center min-w-[75px] xs:min-w-[90px]">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight">{departureTime}</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-bold mt-0.5 truncate">{departureLocation}</p>
            {departureIATA && (
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase">({departureIATA})</p>
            )}
          </div>

          {/* Graphical Duration Vector */}
          <div className="flex-1 max-w-[160px] text-center px-1">
            <span className="text-[11px] text-gray-500 dark:text-slate-400 font-bold whitespace-nowrap">{durationText}</span>
            <div className="relative my-1.5 flex items-center justify-center">
              <div className="w-full h-[3px] bg-amber-400 rounded-full" />
              {stopsCount > 0 && (
                <div className="absolute w-2 h-2 bg-orange-500 rounded-full border border-white dark:border-slate-800 shadow-sm" style={{ left: '50%' }} />
              )}
              <div className="absolute w-2 h-2 bg-gray-400 dark:bg-slate-500 rounded-full border border-white dark:border-slate-800 shadow-sm right-0" />
            </div>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold block hover:underline cursor-pointer transition whitespace-nowrap">
              {stopsInfo}
            </span>
          </div>

          {/* Arrival block element */}
          <div className="text-right sm:text-center min-w-[75px] xs:min-w-[90px]">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight">{arrivalTime}</h2>
            <p className="text-xs text-gray-900 dark:text-slate-300 font-bold mt-0.5 truncate">{arrivalLocation}</p>
            {arrivalIATA && (
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase">({arrivalIATA})</p>
            )}
          </div>
        </div>

        {/* Pricing Actions Wrap Engine */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 w-full lg:w-auto lg:min-w-[220px] pt-1 lg:pt-0">
          
          {/* Prices Metadata Segment */}
          <div className="flex flex-col lg:items-end">
            <div className="flex items-baseline gap-2">
              {originalPrice && originalPrice !== calculatedFare && (
                <span className="text-xs line-through text-gray-400 dark:text-slate-500 font-medium">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
                ₹{calculatedFare.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 lg:justify-end mt-0.5">
              <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">/adult</span>
              {availableSeats !== "N/A" && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                  {availableSeats} left
                </span>
              )}
            </div>
          </div>

          {/* Interactive Action CTA Matrix */}
          <div className="flex items-center gap-2 max-w-[60%] lg:max-w-none">
            <button 
              onClick={() => setShowPriceLock(true)}
              className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 hover:bg-blue-100/80 dark:hover:bg-blue-900/30 transition-colors px-3 py-2 rounded-xl text-xs font-bold focus:outline-none"
            >
              <Lock size={12} className="text-blue-500" />
              <span className="whitespace-nowrap">Lock Price</span>
              <MoveRight size={12} />
            </button>

            <button 
              onClick={() => setShowPriceModal(true)}
              className="bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] font-extrabold text-xs px-4 sm:px-5 py-2.5 rounded-xl transition-all uppercase tracking-wide shadow-md shadow-blue-100 whitespace-nowrap focus:outline-none"
            >
              View Prices
            </button>
          </div>

        </div>
      </div>

      {/* 3. Utility Feature Utilities Line */}
      <div className="px-4 sm:px-5 lg:px-6 pb-3">
        <button 
          onClick={() => {
            if (isCompared) {
              onRemoveFromCompare();
            } else {
              onAddToCompare();
              onToggleCompareSidebar();
            }
          }}
          className={`flex items-center gap-1 text-xs font-bold transition-colors focus:outline-none ${
            isCompared ? 'text-emerald-600' : 'text-blue-600 hover:text-blue-800'
          }`}
        >
          {isCompared ? (
            <span className="flex items-center gap-1">Added to compare <Check size={14} /></span>
          ) : (
            <span className="flex items-center gap-1">Add to compare <Plus size={14} /></span>
          )}
        </button>
      </div>

      {/* 4. Bottom Custom Promotion Strip Element */}
      {bottomPromoText && (
        <div className="bg-orange-50/60 dark:bg-orange-900/10 border-t border-orange-100/60 dark:border-slate-700 px-4 sm:px-5 lg:px-6 py-2.5 flex flex-col xs:flex-row xs:items-center justify-between gap-2 text-xs text-gray-800 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block shrink-0" />
            <p className="truncate text-gray-700 dark:text-slate-300">{bottomPromoText}</p>
          </div>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] text-blue-600 font-bold hover:text-blue-800 shrink-0 text-left xs:text-right focus:outline-none transition-colors"
          >
            {showDetails ? "Hide Details" : "View Flight Details"}
          </button>
        </div>
      )}

      {/* Dynamic Expansion Drawer Panel */}
      {showDetails && (
        <div className="p-4 sm:p-5 bg-gray-50/80 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700 text-xs text-gray-600 dark:text-slate-400 transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="font-bold text-gray-900 dark:text-slate-200 mb-1">Flight Spec Information</p>
              <p><span className="text-gray-400 dark:text-slate-500 font-medium">Aircraft:</span> {aircraftType || "N/A"} {aircraftModel}</p>
              <p><span className="text-gray-400 dark:text-slate-500 font-medium">Flight Number:</span> {flightNumber}</p>
              <p><span className="text-gray-400 dark:text-slate-500 font-medium">Total Duration:</span> {durationText}</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-gray-900 dark:text-slate-200 mb-1">Transit & Route Map</p>
              <p><span className="text-gray-400 dark:text-slate-500 font-medium">From:</span> {departureLocation} ({departureIATA})</p>
              <p><span className="text-gray-400 dark:text-slate-500 font-medium">To:</span> {arrivalLocation} ({arrivalIATA})</p>
              {stopsCount > 0 && (
                <p className="truncate"><span className="text-gray-400 dark:text-slate-500 font-medium">Layovers:</span> {layovers.map(l => l.city || l.iataCode).join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Flight Price Modal */}
      {showPriceModal && (
        <FlightPriceModal 
          flight={flight} 
          onClose={() => setShowPriceModal(false)} 
        />
      )}

      {/* Price Lock Modal */}
      <PriceLockModal
        isOpen={showPriceLock}
        onClose={() => setShowPriceLock(false)}
        flight={flight}
        onLockSuccess={(lock) => {
          console.log('Price locked:', lock);
        }}
      />
    </div>
  );
}
