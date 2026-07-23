import { useLocation, Link } from "react-router-dom";
import { Bus, Plane, CreditCard } from "lucide-react";
import Nav from "../../NavComponent.jsx";
import TicketInfoCard from "./components/TicketInfoCard";
import TicketPassengerList from "./components/TicketPassengerList";
import TicketPaymentDetails from "./components/TicketPaymentDetails";
import TicketActionsBar from "./components/TicketActionsBar";

export default function TicketDetails() {
  const location = useLocation();
  const stateData = location.state;

  if (!stateData || !stateData.ticket) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-center p-4">
        <Nav />
        <div className="max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-md font-bold text-slate-800 dark:text-slate-100">No Active Ticket Context Found</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">To view dynamic tickets, finalize a trip inside the bus deck layout.</p>
          <Link to="/MainPage" className="inline-flex text-xs bg-lime-500 text-white font-bold px-4 py-2 rounded-xl transition hover:bg-lime-600">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { ticket, meta } = stateData;

  const isFlight = meta?.serviceType === "flight" || ticket?.bookingId?.startsWith("FLY-") || meta?.flightName;
  const serviceType = isFlight ? "Flight" : "Bus";
  const ServiceIcon = isFlight ? Plane : Bus;
  const serviceName = isFlight
    ? (meta?.flightName || "Airline")
    : (meta?.busName || "Payanam Logistics");
  const serviceNumber = isFlight
    ? (meta?.flightNumber || "")
    : (meta?.busNumber || "");

  const travelDate = ticket?.travelDate
    || meta?.boarding?.date
    || ticket?.scheduleId?.departureDate
    || ticket?.journeyDate
    || ticket?.bookedAt;

  const formattedDate = new Date(ticket.bookedAt).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const travelDateFormatted = travelDate
    ? new Date(travelDate).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric"
      })
    : "N/A";

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="mt-20 print:mt-0 min-h-screen bg-slate-50 dark:bg-slate-900 print:bg-white py-10 print:py-0 selection:bg-lime-200">

      <div className="print:hidden">
        <Nav />
      </div>

      <div className="mx-auto max-w-2xl px-3 sm:px-4 print:px-0">

        <TicketActionsBar
          ticket={ticket}
          onDownloadPDF={handleDownloadPDF}
        />

        <TicketInfoCard
          ticket={ticket}
          meta={meta}
          serviceType={serviceType}
          ServiceIcon={ServiceIcon}
          serviceName={serviceName}
          serviceNumber={serviceNumber}
          travelDateFormatted={travelDateFormatted}
        />

        <TicketPassengerList passengers={meta?.passengers || []} />

        <TicketPaymentDetails ticket={ticket} meta={meta} />

        <div className="p-4 sm:p-6 grid grid-cols-3 gap-y-3 sm:gap-y-4 gap-x-1 sm:gap-x-2 text-[11px] sm:text-xs border-b border-slate-100 dark:border-slate-700">
          <div className="min-w-0">
            <span className="block text-slate-400 dark:text-slate-500 font-medium text-[10px] sm:text-xs">Payment Status</span>
            <span className="mt-0.5 font-bold inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 px-1.5 sm:px-2 py-0.5 rounded-md uppercase tracking-wide text-[9px] sm:text-[10px] print:text-slate-900 print:bg-transparent print:border-none print:p-0 truncate max-w-full">
              {ticket.paymentStatus}
            </span>
          </div>
          <div className="min-w-0">
            <span className="block text-slate-400 dark:text-slate-500 font-medium text-[10px] sm:text-xs">Ticket Status</span>
            <span className="mt-0.5 font-bold inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 px-1.5 sm:px-2 py-0.5 rounded-md uppercase tracking-wide text-[9px] sm:text-[10px] print:text-slate-900 print:bg-transparent print:border-none print:p-0 truncate max-w-full">
              {ticket.bookingStatus}
            </span>
          </div>
          <div className="min-w-0">
            <span className="block text-slate-400 dark:text-slate-500 font-medium text-[10px] sm:text-xs">Issued On</span>
            <span className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200 block text-[10px] sm:text-[11px] truncate">{formattedDate}</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-700/30 print:bg-transparent flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="bg-white dark:bg-slate-800 print:border print:border-slate-200 p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 shadow-3xs print:shadow-none shrink-0">
              <CreditCard size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 block">Gateway Ref</span>
              <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-600 dark:text-slate-300 block truncate max-w-[160px] sm:max-w-[220px]" title={ticket.paymentReference}>
                {ticket.paymentReference}
              </span>
            </div>
          </div>

          <div className="text-right w-full sm:w-auto border-t sm:border-t-0 border-slate-200 dark:border-slate-600 pt-2 sm:pt-0 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-0 sm:gap-0">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">Total Fare Paid</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              ₹{ticket.totalFare.toLocaleString()}
            </span>
          </div>
        </div>

      </div>

      <p className="mt-6 text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden print:block border-t border-slate-200 dark:border-slate-700 pt-4">
        Thank you for traveling with Payanam. Please present this e-ticket along with a valid ID during boarding.
      </p>

    </div>
  );
}
