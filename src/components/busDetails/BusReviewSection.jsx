function buildSeatGrid(seats, seatLayoutType) {
  if (!Array.isArray(seats) || seats.length === 0) return { columns: 3, grid: [] };
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

const SteeringWheel = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
    <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
  </svg>
);

function SeatLayoutPreview({ seats, seatLayoutType }) {
  if (!seats || seats.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-slate-400">
        No seat layout defined
      </div>
    );
  }

  const lowerSeats = seats.filter(s => s.deck === "lower");
  const upperSeats = seats.filter(s => s.deck === "upper");

  const renderDeck = (deckSeats, deckLabel) => {
    if (deckSeats.length === 0) return null;
    const { columns, grid } = buildSeatGrid(deckSeats, seatLayoutType);

    return (
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{deckLabel}</p>
        <div className="bg-slate-100 rounded-xl p-3">
          {deckLabel !== "Upper Deck" && <div className="flex justify-start mb-2"><SteeringWheel /></div>}
          <div className="flex flex-col gap-2">
            {grid.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid items-center"
                style={{ gap: "6px", gridTemplateColumns: `repeat(${columns}, 52px)` }}
              >
                {(() => {
                  const rowByCol = {};
                  row.forEach((seat) => { rowByCol[seat.column || 1] = seat; });
                  return Array.from({ length: columns }, (_, colIdx) => {
                    const col = colIdx + 1;
                    const seat = rowByCol[col];
                    if (!seat) {
                      return <div key={`empty-${col}`} style={{ width: 52, height: 44 }} />;
                    }

                    const isSleeper = seat.isSleeper;
                    const seatTypeLabel = seat.seatType === "window" ? "W" : seat.seatType === "aisle" ? "A" : "M";

                    return (
                      <div
                        key={seat.seatNumber}
                        className={`rounded-lg flex flex-col items-center justify-center p-1 border-2 transition-all ${
                          isSleeper
                            ? "border-indigo-300 bg-indigo-50"
                            : "border-lime-300 bg-lime-50"
                        }`}
                        style={{ width: 52, height: isSleeper ? 52 : 44 }}
                        title={`${seat.seatNumber} — ${seat.seatType} (${seat.deck}) — ₹${seat.fare || 0}`}
                      >
                        <span className="text-[10px] font-black text-slate-800 leading-tight">{seat.seatNumber}</span>
                        <span className={`text-[8px] font-bold leading-tight ${isSleeper ? "text-indigo-500" : "text-lime-600"}`}>
                          {isSleeper ? "SL" : "ST"} · {seatTypeLabel}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-500 leading-tight">₹{seat.fare || 0}</span>
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
  };

  return (
    <div>
      {renderDeck(lowerSeats, "Lower Deck")}
      {renderDeck(upperSeats, "Upper Deck")}
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border-2 border-lime-300 bg-lime-50"></div>
          <span className="text-[10px] font-semibold text-slate-500">Seater</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border-2 border-indigo-300 bg-indigo-50"></div>
          <span className="text-[10px] font-semibold text-slate-500">Sleeper</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400">W = Window · A = Aisle · M = Middle</span>
        </div>
      </div>
    </div>
  );
}

export default function BusReviewSection({ bus, showSeatLayout, setShowSeatLayout, onClose }) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-900">Seat Layout Map</h4>
          <button
            onClick={() => setShowSeatLayout(!showSeatLayout)}
            className="text-xs font-bold text-lime-600 hover:text-lime-700 transition-colors"
          >
            {showSeatLayout ? "Hide Layout" : "Show Layout"}
          </button>
        </div>
        {showSeatLayout && (
          <SeatLayoutPreview seats={bus.seatLayout} seatLayoutType={bus.seatLayoutType} />
        )}
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-400">
        <span>Created: {bus.createdAt ? new Date(bus.createdAt).toLocaleDateString() : "—"}</span>
        <span>Updated: {bus.updatedAt ? new Date(bus.updatedAt).toLocaleDateString() : "—"}</span>
      </div>

      <button
        onClick={onClose}
        className="w-full px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-lg transition-colors"
      >
        Close
      </button>
    </>
  );
}
