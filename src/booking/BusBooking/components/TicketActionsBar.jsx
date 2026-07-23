import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function TicketActionsBar({
  ticket,
  onDownloadPDF,
}) {
  return (
    <>
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 print:hidden">
        <Link to="/MainPage" className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition">
          <ArrowLeft size={14} /> Back to Search
        </Link>
        <button
          onClick={onDownloadPDF}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-lime-200 dark:border-lime-700 bg-lime-50 dark:bg-lime-900/30 px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-lime-700 dark:text-lime-300 shadow-sm transition hover:bg-lime-100 dark:hover:bg-lime-900/50"
        >
          <Download size={14} /> Download PDF
        </button>
      </div>

      {(() => {
        const status = String(ticket.bookingStatus || "").toUpperCase();
        const isCancelled = status === "CANCELLED" || status === "CANCELED" || status === "CANCELLATION_REQUESTED";
        if (isCancelled) {
          return (
            <div className="mb-4 sm:mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 sm:p-4 flex items-start gap-2 sm:gap-3 print:hidden shadow-3xs">
              <CheckCircle2 className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={16} />
              <div>
                <h2 className="text-sm sm:text-md font-bold text-red-900 dark:text-red-200">Booking Has Been Cancelled</h2>
                <p className="text-[11px] sm:text-xs text-red-700 dark:text-red-400 mt-0.5">Your booking has been successfully cancelled. Any applicable refunds will be processed to your original payment method.</p>
              </div>
            </div>
          );
        }
        return (
          <div className="mb-4 sm:mb-6 rounded-2xl bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 p-3 sm:p-4 flex items-start gap-2 sm:gap-3 print:hidden shadow-3xs">
            <CheckCircle2 className="text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" size={16} />
            <div>
              <h2 className="text-sm sm:text-md font-bold text-lime-900 dark:text-lime-200">Booking Confirmed Successfully!</h2>
              <p className="text-[11px] sm:text-xs text-lime-700 dark:text-lime-400 mt-0.5">Your ticket itinerary details have been locked. Click the download button above to save your offline travel pass.</p>
            </div>
          </div>
        );
      })()}
    </>
  );
}
