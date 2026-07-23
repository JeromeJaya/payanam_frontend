import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import { allDestinations } from './data/searchData';
import SearchInputField from "./components/SearchInputField.jsx";
import SearchActionButtons from "./components/SearchActionButtons.jsx";
import useVoiceSearch from "./hooks/useVoiceSearch.js";

export default function SearchBar({ input, service }) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromAirportSuggestions, setFromAirportSuggestions] = useState([]);
  const [toAirportSuggestions, setToAirportSuggestions] = useState([]);

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const inputRefs = useRef({});
  const registerInput = (name) => (el) => { inputRefs.current[name] = el; };

  const { handleMic, isListening } = useVoiceSearch({
    setFrom, setTo, input, inputRefs, navigate
  });

  useEffect(() => {
    setFrom("");
    setTo("");
    setShowFromDropdown(false);
    setShowToDropdown(false);
  }, [service]);

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

  const searchAirports = async (query) => {
    if (!query || query.length < 2 || service !== 'flight') return [];
    try {
      const response = await api.get(`/api/v1/airports/search?q=${encodeURIComponent(query)}`);
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('Error searching airports:', error);
      return [];
    }
  };

  const handleFromChange = async (e) => {
    const val = e.target.value;
    setFrom(val);
    if (val.trim().length > 1 && service === 'flight') {
      const results = await searchAirports(val);
      setFromAirportSuggestions(results);
      setShowFromDropdown(results.length > 0);
    } else if (val.trim().length > 1) {
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
      const results = await searchAirports(val);
      setToAirportSuggestions(results);
      setShowToDropdown(results.length > 0);
    } else if (val.trim().length > 1) {
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
    if (typeof item === 'object') {
      if (service === 'flight' && item.iataCode) {
        setFrom(item.iataCode);
      } else if (item.displayText) {
        setFrom(item.displayText);
      } else {
        setFrom(item);
      }
    } else {
      setFrom(item);
    }
    setShowFromDropdown(false);
  };

  const selectTo = (item) => {
    if (typeof item === 'object') {
      if (service === 'flight' && item.iataCode) {
        setTo(item.iataCode);
      } else if (item.displayText) {
        setTo(item.displayText);
      } else {
        setTo(item);
      }
    } else {
      setTo(item);
    }
    setShowToDropdown(false);
  };

  const handleSearch = () => {
    const formData = { from, to };
    Object.keys(inputRefs.current).forEach((key) => {
      if (key !== "from" && key !== "to") {
        formData[key] = inputRefs.current[key]?.value || "";
      }
    });

    const errors = [];
    if (!formData.from || formData.from.trim() === "") {
      errors.push("Please enter a departure location");
    }
    if (!formData.to || formData.to.trim() === "") {
      errors.push("Please enter a destination location");
    }
    if (formData.from && formData.to && formData.from.trim().toLowerCase() === formData.to.trim().toLowerCase()) {
      errors.push("Departure and destination cannot be the same");
    }
    if (formData.NoOfSeats !== undefined && formData.NoOfSeats !== "") {
      const passengerCount = parseInt(formData.NoOfSeats, 10);
      if (isNaN(passengerCount)) {
        errors.push("Please enter a valid number for passenger count");
      } else if (passengerCount < 1) {
        errors.push("Passenger count must be at least 1");
      } else if (passengerCount > 35) {
        errors.push("Maximum 35 passengers allowed per booking");
      }
    }

    if (errors.length > 0) {
      alert(errors[0]);
      return;
    }

    const queryParams = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    navigate(`/${service}booking?${queryParams.toString()}`);
  };

  const renderField = (field, index) => {
    const isFromField = field.name === "from" || field.name === "city";
    const isToField = field.name === "to";

    let value, onChange, wrapperRef, showDropdown;
    if (isFromField) {
      value = from;
      onChange = handleFromChange;
      wrapperRef = fromRef;
      showDropdown = showFromDropdown;
    } else if (isToField) {
      value = to;
      onChange = handleToChange;
      wrapperRef = toRef;
      showDropdown = showToDropdown;
    }

    return (
      <SearchInputField
        key={index}
        field={field}
        value={value}
        onChange={onChange}
        onFocus={() => {
          if (isFromField && from.length > 1) setShowFromDropdown(true);
          if (isToField && to.length > 1) setShowToDropdown(true);
        }}
        wrapperRef={wrapperRef}
        showDropdown={showDropdown}
        service={service}
        from={from}
        to={to}
        selectFrom={selectFrom}
        selectTo={selectTo}
        fromAirportSuggestions={fromAirportSuggestions}
        toAirportSuggestions={toAirportSuggestions}
        allDestinations={allDestinations}
        isFromField={isFromField}
        isToField={isToField}
        registerInput={registerInput(field.name)}
        today={today}
      />
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {input.slice(0, 2).map((field, idx) => renderField(field, idx))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {input.slice(2).map((field, idx) => renderField(field, idx + 2))}
            </div>
          </div>

          <SearchActionButtons
            onSearch={handleSearch}
            onMic={handleMic}
            isListening={isListening}
          />
        </div>
      </div>
    </div>
  );
}
