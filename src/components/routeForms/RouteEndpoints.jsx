import { MapPin } from "lucide-react";
import CitySuggestions from "./CitySuggestions";

export default function RouteEndpoints({
  source,
  destination,
  showSourceSuggestions,
  showDestSuggestions,
  sourceSuggestions,
  destSuggestions,
  loadingSuggestions,
  sourceRef,
  destRef,
  handleInputChange,
  selectSourceCity,
  selectDestCity,
  setShowSourceSuggestions,
  setShowDestSuggestions,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
        Route Endpoints
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3 p-4 bg-slate-50 rounded-xl relative" ref={sourceRef}>
          <div className="flex items-center gap-2 text-sm font-bold text-lime-700">
            <MapPin className="w-4 h-4" />
            Source
          </div>
          <input
            type="text"
            name="sourceCity"
            value={source.city}
            onChange={handleInputChange}
            required
            placeholder="City (e.g., Chennai)"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
            autoComplete="off"
          />
          {showSourceSuggestions && (
            <CitySuggestions
              suggestions={sourceSuggestions}
              loading={loadingSuggestions}
              onSelect={selectSourceCity}
              onClose={() => setShowSourceSuggestions(false)}
            />
          )}
          <input
            type="text"
            name="sourceState"
            value={source.state}
            onChange={handleInputChange}
            required
            placeholder="State (e.g., Tamil Nadu)"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          />
        </div>
        <div className="space-y-3 p-4 bg-slate-50 rounded-xl relative" ref={destRef}>
          <div className="flex items-center gap-2 text-sm font-bold text-red-700">
            <MapPin className="w-4 h-4" />
            Destination
          </div>
          <input
            type="text"
            name="destCity"
            value={destination.city}
            onChange={handleInputChange}
            required
            placeholder="City (e.g., Bangalore)"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
            autoComplete="off"
          />
          {showDestSuggestions && (
            <CitySuggestions
              suggestions={destSuggestions}
              loading={loadingSuggestions}
              onSelect={selectDestCity}
              onClose={() => setShowDestSuggestions(false)}
            />
          )}
          <input
            type="text"
            name="destState"
            value={destination.state}
            onChange={handleInputChange}
            required
            placeholder="State (e.g., Karnataka)"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
