import { IndianRupee, X } from "lucide-react";

/**
 * BookingSummary – displays selected seats grouped by bus and the grand total.
 * Renders inside the right panel of SeatSelection, below Pickup & Drop Points.
 */
export default function BookingSummary({ busSelections, onClear }) {
  const entries = Object.entries(busSelections).filter(
    ([, data]) => data.seats.length > 0
  );

  const grandTotal = entries.reduce((sum, [, data]) => sum + (data.total || 0), 0);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-10 text-gray-400">
        <IndianRupee size={36} strokeWidth={1.2} />
        <p className="mt-2 text-sm font-medium">No seats selected yet</p>
        <p className="text-xs">Tap on a seat to begin booking</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-2 shadow-xl">
      {/* ── Header ──────────────────────────────────── */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">Booking Summary</h3>
        {typeof onClear === "function" && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50"
          >
            <X size={14} />
            Clear all
          </button>
        )}
      </div>

      {/* ── Per-bus seat list ────────────────────────── */}
      <div className="space-y-1">
        {entries.map(([busName, { seats, total }]) => (
          <div
            key={busName}
            className="rounded-2xl bg-blue-50/60 p-1/2 transition hover:bg-blue-50"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {busName}
              </span>


            <div className="mt-2 flex flex-wrap gap-1.5">
              {seats.map((seatId) => (
                <span
                  key={seatId}
                  className="inline-flex items-center rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-700 shadow-sm"
                >
                  {seatId}
                </span>
              ))}
            </div>
            </div>

          </div>
        ))}
      </div>

      {/* ── Grand total ─────────────────────────────── */}
      <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-1">
        <span className="text-lg font-bold text-gray-800">Total Payable</span>
        <span className="text-xl font-extrabold text-blue-700 mr-5">
          ₹ {grandTotal.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
