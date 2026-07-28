import { Star } from "lucide-react";
import { useState } from "react";
import SeatSelection from "../booking/BusBooking/SeatSelection.jsx";
import BusReviewForm from "../components/BusReviewForm.jsx";

/** Converts a total minutes value to "Xh Ym" format (e.g. 435 → "7h 15m") */
function formatDuration(minutes) {
  if (minutes == null || isNaN(minutes)) return "--h --m";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

export default function BusCard({
  busName = "Unknown Bus",
  busNumber,
  busType = "Standard",
  departureTime = "--:--",
  arrivalTime = "--:--",
  travelDuration,
  availableSeats = 0,
  calculatedFare = "N/A",
  operatorName = "Unknown Operator",
  averageRating = "N/A",
  totalRatings = 0,
  amenities = [],
  scheduleId,
  boardingPoints = [],
  droppingPoints = [],
  busId,
  maxSeats,
}) {
  const [showLayout, setShowLayout] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/30 border border-gray-100 dark:border-slate-700 hover:border-cyan-200 dark:hover:border-cyan-600 hover:bg-cyan-50/30 dark:hover:bg-slate-700/30 transition-all duration-300">

        {/* ================= Top/Main Section ================= */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          {/* Use CSS Grid for robust layout handling on all screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-center">

            {/* 1. Left Section: Bus details */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight leading-snug break-words">
                  {busName}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 mt-0.5">
                  {busType}{busNumber ? <span className="ml-2 text-slate-400 dark:text-slate-500">({busNumber})</span> : null}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{operatorName}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded bg-emerald-600 dark:bg-emerald-500 px-1.5 py-0.5 text-white">
                  <Star size={12} fill="white" className="text-white" />
                  <span className="font-semibold text-xs">
                    {averageRating ?? "N/A"}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                  ({totalRatings ?? 0} Reviews)
                </span>
              </div>
              {busId && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-xs text-lime-600 dark:text-lime-400 hover:underline font-medium"
                >
                  Write a Review
                </button>
              )}

              {/* Amenities tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Array.isArray(amenities) && amenities.length > 0 ? (
                  amenities.slice(0, 3).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-0.5 text-xs text-gray-600 dark:text-slate-300 font-medium whitespace-nowrap"
                    >
                      {amenity}
                    </span>
                  ))
                ) : (
                  <span className="rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-0.5 text-xs text-gray-400 dark:text-slate-500 italic">
                    No amenities listed
                  </span>
                )}
              </div>
            </div>

            {/* 2. Center Section: Timeline & Duration */}
            <div className="flex items-center justify-between sm:justify-center gap-3 md:gap-4 lg:col-span-2 border-y border-dashed border-gray-100 dark:border-slate-700 py-3 sm:py-0 sm:border-none">
              <div className="text-left sm:text-center min-w-[70px]">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-slate-200">
                  {departureTime}
                </h3>
                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
                  Departs
                </p>
              </div>

              {/* Progress visual timeline indicator */}
              <div className="flex-1 flex items-center justify-center max-w-[140px] px-1">
                <div className="hidden xs:block h-px flex-1 bg-gray-300/80 dark:bg-slate-600 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-slate-400"></div>
                </div>
                <span className="mx-2 whitespace-nowrap text-xs font-bold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full border border-gray-200 dark:border-slate-600">
                  {formatDuration(travelDuration)}
                </span>
                <div className="hidden xs:block h-px flex-1 bg-gray-300/80 dark:bg-slate-600 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-gray-400 dark:border-slate-400 bg-white dark:bg-slate-800"></div>
                </div>
              </div>

              <div className="text-right sm:text-center min-w-[70px]">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-slate-200">
                  {arrivalTime}
                </h3>
                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
                  Arrives
                </p>
              </div>
            </div>

            {/* 3. Right Section: Pricing and seat capacity info */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-5 sm:text-right">
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-medium sm:hidden">Fare</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">
                  {calculatedFare !== "N/A" ? `₹${calculatedFare}` : calculatedFare}
                </h2>
              </div>
              <div className="text-right">
                <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700 whitespace-nowrap">
                  {availableSeats} Seats Left
                </span>
              </div>
                        <button
                          onClick={() => setShowLayout(!showLayout)}
                          className="w-full sm:w-auto rounded-xl bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-[0.98] px-6 py-2.5 text-sm font-bold text-white transition-all shadow-md dark:shadow-blue-900/30 shadow-blue-200 tracking-wide text-center uppercase"
                        >
                          {showLayout ? "Hide Seats" : "Select Seats"}
                        </button>
            </div>

          </div>
          
        </div>


      </div>

      {showLayout && (
        <div className="w-full mt-2 transition-all duration-300">
          <SeatSelection
            scheduleId={scheduleId}
            boardingPoints={boardingPoints}
            droppingPoints={droppingPoints}
            maxSeats={maxSeats}
          />
        </div>
      )}

      {showReviewForm && busId && (
        <div className="w-full mt-4 px-4 sm:px-5 md:px-6">
          <BusReviewForm
            busId={busId}
            busName={busName}
            onReviewAdded={() => setShowReviewForm(false)}
          />
        </div>
      )}
    </>
  );
}