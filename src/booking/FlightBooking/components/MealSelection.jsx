import MEAL_MENU from "../data/mealMenu";

export default function MealSelection({ selectedSeats, selectedMeals, setSelectedMeals, mealTypeFilter, setMealTypeFilter, colLabels, colIndexMap }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Select Meals & Beverages</h3>
      <p className="text-sm text-gray-600 mb-6">
        Choose meals and drinks for each passenger. Prices will be added to your total.
      </p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: "all", label: "All", icon: "📋" },
          ...Object.entries(MEAL_MENU).map(([key, val]) => ({
            id: key,
            label: val.label,
            icon: val.icon,
          })),
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setMealTypeFilter(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              mealTypeFilter === id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {selectedSeats.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 font-medium">Please select seats first before choosing meals.</p>
          <p className="text-sm text-gray-400 mt-1">Switch to the Seats tab to select your seats.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedSeats.map((seat) => {
            const seatMeal = selectedMeals[seat.seatNumber] || null;
            return (
              <div key={seat.seatNumber} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                      {(colLabels[colIndexMap[String(seat.column)]] || seat.column)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Seat {seat.seatNumber}</p>
                      <p className="text-xs text-gray-500">Passenger {selectedSeats.indexOf(seat) + 1}</p>
                    </div>
                  </div>
                  {seatMeal && (
                    <span className="text-sm font-bold text-green-600">
                      +₹{seatMeal.price}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(MEAL_MENU)
                    .filter(([key]) => mealTypeFilter === "all" || mealTypeFilter === key)
                    .map(([category, categoryData]) => (
                      <div key={category}>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <span>{categoryData.icon}</span>
                          {categoryData.label}
                        </p>
                        <div className="space-y-1">
                          {categoryData.dishes.map((dish) => {
                            const isSelected = seatMeal?.id === dish.id;
                            return (
                              <button
                                key={dish.id}
                                onClick={() => {
                                  setSelectedMeals(prev => {
                                    if (isSelected) {
                                      const next = { ...prev };
                                      delete next[seat.seatNumber];
                                      return next;
                                    }
                                    return { ...prev, [seat.seatNumber]: { ...dish, category } };
                                  });
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-colors ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <span className="font-medium">{dish.name}</span>
                                <span className={`text-xs font-bold ${isSelected ? "text-blue-600" : "text-gray-500"}`}>
                                  ₹{dish.price}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
