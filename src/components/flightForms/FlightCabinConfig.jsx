import { CABIN_CLASSES } from "./FlightFormConstants";

export default function FlightCabinConfig({ formData, selectedCabinClasses, onCabinClassToggle, onInputChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
        Cabin Configuration
      </h3>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Cabin Classes *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CABIN_CLASSES.map(cabin => (
            <label
              key={cabin}
              className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                selectedCabinClasses.includes(cabin)
                  ? "border-sky-500 bg-sky-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedCabinClasses.includes(cabin)}
                onChange={() => onCabinClassToggle(cabin)}
                className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
              />
              <span className="text-sm font-medium text-slate-700">{cabin.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Total Seats *
        </label>
        <input
          type="number"
          name="totalSeats"
          value={formData.totalSeats}
          onChange={onInputChange}
          required
          min="1"
          className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Economy Seats
          </label>
          <input
            type="number"
            name="economySeats"
            value={formData.economySeats}
            onChange={onInputChange}
            min="0"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Premium Economy Seats
          </label>
          <input
            type="number"
            name="premiumEconomySeats"
            value={formData.premiumEconomySeats}
            onChange={onInputChange}
            min="0"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Business Seats
          </label>
          <input
            type="number"
            name="businessSeats"
            value={formData.businessSeats}
            onChange={onInputChange}
            min="0"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            First Class Seats
          </label>
          <input
            type="number"
            name="firstClassSeats"
            value={formData.firstClassSeats}
            onChange={onInputChange}
            min="0"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
