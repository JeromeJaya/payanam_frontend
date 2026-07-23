import { IndianRupee, ShieldCheck, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentSection({ booking, bookingMongoId }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/30 p-6 animate-fadeInUp" style={{ animationDelay: `${400 + 0 * 100}ms` }}>
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <IndianRupee size={20} className="text-lime-600 dark:text-lime-400" />
        Payment Method
      </h2>

      {/* Razorpay - Primary Payment Option */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center p-4 border-2 border-lime-500 dark:border-lime-600 bg-lime-50 dark:bg-lime-900/20 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div className="ml-3 flex-1">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Pay with Razorpay</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">UPI, Cards, Wallets, Netbanking</p>
          </div>
          <div className="flex gap-1.5">
            <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
            <div className="w-8 h-5 bg-red-600 rounded text-white text-[8px] flex items-center justify-center font-bold">MC</div>
            <div className="w-8 h-5 bg-purple-600 rounded text-white text-[8px] flex items-center justify-center font-bold">UPI</div>
          </div>
        </div>
      </div>

      {/* Payment Status Messages */}
      {booking.status === "error" && !bookingMongoId && (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
            ⚠️ {booking.message}
          </div>
          <button
            onClick={() => navigate("/busbooking")}
            className="w-full rounded-lg bg-slate-100 dark:bg-slate-700 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            Go Back & Retry
          </button>
        </div>
      )}
      {booking.status === "error" && bookingMongoId && (
        <div className="mt-4">
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
            ⚠️ {booking.message}
          </div>
        </div>
      )}

      {booking.status === "success" && (
        <div className="mt-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-3 text-center text-sm font-medium text-green-600 dark:text-green-400 flex items-center justify-center gap-2 animate-pulse">
          <CheckCircle size={18} />
          {booking.message} Redirecting to ticket...
        </div>
      )}

      {booking.status === "loading" && (
        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" />
          {booking.message}
        </div>
      )}
    </div>
  );
}
