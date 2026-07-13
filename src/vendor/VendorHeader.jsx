import React, { useState } from "react";
import { LogOut, Calendar, X, AlertCircle, RefreshCw } from "lucide-react";
import api from "../api/axios";

export default function VendorHeader({ user, onLogout, isVendorApproved, vendorApprovalStatus }) {
  const [requestingReapproval, setRequestingReapproval] = useState(false);
  const [reapprovalError, setReapprovalError] = useState("");
  const [reapprovalSuccess, setReapprovalSuccess] = useState("");

  const handleRequestReapproval = async () => {
    setRequestingReapproval(true);
    setReapprovalError("");
    setReapprovalSuccess("");
    try {
      const res = await api.post("/api/users/vendor/request-reapproval");
      if (res.data.success) {
        setReapprovalSuccess(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setReapprovalError(res.data.message || "Failed to request re-approval");
      }
    } catch (err) {
      setReapprovalError(err.response?.data?.message || "Failed to request re-approval");
    } finally {
      setRequestingReapproval(false);
    }
  };

  const rejectionReason = user?.rejectionReason || "";

  return (
    <>
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="w-full px-6 sm:px-12 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-600 to-lime-500 flex items-center justify-center text-white font-black text-xl shadow-md">
              V
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">Vendor Dashboard</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Welcome back, {user?.name || "Vendor"}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-600 hover:border-red-200 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-5 py-2.5 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Vendor Approval Status Banner */}
      {!isVendorApproved && (
        <div className={`mx-6 sm:mx-12 lg:mx-20 mt-6 p-4 rounded-xl border-2 ${
          vendorApprovalStatus === "REJECTED" 
            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" 
            : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              vendorApprovalStatus === "REJECTED"
                ? "bg-red-100 dark:bg-red-900/40"
                : "bg-amber-100 dark:bg-amber-900/40"
            }`}>
              {vendorApprovalStatus === "REJECTED" ? (
                <X className="w-5 h-5 text-red-600 dark:text-red-400" />
              ) : (
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-base ${
                vendorApprovalStatus === "REJECTED"
                  ? "text-red-800 dark:text-red-300"
                  : "text-amber-800 dark:text-amber-300"
              }`}>
                {vendorApprovalStatus === "REJECTED" 
                  ? "Vendor Account Rejected" 
                  : "Account Pending Approval"}
              </h3>
              {rejectionReason && (
                <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-400">
                      <span className="font-medium">Reason:</span> {rejectionReason}
                    </p>
                  </div>
                </div>
              )}
              <p className={`text-sm mt-2 ${
                vendorApprovalStatus === "REJECTED"
                  ? "text-red-700 dark:text-red-400"
                  : "text-amber-700 dark:text-amber-400"
              }`}>
                {vendorApprovalStatus === "REJECTED"
                  ? "Your vendor account has been rejected by the admin. You can request re-approval after addressing the issues."
                  : "Your vendor account is currently pending admin approval. You will be able to create buses, routes, and schedules once your account is approved."}
              </p>
              {vendorApprovalStatus === "REJECTED" && (
                <div className="mt-4 flex items-center gap-3">
                  {reapprovalError && (
                    <p className="text-sm text-red-600">{reapprovalError}</p>
                  )}
                  {reapprovalSuccess && (
                    <p className="text-sm text-green-600">{reapprovalSuccess}</p>
                  )}
                  <button
                    onClick={handleRequestReapproval}
                    disabled={requestingReapproval}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-900/30 hover:bg-lime-100 dark:hover:bg-lime-900/40 border border-lime-200 dark:border-lime-800 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${requestingReapproval ? "animate-spin" : ""}`} />
                    {requestingReapproval ? "Requesting..." : "Request Re-approval"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
