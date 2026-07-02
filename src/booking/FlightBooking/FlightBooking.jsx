import Nav from "../../NavComponent.jsx"
import WhereToWhere from "./Wheretowhere.jsx"
import FlightCard from "../../cards/FlightCard.jsx"
import FlightFareSelector from "./FlightFareSelector.jsx"

import SearchheckBox from "../../filter/SearchheckBox.jsx"
import SelectBox from "../../filter/SelectBox.jsx"
import Checkbox from "../../filter/Checkbox.jsx"
import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../../api/axios.js"


export default function FlightBooking(){

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
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("price_low");
  const [filters, setFilters] = useState({
    aircraftType: "",
    hasBusinessClass: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleFetchFlights = async (searchFrom, searchTo, searchDate) => {
    // Use passed values or fall back to state
    const fromVal = searchFrom || from;
    const toVal = searchTo || to;
    const dateVal = searchDate || date;

    if (!fromVal || !toVal || !dateVal) {
      console.warn("Missing required search parameters", { fromVal, toVal, dateVal });
      return;
    }

    setLoading(true);
    try {
      const params = { from: fromVal, to: toVal, date: dateVal };
      
      // Add optional filters
      if (filters.aircraftType) params.aircraftType = filters.aircraftType;
      if (filters.hasBusinessClass) params.hasBusinessClass = filters.hasBusinessClass;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get("/api/v1/flights/search", { params });
      console.log("Flight search params:", params);
      const flightData = res?.data?.data || [];
      console.log("Flight search results:", flightData);
      setFlights(flightData);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
  };

  useEffect(() => {
    handleFetchFlights();
  }, []);

  useEffect(() => {
    if (from && to && date) {
      handleFetchFlights();
    }
  }, [sortBy, filters]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Get unique airlines for filter
  const airlineOptions = useMemo(() => {
    return Array.from(new Set(flights.map(f => f.flight?.airlineName || f.operator?.name).filter(Boolean)));
  }, [flights]);

  // Get unique aircraft types for filter
  const aircraftTypeOptions = useMemo(() => {
    return Array.from(new Set(flights.map(f => f.flight?.aircraftType || f.aircraft?.type).filter(Boolean)));
  }, [flights]);

  // Get price range
  const priceRange = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 0 };
    const prices = flights.map(f => f.pricing?.calculatedFare || f.pricing?.baseFare || 0);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [flights]);
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
        <div className="bg-mist-50 h-auto my-5 mx-[100px] flex">
                <div className = "filter bg-white-200 w-[25%] h-auto rounded-lg shadow-xl">
                    <div className = "flex justify-center mt-5 font-bold">FILTERS</div>
                  
                    <SelectBox
                      text={["", "AIRBUS_A320", "AIRBUS_A321", "BOEING_737", "BOEING_777", "BOEING_787", "ATR_72", "EMBRAER_E175"]}
                      title="Aircraft Type"
                      value={filters.aircraftType}
                      onChange={(option) => handleFilterChange("aircraftType", option)}
                    />
                    <SelectBox
                      text={["", "true", "false"]}
                      title="Business Class"
                      value={filters.hasBusinessClass}
                      onChange={(option) => handleFilterChange("hasBusinessClass", option)}
                    />
                    <Checkbox title="Price Range" text={`₹${priceRange.min} - ₹${priceRange.max}`} />
                    <SearchheckBox
                      title="Airlines"
                      text={airlineOptions}
                      selectedPoints={[]}
                      onChange={() => {}}
                      onClear={() => {}}
                    />
                    <SearchheckBox
                      title="Aircraft Size"
                      text={aircraftTypeOptions}
                      selectedPoints={[]}
                      onChange={() => {}}
                      onClear={() => {}}
                    />
                </div>
                <div className = "bg-neutral-200 w-[80%] ml-[2%] px-5 rounded-lg shadow-xl flex flex-col">
                    <div className = "bg-white w-full h-auto my-5 rounded-3xl shadow-xl">
                        <FlightFareSelector sortBy={sortBy} onSortChange={handleSortChange} />
                    </div>
                    {loading ? (
                      <div className="p-8 text-center text-gray-600">Loading flights...</div>
                    ) : Array.isArray(flights) && flights.length > 0 ? (
                      flights.map((flight) => (
                        <div key={flight.scheduleId || flight.id || flight.flightNumber} className="bg-white w-full h-auto mb-3 rounded-3xl shadow-xl">
                         <FlightCard flight={flight} />
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-600">No flights found for the selected route and date.</div>
                    )}
                </div>
            </div>
        </div>
      </>
  );
}
