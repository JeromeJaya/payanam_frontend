import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./NavComponent";
import { Search, BookOpen, CreditCard, UserCheck, Clock, Shield, Headphones, ChevronRight } from "lucide-react";

const HELP_TOPICS = [
  {
    icon: BookOpen,
    title: "Booking a Flight",
    desc: "Learn how to search, select seats, add baggage, and complete your flight booking in just a few steps.",
    articles: [
      "How do I search for flights?",
      "How do I select my preferred seat?",
      "Can I add extra baggage during booking?",
      "What payment methods are accepted?",
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Refunds",
    desc: "Everything about Razorpay payments, GST invoices, refund timelines, and failed transaction handling.",
    articles: [
      "What if my payment fails but amount is deducted?",
      "How long do refunds take?",
      "Can I get a GST invoice for my booking?",
      "Is my payment information secure?",
    ],
  },
  {
    icon: UserCheck,
    title: "Account & Profile",
    desc: "Manage your profile, update contact details, link mobile/email, and understand verification badges.",
    articles: [
      "How do I verify my mobile number?",
      "Can I change my registered email?",
      "How do I update my profile photo?",
      "What is the save billing details feature?",
    ],
  },
  {
    icon: Clock,
    title: "Cancellations & Changes",
    desc: "Understand cancellation policies, date change fees, and how to modify your bookings before departure.",
    articles: [
      "Can I cancel my flight booking?",
      "What is the date change fee?",
      "How do I request a refund?",
      "What happens if the airline cancels my flight?",
    ],
  },
  {
    icon: Shield,
    title: "Safety & Trust",
    desc: "Our commitment to secure transactions, data privacy, and verified vendor partnerships.",
    articles: [
      "How are vendors verified on Payanam?",
      "Is my personal data safe?",
      "What is price lock and how does it work?",
      "How do I report a suspicious listing?",
    ],
  },
  {
    icon: Headphones,
    title: "Contact Support",
    desc: "Reach our support team via email, phone, or live chat for urgent issues or general enquiries.",
    articles: [
      "How do I reach customer support?",
      "What are the support hours?",
      "How do I escalate an unresolved issue?",
      "Is there emergency support while travelling?",
    ],
  },
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTopic, setExpandedTopic] = useState(null);

  const filteredTopics = searchQuery.trim()
    ? HELP_TOPICS.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.articles.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : HELP_TOPICS;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Nav />

      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-teal-100 mb-6">
            <Headphones size={14} />
            SUPPORT
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
            Search our help articles or browse topics below to find answers quickly.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base font-medium shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-lime-400 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, idx) => {
            const Icon = topic.icon;
            const isExpanded = expandedTopic === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{topic.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{topic.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedTopic(isExpanded ? null : idx)}
                    className="flex items-center gap-1 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  >
                    {isExpanded ? "Show less" : `View ${topic.articles.length} articles`}
                    <ChevronRight
                      size={14}
                      className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>

                {/* Expanded Articles */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-6 py-4">
                    <ul className="space-y-2">
                      {topic.articles.map((article, aIdx) => (
                        <li key={aIdx}>
                          <button
                            onClick={() => navigate("/contact-us")}
                            className="w-full text-left flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 py-1.5 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                            {article}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No results found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try a different search term or browse all topics above.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Still need help?</h2>
          <p className="text-teal-100 mb-8">Our support team is ready to assist you with any issue.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/contact-us")}
              className="bg-white text-teal-700 font-bold px-8 py-3 rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate("/faqs")}
              className="bg-teal-500 text-white font-bold px-8 py-3 rounded-xl border border-teal-400 hover:bg-teal-400 transition-colors"
            >
              Browse FAQs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
