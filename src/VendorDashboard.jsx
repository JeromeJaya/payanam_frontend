import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  LogOut,
  Bus,
  Plane,
  Hotel,
  Train,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user || user.role !== "vendor") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "vendor") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const stats = [
    { label: "Total Bookings", value: "1,234", change: "+12.5%", icon: Calendar, color: "lime" },
    { label: "Total Revenue", value: "₹4.5L", change: "+8.2%", icon: DollarSign, color: "emerald" },
    { label: "Active Users", value: "856", change: "+15.3%", icon: Users, color: "green" },
    { label: "Growth Rate", value: "23.5%", change: "+5.1%", icon: TrendingUp, color: "teal" },
  ];

  const recentBookings = [
    { id: "BK001", customer: "Rahul Sharma", service: "Flight", route: "Delhi → Mumbai", amount: "₹5,499", status: "Confirmed", date: "2024-01-15" },
    { id: "BK002", customer: "Priya Patel", service: "Bus", route: "Bangalore → Chennai", amount: "₹1,200", status: "Confirmed", date: "2024-01-15" },
    { id: "BK003", customer: "Ananya Reddy", service: "Hotel", route: "Goa Resort", amount: "₹8,999", status: "Pending", date: "2024-01-14" },
    { id: "BK004", customer: "Vikram Singh", service: "Train", route: "Mumbai → Pune", amount: "₹450", status: "Confirmed", date: "2024-01-14" },
  ];

  const colorClasses = {
    lime: "from-lime-500 to-lime-600",
    emerald: "from-emerald-500 to-emerald-600",
    green: "from-green-500 to-green-600",
    teal: "from-teal-500 to-teal-600",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="w-full px-6 sm:px-12 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-600 to-lime-500 flex items-center justify-center text-white font-black text-xl shadow-md">
              V
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">Vendor Dashboard</h1>
              <p className="text-xs text-slate-500">Welcome back, {user?.name || "Vendor"}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 px-5 py-2.5 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="w-full px-6 sm:px-12 lg:px-20 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8">
          <div className="border-b border-slate-200 px-6">
            <nav className="flex gap-8">
              {["overview", "bookings", "services", "analytics"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-bold capitalize border-b-2 transition-all duration-200 ${
                    activeTab === tab
                      ? "border-lime-500 text-lime-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Recent Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Booking ID</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Service</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Route</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-4 text-sm font-mono font-bold text-slate-900">{booking.id}</td>
                          <td className="py-4 px-4 text-sm text-slate-700">{booking.customer}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700">
                              {booking.service === "Flight" && <Plane className="w-4 h-4" />}
                              {booking.service === "Bus" && <Bus className="w-4 h-4" />}
                              {booking.service === "Hotel" && <Hotel className="w-4 h-4" />}
                              {booking.service === "Train" && <Train className="w-4 h-4" />}
                              {booking.service}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-700">{booking.route}</td>
                          <td className="py-4 px-4 text-sm font-bold text-slate-900">{booking.amount}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                              booking.status === "Confirmed" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600">{booking.date}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-lime-50 rounded-lg transition-colors group" title="View">
                                <Eye className="w-4 h-4 text-slate-600 group-hover:text-lime-600" />
                              </button>
                              <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" title="Edit">
                                <Edit className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                              </button>
                              <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group" title="Delete">
                                <Trash2 className="w-4 h-4 text-slate-600 group-hover:text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">All Bookings</h3>
                <p className="text-sm text-slate-600">Manage all your bookings here</p>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Your Services</h3>
                  <button className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Service
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "Deluxe Bus Service", type: "Bus", bookings: 456, revenue: "₹2.3L", status: "Active" },
                    { name: "Premium Flights", type: "Flight", bookings: 234, revenue: "₹1.8L", status: "Active" },
                    { name: "Luxury Hotels", type: "Hotel", bookings: 389, revenue: "₹3.2L", status: "Active" },
                    { name: "Express Trains", type: "Train", bookings: 155, revenue: "₹45K", status: "Inactive" },
                  ].map((service, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-6 hover:border-lime-500 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-slate-900">{service.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          service.status === "Active" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Type:</span>
                          <span className="font-bold text-slate-900">{service.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Bookings:</span>
                          <span className="font-bold text-slate-900">{service.bookings}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Revenue:</span>
                          <span className="font-bold text-lime-600">{service.revenue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Analytics & Reports</h3>
                <p className="text-sm text-slate-600">View detailed analytics and generate reports</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}