export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="w-full px-6 sm:px-12 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-600 to-lime-500 flex items-center justify-center text-white font-black text-xl shadow-md">V</div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">Vendor Dashboard</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 w-full px-6 sm:px-12 lg:px-20 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
