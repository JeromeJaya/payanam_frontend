import { useState, useEffect } from "react";
import api from "../api/axios";
import { X } from "lucide-react";
import FlightBasicInfo from "./flightForms/FlightBasicInfo";
import FlightCabinConfig from "./flightForms/FlightCabinConfig";
import FlightAmenities from "./flightForms/FlightAmenities";
import FlightSeatPreview from "./flightForms/FlightSeatPreview";

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

  useEffect(() => {
    if (isEdit && flight) {
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
          column: String(colIndex + 1),
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
      if (!formData.operatorName || !formData.airlineName || !formData.registrationNumber ||
          !formData.manufacturer || !formData.aircraftModel || !formData.aircraftType ||
          selectedCabinClasses.length === 0) {
        throw new Error("Please fill in all required fields");
      }

      const totalAllocated = formData.economySeats + formData.premiumEconomySeats + 
                            formData.businessSeats + formData.firstClassSeats;
      if (totalAllocated !== formData.totalSeats) {
        throw new Error(`Total seats (${formData.totalSeats}) must equal sum of cabin seats (${totalAllocated})`);
      }

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
        response = await api.patch(`/api/v1/flights/${flight._id}`, submitData);
        if (response.data.success) {
          alert("Flight updated successfully!");
          onSuccess?.(response.data.data);
          onClose?.();
        }
      } else {
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

          <FlightBasicInfo formData={formData} handleInputChange={handleInputChange} />

          <FlightCabinConfig
            formData={formData}
            selectedCabinClasses={selectedCabinClasses}
            onCabinClassToggle={handleCabinClassToggle}
            onInputChange={handleInputChange}
          />

          <FlightAmenities selectedAmenities={selectedAmenities} onAmenityToggle={handleAmenityToggle} />

          <FlightSeatPreview seatLayoutLength={formData.seatLayout.length} />

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
