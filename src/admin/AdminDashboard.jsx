import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Bus,
  Route,
  Calendar,
  DollarSign,
  TrendingUp,
  LogOut,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../api/axios";

export default function AdminDashboard() {
  const { user, logout, authLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
  // User management state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPagination, setUsersPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20
  });
  const [userFilters, setUserFilters] = useState({
    role: "",
    isActive: "",
    search: ""
  });

  // Fetch dashboard stats
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/v1/admin/dashboard");
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching admin dashboard:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Not authenticated or not admin - will be redirected by ProtectedRoute
        setError("Access denied. Please log in as admin.");
      } else {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users with filters
  const fetchUsers = async (page = 1) => {
    setUsersLoading(true);
    try {
      const params = {
        page,
        limit: 20,
        ...(userFilters.role && { role: userFilters.role }),
        ...(userFilters.isActive !== "" && { isActive: userFilters.isActive === "true" }),
        ...(userFilters.search && { search: userFilters.search })
      };
      const response = await api.get("/api/v1/admin/users", { params });
      if (response.data.success) {
        setUsers(response.data.data.users);
        setUsersPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user && user.role === "admin") {
      fetchDashboardData();
    }
  }, [user, authLoading]);

  // Fetch users when switching to users tab or filters change
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers(1);
    }
  }, [activeTab, userFilters.role, userFilters.isActive]);

  // Redirect non-admins (safety check in case route protection is bypassed)
  if (!authLoading && (!user || user.role !== "admin")) {
    navigate("/MainPage");
    return null;
  }

  // Still loading auth — show nothing until we know the user
  if (authLoading || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setUserFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchUsers(1);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= usersPagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  // Stats cards configuration
  const stats = dashboardData
    ? [
        {
          label: "Total Users",
          value: dashboardData.users.total.toLocaleString(),
          icon: Users,
          color: "indigo",
          bgColor: "bg-indigo-50",
          iconColor: "text-indigo-600",
        },
        {
          label: "Total Vendors",
          value: dashboardData.users.totalVendors.toLocaleString(),
          icon: Users,
          color: "purple",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
        },
        {
          label: "Pending Vendor Approvals",
          value: dashboardData.users.pendingVendorApprovals.toLocaleString(),
          icon: AlertCircle,
          color: "amber",
          bgColor: "bg-amber-50",
          iconColor: "text-amber-600",
        },
        {
          label: "Total Buses",
          value: dashboardData.buses.total.toLocaleString(),
          icon: Bus,
          color: "lime",
          bgColor: "bg-lime-50",
          iconColor: "text-lime-600",
        },
        {
          label: "Active Buses",
          value: dashboardData.buses.active.toLocaleString(),
          icon: CheckCircle,
          color: "green",
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
        },
        {
          label: "Inactive Buses",
          value: dashboardData.buses.inactive.toLocaleString(),
          icon: XCircle,
          color: "red",
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
        },
        {
          label: "Active Routes",
          value: dashboardData.routes.active.toLocaleString(),
          icon: Route,
          color: "sky",
          bgColor: "bg-sky-50",
          iconColor: "text-sky-600",
        },
        {
          label: "Total Bookings",
          value: dashboardData.bookings.total.toLocaleString(),
          icon: Calendar,
          color: "emerald",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600",
        },
        {
          label: "Confirmed Bookings",
          value: dashboardData.bookings.confirmed.toLocaleString(),
          icon: CheckCircle,
          color: "green",
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
        },
        {
          label: "Cancelled Bookings",
          value: dashboardData.bookings.cancelled.toLocaleString(),
          icon: XCircle,
          color: "red",
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
        },
        {
          label: "This Month's Bookings",
          value: dashboardData.bookings.thisMonth.toLocaleString(),
          icon: Clock,
          color: "blue",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
        },
        {
          label: "Total Revenue",
          value: `₹${dashboardData.revenue.total.toLocaleString('en-IN')}`,
          icon: DollarSign,
          color: "teal",
          bgColor: "bg-teal-50",
          iconColor: "text-teal-600",
        },
        {
          label: "This Month's Revenue",
          value: `₹${dashboardData.revenue.thisMonth.toLocaleString('en-IN')}`,
          icon: TrendingUp,
          color: "cyan",
          bgColor: "bg-cyan-50",
          iconColor: "text-cyan-600",
        },
      ]
    : Array(13).fill({ label: "—", value: "—", icon: BarChart3, color: "slate", bgColor: "bg-slate-50", iconColor: "text-slate-400" });

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600">Platform-wide analytics and management</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                Welcome, <span className="font-semibold text-slate-900">{user?.name || user?.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-700 text-center">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 mx-auto block px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className={`${stat.bgColor} rounded-xl p-6 border border-slate-200 transition-all duration-300 hover:shadow-md`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tabs */}
            <div className="mt-8">
              <div className="border-b border-slate-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "overview"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "users"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    Users Management
                  </button>
                </nav>
              </div>

              {/* Overview Tab Content */}
              {activeTab === "overview" && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User & Vendor Summary */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-slate-600" />
                        User & Vendor Overview
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">Total Users</span>
                          <span className="font-bold text-slate-900">{dashboardData.users.total}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">Registered Vendors</span>
                          <span className="font-bold text-slate-900">{dashboardData.users.totalVendors}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-600">Pending Approvals</span>
                          <span className="font-bold text-amber-600">{dashboardData.users.pendingVendorApprovals}</span>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Summary */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-slate-600" />
                        Revenue Overview
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">Total Revenue</span>
                          <span className="font-bold text-teal-600">
                            ₹{dashboardData.revenue.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">This Month</span>
                          <span className="font-bold text-cyan-600">
                            ₹{dashboardData.revenue.thisMonth.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-600">Growth</span>
                          <span className="font-bold text-green-600">
                            {dashboardData.revenue.total > 0 
                              ? `${((dashboardData.revenue.thisMonth / dashboardData.revenue.total) * 100).toFixed(1)}% of total`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-600" />
                        Booking Overview
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">Total Bookings</span>
                          <span className="font-bold text-slate-900">{dashboardData.bookings.total}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">Confirmed</span>
                          <span className="font-bold text-green-600">{dashboardData.bookings.confirmed}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">Cancelled</span>
                          <span className="font-bold text-red-600">{dashboardData.bookings.cancelled}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-600">This Month</span>
                          <span className="font-bold text-blue-600">{dashboardData.bookings.thisMonth}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bus & Route Summary */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Bus className="w-5 h-5 text-slate-600" />
                        Fleet Overview
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">Total Buses</span>
                          <span className="font-bold text-lime-600">{dashboardData.buses.total}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">Active Buses</span>
                          <span className="font-bold text-green-600">{dashboardData.buses.active}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">Inactive Buses</span>
                          <span className="font-bold text-red-600">{dashboardData.buses.inactive}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-600">Active Routes</span>
                          <span className="font-bold text-sky-600">{dashboardData.routes.active}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Refresh Button */}
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={fetchDashboardData}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-indigo-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      Refresh Dashboard
                    </button>
                  </div>
                </>
              )}

              {/* Users Tab Content */}
              {activeTab === "users" && (
                <div>
                  {/* User Filters */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={userFilters.search}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                          />
                        </div>
                      </div>
                      <select
                        value={userFilters.role}
                        onChange={(e) => setUserFilters(prev => ({ ...prev, role: e.target.value }))}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="">All Roles</option>
                        <option value="user">Users</option>
                        <option value="vendor">Vendors</option>
                        <option value="admin">Admins</option>
                      </select>
                      <select
                        value={userFilters.isActive}
                        onChange={(e) => setUserFilters(prev => ({ ...prev, isActive: e.target.value }))}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Banned</option>
                      </select>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {usersLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Users Found</h3>
                        <p className="text-sm text-slate-600">Try adjusting your search or filter criteria</p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created At</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                              {users.map((u) => (
                                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{u.name}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{u.email}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{u.phoneNo || "—"}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      u.role === "admin" 
                                        ? "bg-indigo-100 text-indigo-800" 
                                        : u.role === "vendor"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}>
                                      {u.role}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      u.isActive 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                      {u.isActive ? "Active" : "Banned"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        {usersPagination.totalPages > 1 && (
                          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                              Showing {(usersPagination.currentPage - 1) * usersPagination.limit + 1} to{" "}
                              {Math.min(usersPagination.currentPage * usersPagination.limit, usersPagination.totalCount)} of{" "}
                              {usersPagination.totalCount} users
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handlePageChange(usersPagination.currentPage - 1)}
                                disabled={usersPagination.currentPage === 1}
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <span className="text-sm font-medium text-slate-900">
                                Page {usersPagination.currentPage} of {usersPagination.totalPages}
                              </span>
                              <button
                                onClick={() => handlePageChange(usersPagination.currentPage + 1)}
                                disabled={usersPagination.currentPage === usersPagination.totalPages}
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
