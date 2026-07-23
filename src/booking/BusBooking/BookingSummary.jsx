import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Armchair, ChevronDown, ChevronUp } from "lucide-react";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function BookingSummary({
  busSelections,
  scheduleId,
  boardingPoints = [],
  droppingPoints = [],
  selectedBoardingText,
  selectedDroppingText,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
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

  const seatList = useMemo(() => entries.flatMap(([ , data]) => data.seats), [busSelections]); 

  // Seat blocking is now done when user clicks "Confirm" (handleConfirmSeats)
  // This ensures the 10-minute lock starts only when they're ready to proceed
  useEffect(() => {
    // Reset lock status when seat selection changes
    setLockStatus({ status: "idle", message: "" });
    setBooking({ status: "idle", message: "", data: null });
  }, [scheduleId, seatList.length]);

  const handleConfirmSeats = async () => {
    if (!isAuthenticated) {
      navigate("/login", { 
        state: { 
          from: location.pathname,
          bookingData: { scheduleId, busName, boarding: boardingObj, dropping: droppingObj, seats: seatList, total: grandTotal }
        }
      });
      return;
    }
    if (!scheduleId || entries.length === 0) return;

    // Block seats for 10 minutes before proceeding to confirmation
    setLockStatus({ status: "locking", message: "Securing your seats..." });
    setBooking({ status: "loading", message: "Securing seats...", data: null });

    try {
      await api.post(`/api/v1/buses/schedules/${scheduleId}/block-seats`, { seatNumbers: seatList });
      setLockStatus({ status: "locked", message: "Seats held for 10 minutes" });
      setBooking({ status: "idle", message: "", data: null });

      // Navigate to seat confirmation page
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
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to secure seats. Please try again.";
      setLockStatus({ status: "error", message: errorMsg });
      setBooking({ status: "error", message: errorMsg });
    }
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
              ⚠️ Login to continue with booking
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
                disabled={booking.status === "loading" || (lockStatus.status === "error" && isAuthenticated)}
                className="w-full sm:w-auto sm:min-w-[180px] rounded-xl bg-lime-500 hover:bg-lime-600 active:scale-[0.99] py-3 px-5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-lime-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 tracking-wider uppercase focus:outline-none"
              >
                {booking.status === "loading" ? "Confirming..." : !isAuthenticated ? "Login to book" : "Confirm Seats"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}