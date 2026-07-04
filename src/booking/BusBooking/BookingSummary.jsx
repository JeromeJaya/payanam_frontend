import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Armchair, ChevronDown, ChevronUp } from "lucide-react";
import api from "../../api/axios.js";

export default function BookingSummary({
  busSelections,
  onClear,
  scheduleId,
  boardingPoints = [],
  droppingPoints = [],
  selectedBoardingText,
  selectedDroppingText,
}) {
  const navigate = useNavigate();
  const entries = Object.entries(busSelections).filter(([ , data]) => data.seats.length > 0);
  const grandTotal = entries.reduce((sum, [ , data]) => sum + (data.total || 0), 0);
  const busName = entries[0]?.[0] || "Payanam Express";
  
  const [booking, setBooking] = useState({ status: "idle", message: "", data: null });
  const [lockStatus, setLockStatus] = useState({ status: "idle", message: "" });
  const [isMinimized, setIsMinimized] = useState(false);

  const selectedBoardingTextKey = selectedBoardingText || Object.keys(boardingPoints)[0] || "";
  const selectedDroppingTextKey = selectedDroppingText || Object.keys(droppingPoints)[0] || "";

  const boardingObj = boardingPoints.find((_, i) => {
    const formatted = `${boardingPoints[i].name} - ${boardingPoints[i].city} (${boardingPoints[i].time})`;
    return formatted === selectedBoardingTextKey;
  }) || boardingPoints[0];

  const droppingObj = droppingPoints.find((_, i) => {
    const formatted = `${droppingPoints[i].name} - ${droppingPoints[i].city} (${droppingPoints[i].time})`;
    return formatted === selectedDroppingTextKey;
  }) || droppingPoints[0];

  // Derive seat list dynamically based on inner data mappings safely
  const seatList = useMemo(() => entries.flatMap(([ , data]) => data.seats), [busSelections]); 

  useEffect(() => {
    if (!scheduleId || seatList.length === 0) {
      setLockStatus({ status: "idle", message: "" });
      return;
    }
    let isMounted = true;
    const blockSelectedSeats = async () => {
      setLockStatus({ status: "locking", message: "Securing your seats..." });
      try {
        await api.post(`/api/v1/buses/schedules/${scheduleId}/block-seats`, { seatNumbers: seatList });
        if (!isMounted) return;
        setLockStatus({ status: "locked", message: "Seats held for 10 minutes" });
        setBooking({ status: "idle", message: "", data: null });
      } catch (err) {
        if (!isMounted) return;
        const errorMsg = err.response?.data?.message || "Selected seats are already blocked.";
        setLockStatus({ status: "error", message: errorMsg });
        setBooking({ status: "error", message: errorMsg });
      }
    };
    blockSelectedSeats();
    return () => { isMounted = false; };
  }, [scheduleId, seatList.length]); // Track simple reference length updates instead of heavy strings

  const handleConfirmSeats = () => {
    if (!scheduleId || entries.length === 0) return;
    if (lockStatus.status === "error") return;

    navigate("/seatconfirmation", {
      state: {
        scheduleId,
        busName,
        boarding: boardingObj,
        dropping: droppingObj,
        seats: seatList,
        total: grandTotal
      }
    });
  };

  if (entries.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-8 sm:py-12 text-center px-4 shadow-sm transition-all duration-300">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-50 text-lime-600 mb-3 shrink-0">
          <Armchair size={24} />
        </div>
        <p className="text-xs sm:text-sm font-bold text-slate-800">No seats selected yet</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-md text-slate-800 transition-all duration-300 overflow-hidden flex flex-col">
      
      {/* ── Header ── */}
      <div 
        onClick={() => setIsMinimized(!isMinimized)} 
        className="p-3 sm:p-4 flex items-center justify-between cursor-pointer border-b border-slate-100 bg-slate-50/50 select-none"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 min-w-0 flex-1 pr-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap">
            Seat Summary
          </h3>

          {booking.status === "error" && (
            <div className="rounded-lg bg-red-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-red-600 truncate max-w-full">
              ⚠️ {booking.message}
            </div>
          )}
          {lockStatus.status === "locked" && booking.status !== "error" && (
            <div className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-blue-600 whitespace-nowrap">
              ⏱️ {lockStatus.message}
            </div>
          )}
        </div>
        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 shrink-0 transition-colors">
          {isMinimized ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {/* ── Body Section Layout ── */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isMinimized ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100 flex flex-col"}`}>
        <div className="p-3 sm:p-4 flex-1 flex flex-col gap-4">
          
          {/* Active Seats Info Cards */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Selected Seats</span>
            <div className="mt-2 flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pr-1">
              {seatList.map(id => (
                <span key={id} className="rounded-md border border-lime-200 bg-lime-50/80 px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-bold text-lime-800 shadow-sm">
                  Seat {id}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Processing Container */}
          <div className="pt-3 border-t border-slate-100 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              
              {/* Pricing Display */}
              <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start w-full sm:w-auto bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wide sm:leading-none">Total Payable</span>
                <span className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              
              {/* CTA Confirm Button */}
              <button
                onClick={handleConfirmSeats}
                disabled={booking.status === "loading" || lockStatus.status === "error"}
                className="w-full sm:w-auto sm:min-w-[180px] rounded-xl bg-lime-500 hover:bg-lime-600 active:scale-[0.99] py-3 px-5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-lime-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 tracking-wider uppercase focus:outline-none"
              >
                {booking.status === "loading" ? "Confirming..." : "Confirm Seats"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}