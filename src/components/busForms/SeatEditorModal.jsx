import { X } from "lucide-react";

const SEAT_TYPES = [
  { value: "seater", label: "Seater", icon: "\uD83D\uDCBA" },
  { value: "sleeper", label: "Sleeper", icon: "\uD83D\uDD6F\uFE0F" },
  { value: "semi_sleeper", label: "Semi-Sleeper", icon: "\uD83D\uDDCB\uFE0F" }
];

export default function SeatEditorModal({
  editingSeat,
  formData,
  updateSeatCategory,
  updateSeatFare,
  closeSeatEditor
}) {
  const seat = formData.seatLayout[editingSeat];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop:blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">
            Customize Seat {seat?.seatNumber}
          </h3>
          <button
            type="button"
            onClick={closeSeatEditor}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Seat Type *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SEAT_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateSeatCategory(type.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    seat?.seatCategory === type.value
                      ? "border-lime-500 bg-lime-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-xs font-bold text-slate-900">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Seat Fare (\u20B9) *
            </label>
            <input
              type="number"
              value={seat?.fare || 0}
              onChange={(e) => updateSeatFare(e.target.value)}
              min="0"
              step="10"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Seat Number:</span>
              <span className="font-bold text-slate-900">{seat?.seatNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Position:</span>
              <span className="font-bold text-slate-900 capitalize">{seat?.seatType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Deck:</span>
              <span className="font-bold text-slate-900 capitalize">{seat?.deck}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Row:</span>
              <span className="font-bold text-slate-900">{seat?.row}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={closeSeatEditor}
              className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
