import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, Download, ArrowLeft, Bus, Calendar, MapPin, User, Armchair, CreditCard, ShieldCheck, IndianRupee, Hash, Clock } from "lucide-react";
import Nav from "../../NavComponent.jsx";

export default function TicketDetails() {
  const location = useLocation();
  const stateData = location.state;

  // Safe fallback if user refreshes page directly without route history
  if (!stateData || !stateData.ticket) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-4">
        <Nav />
        <div className="max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-800">No Active Ticket Context Found</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">To view dynamic tickets, finalize a trip inside the bus deck layout.</p>
          <Link to="/MainPage" className="inline-flex text-xs bg-lime-500 text-white font-bold px-4 py-2 rounded-xl transition hover:bg-lime-600">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { ticket, meta } = stateData;
  const formattedDate = new Date(ticket.bookedAt).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  // Native Trigger: Opens standard OS dialog defaulting to "Save as PDF" format cleanly
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    // "print:mt-0" eliminates top navigation layout margins on target PDF generation files
    <div className="mt-20 print:mt-0 min-h-screen bg-slate-50 print:bg-white py-10 print:py-0 selection:bg-lime-200">
      
      {/* Hide standard web navbar during asset exports */}
      <div className="print:hidden">
        <Nav />
      </div>

      <div className="mx-auto max-w-2xl px-4 print:px-0">
        
        {/* Action controls hidden seamlessly on the saved document */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link to="/MainPage" className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition">
            <ArrowLeft size={14} /> Back to Search
          </Link>
          <button 
            onClick={handleDownloadPDF} 
            className="flex items-center gap-1.5 rounded-xl border border-lime-200 bg-lime-50 px-4 py-2.5 text-xs font-bold text-lime-700 shadow-sm transition hover:bg-lime-100"
          >
            <Download size={14} /> Download PDF Ticket
          </button>
        </div>

        {/* Dynamic Context Banner (Hidden on printable version) */}
        <div className="mb-6 rounded-2xl bg-lime-50 border border-lime-200 p-4 flex items-start gap-3 print:hidden shadow-3xs">
          <CheckCircle2 className="text-lime-600 shrink-0 mt-0.5" size={18} />
          <div>
            <h2 className="text-sm font-bold text-lime-900">Booking Confirmed Successfully!</h2>
            <p className="text-xs text-lime-700 mt-0.5">Your ticket itinerary details have been locked. Click the download button above to save your offline travel pass.</p>
          </div>
        </div>

        {/* Core Digital Ticket Layout Wrapper (print:border-slate-300 forces clean borders in dark/light printers) */}
        <div className="relative bg-white rounded-3xl border border-slate-200 print:border-slate-300 shadow-md print:shadow-none overflow-hidden">
          
          {/* Top Decorative Branding Bar */}
          <div className="bg-gradient-to-r from-lime-500 to-lime-600 px-6 py-5 text-white flex justify-between items-center print:bg-lime-600">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-lime-100 block">E-Ticket Voucher</span>
              <h3 className="text-lg font-black tracking-tight mt-0.5 flex items-center gap-1.5">
                <Bus size={18} /> {meta?.busName || "Payanam Logistics"}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-lime-100 block">Booking PNR</span>
              <span className="text-lg font-mono font-black bg-white/20 print:bg-black/10 px-2.5 py-0.5 rounded-md inline-block mt-0.5">
                {ticket.bookingId}
              </span>
            </div>
          </div>

          {/* Upper Section: Route & Time Context */}
          <div className="p-6 grid grid-cols-2 gap-6 border-b border-dashed border-slate-200 relative">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin size={10} /> Boarding Point
              </span>
              <p className="text-base font-extrabold text-slate-900 mt-1">{meta?.boarding?.city || "Origin Point"}</p>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">{meta?.boarding?.name}</p>
              <span className="inline-block mt-2 text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold print:border print:border-slate-200">
                ⏰ {meta?.boarding?.time || "N/A"}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-end gap-1">
                <MapPin size={10} /> Dropping Point
              </span>
              <p className="text-base font-extrabold text-slate-900 mt-1">{meta?.dropping?.city || "Destination Point"}</p>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">{meta?.dropping?.name}</p>
              <span className="inline-block mt-2 text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold print:border print:border-slate-200">
                ⏰ {meta?.dropping?.time || "N/A"}
              </span>
            </div>

            {/* Ticket Punches (Hidden automatically via print:hidden so edges look smooth on physical sheets) */}
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-50 border border-slate-200 rounded-full z-10 print:hidden"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50 border border-slate-200 rounded-full z-10 print:hidden"></div>
          </div>

          {/* Middle Section: Passenger Manifest Grid */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/30 print:bg-transparent">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1">
              <User size={12} /> Passenger Details
            </h4>
            <div className="space-y-2.5">
              {(meta?.passengers || []).map((p, index) => (
                <div key={index} className="flex justify-between items-center bg-white border border-slate-200/60 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{p.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">Age: {p.age} • Gender: {p.gender}</p>
                  </div>
                  <span className="text-xs font-extrabold text-lime-800 bg-lime-50 border border-lime-200 rounded-lg px-2.5 py-1 flex items-center gap-1 print:bg-transparent print:border-slate-300 print:text-slate-900">
                    <Armchair size={12} /> Seat {p.seatNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details Section */}
          {meta?.payment && (
            <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50/50 to-blue-50/30 print:bg-transparent">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                <ShieldCheck size={12} /> Payment Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Razorpay Order ID */}
                <div className="bg-white border border-slate-200/60 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Hash size={10} className="text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order ID</span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-slate-700 truncate" title={meta.payment.razorpayOrderId}>
                    {meta.payment.razorpayOrderId}
                  </p>
                </div>

                {/* Razorpay Payment ID */}
                <div className="bg-white border border-slate-200/60 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CreditCard size={10} className="text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment ID</span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-slate-700 truncate" title={meta.payment.razorpayPaymentId}>
                    {meta.payment.razorpayPaymentId}
                  </p>
                </div>

                {/* Amount Paid */}
                <div className="bg-white border border-slate-200/60 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                  <div className="flex items-center gap-1.5 mb-1">
                    <IndianRupee size={10} className="text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount Paid</span>
                  </div>
                  <p className="text-sm font-black text-emerald-700">
                    ₹{meta.payment.amount?.toLocaleString()} <span className="text-lg font-medium text-slate-500 ml-1">{meta.payment.currency || "INR"}</span>
                  </p>
                </div>

                {/* Payment Status */}
                <div className="bg-white border border-slate-200/60 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={10} className="text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
                  </div>
                  <span className={`text-xs font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded-md uppercase tracking-wide ${
                    meta.payment.status === "SUCCESS"
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                      : meta.payment.status === "REFUNDED"
                      ? "text-amber-700 bg-amber-50 border border-amber-200"
                      : "text-slate-700 bg-slate-50 border border-slate-200"
                  }`}>
                    {meta.payment.status === "SUCCESS" && <CheckCircle2 size={10} />}
                    {meta.payment.status}
                  </span>
                </div>

                {/* Payment Date */}
                {meta.payment.createdAt && (
                  <div className="bg-white border border-slate-200/60 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock size={10} className="text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Date</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {new Date(meta.payment.createdAt).toLocaleDateString("en-IN", {
                        weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                )}

                {/* Refund Info (if applicable) */}
                {meta.payment.refundId && (
                  <div className="bg-white border border-slate-200/60 print:border-slate-300 rounded-xl p-3 shadow-3xs print:shadow-none">
                    <div className="flex items-center gap-1.5 mb-1">
                      <IndianRupee size={10} className="text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Refund ID</span>
                    </div>
                    <p className="text-xs font-mono font-semibold text-amber-700 truncate" title={meta.payment.refundId}>
                      {meta.payment.refundId}
                    </p>
                    {meta.payment.refundAmount > 0 && (
                      <p className="text-[10px] font-bold text-amber-600 mt-0.5">
                        Refund Amount: ₹{meta.payment.refundAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Razorpay branding strip */}
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 print:hidden">
                <ShieldCheck size={10} />
                <span>Secured by Razorpay • HMAC-SHA256 Verified</span>
              </div>
            </div>
          )}

          {/* Bottom Section: Transaction Meta Auditing */}
          <div className="p-6 grid grid-cols-3 gap-y-4 gap-x-2 text-xs border-b border-slate-100">
            <div>
              <span className="block text-slate-400 font-medium">Payment Status</span>
              <span className="mt-0.5 font-bold inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md uppercase tracking-wide text-[10px] print:text-slate-900 print:bg-transparent print:border-none print:p-0">
                {ticket.paymentStatus}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Ticket Status</span>
              <span className="mt-0.5 font-bold inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md uppercase tracking-wide text-[10px] print:text-slate-900 print:bg-transparent print:border-none print:p-0">
                {ticket.bookingStatus}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Issued On</span>
              <span className="mt-0.5 font-semibold text-slate-800 block text-[11px]">{formattedDate}</span>
            </div>
          </div>

          {/* Total Fare Sticky Bottom Summary */}
          <div className="p-6 bg-slate-50 print:bg-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="bg-white print:border print:border-slate-200 p-2.5 rounded-xl border border-slate-200 text-slate-600 shadow-3xs print:shadow-none">
                <CreditCard size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block">Gateway Ref</span>
                <span className="text-xs font-mono font-medium text-slate-600 block truncate max-w-[220px]" title={ticket.paymentReference}>
                  {ticket.paymentReference}
                </span>
              </div>
            </div>

            <div className="text-right w-full sm:w-auto border-t sm:border-t-0 border-slate-200 pt-3 sm:pt-0 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
              <span className="text-xs font-bold text-slate-500">Total Fare Paid</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{ticket.totalFare.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Footer print metadata visible ONLY on the downloaded PDF */}
        <p className="mt-6 text-center text-[10px] text-slate-400 uppercase tracking-widest hidden print:block border-t border-slate-200 pt-4">
          Thank you for traveling with Payanam. Please present this e-ticket along with a valid ID during boarding.
        </p>

      </div>
    </div>
  );
}