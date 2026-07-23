import { User } from "lucide-react";

export default function CheckoutPassengerForm({ passengers }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <User size={20} className="text-lime-600" />
        Passenger Details
      </h2>
      <div className="space-y-3">
        {passengers.map((passenger, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-lime-700">{index + 1}</span>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Name</p>
                <p className="text-sm font-semibold text-slate-900">{passenger.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Age</p>
                <p className="text-sm font-semibold text-slate-900">{passenger.age} yrs</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Gender</p>
                <p className="text-sm font-semibold text-slate-900 capitalize">{passenger.gender}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Seat</p>
              <p className="text-sm font-bold text-slate-900">{passenger.seatNumber}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
