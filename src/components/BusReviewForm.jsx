import { useState, useEffect } from "react";
import { Star, MessageCircle, Send, Loader2, AlertCircle } from "lucide-react";
import api from "../api/axios";

export default function BusReviewForm({ busId, busName, onReviewAdded }) {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        const res = await api.get(`/api/v1/bookings/vendor-bookings?operatorId=${busId}&status=CONFIRMED`);
        if (res.data.success) {
          const busBookings = res.data.data.filter(b => b.busId?._id === busId || b.busId === busId);
          setBookings(busBookings);
          if (busBookings.length > 0) {
            setSelectedBookingId(busBookings[0]._id);
          }
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchCompletedBookings();
  }, [busId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingId) {
      setError("Please select a booking");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars");
      return;
    }
    if (review.trim() && review.trim().length < 10) {
      setError("Review must be at least 10 characters long");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post(`/api/v1/buses/${busId}/reviews`, {
        bookingId: selectedBookingId,
        rating,
        review: review.trim(),
      });

      if (res.data.success) {
        setSuccess("Review added successfully!");
        setRating(0);
        setReview("");
        setTimeout(() => {
          setSuccess("");
          onReviewAdded?.();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Add a Review
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            You can only review buses after completing a journey with them.
          </p>
          <p className="text-xs text-slate-500">
            No completed bookings found for this bus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-lime-600" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Add a Review for "{busName}"
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Select Booking
          </label>
          <select
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-lime-500 outline-none"
          >
            <option value="">Choose a completed booking</option>
            {bookings.map((booking) => (
              <option key={booking._id} value={booking._id}>
                Booking ID: {booking.bookingId} • {new Date(booking.journeyDate).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Your Rating *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 transition-colors ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-slate-300 hover:text-yellow-300"
                }`}
              >
                <Star className="w-6 h-6" fill={star <= rating ? "currentColor" : "none"} />
              </button>
            ))}
            <span className="text-sm text-slate-500 ml-2">
              {rating > 0 ? `${rating}/5 stars` : "Click to rate"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Your Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this bus journey..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-lime-500 outline-none resize-y"
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-slate-400">
              {review.length}/1000 characters
            </span>
            {review.length > 0 && review.length < 10 && (
              <span className="text-xs text-red-500">Minimum 10 characters required</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedBookingId || rating === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding Review...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
}