import Nav from "./NavComponent";
import { FileText, Shield, AlertCircle } from "lucide-react";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Payanam platform ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not access or use the Service. These terms apply to all users, including travellers, vendors, and guests.`,
  },
  {
    id: "services",
    title: "2. Description of Services",
    content: `Payanam is a travel booking platform that facilitates the reservation of flights, buses, trains, and hotels. We act as an intermediary between travellers and transport/service providers (vendors). Payanam does not operate any transport services directly — all bookings are fulfilled by our partnered vendors who are independently responsible for service delivery.`,
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content: `You may browse the platform without an account, but booking requires a registered account. You agree to provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You must notify us immediately of any unauthorised use.`,
  },
  {
    id: "booking",
    title: "4. Booking & Ticketing",
    content: `All bookings are subject to availability and confirmation by the respective vendor. Fares displayed are inclusive of GST but may change without notice until a booking is confirmed and paid. Once confirmed, a booking reference (PNR) and ticket will be issued via email. It is your responsibility to verify all details (dates, names, routes) before payment.`,
  },
  {
    id: "payments",
    title: "5. Payments",
    content: `Payments are processed securely through Razorpay, supporting UPI, cards, net banking, and wallets. All amounts are in Indian Rupees (₹) and inclusive of applicable taxes. Payanam does not store your card or banking details. Failed payments that result in a debit will be automatically refunded within 5–7 business days.`,
  },
  {
    id: "cancellation",
    title: "6. Cancellations & Refunds",
    content: `Cancellation policies are set by individual vendors/airlines and are displayed at the time of booking. Refunds, if applicable, are processed to the original payment method within 7–10 business days. Payanam service fees and price lock fees are non-refundable. In case of vendor-initiated cancellations, a full refund or rebooking will be provided.`,
  },
  {
    id: "baggage",
    title: "7. Baggage & Extra Services",
    content: `Standard baggage allowance is determined by the vendor/airline and shown during booking. Extra baggage can be purchased at checkout at the rates displayed. Extra baggage fees are non-refundable. Each piece of extra baggage must not exceed 30 Kg for safety compliance.`,
  },
  {
    id: "price-lock",
    title: "8. Price Lock",
    content: `The Price Lock feature allows you to reserve a fare for a limited period by paying a small non-refundable fee. If you complete the booking within the lock window, the locked fare is honoured. If the lock expires before booking, the fare is no longer guaranteed. The price lock fee is not adjustable toward the booking cost.`,
  },
  {
    id: "vendor",
    title: "9. Vendor Obligations",
    content: `Vendors listing on Payanam must provide accurate schedule, pricing, and availability information. Vendors are solely responsible for the quality and safety of their transport services. Payanam reserves the right to suspend or remove vendors who violate platform policies, receive repeated complaints, or fail to honour confirmed bookings.`,
  },
  {
    id: "liability",
    title: "10. Limitation of Liability",
    content: `Payanam shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Service. Our liability is limited to the booking amount paid. We are not responsible for delays, cancellations, or service issues caused by vendors, airlines, weather, or force majeure events.`,
  },
  {
    id: "privacy",
    title: "11. Privacy & Data",
    content: `Your privacy is important to us. Personal data (name, email, phone) collected during registration and booking is used solely for service delivery and communication. We do not sell your data to third parties. Data is stored securely and handled in accordance with applicable data protection regulations.`,
  },
  {
    id: "prohibited",
    title: "12. Prohibited Conduct",
    content: `You agree not to: use the platform for fraudulent bookings; impersonate another person; attempt to gain unauthorised access to our systems; scrape or copy platform content without permission; interfere with the operation of the Service. Violations may result in account termination and legal action.`,
  },
  {
    id: "changes",
    title: "13. Changes to Terms",
    content: `Payanam reserves the right to update these Terms at any time. Changes will be posted on this page with an updated effective date. Continued use of the Service after changes constitutes acceptance. We encourage you to review these Terms periodically.`,
  },
  {
    id: "contact",
    title: "14. Contact Us",
    content: `For questions about these Terms, please contact us at jeromeat2002@gmail.com or call +91 98948 55195. Our support team is available Monday to Saturday, 8 AM – 10 PM IST, with 24/7 emergency assistance for active bookings.`,
  },
];

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Nav />

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-slate-300 mb-6">
            <FileText size={14} />
            LEGAL
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Last updated: July 7, 2026
          </p>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="max-w-4xl mx-auto px-6 -mt-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Please read carefully</p>
            <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
              By using Payanam, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the platform.
            </p>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-10 shadow-sm">
          <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Contents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 py-1 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                {s.title.replace(/^\d+\.\s*/, "")}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="scroll-mt-24 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-7 shadow-sm"
            >
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-teal-500 flex-shrink-0" />
                {section.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-800 dark:bg-slate-950 py-12 px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-2">Have questions about these terms?</h2>
          <p className="text-slate-400 text-sm mb-6">Our support team can clarify any section for you.</p>
          <a
            href="/contact-us"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
