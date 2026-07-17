import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, Download, ArrowLeft, Bus, Plane, Calendar, MapPin, User, Armchair, CreditCard, ShieldCheck, IndianRupee, Hash, Clock } from "lucide-react";
import Nav from "../../NavComponent.jsx";

export default function TicketDetails() {
  const location = useLocation();
  const stateData = location.state;

  // Safe fallback if user refreshes page directly without route history
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
  
  // Determine service type (flight or bus)
  const isFlight = meta?.serviceType === "flight" || ticket?.bookingId?.startsWith("FLY-") || meta?.flightName;
  const serviceType = isFlight ? "Flight" : "Bus";
  const ServiceIcon = isFlight ? Plane : Bus;
  const serviceName = isFlight 
    ? (meta?.flightName || "Airline") 
    : (meta?.busName || "Payanam Logistics");
  const serviceNumber = isFlight 
    ? (meta?.flightNumber || "") 
    : (meta?.busNumber || "");
  
  // Get travel date from various possible sources
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

  // Native Trigger: Opens standard OS dialog defaulting to "Save as PDF" format cleanly
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    // "print:mt-0" eliminates top navigation layout margins on target PDF generation files
    <div className="mt-20 print:mt-0 min-h-screen bg-slate-50 dark:bg-slate-900 print:bg-white py-10 print:py-0 selection:bg-lime-200">
      
      {/* Hide standard web navbar during asset exports */}
      <div className="print:hidden">
        <Nav />
      </div>

      <div className="mx-auto max-w-2xl px-4 print:px-0">
        
        {/* Action controls hidden seamlessly on the saved document */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link to="/MainPage" className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition">
            <ArrowLeft size={14} /> Back to Search
          </Link>
          <button 
            onClick={handleDownloadPDF} 
            className="flex items-center gap-1.5 rounded-xl border border-lime-200 dark:border-lime-700 bg-lime-50 dark:bg-lime-900/30 px-4 py-2.5 text-xs font-bold text-lime-700 dark:text-lime-300 shadow-sm transition hover:bg-lime-100 dark:hover:bg-lime-900/50"
          >
            <Download size={14} /> Download PDF Ticket
          </button>
        </div>

        {/* Dynamic Context Banner (Hidden on printable version) */}
        <div className="mb-6 rounded-2xl bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 p-4 flex items-start gap-3 print:hidden shadow-3xs">
          <CheckCircle2 className="text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" size={18} />
          <div>
            <h2 className="text-md font-bold text-lime-900 dark:text-lime-200">Booking Confirmed Successfully!</h2>
            <p className="text-xs text-lime-700 dark:text-lime-400 mt-0.5">Your ticket itinerary details have been locked. Click the download button above to save your offline travel pass.</p>
          </div>
        </div>

        {/* Core Digital Ticket Layout Wrapper (print:border-slate-300 forces clean borders in dark/light printers) */}
        <div className="relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 shadow-md dark:shadow-slate-900/30 print:shadow-none overflow-hidden">
          
          {/* Top Decorative Branding Bar */}
          <div className="bg-gradient-to-r from-lime-500 to-lime-600 px-6 py-5 text-white flex justify-between items-center print:bg-lime-600">
            <div>
              <span className="text-sm uppercase font-bold tracking-widest text-lime-100 block">{serviceType} E-Ticket Voucher</span>
              <h3 className="text-lg font-black tracking-tight mt-0.5 flex items-center gap-1.5">
                <ServiceIcon size={18} /> {serviceName}
                {serviceNumber && <span className="text-md font-medium opacity-80">({serviceNumber})</span>}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-sm uppercase font-bold tracking-widest text-lime-100 block">Booking PNR</span>
              <span className="text-lg font-mono font-black bg-white/20 print:bg-black/10 px-2.5 py-0.5 rounded-md inline-block mt-0.5">
                {ticket.bookingId}
              </span>
            </div>
          </div>

          {/* Upper Section: Route & Time Context */}
          <div className="p-6 grid grid-cols-2 gap-6 border-b border-dashed border-slate-200 dark:border-slate-600 relative">
            
            {/* Travel Date Section */}
            <div className="col-span-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1">
                <Calendar size={10} /> Travel Date
              </span>
              <p className="text-md font-extrabold text-slate-900 dark:text-slate-100">
                {travelDateFormatted}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <MapPin size={10} /> Boarding Point
              </span>
              <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {typeof meta?.boarding === 'object' ? (meta.boarding.city || "Origin Point") : (meta?.boarding || "Origin Point")}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                {typeof meta?.boarding === 'object' ? (meta.boarding.name || "Terminal") : "Main Terminal"}
                {typeof meta?.boarding === 'object' && meta.boarding.iata && ` (${meta.boarding.iata})`}
              </p>
              <span className="inline-block mt-2 text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md font-bold print:border print:border-slate-200">
                ⏰ {typeof meta?.boarding === 'object' ? (meta.boarding.time || "N/A") : (meta?.boarding?.time || "N/A")}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-end gap-1">
                <MapPin size={10} /> Dropping Point
              </span>
              <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {typeof meta?.dropping === 'object' ? (meta.dropping.city || "Destination Point") : (meta?.dropping || "Destination Point")}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                {typeof meta?.dropping === 'object' ? (meta.dropping.name || "Terminal") : "Main Terminal"}
                {typeof meta?.dropping === 'object' && meta.dropping.iata && ` (${meta.dropping.iata})`}
              </p>
              <span className="inline-block mt-2 text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md font-bold print:border print:border-slate-200">
                ⏰ {typeof meta?.dropping === 'object' ? (meta.dropping.time || "N/A") : (meta?.dropping?.time || "N/A")}
              </span>
            </div>

            {/* Ticket Punches (Hidden automatically via print:hidden so edges look smooth on physical sheets) */}
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full z-10 print:hidden"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full z-10 print:hidden"></div>
          </div>

          {/* Middle Section: Passenger Manifest Grid */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-700/20 print:bg-transparent">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1">
              <User size={12} /> Passenger Details
            </h4>
            <div className="space-y-2.5">
              {(meta?.passengers || []).map((p, index) => (
                <div key={index} className="flex justify-between items-center bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                  <div>
                    <p className="text-md font-bold text-slate-900 dark:text-slate-100">{p.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase mt-0.5">Age: {p.age} • Gender: {p.gender}</p>
                  </div>
                  <span className="text-xs font-extrabold text-lime-800 dark:text-lime-300 bg-lime-50 dark:bg-lime-900/30 border border-lime-200 dark:border-lime-700 rounded-lg px-2.5 py-1 flex items-center gap-1 print:bg-transparent print:border-slate-300 print:text-slate-900">
                    <Armchair size={12} /> Seat {p.seatNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details Section */}
          {(meta?.payment || ticket?.paymentStatus) && (
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-700/20 dark:to-blue-900/10 print:bg-transparent">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
                <ShieldCheck size={12} /> Payment Details
              </h4>

              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                {(!meta.payment && !ticket.paymentStatus) && "Payment verification pending."}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Razorpay Order ID */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Hash size={10} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Order ID</span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 truncate" title={meta.payment?.razorpayOrderId || ticket.paymentReference}>
                    {meta.payment?.razorpayOrderId || ticket.paymentReference || "N/A"}
                  </p>
                </div>

                {/* Razorpay Payment ID */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CreditCard size={10} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Payment ID</span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 truncate" title={meta.payment?.razorpayPaymentId}>
                    {meta.payment?.razorpayPaymentId || "N/A"}
                  </p>
                </div>

                 {/* Amount Paid */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                  <div className="flex items-center gap-1.5 mb-1">
                    <IndianRupee size={10} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Amount Paid</span>
                  </div>
                  <p className="text-md font-black text-emerald-700 dark:text-emerald-400">
                    ₹{(meta.payment?.amount || ticket.totalFare || 0).toLocaleString()} <span className="text-lg font-medium text-slate-500 dark:text-slate-400 ml-1">{meta.payment?.currency || "INR"}</span>
                  </p>
                </div>

                {/* Payment Status */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={10} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</span>
                  </div>
                  {(() => {
                    const rawStatus = meta.payment?.status || ticket.paymentStatus;
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

                {/* Payment Date */}
                {(meta.payment?.createdAt || ticket.bookedAt) && (
                  <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-600 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock size={10} className="text-slate-400 dark:text-slate-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Payment Date</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {new Date(meta.payment?.createdAt || ticket.bookedAt).toLocaleDateString("en-IN", {
                        weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                )}

                {/* Refund Info (if applicable) */}
                {meta.payment?.refundId && (
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

              {/* Razorpay branding strip */}
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 print:hidden">
                <ShieldCheck size={10} />
                <span>Secured by Razorpay • HMAC-SHA256 Verified</span>
              </div>
            </div>
          )}

          {/* Bottom Section: Transaction Meta Auditing */}
          <div className="p-6 grid grid-cols-3 gap-y-4 gap-x-2 text-xs border-b border-slate-100 dark:border-slate-700">
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-medium">Payment Status</span>
              <span className="mt-0.5 font-bold inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 px-2 py-0.5 rounded-md uppercase tracking-wide text-[10px] print:text-slate-900 print:bg-transparent print:border-none print:p-0">
                {ticket.paymentStatus}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-medium">Ticket Status</span>
              <span className="mt-0.5 font-bold inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 px-2 py-0.5 rounded-md uppercase tracking-wide text-[10px] print:text-slate-900 print:bg-transparent print:border-none print:p-0">
                {ticket.bookingStatus}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 dark:text-slate-500 font-medium">Issued On</span>
              <span className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">{formattedDate}</span>
            </div>
          </div>

          {/* Total Fare Sticky Bottom Summary */}
          <div className="p-6 bg-slate-50 dark:bg-slate-700/30 print:bg-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="bg-white dark:bg-slate-800 print:border print:border-slate-200 p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 shadow-3xs print:shadow-none">
                <CreditCard size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 block">Gateway Ref</span>
                <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 block truncate max-w-[220px]" title={ticket.paymentReference}>
                  {ticket.paymentReference}
                </span>
              </div>
            </div>

            <div className="text-right w-full sm:w-auto border-t sm:border-t-0 border-slate-200 dark:border-slate-600 pt-3 sm:pt-0 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Fare Paid</span>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                ₹{ticket.totalFare.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Footer print metadata visible ONLY on the downloaded PDF */}
        <p className="mt-6 text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden print:block border-t border-slate-200 dark:border-slate-700 pt-4">
          Thank you for traveling with Payanam. Please present this e-ticket along with a valid ID during boarding.
        </p>

      </div>
    </div>
  );
}