import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // IMPORTED useNavigate
import { Calendar, Armchair, Ticket, MapPin, Eye, Trash2, Camera } from "lucide-react"; 
import Nav from "./NavComponent.jsx";
import api from "./api/axios.js";
import { useAuth } from "./context/AuthContext.jsx";

export default function UserProfile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate(); // Hook initialized
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true); 
  const [saving, setSaving] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(null); // Tracks active canceling booking ID
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phoneNo: "", address: "", role: "" });
  const [bookings, setBookings] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchProfileAndBookings = async () => {
    // 1. Fetch User Profile Details
    try {
      const res = await api.get("/api/users/profile");
      const u = res.data?.data ?? res.data?.user ?? {};
      setForm({
        name: u.name || "",
        email: u.email || "",
        phoneNo: u.phoneNo || u.phone || "",
        address: u.address || "",
        role: u.role || "",
      });
      // Restore profile image from backend so it persists across reloads
      if (u.profileImage) {
        setProfileImage(u.profileImage);
        setImagePreview(u.profileImage);
      }
    } catch (err) {
      const local = (() => {
        try { return JSON.parse(localStorage.getItem("payanam_user")); } catch { return null; }
      })();
      if (local) {
        setForm({
          name: local.name || local.userName || "",
          email: local.email || "",
          phoneNo: local.phoneNo || local.phone || "",
          address: "",
          role: local.role || "",
        });
      }
      setError(local ? null : "Failed to load profile");
    } finally {
      setLoading(false);
    }

    // 2. Fetch User Bookings Inventory From Backend API
    try {
      const res = await api.get("/api/v1/bookings/my-bookings");
      if (res.data?.success) {
        setBookings(res.data.data || []);
      }
    } catch (err) {
      console.error("Error retrieving user historical booking logs:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndBookings();
  }, []);

  // Maps older historical objects to match the high-fidelity Ticket view state schema
  const handleViewTicketDetails = async (b) => {
    const totalFare = b.totalAmount || b.fare || 0;
    const seatsArray = Array.isArray(b.passengerDetails)
      ? b.passengerDetails.map(p => p.seatNumber)
      : (b.seatNumbers || []);

    // Fetch payment details from backend
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
          refundId: p.refundId,
          refundAmount: p.refundAmount,
        };
      }
    } catch (err) {
      console.error("Failed to fetch payment details:", err);
      // Fallback: use basic payment info from booking
      if (b.paymentReference) {
        paymentInfo = {
          razorpayPaymentId: b.paymentReference,
          amount: totalFare,
          currency: "INR",
          status: b.paymentStatus || "SUCCESS",
        };
      }
    }

    const statePayload = {
      ticket: {
        bookingId: b.bookingId || "N/A",
        bookingStatus: b.bookingStatus || b.status || "CONFIRMED",
        paymentStatus: b.paymentStatus || "SUCCESS",
        paymentReference: b.paymentReference || "MOCK-REF-HISTORY",
        totalFare: totalFare,
        bookedSeats: seatsArray,
        bookedAt: b.bookedAt || b.createdAt || b.travelDate || new Date().toISOString()
      },
      meta: {
        busName: b.busName || b.busDetails?.name || b.busId?.busName || "Payanam Express",
        boarding: b.boardingPoint || { city: b.source || b.routeId?.source || "Origin", name: "Main Terminal", time: "Dep TBD" },
        dropping: b.droppingPoint || { city: b.destination || b.routeId?.destination || "Destination", name: "Main Terminal", time: "Arr TBD" },
        passengers: Array.isArray(b.passengerDetails) 
          ? b.passengerDetails 
          : seatsArray.map(seat => ({ name: "Passenger", seatNumber: seat, age: "N/A", gender: "N/A" })),
        payment: paymentInfo,
      }
    };

    navigate("/ticketdetails", { state: statePayload });
  };

  // Handles Cancellation Action
  const handleCancelBooking = async (e, bookingId) => {
    e.stopPropagation(); // Prevent navigating to ticket details screen
    
    const confirmCancel = window.confirm(`Are you sure you want to cancel booking ${bookingId}?`);
    if (!confirmCancel) return;

    setCancelLoading(bookingId);
    setError("");
    setSuccess("");

    try {
      const res = await api.post(`/api/v1/bookings/${bookingId}/cancel`);
      if (res.data?.success) {
        setSuccess(res.data.message || "Booking cancelled successfully.");
        
        // Optimistically update local booking records or completely refetch items
        setBookings((prevBookings) =>
          prevBookings.map((b) =>
            (b.bookingId === bookingId) ? { ...b, status: "Cancelled" } : b
          )
        );
      }
    } catch (err) {
      // Safely catch structural array messages defined in validation errors array block
      const serverError = err.response?.data?.errors?.[0] || err.response?.data?.message || "Failed to cancel booking.";
      setError(serverError);
    } finally {
      setCancelLoading(null);
    }
  };

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.put("/api/users/profile", {
        name: form.name,
        email: form.email,
        phoneNo: form.phoneNo,
        address: form.address,
      });
      const updated = res.data?.data ?? res.data?.user ?? {};
      setForm((p) => ({
        ...p,
        name: updated.name || p.name,
        email: updated.email || p.email,
        phoneNo: updated.phoneNo || updated.phone || p.phoneNo,
        address: updated.address || p.address,
        role: updated.role || p.role,
      }));
      setSuccess("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try { await api.post("/api/auth/logout"); } catch {}
    logout();
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/api/users/profile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success) {
        const imageUrl = res.data.data.profileImage;
        setProfileImage(imageUrl);
        setImagePreview(imageUrl);
        setSuccess('Profile image uploaded successfully!');
        
        // Sync image to AuthContext so navbar updates immediately
        updateUser({ profileImage: imageUrl });
        
        // Force refresh profile to update initials fallback
        await fetchProfileAndBookings();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = async () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Note: Backend automatically deletes from Cloudinary on next upload
    // For complete removal, you could add a DELETE endpoint
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center gap-4">
        <Nav />
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-500 border-t-transparent"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading your travel profile...</p>
      </div>
    );
  }

  const initials = form.name ? form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "TR";

  return (
    <div className="mt-20 min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans selection:bg-lime-200 selection:text-slate-900">
      <Nav />

      {/* Upgraded layout structure here: swapped max-w-5xl for full dimensions */}
      <div className="w-full px-4 py-10 sm:px-8 lg:px-12">
        
        {/* Top Header & Navigation Banner */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-700 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-700 dark:text-lime-400 mb-1">
              <span>Payanam</span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-slate-500 dark:text-slate-400">{form.role || "Explorer"}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Traveler Profile</h1>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              to="/MainPage"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-700 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 shadow-sm transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 animate-fade-in">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-lime-200 dark:border-lime-700 bg-lime-50 dark:bg-lime-900/20 px-4 py-3 text-sm text-lime-800 dark:text-lime-400 animate-fade-in">
            ✨ {success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Left Panel: Profile Card & Quick Stats (Adjusted column layout span to match wide style) */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-center shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-600 rounded-full blur-3xl -mr-5 -mt-5 transition-all"></div>
              
              {/* Profile Image */}
              <div className="relative mx-auto inline-block">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-lime-600 to-lime-500 text-xl font-bold text-lime-950 shadow-md overflow-hidden">
                  {imagePreview || profileImage ? (
                    <img 
                      src={imagePreview || profileImage} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                
                {/* Camera Icon Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute bottom-0 right-0 rounded-full bg-lime-600 p-2 text-white shadow-md hover:bg-lime-700 transition-colors disabled:opacity-50"
                  title="Upload profile picture"
                >
                  {uploadingImage ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Camera size={14} />
                  )}
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">{form.name || "Adventurer"}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{form.email}</p>
              
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-lime-100 dark:bg-lime-900/30 px-3 py-1 text-xs font-semibold text-lime-800 dark:text-lime-400">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-500 dark:bg-lime-400 animate-pulse"></span>
                Verified Member
              </div>

              {/* Dynamic Analytics Data */}
              <div className="mt-6 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-700 pt-6 text-left">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 p-3 border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Trips Booked</p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                    {bookingsLoading ? "..." : bookings.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Preferences Selection Box */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Quick Preferences</h4>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-slate-50 dark:bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">Window Seat</span>
                <span className="rounded-lg bg-slate-50 dark:bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">Lower Berth</span>
                <span className="rounded-lg bg-slate-50 dark:bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">AC Sleeper</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Account Details Form & Bookings History Visualizer */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Primary Profile Form */}
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Personal Information</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Used for e-tickets & vouchers</p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    disabled={!editing}
                    className="mt-1.5 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-lime-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:border-slate-200 dark:disabled:border-slate-600"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    disabled={!editing}
                    className="mt-1.5 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-lime-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:border-slate-200 dark:disabled:border-slate-600"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact Number</label>
                  <input
                    name="phoneNo"
                    type="tel"
                    value={form.phoneNo}
                    onChange={onChange}
                    disabled={!editing}
                    className="mt-1.5 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-lime-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:border-slate-200 dark:disabled:border-slate-600"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Home Address</label>
                  <input
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={onChange}
                    disabled={!editing}
                    className="mt-1.5 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-lime-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:border-slate-200 dark:disabled:border-slate-600"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700 pt-4">
                {editing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-lime-500 dark:bg-lime-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-lime-500/10 dark:shadow-lime-900/30 transition-all hover:bg-lime-600 dark:hover:bg-lime-700 disabled:opacity-50"
                    >
                      {saving ? "Updating..." : "Save Configuration"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="rounded-xl bg-lime-500 dark:bg-lime-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-lime-500/10 dark:shadow-lime-900/30 transition-all hover:bg-lime-600 dark:hover:bg-lime-700"
                  >
                    Modify Profile
                  </button>
                )}
              </div>
            </form>

            {/* Dynamic Travel Segment Component: My Trips Tracker */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-wide">My Bookings History</h4>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                  Most Recent First
                </span>
              </div>

              {bookingsLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-lime-500 border-t-transparent"></div>
                  Fetching your journeys...
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-700/20">
                  <Ticket className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={32} />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No trips found</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Looks like you haven't booked any tickets yet.</p>
                  <Link to="/MainPage" className="mt-3 inline-flex text-xs bg-lime-500 dark:bg-lime-600 text-white font-bold px-4 py-2 rounded-xl shadow-xs hover:bg-lime-600 dark:hover:bg-lime-700 transition">
                    Book Your First Ride
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1 scrollbar-thin">
                  {bookings.map((b, i) => {
                    const bookingId = b.bookingId || `BK-${1000 + i}`;
                    const source = b.boardingPoint?.city || b.routeId?.source || b.source || "Origin";
                    const destination = b.droppingPoint?.city || b.routeId?.destination || b.destination || "Destination";
                    const totalFare = b.totalFare || b.totalAmount || b.fare || 0;
                    const isCancelled = b.status?.toLowerCase() === 'cancelled' || b.bookingStatus?.toLowerCase() === 'cancelled';

                    // Departure / arrival date+time from the populated schedule
                    const depDate = b.scheduleId?.departureDate
                      ? new Date(b.scheduleId.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : b.travelDate
                        ? new Date(b.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : "Date TBD";
                    const depTime = b.scheduleId?.departureTime || b.boardingPoint?.time || "--:--";
                    const arrTime = b.scheduleId?.arrivalTime || b.droppingPoint?.time || "--:--";

                    const seats = Array.isArray(b.passengerDetails)
                      ? b.passengerDetails.map(p => p.seatNumber).join(", ")
                      : (b.seatNumbers || b.bookedSeats || []).join(", ") || "N/A";

                    return (
                      <div 
                        key={bookingId} 
                        onClick={() => handleViewTicketDetails(b)} // CLICK INTERACTION TRIGGER LINKED HERE
                        className="group flex flex-col rounded-xl bg-slate-50 dark:bg-slate-700/30 p-4 border border-slate-200/60 dark:border-slate-700/60 shadow-xs hover:border-lime-300 dark:hover:border-lime-600 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer relative"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-2 mb-3 text-[11px]">
                          <span className="font-mono font-bold text-slate-600 dark:text-slate-400 tracking-wider">
                            PNR: <span className="text-slate-900 dark:text-slate-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">{bookingId}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-md ${
                              isCancelled 
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                                : 'bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400'
                            }`}>
                              {b.status || b.bookingStatus || "Confirmed"}
                            </span>
                            <span className="text-[10px] text-lime-600 dark:text-lime-400 font-bold items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all hidden sm:inline-flex">
                              View Ticket <Eye size={12} />
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Departure */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                              <MapPin size={11} className="text-lime-500 dark:text-lime-400" /> Departure
                            </p>
                            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 truncate mt-0.5">{source}</p>
                            <p className="text-lg font-bold text-slate-500 dark:text-slate-400 truncate">{b.boardingPoint?.name || ""}</p>
                            <p className="mt-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              <span className="inline-flex items-center gap-1"><Calendar size={10} /> {depDate}</span>
                              <span className="ml-2 text-lime-600 dark:text-lime-400">{depTime}</span>
                            </p>
                          </div>

                          {/* Journey indicator */}
                          <div className="flex flex-col items-center px-3 flex-shrink-0 max-w-[100px]">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">{b.busId?.busType || "Bus"}</span>
                            <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-600 relative my-1">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm bg-slate-50 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 px-1 transition-colors">🚌</div>
                            </div>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{b.busId?.busName || b.busName || ""}</span>
                          </div>

                          {/* Arrival */}
                          <div className="text-right flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 justify-end">
                              Arrival <MapPin size={11} className="text-red-400 dark:text-red-300" />
                            </p>
                            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 truncate mt-0.5">{destination}</p>
                            <p className="text-lg font-bold text-slate-500 dark:text-slate-400 truncate">{b.droppingPoint?.name || ""}</p>
                            <p className="mt-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              <span className="text-red-500 dark:text-red-400">{arrTime}</span>
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Armchair size={12} className="text-slate-400 dark:text-slate-500" />
                            Seats: <span className="text-slate-800 dark:text-slate-200 font-bold">{seats}</span>
                          </span>
                          
                          <div className="flex items-center gap-4">
                            {/* Cancellation Button Trigger */}
                            {!isCancelled && b.bookingId && (
                              <button
                                onClick={(e) => handleCancelBooking(e, b.bookingId)}
                                disabled={cancelLoading === b.bookingId}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                {cancelLoading === b.bookingId ? (
                                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 dark:border-red-400 border-t-transparent" />
                                ) : (
                                  <Trash2 size={12} />
                                )}
                                Cancel
                              </button>
                            )}
                            
                            <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                              ₹{totalFare.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}