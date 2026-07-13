import React from "react";
import { ArrowLeft, Bus, Plus, Eye, Edit, Trash2, Route } from "lucide-react";

export default function VendorBusServiceView({
  buses,
  busesLoading,
  onBack,
  onAddBus,
  onViewBus,
  onViewRoutes,
  onEditBus,
  onDeleteBus,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Bus Services</h3>
          <p className="text-sm text-slate-500">Manage your bus fleet</p>
        </div>
        <button 
          onClick={onAddBus}
          className="ml-auto flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Bus
        </button>
      </div>

      {busesLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-600">Loading buses...</p>
        </div>
      ) : buses.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <Bus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Buses Yet</h3>
          <p className="text-sm text-slate-600 mb-4">Create your first bus to get started</p>
          <button
            onClick={onAddBus}
            className="inline-flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Bus
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {buses.map((bus) => (
            <div key={bus._id} className="border border-slate-200 rounded-xl p-6 hover:border-lime-500 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{bus.busName}</h4>
                    <p className="text-xs text-slate-500">{bus.busNumber}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  bus.status === "ACTIVE" 
                    ? "bg-green-100 text-green-700" 
                    : bus.status === "MAINTENANCE"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {bus.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-bold text-slate-900">{bus.busType?.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Registration:</span>
                  <span className="font-bold text-slate-900">{bus.registrationNumber}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Seats:</span>
                  <span className="font-bold text-slate-900">{bus.totalSeats}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Amenities:</span>
                  <span className="font-bold text-slate-900">{(bus.amenities || []).length}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button onClick={() => onViewBus(bus._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-lime-700 bg-lime-50 hover:bg-lime-100 rounded-lg transition-colors">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button onClick={() => onViewRoutes(bus)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
                  <Route className="w-3.5 h-3.5" /> Routes
                </button>
                <button onClick={() => onEditBus(bus)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => onDeleteBus(bus)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
