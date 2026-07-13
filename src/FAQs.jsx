import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./NavComponent";
import { ChevronDown, Search, HelpCircle } from "lucide-react";

const FAQ_CATEGORIES = [
  {
    category: "Booking",
    faqs: [
      {
        q: "How do I book a flight on Payanam?",
        a: "Enter your origin and destination cities, travel dates, and number of passengers on the home page. Browse available flights, select your preferred option, choose your seats, add any extra baggage, and proceed to payment via Razorpay to complete your booking.",
      },
      {
        q: "Can I book a round trip or multi-city itinerary?",
        a: "Yes! On the flight search page, switch the trip type to 'Round Trip' or 'Multi City' before searching. For multi-city, add each leg with its own origin, destination, and date. You'll be able to select flights for each leg separately.",
      },
      {
        q: "How do I select my seat?",
        a: "After choosing your flight, you'll be taken to the seat selection page where you can see the full aircraft layout. Available seats are shown in purple — tap to select. Extra-legroom seats are marked and cost ₹100 more. Once done, click 'Continue' to proceed.",
      },
      {
        q: "Can I add extra baggage to my booking?",
        a: "Yes. On the checkout page, you'll see a 'Got excess baggage?' section. Click 'ADD BAGGAGE' to open the baggage modal where you can select weight tiers (5 Kg to 25 Kg) and quantities. The cost is added to your total and included in the final booking.",
      },
      {
        q: "What is the Price Lock feature?",
        a: "Price Lock lets you freeze the current fare for a limited time while you finalise your details. A small non-refundable fee applies. If you complete the booking within the lock period, the locked fare is honoured. If not, the lock expires and the fare may change.",
      },
    ],
  },
  {
    category: "Payments",
    faqs: [
      {
        q: "What payment methods does Payanam accept?",
        a: "Payanam uses Razorpay as its payment gateway. You can pay via UPI (GPay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, and select wallets. All transactions are encrypted and PCI-DSS compliant.",
      },
      {
        q: "Is GST included in the displayed fare?",
        a: "Yes. All fares displayed on Payanam are inclusive of GST. The final amount you see at checkout — including any extra baggage — is the total you pay. A detailed breakdown is shown in the price summary.",
      },
      {
        q: "What happens if my payment fails but the amount is deducted?",
        a: "In rare cases, a bank debit may succeed but the payment response doesn't reach us. Razorpay automatically reconciles such transactions and the amount is refunded to your source account within 5–7 business days. You can also contact support with your transaction ID.",
      },
      {
        q: "Can I pay later or use EMI?",
        a: "Payanam currently supports full upfront payments only. EMI and buy-now-pay-later options are planned for a future release.",
      },
    ],
  },
  {
    category: "Cancellations & Refunds",
    faqs: [
      {
        q: "Can I cancel my flight booking?",
        a: "Yes, cancellations are subject to the airline's cancellation policy shown at the time of booking. Cancellation fees vary by airline and how close to departure you cancel. Visit 'My Bookings' in your profile to initiate a cancellation.",
      },
      {
        q: "How long do refunds take?",
        a: "Once a cancellation is approved, refunds are processed to the original payment method. UPI refunds typically take 3–5 business days; card refunds may take 7–10 business days depending on your bank.",
      },
      {
        q: "What if the airline cancels my flight?",
        a: "If the airline cancels your flight, you're entitled to a full refund or re-booking on the next available flight at no extra cost. Our support team will notify you via email and SMS with your options.",
      },
    ],
  },
  {
    category: "Account & Profile",
    faqs: [
      {
        q: "How do I create a Payanam account?",
        a: "You can sign up with your email and password, or use mobile OTP-based login. On the login page, choose 'Sign Up' and enter your details. Mobile OTP login automatically creates an account if one doesn't exist.",
      },
      {
        q: "How do I verify my mobile number or email?",
        a: "For email: a verification link is sent to your inbox upon registration. For mobile: an OTP is sent via SMS — enter it on the verification screen. Verified accounts get a badge on the profile page.",
      },
      {
        q: "What does 'Save billing details to profile' do?",
        a: "When you check this option on the checkout page, your entered mobile number and email are saved to your Payanam profile. This means next time you book, these fields are pre-filled for faster checkout.",
      },
      {
        q: "Can I change my registered email or phone number?",
        a: "Yes. Go to your Profile page and click 'Edit'. You can update your name, email, and phone number. Email and phone changes are subject to uniqueness checks — they must not be already registered to another account.",
      },
    ],
  },
  {
    category: "Vendor & Business",
    faqs: [
      {
        q: "How do I register as a vendor on Payanam?",
        a: "Click 'List Your Service' on the home page footer or navigate to the vendor sign-up page. You'll need to provide your business name, email, phone, company details, and GST number. Our team will verify your application within 48 hours.",
      },
      {
        q: "How do vendors manage their listings?",
        a: "Once approved, vendors get access to the Vendor Dashboard where they can create and manage buses/flights, set schedules and pricing, view bookings, and track revenue. The dashboard is accessible from the nav menu when logged in as a vendor.",
      },
    ],
  },
];

export default function FAQs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState({}); // { "catIdx-qIdx": true }
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (f) =>
        !searchQuery.trim() ||
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => (activeCategory === "All" ? true : cat.category === activeCategory));

  const totalVisible = filteredCategories.reduce((sum, c) => sum + c.faqs.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Nav />

      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-teal-100 mb-6">
            <HelpCircle size={14} />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            FAQs
          </h1>
          <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
            Quick answers to the most common questions from our travellers.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-medium shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-lime-400 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 -mt-8">
        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {["All", ...FAQ_CATEGORIES.map((c) => c.category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                activeCategory === cat
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:text-teal-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-8">
          {filteredCategories.map((cat, catIdx) => (
            <div key={cat.category}>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                {cat.category}
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 ml-1">
                  ({cat.faqs.length})
                </span>
              </h2>
              <div className="space-y-2">
                {cat.faqs.map((faq, qIdx) => {
                  const key = `${catIdx}-${qIdx}`;
                  const isOpen = openItems[key];
                  return (
                    <div
                      key={key}
                      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                          {faq.q}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-0">
                          <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {totalVisible === 0 && (
          <div className="text-center py-20">
            <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No matching questions</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Try a different search term or browse all categories.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Couldn't find what you need?</h2>
          <p className="text-teal-100 mb-8">Our support team is just a message away.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/help-center")}
              className="bg-white text-teal-700 font-bold px-8 py-3 rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
            >
              Browse Help Center
            </button>
            <button
              onClick={() => navigate("/contact-us")}
              className="bg-teal-500 text-white font-bold px-8 py-3 rounded-xl border border-teal-400 hover:bg-teal-400 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
