export default function PlaceBookingCard({ place, index, visibleSections }) {
  return (
    <div
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
  );
}
