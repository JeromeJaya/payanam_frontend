import { useState } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

export default function SearchheckBox({ 
  title, 
  text = [], 
  selectedPoints, 
  onChange, 
  onClear,
  selectionType = "multiple" // Added prop: "one" or "multiple"
}) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPointsLocal, setSelectedPointsLocal] = useState([]);
  const [showAll, setShowAll] = useState(false); 

  const activePoints = selectedPoints ?? selectedPointsLocal;

  const togglePoint = (point) => {
    let next;

    if (selectionType === "one") {
      // If "one", selecting a point replaces everything else. Clicking an already selected point unchecks it.
      next = activePoints.includes(point) ? [] : [point];
    } else {
      // If "multiple", toggle points on/off natively
      next = activePoints.includes(point)
        ? activePoints.filter((p) => p !== point)
        : [...activePoints, point];
    }

    if (onChange) {
      // Pass the updated selection list or point depending on your parent logic setup
      onChange(selectionType === "one" ? next[0] || null : next);
    } else {
      setSelectedPointsLocal(next);
    }
  };

  const filteredPoints = text.filter((point) =>
    point.toLowerCase().includes(search.toLowerCase())
  );

  const displayedPoints = showAll ? filteredPoints : filteredPoints.slice(0, 4);

  return (
    <div className="w-full h-auto rounded-3xl shadow-3xl bg-grey-50 dark:bg-slate-800 dark:hover:bg-slate-700 max-w-md p-2 md:p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <h2 className="font-semibold text-sm md:text-xl text-gray-700 dark:text-slate-200">
          {title}
        </h2>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onClear) {
                onClear();
              } else {
                setSelectedPointsLocal([]);
              }
            }}
            className="text-[1px] md:text-sm font-semibold text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
          >
            CLEAR
          </button>

          <button type="button" onClick={(e) => { e.preventDefault(); setOpen(!open); }}>
            {open ? <ChevronUp size={16} className="text-gray-600 dark:text-slate-400" /> : <ChevronDown size={16} className="text-gray-600 dark:text-slate-400" />}
          </button>
        </div>
      </div>

      {open && (
        <>
          {/* Search Box */}
          <div className="relative mb-2 md:mb-4">
            <Search
              size={14}
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            />

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowAll(false);
              }}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg md:rounded-xl py-2 md:py-3 pl-8 md:pl-12 pr-3 md:pr-4 outline-none focus:border-blue-500 dark:focus:border-blue-400 text-xs md:text-sm text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Pickup Points */}
          <div className="space-y-2 md:space-y-4">
            {displayedPoints.map((point) => (
              <label
                key={point}
                className="flex items-center gap-2 md:gap-4 cursor-pointer"
              >
                <input
                  // Switch visual style between radio (circle) and checkbox (square) dynamically
                  type={selectionType === "one" ? "radio" : "checkbox"}
                  checked={activePoints.includes(point)}
                  onChange={() => togglePoint(point)}
                  onClick={(e) => {
                    // Allows deselecting a radio item if clicked again
                    if (selectionType === "one" && activePoints.includes(point)) {
                      e.preventDefault();
                      togglePoint(point);
                    }
                  }}
                  className={`h-3.5 w-3.5 md:h-5 md:w-5 accent-blue-600 dark:accent-blue-400 ${selectionType === "one" ? "rounded-full" : "rounded"}`}
                />

                <span className="text-xs md:text-lg text-gray-700 dark:text-slate-300 truncate">
                  {point}
                </span>
              </label>
            ))}
          </div>

          {/* Show All / Show Less Button */}
          {filteredPoints.length > 4 && (
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); setShowAll(!showAll); }}
              className="mt-3 md:mt-5 text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 hover:text-blue-700 dark:hover:text-blue-300 text-xs md:text-sm"
            >
              {showAll ? (
                <>
                  Show less
                  <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Show all ({filteredPoints.length})
                  <ChevronDown size={14} />
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}