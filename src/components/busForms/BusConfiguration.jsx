const BUS_TYPES = [
  "AC_SLEEPER",
  "NON_AC_SLEEPER",
  "AC_SEATER",
  "NON_AC_SEATER",
  "VOLVO_AC",
  "SEMI_SLEEPER",
  "LUXURY_SLEEPER"
];

const SEAT_LAYOUT_TYPES = [
  "2+1_SLEEPER",
  "2+2_SLEEPER",
  "2+1_SEATER",
  "2+2_SEATER",
  "1+1_SLEEPER"
];

export default function BusConfiguration({ formData, handleInputChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
        Bus Configuration
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Bus Type *
          </label>
          <select
            name="busType"
            value={formData.busType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          >
            {BUS_TYPES.map(type => (
              <option key={type} value={type}>{type.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Seat Layout Type *
          </label>
          <select
            name="seatLayoutType"
            value={formData.seatLayoutType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          >
            {SEAT_LAYOUT_TYPES.map(type => (
              <option key={type} value={type}>{type.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Total Seats *
          </label>
          <input
            type="number"
            name="totalSeats"
            value={formData.totalSeats}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Lower Deck Seats
          </label>
          <input
            type="number"
            name="lowerDeckSeats"
            value={formData.lowerDeckSeats}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Upper Deck Seats
          </label>
          <input
            type="number"
            name="upperDeckSeats"
            value={formData.upperDeckSeats}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Sleeper Seats
          </label>
          <input
            type="number"
            name="sleeperSeats"
            value={formData.sleeperSeats}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Seater Seats
          </label>
          <input
            type="number"
            name="seaterSeats"
            value={formData.seaterSeats}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isAC"
            checked={formData.isAC}
            onChange={handleInputChange}
            className="w-4 h-4 text-lime-600 border-slate-300 rounded focus:ring-lime-500"
          />
          <span className="text-sm font-medium text-slate-700">AC</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isSleeper"
            checked={formData.isSleeper}
            onChange={handleInputChange}
            className="w-4 h-4 text-lime-600 border-slate-300 rounded focus:ring-lime-500"
          />
          <span className="text-sm font-medium text-slate-700">Sleeper</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isSeater"
            checked={formData.isSeater}
            onChange={handleInputChange}
            className="w-4 h-4 text-lime-600 border-slate-300 rounded focus:ring-lime-500"
          />
          <span className="text-sm font-medium text-slate-700">Seater</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isGPSAvailable"
            checked={formData.isGPSAvailable}
            onChange={handleInputChange}
            className="w-4 h-4 text-lime-600 border-slate-300 rounded focus:ring-lime-500"
          />
          <span className="text-sm font-medium text-slate-700">GPS Available</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isLiveTrackingEnabled"
            checked={formData.isLiveTrackingEnabled}
            onChange={handleInputChange}
            className="w-4 h-4 text-lime-600 border-slate-300 rounded focus:ring-lime-500"
          />
          <span className="text-sm font-medium text-slate-700">Live Tracking</span>
        </label>
      </div>
    </div>
  );
}
