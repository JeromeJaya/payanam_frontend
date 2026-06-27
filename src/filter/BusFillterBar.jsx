import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function BusFilterBar({ NoOfBus = 0, selectedDate, onDateSelect, selectedSort, onSortSelect }) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const base = selectedDate ? new Date(selectedDate) : new Date();
  base.setHours(0, 0, 0, 0);

  const dates = Array.from({ length: 8 }, (_, index) => {
    const current = new Date(base);
    current.setDate(base.getDate() + index);
    return {
      label: `${String(current.getDate()).padStart(2, "0")} ${monthNames[current.getMonth()]}, ${dayNames[current.getDay()]}`,
      value: current.toISOString().slice(0, 10),
    };
  });

  const sortOptions = [
    "Relevance",
    "Rating",
    "Price",
    "Fastest",
    "Departure",
    "Arrival",
  ];

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden shadow-sm">
      {/* Date Slider */}
      <div className="flex items-center ">
        <button className="p-6 ">
          <ChevronLeft className="text-blue-500" />
        </button>

        <div className="flex flex-1 justify-around">
          {dates.map((item) => {
            const active = item.value === selectedDate;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onDateSelect?.(item.value)}
                className={`px-6 py-5 text-center whitespace-nowrap transition ${active ? "bg-sky-100 text-blue-700 rounded-3xl" : "hover:text-blue-600"}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <button className="p-6">
          <ChevronRight className="text-blue-500" />
        </button>
      </div>

      {/* Offer Cards */}


      {/* Sort Section */}
      <div className="flex items-center px-6 py-1">
        <h3 className="font-semibold text-2xl mr-10">
          {NoOfBus} buses found
        </h3>

        <span className="font-semibold text-sm mr-4">
          SORT BY
        </span>

        <div className="flex gap-8 items-center">
          {sortOptions.map((option) => {
            const active = option === selectedSort;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onSortSelect?.(option)}
                className={`px-4 py-2 rounded-xl transition ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}