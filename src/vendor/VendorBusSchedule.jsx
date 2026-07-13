import React from "react";
import { ArrowLeft, Bus, Calendar, Plus, X } from "lucide-react";

export default function VendorBusSchedule({
  busSchedules,
  busSchedulesLoading,
  buses,
  busRoutes,
  busRoutesLoading,
  showScheduleForm,
  setShowScheduleForm,
  scheduleFormData,
  setScheduleFormData,
  scheduleLoading,
  scheduleSuccess,
  scheduleError,
  onFetchBusSchedules,
  onFetchBusRoutes,
  onScheduleSubmit,
  onCancelSchedule,
  onBack,
}) {
  const addBoardingPoint = () => {
    setScheduleFormData(prev => ({
      ...prev,
      boardingPoints: [...prev.boardingPoints, { city: "", name: "", address: "", time: "", landmark: "" }]
    }));
  };

  const addDroppingPoint = () => {
    setScheduleFormData(prev => ({
      ...prev,
      droppingPoints: [...prev.droppingPoints, { city: "", name: "", address: "", time: "", landmark: "" }]
    }));
  };

  const updateBoardingPoint = (index, field, value) => {
    setScheduleFormData(prev => ({
      ...prev,
      boardingPoints: prev.boardingPoints.map((point, i) => i === index ? { ...point, [field]: value } : point)
    }));
  };

  const updateDroppingPoint = (index, field, value) => {
    setScheduleFormData(prev => ({
      ...prev,
      droppingPoints: prev.droppingPoints.map((point, i) => i === index ? { ...point, [field]: value } : point)
    }));
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Schedule Bus Trip</h3>
          <p className="text-sm text-slate-500">Create and manage bus schedules</p>
        </div>
        <button
          onClick={() => setShowScheduleForm(true)}
          className="ml-auto flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Schedule
        </button>
      </div>

      {/* Bus Schedules List */}
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

      {showScheduleForm && (
        <form onSubmit={onScheduleSubmit} className="space-y-6">
          {scheduleSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{scheduleSuccess}</div>}
          {scheduleError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{scheduleError}</div>}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Bus *</label>
              <select
                value={scheduleFormData.busId}
                onChange={(e) => {
                  const busId = e.target.value;
                  setScheduleFormData({ ...scheduleFormData, busId, routeId: "" });
                  onFetchBusRoutes(busId);
                }}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                required
              >
                <option value="">Choose a bus...</option>
                {buses.filter(b => b.status === "ACTIVE").map(bus => (
                  <option key={bus._id} value={bus._id}>{bus.busName} ({bus.busNumber})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Route *</label>
              <select
                value={scheduleFormData.routeId}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, routeId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                required disabled={!scheduleFormData.busId || busRoutesLoading}
              >
                <option value="">Choose a route...</option>
                {busRoutes.map(route => (
                  <option key={route._id} value={route._id}>{route.source.city} -- {route.destination.city}</option>
                ))}
              </select>
              {busRoutesLoading && <p className="text-xs text-slate-500 mt-1">Loading routes...</p>}
              {!scheduleFormData.busId && <p className="text-xs text-amber-600 mt-1">Please select a bus first</p>}
              {scheduleFormData.busId && !busRoutesLoading && busRoutes.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">No routes available. Create routes in the Routes tab first.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Departure Date *</label>
              <input type="date" value={scheduleFormData.departureDate}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, departureDate: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Departure Time *</label>
              <input type="time" value={scheduleFormData.departureTime}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, departureTime: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Arrival Time *</label>
              <input type="time" value={scheduleFormData.arrivalTime}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, arrivalTime: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Base Fare (₹) *</label>
              <input type="number" value={scheduleFormData.baseFare}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, baseFare: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                required min="0" step="0.01" />
            </div>
          </div>

          {/* Boarding Points */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-slate-700">Boarding Points</label>
              <button type="button" onClick={addBoardingPoint} className="text-xs font-bold text-lime-600 hover:text-lime-700">+ Add Point</button>
            </div>
            {scheduleFormData.boardingPoints.map((point, index) => (
              <div key={index} className="grid md:grid-cols-5 gap-2 mb-2 p-3 bg-slate-50 rounded-lg">
                <input type="text" placeholder="City" value={point.city} onChange={(e) => updateBoardingPoint(index, "city", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
                <input type="text" placeholder="Name" value={point.name} onChange={(e) => updateBoardingPoint(index, "name", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
                <input type="text" placeholder="Time (HH:mm)" value={point.time} onChange={(e) => updateBoardingPoint(index, "time", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
                <input type="text" placeholder="Address" value={point.address} onChange={(e) => updateBoardingPoint(index, "address", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
                <input type="text" placeholder="Landmark" value={point.landmark} onChange={(e) => updateBoardingPoint(index, "landmark", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
              </div>
            ))}
          </div>

          {/* Dropping Points */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-slate-700">Dropping Points</label>
              <button type="button" onClick={addDroppingPoint} className="text-xs font-bold text-lime-600 hover:text-lime-700">+ Add Point</button>
            </div>
            {scheduleFormData.droppingPoints.map((point, index) => (
              <div key={index} className="grid md:grid-cols-5 gap-2 mb-2 p-3 bg-slate-50 rounded-lg">
                <input type="text" placeholder="City" value={point.city} onChange={(e) => updateDroppingPoint(index, "city", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
                <input type="text" placeholder="Name" value={point.name} onChange={(e) => updateDroppingPoint(index, "name", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
                <input type="text" placeholder="Time (HH:mm)" value={point.time} onChange={(e) => updateDroppingPoint(index, "time", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
                <input type="text" placeholder="Address" value={point.address} onChange={(e) => updateDroppingPoint(index, "address", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
                <input type="text" placeholder="Landmark" value={point.landmark} onChange={(e) => updateDroppingPoint(index, "landmark", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-lime-400" />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setShowScheduleForm(false)}
              className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={scheduleLoading}
              className="flex-1 px-4 py-3 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors">
              {scheduleLoading ? "Creating..." : "Create Schedule"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
