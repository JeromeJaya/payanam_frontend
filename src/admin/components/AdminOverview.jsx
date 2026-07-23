
import {
  Users, Store, AlertCircle, Bus, CheckCircle,
  Calendar, DollarSign, TrendingUp,
} from "lucide-react";
import { UserOverview, RevenueStats, BookingsStats, FleetStats } from "./index";

const statCards = [
  { label: "Total Users", key: "users.total", icon: Users, bgColor: "bg-indigo-50 dark:bg-indigo-900/20", iconColor: "text-indigo-600 dark:text-indigo-400" },
  { label: "Total Vendors", key: "users.totalVendors", icon: Store, bgColor: "bg-purple-50 dark:bg-purple-900/20", iconColor: "text-purple-600 dark:text-purple-400" },
  { label: "Pending Approvals", key: "users.pendingVendorApprovals", icon: AlertCircle, bgColor: "bg-amber-50 dark:bg-amber-900/20", iconColor: "text-amber-600 dark:text-amber-400" },
  { label: "Total Buses", key: "buses.total", icon: Bus, bgColor: "bg-lime-50 dark:bg-lime-900/20", iconColor: "text-lime-600 dark:text-lime-400" },
  { label: "Active Buses", key: "buses.active", icon: CheckCircle, bgColor: "bg-green-50 dark:bg-green-900/20", iconColor: "text-green-600 dark:text-green-400" },
  { label: "Total Bookings", key: "bookings.total", icon: Calendar, bgColor: "bg-emerald-50 dark:bg-emerald-900/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { label: "Total Revenue", key: "revenue.total", icon: DollarSign, bgColor: "bg-teal-50 dark:bg-teal-900/20", iconColor: "text-teal-600 dark:text-teal-400", format: (v) => `₹${v.toLocaleString('en-IN')}` },
  { label: "This Month", key: "revenue.thisMonth", icon: TrendingUp, bgColor: "bg-cyan-50 dark:bg-cyan-900/20", iconColor: "text-cyan-600 dark:text-cyan-400", format: (v) => `₹${v.toLocaleString('en-IN')}` },
];

const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, part) => acc?.[part], obj);

export default function AdminOverview({ dashboardData }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          const raw = getNestedValue(dashboardData, card.key);
          const value = card.format ? card.format(raw) : raw?.toLocaleString() ?? "0";
          return (
            <div key={card.label} className={`${card.bgColor} rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/50 dark:bg-slate-800/50">
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserOverview data={dashboardData?.users} />
        <RevenueStats data={dashboardData?.revenue} />
        <BookingsStats data={dashboardData?.bookings} />
        <FleetStats data={dashboardData?.buses} />
      </div>
    </>
  );
}
