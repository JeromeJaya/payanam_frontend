import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";
import BookingCard from "./BookingCard.jsx";

export default function BookingsHistory({ bookings, bookingsLoading, reviewsByBooking, cancelLoading, onViewTicket, onCancelBooking, onOpenReview }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h4 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100">My Bookings History</h4>
      {bookingsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-lime-500 border-t-transparent"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-10">
          <Ticket size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-700">No trips found</p>
          <Link to="/MainPage" className="mt-3 inline-flex text-xs bg-lime-500 text-white font-bold px-4 py-2 rounded-xl">Book Your First Ride</Link>
        </div>
      ) : (
        <div className="space-y-4 max-h-[450px] overflow-y-auto">
          {bookings.map((b, i) => (
            <BookingCard
              key={b.bookingId || `BK-${1000 + i}`}
              booking={b}
              idx={i}
              cancelLoading={cancelLoading}
              reviewsByBooking={reviewsByBooking}
              onViewTicket={onViewTicket}
              onCancelBooking={onCancelBooking}
              onOpenReview={onOpenReview}
            />
          ))}
        </div>
      )}
    </div>
  );
}
