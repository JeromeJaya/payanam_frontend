import { ShieldCheck } from "lucide-react";

export default function CheckoutBookingSummary({ busName, grandTotal, boarding, dropping }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <ShieldCheck size={20} className="text-lime-600" />
        Journey Summary
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Bus</p>
            <p className="font-bold text-slate-900">{busName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total</p>
            <p className="text-xl font-black text-slate-900">₹{grandTotal.toLocaleString()}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 font-medium mb-1">From</p>
            <p className="text-sm font-bold text-slate-900">{boarding?.name}</p>
            <p className="text-xs text-slate-600">{boarding?.city}</p>
            <p className="text-xs text-slate-500">{boarding?.time}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-xs text-purple-600 font-medium mb-1">To</p>
            <p className="text-sm font-bold text-slate-900">{dropping?.name}</p>
            <p className="text-xs text-slate-600">{dropping?.city}</p>
            <p className="text-xs text-slate-500">{dropping?.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
