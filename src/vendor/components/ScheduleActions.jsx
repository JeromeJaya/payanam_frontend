export default function ScheduleActions({ setShowScheduleForm, scheduleLoading }) {
  return (
    <div className="flex gap-3">
      <button type="button" onClick={() => setShowScheduleForm(false)}
        className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
      <button type="submit" disabled={scheduleLoading}
        className="flex-1 px-4 py-3 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors">
        {scheduleLoading ? "Creating..." : "Create Schedule"}
      </button>
    </div>
  );
}
