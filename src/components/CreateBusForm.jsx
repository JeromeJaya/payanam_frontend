import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Plus, Trash2 } from "lucide-react";

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

const AMENITIES_OPTIONS = [
  "WiFi",
  "Charging Point",
  "Blanket",
  "Water Bottle",
  "Reading Light",
  "GPS Tracking",
  "Emergency Exit",
  "CCTV"
];

export default function CreateBusForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    operatorName: "",
    busName: "",
    busNumber: "",
    registrationNumber: "",
    busType: "AC_SLEEPER",
    seatLayoutType: "2+1_SLEEPER",
    totalSeats: 36,
    lowerDeckSeats: 18,
    upperDeckSeats: 18,
    sleeperSeats: 36,
    seaterSeats: 0,
    isAC: true,
    isSleeper: true,
    isSeater: false,
    amenities: [],
    isGPSAvailable: true,
    isLiveTrackingEnabled: true,
    seatLayout: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Generate seat layout based on configuration
  useEffect(() => {
    if (formData.totalSeats > 0 && formData.seatLayout.length === 0) {
      generateSeatLayout();
    }
  }, [formData.totalSeats, formData.seatLayoutType]);

  const generateSeatLayout = () => {
    const seats = [];
    const [seatsPerRow, seatType] = formData.seatLayoutType.split("+");
    const totalRows = Math.ceil(formData.totalSeats / parseInt(seatsPerRow));
    
    let seatNumber = 1;
    for (let row = 1; row <= totalRows && seatNumber <= formData.totalSeats; row++) {
      for (let col = 1; col <= parseInt(seatsPerRow) && seatNumber <= formData.totalSeats; col++) {
        const seatTypeValue = col === 1 || col === parseInt(seatsPerRow) ? "window" : 
                             col === Math.ceil(seatsPerRow / 2) ? "aisle" : "middle";
        
        seats.push({
          seatNumber: `L${seatNumber}`,
          seatType: seatTypeValue,
          deck: row <= Math.ceil(totalRows / 2) ? "lower" : "upper",
          row: row,
          column: col,
          isSleeper: formData.isSleeper,
          fare: 500 + (row * 50)
        });
        seatNumber++;
      }
    }
    
    setFormData(prev => ({ ...prev, seatLayout: seats }));
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : 
              name.includes("Seats") || name === "totalSeats" ? parseInt(value) || 0 : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, amenities: selectedAmenities }));
  }, [selectedAmenities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/v1/buses", formData);
      
      if (response.data.success) {
        alert("Bus created successfully!");
        onSuccess?.(response.data.data);
        onClose?.();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bus");
      console.error("Error creating bus:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Create New Bus</h2>
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
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  placeholder="e.g., KPN Travels"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Bus Name *
                </label>
                <input
                  type="text"
                  name="busName"
                  value={formData.busName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  placeholder="e.g., KPN Volvo Multi-Axle"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Bus Number *
                </label>
                <input
                  type="text"
                  name="busNumber"
                  value={formData.busNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  placeholder="e.g., TN01KPN001"
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
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  placeholder="e.g., TN01AB1234"
                />
              </div>
            </div>
          </div>

          {/* Bus Configuration */}
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

            {/* Seat Distribution */}
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

            {/* Bus Type Checkboxes */}
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

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              Amenities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AMENITIES_OPTIONS.map(amenity => (
                <label
                  key={amenity}
                  className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedAmenities.includes(amenity)
                      ? "border-lime-500 bg-lime-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-lime-600 border-slate-300 rounded focus:ring-lime-500"
                  />
                  <span className="text-sm font-medium text-slate-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Seat Layout Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              Seat Layout Preview ({formData.seatLayout.length} seats)
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg max-h-64 overflow-y-auto">
              <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
                {formData.seatLayout.map((seat, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-white border-2 border-slate-300 rounded flex items-center justify-center text-xs font-bold text-slate-700"
                    title={`${seat.seatNumber} - ${seat.seatType} - ${seat.deck}`}
                  >
                    {seat.seatNumber}
                  </div>
                ))}
              </div>
            </div>
          </div>

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
              className="flex-1 px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Bus..." : "Create Bus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}