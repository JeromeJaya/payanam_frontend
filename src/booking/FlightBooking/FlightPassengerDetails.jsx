import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../../NavComponent.jsx";
import { User, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";

export default function FlightPassengerDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, fare, selectedSeats, scheduleId, tripType, flights } = location.state || {};

  // Initialize passenger details array based on selected seats
  const [passengers, setPassengers] = useState(
    selectedSeats?.map((seat, index) => ({
      name: "",
      age: "",
      gender: "", // No default - must be selected
      seatNumber: seat.seatNumber,
      seatFare: seat.isExtraLegroom || seat.seatType === "extra-legroom" 
        ? (fare?.price || 0) + 100 
        : (fare?.price || 0),
    })) || []
  );

  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);

  // Update passenger field
  const updatePassenger = (index, field, value) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    // Clear error for this field
    if (errors[index]?.[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        if (updated[index]) {
          delete updated[index][field];
          if (Object.keys(updated[index]).length === 0) {
            delete updated[index];
          }
        }
        return updated;
      });
    }
  };

  // Validate all passengers
  const validatePassengers = () => {
    const newErrors = {};
    let isValid = true;

    // Check if any passengers exist
    if (!passengers || passengers.length === 0) {
      return false;
    }

    passengers.forEach((p, index) => {
      const passengerErrors = {};
      
      // Name validation - required, minimum 2 characters
      if (!p.name || !p.name.trim()) {
        passengerErrors.name = "Name is required";
        isValid = false;
      } else if (p.name.trim().length < 2) {
        passengerErrors.name = "Name must be at least 2 characters";
        isValid = false;
      }
      
      // Age validation - required, must be a valid number between 1-120
      if (!p.age || p.age === "") {
        passengerErrors.age = "Age is required";
        isValid = false;
      } else {
        const ageNum = parseInt(p.age);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          passengerErrors.age = "Age must be between 1 and 120";
          isValid = false;
        }
      }
      
      // Gender validation - required, must be selected
      if (!p.gender || p.gender === "") {
        passengerErrors.gender = "Gender is required";
        isValid = false;
      }
      
      if (Object.keys(passengerErrors).length > 0) {
        newErrors[index] = passengerErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle continue to checkout
  const handleContinue = () => {
    setFormTouched(true); // Mark form as touched to show errors
    if (!validatePassengers()) {
      // Scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector('.border-red-500');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    // Navigate to checkout with passenger details
    navigate('/flight-checkout', {
      state: {
        flight,
        flights,
        fare,
        selectedSeats,
        scheduleId,
        tripType,
        passengerDetails: passengers,
      }
    });
  };

  // Calculate total fare
  const totalFare = passengers.reduce((sum, p) => sum + (p.seatFare || 0), 0);

  if (!selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <Nav />
        <div className="text-center">
          <p className="text-gray-600 dark:text-slate-400 mb-4">No seats selected</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Nav />

      <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Passenger Details
          </h1>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Enter details for each passenger. Information must match valid government ID.
          </p>
        </div>

        {/* Selected Seats Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 mb-6">
          <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            Selected Seats ({selectedSeats.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <span
                key={seat.seatNumber}
                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-sm font-bold text-blue-800 dark:text-blue-300"
              >
                {seat.seatNumber}
                <span className="text-xs font-normal opacity-70">
                  ₹{seat.isExtraLegroom || seat.seatType === "extra-legroom" 
                    ? (fare?.price || 0) + 100 
                    : (fare?.price || 0)}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Passenger Forms */}
        <div className="space-y-4 mb-6">
          {passengers.map((passenger, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <User size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-slate-100">
                      Passenger {index + 1}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Seat: <span className="font-bold text-blue-600 dark:text-blue-400">{passenger.seatNumber}</span>
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  ₹{passenger.seatFare.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={passenger.name}
                    onChange={(e) => updatePassenger(index, "name", e.target.value)}
                    placeholder="Enter full name"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors[index]?.name
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-slate-600"
                    } bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                  />
                  {errors[index]?.name && (
                    <p className="mt-1 text-xs text-red-500">{errors[index].name}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={passenger.age}
                    onChange={(e) => updatePassenger(index, "age", e.target.value)}
                    placeholder="Age"
                    min="1"
                    max="120"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors[index]?.age
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-slate-600"
                    } bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                  />
                  {errors[index]?.age && (
                    <p className="mt-1 text-xs text-red-500">{errors[index].age}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Gender *
                  </label>
                  <div className="flex gap-4">
                    {["male", "female", "other"].map((gender) => (
                      <label
                        key={gender}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                          passenger.gender === gender
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                            : "border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`gender-${index}`}
                          value={gender}
                          checked={passenger.gender === gender}
                          onChange={(e) => updatePassenger(index, "gender", e.target.value)}
                          className="sr-only"
                        />
                        <span className={`text-sm font-medium capitalize ${
                          passenger.gender === gender
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-slate-300"
                        }`}>
                          {gender}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors[index]?.gender && (
                    <p className="mt-1 text-xs text-red-500">{errors[index].gender}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary & Continue */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sticky bottom-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Fare</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                ₹{totalFare.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                {passengers.length} Passenger(s) • Inclusive of all taxes
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              CONTINUE
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
