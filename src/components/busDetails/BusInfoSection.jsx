import { Bus } from "lucide-react";

export default function BusInfoSection({ bus }) {
  return (
    <>
      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
          <Bus className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{bus.busName}</h3>
          <p className="text-sm text-slate-500">{bus.busNumber}</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
          bus.status === "ACTIVE"
            ? "bg-green-100 text-green-700"
            : bus.status === "MAINTENANCE"
            ? "bg-amber-100 text-amber-700"
            : "bg-slate-100 text-slate-600"
        }`}>
          {bus.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Operator</p>
          <p className="text-sm font-bold text-slate-900">{bus.operatorName || "—"}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Registration Number</p>
          <p className="text-sm font-bold text-slate-900">{bus.registrationNumber || "—"}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bus Type</p>
          <p className="text-sm font-bold text-slate-900">{bus.busType?.replace(/_/g, " ") || "—"}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Seat Layout</p>
          <p className="text-sm font-bold text-slate-900">{bus.seatLayoutType?.replace(/_/g, " ") || "—"}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Seats</p>
          <p className="text-sm font-bold text-slate-900">{bus.totalSeats || "—"}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Ratings</p>
          <p className="text-sm font-bold text-slate-900">
            {bus.averageRating > 0 ? `${bus.averageRating} ⭐ (${bus.totalRatings})` : "No ratings yet"}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3">Seat Distribution</h4>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-slate-900">{bus.lowerDeckSeats || 0}</p>
            <p className="text-xs text-slate-500">Lower Deck</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-slate-900">{bus.upperDeckSeats || 0}</p>
            <p className="text-xs text-slate-500">Upper Deck</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-slate-900">{bus.sleeperSeats || 0}</p>
            <p className="text-xs text-slate-500">Sleeper</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-slate-900">{bus.seaterSeats || 0}</p>
            <p className="text-xs text-slate-500">Seater</p>
          </div>
        </div>
      </div>
    </>
  );
}
