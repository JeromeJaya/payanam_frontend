import React from "react";
import { X } from "lucide-react";

export default function FlightRouteFormModal({
  flights,
  flightRouteFormData,
  setFlightRouteFormData,
  flightRouteLoading,
  flightRouteSuccess,
  flightRouteError,
  airportSuggestions,
  airportSearchLoading,
  showSourceSuggestions,
  setShowSourceSuggestions,
  showDestSuggestions,
  setShowDestSuggestions,
  showStopSuggestions,
  setShowStopSuggestions,
  onSubmit,
  onClose,
  onSearchAirports,
  onSelectAirport,
  onSelectStopAirport,
  onAddStop,
  onUpdateStop,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Create Flight Route</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {flightRouteSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{flightRouteSuccess}</div>}
          {flightRouteError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{flightRouteError}</div>}

          {/* Flight Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Flight Details</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Flight *</label>
              <select value={flightRouteFormData.flightId}
                onChange={(e) => setFlightRouteFormData({ ...flightRouteFormData, flightId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" required>
                <option value="">Choose a flight...</option>
                {flights.map(flight => (
                  <option key={flight._id} value={flight._id}>{flight.airlineName} ({flight.registrationNumber})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Route Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Route Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Source Airport */}
              <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Source Airport *</label>
                <input type="text" value={flightRouteFormData.source.name}
                  onChange={(e) => {
                    setFlightRouteFormData({ ...flightRouteFormData, source: { ...flightRouteFormData.source, name: e.target.value } });
                    onSearchAirports(e.target.value); setShowSourceSuggestions(true);
                  }}
                  onFocus={() => flightRouteFormData.source.name && setShowSourceSuggestions(true)}
                  required className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Search airport (e.g., Delhi, DEL, Indira Gandhi)" />
                {showSourceSuggestions && airportSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {airportSuggestions.map((airport, index) => (
                      <div key={index} onClick={() => onSelectAirport(airport, "source")}
                        className="px-4 py-3 hover:bg-sky-50 cursor-pointer border-b border-slate-100 last:border-b-0">
                        <p className="text-sm font-bold text-slate-900">{airport.displayText}</p>
                        <p className="text-xs text-slate-500">{airport.city}, {airport.country}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Source IATA Code *</label>
                <input type="text" value={flightRouteFormData.source.iataCode}
                  onChange={(e) => setFlightRouteFormData({ ...flightRouteFormData, source: { ...flightRouteFormData.source, iataCode: e.target.value.toUpperCase() } })}
                  required maxLength="3" className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="e.g., DEL" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Source City *</label>
                <input type="text" value={flightRouteFormData.source.city}
                  onChange={(e) => setFlightRouteFormData({ ...flightRouteFormData, source: { ...flightRouteFormData.source, city: e.target.value } })}
                  required className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="e.g., Delhi" />
              </div>

              {/* Destination Airport */}
              <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Destination Airport *</label>
                <input type="text" value={flightRouteFormData.destination.name}
                  onChange={(e) => {
                    setFlightRouteFormData({ ...flightRouteFormData, destination: { ...flightRouteFormData.destination, name: e.target.value } });
                    onSearchAirports(e.target.value); setShowDestSuggestions(true);
                  }}
                  onFocus={() => flightRouteFormData.destination.name && setShowDestSuggestions(true)}
                  required className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Search airport (e.g., Mumbai, BOM, Chhatrapati Shivaji)" />
                {showDestSuggestions && airportSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {airportSuggestions.map((airport, index) => (
                      <div key={index} onClick={() => onSelectAirport(airport, "destination")}
                        className="px-4 py-3 hover:bg-sky-50 cursor-pointer border-b border-slate-100 last:border-b-0">
                        <p className="text-sm font-bold text-slate-900">{airport.displayText}</p>
                        <p className="text-xs text-slate-500">{airport.city}, {airport.country}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Destination IATA Code *</label>
                <input type="text" value={flightRouteFormData.destination.iataCode}
                  onChange={(e) => setFlightRouteFormData({ ...flightRouteFormData, destination: { ...flightRouteFormData.destination, iataCode: e.target.value.toUpperCase() } })}
                  required maxLength="3" className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="e.g., BOM" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Destination City *</label>
                <input type="text" value={flightRouteFormData.destination.city}
                  onChange={(e) => setFlightRouteFormData({ ...flightRouteFormData, destination: { ...flightRouteFormData.destination, city: e.target.value } })}
                  required className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="e.g., Mumbai" />
              </div>
            </div>
          </div>

          {/* Stops */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Stops (Optional)</h3>
              <button type="button" onClick={onAddStop} className="text-sm font-bold text-sky-600 hover:text-sky-700">+ Add Stop</button>
            </div>
            {flightRouteFormData.stops.length === 0 ? (
              <p className="text-sm text-slate-500">No stops added. This will be a direct flight.</p>
            ) : (
              <div className="space-y-3">
                {flightRouteFormData.stops.map((stop, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-slate-700">Stop {index + 1}</h4>
                      <button type="button" onClick={() => {
                        setFlightRouteFormData(prev => ({ ...prev, stops: prev.stops.filter((_, i) => i !== index) }));
                      }} className="text-xs text-red-600 hover:text-red-700">Remove</button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="relative">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Airport Name</label>
                        <input type="text" value={stop.name}
                          onChange={(e) => { onUpdateStop(index, "name", e.target.value); onSearchAirports(e.target.value); setShowStopSuggestions(prev => ({ ...prev, [index]: true })); }}
                          onFocus={() => stop.name && setShowStopSuggestions(prev => ({ ...prev, [index]: true }))}
                          className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400" placeholder="Search airport" />
                        {showStopSuggestions[index] && airportSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {airportSuggestions.map((airport, idx) => (
                              <div key={idx} onClick={() => onSelectStopAirport(airport, index)}
                                className="px-4 py-3 hover:bg-sky-50 cursor-pointer border-b border-slate-100 last:border-b-0">
                                <p className="text-sm font-bold text-slate-900">{airport.displayText}</p>
                                <p className="text-xs text-slate-500">{airport.city}, {airport.country}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">IATA Code</label>
                        <input type="text" value={stop.iataCode} onChange={(e) => onUpdateStop(index, "iataCode", e.target.value.toUpperCase())}
                          maxLength="3" className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400" placeholder="e.g., BLR" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                        <input type="text" value={stop.city} onChange={(e) => onUpdateStop(index, "city", e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400" placeholder="City" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Arrival Time</label>
                        <input type="time" value={stop.arrivalTime} onChange={(e) => onUpdateStop(index, "arrivalTime", e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Departure Time</label>
                        <input type="time" value={stop.departureTime} onChange={(e) => onUpdateStop(index, "departureTime", e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Minutes from Source</label>
                        <input type="number" value={stop.minutesFromSource} onChange={(e) => onUpdateStop(index, "minutesFromSource", parseInt(e.target.value) || 0)}
                          min="0" className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Additional Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Distance (km) *</label>
                <input type="number" value={flightRouteFormData.distanceInKm}
                  onChange={(e) => setFlightRouteFormData({ ...flightRouteFormData, distanceInKm: e.target.value })}
                  required min="0" step="0.1" className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="e.g., 1150" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Estimated Duration (minutes) *</label>
                <input type="number" value={flightRouteFormData.estimatedDurationInMinutes}
                  onChange={(e) => setFlightRouteFormData({ ...flightRouteFormData, estimatedDurationInMinutes: e.target.value })}
                  required min="0" className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" placeholder="e.g., 135" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={flightRouteLoading}
              className="flex-1 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {flightRouteLoading ? "Creating Route..." : "Create Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
