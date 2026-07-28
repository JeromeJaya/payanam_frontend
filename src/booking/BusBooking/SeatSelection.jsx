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

  const realBusName = seatData?.bus?.busName || "Bus";

  const handleSelectionChange = (deckKey) => ({ busName, seats, total }) => {
    setBusSelections(prev => ({
      ...prev,
      [deckKey]: { seats, total, busName: realBusName }
    }));
  };

  const handleClearAll = () => {
    setBusSelections({});
  };

  const formatPoint = (pt) => {
    if (!pt) return "";
    let str = pt.name;
    if (pt.city) str += ` - ${pt.city}`;
    if (pt.time) str += ` (${pt.time})`;
    if (pt.address) str += `\n${pt.address}`;
    if (pt.landmark) str += `, ${pt.landmark}`;
    return str;
  };

  const pickupCity = boardingPoints[0]?.city || "Pickup Location";
  const dropCity   = droppingPoints[0]?.city || "Drop Location";

  const pickupNames  = boardingPoints.map(formatPoint);
  const dropNames    = droppingPoints.map(formatPoint);

  const lowerSeats = seatData?.seats?.filter((s) => s.deck === "lower") || [];
  const upperSeats = seatData?.seats?.filter((s) => s.deck === "upper") || [];
  const seatLayoutType = seatData?.bus?.seatLayoutType;
  const hasMultipleDecks = lowerSeats.length > 0 && upperSeats.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60 text-sm font-medium text-gray-400">
        Loading seat layout...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch p-2 sm:p-3 lg:p-6">

      {/* Pickup & Drop - mobile: top of page */}
      <div className="lg:hidden w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 flex justify-center text-center font-bold text-xs sm:text-sm text-gray-700 p-3 uppercase tracking-wider">
          Select Pickup & Drop Points
        </div>
        <div className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4">
          <div className="flex-1 overflow-y-auto rounded-xl border border-gray-50 shadow-inner bg-gray-50/50 max-h-[220px] sm:max-h-none">
            <Checkbox
              title={`Pick up - ${pickupCity}`}
              text={pickupNames}
              value={selectedBoarding}
              onChange={setSelectedBoarding}
              type="single"
            />
          </div>
          <div className="flex-1 overflow-y-auto rounded-xl border border-gray-50 shadow-inner bg-gray-50/50 max-h-[220px] sm:max-h-none">
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

      {/* Seat Layout */}
      <div className={`flex ${hasMultipleDecks ? 'flex-col md:flex-row' : 'flex-col'} gap-3 sm:gap-4 justify-center items-center lg:items-start w-full lg:w-1/2`}>
        {lowerSeats.length > 0 && (
          <div className="w-full max-w-[340px] sm:max-w-[360px] bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-2 sm:p-3 shrink-0">
            <SeatArrange
              busName={hasMultipleDecks ? "Lower Deck" : realBusName}
              seats={lowerSeats}
              seatLayoutType={seatLayoutType}
              onChange={handleSelectionChange("lower")}
              maxSeats={maxSeats}
            />
          </div>
        )}

        {upperSeats.length > 0 && (
          <div className="w-full max-w-[340px] sm:max-w-[360px] bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-2 sm:p-3 shrink-0">
            <SeatArrange
              busName="Upper Deck"
              seats={upperSeats}
              seatLayoutType={seatLayoutType}
              onChange={handleSelectionChange("upper")}
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

      {/* Right panel - desktop/tablet: pickup/drop + booking summary */}
      <div className="hidden lg:flex lg:w-1/2 flex-col rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 flex justify-center text-center font-bold text-sm text-gray-700 p-4 uppercase tracking-wider shrink-0">
          Select Pickup & Drop Points
        </div>
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

      {/* Booking Summary - below everything on tablet, below seats on mobile */}
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

      {/* Booking Summary - tablet only (between mobile and desktop) */}
      <div className="hidden md:block lg:hidden w-full">
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
  );
}
