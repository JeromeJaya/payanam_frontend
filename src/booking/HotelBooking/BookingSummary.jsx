import { useState, useEffect, useMemo } from "react"; // Added useMemo
import { IndianRupee, X, ShieldCheck, Armchair, ChevronDown, ChevronUp } from "lucide-react";
import api from "../../api/axios.js";
import BookingSuccess from "./BookingSuccess.jsx";

export default function BookingSummary({
  busSelections,
  onClear,
  scheduleId,
  boardingPoints = [],
  droppingPoints = [],
  selectedBoardingText,
  selectedDroppingText,
}) {
  const entries = Object.entries(busSelections).filter(
    ([, data]) => data.seats.length > 0
  );
  const grandTotal = entries.reduce((sum, [, data]) => sum + (data.total || 0), 0);
  
  const [booking, setBooking] = useState({ status: "idle", message: "", data: null });
  const [lockStatus, setLockStatus] = useState({ status: "idle", message: "" });
  const [passengers, setPassengers] = useState({});
  const [isMinimized, setIsMinimized] = useState(false);

  const selectedBoardingTextKey = selectedBoardingText || Object.keys(boardingPoints)[0] || "";
  const selectedDroppingTextKey = selectedDroppingText || Object.keys(droppingPoints)[0] || "";

  // Exact ID matching structure
  const boardingPointId = boardingPoints.find((_, i) => {
    if (!selectedBoardingTextKey) return i === 0;
    const formatted = `${boardingPoints[i].name} - ${boardingPoints[i].city} (${boardingPoints[i].time})`;
    return formatted === selectedBoardingTextKey;
  })?.id || boardingPoints[0]?.id;

  const droppingPointId = droppingPoints.find((_, i) => {
    if (!selectedDroppingTextKey) return i === 0;
    const formatted = `${droppingPoints[i].name} - ${droppingPoints[i].city} (${droppingPoints[i].time})`;
    return formatted === selectedDroppingTextKey;
  })?.id || droppingPoints[0]?.id;

  // FIX 1: Memoize seatList so it maintains reference stability across renders
  const seatList = useMemo(() => {
    return entries.flatMap(([, data]) => data.seats);
  }, [JSON.stringify(entries)]); 

  const passengerList = seatList.map(seatId => passengers[seatId]).filter(Boolean);

  // FIX 2: Controlled useEffect with stringified dependency array and mounting flag
  useEffect(() => {
    if (!scheduleId || seatList.length === 0) {
      setLockStatus({ status: "idle", message: "" });
      return;
    }

    let isMounted = true;

    const blockSelectedSeats = async () => {
      setLockStatus({ status: "locking", message: "Securing your seats..." });
      try {
        await api.post(`/api/v1/buses/schedules/${scheduleId}/block-seats`, {
          seatNumbers: seatList,
        });
        
        if (!isMounted) return;
        setLockStatus({ status: "locked", message: "Seats held for 10 minutes" });
        setBooking({ status: "idle", message: "", data: null });
      } catch (err) {
        if (!isMounted) return;

        const errorMsg = err.response?.data?.message || "Selected seats are already blocked or booked.";
        setLockStatus({ status: "error", message: errorMsg });
        setBooking({ status: "error", message: errorMsg });
      }
    };

    blockSelectedSeats();

    return () => {
      isMounted = false; // Prevents race-conditions on rapid clicking
    };
  }, [scheduleId, JSON.stringify(seatList)]); // Safe structural evaluation

  const handleBookNow = async () => {
    if (!scheduleId || entries.length === 0) return;
    
    if (lockStatus.status === "error") {
      setBooking({ 
        status: "error", 
        message: `Cannot proceed: ${lockStatus.message}` 
      });
      return;
    }

    if (passengerList.length < seatList.length) {
      setBooking({ 
        status: "error", 
        message: "Missing Details: Please fill out Name, Age, and Gender for all selected seats." 
      });
      setIsMinimized(false);
      return;
    }

    setBooking({ status: "loading", message: "", data: null });
    
    try {
      const res = await api.post("/api/v1/bookings", {
        scheduleId,
        boardingPointId,
        droppingPointId,
        passengerDetails: passengerList,
      });

      setBooking({ 
        status: "success", 
        message: res.data?.message || "Booking confirmed!", 
        data: res.data?.data 
      });
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const errorMessage = Array.isArray(backendErrors) && backendErrors.length > 0
        ? backendErrors[0]
        : (err.response?.data?.message || "Seat lock expired or booking timed out. Please try again.");

      setBooking({ status: "error", message: errorMessage });
    }
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-12 text-center px-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-50 text-lime-600 mb-3">
          <Armchair size={24} />
        </div>
        <p className="text-sm font-bold text-slate-800">No seats selected yet</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[180px]">
          Select seats from the deck plan to lock inventory and checkout.
        </p>
      </div>
    );
  }

  if (booking.status === "success") {
    return (
      <BookingSuccess
        bookingId={booking.data?.bookingId} 
        message={booking.message}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm text-slate-800 selection:bg-lime-200 transition-all duration-300 overflow-hidden flex flex-col">
      
      {/* Summary Header */}
      <div 
        onClick={() => setIsMinimized(!isMinimized)}
        className={`p-4 flex items-center justify-between cursor-pointer select-none bg-gradient-to-r from-transparent to-slate-50/30 hover:bg-slate-50/80 transition-colors ${!isMinimized ? "border-b border-slate-100" : ""}`}
      >
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            Journey Summary
            {isMinimized && (
              <span className="normal-case text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {seatList.length} {seatList.length === 1 ? "Seat" : "Seats"} Reserved
              </span>
            )}
          </h3>
          <p className={`text-[11px] font-medium ${lockStatus.status === 'error' ? 'text-red-500' : 'text-slate-500'}`}>
            {lockStatus.message || "10-min temporary lock active"}
          </p>
        </div>
        
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {typeof onClear === "function" && !isMinimized && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 rounded-lg border border-red-100 bg-red-50/50 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              <X size={12} />
              Reset
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            {isMinimized ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {/* Main Container Layer */}
      <div className={`transition-all duration-300 overflow-hidden ${isMinimized ? "max-h-0 opacity-0 pointer-events-none" : "max-h-[480px] opacity-100 flex flex-col"}`}>
        
        {/* Scroll Body Area wrapper */}
        <div className="overflow-y-auto p-5 pb-2 flex-1 space-y-4 max-h-[350px] scrollbar-thin">
          
          {/* Active Bus Segment Card */}
          <div className="space-y-2">
            {entries.map(([busName, { seats, total }]) => (
              <div key={busName} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{busName}</span>
                  <span className="text-sm font-extrabold text-slate-900">₹{total.toLocaleString()}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {seats.map((seatId) => (
                    <span key={seatId} className="inline-flex items-center gap-1 rounded-md border border-lime-200 bg-lime-50/60 px-2 py-0.5 text-[10px] font-bold text-lime-800">
                      <span className={`h-1.5 w-1.5 rounded-full ${lockStatus.status === "locked" ? "bg-lime-500" : lockStatus.status === "locking" ? "bg-amber-400 animate-ping" : "bg-red-500"}`}></span>
                      Seat {seatId}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Points Navigation Visualizer */}
          {(selectedBoardingTextKey || selectedDroppingTextKey) && (
            <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
              <div className="flex gap-2 text-[11px]">
                <div className="flex flex-col items-center pt-0.5">
                  <div className="h-2 w-2 rounded-full bg-lime-500"></div>
                  <div className="w-[1px] flex-1 bg-slate-200 my-1"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                </div>
                <div className="space-y-2 flex-1 text-slate-600 max-w-[280px]">
                  <div className="truncate" title={selectedBoardingTextKey}>
                    <span className="font-bold text-slate-800">Boarding:</span> {selectedBoardingTextKey}
                  </div>
                  <div className="truncate" title={selectedDroppingTextKey}>
                    <span className="font-bold text-slate-800">Dropping:</span> {selectedDroppingTextKey}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Passenger Information Forms Area */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Passenger Details</p>
              <span className="text-[10px] font-medium text-slate-400">Required fields</span>
            </div>
            
            <div className="space-y-2">
              {seatList.map((seatId) => (
                <div key={seatId} className="grid grid-cols-[45px_1fr_55px_50px] gap-1.5 items-center bg-white p-1.5 rounded-lg border border-slate-100 shadow-3xs">
                  <span className="text-[10px] font-bold text-slate-500 text-center bg-slate-100 py-1 rounded">
                    {seatId}
                  </span>
                  <input
                    placeholder="Full Name"
                    type="text"
                    required
                    disabled={lockStatus.status === "error"}
                    className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-800 placeholder-slate-400 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:bg-slate-50"
                    value={passengers[seatId]?.name || ""}
                    onChange={(e) =>
                      setPassengers((p) => ({
                        ...p,
                        [seatId]: { seatNumber: seatId, name: e.target.value, age: p[seatId]?.age || "", gender: p[seatId]?.gender || "male" },
                      }))
                    }
                  />
                  <input
                    placeholder="Age"
                    type="number"
                    min="5"
                    max="100"
                    required
                    disabled={lockStatus.status === "error"}
                    className="rounded-md border border-slate-200 px-1.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:bg-slate-50"
                    value={passengers[seatId]?.age || ""}
                    onChange={(e) =>
                      setPassengers((p) => ({
                        ...p,
                        [seatId]: { ...(p[seatId] || { seatNumber: seatId, name: "", gender: "male" }), age: e.target.value ? Number(e.target.value) : "" },
                      }))
                    }
                  />
                  <select
                    disabled={lockStatus.status === "error"}
                    className="rounded-md border border-slate-200 bg-white px-1 py-1 text-xs text-slate-700 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:bg-slate-50"
                    value={passengers[seatId]?.gender || "male"}
                    onChange={(e) =>
                      setPassengers((p) => ({
                        ...p,
                        [seatId]: { ...(p[seatId] || { seatNumber: seatId, name: "", age: "" }), gender: e.target.value },
                      }))
                    }
                  >
                    <option value="male">M</option>
                    <option value="female">F</option>
                    <option value="other">O</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-5 pt-2 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between px-1 mb-3">
            <div>
              <span className="text-xs font-bold text-slate-900">Total Payable</span>
              <p className="text-[10px] text-slate-400">Mock payment automation ready</p>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              ₹{grandTotal.toLocaleString()}
            </span>
          </div>

          {booking.status === "error" && (
            <div className="mb-3 rounded-lg bg-red-50 border border-red-100 p-2 text-center text-[11px] font-medium text-red-600">
              ⚠️ {booking.message}
            </div>
          )}

          <button
            onClick={handleBookNow}
            disabled={booking.status === "loading" || lockStatus.status === "locking" || lockStatus.status === "error"}
            className="w-full rounded-xl bg-lime-500 py-2.5 text-xs font-bold text-white shadow-md shadow-lime-500/10 transition hover:bg-lime-600 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {booking.status === "loading" ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Confirming with Payanam...
              </>
            ) : lockStatus.status === "locking" ? (
              <>Locking Inventory...</>
            ) : (
              <>
                <ShieldCheck size={14} />
                Pay & Secure Ticket
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}