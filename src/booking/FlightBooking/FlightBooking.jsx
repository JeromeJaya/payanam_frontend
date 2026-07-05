import Nav from "../../NavComponent.jsx"
import WhereToWhere from "./Wheretowhere.jsx"
import FlightCard from "../../cards/FlightCard.jsx"
import FlightFareSelector from "./FlightFareSelector.jsx"
import SelectedFlightsSidebar from "../../cards/SelectedFlightsSidebar.jsx"

import SearchheckBox from "../../filter/SearchheckBox.jsx"
import SelectBox from "../../filter/SelectBox.jsx"
import Checkbox from "../../filter/Checkbox.jsx"
import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js"


export default function FlightBooking(){

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const serviceType = location.state?.serviceType || "flight";
  const searchData = location.state?.searchData || {};
   
  // Read from query parameters
  // Flight service uses "departure" field name in SearchBar, other services use "date"
  const fromParam = searchParams.get('from') || searchData.from || "";
  const toParam = searchParams.get('to') || searchData.to || "";
  const dateParam = searchParams.get('date') || searchParams.get('departure') || searchData.date || (() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  })();
   
  const [from, setFrom] = useState(fromParam);
  const [to, setTo] = useState(toParam);
  const [date, setDate] = useState(dateParam);
  const [hasSearched, setHasSearched] = useState(false);

  // Show message if required fields are missing (don't redirect to allow filters to work)
  const showSearchPrompt = !from || !to || !date;
  const [flights, setFlights] = useState([]);
  const [allFlights, setAllFlights] = useState([]); // Store full unfiltered data
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("price_low");
  const [filters, setFilters] = useState({
    aircraftType: "",
    cabinClass: "",
    minPrice: "",
    maxPrice: "",
    airlines: [],
  });
  const [comparedFlights, setComparedFlights] = useState([]);
  const [showCompareSidebar, setShowCompareSidebar] = useState(false);

  // Generate a unique sessionStorage key based on search params
  const getStorageKey = (searchFrom, searchTo, searchDate) => {
    return `flight_search_${(searchFrom || from).trim()}_${(searchTo || to).trim()}_${(searchDate || date)}`;
  };

  // Apply all filters client-side from the given data array
  const applyFilters = (data, currentFilters = filters) => {
    let filteredData = [...data];

    if (currentFilters.aircraftType && currentFilters.aircraftType !== "ANY") {
      filteredData = filteredData.filter(flight => 
        (flight.flight?.aircraftType || flight.aircraft?.type) === currentFilters.aircraftType
      );
    }

    if (currentFilters.cabinClass && currentFilters.cabinClass !== "ANY") {
      filteredData = filteredData.filter(flight => 
        (flight.cabin?.class || flight.cabinClass) === currentFilters.cabinClass
      );
    }

    if (currentFilters.minPrice) {
      const min = Number(currentFilters.minPrice);
      filteredData = filteredData.filter(flight => 
        (flight.pricing?.calculatedFare || flight.pricing?.baseFare || 0) >= min
      );
    }

    if (currentFilters.maxPrice) {
      const max = Number(currentFilters.maxPrice);
      filteredData = filteredData.filter(flight => 
        (flight.pricing?.calculatedFare || flight.pricing?.baseFare || 0) <= max
      );
    }

    if (currentFilters.airlines.length > 0) {
      filteredData = filteredData.filter(flight => 
        currentFilters.airlines.includes(flight.flight?.airlineName || flight.operator?.name)
      );
    }

    return filteredData;
  };

  // Apply sorting client-side
  const applySorting = (data, sortOption = sortBy) => {
    const sorted = [...data];
    
    switch (sortOption) {
      case "price_low":
        sorted.sort((a, b) => (a.pricing?.calculatedFare || a.pricing?.baseFare || 0) - (b.pricing?.calculatedFare || b.pricing?.baseFare || 0));
        break;
      case "price_high":
        sorted.sort((a, b) => (b.pricing?.calculatedFare || b.pricing?.baseFare || 0) - (a.pricing?.calculatedFare || a.pricing?.baseFare || 0));
        break;
      case "duration":
        sorted.sort((a, b) => {
          const durA = a.journey?.durationMinutes || 0;
          const durB = b.journey?.durationMinutes || 0;
          return durA - durB;
        });
        break;
      case "departure":
        sorted.sort((a, b) => (a.journey?.departureTime || "").localeCompare(b.journey?.departureTime || ""));
        break;
      case "arrival":
        sorted.sort((a, b) => (a.journey?.arrivalTime || "").localeCompare(b.journey?.arrivalTime || ""));
        break;
      default:
        break;
    }
    
    return sorted;
  };

  const handleFetchFlights = async (searchFrom, searchTo, searchDate) => {
    // Use passed values or fall back to state
    const fromVal = searchFrom || from;
    const toVal = searchTo || to;
    const dateVal = searchDate || date;

    if (!fromVal || !toVal || !dateVal) {
      console.warn("Missing required search parameters", { fromVal, toVal, dateVal });
      return;
    }

    const storageKey = getStorageKey(fromVal, toVal, dateVal);
    const cachedData = sessionStorage.getItem(storageKey);

    if (cachedData) {
      // Use cached data from sessionStorage - apply filters and sort client-side
      const allFlightData = JSON.parse(cachedData);
      setAllFlights(allFlightData);
      const filtered = applyFilters(allFlightData);
      const sorted = applySorting(filtered);
      setFlights(sorted);
      return;
    }

    setLoading(true);
    try {
      const params = { from: fromVal, to: toVal, date: dateVal };
      
      // Add optional filters
      if (filters.aircraftType) params.aircraftType = filters.aircraftType;
      if (filters.cabinClass) params.cabinClass = filters.cabinClass;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get("/api/v1/flights/search", { params });
      console.log("Flight search params:", params);
      const flightData = res?.data?.data || [];
      console.log("Flight search results:", flightData);
      
      // Store the FULL unfiltered response in sessionStorage
      sessionStorage.setItem(storageKey, JSON.stringify(flightData));
      setAllFlights(flightData);
      
      // Apply client-side filtering for airlines (since backend doesn't support array filter yet)
      let filteredData = flightData;
      if (filters.airlines.length > 0) {
        filteredData = flightData.filter(flight => 
          filters.airlines.includes(flight.flight?.airlineName || flight.operator?.name)
        );
      }
      
      setFlights(filteredData);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setFlights([]);
      setAllFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
  };

  // Initial fetch: only if from/to look like IATA codes (3 uppercase letters)
  // otherwise WhereTowhere will resolve city names to IATA codes and trigger
  // a re-fetch via the [from, to, date] effect.
  useEffect(() => {
    const looksLikeIata = (v) => /^[A-Z]{3}$/.test(v || '');
    if (from && to && date && looksLikeIata(from) && looksLikeIata(to)) {
      handleFetchFlights();
    } else if (from && to && date) {
      // Non-IATA values will be resolved by WhereTowhere, which calls setFrom/setTo
      // with IATA codes, triggering the [from, to, date] effect below.
    }
  }, []);

  // Re-fetch when from/to/date changes (e.g. after IATA auto-resolution or user edit)
  useEffect(() => {
    if (from && to && date) {
      handleFetchFlights();
    }
  }, [from, to, date]);

  // Re-apply filters and sort when sort/filter changes (no API call)
  useEffect(() => {
    if (allFlights.length > 0) {
      const filtered = applyFilters(allFlights);
      const sorted = applySorting(filtered);
      setFlights(sorted);
    }
  }, [sortBy, filters]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleAddToCompare = (flight) => {
    if (!comparedFlights.find(f => f.scheduleId === flight.scheduleId || f.id === flight.id)) {
      setComparedFlights([...comparedFlights, flight]);
    }
  };

  const handleRemoveFromCompare = (flight) => {
    setComparedFlights(comparedFlights.filter(f => f.scheduleId !== flight.scheduleId && f.id !== flight.id));
  };

  const isFlightCompared = (flight) => {
    return comparedFlights.some(f => f.scheduleId === flight.scheduleId || f.id === flight.id);
  };

  const toggleCompareSidebar = () => {
    setShowCompareSidebar(!showCompareSidebar);
  };

  // Get unique airlines for filter
  const airlineOptions = useMemo(() => {
    return Array.from(new Set(allFlights.map(f => f.flight?.airlineName || f.operator?.name).filter(Boolean)));
  }, [allFlights]);

  // Get unique aircraft types for filter
  const aircraftTypeOptions = useMemo(() => {
    return Array.from(new Set(allFlights.map(f => f.flight?.aircraftType || f.aircraft?.type).filter(Boolean)));
  }, [allFlights]);

  // Get unique cabin classes for filter
  const cabinClassOptions = useMemo(() => {
    const classes = new Set();
    allFlights.forEach(f => {
      if (f.flight?.cabinClasses && Array.isArray(f.flight.cabinClasses)) {
        f.flight.cabinClasses.forEach(c => classes.add(c));
      }
    });
    return Array.from(classes);
  }, [allFlights]);

  // Get price range
  const priceRange = useMemo(() => {
    if (allFlights.length === 0) return { min: 0, max: 0 };
    const prices = allFlights.map(f => f.pricing?.calculatedFare || f.pricing?.baseFare || 0);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [allFlights]);
  return (
    <>
      <Nav />
      <div className="pt-16">
        <WhereToWhere
          className="shadow-xl sticky top-20"
          from={from}
          to={to}
          date={date}
          onFromChange={setFrom}
          onToChange={setTo}
          onDateChange={setDate}
          searchData={searchData}
          handleFetchFlights={handleFetchFlights}
          serviceType={serviceType}
        />
        
        {/* Selected Flights Sidebar */}
        <SelectedFlightsSidebar
          comparedFlights={comparedFlights}
          show={showCompareSidebar}
          onClose={() => setShowCompareSidebar(false)}
          onRemoveFromCompare={handleRemoveFromCompare}
        />
        <div className="bg-mist-50 h-auto my-4 md:my-5 mx-2 sm:mx-4 md:mx-[100px] flex flex-col lg:flex-row">
                <div className = "filter bg-white w-full lg:w-[25%] h-auto rounded-lg shadow-xl p-4">
                    <div className = "flex justify-center mb-4 font-bold text-lg">FILTERS</div>
                  
                    <SelectBox
                      text={aircraftTypeOptions}
                      title="Aircraft Type"
                      value={filters.aircraftType}
                      onChange={(option) => handleFilterChange("aircraftType", option)}
                    />
                    <SelectBox
                      text={["ANY", ...cabinClassOptions]}
                      title="Cabin Class"
                      value={filters.cabinClass}
                      onChange={(option) => handleFilterChange("cabinClass", option)}
                    />
                    
                    {/* Price Range Filter */}
                    <div className="p-4 bg-white/50 rounded-lg m-2">
                      <label className="block text-xs font-bold text-gray-700 mb-2">Price Range</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                          className="w-1/2 p-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                          className="w-1/2 p-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      {priceRange.min > 0 && (
                        <p className="text-xs text-gray-500 mt-1">Range: ₹{priceRange.min.toLocaleString('en-IN')} - ₹{priceRange.max.toLocaleString('en-IN')}</p>
                      )}
                    </div>
                    <SearchheckBox
                      title="Airlines"
                      text={airlineOptions}
                      selectedPoints={filters.airlines}
                      onChange={(selected) => handleFilterChange("airlines", selected)}
                      onClear={() => handleFilterChange("airlines", [])}
                    />
                    
                    {/* Filter Actions */}
                    <div className="p-4 flex gap-2">
                      <button 
                        onClick={() => {
                          // Reset all filters
                          setFilters({
                            aircraftType: "",
                            cabinClass: "",
                            minPrice: "",
                            maxPrice: "",
                            airlines: []
                          });
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                </div>
                <div className = "bg-neutral-200 w-full lg:w-[80%] lg:ml-[2%] px-2 sm:px-3 md:px-5 rounded-lg shadow-xl flex flex-col">
                    <div className = "bg-white w-full h-auto my-5 rounded-3xl shadow-xl">
                        <FlightFareSelector sortBy={sortBy} onSortChange={handleSortChange} />
                    </div>
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        {/* Animated gradient background card */}
                        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-2xl">
                          {/* Multiple spinning rings with different speeds */}
                          <div className="relative w-32 h-32">
                            {/* Outer ring - slow spin */}
                            <div className="absolute inset-0 rounded-full border-4 border-sky-200 border-t-sky-600 border-r-transparent border-b-blue-400 border-l-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
                            {/* Middle ring - reverse spin */}
                            <div className="absolute inset-2 rounded-full border-3 border-blue-200 border-b-blue-600 border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                            {/* Inner ring - fast spin */}
                            <div className="absolute inset-4 rounded-full border-2 border-sky-300 border-l-sky-600 border-r-transparent border-t-transparent border-b-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
                            {/* Center pulsing icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 animate-pulse shadow-lg shadow-sky-500/50"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Loading text with animation */}
                          <div className="mt-10 text-center">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-3">
                              Searching for Flights
                            </h3>
                            <p className="text-gray-600 font-medium text-lg mb-6">
                              Finding the best flight options for you...
                            </p>

                            {/* Animated progress indicators */}
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <div className="flex items-center gap-1">
                                <div className="w-2.5 h-2.5 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }}></div>
                                <div className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '0.6s' }}></div>
                                <div className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.6s' }}></div>
                              </div>
                            </div>

                            {/* Shimmer effect text */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-sky-700 font-medium">Please wait a moment</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : Array.isArray(flights) && flights.length > 0 ? (
                      flights.map((flight) => (
                        <div key={flight.scheduleId || flight.id || flight.flightNumber} className="bg-white w-full h-auto mb-3 rounded-3xl shadow-xl">
                         <FlightCard 
                           flight={flight} 
                           isCompared={isFlightCompared(flight)}
                           onAddToCompare={() => handleAddToCompare(flight)}
                           onRemoveFromCompare={() => handleRemoveFromCompare(flight)}
                           onToggleCompareSidebar={toggleCompareSidebar}
                         />
                        </div>
                      ))
                    ) : (
                      <div className="p-4 md:p-8 text-center text-gray-600">No flights found for the selected route and date.</div>
                    )}
                </div>
            </div>
        </div>
      </>
  );
}