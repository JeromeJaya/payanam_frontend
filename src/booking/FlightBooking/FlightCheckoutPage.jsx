import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../../NavComponent.jsx";
import { useAuth } from "../../context/AuthContext";
import { useRazorpay } from "../../hooks/useRazorpay.jsx";
import api from "../../api/axios";
import FlightTimeline from "../../components/flightComponents/FlightTimeline.jsx";
import BaggageInfo from "../../components/flightComponents/BaggageInfo";
import CouponsOffers from "../../components/flightComponents/CouponsOffers";
import CancellationPolicy from "../../components/flightComponents/CancellationPolicy";
import ImportantInfo from "../../components/flightComponents/ImportantInfo";
import TravellerDetails from "../../components/flightComponents/TravellerDetails";
import CheckoutHeader from "./components/CheckoutHeader";
import PriceLockBanner from "./components/PriceLockBanner";
import SelectedMealsSummary from "./components/SelectedMealsSummary";
import PaymentSection from "./components/PaymentSection";
import PriceSummary from "./components/PriceSummary";

export default function FlightCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, flights, tripType = 'One Way', fare, selectedSeats, scheduleId: routeScheduleId, passengerDetails: passedPassengerDetails, selectedMeals } = location.state || {};
  const { isAuthenticated, user } = useAuth();

  const isMultiLeg = tripType === 'Round Trip' || tripType === 'Multi City';
  const flightList = flights || (flight ? [flight] : []);
  const primaryFlight = flight || flightList[0];

  const [booking, setBooking] = useState({ status: "idle", message: "", data: null });
  const [extraBaggage, setExtraBaggage] = useState({ items: [], totalCost: 0, totalExtraKg: 0 });
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [contactValidation, setContactValidation] = useState({ isValid: false, mobile: "", email: "", countryCode: "91", errors: {} });

  const handleContactValidation = useCallback((validation) => {
    setContactValidation(prev => (
      prev.isValid === validation.isValid && prev.mobile === validation.mobile &&
      prev.email === validation.email && prev.countryCode === validation.countryCode
        ? prev : validation
    ));
  }, []);

  const handleCouponApplied = useCallback((coupon) => {
    setCouponDiscount(coupon ? coupon.discount : 0);
  }, []);

  const { initiatePayment, isProcessing: isPaymentProcessing, paymentStatus, paymentData, error: paymentError } = useRazorpay();

  const hasSelectedSeats = selectedSeats && selectedSeats.length > 0;

  const calculateTotalAmount = () => {
    let base = 0;
    if (isMultiLeg) {
      base = flightList.reduce((sum, f) => {
        const flightFare = f?.pricing?.calculatedFare || f?.pricing?.baseFare || 0;
        return hasSelectedSeats
          ? sum + selectedSeats.reduce((s, seat) => s + ((seat.isExtraLegroom || seat.seatType === "extra-legroom") ? flightFare + 100 : flightFare), 0)
          : sum + flightFare;
      }, 0);
    } else {
      const singleFare = fare?.price || primaryFlight?.pricing?.calculatedFare || primaryFlight?.pricing?.baseFare || 0;
      base = hasSelectedSeats
        ? selectedSeats.reduce((sum, seat) => sum + ((seat.isExtraLegroom || seat.seatType === "extra-legroom") ? singleFare + 100 : singleFare), 0)
        : singleFare;
    }
    const mealTotal = selectedMeals ? Object.values(selectedMeals).reduce((sum, m) => sum + (m.price || 0), 0) : 0;
    return Math.max(0, base + mealTotal + (extraBaggage.totalCost || 0) - (couponDiscount || 0));
  };

  const totalAmount = calculateTotalAmount();

  useEffect(() => {
    if (paymentStatus === "success" && paymentData) {
      setBooking({ status: "success", message: "Flight booking confirmed!", data: paymentData });
      const srcIATA = primaryFlight?.journey?.source?.match(/\(([^)]+)\)/)?.[1] || "";
      const dstIATA = primaryFlight?.journey?.destination?.match(/\(([^)]+)\)/)?.[1] || "";
      const srcCity = primaryFlight?.journey?.source?.split('(')[0]?.trim() || "";
      const dstCity = primaryFlight?.journey?.destination?.split('(')[0]?.trim() || "";
      setTimeout(() => {
        navigate("/TicketDetails", {
          state: {
            ticket: paymentData.booking,
            meta: {
              flightName: primaryFlight?.flight?.airlineName || "Akasa Air",
              flightNumber: primaryFlight?.flight?.flightNumber || "",
              aircraftType: primaryFlight?.flight?.aircraftType || "",
              boarding: { city: srcCity, name: primaryFlight?.journey?.departureTerminal || "Terminal", time: primaryFlight?.journey?.departureTime || "", iata: srcIATA, date: primaryFlight?.journey?.departureDate },
              dropping: { city: dstCity, name: primaryFlight?.journey?.arrivalTerminal || "Terminal", time: primaryFlight?.journey?.arrivalTime || "", iata: dstIATA, date: primaryFlight?.journey?.arrivalDate },
              passengers: passedPassengerDetails && passedPassengerDetails.length > 0
                ? passedPassengerDetails.map(p => ({ name: p.name, seatNumber: p.seatNumber, age: p.age, gender: p.gender, meal: selectedMeals?.[p.seatNumber] || null }))
                : selectedSeats?.map((seat, i) => ({ name: `Passenger ${i + 1}`, seatNumber: seat.seatNumber, age: 28, gender: "male", meal: selectedMeals?.[seat.seatNumber] || null })) || [],
              payment: paymentData.payment,
              tripType, serviceType: "flight", allFlights: flightList,
              extraBaggage: extraBaggage.items.length > 0 ? extraBaggage : null,
            },
          },
        });
      }, 1000);
    } else if (paymentStatus === "failed") {
      setBooking({ status: "error", message: paymentError || "Payment failed. Please try again." });
    }
  }, [paymentStatus, paymentData, paymentError]);

  const handlePayAndBook = async () => {
    if (!hasSelectedSeats) return;
    if (!isAuthenticated) { navigate("/login"); return; }

    if (passedPassengerDetails?.length > 0) {
      const invalid = passedPassengerDetails.filter(p => !p.name?.trim() || p.name.trim().length < 2 || !p.age || parseInt(p.age) < 1 || parseInt(p.age) > 120 || !p.gender);
      if (invalid.length > 0) {
        setBooking({ status: "error", message: "Please fill in all passenger details correctly. Go back to passenger details page.", data: null });
        return;
      }
    }

    if (!contactValidation.isValid) {
      let msg = "Please provide valid contact details.";
      if (contactValidation.errors.mobile) msg = `Mobile: ${contactValidation.errors.mobile}`;
      else if (contactValidation.errors.email) msg = `Email: ${contactValidation.errors.email}`;
      else if (!contactValidation.mobile.trim()) msg = "Mobile number is required.";
      else if (!contactValidation.email.trim()) msg = "Email is required.";
      setBooking({ status: "error", message: msg, data: null });
      return;
    }

    setBooking({ status: "loading", message: "Creating booking...", data: null });

    const mkPassenger = (p) => ({ seatNumber: p.seatNumber, name: p.name.trim(), age: parseInt(p.age), gender: p.gender, meal: selectedMeals?.[p.seatNumber] ? { id: selectedMeals[p.seatNumber].id, name: selectedMeals[p.seatNumber].name, category: selectedMeals[p.seatNumber].category, price: selectedMeals[p.seatNumber].price } : undefined });

    try {
      const passengerDetails = passedPassengerDetails?.length > 0
        ? passedPassengerDetails.map(mkPassenger)
        : selectedSeats.map((seat, i) => ({ seatNumber: seat.seatNumber, name: user?.name || `Passenger ${i + 1}`, age: 28, gender: "male", meal: selectedMeals?.[seat.seatNumber] ? { id: selectedMeals[seat.seatNumber].id, name: selectedMeals[seat.seatNumber].name, category: selectedMeals[seat.seatNumber].category, price: selectedMeals[seat.seatNumber].price } : undefined }));

      if (isMultiLeg && flightList.length > 1) {
        const results = [];
        for (const f of flightList) {
          const res = await api.post("/api/v1/flights/bookings", { scheduleId: f.scheduleId || f._id, passengerDetails });
          if (res.data?.success) results.push(res.data.data);
        }
        if (results.length > 0) {
          const b = results[0];
          setBooking({ status: "loading", message: "Initializing payment...", data: null });
          await initiatePayment({ bookingMongoId: b._id || b.bookingMongoId, amount: totalAmount, customerName: user?.name || "", customerEmail: contactValidation.email || user?.email || "", customerContact: contactValidation.mobile || user?.phoneNo || user?.mobile || "", description: `Flight Ticket (${tripType}) - ${b.bookingId || primaryFlight.flight?.airlineName || "Flight"}` });
        }
      } else {
        const schedId = routeScheduleId || primaryFlight.scheduleId || primaryFlight._id;
        const res = await api.post("/api/v1/flights/bookings", { scheduleId: schedId, passengerDetails, extraBaggage: extraBaggage.items.length > 0 ? { items: extraBaggage.items, totalCost: extraBaggage.totalCost, totalExtraKg: extraBaggage.totalExtraKg } : undefined });
        if (res.data?.success) {
          const b = res.data.data;
          setBooking({ status: "loading", message: "Initializing payment...", data: null });
          await initiatePayment({ bookingMongoId: b._id || b.bookingMongoId, amount: totalAmount, customerName: user?.name || "", customerEmail: contactValidation.email || user?.email || "", customerContact: contactValidation.mobile || user?.phoneNo || user?.mobile || "", description: `Flight Ticket - ${b.bookingId || primaryFlight.flight?.airlineName || "Flight"}` });
        }
      }
    } catch (err) {
      console.error("Booking error:", err);
      setBooking({ status: "error", message: err.response?.data?.message || err.message || "Booking failed. Please try again." });
    }
  };

  const handleSelectSeat = useCallback(() => {
    if (!contactValidation.isValid) {
      let msg = "Please provide valid contact details before selecting seats.";
      if (!contactValidation.mobile.trim()) msg = "Mobile number is required.";
      else if (contactValidation.errors.mobile) msg = `Mobile: ${contactValidation.errors.mobile}`;
      else if (!contactValidation.email.trim()) msg = "Email is required.";
      else if (contactValidation.errors.email) msg = `Email: ${contactValidation.errors.email}`;
      setBooking({ status: "error", message: msg, data: null });
      return;
    }
    navigate('/flight-seat-selection', {
      state: { flight: primaryFlight, flights: flightList, tripType, fare: { price: primaryFlight?.pricing?.baseFare || fare?.price || 0 }, scheduleId: routeScheduleId || primaryFlight.scheduleId || primaryFlight._id }
    });
  }, [contactValidation, primaryFlight, flightList, tripType, fare, routeScheduleId, navigate]);

  if (flightList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">No booking information found</h2>
          <button onClick={() => navigate('/flightbooking')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">Back to Flight Search</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Nav />
      <div className="w-full px-6 md:px-12 py-8">
        <CheckoutHeader tripType={tripType} isMultiLeg={isMultiLeg} flightList={flightList} primaryFlight={primaryFlight} />
        {!isAuthenticated && <PriceLockBanner onLoginClick={() => navigate('/login')} />}

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

        <BaggageInfo
          cabin="7 Kgs (1 piece only)"
          checkIn="15 Kgs (1 piece only)"
          route={primaryFlight.journey?.source?.match(/\(([^)]+)\)/)?.[1] + '-' + primaryFlight.journey?.destination?.match(/\(([^)]+)\)/)?.[1]}
          onBaggageChange={setExtraBaggage}
        />

        {selectedMeals && Object.keys(selectedMeals).length > 0 && <SelectedMealsSummary selectedMeals={selectedMeals} />}

        <TravellerDetails onContactValidation={handleContactValidation} />
        <CancellationPolicy cancellation="Cancellation fee starts at MYR 213.80 (up to 3 hours before departure)" dateChange="Date Change fee starts at MYR 128.26 up to 3 hrs before departure" />
        <ImportantInfo />
        <CouponsOffers onCouponApplied={handleCouponApplied} totalAmount={totalAmount + couponDiscount} />

        <PaymentSection hasSelectedSeats={hasSelectedSeats} selectedSeats={selectedSeats} fare={fare} primaryFlight={primaryFlight} booking={booking} handlePayAndBook={handlePayAndBook} />

        <PriceSummary totalAmount={totalAmount} extraBaggage={extraBaggage} selectedMeals={selectedMeals} couponDiscount={couponDiscount} hasSelectedSeats={hasSelectedSeats} contactValidation={contactValidation} booking={booking} isPaymentProcessing={isPaymentProcessing} handlePayAndBook={handlePayAndBook} handleSelectSeat={handleSelectSeat} />
      </div>
    </div>
  );
}
