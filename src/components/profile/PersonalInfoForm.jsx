export default function PersonalInfoForm({ form, editing, saving, isAdminView, onChange, onSave, onCancel, onStartEdit }) {
  const fields = [
    ["name", "Full Name"],
    ["email", "Email Address"],
    ["phoneNo", "Contact Number"],
    ["address", "Home Address"],
  ];

  return (
    <form onSubmit={onSave} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-slate-100">Personal Information</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map(([field, label]) => (
          <div key={field}>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
            <input
              name={field}
              type="text"
              value={form[field]}
              onChange={onChange}
              disabled={!editing || isAdminView}
              className="mt-1.5 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 px-3.5 py-2.5 text-sm disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-400"
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700 pt-4">
        {editing ? (
          <>
            <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-lime-500 dark:bg-lime-600 px-5 py-2 text-sm font-bold text-white hover:bg-lime-600 disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
          </>
        ) : !isAdminView && (
          <button type="button" onClick={onStartEdit} className="rounded-xl bg-lime-500 dark:bg-lime-600 px-5 py-2 text-sm font-bold text-white hover:bg-lime-600">Modify Profile</button>
        )}
      </div>
    </form>
  );
}
