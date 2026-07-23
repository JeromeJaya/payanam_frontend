import { Loader2, CheckCircle, CreditCard, ShieldCheck } from "lucide-react";

export default function PriceSummarySidebar({
  seatsCount,
  grandTotal,
  booking,
  bookingMongoId,
  allPassengersAdded,
  onConfirmBooking,
  onRetryPayment,
}) {
  return (
    <div className="lg:col-span-1 animate-fadeInUp" style={{ animationDelay: "500ms" }}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/30 p-6 sticky top-24">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Price Details</h3>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Ticket Price ({seatsCount} {seatsCount === 1 ? 'seat' : 'seats'})</span>
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
          onClick={booking.status === "error" && bookingMongoId ? onRetryPayment : onConfirmBooking}
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
  );
}
