export default function PlaceHeader() {
  return (
    <>
      <section
        data-section="hero"
        className="relative h-[70vh] transition-all duration-1000 opacity-100 translate-y-0"
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

      <section
        data-section="search"
        className="max-w-6xl mx-auto px-4 py-10 transition-all duration-700 opacity-100 translate-y-0"
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
    </>
  );
}
