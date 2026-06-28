import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "./NavComponent.jsx";
import api from "./api/axios.js";
import { useAuth } from "./context/AuthContext.jsx";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phoneNo: "", address: "", role: "" });

  useEffect(() => {
    const fetchProfile = async () => {
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
    };
    fetchProfile();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Nav />
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-500 border-t-transparent"></div>
        <p className="text-slate-500 text-sm font-medium">Loading your travel profile...</p>
      </div>
    );
  }

  const initials = form.name ? form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "TR";

  return (
    <div className=" mt-20 min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-lime-200 selection:text-slate-900">
      <Nav />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Top Header & Navigation Banner */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-700 mb-1">
              <span>Payanam</span>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <span className="text-slate-500">{form.role || "Explorer"}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Traveler Profile</h1>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              to="/MainPage"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl bg-white border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 shadow-sm transition-all hover:bg-red-50 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-800 animate-fade-in">
            ✨ {success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left Panel: Profile Card & Quick Stats */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 rounded-full blur-3xl -mr-5 -mt-5 transition-all group-hover:bg-lime-400/20"></div>
              
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-lime-400 to-lime-300 text-xl font-bold text-lime-950 shadow-md">
                {initials}
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{form.name || "Adventurer"}</h3>
              <p className="text-xs text-slate-500">{form.email}</p>
              
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-lime-800">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse"></span>
                Verified Member
              </div>

              {/* Gamified Travel Perks */}
              <div className="mt-6 grid grid-cols-2 gap-2 border-t border-slate-100 pt-6 text-left">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Trips Taken</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5">14</p>
                </div>
                <div className="rounded-xl bg-lime-50/60 p-3 border border-lime-100/50">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-lime-700">Payanam Coins</p>
                  <p className="text-xl font-extrabold text-lime-800 mt-0.5">2,450</p>
                </div>
              </div>
            </div>

            {/* In-Flight Preferences */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Preferences</h4>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200">Window Seat</span>
                <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200">Veg Meal</span>
                <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200">Luxury Stays</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Account Details Form & Flight Route Tracker */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Primary Profile Form */}
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-400">Used for e-tickets & vouchers</p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    disabled={!editing}
                    className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-lime-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    disabled={!editing}
                    className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-lime-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Number</label>
                  <input
                    name="phoneNo"
                    type="tel"
                    value={form.phoneNo}
                    onChange={onChange}
                    disabled={!editing}
                    className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-lime-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Home Address</label>
                  <input
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={onChange}
                    disabled={!editing}
                    className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-lime-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                {editing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-lime-500 px-5 py-2 text-sm font-bold text-white shadow-md shadow-lime-500/10 transition-all hover:bg-lime-600 disabled:opacity-50"
                    >
                      {saving ? "Updating..." : "Save Configuration"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="rounded-xl bg-lime-500 px-5 py-2 text-sm font-bold text-white shadow-md shadow-lime-500/10 transition-all hover:bg-lime-600"
                  >
                    Modify Profile
                  </button>
                )}
              </div>
            </form>

            {/* Travel Segment Component: Route Preview */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-100 to-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 tracking-wide">Upcoming Journey</h4>
                <span className="text-xs font-semibold text-lime-700 bg-lime-100 px-2 py-0.5 rounded-md">Confirmed</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white p-4 border border-slate-200/60 shadow-inner">
                <div>
                  <p className="text-xs text-slate-400">Departing Flight</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-0.5">MAA</p>
                  <p className="text-[11px] font-medium text-slate-500">Chennai</p>
                </div>
                <div className="flex flex-col items-center flex-1 px-4">
                  <span className="text-[10px] text-lime-700 font-mono font-bold tracking-widest">PY-402</span>
                  <div className="w-full h-[1px] bg-slate-200 relative my-1">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs bg-white px-1">✈️</div>
                  </div>
                  <span className="text-[10px] text-slate-400">2h 15m</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Destination</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-0.5">BLR</p>
                  <p className="text-[11px] font-medium text-slate-500">Bengaluru</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}