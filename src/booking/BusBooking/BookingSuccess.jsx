import { CheckCircle2 } from "lucide-react";

export default function BookingSuccess({ bookingId, message, onClose }) {
  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-gray-50 flex flex-col items-center justify-center transition-all duration-300">
      
      {/* Success Icon Animation Anchor */}
      <div className="p-2 bg-emerald-50 rounded-full animate-bounce-short">
        <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-600 shrink-0" />
      </div>

      {/* Message Header Block */}
      <h3 className="mt-4 text-center text-base sm:text-lg font-extrabold text-gray-900 tracking-tight leading-snug px-2">
        {message || "Booking confirmed!"}
      </h3>
      
      {/* Metadata ID Indicator */}
      {bookingId && (
        <p className="mt-1.5 text-center text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full tracking-wide">
          Booking ID: <span className="text-gray-600 font-mono select-all">{bookingId}</span>
        </p>
      )}

      {/* Action CTA Block */}
      {typeof onClose === "function" && (
        <button
          onClick={onClose}
          className="mt-6 w-full sm:w-auto min-w-[120px] rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] px-5 py-2.5 text-xs sm:text-sm font-bold text-white tracking-wide transition-all shadow-md shadow-blue-100 uppercase focus:outline-none"
        >
          Close
        </button>
      )}
    </div>
  );
}