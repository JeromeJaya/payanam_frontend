import {Link} from "react-router-dom"
export function Offers(){
    return(
<div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden group shadow-sm border border-gray-100 dark:border-gray-800">
  <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    {/* <!-- Slide 1 --> */}
    <div id="hero-slide-1" className="snap-start shrink-0 w-full relative h-[400px]">
      <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80" alt="Nature" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent flex flex-col justify-end p-8">
        <span className="inline-block px-3 py-1 bg-lime-500 text-white text-xs font-bold rounded-full mb-3 w-max tracking-wide">NEW</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Explore the Wilderness</h2>
        <p className="text-gray-200 max-w-md text-sm sm:text-base">Discover the most breathtaking natural landscapes and untouched beauty of our planet.</p>
      </div>
    </div>
    {/* <!-- Slide 2 --> */}
    <div id="hero-slide-2" className="snap-start shrink-0 w-full relative h-[400px]">
      <img src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=80" alt="Coffee" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent flex flex-col justify-end p-8">
        <span className="inline-block px-3 py-1 bg-lime-500 text-white text-xs font-bold rounded-full mb-3 w-max tracking-wide">LIFESTYLE</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Morning Essentials</h2>
        <p className="text-gray-200 max-w-md text-sm sm:text-base">Start your day right with the perfect brew and a moment of peaceful mindfulness.</p>
      </div>
    </div>
    {/* <!-- Slide 2 --> */}
    <div id="hero-slide-2" className="snap-start shrink-0 w-full relative h-[400px]">
      <img src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=80" alt="Coffee" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent flex flex-col justify-end p-8">
        <span className="inline-block px-3 py-1 bg-lime-500 text-white text-xs font-bold rounded-full mb-3 w-max tracking-wide">LIFESTYLE</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Morning Essentials</h2>
        <p className="text-gray-200 max-w-md text-sm sm:text-base">Start your day right with the perfect brew and a moment of peaceful mindfulness.</p>
      </div>
    </div>
    {/* <!-- Slide 2 --> */}
    <div id="hero-slide-2" className="snap-start shrink-0 w-full relative h-[400px]">
      <img src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=80" alt="Coffee" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent flex flex-col justify-end p-8">
        <span className="inline-block px-3 py-1 bg-lime-500 text-white text-xs font-bold rounded-full mb-3 w-max tracking-wide">LIFESTYLE</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">hello</h2>
        <p className="text-gray-200 max-w-md text-sm sm:text-base">Start your day right with the perfect brew and a moment of peaceful mindfulness.</p>
      </div>
    </div>
    {/* <!-- Slide 3 --> */}
    <div id="hero-slide-3" className="snap-start shrink-0 w-full relative h-[400px]">
      <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80" alt="Journey" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent flex flex-col justify-end p-8">
        <span className="inline-block px-3 py-1 bg-lime-500 text-white text-xs font-bold rounded-full mb-3 w-max tracking-wide">TRAVEL</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Unforgettable Journeys</h2>
        <p className="text-gray-200 max-w-md text-sm sm:text-base">Experience the world from a completely new perspective and make memories.</p>
      </div>
    </div>
  </div>
  
  {/* <!-- Indicators --> */}
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
    <Link to="/hero-slide-1" className="w-8 h-1.5 rounded-full bg-lime-500 transition-all hover:bg-lime-400"></Link>
    <Link to="/hero-slide-2" className="w-2 h-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-all"></Link>
    <Link to="/hero-slide-3" className="w-2 h-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-all"></Link>
  </div>
</div>
    );
}