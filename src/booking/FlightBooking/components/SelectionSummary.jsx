export default function SelectionSummary({ selectedSeats, selectedMeals, blockingSeats, blockError, handleContinue, getSeatPrice }) {
  return (
    <div className="bg-white rounded-xl shadow-md sticky bottom-4 border border-gray-100">
      {blockError && (
        <div className="rounded-t-xl bg-red-50 border-b border-red-200 px-6 py-3 text-sm text-red-600 font-medium flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {blockError}
        </div>
      )}
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {selectedSeats.length > 0 ? `${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''} Selected` : "No seats selected"}
              </span>
            </div>
            {selectedSeats.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map(seat => {
                  const seatMeal = selectedMeals[seat.seatNumber];
                  return (
                    <span key={seat.seatNumber} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {seat.seatNumber}
                      <span className="text-blue-400">₹{getSeatPrice(seat)}</span>
                      {seatMeal && <span className="text-green-500 ml-0.5">+₹{seatMeal.price}</span>}
                    </span>
                  );
                })}
              </div>
            )}
            {Object.keys(selectedMeals).length > 0 && (
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Meals Total: ₹{Object.values(selectedMeals).reduce((sum, m) => sum + m.price, 0)}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {selectedSeats.length > 0 && (
              <div className="text-right order-2 sm:order-1">
                <p className="text-xs text-gray-500">Subtotal</p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{selectedSeats.reduce((sum, s) => sum + getSeatPrice(s), 0) + Object.values(selectedMeals).reduce((sum, m) => sum + m.price, 0)}
                </p>
              </div>
            )}
            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0 || blockingSeats}
              className="order-1 sm:order-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:shadow-none"
            >
              {blockingSeats ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Reserving...
                </>
              ) : (
                <>
                  CONTINUE
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
