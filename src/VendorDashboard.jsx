import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  Bus,
  Plane,
  Hotel,
  Train,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Route
} from "lucide-react";
import api from "./api/axios";
import CreateBusForm from "./components/CreateBusForm";
import EditBusForm from "./components/EditBusForm";
import BusDetailModal from "./components/BusDetailModal";
import CreateRouteForm from "./components/CreateRouteForm";
import BusRoutesModal from "./components/BusRoutesModal";

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
  {
    id: "train",
    label: "Train Services",
    icon: Train,
    gradient: "from-orange-500 to-orange-600",
    hoverBorder: "hover:border-orange-500",
    color: "orange",
    description: "Manage your train schedules and routes"
  },
  {
    id: "hotel",
    label: "Hotel Services",
    icon: Hotel,
    gradient: "from-purple-500 to-purple-600",
    hoverBorder: "hover:border-purple-500",
    color: "purple",
    description: "Manage your hotel properties and rooms"
  },
];

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateBusForm, setShowCreateBusForm] = useState(false);
  const [showCreateRouteForm, setShowCreateRouteForm] = useState(false);
  const [editBus, setEditBus] = useState(null);
  const [viewBusId, setViewBusId] = useState(null);
  const [viewRoutesBus, setViewRoutesBus] = useState(null);
  const [buses, setBuses] = useState([]);
  const [busesLoading, setBusesLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchServiceType, setSearchServiceType] = useState("bus");
  const [searchResultBusId, setSearchResultBusId] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;

    setSearching(true);
    setSearchError("");

    try {
      if (searchServiceType === "bus") {
        // Try fetching the bus directly — if 404, the catch will handle it
        const response = await api.get(`/api/v1/buses/${q}`);
        if (response.data.success) {
          setSearchResultBusId(q);
          setSearchError("");
          // Switch to services tab and open bus detail
          setActiveTab("services");
          setSelectedCategory("bus");
        }
      } else {
        // For flight/train/hotel — coming soon
        setSearchError(`${searchServiceType.charAt(0).toUpperCase() + searchServiceType.slice(1)} search coming soon.`);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setSearchError(`No ${searchServiceType} found with ID: "${q}"`);
      } else {
        setSearchError(err.response?.data?.message || `Failed to search ${searchServiceType}`);
      }
      setSearchResultBusId(null);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (!user || user.role !== "vendor") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchBuses = async () => {
    setBusesLoading(true);
    try {
      const response = await api.get("/api/v1/buses");
      if (response.data.success) {
        setBuses(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching buses:", err);
    } finally {
      setBusesLoading(false);
    }
  };

  // When search finds a bus, open the detail modal
  useEffect(() => {
    if (searchResultBusId) {
      setViewBusId(searchResultBusId);
      setSearchResultBusId(null);
    }
  }, [searchResultBusId]);

  useEffect(() => {
    if (user && user.role === "vendor") {
      fetchBuses();
    }
  }, [user]);

  if (!user || user.role !== "vendor") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteBus = async (busId) => {
    try {
      const response = await api.delete(`/api/v1/buses/${busId}`);
      if (response.data.success) {
        setBuses(prev => prev.filter(b => b._id !== busId));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Error deleting bus:", err);
      alert(err.response?.data?.message || "Failed to delete bus");
    }
  };

  const handleEditSuccess = (updatedBus) => {
    setBuses(prev => prev.map(b => b._id === updatedBus._id ? updatedBus : b));
  };

  const handleCreateSuccess = (newBus) => {
    setBuses(prev => [newBus, ...prev]);
  };

  const stats = [
    { label: "Total Buses", value: buses.length.toString(), change: "", icon: Bus, color: "lime" },
    { label: "Active Buses", value: buses.filter(b => b.status === "ACTIVE").length.toString(), change: "", icon: Calendar, color: "emerald" },
    { label: "Total Bookings", value: "—", change: "", icon: DollarSign, color: "green" },
    { label: "Total Revenue", value: "—", change: "", icon: TrendingUp, color: "teal" },
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

  const renderServiceCategoryGrid = () => (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-6">Service Categories</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const itemCount = cat.id === "bus" ? buses.length : 0;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
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
                  {itemCount} {cat.id === "bus" ? (itemCount === 1 ? "Bus" : "Buses") : "Coming Soon"}
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

  const renderBusServiceView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Bus Services</h3>
          <p className="text-sm text-slate-500">Manage your bus fleet</p>
        </div>
        <button 
          onClick={() => setShowCreateBusForm(true)}
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
            onClick={() => setShowCreateBusForm(true)}
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
                <button
                  onClick={() => setViewBusId(bus._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-lime-700 bg-lime-50 hover:bg-lime-100 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={() => setViewRoutesBus(bus)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  <Route className="w-3.5 h-3.5" />
                  Routes
                </button>
                <button
                  onClick={() => setEditBus(bus)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(bus)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderComingSoonView = (category) => {
    const cat = SERVICE_CATEGORIES.find(c => c.id === category);
    const Icon = cat?.icon || Bus;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h3 className="text-xl font-bold text-slate-900">{cat?.label || "Service"}</h3>
        </div>
        <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <Icon className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">{cat?.label || "Coming Soon"}</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            This service management is coming soon. You'll be able to manage your {category} inventory, schedules, and bookings here.
          </p>
        </div>
      </div>
    );
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
        {/* Quick Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-700 whitespace-nowrap">Quick Search</span>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <div className="flex gap-2">
                <select
                  value={searchServiceType}
                  onChange={(e) => setSearchServiceType(e.target.value)}
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                >
                  <option value="bus">Bus</option>
                  <option value="flight">Flight</option>
                  <option value="train">Train</option>
                  <option value="hotel">Hotel</option>
                </select>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={`Enter ${searchServiceType} ID...`}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                {searching ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </button>
            </div>
          </div>
          {searchError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {searchError}
            </div>
          )}
        </div>

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
                  {stat.change && (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  )}
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
              {["overview", "bookings", "routes", "services", "analytics"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedCategory(null);
                  }}
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

            {activeTab === "routes" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Route Management</h3>
                    <p className="text-sm text-slate-500">Create and manage routes for your buses</p>
                  </div>
                  <button
                    onClick={() => setShowCreateRouteForm(true)}
                    disabled={buses.filter(b => b.status === "ACTIVE").length === 0}
                    className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
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
            )}

            {activeTab === "services" && (
              <>
                {selectedCategory === null && renderServiceCategoryGrid()}
                {selectedCategory === "bus" && renderBusServiceView()}
                {(selectedCategory === "flight" || selectedCategory === "train" || selectedCategory === "hotel") && renderComingSoonView(selectedCategory)}
              </>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Bus</h3>
              <p className="text-sm text-slate-600 mb-6">
                Are you sure you want to delete <strong>{deleteConfirm.busName}</strong> ({deleteConfirm.busNumber})?
                This will also delete all associated routes and schedules. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBus(deleteConfirm._id)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Bus Modal */}
      {showCreateBusForm && (
        <CreateBusForm 
          onClose={() => setShowCreateBusForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Edit Bus Modal */}
      {editBus && (
        <EditBusForm
          bus={editBus}
          onClose={() => setEditBus(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* View Bus Detail Modal */}
      {viewBusId && (
        <BusDetailModal
          busId={viewBusId}
          onClose={() => setViewBusId(null)}
        />
      )}

      {/* Create Route Modal */}
      {showCreateRouteForm && (
        <CreateRouteForm
          buses={buses}
          onClose={() => setShowCreateRouteForm(false)}
          onSuccess={() => {
            setShowCreateRouteForm(false);
            alert("Route created successfully!");
          }}
        />
      )}

      {/* View Bus Routes Modal */}
      {viewRoutesBus && (
        <BusRoutesModal
          bus={viewRoutesBus}
          onClose={() => setViewRoutesBus(null)}
        />
      )}
    </div>
  );
}
