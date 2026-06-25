import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import api from "./api/axios";

export default function Nav({ mobile, email }) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.warn("Logout API failed:", err);
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-8 px-4 sm:px-6 lg:px-8">
    <div className="flex flex-1 items-center justify-start gap-4 md:gap-8">
      <Link className="flex gap-1 text-teal-600 dark:text-teal-500" to="/">

        <span className="text-xl font-medium tracking-wider text-gray-700 dark:text-gray-200">PAYANAM</span>
      </Link>

      <div className="relative hidden sm:block">
        <label className="sr-only" htmlFor="search"> Search </label>

        <input className="h-10 w-full rounded-full border-none bg-gray-100 ps-4 pe-10 text-sm shadow-sm sm:w-64 dark:bg-gray-800 dark:text-white" id="search" type="search" placeholder="Search..." />

        <button type="button" className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-gray-600 transition hover:text-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-200">
          <span className="sr-only ">Search</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>

    <div className="flex items-center justify-end gap-4">
      <nav aria-label="Global" className="hidden md:block">
        <ul className="flex items-center gap-6 text-lg">
          <li>
            <Link className="rounded-md bg-lime-100 px-3 py-2 text-lg font-medium text-lime-700 dark:bg-lime-900/50 dark:text-lime-300" to="/"> Flights </Link>
          </li>

          <li>
            <Link className="text-lg-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"> Hotels </Link>
          </li>

          <li>
            <Link className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75" > Trains </Link>
          </li>

          <li>
            <Link className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75" > Buses </Link>
          </li>

          <li>
            <Link className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"> Holiday </Link>
          </li>
        </ul>
      </nav>

      <span aria-hidden="true" className="hidden h-6 w-px rounded-full bg-gray-200 md:block dark:bg-gray-700"></span>

      <Link className="block shrink-0">
        <span className="sr-only">Profile</span>
        <img alt="Man" src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" className="h-10 w-10 rounded-full object-cover" />
      </Link>
      {/* conditional login/logout */}
      {!isAuthenticated ? (
        <button
          className="rounded-lg bg-lime-100 px-3 py-2 text-lg font-medium text-lime-700 dark:bg-lime-900/50 dark:text-lime-300 hover:bg-sky-500"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      ) : (
        <button
          className="rounded-lg bg-red-100 px-3 py-2 text-lg font-medium text-red-700 hover:bg-red-500 hover:text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}

      <button className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden dark:bg-gray-800 dark:text-white dark:hover:text-white/75">
        <span className="sr-only">Toggle menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>
</header>
</>
    );
}