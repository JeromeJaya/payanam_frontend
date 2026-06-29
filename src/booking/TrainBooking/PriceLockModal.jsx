import React, { useState } from 'react';
import { X, Lock, Plane, TrendingUp, ArrowRight } from 'lucide-react';

export default function PriceLockModal({ isOpen, onClose }) {
  // Duration choices matching your mockup data values
  const lockOptions = [
    { id: '4h', duration: '4 hours', fee: 652, isPopular: false, flightPrice: 14450 },
    { id: '8h', duration: '8 hours', fee: 733, isPopular: true, flightPrice: 14450 },
    { id: '12h', duration: '12 hours', fee: 814, isPopular: false, flightPrice: 14450 },
  ];

  const [selectedOption, setSelectedOption] = useState(lockOptions[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans animate-fade-in">
      {/* Modal Container */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Header Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X size={22} strokeWidth={1.5} />
        </button>

        {/* Inner Content Wrapper */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Main Headline Block */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Lock size={18} fill="currentColor" className="stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Lock this price & pay later!
            </h2>
          </div>

          {/* Route Overview Segment Card */}
          <div className="border border-gray-100 rounded-xl p-4 space-y-4 shadow-2xs">
            {/* Outbound Row */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                <Plane size={15} className="text-blue-900 rotate-45" />
                <span>Depart · HDO - NMI</span>
              </div>
              <p className="text-xs font-medium text-gray-500 pl-6">
                Tue, 30 Jun | 17:00 - 19:05 | Non Stop | Economy &gt; SAVER
              </p>
            </div>

            {/* Divider line representation */}
            <div className="border-t border-dashed border-gray-200 my-1 ml-6" />

            {/* Inbound Row */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                <Plane size={15} className="text-orange-600 -rotate-135" />
                <span>Return · NMI - DEL</span>
              </div>
              <p className="text-xs font-medium text-gray-500 pl-6">
                Wed, 1 Jul | 06:05 - 08:25 | Non Stop | Economy &gt; SAVER
              </p>
            </div>

            {/* Social Proof/Demand Banner Accent */}
            <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-2.5 flex items-center gap-2 text-xs text-amber-900">
              <TrendingUp size={14} className="text-amber-600 shrink-0" />
              <p className="font-medium">
                This route was <span className="font-black text-amber-700">searched</span> more than <span className="font-black text-amber-700">30,000 times</span> in the last 1 day.
              </p>
            </div>
          </div>

          {/* Selection List Section header */}
          <div>
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">
              Select Price Lock duration :
            </h3>
            
            {/* Duration Selector Cards Row */}
            <div className="grid grid-cols-3 gap-3">
              {lockOptions.map((opt) => {
                const isSelected = selectedOption.id === opt.id;
                return (
                  <div 
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`relative rounded-xl border p-3 text-center cursor-pointer select-none transition-all ${
                      isSelected 
                        ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {opt.isPopular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-700 text-white font-black text-[9px] uppercase tracking-wide px-2.5 py-0.5 rounded-full shadow-xs">
                        Popular
                      </span>
                    )}
                    <div className="text-xs font-black text-gray-900">{opt.duration}</div>
                    <div className="text-xs font-bold text-gray-700 mt-1">₹ {opt.fee}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Warning Label */}
          <div className="text-xs text-gray-800 font-medium">
            Complete your booking by <span className="font-black text-amber-600">Jun 29, 2026 | 09:50 AM</span>
          </div>

          {/* Cost Summary Box Panel */}
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white overflow-hidden shadow-2xs">
            {/* Row 1: Lock Price Details */}
            <div className="p-4 flex justify-between items-start">
              <div>
                <h4 className="font-black text-sm text-gray-900">Cost of Price Lock</h4>
                <p className="text-[11px] text-gray-400 font-medium max-w-[280px] mt-1 leading-tight">
                  <span className="text-red-500 font-bold">Non-refundable</span> & not to be adjusted against the Flight booking amount
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-gray-900">₹ {selectedOption.fee}</span>
                <span className="block text-[10px] text-gray-400 font-medium mt-px">for 1 traveller</span>
              </div>
            </div>

            {/* Row 2: Ticket Price Guarantee Total */}
            <div className="p-4 flex justify-between items-center bg-gray-50/40">
              <span className="font-black text-sm text-gray-900">
                Locked Price for {selectedOption.duration}*
              </span>
              <span className="text-base font-black text-gray-900">
                ₹ {selectedOption.flightPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Submit Accent Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-sm py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2 group tracking-wide">
            PAY ₹ {selectedOption.fee} AND LOCK
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

      </div>
    </div>
  );
}