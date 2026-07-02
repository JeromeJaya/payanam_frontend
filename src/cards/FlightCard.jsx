import { useState } from "react";
import { Plus, MoveRight, Lock, ShieldCheck } from "lucide-react";
import FlightDetailsModal from "./FlightDetailsModal.jsx";

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
  
  // Handle overnight flights
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
  
  // Available seats
  const availableSeats = flight?.seats?.available ?? flight?.availableSeats ?? flight?.seatAvailability ?? "N/A";
  
  // Promotions
  const topPromoText = fareType ? `${fareType} FARE` : "";
  const bottomPromoText = flight?.promotions?.[0] || "";
  
  // Rating
  const rating = flight?.flight?.rating || "N/A";

  return (
    <div className="w-full bg-white border border-gray-100 rounded-sm shadow-sm font-sans text-gray-900 select-none overflow-hidden mb-4">
      
      {/* 1. Top Mini Banner Accent */}
      {topPromoText && (
        <div className="bg-orange-50/60 px-4 py-1 text-xs font-semibold text-amber-900 border-b border-gray-100 tracking-wide">
          {topPromoText}
        </div>
      )}

      {/* 2. Main Flight Info Row */}
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Airline Brand Block */}
        <div className="flex items-center gap-3 min-w-[180px]">
          {/* Logo Box */}
          <div className="w-10 h-10 bg-indigo-900 rounded flex items-center justify-center text-white shrink-0 shadow-sm">
            <svg className="w-6 h-6 rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5" />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-base text-gray-900 leading-tight">{airlineName}</h3>
            <p className="text-[11px] text-gray-400 font-medium tracking-tight mt-0.5">{flightNumber}</p>
            {aircraftType && (
              <p className="text-[10px] text-gray-500 mt-0.5">{aircraftType} {aircraftModel}</p>
            )}
          </div>
        </div>

        {/* Departure Block */}
        <div className="text-left md:text-center min-w-[100px]">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{departureTime}</h2>
          <p className="text-xs text-gray-500 font-bold mt-0.5">{departureLocation}</p>
          {departureIATA && (
            <p className="text-[10px] text-gray-400 font-medium">({departureIATA})</p>
          )}
        </div>

        {/* Route / Stop / Duration Graphic Block */}
        <div className="flex-1 max-w-[200px] text-center px-2">
          <span className="text-[11px] text-gray-500 font-medium">{durationText}</span>
          {/* Progress bar line representation */}
          <div className="relative my-1 flex items-center justify-center">
            <div className="w-full h-[3px] bg-amber-400 rounded-full" />
            {stopsCount > 0 && (
              <div className="absolute w-2 h-2 bg-orange-400 rounded-full border border-white shadow-sm" style={{ left: '50%' }} />
            )}
            <div className="absolute w-2 h-2 bg-gray-400 rounded-full border border-white shadow-sm" />
          </div>
          <span className="text-[11px] text-blue-600 font-bold block hover:underline cursor-pointer">
            {stopsInfo}
          </span>
        </div>

        {/* Arrival Block */}
        <div className="text-left md:text-center min-w-[140px]">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{arrivalTime}</h2>
          <p className="text-xs text-gray-900 font-black mt-0.5">{arrivalLocation}</p>
          {arrivalIATA && (
            <p className="text-[10px] text-gray-400 font-medium">({arrivalIATA})</p>
          )}
        </div>

        {/* Pricing Actions Wrapper */}
        <div className="flex flex-col items-end justify-center min-w-[220px] ml-auto relative">
          
          {/* Special Fare Badge Indicator */}
          {fareType && (
            <span className="bg-red-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 scale-95 origin-right mb-1 shadow-sm">
              {fareType}
              <span className="w-3 h-3 bg-white/20 rounded-full flex items-center justify-center text-[8px]">i</span>
            </span>
          )}

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2">
            {originalPrice && originalPrice !== calculatedFare && (
              <span className="text-xs line-through text-gray-400 font-medium">
                ₹ {originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              ₹ {calculatedFare.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium mt-px">/adult</span>
          
          {availableSeats !== "N/A" && (
            <span className="text-[10px] text-green-600 font-medium mt-0.5">
              {availableSeats} seats available
            </span>
          )}

          {/* Action Trigger Buttons */}
          <div className="mt-3 flex items-center gap-2 w-full justify-end">
            {/* Price Lock Overlay Option */}
            <button className="flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded text-xs font-bold shadow-sm">
              <Lock size={12} className="text-blue-500" />
              Lock Price
              <MoveRight size={12} />
            </button>

            {/* Core Submit Tab */}
            <button className="bg-blue-50 border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white font-extrabold text-xs px-5 py-2.5 rounded transition-all uppercase tracking-wide shadow-sm">
              View Prices
            </button>
          </div>

        </div>
      </div>

      {/* 3. Utility Feature Row: Add to Compare */}
      <div className="px-4 pb-2 -mt-1">
        <button 
          onClick={() => {
            if (isCompared) {
              onRemoveFromCompare();
            } else {
              onAddToCompare();
              onToggleCompareSidebar();
            }
          }}
          className={`flex items-center gap-1 text-xs font-bold transition-colors ${
            isCompared ? 'text-green-600' : 'text-blue-600 hover:text-blue-800'
          }`}
        >
          {isCompared ? (
            <>Added to compare ✓</>
          ) : (
            <>
              Add to compare <Plus size={14} />
            </>
          )}
        </button>
      </div>

      {/* 4. Footer Promo Stripe Block */}
      {bottomPromoText && (
        <div className="bg-orange-50 border-t border-orange-100/70 px-4 py-2 flex items-center gap-2 text-xs text-gray-800 font-medium">
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block shrink-0" />
          <p className="truncate flex-1">{bottomPromoText}</p>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] text-blue-600 font-bold hover:underline shrink-0 ml-4"
          >
            View Flight Details
          </button>
        </div>
      )}

      {/* Dynamic Drawer Component Display */}
      {showDetails && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-gray-900 mb-1">Flight Details</p>
              <p>Aircraft: {aircraftType} {aircraftModel}</p>
              <p>Flight Number: {flightNumber}</p>
              <p>Duration: {durationText}</p>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">Route Details</p>
              <p>From: {departureLocation} ({departureIATA})</p>
              <p>To: {arrivalLocation} ({arrivalIATA})</p>
              {stopsCount > 0 && (
                <p>Layovers: {layovers.map(l => l.city || l.iataCode).join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}