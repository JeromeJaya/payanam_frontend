import { X, ArrowLeft } from "lucide-react";
import FlightTimeline from "./FlightTimeline";
import CancellationPolicy from "./CancellationPolicy";
import ImportantInfo from "./ImportantInfo";
import TravellerDetails from "./TravellerDetails";

export default function FlightBookingDetails({ flight, fare, onClose, onBack }) {
  if (!flight) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {flight.journey?.source?.split('(')[0]?.trim()} → {flight.journey?.destination?.split('(')[0]?.trim()}
              </h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                <span className="font-medium">{flight.flight?.airlineName || "Akasa Air"}</span>
                <span>•</span>
                <span>{flight.journey?.departureDate ? new Date(flight.journey.departureDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : ""}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Flight Timeline */}
          <FlightTimeline 
            departureTime={flight.journey?.departureTime}
            departureLocation={flight.journey?.source?.split('(')[0]?.trim()}
            departureIATA={flight.journey?.source?.match(/\(([^)]+)\)/)?.[1]}
            arrivalTime={flight.journey?.arrivalTime}
            arrivalLocation={flight.journey?.destination?.split('(')[0]?.trim()}
            arrivalIATA={flight.journey?.destination?.match(/\(([^)]+)\)/)?.[1]}
            durationText={`${Math.floor((flight.journey?.durationMinutes || 180) / 60)}h ${(flight.journey?.durationMinutes || 180) % 60}m`}
            stopsCount={0}
            layovers={[]}
          />

          {/* Cancellation Policy */}
          <CancellationPolicy 
            cancellation="Cancellation fee starts at MYR 213.80 (up to 3 hours before departure)"
            dateChange="Date Change fee starts at MYR 128.26 up to 3 hrs before departure"
          />

          {/* Important Info */}
          <ImportantInfo />

          {/* Traveller Details */}
          <TravellerDetails />

          {/* Price Summary & Book Button */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">MYR {fare?.price || flight.pricing?.calculatedFare || 5000}</p>
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                PROCEED TO PAYMENT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}