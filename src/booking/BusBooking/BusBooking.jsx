import Nav from "../../NavComponent.jsx"
import WhereToWhere from "../../search/WhereToWhere.jsx"
import BusCard from "../../cards/BusCard.jsx"
import BusFillterBar from "../../filter/BusFillterBar.jsx"

import SearchheckBox from "../../filter/SearchheckBox.jsx"
import SelectBox from "../../filter/SelectBox.jsx"
import Checkbox from "../../filter/Checkbox.jsx"
import { Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios.js";



export default function BusBooking(){

  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || "";
  const dateParam = searchParams.get("date") || (() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  })();
  
  const [from, setFrom] = useState(fromParam);
  const [to, setTo] = useState(toParam);
  const [date, setDate] = useState(dateParam);
  const [acFilter, setAcFilter] = useState("ALL");
  const [seatType, setSeatType] = useState("ALL");
  const [pickupTimeFilter, setPickupTimeFilter] = useState("ALL");
  const [dropTimeFilter, setDropTimeFilter] = useState("ALL");
  const [selectedPickupPoints, setSelectedPickupPoints] = useState([]);
  const [selectedDropPoints, setSelectedDropPoints] = useState([]);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("Relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const handleFetchBus = async (
    selectedAc = acFilter,
    selectedSeatType = seatType,
    selectedPickupTime = pickupTimeFilter,
    selectedDropTime = dropTimeFilter,
    selectedBoardingPoints = selectedPickupPoints,
    selectedDroppingPoints = selectedDropPoints,
    selectedOperatorNames = selectedOperators,
    selectedDate = date
  ) => {
    setLoading(true);
    try {
      const params = { from, to, date: selectedDate };
      if (selectedAc === "AC") params.isAC = "true";
      if (selectedAc === "NON-AC") params.isAC = "false";

      const res = await api.get("/api/v1/buses/search", { params });
      let results = res?.data?.data || [];
      let noofbus = res?.data?.count;

      if (selectedSeatType === "seater") {
        results = results.filter((schedule) =>
          schedule.bus?.type?.toLowerCase().includes("seater")
        );
      } else if (selectedSeatType === "sleeper") {
        results = results.filter((schedule) =>
          schedule.bus?.type?.toLowerCase().includes("sleeper")
        );
      }

      if (selectedPickupTime !== "ALL") {
        results = results.filter((schedule) =>
          matchesTimeRange(schedule.journey?.departureTime, selectedPickupTime)
        );
      }

      if (selectedDropTime !== "ALL") {
        results = results.filter((schedule) =>
          matchesTimeRange(schedule.journey?.arrivalTime, selectedDropTime)
        );
      }

      if (Array.isArray(selectedBoardingPoints) && selectedBoardingPoints.length > 0) {
        results = results.filter((schedule) =>
          Array.isArray(schedule.boardingPoints) &&
          schedule.boardingPoints.some((bp) => selectedBoardingPoints.includes(bp.name))
        );
      }

      if (Array.isArray(selectedDroppingPoints) && selectedDroppingPoints.length > 0) {
        results = results.filter((schedule) =>
          Array.isArray(schedule.droppingPoints) &&
          schedule.droppingPoints.some((dp) => selectedDroppingPoints.includes(dp.name))
        );
      }

      if (Array.isArray(selectedOperatorNames) && selectedOperatorNames.length > 0) {
        results = results.filter((schedule) =>
          selectedOperatorNames.includes(schedule.operator?.name)
        );
      }

      setBuses(results);
    } catch (err) {
      console.error(err);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    handleFetchBus(
      acFilter,
      seatType,
      pickupTimeFilter,
      dropTimeFilter,
      selectedPickupPoints,
      selectedDropPoints,
      selectedOperators,
      selectedDate
    );
  };

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/v1/buses/search", {
          params: { from, to, date },
        });
        setBuses(res?.data?.data || []);
      } catch (err) {
        console.error(err);
        setBuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickupPointOptions = useMemo(
    () =>
      Array.from(
        new Set(
          buses.flatMap((schedule) =>
            (schedule.boardingPoints || []).map((point) => point.name)
          )
        )
      ),
    [buses]
  );

  const dropPointOptions = useMemo(
    () =>
      Array.from(
        new Set(
          buses.flatMap((schedule) =>
            (schedule.droppingPoints || []).map((point) => point.name)
          )
        )
      ),
    [buses]
  );

  const operatorOptions = useMemo(
    () =>
      Array.from(
        new Set(
          buses
            .map((schedule) => schedule.operator?.name)
            .filter(Boolean)
        )
      ),
    [buses]
  );

  const sortedBuses = useMemo(() => {
    const sorted = [...buses];

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
  }, [buses, sortBy]);

  const handleSortSelect = (option) => {
    setSortBy(option);
  };

  console.log(buses);
  return (
    <>
      <Nav />
      <div className="pt-20">
        <WhereToWhere
          className="shadow-xl sticky top-20 mx-4 md:mx-10"
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
          date={date}
          setDate={setDate}
          handleFetchBus={handleFetchBus}
        />
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden px-4 mt-4 mb-2">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full bg-white rounded-lg shadow-md px-4 py-3 flex items-center justify-between font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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

        <div className="bg-mist-50 pt-20 h-auto my-5 mx-4 md:mx-[100px] flex flex-col lg:flex-row">
                <div className={`filter bg-white-200 w-full lg:w-[25%] h-auto rounded-lg shadow-xl ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className = "flex justify-center mt-5 font-bold">FILTERS</div>
                    <SelectBox
                      title={"AC type"}
                      text={['ALL', 'AC', 'NON-AC']}
                      value={acFilter}
                      onChange={(option) => {
                        setAcFilter(option);
                        handleFetchBus(option, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, selectedDropPoints);
                      }}
                    />
                    <SelectBox
                      title ="Seat type"
                      text = {["ALL", "seater", "sleeper"]}
                      value={seatType}
                      onChange={(option) => {
                        setSeatType(option);
                        handleFetchBus(acFilter, option, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, selectedDropPoints);
                      }}
                    />
                    <SelectBox
                      text={["ALL", "12 AM - 6AM", "6 AM - 12 PM", "12 PM - 6 PM", "6 PM - 12 AM"]}
                      title = {"Pick up time - Hyderabad, Telangana"}
                      value={pickupTimeFilter}
                      onChange={(option) => {
                        setPickupTimeFilter(option);
                        handleFetchBus(acFilter, seatType, option, dropTimeFilter, selectedPickupPoints, selectedDropPoints);
                      }}
                    />
                    <SelectBox
                      text={["ALL", "12 AM - 6AM", "6 AM - 12 PM", "12 PM - 6 PM", "6 PM - 12 AM"]}
                      title ="Drop time - Bangalore, Karnataka"
                      value={dropTimeFilter}
                      onChange={(option) => {
                        setDropTimeFilter(option);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, option, selectedPickupPoints, selectedDropPoints);
                      }}
                    />
                    <Checkbox title={"Single Seater/Sleeper"} text={"Single Seats"} />
                    <SearchheckBox
                      title={`Pick up point - ${from || "Source"}`}
                      text={pickupPointOptions}
                      selectedPoints={selectedPickupPoints}
                      onChange={(point) => {
                        const next = selectedPickupPoints.includes(point)
                          ? selectedPickupPoints.filter((name) => name !== point)
                          : [...selectedPickupPoints, point];
                        setSelectedPickupPoints(next);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, next, selectedDropPoints);
                      }}
                      onClear={() => {
                        setSelectedPickupPoints([]);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, [], selectedDropPoints);
                      }}
                    />
                    <SearchheckBox
                      title={"Operators"}
                      text={operatorOptions}
                      selectedPoints={selectedOperators}
                      onChange={(point) => {
                        const next = selectedOperators.includes(point)
                          ? selectedOperators.filter((name) => name !== point)
                          : [...selectedOperators, point];
                        setSelectedOperators(next);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, selectedDropPoints, next);
                      }}
                      onClear={() => {
                        setSelectedOperators([]);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, selectedDropPoints, []);
                      }}
                    />
                    <SearchheckBox
                      title={`Drop point - ${to || "Destination"}`}
                      text={dropPointOptions}
                      selectedPoints={selectedDropPoints}
                      onChange={(point) => {
                        const next = selectedDropPoints.includes(point)
                          ? selectedDropPoints.filter((name) => name !== point)
                          : [...selectedDropPoints, point];
                        setSelectedDropPoints(next);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, next, selectedOperators);
                      }}
                      onClear={() => {
                        setSelectedDropPoints([]);
                        handleFetchBus(acFilter, seatType, pickupTimeFilter, dropTimeFilter, selectedPickupPoints, [], selectedOperators);
                      }}
                    />
                    
                    {/* Mobile Apply Filters Button */}
                    <div className="lg:hidden px-4 py-4">
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="w-full bg-lime-600 text-white py-3 rounded-lg font-medium hover:bg-lime-700 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                </div>
                <div className = "bg-neutral-200 w-full lg:w-[80%] lg:ml-[2%] px-3 md:px-5 rounded-lg shadow-xl flex flex-col">
                    <div className = "bg-white w-full h-auto my-5 rounded-3xl shadow-xl">
                        <BusFillterBar
                          NoOfBus={sortedBuses.length}
                          selectedDate={date}
                          onDateSelect={handleDateSelect}
                          selectedSort={sortBy}
                          onSortSelect={handleSortSelect}
                        />
                    </div>
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-8 md:py-20">
                        {/* Animated gradient background card */}
                        <div className="relative p-6 md:p-12 rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-2xl">
                          {/* Multiple spinning rings with different speeds */}
                          <div className="relative w-20 h-20 md:w-32 md:h-32">
                            {/* Outer ring - slow spin */}
                            <div className="absolute inset-0 rounded-full border-3 md:border-4 border-blue-200 border-t-blue-600 border-r-transparent border-b-indigo-400 border-l-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
                            {/* Middle ring - reverse spin */}
                            <div className="absolute inset-1 md:inset-2 rounded-full border-2 md:border-3 border-indigo-200 border-b-indigo-600 border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                            {/* Inner ring - fast spin */}
                            <div className="absolute inset-2 md:inset-4 rounded-full border-2 border-blue-300 border-l-blue-600 border-r-transparent border-t-transparent border-b-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
                            {/* Center pulsing icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative">
                                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 animate-pulse shadow-lg shadow-blue-500/50"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-5 h-5 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Loading text with animation */}
                          <div className="mt-6 md:mt-10 text-center">
                            <h3 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 md:mb-3">
                              Finding Best Bus Routes
                            </h3>
                            <p className="text-gray-600 font-medium text-sm md:text-lg mb-4 md:mb-6">
                              Searching for available buses...
                            </p>

                            {/* Animated progress indicators */}
                            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }}></div>
                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '0.6s' }}></div>
                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.6s' }}></div>
                              </div>
                            </div>

                            {/* Shimmer effect text */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 rounded-full">
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs md:text-sm text-blue-700 font-medium">Please wait a moment</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : Array.isArray(sortedBuses) && sortedBuses.length > 0 ? (
                      sortedBuses.map((schedule) => (
                        <div key={schedule.scheduleId} className="bg-white w-full h-auto mb-3 rounded-3xl shadow-xl">
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
                      <div className="p-8 text-center text-gray-600">No buses found for the selected route and date.</div>
                    )}
                </div>
            </div>
        </div>
      </>
  );
}
