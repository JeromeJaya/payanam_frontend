import { Bus, Plane, Star } from "lucide-react";

function getReviewText(r) {
  return r?.review || r?.comment || r?.text || r?.content || r?.message || "";
}

export default function BookingCard({ booking, idx, cancelLoading, reviewsByBooking, onViewTicket, onCancelBooking, onOpenReview }) {
  const bookingId = booking.bookingId || `BK-${1000 + idx}`;
  const source = booking.boardingPoint?.city || booking.routeId?.source || booking.source || "Origin";
  const destination = booking.droppingPoint?.city || booking.routeId?.destination || booking.destination || "Destination";
  const totalFare = booking.totalFare || 0;
  const isCancelled = booking.status?.toLowerCase() === 'cancelled' || booking.bookingStatus?.toLowerCase() === 'cancelled';
  let travelFinished = false;
  const depDateVal = booking.scheduleId?.departureDate || booking.travelDate;
  if (depDateVal) {
    const depDate = new Date(depDateVal);
    const depTimeStr = booking.scheduleId?.departureTime || "00:00";
    const [hours, minutes] = depTimeStr.split(":").map(Number);
    depDate.setHours(hours || 0, minutes || 0, 0, 0);
    travelFinished = depDate < new Date();
  }
  const isCompleted = booking.bookingStatus?.toLowerCase() === 'completed' || booking.status?.toLowerCase() === 'completed' || (!isCancelled && travelFinished);
  const isFlight = bookingId?.startsWith("FLY-") || booking.serviceType === "flight";
  const ServiceIcon = isFlight ? Plane : Bus;
  const serviceName = isFlight ? (booking.busId?.airlineName || "Airline") : (booking.busId?.busName || "");
  const depDate = booking.scheduleId?.departureDate
    ? new Date(booking.scheduleId.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : "Date TBD";
  const depTime = booking.scheduleId?.departureTime || booking.boardingPoint?.time || "--:--";
  const arrTime = booking.scheduleId?.arrivalTime || booking.droppingPoint?.time || "--:--";
  const seats = (booking.passengerDetails || []).map(p => p.seatNumber).join(", ") || "N/A";
  const bookingKey = booking.bookingId || booking._id;
  const reviewData = reviewsByBooking[bookingKey];

  return (
    <div
      onClick={() => onViewTicket(booking)}
      className="cursor-pointer rounded-xl bg-slate-50 dark:bg-slate-700/30 p-4 border border-slate-200/60 hover:border-lime-300 hover:bg-white transition-all"
    >
      <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 mb-3 text-[11px]">
        <span className="font-mono font-bold text-slate-600">PNR: <span className="text-slate-900">{bookingId}</span></span>
        <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${
          isCancelled
            ? 'bg-red-100 text-red-700'
            : isCompleted
              ? 'bg-blue-100 text-blue-700'
              : 'bg-lime-100 text-lime-800'
        }`}>
          {isCompleted ? 'Completed' : (booking.status || booking.bookingStatus || "Confirmed")}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-400">Departure</p>
          <p className="text-base font-extrabold text-slate-900">{source}</p>
          <p className="text-sm text-slate-500">{depDate} · {depTime}</p>
        </div>
        <div className="px-3 text-center">
          <span className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1"><ServiceIcon size={10} /> {isFlight ? "Flight" : "Bus"}</span>
          <p className="text-xs font-medium text-slate-500 mt-0.5">{serviceName}</p>
        </div>
        <div className="text-right flex-1">
          <p className="text-xs font-bold text-slate-400">Arrival</p>
          <p className="text-base font-extrabold text-slate-900">{destination}</p>
          <p className="text-sm text-slate-500">{arrTime}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/50 mt-3">
        <span className="text-xs font-semibold text-slate-600">Seats: <span className="font-bold text-slate-800">{seats}</span></span>
        <div className="flex items-center gap-4">
          {!isCancelled && !isCompleted && (
            <button
              onClick={(e) => onCancelBooking(e, bookingId)}
              disabled={cancelLoading === bookingId}
              className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1 hover:bg-red-100 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          {!isCancelled && isCompleted && !isFlight && (reviewData ? (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenReview(booking); }}
                  className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1 hover:bg-green-100 flex items-center gap-1"
                >
                  <Star size={10} className="fill-green-500 text-green-500" />
                  {reviewData.rating}/5
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenReview(booking); }}
                  className="text-xs text-slate-500 hover:text-blue-600 underline"
                >
                  Edit
                </button>
              </div>
              {getReviewText(reviewData) ? (
                <p className="text-[10px] text-slate-500 max-w-[200px] text-right leading-tight truncate">
                  &ldquo;{getReviewText(reviewData)}&rdquo;
                </p>
              ) : null}
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onOpenReview(booking); }}
              className="text-xs font-bold text-lime-600 bg-lime-50 border border-lime-200 rounded-lg px-2.5 py-1 hover:bg-lime-100 flex items-center gap-1"
            >
              <Star size={10} />
              Review
            </button>
          ))}
          <span className="text-sm font-extrabold text-slate-900">₹{totalFare.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
