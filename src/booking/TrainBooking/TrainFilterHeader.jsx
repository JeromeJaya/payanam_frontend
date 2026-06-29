import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

export default function TrainFilterHeader({ 
  totalTrainsFound = 65,
  initialSelectedDate = 'Tue, 30 Jun'
}) {
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [activeSort, setActiveSort] = useState('Availability');

  const daysList = [
    { dateStr: 'Mon, 29 Jun' },
    { dateStr: 'Tue, 30 Jun' },
    { dateStr: 'Wed, 01 Jul' },
    { dateStr: 'Thu, 02 Jul' },
    { dateStr: 'Fri, 03 Jul' },
    { dateStr: 'Sat, 04 Jul' },
    { dateStr: 'Sun, 05 Jul' },
    { dateStr: 'Mon, 06 Jul' },
    { dateStr: 'Tue, 07 Jul' },
  ];

  const sortOptions = [
    { id: 'Availability', label: 'Availability', expandable: true },
    { id: 'Train Name', label: 'Train Name' },
    { id: 'Travel Time', label: 'Travel Time' },
    { id: 'Arrival', label: 'Arrival' },
    { id: 'Departure', label: 'Departure' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-white border border-gray-200/80 rounded-2xl shadow-2xs font-sans text-gray-900 select-none overflow-hidden">
      
      {/* ================= TOP PANEL: HORIZONTAL WEEK DAY CALENDAR ================= */}
      <div className="flex items-center border-b border-gray-100 relative bg-white">
        
        {/* Left Arrow Controller */}
        <button className="absolute left-0 top-0 bottom-0 px-3 bg-white hover:bg-gray-50 border-r border-gray-100 text-blue-600 transition-colors z-10 flex items-center justify-center group">
          <ChevronLeft size={18} className="group-active:scale-75 transition-transform stroke-[2.5]" />
        </button>

        {/* Carousel Days Strips Frame */}
        <div className="flex-1 flex overflow-x-auto scrollbar-none items-center py-2 px-10 gap-2 justify-between">
          {daysList.map((day) => {
            const isSelected = selectedDate === day.dateStr;
            return (
              <div
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`px-4 py-2 text-xs font-black rounded-lg transition-all text-center cursor-pointer whitespace-nowrap min-w-[95px] ${
                  isSelected 
                    ? 'bg-blue-50/70 text-blue-600 border border-blue-100/40 shadow-2xs' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {day.dateStr}
              </div>
            );
          })}
        </div>

        {/* Right Arrow Controller */}
        <button className="absolute right-0 top-0 bottom-0 px-3 bg-white hover:bg-gray-50 border-l border-gray-100 text-blue-600 transition-colors z-10 flex items-center justify-center group">
          <ChevronRight size={18} className="group-active:scale-75 transition-transform stroke-[2.5]" />
        </button>
      </div>

      {/* ================= BOTTOM PANEL: SEARCH SUMMARY & SORT CRITERIA ================= */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        
        {/* Result Counter Display */}
        <div className="text-sm font-black text-gray-800 tracking-tight">
          {totalTrainsFound} trains found
        </div>

        {/* Filter Metric Selectors Cluster */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500 font-bold">
          <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">
            SORT BY
          </span>
          
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {sortOptions.map((opt) => {
              const isActive = activeSort === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setActiveSort(opt.id)}
                  className={`cursor-pointer select-none transition-all flex items-center gap-1 py-1 px-2.5 rounded-md ${
                    isActive 
                      ? 'bg-blue-50/70 text-blue-600 font-black border border-blue-100/40' 
                      : 'hover:text-gray-900 text-gray-500'
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.expandable && (
                    <span className="text-[10px] font-normal text-blue-500 mt-px">▲</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}