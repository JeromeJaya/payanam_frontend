import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import LocationInput from './components/LocationInput';
import SwapButton from './components/SwapButton';
import DateInput from './components/DateInput';
import SearchButton from './components/SearchButton';
import PassengerCountSelect from './components/PassengerCountSelect';

export default function WhereToWhere({
  from: fromProp,
  to: toProp,
  date: dateProp,
  onFromChange,
  onToChange,
  onDateChange,
  onSearch,
  passengerCount,
  onPassengerCountChange,
}) {
  const [fromLocation, setFromLocation] = useState(fromProp || '');
  const [toLocation, setToLocation] = useState(toProp || '');
  const [departDate, setDepartDate] = useState(dateProp || '');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromSelected, setFromSelected] = useState(false);
  const [toSelected, setToSelected] = useState(false);
  const initialized = useRef(false);
  const fromDebounceTimer = useRef(null);
  const toDebounceTimer = useRef(null);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const searchPlaces = async (query) => {
    if (!query || query.trim().length < 2) return [];
    try {
      const response = await api.get(`/api/v1/places/search?q=${encodeURIComponent(query)}`);
      if (response.data?.success) return response.data.data;
      return [];
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  };

  const handleSwapLocations = () => {
    const tempDisplay = fromLocation;
    const tempFlag = fromSelected;

    setFromLocation(toLocation);
    setFromSelected(toSelected);

    setToLocation(tempDisplay);
    setToSelected(tempFlag);

    if (onFromChange) onFromChange(toLocation);
    if (onToChange) onToChange(tempDisplay);

    if (toLocation && tempDisplay && departDate && toSelected && tempFlag) {
      setTimeout(() => {
        if (onSearch) onSearch();
      }, 100);
    }
  };

  const handleFromChange = async (e) => {
    const value = e.target.value;
    setFromLocation(value);
    setFromSelected(false);
    if (onFromChange) onFromChange(value);

    if (fromDebounceTimer.current) clearTimeout(fromDebounceTimer.current);
    if (value.length >= 2) {
      fromDebounceTimer.current = setTimeout(async () => {
        const results = await searchPlaces(value);
        setFromSuggestions(results);
        setShowFromSuggestions(results.length > 0);
      }, 300);
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  };

  const handleToChange = async (e) => {
    const value = e.target.value;
    setToLocation(value);
    setToSelected(false);
    if (onToChange) onToChange(value);

    if (toDebounceTimer.current) clearTimeout(toDebounceTimer.current);
    if (value.length >= 2) {
      toDebounceTimer.current = setTimeout(async () => {
        const results = await searchPlaces(value);
        setToSuggestions(results);
        setShowToSuggestions(results.length > 0);
      }, 300);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };

  const selectFromSuggestion = (place) => {
    setFromLocation(place.name);
    setFromSelected(true);
    if (onFromChange) onFromChange(place.name);
    setShowFromSuggestions(false);
  };

  const selectToSuggestion = (place) => {
    setToLocation(place.name);
    setToSelected(true);
    if (onToChange) onToChange(place.name);
    setShowToSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowFromSuggestions(false);
      setShowToSuggestions(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    if (fromProp !== undefined && fromProp) {
      setFromLocation(fromProp);
      setFromSelected(true);
    }
    if (toProp !== undefined && toProp) {
      setToLocation(toProp);
      setToSelected(true);
    }
    initialized.current = true;
  }, []);

  useEffect(() => {
    if (dateProp !== undefined) setDepartDate(dateProp);
  }, [dateProp]);

  useEffect(() => {
    return () => {
      if (fromDebounceTimer.current) clearTimeout(fromDebounceTimer.current);
      if (toDebounceTimer.current) clearTimeout(toDebounceTimer.current);
    };
  }, []);

  const handleSearch = async () => {
    if (!fromLocation || fromLocation.trim() === "") {
      alert("Please enter a departure location");
      return;
    }
    if (!fromSelected) {
      alert("Please select a valid departure location from the suggestions");
      return;
    }
    if (!toLocation || toLocation.trim() === "") {
      alert("Please enter a destination location");
      return;
    }
    if (!toSelected) {
      alert("Please select a valid destination location from the suggestions");
      return;
    }

    if (fromLocation && toLocation && fromLocation.trim().toLowerCase() === toLocation.trim().toLowerCase()) {
      alert("Departure and destination cannot be the same");
      return;
    }

    if (!departDate || departDate.trim() === "") {
      alert("Please select a departure date");
      return;
    }
    if (departDate < getTodayDate()) {
      alert("Departure date cannot be in the past");
      return;
    }

    if (onFromChange) onFromChange(fromLocation);
    if (onToChange) onToChange(toLocation);
    if (onDateChange) onDateChange(departDate);
    if (onSearch) onSearch();
  };

  return (
    <div className="mx-2 sm:mx-4 md:mx-8 lg:mx-12 p-3 sm:p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md font-sans text-gray-800 dark:text-slate-200">
      <div className="flex flex-wrap items-center gap-2">
        <LocationInput
          label="From"
          value={fromLocation}
          onChange={handleFromChange}
          suggestions={fromSuggestions}
          showSuggestions={showFromSuggestions}
          onSelectSuggestion={selectFromSuggestion}
          hasError={!!(fromLocation && !fromSelected)}
        />
        <SwapButton onClick={handleSwapLocations} />
        <LocationInput
          label="To"
          value={toLocation}
          onChange={handleToChange}
          suggestions={toSuggestions}
          showSuggestions={showToSuggestions}
          onSelectSuggestion={selectToSuggestion}
          hasError={!!(toLocation && !toSelected)}
        />
        <DateInput
          value={departDate}
          min={getTodayDate()}
          onChange={(newDate) => {
            setDepartDate(newDate);
            if (onDateChange) onDateChange(newDate);
          }}
        />
        {onPassengerCountChange && (
          <PassengerCountSelect
            value={passengerCount}
            onChange={onPassengerCountChange}
          />
        )}
        <SearchButton onClick={handleSearch} />
      </div>
    </div>
  );
}
