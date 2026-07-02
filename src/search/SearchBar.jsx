import place from '../booking/places.json';
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';

// Flat-mapping data layer
const allDestinations = place.flatMap(p => [
  p.state,
  ...p.districts.map(d => d)
]);

export default function SearchBar({ input, service }) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const day = String(new Date()).slice(0, 3);

  // Core Controlled Search Parameters State
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Suggestions Visibility Layers
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  
  // Airport suggestions from API
  const [fromAirportSuggestions, setFromAirportSuggestions] = useState([]);
  const [toAirportSuggestions, setToAirportSuggestions] = useState([]);

  // Box wrapper element tracker refs
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const inputRefs = useRef({});

  // Clear query inputs if service toggles changes
  useEffect(() => {
    setFrom("");
    setTo("");
    setShowFromDropdown(false);
    setShowToDropdown(false);
  }, [service]);

  // Search airports API for flight service
  const searchAirports = async (query) => {
    if (!query || query.length < 2 || service !== 'flight') {
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

  const handleFromChange = async (e) => {
    const val = e.target.value;
    setFrom(val);
    
    if (val.trim().length > 1 && service === 'flight') {
      // Use airports API for flight service
      const results = await searchAirports(val);
      setFromAirportSuggestions(results);
      setShowFromDropdown(results.length > 0);
    } else if (val.trim().length > 1) {
      // Use local destinations for other services
      const filtered = allDestinations
        .filter(d => d.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5);
      setShowFromDropdown(filtered.length > 0);
    } else {
      setShowFromDropdown(false);
      setFromAirportSuggestions([]);
    }
  };

  const handleToChange = async (e) => {
    const val = e.target.value;
    setTo(val);
    
    if (val.trim().length > 1 && service === 'flight') {
      // Use airports API for flight service
      const results = await searchAirports(val);
      setToAirportSuggestions(results);
      setShowToDropdown(results.length > 0);
    } else if (val.trim().length > 1) {
      // Use local destinations for other services
      const filtered = allDestinations
        .filter(d => d.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5);
      setShowToDropdown(filtered.length > 0);
    } else {
      setShowToDropdown(false);
      setToAirportSuggestions([]);
    }
  };

  const selectFrom = (item) => {
    // If it's an airport object (from API), use displayText
    if (typeof item === 'object' && item.displayText) {
      setFrom(item.displayText);
    } else {
      setFrom(item);
    }
    setShowFromDropdown(false);
  };

  const selectTo = (item) => {
    // If it's an airport object (from API), use displayText
    if (typeof item === 'object' && item.displayText) {
      setTo(item.displayText);
    } else {
      setTo(item);
    }
    setShowToDropdown(false);
  };

  // Close suggestion dropdown menus if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const formData = {
      from,
      to,
    };
    Object.keys(inputRefs.current).forEach((key) => {
      if (key !== "from" && key !== "to") {
        formData[key] = inputRefs.current[key]?.value || "";
      }
    });
    
    const queryParams = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/${service}booking?${queryParams.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {input.map((field, idx) => {
          const isFromField = field.name === "from" || field.name === "city";
          const isToField = field.name === "to";
          
          let valueProp = undefined;
          let onChangeHandler = undefined;
          let wrapperRef = null;
          let showDropdown = false;

          if (isFromField) {
            valueProp = from;
            onChangeHandler = handleFromChange;
            wrapperRef = fromRef;
            showDropdown = showFromDropdown;
          } else if (isToField) {
            valueProp = to;
            onChangeHandler = handleToChange;
            wrapperRef = toRef;
            showDropdown = showToDropdown;
          }

          const todayDay = field.type === "date" ? day : field.below;

          return (
            <div
              key={idx}
              ref={wrapperRef}
              className="relative"
            >
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                {field.label}
              </label>
              
              <input
                id={field.name}
                className="w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-white hover:border-slate-300"
                placeholder={field.mid || `Enter ${field.label.toLowerCase()}`}
                type={field.type || "text"}
                defaultValue={valueProp !== undefined ? undefined : (field.type === "date" ? today : field.mid)}
                value={valueProp}
                onChange={onChangeHandler}
                onFocus={() => {
                  if (isFromField && from.length > 1) setShowFromDropdown(true);
                  if (isToField && to.length > 1) setShowToDropdown(true);
                }}
                ref={(el) => { inputRefs.current[field.name] = el; }}
                autoComplete="off"
              />
              
              {todayDay && (
                <p className="text-slate-400 mt-1 text-xs">{todayDay}</p>
              )}

              {/* Suggestions Dropdown */}
              {showDropdown && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {service === 'flight' && isFromField && fromAirportSuggestions.map((airport, index) => (
                    <li
                      key={index}
                      onClick={() => selectFrom(airport)}
                      className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <div className="font-medium">{airport.displayText || `${airport.city} (${airport.iataCode})`}</div>
                      <div className="text-xs text-slate-500">{airport.name}</div>
                    </li>
                  ))}
                  {service === 'flight' && isToField && toAirportSuggestions.map((airport, index) => (
                    <li
                      key={index}
                      onClick={() => selectTo(airport)}
                      className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <div className="font-medium">{airport.displayText || `${airport.city} (${airport.iataCode})`}</div>
                      <div className="text-xs text-slate-500">{airport.name}</div>
                    </li>
                  ))}
                  {service !== 'flight' && (isFromField ? 
                    allDestinations.filter(d => d.toLowerCase().includes(from.toLowerCase())) :
                    allDestinations.filter(d => d.toLowerCase().includes(to.toLowerCase()))
                  ).slice(0, 5).map((item, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        if (isFromField) selectFrom(item);
                        else if (isToField) selectTo(item);
                      }}
                      className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-md hover:shadow-lg text-sm uppercase tracking-wide"
      >
        Search {service ? service.charAt(0).toUpperCase() + service.slice(1) : ""}
      </button>
    </div>
  );
}