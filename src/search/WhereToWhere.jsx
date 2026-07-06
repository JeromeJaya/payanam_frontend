import { useState, useRef, useEffect } from "react";
import { ArrowRightLeft, Calendar, MapPin, Users, ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import api from "../api/axios";

export default function SearchBar({ 
  from, 
  setFrom, 
  to, 
  setTo, 
  date, 
  setDate, 
  searchData, 
  handleFetchBus,
  passengerCount,
  onPassengerCountChange,
}) {
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);
  
  // New state to toggle mobile expansion
  const [isMobileMaximized, setIsMobileMaximized] = useState(false);
  
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const fromDebounceTimer = useRef(null);
  const toDebounceTimer = useRef(null);

  const swap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const errors = [];
    
    // Validate From and To
    if (!from || from.trim() === "") {
      errors.push("Please enter a departure location");
    }
    if (!to || to.trim() === "") {
      errors.push("Please enter a destination location");
    }
    
    // Validate From != To
    if (from && to && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      errors.push("Departure and destination cannot be the same");
    }
    
    // Validate Passenger count if it exists in searchData
    if (searchData?.NoOfSeats !== undefined && searchData.NoOfSeats !== "") {
      const pCount = parseInt(searchData.NoOfSeats, 10);
      if (isNaN(pCount)) {
        errors.push("Please enter a valid number for passenger count");
      } else if (pCount < 1) {
        errors.push("Passenger count must be at least 1");
      } else if (pCount > 20) {
        errors.push("Maximum 20 passengers allowed per booking");
      }
    }
    
    // If there are validation errors, show them and don't proceed
    if (errors.length > 0) {
      alert(errors[0]);
      return;
    }
    
    handleFetchBus(undefined, undefined, undefined, undefined, undefined, undefined, undefined, date);
    // Auto-collapse on mobile after performing search
    setIsMobileMaximized(false);
  };

  const runQuery = async (queryText, inputDirection, tokenObject) => {
    if (!queryText || queryText.trim().length < 2) {
      if (inputDirection === 'from') {
        setFromSuggestions([]);
        setShowFromSuggestions(false);
      } else {
        setToSuggestions([]);
        setShowToSuggestions(false);
      }
      return;
    }

    try {
      if (inputDirection === 'from') setLoadingFrom(true);
      else setLoadingTo(true);

      const response = await api.get(`/api/v1/places/search?q=${encodeURIComponent(queryText)}`);
      if (tokenObject.ignore) return;

      if (response.data?.success) {
        const suggestions = response.data.data.slice(0, 5);
        if (inputDirection === 'from') {
          setFromSuggestions(suggestions);
          setShowFromSuggestions(suggestions.length > 0);
        } else {
          setToSuggestions(suggestions);
          setShowToSuggestions(suggestions.length > 0);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${inputDirection} suggestions:`, error);
    } finally {
      if (tokenObject.ignore) return;
      if (inputDirection === 'from') setLoadingFrom(false);
      else setLoadingTo(false);
    }
  };

  const handleFromChange = (e) => {
    const value = e.target.value;
    setFrom(value);
    if (fromDebounceTimer.current) clearTimeout(fromDebounceTimer.current);
    const token = { ignore: false };
    fromDebounceTimer.current = setTimeout(() => {
      runQuery(value, 'from', token);
    }, 300);
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setTo(value);
    if (toDebounceTimer.current) clearTimeout(toDebounceTimer.current);
    const token = { ignore: false };
    toDebounceTimer.current = setTimeout(() => {
      runQuery(value, 'to', token);
    }, 300);
  };

  const selectFromSuggestion = (place) => {
    setFrom(place.name);
    setShowFromSuggestions(false);
  };

  const selectToSuggestion = (place) => {
    setTo(place.name);
    setShowToSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setShowToSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (fromDebounceTimer.current) clearTimeout(fromDebounceTimer.current);
      if (toDebounceTimer.current) clearTimeout(toDebounceTimer.current);
    };
  }, []);

  // Format date readable for the compact mobile preview line
  const getFormattedDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mt-4 h-fit bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm z-50 transition-all duration-200">
      
      {/* 1. MINIMIZED MOBILE VIEW (Visible only on mobile when not expanded) */}
      {!isMobileMaximized && (
        <div 
          onClick={() => setIsMobileMaximized(true)}
          className="flex md:hidden items-center justify-between p-2.5 mx-2 my-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl cursor-pointer active:bg-slate-100 dark:active:bg-slate-600 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <MapPin size={14} className="text-sky-500 shrink-0" />
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate grid grid-cols-1">
              <span className="truncate">
                {from || "Origin"} → {to || "Destination"}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                {getFormattedDate(date)} {searchData?.NoOfSeats ? `• ${searchData.NoOfSeats} Seats` : ''}
              </span>
            </div>
          </div>
          <button 
            type="button"
            className="w-7 h-7 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-3xs ml-2 shrink-0"
          >
            <Edit2 size={12} className="text-sky-500" />
          </button>
        </div>
      )}

      {/* 2. FULL SEARCHBAR CONTAINER (Always visible on desktop, toggleable on mobile) */}
      <form 
        onSubmit={handleSubmit}
        className={`${isMobileMaximized ? "block animate-fadeIn" : "hidden md:block"} p-2 md:p-2`}
      >
        <div className="max-w-8xl mx-auto">
          {/* Header row containing explicit minimization option for mobile viewports */}
          <div className="flex md:hidden items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Modify Search</span>
            <button
              type="button"
              onClick={() => setIsMobileMaximized(false)}
              className="flex items-center gap-1 text-xs font-bold text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-lg transition-colors"
            >
              Minimize <ChevronUp size={14} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-1.5">
            
            {/* Input Grid Cells Container - Switch to row on lg views */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-12 lg:flex lg:flex-row lg:items-center gap-1 md:gap-1.5 border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50/50 dark:bg-slate-900/50 relative">
              
              {/* From Field */}
              <div className="col-span-1 md:col-span-4 lg:flex-1 flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg p-1.5 border border-slate-100 dark:border-slate-700 focus-within:border-lime-500 transition-all relative" ref={fromRef}>
                <MapPin size={15} className="text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">From</label>
                  <input 
                    type="text"
                    className="w-full text-xs sm:text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-500 focus:outline-none bg-transparent mt-0.5 truncate"
                    placeholder="Origin"
                    onChange={handleFromChange}
                    value={from}
                    required
                    autoComplete="off"
                  />
                </div>
                
                {showFromSuggestions && (
                  <div className="absolute top-full left-0 w-[85vw] md:w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-[60] max-h-60 overflow-y-auto">
                    {loadingFrom ? (
                      <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 text-center">Searching...</div>
                    ) : fromSuggestions.length > 0 ? (
                      fromSuggestions.map((place, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectFromSuggestion(place)}
                          className="w-full text-left px-3 py-2 hover:bg-lime-50/80 dark:hover:bg-lime-900/20 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                        >
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{place.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{place.state}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 text-center">No results</div>
                    )}
                  </div>
                )}
              </div>

              {/* Middle Border Swapper Switch */}
              <div className="absolute left-1/2 top-[24px] md:top-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-y-0 md:static md:col-span-1 lg:self-center flex items-center justify-center z-20">
                <button 
                  type="button"
                  className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-lime-600 dark:hover:text-lime-400 shadow-sm transition active:scale-90"
                  onClick={swap}
                  title="Swap Locations"
                >
                  <ArrowRightLeft size={12} />
                </button>
              </div>

              {/* To Field */}
              <div className="col-span-1 md:col-span-4 lg:flex-1 flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg p-1.5 border border-slate-100 dark:border-slate-700 focus-within:border-lime-500 transition-all relative pl-4 md:pl-1.5" ref={toRef}>
                <MapPin size={15} className="text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">To</label>
                  <input 
                    type="text"
                    className="w-full text-xs sm:text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-500 focus:outline-none bg-transparent mt-0.5 truncate"
                    placeholder="Destination"
                    value={to}
                    onChange={handleToChange}
                    required
                    autoComplete="off"
                  />
                </div>
                
                {showToSuggestions && (
                  <div className="absolute top-full right-0 w-[85vw] md:w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-[60] max-h-60 overflow-y-auto">
                    {loadingTo ? (
                      <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 text-center">Searching...</div>
                    ) : toSuggestions.length > 0 ? (
                      toSuggestions.map((place, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectToSuggestion(place)}
                          className="w-full text-left px-3 py-2 hover:bg-lime-50/80 dark:hover:bg-lime-900/20 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                        >
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{place.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{place.state}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 text-center">No results</div>
                    )}
                  </div>
                )}
              </div>

              {/* Date Box */}
              <div className="col-span-2 md:col-span-3 lg:w-44 flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg p-1.5 border border-slate-100 dark:border-slate-700 focus-within:border-lime-500 transition-all">
                <Calendar size={15} className="text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Depart Date</label>
                  <input
                    type="date"
                    className="w-full text-xs sm:text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 focus:outline-none bg-transparent mt-0.5 cursor-pointer accent-lime-600"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Passenger Count Field */}
              {onPassengerCountChange && (
                <div className="col-span-2 md:col-span-3 lg:w-40 flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg p-1.5 border border-slate-100 dark:border-slate-700 focus-within:border-lime-500 transition-all">
                  <Users size={15} className="text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" />
                  <div className="flex-1 min-w-0">
                    <label className="block text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Passengers</label>
                    <select
                      className="w-full text-xs sm:text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 focus:outline-none bg-transparent mt-0.5 cursor-pointer accent-lime-600"
                      value={passengerCount ?? "1"}
                      onChange={(e) => onPassengerCountChange(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Layer Module Panel */}
            <div className="flex gap-1.5 items-stretch w-full lg:w-auto">
              <button 
                type="submit"
                className={`rounded-xl bg-sky-500 dark:bg-sky-600 hover:bg-sky-600 dark:hover:bg-sky-700 active:bg-sky-700 dark:active:bg-sky-800 text-white font-extrabold text-xs md:text-sm tracking-wider transition-all shadow-sm px-4 uppercase shrink-0 flex items-center justify-center ${searchData?.NoOfSeats ? 'flex-1 md:flex-initial lg:w-32' : 'w-full lg:w-32 py-2.5 lg:py-0'}`}
              >
                Search
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}