import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function Wheretowhere({ 
  serviceType = "flight", 
  from: fromProp, 
  to: toProp, 
  date: dateProp,
  onFromChange,
  onToChange,
  onDateChange,
  handleFetchFlights
}) {
  // Main Search States
  const [tripType, setTripType] = useState('One Way');
  const [fromLocation, setFromLocation] = useState(fromProp || '');
  const [toLocation, setToLocation] = useState(toProp || '');
  const [fromIata, setFromIata] = useState('');
  const [toIata, setToIata] = useState('');
  const [fromAirportName, setFromAirportName] = useState('');
  const [toAirportName, setToAirportName] = useState('');
  const [departDate, setDepartDate] = useState(dateProp || '');
  const [returnDate, setReturnDate] = useState('');
  const [passengerClass, setPassengerClass] = useState('1 Adult, Economy/Premium');

  // Autocomplete States
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  // Service name mapping
  const serviceNames = {
    flight: "Flight Booking",
    bus: "Bus Booking",
    train: "Train Booking",
    hotel: "Hotel Booking"
  };

  // Fare & Special States
  const [fareType, setFareType] = useState('Armed Forces');
  const [priceDropProtection, setPriceDropProtection] = useState(false);

  // Quick swap handler for From/To locations
  const handleSwapLocations = () => {
    const tempDisplay = fromLocation;
    const tempIata = fromIata;
    const tempAirport = fromAirportName;
    setFromLocation(toLocation);
    setFromIata(toIata);
    setFromAirportName(toAirportName);
    if (onFromChange) onFromChange(toIata || toLocation);
    setToLocation(tempDisplay);
    setToIata(tempIata);
    setToAirportName(tempAirport);
    if (onToChange) onToChange(tempIata || tempDisplay);
  };

  // Search airports API call
  const searchAirports = async (query) => {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const response = await api.get(`/api/v1/airports/search?q=${encodeURIComponent(query)}`);
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error searching airports:', error);
      return [];
    }
  };

  // Handle From location input change
  const handleFromChange = async (e) => {
    const value = e.target.value;
    setFromLocation(value);
    // Clear IATA/airport info when user is typing manually
    setFromIata('');
    setFromAirportName('');
    // Pass raw input to parent (could be city name or IATA code)
    if (onFromChange) onFromChange(value);

    if (value.length >= 2) {
      setLoading(true);
      const results = await searchAirports(value);
      setFromSuggestions(results);
      setShowFromSuggestions(true);
      setLoading(false);
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  };

  // Handle To location input change
  const handleToChange = async (e) => {
    const value = e.target.value;
    setToLocation(value);
    // Clear IATA/airport info when user is typing manually
    setToIata('');
    setToAirportName('');
    // Pass raw input to parent (could be city name or IATA code)
    if (onToChange) onToChange(value);

    if (value.length >= 2) {
      setLoading(true);
      const results = await searchAirports(value);
      setToSuggestions(results);
      setShowToSuggestions(true);
      setLoading(false);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };

  // Select a suggestion for From location
  const selectFromSuggestion = (airport) => {
    // Store the display text for UI
    const displayText = airport.displayText || `${airport.city} (${airport.iataCode})`;
    setFromLocation(displayText);
    setFromAirportName(airport.name);
    
    // Store the IATA code and use it for API calls
    const apiValue = airport.iataCode || airport.city;
    setFromIata(apiValue);
    
    // Update parent with IATA code or city name (clean value for API)
    if (onFromChange) onFromChange(apiValue);
    setShowFromSuggestions(false);
  };

  // Select a suggestion for To location
  const selectToSuggestion = (airport) => {
    // Store the display text for UI
    const displayText = airport.displayText || `${airport.city} (${airport.iataCode})`;
    setToLocation(displayText);
    setToAirportName(airport.name);
    
    // Store the IATA code and use it for API calls
    const apiValue = airport.iataCode || airport.city;
    setToIata(apiValue);
    
    // Update parent with IATA code or city name (clean value for API)
    if (onToChange) onToChange(apiValue);
    setShowToSuggestions(false);
  };

  // Sync local state when props change from parent
  useEffect(() => {
    if (fromProp !== undefined) {
      setFromLocation(fromProp);
      // Auto-resolve a city name to its IATA code when the prop comes in
      if (fromProp && !/^[A-Z]{3}$/.test(fromProp)) {
        searchAirports(fromProp).then(results => {
          if (results && results.length > 0) {
            const best = results[0];
            const apiValue = best.iataCode || best.city;
            setFromIata(apiValue);
            setFromAirportName(best.name);
            if (onFromChange) onFromChange(apiValue);
            // Show a nicer display name
            const displayText = best.displayText || `${best.city} (${best.iataCode})`;
            setFromLocation(displayText);
          }
        });
      } else {
        // Already looks like an IATA code (3 uppercase letters)
        setFromIata(fromProp);
      }
    }
  }, [fromProp]);

  useEffect(() => {
    if (toProp !== undefined) {
      setToLocation(toProp);
      // Auto-resolve a city name to its IATA code when the prop comes in
      if (toProp && !/^[A-Z]{3}$/.test(toProp)) {
        searchAirports(toProp).then(results => {
          if (results && results.length > 0) {
            const best = results[0];
            const apiValue = best.iataCode || best.city;
            setToIata(apiValue);
            setToAirportName(best.name);
            if (onToChange) onToChange(apiValue);
            // Show a nicer display name
            const displayText = best.displayText || `${best.city} (${best.iataCode})`;
            setToLocation(displayText);
          }
        });
      } else {
        // Already looks like an IATA code (3 uppercase letters)
        setToIata(toProp);
      }
    }
  }, [toProp]);

  useEffect(() => {
    if (dateProp !== undefined) {
      setDepartDate(dateProp);
    }
  }, [dateProp]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFromSuggestions(false);
      setShowToSuggestions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Resolve a city name or IATA code to its IATA code (async).
  const resolveToIata = async (rawValue) => {
    if (!rawValue) return rawValue;
    // If it already looks like a 3-letter IATA code, use as-is
    if (/^[A-Z]{3}$/.test(rawValue)) return rawValue;
    // Otherwise query the airports API and take the first result
    try {
      const results = await searchAirports(rawValue);
      if (results && results.length > 0) {
        return results[0].iataCode || results[0].city || rawValue;
      }
    } catch (_) {}
    return rawValue;
  };

  // Handle search - ensure we send IATA codes to the API
  const handleSearch = async () => {
    // If the user typed a city name without picking from the dropdown,
    // resolve it to an IATA code first.
    let fromValue = fromIata || fromLocation;
    let toValue = toIata || toLocation;

    if (fromValue && !/^[A-Z]{3}$/.test(fromValue)) {
      const resolved = await resolveToIata(fromValue);
      if (resolved !== fromValue) {
        fromValue = resolved;
        // Also update local state so the UI shows the resolved IATA
        setFromIata(resolved);
        const displayText = `${resolved} - ${fromLocation}`;
        setFromLocation(displayText);
      }
    }
    if (toValue && !/^[A-Z]{3}$/.test(toValue)) {
      const resolved = await resolveToIata(toValue);
      if (resolved !== toValue) {
        toValue = resolved;
        setToIata(resolved);
        const displayText = `${resolved} - ${toLocation}`;
        setToLocation(displayText);
      }
    }
    
    // Update parent state with IATA codes
    if (onFromChange) onFromChange(fromValue);
    if (onToChange) onToChange(toValue);
    if (onDateChange) onDateChange(departDate);
    
    // Trigger flight search with values directly to avoid stale closure issues
    if (handleFetchFlights) handleFetchFlights(fromValue, toValue, departDate);
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
    <div className="mx-2 sm:mx-4 md:mx-8 lg:mx-12 p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-md font-sans text-gray-800">
      
      {/* Service Name Header */}
      <div className="mb-3 md:mb-4 pb-2 md:pb-3 border-b border-gray-200">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          {serviceNames[serviceType] || "Flight Booking"}
        </h2>
      </div>

      {/* Top Row: Search Inputs */}
      <div className="flex flex-wrap items-center gap-2">
        
        {/* Trip Type */}
        <div className="flex-1 min-w-[120px] sm:min-w-[140px] bg-gray-50 border border-gray-200 rounded-lg p-1.5 md:p-2 relative cursor-pointer hover:bg-gray-100 transition-colors">
          <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trip Type</label>
          <div className="flex items-center justify-between mt-1">
            <span className="font-bold text-xs md:text-sm truncate">{tripType}</span>
            <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* From Location */}
        <div className="flex-[2] min-w-[160px] sm:min-w-[200px] bg-gray-50 border border-gray-200 rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 transition-colors relative">
          <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">From</label>
          <input 
            type="text" 
            value={fromLocation} 
            onChange={handleFromChange}
            placeholder="City or IATA code"
            className="w-full bg-transparent font-bold text-sm md:text-base mt-0.5 focus:outline-none text-gray-900"
          />
          {fromIata && fromAirportName && (
            <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 truncate">
              {fromIata} - {fromAirportName}
            </div>
          )}
          
          {/* From Suggestions Dropdown */}
          {showFromSuggestions && fromSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {fromSuggestions.map((airport, index) => (
                <div
                  key={index}
                  onClick={() => selectFromSuggestion(airport)}
                  className="px-3 md:px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-xs md:text-sm text-gray-900">
                    <span className="text-blue-600 font-bold">{airport.iataCode}</span> - {airport.city}
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500">{airport.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <button 
          onClick={handleSwapLocations}
          type="button"
          className="p-1.5 md:p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors mx-[-4px] z-10 bg-white shadow-sm border border-gray-100"
          title="Swap Locations"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>

        {/* To Location */}
        <div className="flex-[2] min-w-[160px] sm:min-w-[200px] bg-gray-50 border border-gray-200 rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 transition-colors relative">
          <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">To</label>
          <input 
            type="text" 
            value={toLocation} 
            onChange={handleToChange}
            placeholder="City or IATA code"
            className="w-full bg-transparent font-bold text-sm md:text-base mt-0.5 focus:outline-none text-gray-900"
          />
          {toIata && toAirportName && (
            <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 truncate">
              {toIata} - {toAirportName}
            </div>
          )}
          
          {/* To Suggestions Dropdown */}
          {showToSuggestions && toSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {toSuggestions.map((airport, index) => (
                <div
                  key={index}
                  onClick={() => selectToSuggestion(airport)}
                  className="px-3 md:px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-xs md:text-sm text-gray-900">
                    <span className="text-blue-600 font-bold">{airport.iataCode}</span> - {airport.city}
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500">{airport.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Depart Date */}
        <div className="flex-1 min-w-[120px] sm:min-w-[140px] bg-gray-50 border border-gray-200 rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Depart</label>
          <input
            type="date"
            value={departDate}
            onChange={(e) => {
              setDepartDate(e.target.value);
              if (onDateChange) onDateChange(e.target.value);
            }}
            className="w-full bg-transparent font-bold text-xs md:text-sm mt-0.5 focus:outline-none text-gray-900 cursor-pointer"
          />
        </div>

        {/* Return Date */}
        <div className="flex-1 min-w-[120px] sm:min-w-[140px] bg-gray-50 border border-gray-200 rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Return</label>
          <span className={`block font-bold text-xs md:text-sm mt-1 ${!returnDate ? 'text-gray-400 font-medium' : ''}`}>
            {returnDate || 'Select Return'}
          </span>
        </div>

        {/* Passengers & Class */}
        <div className="flex-[2] min-w-[180px] sm:min-w-[220px] bg-gray-50 border border-gray-200 rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Passenger & Class</label>
          <span className="block font-bold text-xs md:text-sm mt-1 truncate">{passengerClass}</span>
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          className="w-full sm:flex-1 min-w-[140px] h-[44px] md:h-[54px] bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide rounded-lg uppercase transition-colors shadow-inner text-sm md:text-base"
        >
          Search
        </button>

      </div>

      {/* Bottom Row: Fare Types & Additional Options */}
      <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3 text-[10px] md:text-xs text-gray-600">
        <div className="flex items-center font-bold tracking-wider text-gray-400 text-[10px] md:text-[11px] uppercase">
          Fare Type:
        </div>

        {/* Fare Radio Options */}
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          {fareOptions.map((option) => (
            <label 
              key={option.id}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-md cursor-pointer border select-none transition-all ${
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
                className="w-3 h-3 md:w-4 md:h-4 text-blue-600 border-gray-300 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-gray-800 text-[10px] md:text-xs font-medium flex items-center gap-1">
                {option.label}
                {option.badge && (
                  <span className="bg-pink-500 text-white font-bold text-[8px] md:text-[9px] uppercase px-1 rounded-sm scale-90 origin-left">
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
        <label className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-gray-50 border border-gray-100 rounded-md cursor-pointer hover:bg-gray-100 transition-all select-none">
          <input 
            type="checkbox" 
            checked={priceDropProtection}
            onChange={(e) => setPriceDropProtection(e.target.checked)}
            className="w-3 h-3 md:w-4 md:h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
          />
          <span className="text-gray-800 text-[10px] md:text-xs font-medium">Add Price Drop Protection</span>
        </label>
      </div>

    </div>
  );
}