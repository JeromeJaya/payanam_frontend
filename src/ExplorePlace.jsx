export default function ExploreDestinations() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Travel"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            Explore Amazing Destinations
          </h1>
          <p className="text-lg">
            Discover beautiful places around the world
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full p-4 border rounded-lg"
          />
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6">
          Explore on Map
        </h2>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-[500px] bg-gray-200 flex items-center justify-center">
            {/* Replace with Leaflet / Google Maps */}
            <p className="text-gray-500 text-xl">
              Interactive Map Here
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8">
          Popular Destinations
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            {
              name: "Paris",
              image:
                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
            },
            {
              name: "Dubai",
              image:
                "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
            },
            {
              name: "Bali",
              image:
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4"
            }
          ].map((place, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
            >
              <img
                src={place.image}
                alt={place.name}
                className="h-60 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-bold">
                  {place.name}
                </h3>

                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8">
          Travel Gallery
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            className="rounded-xl h-60 object-cover w-full"
          />

          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
            className="rounded-xl h-60 object-cover w-full"
          />

          <img
            src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2"
            className="rounded-xl h-60 object-cover w-full"
          />

          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            className="rounded-xl h-60 object-cover w-full"
          />
        </div>
      </section>

      {/* Travel Categories */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8">
          Explore By Category
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-blue-100 p-6 rounded-xl text-center">
            🏖️ Beaches
          </div>

          <div className="bg-green-100 p-6 rounded-xl text-center">
            ⛰️ Mountains
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl text-center">
            🏛️ Historical
          </div>

          <div className="bg-purple-100 p-6 rounded-xl text-center">
            🌆 Cities
          </div>

        </div>
      </section>
    </div>
  );
}