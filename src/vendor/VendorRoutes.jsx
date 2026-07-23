import { Bus, Plane, ArrowLeft, Plus, Route } from "lucide-react";

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

export default function VendorRoutes({
  routeCategory,
  setRouteCategory,
  buses,
  flights,
  setShowCreateRouteForm,
  setShowFlightRouteForm,
  setViewFlightRoutes
}) {
  return (
    <div className="space-y-6">
      {!routeCategory ? (
        <>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Select Service Type</h3>
            <p className="text-sm text-slate-600">Choose a service category to manage routes</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {SERVICE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setRouteCategory(cat.id)}
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
                  <span className="text-xs text-slate-400 group-hover:translate-x-1 transition-transform inline-block">
                    Click to manage routes →
                  </span>
                </button>
              );
            })}
          </div>
        </>
      ) : routeCategory === "bus" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setRouteCategory(null)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Bus Routes</h3>
              <p className="text-sm text-slate-500">Create and manage routes for your buses</p>
            </div>
            <button
              onClick={() => setShowCreateRouteForm(true)}
              disabled={buses.filter(b => b.status === "ACTIVE").length === 0}
              className="ml-auto flex items-center gap-2 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Route
            </button>
          </div>

          {buses.filter(b => b.status === "ACTIVE").length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <Bus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Buses</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                You need at least one active bus before you can create a route. Go to Services → Bus Services to add or activate a bus.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {buses.filter(b => b.status === "ACTIVE").map((bus) => (
                <div key={bus._id} className="border border-slate-200 rounded-xl p-5 hover:border-lime-500 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
                      <Bus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{bus.busName}</h4>
                      <p className="text-xs text-slate-500">{bus.busNumber} — {bus.busType?.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Click "Create Route" above to define a route for this bus with source, destination, and stops.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : routeCategory === "flight" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setRouteCategory(null)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Flight Routes</h3>
              <p className="text-sm text-slate-500">Create and manage routes for your flights</p>
            </div>
            <button
              onClick={() => setShowFlightRouteForm(true)}
              disabled={flights.length === 0}
              className="ml-auto flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Route
            </button>
          </div>

          {flights.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <Plane className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Flights Available</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                You need at least one flight before you can create a route. Go to Services → Flight Services to register an aircraft.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {flights.map((flight) => (
                <div key={flight._id} className="border border-slate-200 rounded-xl p-5 hover:border-sky-500 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                      <Plane className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{flight.airlineName}</h4>
                      <p className="text-xs text-slate-500">{flight.registrationNumber} — {flight.aircraftModel}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Click "Create Route" above to define a route for this flight with source, destination, and stops.
                  </p>
                  <button
                    onClick={() => setViewFlightRoutes(flight._id)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                  >
                    <Route className="w-3.5 h-3.5" />
                    View Routes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          {SERVICE_CATEGORIES.find(c => c.id === routeCategory)?.icon && (
            <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              {(() => {
                const Icon = SERVICE_CATEGORIES.find(c => c.id === routeCategory).icon;
                return <Icon className="w-10 h-10 text-slate-500" />;
              })()}
            </div>
          )}
          <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {routeCategory === "train" && "Train route management will be available soon."}
            {routeCategory === "hotel" && "Hotel location management will be available soon."}
          </p>
          <button
            onClick={() => setRouteCategory(null)}
            className="mt-4 inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Back to Categories
          </button>
        </div>
      )}
    </div>
  );
}
