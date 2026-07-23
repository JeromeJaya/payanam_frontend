export default function DashboardStatsGrid({ stats, colorClasses }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {stat.change && <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">{stat.change}</span>}
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1">{stat.value}</h3>
            <p className="text-base text-slate-600 dark:text-slate-400">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
