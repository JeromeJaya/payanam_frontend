export default function ExploreDestinations() {
  const [loading, setLoading] = useState(true);
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getAnimationClass = (sectionName) => {
    return visibleSections.has(sectionName) 
      ? "opacity-100 translate-y-0" 
      : "opacity-0 translate-y-10";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      
      {/* Hero Section with Animation */}
      <section 
        data-section="hero"
        className={`relative h-[70vh] transition-all duration-1000 ${getAnimationClass("hero")}`}
      >
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center">
            Explore Amazing Destinations
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl">
            Discover beautiful places around the world and create unforgettable memories
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section 
        data-section="search"
        className={`max-w-6xl mx-auto px-4 py-10 transition-all duration-700 ${getAnimationClass("search")}`}
      >
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Find Your Dream Destination</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search destinations, countries, or places..."
              className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
            />
            <span className="absolute left-4 top-4.5 text-2xl">🔍</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section 
        data-section="categories"
        className={`max-w-6xl mx-auto px-4 py-10 transition-all duration-700 ${getAnimationClass("categories")}`}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Explore By Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🏖️", name: "Beaches", color: "bg-cyan-500" },
            { icon: "⛰️", name: "Mountains", color: "bg-green-500" },
            { icon: "🏛️", name: "Historical", color: "bg-yellow-500" },
            { icon: "🌆", name: "Cities", color: "bg-purple-500" }
          ].map((category, index) => (
            <div
              key={index}
              className={`${category.color} p-6 rounded-xl text-center text-white cursor-pointer hover:scale-110 transition-all duration-300 hover:shadow-xl`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="font-bold">{category.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section 
        data-section="destinations"
        className={`max-w-7xl mx-auto px-4 py-10 transition-all duration-700 ${getAnimationClass("destinations")}`}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Popular Destinations
          </h2>
          <p className="text-lg text-gray-600">
            Discover our most visited locations
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-60 bg-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                name: "Paris",
                country: "France",
                image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
                rating: 4.8,
                reviews: 2543,
                price: "₹45,000",
                description: "City of lights and romance"
              },
              {
                id: 2,
                name: "Dubai",
                country: "UAE",
                image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
                rating: 4.7,
                reviews: 1892,
                price: "₹38,000",
                description: "Modern marvel in the desert"
              },
              {
                id: 3,
                name: "Bali",
                country: "Indonesia",
                image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
                rating: 4.9,
                reviews: 3201,
                price: "₹32,000",
                description: "Tropical paradise"
              },
              {
                id: 4,
                name: "Swiss Alps",
                country: "Switzerland",
                image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
                rating: 4.9,
                reviews: 1567,
                price: "₹85,000",
                description: "Breathtaking mountain views"
              },
              {
                id: 5,
                name: "Maldives",
                country: "Maldives",
                image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
                rating: 4.9,
                reviews: 2890,
                price: "₹95,000",
                description: "Crystal clear waters"
              },
              {
                id: 6,
                name: "Tokyo",
                country: "Japan",
                image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
                rating: 4.8,
                reviews: 2103,
                price: "₹55,000",
                description: "Where tradition meets future"
              }
            ].map((place, index) => (
              <div
                key={place.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: visibleSections.has("destinations") ? "fadeInUp 0.6s ease-out forwards" : "none"
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="h-60 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-yellow-500">⭐</span>
                    <span className="ml-1 font-bold text-sm">{place.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{place.name}</h3>
                      <p className="text-gray-600 text-sm">{place.country}</p>
                    </div>
                    <span className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-sm font-bold">
                      {place.price}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{place.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-1">💬</span>
                      <span>{place.reviews.toLocaleString()} reviews</span>
                    </div>
                    <button className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-2 rounded-lg font-bold transition-all hover:shadow-lg">
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Photo Gallery with Hover Effects */}
      <section 
        data-section="gallery"
        className={`max-w-7xl mx-auto px-4 py-10 transition-all duration-700 ${getAnimationClass("gallery")}`}
      >
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Travel Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
            "https://images.unsplash.com/photo-1521295121783-8a321d551ad2",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
            "https://images.unsplash.com/photo-1504893524553-b855bce32c67"
          ].map((img, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-4xl">
                  🔍
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section 
        data-section="stats"
        className={`bg-gradient-to-r from-lime-500 to-blue-600 text-white py-16 transition-all duration-700 ${getAnimationClass("stats")}`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Destinations", icon: "🌍" },
              { value: "50K+", label: "Happy Travelers", icon: "😊" },
              { value: "4.8", label: "Average Rating", icon: "⭐" },
              { value: "24/7", label: "Support", icon: "💬" }
            ].map((stat, index) => (
              <div key={index} className="hover:scale-110 transition-transform duration-300">
                <div className="text-5xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section 
        data-section="newsletter"
        className={`max-w-6xl mx-auto px-4 py-16 transition-all duration-700 ${getAnimationClass("newsletter")}`}
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Get Travel Inspiration</h2>
          <p className="text-lg mb-8">Subscribe for the best deals and destinations</p>
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 p-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all hover:shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-lg">© 2026 Payanam. All rights reserved.</p>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
