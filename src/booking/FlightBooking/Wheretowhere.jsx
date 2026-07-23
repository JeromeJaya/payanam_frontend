import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import LocationInput from './components/LocationInput';
import SwapButton from './components/SwapButton';
import DateInput from './components/DateInput';
import SearchButton from './components/SearchButton';

export default function Wheretowhere({
  from: fromProp,
  to: toProp,
  date: dateProp,
  onFromChange,
  onToChange,
  onDateChange,
  onSearch
}) {
  const [fromLocation, setFromLocation] = useState(fromProp || '');
  const [toLocation, setToLocation] = useState(toProp || '');
  const [fromIata, setFromIata] = useState('');
  const [toIata, setToIata] = useState('');
  const [fromAirportName, setFromAirportName] = useState('');
  const [toAirportName, setToAirportName] = useState('');
  const [departDate, setDepartDate] = useState(dateProp || '');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromSelected, setFromSelected] = useState(false);
  const [toSelected, setToSelected] = useState(false);
  const initialized = useRef(false);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const searchAirports = async (query) => {
    if (!query || query.length < 2) return [];
    try {
      const response = await api.get(`/api/v1/airports/search?q=${encodeURIComponent(query)}`);
      if (response.data.success) return response.data.data;
      return [];
    } catch (error) {
      console.error('Error searching airports:', error);
      return [];
    }
  };

  const handleSwapLocations = () => {
    const tempDisplay = fromLocation;
    const tempIata = fromIata;
    const tempAirport = fromAirportName;
    const tempFlag = fromSelected;

    setFromLocation(toLocation);
    setFromIata(toIata);
    setFromAirportName(toAirportName);
    setFromSelected(toSelected);

    setToLocation(tempDisplay);
    setToIata(tempIata);
    setToAirportName(tempAirport);
    setToSelected(tempFlag);

    const newFrom = toIata || toLocation;
    const newTo = tempIata || tempDisplay;
    if (onFromChange) onFromChange(newFrom);
    if (onToChange) onToChange(newTo);

    if (newFrom && newTo && departDate && fromSelected && toSelected) {
      setTimeout(() => {
        if (onSearch) onSearch();
      }, 100);
    }
  };

  const handleFromChange = async (e) => {
    const value = e.target.value;
    setFromLocation(value);
    setFromSelected(false);
    setFromIata('');
    setFromAirportName('');
    if (onFromChange) onFromChange(value);

    if (value.length >= 2) {
      const results = await searchAirports(value);
      setFromSuggestions(results);
      setShowFromSuggestions(true);
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  };

  const handleToChange = async (e) => {
    const value = e.target.value;
    setToLocation(value);
    setToSelected(false);
    setToIata('');
    setToAirportName('');
    if (onToChange) onToChange(value);

    if (value.length >= 2) {
      const results = await searchAirports(value);
      setToSuggestions(results);
      setShowToSuggestions(true);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };

  const selectFromSuggestion = (airport) => {
    const displayText = airport.displayText || `${airport.city} (${airport.iataCode})`;
    setFromLocation(displayText);
    setFromAirportName(airport.name);
    setFromSelected(true);
    const apiValue = airport.iataCode || airport.city;
    setFromIata(apiValue);
    if (onFromChange) onFromChange(apiValue);
    setShowFromSuggestions(false);
  };

  const selectToSuggestion = (airport) => {
    const displayText = airport.displayText || `${airport.city} (${airport.iataCode})`;
    setToLocation(displayText);
    setToAirportName(airport.name);
    setToSelected(true);
    const apiValue = airport.iataCode || airport.city;
    setToIata(apiValue);
    if (onToChange) onToChange(apiValue);
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
    if (fromProp !== undefined) {
      setFromLocation(fromProp);
      if (/^[A-Z]{3}$/.test(fromProp)) {
        setFromIata(fromProp);
        setFromSelected(true);
      }
    }
    if (toProp !== undefined) {
      setToLocation(toProp);
      if (/^[A-Z]{3}$/.test(toProp)) {
        setToIata(toProp);
        setToSelected(true);
      }
    }
    initialized.current = true;
  }, []);

  useEffect(() => {
    if (dateProp !== undefined) setDepartDate(dateProp);
  }, [dateProp]);

  const resolveToIata = async (rawValue) => {
    if (!rawValue) return rawValue;
    if (/^[A-Z]{3}$/.test(rawValue)) return rawValue;
    try {
      const results = await searchAirports(rawValue);
      if (results && results.length > 0) {
        return results[0].iataCode || results[0].city || rawValue;
      }
    } catch { /* ignore */ }
    return rawValue;
  };

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

    let fromValue = fromIata || fromLocation;
    let toValue = toIata || toLocation;

    if (fromValue && !/^[A-Z]{3}$/.test(fromValue)) {
      const resolved = await resolveToIata(fromValue);
      if (resolved !== fromValue) {
        fromValue = resolved;
        setFromIata(resolved);
        setFromLocation(`${resolved} - ${fromLocation}`);
      }
    }
    if (toValue && !/^[A-Z]{3}$/.test(toValue)) {
      const resolved = await resolveToIata(toValue);
      if (resolved !== toValue) {
        toValue = resolved;
        setToIata(resolved);
        setToLocation(`${resolved} - ${toLocation}`);
      }
    }

    if (onFromChange) onFromChange(fromValue);
    if (onToChange) onToChange(toValue);
    if (onDateChange) onDateChange(departDate);

    if (onSearch) onSearch();
  };

  return (
    <div className="mx-2 sm:mx-4 md:mx-8 lg:mx-12 p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-md font-sans text-gray-800">
      <div className="flex flex-wrap items-center gap-2">
        <LocationInput
          label="From"
          value={fromLocation}
          onChange={handleFromChange}
          suggestions={fromSuggestions}
          showSuggestions={showFromSuggestions}
          onSelectSuggestion={selectFromSuggestion}
          resolvedIata={fromIata}
          resolvedName={fromAirportName}
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
          resolvedIata={toIata}
          resolvedName={toAirportName}
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
        <SearchButton onClick={handleSearch} />
      </div>
    </div>
  );
}
