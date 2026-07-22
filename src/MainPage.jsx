import { useState, useEffect, useRef, useCallback } from "react";
import Category from "./components/category.jsx";
import OfferCard from "./Carousels/offer1.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import buses from "./assets/buses.png";
import flight from "./assets/flight.png";
import NavComponent from "./NavComponent.jsx";
import SearchBar from "./search/SearchBar.jsx";
import flightBG from "./assets/flight_bg.png";
import busBG from "./assets/bus bg.png";
import { useAuth } from "./context/AuthContext";

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.dataset.animationId]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = document.querySelectorAll('[data-animation-id]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return visibleElements;
};

// Helper function to get animation classes based on index
const getAnimationClasses = (index, isVisible, baseDelay = 0) => {
  const direction = index % 2 === 0 ? '-translate-x-8' : 'translate-x-8';
  const delay = `${baseDelay + (index * 100)}ms`;
  
  return {
    container: `transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${direction}`}`,
    style: { transitionDelay: delay }
  };
};

export default function App() {
  const [service, setService] = useState("bus");
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();
  const visibleElements = useScrollAnimation();
  
  // Read service from location state when navigating from navbar
  const location = useLocation();

  // Redirect vendors to their dashboard
  useEffect(() => {
    if (!authLoading && user && user.role === "vendor") {
      navigate("/vendordashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (location.state?.service) {
      setService(location.state.service);
    }
  }, [location.state]);
  
  // Service-specific background images
  const serviceBackgrounds = {
    flight: flightBG,
    bus: busBG,
  };

  const photo = serviceBackgrounds[service];

  // Service-specific content data
  const serviceData = {
    flight: {
      title: "Discover and Book Your Next Journey",
      subtitle: "Flights, hotels, buses and trains — find the best deals with intelligent search.",
      features: [
        { icon: "✈️", title: "Domestic Flights", desc: "500+ routes across India" },
        { icon: "🌍", title: "International Flights", desc: "100+ destinations worldwide" },
        { icon: "💰", title: "Best Price Guarantee", desc: "Compare and save up to 30%" },
        { icon: "🔒", title: "Secure Booking", desc: "100% secure transactions" }
      ],
      popularRoutes: [
        { from: "Delhi", to: "Mumbai", price: "₹4,500" },
        { from: "Bangalore", to: "Chennai", price: "₹3,200" },
        { from: "Kolkata", to: "Delhi", price: "₹5,100" },
        { from: "Hyderabad", to: "Bangalore", price: "₹2,800" }
      ]
    },
    hotel: {
      title: "Find Your Perfect Stay",
      subtitle: "From budget hotels to luxury resorts, discover accommodations that match your style and budget.",
      features: [
        { icon: "🏨", title: "50,000+ Hotels", desc: "Across 1000+ cities" },
        { icon: "⭐", title: "Best Price Match", desc: "Found cheaper? We'll match it" },
        { icon: "🛏️", title: "Free Cancellation", desc: "On most bookings" },
        { icon: "🎁", title: "Exclusive Deals", desc: "Up to 50% off on select hotels" }
      ],
      popularDestinations: [
        { city: "Goa", hotels: "2,500+", startingPrice: "₹1,200" },
        { city: "Kerala", hotels: "1,800+", startingPrice: "₹1,500" },
        { city: "Rajasthan", hotels: "3,200+", startingPrice: "₹900" },
        { city: "Himachal Pradesh", hotels: "1,500+", startingPrice: "₹1,100" }
      ]
    },
    bus: {
      title: "Travel Across India with Comfort",
      subtitle: "Book bus tickets to 10,000+ destinations with top-rated operators. Safe, reliable, and affordable.",
      features: [
        { icon: "🚌", title: "10,000+ Routes", desc: "Covering all major cities" },
        { icon: "✅", title: "Verified Operators", desc: "500+ trusted bus operators" },
        { icon: "💺", title: "Live Seat Selection", desc: "Choose your preferred seat" },
        { icon: "🎫", title: "Instant Confirmation", desc: "Get e-ticket immediately" }
      ],
      popularRoutes: [
        { from: "Chennai", to: "Bangalore", price: "₹800" },
        { from: "Mumbai", to: "Pune", price: "₹500" },
        { from: "Delhi", to: "Agra", price: "₹600" },
        { from: "Hyderabad", to: "Vijayawada", price: "₹700" }
      ]
    },
    train: {
      title: "Book Train Tickets Easily",
      subtitle: "Search and book train tickets across India. Check seat availability, fares, and schedules in real-time.",
      features: [
        { icon: "🚂", title: "All Trains Covered", desc: "IRCTC authorized booking" },
        { icon: "💺", title: "Seat Availability", desc: "Real-time updates" },
        { icon: "📱", title: "Mobile Ticket", desc: "No need to print" },
        { icon: "🔄", title: "Easy Cancellation", desc: "Hassle-free refunds" }
      ],
      popularRoutes: [
        { from: "Delhi", to: "Kolkata", price: "₹1,500" },
        { from: "Mumbai", to: "Delhi", price: "₹2,000" },
        { from: "Chennai", to: "Bangalore", price: "₹600" },
        { from: "Kolkata", to: "Patna", price: "₹800" }
      ]
    }
  };

  const currentServiceData = serviceData[service];

  const formFields = {
    flight: [
      { name: "from", label: "From ", type: "text" },
      { name: "to", label: "To ", type: "text" },
      { name: "departure", label: "Departure", type: "date" },
      { name: "travellers", label: "Travellers", type: "number" },
    ],
    hotel: [
      { name: "city", label: "City, Property name or Location", type: "text" },
      { name: "checkin", label: "Check In", type: "date" },
      { name: "checkout", label: "Check Out", type: "date" },
      { name: "guests", label: "Rooms & Guests", type: "number" },
    ],
    bus: [
      { name: "from", label: "From ", type: "text" },
      { name: "to", label: " To ", type: "text" },
      { name: "date", label: "Journey Date", type: "date" },
      { name: "NoOfSeats", label: "Passenger count", type: "number" },
    ],
    train: [
      { name: "from", label: "From", type: "text" },
      { name: "to", label: "To", type: "text" },
      { name: "date", label: "Travel Date", type: "date" },
      { name: "class", label: "Class", type: "text" },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavComponent />

      {/* Hero Section with Dynamic Background */}
      <div
        data-animation-id="hero"
        className={`relative h-[450px] sm:h-[500px] w-full transition-all duration-1000 ${
          visibleElements.has('hero') 
            ? 'opacity-100' 
            : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50 dark:to-slate-900"></div>
        <div className="relative max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6">
          <div className="text-white max-w-3xl">
            <h1 
              data-animation-id="hero-title"
              className={`text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight transition-all duration-700 ${
                visibleElements.has('hero-title') 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {currentServiceData.title}
            </h1>
            <p 
              data-animation-id="hero-subtitle"
              className={`text-base sm:text-xl md:text-2xl text-gray-200 mb-8 transition-all duration-700 ${
                visibleElements.has('hero-subtitle') 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              {currentServiceData.subtitle}
            </p>
            <div 
              data-animation-id="hero-buttons"
              className={`flex flex-wrap gap-3 sm:gap-4 transition-all duration-700 ${
                visibleElements.has('hero-buttons') 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-lime-500 hover:bg-lime-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg transition-all hover:shadow-xl text-sm sm:text-base"
              >
               Our services
              </button>
              <button 
                onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white dark:bg-slate-800 hover:bg-lime-600 hover:text-white text-lime-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg transition-all hover:shadow-xl text-sm sm:text-base"
              >
                Latest offers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div 
        id="search-section" 
        data-animation-id="search"
        className={`relative z-20 w-full mx-auto px-4 sm:px-6 md:px-[5%] -mt-16 sm:-mt-24 mb-10 transition-all duration-700 ${
          visibleElements.has('search') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="bg-white mt-6 dark:bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-8 border border-slate-200 dark:border-slate-700">
          
          {/* Dynamic Search Form */}
          <div className="relative pt-2 sm:pt-12">
            
            {/* Category Selector (Responsive: natural flex column on small screens, absolutely overlaid on larger screens) */}
            <div className="flex flex-row justify-center items-center gap-2 sm:gap-6 mb-6 sm:mb-0 sm:absolute sm:left-1/2 sm:-top-20 sm:-translate-x-1/2 bg-white/90 dark:bg-slate-800/95 sm:backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-1.5 sm:p-2 sm:shadow-md z-10">
              <Category 
                icon={<img src={flight} alt="Flights" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />} 
                title="Flights" 
                onClick={() => setService('flight')} 
                active={service === 'flight'} 
              />
              <Category 
                icon={<img src={buses} alt="Buses" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />} 
                title="Buses" 
                onClick={() => setService('bus')} 
                active={service === 'bus'} 
              />
            </div>

            <SearchBar input={formFields[service]} service={service} />
          </div>
        </div>
      </div>

      {/* Service Features Section */}
      <section 
        id="services"
        data-animation-id="features"
        className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 transition-all duration-700 ${
          visibleElements.has('features') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {currentServiceData.features.map((feature, index) => {
            const isVisible = visibleElements.has(`feature-${index}`);
            const animClasses = getAnimationClasses(index, isVisible);
            
            return (
              <div 
                key={index}
                data-animation-id={`feature-${index}`}
                className={`bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-500 border border-slate-200 dark:border-slate-700 hover:border-lime-300 ${animClasses.container}`}
                style={animClasses.style}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section 
        data-animation-id="why-us"
        className={`bg-white dark:bg-slate-800 py-12 sm:py-16 transition-all duration-700 ${
          visibleElements.has('why-us') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 
              data-animation-id="why-us-title"
              className={`text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-all duration-700 ${
                visibleElements.has('why-us-title') 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              Why Choose Payanam?
            </h2>
            <p 
              data-animation-id="why-us-subtitle"
              className={`text-base sm:text-xl text-slate-600 dark:text-slate-400 transition-all duration-700 ${
                visibleElements.has('why-us-subtitle') 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              We make travel booking simple, fast, and reliable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🎯", title: "Best Prices", desc: "We guarantee the best prices for all your travel needs" },
              { icon: "⚡", title: "Instant Booking", desc: "Get instant confirmation with e-tickets and QR codes" },
              { icon: "🛡️", title: "100% Secure", desc: "Your payments and data are protected with bank-level security" }
            ].map((item, index) => {
              const isVisible = visibleElements.has(`why-us-${index}`);
              const animClasses = getAnimationClasses(index, isVisible, 2);
              
              return (
                <div 
                  key={index}
                  data-animation-id={`why-us-${index}`}
                  className={`text-center transition-all duration-500 ${animClasses.container}`}
                  style={animClasses.style}
                >
                  <div className="bg-lime-100 dark:bg-lime-900/30 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl sm:text-4xl">{item.icon}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section 
        id="offers"
        data-animation-id="offers"
        className={`max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 transition-all duration-700 ${
          visibleElements.has('offers') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-10 sm:mb-12">
          <h2 
            data-animation-id="offers-title"
            className={`text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-all duration-700 ${
              visibleElements.has('offers-title') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            Special Offers & Deals
          </h2>
          <p 
            data-animation-id="offers-subtitle"
            className={`text-base sm:text-xl text-slate-600 dark:text-slate-400 transition-all duration-700 ${
              visibleElements.has('offers-subtitle') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            Save more with exclusive discounts and packages
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard 
            title="Flight Sale" 
            text="Up to 30% OFF on domestic flights" 
            subtitle="Valid till Dec 31"
          />
          <OfferCard 
            title="Hotel Packages" 
            text="Flat ₹2000 OFF on hotel bookings" 
            subtitle="Min. stay 2 nights"
          />
          <OfferCard 
            title="Bus Travel" 
            text="Get 25% cashback on bus tickets" 
            subtitle="Use code PAYANAM25"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 dark:bg-slate-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-mono">PAYANAM</h3>
              <p className="text-slate-300 dark:text-slate-400 text-sm">Your trusted travel partner for flights, hotels, buses, and trains.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Services</h4>
              <ul className="space-y-2 text-slate-300 dark:text-slate-400 text-sm">
                <li><Link to="/flightbooking" className="hover:text-lime-400">Flight Booking</Link></li>
                <li><Link to="/busbooking" className="hover:text-lime-400">Bus Booking</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-slate-300 dark:text-slate-400 text-sm">
                <li><Link to="/help-center" className="hover:text-lime-400">Help Center</Link></li>
                <li><Link to="/contact-us" className="hover:text-lime-400">Contact Us</Link></li>
                <li><Link to="/faqs" className="hover:text-lime-400">FAQs</Link></li>
                <li><Link to="/terms-conditions" className="hover:text-lime-400">Terms & Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-slate-300 dark:text-slate-400 text-sm">
                <li>📧 jeromeat2002@gmail.com</li>
                <li>📞 9894855195</li>
                <li>📍 Power house</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 dark:border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Payanam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}