import {useNavigate} from "react-router-dom";
export function SearchCard(){
    const navigate = useNavigate();
    return(
              <div className="absolute bottom-10 left-1/2 z-20 w-[95%] max-w-6xl -translate-x-1/2 rounded-3xl border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-lg">
        <div className="grid gap-4 md:grid-cols-5">

          <input
            type="text"
            placeholder="From"
            className="rounded-xl border p-4 outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <input
            type="text"
            placeholder="To"
            className="rounded-xl border p-4 outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <input
            type="date"
            className="rounded-xl border p-4 outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <input
            type="date"
            className="rounded-xl border p-4 outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button className="rounded-xl bg-cyan-500 p-4 font-semibold text-white transition hover:bg-cyan-600"
          onClick={() => navigate("/MainPage")}>
            Search
          </button>
        </div>
      </div>
    );
}