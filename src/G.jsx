import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Calendar, Heart, Share2 } from 'lucide-react';

// Mock data for the nostalgic travel destinations
const DESTINATIONS = [
  {
    id: 1,
    title: "Kyoto Autumns",
    location: "Kyoto, Japan",
    date: "November 2025",
    image: "https://unsplash.com",
    note: "The maple leaves turned the entire temple grounds into a sea of deep crimson. Woke up at 5 AM to catch the mist over the river.",
    rotation: -3
  },
  {
    id: 2,
    title: "Amalfi Coastline",
    location: "Positano, Italy",
    date: "July 2025",
    image: "https://unsplash.com",
    note: "Sipping lemon granita while navigating the cliffside stairs. The Mediterranean blue looks completely unreal from up here.",
    rotation: 4
  },
  {
    id: 3,
    title: "Serengeti Golden Hour",
    location: "Serengeti, Tanzania",
    date: "August 2025",
    image: "https://unsplash.com",
    note: "A family of elephants crossed right in front of our jeep under a massive acacia tree. Dust glowing in the setting sun.",
    rotation: -2
  },
  {
    id: 4,
    title: "Neon Nights",
    location: "Shinjuku, Tokyo",
    date: "October 2025",
    image: "https://unsplash.com",
    note: "Got lost in the narrow alleyways of Omoide Yokocho. The smell of yakitori and the hum of retro neon signs.",
    rotation: 2
  }
];

export function TravelJournal() {
  const [cards, setCards] = useState(DESTINATIONS);

  // Moves the top card to the bottom of the stack after a swipe
  const handleSwipe = (swipedCardId) => {
    setCards((prevCards) => {
      const remaining = prevCards.filter(card => card.id !== swipedCardId);
      const swiped = prevCards.find(card => card.id === swipedCardId);
      return [...remaining, swiped];
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#f4f1ea] overflow-hidden px-4 select-none">
      {/* Background Scrapbook Elements */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#d3cbb8_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <header className="text-center mb-12 z-10">
        <h1 className="font-serif text-4xl md:text-5xl text-[#3e382f] italic font-bold tracking-wide">
          Wanderlust Chronicles
        </h1>
        <p className="text-sm font-mono text-[#766e60] mt-2 tracking-widest uppercase">
          Drag or swipe cards to flip through memories
        </p>
      </header>

      {/* Polaroid Container Stack */}
      <div className="relative w-full max-w-[340px] h-[460px] flex items-center justify-center">
        <AnimatePresence>
          {cards.map((card, index) => {
            // Only allow dragging on the top card (the last item in our rendered array mapping)
            const isTop = index === cards.length - 1;
            return (
              <JournalCard
                key={card.id}
                card={card}
                isTop={isTop}
                index={index}
                total={cards.length}
                onSwipe={() => handleSwipe(card.id)}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Instructions / Scrapbook details */}
      <footer className="mt-12 flex items-center gap-4 text-[#8a7f6e] text-xs font-mono z-10">
        <span>VOL. IV</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#8a7f6e]" />
        <span>EST. 2025</span>
      </footer>
    </div>
  );
}

export function JournalCard({ card, isTop, index, total, onSwipe }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Create rotation and opacity transformations based on drag distance
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

  // Handle drag completion to trigger the shuffle action
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 120;
    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.offset.y) > swipeThreshold) {
      onSwipe();
    }
  };

  // Stack styling calculation: lower cards are scaled down and shifted down slightly
  const stackScale = 1 - (total - 1 - index) * 0.04;
  const stackYOffset = (total - 1 - index) * -12;

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : stackYOffset,
        rotate: isTop ? rotate : card.rotation,
        scale: isTop ? 1 : stackScale,
        zIndex: index,
        opacity: isTop ? opacity : 1,
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={isTop ? { y: 0 } : { y: stackYOffset, scale: stackScale }}
      transition={isTop ? { type: "spring", stiffness: 300, damping: 20 } : { duration: 0.3 }}
      className={`absolute w-full h-full bg-[#fcfbfa] p-4 pb-6 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#eaddcc]/60 flex flex-col justify-between ${
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      {/* Decorative Washi Tape effect on the top card */}
      {isTop && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-amber-100/40 backdrop-blur-[1px] border border-amber-200/20 -rotate-2 shadow-sm pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-full h-full border-x-2 border-dashed border-amber-300/30" />
        </div>
      )}

      {/* Polaroid Image Box */}
      <div className="relative w-full h-[60%] overflow-hidden bg-[#ece7df] rounded-xs border border-black/5 group">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover grayscale-[15%] sepia-[10%] contrast-[95%] pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Journal Entry details */}
      <div className="flex-1 flex flex-col justify-between pt-4">
        <div>
          <div className="flex items-center justify-between text-[#766e60] text-[10px] font-mono tracking-wider">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-amber-700" />
              {card.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {card.date}
            </span>
          </div>

          <h2 className="font-serif font-bold text-xl text-[#3e382f] mt-1.5 leading-tight">
            {card.title}
          </h2>
          
          <p className="font-serif text-xs italic text-[#5c5346] mt-2 leading-relaxed line-clamp-3">
            "{card.note}"
          </p>
        </div>

        {/* Polaroid bottom utilities */}
        <div className="flex items-center justify-end gap-3 pt-2 text-[#b0a490]">
          <button className="hover:text-rose-600 transition-colors pointer-events-auto">
            <Heart size={16} />
          </button>
          <button className="hover:text-amber-800 transition-colors pointer-events-auto">
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}