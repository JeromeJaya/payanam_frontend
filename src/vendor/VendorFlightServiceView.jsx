import React from "react";
import { ArrowLeft, Plane, Plus, Eye, Edit, Trash2 } from "lucide-react";

export default function VendorFlightServiceView({
  flights,
  flightsLoading,
  onBack,
  onAddFlight,
  onViewFlight,
  onEditFlight,
  onDeleteFlight,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Flight Services</h3>
          <p className="text-sm text-slate-500">Manage your flight fleet</p>
        </div>
        <button 
          onClick={onAddFlight}
          className="ml-auto flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Flight
        </button>
      </div>

      {flightsLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-600">Loading flights...</p>
        </div>
      ) : flights.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <Plane className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Flights Yet</h3>
          <p className="text-sm text-slate-600 mb-4">Register your first aircraft to get started</p>
          <button
            onClick={onAddFlight}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Register Your First Flight
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {flights.map((flight) => (
            <div key={flight._id} className="border border-slate-200 rounded-xl p-6 hover:border-sky-500 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{flight.airlineName}</h4>
                    <p className="text-xs text-slate-500">{flight.registrationNumber}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  flight.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                }`}>
                  {flight.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Model:</span>
                  <span className="font-bold text-slate-900">{flight.aircraftModel}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-bold text-slate-900">{flight.aircraftType.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Seats:</span>
                  <span className="font-bold text-slate-900">{flight.totalSeats}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Cabin Classes:</span>
                  <span className="font-bold text-slate-900">{(flight.cabinClasses || []).join(", ")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Amenities:</span>
                  <span className="font-bold text-slate-900">{(flight.amenities || []).length}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button onClick={() => onViewFlight(flight._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button onClick={() => onEditFlight(flight)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => onDeleteFlight(flight)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
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
