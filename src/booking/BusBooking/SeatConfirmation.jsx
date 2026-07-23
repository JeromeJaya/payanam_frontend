import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios.js";
import { useRazorpay } from "../../hooks/useRazorpay.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Nav from "../../NavComponent.jsx";
import { Loading } from "./component/Loading.jsx";
import JourneySummary from "./components/JourneySummary.jsx";
import PassengerFormList from "./components/PassengerFormList.jsx";
import PaymentSection from "./components/PaymentSection.jsx";
import PriceSummarySidebar from "./components/PriceSummarySidebar.jsx";

export default function SeatConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { scheduleId, busName, boarding, dropping, seats, total } = location.state || {};

  const [booking, setBooking] = useState({ status: "idle", message: "", data: null });
  const [bookingMongoId, setBookingMongoId] = useState(null);
  const [passengers, setPassengers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { initiatePayment, paymentStatus, paymentData, error: paymentError } = useRazorpay();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!scheduleId || !seats || seats.length === 0) {
      navigate("/busbooking");
    }
  }, [scheduleId, seats, navigate]);

  useEffect(() => {
    if (paymentStatus === "success" && paymentData) {
      setBooking({ status: "success", message: "Booking confirmed!", data: paymentData });
      setTimeout(() => {
        navigate("/ticketdetails", {
          state: {
            ticket: {
              ...paymentData.booking,
              paymentStatus: paymentData.payment?.status || paymentData.booking?.paymentStatus || "SUCCESS",
              paymentReference: paymentData.payment?.razorpayPaymentId || paymentData.booking?.paymentReference || "",
            },
            meta: {
              busName,
              boarding,
              dropping,
              passengers: Object.values(passengers).filter(Boolean),
              payment: paymentData.payment,
            },
          },
        });
      }, 2000);
    } else if (paymentStatus === "failed") {
      setBooking({ status: "error", message: paymentError || "Payment failed. Please try again." });
    }
  }, [paymentStatus, paymentData, paymentError, navigate, busName, boarding, dropping, passengers]);

  if (!scheduleId || !seats || seats.length === 0) {
    return null;
  }

  const passengerList = seats.map(seatId => passengers[seatId]).filter(Boolean);
  const allPassengersAdded = passengerList.length === seats.length;
  const grandTotal = total || 0;

  const handleConfirmBooking = async () => {
    const passengerList = Object.values(passengers).filter(Boolean);
    if (passengerList.length !== seats.length) {
      setBooking({ status: "error", message: "Please add details for all passengers" });
      return;
    }

    setBooking({ status: "loading", message: "Creating booking...", data: null });

    try {
      const bookingRes = await api.post("/api/v1/bookings", {
        scheduleId,
        boardingPointId: boarding?._id || boarding?.id,
        droppingPointId: dropping?._id || dropping?.id,
        passengerDetails: passengerList,
      });

      if (bookingRes.data?.success) {
        const bookingData = bookingRes.data.data;
        const mongoId = bookingData._id || bookingData.bookingMongoId;

        setBookingMongoId(mongoId);
        setBooking({ status: "loading", message: "Initializing payment...", data: null });

        await initiatePayment({
          bookingMongoId: mongoId,
          amount: bookingData.totalFare || total,
          customerName: user?.name || passengerList[0]?.name || "",
          customerEmail: user?.email || "",
          customerContact: user?.phoneNo || user?.mobile || "",
          description: `Bus Ticket - ${bookingData.bookingId || busName}`,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Booking failed. Please try again.";
      setBooking({ status: "error", message: errorMessage });
    }
  };

  const handleRetryPayment = async () => {
    if (!bookingMongoId) {
      setBooking({ status: "error", message: "No booking found to retry. Please create a new booking." });
      return;
    }

    setBooking({ status: "loading", message: "Retrying payment...", data: null });

    try {
      await initiatePayment({
        bookingMongoId,
        amount: total,
        customerName: user?.name || passengers[seats[0]]?.name || "",
        customerEmail: user?.email || "",
        customerContact: user?.phoneNo || user?.mobile || "",
        description: `Bus Ticket - ${busName}`,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Payment retry failed. Please try again.";
      setBooking({ status: "error", message: errorMessage });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-20">
      <Nav />
      <div className="py-8 px-4 md:px-8">
        <div className="w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/30 p-6 mb-6 animate-fadeInDown">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Seat Confirmation</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add passenger details and confirm booking</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-2 xl:col-span-3 space-y-6">
              <JourneySummary
                busName={busName}
                boarding={boarding}
                dropping={dropping}
                grandTotal={grandTotal}
                seats={seats}
              />
              <PassengerFormList
                seats={seats}
                passengers={passengers}
                setPassengers={setPassengers}
              />
              <PaymentSection
                booking={booking}
                bookingMongoId={bookingMongoId}
              />
            </div>

            <PriceSummarySidebar
              seatsCount={seats.length}
              grandTotal={grandTotal}
              booking={booking}
              bookingMongoId={bookingMongoId}
              allPassengersAdded={allPassengersAdded}
              onConfirmBooking={handleConfirmBooking}
              onRetryPayment={handleRetryPayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
