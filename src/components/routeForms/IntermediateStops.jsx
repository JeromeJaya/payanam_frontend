import { Plus, Trash2 } from "lucide-react";

export default function IntermediateStops({ stops, onAddStop, onRemoveStop, onUpdateStop }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 flex-1">
          Intermediate Stops
        </h3>
        <button
          type="button"
          onClick={onAddStop}
          className="flex items-center gap-1 text-xs font-bold text-lime-700 bg-lime-50 hover:bg-lime-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Stop
        </button>
      </div>

      {stops.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg">
          No intermediate stops. The route will go directly from source to destination.
        </p>
      ) : (
        <div className="space-y-3">
          {stops.map((stop, idx) => (
            <div key={idx} className="flex flex-wrap items-end gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                <input
                  type="text"
                  value={stop.city}
                  onChange={(e) => onUpdateStop(idx, "city", e.target.value)}
                  required
                  placeholder="City name"
                  className="w-full px-2 py-1.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
              <div className="w-20">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Arrival</label>
                <input
                  type="time"
                  value={stop.arrivalTime}
                  onChange={(e) => onUpdateStop(idx, "arrivalTime", e.target.value)}
                  required
                  className="w-full px-2 py-1.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
              <div className="w-20">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Departure</label>
                <input
                  type="time"
                  value={stop.departureTime}
                  onChange={(e) => onUpdateStop(idx, "departureTime", e.target.value)}
                  required
                  className="w-full px-2 py-1.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Dist (km)</label>
                <input
                  type="number"
                  value={stop.distanceFromSource}
                  onChange={(e) => onUpdateStop(idx, "distanceFromSource", e.target.value)}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-1.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveStop(idx)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove stop"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
