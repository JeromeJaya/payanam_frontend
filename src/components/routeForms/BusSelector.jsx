export default function BusSelector({ formData, handleInputChange, activeBuses }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
        Select Bus
      </h3>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Bus *
        </label>
        <select
          name="busId"
          value={formData.busId}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
        >
          <option value="">-- Select a bus --</option>
          {activeBuses.map(bus => (
            <option key={bus._id} value={bus._id}>
              {bus.busName} ({bus.busNumber}) — {bus.busType?.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        {activeBuses.length === 0 && (
          <p className="text-xs text-amber-600 mt-1">No active buses available. Activate a bus first.</p>
        )}
      </div>
    </div>
  );
}
