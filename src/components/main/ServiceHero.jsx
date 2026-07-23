export default function ServiceHero({ visibleElements, photo, title, subtitle }) {
  return (
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
            {title}
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
            {subtitle}
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
  );
}
