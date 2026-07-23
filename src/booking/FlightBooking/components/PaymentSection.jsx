import { ShieldCheck, Loader2, CheckCircle, CreditCard } from "lucide-react";

export default function PaymentSection({ hasSelectedSeats, selectedSeats, fare, primaryFlight, booking, handlePayAndBook }) {
  if (!hasSelectedSeats) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <CreditCard size={20} className="text-blue-600" />
        Payment Method
      </h2>

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
  );
}
