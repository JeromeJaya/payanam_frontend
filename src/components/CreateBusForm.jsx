import { useState, useEffect, useRef } from "react";
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

const SEAT_TYPES = [
  { value: "seater", label: "Seater", icon: "💺" },
  { value: "sleeper", label: "Sleeper", icon: "🛏️" },
  { value: "semi_sleeper", label: "Semi-Sleeper", icon: "🛋️" }
];

const LAYOUT_TEMPLATES = [
  {
    id: "single-deck-2x2",
    name: "Single Deck 2+2 Seater",
    description: "Standard 2+2 layout with 4 seats per row",
    icon: "🚌",
    numDecks: 1,
    decks: {
      "1": { numColumns: 4, seatsPerColumn: [10, 10, 10, 10] }
    }
  },
  {
    id: "single-deck-2x1",
    name: "Single Deck 2+1 Sleeper",
    description: "2+1 sleeper layout with 3 seats per row",
    icon: "🛏️",
    numDecks: 1,
    decks: {
      "1": { numColumns: 3, seatsPerColumn: [10, 10, 10] }
    }
  },
  {
    id: "double-deck-2x2",
    name: "Double Deck 2+2",
    description: "Double deck with 4 columns each",
    icon: "🚌",
    numDecks: 2,
    decks: {
      "1": { numColumns: 4, seatsPerColumn: [10, 10, 10, 10] },
      "2": { numColumns: 4, seatsPerColumn: [10, 10, 10, 10] }
    }
  },
  {
    id: "double-deck-2x1",
    name: "Double Deck 2+1 Sleeper",
    description: "Double deck sleeper with 3 columns each",
    icon: "🛏️",
    numDecks: 2,
    decks: {
      "1": { numColumns: 3, seatsPerColumn: [10, 10, 10] },
      "2": { numColumns: 3, seatsPerColumn: [10, 10, 10] }
    }
  },
  {
    id: "single-deck-3x2",
    name: "Single Deck 3+2 Seater",
    description: "Wide layout with 5 seats per row",
    icon: "🚌",
    numDecks: 1,
    decks: {
      "1": { numColumns: 5, seatsPerColumn: [10, 10, 10, 10, 10] }
    }
  }
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
  const [editingSeat, setEditingSeat] = useState(null);
  const [showSeatEditor, setShowSeatEditor] = useState(false);
  const [layoutStep, setLayoutStep] = useState(1); // 1: templates, 2: decks, 3: columns per deck, 4: seats per column, 5: customize
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [numDecks, setNumDecks] = useState(0);
  const [currentDeck, setCurrentDeck] = useState(1);
  const [deckConfigs, setDeckConfigs] = useState({}); // Store config for each deck
  const inputRef = useRef(null)
  const generateSeatLayout = () => {
    const seats = [];
    let seatNumber = 1;
    
    // Generate seats for each deck
    Object.keys(deckConfigs).sort((a, b) => parseInt(a) - parseInt(b)).forEach(deckNum => {
      const deckConfig = deckConfigs[deckNum];
      const deckName = deckNum === '1' ? 'lower' : 'upper';
      
      // Generate seats column by column for this deck
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
            seatCategory: "seater", // All seats start as seater
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
    setLayoutStep(5); // Skip to customization step
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
      setLayoutStep(4); // Move to seats per column step
    }
  };

  const handleSetSeatsPerColumnForDeck = () => {
    const config = deckConfigs[currentDeck];
    if (config && config.seatsPerColumn.some(s => s > 0)) {
      // Check if there are more decks to configure
      if (currentDeck < numDecks) {
        setCurrentDeck(prev => prev + 1);
        setLayoutStep(3); // Go to columns step for next deck
      } else {
        // All decks configured, generate layout
        generateSeatLayout();
        setLayoutStep(5); // Go to customization step
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
        [currentDeck]: {
          ...currentConfig,
          seatsPerColumn: newSeatsPerColumn
        }
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

          {/* Seat Layout Preview & Customization */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                Seat Layout Configuration
              </h3>
              {layoutStep > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setLayoutStep(1);
                    setNumColumns(0);
                    setSeatsPerColumn([]);
                    setFormData(prev => ({ ...prev, seatLayout: [] }));
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reset Layout
                </button>
              )}
            </div>

            {/* Step 1: Select Template or Custom */}
            {layoutStep === 1 && (
              <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                <div className="text-center space-y-2">
                  <h4 className="text-lg font-bold text-slate-900">Step 1: Choose Layout</h4>
                  <p className="text-sm text-slate-600">Select a template or create custom layout</p>
                </div>
                
                {/* Template Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LAYOUT_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleSelectTemplate(template)}
                      className={`p-4 border-2 rounded-lg text-left transition-all hover:border-lime-500 hover:shadow-md ${
                        selectedTemplate === template.id
                          ? "border-lime-500 bg-lime-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="text-3xl mb-2">{template.icon}</div>
                      <div className="text-sm font-bold text-slate-900 mb-1">{template.name}</div>
                      <div className="text-xs text-slate-600">{template.description}</div>
                      <div className="text-xs text-slate-500 mt-2">
                        {template.numDecks === 1 ? 'Single Deck' : 'Double Deck'} • {Object.values(template.decks).reduce((sum, d) => sum + d.seatsPerColumn.reduce((a, b) => a + b, 0), 0)} seats
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Layout Option */}
                <div className="border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(null);
                      setLayoutStep(2);
                    }}
                    className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-center hover:border-lime-500 hover:bg-slate-50 transition-all"
                  >
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="text-sm font-bold text-slate-900">Create Custom Layout</div>
                    <div className="text-xs text-slate-600">Manually configure decks and columns</div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Number of Decks (Custom Layout) */}
            {layoutStep === 2 && (
              <div className="bg-slate-50 p-6 rounded-lg text-center space-y-4">
                <h4 className="text-lg font-bold text-slate-900">Step 2: Configure Decks</h4>
                <p className="text-sm text-slate-600">Enter the number of decks in your bus</p>
                <div className="max-w-xs mx-auto">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Decks *</label>
                  <input
                    type="number"
                    value={numDecks}
                    onChange={(e) => setNumDecks(parseInt(e.target.value) || 0)}
                    min="1"
                    max="2"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                    placeholder="e.g., 1 or 2"
                  />
                  <p className="text-xs text-slate-500 mt-1">Usually 1 (single deck) or 2 (double deck)</p>
                </div>
                <button
                  type="button"
                  onClick={handleSetDecks}
                  disabled={numDecks <= 0}
                  className="px-6 py-2.5 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors"
                >
                  Next: Configure {currentDeck === 1 ? 'Lower' : 'Upper'} Deck
                </button>
              </div>
            )}

            {/* Step 3: Number of Columns for Current Deck */}
            {layoutStep === 3 && (
              <div className="bg-slate-50 p-6 rounded-lg text-center space-y-4">
                <h4 className="text-lg font-bold text-slate-900">
                  Step 2: Configure {currentDeck === 1 ? 'Lower' : 'Upper'} Deck
                </h4>
                <p className="text-sm text-slate-600">
                  Enter the number of vertical columns for {currentDeck === 1 ? 'lower' : 'upper'} deck
                </p>
                <div className="max-w-xs mx-auto">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Number of Columns (Deck {currentDeck}) *
                  </label>
                  <input
                    type="number"
                    value={deckConfigs[currentDeck]?.numColumns || ""}
                    onChange={(e) => updateNumColumnsForDeck(e.target.value)}
                    min="1"
                    max="10"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                    placeholder="e.g., 2 or 3"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentDeck > 1) {
                        setCurrentDeck(prev => prev - 1);
                      } else {
                        setLayoutStep(1);
                      }
                    }}
                    className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSetColumnsForDeck}
                    disabled={!deckConfigs[currentDeck]?.numColumns || deckConfigs[currentDeck].numColumns <= 0}
                    className="flex-1 px-4 py-2.5 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors"
                  >
                    Next: Set Seats Per Column
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Seats Per Column for Current Deck */}
            {layoutStep === 4 && (
              <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                <h4 className="text-lg font-bold text-slate-900">
                  Step 3: Seats Per Column - {currentDeck === 1 ? 'Lower' : 'Upper'} Deck
                </h4>
                <p className="text-sm text-slate-600">
                  Enter the number of seats for each column in {currentDeck === 1 ? 'lower' : 'upper'} deck
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {deckConfigs[currentDeck]?.seatsPerColumn?.map((seats, colIndex) => (
                    <div key={colIndex}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Column {colIndex + 1}
                      </label>
                      <input
                        type="number"
                        value={deckConfigs[currentDeck].seatsPerColumn[colIndex] || ""}
                        onChange={(e) => updateSeatsForColumn(colIndex, e.target.value)}
                        min="1"
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                        placeholder="Seats"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setLayoutStep(2)}
                    className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSetSeatsPerColumnForDeck}
                    disabled={!deckConfigs[currentDeck]?.seatsPerColumn?.some(s => s > 0)}
                    className="flex-1 px-4 py-2.5 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors"
                  >
                    {currentDeck < numDecks ? 'Next Deck' : 'Generate Layout'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Customize Seats */}
            {layoutStep === 5 && formData.seatLayout.length > 0 && (
              <>
                {/* Legend */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                    <span className="font-medium text-slate-700">Seater</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
                    <span className="font-medium text-slate-700">Sleeper</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-amber-100 border-2 border-amber-300 rounded"></div>
                    <span className="font-medium text-slate-700">Semi-Sleeper</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <div className="flex flex-row justify-around">
                    {/* Display seats grouped by deck in separate rows */}
                    {(() => {
                      // Group seats by deck first
                      const decks = {};
                      formData.seatLayout.forEach((seat) => {
                        if (!decks[seat.deck]) {
                          decks[seat.deck] = [];
                        }
                        decks[seat.deck].push(seat);
                      });
                      
                      // Display each deck in separate rows
                      return Object.keys(decks).sort((a, b) => {
                        if (a === 'lower') return -1;
                        if (b === 'lower') return 1;
                        return 0;
                      }).map(deckName => (
                        <div key={deckName} className="flex flex-col gap-2">
                          {/* Deck label */}
                          <div className="text-center text-xs font-bold text-slate-600 mb-2 capitalize">
                            {deckName} Deck
                          </div>
                          
                          {/* Columns for this deck in a row */}
                          <div className="flex gap-2 justify-center">
                            {(() => {
                              const columns = {};
                              decks[deckName].forEach((seat) => {
                                if (!columns[seat.column]) {
                                  columns[seat.column] = [];
                                }
                                columns[seat.column].push(seat);
                              });
                              
                              return Object.keys(columns).sort((a, b) => parseInt(a) - parseInt(b)).map(colNum => (
                                <div key={colNum} className="flex flex-col gap-0">
                                  {columns[colNum].sort((a, b) => a.row - b.row).map((seat) => {
                                    // Dynamic colors based on seat category
                                    const seatColors = {
                                      seater: "bg-blue-100 border-blue-400 hover:border-blue-600 hover:bg-blue-200",
                                      sleeper: "bg-purple-100 border-purple-400 hover:border-purple-600 hover:bg-purple-200",
                                      semi_sleeper: "bg-amber-100 border-amber-400 hover:border-amber-600 hover:bg-amber-200"
                                    };
                                    
                                    // Fixed heights based on ratio 1:2:3 (seater:semi-sleeper:sleeper)
                                    const seatHeights = {
                                      seater: "h-10",
                                      sleeper: "h-30",
                                      semi_sleeper: "h-20"
                                    };
                                    
                                    const colorClass = seatColors[seat.seatCategory] || seatColors.seater;
                                    const heightClass = seatHeights[seat.seatCategory] || seatHeights.seater;
                                    
                                    return (
                                      <button
                                        key={seat.seatNumber}
                                        type="button"
                                        onClick={() => openSeatEditor(formData.seatLayout.findIndex(s => s.seatNumber === seat.seatNumber))}
                                        className={`w-10 pr-1 ${heightClass} border-2 border-l-0 border-t-0 border-b-0 border-r-0 rounded-2xl flex items-center justify-center font-bold transition-all shadow-sm ${colorClass}`}
                                        title={`${seat.seatNumber} - ${seat.seatCategory.replace('_', ' ')} - ₹${seat.fare}\nDeck: ${seat.deck}\nCol: ${seat.column}, Row: ${seat.row}\nClick to customize`}
                                      >
                                        {seat.seatNumber}
                                      </button>
                                    );
                                  })}
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 text-center">
                  Total: {formData.seatLayout.length} seats | Click on any seat to customize its type and price
                </p>
              </>
            )}
          </div>

          {/* Seat Editor Modal */}
          {showSeatEditor && editingSeat !== null && (
            <div className="fixed inset-0 bg-black/50 backdrop:blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    Customize Seat {formData.seatLayout[editingSeat]?.seatNumber}
                  </h3>
                  <button
                    type="button"
                    onClick={closeSeatEditor}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Seat Type *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {SEAT_TYPES.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => updateSeatCategory(type.value)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.seatLayout[editingSeat]?.seatCategory === type.value
                              ? "border-lime-500 bg-lime-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="text-xs font-bold text-slate-900">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Seat Fare (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.seatLayout[editingSeat]?.fare || 0}
                      onChange={(e) => updateSeatFare(e.target.value)}
                      min="0"
                      step="10"
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Seat Number:</span>
                      <span className="font-bold text-slate-900">{formData.seatLayout[editingSeat]?.seatNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Position:</span>
                      <span className="font-bold text-slate-900 capitalize">{formData.seatLayout[editingSeat]?.seatType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Deck:</span>
                      <span className="font-bold text-slate-900 capitalize">{formData.seatLayout[editingSeat]?.deck}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Row:</span>
                      <span className="font-bold text-slate-900">{formData.seatLayout[editingSeat]?.row}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={closeSeatEditor}
                      className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
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