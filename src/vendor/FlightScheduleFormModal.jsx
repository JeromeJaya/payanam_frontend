import React from "react";
import { X } from "lucide-react";

export default function FlightScheduleFormModal({
  flights,
  flightRoutes,
  flightRoutesLoading,
  flightScheduleFormData,
  setFlightScheduleFormData,
  flightScheduleLoading,
  flightScheduleSuccess,
  flightScheduleError,
  onSubmit,
  onClose,
  onFetchFlightRoutes,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Create Flight Schedule</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {flightScheduleSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{flightScheduleSuccess}</div>}
          {flightScheduleError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{flightScheduleError}</div>}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Flight *</label>
              <select value={flightScheduleFormData.flightId}
                onChange={(e) => {
                  const flightId = e.target.value;
                  setFlightScheduleFormData({ ...flightScheduleFormData, flightId, routeId: "" });
                  if (flightId) onFetchFlightRoutes(flightId);
                }}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" required>
                <option value="">Choose a flight...</option>
                {flights.map(flight => (
                  <option key={flight._id} value={flight._id}>{flight.airlineName} ({flight.registrationNumber})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Flight Number *</label>
              <input type="text" value={flightScheduleFormData.flightNumber}
                onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, flightNumber: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                required placeholder="e.g., 6E-204" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Route *</label>
              <select value={flightScheduleFormData.routeId}
                onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, routeId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                required disabled={!flightScheduleFormData.flightId || flightRoutesLoading}>
                <option value="">Choose a route...</option>
                {flightRoutes.map(route => (
                  <option key={route._id} value={route._id}>{route.source?.city} → {route.destination?.city}</option>
                ))}
              </select>
              {flightRoutesLoading && <p className="text-xs text-slate-500 mt-1">Loading routes...</p>}
              {!flightScheduleFormData.flightId && <p className="text-xs text-amber-600 mt-1">Please select a flight first</p>}
              {flightScheduleFormData.flightId && !flightRoutesLoading && flightRoutes.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">No routes available. Create routes for this flight first.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Base Fare (₹) *</label>
              <input type="number" value={flightScheduleFormData.baseFare}
                onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, baseFare: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                required min="0" step="0.01" placeholder="e.g., 4500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Departure Date *</label>
              <input type="date" value={flightScheduleFormData.departureDate}
                onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, departureDate: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Arrival Date *</label>
              <input type="date" value={flightScheduleFormData.arrivalDate}
                onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, arrivalDate: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Departure Time *</label>
              <input type="time" value={flightScheduleFormData.departureTime}
                onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, departureTime: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Arrival Time *</label>
              <input type="time" value={flightScheduleFormData.arrivalTime}
                onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, arrivalTime: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Departure Terminal *</label>
              <input type="text" value={flightScheduleFormData.departureTerminal}
                onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, departureTerminal: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                required placeholder="e.g., Terminal 3" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Arrival Terminal *</label>
              <input type="text" value={flightScheduleFormData.arrivalTerminal}
                onChange={(e) => setFlightScheduleFormData({ ...flightScheduleFormData, arrivalTerminal: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                required placeholder="e.g., T2" />
            </div>
          </div>

          {/* Meal Options */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Meal Options</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={flightScheduleFormData.mealOptions.includes("VEG")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFlightScheduleFormData({ ...flightScheduleFormData, mealOptions: [...flightScheduleFormData.mealOptions, "VEG"] });
                    } else {
                      setFlightScheduleFormData({ ...flightScheduleFormData, mealOptions: flightScheduleFormData.mealOptions.filter(m => m !== "VEG") });
                    }
                  }} className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500" />
                <span className="text-sm text-slate-700">Vegetarian</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={flightScheduleFormData.mealOptions.includes("NON_VEG")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFlightScheduleFormData({ ...flightScheduleFormData, mealOptions: [...flightScheduleFormData.mealOptions, "NON_VEG"] });
                    } else {
                      setFlightScheduleFormData({ ...flightScheduleFormData, mealOptions: flightScheduleFormData.mealOptions.filter(m => m !== "NON_VEG") });
                    }
                  }} className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500" />
                <span className="text-sm text-slate-700">Non-Vegetarian</span>
              </label>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Cancellation Policy</label>
            <div className="space-y-2">
              {flightScheduleFormData.cancellationPolicy.map((policy, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Hours Before Departure</label>
                    <input type="number" value={policy.hoursBeforeDeparture}
                      onChange={(e) => {
                        const newPolicy = [...flightScheduleFormData.cancellationPolicy];
                        newPolicy[index] = { ...newPolicy[index], hoursBeforeDeparture: parseInt(e.target.value) || 0 };
                        setFlightScheduleFormData({ ...flightScheduleFormData, cancellationPolicy: newPolicy });
                      }} className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Refund Percentage</label>
                    <input type="number" value={policy.refundPercentage}
                      onChange={(e) => {
                        const newPolicy = [...flightScheduleFormData.cancellationPolicy];
                        newPolicy[index] = { ...newPolicy[index], refundPercentage: parseInt(e.target.value) || 0 };
                        setFlightScheduleFormData({ ...flightScheduleFormData, cancellationPolicy: newPolicy });
                      }} className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-400" min="0" max="100" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={flightScheduleLoading}
              className="flex-1 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {flightScheduleLoading ? "Creating..." : "Create Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
