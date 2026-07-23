import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Bus, Clock, Route } from "lucide-react";

export default function BusRoutesModal({ bus, onClose }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/api/v1/buses/${bus._id}/routes`);
        if (response.data.success) {
          setRoutes(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch routes");
        console.error("Error fetching routes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (bus?._id) {
      fetchRoutes();
    }
  }, [bus?._id]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Routes for {bus.busName}</h2>
              <p className="text-xs text-slate-500">{bus.busNumber}</p>
            </div>
          </div>
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
              <p className="text-sm text-slate-600">Loading routes...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          ) : routes.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <Route className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Routes Defined</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                This bus doesn't have any routes yet. Go to the Routes tab to create one.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {routes.map((route) => (
                <div key={route._id} className="border border-slate-200 rounded-xl p-5 hover:border-lime-500 transition-all">
                  {/* Route Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-lime-500"></div>
                        <span className="font-bold text-slate-900">{route.source?.city}</span>
                        <span className="text-slate-400 text-sm">{route.source?.state}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <span className="text-lg">→</span>
                        <span className="text-xs font-medium">{route.distanceInKm} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="font-bold text-slate-900">{route.destination?.city}</span>
                        <span className="text-slate-400 text-sm">{route.destination?.state}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      route.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {route.status}
                    </span>
                  </div>

                  {/* Route Metrics */}
                  <div className="flex flex-wrap gap-4 mb-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Route className="w-3.5 h-3.5" />
                      {route.distanceInKm} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {route.estimatedDurationInMinutes} min
                    </span>
                    {route.farePerKm > 0 && (
                      <span className="font-semibold text-lime-700">
                        ₹{route.farePerKm}/km
                      </span>
                    )}
                  </div>

                  {/* Stops Timeline */}
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-600 mb-2">Stops ({route.stops?.length || 0})</p>
                    <div className="space-y-1">
                      {route.stops?.map((stop, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <div className="flex flex-col items-center">
                            <div className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-lime-500" : idx === route.stops.length - 1 ? "bg-red-500" : "bg-slate-400"}`}></div>
                            {idx < route.stops.length - 1 && <div className="w-0.5 h-4 bg-slate-300"></div>}
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <span className="font-medium text-slate-900">{stop.city}</span>
                              {stop.state && <span className="text-slate-400 ml-1">{stop.state}</span>}
                            </div>
                            <div className="flex items-center gap-3 text-slate-500">
                              <span>Arr: {stop.arrivalTime}</span>
                              <span>Dep: {stop.departureTime}</span>
                              {stop.distanceFromSource > 0 && <span>{stop.distanceFromSource}km</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}