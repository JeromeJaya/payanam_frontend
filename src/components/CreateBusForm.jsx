import { useState, useEffect } from "react";
import api from "../api/axios";
import { X } from "lucide-react";
import BusBasicInfo from "./busForms/BusBasicInfo";
import BusConfiguration from "./busForms/BusConfiguration";
import BusAmenities from "./busForms/BusAmenities";
import SeatLayoutConfig from "./busForms/SeatLayoutConfig";
import SeatEditorModal from "./busForms/SeatEditorModal";

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
  const [editingSeat, setEditingSeat] = useState(null);
  const [showSeatEditor, setShowSeatEditor] = useState(false);
  const [layoutStep, setLayoutStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [numDecks, setNumDecks] = useState(0);
  const [currentDeck, setCurrentDeck] = useState(1);
  const [deckConfigs, setDeckConfigs] = useState({});

  const generateSeatLayout = () => {
    const seats = [];
    let seatNumber = 1;

    Object.keys(deckConfigs).sort((a, b) => parseInt(a) - parseInt(b)).forEach(deckNum => {
      const deckConfig = deckConfigs[deckNum];
      const deckName = deckNum === '1' ? 'lower' : 'upper';

      deckConfig.seatsPerColumn.forEach((seatsInThisColumn, colIndex) => {
        const column = colIndex + 1;
        for (let row = 1; row <= seatsInThisColumn; row++) {
          const seatTypeValue = row === 1 ? "window" :
                               row === seatsInThisColumn ? "window" : "middle";

          seats.push({
            seatNumber: `L${seatNumber}`,
            seatType: seatTypeValue,
            deck: deckName,
            row: row,
            column: column,
            isSleeper: false,
            fare: 500 + (row * 50),
            seatCategory: "seater",
            customSize: false
          });
          seatNumber++;
        }
      });
    });

    const totalSeats = seats.length;
    setFormData(prev => ({ ...prev, seatLayout: seats, totalSeats: totalSeats }));
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template.id);
    setNumDecks(template.numDecks);
    setDeckConfigs(JSON.parse(JSON.stringify(template.decks)));
    generateSeatLayout();
    setLayoutStep(5);
  };

  const handleSetDecks = () => {
    if (numDecks > 0) {
      setLayoutStep(3);
      setCurrentDeck(1);
    }
  };

  const handleSetColumnsForDeck = () => {
    const numCols = deckConfigs[currentDeck]?.numColumns || 0;
    if (numCols > 0) {
      setDeckConfigs(prev => ({
        ...prev,
        [currentDeck]: {
          numColumns: numCols,
          seatsPerColumn: new Array(numCols).fill(0)
        }
      }));
      setLayoutStep(4);
    }
  };

  const handleSetSeatsPerColumnForDeck = () => {
    const config = deckConfigs[currentDeck];
    if (config && config.seatsPerColumn.some(s => s > 0)) {
      if (currentDeck < numDecks) {
        setCurrentDeck(prev => prev + 1);
        setLayoutStep(3);
      } else {
        generateSeatLayout();
        setLayoutStep(5);
      }
    }
  };

  const updateNumColumnsForDeck = (value) => {
    setDeckConfigs(prev => ({
      ...prev,
      [currentDeck]: {
        ...prev[currentDeck],
        numColumns: parseInt(value) || 0
      }
    }));
  };

  const updateSeatsForColumn = (colIndex, value) => {
    setDeckConfigs(prev => {
      const currentConfig = prev[currentDeck];
      if (!currentConfig) return prev;
      const newSeatsPerColumn = [...currentConfig.seatsPerColumn];
      newSeatsPerColumn[colIndex] = parseInt(value) || 0;
      return {
        ...prev,
        [currentDeck]: { ...currentConfig, seatsPerColumn: newSeatsPerColumn }
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked :
              name.includes("Seats") || name === "totalSeats" ? parseInt(value) || 0 : value
    }));
  };

  const openSeatEditor = (seatIndex) => {
    setEditingSeat(seatIndex);
    setShowSeatEditor(true);
  };

  const updateSeatCategory = (category) => {
    if (editingSeat === null) return;
    setFormData(prev => ({
      ...prev,
      seatLayout: prev.seatLayout.map((seat, idx) =>
        idx === editingSeat ? { ...seat, seatCategory: category, customSize: true } : seat
      )
    }));
  };

  const updateSeatFare = (fare) => {
    if (editingSeat === null) return;
    setFormData(prev => ({
      ...prev,
      seatLayout: prev.seatLayout.map((seat, idx) =>
        idx === editingSeat ? { ...seat, fare: parseFloat(fare) || 0 } : seat
      )
    }));
  };

  const closeSeatEditor = () => {
    setEditingSeat(null);
    setShowSeatEditor(false);
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

  const handleResetLayout = () => {
    setLayoutStep(1);
    setFormData(prev => ({ ...prev, seatLayout: [] }));
  };

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
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Create New Bus</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <BusBasicInfo formData={formData} handleInputChange={handleInputChange} />
          <BusConfiguration formData={formData} handleInputChange={handleInputChange} />
          <BusAmenities selectedAmenities={selectedAmenities} handleAmenityToggle={handleAmenityToggle} />

          <SeatLayoutConfig
            layoutStep={layoutStep} setLayoutStep={setLayoutStep}
            selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}
            numDecks={numDecks} setNumDecks={setNumDecks}
            currentDeck={currentDeck} setCurrentDeck={setCurrentDeck}
            deckConfigs={deckConfigs}
            formData={formData}
            handleSelectTemplate={handleSelectTemplate}
            handleSetDecks={handleSetDecks}
            handleSetColumnsForDeck={handleSetColumnsForDeck}
            handleSetSeatsPerColumnForDeck={handleSetSeatsPerColumnForDeck}
            updateNumColumnsForDeck={updateNumColumnsForDeck}
            updateSeatsForColumn={updateSeatsForColumn}
            openSeatEditor={openSeatEditor}
            onResetLayout={handleResetLayout}
          />

          {showSeatEditor && editingSeat !== null && (
            <SeatEditorModal
              editingSeat={editingSeat}
              formData={formData}
              updateSeatCategory={updateSeatCategory}
              updateSeatFare={updateSeatFare}
              closeSeatEditor={closeSeatEditor}
            />
          )}

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
