export default function SelectedMealsSummary({ selectedMeals }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Selected Meals
      </h2>
      <div className="space-y-2">
        {Object.entries(selectedMeals).map(([seatNumber, meal]) => (
          <div key={seatNumber} className="flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 rounded-lg px-4 py-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Seat {seatNumber}</span>
              <span className="text-sm text-gray-600 dark:text-slate-400">{meal.name}</span>
            </div>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">+₹{meal.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
