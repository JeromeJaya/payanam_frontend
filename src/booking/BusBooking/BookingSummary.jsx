import { useState } from "react";
import { IndianRupee, X } from "lucide-react";
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
  const [passengers, setPassengers] = useState({});

  const selectedBoardingTextKey = selectedBoardingText || Object.keys(boardingPoints)[0] || "";
  const selectedDroppingTextKey = selectedDroppingText || Object.keys(droppingPoints)[0] || "";

  const boardingPointId = boardingPoints.find((_, i) => {
    if (!selectedBoardingTextKey) return i === 0;
    const formatted = `${boardingPoints[i].name} - ${boardingPoints[i].city} (${boardingPoints[i].time})`;
    return formatted === selectedBoardingTextKey;
  })?.id;

  const droppingPointId = droppingPoints.find((_, i) => {
    if (!selectedDroppingTextKey) return i === 0;
    const formatted = `${droppingPoints[i].name} - ${droppingPoints[i].city} (${droppingPoints[i].time})`;
    return formatted === selectedDroppingTextKey;
  })?.id;

  const passengerList = Object.values(passengers);

  const handleBookNow = async () => {
    if (!scheduleId || entries.length === 0) return;
    const seatList = entries.flatMap(([, data]) => data.seats);
    if (passengerList.length < seatList.length) {
      setBooking({ status: "error", message: "Please add passenger details for all seats" });
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
      setBooking({ status: "success", message: res.data.message || "Booking confirmed!", data: res.data.data });
    } catch (err) {
      setBooking({ status: "error", message: err.response?.data?.message || "Booking failed" });
    }
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-10 text-gray-400">
        <IndianRupee size={36} strokeWidth={1.2} />
        <p className="mt-2 text-sm font-medium">No seats selected yet</p>
        <p className="text-xs">Tap on a seat to begin booking</p>
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
    <div className="rounded-3xl bg-white p-2 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">Booking Summary</h3>
        {typeof onClear === "function" && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-red-500 transition hover:bg-red-50"
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-1">
        {entries.map(([busName, { seats, total }]) => (
          <div key={busName} className="rounded-2xl bg-blue-50/60 p-1/2 transition hover:bg-blue-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">{busName}</span>
              <span className="text-sm font-bold text-blue-700">₹ {total.toLocaleString()}</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {seats.map((seatId) => (
                <span key={seatId} className="inline-flex items-center rounded-lg border border-blue-200 bg-white px-2 py-0.5 text-[10px] font-medium text-blue-700 shadow-sm">
                  {seatId}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-gray-200 pt-1">
        <span className="text-sm font-bold text-gray-800">Total Payable</span>
        <span className="text-base font-extrabold text-blue-700 mr-2">₹ {grandTotal.toLocaleString()}</span>
      </div>

      {entries.length > 0 && (
        <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5">
          <p className="text-[11px] font-semibold text-gray-700 mb-1">Passenger Details</p>
          {entries.flatMap(([, data]) => data.seats).map((seatId) => (
            <div key={seatId} className="mb-1 grid grid-cols-[60px_1fr_60px_60px] gap-1">
              <span className="text-[10px] font-medium text-gray-600 pt-1">{seatId}</span>
              <input
                placeholder="Name"
                className="rounded border border-gray-300 px-1.5 py-1 text-[11px]"
                value={passengers[seatId]?.name || ""}
                onChange={(e) =>
                  setPassengers((p) => ({
                    ...p,
                    [seatId]: { ...(p[seatId] || {}), seatNumber: seatId, name: e.target.value, age: p[seatId]?.age || 22, gender: p[seatId]?.gender || "male" },
                  }))
                }
              />
              <input
                placeholder="Age"
                type="number"
                className="rounded border border-gray-300 px-1.5 py-1 text-[11px]"
                value={passengers[seatId]?.age ?? ""}
                onChange={(e) =>
                  setPassengers((p) => ({
                    ...p,
                    [seatId]: { ...(p[seatId] || { seatNumber: seatId, name: "", age: 22, gender: "male" }), age: Number(e.target.value) || 0 },
                  }))
                }
              />
              <select
                className="rounded border border-gray-300 px-1.5 py-1 text-[11px]"
                value={passengers[seatId]?.gender || "male"}
                onChange={(e) =>
                  setPassengers((p) => ({
                    ...p,
                    [seatId]: { ...(p[seatId] || { seatNumber: seatId, name: "", age: 22, gender: "male" }), gender: e.target.value },
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
      )}

      {booking.status === "error" && (
        <p className="mt-1 text-[11px] text-red-600">{booking.message}</p>
      )}

      <button
        onClick={handleBookNow}
        disabled={booking.status === "loading"}
        className="mt-2 w-full rounded-lg bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {booking.status === "loading" ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
}
