import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, Star, SlidersHorizontal } from 'lucide-react';

export default function FlightFareSelector({ sortBy = "price_low", onSortChange }) {
  // Mock Data for the Date Carousel
  const datesData = [
    { day: 'Mon, Jun 29', price: 7455, type: 'normal' },
    { day: 'Tue, Jun 30', price: 6858, type: 'selected' },
    { day: 'Wed, Jul 1', price: 6783, type: 'low' },
    { day: 'Thu, Jul 2', price: 6783, type: 'low' },
    { day: 'Fri, Jul 3', price: 6342, type: 'lowest' },
    { day: 'Sat, Jul 4', price: 6033, type: 'lowest' },
    { day: 'Sun, Jul 5', price: 6333, type: 'lowest' },
    { day: 'Mon, Jul 6', price: 6497, type: 'low' },
  ];

  // State Management
  const [selectedDate, setSelectedDate] = useState('Tue, Jun 30');
  const [activeTab, setActiveTab] = useState(sortBy === "price_low" ? 'cheapest' : sortBy === "duration" ? 'nonstop' : 'cheapest');

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Map tab to sort value
    const sortMapping = {
      'cheapest': 'price_low',
      'nonstop': 'duration',
      'prefer': 'rating',
      'other': 'departure'
    };
    if (onSortChange) {
      onSortChange(sortMapping[tab] || 'price_low');
    }
  };

  // Helper logic to style price tiers based on your UI rules
  const getPriceColor = (date) => {
    if (date.day === selectedDate) return 'text-blue-600';
    if (date.price <= 6342) return 'text-green-600'; // Lowest fares
    if (date.price < 6800) return 'text-green-600 opacity-90'; // Low fares
    return 'text-gray-700';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white font-sans text-gray-900 select-none">
      
      {/* 1. TOP CAROUSEL: Date & Price Strip */}
      <div className="flex items-stretch border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm mb-4">
        {/* Left Navigation Arrow */}
        <button className="px-2 border-r border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors">
          <ChevronLeft size={20} className="text-blue-400" />
        </button>

        {/* Dates Strip */}
        <div className="flex flex-1 divide-x divide-gray-100 overflow-x-auto scrollbar-none">
          {datesData.map((item) => {
            const isSelected = item.day === selectedDate;
            return (
              <div
                key={item.day}
                onClick={() => setSelectedDate(item.day)}
                className={`flex-1 min-w-[100px] py-2 px-3 text-center cursor-pointer transition-all relative ${
                  isSelected 
                    ? 'bg-blue-50/40 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`text-xs font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                  {item.day}
                </div>
                <div className={`text-sm mt-1 font-bold ${getPriceColor(item)}`}>
                  ₹ {item.price.toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Navigation Arrow */}
        <button className="px-2 border-l border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors">
          <ChevronRight size={20} className="text-blue-600" />
        </button>
      </div>

      {/* 2. MIDDLE ROW: Sort Quick Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        
        {/* Cheapest Tab */}
        <div 
          onClick={() => handleTabChange('cheapest')}
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
            activeTab === 'cheapest'
              ? 'bg-blue-50/70 border-blue-400 border-b-[3px] border-b-blue-600 shadow-sm'
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <div className={`p-2 rounded-md ${activeTab === 'cheapest' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
            <span className="font-bold text-sm">₹</span>
          </div>
          <div>
            <div className="text-xs font-black tracking-wide uppercase text-gray-800">CHEAPEST</div>
            <div className="text-xs text-gray-600 font-medium mt-0.5">
              <span className="font-bold text-gray-900">₹ 6,442</span> | 05h 15m
            </div>
          </div>
        </div>

        {/* Non Stop First Tab */}
        <div 
          onClick={() => handleTabChange('nonstop')}
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
            activeTab === 'nonstop'
              ? 'bg-blue-50/70 border-blue-400 border-b-[3px] border-b-blue-600 shadow-sm'
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <div className={`p-2 rounded-md ${activeTab === 'nonstop' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
            <Zap size={16} fill={activeTab === 'nonstop' ? "white" : "currentColor"} className="stroke-none" />
          </div>
          <div>
            <div className="text-xs font-black tracking-wide uppercase text-gray-800">NON STOP FIRST</div>
            <div className="text-xs text-gray-600 font-medium mt-0.5">
              <span className="font-bold text-gray-900">₹ 6,646</span> | 02h 10m
            </div>
          </div>
        </div>

        {/* You May Prefer Tab */}
        <div 
          onClick={() => handleTabChange('prefer')}
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
            activeTab === 'prefer'
              ? 'bg-blue-50/70 border-blue-400 border-b-[3px] border-b-blue-600 shadow-sm'
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <div className={`p-2 rounded-md ${activeTab === 'prefer' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
            <Star size={16} fill={activeTab === 'prefer' ? "white" : "currentColor"} className="stroke-none" />
          </div>
          <div>
            <div className="text-xs font-black tracking-wide uppercase text-gray-800">YOU MAY PREFER</div>
            <div className="text-xs text-gray-600 font-medium mt-0.5">
              <span className="font-bold text-gray-900">₹ 6,442</span> | 05h 15m
            </div>
          </div>
        </div>

        {/* Other Sort Options Tab */}
        <div 
          onClick={() => handleTabChange('other')}
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
            activeTab === 'other'
              ? 'bg-blue-50/70 border-blue-400 border-b-[3px] border-b-blue-600 shadow-sm'
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <div className={`p-2 rounded-md ${activeTab === 'other' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
            <SlidersHorizontal size={16} />
          </div>
          <div>
            <div className="text-xs font-black tracking-wide uppercase text-gray-800 leading-tight">Other</div>
            <div className="text-xs font-black tracking-wide uppercase text-gray-800 leading-tight">Sort</div>
          </div>
        </div>

      </div>

      {/* 3. BOTTOM ROW: Status Labels */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Dynamic sorting notification string */}
        <div className="text-sm font-black text-gray-900 tracking-tight">
          Flights sorted by {activeTab === 'nonstop' ? 'Non-stop flights' : activeTab === 'prefer' ? 'preferences' : 'Lowest fares'} on this route
        </div>
        
        {/* Context Recommendation Badge */}
        <div className="inline-flex items-center bg-orange-50 border border-orange-100 text-amber-900 font-medium text-xs px-4 py-1.5 rounded-full shadow-sm max-w-fit">
          Cheaper Non-stop Flights available on 4 Jul & 5 Jul
        </div>
      </div>

    </div>
  );
}