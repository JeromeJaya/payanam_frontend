import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Plus } from "lucide-react";

const AIRCRAFT_MANUFACTURERS = [
  "AIRBUS",
  "BOEING",
  "EMBRAER",
  "BOMBARDIER",
  "ATR",
  "CESSNA",
  "GULFSTREAM",
  "DASSAULT"
];

const AIRCRAFT_TYPES = [
  "AIRBUS_A220",
  "AIRBUS_A319",
  "AIRBUS_A320",
  "AIRBUS_A320NEO",
  "AIRBUS_A321",
  "AIRBUS_A321NEO",
  "AIRBUS_A330",
  "AIRBUS_A330NEO",
  "AIRBUS_A340",
  "AIRBUS_A350",
  "AIRBUS_A380",
  "BOEING_737_700",
  "BOEING_737_800",
  "BOEING_737_MAX8",
  "BOEING_747",
  "BOEING_757",
  "BOEING_767",
  "BOEING_777_200",
  "BOEING_777_300ER",
  "BOEING_777X",
  "BOEING_787_8",
  "BOEING_787_9",
  "BOEING_787_10",
  "ATR_42",
  "ATR_72",
  "EMBRAER_E170",
  "EMBRAER_E175",
  "EMBRAER_E190",
  "EMBRAER_E195",
  "EMBRAER_E190_E2",
  "EMBRAER_E195_E2",
  "CRJ700",
  "CRJ900",
  "CRJ1000",
  "DASH8_Q400"
];

const CABIN_CLASSES = [
  "ECONOMY",
  "PREMIUM_ECONOMY",
  "BUSINESS",
  "FIRST"
];

const AMENITIES_OPTIONS = [
  "WiFi",
  "Meal",
  "Snack",
  "Entertainment",
  "Power Outlet",
  "USB Charging",
  "Bluetooth Audio",
  "Streaming Entertainment",
  "Blanket",
  "Pillow",
  "Alcohol",
  "Vegetarian Meal",
  "Vegan Meal",
  "Kosher Meal",
  "Halal Meal",
  "Extra Legroom",
  "Priority Boarding",
  "Wheelchair Assistance",
  "Pet Friendly",
  "Infant Bassinet",
  "Lounge Access"
];

export default function CreateFlightForm({ onClose, onSuccess, flight, isEdit = false }) {
  const [formData, setFormData] = useState({
    operatorName: "",
    airlineName: "",
    registrationNumber: "",
    manufacturer: "",
    aircraftModel: "",
    aircraftType: "",
    cabinClasses: [],
    totalSeats: 180,
    economySeats: 162,
    premiumEconomySeats: 0,
    businessSeats: 18,
    firstClassSeats: 0,
    amenities: [],
    seatLayout: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedCabinClasses, setSelectedCabinClasses] = useState([]);

  // Reset form when component mounts or when flight prop changes
  useEffect(() => {
    if (isEdit && flight) {
      // Populate form with existing flight data
      setFormData({
        operatorName: flight.operatorName || "",
        airlineName: flight.airlineName || "",
        registrationNumber: flight.registrationNumber || "",
        manufacturer: flight.manufacturer || "",
        aircraftModel: flight.aircraftModel || "",
        aircraftType: flight.aircraftType || "",
        cabinClasses: flight.cabinClasses || [],
        totalSeats: flight.totalSeats || 180,
        economySeats: flight.economySeats || 0,
        premiumEconomySeats: flight.premiumEconomySeats || 0,
        businessSeats: flight.businessSeats || 0,
        firstClassSeats: flight.firstClassSeats || 0,
        amenities: flight.amenities || [],
        seatLayout: flight.seatLayout || []
      });
      setSelectedAmenities(flight.amenities || []);
      setSelectedCabinClasses(flight.cabinClasses || []);
    } else {
      // Reset form for create mode
      setFormData({
        operatorName: "",
        airlineName: "",
        registrationNumber: "",
        manufacturer: "",
        aircraftModel: "",
        aircraftType: "",
        cabinClasses: [],
        totalSeats: 180,
        economySeats: 162,
        premiumEconomySeats: 0,
        businessSeats: 18,
        firstClassSeats: 0,
        amenities: [],
        seatLayout: []
      });
      setSelectedAmenities([]);
      setSelectedCabinClasses([]);
    }
  }, [isEdit, flight]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleCabinClassToggle = (cabinClass) => {
    setSelectedCabinClasses(prev => 
      prev.includes(cabinClass) 
        ? prev.filter(c => c !== cabinClass)
        : [...prev, cabinClass]
    );
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, amenities: selectedAmenities }));
  }, [selectedAmenities]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, cabinClasses: selectedCabinClasses }));
  }, [selectedCabinClasses]);

  const generateSeatLayout = () => {
    const seats = [];
    let seatNumber = 1;
    
    // Generate a basic seat layout based on cabin classes
    const cabinConfig = {
      "ECONOMY": { rows: 30, seatsPerRow: 6, fare: 4500 },
      "PREMIUM_ECONOMY": { rows: 5, seatsPerRow: 6, fare: 7500 },
      "BUSINESS": { rows: 4, seatsPerRow: 4, fare: 15000 },
      "FIRST": { rows: 2, seatsPerRow: 4, fare: 25000 }
    };

    const seatTypes = ["window", "middle", "middle", "middle", "middle", "window"];

    selectedCabinClasses.forEach(cabinClass => {
      const config = cabinConfig[cabinClass];
      if (!config) return;

      const numSeats = config.rows * config.seatsPerRow;
      for (let i = 0; i < numSeats; i++) {
        const row = Math.floor(i / config.seatsPerRow) + 1;
        const colIndex = i % config.seatsPerRow;
        
        seats.push({
          seatNumber: `${row}${String.fromCharCode(65 + colIndex)}`,
          cabinClass: cabinClass,
          seatType: seatTypes[colIndex],
          row: row,
          column: String(colIndex + 1), // String column ("1", "2", "3", "4", "5", "6")
          isExtraLegroom: row === 1 || row === config.rows,
          fare: config.fare + (row > 10 ? 1000 : 0)
        });
      }
    });

    setFormData(prev => ({ ...prev, seatLayout: seats }));
  };

  useEffect(() => {
    if (selectedCabinClasses.length > 0) {
      generateSeatLayout();
    }
  }, [selectedCabinClasses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.operatorName || !formData.airlineName || !formData.registrationNumber ||
          !formData.manufacturer || !formData.aircraftModel || !formData.aircraftType ||
          selectedCabinClasses.length === 0) {
        throw new Error("Please fill in all required fields");
      }

      // Validate seat counts
      const totalAllocated = formData.economySeats + formData.premiumEconomySeats + 
                            formData.businessSeats + formData.firstClassSeats;
      if (totalAllocated !== formData.totalSeats) {
        throw new Error(`Total seats (${formData.totalSeats}) must equal sum of cabin seats (${totalAllocated})`);
      }

      // Create a clean submission object with only valid data
      const submitData = {
        operatorName: formData.operatorName,
        airlineName: formData.airlineName,
        registrationNumber: formData.registrationNumber,
        manufacturer: formData.manufacturer,
        aircraftModel: formData.aircraftModel,
        aircraftType: formData.aircraftType,
        cabinClasses: selectedCabinClasses,
        totalSeats: formData.totalSeats,
        economySeats: formData.economySeats,
        premiumEconomySeats: formData.premiumEconomySeats,
        businessSeats: formData.businessSeats,
        firstClassSeats: formData.firstClassSeats,
        amenities: selectedAmenities,
        seatLayout: formData.seatLayout
      };

      let response;
      if (isEdit) {
        // Update existing flight
        response = await api.patch(`/api/v1/flights/${flight._id}`, submitData);
        if (response.data.success) {
          alert("Flight updated successfully!");
          onSuccess?.(response.data.data);
          onClose?.();
        }
      } else {
        // Create new flight
        response = await api.post("/api/v1/flights", submitData);
        if (response.data.success) {
          alert("Flight created successfully!");
          onSuccess?.(response.data.data);
          onClose?.();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || (isEdit ? "Failed to update flight" : "Failed to create flight"));
      console.error(`Error ${isEdit ? "updating" : "creating"} flight:`, err);
      if (err.response?.data?.errors) {
        console.error("Validation errors:", err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Edit Flight" : "Register New Flight"}
          </h2>
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

          {/* Basic Information */}
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

          {/* Cabin Configuration */}
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
                      onChange={() => handleCabinClassToggle(cabin)}
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
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />
            </div>

            {/* Seat Distribution by Cabin */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Economy Seats
                </label>
                <input
                  type="number"
                  name="economySeats"
                  value={formData.economySeats}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              Amenities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {AMENITIES_OPTIONS.map(amenity => (
                <label
                  key={amenity}
                  className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedAmenities.includes(amenity)
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                  />
                  <span className="text-sm font-medium text-slate-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Seat Layout Preview */}
          {formData.seatLayout.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                Seat Layout Preview
              </h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">
                  Total seats generated: <span className="font-bold text-slate-900">{formData.seatLayout.length}</span>
                </p>
                <p className="text-xs text-slate-500">
                  Seat layout will be automatically generated based on cabin class configuration. 
                  You can customize individual seat fares after creation.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
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
              disabled={loading}
              className="flex-1 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEdit ? "Updating Flight..." : "Creating Flight...") : (isEdit ? "Update Flight" : "Register Flight")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}