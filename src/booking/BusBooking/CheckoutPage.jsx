import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IndianRupee, X, ShieldCheck, CreditCard, User, Calendar, Hash } from "lucide-react";
import api from "../../api/axios.js";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ticket, meta } = location.state || {};

  const [booking, setBooking] = useState({ status: "idle", message: "", data: null });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  // Redirect if no booking data
  useEffect(() => {
    if (!ticket || !meta) {
      navigate("/busbooking");
    }
  }, [ticket, meta, navigate]);

  if (!ticket || !meta) {
    return null;
  }

  const { busName, boarding, dropping, passengers } = meta;
  const grandTotal = ticket.totalAmount || passengers.reduce((sum, p) => sum + (p.fare || 0), 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        setBooking({ status: "error", message: "Please fill in all card details" });
        return;
      }
    }

    setBooking({ status: "loading", message: "", data: null });

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Confirm the booking
      const res = await api.post(`/api/v1/bookings/${ticket.bookingId}/confirm`, {
        paymentMethod,
        paymentDetails: paymentMethod === "card" ? cardDetails : {}
      });

      if (res.data?.success) {
        setBooking({ status: "success", message: "Booking confirmed!", data: res.data.data });
        // Navigate to ticket details after 1.5 seconds
        setTimeout(() => {
          navigate("/ticketdetails", {
            state: {
              ticket: res.data.data,
              meta: {
                busName,
                boarding,
                dropping,
                passengers
              }
            }
          });
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Payment failed. Please try again.";
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

              <div className="space-y-3 mb-6">
                <label className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-lime-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-lime-600"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-slate-900">Credit/Debit Card</p>
                    <p className="text-xs text-slate-500">Pay with Visa, Mastercard, or RuPay</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                    <div className="w-10 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-lime-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-lime-600"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-slate-900">UPI Payment</p>
                    <p className="text-xs text-slate-500">Pay using Google Pay, PhonePe, or Paytm</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-lime-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-lime-600"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-slate-900">Wallet</p>
                    <p className="text-xs text-slate-500">Pay using Payanam Wallet</p>
                  </div>
                </label>
              </div>

              {paymentMethod === "card" && (
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        value={cardDetails.number}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
                          setCardDetails({ ...cardDetails, number: value });
                        }}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Cardholder Name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent uppercase"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={cardDetails.expiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + "/" + value.slice(2, 4);
                            }
                            setCardDetails({ ...cardDetails, expiry: value });
                          }}
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        CVV
                      </label>
                      <div className="relative">
                        <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="123"
                          maxLength="3"
                          value={cardDetails.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setCardDetails({ ...cardDetails, cvv: value });
                          }}
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {booking.status === "error" && (
                <div className="mt-4 rounded-lg bg-red-50 border border-red-100 p-3 text-center text-sm font-medium text-red-600">
                  ⚠️ {booking.message}
                </div>
              )}

              {booking.status === "success" && (
                <div className="mt-4 rounded-lg bg-green-50 border border-green-100 p-3 text-center text-sm font-medium text-green-600">
                  ✅ {booking.message} Redirecting to ticket...
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
                disabled={booking.status === "loading" || booking.status === "success"}
                className="w-full rounded-xl bg-lime-500 py-3 text-sm font-bold text-white shadow-md shadow-lime-500/10 transition hover:bg-lime-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {booking.status === "loading" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : booking.status === "success" ? (
                  "Booking Confirmed!"
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