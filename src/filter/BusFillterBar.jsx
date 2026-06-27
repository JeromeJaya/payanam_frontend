import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function BusFilterBar({ NoOfBus = 0 }) {
  const dates = [
    "23 Jun, Tue",
    "24 Jun, Wed",
    "25 Jun, Thu",
    "26 Jun, Fri",
    "27 Jun, Sat",
    "28 Jun, Sun",
    "29 Jun, Mon",
    "30 Jun, Tue",
  ];

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
          {dates.map((date) => (
            <div
              key={date}
              className="px-6 py-5 text-center whitespace-nowrap"
            >
              {date}
            </div>
          ))}
        </div>

        <button className="p-6">
          <ChevronRight className="text-blue-500" />
        </button>
      </div>

      {/* Offer Cards */}
      <div className="flex gap-4 px-4">
        {/* Card 1 */}
        <div className="flex-1 bg-teal-100 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-2xl mb-2">
              Top Rated Buses
            </h3>

            <p className="text-gray-800">
              Explore our highest rated
              <br />
              buses on this route
            </p>

            <button className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              See Buses
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="text-6xl">⭐</div>
        </div>

        {/* Card 2 */}
        <div className="flex-1 bg-sky-100 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-2xl mb-2">
              MyDeals
            </h3>

            <p className="text-gray-800">
              Upto ₹100 OFF on select
              <br />
              buses
            </p>

            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              See Buses
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="text-6xl">%</div>
        </div>
      </div>

      {/* Sort Section */}
      <div className="flex items-center px-6 py-1">
        <h3 className="font-semibold text-2xl mr-10">
          {NoOfBus} buses found
        </h3>

        <span className="font-semibold text-sm mr-4">
          SORT BY
        </span>

        <div className="flex gap-8 items-center">
          {sortOptions.map((option, index) => (
            <button
              key={option}
              className={`px-4 py-2 rounded-xl transition ${
                index === 0
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}