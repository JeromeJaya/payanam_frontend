import { useState } from "react";
import Nav from "./NavComponent";
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageSquare } from "lucide-react";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length < 10) errs.message = "Message must be at least 10 characters";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus("sending");
    // Simulate API call (replace with real endpoint when available)
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:ring-red-400 bg-red-50 dark:bg-red-900/20"
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-teal-400 focus:border-teal-400"
    } text-slate-900 dark:text-slate-100 placeholder:text-slate-400`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Nav />

      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-teal-100 mb-6">
            <MessageSquare size={14} />
            GET IN TOUCH
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            Have a question or need assistance? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Info Cards */}
          <div className="space-y-5">
            {[
              {
                icon: Phone,
                label: "Phone Support",
                value: "+91 98948 55195",
                sub: "Mon–Sat, 8 AM – 10 PM IST",
                color: "from-teal-500 to-teal-600",
              },
              {
                icon: Mail,
                label: "Email Us",
                value: "jeromeat2002@gmail.com",
                sub: "We reply within 24 hours",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: MapPin,
                label: "Office Address",
                value: "Power House",
                sub: "Tamil Nadu, India",
                color: "from-violet-500 to-violet-600",
              },
              {
                icon: Clock,
                label: "Support Hours",
                value: "24 / 7 Emergency",
                sub: "General: Mon–Sat 8 AM – 10 PM",
                color: "from-amber-500 to-amber-600",
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{card.label}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{card.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Send us a message</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Fill in the form and our team will get back to you shortly.</p>

            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Message Sent!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus(null)}
                  className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass("name")}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass("email")}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Subject *</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={inputClass("subject")}
                  >
                    <option value="">Select a topic</option>
                    <option value="booking">Booking Enquiry</option>
                    <option value="payment">Payment Issue</option>
                    <option value="cancellation">Cancellation & Refund</option>
                    <option value="account">Account / Profile</option>
                    <option value="vendor">Vendor Partnership</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Message *</label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Describe your issue or question in detail..."
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputClass("message")} resize-none`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md"
                >
                  {status === "sending" ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
