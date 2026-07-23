import Nav from "../../NavComponent.jsx"
import WhereToWhere from "./Wheretowhere.jsx"
import SelectedFlightsSidebar from "../../cards/SelectedFlightsSidebar.jsx"
import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../../api/axios.js"

import FlightFilterPanel from "./components/FlightFilterPanel.jsx"
import FlightResultsList from "./components/FlightResultsList.jsx"
import MobileFilterButton from "./components/MobileFilterButton.jsx"

export default function FlightBooking(){
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const serviceType = location.state?.serviceType || "flight";
  const searchData = location.state?.searchData || {};

  const fromParam = searchParams.get('from') || searchData.from || "";
  const toParam = searchParams.get('to') || searchData.to || "";
  const dateParam = searchParams.get('date') || searchParams.get('departure') || searchData.date || (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const [from, setFrom] = useState(fromParam);
  const [to, setTo] = useState(toParam);
  const [date, setDate] = useState(dateParam);
  const [, setHasSearched] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);

  const [flights, setFlights] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("Relevance");
  const [filters, setFilters] = useState({
    aircraftType: "", cabinClass: "", minPrice: "", maxPrice: "", airlines: [], passengerCount: "1",
  });
  const [comparedFlights, setComparedFlights] = useState([]);
  const [showCompareSidebar, setShowCompareSidebar] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const applyFilters = (data, currentFilters = filters) => {
    let filteredData = [...data];
    if (currentFilters.aircraftType && currentFilters.aircraftType !== "ANY") {
      filteredData = filteredData.filter(flight =>
        (flight.flight?.aircraftType || flight.aircraft?.type) === currentFilters.aircraftType
      );
    }
    if (currentFilters.cabinClass && currentFilters.cabinClass !== "ANY") {
      filteredData = filteredData.filter(flight => {
        const directClass = flight.cabin?.class || flight.cabinClass;
        if (directClass === currentFilters.cabinClass) return true;
        const cabinClasses = flight.flight?.cabinClasses || flight.cabinClasses;
        if (Array.isArray(cabinClasses) && cabinClasses.includes(currentFilters.cabinClass)) return true;
        return false;
      });
    }
    if (!(currentFilters.minPrice && currentFilters.maxPrice && Number(currentFilters.minPrice) > Number(currentFilters.maxPrice))) {
      if (currentFilters.minPrice) {
        const min = Number(currentFilters.minPrice);
        if (min >= 0) filteredData = filteredData.filter(flight =>
          (flight.pricing?.calculatedFare || flight.pricing?.baseFare || 0) >= min
        );
      }
      if (currentFilters.maxPrice) {
        const max = Number(currentFilters.maxPrice);
        if (max >= 0) filteredData = filteredData.filter(flight =>
          (flight.pricing?.calculatedFare || flight.pricing?.baseFare || 0) <= max
        );
      }
    }
    if (currentFilters.airlines.length > 0) {
      filteredData = filteredData.filter(flight =>
        currentFilters.airlines.includes(flight.flight?.airlineName || flight.operator?.name)
      );
    }
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

  const applySorting = (data, sortOption = sortBy) => {
    const sorted = [...data];
    switch (sortOption) {
      case "Price":
        sorted.sort((a, b) => (a.pricing?.calculatedFare || a.pricing?.baseFare || 0) - (b.pricing?.calculatedFare || b.pricing?.baseFare || 0));
        break;
      case "Fastest":
        sorted.sort((a, b) => (a.journey?.durationMinutes || 0) - (b.journey?.durationMinutes || 0));
        break;
      case "Departure":
        sorted.sort((a, b) => (a.journey?.departureTime || "").localeCompare(b.journey?.departureTime || ""));
        break;
      case "Arrival":
        sorted.sort((a, b) => (a.journey?.arrivalTime || "").localeCompare(b.journey?.arrivalTime || ""));
        break;
      case "Rating":
        sorted.sort((a, b) => (b.flight?.rating || b.rating || 0) - (a.flight?.rating || a.rating || 0));
        break;
      default: break;
    }
    return sorted;
  };

  const handleFetchFlights = async (searchFrom, searchTo, searchDate) => {
    const fromVal = searchFrom || from;
    const toVal = searchTo || to;
    const dateVal = searchDate || date;
    if (!fromVal || !toVal || !dateVal) { console.warn("Missing required search parameters", { fromVal, toVal, dateVal }); return; }
    setHasSearched(true);
    setLoading(true);
    try {
      const params = { from: fromVal, to: toVal, date: dateVal };
      if (filters.aircraftType) params.aircraftType = filters.aircraftType;
      if (filters.cabinClass) params.cabinClass = filters.cabinClass;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      const res = await api.get("/api/v1/flights/search", { params });
      const flightData = res?.data?.data || [];
      setAllFlights(flightData);
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

  useEffect(() => {
    const looksLikeIata = (v) => /^[A-Z]{3}$/.test(v || '');
    if (from && to && date && looksLikeIata(from) && looksLikeIata(to)) handleFetchFlights();
  }, []);

  useEffect(() => {
    const looksLikeIata = (v) => /^[A-Z]{3}$/.test(v || '');
    if (from && to && date && looksLikeIata(from) && looksLikeIata(to)) handleFetchFlights();
  }, [from, to, date]);

  useEffect(() => {
    if (searchTrigger > 0 && from && to && date) handleFetchFlights();
  }, [searchTrigger]);

  useEffect(() => {
    if (allFlights.length > 0) {
      const filtered = applyFilters(allFlights);
      const sorted = applySorting(filtered);
      setFlights(sorted);
    }
  }, [sortBy, filters]);

  const handleSortChange = (newSortBy) => { setSortBy(newSortBy); };

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'minPrice' || filterName === 'maxPrice') {
      if (typeof value === 'string') value = value.replace(/\D/g, '');
    }
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const MAX_COMPARE = 4;

  const priceRange = useMemo(() => {
    if (allFlights.length === 0) return { min: 0, max: 0 };
    const prices = allFlights.map(f => f.pricing?.calculatedFare || f.pricing?.baseFare || 0);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [allFlights]);

  const priceMsg = useMemo(() => {
    const min = Number(filters.minPrice);
    const max = Number(filters.maxPrice);
    if (filters.minPrice && filters.maxPrice && min > max) return "Min price cannot be greater than max price";
    if (filters.minPrice && priceRange.min > 0 && min < priceRange.min) return `Min price cannot be less than ${priceRange.min}`;
    if (filters.maxPrice && priceRange.max > 0 && max > priceRange.max) return `Max price cannot be greater than ${priceRange.max}`;
    if (priceRange.min > 0 && !filters.minPrice && !filters.maxPrice) return `Range: ${priceRange.min} - ${priceRange.max}`;
    return "";
  }, [filters.minPrice, filters.maxPrice, priceRange]);

  const handleMinPriceBlur = () => {
    setFilters(prev => {
      if (!prev.minPrice) return prev;
      let min = Number(prev.minPrice);
      if (isNaN(min) || min < 0) min = 0;
      const max = prev.maxPrice ? Number(prev.maxPrice) : priceRange.max;
      if (min > max) min = max;
      return { ...prev, minPrice: String(min) };
    });
  };

  const handleMaxPriceBlur = () => {
    setFilters(prev => {
      if (!prev.maxPrice) return prev;
      let max = Number(prev.maxPrice);
      if (isNaN(max) || max < 0) max = 0;
      const min = prev.minPrice ? Number(prev.minPrice) : 0;
      if (max < min) max = min;
      if (max > priceRange.max) max = priceRange.max;
      return { ...prev, maxPrice: String(max) };
    });
  };

  const getFlightId = (f) => f.scheduleId || f._id || f.id;

  const handleAddToCompare = (flight) => {
    const fid = getFlightId(flight);
    if (comparedFlights.find(f => getFlightId(f) === fid)) return;
    if (comparedFlights.length >= MAX_COMPARE) {
      alert(`You can compare up to ${MAX_COMPARE} flights at a time. Remove one first.`);
      return;
    }
    setComparedFlights(prev => [...prev, flight]);
    setShowCompareSidebar(true);
  };

  const handleRemoveFromCompare = (flight) => {
    const fid = getFlightId(flight);
    const updated = comparedFlights.filter(f => getFlightId(f) !== fid);
    setComparedFlights(updated);
    if (updated.length === 0) setShowCompareSidebar(false);
  };

  const isFlightCompared = (flight) => comparedFlights.some(f => getFlightId(f) === getFlightId(flight));

  const openCompareSidebar = () => setShowCompareSidebar(true);
  const handleClearAllCompare = () => { setComparedFlights([]); setShowCompareSidebar(false); };

  const airlineOptions = useMemo(() => {
    return Array.from(new Set(allFlights.map(f => f.flight?.airlineName || f.operator?.name).filter(Boolean)));
  }, [allFlights]);

  const cabinClassOptions = useMemo(() => {
    const classes = new Set();
    allFlights.forEach(f => {
      if (f.flight?.cabinClasses && Array.isArray(f.flight.cabinClasses)) {
        f.flight.cabinClasses.forEach(c => classes.add(c));
      }
    });
    return Array.from(classes);
  }, [allFlights]);

  const handleResetFilters = () => {
    setFilters({ aircraftType: "", cabinClass: "", minPrice: "", maxPrice: "", airlines: [], passengerCount: "1" });
  };

  return (
    <>
      <Nav />
      <div className="pt-16">
        <WhereToWhere
          className="shadow-xl sticky top-20 z-10"
          from={from} to={to} date={date}
          onFromChange={setFrom} onToChange={setTo} onDateChange={setDate}
          searchData={searchData}
          onSearch={() => setSearchTrigger(prev => prev + 1)}
          serviceType={serviceType}
        />
        <SelectedFlightsSidebar
          comparedFlights={comparedFlights}
          show={showCompareSidebar}
          onClose={() => setShowCompareSidebar(false)}
          onRemoveFromCompare={handleRemoveFromCompare}
          onClearAll={handleClearAllCompare}
        />
        <MobileFilterButton
          showMobileFilters={showMobileFilters}
          onToggle={() => setShowMobileFilters(!showMobileFilters)}
          visible={allFlights.length > 0 && !loading}
        />
        <div className="bg-slate-50 dark:bg-slate-900 h-auto my-4 md:my-5 mx-2 sm:mx-4 md:mx-[100px] flex flex-col lg:flex-row">
          <FlightFilterPanel
            filters={filters}
            cabinClassOptions={cabinClassOptions}
            airlineOptions={airlineOptions}
            priceMsg={priceMsg}
            onFilterChange={handleFilterChange}
            onMinPriceBlur={handleMinPriceBlur}
            onMaxPriceBlur={handleMaxPriceBlur}
            onResetFilters={handleResetFilters}
            showMobileFilters={showMobileFilters}
          />
          <FlightResultsList
            loading={loading}
            flights={flights}
            date={date}
            sortBy={sortBy}
            onDateSelect={(newDate) => { setDate(newDate); handleFetchFlights(from, to, newDate); }}
            onSortSelect={handleSortChange}
            onAddToCompare={handleAddToCompare}
            onRemoveFromCompare={handleRemoveFromCompare}
            isFlightCompared={isFlightCompared}
            openCompareSidebar={openCompareSidebar}
          />
        </div>
      </div>
    </>
  );
}
