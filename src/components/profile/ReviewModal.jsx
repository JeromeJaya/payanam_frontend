import { Star, XCircle, Send, Loader2 } from "lucide-react";

export default function ReviewModal({
  showReviewModal, reviewBooking, reviewRating, reviewText,
  reviewLoading, reviewError, reviewSuccess, reviewEditMode,
  onClose, onSubmit, onRatingChange, onTextChange,
}) {
  if (!showReviewModal || !reviewBooking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-lime-500" />
            {reviewEditMode ? "Edit Your Review" : "Write a Review"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <XCircle className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          How was your experience with {reviewBooking.busId?.busName || "this service"}?
        </p>

        {reviewError && (
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs text-red-700 dark:text-red-400">{reviewError}</p>
          </div>
        )}
        {reviewSuccess && (
          <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-400">{reviewSuccess}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Rating *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onRatingChange(star)}
                  className={`p-0.5 transition-colors ${
                    star <= reviewRating ? "text-yellow-400" : "text-slate-300 hover:text-yellow-300"
                  }`}
                >
                  <Star className="w-5 h-5" fill={star <= reviewRating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Your Review</label>
            <textarea
              value={reviewText}
              onChange={onTextChange}
              placeholder="Share your experience..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-lime-500 outline-none resize-y"
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-slate-400">{reviewText.length}/1000 characters</span>
              {reviewText.length > 0 && reviewText.length < 10 && (
                <span className="text-xs text-red-500">Minimum 10 characters</span>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={reviewLoading || reviewRating === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reviewLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {reviewEditMode ? "Updating..." : "Submitting..."}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {reviewEditMode ? "Update Review" : "Submit Review"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
