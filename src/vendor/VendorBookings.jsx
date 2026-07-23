import { Calendar, Bus, Plane, Eye } from "lucide-react";

export default function VendorBookings({ 
  vendorBookings, 
  vendorBookingsLoading, 
  vendorBookingsTotal, 
  vendorBookingsPage,
  onSelectBooking,
  onLoadMore 
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900">All Bookings</h3>
        <span className="text-sm text-slate-600">
          {vendorBookingsTotal} total bookings
        </span>
      </div>

      {vendorBookingsLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-600">Loading bookings...</p>
        </div>
      ) : vendorBookings.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Bookings Yet</h3>
          <p className="text-sm text-slate-600 mb-4">Your first booking will appear here once customers start booking.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vendorBookings.map((booking) => {
            const scheduleId = booking.scheduleId || {};
            const busInfo = booking.busId || scheduleId?.busId;
            const flightInfo = scheduleId?.flightId;
            const isFlightBooking = !!flightInfo;
            const serviceType = isFlightBooking ? "flight" : "bus";
            const serviceName = busInfo?.busName || flightInfo?.airlineName || "Unknown Service";
            const serviceNumber = busInfo?.busNumber || flightInfo?.registrationNumber || "";
            const routeId = booking.routeId || scheduleId?.routeId;
            const source = routeId?.source?.city || booking.boardingPoint?.city || "N/A";
            const destination = routeId?.destination?.city || booking.droppingPoint?.city || "N/A";
            
            return (
              <div key={booking._id} className="border border-slate-200 rounded-xl p-5 hover:border-lime-500 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
                      {serviceType === "bus" ? (
                        <Bus className="w-5 h-5 text-white" />
                      ) : (
                        <Plane className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{serviceName}</h4>
                      <p className="text-xs text-slate-500">
                        {serviceNumber} • {source} → {destination}
                      </p>
                      <p className="text-xs text-slate-500">
                        Booking ID: <span className="font-mono text-slate-700">{booking.bookingId}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.bookingStatus === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : booking.bookingStatus === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {booking.bookingStatus}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Passengers</p>
                    <p className="font-bold text-slate-900">{booking.passengerDetails?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Seats</p>
                    <p className="font-bold text-slate-900">{(booking.bookedSeats || []).join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Total Fare</p>
                    <p className="font-bold text-slate-900">₹{booking.totalFare?.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onSelectBooking(booking)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-lime-700 bg-lime-50 hover:bg-lime-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {vendorBookings.length > 0 && vendorBookings.length < vendorBookingsTotal && (
        <button
          onClick={() => onLoadMore(vendorBookingsPage + 1)}
          disabled={vendorBookingsLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-lime-200 text-lime-600 font-bold rounded-xl hover:bg-lime-50 transition-colors disabled:opacity-50"
        >
          Load More
        </button>
      )}
    </div>
  );
}
