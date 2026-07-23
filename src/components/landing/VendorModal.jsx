export default function VendorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200/80 p-8 shadow-2xl relative transition-transform animate-zoom-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors font-bold text-sm bg-white"
        >
          ✕
        </button>

        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Merchant Gateway Node</h2>
          <p className="text-slate-500 text-sm font-medium">Provide encrypted merchant tokens to access inventory distribution analytics.</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="vendor-id">Registered Merchant ID</label>
            <input
              type="text"
              id="vendor-id"
              placeholder="MID-000000000"
              className="w-full border border-slate-200 rounded-xl p-3 font-mono font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="vendor-key">Secure Authorization Key</label>
            <input
              type="password"
              id="vendor-key"
              placeholder="••••••••••••••••••••"
              className="w-full border border-slate-200 rounded-xl p-3 font-mono font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all text-sm"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded text-lime-600 focus:ring-lime-500/20 w-4 h-4 border-slate-300" />
              Keep Session Alive
            </label>
            <a href="#" className="text-lime-600 hover:underline">Revoke Access Key</a>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider text-sm transition-colors shadow-md"
          >
            Establish Secure Connection
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <span className="text-xs text-slate-500 font-medium">New supplier? </span>
          <a href="#" className="text-xs text-lime-600 font-bold hover:underline">Apply for Node Provisioning</a>
        </div>
      </div>
    </div>
  );
}
