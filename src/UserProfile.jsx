import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "./NavComponent.jsx";
import api from "./api/axios.js";
import { useAuth } from "./context/AuthContext.jsx";
import ProfileHeader from "./components/profile/ProfileHeader.jsx";
import NotificationBanner from "./components/profile/NotificationBanner.jsx";
import ProfileSidebar from "./components/profile/ProfileSidebar.jsx";
import PersonalInfoForm from "./components/profile/PersonalInfoForm.jsx";
import BillingInfo from "./components/profile/BillingInfo.jsx";
import BookingsHistory from "./components/profile/BookingsHistory.jsx";
import ReviewModal from "./components/profile/ReviewModal.jsx";

export default function UserProfile() {
  const { userId } = useParams();
  const { updateUser } = useAuth();
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
  const [, setPriceLocks] = useState([]);
  const [, setPriceLocksLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewEditMode, setReviewEditMode] = useState(false);
  const [reviewsByBooking, setReviewsByBooking] = useState({});
  const isAdminView = !!userId;
  const getReviewText = (r) => r?.review || r?.comment || r?.text || r?.content || r?.message || "";

  const fetchProfileAndBookings = async () => {
    try {
      const endpoint = userId ? `/api/v1/admin/users/${userId}` : "/api/users/profile";
      const res = await api.get(endpoint);
      const u = res.data?.data ?? res.data?.user ?? {};
      const profileData = {
        name: u.name || "", email: u.email || "", phoneNo: u.phoneNo || u.phone || "",
        address: u.address || "", role: u.role || "",
      };
      setForm(profileData);
      setSavedProfile(profileData);
      if (u.profileImage) { setProfileImage(u.profileImage); setImagePreview(u.profileImage); }
    } catch {
      const local = (() => { try { return JSON.parse(localStorage.getItem("payanam_user")); } catch { return null; } })();
      if (local) {
        setForm({ name: local.name || local.userName || "", email: local.email || "", phoneNo: local.phoneNo || local.phone || "", address: "", role: local.role || "" });
        setSavedProfile({ name: local.name || local.userName || "", email: local.email || "", phoneNo: local.phoneNo || local.phone || "", address: "", role: local.role || "" });
      }
      setError(local ? null : "Failed to load profile");
    } finally { setLoading(false); }

    if (!userId) {
      try {
        const res = await api.get("/api/v1/bookings/my-bookings");
        if (res.data?.success) setBookings(res.data.data || []);
      } catch {}
      finally { setBookingsLoading(false); }
      try {
        const res = await api.get("/api/v1/reviews/user");
        if (res.data?.success) {
          const map = {};
          (res.data.data || []).forEach((r) => { map[r.bookingId || r.booking] = r; });
          setReviewsByBooking(map);
        }
      } catch {}
    } else { setBookingsLoading(false); }

    if (!userId) {
      try {
        const res = await api.get("/api/v1/flights/price-locks/my-locks");
        if (res.data?.success) setPriceLocks(res.data.data || []);
      } catch {}
      finally { setPriceLocksLoading(false); }
    } else { setPriceLocksLoading(false); }
  };

  useEffect(() => { fetchProfileAndBookings(); }, [userId]);
  useEffect(() => { if (error) { const t = setTimeout(() => setError(""), 5000); return () => clearTimeout(t); } }, [error]);
  useEffect(() => { if (success) { const t = setTimeout(() => setSuccess(""), 5000); return () => clearTimeout(t); } }, [success]);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleViewTicketDetails = async (b) => {
    const totalFare = b.totalFare || b.totalAmount || b.fare || 0;
    const seatsArray = Array.isArray(b.passengerDetails) ? b.passengerDetails.map(p => p.seatNumber) : (b.seatNumbers || []);
    const isFlightBooking = b.bookingId?.startsWith("FLY-") || b.serviceType === "flight";
    let paymentInfo = null;
    try {
      const paymentRes = await api.get(`/api/v1/payments/status/${b._id}`);
      if (paymentRes.data?.success && paymentRes.data.data?.payment) {
        const p = paymentRes.data.data.payment;
        paymentInfo = { razorpayOrderId: p.razorpayOrderId, razorpayPaymentId: p.razorpayPaymentId, amount: p.amount, currency: p.currency, status: p.status, createdAt: p.createdAt };
      }
    } catch {}

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
          bookingId: b.bookingId || "N/A", bookingStatus: b.bookingStatus || b.status || "CONFIRMED", totalFare,
          bookedSeats: seatsArray, bookedAt: b.bookedAt || b.createdAt || new Date().toISOString(),
          scheduleId: b.scheduleId || null, paymentStatus: paymentInfo?.status || b.paymentStatus || "PENDING",
          paymentReference: paymentInfo?.razorpayPaymentId || b.paymentReference || "",
        },
        meta: {
          flightName: isFlightBooking ? (b.busId?.airlineName || "Airline") : undefined,
          flightNumber: isFlightBooking ? (b.flightNumber || "") : undefined,
          busName: !isFlightBooking ? (b.busId?.busName || "Payanam Express") : undefined,
          boarding, dropping,
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
    } catch (err) { setError(err.response?.data?.errors?.[0] || "Failed to cancel"); }
    finally { setCancelLoading(null); }
  };

  const openReviewModal = (booking) => {
    setReviewBooking(booking);
    const existing = reviewsByBooking[booking.bookingId || booking._id];
    if (existing) {
      setReviewRating(existing.rating || 0);
      setReviewText(getReviewText(existing));
      setReviewEditMode(true);
    } else {
      setReviewRating(0);
      setReviewText("");
      setReviewEditMode(false);
    }
    setReviewError("");
    setReviewSuccess("");
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewRating < 1 || reviewRating > 5) { setReviewError("Please select a rating between 1 and 5 stars"); return; }
    if (reviewText.trim().length < 10) { setReviewError("Review must be at least 10 characters long"); return; }
    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess("");
    try {
      const busId = reviewBooking.busId?._id || (typeof reviewBooking.busId === 'string' ? reviewBooking.busId : null) || reviewBooking.scheduleId?.busId;
      const bookingId = reviewBooking.bookingId || reviewBooking._id;
      if (reviewEditMode) {
        const putRes = await api.put(`/api/v1/buses/${busId}/reviews/${bookingId}`, { rating: reviewRating, review: reviewText.trim() });
        const updated = putRes.data?.data || putRes.data?.review || {};
        setReviewsByBooking((prev) => ({ ...prev, [bookingId]: { ...prev[bookingId], ...updated, rating: reviewRating, review: reviewText.trim() } }));
        setReviewSuccess("Review updated successfully!");
      } else {
        const res = await api.post(`/api/v1/buses/${busId}/reviews`, { bookingId: reviewBooking._id, rating: reviewRating, review: reviewText.trim() });
        if (res.data.success) {
          const created = res.data.data || res.data.review || {};
          setReviewsByBooking((prev) => ({ ...prev, [bookingId]: { ...created, rating: reviewRating, review: reviewText.trim(), bookingId } }));
          setReviewSuccess("Review added successfully!");
        }
      }
      setTimeout(() => { setReviewSuccess(""); setShowReviewModal(false); setReviewBooking(null); }, 1500);
    } catch (err) {
      setReviewError(err.response?.data?.message || (reviewEditMode ? "Failed to update review" : "Failed to add review"));
    } finally { setReviewLoading(false); }
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
    const payload = { name: form.name.trim(), email: form.email.trim() };
    if (form.phoneNo && form.phoneNo.trim() !== "") payload.phoneNo = form.phoneNo.trim();
    try {
      const res = await api.put("/api/users/profile", payload);
      const updatedUser = res.data?.data;
      if (updatedUser) {
        updateUser(updatedUser);
        setSavedProfile({ name: updatedUser.name || "", email: updatedUser.email || "", phoneNo: updatedUser.phoneNo || updatedUser.phone || "", address: updatedUser.address || "", role: updatedUser.role || "" });
      }
      setSuccess("Profile updated");
      setEditing(false);
    } catch (err) { setError(err.response?.data?.errors?.[0] || err.response?.data?.message || "Failed to update"); }
    finally { setSaving(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await api.put("/api/users/profile/upload-image", formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) { setProfileImage(res.data.data.profileImage); setImagePreview(res.data.data.profileImage); setSuccess("Profile image updated"); }
    } catch (err) { setError(err.response?.data?.errors?.[0] || "Failed to upload image"); }
    finally { setUploadingImage(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-500 border-t-transparent"></div></div>;

  return (
    <div className="mt-20 min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Nav />
      <div className="w-full px-4 py-10 sm:px-8 lg:px-12">
        <ProfileHeader isAdminView={isAdminView} />
        {error && <NotificationBanner type="error" message={error} onDismiss={() => setError("")} />}
        {success && <NotificationBanner type="success" message={success} onDismiss={() => setSuccess("")} />}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <ProfileSidebar
            imagePreview={imagePreview}
            profileImage={profileImage}
            uploadingImage={uploadingImage}
            form={form}
            savedProfile={savedProfile}
            onImageUpload={handleImageUpload}
          />
          <div className="lg:col-span-3 space-y-6">
            <PersonalInfoForm
              form={form}
              editing={editing}
              saving={saving}
              isAdminView={isAdminView}
              savedProfile={savedProfile}
              onChange={onChange}
              onSave={handleSubmit}
              onCancel={() => { setEditing(false); setForm(savedProfile); }}
              onStartEdit={() => setEditing(true)}
            />
            <BillingInfo email={form.email} phoneNo={form.phoneNo} />
            {!isAdminView && (
              <BookingsHistory
                bookings={bookings}
                bookingsLoading={bookingsLoading}
                reviewsByBooking={reviewsByBooking}
                cancelLoading={cancelLoading}
                onViewTicket={handleViewTicketDetails}
                onCancelBooking={handleCancelBooking}
                onOpenReview={openReviewModal}
              />
            )}
          </div>
        </div>
      </div>
      <ReviewModal
        showReviewModal={showReviewModal}
        reviewBooking={reviewBooking}
        reviewRating={reviewRating}
        reviewText={reviewText}
        reviewLoading={reviewLoading}
        reviewError={reviewError}
        reviewSuccess={reviewSuccess}
        reviewEditMode={reviewEditMode}
        onClose={closeReviewModal}
        onSubmit={handleReviewSubmit}
        onRatingChange={(star) => setReviewRating(star)} onTextChange={(e) => setReviewText(e.target.value)}
      />
    </div>
  );
}
