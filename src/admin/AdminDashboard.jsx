import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users, Bus, Route, Calendar, DollarSign, TrendingUp, LogOut, RefreshCw,
  AlertCircle, CheckCircle, XCircle, Clock, BarChart3, Search, ChevronLeft,
  ChevronRight, Eye, Trash2, Ban, Shield, Store, ThumbsUp, ThumbsDown,
  Power, X, MapPin, IndianRupee, UserCheck, Ticket,
} from "lucide-react";
import api from "../api/axios";

export default function AdminDashboard() {
  const { user, logout, authLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState(null);

  // ── User Management State ──
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPagination, setUsersPagination] = useState({ totalCount: 0, totalPages: 0, currentPage: 1, limit: 20 });
  const [userFilters, setUserFilters] = useState({ role: "", isActive: "", search: "" });

  // ── Vendor Management State ──
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [vendorsPagination, setVendorsPagination] = useState({ totalCount: 0, totalPages: 0, currentPage: 1, limit: 20 });
  const [vendorFilters, setVendorFilters] = useState({ approvalStatus: "", search: "" });

  // ── Bus Management State ──
  const [buses, setBuses] = useState([]);
  const [busesLoading, setBusesLoading] = useState(false);
  const [busesPagination, setBusesPagination] = useState({ totalCount: 0, totalPages: 0, currentPage: 1, limit: 20 });
  const [busFilters, setBusFilters] = useState({ status: "", search: "" });

  // ── Booking Management State ──
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsPagination, setBookingsPagination] = useState({ totalCount: 0, totalPages: 0, currentPage: 1, limit: 20 });
  const [bookingFilters, setBookingFilters] = useState({ status: "", search: "" });

  // ── Modal States ──
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedVendorStats, setSelectedVendorStats] = useState(null);
  const [showVendorStatsModal, setShowVendorStatsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Toast Helper ──
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Dashboard Stats ──
  const fetchDashboardData = async () => {
    setLoading(true); setError("");
    try {
      const res = await api.get("/api/v1/admin/dashboard");
      if (res.data.success) setDashboardData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally { setLoading(false); }
  };

  // ── User API Functions ──
  const fetchUsers = async (page = 1) => {
    setUsersLoading(true);
    try {
      const params = { page, limit: 20, ...(userFilters.role && { role: userFilters.role }), ...(userFilters.isActive !== "" && { isActive: userFilters.isActive === "true" }), ...(userFilters.search && { search: userFilters.search }) };
      const res = await api.get("/api/v1/admin/users", { params });
      if (res.data.success) { setUsers(res.data.data.users); setUsersPagination(res.data.data.pagination); }
    } catch (err) { console.error("Error fetching users:", err); }
    finally { setUsersLoading(false); }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const res = await api.get(`/api/v1/admin/users/${userId}`);
      if (res.data.success) { setSelectedUser(res.data.data); setShowUserModal(true); }
    } catch (err) { showToast(err.response?.data?.message || "Failed to load user details", "error"); }
  };

  const toggleUserActive = async (userId, currentStatus) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/v1/admin/users/${userId}/toggle-active`);
      if (res.data.success) { showToast(`User ${currentStatus ? "banned" : "unbanned"} successfully`); fetchUsers(usersPagination.currentPage); }
    } catch (err) { showToast(err.response?.data?.message || "Failed to update user", "error"); }
    finally { setActionLoading(false); }
  };

  const changeUserRole = async (userId, newRole) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/v1/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) { showToast(`Role changed to ${newRole}`); fetchUsers(usersPagination.currentPage); }
    } catch (err) { showToast(err.response?.data?.message || "Failed to change role", "error"); }
    finally { setActionLoading(false); }
  };

  const deleteUser = async (userId) => {
    setActionLoading(true);
    try {
      const res = await api.delete(`/api/v1/admin/users/${userId}`);
      if (res.data.success) { showToast("User deleted successfully"); setShowDeleteModal(false); setDeleteTarget(null); fetchUsers(usersPagination.currentPage); }
    } catch (err) { showToast(err.response?.data?.message || "Failed to delete user", "error"); }
    finally { setActionLoading(false); }
  };

  // ── Vendor API Functions ──
  const fetchVendors = async (page = 1) => {
    setVendorsLoading(true);
    try {
      const params = { page, limit: 20, ...(vendorFilters.approvalStatus && { approvalStatus: vendorFilters.approvalStatus }), ...(vendorFilters.search && { search: vendorFilters.search }) };
      const res = await api.get("/api/v1/admin/vendors", { params });
      if (res.data.success) { setVendors(res.data.data.vendors); setVendorsPagination(res.data.data.pagination); }
    } catch (err) { console.error("Error fetching vendors:", err); }
    finally { setVendorsLoading(false); }
  };

  const fetchVendorStats = async (vendorId) => {
    try {
      const res = await api.get(`/api/v1/admin/vendors/${vendorId}/stats`);
      if (res.data.success) { setSelectedVendorStats(res.data.data); setShowVendorStatsModal(true); }
    } catch (err) { showToast(err.response?.data?.message || "Failed to load vendor stats", "error"); }
  };

  const approveVendor = async (vendorId) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/v1/admin/vendors/${vendorId}/approve`);
      if (res.data.success) { showToast("Vendor approved successfully"); fetchVendors(vendorsPagination.currentPage); }
    } catch (err) { showToast(err.response?.data?.message || "Failed to approve vendor", "error"); }
    finally { setActionLoading(false); }
  };

  const rejectVendor = async (vendorId) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/v1/admin/vendors/${vendorId}/reject`);
      if (res.data.success) { showToast("Vendor rejected"); fetchVendors(vendorsPagination.currentPage); }
    } catch (err) { showToast(err.response?.data?.message || "Failed to reject vendor", "error"); }
    finally { setActionLoading(false); }
  };

  // ── Bus API Functions ──
  const fetchBuses = async (page = 1) => {
    setBusesLoading(true);
    try {
      const params = { page, limit: 20, ...(busFilters.status && { status: busFilters.status }), ...(busFilters.search && { search: busFilters.search }) };
      const res = await api.get("/api/v1/admin/buses", { params });
      if (res.data.success) { setBuses(res.data.data.buses); setBusesPagination(res.data.data.pagination); }
    } catch (err) { console.error("Error fetching buses:", err); }
    finally { setBusesLoading(false); }
  };

  const toggleBusStatus = async (busId) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/v1/admin/buses/${busId}/toggle-status`);
      if (res.data.success) { showToast("Bus status toggled"); fetchBuses(busesPagination.currentPage); }
    } catch (err) { showToast(err.response?.data?.message || "Failed to toggle bus status", "error"); }
    finally { setActionLoading(false); }
  };

  // ── Booking API Functions ──
  const fetchBookings = async (page = 1) => {
    setBookingsLoading(true);
    try {
      const params = { page, limit: 20, ...(bookingFilters.status && { status: bookingFilters.status }), ...(bookingFilters.search && { search: bookingFilters.search }) };
      const res = await api.get("/api/v1/admin/bookings", { params });
      if (res.data.success) { setBookings(res.data.data.bookings); setBookingsPagination(res.data.data.pagination); }
    } catch (err) { console.error("Error fetching bookings:", err); }
    finally { setBookingsLoading(false); }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      const res = await api.get(`/api/v1/admin/bookings/${bookingId}`);
      if (res.data.success) { setSelectedBooking(res.data.data); setShowBookingModal(true); }
    } catch (err) { showToast(err.response?.data?.message || "Failed to load booking details", "error"); }
  };

  // ── Effects ──
  useEffect(() => { if (!authLoading && user && user.role === "admin") fetchDashboardData(); }, [user, authLoading]);
  useEffect(() => { if (activeTab === "users") fetchUsers(1); }, [activeTab, userFilters.role, userFilters.isActive]);
  useEffect(() => { if (activeTab === "vendors") fetchVendors(1); }, [activeTab, vendorFilters.approvalStatus]);
  useEffect(() => { if (activeTab === "buses") fetchBuses(1); }, [activeTab, busFilters.status]);
  useEffect(() => { if (activeTab === "bookings") fetchBookings(1); }, [activeTab, bookingFilters.status]);

  if (!authLoading && (!user || user.role !== "admin")) { navigate("/MainPage"); return null; }
  if (authLoading || !user) return null;

  const handleLogout = () => { logout(); navigate("/"); };
  const handleSearchChange = (e) => setUserFilters(prev => ({ ...prev, search: e.target.value }));
  const handleSearchKeyDown = (e) => { if (e.key === "Enter") fetchUsers(1); };
  const handlePageChange = (newPage, type = "users") => {
    const p = type === "users" ? usersPagination : type === "vendors" ? vendorsPagination : type === "buses" ? busesPagination : bookingsPagination;
    if (newPage >= 1 && newPage <= p.totalPages) {
      if (type === "users") fetchUsers(newPage);
      else if (type === "vendors") fetchVendors(newPage);
      else if (type === "buses") fetchBuses(newPage);
      else fetchBookings(newPage);
    }
  };

  // ── Stats Cards ──
  const stats = dashboardData ? [
    { label: "Total Users", value: dashboardData.users.total.toLocaleString(), icon: Users, bgColor: "bg-indigo-50 dark:bg-indigo-900/20", iconColor: "text-indigo-600 dark:text-indigo-400" },
    { label: "Total Vendors", value: dashboardData.users.totalVendors.toLocaleString(), icon: Store, bgColor: "bg-purple-50 dark:bg-purple-900/20", iconColor: "text-purple-600 dark:text-purple-400" },
    { label: "Pending Approvals", value: dashboardData.users.pendingVendorApprovals.toLocaleString(), icon: AlertCircle, bgColor: "bg-amber-50 dark:bg-amber-900/20", iconColor: "text-amber-600 dark:text-amber-400" },
    { label: "Total Buses", value: dashboardData.buses.total.toLocaleString(), icon: Bus, bgColor: "bg-lime-50 dark:bg-lime-900/20", iconColor: "text-lime-600 dark:text-lime-400" },
    { label: "Active Buses", value: dashboardData.buses.active.toLocaleString(), icon: CheckCircle, bgColor: "bg-green-50 dark:bg-green-900/20", iconColor: "text-green-600 dark:text-green-400" },
    { label: "Total Bookings", value: dashboardData.bookings.total.toLocaleString(), icon: Calendar, bgColor: "bg-emerald-50 dark:bg-emerald-900/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
    { label: "Total Revenue", value: `₹${dashboardData.revenue.total.toLocaleString('en-IN')}`, icon: DollarSign, bgColor: "bg-teal-50 dark:bg-teal-900/20", iconColor: "text-teal-600 dark:text-teal-400" },
    { label: "This Month", value: `₹${dashboardData.revenue.thisMonth.toLocaleString('en-IN')}`, icon: TrendingUp, bgColor: "bg-cyan-50 dark:bg-cyan-900/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
  ] : [];

  // ── Pagination Component ──
  const Pagination = ({ pagination, type }) => (
    pagination.totalPages > 1 && (
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total)
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handlePageChange(pagination.currentPage - 1, type)} disabled={pagination.currentPage === 1} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => handlePageChange(pagination.currentPage + 1, type)} disabled={pagination.currentPage === pagination.totalPages} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-[100] px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Platform-wide analytics and management</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">Welcome, <span className="font-semibold text-slate-900 dark:text-white">{user?.name || user?.email}</span></span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
            <p className="text-red-700 dark:text-red-400 text-center">{error}</p>
            <button onClick={fetchDashboardData} className="mt-4 mx-auto block px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-lg">Try Again</button>
          </div>
        )}

        {!loading && !error && (<>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => { const Icon = stat.icon; return (
              <div key={i} className={`${stat.bgColor} rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/50 dark:bg-slate-800/50"><Icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
                  <div><p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p><p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p></div>
                </div>
              </div>
            ); })}
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              {["overview", "users", "vendors", "buses", "bookings"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${activeTab === tab ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5" /> User Overview</h3>
                <div className="space-y-3">
                  {[["Total Users", dashboardData.users.total], ["Vendors", dashboardData.users.totalVendors], ["Pending Approvals", dashboardData.users.pendingVendorApprovals]].map(([l, v]) => (
                    <div key={l} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"><span className="text-slate-600 dark:text-slate-400">{l}</span><span className="font-bold text-slate-900 dark:text-white">{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5" /> Revenue</h3>
                <div className="space-y-3">
                  {[["Total Revenue", `₹${dashboardData.revenue.total.toLocaleString('en-IN')}`], ["This Month", `₹${dashboardData.revenue.thisMonth.toLocaleString('en-IN')}`]].map(([l, v]) => (
                    <div key={l} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"><span className="text-slate-600 dark:text-slate-400">{l}</span><span className="font-bold text-teal-600 dark:text-teal-400">{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" /> Bookings</h3>
                <div className="space-y-3">
                  {[["Total", dashboardData.bookings.total], ["Confirmed", dashboardData.bookings.confirmed], ["Cancelled", dashboardData.bookings.cancelled], ["This Month", dashboardData.bookings.thisMonth]].map(([l, v]) => (
                    <div key={l} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"><span className="text-slate-600 dark:text-slate-400">{l}</span><span className="font-bold text-slate-900 dark:text-white">{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Bus className="w-5 h-5" /> Fleet</h3>
                <div className="space-y-3">
                  {[["Total Buses", dashboardData.buses.total], ["Active", dashboardData.buses.active], ["Inactive", dashboardData.buses.inactive], ["Active Routes", dashboardData.routes.active]].map(([l, v]) => (
                    <div key={l} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"><span className="text-slate-600 dark:text-slate-400">{l}</span><span className="font-bold text-slate-900 dark:text-white">{v}</span></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── USERS TAB ── */}
          {activeTab === "users" && (
            <div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search by name or email..." value={userFilters.search} onChange={handleSearchChange} onKeyDown={handleSearchKeyDown} className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <select value={userFilters.role} onChange={(e) => setUserFilters(p => ({ ...p, role: e.target.value }))} className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm">
                    <option value="">All Roles</option><option value="user">Users</option><option value="vendor">Vendors</option><option value="admin">Admins</option>
                  </select>
                  <select value={userFilters.isActive} onChange={(e) => setUserFilters(p => ({ ...p, isActive: e.target.value }))} className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm">
                    <option value="">All Status</option><option value="true">Active</option><option value="false">Banned</option>
                  </select>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {usersLoading ? <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
                : users.length === 0 ? <div className="text-center py-12"><Users className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-600 dark:text-slate-400">No users found</p></div>
                : (<><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-900/50"><tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {users.map(u => (<tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{u.name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="px-4 py-3"><select value={u.role} onChange={(e) => changeUserRole(u._id, e.target.value)} disabled={actionLoading} className="text-xs px-2 py-1 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                        <option value="user">user</option><option value="vendor">vendor</option><option value="admin">admin</option>
                      </select></td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${u.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"}`}>{u.isActive ? "Active" : "Banned"}</span></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1">
                        <button onClick={() => fetchUserDetails(u._id)} title="View" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => toggleUserActive(u._id, u.isActive)} disabled={actionLoading} title={u.isActive ? "Ban" : "Unban"} className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg"><Ban className="w-4 h-4" /></button>
                        <button onClick={() => { setDeleteTarget(u); setShowDeleteModal(true); }} title="Delete" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div></td>
                    </tr>))}
                  </tbody>
                </table></div><Pagination pagination={usersPagination} type="users" /></>)}
              </div>
            </div>
          )}

          {/* ── VENDORS TAB ── */}
          {activeTab === "vendors" && (
            <div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search vendors..." value={vendorFilters.search} onChange={(e) => setVendorFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") fetchVendors(1); }} className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <select value={vendorFilters.approvalStatus} onChange={(e) => setVendorFilters(p => ({ ...p, approvalStatus: e.target.value }))} className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm">
                    <option value="">All Status</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {vendorsLoading ? <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
                : vendors.length === 0 ? <div className="text-center py-12"><Store className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-600 dark:text-slate-400">No vendors found</p></div>
                : (<><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-900/50"><tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">GST</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {vendors.map(v => (<tr key={v._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{v.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{v.companyName || "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{v.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 font-mono text-xs">{v.gstNumber || "—"}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${v.vendorApprovalStatus === "APPROVED" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : v.vendorApprovalStatus === "REJECTED" ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400"}`}>{v.vendorApprovalStatus}</span></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1">
                        <button onClick={() => fetchVendorStats(v._id)} title="Stats" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"><BarChart3 className="w-4 h-4" /></button>
                        {v.vendorApprovalStatus === "PENDING" && (<><button onClick={() => approveVendor(v._id)} disabled={actionLoading} title="Approve" className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"><ThumbsUp className="w-4 h-4" /></button><button onClick={() => rejectVendor(v._id)} disabled={actionLoading} title="Reject" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><ThumbsDown className="w-4 h-4" /></button></>)}
                      </div></td>
                    </tr>))}
                  </tbody>
                </table></div><Pagination pagination={vendorsPagination} type="vendors" /></>)}
              </div>
            </div>
          )}

          {/* ── BUSES TAB ── */}
          {activeTab === "buses" && (
            <div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search buses..." value={busFilters.search} onChange={(e) => setBusFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") fetchBuses(1); }} className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <select value={busFilters.status} onChange={(e) => setBusFilters(p => ({ ...p, status: e.target.value }))} className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm">
                    <option value="">All Status</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {busesLoading ? <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
                : buses.length === 0 ? <div className="text-center py-12"><Bus className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-600 dark:text-slate-400">No buses found</p></div>
                : (<><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-900/50"><tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Bus Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Bus Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Vendor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Route</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Seats</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Action</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {buses.map(b => (<tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{b.busName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 font-mono">{b.busNumber}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{b.vendorId?.name || b.vendorId?.companyName || "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{b.routeId ? `${b.routeId.source?.city || b.routeId.source} → ${b.routeId.destination?.city || b.routeId.destination}` : "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{b.totalSeats || b.seats?.length || 0}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${b.status === "ACTIVE" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"}`}>{b.status || "ACTIVE"}</span></td>
                      <td className="px-4 py-3"><button onClick={() => toggleBusStatus(b._id)} disabled={actionLoading} title="Toggle Status" className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg"><Power className="w-4 h-4" /></button></td>
                    </tr>))}
                  </tbody>
                </table></div><Pagination pagination={busesPagination} type="buses" /></>)}
              </div>
            </div>
          )}

          {/* ── BOOKINGS TAB ── */}
          {activeTab === "bookings" && (
            <div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search by booking ID..." value={bookingFilters.search} onChange={(e) => setBookingFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") fetchBookings(1); }} className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <select value={bookingFilters.status} onChange={(e) => setBookingFilters(p => ({ ...p, status: e.target.value }))} className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm">
                    <option value="">All Status</option><option value="PENDING">Pending</option><option value="CONFIRMED">Confirmed</option><option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {bookingsLoading ? <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
                : bookings.length === 0 ? <div className="text-center py-12"><Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-600 dark:text-slate-400">No bookings found</p></div>
                : (<><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-900/50"><tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Booking ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Route</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Seats</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Action</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {bookings.map(b => (<tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-mono text-indigo-600 dark:text-indigo-400">{b.bookingId}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{b.userId?.name || b.userId?.email || "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{b.scheduleId?.routeId ? `${b.scheduleId.routeId.source?.city || b.scheduleId.routeId.source} → ${b.scheduleId.routeId.destination?.city || b.scheduleId.routeId.destination}` : "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{b.seatNumbers?.join(", ")}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">₹{b.totalFare?.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${b.bookingStatus === "CONFIRMED" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : b.bookingStatus === "CANCELLED" ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400"}`}>{b.bookingStatus}</span></td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><button onClick={() => fetchBookingDetails(b._id)} title="View Details" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"><Eye className="w-4 h-4" /></button></td>
                    </tr>))}
                  </tbody>
                </table></div><Pagination pagination={bookingsPagination} type="bookings" /></>)}
              </div>
            </div>
          )}
        </>)}
      </main>

      {/* ── MODALS ── */}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowUserModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><UserCheck className="w-5 h-5" /> User Details</h3>
              <button onClick={() => setShowUserModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-3">
              {[["Name", selectedUser.name], ["Email", selectedUser.email], ["Phone", selectedUser.phoneNo || "—"], ["Role", selectedUser.role], ["Status", selectedUser.isActive ? "Active" : "Banned"], ["Email Verified", selectedUser.isEmailVerified ? "Yes" : "No"], ["Company", selectedUser.companyName || "—"], ["GST", selectedUser.gstNumber || "—"], ["Joined", new Date(selectedUser.createdAt).toLocaleDateString()]].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"><span className="text-sm text-slate-500 dark:text-slate-400">{l}</span><span className="text-sm font-medium text-slate-900 dark:text-white">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" /></div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete User?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">This will permanently delete <strong>{deleteTarget.name || deleteTarget.email}</strong> and all their data. This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }} className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg">Cancel</button>
              <button onClick={() => deleteUser(deleteTarget._id)} disabled={actionLoading} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50">{actionLoading ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Stats Modal */}
      {showVendorStatsModal && selectedVendorStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowVendorStatsModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Vendor Stats</h3>
              <button onClick={() => setShowVendorStatsModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-3">
              {Object.entries(selectedVendorStats).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{typeof value === 'number' ? value.toLocaleString() : String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowBookingModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Ticket className="w-5 h-5" /> Booking Details</h3>
              <button onClick={() => setShowBookingModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-3">
              {[["Booking ID", selectedBooking.bookingId], ["Status", selectedBooking.bookingStatus], ["User", selectedBooking.userId?.name || selectedBooking.userId?.email || "—"], ["Route", selectedBooking.scheduleId?.routeId ? `${selectedBooking.scheduleId.routeId.source?.city || selectedBooking.scheduleId.routeId.source} → ${selectedBooking.scheduleId.routeId.destination?.city || selectedBooking.scheduleId.routeId.destination}` : "—"], ["Seats", selectedBooking.seatNumbers?.join(", ")], ["Total Fare", `₹${selectedBooking.totalFare?.toLocaleString()}`], ["Journey Date", selectedBooking.scheduleId?.departureDate ? new Date(selectedBooking.scheduleId.departureDate).toLocaleDateString() : "—"], ["Created", new Date(selectedBooking.createdAt).toLocaleString()], ["Cancelled", selectedBooking.cancelledAt ? new Date(selectedBooking.cancelledAt).toLocaleString() : "—"]].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"><span className="text-sm text-slate-500 dark:text-slate-400">{l}</span><span className="text-sm font-medium text-slate-900 dark:text-white text-right max-w-[60%]">{v || "—"}</span></div>
              ))}
              {selectedBooking.passengers?.length > 0 && (<>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-2">Passengers</h4>
                {selectedBooking.passengers.map((p, i) => (<div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-sm">
                  <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                  <p className="text-slate-500 dark:text-slate-400">Seat: {p.seatNumber} | {p.gender} | Age: {p.age}</p>
                </div>))}
              </>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
