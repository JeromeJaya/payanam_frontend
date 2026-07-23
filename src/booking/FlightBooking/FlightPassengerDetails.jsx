import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../../NavComponent.jsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PassengerForm from "./components/PassengerForm";

export default function FlightPassengerDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, fare, selectedSeats, scheduleId, tripType, flights, selectedMeals } = location.state || {};

  const [passengers, setPassengers] = useState(
    selectedSeats?.map((seat) => ({
      name: "",
      age: "",
      gender: "",
      seatNumber: seat.seatNumber,
      seatFare: seat.isExtraLegroom || seat.seatType === "extra-legroom"
        ? (fare?.price || 0) + 100
        : (fare?.price || 0),
    })) || []
  );

  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false); // eslint-disable-line no-unused-vars

  const validateField = (index, field, value) => {
    if (field === "name") {
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Name can only contain letters";
      return "";
    }
    if (field === "age") {
      if (!value || value === "") return "Age is required";
      const ageNum = parseInt(value);
      if (isNaN(ageNum)) return "Age must be a number";
      if (ageNum < 1) return "Age cannot be less than 1";
      if (ageNum > 120) return "Age cannot be more than 120";
      return "";
    }
    if (field === "gender") {
      if (!value || value === "") return "Gender is required";
      return "";
    }
    return "";
  };

  const sanitizeName = (value) => value.replace(/[^a-zA-Z\s]/g, "");

  const sanitizeAge = (value) => value.replace(/\D/g, "");

  const updatePassenger = (index, field, value) => {
    if (field === "name") value = sanitizeName(value);
    if (field === "age") value = sanitizeAge(value);

    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    const error = validateField(index, field, value);
    setErrors(prev => {
      const updated = { ...prev };
      if (error) {
        updated[index] = { ...updated[index], [field]: error };
      } else {
        if (updated[index]) {
          delete updated[index][field];
          if (Object.keys(updated[index]).length === 0) {
            delete updated[index];
          }
        }
      }
      return updated;
    });
  };

  const validatePassengers = () => {
    const newErrors = {};
    let isValid = true;

    if (!passengers || passengers.length === 0) {
      return false;
    }

    passengers.forEach((p, index) => {
      const passengerErrors = {};

      const nameErr = validateField(index, "name", p.name);
      if (nameErr) { passengerErrors.name = nameErr; isValid = false; }

      const ageErr = validateField(index, "age", p.age);
      if (ageErr) { passengerErrors.age = ageErr; isValid = false; }

      const genderErr = validateField(index, "gender", p.gender);
      if (genderErr) { passengerErrors.gender = genderErr; isValid = false; }

      if (Object.keys(passengerErrors).length > 0) {
        newErrors[index] = passengerErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const isPassengerFormValid = () => {
    if (!passengers || passengers.length === 0) return false;
    return passengers.every(p => {
      const nameErr = validateField(0, "name", p.name);
      const ageErr = validateField(0, "age", p.age);
      const genderErr = validateField(0, "gender", p.gender);
      return !nameErr && !ageErr && !genderErr;
    });
  };

  const hasErrors = !isPassengerFormValid();

  const handleContinue = () => {
    setFormTouched(true);
    const isValid = validatePassengers();

    if (!isValid) {
      setTimeout(() => {
        const firstError = document.querySelector('.border-red-500');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    navigate('/flight-checkout', {
      state: {
        flight,
        flights,
        fare,
        selectedSeats,
        scheduleId,
        tripType,
        selectedMeals,
        passengerDetails: passengers,
      }
    });
  };

  const totalFare = passengers.reduce((sum, p) => {
    const mealPrice = selectedMeals?.[p.seatNumber]?.price || 0;
    return sum + (p.seatFare || 0) + mealPrice;
  }, 0);

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

        <div className="space-y-4 mb-6">
          {passengers.map((passenger, index) => (
            <PassengerForm
              key={index}
              passenger={passenger}
              index={index}
              errors={errors[index]}
              selectedMeals={selectedMeals}
              onUpdate={updatePassenger}
            />
          ))}
        </div>

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
              disabled={hasErrors}
              className={`px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 ${
                hasErrors
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
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
