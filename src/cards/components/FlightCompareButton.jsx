import { Plus, Check } from "lucide-react";

export default function FlightCompareButton({ isCompared, onAddToCompare, onRemoveFromCompare }) {
  return (
    <button
      onClick={() => {
        if (isCompared) {
          onRemoveFromCompare();
        } else {
          onAddToCompare();
        }
      }}
      className={`flex items-center gap-1 text-xs font-bold transition-colors focus:outline-none ${
        isCompared ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
      }`}
    >
      {isCompared ? (
        <span className="flex items-center gap-1"><Check size={14} /> Added to compare</span>
      ) : (
        <span className="flex items-center gap-1"><Plus size={14} /> Add to compare</span>
      )}
    </button>
  );
}
