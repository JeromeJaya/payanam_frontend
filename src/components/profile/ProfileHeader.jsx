import { Link } from "react-router-dom";

export default function ProfileHeader({ isAdminView }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-700 pb-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Traveler Profile</h1>
      <div className="flex items-center gap-3">
        <Link to={isAdminView ? "/admin/dashboard" : "/MainPage"} className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50">
          ← Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
