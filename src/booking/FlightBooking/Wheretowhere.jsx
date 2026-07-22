import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function Wheretowhere({ 
  serviceType = "flight", 
  from: fromProp, 
  to: toProp, 
  date: dateProp,
  searchData,
  onFromChange,
  onToChange,
  onDateChange,
  onTripTypeChange,
  onReturnDateChange,
  onMultiCityLegsChange,
  onSearch
}) {
  // Main Search States
  const [tripType, setTripType] = useState('One Way');
  const [showTripTypeDropdown, setShowTripTypeDropdown] = useState(false);
  const [fromLocation, setFromLocation] = useState(fromProp || '');
  const [toLocation, setToLocation] = useState(toProp || '');
  const [fromIata, setFromIata] = useState('');
  const [toIata, setToIata] = useState('');
  const [fromAirportName, setFromAirportName] = useState('');
  const [toAirportName, setToAirportName] = useState('');
  const [departDate, setDepartDate] = useState(dateProp || '');
  const [returnDate, setReturnDate] = useState('');
  const [passengerClass, setPassengerClass] = useState('1 Adult, Economy/Premium');

  // Multi-city legs state (2-4 legs)
  const [multiCityLegs, setMultiCityLegs] = useState([
    { id: 1, from: '', to: '', date: '', fromIata: '', toIata: '', fromAirportName: '', toAirportName: '' },
    { id: 2, from: '', to: '', date: '', fromIata: '', toIata: '', fromAirportName: '', toAirportName: '' }
  ]);

  // Autocomplete States
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track whether user selected from suggestions (blocks random text submission)
  const [fromSelectedFromSuggestions, setFromSelectedFromSuggestions] = useState(false);
  const [toSelectedFromSuggestions, setToSelectedFromSuggestions] = useState(false);

  // Multi-city autocomplete states
  const [legSuggestions, setLegSuggestions] = useState({}); // { legId: { from: [], to: [] } }
  const [showLegSuggestions, setShowLegSuggestions] = useState({}); // { legId: { from: bool, to: bool } }
  // Track per-leg suggestion selection: { legId: { from: bool, to: bool } }
  const [legSelectedFromSuggestions, setLegSelectedFromSuggestions] = useState({});

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

  // Trip type options
  const tripTypes = ['One Way', 'Round Trip', 'Multi City'];

  // Handle trip type change
  const handleTripTypeChange = (type) => {
    setTripType(type);
    setShowTripTypeDropdown(false);
    if (onTripTypeChange) onTripTypeChange(type);
  };

  // Get today's date in YYYY-MM-DD format for min date validation
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle return date change
  const handleReturnDateChange = (e) => {
    const newReturnDate = e.target.value;
    // Return date must be after depart date
    if (departDate && newReturnDate <= departDate) {
      return;
    }
    setReturnDate(newReturnDate);
    if (onReturnDateChange) onReturnDateChange(newReturnDate);
  };

  // Add a new leg to multi-city
  const addMultiCityLeg = () => {
    if (multiCityLegs.length < 4) {
      const newLeg = {
        id: multiCityLegs.length + 1,
        from: '',
        to: '',
        date: '',
        fromIata: '',
        toIata: '',
        fromAirportName: '',
        toAirportName: ''
      };
      const newLegs = [...multiCityLegs, newLeg];
      setMultiCityLegs(newLegs);
      if (onMultiCityLegsChange) onMultiCityLegsChange(newLegs);
    }
  };

  // Remove a leg from multi-city
  const removeMultiCityLeg = (legId) => {
    if (multiCityLegs.length > 2) {
      const newLegs = multiCityLegs.filter(leg => leg.id !== legId);
      setMultiCityLegs(newLegs);
      if (onMultiCityLegsChange) onMultiCityLegsChange(newLegs);
    }
  };

  // Update a multi-city leg
  const updateMultiCityLeg = (legId, field, value) => {
    const newLegs = multiCityLegs.map(leg => {
      if (leg.id === legId) {
        return { ...leg, [field]: value };
      }
      return leg;
    });
    setMultiCityLegs(newLegs);
    if (onMultiCityLegsChange) onMultiCityLegsChange(newLegs);
  };

  // Quick swap Handler for From/To locations
  const handleSwapLocations = () => {
    const tempDisplay = fromLocation;
    const tempIata = fromIata;
    const tempAirport = fromAirportName;
      
    // Swap suggestion flags too
    const tempFromFlag = fromSelectedFromSuggestions;
    const tempToFlag = toSelectedFromSuggestions;
      
    setFromLocation(toLocation);
    setFromIata(toIata);
    setFromAirportName(toAirportName);
    setFromSelectedFromSuggestions(tempToFlag);
      
    setToLocation(tempDisplay);
    setToIata(tempIata);
    setToAirportName(tempAirport);
    setToSelectedFromSuggestions(tempFromFlag);
      
    // Update parent with swapped values
    const newFrom = toIata || toLocation;
    const newTo = tempIata || tempDisplay;
    if (onFromChange) onFromChange(newFrom);
    if (onToChange) onToChange(newTo);
      
    // Trigger a new search if we have valid values
    if (newFrom && newTo && departDate && fromSelectedFromSuggestions && toSelectedFromSuggestions) {
      // Use setTimeout to let state settle before triggering search
      setTimeout(() => {
        if (onSearch) onSearch();
      }, 100);
    }
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
    setFromSelectedFromSuggestions(false); // user is typing freely, not from suggestions
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
    setToSelectedFromSuggestions(false); // user is typing freely, not from suggestions
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
    setFromSelectedFromSuggestions(true); // selected from suggestions
    
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
    setToSelectedFromSuggestions(true); // selected from suggestions
    
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
            setFromSelectedFromSuggestions(true); // auto-resolved from API, treat as valid
            if (onFromChange) onFromChange(apiValue);
            // Show a nicer display name
            const displayText = best.displayText || `${best.city} (${best.iataCode})`;
            setFromLocation(displayText);
          }
        });
      } else {
        // Already looks like an IATA code (3 uppercase letters)
        setFromIata(fromProp);
        if (fromProp) setFromSelectedFromSuggestions(true);
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
            setToSelectedFromSuggestions(true); // auto-resolved from API, treat as valid
            if (onToChange) onToChange(apiValue);
            // Show a nicer display name
            const displayText = best.displayText || `${best.city} (${best.iataCode})`;
            setToLocation(displayText);
          }
        });
      } else {
        // Already looks like an IATA code (3 uppercase letters)
        setToIata(toProp);
        if (toProp) setToSelectedFromSuggestions(true);
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

  // Handle multi-city leg from input
  const handleLegFromChange = async (legId, e) => {
    const value = e.target.value;
    updateMultiCityLeg(legId, 'from', value);
    updateMultiCityLeg(legId, 'fromIata', '');
    updateMultiCityLeg(legId, 'fromAirportName', '');
    setLegSelectedFromSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId], from: false } }));

    if (value.length >= 2) {
      setLoading(true);
      const results = await searchAirports(value);
      setLegSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId], from: results } }));
      setShowLegSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId]?.from, from: true } }));
      setLoading(false);
    } else {
      setLegSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId], from: [] } }));
      setShowLegSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId]?.from, from: false } }));
    }
  };

  // Handle multi-city leg to input
  const handleLegToChange = async (legId, e) => {
    const value = e.target.value;
    updateMultiCityLeg(legId, 'to', value);
    updateMultiCityLeg(legId, 'toIata', '');
    updateMultiCityLeg(legId, 'toAirportName', '');
    setLegSelectedFromSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId], to: false } }));

    if (value.length >= 2) {
      setLoading(true);
      const results = await searchAirports(value);
      setLegSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId], to: results } }));
      setShowLegSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId]?.to, to: true } }));
      setLoading(false);
    } else {
      setLegSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId], to: [] } }));
      setShowLegSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId]?.to, to: false } }));
    }
  };

  // Select from suggestion for a leg
  const selectLegFromSuggestion = (legId, airport) => {
    const displayText = airport.displayText || `${airport.city} (${airport.iataCode})`;
    updateMultiCityLeg(legId, 'from', displayText);
    updateMultiCityLeg(legId, 'fromIata', airport.iataCode || airport.city);
    updateMultiCityLeg(legId, 'fromAirportName', airport.name);
    setLegSelectedFromSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId], from: true } }));
    setShowLegSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId]?.from, from: false } }));
  };

  // Select to suggestion for a leg
  const selectLegToSuggestion = (legId, airport) => {
    const displayText = airport.displayText || `${airport.city} (${airport.iataCode})`;
    updateMultiCityLeg(legId, 'to', displayText);
    updateMultiCityLeg(legId, 'toIata', airport.iataCode || airport.city);
    updateMultiCityLeg(legId, 'toAirportName', airport.name);
    setLegSelectedFromSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId], to: true } }));
    setShowLegSuggestions(prev => ({ ...prev, [legId]: { ...prev[legId]?.to, to: false } }));
  };

  // Handle search - ensure we send IATA codes to the API
  const handleSearch = async () => {
    // Validation based on trip type
    const errors = [];
    
    if (tripType === 'Multi City') {
      // Validate multi-city legs
      for (let i = 0; i < multiCityLegs.length; i++) {
        const leg = multiCityLegs[i];
        if (!leg.from || leg.from.trim() === "") {
          errors.push(`Leg ${i + 1}: Please enter a departure location`);
          break;
        }
        if (!legSelectedFromSuggestions[leg.id]?.from) {
          errors.push(`Leg ${i + 1}: Please select a valid departure location from the suggestions`);
          break;
        }
        if (!leg.to || leg.to.trim() === "") {
          errors.push(`Leg ${i + 1}: Please enter a destination location`);
          break;
        }
        if (!legSelectedFromSuggestions[leg.id]?.to) {
          errors.push(`Leg ${i + 1}: Please select a valid destination location from the suggestions`);
          break;
        }
        if (!leg.date || leg.date.trim() === "") {
          errors.push(`Leg ${i + 1}: Please select a travel date`);
          break;
        }
        if (leg.date < getTodayDate()) {
          errors.push(`Leg ${i + 1}: Travel date cannot be in the past`);
          break;
        }
      }
    } else {
      // Validate From and To
      if (!fromLocation || fromLocation.trim() === "") {
        errors.push("Please enter a departure location");
      } else if (!fromSelectedFromSuggestions) {
        errors.push("Please select a valid departure location from the suggestions");
      }
      if (!toLocation || toLocation.trim() === "") {
        errors.push("Please enter a destination location");
      } else if (!toSelectedFromSuggestions) {
        errors.push("Please select a valid destination location from the suggestions");
      }
      
      // Validate From != To
      if (fromLocation && toLocation && fromLocation.trim().toLowerCase() === toLocation.trim().toLowerCase()) {
        errors.push("Departure and destination cannot be the same");
      }
      
      // Validate Date
      if (!departDate || departDate.trim() === "") {
        errors.push("Please select a departure date");
      } else if (departDate < getTodayDate()) {
        errors.push("Departure date cannot be in the past");
      }

      // Validate return date for round trip
      if (tripType === 'Round Trip' && !returnDate) {
        errors.push("Please select a return date for round trip");
      }

      // Validate return date is after depart date
      if (tripType === 'Round Trip' && returnDate && departDate && returnDate <= departDate) {
        errors.push("Return date must be after departure date");
      }
    }
    
    // If there are validation errors, show them and don't proceed
    if (errors.length > 0) {
      alert(errors[0]);
      return;
    }
    
    if (tripType === 'Multi City') {
      // Handle multi-city search
      const resolvedLegs = [];
      for (const leg of multiCityLegs) {
        let fromValue = leg.fromIata || leg.from;
        let toValue = leg.toIata || leg.to;

        if (fromValue && !/^[A-Z]{3}$/.test(fromValue)) {
          const resolved = await resolveToIata(fromValue);
          fromValue = resolved;
        }
        if (toValue && !/^[A-Z]{3}$/.test(toValue)) {
          const resolved = await resolveToIata(toValue);
          toValue = resolved;
        }

        resolvedLegs.push({
          ...leg,
          fromIata: fromValue,
          toIata: toValue
        });
      }
      setMultiCityLegs(resolvedLegs);
      if (onMultiCityLegsChange) onMultiCityLegsChange(resolvedLegs);
      if (onSearch) onSearch();
    } else {
      // Handle one-way or round-trip search
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
      
      // Trigger flight search via parent's useEffect
      if (onSearch) onSearch();
    }
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

      {/* Top Row: Search Inputs */}
      <div className="flex flex-wrap items-center gap-2">
        
        

        {/* Multi-City Legs View */}
        {tripType === 'Multi City' ? (
          <>
            {/* Multi-city legs container */}
            <div className="w-full space-y-3">
              {multiCityLegs.map((leg, index) => (
                <div key={leg.id} className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 relative">
                  {/* Leg indicator */}
                  <div className="absolute -top-2 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Leg {index + 1}
                  </div>
                  
                  {/* Remove leg button (only show if more than 2 legs) */}
                  {multiCityLegs.length > 2 && (
                    <button
                      onClick={() => removeMultiCityLeg(leg.id)}
                      className="absolute -top-2 right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600"
                      title="Remove leg"
                    >
                      ×
                    </button>
                  )}

                  {/* From Location */}
                  <div className="flex-[2] min-w-[140px] bg-white border border-gray-200 rounded-lg p-1.5 relative">
                    <label className="block text-[8px] font-bold text-gray-400 uppercase">From</label>
                    <input
                      type="text"
                      value={leg.from}
                      onChange={(e) => handleLegFromChange(leg.id, e)}
                      placeholder="City or IATA"
                      className="w-full bg-transparent font-bold text-xs md:text-sm focus:outline-none"
                    />
                    {leg.fromIata && leg.fromAirportName && (
                      <div className="text-[9px] text-gray-500 truncate">{leg.fromIata} - {leg.fromAirportName}</div>
                    )}
                    {showLegSuggestions[leg.id]?.from && legSuggestions[leg.id]?.from?.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {legSuggestions[leg.id].from.map((airport) => (
                          <div
                            key={airport.iataCode || airport.city}
                            onClick={() => selectLegFromSuggestion(leg.id, airport)}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-xs text-gray-900">
                              <span className="text-blue-600 font-bold">{airport.iataCode}</span> - {airport.city}
                            </div>
                            <div className="text-[10px] text-gray-500 truncate">{airport.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* To Location */}
                  <div className="flex-[2] min-w-[140px] bg-white border border-gray-200 rounded-lg p-1.5 relative">
                    <label className="block text-[8px] font-bold text-gray-400 uppercase">To</label>
                    <input
                      type="text"
                      value={leg.to}
                      onChange={(e) => handleLegToChange(leg.id, e)}
                      placeholder="City or IATA"
                      className="w-full bg-transparent font-bold text-xs md:text-sm focus:outline-none"
                    />
                    {leg.toIata && leg.toAirportName && (
                      <div className="text-[9px] text-gray-500 truncate">{leg.toIata} - {leg.toAirportName}</div>
                    )}
                    {showLegSuggestions[leg.id]?.to && legSuggestions[leg.id]?.to?.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {legSuggestions[leg.id].to.map((airport) => (
                          <div
                            key={airport.iataCode || airport.city}
                            onClick={() => selectLegToSuggestion(leg.id, airport)}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-xs text-gray-900">
                              <span className="text-blue-600 font-bold">{airport.iataCode}</span> - {airport.city}
                            </div>
                            <div className="text-[10px] text-gray-500 truncate">{airport.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex-1 min-w-[120px] bg-white border border-gray-200 rounded-lg p-1.5">
                    <label className="block text-[8px] font-bold text-gray-400 uppercase">Date</label>
                    <input
                      type="date"
                      value={leg.date}
                      min={getTodayDate()}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        updateMultiCityLeg(leg.id, 'date', newDate);
                      }}
                      className="w-full bg-transparent font-bold text-xs md:text-sm focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              ))}

              {/* Add Leg Button */}
              {multiCityLegs.length < 4 && (
                <button
                  onClick={addMultiCityLeg}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 font-bold text-xs hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Another City
                </button>
              )}
            </div>

            {/* Search Button for Multi-City */}
            <button 
              type="button"
              onClick={handleSearch}
              className="w-full sm:flex-1 min-w-[140px] h-[44px] md:h-[54px] bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide rounded-lg uppercase transition-colors shadow-inner text-sm md:text-base"
            >
              Search Flights
            </button>
          </>
        ) : (
          /* Standard One-Way / Round-Trip View */
          <>
            {/* From Location */}
            <div className={`flex-[2] min-w-[160px] sm:min-w-[200px] border rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 transition-colors relative ${
              fromLocation && !fromSelectedFromSuggestions ? 'border-red-400 bg-red-50' : 'bg-gray-50 border-gray-200'
            }`}>
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
              {fromLocation && !fromSelectedFromSuggestions && (
                <div className="text-[9px] md:text-[10px] text-red-500 font-medium mt-0.5">Select from suggestions above</div>
              )}
              
              {/* From Suggestions Dropdown */}
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {fromSuggestions.map((airport) => (
                    <div
                      key={airport.iataCode || airport.city}
                      onClick={() => selectFromSuggestion(airport)}
                      className="px-3 md:px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-xs md:text-sm text-gray-900 truncate">
                        <span className="text-blue-600 font-bold">{airport.iataCode}</span> - {airport.city}
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-500 truncate">{airport.name}</div>
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
            <div className={`flex-[2] min-w-[160px] sm:min-w-[200px] border rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 transition-colors relative ${
              toLocation && !toSelectedFromSuggestions ? 'border-red-400 bg-red-50' : 'bg-gray-50 border-gray-200'
            }`}>
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
              {toLocation && !toSelectedFromSuggestions && (
                <div className="text-[9px] md:text-[10px] text-red-500 font-medium mt-0.5">Select from suggestions above</div>
              )}
              
              {/* To Suggestions Dropdown */}
              {showToSuggestions && toSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {toSuggestions.map((airport) => (
                    <div
                      key={airport.iataCode || airport.city}
                      onClick={() => selectToSuggestion(airport)}
                      className="px-3 md:px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-xs md:text-sm text-gray-900 truncate">
                        <span className="text-blue-600 font-bold">{airport.iataCode}</span> - {airport.city}
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-500 truncate">{airport.name}</div>
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
                min={getTodayDate()}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setDepartDate(newDate);
                  if (onDateChange) onDateChange(newDate);
                  // Clear return date if it's now before depart date
                  if (returnDate && newDate && returnDate <= newDate) {
                    setReturnDate('');
                    if (onReturnDateChange) onReturnDateChange('');
                  }
                }}
                className="w-full bg-transparent font-bold text-xs md:text-sm mt-0.5 focus:outline-none text-gray-900 cursor-pointer"
              />
            </div>

            {/* Return Date */}
            <div className={`flex-1 min-w-[120px] sm:min-w-[140px] border rounded-lg p-1.5 md:p-2 transition-colors ${
              tripType === 'Round Trip' 
                ? 'bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100' 
                : 'bg-gray-100 border-gray-100 cursor-not-allowed opacity-60'
            }`}>
              <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Return</label>
              {tripType === 'Round Trip' ? (
                <input
                  type="date"
                  value={returnDate}
                  min={departDate || getTodayDate()}
                  onChange={handleReturnDateChange}
                  className="w-full bg-transparent font-bold text-xs md:text-sm mt-0.5 focus:outline-none text-gray-900 cursor-pointer"
                />
              ) : (
                <span className="block font-bold text-xs md:text-sm mt-1 text-gray-400 font-medium">
                  {tripType === 'Multi City' ? 'N/A' : 'Select Return'}
                </span>
              )}
            </div>

            {/* Passengers & Class */}
            <div className="flex-[2] min-w-[180px] sm:min-w-[220px] bg-gray-50 border border-gray-200 rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 transition-colors">
              <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Passenger & Class</label>
              <span className="block font-bold text-xs md:text-sm mt-1 truncate">{passengerClass}</span>
            </div>

            {/* Search Button */}
            <button 
              type="button"
              onClick={handleSearch}
              className="w-full sm:flex-1 min-w-[140px] h-[44px] md:h-[54px] bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide rounded-lg uppercase transition-colors shadow-inner text-sm md:text-base"
            >
              Search
            </button>
          </>
        )}
      </div>

      {/* Bottom Row: Fare Types & Additional Options */}
      

    </div>
  );
}