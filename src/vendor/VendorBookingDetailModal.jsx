import React from "react";
import { X, User } from "lucide-react";

export default function VendorBookingDetailModal({ booking, onClose }) {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Booking Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Booking ID</p>
              <p className="font-mono font-bold text-slate-900">{booking.bookingId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                booking.bookingStatus === "CONFIRMED" ? "bg-green-100 text-green-700"
                : booking.bookingStatus === "CANCELLED" ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
              }`}>
                {booking.bookingStatus}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Total Fare</p>
              <p className="text-lg font-bold text-slate-900">₹{booking.totalFare?.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Booked On</p>
              <p className="text-sm text-slate-700">
                {booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-lime-600" />
              Passenger Details ({booking.passengerDetails?.length || 0})
            </h3>
            {booking.passengerDetails && booking.passengerDetails.length > 0 ? (
              <div className="space-y-3">
                {booking.passengerDetails.map((passenger, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-lime-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{passenger.name}</p>
                          <p className="text-xs text-slate-500">
                            Seat: <span className="font-bold text-lime-600">{passenger.seatNumber}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Age: <span className="font-bold">{passenger.age}</span></p>
                        <p className="text-sm text-slate-600 capitalize">{passenger.gender}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No passenger details available</p>
            )}
          </div>

          {/* Seats Info */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Seats</h3>
            <div className="flex flex-wrap gap-2">
              {(booking.bookedSeats || []).map((seat, index) => (
                <span key={index} className="px-3 py-1 bg-lime-100 text-lime-700 rounded-lg text-sm font-bold">{seat}</span>
              ))}
            </div>
          </div>

          {/* Journey Details */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Journey Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Boarding Point</p>
                <p className="font-bold text-slate-900">{booking.boardingPoint?.city || 'N/A'}</p>
                <p className="text-sm text-slate-600">{booking.boardingPoint?.name || ''}</p>
                {booking.boardingPoint?.time && <p className="text-xs text-slate-500">Time: {booking.boardingPoint.time}</p>}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Dropping Point</p>
                <p className="font-bold text-slate-900">{booking.droppingPoint?.city || 'N/A'}</p>
                <p className="text-sm text-slate-600">{booking.droppingPoint?.name || ''}</p>
                {booking.droppingPoint?.time && <p className="text-xs text-slate-500">Time: {booking.droppingPoint.time}</p>}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {booking.userId && (
            <div className="border-t border-slate-200 pt-4">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Customer</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-bold text-slate-900">{booking.userId.name}</p>
                <p className="text-sm text-slate-600">{booking.userId.email}</p>
                {booking.userId.phoneNo && <p className="text-sm text-slate-600">{booking.userId.phoneNo}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4">
          <button onClick={onClose}
            className="w-full px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
