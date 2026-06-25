import {SearchCard} from "./cards/SearchCard.jsx"; 
import {useNavigate} from "react-router-dom";

  
export function LandingPage() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen overflow-hidden">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center px-6 lg:px-20">
        <div className="max-w-3xl text-white">

          <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-md">
            ✈ Travel Smarter, Travel Better
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl"
          onClick={() => navigate("/ExplorePlace")}>
            Explore The World
            <span className="block text-cyan-400">
              One Journey At A Time
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-200 md:text-xl">
            Book Flights, Hotels, Trains and Buses with exclusive deals,
            instant confirmation and unbeatable prices.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-cyan-600"
            onClick={() => navigate("/login")}>
              Start Booking
            </button>

          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-8">
            <div>
              <h3 className="text-3xl font-bold">10M+</h3>
              <p className="text-gray-300">Happy Travelers</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-gray-300">Destinations</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">24/7</h3>
              <p className="text-gray-300">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <SearchCard/>
    </section>
  );
}
