import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Bus, Wifi, BatteryCharging, Bed, Droplets, BookOpen, MapPin, ShieldAlert, Video } from "lucide-react";

const amenityIcons = {
  "WiFi": Wifi,
  "Charging Point": BatteryCharging,
  "Blanket": Bed,
  "Water Bottle": Droplets,
  "Reading Light": BookOpen,
  "GPS Tracking": MapPin,
  "Emergency Exit": ShieldAlert,
  "CCTV": Video,
};

// ── Seat Layout Helpers ─────────────────────────────────────────────────
function buildSeatGrid(seats, seatLayoutType) {
  if (!Array.isArray(seats) || seats.length === 0) return { columns: 3, grid: [] };
  const typeColMap = {
    "2+1_SLEEPER": 3, "2+2_SEATER": 4,
    "1+1_SLEEPER": 2, "2+1_SEATER": 3,
  };
  let columns = typeColMap[seatLayoutType] || 3;
  const maxCol = Math.max(...seats.map((s) => s.column || 0));
  if (maxCol > 0) columns = maxCol;
  const rowMap = {};
  seats.forEach((seat) => {
    const r = seat.row || 1;
    if (!rowMap[r]) rowMap[r] = [];
    rowMap[r].push(seat);
  });
  const sortedRows = Object.keys(rowMap)
    .sort((a, b) => Number(a) - Number(b))
    .map((r) => rowMap[r].sort((a, b) => (a.column || 0) - (b.column || 0)));
  return { columns, grid: sortedRows };
}

const SteeringWheel = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
    <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
  </svg>
);

// Read-only seat layout visualization for vendor view
function SeatLayoutPreview({ seats, seatLayoutType }) {
  if (!seats || seats.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-slate-400">
        No seat layout defined
      </div>
    );
  }

  // Separate by deck
  const lowerSeats = seats.filter(s => s.deck === "lower");
  const upperSeats = seats.filter(s => s.deck === "upper");

  const renderDeck = (deckSeats, deckLabel) => {
    if (deckSeats.length === 0) return null;
    const { columns, grid } = buildSeatGrid(deckSeats, seatLayoutType);

    return (
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{deckLabel}</p>
        <div className="bg-slate-100 rounded-xl p-3">
          <div className="flex justify-start mb-2"><SteeringWheel /></div>
          <div className="flex flex-col gap-2">
            {grid.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid items-center"
                style={{ gap: "6px", gridTemplateColumns: `repeat(${columns}, 52px)` }}
              >
                {(() => {
                  const rowByCol = {};
                  row.forEach((seat) => { rowByCol[seat.column || 1] = seat; });
                  return Array.from({ length: columns }, (_, colIdx) => {
                    const col = colIdx + 1;
                    const seat = rowByCol[col];
                    if (!seat) {
                      return <div key={`empty-${col}`} style={{ width: 52, height: 44 }} />;
                    }

                    const isSleeper = seat.isSleeper;
                    const seatTypeLabel = seat.seatType === "window" ? "W" : seat.seatType === "aisle" ? "A" : "M";

                    return (
                      <div
                        key={seat.seatNumber}
                        className={`rounded-lg flex flex-col items-center justify-center p-1 border-2 transition-all ${
                          isSleeper
                            ? "border-indigo-300 bg-indigo-50"
                            : "border-lime-300 bg-lime-50"
                        }`}
                        style={{ width: 52, height: isSleeper ? 52 : 44 }}
                        title={`${seat.seatNumber} — ${seat.seatType} (${seat.deck}) — ₹${seat.fare || 0}`}
                      >
                        <span className="text-[10px] font-black text-slate-800 leading-tight">{seat.seatNumber}</span>
                        <span className={`text-[8px] font-bold leading-tight ${isSleeper ? "text-indigo-500" : "text-lime-600"}`}>
                          {isSleeper ? "SL" : "ST"} · {seatTypeLabel}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-500 leading-tight">₹{seat.fare || 0}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderDeck(lowerSeats, "Lower Deck")}
      {renderDeck(upperSeats, "Upper Deck")}
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border-2 border-lime-300 bg-lime-50"></div>
          <span className="text-[10px] font-semibold text-slate-500">Seater</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border-2 border-indigo-300 bg-indigo-50"></div>
          <span className="text-[10px] font-semibold text-slate-500">Sleeper</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400">W = Window · A = Aisle · M = Middle</span>
        </div>
      </div>
    </div>
  );
}

export default function BusDetailModal({ busId, onClose }) {
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSeatLayout, setShowSeatLayout] = useState(false);

  useEffect(() => {
    const fetchBus = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/api/v1/buses/${busId}`);
        if (response.data.success) {
          setBus(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bus details");
        console.error("Error fetching bus:", err);
      } finally {
        setLoading(false);
      }
    };

    if (busId) {
      fetchBus();
    }
  }, [busId]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Bus Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-slate-600">Loading bus details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          ) : bus ? (
            <div className="space-y-6">
              {/* Bus Identity */}
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

              {/* Details Grid */}
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

              {/* Seat Distribution */}
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

              {/* Seat Layout Visual Map */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900">Seat Layout Map</h4>
                  <button
                    onClick={() => setShowSeatLayout(!showSeatLayout)}
                    className="text-xs font-bold text-lime-600 hover:text-lime-700 transition-colors"
                  >
                    {showSeatLayout ? "Hide Layout" : "Show Layout"}
                  </button>
                </div>
                {showSeatLayout && (
                  <SeatLayoutPreview seats={bus.seatLayout} seatLayoutType={bus.seatLayoutType} />
                )}
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {bus.isAC && <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">AC</span>}
                  {bus.isSleeper && <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">Sleeper</span>}
                  {bus.isSeater && <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">Seater</span>}
                  {bus.isGPSAvailable && <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold">GPS</span>}
                  {bus.isLiveTrackingEnabled && <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">Live Tracking</span>}
                </div>
              </div>

              {/* Amenities */}
              {bus.amenities && bus.amenities.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Amenities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {bus.amenities.map((amenity, idx) => {
                      const Icon = amenityIcons[amenity] || Bus;
                      return (
                        <div key={idx} className="flex items-center gap-2 bg-lime-50 rounded-lg px-3 py-2">
                          <Icon className="w-4 h-4 text-lime-600" />
                          <span className="text-xs font-semibold text-lime-800">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Created / Updated Timestamps */}
              <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-400">
                <span>Created: {bus.createdAt ? new Date(bus.createdAt).toLocaleDateString() : "—"}</span>
                <span>Updated: {bus.updatedAt ? new Date(bus.updatedAt).toLocaleDateString() : "—"}</span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}