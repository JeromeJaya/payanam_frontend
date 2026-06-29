import SeatArrange from "./SeatArrange.jsx"
import Checkbox from "../../filter/Checkbox.jsx"
import BookingSummary from "./BookingSummary.jsx"
import api from "../../api/axios.js"
import {useState, useEffect} from "react";

// Tracks selections reported by each SeatArrange instance

export default function SeatSelection ({
  scheduleId,
  boardingPoints = [],
  droppingPoints = [],
}){
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
        return <div className="flex items-center justify-center h-60 text-gray-400">Loading seat layout...</div>;
    }

    return(
        <>

        <div className = "w-full flex h-180">

            <div className = "w-auto flex flex-row gap-2">
                {lowerSeats.length > 0 && (
                <div className= "w-60 h-auto rounded-3xl shadow-3xl ">
                    <SeatArrange busName={"Lower Deck"} seats={lowerSeats} seatLayoutType={seatLayoutType} onChange={handleSelectionChange} />
                </div>
                )}
                {upperSeats.length > 0 && (
                <div className="w-60 h-auto rounded-3xl shadow-3xl ">
                    <SeatArrange busName={"Upper Deck"} seats={upperSeats} seatLayoutType={seatLayoutType} onChange={handleSelectionChange} />
                </div>
                )}
                {lowerSeats.length === 0 && upperSeats.length === 0 && (
                <div className="flex items-center justify-center h-60 w-60 bg-gray-100 rounded-3xl shadow-3xl text-gray-400 text-sm">
                    No seats available
                </div>
                )}
            </div>


            <div className = "bg-neutral-50 w-full flex flex-col rounded-3xl shadow-3xl min-h-0">

                <div className = "bg-slate-100 flex justify-center font-bold p-3 rounded shrink-0"> Select Pickup & Drop Points </div>

                <div className = "flex flex-row flex-1 min-h-0 gap-2 px-4 py-3">
                    <div className = "w-1/2 overflow-y-auto rounded-3xl shadow-xl">
                        <Checkbox
                          title={`Pick up point - ${pickupCity}`}
                          text={pickupNames}
                          value={selectedBoarding}
                          onChange={setSelectedBoarding}
                          type = "single"
                        />
                    </div>
                    <div className = "w-1/2 overflow-y-auto rounded-3xl shadow-xl">
                        <Checkbox
                          title={`Drop point - ${dropCity}`}
                          text={dropNames}
                          value={selectedDropping}
                          onChange={setSelectedDropping}
                          type = "single"
                        />
                    </div>
                </div>

                {/* ── Booking Summary ── */}
                <div className="px-4 pb-4 shrink-0">
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


        </>
    );
}

