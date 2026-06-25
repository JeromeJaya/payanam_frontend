import { useState } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

export default function PickupPointFilter({title, text}) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPoints, setSelectedPoints] = useState([]);

  const togglePoint = (point) => {
    setSelectedPoints((prev) =>
      prev.includes(point)
        ? prev.filter((p) => p !== point)
        : [...prev, point]
    );
  };

  const filteredPoints = text.filter((point) =>
    point.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-auto rounded-3xl shadow-3xl bg-grey-50 hover:bg-slate-200  max-w-md p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl text-gray-700">
          {title}
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedPoints([])}
            className="text-sm font-semibold text-gray-400 hover:text-gray-600"
          >
            CLEAR
          </button>

          <button onClick={() => setOpen(!open)}>
            {open ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <>
          {/* Search Box */}
          <div className="relative mb-4 ">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* Pickup Points */}
          <div className="space-y-4">
            {filteredPoints.slice(0, 4).map((point) => (
              <label
                key={point}
                className="flex items-center gap-4 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPoints.includes(point)}
                  onChange={() => togglePoint(point)}
                  className="h-5 w-5 rounded accent-blue-600"
                />

                <span className="text-lg text-gray-700 truncate">
                  {point}
                </span>
              </label>
            ))}
          </div>

          {/* Show All */}
          {filteredPoints.length > 4 && (
            <button className="mt-5 text-blue-600 font-medium flex items-center gap-1">
              Show all ({filteredPoints.length})
              <ChevronDown size={16} />
            </button>
          )}
        </>
      )}
    </div>
  );
}