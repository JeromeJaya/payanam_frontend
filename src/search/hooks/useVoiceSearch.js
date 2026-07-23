import { useState } from 'react';
import api from '../../api/axios';
import { SERVICE_ROUTES, normalizeDate } from '../data/searchData';

export default function useVoiceSearch({ setFrom, setTo, input, inputRefs, navigate }) {
  const [isListening, setIsListening] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognitionAPI ? new SpeechRecognitionAPI() : null;
  if (recognition) {
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  }

  const askAndListen = (question) =>
    new Promise((resolve) => {
      const utter = new SpeechSynthesisUtterance(question);
      utter.lang = 'en-IN';
      utter.onend = () => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) { resolve(''); return; }
        const rec = new SpeechRecognitionAPI();
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

  const speakAvailability = async (serviceName, fromPlace, toPlace, dateStr) => {
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
  };

  const handleMic = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    setIsListening(true);
    recognition.start();

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = async (event) => {
      const speechresult = event.results[event.resultIndex];
      const transcript = speechresult[0].transcript;
      if (!speechresult.isFinal) return;

      try {
        let booking = await extractFromAI(transcript);
        console.log('Parsed booking:', booking);

        if (!booking) {
          console.error('AI did not return a valid booking object');
          return;
        }

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

        if (!booking.date) {
          const dateAnswer = await askAndListen(
            'On which date would you like to book? Please say a date, for example tomorrow or 15 August.'
          );
          if (dateAnswer) {
            const extra = await extractFromAI(`${transcript} date ${dateAnswer}`);
            if (extra && extra.date) {
              booking.date = extra.date;
            }
            if (!booking.date) {
              const direct = normalizeDate(dateAnswer);
              if (direct) booking.date = direct;
            }
          }
        }

        if (booking.from) setFrom(booking.from);
        if (booking.to) setTo(booking.to);

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
        await speakAvailability(booking.service, booking.from, booking.to, booking.date);
        navigate(`${route}?${queryParams.toString()}`);
      } catch (err) {
        console.error('AI chat error:', err);
      } finally {
        setIsListening(false);
      }
    };
  };

  return { handleMic, isListening };
}
