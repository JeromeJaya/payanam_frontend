import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import RouteHeader from "./routeForms/RouteHeader";
import BusSelector from "./routeForms/BusSelector";
import RouteEndpoints from "./routeForms/RouteEndpoints";
import IntermediateStops from "./routeForms/IntermediateStops";
import RouteMetrics from "./routeForms/RouteMetrics";
import FormActions from "./routeForms/FormActions";

export default function CreateRouteForm({ buses, onClose, onSuccess, initialBusId }) {
  const [formData, setFormData] = useState({
    busId: initialBusId || "",
    source: { city: "", state: "" },
    destination: { city: "", state: "" },
    stops: [],
    distanceInKm: "",
    farePerKm: "",
    estimatedDurationInMinutes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const sourceRef = useRef(null);
  const destRef = useRef(null);
  const sourceDebounceTimer = useRef(null);
  const destDebounceTimer = useRef(null);

  const activeBuses = buses.filter(b => b.status === "ACTIVE");

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [
        ...prev.stops,
        { city: "", state: "", arrivalTime: "", departureTime: "", distanceFromSource: 0, order: prev.stops.length + 1 },
      ],
    }));
  };

  const removeStop = (index) => {
    setFormData(prev => {
      const newStops = prev.stops.filter((_, i) => i !== index);
      return { ...prev, stops: newStops.map((stop, i) => ({ ...stop, order: i + 1 })) };
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
      if (type === 'source') { setSourceSuggestions([]); setShowSourceSuggestions(false); }
      else { setDestSuggestions([]); setShowDestSuggestions(false); }
      return;
    }
    setLoadingSuggestions(true);
    try {
      const response = await api.get(`/api/v1/places/search?q=${encodeURIComponent(query)}`);
      if (response.data?.success) {
        const suggestions = response.data.data.slice(0, 5);
        if (type === 'source') { setSourceSuggestions(suggestions); setShowSourceSuggestions(suggestions.length > 0); }
        else { setDestSuggestions(suggestions); setShowDestSuggestions(suggestions.length > 0); }
      }
    } catch (err) {
      console.error(`Error fetching ${type} suggestions:`, err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "sourceCity") {
      setFormData(prev => ({ ...prev, source: { ...prev.source, city: value } }));
      clearTimeout(sourceDebounceTimer.current);
      sourceDebounceTimer.current = setTimeout(() => fetchCitySuggestions(value, 'source'), 300);
    } else if (name === "sourceState") {
      setFormData(prev => ({ ...prev, source: { ...prev.source, state: value } }));
    } else if (name === "destCity") {
      setFormData(prev => ({ ...prev, destination: { ...prev.destination, city: value } }));
      clearTimeout(destDebounceTimer.current);
      destDebounceTimer.current = setTimeout(() => fetchCitySuggestions(value, 'destination'), 300);
    } else if (name === "destState") {
      setFormData(prev => ({ ...prev, destination: { ...prev.destination, state: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const selectSourceCity = (city) => {
    setFormData(prev => ({ ...prev, source: { city: city.name, state: city.state } }));
    setShowSourceSuggestions(false);
  };

  const selectDestCity = (city) => {
    setFormData(prev => ({ ...prev, destination: { city: city.name, state: city.state } }));
    setShowDestSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target)) setShowSourceSuggestions(false);
      if (destRef.current && !destRef.current.contains(event.target)) setShowDestSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(sourceDebounceTimer.current);
      clearTimeout(destDebounceTimer.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const allStops = [
      { city: formData.source.city, state: formData.source.state, arrivalTime: formData.stops[0]?.arrivalTime || "00:00", departureTime: formData.stops[0]?.departureTime || "00:00", distanceFromSource: 0, order: 1 },
      ...formData.stops.map((stop, idx) => ({
        city: stop.city, state: stop.state || formData.source.state, arrivalTime: stop.arrivalTime, departureTime: stop.departureTime, distanceFromSource: Number(stop.distanceFromSource) || 0, order: idx + 2,
      })),
      { city: formData.destination.city, state: formData.destination.state, arrivalTime: formData.stops[formData.stops.length - 1]?.arrivalTime || "00:00", departureTime: formData.stops[formData.stops.length - 1]?.departureTime || "00:00", distanceFromSource: Number(formData.distanceInKm) || 0, order: formData.stops.length + 2 },
    ];

    const payload = {
      busId: formData.busId, source: formData.source, destination: formData.destination,
      stops: allStops, distanceInKm: Number(formData.distanceInKm),
      farePerKm: Number(formData.farePerKm) || 0, estimatedDurationInMinutes: Number(formData.estimatedDurationInMinutes),
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
        <RouteHeader onClose={onClose} />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <BusSelector
            formData={formData}
            handleInputChange={handleInputChange}
            activeBuses={activeBuses}
          />

          <RouteEndpoints
            source={formData.source}
            destination={formData.destination}
            showSourceSuggestions={showSourceSuggestions}
            showDestSuggestions={showDestSuggestions}
            sourceSuggestions={sourceSuggestions}
            destSuggestions={destSuggestions}
            loadingSuggestions={loadingSuggestions}
            sourceRef={sourceRef}
            destRef={destRef}
            handleInputChange={handleInputChange}
            selectSourceCity={selectSourceCity}
            selectDestCity={selectDestCity}
            setShowSourceSuggestions={setShowSourceSuggestions}
            setShowDestSuggestions={setShowDestSuggestions}
          />

          <IntermediateStops
            stops={formData.stops}
            onAddStop={addStop}
            onRemoveStop={removeStop}
            onUpdateStop={updateStop}
          />

          <RouteMetrics formData={formData} handleInputChange={handleInputChange} />

          <FormActions loading={loading} onClose={onClose} disabled={activeBuses.length === 0} />
        </form>
      </div>
    </div>
  );
}