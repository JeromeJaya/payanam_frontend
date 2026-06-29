import React, { useState } from 'react';

export default function HotelSearchWidget() {
  // Component States initialized with values from your mockup image
  const [propertyLocation, setPropertyLocation] = useState('Goa, India');
  const [checkInDate, setCheckInDate] = useState('Tue, 30 Jun 2026');
  const [checkOutDate, setCheckOutDate] = useState('Wed, 1 Jul 2026');
  const [roomsAndGuests, setRoomsAndGuests] = useState('1 Room, 2 Adults');

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white rounded-xl shadow-md border border-gray-100 font-sans text-gray-800 select-none">
      <div className="flex flex-col md:flex-row items-center gap-2 lg:flex-nowrap">
        
        {/* 1. Destination Box Input */}
        <div className="w-full md:flex-[2.5] bg-gray-50 border border-gray-200 rounded-lg p-2.5 hover:bg-gray-100/70 transition-colors cursor-pointer">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
            City, Area or Property
          </label>
          <input 
            type="text" 
            value={propertyLocation} 
            onChange={(e) => setPropertyLocation(e.target.value)}
            className="w-full bg-transparent font-black text-base mt-0.5 focus:outline-none text-gray-900 placeholder-gray-400"
            placeholder="Where are you staying?"
          />
        </div>

        {/* 2. Check-In Date Picker Field */}
        <div className="w-full md:flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 hover:bg-gray-100/70 transition-colors cursor-pointer">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
            Check-In
          </label>
          <input 
            type="text" 
            value={checkInDate} 
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full bg-transparent font-black text-sm mt-1 focus:outline-none text-gray-900"
          />
        </div>

        {/* 3. Check-Out Date Picker Field */}
        <div className="w-full md:flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 hover:bg-gray-100/70 transition-colors cursor-pointer">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
            Check-Out
          </label>
          <input 
            type="text" 
            value={checkOutDate} 
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="w-full bg-transparent font-black text-sm mt-1 focus:outline-none text-gray-900"
          />
        </div>

        {/* 4. Rooms & Guest Select Configuration Field */}
        <div className="w-full md:flex-[1.5] bg-gray-50 border border-gray-200 rounded-lg p-2.5 hover:bg-gray-100/70 transition-colors cursor-pointer">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
            Rooms & Guests
          </label>
          <input 
            type="text" 
            value={roomsAndGuests} 
            onChange={(e) => setRoomsAndGuests(e.target.value)}
            className="w-full bg-transparent font-black text-sm mt-1 focus:outline-none text-gray-900 truncate"
          />
        </div>

        {/* 5. Blue Gradient Action Submit Button */}
        <button className="w-full md:flex-1 h-[58px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black text-sm tracking-widest rounded-xl uppercase transition-all shadow-md active:scale-[0.99]">
          Search
        </button>

      </div>
    </div>
  );
}