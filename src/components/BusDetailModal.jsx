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

export default function BusDetailModal({ busId, onClose }) {
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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