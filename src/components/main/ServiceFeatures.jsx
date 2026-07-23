import AutoScrollContainer from "./AutoScrollContainer.jsx";

export default function ServiceFeatures({ features, visibleElements }) {
  return (
    <section
      id="services"
      data-animation-id="features"
      className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 transition-all duration-700 ${
        visibleElements.has('features')
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
    >
      <AutoScrollContainer>
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-500 border border-slate-200 dark:border-slate-700 hover:border-lime-300 min-w-[260px] md:min-w-[280px]"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </AutoScrollContainer>
    </section>
  );
}
