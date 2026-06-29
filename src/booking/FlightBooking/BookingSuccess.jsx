import { CheckCircle2 } from "lucide-react";

export default function BookingSuccess({ bookingId, message, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-xl">
      <CheckCircle2 className="h-10 w-10 text-green-600" />
      <h3 className="mt-3 text-center text-sm font-bold text-gray-900">
        {message || "Booking confirmed!"}
      </h3>
      <p className="mt-1 text-center text-[11px] text-gray-500">
        Booking ID: {bookingId}
      </p>
      {typeof onClose === "function" && (
        <button
          onClick={onClose}
          className="mt-3 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          Close
        </button>
      )}
    </div>
  );
}
