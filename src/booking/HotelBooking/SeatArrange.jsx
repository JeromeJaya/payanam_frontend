import { useState, useEffect } from "react";

function buildGrid(seats, seatLayoutType) {
  if (!Array.isArray(seats) || seats.length === 0)
    return { columns: 3, grid: [] };
  const typeColMap = {
    "2+1_SLEEPER": 3, "2+2_SEATER": 4,
    "1+1_SLEEPER": 2, "2+1_SEATER": 3,
  };
  let columns = typeColMap[seatLayoutType] || 3;
  const maxCol = Math.max(...seats.map((s) => s.column || 0));
  if (maxCol > 0) columns = maxCol;
  const rowMap = {};
  seats.forEach((seat) => {
    const r = seat.row || 1;
    if (!rowMap[r]) rowMap[r] = [];
    rowMap[r].push(seat);
  });
  const sortedRows = Object.keys(rowMap)
    .sort((a, b) => Number(a) - Number(b))
    .map((r) => rowMap[r].sort((a, b) => (a.column || 0) - (b.column || 0)));
  return { columns, grid: sortedRows };
}

function getSeatSize(columns) {
  if (columns >= 4) return { w: 22, h: 40, sleeperH: 50, gap: 1, rowGap: 3, price: "text-[9px]" };
  if (columns === 3) return { w: 30, h: 46, sleeperH: 56, gap: 2, rowGap: 4, price: "text-[10px]" };
  return { w: 40, h: 52, sleeperH: 62, gap: 3, rowGap: 5, price: "text-[11px]" };
}

function mapStatus(seat) {
  if (seat.status === "AVAILABLE") return "available";
  if (seat.status === "BOOKED")
    return seat.passengerGender === "F" ? "female_booked" : "male_booked";
  return "BLOCKED";
}

const PersonIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const SteeringWheel = () => (
  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
    <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
  </svg>
);

export default function BusSeatLayout({ busName = "Bus", seats = [], seatLayoutType, onChange }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { columns, grid } = buildGrid(seats, seatLayoutType);
  const size = getSeatSize(columns);

  const uniqueSeats = Array.from(new Map(seats.map(s => [s.seatNumber, s])).values());

  const seatMap = {};
  uniqueSeats.forEach((s) => {
    seatMap[s.seatNumber] = {
      id: s.seatNumber,
      type: s.isSleeper ? "L" : "S",
      price: s.fare,
      status: mapStatus(s),
      gender: s.passengerGender === "F" ? "female" : s.passengerGender === "M" ? "male" : null,
      row: s.row, column: s.column,
    };
  });

  const handleSeatClick = (seat) => {
    if (seat.status === "male_booked" || seat.status === "female_booked") return;
    setSelectedSeats((prev) =>
      prev.includes(seat.id) ? prev.filter((id) => id !== seat.id) : [...prev, seat.id]
    );
  };

  useEffect(() => {
    const selectedDetails = uniqueSeats.filter((s) => selectedSeats.includes(s.seatNumber));
    const total = selectedDetails.reduce((sum, s) => sum + (s.fare || 0), 0);
    if (typeof onChange === "function") onChange({ busName, seats: [...selectedSeats], total });
  }, [selectedSeats]);

  if (!seats.length) {
    return <div className="flex items-center justify-center h-60 text-gray-400 text-sm">No seats available</div>;
  }

  // Calculate grid dynamic layout width to keep the steering wheel aligned with the layout
  const gridWidth = (columns * size.w) + ((columns - 1) * (size.gap + 35));

  return (
    <div className="flex flex-col items-center bg-gray-100 rounded-3xl shadow-3xl p-4 h-175 overflow-y-auto w-full">
      
      {/* Bus Shell Container: Kept dead center using mx-auto */}
      <div className="flex flex-col items-center mx-auto" style={{ width: `${gridWidth}px` }}>
        
        {/* Bus Name Header */}
        <div className="mb-3 text-center">
          <h2 className="text-xs font-bold text-gray-700">{busName}</h2>
        </div>
        
        {/* Steering Wheel - Aligned left relative to the layout width */}
        <div className="flex justify-start w-full mb-4">
          <SteeringWheel />
        </div>
        
        {/* Center-aligned rows list wrapper */}
        <div className="flex flex-col gap-2 w-full">
          {grid.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className="grid items-center justify-center" // added justify-center
              style={{ gap: `${size.gap+35}px`, gridTemplateColumns: `repeat(${columns}, ${size.w}px)` }}
            >
              {(() => {
                const rowByCol = {};
                row.forEach((seat) => { rowByCol[seat.column || 1] = seat; });
                return Array.from({ length: columns }, (_, colIdx) => {
                  const col = colIdx + 1;
                  const apiSeat = rowByCol[col];
                  if (!apiSeat) return <div key={`e-${col}`} className="rounded" style={{ width: size.w, height: size.sleeperH }} />;
                  const mapped = seatMap[apiSeat.seatNumber];
                  if (!mapped) return <div key={`x-${col}`} className="rounded" style={{ width: size.w, height: size.sleeperH }} />;

                  const isSelected = selectedSeats.includes(mapped.id);
                  const isMale = mapped.status === "male_booked";
                  const isFemale = mapped.status === "female_booked";

                  let cardStyles = "border border-gray-200 bg-gray-50/30 text-gray-400";
                  let iconStyles = "text-gray-300";
                  if (isSelected) {
                    cardStyles = "border-2 border-blue-500 bg-blue-50/20 text-blue-600";
                    iconStyles = "text-blue-500";
                  } else if (isMale) {
                    cardStyles = "border border-gray-200 bg-gray-50 text-gray-300 opacity-60 cursor-not-allowed";
                    iconStyles = "text-gray-300";
                  } else if (isFemale) {
                    cardStyles = "border border-purple-300 bg-purple-50/10 text-purple-400 cursor-not-allowed";
                    iconStyles = "text-purple-400";
                  }

                  return (
                    <div key={mapped.id}
                      className="flex flex-col gap-0 items-center justify-between cursor-pointer group transition-all select-none"
                      onClick={() => handleSeatClick(mapped)}>
                      {mapped.type === "L" ? (
                        <div className={"rounded flex flex-col items-center justify-between p-1 relative shadow-sm " + cardStyles}
                          style={{ width: size.w, height: size.sleeperH }}>
                          <PersonIcon className={"mt-0.5 " + iconStyles} style={{ width: size.w - 8, height: size.w - 8 }} />
                          <div className={"rounded-full bg-current opacity-40"} style={{ width: size.w - 10, height: 2 }} />
                        </div>
                      ) : (
                        <div className={"rounded-xl flex items-center justify-center p-0.5 relative shadow-sm border-2 " + cardStyles}
                          style={{ width: size.w, height: size.h }}>
                          <div className="w-full h-full border border-dashed border-gray-300/60 rounded-md flex items-center justify-center">
                            <PersonIcon className={iconStyles} style={{ width: size.w - 10, height: size.w - 10 }} />
                          </div>
                        </div>
                      )}
                      <span className={"mt-1 font-medium transition-colors " + size.price + (isSelected ? " text-black font-bold" : " text-gray-400") + (isFemale ? " text-black font-semibold" : "")}>
                        ₹{mapped.price}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}