import { useState } from "react";
import { Check, Luggage, X, Minus, Plus } from "lucide-react";

/**
 * BaggageInfo — Shows included baggage + extra baggage purchase modal.
 *
 * Props:
 *   cabin     — cabin baggage label (default "7 Kgs (1 piece only)")
 *   checkIn   — check-in baggage label (default "15 Kgs (1 piece only)")
 *   route     — route code string e.g. "DEL-BOM"
 *   onBaggageChange — (extraBaggage) => void
 *     extraBaggage = { items: [{ weight, qty, price }], totalCost }
 */

const EXTRA_BAGGAGE_OPTIONS = [
  { weight: 5,  label: "5 Kg",  prices: { base: 600,  perKg: 120 } },
  { weight: 10, label: "10 Kg", prices: { base: 1100, perKg: 110 } },
  { weight: 15, label: "15 Kg", prices: { base: 1500, perKg: 100 } },
  { weight: 20, label: "20 Kg", prices: { base: 1800, perKg: 90  } },
  { weight: 25, label: "25 Kg", prices: { base: 2100, perKg: 84  } },
];

export default function BaggageInfo({ cabin, checkIn, route, onBaggageChange }) {
  const routeCode = route || "DEL-BLR";
  const [showModal, setShowModal] = useState(false);
  // { weight: qty } — only entries with qty > 0 are "selected"
  const [selections, setSelections] = useState({});

  const includedCheckInKg = 15;
  const includedCabinKg = 7;

  // Compute total extra cost + summary
  const extraItems = EXTRA_BAGGAGE_OPTIONS.filter(opt => (selections[opt.weight] || 0) > 0).map(opt => ({
    weight: opt.weight,
    label: opt.label,
    qty: selections[opt.weight],
    price: opt.prices.base,
  }));
  const totalExtraCost = extraItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalExtraKg = extraItems.reduce((sum, item) => sum + item.weight * item.qty, 0);

  const handleQtyChange = (weight, delta) => {
    setSelections(prev => {
      const current = prev[weight] || 0;
      const next = Math.max(0, Math.min(5, current + delta)); // max 5 bags per option
      return { ...prev, [weight]: next };
    });
  };

  const handleApply = () => {
    if (onBaggageChange) {
      onBaggageChange({
        items: extraItems,
        totalCost: totalExtraCost,
        totalExtraKg,
      });
    }
    setShowModal(false);
  };

  const handleRemoveAll = () => {
    setSelections({});
    if (onBaggageChange) {
      onBaggageChange({ items: [], totalCost: 0, totalExtraKg: 0 });
    }
  };

  const hasSelections = Object.values(selections).some(q => q > 0);

  return (
    <>
      <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-4 bg-white dark:bg-slate-800">
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3">Baggage</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-slate-300">
              <span className="font-medium">Cabin Baggage:</span> {cabin || `${includedCabinKg} Kgs (1 piece only)`} / Adult
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-slate-300">
              <span className="font-medium">Check-In Baggage:</span> {checkIn || `${includedCheckInKg} Kgs (1 piece only)`} / Adult
              {totalExtraKg > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  +{totalExtraKg} Kg extra added
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Extra Baggage Promotion */}
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Luggage className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-slate-300">
              Got excess baggage? Don't stress, buy extra check-in baggage allowance for{" "}
              <span className="font-semibold">{routeCode}</span> at fab rates!
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:text-blue-700 dark:hover:text-blue-300 whitespace-nowrap ml-2 flex-shrink-0 border border-blue-300 dark:border-blue-600 rounded-lg px-3 py-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            {hasSelections ? `EDIT (+₹${totalExtraCost.toLocaleString()})` : "ADD BAGGAGE"}
          </button>
        </div>

        {/* Selected extra baggage summary chips */}
        {hasSelections && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {extraItems.map(item => (
              <span
                key={item.weight}
                className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full"
              >
                +{item.label} × {item.qty}
              </span>
            ))}
            <span className="text-xs font-bold text-gray-700 dark:text-slate-300 ml-auto">
              +₹{totalExtraCost.toLocaleString()}
            </span>
            <button
              onClick={handleRemoveAll}
              className="text-xs text-red-500 hover:text-red-600 font-semibold underline"
            >
              Remove all
            </button>
          </div>
        )}
      </div>

      {/* ── ADD BAGGAGE MODAL ───────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Luggage size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-slate-100">Add Extra Check-In Baggage</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">For {routeCode} route</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Included baggage reminder */}
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                Your ticket already includes <span className="font-bold text-gray-700 dark:text-slate-200">{includedCabinKg} Kg cabin</span> +{" "}
                <span className="font-bold text-gray-700 dark:text-slate-200">{includedCheckInKg} Kg check-in</span> baggage.
              </p>
            </div>

            {/* Options list */}
            <div className="px-4 py-3 space-y-2 max-h-72 overflow-y-auto">
              {EXTRA_BAGGAGE_OPTIONS.map(opt => {
                const qty = selections[opt.weight] || 0;
                return (
                  <div
                    key={opt.weight}
                    className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                      qty > 0
                        ? "border-blue-400 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-slate-100">
                        +{opt.label} <span className="font-normal text-gray-500 dark:text-slate-400">check-in baggage</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        ₹{opt.prices.base.toLocaleString()} per bag
                        <span className="text-gray-400 dark:text-slate-500"> · ₹{opt.prices.perKg}/Kg</span>
                      </p>
                    </div>

                    {/* Qty stepper */}
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => handleQtyChange(opt.weight, -1)}
                        disabled={qty === 0}
                        className="w-7 h-7 rounded-full border border-gray-300 dark:border-slate-500 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-30 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-sm font-bold text-gray-900 dark:text-slate-100">{qty}</span>
                      <button
                        onClick={() => handleQtyChange(opt.weight, 1)}
                        disabled={qty >= 5}
                        className="w-7 h-7 rounded-full border border-blue-400 dark:border-blue-500 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-30 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note */}
            <div className="px-4 pb-2">
              <p className="text-[11px] text-gray-400 dark:text-slate-500 leading-tight">
                *Extra baggage is non-refundable and charged per bag. Maximum 5 bags per weight option.
                Overweight bags (&gt;30 Kg per piece) are not permitted due to safety regulations.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/40">
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {hasSelections
                    ? `${Object.values(selections).reduce((s, q) => s + q, 0)} bag(s) selected`
                    : "No bags selected"}
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-slate-100">
                  {totalExtraCost > 0 ? `+₹${totalExtraCost.toLocaleString()}` : "₹0"}
                </p>
              </div>
              <button
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {hasSelections ? "Apply" : "Skip"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
