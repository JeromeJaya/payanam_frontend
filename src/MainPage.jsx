import { useState, useEffect } from "react";
import OfferCard from "./Carousels/offer1.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavComponent from "./NavComponent.jsx";
import SearchBar from "./search/SearchBar.jsx";
import flightBG from "./assets/flight_bg.png";
import busBG from "./assets/bus bg.png";
import { useAuth } from "./context/AuthContext";
import useScrollAnimation from "./hooks/useScrollAnimation.js";
import ServiceHero from "./components/main/ServiceHero.jsx";
import ServiceTabs from "./components/main/ServiceTabs.jsx";
import ServiceFeatures from "./components/main/ServiceFeatures.jsx";

export default function App() {
  const [service, setService] = useState("bus");
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();
  const visibleElements = useScrollAnimation();
  const location = useLocation();

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

  const serviceBackgrounds = {
    flight: flightBG,
    bus: busBG,
  };

  const photo = serviceBackgrounds[service];

  const serviceData = {
    flight: {
      title: "Discover and Book Your Next Journey",
      subtitle: "Flights, hotels, buses and trains — find the best deals with intelligent search.",
      features: [
        { icon: "✈️", title: "Domestic Flights", desc: "500+ routes across India" },
        { icon: "🌍", title: "International Flights", desc: "100+ destinations worldwide" },
        { icon: "💰", title: "Best Price Guarantee", desc: "Compare and save up to 30%" },
        { icon: "🔒", title: "Secure Booking", desc: "100% secure transactions" },
        { icon: "🧳", title: "Free Baggage", desc: "15kg check-in + 7kg cabin baggage included" },
        { icon: "🎫", title: "Instant e-Ticket", desc: "Get your boarding pass instantly after booking" },
        { icon: "🔄", title: "Free Cancellation", desc: "Cancel up to 24 hours before departure at no cost" },
        { icon: "💺", title: "Choose Your Seat", desc: "Select preferred seats with our interactive seat map" },
        { icon: "🍽️", title: "Pre-book Meals", desc: "Choose from 30+ cuisines and beverages" },
        { icon: "⭐", title: "Premium Lounges", desc: "Access 200+ airport lounges across India" },
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
        { icon: "🎫", title: "Instant Confirmation", desc: "Get e-ticket immediately" },
        { icon: "🎯", title: "Best Prices", desc: "We guarantee the best prices for all your travel needs" },
        { icon: "⚡", title: "Instant Booking", desc: "Get instant confirmation with e-tickets and QR codes" },
        { icon: "🛡️", title: "100% Secure", desc: "Your payments and data are protected with bank-level security" }
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

      <ServiceHero
        visibleElements={visibleElements}
        photo={photo}
        title={currentServiceData.title}
        subtitle={currentServiceData.subtitle}
      />

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
          <div className="relative pt-2 sm:pt-12">
            <ServiceTabs activeService={service} onServiceChange={setService} />
            <SearchBar input={formFields[service]} service={service} />
          </div>
        </div>
      </div>

      <ServiceFeatures features={currentServiceData.features} visibleElements={visibleElements} />

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
