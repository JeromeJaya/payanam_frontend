import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Ticket, Trash2, Camera, Bus, Plane, Lock, Clock, CreditCard, TrendingUp, Shield, CheckCircle2, X, XCircle, AlertTriangle, Star, MessageCircle, Send, Loader2 } from "lucide-react";
import Nav from "./NavComponent.jsx";
import api from "./api/axios.js";
import { useAuth } from "./context/AuthContext.jsx";

export default function UserProfile() {
  const { userId } = useParams();
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true); 
  const [saving, setSaving] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phoneNo: "", address: "", role: "" });
  const [savedProfile, setSavedProfile] = useState({ name: "", email: "", phoneNo: "", address: "", role: "" });
  const [bookings, setBookings] = useState([]);
  const [priceLocks, setPriceLocks] = useState([]);
  const [priceLocksLoading, setPriceLocksLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const fileInputRef = useRef(null);
  const isAdminView = !!userId;

  const fetchProfileAndBookings = async () => {
    try {
      const endpoint = userId 
        ? `/api/v1/admin/users/${userId}`
        : "/api/users/profile";
      const res = await api.get(endpoint);
      const u = res.data?.data ?? res.data?.user ?? {};
      const profileData = {
        name: u.name || "",
        email: u.email || "",
        phoneNo: u.phoneNo || u.phone || "",
        address: u.address || "",
        role: u.role || "",
      };
      setForm(profileData);
      setSavedProfile(profileData);
      if (u.profileImage) {
        setProfileImage(u.profileImage);
        setImagePreview(u.profileImage);
      }
    } catch (err) {
      const local = (() => { try { return JSON.parse(localStorage.getItem("payanam_user")); } catch { return null; } })();
      if (local) {
        const localData = {
          name: local.name || local.userName || "",
          email: local.email || "",
          phoneNo: local.phoneNo || local.phone || "",
          address: "",
          role: local.role || "",
        };
        setForm(localData);
        setSavedProfile(localData);
      }
      setError(local ? null : "Failed to load profile");
    } finally {
      setLoading(false);
    }

    if (!userId) {
      try {
        const res = await api.get("/api/v1/bookings/my-bookings");
        if (res.data?.success) setBookings(res.data.data || []);
      } catch (err) { console.error("Error retrieving bookings:", err); }
      finally { setBookingsLoading(false); }
    } else {
      setBookingsLoading(false);
    }

    if (!userId) {
      try {
        const res = await api.get("/api/v1/flights/price-locks/my-locks");
        if (res.data?.success) setPriceLocks(res.data.data || []);
      } catch (err) { console.error("Error retrieving price locks:", err); }
      finally { setPriceLocksLoading(false); }
    } else {
      setPriceLocksLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndBookings();
  }, [userId]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const onChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleViewTicketDetails = async (b) => {
    const totalFare = b.totalFare || b.totalAmount || b.fare || 0;
    const seatsArray = Array.isArray(b.passengerDetails)
      ? b.passengerDetails.map(p => p.seatNumber)
      : (b.seatNumbers || []);
    const isFlightBooking = b.bookingId?.startsWith("FLY-") || b.serviceType === "flight";
    
    let paymentInfo = null;
    try {
      const paymentRes = await api.get(`/api/v1/payments/status/${b._id}`);
      if (paymentRes.data?.success && paymentRes.data.data?.payment) {
        const p = paymentRes.data.data.payment;
        paymentInfo = {
          razorpayOrderId: p.razorpayOrderId,
          razorpayPaymentId: p.razorpayPaymentId,
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          createdAt: p.createdAt,
        };
      }
    } catch (err) {}

    let boarding, dropping;
    if (isFlightBooking) {
      boarding = { city: b.boardingPoint?.city || b.source || "Origin", name: b.boardingPoint?.name || "Airport", time: b.scheduleId?.departureTime || "", iata: b.boardingPoint?.iata || "", date: b.tcheduleId?.departureDate || b.travelDate };
      dropping = { city: b.droppingPoint?.city || b.destination || "Destination", name: b.droppingPoint?.name || "Airport", time: b.scheduleId?.arrivalTime || "", iata: b.droppingPoint?.iata || "", date: b.scheduleId?.arrivalDate };
    } else {
      boarding = b.boardingPoint || { city: b.source || "Origin", name: "Main Terminal", time: b.scheduleId?.departureTime || "Dep TBD" };
      dropping = b.droppingPoint || { city: b.destination || "Destination", name: "Main Terminal", time: b.scheduleId?.arrivalTime || "Arr TBD" };
    }

    navigate("/ticketdetails", {
      state: {
        ticket: {
          bookingId: b.bookingId || "N/A",
          bookingStatus: b.bookingStatus || b.status || "CONFIRMED",
          totalFare,
          bookedSeats: seatsArray,
          bookedAt: b.bookedAt || b.createdAt || new Date().toISOString(),
          scheduleId: b.scheduleId || null,
          paymentStatus: paymentInfo?.status || b.paymentStatus || "PENDING",
          paymentReference: paymentInfo?.razorpayPaymentId || b.paymentReference || "",
        },
        meta: {
          flightName: isFlightBooking ? (b.busId?.airlineName || "Airline") : undefined,
          flightNumber: isFlightBooking ? (b.flightNumber || "") : undefined,
          busName: !isFlightBooking ? (b.busName || "Payanam Express") : undefined,
          boarding,
          dropping,
          passengers: Array.isArray(b.passengerDetails) ? b.passengerDetails : seatsArray.map(seat => ({ name: "Passenger", seatNumber: seat, age: "N/A", gender: "N/A" })),
          serviceType: isFlightBooking ? "flight" : "bus",
          payment: paymentInfo || undefined,
        }
      }
    });
  };

  const handleCancelBooking = async (e, bookingId) => {
    e.stopPropagation();
    if (!confirm(`Cancel booking ${bookingId}?`)) return;
    setCancelLoading(bookingId);
    try {
      const res = await api.post(`/api/v1/bookings/${bookingId}/cancel`);
      if (res.data?.success) {
        setSuccess("Booking cancelled.");
        setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: "Cancelled" } : b));
      }
    } catch (err) {
      setError(err.response?.data?.errors?.[0] || "Failed to cancel");
    } finally { setCancelLoading(null); }
  };

  const openReviewModal = (booking) => {
    setReviewBooking(booking);
    setReviewRating(0);
    setReviewText("");
    setReviewError("");
    setReviewSuccess("");
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError("Please select a rating between 1 and 5 stars");
      return;
    }
    if (reviewText.trim().length < 10) {
      setReviewError("Review must be at least 10 characters long");
      return;
    }

    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const busId = reviewBooking.busId?._id || 
                    (typeof reviewBooking.busId === 'string' ? reviewBooking.busId : null) || 
                    reviewBooking.scheduleId?.busId;
      const res = await api.post(`/api/v1/buses/${busId}/reviews`, {
        bookingId: reviewBooking._id,
        rating: reviewRating,
        review: reviewText.trim(),
      });

      if (res.data.success) {
        setReviewSuccess("Review added successfully!");
        setTimeout(() => {
          setReviewSuccess("");
          setShowReviewModal(false);
          setReviewBooking(null);
        }, 1500);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to add review");
    } finally {
      setReviewLoading(false);
    }
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewBooking(null);
    setReviewRating(0);
    setReviewText("");
    setReviewError("");
    setReviewSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
    };
    if (form.phoneNo && form.phoneNo.trim() !== "") {
      payload.phoneNo = form.phoneNo.trim();
    }
    
    try {
      const res = await api.put("/api/users/profile", payload);
      const updatedUser = res.data?.data;
      if (updatedUser) {
        updateUser(updatedUser);
        setSavedProfile({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phoneNo: updatedUser.phoneNo || updatedUser.phone || "",
          address: updatedUser.address || "",
          role: updatedUser.role || "",
        });
      }
      setSuccess("Profile updated");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.errors?.[0] || err.response?.data?.message || "Failed to update");
    } finally { setSaving(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await api.put("/api/users/profile/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setProfileImage(res.data.data.profileImage);
        setImagePreview(res.data.data.profileImage);
        setSuccess("Profile image updated");
      }
    } catch (err) {
      setError(err.response?.data?.errors?.[0] || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-500 border-t-transparent"></div></div>;

  return (
    <div className="mt-20 min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Nav />
      <div className="w-full px-4 py-10 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-700 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Traveler Profile</h1>
            <p className="text-xs font-bold uppercase tracking-wider text-lime-700 dark:text-lime-400 mt-1">{form.role || "Explorer"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={isAdminView ? "/admin/dashboard" : "/MainPage"} className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50">
              ← Back to Dashboard
            </Link>
            {!isAdminView && <button onClick={logout} className="inline-flex items-center rounded-xl border border-red-200 dark:border-red-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50">Logout</button>}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-700 dark:text-red-400"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-lime-600 shrink-0" />
              <span>{success}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccess("")}
              className="p-1 hover:bg-lime-100 dark:hover:bg-lime-900/30 rounded-lg transition-colors text-lime-800 dark:text-lime-400"
              aria-label="Dismiss success"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-center shadow-lg relative overflow-hidden">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-lime-600 to-lime-500 text-xl font-bold text-lime-950 shadow-md overflow-hidden">
                {imagePreview || profileImage ? <img src={imagePreview || profileImage} alt="Profile" className="h-full w-full object-cover" /> : (form.name || "AD").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">{savedProfile.name || form.name || "Adventurer"}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{savedProfile.email || form.email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-lime-100 dark:bg-lime-900/30 px-3 py-1 text-xs font-semibold text-lime-800 dark:text-lime-400">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse"></span> Verified Member
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-slate-100">Personal Information</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {[["name","Full Name"],["email","Email Address"],["phoneNo","Contact Number"],["address","Home Address"]].map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
                    <input name={field} type="text" value={form[field]} onChange={onChange} disabled={!editing || isAdminView} className="mt-1.5 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 px-3.5 py-2.5 text-sm disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-400" />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700 pt-4">
                {editing ? (
                  <>
                    <button type="button" onClick={() => { setEditing(false); setForm(savedProfile); }} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50">Cancel</button>
                    <button type="submit" disabled={saving} className="rounded-xl bg-lime-500 dark:bg-lime-600 px-5 py-2 text-sm font-bold text-white hover:bg-lime-600 disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
                  </>
                ) : !isAdminView && <button type="button" onClick={() => setEditing(true)} className="rounded-xl bg-lime-500 dark:bg-lime-600 px-5 py-2 text-sm font-bold text-white hover:bg-lime-600">Modify Profile</button>}
              </div>
            </form>

            {!isAdminView && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
                <h4 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100">My Bookings History</h4>
                {bookingsLoading ? <div className="flex items-center justify-center py-8"><div className="h-4 w-4 animate-spin rounded-full border-2 border-lime-500 border-t-transparent"></div></div>
                : bookings.length === 0 ? <div className="text-center py-10"><Ticket size={32} className="mx-auto text-slate-300 mb-2" /><p className="text-sm font-bold text-slate-700">No trips found</p><Link to="/MainPage" className="mt-3 inline-flex text-xs bg-lime-500 text-white font-bold px-4 py-2 rounded-xl">Book Your First Ride</Link></div>
                : <div className="space-y-4 max-h-[450px] overflow-y-auto">
                  {bookings.map((b, i) => {
                    const bookingId = b.bookingId || `BK-${1000 + i}`;
                    const source = b.boardingPoint?.city || b.routeId?.source || b.source || "Origin";
                    const destination = b.droppingPoint?.city || b.routeId?.destination || b.destination || "Destination";
                    const totalFare = b.totalFare || 0;
                    const isCancelled = b.status?.toLowerCase() === 'cancelled' || b.bookingStatus?.toLowerCase() === 'cancelled';
                    let travelFinished = false;
                    const depDateVal = b.scheduleId?.departureDate || b.travelDate;
                    if (depDateVal) {
                      const depDate = new Date(depDateVal);
                      const depTimeStr = b.scheduleId?.departureTime || "00:00";
                      const [hours, minutes] = depTimeStr.split(":").map(Number);
                      depDate.setHours(hours || 0, minutes || 0, 0, 0);
                      travelFinished = depDate < new Date();
                    }
                    const isCompleted = b.bookingStatus?.toLowerCase() === 'completed' || b.status?.toLowerCase() === 'completed' || (!isCancelled && travelFinished);
                    const isFlight = bookingId?.startsWith("FLY-") || b.serviceType === "flight";
                    const ServiceIcon = isFlight ? Plane : Bus;
                    const serviceName = isFlight ? (b.busId?.airlineName || "Airline") : (b.busId?.busName || "");
                    const depDate = b.scheduleId?.departureDate ? new Date(b.scheduleId.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "Date TBD";
                    const depTime = b.scheduleId?.departureTime || b.boardingPoint?.time || "--:--";
                    const arrTime = b.scheduleId?.arrivalTime || b.droppingPoint?.time || "--:--";
                    const seats = (b.passengerDetails || []).map(p => p.seatNumber).join(", ") || "N/A";
                    return (
                      <div key={bookingId} onClick={() => handleViewTicketDetails(b)} className="cursor-pointer rounded-xl bg-slate-50 dark:bg-slate-700/30 p-4 border border-slate-200/60 hover:border-lime-300 hover:bg-white transition-all">
                        <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 mb-3 text-[11px]">
                          <span className="font-mono font-bold text-slate-600">PNR: <span className="text-slate-900">{bookingId}</span></span>
                          <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                            isCancelled
                              ? 'bg-red-100 text-red-700'
                              : isCompleted
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-lime-100 text-lime-800'
                          }`}>
                            {isCompleted ? 'Completed' : (b.status || b.bookingStatus || "Confirmed")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1"><p className="text-xs font-bold text-slate-400">Departure</p><p className="text-base font-extrabold text-slate-900">{source}</p><p className="text-sm text-slate-500">{depDate} · {depTime}</p></div>
                          <div className="px-3 text-center"><span className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1"><ServiceIcon size={10} /> {isFlight ? "Flight" : "Bus"}</span><p className="text-xs font-medium text-slate-500 mt-0.5">{serviceName}</p></div>
                          <div className="text-right flex-1"><p className="text-xs font-bold text-slate-400">Arrival</p><p className="text-base font-extrabold text-slate-900">{destination}</p><p className="text-sm text-slate-500">{arrTime}</p></div>
                        </div>
                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/50 mt-3">
                          <span className="text-xs font-semibold text-slate-600">Seats: <span className="font-bold text-slate-800">{seats}</span></span>
                          <div className="flex items-center gap-4">
                            {!isCancelled && !isCompleted && <button onClick={(e) => handleCancelBooking(e, bookingId)} disabled={cancelLoading === bookingId} className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1 hover:bg-red-100 disabled:opacity-50">Cancel</button>}
                            {!isCancelled && isCompleted && !isFlight && (
                              <button onClick={(e) => { e.stopPropagation(); openReviewModal(b); }} className="text-xs font-bold text-lime-600 bg-lime-50 border border-lime-200 rounded-lg px-2.5 py-1 hover:bg-lime-100 flex items-center gap-1">
                                <Star size={10} />
                                Review
                              </button>
                            )}
                            <span className="text-sm font-extrabold text-slate-900">₹{totalFare.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {showReviewModal && reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeReviewModal} role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Star className="w-5 h-5 text-lime-500" />
                Write a Review
              </h3>
              <button onClick={closeReviewModal} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              How was your experience with {reviewBooking.busId?.busName || "this service"}?
            </p>
            {reviewError && (
              <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-xs text-red-700 dark:text-red-400">{reviewError}</p>
              </div>
            )}
            {reviewSuccess && (
              <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-xs text-green-700 dark:text-green-400">{reviewSuccess}</p>
              </div>
            )}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Rating *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`p-0.5 transition-colors ${
                        star <= reviewRating
                          ? "text-yellow-400"
                          : "text-slate-300 hover:text-yellow-300"
                      }`}
                    >
                      <Star className="w-5 h-5" fill={star <= reviewRating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Your Review *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-lime-500 outline-none resize-y"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-slate-400">{reviewText.length}/1000 characters</span>
                  {reviewText.length < 10 && reviewText.length > 0 && (
                    <span className="text-xs text-red-500">Minimum 10 characters</span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={reviewLoading || reviewRating === 0 || reviewText.trim().length < 10}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}