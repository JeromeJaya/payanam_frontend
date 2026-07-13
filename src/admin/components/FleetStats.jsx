import { Bus } from "lucide-react";

export default function FleetStats({ data }) {
  if (!data) return null;

  const items = [
    ["Total Buses", data.total],
    ["Active", data.active],
    ["Inactive", data.inactive],
    ["Active Routes", data.routes?.active || 0],
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Bus className="w-5 h-5" /> Fleet
      </h3>
      <div className="space-y-3">
        {items.map(([label, value]) => (
          <div key={label} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
            <span className="text-slate-600 dark:text-slate-400">{label}</span>
            <span className="font-bold text-slate-900 dark:text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}