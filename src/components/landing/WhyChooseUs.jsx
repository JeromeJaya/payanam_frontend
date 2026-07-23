import { Shield, Zap, Clock, Globe, Heart, Award, Smartphone, Headphones } from "lucide-react";

export default function WhyChooseUs({ whyChooseRef, whyChooseRevealed }) {
  const features = [
    { icon: Shield, title: "Secure Payments", desc: "Bank-grade encryption for all transactions with PCI DSS compliance.", color: "lime" },
    { icon: Zap, title: "Instant Booking", desc: "Real-time confirmation with e-tickets delivered in under 30 seconds.", color: "emerald" },
    { icon: Clock, title: "24/7 Support", desc: "Round-the-clock customer assistance via chat, call, and email.", color: "green" },
    { icon: Globe, title: "Global Coverage", desc: "Access to 500+ airlines and 1.2M+ hotels across 190 countries.", color: "teal" },
    { icon: Award, title: "Best Price Guarantee", desc: "Find a lower price elsewhere and we'll match it instantly.", color: "lime" },
    { icon: Smartphone, title: "Mobile First", desc: "Dedicated apps for iOS and Android with exclusive mobile deals.", color: "emerald" },
    { icon: Headphones, title: "Personalized Service", desc: "AI-powered recommendations based on your travel preferences.", color: "green" },
    { icon: Heart, title: "Flexible Policies", desc: "Free cancellations and easy rescheduling on most bookings.", color: "teal" },
  ];

  const colorClasses = {
    lime: "from-lime-500 to-lime-600",
    emerald: "from-emerald-500 to-emerald-600",
    green: "from-green-500 to-green-600",
    teal: "from-teal-500 to-teal-600",
  };

  return (
    <section ref={whyChooseRef} className="py-28 bg-white/80 backdrop-blur-sm relative z-10">
      <div className="w-full px-6 sm:px-12 lg:px-20">
        <div className={`text-center mb-16 space-y-3 transition-all duration-1000 ${whyChooseRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Why Travelers Trust ViaSmart
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Experience seamless travel booking with industry-leading features designed for modern travelers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                  whyChooseRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[feature.color]} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[feature.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
