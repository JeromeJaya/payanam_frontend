import { useState, useRef, useEffect } from "react";
import { MapPin, Edit2, ChevronUp } from "lucide-react";
import api from "../api/axios";
import BusLocationInput from "./components/BusLocationInput";
import BusDatePassengerInput from "./components/BusDatePassengerInput";
import BusSearchButton from "./components/BusSearchButton";

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
  const [fromSelectedFromSuggestions, setFromSelectedFromSuggestions] = useState(Boolean(from));
  const [toSelectedFromSuggestions, setToSelectedFromSuggestions] = useState(Boolean(to));
  const [isMobileMaximized, setIsMobileMaximized] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const fromDebounceTimer = useRef(null);
  const toDebounceTimer = useRef(null);

  const swap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setFromSelectedFromSuggestions(toSelectedFromSuggestions);
    setToSelectedFromSuggestions(fromSelectedFromSuggestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = [];

    if (!from || from.trim() === "") {
      errors.push("Please enter a departure location");
    }
    if (!to || to.trim() === "") {
      errors.push("Please enter a destination location");
    }
    if (from && to && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      errors.push("Departure and destination cannot be the same");
    }
    if (date) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      if (date < todayStr) {
        errors.push("Travel date cannot be in the past");
      }
    }
    const currentPassengerCount = passengerCount ?? searchData?.NoOfSeats;
    if (currentPassengerCount !== undefined && currentPassengerCount !== "") {
      const pCount = parseInt(currentPassengerCount, 10);
      if (isNaN(pCount)) {
        errors.push("Please enter a valid number for passenger count");
      } else if (pCount < 1) {
        errors.push("Passenger count must be at least 1");
      } else if (pCount > 35) {
        errors.push("Maximum 35 passengers allowed per booking");
      }
    }

    if (errors.length > 0) {
      alert(errors[0]);
      return;
    }

    handleFetchBus(date);
    setIsMobileMaximized(false);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    handleFetchBus(newDate);
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
    setFromSelectedFromSuggestions(false);
    if (fromDebounceTimer.current) clearTimeout(fromDebounceTimer.current);
    const token = { ignore: false };
    fromDebounceTimer.current = setTimeout(() => {
      runQuery(value, 'from', token);
    }, 300);
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setTo(value);
    setToSelectedFromSuggestions(false);
    if (toDebounceTimer.current) clearTimeout(toDebounceTimer.current);
    const token = { ignore: false };
    toDebounceTimer.current = setTimeout(() => {
      runQuery(value, 'to', token);
    }, 300);
  };

  const selectFromSuggestion = () => {
    setShowFromSuggestions(false);
  };

  const selectToSuggestion = () => {
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

  const getFormattedDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const [year, month, day] = dateStr.split("-");
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mt-4 h-fit bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm z-50 transition-all duration-200">

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
                {getFormattedDate(date)} {(passengerCount || searchData?.NoOfSeats) ? `• ${passengerCount || searchData.NoOfSeats} Seats` : ''}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="w-7 h-7 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-xs ml-2 shrink-0"
          >
            <Edit2 size={12} className="text-sky-500" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`${isMobileMaximized ? "block animate-fadeIn" : "hidden md:block"} p-2 md:p-2`}
      >
        <div className="max-w-8xl mx-auto">
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
            <div className="flex-1 border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50/50 dark:bg-slate-900/50 relative">
              <BusLocationInput
                from={from}
                to={to}
                onFromChange={handleFromChange}
                onToChange={handleToChange}
                onSwap={swap}
                showFromSuggestions={showFromSuggestions}
                showToSuggestions={showToSuggestions}
                fromSuggestions={fromSuggestions}
                toSuggestions={toSuggestions}
                loadingFrom={loadingFrom}
                loadingTo={loadingTo}
                onSelectFrom={selectFromSuggestion}
                onSelectTo={selectToSuggestion}
                fromRef={fromRef}
                toRef={toRef}
              />

              <BusDatePassengerInput
                date={date}
                onDateChange={handleDateChange}
                passengerCount={passengerCount}
                onPassengerCountChange={onPassengerCountChange}
              />
            </div>

            <BusSearchButton
              passengerCount={passengerCount}
              searchData={searchData}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
