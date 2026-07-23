import { Star } from "lucide-react";

export default function TestimonialsSection({ testimonialsRef, testimonialsRevealed }) {
  const testimonials = [
    { name: "Priya Sharma", role: "Frequent Traveler", content: "ViaSmart has completely transformed how I book my travels. The instant confirmation and real-time tracking features are absolutely game-changing!", rating: 5, avatar: "PS" },
    { name: "Rahul Mehta", role: "Business Traveler", content: "As someone who travels weekly for work, I appreciate the seamless experience. The API integrations work flawlessly and customer support is top-notch.", rating: 5, avatar: "RM" },
    { name: "Ananya Reddy", role: "Family Traveler", content: "Booking family vacations has never been easier. The flexible cancellation policy and best price guarantee give us peace of mind.", rating: 5, avatar: "AR" },
  ];

  return (
    <section ref={testimonialsRef} className="py-28 bg-white relative z-10">
      <div className="w-full px-6 sm:px-12 lg:px-20">
        <div className={`text-center mb-16 space-y-3 transition-all duration-1000 ${testimonialsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            What Our Customers Say
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Join millions of satisfied travelers who trust ViaSmart for their journeys.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className={`group bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                testimonialsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-6 italic">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
