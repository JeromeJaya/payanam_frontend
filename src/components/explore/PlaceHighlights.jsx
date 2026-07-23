export default function PlaceHighlights({ getAnimationClass }) {
  return (
    <>
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
    </>
  );
}
