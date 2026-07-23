import { User } from "lucide-react";

export default function PassengerForm({
  passenger,
  index,
  errors,
  selectedMeals,
  onUpdate,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <User size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-slate-100">
              Passenger {index + 1}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Seat: <span className="font-bold text-blue-600 dark:text-blue-400">{passenger.seatNumber}</span>
            </p>
            {selectedMeals?.[passenger.seatNumber] && (
              <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                Meal: {selectedMeals[passenger.seatNumber].name}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
            ₹{passenger.seatFare.toLocaleString()}
          </span>
          {selectedMeals?.[passenger.seatNumber] && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              + ₹{selectedMeals[passenger.seatNumber].price} (meal)
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            value={passenger.name}
            onChange={(e) => onUpdate(index, "name", e.target.value)}
            placeholder="Enter full name"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors?.name
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-slate-600"
            } bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
          />
          {errors?.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Age *
          </label>
          <input
            type="number"
            value={passenger.age}
            onChange={(e) => onUpdate(index, "age", e.target.value)}
            placeholder="Age"
            min="1"
            max="120"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors?.age
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-slate-600"
            } bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
          />
          {errors?.age && (
            <p className="mt-1 text-xs text-red-500">{errors.age}</p>
          )}
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Gender *
          </label>
          <div className="flex gap-4">
            {["male", "female", "other"].map((gender) => (
              <label
                key={gender}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                  passenger.gender === gender
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                    : "border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500"
                }`}
              >
                <input
                  type="radio"
                  name={`gender-${index}`}
                  value={gender}
                  checked={passenger.gender === gender}
                  onChange={(e) => onUpdate(index, "gender", e.target.value)}
                  className="sr-only"
                />
                <span className={`text-sm font-medium capitalize ${
                  passenger.gender === gender
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-slate-300"
                }`}>
                  {gender}
                </span>
              </label>
            ))}
          </div>
          {errors?.gender && (
            <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
          )}
        </div>
      </div>
    </div>
  );
}
