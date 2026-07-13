import React from "react";
import { X, Route } from "lucide-react";

export default function ViewFlightRoutesModal({
  flightRoutes,
  flightRoutesLoading,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Flight Routes</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {flightRoutesLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Loading routes...</p>
            </div>
          ) : flightRoutes.length === 0 ? (
            <div className="text-center py-12">
              <Route className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">No Routes Found</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">This flight doesn't have any routes yet. Create a route to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flightRoutes.map((route, index) => (
                <div key={route._id || index} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-sky-500 dark:hover:border-sky-600 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                      <Route className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Route {index + 1}</h4>
                      <p className="text-xs text-slate-500">{route.source?.city} → {route.destination?.city}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Source</p>
                      <p className="text-sm font-bold text-slate-900">{route.source?.name}</p>
                      <p className="text-xs text-slate-600">{route.source?.city}, {route.source?.country} ({route.source?.iataCode})</p>
                    </div>

                    {route.stops && route.stops.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Stops</p>
                        <div className="space-y-2">
                          {route.stops.map((stop, stopIndex) => (
                            <div key={stopIndex} className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                                {stop.order || stopIndex + 1}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{stop.name}</p>
                                <p className="text-xs text-slate-600">{stop.city} ({stop.iataCode}) - {stop.arrivalTime} to {stop.departureTime}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Destination</p>
                      <p className="text-sm font-bold text-slate-900">{route.destination?.name}</p>
                      <p className="text-xs text-slate-600">{route.destination?.city}, {route.destination?.country} ({route.destination?.iataCode})</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Distance</p>
                        <p className="text-sm font-bold text-slate-900">{route.distanceInKm} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Duration</p>
                        <p className="text-sm font-bold text-slate-900">{route.estimatedDurationInMinutes} min</p>
                      </div>
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
