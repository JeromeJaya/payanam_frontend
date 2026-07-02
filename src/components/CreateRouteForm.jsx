import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { X, Plus, Trash2, MapPin } from "lucide-react";

export default function CreateRouteForm({ buses, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    busId: "",
    source: { city: "", state: "" },
    destination: { city: "", state: "" },
    stops: [],
    distanceInKm: "",
    farePerKm: "",
    estimatedDurationInMinutes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // City suggestions state
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  const sourceRef = useRef(null);
  const destRef = useRef(null);
  const sourceDebounceTimer = useRef(null);
  const destDebounceTimer = useRef(null);

  // Only show ACTIVE buses
  const activeBuses = buses.filter(b => b.status === "ACTIVE");

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [
        ...prev.stops,
        {
          city: "",
          state: "",
          arrivalTime: "",
          departureTime: "",
          distanceFromSource: 0,
          order: prev.stops.length + 1,
        },
      ],
    }));
  };

  const removeStop = (index) => {
    setFormData(prev => {
      const newStops = prev.stops.filter((_, i) => i !== index);
      // Re-order remaining stops
      return {
        ...prev,
        stops: newStops.map((stop, i) => ({ ...stop, order: i + 1 })),
      };
    });
  };

  const updateStop = (index, field, value) => {
    setFormData(prev => {
      const newStops = [...prev.stops];
      newStops[index] = { ...newStops[index], [field]: value };
      return { ...prev, stops: newStops };
    });
  };

  const fetchCitySuggestions = async (query, type) => {
    if (!query || query.length < 2) {
      if (type === 'source') {
        setSourceSuggestions([]);
        setShowSourceSuggestions(false);
      } else {
        setDestSuggestions([]);
        setShowDestSuggestions(false);
      }
      return;
    }

    setLoadingSuggestions(true);
    try {
      const response = await api.get(`/api/v1/places/search?q=${encodeURIComponent(query)}`);
      if (response.data?.success) {
        const suggestions = response.data.data.slice(0, 5);
        if (type === 'source') {
          setSourceSuggestions(suggestions);
          setShowSourceSuggestions(suggestions.length > 0);
        } else {
          setDestSuggestions(suggestions);
          setShowDestSuggestions(suggestions.length > 0);
        }
      }
    } catch (err) {
      console.error(`Error fetching ${type} suggestions:`, err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSourceCityChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, source: { ...prev.source, city: value } }));
    
    if (sourceDebounceTimer.current) {
      clearTimeout(sourceDebounceTimer.current);
    }
    
    sourceDebounceTimer.current = setTimeout(() => {
      fetchCitySuggestions(value, 'source');
    }, 300);
  };

  const handleDestCityChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, destination: { ...prev.destination, city: value } }));
    
    if (destDebounceTimer.current) {
      clearTimeout(destDebounceTimer.current);
    }
    
    destDebounceTimer.current = setTimeout(() => {
      fetchCitySuggestions(value, 'destination');
    }, 300);
  };

  const selectSourceCity = (city) => {
    setFormData(prev => ({ ...prev, source: { city: city.name, state: city.state } }));
    setShowSourceSuggestions(false);
  };

  const selectDestCity = (city) => {
    setFormData(prev => ({ ...prev, destination: { city: city.name, state: city.state } }));
    setShowDestSuggestions(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "sourceCity") {
      handleSourceCityChange(e);
    } else if (name === "sourceState") {
      setFormData(prev => ({ ...prev, source: { ...prev.source, state: value } }));
    } else if (name === "destCity") {
      handleDestCityChange(e);
    } else if (name === "destState") {
      setFormData(prev => ({ ...prev, destination: { ...prev.destination, state: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target)) {
        setShowSourceSuggestions(false);
      }
      if (destRef.current && !destRef.current.contains(event.target)) {
        setShowDestSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce timers
  useEffect(() => {
    return () => {
      if (sourceDebounceTimer.current) {
        clearTimeout(sourceDebounceTimer.current);
      }
      if (destDebounceTimer.current) {
        clearTimeout(destDebounceTimer.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Build the stops array: source + intermediate stops + destination
    const allStops = [
      {
        city: formData.source.city,
        state: formData.source.state,
        arrivalTime: formData.stops[0]?.arrivalTime || "00:00",
        departureTime: formData.stops[0]?.departureTime || "00:00",
        distanceFromSource: 0,
        order: 1,
      },
      ...formData.stops.map((stop, idx) => ({
        city: stop.city,
        state: stop.state || formData.source.state,
        arrivalTime: stop.arrivalTime,
        departureTime: stop.departureTime,
        distanceFromSource: Number(stop.distanceFromSource) || 0,
        order: idx + 2,
      })),
      {
        city: formData.destination.city,
        state: formData.destination.state,
        arrivalTime: formData.stops[formData.stops.length - 1]?.arrivalTime || "00:00",
        departureTime: formData.stops[formData.stops.length - 1]?.departureTime || "00:00",
        distanceFromSource: Number(formData.distanceInKm) || 0,
        order: formData.stops.length + 2,
      },
    ];

    const payload = {
      busId: formData.busId,
      source: formData.source,
      destination: formData.destination,
      stops: allStops,
      distanceInKm: Number(formData.distanceInKm),
      farePerKm: Number(formData.farePerKm) || 0,
      estimatedDurationInMinutes: Number(formData.estimatedDurationInMinutes),
    };

    try {
      const response = await api.post("/api/v1/buses/routes", payload);
      if (response.data.success) {
        alert("Route created successfully!");
        onSuccess?.(response.data.data);
        onClose?.();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0] || "Failed to create route");
      console.error("Error creating route:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Create New Route</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Select Bus */}
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

          {/* Source & Destination */}
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
                  value={formData.source.city}
                  onChange={handleInputChange}
                  required
                  placeholder="City (e.g., Chennai)"
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  autoComplete="off"
                />
                {showSourceSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {loadingSuggestions ? (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">Loading...</div>
                    ) : sourceSuggestions.length > 0 ? (
                      sourceSuggestions.map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectSourceCity(city)}
                          className="w-full text-left px-4 py-2 hover:bg-lime-50 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                          <div className="text-sm font-semibold text-slate-900">{city.name}</div>
                          <div className="text-xs text-slate-500">{city.state}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
                    )}
                  </div>
                )}
                <input
                  type="text"
                  name="sourceState"
                  value={formData.source.state}
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
                  value={formData.destination.city}
                  onChange={handleInputChange}
                  required
                  placeholder="City (e.g., Bangalore)"
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  autoComplete="off"
                />
                {showDestSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {loadingSuggestions ? (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">Loading...</div>
                    ) : destSuggestions.length > 0 ? (
                      destSuggestions.map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectDestCity(city)}
                          className="w-full text-left px-4 py-2 hover:bg-lime-50 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                          <div className="text-sm font-semibold text-slate-900">{city.name}</div>
                          <div className="text-xs text-slate-500">{city.state}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
                    )}
                  </div>
                )}
                <input
                  type="text"
                  name="destState"
                  value={formData.destination.state}
                  onChange={handleInputChange}
                  required
                  placeholder="State (e.g., Karnataka)"
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Intermediate Stops */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 flex-1">
                Intermediate Stops
              </h3>
              <button
                type="button"
                onClick={addStop}
                className="flex items-center gap-1 text-xs font-bold text-lime-700 bg-lime-50 hover:bg-lime-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Stop
              </button>
            </div>

            {formData.stops.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg">
                No intermediate stops. The route will go directly from source to destination.
              </p>
            ) : (
              <div className="space-y-3">
                {formData.stops.map((stop, idx) => (
                  <div key={idx} className="flex flex-wrap items-end gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                      <input
                        type="text"
                        value={stop.city}
                        onChange={(e) => updateStop(idx, "city", e.target.value)}
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
                        onChange={(e) => updateStop(idx, "arrivalTime", e.target.value)}
                        required
                        className="w-full px-2 py-1.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                      />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Departure</label>
                      <input
                        type="time"
                        value={stop.departureTime}
                        onChange={(e) => updateStop(idx, "departureTime", e.target.value)}
                        required
                        className="w-full px-2 py-1.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Dist (km)</label>
                      <input
                        type="number"
                        value={stop.distanceFromSource}
                        onChange={(e) => updateStop(idx, "distanceFromSource", e.target.value)}
                        min="0"
                        placeholder="0"
                        className="w-full px-2 py-1.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStop(idx)}
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

          {/* Route Metrics */}
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

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || activeBuses.length === 0}
              className="flex-1 px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Route..." : "Create Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}