import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRazorpay } from "../../hooks/useRazorpay.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import CheckoutHeader from "./components/CheckoutHeader";
import CheckoutBookingSummary from "./components/CheckoutBookingSummary";
import CheckoutPassengerForm from "./components/CheckoutPassengerForm";
import CheckoutPayment from "./components/CheckoutPayment";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { ticket, meta } = location.state || {};

  const [booking, setBooking] = useState({ status: "idle", message: "", data: null });

  const {
    initiatePayment,
    paymentStatus,
    paymentData,
    error: paymentError,
  } = useRazorpay();

  useEffect(() => {
    if (!ticket || !meta) {
      navigate("/busbooking");
    }
  }, [ticket, meta, navigate]);

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
              busName: meta?.busName,
              boarding: meta?.boarding,
              dropping: meta?.dropping,
              passengers: meta?.passengers,
              payment: paymentData.payment,
            },
          },
        });
      }, 2000);
    } else if (paymentStatus === "failed") {
      setBooking({ status: "error", message: paymentError || "Payment failed. Please try again." });
    }
  }, [paymentStatus, paymentData, paymentError, navigate, meta]);

  if (!ticket || !meta) {
    return null;
  }

  const { busName, boarding, dropping, passengers } = meta;
  const grandTotal = ticket.totalAmount || passengers.reduce((sum, p) => sum + (p.fare || 0), 0);

  const handlePayment = async (e) => {
    if (e) e.preventDefault();

    setBooking({ status: "loading", message: "Initializing payment...", data: null });

    try {
      const bookingMongoId = ticket._id || ticket.bookingMongoId;

      if (!bookingMongoId) {
        throw new Error("No booking found. Please go back and try again.");
      }

      await initiatePayment({
        bookingMongoId,
        amount: grandTotal,
        customerName: user?.name || passengers?.[0]?.name || "",
        customerEmail: user?.email || "",
        customerContact: user?.phoneNo || user?.mobile || "",
        description: `Bus Ticket - ${ticket.bookingId || busName}`,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Payment failed. Please try again.";
      setBooking({ status: "error", message: errorMessage });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <CheckoutHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CheckoutBookingSummary
              busName={busName}
              grandTotal={grandTotal}
              boarding={boarding}
              dropping={dropping}
            />

            <CheckoutPassengerForm passengers={passengers} />

            <CheckoutPayment
              booking={booking}
              grandTotal={grandTotal}
              passengerCount={passengers.length}
              onPay={handlePayment}
              onGoBack={() => navigate("/busbooking")}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Price Details</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Ticket Price ({passengers.length} {passengers.length === 1 ? 'seat' : 'seats'})</span>
                  <span className="font-semibold text-slate-900">₹{grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Convenience Fee</span>
                  <span className="font-semibold text-slate-900">₹0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">GST (5%)</span>
                  <span className="font-semibold text-slate-900">₹{Math.round(grandTotal * 0.05).toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900">Total Payable</span>
                  <span className="text-2xl font-black text-slate-900">₹{Math.round(grandTotal * 1.05).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={booking.status === "loading" || booking.status === "success" || booking.status === "error"}
                className="w-full rounded-xl bg-lime-500 py-3 text-sm font-bold text-white shadow-md shadow-lime-500/10 transition hover:bg-lime-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {booking.status === "loading" ? (
                  "Processing..."
                ) : booking.status === "success" ? (
                  "Booking Confirmed!"
                ) : (
                  "Pay & Confirm Booking"
                )}
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <span>Secure 256-bit SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
