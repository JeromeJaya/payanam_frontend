import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Clock } from 'lucide-react';

export default function TrainBookingCard({
  trainName = "Shram Shkti Exp",
  trainNumber = "#12452",
  runsOn = "SMTWTFS", // Active days string indicator
  departureTime = "11:55 PM",
  departureDate = "30 JUN",
  departureStation = "New Delhi",
  duration = "6h 25m",
  arrivalTime = "6:20 AM",
  arrivalDate = "1 JUL",
  arrivalStation = "Kanpur Central",
  initialClasses = [
    { id: 'sl', code: 'SL', type: 'TATKAL', price: 415, available: 144, freeCancellation: true, updatedText: 'Updated few mins ago' },
    { id: '3a', code: '3A', type: 'TATKAL', price: 1110, available: 88, freeCancellation: true, updatedText: 'Updated 5 hrs ago' },
    { id: '2a', code: '2A', type: 'TATKAL', price: 1520, available: 32, freeCancellation: true, updatedText: 'Updated 2 hrs ago' },
    { id: '3e', code: '3E', type: 'TATKAL', price: 950, available: 72, freeCancellation: true, updatedText: 'Updated 2 hrs ago' },
  ]
}) {
  const [selectedClass, setSelectedClass] = useState('sl');
  const [scrollOffset, setScrollOffset] = useState(0);

  // Simple tracking days formatter array
  const dayLabels = runsOn.split('');

  return (
    <div className="w-full max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs font-sans text-gray-900 select-none space-y-5 transition-all hover:shadow-xs">
      
      {/* ================= TOP SECTION: TRAIN SCHEDULE SUMMARY ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-2">
        {/* Left Identity Segment */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-black tracking-tight text-gray-900">{trainName}</h2>
            <span className="text-xs font-medium text-gray-400">{trainNumber}</span>
          </div>
          <div className="text-[11px] font-bold text-gray-400 tracking-wider">
            Depart on: <span className="text-teal-600 font-black tracking-widest ml-1">{runsOn}</span>
          </div>
        </div>

        {/* Journey Timeline Block Tracker */}
        <div className="flex-1 max-w-2xl grid grid-cols-3 items-center text-center px-4">
          {/* Departure Node */}
          <div className="text-left space-y-0.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base font-black text-gray-900">{departureTime}</span>
              <span className="text-xs font-bold text-gray-500">{departureDate}</span>
            </div>
            <p className="text-xs font-medium text-gray-400">{departureStation}</p>
          </div>

          {/* Core Duration Vector */}
          <div className="relative flex flex-col items-center justify-center group px-2">
            <span className="text-[11px] font-bold text-gray-400 bg-white px-2 z-10 transition-colors group-hover:text-blue-600">
              {duration}
            </span>
            <div className="w-full h-px bg-gray-200 absolute top-2.5 left-0" />
            <button className="text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors mt-1 relative z-10">
              View Route
            </button>
          </div>

          {/* Arrival Node */}
          <div className="text-right space-y-0.5 justify-self-end">
            <div className="flex items-baseline gap-1.5 justify-end flex-wrap">
              <span className="text-base font-black text-gray-900">{arrivalTime}</span>
              <span className="text-xs font-bold text-gray-500">{arrivalDate}</span>
            </div>
            <p className="text-xs font-medium text-gray-400">{arrivalStation}</p>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SECTION: HORIZONTAL CLASS CARDS SLIDER ================= */}
      <div className="relative group">
        
        {/* Sliding Viewport container wrapper */}
        <div className="overflow-x-auto scrollbar-none flex gap-3 pb-1 pt-0.5 snap-x">
          {initialClasses.map((item) => {
            const isSelected = selectedClass === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedClass(item.id)}
                className={`min-w-[210px] flex-1 snap-start border rounded-xl p-4 cursor-pointer select-none transition-all relative flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-white border-blue-500 ring-2 ring-blue-500/10 shadow-md'
                    : 'bg-white border-gray-200 hover:bg-gray-50/50 shadow-2xs'
                }`}
              >
                {/* Class Code Header / Price Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-gray-900">{item.code}</span>
                    <span className="bg-orange-50 text-orange-700 font-black text-[10px] px-1.5 py-0.5 rounded-sm tracking-wide">
                      {item.type}
                    </span>
                  </div>
                  <span className="font-black text-base text-gray-900">
                    ₹ {item.price}
                  </span>
                </div>

                {/* Seat Capacity Availability Metrics */}
                <div>
                  <span className="text-sm font-black text-teal-600">
                    Available {item.available}
                  </span>
                </div>

                {/* Policy Metadata Lines info strings */}
                <div className="space-y-1 border-t border-gray-50 pt-2.5">
                  {item.freeCancellation && (
                    <div className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-gray-400" />
                      Free Cancellation
                    </div>
                  )}
                  {item.updatedText && (
                    <div className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                      <Clock size={11} className="shrink-0" />
                      {item.updatedText}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Slide Button Accent overlay toggle mimicking standard premium layouts */}
        <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block z-10">
          <button className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all">
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>

      </div>

    </div>
  );
}