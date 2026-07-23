import { X } from "lucide-react";

export function CancelFlightScheduleModal({ schedule, onClose, onConfirm }) {
  if (!schedule) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Cancel Flight Schedule</h3>
          <p className="text-sm text-slate-600 mb-6">
            Are you sure you want to cancel this flight schedule? All confirmed bookings will be automatically refunded in full. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">
              Keep Schedule
            </button>
            <button onClick={() => onConfirm(schedule._id)}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
              Cancel Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CancelBusScheduleModal({ schedule, onClose, onConfirm }) {
  if (!schedule) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Cancel Bus Schedule</h3>
          <p className="text-sm text-slate-600 mb-6">
            Are you sure you want to cancel this bus schedule for <strong>{schedule.busId?.busName || "this bus"}</strong>? All confirmed bookings will be automatically refunded in full. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">
              Keep Schedule
            </button>
            <button onClick={() => onConfirm(schedule._id)}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
              Cancel Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
