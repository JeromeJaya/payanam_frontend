import { SERVICE_CATEGORIES } from "./VendorServiceCategoryGrid";

export default function ScheduleCategorySelector({ onSelectCategory }) {
  return (
    <>
      <h3 className="text-xl font-bold text-slate-900">Select Service Type</h3>
      <p className="text-sm text-slate-600">Choose a service category to schedule a trip</p>
      <div className="grid md:grid-cols-2 gap-4">
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button key={cat.id} onClick={() => onSelectCategory(cat.id)}
              className={`text-left bg-white border-2 border-slate-200 rounded-xl p-6 ${cat.hoverBorder} hover:shadow-md transition-all duration-300 group`}>
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">{cat.label}</h4>
                  <p className="text-xs text-slate-500">{cat.description}</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-hover:translate-x-1 transition-transform inline-block">Click to schedule →</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
