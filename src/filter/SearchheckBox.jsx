import { useState } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

export default function PickupPointFilter({ 
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
    <div className="w-full h-auto rounded-3xl shadow-3xl bg-grey-50 hover:bg-slate-200 max-w-md p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl text-gray-700">
          {title}
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onClear) {
                onClear();
              } else {
                setSelectedPointsLocal([]);
              }
            }}
            className="text-sm font-semibold text-gray-400 hover:text-gray-600"
          >
            CLEAR
          </button>

          <button onClick={() => setOpen(!open)}>
            {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
              onChange={(e) => {
                setSearch(e.target.value);
                setShowAll(false);
              }}
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* Pickup Points */}
          <div className="space-y-4">
            {displayedPoints.map((point) => (
              <label
                key={point}
                className="flex items-center gap-4 cursor-pointer"
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
                  className={`h-5 w-5 accent-blue-600 ${selectionType === "one" ? "rounded-full" : "rounded"}`}
                />

                <span className="text-lg text-gray-700 truncate">
                  {point}
                </span>
              </label>
            ))}
          </div>

          {/* Show All / Show Less Button */}
          {filteredPoints.length > 4 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="mt-5 text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700"
            >
              {showAll ? (
                <>
                  Show less
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Show all ({filteredPoints.length})
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}