import { useState, useEffect } from "react";
import { Search, Users, Ban, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/axios";

export default function AdminUsers({ showToast, actionLoading }) {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPagination, setUsersPagination] = useState({ totalCount: 0, totalPages: 0, currentPage: 1, limit: 20 });
  const [userFilters, setUserFilters] = useState({ role: "", isActive: "", search: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
      const res = await api.get("/api/v1/admin/users", { params });
      if (res.data.success) { 
        setUsers(res.data.data.users); 
        setUsersPagination(res.data.data.pagination); 
      }
    } catch (err) { 
      console.error("Error fetching users:", err); 
    } finally { 
      setUsersLoading(false); 
    }
  };

  const toggleUserActive = async (userId, currentStatus) => {
    try {
      const res = await api.patch(`/api/v1/admin/users/${userId}/toggle-active`);
      if (res.data.success) { 
        showToast(`User ${currentStatus ? "banned" : "unbanned"} successfully`); 
        fetchUsers(usersPagination.currentPage); 
      }
    } catch (err) { 
      showToast(err.response?.data?.message || "Failed to update user", "error"); 
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const res = await api.patch(`/api/v1/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) { 
        showToast(`Role changed to ${newRole}`); 
        fetchUsers(usersPagination.currentPage); 
      }
    } catch (err) { 
      showToast(err.response?.data?.message || "Failed to change role", "error"); 
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await api.delete(`/api/v1/admin/users/${userId}`);
      if (res.data.success) { 
        showToast("User deleted successfully"); 
        setShowDeleteModal(false); 
        setDeleteTarget(null); 
        fetchUsers(usersPagination.currentPage); 
      }
    } catch (err) { 
      showToast(err.response?.data?.message || "Failed to delete user", "error"); 
    }
  };

  const handleSearchChange = (e) => setUserFilters(prev => ({ ...prev, search: e.target.value }));
  const handleSearchKeyDown = (e) => { if (e.key === "Enter") fetchUsers(1); };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= usersPagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [userFilters.role, userFilters.isActive]);

  const Pagination = () => (
    usersPagination.totalPages > 1 && (
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Page {usersPagination.currentPage} of {usersPagination.totalPages} ({usersPagination.totalCount} total)
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(usersPagination.currentPage - 1)} 
            disabled={usersPagination.currentPage === 1} 
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handlePageChange(usersPagination.currentPage + 1)} 
            disabled={usersPagination.currentPage === usersPagination.totalPages} 
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  );

  return (
    <div>
      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={userFilters.search} 
              onChange={handleSearchChange} 
              onKeyDown={handleSearchKeyDown} 
              className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <select 
            value={userFilters.role} 
            onChange={(e) => setUserFilters(p => ({ ...p, role: e.target.value }))} 
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="vendor">Vendors</option>
            <option value="admin">Admins</option>
          </select>
          <select 
            value={userFilters.isActive} 
            onChange={(e) => setUserFilters(p => ({ ...p, isActive: e.target.value }))} 
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {usersLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-md font-medium text-slate-900 dark:text-white">{u.name || "—"}</td>
                      <td className="px-4 py-3 text-md text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="px-4 py-3">
                        <select 
                          value={u.role} 
                          onChange={(e) => changeUserRole(u._id, e.target.value)} 
                          disabled={actionLoading} 
                          className="text-xs px-2 py-1 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        >
                          <option value="user">user</option>
                          <option value="vendor">vendor</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${u.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"}`}>
                          {u.isActive ? "Active" : "Banned"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => toggleUserActive(u._id, u.isActive)} 
                            disabled={actionLoading} 
                            title={u.isActive ? "Ban" : "Unban"} 
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setDeleteTarget(u); setShowDeleteModal(true); }} 
                            title="Delete" 
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete User</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteUser(deleteTarget._id)}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
