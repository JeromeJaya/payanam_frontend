import { X } from "lucide-react";

export default function RouteHeader({ onClose }) {
  return (
    <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-900">Create New Route</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <X className="w-5 h-5 text-slate-600" />
      </button>
    </div>
  );
}
