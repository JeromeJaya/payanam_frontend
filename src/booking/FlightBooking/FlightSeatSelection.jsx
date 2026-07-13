import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../../NavComponent.jsx";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function FlightSeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, fare, scheduleId } = location.state || {};
  const { isAuthenticated } = useAuth();
  
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeTab, setActiveTab] = useState("seats");
  const [blockingSeats, setBlockingSeats] = useState(false);
  const [blockError, setBlockError] = useState("");

  const fetchSeatLayout = async () => {
    try {
      if (!scheduleId) {
        console.error("No scheduleId provided");
        setLoading(false);
        return;
      }

      console.log("Fetching seats for scheduleId:", scheduleId);
      const response = await api.get(`/api/v1/flights/schedules/${scheduleId}/seats`);
      console.log("Seat API response:", response.data);
      
      if (response.data?.data?.seats) {
        setSeats(response.data.data.seats);
        console.log("Seats loaded:", response.data.data.seats.length);
      } else {
        console.warn("No seats found in response:", response.data);
        setSeats([]);
      }
    } catch (error) {
      console.error("Error fetching seats:", error);
      setSeats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("FlightSeatSelection mounted with state:", { flight: !!flight, fare: !!fare, scheduleId });
    
    // Check if we have required data
    if (!scheduleId) {
      console.error("No scheduleId provided to seat selection");
      setLoading(false);
      return;
    }
    fetchSeatLayout();
  }, [scheduleId]);

  const handleSeatClick = (seat) => {
    if (seat.status !== "AVAILABLE") return;
    
    setSelectedSeats(prev => {
      if (prev.find(s => s.seatNumber === seat.seatNumber)) {
        return prev.filter(s => s.seatNumber !== seat.seatNumber);
      }
      return [...prev, seat];
    });
  };

  const getSeatColor = (seat) => {
    if (seat.status === "BOOKED") return "bg-gray-300 cursor-not-allowed";
    if (seat.status === "BLOCKED") return "bg-yellow-200 cursor-not-allowed";
    if (selectedSeats.find(s => s.seatNumber === seat.seatNumber)) return "bg-blue-500";
    return "bg-purple-400 hover:bg-purple-500 cursor-pointer";
  };

  const getSeatPrice = (seat) => {
    if (seat.isExtraLegroom) return fare.price + 100;
    if (seat.seatType === "extra-legroom") return fare.price + 100;
    return fare.price;
  };

  // Map numeric columns to letters (1->A, 2->B, 3->C, 4->D, 5->E, 6->F)
  const columnMap = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F' };
  
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    const row = seat.row;
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  // Handle continue - block seats before navigating to checkout
  const handleContinue = async () => {
    if (selectedSeats.length === 0) return;
    
    if (!isAuthenticated) {
      navigate("/login", { 
        state: { 
          from: "/flight-seat-selection",
          flight,
          fare,
          selectedSeats,
          scheduleId
        } 
      });
      return;
    }

    setBlockingSeats(true);
    setBlockError("");

    try {
      // Block seats via API
      const seatNumbers = selectedSeats.map(s => s.seatNumber);
      await api.post(`/api/v1/flights/schedules/${scheduleId}/block-seats`, {
        seatNumbers,
      });

      // Navigate to passenger details page with blocked seats
      navigate('/flight-passenger-details', { 
        state: { 
          flight, 
          fare,
          selectedSeats,
          scheduleId
        } 
      });
    } catch (err) {
      console.error("Failed to block seats:", err);
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading seat layout...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no scheduleId
  if (!scheduleId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-4">No schedule information available</p>
            <p className="text-sm text-gray-500 mb-4">Please go back and select a flight first.</p>
            <button 
              onClick={() => navigate('/flightbooking')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
            >
              Go to Flight Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no seats available
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
            <button 
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
            >
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
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {flight?.journey?.source?.split('(')[0]?.trim()} → {flight?.journey?.destination?.split('(')[0]?.trim()}
          </h1>
          <p className="text-sm text-gray-600">
            Select your preferred seats for this journey
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab("seats")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "seats" 
                  ? "border-b-2 border-blue-600 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Seats
              </span>
            </button>
            <button 
              onClick={() => setActiveTab("meals")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "meals" 
                  ? "border-b-2 border-blue-600 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Meals
              </span>
            </button>
          </div>
        </div>

        {activeTab === "seats" && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            {/* Seat Map */}
            <div className="flex justify-center mb-8">
              <div className="inline-block">
                {/* Airplane nose decoration */}
                <div className="w-64 h-32 bg-gray-100 rounded-t-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>

                {/* Seat Grid */}
                <div className="space-y-2">
                  {Object.keys(seatsByRow).sort((a, b) => parseInt(a) - parseInt(b)).map(rowNum => {
                    const rowSeats = seatsByRow[rowNum];
                    const leftSide = rowSeats.filter(s => [1, 2, 3].includes(s.column));
                    const rightSide = rowSeats.filter(s => [4, 5, 6].includes(s.column));
                    
                    return (
                      <div key={rowNum} className="flex items-center justify-center gap-4">
                        <div className="flex gap-1">
                          {leftSide.map(seat => (
                            <button
                              key={seat.seatNumber}
                              onClick={() => handleSeatClick(seat)}
                              disabled={seat.status !== "AVAILABLE"}
                              className={`w-10 h-10 rounded border-2 ${getSeatColor(seat)} ${
                                seat.isExtraLegroom ? 'border-orange-400' : 'border-gray-300'
                              } flex items-center justify-center text-xs font-medium`}
                              title={seat.seatNumber}
                            >
                              {columnMap[seat.column] || seat.column}
                            </button>
                          ))}
                        </div>
                        
                        <div className="w-8"></div>
                        
                        <div className="flex gap-1">
                          {rightSide.map(seat => (
                            <button
                              key={seat.seatNumber}
                              onClick={() => handleSeatClick(seat)}
                              disabled={seat.status !== "AVAILABLE"}
                              className={`w-10 h-10 rounded border-2 ${getSeatColor(seat)} ${
                                seat.isExtraLegroom ? 'border-orange-400' : 'border-gray-300'
                              } flex items-center justify-center text-xs font-medium`}
                              title={seat.seatNumber}
                            >
                              {columnMap[seat.column] || seat.column}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-400 rounded border-2 border-gray-300"></div>
                <span className="text-xs text-gray-600">Free</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded border-2 border-gray-300"></div>
                <span className="text-xs text-gray-600">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded border-2 border-gray-300"></div>
                <span className="text-xs text-gray-600">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-200 rounded border-2 border-orange-400"></div>
                <span className="text-xs text-gray-600">Extra Legroom</span>
              </div>
            </div>

            {/* Promotional Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-semibold text-sm">
                  Get FREE SEAT using VISA Signature Credit card. Discount will be automatically applied on payments page.
                </span>
              </div>
              <button className="text-blue-600 text-sm font-bold hover:text-blue-700 whitespace-nowrap">
                View T&C
              </button>
            </div>
          </div>
        )}

        {activeTab === "meals" && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Meal Selection</h3>
            <p className="text-sm text-gray-600">Meal selection will be available here.</p>
          </div>
        )}

        {/* Selection Summary & Continue Button */}
        <div className="bg-white rounded-xl shadow-md p-6 sticky bottom-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {selectedSeats.length} of 1 Seat(s) Selected
              </p>
              {selectedSeats.length > 0 && (
                <div className="space-y-1">
                  {selectedSeats.map(seat => (
                    <p key={seat.seatNumber} className="text-sm font-medium text-gray-900">
                      Seat {seat.seatNumber} - MYR {getSeatPrice(seat)}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {/* Block Error Message */}
            {blockError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600 font-medium">
                ⚠️ {blockError}
              </div>
            )}

            <button 
              onClick={handleContinue}
              disabled={selectedSeats.length === 0 || blockingSeats}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {blockingSeats ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Reserving...
                </>
              ) : (
                "CONTINUE"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}