import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../../NavComponent.jsx";
import { useAuth } from "../../context/AuthContext";
import { useRazorpay } from "../../hooks/useRazorpay.jsx";
import { ShieldCheck, Loader2, CheckCircle, CreditCard } from "lucide-react";
import api from "../../api/axios";
import FlightTimeline from "../FlightBooking/components/FlightTimeline";
import BaggageInfo from "../FlightBooking/components/BaggageInfo";
import CouponsOffers from "../FlightBooking/components/CouponsOffers";
import CancellationPolicy from "../FlightBooking/components/CancellationPolicy";
import ImportantInfo from "../FlightBooking/components/ImportantInfo";
import TravellerDetails from "../FlightBooking/components/TravellerDetails";

export default function FlightCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    flight, 
    flights, // Array of flights for round-trip/multi-city
    tripType = 'One Way',
    legs, // Multi-city legs info
    fare, 
    serviceType, 
    selectedSeats, 
    scheduleId: routeScheduleId 
  } = location.state || {};
  const { isAuthenticated, user } = useAuth();

  // Determine if this is a multi-leg booking
  const isMultiLeg = tripType === 'Round Trip' || tripType === 'Multi City';
  const flightList = flights || (flight ? [flight] : []);
  const primaryFlight = flight || flightList[0];

  const [adults, setAdults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [booking, setBooking] = useState({ status: "idle", message: "", data: null });

  // Razorpay hook
  const {
    initiatePayment,
    isProcessing: isPaymentProcessing,
    paymentStatus,
    paymentData,
    error: paymentError,
    resetPayment,
  } = useRazorpay();

  // Determine if we're in "payment mode" (returned from seat selection with seats picked)
  const hasSelectedSeats = selectedSeats && selectedSeats.length > 0;
  
  // Calculate total amount based on trip type
  const calculateTotalAmount = () => {
    if (isMultiLeg) {
      return flightList.reduce((sum, f) => {
        const flightFare = f?.pricing?.calculatedFare || f?.pricing?.baseFare || 0;
        if (hasSelectedSeats) {
          return sum + selectedSeats.reduce((seatSum, seat) => 
            seatSum + ((seat.isExtraLegroom || seat.seatType === "extra-legroom") ? flightFare + 100 : flightFare), 0
          );
        }
        return sum + flightFare;
      }, 0);
    }
    
    // One-way
    const singleFare = fare?.price || primaryFlight?.pricing?.calculatedFare || primaryFlight?.pricing?.baseFare || 0;
    return hasSelectedSeats
      ? selectedSeats.reduce((sum, seat) => sum + ((seat.isExtraLegroom || seat.seatType === "extra-legroom") ? singleFare + 100 : singleFare), 0)
      : singleFare;
  };
  
  const totalAmount = calculateTotalAmount();

  // Handle payment result from Razorpay
  useEffect(() => {
    if (paymentStatus === "success" && paymentData) {
      setBooking({ status: "success", message: "Flight booking confirmed!", data: paymentData });
      
      // Extract IATA codes from journey source/destination (e.g., "Delhi (DEL)" -> "DEL")
      const sourceIATA = primaryFlight?.journey?.source?.match(/\(([^)]+)\)/)?.[1] || "";
      const destIATA = primaryFlight?.journey?.destination?.match(/\(([^)]+)\)/)?.[1] || "";
      const sourceCity = primaryFlight?.journey?.source?.split('(')[0]?.trim() || "";
      const destCity = primaryFlight?.journey?.destination?.split('(')[0]?.trim() || "";
      
      setTimeout(() => {
        navigate("/ticketdetails", {
          state: {
            ticket: paymentData.booking,
            meta: {
              flightName: primaryFlight?.flight?.airlineName || "Akasa Air",
              flightNumber: primaryFlight?.flight?.flightNumber || "",
              aircraftType: primaryFlight?.flight?.aircraftType || "",
              boarding: {
                city: sourceCity,
                name: primaryFlight?.journey?.departureTerminal || "Terminal",
                time: primaryFlight?.journey?.departureTime || "",
                iata: sourceIATA,
                date: primaryFlight?.journey?.departureDate,
              },
              dropping: {
                city: destCity,
                name: primaryFlight?.journey?.arrivalTerminal || "Terminal",
                time: primaryFlight?.journey?.arrivalTime || "",
                iata: destIATA,
                date: primaryFlight?.journey?.arrivalDate,
              },
              passengers: selectedSeats?.map((seat, i) => ({
                name: `Passenger ${i + 1}`,
                seatNumber: seat.seatNumber,
                age: 28,
                gender: "male",
              })) || [],
              payment: paymentData.payment,
              tripType,
              serviceType: "flight",
              allFlights: flightList,
            },
          },
        });
      }, 2000);
    } else if (paymentStatus === "failed") {
      setBooking({ status: "error", message: paymentError || "Payment failed. Please try again." });
    }
  }, [paymentStatus, paymentData, paymentError, navigate, primaryFlight, selectedSeats, tripType, flightList]);

  const handlePayAndBook = async () => {
    if (!hasSelectedSeats) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setBooking({ status: "loading", message: "Creating booking...", data: null });

    try {
      const passengerDetails = selectedSeats.map((seat, i) => ({
        seatNumber: seat.seatNumber,
        name: user?.name || `Passenger ${i + 1}`,
        age: 28, // Default age — should come from traveller details form
        gender: "male",
      }));

      // For multi-leg, create bookings for each leg
      if (isMultiLeg && flightList.length > 1) {
        const bookingResults = [];
        for (const f of flightList) {
          const schedId = f.scheduleId || f._id;
          const bookingRes = await api.post("/api/v1/flights/bookings", {
            scheduleId: schedId,
            passengerDetails,
          });
          if (bookingRes.data?.success) {
            bookingResults.push(bookingRes.data.data);
          }
        }

        if (bookingResults.length > 0) {
          const primaryBooking = bookingResults[0];
          const mongoId = primaryBooking._id || primaryBooking.bookingMongoId;

          setBooking({ status: "loading", message: "Initializing payment...", data: null });

          await initiatePayment({
            bookingMongoId: mongoId,
            amount: totalAmount,
            customerName: user?.name || "",
            customerEmail: user?.email || "",
            customerContact: user?.phoneNo || user?.mobile || "",
            description: `Flight Ticket (${tripType}) - ${primaryBooking.bookingId || primaryFlight.flight?.airlineName || "Flight"}`,
          });
        }
      } else {
        // One-way booking
        const schedId = routeScheduleId || primaryFlight.scheduleId || primaryFlight._id;

        const bookingRes = await api.post("/api/v1/flights/bookings", {
          scheduleId: schedId,
          passengerDetails,
        });

        if (bookingRes.data?.success) {
          const bookingData = bookingRes.data.data;
          const mongoId = bookingData._id || bookingData.bookingMongoId;

          setBooking({ status: "loading", message: "Initializing payment...", data: null });

          await initiatePayment({
            bookingMongoId: mongoId,
            amount: totalAmount,
            customerName: user?.name || "",
            customerEmail: user?.email || "",
            customerContact: user?.phoneNo || user?.mobile || "",
            description: `Flight Ticket - ${bookingData.bookingId || primaryFlight.flight?.airlineName || "Flight"}`,
          });
        }
      }
    } catch (err) {
      console.error("Booking error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Booking failed. Please try again.";
      setBooking({ status: "error", message: errorMessage });
    }
  };

  if (flightList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">No booking information found</h2>
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Nav />

      <div className="w-full px-6 md:px-12 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              ← Back
            </button>
          </div>

          {isMultiLeg ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                {tripType === 'Round Trip' ? 'Round Trip' : 'Multi-City'} Itinerary
              </h1>
              <div className="space-y-2 mt-3">
                {flightList.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-700 rounded-lg p-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {tripType === 'Multi City' ? `Leg ${idx + 1}` : idx === 0 ? 'Outbound' : 'Return'}:
                    </span>
                    <span className="font-medium">
                      {f.journey?.source?.split('(')[0]?.trim()} → {f.journey?.destination?.split('(')[0]?.trim()}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span>{f.flight?.airlineName || "Flight"}</span>
                    <span className="text-gray-400">|</span>
                    <span>{f.journey?.departureDate ? new Date(f.journey.departureDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : ""}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                {primaryFlight.journey?.source?.split('(')[0]?.trim()} → {primaryFlight.journey?.destination?.split('(')[0]?.trim()}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                <span className="font-medium">{primaryFlight.flight?.airlineName || "Akasa Air"}</span>
                <span>•</span>
                <span>{primaryFlight.journey?.departureDate ? new Date(primaryFlight.journey.departureDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : ""}</span>
              </div>
            </>
          )}
        </div>

        {/* Price Lock Banner - Show only if not authenticated */}
        {!isAuthenticated && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                  Still unsure about this trip? <span className="text-teal-600 dark:text-teal-400">Lock this price!</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-white dark:bg-slate-700 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
            >
              LOGIN NOW
            </button>
          </div>
        )}

        {/* Flight Timeline */}
        <FlightTimeline
          departureTime={primaryFlight.journey?.departureTime}
          departureLocation={primaryFlight.journey?.source?.split('(')[0]?.trim()}
          departureIATA={primaryFlight.journey?.source?.match(/\(([^)]+)\)/)?.[1]}
          arrivalTime={primaryFlight.journey?.arrivalTime}
          arrivalLocation={primaryFlight.journey?.destination?.split('(')[0]?.trim()}
          arrivalIATA={primaryFlight.journey?.destination?.match(/\(([^)]+)\)/)?.[1]}
          durationText={`${Math.floor((primaryFlight.journey?.durationMinutes || 180) / 60)}h ${(primaryFlight.journey?.durationMinutes || 180) % 60}m`}
          stopsCount={0}
          layovers={[]}
        />

        {/* Baggage Info with Extra Baggage Promotion */}
        <BaggageInfo
          cabin="7 Kgs (1 piece only)"
          checkIn="15 Kgs (1 piece only)"
          route={primaryFlight.journey?.source?.match(/\(([^)]+)\)/)?.[1] + '-' + primaryFlight.journey?.destination?.match(/\(([^)]+)\)/)?.[1]}
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

        {/* Selected Seats Payment Section (shown when returning from seat selection) */}
        {hasSelectedSeats && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" />
              Payment Method
            </h2>

            {/* Razorpay Option */}
            <div className="flex items-center p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-600 rounded-xl mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-semibold text-gray-900 dark:text-slate-100">Pay with Razorpay</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">UPI, Cards, Wallets, Netbanking</p>
              </div>
              <div className="flex gap-1.5">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-[8px] flex items-center justify-center font-bold">MC</div>
                <div className="w-8 h-5 bg-purple-600 rounded text-white text-[8px] flex items-center justify-center font-bold">UPI</div>
              </div>
            </div>

            {/* Selected Seats Summary */}
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 mb-4">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Selected Seats</p>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => {
                  const seatFare = seat.isExtraLegroom || seat.seatType === "extra-legroom"
                    ? (fare?.price || primaryFlight?.pricing?.baseFare || 0) + 100
                    : (fare?.price || primaryFlight?.pricing?.baseFare || 0);
                  return (
                    <span key={seat.seatNumber} className="inline-flex items-center gap-1 rounded-md border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-bold text-blue-800 dark:text-blue-300">
                      Seat {seat.seatNumber} — ₹{seatFare}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Payment Status Messages */}
            {booking.status === "error" && (
              <div className="space-y-3">
                <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
                  ⚠️ {booking.message}
                </div>
                <button
                  onClick={handlePayAndBook}
                  className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
                >
                  Retry Payment
                </button>
              </div>
            )}

            {booking.status === "success" && (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 p-3 text-center text-sm font-medium text-green-600 dark:text-green-400 flex items-center justify-center gap-2 animate-pulse">
                <CheckCircle size={18} />
                {booking.message} Redirecting to ticket...
              </div>
            )}

            {booking.status === "loading" && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 p-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                {booking.message}
              </div>
            )}
          </div>
        )}

        {/* Price Summary & Action Button */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sticky bottom-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">₹{totalAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Inclusive of all taxes</p>
            </div>

            {hasSelectedSeats ? (
              <button
                onClick={handlePayAndBook}
                disabled={booking.status === "loading" || booking.status === "success" || isPaymentProcessing}
                className="bg-lime-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-lime-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {booking.status === "loading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : booking.status === "success" ? (
                  <>
                    <CheckCircle size={18} />
                    Confirmed!
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Pay & Book
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate('/flight-seat-selection', {
                  state: {
                    flight: primaryFlight,
                    flights: flightList,
                    tripType,
                    fare: { price: primaryFlight?.pricing?.baseFare || fare?.price || 0 },
                    scheduleId: routeScheduleId || primaryFlight.scheduleId || primaryFlight._id
                  }
                })}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                CONTINUE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
