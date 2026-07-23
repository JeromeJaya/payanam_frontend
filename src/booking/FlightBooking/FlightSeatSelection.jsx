import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../../NavComponent.jsx";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import SeatMap from "./components/SeatMap";
import MealSelection from "./components/MealSelection";
import SelectionSummary from "./components/SelectionSummary";
import FlightSeatHeader from "./components/FlightSeatHeader";

const SESSION_KEY = "payanam_flight_seat_state";

function loadSessionState() {
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveSessionState(state) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
}

function clearSessionState() {
  sessionStorage.removeItem(SESSION_KEY);
}

export default function FlightSeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingState = location.state || {};
  const savedState = loadSessionState();
  const hasSavedState = savedState?.route?.scheduleId && savedState?.seats?.length > 0;
  const { flight, fare, scheduleId } = hasSavedState ? savedState.route : incomingState;
  const { isAuthenticated } = useAuth();

  const [seats, setSeats] = useState(hasSavedState ? savedState.seats : []);
  const [loading, setLoading] = useState(!hasSavedState);
  const [selectedSeats, setSelectedSeats] = useState(hasSavedState ? (savedState.selectedSeats || []) : []);
  const [activeTab, setActiveTab] = useState("seats");
  const [blockingSeats, setBlockingSeats] = useState(false);
  const [blockError, setBlockError] = useState("");
  const [selectedMeals, setSelectedMeals] = useState(hasSavedState ? (savedState.selectedMeals || {}) : {});
  const [mealTypeFilter, setMealTypeFilter] = useState("all");

  useEffect(() => {
    if (!hasSavedState && incomingState.scheduleId) {
      clearSessionState();
    }
  }, []);

  const fetchSeatLayout = async () => {
    try {
      if (!scheduleId) { setLoading(false); return; }
      const response = await api.get(`/api/v1/flights/schedules/${scheduleId}/seats`);
      if (response.data?.data?.seats) {
        setSeats(response.data.data.seats);
      } else {
        setSeats([]);
      }
    } catch {
      setSeats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!savedState?.seats) {
      if (!scheduleId) { setLoading(false); return; }
      fetchSeatLayout();
    } else {
      setLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    saveSessionState({ seats, selectedSeats, selectedMeals, route: { flight, fare, scheduleId } });
  }, [seats, selectedSeats, selectedMeals, flight, fare, scheduleId]);

  const handleSeatClick = (seat) => {
    if (seat.status !== "AVAILABLE") return;
    setSelectedSeats(prev => {
      if (prev.find(s => s.seatNumber === seat.seatNumber)) {
        return prev.filter(s => s.seatNumber !== seat.seatNumber);
      }
      return [...prev, seat];
    });
  };

  const getSeatPrice = (seat) => {
    if (seat.isExtraLegroom) return fare.price + 100;
    if (seat.seatType === "extra-legroom") return fare.price + 100;
    return fare.price;
  };

  const allCols = [...new Set(seats.map(s => {
    if (typeof s.column === 'number') return s.column;
    const n = parseInt(s.column);
    return isNaN(n) ? s.column : n;
  }))].sort((a, b) => {
    const numA = typeof a === 'number' ? a : parseInt(a);
    const numB = typeof b === 'number' ? b : parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return String(a).localeCompare(String(b));
  });
  const colLabels = allCols.map(c => {
    if (typeof c === 'number') return String.fromCharCode(64 + c);
    const n = parseInt(c);
    if (!isNaN(n)) return String.fromCharCode(64 + n);
    return String(c).toUpperCase();
  });
  const half = Math.ceil(colLabels.length / 2);
  const leftCols = colLabels.slice(0, half);
  const rightCols = colLabels.slice(half);
  const colIndexMap = {};
  colLabels.forEach((label, i) => {
    colIndexMap[String(allCols[i])] = i;
    colIndexMap[label] = i;
  });

  const seatsByRow = seats.reduce((acc, seat) => {
    const row = seat.row;
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const handleContinue = async () => {
    if (selectedSeats.length === 0) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/flight-seat-selection", flight, fare, selectedSeats, scheduleId } });
      return;
    }
    setBlockingSeats(true);
    setBlockError("");
    try {
      const seatNumbers = selectedSeats.map(s => s.seatNumber);
      await api.post(`/api/v1/flights/schedules/${scheduleId}/block-seats`, { seatNumbers });
      navigate('/flight-passenger-details', { state: { flight, fare, selectedSeats, scheduleId, selectedMeals } });
    } catch (err) {
      setBlockError(err.response?.data?.message || "Failed to reserve seats. Please try again.");
    } finally {
      setBlockingSeats(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading seat layout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!scheduleId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-4">No schedule information available</p>
            <p className="text-sm text-gray-500 mb-4">Please go back and select a flight first.</p>
            <button onClick={() => navigate('/flightbooking')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
              Go to Flight Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (seats.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center max-w-lg">
            <p className="text-gray-600 font-semibold mb-2">No seats available for this flight</p>
            <p className="text-sm text-gray-500 mb-4">
              The seat layout may not be configured yet for schedule ID: {scheduleId || "Not provided"}.
            </p>
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                Debug Info: Flight ID: {flight?._id || flight?.id || "N/A"} | Schedule ID: {scheduleId || "Missing"}
              </p>
            </div>
            <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Nav />
      <div className="max-w-6xl mx-auto mt-20 px-4 py-8">
        <FlightSeatHeader flight={flight} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "seats" && (
          <SeatMap
            seats={seats}
            selectedSeats={selectedSeats}
            handleSeatClick={handleSeatClick}
            loading={loading}
            colLabels={colLabels}
            leftCols={leftCols}
            rightCols={rightCols}
            allCols={allCols}
            seatsByRow={seatsByRow}
          />
        )}

        {activeTab === "meals" && (
          <MealSelection
            selectedSeats={selectedSeats}
            selectedMeals={selectedMeals}
            setSelectedMeals={setSelectedMeals}
            mealTypeFilter={mealTypeFilter}
            setMealTypeFilter={setMealTypeFilter}
            colLabels={colLabels}
            colIndexMap={colIndexMap}
          />
        )}

        <SelectionSummary
          selectedSeats={selectedSeats}
          selectedMeals={selectedMeals}
          blockingSeats={blockingSeats}
          blockError={blockError}
          handleContinue={handleContinue}
          getSeatPrice={getSeatPrice}
        />
      </div>
    </div>
  );
}
