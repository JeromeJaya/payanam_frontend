import { useState, useEffect } from "react";
import api from "../api/axios";
import { X } from "lucide-react";

const BUS_TYPES = [
  "AC_SLEEPER",
  "NON_AC_SLEEPER",
  "AC_SEATER",
  "NON_AC_SEATER",
  "VOLVO_AC",
  "SEMI_SLEEPER",
  "LUXURY_SLEEPER"
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

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "MAINTENANCE"];

export default function EditBusForm({ bus, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    busName: "",
    busNumber: "",
    registrationNumber: "",
    busType: "AC_SLEEPER",
    status: "ACTIVE",
    amenities: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bus) {
      setFormData({
        busName: bus.busName || "",
        busNumber: bus.busNumber || "",
        registrationNumber: bus.registrationNumber || "",
        busType: bus.busType || "AC_SLEEPER",
        status: bus.status || "ACTIVE",
        amenities: bus.amenities || []
      });
    }
  }, [bus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.patch(`/api/v1/buses/${bus._id}`, formData);

      if (response.data.success) {
        alert("Bus updated successfully!");
        onSuccess?.(response.data.data);
        onClose?.();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bus");
      console.error("Error updating bus:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Edit Bus</h2>
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
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
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
                    formData.amenities.includes(amenity)
                      ? "border-lime-500 bg-lime-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-lime-600 border-slate-300 rounded focus:ring-lime-500"
                  />
                  <span className="text-sm font-medium text-slate-700">{amenity}</span>
                </label>
              ))}
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
              {loading ? "Updating Bus..." : "Update Bus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}