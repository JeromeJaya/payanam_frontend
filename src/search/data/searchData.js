import place from '../../booking/places.json';

export const allDestinations = place.flatMap(p => [
  p.state,
  ...p.districts.map(d => d)
]);

export const SERVICE_ROUTES = {
  bus: '/busbooking',
  flight: '/flightbooking',
  train: '/trainbooking',
  hotel: '/hotelbooking',
};

export function normalizeDate(input) {
  if (!input) return null;
  const todayDate = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const s = String(input).trim().toLowerCase();

  if (s === 'today') return iso(todayDate);
  if (s === 'tomorrow') return iso(new Date(todayDate.getTime() + 86400000));
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const idx = weekdays.indexOf(s);
  if (idx !== -1) {
    const diff = (idx - todayDate.getDay() + 7) % 7 || 7;
    return iso(new Date(todayDate.getTime() + diff * 86400000));
  }

  const parsed = new Date(input);
  if (!isNaN(parsed.getTime())) return iso(parsed);

  return null;
}
