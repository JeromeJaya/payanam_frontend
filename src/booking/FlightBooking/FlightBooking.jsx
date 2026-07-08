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

  // Trip type states
  const [tripType, setTripType] = useState('One Way');
  const [returnDate, setReturnDate] = useState('');
  const [multiCityLegs, setMultiCityLegs] = useState([]);

  // Return flights for round-trip
  const [returnFlights, setReturnFlights] = useState([]);
  const [allReturnFlights, setAllReturnFlights] = useState([]);
  const [loadingReturn, setLoadingReturn] = useState(false);

  // Multi-city results (array of flight arrays per leg)
  const [multiCityResults, setMultiCityResults] = useState([]);
  const [loadingMultiCity, setLoadingMultiCity] = useState(false);

  // Selected flights for round-trip and multi-city
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [selectedMultiCityFlights, setSelectedMultiCityFlights] = useState([]); // One per leg

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
    passengerCount: "1",
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

    // Passenger count filter — only show flights with enough available seats
    if (currentFilters.passengerCount && currentFilters.passengerCount !== "ANY" && currentFilters.passengerCount !== "") {
      const required = parseInt(currentFilters.passengerCount, 10);
      if (!isNaN(required) && required >= 1) {
        filteredData = filteredData.filter(flight => {
          const avail = flight.seats?.available ?? flight.availableSeats ?? flight.seatAvailability ?? 0;
          return avail >= required;
        });
      }
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

  const handleFetchFlights = async (searchFrom, searchTo, searchDate, searchTripType, searchLegs, searchReturnDate) => {
    // Use passed values or fall back to state
    const fromVal = searchFrom || from;
    const toVal = searchTo || to;
    const dateVal = searchDate || date;
    const tripTypeVal = searchTripType || tripType;
    const returnDateVal = searchReturnDate || returnDate;
    const legsVal = searchLegs || multiCityLegs;

    // Update trip type state
    setTripType(tripTypeVal);
    if (returnDateVal) setReturnDate(returnDateVal);
    if (legsVal) setMultiCityLegs(legsVal);

    // Handle Multi-City search
    if (tripTypeVal === 'Multi City' && legsVal && legsVal.length > 0) {
      setLoadingMultiCity(true);
      setHasSearched(true);
      const results = [];

      try {
        for (const leg of legsVal) {
          const params = { 
            from: leg.fromIata || leg.from, 
            to: leg.toIata || leg.to, 
            date: leg.date 
          };
          
          const res = await api.get("/api/v1/flights/search", { params });
          const flightData = res?.data?.data || [];
          results.push(flightData);
        }
        setMultiCityResults(results);
        setSelectedMultiCityFlights(new Array(legsVal.length).fill(null));
      } catch (err) {
        console.error("Error fetching multi-city flights:", err);
        setMultiCityResults([]);
      } finally {
        setLoadingMultiCity(false);
      }
      return;
    }

    // Handle One-Way or Round-Trip search
    if (!fromVal || !toVal || !dateVal) {
      console.warn("Missing required search parameters", { fromVal, toVal, dateVal });
      return;
    }

    setHasSearched(true);
    const storageKey = getStorageKey(fromVal, toVal, dateVal);
    const cachedData = sessionStorage.getItem(storageKey);

    if (cachedData && tripTypeVal !== 'Round Trip') {
      // Use cached data from sessionStorage - apply filters and sort client-side
      const allFlightData = JSON.parse(cachedData);
      setAllFlights(allFlightData);
      const filtered = applyFilters(allFlightData);
      const sorted = applySorting(filtered);
      setFlights(sorted);
      
      // Clear return flights if not round trip
      if (tripTypeVal !== 'Round Trip') {
        setReturnFlights([]);
        setAllReturnFlights([]);
      }
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

      // Handle Round-Trip: fetch return flights
      if (tripTypeVal === 'Round Trip' && returnDateVal) {
        setLoadingReturn(true);
        try {
          const returnParams = { 
            from: toVal,  // Swap origin and destination for return
            to: fromVal, 
            date: returnDateVal 
          };
          
          const returnRes = await api.get("/api/v1/flights/search", { params: returnParams });
          const returnData = returnRes?.data?.data || [];
          setAllReturnFlights(returnData);
          setReturnFlights(returnData);
        } catch (err) {
          console.error("Error fetching return flights:", err);
          setReturnFlights([]);
          setAllReturnFlights([]);
        } finally {
          setLoadingReturn(false);
        }
      }
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
          onTripTypeChange={setTripType}
          onReturnDateChange={setReturnDate}
          onMultiCityLegsChange={setMultiCityLegs}
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
        <div className="bg-slate-50 dark:bg-slate-900 h-auto my-4 md:my-5 mx-2 sm:mx-4 md:mx-[100px] flex flex-col lg:flex-row">
                <div className = "filter bg-white dark:bg-slate-800 w-full lg:w-[25%] h-auto rounded-lg shadow-xl dark:shadow-slate-900/30 p-4">
                    <div className = "flex justify-center mb-4 font-bold text-lg text-slate-800 dark:text-slate-200">FILTERS</div>
                  
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
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg m-2">
                      <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">Price Range</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                          className="w-1/2 p-2 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                          className="w-1/2 p-2 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                        />
                      </div>
                      {priceRange.min > 0 && (
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Range: ₹{priceRange.min.toLocaleString('en-IN')} - ₹{priceRange.max.toLocaleString('en-IN')}</p>
                      )}
                    </div>
                    <SearchheckBox
                      title="Airlines"
                      text={airlineOptions}
                      selectedPoints={filters.airlines}
                      onChange={(selected) => handleFilterChange("airlines", selected)}
                      onClear={() => handleFilterChange("airlines", [])}
                    />
                    <SelectBox
                      text={["1", "2", "3", "4", "5", "6", "7", "8"]}
                      title="Passengers"
                      value={filters.passengerCount}
                      onChange={(option) => handleFilterChange("passengerCount", option)}
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
                            airlines: [],
                            passengerCount: "1",
                          });
                        }}
                        className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                </div>
                <div className = "bg-slate-100 dark:bg-slate-800 w-full lg:w-[80%] lg:ml-[2%] px-2 sm:px-3 md:px-5 rounded-lg shadow-xl dark:shadow-slate-900/30 flex flex-col">
                    <div className = "bg-white dark:bg-slate-800 w-full h-auto my-5 rounded-3xl shadow-xl dark:shadow-slate-900/30">
                        <FlightFareSelector sortBy={sortBy} onSortChange={handleSortChange} />
                    </div>
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        {/* Animated gradient background card */}
                        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 shadow-2xl">
                          {/* Multiple spinning rings with different speeds */}
                          <div className="relative w-32 h-32">
                            {/* Outer ring - slow spin */}
                            <div className="absolute inset-0 rounded-full border-4 border-sky-200 dark:border-slate-600 border-t-sky-600 dark:border-t-lime-500 border-r-transparent border-b-blue-400 dark:border-b-teal-500 border-l-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
                            {/* Middle ring - reverse spin */}
                            <div className="absolute inset-2 rounded-full border-3 border-blue-200 dark:border-slate-500 border-b-blue-600 dark:border-b-lime-400 border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                            {/* Inner ring - fast spin */}
                            <div className="absolute inset-4 rounded-full border-2 border-sky-300 dark:border-slate-500 border-l-sky-600 dark:border-l-teal-400 border-r-transparent border-t-transparent border-b-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
                            {/* Center pulsing icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 dark:from-lime-500 dark:to-teal-500 animate-pulse shadow-lg shadow-sky-500/50"></div>
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
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-lime-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">
                              Searching for Flights
                            </h3>
                            <p className="text-gray-600 dark:text-slate-400 font-medium text-lg mb-6">
                              Finding the best flight options for you...
                            </p>

                            {/* Animated progress indicators */}
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <div className="flex items-center gap-1">
                                <div className="w-2.5 h-2.5 bg-sky-600 dark:bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }}></div>
                                <div className="w-2.5 h-2.5 bg-sky-500 dark:bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '0.6s' }}></div>
                                <div className="w-2.5 h-2.5 bg-sky-400 dark:bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.6s' }}></div>
                              </div>
                            </div>

                            {/* Shimmer effect text */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-slate-700 rounded-full">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-sky-700 dark:text-slate-300 font-medium">Please wait a moment</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : tripType === 'Multi City' ? (
                      /* Multi-City Results Display */
                      <div className="space-y-6">
                        {loadingMultiCity ? (
                          <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-slate-400">Searching flights for all legs...</p>
                          </div>
                        ) : multiCityResults.length > 0 ? (
                          <>
                            {multiCityResults.map((legFlights, legIndex) => (
                              <div key={legIndex} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                                    Leg {legIndex + 1}: {multiCityLegs[legIndex]?.from} → {multiCityLegs[legIndex]?.to}
                                  </h3>
                                  <span className="text-sm text-gray-500 dark:text-slate-400">
                                    {multiCityLegs[legIndex]?.date}
                                  </span>
                                </div>
                                {selectedMultiCityFlights[legIndex] ? (
                                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                                    <p className="text-sm font-bold text-green-700 dark:text-green-300">Selected Flight</p>
                                    <FlightCard 
                                      flight={selectedMultiCityFlights[legIndex]}
                                      isSelected={true}
                                    />
                                  </div>
                                ) : null}
                                <div className="space-y-3">
                                  {legFlights.length > 0 ? legFlights.map((flight) => (
                                    <div 
                                      key={flight.scheduleId || flight._id}
                                      onClick={() => {
                                        const newSelected = [...selectedMultiCityFlights];
                                        newSelected[legIndex] = flight;
                                        setSelectedMultiCityFlights(newSelected);
                                      }}
                                      className={`cursor-pointer transition-all ${
                                        selectedMultiCityFlights[legIndex]?._id === flight._id 
                                          ? 'ring-2 ring-blue-500' 
                                          : 'hover:shadow-lg'
                                      }`}
                                    >
                                      <FlightCard 
                                        flight={flight}
                                        isSelected={selectedMultiCityFlights[legIndex]?._id === flight._id}
                                        onSelect={() => {
                                          const newSelected = [...selectedMultiCityFlights];
                                          newSelected[legIndex] = flight;
                                          setSelectedMultiCityFlights(newSelected);
                                        }}
                                      />
                                    </div>
                                  )) : (
                                    <p className="text-gray-500 dark:text-slate-400 text-center py-4">No flights available for this leg</p>
                                  )}
                                </div>
                              </div>
                            ))}
                            
                            {/* Continue Button for Multi-City */}
                            {selectedMultiCityFlights.every(f => f !== null) && (
                              <div className="sticky bottom-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-600 dark:text-slate-400">Total Price</p>
                                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                                    ₹{selectedMultiCityFlights.reduce((sum, f) => sum + (f.pricing?.calculatedFare || f.pricing?.baseFare || 0), 0).toLocaleString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    navigate('/flight-checkout', {
                                      state: {
                                        flights: selectedMultiCityFlights,
                                        tripType: 'Multi City',
                                        legs: multiCityLegs,
                                        fare: { price: selectedMultiCityFlights.reduce((sum, f) => sum + (f.pricing?.calculatedFare || f.pricing?.baseFare || 0), 0) },
                                        selectedSeats: [],
                                        scheduleId: selectedMultiCityFlights[0]?.scheduleId || selectedMultiCityFlights[0]?._id
                                      }
                                    });
                                  }}
                                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                >
                                  Continue to Booking
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-12 text-gray-600 dark:text-slate-400">
                            No flights found for the selected routes.
                          </div>
                        )}
                      </div>
                    ) : tripType === 'Round Trip' ? (
                      /* Round-Trip Results Display */
                      <div className="space-y-6">
                        {/* Outbound Flights */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
                            Outbound: {from} → {to} ({date})
                          </h3>
                          {selectedOutbound && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                              <p className="text-sm font-bold text-green-700 dark:text-green-300 mb-2">Selected Outbound Flight</p>
                              <FlightCard flight={selectedOutbound} isSelected={true} />
                            </div>
                          )}
                          <div className="space-y-3">
                            {Array.isArray(flights) && flights.length > 0 ? flights.map((flight) => (
                              <div 
                                key={flight.scheduleId || flight._id}
                                onClick={() => setSelectedOutbound(flight)}
                                className={`cursor-pointer transition-all ${
                                  selectedOutbound?._id === flight._id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                                }`}
                              >
                                <FlightCard 
                                  flight={flight}
                                  isSelected={selectedOutbound?._id === flight._id}
                                  onSelect={() => setSelectedOutbound(flight)}
                                />
                              </div>
                            )) : (
                              <p className="text-gray-500 dark:text-slate-400 text-center py-4">No outbound flights available</p>
                            )}
                          </div>
                        </div>

                        {/* Return Flights */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
                            Return: {to} → {from} ({returnDate})
                          </h3>
                          {loadingReturn ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                              <p className="text-gray-500 dark:text-slate-400">Loading return flights...</p>
                            </div>
                          ) : selectedReturn ? (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                              <p className="text-sm font-bold text-green-700 dark:text-green-300 mb-2">Selected Return Flight</p>
                              <FlightCard flight={selectedReturn} isSelected={true} />
                            </div>
                          ) : null}
                          <div className="space-y-3">
                            {Array.isArray(returnFlights) && returnFlights.length > 0 ? returnFlights.map((flight) => (
                              <div 
                                key={flight.scheduleId || flight._id}
                                onClick={() => setSelectedReturn(flight)}
                                className={`cursor-pointer transition-all ${
                                  selectedReturn?._id === flight._id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                                }`}
                              >
                                <FlightCard 
                                  flight={flight}
                                  isSelected={selectedReturn?._id === flight._id}
                                  onSelect={() => setSelectedReturn(flight)}
                                />
                              </div>
                            )) : (
                              <p className="text-gray-500 dark:text-slate-400 text-center py-4">No return flights available</p>
                            )}
                          </div>
                        </div>

                        {/* Continue Button for Round-Trip */}
                        {selectedOutbound && selectedReturn && (
                          <div className="sticky bottom-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-slate-400">Total Price (Round Trip)</p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                                ₹{((selectedOutbound.pricing?.calculatedFare || selectedOutbound.pricing?.baseFare || 0) + 
                                   (selectedReturn.pricing?.calculatedFare || selectedReturn.pricing?.baseFare || 0)).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                navigate('/flight-checkout', {
                                  state: {
                                    flights: [selectedOutbound, selectedReturn],
                                    tripType: 'Round Trip',
                                    fare: { 
                                      price: (selectedOutbound.pricing?.calculatedFare || selectedOutbound.pricing?.baseFare || 0) + 
                                             (selectedReturn.pricing?.calculatedFare || selectedReturn.pricing?.baseFare || 0)
                                    },
                                    selectedSeats: [],
                                    scheduleId: selectedOutbound.scheduleId || selectedOutbound._id
                                  }
                                });
                              }}
                              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                            >
                              Continue to Booking
                            </button>
                          </div>
                        )}
                      </div>
                    ) : Array.isArray(flights) && flights.length > 0 ? (
                      /* One-Way Results Display */
                      flights.map((flight) => (
                        <div key={flight.scheduleId || flight.id || flight.flightNumber} className="bg-white dark:bg-slate-800 w-full h-auto mb-3 rounded-3xl shadow-xl dark:shadow-slate-900/30">
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
                      <div className="p-4 md:p-8 text-center text-gray-600 dark:text-slate-400">No flights found for the selected route and date.</div>
                    )}
                </div>
            </div>
        </div>
      </>
  );
}