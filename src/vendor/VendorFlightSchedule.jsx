import React from "react";
import { ArrowLeft, Plane, Calendar, Plus, X } from "lucide-react";

export default function VendorFlightSchedule({
  flightSchedules,
  flightSchedulesLoading,
  showFlightScheduleForm,
  setShowFlightScheduleForm,
  onFetchFlightSchedules,
  onCancelSchedule,
  onBack,
}) {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Schedule Flight Trip</h3>
          <p className="text-sm text-slate-500">Create and manage flight schedules</p>
        </div>
        <button
          onClick={() => setShowFlightScheduleForm(true)}
          className="ml-auto flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Schedule
        </button>
      </div>

      {/* Flight Schedules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-slate-900">Your Flight Schedules</h4>
          <button onClick={onFetchFlightSchedules} className="text-sm font-bold text-sky-600 hover:text-sky-700">Refresh</button>
        </div>

        {flightSchedulesLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-slate-600">Loading schedules...</p>
          </div>
        ) : flightSchedules.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Schedules Yet</h3>
            <p className="text-sm text-slate-600 mb-4">Create your first flight schedule to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flightSchedules.map((schedule) => (
              <div key={schedule._id} className="border border-slate-200 rounded-xl p-6 hover:border-sky-500 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                      <Plane className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {schedule.flight?.airlineName || "Flight"} - {schedule.flightNumber}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {schedule.route?.source?.city} → {schedule.route?.destination?.city}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    schedule.status === "SCHEDULED" ? "bg-green-100 text-green-700"
                    : schedule.status === "CANCELLED" ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-600"
                  }`}>
                    {schedule.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Departure:</span>
                      <span className="font-bold text-slate-900">
                        {new Date(schedule.departureDate).toLocaleDateString('en-IN')} at {schedule.departureTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Arrival:</span>
                      <span className="font-bold text-slate-900">
                        {new Date(schedule.arrivalDate).toLocaleDateString('en-IN')} at {schedule.arrivalTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Base Fare:</span>
                      <span className="font-bold text-slate-900">₹{schedule.baseFare?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Departure Terminal:</span>
                      <span className="font-bold text-slate-900">{schedule.departureTerminal}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Arrival Terminal:</span>
                      <span className="font-bold text-slate-900">{schedule.arrivalTerminal}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Meal Options:</span>
                      <span className="font-bold text-slate-900">{(schedule.mealOptions || []).join(", ")}</span>
                    </div>
                  </div>
                </div>

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
    </>
  );
}
