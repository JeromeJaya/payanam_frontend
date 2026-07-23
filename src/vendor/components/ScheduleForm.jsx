export default function ScheduleForm({
  scheduleFormData,
  setScheduleFormData,
  scheduleSuccess,
  scheduleError,
  onFetchBusRoutes,
  buses,
  busRoutes,
  busRoutesLoading,
}) {
  return (
    <>
      {scheduleSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{scheduleSuccess}</div>}
      {scheduleError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{scheduleError}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Select Bus *</label>
          <select
            value={scheduleFormData.busId}
            onChange={(e) => {
              const busId = e.target.value;
              setScheduleFormData({ ...scheduleFormData, busId, routeId: "" });
              onFetchBusRoutes(busId);
            }}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
            required
          >
            <option value="">Choose a bus...</option>
            {buses.filter(b => b.status === "ACTIVE").map(bus => (
              <option key={bus._id} value={bus._id}>{bus.busName} ({bus.busNumber})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Select Route *</label>
          <select
            value={scheduleFormData.routeId}
            onChange={(e) => setScheduleFormData({ ...scheduleFormData, routeId: e.target.value })}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
            required disabled={!scheduleFormData.busId || busRoutesLoading}
          >
            <option value="">Choose a route...</option>
            {busRoutes.map(route => (
              <option key={route._id} value={route._id}>{route.source.city} -- {route.destination.city}</option>
            ))}
          </select>
          {busRoutesLoading && <p className="text-xs text-slate-500 mt-1">Loading routes...</p>}
          {!scheduleFormData.busId && <p className="text-xs text-amber-600 mt-1">Please select a bus first</p>}
          {scheduleFormData.busId && !busRoutesLoading && busRoutes.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">No routes available. Create routes in the Routes tab first.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Departure Date *</label>
          <input type="date" value={scheduleFormData.departureDate}
            onChange={(e) => setScheduleFormData({ ...scheduleFormData, departureDate: e.target.value })}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Departure Time *</label>
          <input type="time" value={scheduleFormData.departureTime}
            onChange={(e) => setScheduleFormData({ ...scheduleFormData, departureTime: e.target.value })}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Arrival Time *</label>
          <input type="time" value={scheduleFormData.arrivalTime}
            onChange={(e) => setScheduleFormData({ ...scheduleFormData, arrivalTime: e.target.value })}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Base Fare (₹) *</label>
          <input type="number" value={scheduleFormData.baseFare}
            onChange={(e) => setScheduleFormData({ ...scheduleFormData, baseFare: e.target.value })}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
            required min="0" step="0.01" />
        </div>
      </div>
    </>
  );
}
