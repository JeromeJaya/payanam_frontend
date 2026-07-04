import SeatArrange from "./SeatArrange.jsx";
import Checkbox from "../../filter/Checkbox.jsx";
import BookingSummary from "./BookingSummary.jsx";
import api from "../../api/axios.js";
import { useState, useEffect } from "react";

export default function SeatSelection({
  scheduleId,
  boardingPoints = [],
  droppingPoints = [],
}) {
  const [busSelections, setBusSelections] = useState({});
  const [seatData, setSeatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBoarding, setSelectedBoarding] = useState({});
  const [selectedDropping, setSelectedDropping] = useState({});

  // Fetch seat layout from API
  useEffect(() => {
    if (!scheduleId) return;
    setLoading(true);
    api.get(`/api/v1/buses/schedules/${scheduleId}/seats`)
      .then((res) => {
        setSeatData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch seat layout:", err);
        setLoading(false);
      });
  }, [scheduleId]);

  const handleSelectionChange = ({ busName, seats, total }) => {
    setBusSelections(prev => ({ ...prev, [busName]: { seats, total } }));
  };

  const handleClearAll = () => {
    setBusSelections({});
  };

  /* Format a point object -> display string with name, city, time, address & landmark */
  const formatPoint = (pt) => {
    if (!pt) return "";
    let str = pt.name;
    if (pt.city) str += ` - ${pt.city}`;
    if (pt.time) str += ` (${pt.time})`;
    if (pt.address) str += `\n${pt.address}`;
    if (pt.landmark) str += `, ${pt.landmark}`;
    return str;
  };

  /* Derive title city from the first point */
  const pickupCity = boardingPoints[0]?.city || "Pickup Location";
  const dropCity   = droppingPoints[0]?.city || "Drop Location";

  const pickupNames  = boardingPoints.map(formatPoint);
  const dropNames    = droppingPoints.map(formatPoint);

  // Split seats by deck
  const lowerSeats = seatData?.seats?.filter((s) => s.deck === "lower") || [];
  const upperSeats = seatData?.seats?.filter((s) => s.deck === "upper") || [];
  const seatLayoutType = seatData?.bus?.seatLayoutType;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60 text-gray-400 text-sm font-medium">
        Loading seat layout...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-start p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto">
      
      {/* ── SEAT LAYOUT CONTAINER ── */}
      {/* Flows vertically on tiny mobile screens, shifts horizontally on tablets, adapts tightly on desktop */}
      <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-start overflow-x-auto pb-2 shrink-0">
        {lowerSeats.length > 0 && (
          <div className="w-full max-w-[280px] sm:w-60 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-3">
            <SeatArrange 
              busName={"Lower Deck"} 
              seats={lowerSeats} 
              seatLayoutType={seatLayoutType} 
              onChange={handleSelectionChange} 
            />
          </div>
        )}
        
        {upperSeats.length > 0 && (
          <div className="w-full max-w-[280px] sm:w-60 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-3">
            <SeatArrange 
              busName={"Upper Deck"} 
              seats={upperSeats} 
              seatLayoutType={seatLayoutType} 
              onChange={handleSelectionChange} 
            />
          </div>
        )}
        
        {lowerSeats.length === 0 && upperSeats.length === 0 && (
          <div className="flex items-center justify-center h-60 w-full sm:w-60 bg-gray-50 border border-dashed border-gray-200 rounded-3xl text-gray-400 text-sm">
            No seats available
          </div>
        )}
      </div>

      {/* ── PICKUP, DROP & SUMMARY SIDE PANEL ── */}
      <div className="bg-neutral-50 w-full flex-1 flex flex-col rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[450px]">
        
        {/* Header Block */}
        <div className="bg-slate-100 flex justify-center font-bold text-gray-700 p-3 text-xs sm:text-sm uppercase tracking-wider shrink-0 text-center">
          Select Pickup & Drop Points
        </div>

        {/* Checkbox Panel Grid */}
        {/* Transitions cleanly from stacked sections on smaller views to clean split views on larger tablets and screens */}
        <div className="flex flex-col md:flex-row flex-1 gap-4 p-4 min-h-0">
          <div className="w-full md:w-1/2 max-h-[250px] md:max-h-[350px] overflow-y-auto rounded-2xl bg-white shadow-md border border-gray-50">
            <Checkbox
              title={`Pick up point - ${pickupCity}`}
              text={pickupNames}
              value={selectedBoarding}
              onChange={setSelectedBoarding}
            />
          </div>
          <div className="w-full md:w-1/2 max-h-[250px] md:max-h-[350px] overflow-y-auto rounded-2xl bg-white shadow-md border border-gray-50">
            <Checkbox
              title={`Drop point - ${dropCity}`}
              text={dropNames}
              value={selectedDropping}
              onChange={setSelectedDropping}
            />
          </div>
        </div>

        {/* ── Booking Summary Footer ── */}
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 shrink-0 border-t border-gray-100 pt-4 bg-white">
          <BookingSummary
            busSelections={busSelections}
            onClear={handleClearAll}
            scheduleId={scheduleId}
            boardingPoints={boardingPoints}
            droppingPoints={droppingPoints}
            selectedBoardingText={Object.keys(selectedBoarding).find((k) => selectedBoarding[k])}
            selectedDroppingText={Object.keys(selectedDropping).find((k) => selectedDropping[k])}
          />
        </div>

      </div>
    </div>
  );
}