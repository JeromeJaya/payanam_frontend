import { Bus, Plane } from "lucide-react";

const SERVICE_CATEGORIES = [
  {
    id: "bus",
    label: "Bus Services",
    icon: Bus,
    gradient: "from-lime-500 to-lime-600",
    hoverBorder: "hover:border-lime-500",
    color: "lime",
    description: "Manage your bus fleet, routes, and schedules"
  },
  {
    id: "flight",
    label: "Flight Services",
    icon: Plane,
    gradient: "from-sky-500 to-sky-600",
    hoverBorder: "hover:border-sky-500",
    color: "sky",
    description: "Manage your flight inventory and bookings"
  },
];

export default function VendorServiceCategoryGrid({ busesCount, flightsCount, onSelectCategory }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-6">Service Categories</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const itemCount = cat.id === "bus" ? busesCount : cat.id === "flight" ? flightsCount : 0;
          const itemLabel = cat.id === "bus" ? (itemCount === 1 ? "Bus" : "Buses") : 
                           cat.id === "flight" ? "Aircraft" : "Coming Soon";
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-left bg-white border-2 border-slate-200 rounded-xl p-6 ${cat.hoverBorder} hover:shadow-md transition-all duration-300 group`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                    {cat.label}
                  </h4>
                  <p className="text-xs text-slate-500">{cat.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-bold text-slate-900">
                  {itemCount} {itemLabel}
                </span>
                <span className="text-xs text-slate-400 ml-auto group-hover:translate-x-1 transition-transform">
                  Click to manage →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { SERVICE_CATEGORIES };
