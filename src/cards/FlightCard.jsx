import { useState } from "react";
import FlightPriceModal from "../booking/FlightBooking/FlightPriceModal.jsx";
import PriceLockModal from "../booking/FlightBooking/PriceLockModal.jsx";
import FlightCardHeader from "./components/FlightCardHeader";
import FlightJourneyDetails from "./components/FlightJourneyDetails";
import FlightFareSection from "./components/FlightFareSection";
import FlightCompareButton from "./components/FlightCompareButton";

function formatDuration(minutes) {
  if (!minutes || isNaN(minutes)) return "--h --m";
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

function formatTime(timeValue) {
  if (!timeValue) return "--:--";
  const parts = String(timeValue).split(":");
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return timeValue;
}

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
  isSelected = false,
  onAddToCompare = () => {},
  onRemoveFromCompare = () => {},
  onSelect = null
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showPriceLock, setShowPriceLock] = useState(false);

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

  const layovers = flight?.journey?.stops || flight?.route?.layovers || [];
  const stopsCount = layovers.length;
  const stopsInfo = stopsCount === 0
    ? "Non-stop"
    : stopsCount === 1
      ? `1 stop via ${layovers[0]?.city || layovers[0]?.iataCode || 'layover'}`
      : `${stopsCount} stops`;

  const originalPrice = flight?.pricing?.baseFare;
  const calculatedFare = flight?.pricing?.calculatedFare || flight?.pricing?.baseFare || 0;
  const fareType = flight?.pricing?.fareType || "";

  const aircraftType = flight?.flight?.aircraftType || flight?.aircraft?.type || "";
  const aircraftModel = flight?.flight?.aircraftModel || flight?.aircraft?.model || "";
  const cabinClassesList = flight?.flight?.cabinClasses || flight?.cabinClasses || [];
  const cabinClass = flight?.cabin?.class || flight?.cabinClass || cabinClassesList[0] || "";

  const availableSeats = flight?.seats?.available ?? flight?.availableSeats ?? flight?.seatAvailability ?? "N/A";

  const topPromoText = fareType ? `${fareType} FARE` : "";
  const bottomPromoText = flight?.promotions?.[0] || "";

  const handleViewPrice = () => {
    if (onSelect) {
      onSelect();
    } else {
      setShowPriceModal(true);
    }
  };

  return (
    <div className={`w-full bg-white dark:bg-slate-800 border rounded-xl shadow-md dark:shadow-slate-900/30 hover:shadow-lg transition-all duration-300 font-sans text-gray-900 dark:text-slate-100 overflow-hidden ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-gray-100 dark:border-slate-700'
    }`}>
      <div className="p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-5 lg:gap-6">
        <FlightCardHeader
          airlineName={airlineName}
          flightNumber={flightNumber}
          aircraftType={aircraftType}
          cabinClassesList={cabinClassesList}
          cabinClass={cabinClass}
          topPromoText={topPromoText}
          isSelected={isSelected}
        />

        <FlightJourneyDetails
          departureTime={departureTime}
          departureLocation={departureLocation}
          departureIATA={departureIATA}
          arrivalTime={arrivalTime}
          arrivalLocation={arrivalLocation}
          arrivalIATA={arrivalIATA}
          durationText={durationText}
          stopsCount={stopsCount}
          stopsInfo={stopsInfo}
        />

        <FlightFareSection
          calculatedFare={calculatedFare}
          originalPrice={originalPrice}
          availableSeats={availableSeats}
          onSelect={onSelect}
          isSelected={isSelected}
          onLockClick={() => setShowPriceLock(true)}
          onViewPriceClick={handleViewPrice}
        />
      </div>

      <div className="px-4 sm:px-5 lg:px-6 pb-3">
        <FlightCompareButton
          isCompared={isCompared}
          onAddToCompare={onAddToCompare}
          onRemoveFromCompare={onRemoveFromCompare}
        />
      </div>

      {bottomPromoText && (
        <div className="bg-orange-50/60 dark:bg-orange-900/10 border-t border-orange-100/60 dark:border-slate-700 px-4 sm:px-5 lg:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-800 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block shrink-0" />
            <p className="truncate text-gray-700 dark:text-slate-300">{bottomPromoText}</p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] text-blue-600 font-bold hover:text-blue-800 shrink-0 text-left sm:text-right focus:outline-none transition-colors"
          >
            {showDetails ? "Hide Details" : "View Flight Details"}
          </button>
        </div>
      )}

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

      {showPriceModal && (
        <FlightPriceModal
          flight={flight}
          onClose={() => setShowPriceModal(false)}
        />
      )}

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
