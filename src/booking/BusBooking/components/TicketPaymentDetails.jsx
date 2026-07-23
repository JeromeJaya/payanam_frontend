import { ShieldCheck, Hash, CreditCard, IndianRupee, CheckCircle2, Clock } from "lucide-react";

export default function TicketPaymentDetails({ ticket, meta }) {
  if (!meta?.payment && !ticket?.paymentStatus) return null;

  return (
    <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-700/20 dark:to-blue-900/10 print:bg-transparent">
      <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 sm:mb-4 flex items-center gap-1.5">
        <ShieldCheck size={11} /> Payment Details
      </h4>

      <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 sm:mb-3">
        {(!meta?.payment && !ticket?.paymentStatus) && "Payment verification pending."}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
          <div className="flex items-center gap-1.5 mb-1">
            <Hash size={10} className="text-slate-400 dark:text-slate-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Order ID</span>
          </div>
          <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 truncate" title={meta?.payment?.razorpayOrderId || ticket?.paymentReference}>
            {meta?.payment?.razorpayOrderId || ticket?.paymentReference || "N/A"}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
          <div className="flex items-center gap-1.5 mb-1">
            <CreditCard size={10} className="text-slate-400 dark:text-slate-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Payment ID</span>
          </div>
          <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 truncate" title={meta?.payment?.razorpayPaymentId}>
            {meta?.payment?.razorpayPaymentId || "N/A"}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
          <div className="flex items-center gap-1.5 mb-1">
            <IndianRupee size={10} className="text-slate-400 dark:text-slate-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Amount Paid</span>
          </div>
          <p className="text-md font-black text-emerald-700 dark:text-emerald-400">
            ₹{(meta?.payment?.amount || ticket?.totalFare || 0).toLocaleString()} <span className="text-lg font-medium text-slate-500 dark:text-slate-400 ml-1">{meta?.payment?.currency || "INR"}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 size={10} className="text-slate-400 dark:text-slate-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</span>
          </div>
          {(() => {
            const rawStatus = meta?.payment?.status || ticket?.paymentStatus;
            const status = String(rawStatus || "").trim().toUpperCase();
            const isSuccess = status === "SUCCESS" || status === "CAPTURED";
            const isRefunded = status === "REFUNDED";
            return (
              <span className={`text-xs font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded-md uppercase tracking-wide ${
                isSuccess
                  ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700"
                  : isRefunded
                  ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700"
                  : "text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
              }`}>
                {isSuccess && <CheckCircle2 size={10} />}
                {status || "N/A"}
              </span>
            );
          })()}
        </div>

        {(meta?.payment?.createdAt || ticket?.bookedAt) && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={10} className="text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Payment Date</span>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {new Date(meta?.payment?.createdAt || ticket?.bookedAt).toLocaleDateString("en-IN", {
                weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
              })}
            </p>
          </div>
        )}

        {meta?.payment?.refundId && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
            <div className="flex items-center gap-1.5 mb-1">
              <IndianRupee size={10} className="text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Refund ID</span>
            </div>
            <p className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400 truncate" title={meta.payment.refundId}>
              {meta.payment.refundId}
            </p>
            {meta.payment.refundAmount > 0 && (
              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                Refund Amount: ₹{meta.payment.refundAmount.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 print:hidden">
        <ShieldCheck size={10} />
        <span>Secured by Razorpay • HMAC-SHA256 Verified</span>
      </div>
    </div>
  );
}
