import SeatArrange from "./SeatArrange.jsx";
import Checkbox from "../../filter/Checkbox.jsx";
import BookingSummary from "./BookingSummary.jsx";
import api from "../../api/axios.js";
import { useState, useEffect } from "react";

export default function SeatSelection({
  scheduleId,
  boardingPoints = [],
  droppingPoints = [],
  maxSeats,
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
      <div className="flex items-center justify-center h-60 text-sm font-medium text-gray-400">
        Loading seat layout...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch p-2 sm:p-3 lg:p-6">
      
      {/* ========== MOBILE ONLY (below md: 768px) ========== */}
      {/* Pickup & Drop Points - appears at top on mobile */}
      <div className="md:hidden w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 flex justify-center text-center font-bold text-xs sm:text-sm text-gray-700 p-3 uppercase tracking-wider">
          Select Pickup & Drop Points
        </div>
        <div className="flex flex-col gap-3 p-3 sm:p-4">
          <div className="overflow-y-auto rounded-xl border border-gray-50 shadow-inner bg-gray-50/50">
            <Checkbox
              title={`Pick up - ${pickupCity}`}
              text={pickupNames}
              value={selectedBoarding}
              onChange={setSelectedBoarding}
              type="single"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto rounded-xl border border-gray-50 shadow-inner bg-gray-50/50">
            <Checkbox
              title={`Drop - ${dropCity}`}
              text={dropNames}
              value={selectedDropping}
              onChange={setSelectedDropping}
              type="single"
            />
          </div>
        </div>
      </div>

      {/* Seat Layout Section - visible on all screens */}
      <div className="w-full lg:w-[50%] flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center sm:items-start overflow-x-auto pb-3 sm:pb-4 snap-x shrink-0">
        {lowerSeats.length > 0 && (
          <div className="w-full max-w-[320px] sm:w-64 bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-2 sm:p-3 shrink-0 snap-center">
            <SeatArrange 
              busName={"Lower Deck"} 
              seats={lowerSeats} 
              seatLayoutType={seatLayoutType} 
              onChange={handleSelectionChange} 
              maxSeats={maxSeats}
            />
          </div>
        )}
        
        {upperSeats.length > 0 && (
          <div className="w-full max-w-[320px] sm:w-64 bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-2 sm:p-3 shrink-0 snap-center">
            <SeatArrange 
              busName={"Upper Deck"} 
              seats={upperSeats} 
              seatLayoutType={seatLayoutType} 
              onChange={handleSelectionChange} 
              maxSeats={maxSeats}
            />
          </div>
        )}
        
        {lowerSeats.length === 0 && upperSeats.length === 0 && (
          <div className="flex items-center justify-center h-60 w-full sm:w-60 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
            No seats available
          </div>
        )}
      </div>

      {/* ========== DESKTOP ONLY (lg and above) ========== */}
      <div className="hidden lg:block lg:w-[50%] min-w-[550px] flex flex-col rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Title */}
        <div className="bg-gray-50 border-b border-gray-100 flex justify-center text-center font-bold text-sm text-gray-700 p-4 uppercase tracking-wider shrink-0">
          Select Pickup & Drop Points
        </div>

        {/* Checkbox Point Grid */}
        <div className="flex flex-row min-h-[500px] gap-4 p-4 flex-1">
            <Checkbox
              title={`Pick up - ${pickupCity}`}
              text={pickupNames}
              value={selectedBoarding}
              onChange={setSelectedBoarding}
              type="single"
            />
             <Checkbox
              title={`Drop - ${dropCity}`}
              text={dropNames}
              value={selectedDropping}
              onChange={setSelectedDropping}
              type="single"
            />
        </div>

        {/* ── Booking Summary Footer Area ── */}
        <div className="px-4 pb-4 shrink-0 border-t border-gray-50 pt-4">
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

      {/* Booking Summary - MOBILE ONLY (below seats) */}
      <div className="md:hidden w-full shrink-0">
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

      
      {/* ========== TABLET ONLY (md to lg) ========== */}
      <div className="hidden md:block lg:hidden w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 flex justify-center text-center font-bold text-xs sm:text-sm text-gray-700 p-4 uppercase tracking-wider shrink-0">
            Select Pickup & Drop Points
          </div>
          <div className="flex flex-col sm:flex-row gap-4 p-4 flex-1">
            <div className="w-full sm:w-1/2 max-h-[250px] overflow-y-auto rounded-xl border border-gray-50 shadow-inner bg-gray-50/50">
              <Checkbox
                title={`Pick up - ${pickupCity}`}
                text={pickupNames}
                value={selectedBoarding}
                onChange={setSelectedBoarding}
                type="single"
              />
            </div>
            <div className="w-full sm:w-1/2 max-h-[220px] overflow-y-auto rounded-xl border border-gray-50 shadow-inner bg-gray-50/50">
              <Checkbox
                title={`Drop - ${dropCity}`}
                text={dropNames}
                value={selectedDropping}
                onChange={setSelectedDropping}
                type="single"
              />
            </div>
          </div>
        </div>
        
        <div className="w-full mt-4">
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