export default function FormActions({ loading, onClose, disabled }) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading || disabled}
        className="flex-1 px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Route..." : "Create Route"}
      </button>
    </div>
  );
}
