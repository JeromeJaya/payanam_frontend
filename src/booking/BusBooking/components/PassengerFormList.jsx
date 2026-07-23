import { User, Calendar } from "lucide-react";

export default function PassengerFormList({ seats, passengers, setPassengers }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/30 p-6 animate-fadeInUp" style={{ animationDelay: "200ms" }}>
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <User size={20} className="text-lime-600 dark:text-lime-400" />
        Passenger Details
      </h2>

      <div className="space-y-4">
        {seats.map((seatId, index) => (
          <div
            key={seatId}
            className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 animate-fadeInUp hover:shadow-md transition-shadow"
            style={{ animationDelay: `${300 + index * 100}ms` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-lime-100 dark:bg-lime-900/40 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-sm font-bold text-lime-700 dark:text-lime-300">{index + 1}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Seat {seatId}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter passenger name"
                    value={passengers[seatId]?.name || ""}
                    onChange={(e) => {
                      setPassengers(p => ({
                        ...p,
                        [seatId]: { ...p[seatId], seatNumber: seatId, name: e.target.value, gender: p[seatId]?.gender || "male", age: p[seatId]?.age || "" }
                      }));
                    }}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Age
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="number"
                    placeholder="Age"
                    min="1"
                    max="120"
                    value={passengers[seatId]?.age || ""}
                    onChange={(e) => {
                      setPassengers(p => ({
                        ...p,
                        [seatId]: { ...p[seatId], age: Number(e.target.value) }
                      }));
                    }}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Gender
                </label>
                <select
                  value={passengers[seatId]?.gender || "male"}
                  onChange={(e) => {
                    setPassengers(p => ({
                      ...p,
                      [seatId]: { ...p[seatId], gender: e.target.value }
                    }));
                  }}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
