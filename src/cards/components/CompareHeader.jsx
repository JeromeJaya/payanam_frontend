import { ArrowLeftRight, Trash2, ChevronDown, ChevronUp, GripHorizontal } from "lucide-react";

export default function CompareHeader({
  comparedFlights,
  isExpanded,
  onClearAll,
  onPointerDown,
  handleHeaderClick,
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onClick={handleHeaderClick}
    >
      <div className="flex items-center gap-2.5">
        <GripHorizontal size={14} className="text-white/40 shrink-0" />
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <ArrowLeftRight size={14} className="text-white" />
        </div>
        <div>
          <span className="text-white font-bold text-sm">{comparedFlights.length} Flight{comparedFlights.length > 1 ? 's' : ''} to compare</span>
          <span className="text-blue-200 text-xs ml-2">(max 4)</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {comparedFlights.length > 1 && (
          <button
            onClick={onClearAll}
            className="p-2 rounded-lg text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Clear all"
          >
            <Trash2 size={14} />
          </button>
        )}
        <button
          className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
    </div>
  );
}
