import {
  Star,
  ChevronDown,
} from "lucide-react";
import SeatSelection from "../booking/BusBooking/SeatSelection.jsx";
import { useState } from "react";

export default function BusCard({
  busName = "Unknown Bus",
  busType = "Standard",
  departureTime = "--:--",
  arrivalTime = "--:--",
  availableSeats = 0,
  calculatedFare = "N/A",
  operatorName = "Unknown Operator",
  averageRating = "N/A",
  totalRatings = 0,
  amenities = [],
}) {

  const [showLayout, setShowLayout] = useState(false);
  return (
    <>



    <div className="w-full bg-white shadow-3xl rounded-3xl hover:bg-cyan-50 overflow-hidden">

      {/* Top Section */}
      <div className="px-8 py-2">
        <div className="flex justify-between">

          {/* Left */}
          <div>
            <h2 className="text-2xl font-bold">{busName}</h2>
            <p className="text-gray-500 text-sm">{busType}</p>
            <p className="text-sm text-slate-500">{operatorName}</p>

            <div className="flex items-center gap-2 mt-8">
              <div className="flex items-center gap-1 bg-blue-700 text-white px-2 py-1 rounded">
                <Star size={14} fill="white" />
                <span className="font-semibold">{averageRating ?? "N/A"}</span>
              </div>

              <span className="text-gray-600">
                {totalRatings ?? 0} Reviews
              </span>
            </div>

            <div className="flex gap-3 mt-6">
              {(Array.isArray(amenities) ? amenities.slice(0, 4) : []).map((amenity, idx) => (
                <span key={idx} className="px-4 py-2 border rounded-lg text-gray-600">
                  {amenity}
                </span>
              ))}
              {!Array.isArray(amenities) || amenities.length === 0 ? (
                <span className="px-4 py-2 border rounded-lg text-gray-600">No amenities listed</span>
              ) : null}
            </div>
          </div>

          {/* Center */}
          <div className="flex items-start gap-8">

            {/* Departure */}
            <div>
              <h3 className="text-3xl font-semibold">{departureTime}</h3>
              <p className="text-gray-500 mt-1">Departure</p>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3 mt-4">
              <div className="w-20 h-[1px] bg-gray-300"></div>

              <span className="text-gray-500 whitespace-nowrap">
                07h 15m
              </span>

              <div className="w-20 h-[1px] bg-gray-300"></div>
            </div>

            {/* Arrival */}
            <div>
              <h3 className="text-3xl font-semibold">{arrivalTime}</h3>
              <p className="text-gray-500 mt-1">Arrival</p>
            </div>
          </div>

          {/* Right */}
          <div className="text-right">
            <h2 className="text-5xl font-bold">
              {calculatedFare !== "N/A" ? `${calculatedFare} ₹` : calculatedFare}
            </h2>
            <p className="mt-4 text-gray-500">{availableSeats} Seats Available</p>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-neutral-200 px-8 py-1 flex items-center justify-between">

        <div className="flex gap-5">

          {[
            "Photos",
            "Amenities",
            "Pickup & Drop Points",
            "Ratings & Reviews",
            "Policies",
          ].map((item) => (
            <button
              key={item}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              {item}
              <ChevronDown size={16} />
            </button>
          ))}

        </div>

        <button className="bg-blue-600 text-white font-semibold px-12 py-3 rounded-xl transition"
        onClick ={() => setShowLayout(!showLayout)}>
          {showLayout ?"HIDE LAYOUT":"SELECT SEATS"}
        </button>
      </div>

    </div>
      {showLayout && (<SeatSelection/> )}
    </>
  )

}