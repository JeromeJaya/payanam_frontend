# Payanam frontend — agent instructions

## Stack

- React 19 (JSX only — no `.tsx`, no TypeScript)
- Vite 8 + `@tailwindcss/vite` plugin (Tailwind v4 — no PostCSS config needed)
- React Router v7, Axios, Framer Motion, Three.js / R3F, Razorpay
- ESLint flat config (`eslint.config.js`), no Prettier config found

## Commands

| Command | Notes |
|---|---|
| `npm run dev` | Dev server on `0.0.0.0:5173` |
| `npm run build` | Vite build |
| `npm run lint` | ESLint on entire project |
| `npm run preview` | Preview production build |

No test framework is configured.

## Architecture

- **Entry:** `src/main.jsx` → renders `<BrowserRouter>` wrapping `<AuthProvider>` / `<ThemeProvider>` → `<Router />` (from `src/Route.jsx`)
- **Routing:** `src/Route.jsx` defines all routes — flat structure, no lazy loading
- **API client:** `src/api/axios.js` — base URL `http://localhost:3000`, `withCredentials: true`, auto-refreshes tokens on 401, clears session on 403 (suspended/banned); dispatches custom event `payanam:force-logout`
- **Auth context:** `src/context/AuthContext.jsx` — stores user in `localStorage` key `payanam_user`, checks `/api/users/profile` on mount, falls back to localStorage cache on network error
- **Theme:** `src/context/ThemeContext.jsx` — dark mode via Tailwind `class` strategy, persisted in `localStorage` key `theme`, respects `prefers-color-scheme`
- **Protected routes:** `src/components/ProtectedRoute.jsx` exports `ProtectedRoute`, `VendorProtectedRoute` (role=`vendor`), `AdminProtectedRoute` (role=`admin`)
- **Payments:** `src/hooks/useRazorpay.jsx` — loads `checkout.razorpay.com/v1/checkout.js` dynamically; key from `VITE_RAZORPAY_KEY_ID` env var

## Directory layout

| Path | Purpose |
|---|---|
| `src/booking/BusBooking/` | Bus booking flow |
| `src/booking/FlightBooking/` | Flight booking flow |
| `src/booking/HotelBooking/` | Hotel booking flow |
| `src/admin/` | Admin dashboard, login, user mgmt |
| `src/vendor/` | Vendor dashboard (buses, flights, schedules) |
| `src/Authentication/` | Email/mobile login, signup, password reset |
| `src/search/` | Search bars, place suggestions |
| `src/filter/` | Filter bars, checkboxes |
| `src/cards/` | Bus/Flight/Hotel/Train card components |
| `src/components/` | Shared modals, forms, route guards |
| `src/Carousels/` | Offers carousel, feedback |
| `src/Buttons/` | Styled button variants |
| `src/assets/` | Static images (PNGs, JPEGs) |
| `src/context/` | Auth + Theme React contexts |
| `src/hooks/` | Custom hooks (Razorpay) |
| `src/api/` | Axios instance |

`src/pages/` and `src/utils/` are empty directories.

## Key conventions

- No TypeScript — all files are `.jsx`/`.js`
- Environment variables use `VITE_` prefix (Vite convention)
- Dark mode controlled by `dark` class on `<html>` (Tailwind `class` strategy)
- API communication uses cookies for tokens (`withCredentials: true`) + localStorage for user cache
- Razorpay test key is bundled in `.env` — swap for production
- Docker: Node 22 image, exposes `5173`, runs `npm run dev` by default

## Gotchas

- Tailwind v4 uses `@tailwindcss/vite` plugin — do **not** create a `postcss.config.js` or add `@tailwind` directives
- ESLint uses flat config (`eslint.config.js`) — do **not** create `.eslintrc.*`
- `@types/react` and `@types/react-dom` are in devDependencies despite no TS — they help Vite/IDE hinting, do not remove
- Auth token refresh is handled by the axios interceptor — the frontend never stores `accessToken`; it relies on the backend setting `accessToken` as an HTTP-only cookie via `/api/auth/refresh`
