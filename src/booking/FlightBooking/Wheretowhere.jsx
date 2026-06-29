import React, { useState } from 'react';

export default function Wheretowhere() {
  // Main Search States
  const [tripType, setTripType] = useState('One Way');
  const [fromLocation, setFromLocation] = useState('New Delhi, India');
  const [toLocation, setToLocation] = useState('Mumbai, India');
  const [departDate, setDepartDate] = useState('Tue, 30 Jun 26');
  const [returnDate, setReturnDate] = useState('');
  const [passengerClass, setPassengerClass] = useState('1 Adult, Economy/Premium');

  // Fare & Special States
  const [fareType, setFareType] = useState('Armed Forces');
  const [priceDropProtection, setPriceDropProtection] = useState(false);

  // Quick swap handler for From/To locations
  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const fareOptions = [
    { id: 'Regular', label: 'Regular' },
    { id: 'Student', label: 'Student' },
    { id: 'Armed Forces', label: 'Armed Forces' },
    { id: 'GST', label: 'Have a GST number ?', badge: 'new' },
    { id: 'Senior Citizen', label: 'Senior Citizen' },
    { id: 'Doctor & Nurses', label: 'Doctor and Nurses' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md font-sans text-gray-800">
      
      {/* Top Row: Search Inputs */}
      <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
        
        {/* Trip Type */}
        <div className="flex-1 min-w-[140px] bg-gray-50 border border-gray-200 rounded-lg p-2 relative cursor-pointer hover:bg-gray-100 transition-colors">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trip Type</label>
          <div className="flex items-center justify-between mt-1">
            <span className="font-bold text-sm">{tripType}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* From Location */}
        <div className="flex-[2] min-w-[200px] bg-gray-50 border border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">From</label>
          <input 
            type="text" 
            value={fromLocation} 
            onChange={(e) => setFromLocation(e.target.value)}
            className="w-full bg-transparent font-bold text-base mt-0.5 focus:outline-none text-gray-900"
          />
        </div>

        {/* Swap Button */}
        <button 
          onClick={handleSwapLocations}
          type="button"
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors mx-[-4px] z-10 bg-white shadow-sm border border-gray-100"
          title="Swap Locations"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>

        {/* To Location */}
        <div className="flex-[2] min-w-[200px] bg-gray-50 border border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">To</label>
          <input 
            type="text" 
            value={toLocation} 
            onChange={(e) => setToLocation(e.target.value)}
            className="w-full bg-transparent font-bold text-base mt-0.5 focus:outline-none text-gray-900"
          />
        </div>

        {/* Depart Date */}
        <div className="flex-1 min-w-[140px] bg-gray-50 border border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Depart</label>
          <span className="block font-bold text-sm mt-1">{departDate || 'Select Date'}</span>
        </div>

        {/* Return Date */}
        <div className="flex-1 min-w-[140px] bg-gray-50 border border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Return</label>
          <span className={`block font-bold text-sm mt-1 ${!returnDate ? 'text-gray-400 font-medium' : ''}`}>
            {returnDate || 'Select Return'}
          </span>
        </div>

        {/* Passengers & Class */}
        <div className="flex-[2] min-w-[220px] bg-gray-50 border border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Passenger & Class</label>
          <span className="block font-bold text-sm mt-1 truncate">{passengerClass}</span>
        </div>

        {/* Search Button */}
        <button className="flex-1 min-w-[140px] h-[54px] bg-gray-300 hover:bg-gray-400 text-white font-bold tracking-wide rounded-lg uppercase transition-colors shadow-inner">
          Search
        </button>

      </div>

      {/* Bottom Row: Fare Types & Additional Options */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-600">
        <div className="flex items-center font-bold tracking-wider text-gray-400 text-[11px] uppercase">
          Fare Type:
        </div>

        {/* Fare Radio Options */}
        <div className="flex flex-wrap items-center gap-2">
          {fareOptions.map((option) => (
            <label 
              key={option.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer border select-none transition-all ${
                fareType === option.id 
                  ? 'bg-blue-50 border-blue-200 font-semibold text-blue-700' 
                  : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
              }`}
            >
              <input 
                type="radio" 
                name="fareType" 
                checked={fareType === option.id}
                onChange={() => setFareType(option.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-gray-800 text-xs font-medium flex items-center gap-1">
                {option.label}
                {option.badge && (
                  <span className="bg-pink-500 text-white font-bold text-[9px] uppercase px-1 rounded-sm scale-90 origin-left">
                    {option.badge}
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden md:block h-6 w-[1px] bg-gray-200 mx-1" />

        {/* Price Drop Protection Checkbox */}
        <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-md cursor-pointer hover:bg-gray-100 transition-all select-none">
          <input 
            type="checkbox" 
            checked={priceDropProtection}
            onChange={(e) => setPriceDropProtection(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
          />
          <span className="text-gray-800 text-xs font-medium">Add Price Drop Protection</span>
        </label>
      </div>

    </div>
  );
}