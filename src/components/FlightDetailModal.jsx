import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Plane, Wifi, Utensils, Tv, BatteryCharging, Armchair, GlassWater, Users } from "lucide-react";

const amenityIcons = {
  "WiFi": Wifi,
  "Meal": Utensils,
  "Entertainment": Tv,
  "Power Outlet": BatteryCharging,
  "USB Charging": BatteryCharging,
  "Bluetooth Audio": Tv,
  "Streaming Entertainment": Tv,
  "Pillow": Armchair,
  "Alcohol": GlassWater,
  "Vegetarian Meal": Utensils,
  "Vegan Meal": Utensils,
  "Kosher Meal": Utensils,
  "Halal Meal": Utensils,
  "Extra Legroom": Armchair,
  "Priority Boarding": Users,
  "Wheelchair Assistance": Users,
  "Pet Friendly": Users,
  "Infant Bassinet": Users,
  "Lounge Access": Users,
};

export default function FlightDetailModal({ flightId, onClose }) {
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFlight = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/api/v1/flights/${flightId}`);
        if (response.data.success) {
          setFlight(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch flight details");
        console.error("Error fetching flight:", err);
      } finally {
        setLoading(false);
      }
    };

    if (flightId) {
      fetchFlight();
    }
  }, [flightId]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Flight Details</h2>
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
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-slate-600">Loading flight details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          ) : flight ? (
            <div className="space-y-6">
              {/* Flight Identity */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{flight.airlineName}</h3>
                  <p className="text-sm text-slate-500">{flight.registrationNumber}</p>
                </div>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
                  flight.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {flight.status}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Operator</p>
                  <p className="text-sm font-bold text-slate-900">{flight.operatorName || "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Manufacturer</p>
                  <p className="text-sm font-bold text-slate-900">{flight.manufacturer || "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Aircraft Model</p>
                  <p className="text-sm font-bold text-slate-900">{flight.aircraftModel || "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Aircraft Type</p>
                  <p className="text-sm font-bold text-slate-900">{flight.aircraftType?.replace(/_/g, " ") || "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Seats</p>
                  <p className="text-sm font-bold text-slate-900">{flight.totalSeats || "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Cabin Classes</p>
                  <p className="text-sm font-bold text-slate-900">{(() => {
                    const cabinClasses = flight.cabinClasses || flight?.flight?.cabinClasses || [];
                    const cabinClass = flight.cabinClass || flight?.cabin?.class || "";
                    if (Array.isArray(cabinClasses) && cabinClasses.length > 0) {
                      return cabinClasses.map(cc => String(cc).replace(/_/g, " ")).join(", ");
                    }
                    if (cabinClass) return String(cabinClass).replace(/_/g, " ");
                    return "—";
                  })()}</p>
                </div>
              </div>

              {/* Seat Distribution */}
              {(flight.economySeats > 0 || flight.premiumEconomySeats > 0 || flight.businessSeats > 0 || flight.firstClassSeats > 0) && (
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Seat Distribution</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {flight.economySeats > 0 && (
                      <div className="bg-sky-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-600 mb-1">Economy</p>
                        <p className="text-lg font-bold text-sky-600">{flight.economySeats}</p>
                      </div>
                    )}
                    {flight.premiumEconomySeats > 0 && (
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-600 mb-1">Premium Economy</p>
                        <p className="text-lg font-bold text-blue-600">{flight.premiumEconomySeats}</p>
                      </div>
                    )}
                    {flight.businessSeats > 0 && (
                      <div className="bg-indigo-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-600 mb-1">Business</p>
                        <p className="text-lg font-bold text-indigo-600">{flight.businessSeats}</p>
                      </div>
                    )}
                    {flight.firstClassSeats > 0 && (
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-600 mb-1">First Class</p>
                        <p className="text-lg font-bold text-purple-600">{flight.firstClassSeats}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {flight.amenities && flight.amenities.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Amenities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {flight.amenities.map((amenity, index) => {
                      const IconComponent = amenityIcons[amenity];
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-slate-50 rounded-lg p-3"
                        >
                          {IconComponent && (
                            <IconComponent className="w-4 h-4 text-sky-600" />
                          )}
                          <span className="text-sm text-slate-700">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seat Layout Info */}
              {flight.seatLayout && flight.seatLayout.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Seat Layout</h4>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600">
                      Total seats configured: <span className="font-bold text-slate-900">{flight.seatLayout.length}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Seat layout is automatically generated based on cabin class configuration
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}