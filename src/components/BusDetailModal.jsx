import { useState, useEffect } from "react";
import api from "../api/axios";
import BusDetailHeader from "./busDetails/BusDetailHeader";
import BusInfoSection from "./busDetails/BusInfoSection";
import BusAmenitiesSection from "./busDetails/BusAmenitiesSection";
import BusReviewSection from "./busDetails/BusReviewSection";

export default function BusDetailModal({ busId, onClose }) {
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSeatLayout, setShowSeatLayout] = useState(false);

  useEffect(() => {
    const fetchBus = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/api/v1/buses/${busId}`);
        if (response.data.success) {
          setBus(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bus details");
        console.error("Error fetching bus:", err);
      } finally {
        setLoading(false);
      }
    };

    if (busId) {
      fetchBus();
    }
  }, [busId]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <BusDetailHeader onClose={onClose} />

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-slate-600">Loading bus details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          ) : bus ? (
            <div className="space-y-6">
              <BusInfoSection bus={bus} />
              <BusAmenitiesSection bus={bus} />
              <BusReviewSection
                bus={bus}
                showSeatLayout={showSeatLayout}
                setShowSeatLayout={setShowSeatLayout}
                onClose={onClose}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
