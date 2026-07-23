import { Calendar, MapPin } from "lucide-react";

export default function TicketInfoCard({
  ticket,
  meta,
  serviceType,
  ServiceIcon,
  serviceName,
  serviceNumber,
  travelDateFormatted,
}) {
  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 print:border-slate-300 shadow-md dark:shadow-slate-900/30 print:shadow-none overflow-hidden">
      <div className="bg-gradient-to-r from-lime-500 to-lime-600 px-4 sm:px-6 py-4 sm:py-5 text-white flex justify-between items-center print:bg-lime-600 gap-2">
        <div className="min-w-0">
          <span className="text-[10px] sm:text-sm uppercase font-bold tracking-widest text-lime-100 block">{serviceType} E-Ticket Voucher</span>
          <h3 className="text-sm sm:text-lg font-black tracking-tight mt-0.5 flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <ServiceIcon size={14} /> <span className="truncate">{serviceName}</span>
            {serviceNumber && <span className="text-xs sm:text-md font-medium opacity-80">({serviceNumber})</span>}
          </h3>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] sm:text-sm uppercase font-bold tracking-widest text-lime-100 block">Booking PNR</span>
          <span className="text-sm sm:text-lg font-mono font-black bg-white/20 print:bg-black/10 px-1.5 sm:px-2.5 py-0.5 rounded-md inline-block mt-0.5">
            {ticket.bookingId}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-2 gap-4 sm:gap-6 border-b border-dashed border-slate-200 dark:border-slate-600 relative">
        <div className="col-span-2 mb-0 sm:mb-2">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1">
            <Calendar size={9} /> Travel Date
          </span>
          <p className="text-sm sm:text-md font-extrabold text-slate-900 dark:text-slate-100">
            {travelDateFormatted}
          </p>
        </div>

        <div>
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <MapPin size={9} /> Boarding Point
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            {typeof meta?.boarding === 'object' ? (meta.boarding.city || "Origin Point") : (meta?.boarding || "Origin Point")}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium truncate">
            {typeof meta?.boarding === 'object' ? (meta.boarding.name || "Terminal") : "Main Terminal"}
            {typeof meta?.boarding === 'object' && meta.boarding.iata && ` (${meta.boarding.iata})`}
          </p>
          <span className="inline-block mt-2 text-[10px] sm:text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1.5 sm:px-2 py-0.5 rounded-md font-bold print:border print:border-slate-200">
            ⏰ {typeof meta?.boarding === 'object' ? (meta.boarding.time || "N/A") : (meta?.boarding?.time || "N/A")}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-end gap-1">
            <MapPin size={9} /> Dropping Point
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            {typeof meta?.dropping === 'object' ? (meta.dropping.city || "Destination Point") : (meta?.dropping || "Destination Point")}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium truncate">
            {typeof meta?.dropping === 'object' ? (meta.dropping.name || "Terminal") : "Main Terminal"}
            {typeof meta?.dropping === 'object' && meta.dropping.iata && ` (${meta.dropping.iata})`}
          </p>
          <span className="inline-block mt-2 text-[10px] sm:text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1.5 sm:px-2 py-0.5 rounded-md font-bold print:border print:border-slate-200">
            ⏰ {typeof meta?.dropping === 'object' ? (meta.dropping.time || "N/A") : (meta?.dropping?.time || "N/A")}
          </span>
        </div>

        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full z-10 print:hidden"></div>
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full z-10 print:hidden"></div>
      </div>
    </div>
  );
}
