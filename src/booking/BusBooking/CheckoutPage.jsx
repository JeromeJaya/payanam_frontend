import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ShieldCheck, CreditCard, User, Loader2, CheckCircle } from "lucide-react";
import { useRazorpay } from "../../hooks/useRazorpay.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { ticket, meta } = location.state || {};

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

  // Redirect if no booking data
  useEffect(() => {
    if (!ticket || !meta) {
      navigate("/busbooking");
    }
  }, [ticket, meta, navigate]);

  // Handle payment result from Razorpay
  useEffect(() => {
    if (paymentStatus === "success" && paymentData) {
      setBooking({ status: "success", message: "Booking confirmed!", data: paymentData });
      setTimeout(() => {
        navigate("/ticketdetails", {
          state: {
            ticket: paymentData.booking,
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
      // Use the bookingMongoId from the ticket (already created)
      const bookingMongoId = ticket._id || ticket.bookingMongoId;

      if (!bookingMongoId) {
        throw new Error("No booking found. Please go back and try again.");
      }

      // Initiate Razorpay payment
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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
              <p className="text-sm text-slate-500 mt-1">Complete your booking</p>
            </div>
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={24} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Journey Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-lime-600" />
                Journey Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Bus</p>
                    <p className="font-bold text-slate-900">{busName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total</p>
                    <p className="text-xl font-black text-slate-900">₹{grandTotal.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium mb-1">From</p>
                    <p className="text-sm font-bold text-slate-900">{boarding?.name}</p>
                    <p className="text-xs text-slate-600">{boarding?.city}</p>
                    <p className="text-xs text-slate-500">{boarding?.time}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-600 font-medium mb-1">To</p>
                    <p className="text-sm font-bold text-slate-900">{dropping?.name}</p>
                    <p className="text-xs text-slate-600">{dropping?.city}</p>
                    <p className="text-xs text-slate-500">{dropping?.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-lime-600" />
                Passenger Details
              </h2>
              
              <div className="space-y-3">
                {passengers.map((passenger, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex-shrink-0 w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-lime-700">{index + 1}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Name</p>
                        <p className="text-sm font-semibold text-slate-900">{passenger.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Age</p>
                        <p className="text-sm font-semibold text-slate-900">{passenger.age} yrs</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Gender</p>
                        <p className="text-sm font-semibold text-slate-900 capitalize">{passenger.gender}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Seat</p>
                      <p className="text-sm font-bold text-slate-900">{passenger.seatNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-lime-600" />
                Payment Method
              </h2>

              {/* Razorpay - Payment Option */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center p-4 border-2 border-lime-500 bg-lime-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-slate-900">Pay with Razorpay</p>
                    <p className="text-xs text-slate-500">UPI, Cards, Wallets, Netbanking</p>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                    <div className="w-8 h-5 bg-red-600 rounded text-white text-[8px] flex items-center justify-center font-bold">MC</div>
                    <div className="w-8 h-5 bg-purple-600 rounded text-white text-[8px] flex items-center justify-center font-bold">UPI</div>
                  </div>
                </div>
              </div>

              {/* Payment Status Messages */}
              {booking.status === "error" && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-center text-sm font-medium text-red-600">
                    ⚠️ {booking.message}
                  </div>
                  <button
                    onClick={() => navigate("/busbooking")}
                    className="w-full rounded-lg bg-slate-100 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"
                  >
                    Go Back & Retry
                  </button>
                </div>
              )}

              {booking.status === "success" && (
                <div className="mt-4 rounded-lg bg-green-50 border border-green-100 p-3 text-center text-sm font-medium text-green-600 flex items-center justify-center gap-2 animate-pulse">
                  <CheckCircle size={18} />
                  {booking.message} Redirecting to ticket...
                </div>
              )}

              {booking.status === "loading" && (
                <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-3 text-center text-sm font-medium text-blue-600 flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  {booking.message}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Price Summary */}
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
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : booking.status === "success" ? (
                  <>
                    <CheckCircle size={16} />
                    Booking Confirmed!
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Pay & Confirm Booking
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={14} />
                <span>Secure 256-bit SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}