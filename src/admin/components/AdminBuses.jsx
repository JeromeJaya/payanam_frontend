import { useState, useEffect } from "react";
import { Bus, Search, Power } from "lucide-react";
import api from "../../api/axios";

const getActiveStatusClasses = (status) =>
  status === "ACTIVE"
    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";

export default function AdminBuses({ showToast, actionLoading }) {
  const [buses, setBuses] = useState([]);
  const [busesLoading, setBusesLoading] = useState(false);
  const [busesPagination, setBusesPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20,
  });
  const [busFilters, setBusFilters] = useState({ status: "", search: "" });

  const fetchBuses = async (page = 1) => {
    setBusesLoading(true);
    try {
      const params = {
        page,
        limit: 20,
        ...(busFilters.status && { status: busFilters.status }),
        ...(busFilters.search && { search: busFilters.search }),
      };
      const res = await api.get("/api/v1/admin/buses", { params });
      if (res.data.success) {
        setBuses(res.data.data.buses);
        setBusesPagination(res.data.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching buses:", err);
    } finally {
      setBusesLoading(false);
    }
  };

  const toggleBusStatus = async (busId) => {
    try {
      const res = await api.patch(`/api/v1/admin/buses/${busId}/toggle-status`);
      if (res.data.success) {
        showToast("Bus status toggled");
        fetchBuses(busesPagination.currentPage);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to toggle bus status", "error");
    }
  };

  const handleSearchChange = (e) =>
    setBusFilters((p) => ({ ...p, search: e.target.value }));

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") fetchBuses(1);
  };

  const handleStatusChange = (e) =>
    setBusFilters((p) => ({ ...p, status: e.target.value }));

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= busesPagination.totalPages) {
      fetchBuses(newPage);
    }
  };

  useEffect(() => {
    fetchBuses(1);
  }, [busFilters.status]);

  const Pagination = () =>
    busesPagination.totalPages > 1 && (
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Page {busesPagination.currentPage} of {busesPagination.totalPages} (
          {busesPagination.totalCount} total)
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(busesPagination.currentPage - 1)}
            disabled={busesPagination.currentPage === 1}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"
          >
            ←
          </button>
          <button
            onClick={() => handlePageChange(busesPagination.currentPage + 1)}
            disabled={busesPagination.currentPage === busesPagination.totalPages}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search buses..."
              value={busFilters.search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <select
            value={busFilters.status}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {busesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : buses.length === 0 ? (
          <div className="text-center py-12">
            <Bus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No buses found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Bus Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Bus Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Vendor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Seats
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {buses.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {b.busName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 font-mono">
                        {b.busNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {b.vendorId?.name || b.vendorId?.companyName || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {b.routeId
                          ? `${b.routeId.source?.city || b.routeId.source} → ${b.routeId.destination?.city || b.routeId.destination}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {b.totalSeats || b.seats?.length || 0}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActiveStatusClasses(b.status)}`}
                        >
                          {b.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleBusStatus(b._id)}
                          disabled={actionLoading}
                          title="Toggle Status"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination />
          </>
        )}
      </div>
    </div>
  );
}