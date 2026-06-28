import SeatArrange from "./SeatArrange.jsx"
import Checkbox from "../../filter/Checkbox.jsx"
import BookingSummary from "./BookingSummary.jsx"
import {useState} from "react";

// Tracks selections reported by each SeatArrange instance

export default function SeatSelection ({
  boardingPoints = [],
  droppingPoints = [],
}){
    const [busSelections, setBusSelections] = useState({});

    const handleSelectionChange = ({ busName, seats, total }) => {
        setBusSelections(prev => ({ ...prev, [busName]: { seats, total } }));
    };

    const handleClearAll = () => {
        setBusSelections({});
    };

    /* Format a point object -> display string like "Koyambedu - Chennai (06:30)" */
    const formatPoint = (pt) => {
        if (!pt) return "";
        const parts = [pt.name];
        if (pt.city) parts.push(pt.city);
        if (pt.time) parts.push(`(${pt.time})`);
        return parts.join(" - ");
    };

    /* Derive title city from the first point */
    const pickupCity = boardingPoints[0]?.city || "Pickup Location";
    const dropCity   = droppingPoints[0]?.city || "Drop Location";

    const pickupNames  = boardingPoints.map(formatPoint);
    const dropNames    = droppingPoints.map(formatPoint);

    return(
        <>

        <div className = "w-full flex h-180">

            <div className = "w-auto flex flex-row gap-2">
                <div className= "bg-blue-50 w-auto h-auto rounded-3xl shadow-3xl ">
                    <SeatArrange busName={"Upper layer"} onChange={handleSelectionChange} />
                </div>
                <div className="bg-blue-200 w-auto h-auto rounded-3xl shadow-3xl ">
                    <SeatArrange busName={"down layer"} onChange={handleSelectionChange} />
                </div>
            </div>


            <div className = "bg-neutral-50 w-full flex flex-col rounded-3xl shadow-3xl min-h-0">

                <div className = "bg-slate-100 flex justify-center font-bold p-3 rounded shrink-0"> Select Pickup & Drop Points </div>

                <div className = "flex flex-row flex-1 min-h-0 gap-2 px-4 py-3">
                    <div className = "w-1/2 overflow-y-auto rounded-3xl shadow-xl">
                        <Checkbox title = {`Pick up point - ${pickupCity}`} text={pickupNames} />
                    </div>
                    <div className = "w-1/2 overflow-y-auto rounded-3xl shadow-xl">
                        <Checkbox title = {`Drop point - ${dropCity}`} text={dropNames} />
                    </div>
                </div>

                {/* ── Booking Summary ── */}
                <div className="px-4 pb-4 shrink-0">
                  <BookingSummary
                    busSelections={busSelections}
                    onClear={handleClearAll}
                  />
                </div>

            </div>
        </div>


        </>
    );
}

