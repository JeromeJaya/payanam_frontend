export default function BillingInfo({ email, phoneNo }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-slate-100">Billing Information</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Billing Email</label>
          <p className="mt-1.5 text-sm text-slate-900 dark:text-slate-100">{email || "—"}</p>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Billing Phone</label>
          <p className="mt-1.5 text-sm text-slate-900 dark:text-slate-100">{phoneNo || "—"}</p>
        </div>
      </div>
    </div>
  );
}
