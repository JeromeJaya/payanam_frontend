import { ShieldCheck, Loader2, CheckCircle } from "lucide-react";

export default function PriceSummary({
  totalAmount,
  extraBaggage,
  selectedMeals,
  couponDiscount,
  hasSelectedSeats,
  contactValidation,
  booking,
  isPaymentProcessing,
  handlePayAndBook,
  handleSelectSeat,
}) {
  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sticky bottom-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">₹{totalAmount.toLocaleString()}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
              <p className="text-xs text-gray-500 dark:text-slate-500">Inclusive of all taxes</p>
              {extraBaggage.totalCost > 0 && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  + ₹{extraBaggage.totalCost.toLocaleString()} extra baggage ({extraBaggage.totalExtraKg} Kg)
                </p>
              )}
              {selectedMeals && Object.values(selectedMeals).reduce((s, m) => s + m.price, 0) > 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  + ₹{Object.values(selectedMeals).reduce((s, m) => s + m.price, 0).toLocaleString()} meals
                </p>
              )}
              {couponDiscount > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  - ₹{couponDiscount.toFixed(0)} coupon discount
                </p>
              )}
            </div>
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
                  Verify & Pay
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleSelectSeat}
              disabled={!contactValidation.isValid}
              className={`px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 ${
                !contactValidation.isValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              SELECT SEAT
            </button>
          )}
        </div>
      </div>

      {!hasSelectedSeats && booking.status === "error" && (
        <div className="max-w-lg mx-auto mt-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 p-4 text-center text-base font-medium text-red-700 dark:text-red-300">
          ⚠️ {booking.message}
        </div>
      )}
    </>
  );
}
