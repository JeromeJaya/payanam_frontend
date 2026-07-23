import { CheckCircle2, Info } from "lucide-react";

export default function PriceLockFeatures({ success, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-slate-100">Price Locked Successfully!</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
            <p>Your fare of <span className="font-bold text-gray-900 dark:text-slate-100">₹{success.lockedFare?.toLocaleString('en-IN')}</span> has been locked.</p>
            <p>Lock ID: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{success.priceLockId}</span></p>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              Expires: {new Date(success.expiresAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300">
            <Info size={14} className="inline mr-1" />
            The lock fee of ₹{success.lockFee} is non-refundable and not adjusted toward the ticket price.
          </div>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors mt-2"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
