import Nav from "../../NavComponent.jsx"
import WhereToWhere from "../../search/WhereToWhere.jsx"
import BusCard from "../../cards/BusCard.jsx"
import BusFillterBar from "../../filter/BusFillterBar.jsx"

import SearchheckBox from "../../filter/SearchheckBox.jsx"
import SelectBox from "../../filter/SelectBox.jsx"
import Checkbox from "../../filter/Checkbox.jsx"
import { CalendarDays, RefreshCw, AlertCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

export default function BusBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || "";
  const dateParam = searchParams.get("date") || (() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  })();
  const noOfSeatsParam = searchParams.get("NoOfSeats") || "1";
   
  const [from, setFrom] = useState(fromParam);
  const [to, setTo] = useState(toParam);
  const [date, setDate] = useState(dateParam);

  // Filter States
  const [acFilter, setAcFilter] = useState("ALL");
  const [seatType, setSeatType] = useState("ALL");
  const [pickupTimeFilter, setPickupTimeFilter] = useState("ALL");
  const [dropTimeFilter, setDropTimeFilter] = useState("ALL");
  const [passengerCount, setPassengerCount] = useState(noOfSeatsParam);
  const [selectedPickupPoints, setSelectedPickupPoints] = useState([]);
  const [selectedDropPoints, setSelectedDropPoints] = useState([]);
  const [selectedOperators, setSelectedOperators] = useState([]);
  
  // Single State of Truth for Raw Data
  const [allBuses, setAllBuses] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("Relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const getStorageKey = (searchFrom, searchTo, searchDate) => {
    return `bus_search_${(searchFrom || from).trim()}_${(searchTo || to).trim()}_${(searchDate || date)}`;
  };

  const getTimeMinutes = (timeValue) => {
    if (!timeValue) return null;
    const [hours, minutes] = String(timeValue).split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours * 60 + minutes;
  };

  const matchesTimeRange = (timeValue, rangeLabel) => {
    if (rangeLabel === "ALL") return true;
    const minutes = getTimeMinutes(timeValue);
    if (minutes === null) return false;

    const ranges = {
      "12 AM - 6AM": [0, 360],
      "6 AM - 12 PM": [360, 720],
      "12 PM - 6 PM": [720, 1080],
      "6 PM - 12 AM": [1080, 1440],
    };

    const [start, end] = ranges[rangeLabel] || [0, 1440];
    return minutes >= start && minutes < end;
  };

  // 1. Unified Declarative Filter Logic
  const filteredBuses = useMemo(() => {
    let results = [...allBuses];

    // AC Filter
    if (acFilter === "AC") {
      results = results.filter((schedule) => schedule.bus?.isAC === true || schedule.bus?.isAC === "true");
    } else if (acFilter === "NON-AC") {
      results = results.filter((schedule) => schedule.bus?.isAC === false || schedule.bus?.isAC === "false");
    }

    // Seat Type Filter
    if (seatType === "SEATER") {
      results = results.filter((schedule) => schedule.bus?.type?.toLowerCase().includes("seater"));
    } else if (seatType === "SLEEPER") {
      results = results.filter((schedule) => schedule.bus?.type?.toLowerCase().includes("sleeper"));
    }

    // Pickup & Drop Time Filter
    if (pickupTimeFilter !== "ALL") {
      results = results.filter((schedule) => matchesTimeRange(schedule.journey?.departureTime, pickupTimeFilter));
    }
    if (dropTimeFilter !== "ALL") {
      results = results.filter((schedule) => matchesTimeRange(schedule.journey?.arrivalTime, dropTimeFilter));
    }

    // Boarding, Dropping & Operators Filter
    if (selectedPickupPoints.length > 0) {
      results = results.filter((schedule) =>
        Array.isArray(schedule.boardingPoints) &&
        schedule.boardingPoints.some((bp) => selectedPickupPoints.includes(bp.name))
      );
    }
    if (selectedDropPoints.length > 0) {
      results = results.filter((schedule) =>
        Array.isArray(schedule.droppingPoints) &&
        schedule.droppingPoints.some((dp) => selectedDropPoints.includes(dp.name))
      );
    }
    if (selectedOperators.length > 0) {
      results = results.filter((schedule) => selectedOperators.includes(schedule.operator?.name));
    }

    // Seat Availability Filter
    if (passengerCount && passengerCount !== "ANY" && passengerCount !== "") {
      const required = parseInt(passengerCount, 10);
      if (!isNaN(required) && required >= 1) {
        results = results.filter((schedule) => (schedule.seats?.available ?? 0) >= required);
      }
    }

    return results;
  }, [allBuses, acFilter, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, selectedDropPoints, selectedOperators, passengerCount]);

  // 2. Sorting applied on top of filtered results
  const sortedAndFilteredBuses = useMemo(() => {
    const sorted = [...filteredBuses];
    if (sortBy === "Rating") {
      sorted.sort((a, b) => (b.bus?.rating || 0) - (a.bus?.rating || 0));
    } else if (sortBy === "Price") {
      sorted.sort((a, b) => (a.pricing?.calculatedFare || a.pricing?.baseFare) - (b.pricing?.calculatedFare || b.pricing?.baseFare));
    } else if (sortBy === "Fastest") {
      sorted.sort((a, b) => {
        const durationA = getTimeMinutes(a.journey?.arrivalTime) - getTimeMinutes(a.journey?.departureTime);
        const durationB = getTimeMinutes(b.journey?.arrivalTime) - getTimeMinutes(b.journey?.departureTime);
        return durationA - durationB;
      });
    } else if (sortBy === "Departure") {
      sorted.sort((a, b) => a.journey?.departureTime.localeCompare(b.journey?.departureTime));
    } else if (sortBy === "Arrival") {
      sorted.sort((a, b) => a.journey?.arrivalTime.localeCompare(b.journey?.arrivalTime));
    }
    return sorted;
  }, [filteredBuses, sortBy]);

  // Fetch logic simply sets raw data
  const handleFetchBus = async (selectedDate = date) => {
    const storageKey = getStorageKey(from, to, selectedDate);
    const cachedData = sessionStorage.getItem(storageKey);

    if (cachedData) {
      setAllBuses(JSON.parse(cachedData));
      return;
    }

    setLoading(true);
    try {
      const params = { from, to, date: selectedDate };
      const res = await api.get("/api/v1/buses/search", { params });
      const allResults = res?.data?.data || [];
      sessionStorage.setItem(storageKey, JSON.stringify(allResults));
      setAllBuses(allResults);
    } catch (err) {
      console.error(err);
      setAllBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    handleFetchBus(selectedDate);
  };

  const handleNextDaySearch = () => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const formattedDate = nextDate.toISOString().slice(0, 10);
    handleDateSelect(formattedDate);
  };

  const handleClearFilters = (e) => {
    if (e) e.preventDefault();
    setAcFilter("ALL");
    setSeatType("ALL");
    setPickupTimeFilter("ALL");
    setDropTimeFilter("ALL");
    setPassengerCount("1");
    setSelectedPickupPoints([]);
    setSelectedDropPoints([]);
    setSelectedOperators([]);
  };

  // Clean mount initial fetch
  useEffect(() => {
    const fetchInitial = async () => {
      const storageKey = getStorageKey(from, to, date);
      const cachedData = sessionStorage.getItem(storageKey);

      if (cachedData) {
        setAllBuses(JSON.parse(cachedData));
        return;
      }

      setLoading(true);
      try {
        const res = await api.get("/api/v1/buses/search", {
          params: { from, to, date },
        });
        const allResults = res?.data?.data || [];
        sessionStorage.setItem(storageKey, JSON.stringify(allResults));
        setAllBuses(allResults);
      } catch (err) {
        console.error(err);
        setAllBuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  const pickupPointOptions = useMemo(
    () => Array.from(new Set(allBuses.flatMap((schedule) => (schedule.boardingPoints || []).map((point) => point.name)))),
    [allBuses]
  );

  const dropPointOptions = useMemo(
    () => Array.from(new Set(allBuses.flatMap((schedule) => (schedule.droppingPoints || []).map((point) => point.name)))),
    [allBuses]
  );

  const operatorOptions = useMemo(
    () => Array.from(new Set(allBuses.map((schedule) => schedule.operator?.name).filter(Boolean))),
    [allBuses]
  );

  const hasBuses = sortedAndFilteredBuses.length > 0;

  return (
    <>
      <Nav />
      <div className="pt-16 md:pt-20">
        <WhereToWhere
          className="shadow-xl sticky top-16 md:top-20 mx-0 md:mx-10"
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
          date={date}
          setDate={setDate}
          handleFetchBus={() => handleFetchBus(date)}
          passengerCount={passengerCount}
          onPassengerCountChange={setPassengerCount}
        />
        
        {/* Mobile Filter Toggle Button */}
        {!loading && allBuses.length > 0 && (
          <div className="lg:hidden px-2 sm:px-4 mt-4 mb-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/30 px-4 py-3 flex items-center justify-between font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </span>
              <svg className={`w-5 h-5 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        <div className="bg-slate-50 dark:bg-slate-900 pt-4 h-auto my-4 md:my-5 mx-2 sm:mx-4 md:mx-[100px] flex flex-col lg:flex-row">
            
            {/* LEFT FILTER PANEL */}
            {!loading && allBuses.length > 0 && (
              <div 
                className={`filter bg-white dark:bg-slate-800 w-full lg:w-[25%] h-auto rounded-lg shadow-xl dark:shadow-slate-900/30 ${showMobileFilters ? 'block' : 'hidden lg:block'} sticky top-16 lg:top-20 max-h-[calc(100vh-80px)] overflow-y-auto`}
              >
                  <div className="flex justify-center mt-5 font-bold text-slate-800 dark:text-slate-200">FILTERS</div>
                  <SelectBox
                    title={"AC type"}
                    text={['ALL', 'AC', 'NON-AC']}
                    value={acFilter}
                    onChange={setAcFilter}
                  />
                  <SelectBox
                    title="Seat type"
                    text={["ALL", "SEATER", "SLEEPER"]}
                    value={seatType}
                    onChange={setSeatType}
                  />
                  <SelectBox
                    text={["ALL", "12 AM - 6AM", "6 AM - 12 PM", "12 PM - 6 PM", "6 PM - 12 AM"]}
                    title="Pick up time"
                    value={pickupTimeFilter}
                    onChange={setPickupTimeFilter}
                  />
                  <SelectBox
                    text={["ALL", "12 AM - 6AM", "6 AM - 12 PM", "12 PM - 6 PM", "6 PM - 12 AM"]}
                    title="Drop time"
                    value={dropTimeFilter}
                    onChange={setDropTimeFilter}
                  />
                  <Checkbox title={"Single Seater/Sleeper"} text={"Single Seats"} />
                  <SearchheckBox
                    title={`Pick up point - ${from || "Source"}`}
                    text={pickupPointOptions}
                    selectedPoints={selectedPickupPoints}
                    onChange={setSelectedPickupPoints}
                    onClear={() => setSelectedPickupPoints([])}
                  />
                  <SearchheckBox
                    title={"Operators"}
                    text={operatorOptions}
                    selectedPoints={selectedOperators}
                    onChange={setSelectedOperators}
                    onClear={() => setSelectedOperators([])}
                  />
                  <SearchheckBox
                    title={`Drop point - ${to || "Destination"}`}
                    text={dropPointOptions}
                    selectedPoints={selectedDropPoints}
                    onChange={setSelectedDropPoints}
                    onClear={() => setSelectedDropPoints([])}
                  />
                  <div className="lg:hidden px-4 py-4">
                    <button type="button" onClick={() => setShowMobileFilters(false)} className="w-full bg-lime-600 text-white py-3 rounded-lg font-medium hover:bg-lime-700 transition-colors">
                      Apply Filters
                    </button>
                  </div>
              </div>
            )}

            {/* RIGHT MAIN LAYOUT WRAPPER */}
            <div className={`w-full ${allBuses.length > 0 && !loading ? 'lg:w-[80%] lg:ml-[2%]' : 'lg:w-full'} px-2 sm:px-3 md:px-5 flex flex-col`}>
                
                {/* BUS FILTER SUB-HEADER SLIDER BAR */}
                {allBuses.length > 0 && !loading && (
                  <div className="bg-white dark:bg-slate-800 w-full h-auto my-5 rounded-3xl shadow-xl dark:shadow-slate-900/30">
                      <BusFillterBar
                        NoOfBus={sortedAndFilteredBuses.length}
                        selectedDate={date}
                        onDateSelect={handleDateSelect}
                        selectedSort={sortBy}
                        onSortSelect={setSortBy}
                      />
                  </div>
                )}

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8 md:py-20">
                    <div className="relative p-4 md:p-12 rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 shadow-2xl">
                      <div className="relative w-16 h-16 md:w-32 md:h-32 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-slate-600 border-t-blue-600 dark:border-t-lime-500 animate-spin"></div>
                      </div>
                      <div className="mt-4 md:mt-10 text-center">
                        <h3 className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-lime-400 dark:to-teal-400 bg-clip-text text-transparent mb-1">
                          Finding Best Bus Routes
                        </h3>
                        <p className="text-gray-600 dark:text-slate-400 font-medium text-xs md:text-lg">Searching for available buses...</p>
                      </div>
                    </div>
                  </div>
                ) : hasBuses ? (
                  /* CARD RENDER GRID LAYOUT */
                  sortedAndFilteredBuses.map((schedule) => (
                    <div key={schedule.scheduleId} className="bg-white dark:bg-slate-800 w-full h-auto mb-3 rounded-3xl shadow-xl dark:shadow-slate-900/30">
                      <BusCard
                        busName={schedule.bus?.name}
                        busType={schedule.bus?.type}
                        departureTime={schedule.journey?.departureTime}
                        arrivalTime={schedule.journey?.arrivalTime}
                        travelDuration={schedule.journey?.durationMinutes}
                        availableSeats={schedule.seats?.available}
                        calculatedFare={schedule.pricing?.calculatedFare}
                        operatorName={schedule.operator?.name}
                        averageRating={schedule.bus?.rating}
                        totalRatings={0}
                        amenities={schedule.bus?.amenities}
                        scheduleId={schedule.scheduleId}
                        boardingPoints={schedule.boardingPoints}
                        droppingPoints={schedule.droppingPoints}
                      />
                    </div>
                  ))
                ) : (
                  /* HIGHLY INTERACTIVE NO BUSES FOUND EMPTY STATE SCREEN */
                  <div className="max-w-xl mx-auto my-12 w-full px-4">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center shadow-md dark:shadow-slate-900/30">
                      <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-amber-100 dark:border-amber-800">
                        <AlertCircle size={32} className="text-amber-500" />
                      </div>
                      
                      <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">
                        No Buses Available
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                        We couldn't locate any direct bus schedules running between <span className="font-extrabold text-slate-700 dark:text-slate-200">{from || "your origin"}</span> and <span className="font-extrabold text-slate-700 dark:text-slate-200">{to || "your destination"}</span> on this date.
                      </p>

                      {/* Dynamic Strategy Tips */}
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-left border border-slate-100 dark:border-slate-600 mb-6 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 font-medium">
                        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-1">Suggested Solutions:</h4>
                        <p>• If you applied active filtering sidebar checkboxes, try wiping them clean.</p>
                        <p>• Schedules vary significantly by day; consider looking at the next calendar day.</p>
                      </div>

                      {/* Interactive Trigger Control Layout Track */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button 
                          type="button"
                          onClick={(e) => { e.preventDefault(); navigate("/mainpage"); }}
                          className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm px-4 py-3 rounded-xl shadow-xs transition-all"
                        >
                          Main Page                        
                        </button>
                        <button 
                          type="button"
                          onClick={handleClearFilters}
                          className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm px-4 py-3 rounded-xl transition-all"
                        >
                          <RefreshCw size={14} />
                          Reset Filters
                        </button>
                        <button 
                          type="button"
                          onClick={handleNextDaySearch}
                          className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm px-4 py-3 rounded-xl shadow-xs transition-all"
                        >
                          <CalendarDays size={14} />
                          Check Next Day
                        </button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
}