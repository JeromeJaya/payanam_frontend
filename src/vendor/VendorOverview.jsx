import { useState, useEffect } from "react";
import { Calendar, Bus, Plane, TrendingUp, BarChart3 } from "lucide-react";
import api from "../api/axios";

export default function VendorOverview() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/users/vendor/dashboard");
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Unable to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
        <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Data Available</h3>
        <p className="text-sm text-slate-600">{error || "Unable to load dashboard statistics"}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-lime-600 text-white text-sm font-bold rounded-lg hover:bg-lime-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900">Overview</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">
              <span className="font-bold text-slate-900">{dashboardData.schedules.totalUpcoming}</span> upcoming schedules
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Schedules */}
        <div className="bg-gradient-to-br from-lime-50 to-emerald-50 border-2 border-lime-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-lime-600" />
            Upcoming Schedules
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Bus Schedules</span>
              <span className="text-2xl font-black text-lime-600">{dashboardData.schedules.upcomingBus}</span>
            </div>
            <div className="w-full bg-lime-200 rounded-full h-2">
              <div 
                className="bg-lime-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((dashboardData.schedules.upcomingBus / Math.max(dashboardData.schedules.totalUpcoming, 1)) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Flight Schedules</span>
              <span className="text-2xl font-black text-sky-600">{dashboardData.schedules.upcomingFlight}</span>
            </div>
            <div className="w-full bg-sky-200 rounded-full h-2">
              <div 
                className="bg-sky-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((dashboardData.schedules.upcomingFlight / Math.max(dashboardData.schedules.totalUpcoming, 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Bus className="w-5 h-5 text-blue-600" />
            Fleet Status
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Buses</span>
              <span className="text-2xl font-black text-slate-900">{dashboardData.buses.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Active</span>
              <span className="text-lg font-bold text-green-600">{dashboardData.buses.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Inactive</span>
              <span className="text-lg font-bold text-slate-500">{dashboardData.buses.inactive}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${dashboardData.buses.total > 0 ? (dashboardData.buses.active / dashboardData.buses.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Revenue Overview
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-black text-emerald-600">₹{dashboardData.revenue.total.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-slate-600">Confirmed Bookings</span>
              <span className="text-xl font-bold text-slate-900">{dashboardData.bookings.confirmed}</span>
            </div>
          </div>
        </div>

        {/* Flight Status */}
        <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Plane className="w-5 h-5 text-sky-600" />
            Flight Status
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Flights</span>
              <span className="text-2xl font-black text-slate-900">{dashboardData.flights.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Active</span>
              <span className="text-lg font-bold text-green-600">{dashboardData.flights.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Inactive</span>
              <span className="text-lg font-bold text-slate-500">{dashboardData.flights.inactive}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-sky-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${dashboardData.flights.total > 0 ? (dashboardData.flights.active / dashboardData.flights.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}