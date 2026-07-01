import { useState, useEffect, useRef } from "react";
import Category from "./components/category.jsx";
import InputBox from "./components/InputBox.jsx";
import OfferCard from "./Carousels/offer1.jsx";
import { Link, useNavigate } from "react-router-dom";
import buses from "./assets/buses.png";
import flight from "./assets/flight.png";
import hotel from "./assets/hotel.png";
import train from "./assets/train.png";
import NavComponent from "./NavComponent.jsx";
import SearchBar from "./search/SearchBar.jsx";
import flightBG from "./assets/flight_bg.png";
import trainBG from "./assets/train bg.png";
import busBG from "./assets/bus bg.png";
import hotelBG from "./assets/hotel bg.png";

export default function App() {
  const [service, setService] = useState("bus");
  const navigate = useNavigate();
  
  // Service-specific background images
  const serviceBackgrounds = {
    flight: flightBG,
    hotel: hotelBG,
    bus: busBG,
    train: trainBG
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

  const [date, setDate] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", { service, from, to, date });
    // Navigate to appropriate booking page based on service
    const serviceRoutes = {
      flight: '/flightbooking',
      hotel: '/hotelbooking',
      bus: '/busbooking',
      train: '/trainbooking'
    };
    navigate(serviceRoutes[service]);
  };

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
    <div className="min-h-screen bg-slate-50">
      <NavComponent />

      {/* Hero Section with Dynamic Background */}
      <div
        className="relative h-[500px] w-full"
        style={{ backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50"></div>
        <div className="relative max-w-7xl mx-auto h-full flex items-center px-6">
          <div className="text-white max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
              {currentServiceData.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              {currentServiceData.subtitle}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-lime-500 hover:bg-lime-600 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all hover:shadow-xl"
              >
                Book Now
              </button>
              <Link 
                to="/explore" 
                className="bg-white text-slate-800 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Explore Deals
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div id="search-section" className="relative z-20 max-w-6xl mx-auto px-6 -mt-8 mb-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          {/* Service Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Category 
              icon={<img src={flight} alt="Flights" className="w-8 h-8" />} 
              title="Flights" 
              onClick={() => setService('flight')} 
              active={service === 'flight'} 
            />
            <Category 
              icon={<img src={hotel} alt="Hotels" className="w-8 h-8" />} 
              title="Hotels" 
              onClick={() => setService('hotel')} 
              active={service === 'hotel'} 
            />
            <Category 
              icon={<img src={train} alt="Trains" className="w-8 h-8" />} 
              title="Trains" 
              onClick={() => setService('train')} 
              active={service === 'train'} 
            />
            <Category 
              icon={<img src={buses} alt="Buses" className="w-8 h-8" />} 
              title="Buses" 
              onClick={() => setService('bus')} 
              active={service === 'bus'} 
            />
          </div>

          {/* Dynamic Search Form */}
          <div className="relative">
            <SearchBar input={formFields[service]} service={service} />
          </div>
        </div>
      </div>



      {/* Service Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentServiceData.features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-slate-200 hover:border-lime-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Routes/Destinations Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Popular {service === 'flight' ? 'Routes' : service === 'hotel' ? 'Destinations' : 'Routes'}
          </h2>
          <p className="text-xl text-slate-600">
            Discover the most booked {service} options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(service === 'hotel' ? currentServiceData.popularDestinations : currentServiceData.popularRoutes).map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-slate-200 hover:border-lime-300 cursor-pointer group"
            >
              {service === 'hotel' ? (
                <>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-lime-600 transition-colors">
                    {item.city}
                  </h3>
                  <p className="text-slate-600 mb-2">{item.hotels} hotels available</p>
                  <p className="text-2xl font-bold text-lime-600">Starting {item.startingPrice}</p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold text-slate-800">{item.from}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-lg font-semibold text-slate-800">{item.to}</span>
                  </div>
                  <p className="text-3xl font-bold text-lime-600">{item.price}</p>
                  <p className="text-sm text-slate-500 mt-2">Starting price per person</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Why Choose Payanam?</h2>
            <p className="text-xl text-slate-600">We make travel booking simple, fast, and reliable</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-lime-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Best Prices</h3>
              <p className="text-slate-600">We guarantee the best prices for all your travel needs</p>
            </div>
            <div className="text-center">
              <div className="bg-lime-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Instant Booking</h3>
              <p className="text-slate-600">Get instant confirmation with e-tickets and QR codes</p>
            </div>
            <div className="text-center">
              <div className="bg-lime-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">100% Secure</h3>
              <p className="text-slate-600">Your payments and data are protected with bank-level security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Special Offers & Deals</h2>
          <p className="text-xl text-slate-600">Save more with exclusive discounts and packages</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
      <footer className="bg-slate-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">PAYANAM</h3>
              <p className="text-slate-300">Your trusted travel partner for flights, hotels, buses, and trains.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Services</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/flightbooking" className="hover:text-lime-400">Flight Booking</Link></li>
                <li><Link to="/hotelbooking" className="hover:text-lime-400">Hotel Booking</Link></li>
                <li><Link to="/busbooking" className="hover:text-lime-400">Bus Booking</Link></li>
                <li><Link to="/trainbooking" className="hover:text-lime-400">Train Booking</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-lime-400">Help Center</a></li>
                <li><a href="#" className="hover:text-lime-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-lime-400">FAQs</a></li>
                <li><a href="#" className="hover:text-lime-400">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-slate-300">
                <li>📧 support@payanam.com</li>
                <li>📞 1800-123-4567</li>
                <li>📍 Chennai, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2026 Payanam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// All destinations data (keeping your existing data)
const allDestinations = [
  // States
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
  // Major Cities
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
  "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
  "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
  "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai",
  "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada",
  "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur",
  "Hubli-Dharwad", "Bareilly", "Moradabad", "Mysore", "Gurgaon", "Aligarh", "Jalandhar",
  "Tiruchirappalli", "Bhubaneswar", "Salem", "Warangal", "Guntur", "Bhiwandi", "Saharanpur",
  "Gorakhpur", "Bikaner", "Kota", "Cuttack", "Thiruvananthapuram", "Tirunelveli",
  "Tiruppur", "Vellore", "Erode", "Thrissur", "Kollam", "Kozhikode", "Kannur",
  "Kochi", "Mangalore", "Mangaluru", "Belgaum", "Davangere", "Bellary", "Tumkur",
  "Shimoga", "Tumakuru", "Hassan", "Mandya", "Chikmagalur", "Udupi", "Karwar",
  "Bidar", "Raichur", "Koppal", "Gadag", "Bagalkot", "Vijayapura", "Yadgir",
  "Chitradurga", "Chikkaballapur", "Kolar", "Bangalore Rural", "Ramanagara",
  "Tamil Nadu", "Kanyakumari", "Thanjavur", "Nagapattinam", "Pudukkottai",
  "Dindigul", "Theni", "Madurai", "Virudhunagar", "Ramanathapuram", "Sivaganga",
  "Tirunelveli", "Tenkasi", "Thoothukudi", "Tiruppur", "Coimbatore", "Nilgiris",
  "Erode", "Salem", "Dharmapuri", "Krishnagiri", "Vellore", "Tiruvannamalai",
  "Viluppuram", "Kallakurichi", "Cuddalore", "Perambalur", "Ariyalur", "Tiruvarur",
  "Thanjavur", "Nagapattinam", "Mayiladuthurai", "Chengalpattu", "Kanchipuram",
  "Tiruvallur", "Krishna", "Guntur", "Prakasam", "Nellore", "Chittoor", "YSR Kadapa",
  "Ananthapuramu", "Kurnool", "Kadapa", "Vizianagaram", "Srikakulam", "Visakhapatnam",
  "East Godavari", "West Godavari", "Eluru", "Konaseema"
];