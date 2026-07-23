import { useState } from 'react';
import { Heart, Star, Utensils, Sparkles, ArrowRight } from 'lucide-react';

export default function HotelCard({
  hotelName = "Ronil Goa, part of Hyatt",
  starRating = 5,
  location = "Baga",
  locationSubtext = "5 minutes walk to Baga Beach",
  tags = ["Couple Friendly"],
  offerText = "10% off on Food & Beverage services",
  highlights = "Perfect location near Baga Beach, lively swimming pools open till 2 AM, exceptional hospitality.",
  pricePerNight = 5770,
  taxesAndFees = 289,
  totalPhotosVideos = 115,
  imageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" // Premium mock resort pool image
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const currentSlide = 0;

  return (
    <div className="w-full mx-auto bg-white border border-blue-400 rounded-sm shadow-sm overflow-hidden font-sans text-gray-900 select-none transition-all hover:shadow-md mb-4">
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_2fr_1.1fr] min-h-[220px]">
        
        {/* ================= LEFT COLUMN: HERO IMAGE & BADGES ================= */}
        <div className="relative h-56 md:h-full group bg-gray-100 overflow-hidden shrink-0">
          <img 
            src={imageUrl} 
            alt={hotelName} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Floating Favorite (Heart) Trigger */}
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-xs shadow-sm text-gray-600 hover:text-red-500 hover:bg-white transition-all active:scale-90"
          >
            <Heart 
              size={16} 
              className={isFavorite ? "fill-red-500 stroke-red-500 animate-heart-beat" : "stroke-gray-700"} 
            />
          </button>

          {/* Media Count Badge Floating Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            {/* Slide dot indices matrix */}
            <div className="flex gap-1 bg-black/30 backdrop-blur-xs px-2 py-1 rounded-full">
              {[0, 1, 2, 3].map((idx) => (
                <span 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentSlide ? 'bg-white scale-110' : 'bg-white/40'}`} 
                />
              ))}
            </div>

            {/* Total Media Counter */}
            <button className="bg-black/70 backdrop-blur-xs hover:bg-black/80 text-white font-bold text-[11px] py-1 px-2.5 rounded-full flex items-center gap-1 transition-colors">
              <span>{totalPhotosVideos} Photos & Videos</span>
              <ArrowRight size={10} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ================= MIDDLE COLUMN: HOTEL CONTENT META ================= */}
        <div className="p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 space-y-3">
          <div className="space-y-1">
            {/* Header / Title & Star Rating Block */}
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
                {hotelName}
              </h2>
              <div className="flex items-center text-gray-900 shrink-0">
                {Array.from({ length: starRating }).map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" className="stroke-none" />
                ))}
              </div>
            </div>

            {/* Neighborhood Location Subtext */}
            <div className="text-sm font-medium text-gray-500">
              <span className="text-blue-600 font-black hover:underline cursor-pointer">{location}</span>
              <span className="mx-1 text-gray-300">|</span>
              <span>{locationSubtext}</span>
            </div>
          </div>

          {/* Segment Tags Wrapper */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="text-[11px] font-bold text-gray-500 border border-gray-300 bg-white px-2 py-0.5 rounded-sm shadow-2xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Special Deals / Amenities Highlights Accent */}
          <div className="space-y-2 pt-1">
            {offerText && (
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600">
                <Utensils size={14} className="shrink-0" />
                <span>{offerText}</span>
              </div>
            )}

            {highlights && (
              <div className="flex items-start gap-2 text-xs font-medium text-blue-900 bg-blue-50/40 p-2 rounded-sm border border-blue-50/60 leading-normal">
                <Sparkles size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="flex-1">{highlights}</p>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: FINANCIAL BREAKDOWN ================= */}
        <div className="p-4 flex flex-col justify-end md:items-end text-left md:text-right bg-gray-50/30 min-w-[160px]">
          <div className="space-y-0.5">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              ₹ {pricePerNight.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-gray-400 font-bold">
              + ₹ {taxesAndFees} taxes & fees
            </p>
            <span className="block text-xs font-medium text-gray-400 pt-0.5">
              Per Night
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}