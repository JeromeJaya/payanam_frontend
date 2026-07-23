import { MapPin, Star } from "lucide-react";

export default function PopularDestinations({ destinationsRef, destinationsRevealed }) {
  const destinations = [
    { city: "Goa", country: "India", image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop", price: "₹4,999", rating: 4.8 },
    { city: "Manali", country: "India", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", price: "₹7,499", rating: 4.7 },
    { city: "Kerala", country: "India", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop", price: "₹12,999", rating: 4.9 },
    { city: "Jaipur", country: "India", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop", price: "₹6,499", rating: 4.6 },
    { city: "Singapore", country: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop", price: "₹24,999", rating: 4.9 },
    { city: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop", price: "₹29,999", rating: 4.8 },
  ];

  return (
    <section ref={destinationsRef} className="py-28 bg-slate-50/80 backdrop-blur-sm relative z-10">
      <div className="w-full px-6 sm:px-12 lg:px-20">
        <div className={`text-center mb-16 space-y-3 transition-all duration-1000 ${destinationsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Popular Destinations
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Discover trending travel destinations booked by millions of travelers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-700 transform hover:scale-[1.02] ${
                destinationsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="absolute inset-0">
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/800x600/84cc16/ffffff?text=${dest.city}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-lime-400" />
                  <span className="text-sm text-lime-300">{dest.country}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{dest.city}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-300">Starting from</span>
                    <p className="text-xl font-bold text-lime-400">{dest.price}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold">{dest.rating}</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-lime-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Book Now
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
