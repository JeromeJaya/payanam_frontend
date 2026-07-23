import { Calendar, Bus, X } from "lucide-react";

export default function ScheduleList({
  busSchedules,
  busSchedulesLoading,
  onFetchBusSchedules,
  onCancelSchedule,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-slate-900">Your Bus Schedules</h4>
        <button onClick={onFetchBusSchedules} className="text-sm font-bold text-lime-600 hover:text-lime-700">Refresh</button>
      </div>

      {busSchedulesLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-600">Loading schedules...</p>
        </div>
      ) : busSchedules.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Schedules Yet</h3>
          <p className="text-sm text-slate-600 mb-4">Create your first bus schedule to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {busSchedules.map((schedule) => (
            <div key={schedule._id} className="border border-slate-200 rounded-xl p-6 hover:border-lime-500 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {schedule.busId?.busName || "Bus"} ({schedule.busId?.busNumber || ""})
                    </h4>
                    <p className="text-xs text-slate-500">
                      {schedule.routeId?.source?.city} → {schedule.routeId?.destination?.city}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  schedule.status === "SCHEDULED" ? "bg-green-100 text-green-700"
                  : schedule.status === "CANCELLED" ? "bg-red-100 text-red-700"
                  : schedule.status === "COMPLETED" ? "bg-blue-100 text-blue-700"
                  : schedule.status === "IN_TRANSIT" ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600"
                }`}>
                  {schedule.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Bus Type:</span>
                    <span className="font-bold text-slate-900">{schedule.busId?.busType?.replace(/_/g, " ") || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Departure:</span>
                    <span className="font-bold text-slate-900">
                      {new Date(schedule.departureDate).toLocaleDateString('en-IN')} at {schedule.departureTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Arrival:</span>
                    <span className="font-bold text-slate-900">{schedule.arrivalTime}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Base Fare:</span>
                    <span className="font-bold text-slate-900">₹{schedule.baseFare?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Available Seats:</span>
                    <span className="font-bold text-slate-900">{schedule.availableSeats ?? "—"}</span>
                  </div>
                </div>
              </div>

              {((schedule.boardingPoints && schedule.boardingPoints.length > 0) || (schedule.droppingPoints && schedule.droppingPoints.length > 0)) && (
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {schedule.boardingPoints && schedule.boardingPoints.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">Boarding Points</p>
                      {schedule.boardingPoints.map((bp, idx) => (
                        <p key={idx} className="text-xs text-slate-700">{bp.name}, {bp.city} {bp.time ? `(${bp.time})` : ""}</p>
                      ))}
                    </div>
                  )}
                  {schedule.droppingPoints && schedule.droppingPoints.length > 0 && (
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-orange-700 mb-1">Dropping Points</p>
                      {schedule.droppingPoints.map((dp, idx) => (
                        <p key={idx} className="text-xs text-slate-700">{dp.name}, {dp.city} {dp.time ? `(${dp.time})` : ""}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {schedule.cancellationPolicy && schedule.cancellationPolicy.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Cancellation Policy</p>
                  <div className="space-y-1">
                    {schedule.cancellationPolicy.map((policy, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{policy.hoursBeforeDeparture}h before departure</span>
                        <span className="font-bold text-slate-900">{policy.refundPercentage}% refund</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {schedule.status === "SCHEDULED" && (
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onCancelSchedule(schedule)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel Schedule
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
