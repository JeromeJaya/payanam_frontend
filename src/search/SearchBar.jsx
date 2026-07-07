import place from '../booking/places.json';
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';


// Flat-mapping data layer
const allDestinations = place.flatMap(p => [
  p.state,
  ...p.districts.map(d => d)
]);

// Valid service keys the AI can return + their booking routes.
const SERVICE_ROUTES = {
  bus: '/busbooking',
  flight: '/flightbooking',
  train: '/trainbooking',
  hotel: '/hotelbooking',
};

// Convert a date string (YYYY-MM-DD, "7 July", "today", "tomorrow") into YYYY-MM-DD.
// Returns null if the input cannot be parsed.
function normalizeDate(input) {
  if (!input) return null;
  const todayDate = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const s = String(input).trim().toLowerCase();

  if (s === 'today') return iso(todayDate);
  if (s === 'tomorrow') return iso(new Date(todayDate.getTime() + 86400000));

  // Already YYYY-MM-DD?
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Weekday name -> next occurrence
  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const idx = weekdays.indexOf(s);
  if (idx !== -1) {
    const diff = (idx - todayDate.getDay() + 7) % 7 || 7;
    return iso(new Date(todayDate.getTime() + diff * 86400000));
  }

  // Try natural parsing like "7 July" or "July 7"
  const parsed = new Date(input);
  if (!isNaN(parsed.getTime())) return iso(parsed);

  return null;
}

export default function SearchBar({ input, service }) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const day = String(new Date()).slice(0, 3);

  // Core Controlled Search Parameters State
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [lang, setLang] = useState('en-IN');

  // NEW: State to track if microphone is actively listening
  const [isListening, setIsListening] = useState(false);

  // Suggestions Visibility Layers
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  
  // Airport suggestions from API
  const [fromAirportSuggestions, setFromAirportSuggestions] = useState([]);
  const [toAirportSuggestions, setToAirportSuggestions] = useState([]);

  // Box wrapper element tracker refs
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const inputRefs = useRef({});


    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

  // Speak a question out loud, then listen once for the user's answer.
  // Returns a Promise<string> with the transcript (or '' if nothing recognized).
  const askAndListen = (question) =>
    new Promise((resolve) => {
      const utter = new SpeechSynthesisUtterance(question);
      utter.lang = 'en-IN';
      utter.onend = () => {
        const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        rec.lang = 'en-IN';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.onresult = (event) => {
          const r = event.results[event.resultIndex];
          resolve(r ? r[0].transcript : '');
        };
        rec.onerror = () => resolve('');
        rec.onend = () => resolve('');
        rec.start();
      };
      utter.onerror = () => resolve('');
      window.speechSynthesis.speak(utter);
    });

  // Clear query inputs if service toggles changes
  useEffect(() => {
    setFrom("");
    setTo("");
    setShowFromDropdown(false);
    setShowToDropdown(false);
  }, [service]);

  // Search airports API for flight service
  const searchAirports = async (query) => {
    if (!query || query.length < 2 || service !== 'flight') {
      return [];
    }

    try {
      const response = await api.get(`/api/v1/airports/search?q=${encodeURIComponent(query)}`);
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error searching airports:', error);
      return [];
    }
  };

  const handleFromChange = async (e) => {
    const val = e.target.value;
    setFrom(val);
    
    if (val.trim().length > 1 && service === 'flight') {
      // Use airports API for flight service
      const results = await searchAirports(val);
      setFromAirportSuggestions(results);
      setShowFromDropdown(results.length > 0);
    } else if (val.trim().length > 1) {
      // Use local destinations for other services
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
      // Use airports API for flight service
      const results = await searchAirports(val);
      setToAirportSuggestions(results);
      setShowToDropdown(results.length > 0);
    } else if (val.trim().length > 1) {
      // Use local destinations for other services
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
    // If it's an airport object (from API), use displayText
    if (typeof item === 'object' && item.displayText) {
      setFrom(item.displayText);
    } else {
      setFrom(item);
    }
    setShowFromDropdown(false);
  };

  const selectTo = (item) => {
    // If it's an airport object (from API), use displayText
    if (typeof item === 'object' && item.displayText) {
      setTo(item.displayText);
    } else {
      setTo(item);
    }
    setShowToDropdown(false);
  };

  // Close suggestion dropdown menus if clicking outside
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

  const handleSearch = () => {
    const formData = {
      from,
      to,
    };
    Object.keys(inputRefs.current).forEach((key) => {
      if (key !== "from" && key !== "to") {
        formData[key] = inputRefs.current[key]?.value || "";
      }
    });
    
    // Validation
    const errors = [];
    
    // Validate From and To
    if (!formData.from || formData.from.trim() === "") {
      errors.push("Please enter a departure location");
    }
    if (!formData.to || formData.to.trim() === "") {
      errors.push("Please enter a destination location");
    }
    
    // Validate From != To
    if (formData.from && formData.to && formData.from.trim().toLowerCase() === formData.to.trim().toLowerCase()) {
      errors.push("Departure and destination cannot be the same");
    }
    
    // Validate Passenger count (NoOfSeats) if it exists
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
    
    // If there are validation errors, show them and don't navigate
    if (errors.length > 0) {
      // Display first error to user
      const errorMessage = errors[0];
      // Use native alert for now - can be replaced with a toast/notification
      alert(errorMessage);
      return;
    }
    
    const queryParams = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/${service}booking?${queryParams.toString()}`);
  };

  // Send a transcript to the backend AI and return the parsed booking object
  const extractFromAI = async (transcript) => {
    const completion = await api.post('/api/v1/ai/chat', {
      message:
        `Extract travel search details from this voice query and return ONLY a JSON object with keys: ` +
        `"from" (departure city), "to" (destination city), ` +
        `"service" (one of: bus, flight, train, hotel — infer from words like flight/planes, bus, train, hotel/stay), ` +
        `and optional "date" in STRICT YYYY-MM-DD format. ` +
        `If the user says "today" use ${today}; if "tomorrow" use ` +
        `${new Date(Date.now() + 86400000).toISOString().split('T')[0]}; for a weekday like "Monday" ` +
        `compute the next matching date. Omit any key the user did not mention. Do not include any explanation. ` +
        `Query: "${transcript}"`
    });
    const response = completion.data.content;
    const match = response.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  };

  // Query the search API for the given service and speak the count of available results.
  async function speakAvailability(serviceName, fromPlace, toPlace, dateStr) {
    if (!serviceName || !fromPlace || !toPlace) return;
    const d = normalizeDate(dateStr) || new Date().toISOString().slice(0, 10);
    let count = 0;
    try {
      if (serviceName === 'bus') {
        const res = await api.get('/api/v1/buses/search', { params: { from: fromPlace, to: toPlace, date: d } });
        count = res?.data?.data?.length || 0;
      } else if (serviceName === 'flight') {
        const res = await api.get('/api/v1/flights/search', { params: { from: fromPlace, to: toPlace, date: d } });
        count = res?.data?.data?.length || 0;
      }
    } catch (e) {
      console.warn('Availability check failed:', e);
      return;
    }
    const msg = count > 0
      ? `There are ${count} ${serviceName} options available from ${fromPlace} to ${toPlace} on ${d}.`
      : `No ${serviceName} available from ${fromPlace} to ${toPlace} on ${d}.`;
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
  }

   const handleMic = () => {
      setIsListening(true); // Start listening animation state
      recognition.start();
      
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = async (event) => {
        const speechresult = event.results[event.resultIndex]
        const transcript = speechresult[0].transcript
        if (!speechresult.isFinal) return;
  
        try {
          let booking = await extractFromAI(transcript);
          console.log('Parsed booking:', booking);
  
          if (!booking) {
            console.error('AI did not return a valid booking object');
            return;
          }
  
          // STEP 1: If service not detected from the voice query, TTS-ask the user
          if (!booking.service || !SERVICE_ROUTES[booking.service]) {
            const answer = await askAndListen(
              'Which service would you like to book? Please say bus or flight.'
            );
            const matched = (answer || '').toLowerCase().match(/bus|flight/);
            if (!matched) {
              window.speechSynthesis.speak(
                new SpeechSynthesisUtterance('Sorry, I did not catch the service. Please try again.')
              );
              return;
            }
            booking.service = matched[0];
            console.log('Service from follow-up:', booking.service);
          }
  
          // If from/to still missing, ask for them too (best-effort)
          if (!booking.from || !booking.to) {
            const answer = await askAndListen(
              'From where and to where would you like to travel? For example, Chennai to Madurai.'
            );
            const extra = await extractFromAI(`${transcript} ${answer}`);
            if (extra) {
              booking.from = booking.from || extra.from;
              booking.to = booking.to || extra.to;
              booking.date = booking.date || extra.date;
            }
          }
  
          // If date still missing, ask the user which date they want to book
          if (!booking.date) {
            const dateAnswer = await askAndListen(
              'On which date would you like to book? Please say a date, for example tomorrow or 15 August.'
            );
            if (dateAnswer) {
              const extra = await extractFromAI(`${transcript} date ${dateAnswer}`);
              if (extra && extra.date) {
                booking.date = extra.date;
              }
              // Fallback: try to normalize the spoken answer directly
              if (!booking.date) {
                const direct = normalizeDate(dateAnswer);
                if (direct) booking.date = direct;
              }
            }
          }
  
          // Populate the visible search fields
          if (booking.from) setFrom(booking.from);
          if (booking.to) setTo(booking.to);
  
          // Normalize AI date into YYYY-MM-DD and populate date field(s)
          if (booking.date) {
            const normalized = normalizeDate(booking.date);
            if (normalized) {
              input.forEach((field) => {
                if (field.type === 'date' && inputRefs.current[field.name]) {
                  inputRefs.current[field.name].value = normalized;
                }
              });
            } else {
              console.warn('Could not normalize date from AI:', booking.date);
            }
          }
  
          // STEP 2: Redirect to the listing/booking page for the detected service
          const route = SERVICE_ROUTES[booking.service];
          if (!route) {
            console.error('Unknown service:', booking.service);
            return;
          }
  
          const queryParams = new URLSearchParams();
          if (booking.from) queryParams.append('from', booking.from);
          if (booking.to) queryParams.append('to', booking.to);
          if (booking.date) {
            const normalized = normalizeDate(booking.date);
            if (normalized) queryParams.append('date', normalized);
          }
  
          console.log('Navigating to', `${route}?${queryParams.toString()}`);
  
          // Speak availability count before navigating
          await speakAvailability(booking.service, booking.from, booking.to, booking.date);
  
          navigate(`${route}?${queryParams.toString()}`);
        } catch (err) {
          console.error('AI chat error:', err);
        } finally {
          setIsListening(false);
        }
      };
    }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {input.slice(0, 2).map((field, idx) => {
            const fieldIdx = idx;
            const isFromField = field.name === "from" || field.name === "city";
            const isToField = field.name === "to";
            
            let valueProp = undefined;
            let onChangeHandler = undefined;
            let wrapperRef = null;
            let showDropdown = false;

            if (isFromField) {
              valueProp = from;
              onChangeHandler = handleFromChange;
              wrapperRef = fromRef;
              showDropdown = showFromDropdown;
            } else if (isToField) {
              valueProp = to;
              onChangeHandler = handleToChange;
              wrapperRef = toRef;
              showDropdown = showToDropdown;
            }

            const todayDay = field.type === "date" ? day : field.below;

            return (
              <div
                key={fieldIdx}
                ref={wrapperRef}
                className="relative"
              >
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  {field.label}
                </label>
                
                <input
                  id={field.name}
                  className="w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-500"
                  placeholder={field.mid || `Enter ${field.label.toLowerCase()}`}
                  type={field.type || "text"}
                  defaultValue={valueProp !== undefined ? undefined : (field.type === "date" ? today : field.mid)}
                  value={valueProp}
                  onChange={onChangeHandler}
                  onFocus={() => {
                    if (isFromField && from.length > 1) setShowFromDropdown(true);
                    if (isToField && to.length > 1) setShowToDropdown(true);
                  }}
                  ref={(el) => { inputRefs.current[field.name] = el; }}
                  autoComplete="off"
                />
                
                {todayDay && (
                  <p className="text-slate-400 mt-1 text-xs">{todayDay}</p>
                )}

                {/* Suggestions Dropdown */}
                {showDropdown && (
                  <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {service === 'flight' && isFromField && fromAirportSuggestions.map((airport, index) => (
                      <li
                        key={index}
                        onClick={() => selectFrom(airport)}
                        className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                      >
                        <div className="font-medium">{airport.displayText || `${airport.city} (${airport.iataCode})`}</div>
                        <div className="text-xs text-slate-500">{airport.name}</div>
                      </li>
                    ))}
                    {service === 'flight' && isToField && toAirportSuggestions.map((airport, index) => (
                      <li
                        key={index}
                        onClick={() => selectTo(airport)}
                        className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                      >
                        <div className="font-medium">{airport.displayText || `${airport.city} (${airport.iataCode})`}</div>
                        <div className="text-xs text-slate-500">{airport.name}</div>
                      </li>
                    ))}
                    {service !== 'flight' && (isFromField ? 
                      allDestinations.filter(d => d.toLowerCase().includes(from.toLowerCase())) :
                      allDestinations.filter(d => d.toLowerCase().includes(to.toLowerCase()))
                    ).slice(0, 5).map((item, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          if (isFromField) selectFrom(item);
                          else if (isToField) selectTo(item);
                        }}
                        className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {input.slice(2).map((field, idx) => {
                const fieldIdx = idx + 2;
                const isFromField = field.name === "from" || field.name === "city";
                const isToField = field.name === "to";
                const isNumberField = field.type === "number";
                
                let valueProp = undefined;
                let onChangeHandler = undefined;
                let wrapperRef = null;
                let showDropdown = false;

                if (isFromField) {
                  valueProp = from;
                  onChangeHandler = handleFromChange;
                  wrapperRef = fromRef;
                  showDropdown = showFromDropdown;
                } else if (isToField) {
                  valueProp = to;
                  onChangeHandler = handleToChange;
                  wrapperRef = toRef;
                  showDropdown = showToDropdown;
                }

                const todayDay = field.type === "date" ? day : field.below;

                return (
                  <div
                    key={fieldIdx}
                    ref={wrapperRef}
                    className="relative"
                  >
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      {field.label}
                    </label>
                    
                    <input
                      id={field.name}
                      className={`w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-500 ${isNumberField && 'w-20'}`}
                      placeholder={field.mid || `Enter ${field.label.toLowerCase()}`}
                      type={field.type || "text"}
                      defaultValue={valueProp !== undefined ? undefined : (field.type === "date" ? today : field.mid)}
                      value={valueProp}
                      onChange={onChangeHandler}
                      onFocus={() => {
                        if (isFromField && from.length > 1) setShowFromDropdown(true);
                        if (isToField && to.length > 1) setShowToDropdown(true);
                      }}
                      ref={(el) => { inputRefs.current[field.name] = el; }}
                      autoComplete="off"
                    />
                    
                    {todayDay && (
                      <p className="text-slate-400 mt-1 text-xs">{todayDay}</p>
                    )}

                    {/* Suggestions Dropdown */}
                    {showDropdown && (
                      <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                        {service === 'flight' && isFromField && fromAirportSuggestions.map((airport, index) => (
                          <li
                            key={index}
                            onClick={() => selectFrom(airport)}
                            className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-medium">{airport.displayText || `${airport.city} (${airport.iataCode})`}</div>
                            <div className="text-xs text-slate-500">{airport.name}</div>
                          </li>
                        ))}
                        {service === 'flight' && isToField && toAirportSuggestions.map((airport, index) => (
                          <li
                            key={index}
                            onClick={() => selectTo(airport)}
                            className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-medium">{airport.displayText || `${airport.city} (${airport.iataCode})`}</div>
                            <div className="text-xs text-slate-500">{airport.name}</div>
                          </li>
                        ))}
                        {service !== 'flight' && (isFromField ? 
                          allDestinations.filter(d => d.toLowerCase().includes(from.toLowerCase())) :
                          allDestinations.filter(d => d.toLowerCase().includes(to.toLowerCase()))
                        ).slice(0, 5).map((item, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              if (isFromField) selectFrom(item);
                              else if (isToField) selectTo(item);
                            }}
                            className="px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-row gap-3">
            <button
              onClick={handleSearch}
              className="flex-1 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-md hover:shadow-lg text-sm uppercase tracking-wide"
            >
              Search {service ? service.charAt(0).toUpperCase() + service.slice(1) : ""}
            </button>
            
            <button
              onClick={() => handleMic()}
              className={`flex items-center justify-center gap-2 font-semibold py-2.5 px-6 rounded-lg transition-all text-sm uppercase tracking-wide border-2 text-white
                ${isListening 
                  ? 'bg-rose-600 border-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.7)] animate-pulse' 
                  : 'bg-slate-900 border-slate-900 hover:bg-rose-600 hover:border-rose-600 shadow-[0_0_15px_rgba(15,23,42,0.2)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)]'
                }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full bg-current ${isListening ? 'animate-ping' : ''}`} />
              {isListening ? 'Listening...' : 'Voice search'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}