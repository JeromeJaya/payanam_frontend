import { useState, useEffect } from "react";
import { Ticket, Search, Eye } from "lucide-react";
import api from "../../api/axios";

const getBookingStatusClasses = (status) => {
  if (status === "CONFIRMED") return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
  if (status === "CANCELLED") return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
  return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400";
};

export default function AdminBookings({ showToast, actionLoading, navigate }) {
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsPagination, setBookingsPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20,
  });
  const [bookingFilters, setBookingFilters] = useState({ status: "", search: "" });

  const fetchBookings = async (page = 1) => {
    setBookingsLoading(true);
    try {
      const params = {
        page,
        limit: 20,
        ...(bookingFilters.status && { status: bookingFilters.status }),
        ...(bookingFilters.search && { search: bookingFilters.search }),
      };
      const res = await api.get("/api/v1/admin/bookings", { params });
      if (res.data.success) {
        setBookings(res.data.data.bookings);
        setBookingsPagination(res.data.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      const res = await api.get(`/api/v1/admin/bookings/${bookingId}`);
      if (!res.data.success) return;
      const b = res.data.data;
      const isFlightBooking = b.bookingId?.startsWith("FLY-") || b.serviceType === "flight";
      const paymentInfo = await fetchPaymentInfo(b._id);
      const { boarding, dropping } = buildBoardingDroppingPoints(b, isFlightBooking);
      const statePayload = buildTicketStatePayload(b, isFlightBooking, paymentInfo, boarding, dropping);
      navigate("/ticketdetails", { state: statePayload });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load booking details", "error");
    }
  };

  const fetchPaymentInfo = async (bookingDbId) => {
    try {
      const paymentRes = await api.get(`/api/v1/payments/status/${bookingDbId}`);
      if (paymentRes.data?.success && paymentRes.data.data?.payment) {
        const p = paymentRes.data.data.payment;
        return {
          razorpayOrderId: p.razorpayOrderId,
          razorpayPaymentId: p.razorpayPaymentId,
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          createdAt: p.createdAt,
          refundId: p.refundId,
          refundAmount: p.refundAmount,
        };
      }
    } catch (err) {
      console.error("Failed to fetch payment details:", err);
    }
    return null;
  };

  const buildBoardingDroppingPoints = (b, isFlightBooking) => {
    if (isFlightBooking) {
      return {
        boarding: {
          city: b.boardingPoint?.city || b.routeId?.source?.city || "Origin",
          name: b.boardingPoint?.name || "Airport",
          time: b.scheduleId?.departureTime || b.boardingPoint?.time || "",
          iata: b.boardingPoint?.iata || "",
          date: b.travelDate || b.scheduleId?.departureDate,
        },
        dropping: {
          city: b.droppingPoint?.city || b.routeId?.destination?.city || "Destination",
          name: b.droppingPoint?.name || "Airport",
          time: b.scheduleId?.arrivalTime || b.droppingPoint?.time || "",
          iata: b.droppingPoint?.iata || "",
          date: b.scheduleId?.arrivalDate,
        },
      };
    }
    return {
      boarding: b.boardingPoint || { city: b.routeId?.source?.city || "Origin", name: "Main Terminal", time: b.scheduleId?.departureTime || "Dep TBD" },
      dropping: b.droppingPoint || { city: b.routeId?.destination?.city || "Destination", name: "Main Terminal", time: b.scheduleId?.arrivalTime || "Arr TBD" },
    };
  };

  const buildTicketStatePayload = (b, isFlightBooking, paymentInfo, boarding, dropping) => ({
    ticket: {
      bookingId: b.bookingId || "N/A",
      bookingStatus: b.bookingStatus || "CONFIRMED",
      paymentStatus: b.paymentStatus || "SUCCESS",
      paymentReference: b.paymentReference || "ADMIN-VIEW",
      totalFare: b.totalFare || 0,
      bookedSeats: b.bookedSeats || b.passengerDetails?.map(p => p.seatNumber) || [],
      bookedAt: b.bookedAt || b.createdAt || new Date().toISOString(),
      scheduleId: b.scheduleId || null,
    },
    meta: {
      flightName: isFlightBooking ? (b.busId?.airlineName || "Airline") : undefined,
      flightNumber: isFlightBooking ? (b.flightNumber || b.busId?.flightNumber || "") : undefined,
      aircraftType: isFlightBooking ? (b.busId?.aircraftType || "") : undefined,
      busName: !isFlightBooking ? (b.busId?.busName || b.busId?.busNumber || "Payanam Express") : undefined,
      busNumber: !isFlightBooking ? (b.busId?.busNumber || "") : undefined,
      boarding,
      dropping,
      passengers: b.passengerDetails || [],
      payment: paymentInfo,
      serviceType: isFlightBooking ? "flight" : "bus",
    },
  });

  const handleSearchChange = (e) =>
    setBookingFilters((p) => ({ ...p, search: e.target.value }));

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") fetchBookings(1);
  };

  const handleStatusChange = (e) =>
    setBookingFilters((p) => ({ ...p, status: e.target.value }));

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= bookingsPagination.totalPages) {
      fetchBookings(newPage);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, [bookingFilters.status]);

  const Pagination = () =>
    bookingsPagination.totalPages > 1 && (
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Page {bookingsPagination.currentPage} of {bookingsPagination.totalPages} (
          {bookingsPagination.totalCount} total)
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(bookingsPagination.currentPage - 1)}
            disabled={bookingsPagination.currentPage === 1}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"
          >
            ←
          </button>
          <button
            onClick={() => handlePageChange(bookingsPagination.currentPage + 1)}
            disabled={bookingsPagination.currentPage === bookingsPagination.totalPages}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by booking ID..."
              value={bookingFilters.search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <select
            value={bookingFilters.status}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {bookingsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No bookings found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Booking ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Seats
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-mono text-indigo-600 dark:text-indigo-400">
                        {b.bookingId}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {b.userId?.name || b.userId?.email || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {b.scheduleId?.routeId
                          ? `${b.scheduleId.routeId.source?.city || b.scheduleId.routeId.source} → ${b.scheduleId.routeId.destination?.city || b.scheduleId.routeId.destination}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {b.seatNumbers?.join(", ")}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                        ₹{b.totalFare?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBookingStatusClasses(b.bookingStatus)}`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => fetchBookingDetails(b.bookingId)}
                          disabled={actionLoading}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
    </div>
  );
}