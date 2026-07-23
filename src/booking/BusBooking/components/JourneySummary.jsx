import { ShieldCheck } from "lucide-react";

export default function JourneySummary({ busName, boarding, dropping, grandTotal, seats }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/30 p-6 animate-fadeInUp" style={{ animationDelay: "100ms" }}>
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <ShieldCheck size={20} className="text-lime-600 dark:text-lime-400" />
        Journey Summary
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Bus</p>
            <p className="font-bold text-slate-900 dark:text-slate-100">{busName}</p>
            {seats && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Seats: {seats.join(", ")}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Total</p>
            <p className="text-xl font-black text-slate-900 dark:text-slate-100">₹{grandTotal.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">From</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{boarding?.name}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{boarding?.city}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500">{boarding?.time}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">To</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{dropping?.name}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{dropping?.city}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500">{dropping?.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
