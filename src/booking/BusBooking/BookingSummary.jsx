import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // IMPORTED useNavigate
import { IndianRupee, X, ShieldCheck, Armchair, ChevronDown, ChevronUp } from "lucide-react";
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
  const navigate = useNavigate(); // Hook initialized
  const entries = Object.entries(busSelections).filter(([ , data]) => data.seats.length > 0);
  const grandTotal = entries.reduce((sum, [ , data]) => sum + (data.total || 0), 0);
  const busName = entries[0]?.[0] || "Payanam Express"; // Capture bus name for the ticket reference
  
  const [booking, setBooking] = useState({ status: "idle", message: "", data: null });
  const [lockStatus, setLockStatus] = useState({ status: "idle", message: "" });
  const [passengers, setPassengers] = useState({});
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

  const seatList = useMemo(() => entries.flatMap(([ , data]) => data.seats), [JSON.stringify(entries)]); 
  const passengerList = seatList.map(seatId => passengers[seatId]).filter(Boolean);

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
  }, [scheduleId, JSON.stringify(seatList)]);

  const handleBookNow = async () => {
    if (!scheduleId || entries.length === 0) return;
    if (lockStatus.status === "error") return;

    if (passengerList.length < seatList.length) {
      setBooking({ status: "error", message: "Missing Details: Fill out information for all selected seats." });
      return;
    }

    setBooking({ status: "loading", message: "", data: null });
    
    try {
      const res = await api.post("/api/v1/bookings", {
        scheduleId,
        boardingPointId: boardingObj?.id,
        droppingPointId: droppingObj?.id,
        passengerDetails: passengerList,
      });

      // API Redirect Trigger: Send all metadata context directly to the ticket confirmation screen
      if (res.data?.success) {
        navigate("/ticketdetails", {
          state: {
            ticket: res.data.data,
            meta: {
              busName,
              boarding: boardingObj,
              dropping: droppingObj,
              passengers: passengerList
            }
          }
        });
      }
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const errorMessage = Array.isArray(backendErrors) && backendErrors.length > 0
        ? backendErrors[0]
        : (err.response?.data?.message || "Booking request failed. Please try again.");
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
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm text-slate-800 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Header */}
      <div onClick={() => setIsMinimized(!isMinimized)} className="p-4 flex items-center justify-between cursor-pointer border-b border-slate-100 bg-slate-50/20">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Journey Summary</h3>
          <p className="text-[11px] text-slate-500">{lockStatus.message}</p>
        </div>
        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
          {isMinimized ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {/* Body Section Layout */}
      <div className={`transition-all duration-300 overflow-hidden ${isMinimized ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100 flex flex-col"}`}>
        <div className="overflow-y-auto p-5 pb-2 flex-1 space-y-4 max-h-[350px] scrollbar-thin">
          
          {/* Active Seats Info Cards */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <div className="flex items-center justify-between font-bold text-xs text-slate-700">
              <span>{busName}</span>
              <span className="text-sm text-slate-900">₹{grandTotal.toLocaleString()}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {seatList.map(id => (
                <span key={id} className="rounded-md border border-lime-200 bg-lime-50/60 px-2 py-0.5 text-[10px] font-bold text-lime-800">
                  Seat {id}
                </span>
              ))}
            </div>
          </div>

          {/* Passenger Input Forms Container */}
          <div className="space-y-2">
            {seatList.map((seatId) => (
              <div key={seatId} className="grid grid-cols-[45px_1fr_55px_50px] gap-1.5 items-center bg-white p-1.5 rounded-lg border border-slate-100 shadow-3xs">
                <span className="text-[10px] font-bold text-slate-500 text-center bg-slate-100 py-1 rounded">{seatId}</span>
                <input
                  placeholder="Name"
                  type="text"
                  required
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs"
                  value={passengers[seatId]?.name || ""}
                  onChange={(e) => setPassengers(p => ({ ...p, [seatId]: { ...p[seatId], seatNumber: seatId, name: e.target.value, gender: p[seatId]?.gender || "male" } }))}
                />
                <input
                  placeholder="Age"
                  type="number"
                  required
                  className="rounded-md border border-slate-200 px-1.5 py-1 text-xs"
                  value={passengers[seatId]?.age || ""}
                  onChange={(e) => setPassengers(p => ({ ...p, [seatId]: { ...p[seatId], age: Number(e.target.value) } }))}
                />
                <select
                  className="rounded-md border border-slate-200 bg-white px-1 py-1 text-xs"
                  value={passengers[seatId]?.gender || "male"}
                  onChange={(e) => setPassengers(p => ({ ...p, [seatId]: { ...p[seatId], gender: e.target.value } }))}
                >
                  <option value="male">M</option>
                  <option value="female">F</option>
                </select>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Processing Container */}
        <div className="p-5 pt-2 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-900">Total Payable</span>
            <span className="text-xl font-black text-slate-900">₹{grandTotal.toLocaleString()}</span>
          </div>

          {booking.status === "error" && (
            <div className="mb-3 rounded-lg bg-red-50 border border-red-100 p-2 text-center text-[11px] font-medium text-red-600">
              ⚠️ {booking.message}
            </div>
          )}

          <button
            onClick={handleBookNow}
            disabled={booking.status === "loading" || lockStatus.status === "error"}
            className="w-full rounded-xl bg-lime-500 py-2.5 text-xs font-bold text-white shadow-md shadow-lime-500/10 transition hover:bg-lime-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {booking.status === "loading" ? "Confirming with Payanam..." : "Pay & Secure Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}