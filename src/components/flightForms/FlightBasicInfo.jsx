import { AIRCRAFT_MANUFACTURERS, AIRCRAFT_TYPES } from "./FlightFormConstants";

export default function FlightBasicInfo({ formData, handleInputChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
        Basic Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Operator Name *
          </label>
          <input
            type="text"
            name="operatorName"
            value={formData.operatorName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            placeholder="e.g., IndiGo Airlines"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Airline Name *
          </label>
          <input
            type="text"
            name="airlineName"
            value={formData.airlineName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            placeholder="e.g., IndiGo"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Registration Number *
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            placeholder="e.g., VT-IGP"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Manufacturer *
          </label>
          <select
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
          >
            <option value="">Select manufacturer...</option>
            {AIRCRAFT_MANUFACTURERS.map(mfr => (
              <option key={mfr} value={mfr}>{mfr}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Aircraft Model *
          </label>
          <input
            type="text"
            name="aircraftModel"
            value={formData.aircraftModel}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            placeholder="e.g., A320neo"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Aircraft Type *
          </label>
          <select
            name="aircraftType"
            value={formData.aircraftType}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
          >
            <option value="">Select aircraft type...</option>
            {AIRCRAFT_TYPES.map(type => (
              <option key={type} value={type}>{type.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
