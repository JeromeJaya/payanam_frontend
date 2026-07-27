import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart3, Search, Store, ThumbsUp, ThumbsDown, X,
} from "lucide-react";
import api from "../api/axios";
import AdminChatbot from "./AdminChatbot";
import AdminUsers from "./AdminUsers";
import { AdminBuses, AdminFlights, AdminBookings } from "./components";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import AdminOverview from "./components/AdminOverview";
import Pagination from "./components/Pagination";
import { getVendorStatusClasses, formatVendorStat } from "./components/vendorUtils.jsx";

export default function AdminDashboard() {
  const { user, logout, authLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState(null);

  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [vendorsPagination, setVendorsPagination] = useState({ totalCount: 0, totalPages: 0, currentPage: 1, limit: 20 });
  const [vendorFilters, setVendorFilters] = useState({ approvalStatus: "", search: "" });

  const [selectedVendorStats, setSelectedVendorStats] = useState(null);
  const [showVendorStatsModal, setShowVendorStatsModal] = useState(false);
  const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);
  const [pendingRejectVendor, setPendingRejectVendor] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDashboardData = async () => {
    setLoading(true); setError("");
    try {
      const res = await api.get("/api/v1/admin/dashboard");
      if (res.data.success) setDashboardData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally { setLoading(false); }
  };

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

  const confirmRejectVendor = async (vendorId, reason) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/v1/admin/vendors/${vendorId}/reject`, { reason });
      if (res.data.success) {
        showToast("Vendor rejected");
        fetchVendors(vendorsPagination.currentPage);
        setShowRejectReasonModal(false);
        setPendingRejectVendor(null);
        setRejectReason("");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to reject vendor", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (vendorId) => {
    setPendingRejectVendor({ _id: vendorId, name: "" });
    setShowRejectReasonModal(true);
  };

  useEffect(() => { if (!authLoading && user?.role === "admin") fetchDashboardData(); }, [user, authLoading]);
  useEffect(() => { if (activeTab === "vendors") fetchVendors(1); }, [activeTab, vendorFilters.approvalStatus]);

  if (!authLoading && user?.role !== "admin") { navigate("/MainPage"); return null; }
  if (authLoading || !user) return null;

  const handleLogout = () => { logout(); navigate("/"); };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= vendorsPagination.totalPages) {
      fetchVendors(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {toast && (
        <div className={`fixed top-20 right-4 z-[100] px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 flex flex-col min-h-screen">
          <AdminHeader user={user} onLogout={handleLogout} />

          <main className="px-4 sm:px-6 lg:px-8 py-8 pb-20">
            {loading && <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}
            {error && !loading && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
                <p className="text-red-700 dark:text-red-400 text-center">{error}</p>
                <button onClick={fetchDashboardData} className="mt-4 mx-auto block px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-lg">Try Again</button>
              </div>
            )}

            {!loading && !error && (<>
              {activeTab === "overview" && <AdminOverview dashboardData={dashboardData} />}

              {activeTab === "users" && (
                <AdminUsers showToast={showToast} actionLoading={actionLoading} />
              )}

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
                          <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVendorStatusClasses(v.vendorApprovalStatus)}`}>{v.vendorApprovalStatus}</span></td>
                          <td className="px-4 py-3"><div className="flex items-center gap-1">
                            <button onClick={() => fetchVendorStats(v._id)} title="Stats" className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"><BarChart3 className="w-4 h-4" /></button>
                            {v.vendorApprovalStatus === "PENDING" && (<><button onClick={() => approveVendor(v._id)} disabled={actionLoading} title="Approve" className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"><ThumbsUp className="w-4 h-4" /></button><button onClick={() => handleRejectClick(v._id)} disabled={actionLoading} title="Reject" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><ThumbsDown className="w-4 h-4" /></button></>)}
                          </div></td>
                        </tr>))}
                      </tbody>
                    </table></div><Pagination pagination={vendorsPagination} type="vendors" onPageChange={handlePageChange} /></>)}
                  </div>
                </div>
              )}

              {activeTab === "buses" && (
                <AdminBuses showToast={showToast} actionLoading={actionLoading} />
              )}

              {activeTab === "flights" && (
                <AdminFlights showToast={showToast} actionLoading={actionLoading} />
              )}

              {activeTab === "bookings" && (
                <AdminBookings showToast={showToast} actionLoading={actionLoading} navigate={navigate} />
              )}
            </>)}
          </main>
        </div>
      </div>

      {showVendorStatsModal && selectedVendorStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowVendorStatsModal(false)} role="dialog" aria-modal="true" onKeyDown={(e) => { if (e.key === "Escape") setShowVendorStatsModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Vendor Stats</h3>
              <button onClick={() => setShowVendorStatsModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-3">
              {selectedVendorStats.vendor && (
                <>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-1 mb-1">Vendor Info</div>
                  {[["Name", selectedVendorStats.vendor.name], ["Company", selectedVendorStats.vendor.companyName], ["Email", selectedVendorStats.vendor.email], ["GST", selectedVendorStats.vendor.gstNumber], ["Status", selectedVendorStats.vendor.vendorApprovalStatus], ["Joined", selectedVendorStats.vendor.joinedAt ? new Date(selectedVendorStats.vendor.joinedAt).toLocaleDateString() : "—"]].map(([l, v]) => (
                    <div key={l} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <span className="text-sm text-slate-500 dark:text-slate-400">{l}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{v || "—"}</span>
                    </div>
                  ))}
                </>
              )}
              {selectedVendorStats.stats && (
                <>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-1 mt-4 mb-1">Statistics</div>
                  {Object.entries(selectedVendorStats.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatVendorStat(key, value)}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showRejectReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowRejectReasonModal(false)} role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reject Vendor</h3>
              <button onClick={() => setShowRejectReasonModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Please provide a reason for rejecting this vendor. This will be shown to the vendor.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 outline-none min-h-[100px]"
            />
            <div className="mt-4 flex items-center justify-end gap-3">
              <button onClick={() => setShowRejectReasonModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg">
                Cancel
              </button>
              <button
                onClick={() => confirmRejectVendor(pendingRejectVendor?._id, rejectReason || "No reason provided.")}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Reject Vendor"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminChatbot />
    </div>
  );
}
