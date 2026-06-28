import { Star, ChevronDown } from "lucide-react";
import { useState } from "react";
import SeatSelection from "../booking/BusBooking/SeatSelection.jsx";

/** Converts a total minutes value to "Xh Ym" format (e.g. 435 → "7h 15m") */
function formatDuration(minutes) {
  if (minutes == null || isNaN(minutes)) return "--h --m";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

export default function BusCard({
  busName = "Unknown Bus",
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
  boardingPoints = [],
  droppingPoints = [],
}) {
  const [showLayout, setShowLayout] = useState(false);

  return (
    <>
      <div className="w-full overflow-hidden rounded-3xl bg-white shadow-3xl hover:bg-cyan-50 transition-colors">

        {/* ================= Top Section ================= */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-[2fr_1.5fr_1fr] items-center gap-8">

            {/* ================= Left ================= */}
            <div className="space-y-3">

              <div>
                <h2 className="text-2xl font-bold">{busName}</h2>
                <p className="text-sm text-gray-500">{busType}</p>
                <p className="text-sm text-slate-500">{operatorName}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded bg-blue-700 px-2 py-1 text-white">
                  <Star size={14} fill="white" />
                  <span className="font-semibold">
                    {averageRating ?? "N/A"}
                  </span>
                </div>

                <span className="text-sm text-gray-600">
                  {totalRatings ?? 0} Reviews
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {Array.isArray(amenities) && amenities.length > 0 ? (
                  amenities.slice(0, 4).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg border px-4 py-2 text-sm text-gray-600"
                    >
                      {amenity}
                    </span>
                  ))
                ) : (
                  <span className="rounded-lg border px-4 py-2 text-sm text-gray-600">
                    No amenities listed
                  </span>
                )}
              </div>
            </div>

            {/* ================= Center ================= */}
            <div className="flex items-center justify-center gap-6">

              <div className="text-center">
                <h3 className="text-3xl font-semibold">
                  {departureTime}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Departure
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px w-16 bg-gray-300"></div>

                <span className="whitespace-nowrap text-sm text-gray-500">
                  {formatDuration(travelDuration)}
                </span>

                <div className="h-px w-16 bg-gray-300"></div>
              </div>

              <div className="text-center">
                <h3 className="text-3xl font-semibold">
                  {arrivalTime}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Arrival
                </p>
              </div>

            </div>

            {/* ================= Right ================= */}
            <div className="flex flex-col items-end justify-center">

              <h2 className="text-5xl font-bold">
                {calculatedFare !== "N/A"
                  ? `₹ ${calculatedFare}`
                  : calculatedFare}
              </h2>

              <p className="mt-3 text-gray-500">
                {availableSeats} Seats Available
              </p>

            </div>

          </div>
        </div>

        {/* ================= Bottom Bar ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-200 px-8 py-3">

          <div className="flex flex-wrap gap-5">

            {[
              "Photos",
              "Amenities",
              "Pickup & Drop Points",
              "Ratings & Reviews",
              "Policies",
            ].map((item) => (
              <button
                key={item}
                className="flex items-center gap-1 text-gray-700 transition hover:text-blue-600"
              >
                {item}
                <ChevronDown size={16} />
              </button>
            ))}

          </div>

          <button
            onClick={() => setShowLayout(!showLayout)}
            className="rounded-xl bg-blue-600 px-12 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {showLayout ? "HIDE LAYOUT" : "SELECT SEATS"}
          </button>

        </div>

      </div>

      {showLayout && <SeatSelection
        boardingPoints={boardingPoints}
        droppingPoints={droppingPoints}
      />}
    </>
  );
}