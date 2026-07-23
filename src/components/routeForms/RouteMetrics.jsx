export default function RouteMetrics({ formData, handleInputChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
        Route Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Total Distance (km) *
          </label>
          <input
            type="number"
            name="distanceInKm"
            value={formData.distanceInKm}
            onChange={handleInputChange}
            required
            min="1"
            placeholder="e.g., 350"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Fare per Km (₹)
          </label>
          <input
            type="number"
            name="farePerKm"
            value={formData.farePerKm}
            onChange={handleInputChange}
            min="0"
            step="0.5"
            placeholder="e.g., 2.5"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Duration (minutes) *
          </label>
          <input
            type="number"
            name="estimatedDurationInMinutes"
            value={formData.estimatedDurationInMinutes}
            onChange={handleInputChange}
            required
            min="1"
            placeholder="e.g., 390"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
