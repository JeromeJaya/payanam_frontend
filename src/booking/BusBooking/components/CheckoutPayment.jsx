import { ShieldCheck, CreditCard, Loader2, CheckCircle } from "lucide-react";

export default function CheckoutPayment({
  booking,
  grandTotal,
  passengerCount,
  onPay,
  onGoBack,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <CreditCard size={20} className="text-lime-600" />
        Payment Method
      </h2>

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

      {booking.status === "error" && (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-center text-sm font-medium text-red-600">
            ⚠️ {booking.message}
          </div>
          <button
            onClick={onGoBack}
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

      <div className="mt-6 space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Ticket Price ({passengerCount} {passengerCount === 1 ? 'seat' : 'seats'})</span>
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
        onClick={onPay}
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
  );
}
