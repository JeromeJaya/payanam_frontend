import { useNavigate } from "react-router-dom";

export default function SeatMap({ selectedSeats, handleSeatClick, colLabels, leftCols, rightCols, allCols, seatsByRow }) {
  const navigate = useNavigate();
  const renderSeat = (label, rowSeats, rowNum) => {
    const orig = allCols[colLabels.indexOf(label)];
    const seatMap = {};
    rowSeats.forEach(s => { seatMap[String(s.column)] = s; });
    const seat = seatMap[String(orig)];
    if (!seat) return <div key={`empty-${rowNum}-${label}`} className="w-10 h-10" />;
    return (
      <button
        key={seat.seatNumber}
        onClick={() => handleSeatClick(seat)}
        disabled={seat.status !== "AVAILABLE"}
        className={`w-10 h-10 rounded-lg border-2 text-xs font-bold transition-all ${
          seat.status === "BOOKED" ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' :
          seat.status === "BLOCKED" ? 'bg-yellow-100 border-yellow-300 text-yellow-600 cursor-not-allowed' :
          selectedSeats.find(s => s.seatNumber === seat.seatNumber) ? 'bg-blue-500 border-blue-600 text-white shadow-md' :
          seat.isExtraLegroom ? 'bg-orange-50 border-orange-400 text-orange-700 hover:bg-orange-100 hover:shadow-md cursor-pointer' :
          'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md cursor-pointer'
        }`}
        title={seat.seatNumber}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex justify-center mb-2">
        <div className="flex items-center gap-1">
          {leftCols.map(letter => (
            <div key={letter} className="w-10 text-center text-xs font-bold text-gray-400 uppercase">{letter}</div>
          ))}
          <div className="w-12" />
          {rightCols.map(letter => (
            <div key={letter} className="w-10 text-center text-xs font-bold text-gray-400 uppercase">{letter}</div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-block">
          <div className="border-2 border-gray-300 rounded-[60px] px-6 sm:px-8 pt-0 pb-4 bg-gradient-to-b from-gray-50 to-white shadow-inner">
            <div className="flex justify-center -mx-6 sm:-mx-8">
              <div className="w-full h-28 sm:h-32 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 rounded-t-[80px] border-b-2 border-blue-600 flex flex-col items-center justify-end pb-3 relative overflow-hidden">
                <div className="absolute inset-x-0 top-4 flex justify-center gap-6 sm:gap-10">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/20 border border-white/30" />
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/20 border border-white/30" />
                </div>
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>

            <div className="space-y-1.5 mt-4">
              {Object.keys(seatsByRow).sort((a, b) => parseInt(a) - parseInt(b)).map(rowNum => {
                const rowSeats = seatsByRow[rowNum];
                return (
                  <div key={rowNum} className="flex items-center gap-1">
                    <div className="flex gap-1">
                      {leftCols.map(label => renderSeat(label, rowSeats, rowNum))}
                    </div>
                    <div className="w-10 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-gray-400">{rowNum}</span>
                    </div>
                    <div className="flex gap-1">
                      {rightCols.map(label => renderSeat(label, rowSeats, rowNum))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative mt-4 -mx-6 sm:-mx-8">
              <div className="flex justify-center">
                <div className="w-20 sm:w-28 h-2 bg-gradient-to-r from-transparent via-blue-400 to-blue-500 rounded-l-full -mr-1" />
                <div className="w-20 sm:w-28 h-2 bg-gradient-to-l from-transparent via-blue-400 to-blue-500 rounded-r-full -ml-1" />
              </div>
              <div className="flex flex-col items-center -mt-1">
                <div className="relative">
                  <div className="w-0 h-0 border-l-[28px] sm:border-l-[36px] border-r-[28px] sm:border-r-[36px] border-b-[44px] sm:border-b-[56px] border-l-transparent border-r-transparent border-b-blue-600" />
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-full border border-white/30 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-full h-14 sm:h-16 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 rounded-b-[60px] flex items-center justify-center gap-4 sm:gap-6">
                  <div className="w-2 h-2 rounded-full bg-red-400 border border-red-500 shadow-[0_0_4px_rgba(248,113,113,0.8)]" />
                  <div className="w-2 h-2 rounded-full bg-red-400 border border-red-500 shadow-[0_0_4px_rgba(248,113,113,0.8)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded border-2 border-gray-300" />
          <span className="text-xs text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded border-2 border-blue-600" />
          <span className="text-xs text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded border-2 border-gray-300" />
          <span className="text-xs text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-50 rounded border-2 border-orange-400" />
          <span className="text-xs text-gray-600">Extra Legroom</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-semibold text-sm">
            Get FREE SEAT using VISA Signature Credit card. Discount will be automatically applied on payments page.
          </span>
        </div>
        <button
          onClick={() => navigate('/terms-conditions')}
          className="text-blue-600 text-sm font-bold hover:text-blue-700 whitespace-nowrap"
        >
          View T&C
        </button>
      </div>
    </div>
  );
}
