import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, User, Calendar, Hash, ShieldCheck, IndianRupee, CheckCircle, Loader2, CreditCard, Smartphone, Wallet } from "lucide-react";
import api from "../../api/axios.js";
import { useRazorpay } from "../../hooks/useRazorpay.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Nav from "../../NavComponent.jsx";
import {Loading} from "./component/Loading.jsx";
export default function SeatConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { scheduleId, busName, boarding, dropping, seats, total } = location.state || {};

  const [booking, setBooking] = useState({ status: "idle", message: "", data: null });
  const [bookingMongoId, setBookingMongoId] = useState(null);
  const [passengers, setPassengers] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isLoading, setIsLoading] = useState(true);

  // Razorpay hook
  const {
    initiatePayment,
    isProcessing: isPaymentProcessing,
    paymentStatus,
    paymentData,
    error: paymentError,
    resetPayment,
  } = useRazorpay();

  // Simulate initial loading with animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if no data
  useEffect(() => {
    if (!scheduleId || !seats || seats.length === 0) {
      navigate("/busbooking");
    }
  }, [scheduleId, seats, navigate]);

  if (!scheduleId || !seats || seats.length === 0) {
    return null;
  }

  const passengerList = seats.map(seatId => passengers[seatId]).filter(Boolean);
  const allPassengersAdded = passengerList.length === seats.length;
  const grandTotal = total || 0;

  const handleAddPassenger = (seatId) => {
    const passenger = passengers[seatId];
    if (!passenger?.name || !passenger?.age || !passenger?.gender) {
      setBooking({ status: "error", message: `Please fill all details for Seat ${seatId}` });
      return;
    }

    setBooking({ status: "idle", message: "", data: null });
  };

  // Handle payment result from Razorpay
  useEffect(() => {
    if (paymentStatus === "success" && paymentData) {
      setBooking({ status: "success", message: "Booking confirmed!", data: paymentData });
      // Navigate to ticket details after 2 seconds
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

  const handleConfirmBooking = async () => {
    const passengerList = Object.values(passengers).filter(Boolean);
    if (passengerList.length !== seats.length) {
      setBooking({ status: "error", message: "Please add details for all passengers" });
      return;
    }

    setBooking({ status: "loading", message: "Creating booking...", data: null });

    try {
      // Step 1: Create booking
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

        // Step 2: Initiate Razorpay payment
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

  const handleBack = () => {
    navigate(-1);
  };

  // Retry payment for the same booking (when user cancelled or payment failed)
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

  // Loading Animation
  if (isLoading) {
    return (
     <Loading />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-20">
      <Nav />
      <div className="py-8 px-4 md:px-8">
      {/* Container altered to w-full with no max-width boundaries */}
      <div className="w-full">
        
        {/* Header with fade-in animation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/30 p-6 mb-6 animate-fadeInDown">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Seat Confirmation</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add passenger details and confirm booking</p>
            </div>
          </div>
        </div>

        {/* Layout adjusted to handle widescreen displays beautifully without crushing elements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Left Column - Passenger Details */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            {/* Journey Summary with slide-in animation */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/30 p-6 animate-fadeInUp" style={{ animationDelay: "100ms" }}>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-lime-600 dark:text-lime-400" />
                Journey Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Bus</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{busName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Total</p>
                    <p className="text-xl font-black text-slate-900 dark:text-slate-100">₹{grandTotal.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">From</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{boarding?.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{boarding?.city}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{boarding?.time}</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">To</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{dropping?.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{dropping?.city}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{dropping?.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details Form with staggered animation */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/30 p-6 animate-fadeInUp" style={{ animationDelay: "200ms" }}>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <User size={20} className="text-lime-600 dark:text-lime-400" />
                Passenger Details
              </h2>
              
              <div className="space-y-4">
                {seats.map((seatId, index) => (
                  <div 
                    key={seatId} 
                    className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 animate-fadeInUp hover:shadow-md transition-shadow"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-lime-100 dark:bg-lime-900/40 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-sm font-bold text-lime-700 dark:text-lime-300">{index + 1}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">Seat {seatId}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                          <input
                            type="text"
                            placeholder="Enter passenger name"
                            value={passengers[seatId]?.name || ""}
                            onChange={(e) => {
                              setPassengers(p => ({
                                ...p,
                                [seatId]: { ...p[seatId], seatNumber: seatId, name: e.target.value, gender: p[seatId]?.gender || "male", age: p[seatId]?.age || "" }
                              }));
                            }}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Age
                        </label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                          <input
                            type="number"
                            placeholder="Age"
                            min="1"
                            max="120"
                            value={passengers[seatId]?.age || ""}
                            onChange={(e) => {
                              setPassengers(p => ({
                                ...p,
                                [seatId]: { ...p[seatId], age: Number(e.target.value) }
                              }));
                            }}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Gender
                        </label>
                        <select
                          value={passengers[seatId]?.gender || "male"}
                          onChange={(e) => {
                            setPassengers(p => ({
                              ...p,
                              [seatId]: { ...p[seatId], gender: e.target.value }
                            }));
                          }}
                          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                          required
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method with animation */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/30 p-6 animate-fadeInUp" style={{ animationDelay: `${400 + seats.length * 100}ms` }}>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <IndianRupee size={20} className="text-lime-600 dark:text-lime-400" />
                Payment Method
              </h2>

              {/* Razorpay - Primary Payment Option */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center p-4 border-2 border-lime-500 dark:border-lime-600 bg-lime-50 dark:bg-lime-900/20 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Pay with Razorpay</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">UPI, Cards, Wallets, Netbanking</p>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                    <div className="w-8 h-5 bg-red-600 rounded text-white text-[8px] flex items-center justify-center font-bold">MC</div>
                    <div className="w-8 h-5 bg-purple-600 rounded text-white text-[8px] flex items-center justify-center font-bold">UPI</div>
                  </div>
                </div>
              </div>

              {/* Payment Status Messages */}
              {booking.status === "error" && !bookingMongoId && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
                    ⚠️ {booking.message}
                  </div>
                  <button
                    onClick={() => navigate("/busbooking")}
                    className="w-full rounded-lg bg-slate-100 dark:bg-slate-700 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  >
                    Go Back & Retry
                  </button>
                </div>
              )}
              {booking.status === "error" && bookingMongoId && (
                <div className="mt-4">
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
                    ⚠️ {booking.message}
                  </div>
                </div>
              )}

              {booking.status === "success" && (
                <div className="mt-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-3 text-center text-sm font-medium text-green-600 dark:text-green-400 flex items-center justify-center gap-2 animate-pulse">
                  <CheckCircle size={18} />
                  {booking.message} Redirecting to ticket...
                </div>
              )}

              {booking.status === "loading" && (
                <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  {booking.message}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Price Summary with animation */}
          <div className="lg:col-span-1 animate-fadeInUp" style={{ animationDelay: "500ms" }}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/30 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Price Details</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Ticket Price ({seats.length} {seats.length === 1 ? 'seat' : 'seats'})</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">₹{grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Convenience Fee</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">₹0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">GST (5%)</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">₹{Math.round(grandTotal * 0.05).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-600 pt-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">Total Payable</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-lime-400">₹{Math.round(grandTotal * 1.05).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={booking.status === "error" && bookingMongoId ? handleRetryPayment : handleConfirmBooking}
                disabled={booking.status === "loading" || booking.status === "success" || !allPassengersAdded}
                className="w-full rounded-xl bg-lime-500 py-3 text-sm font-bold text-white shadow-md shadow-lime-500/10 transition hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                {booking.status === "loading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : booking.status === "success" ? (
                  <>
                    <CheckCircle size={18} className="animate-bounce" />
                    Booking Confirmed!
                  </>
                ) : booking.status === "error" && bookingMongoId ? (
                  <>
                    <CreditCard size={18} />
                    Retry Payment
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Confirm & Pay
                  </>
                )}
              </button>

              {!allPassengersAdded && (
                <p className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400">
                  Add all passenger details to continue
                </p>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck size={14} />
                <span>Secure 256-bit SSL Encryption</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      </div>
    </div>
  );
}