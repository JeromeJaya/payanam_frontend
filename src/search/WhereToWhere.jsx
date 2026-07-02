import { useState, useRef, useEffect } from "react";
import { ArrowRightLeft, Calendar, MapPin, Users } from "lucide-react";
import api from "../api/axios";

export default function SearchBar({ 
  from, 
  setFrom, 
  to, 
  setTo, 
  date, 
  setDate, 
  searchData, 
  handleFetchBus 
}) {

  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);

  const swap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the current date explicitly to avoid stale closure issues
    // Passing undefined for filters uses their defaults, while date is passed explicitly
    handleFetchBus(undefined, undefined, undefined, undefined, undefined, undefined, undefined, date);
  };

  // Debounce timer refs
  const fromDebounceTimer = useRef(null);
  const toDebounceTimer = useRef(null);

  // Fetch suggestions from API
  const fetchSuggestions = async (query, type) => {
    if (!query || query.length < 2) {
      if (type === 'from') {
        setFromSuggestions([]);
        setShowFromSuggestions(false);
      } else {
        setToSuggestions([]);
        setShowToSuggestions(false);
      }
      return;
    }

    try {
      if (type === 'from') {
        setLoadingFrom(true);
      } else {
        setLoadingTo(true);
      }

      const response = await api.get(`/api/v1/places/search?q=${encodeURIComponent(query)}`);
      
      if (response.data?.success) {
        const suggestions = response.data.data.slice(0, 5); // Show max 5 suggestions
        if (type === 'from') {
          setFromSuggestions(suggestions);
          setShowFromSuggestions(suggestions.length > 0);
        } else {
          setToSuggestions(suggestions);
          setShowToSuggestions(suggestions.length > 0);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type} suggestions:`, error);
    } finally {
      if (type === 'from') {
        setLoadingFrom(false);
      } else {
        setLoadingTo(false);
      }
    }
  };

  // Handle From input change with debouncing
  const handleFromChange = (e) => {
    const value = e.target.value;
    setFrom(value);
    
    // Clear previous timer
    if (fromDebounceTimer.current) {
      clearTimeout(fromDebounceTimer.current);
    }
    
    // Set new timer for 300ms debounce
    fromDebounceTimer.current = setTimeout(() => {
      fetchSuggestions(value, 'from');
    }, 300);
  };

  // Handle To input change with debouncing
  const handleToChange = (e) => {
    const value = e.target.value;
    setTo(value);
    
    // Clear previous timer
    if (toDebounceTimer.current) {
      clearTimeout(toDebounceTimer.current);
    }
    
    // Set new timer for 300ms debounce
    toDebounceTimer.current = setTimeout(() => {
      fetchSuggestions(value, 'to');
    }, 300);
  };

  // Select from suggestion
  const selectFromSuggestion = (place) => {
    setFrom(place.name);
    setShowFromSuggestions(false);
  };

  // Select to suggestion
  const selectToSuggestion = (place) => {
    setTo(place.name);
    setShowToSuggestions(false);
  };

  // Close suggestions when clicking outside
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

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      if (fromDebounceTimer.current) {
        clearTimeout(fromDebounceTimer.current);
      }
      if (toDebounceTimer.current) {
        clearTimeout(toDebounceTimer.current);
      }
    };
  }, []);

  return (
    // Changed bottom-0 to h-fit to prevent the fixed header from covering the whole screen
    <form 
      onSubmit={handleSubmit}
      className="fixed top-20 left-0 right-0 bottom-0 h-fit w-auto mx-18 bg-white border-b border-slate-200 shadow-xs py-1 z-50"
    >
      <div className="max-w-8xl mx-auto sm:px-3 lg:px-4">
        <div className="flex flex-col xl:flex-row items-stretch gap-2 bg-white">
          
          {/* Main Route & Date Inputs Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-1.5 border border-slate-200 rounded-xl p-1 bg-slate-50/50 shadow-inner">
            
            {/* From Input Section with Autocomplete */}
            <div className="md:col-span-4 flex items-center gap-2 bg-white rounded-lg p-1.5 border border-slate-100 focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-500/10 transition-all relative" ref={fromRef}>
              <MapPin size={18} className="text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">From</label>
                <input 
                  type="text"
                  className="w-full text-xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none bg-transparent mt-0.5 leading-tight"
                  placeholder="Source City"
                  onChange={handleFromChange}
                  value={from}
                  required
                  autoComplete="off"
                />
              </div>
              
               {/* Autocomplete Dropdown */}
               {showFromSuggestions && (
                 <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                   {loadingFrom ? (
                     <div className="px-4 py-3 text-sm text-slate-500 text-center">Loading...</div>
                   ) : fromSuggestions.length > 0 ? (
                     fromSuggestions.map((place, index) => (
                       <button
                         key={index}
                         type="button"
                         onClick={() => selectFromSuggestion(place)}
                         className="w-full text-left px-4 py-2 hover:bg-lime-50 transition-colors border-b border-slate-100 last:border-b-0"
                       >
                         <div className="text-sm font-semibold text-slate-900">{place.name}</div>
                         <div className="text-xs text-slate-500">{place.state}</div>
                       </button>
                     ))
                   ) : (
                     <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
                   )}
                 </div>
               )}
            </div>

            {/* Swap Button Interactive Layer */}
            <div className="md:col-span-1 flex items-center justify-center -my-1.5 md:my-0">
              <button 
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:text-lime-600 shadow-xs hover:scale-105 transition active:scale-95 z-10"
                onClick={swap}
                title="Swap Locations"
              >
                <ArrowRightLeft size={14} className="rotate-90 md:rotate-0" />
              </button>
            </div>

            {/* To Input Section with Autocomplete */}
            <div className="md:col-span-4 flex items-center gap-2 bg-white rounded-lg p-1.5 border border-slate-100 focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-500/10 transition-all relative" ref={toRef}>
              <MapPin size={18} className="text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">To</label>
                <input 
                  type="text"
                  className="w-full text-xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none bg-transparent mt-0.5 leading-tight"
                  placeholder="Destination City"
                  value={to}
                  onChange={handleToChange}
                  required
                  autoComplete="off"
                />
              </div>
              
               {/* Autocomplete Dropdown */}
               {showToSuggestions && (
                 <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                   {loadingTo ? (
                     <div className="px-4 py-3 text-sm text-slate-500 text-center">Loading...</div>
                   ) : toSuggestions.length > 0 ? (
                     toSuggestions.map((place, index) => (
                       <button
                         key={index}
                         type="button"
                         onClick={() => selectToSuggestion(place)}
                         className="w-full text-left px-4 py-2 hover:bg-lime-50 transition-colors border-b border-slate-100 last:border-b-0"
                       >
                         <div className="text-sm font-semibold text-slate-900">{place.name}</div>
                         <div className="text-xs text-slate-500">{place.state}</div>
                       </button>
                     ))
                   ) : (
                     <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
                   )}
                 </div>
               )}
            </div>

            {/* Date Input Section */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1.5 border border-slate-100 focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-500/10 transition-all md:col-span-3">
              <Calendar size={18} className="text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Depart Date</label>
                <input
                  type="date"
                  className="w-full text-xl font-bold text-slate-800 focus:outline-none bg-transparent mt-0.5 cursor-pointer accent-lime-600 leading-tight"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

          </div>

          {/* Optional Seats/Passengers Container */}
          {searchData?.NoOfSeats && (
            <div className="w-full xl:w-40 flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-1.5 shadow-3xs">
              <Users size={18} className="text-slate-400 shrink-0" />
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Passengers</span>
                <span className="block text-base font-extrabold text-slate-800 mt-0.5 leading-none">{searchData.NoOfSeats} Seats</span>
              </div>
            </div>
          )}

          {/* Search Button changed to type="submit" */}
          <button 
            type="submit"
            className="w-full xl:w-36 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-extrabold text-base tracking-wider transition-all duration-150 shadow-xs active:scale-[0.99] py-2.5 xl:py-0 flex items-center justify-center uppercase"
          >
            Search
          </button>

        </div>
      </div>
    </form>
  );
}