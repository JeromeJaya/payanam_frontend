import { Clock, Shield, ArrowRight } from "lucide-react";

export default function PriceLockForm({
  lockOptions,
  selectedOption,
  onSelectOption,
  error,
  loading,
  onSubmit,
  getExpiryPreview,
  baseFare,
}) {
  return (
    <>
      <div>
        <h3 className="text-xs font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-3">
          Select Price Lock Duration :
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {lockOptions.map((opt) => {
            const isSelected = selectedOption?.id === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => onSelectOption(opt)}
                className={`relative rounded-xl border p-3 text-center cursor-pointer select-none transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-900/30 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-white dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {opt.isPopular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-700 text-white font-black text-[8px] uppercase tracking-wide px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                    Popular
                  </span>
                )}
                <div className="text-[11px] font-black text-gray-900 dark:text-slate-100">{opt.duration}</div>
                <div className="text-xs font-bold text-gray-600 dark:text-slate-300 mt-1">₹{opt.fee}</div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedOption && (
        <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300 font-medium">
          <Clock size={14} className="text-gray-400 dark:text-slate-500" />
          Complete your booking by <span className="font-black text-amber-600 dark:text-amber-400">{getExpiryPreview()}</span>
        </div>
      )}

      {selectedOption && (
        <div className="border border-gray-200 dark:border-slate-700 rounded-xl divide-y divide-gray-100 dark:divide-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 flex justify-between items-start">
            <div>
              <h4 className="font-black text-sm text-gray-900 dark:text-slate-100">Cost of Price Lock</h4>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium max-w-[280px] mt-1 leading-tight">
                <span className="text-red-500 dark:text-red-400 font-bold">Non-refundable</span> & not adjusted against the flight booking amount
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-gray-900 dark:text-slate-100">₹{selectedOption.fee.toLocaleString('en-IN')}</span>
              <span className="block text-[10px] text-gray-400 dark:text-slate-500 font-medium mt-px">for 1 traveller</span>
            </div>
          </div>

          <div className="p-4 flex justify-between items-center bg-gray-50/40 dark:bg-slate-700/30">
            <span className="font-black text-sm text-gray-900 dark:text-slate-100">
              Locked Price for {selectedOption.duration}*
            </span>
            <span className="text-base font-black text-gray-900 dark:text-slate-100">
              ₹{baseFare.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            <Shield size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>Fare increase protection up to <span className="font-bold text-gray-800 dark:text-slate-200">₹7,500</span> per passenger. If fare drops, you pay less.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-xs text-red-700 dark:text-red-400 font-medium">
          <span className="shrink-0">⚠</span>
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading || !selectedOption}
        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 dark:disabled:bg-blue-800/50 text-white font-black text-sm py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group tracking-wide"
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          <>
            PAY ₹{selectedOption?.fee?.toLocaleString('en-IN') || '...'} AND LOCK
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-gray-400 dark:text-slate-500 leading-tight">
        Price Lock does not reserve a seat. If the flight sells out before you complete booking,
        the lock fee will be refunded.
      </p>
    </>
  );
}
