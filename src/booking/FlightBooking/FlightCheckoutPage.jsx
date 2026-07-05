import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../../NavComponent.jsx";
import { useAuth } from "../../context/AuthContext";
import FlightTimeline from "../FlightBooking/components/FlightTimeline";
import BaggageInfo from "../FlightBooking/components/BaggageInfo";
import CouponsOffers from "../FlightBooking/components/CouponsOffers";
import CancellationPolicy from "../FlightBooking/components/CancellationPolicy";
import ImportantInfo from "../FlightBooking/components/ImportantInfo";
import TravellerDetails from "../FlightBooking/components/TravellerDetails";

export default function FlightCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, fare, serviceType } = location.state || {};
  const { isAuthenticated, user } = useAuth();
  
  const [adults, setAdults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  if (!flight || !fare) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No booking information found</h2>
          <button 
            onClick={() => navigate('/flightbooking')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
          >
            Back to Flight Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      
      {/* CHANGED: Swapped max-w-5xl mx-auto for w-full, and increased horizontal padding (px-6 md:px-12) */}
      <div className="w-full px-6 md:px-12 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              ← Back
            </button>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {flight.journey?.source?.split('(')[0]?.trim()} → {flight.journey?.destination?.split('(')[0]?.trim()}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="font-medium">{flight.flight?.airlineName || "Akasa Air"}</span>
            <span>•</span>
            <span>{flight.journey?.departureDate ? new Date(flight.journey.departureDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : ""}</span>
          </div>
        </div>

        {/* Price Lock Banner - Show only if not authenticated */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Still unsure about this trip? <span className="text-teal-600">Lock this price!</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="bg-white border border-blue-300 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              LOGIN NOW
            </button>
          </div>
        )}

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

        {/* Baggage Info with Extra Baggage Promotion */}
        <BaggageInfo 
          cabin="7 Kgs (1 piece only)"
          checkIn="15 Kgs (1 piece only)"
          route={flight.journey?.source?.match(/\(([^)]+)\)/)?.[1] + '-' + flight.journey?.destination?.match(/\(([^)]+)\)/)?.[1]}
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

        {/* Coupons and Offers */}
        <CouponsOffers />

        {/* Price Summary & Proceed Button */}
        <div className="bg-white rounded-xl shadow-md p-6 sticky bottom-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">MYR {fare.price}</p>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>
            <button 
              onClick={() => navigate('/flight-seat-selection', { 
                state: { 
                  flight, 
                  fare,
                  scheduleId: flight.scheduleId || flight._id
                } 
              })}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}