import { Check, Luggage } from "lucide-react";

export default function BaggageInfo({ cabin, checkIn, route }) {
  const routeCode = route || "DEL-BLR";
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Baggage</h3>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            <span className="font-medium">Cabin Baggage:</span> {cabin || "7 Kgs (1 piece only)"} / Adult
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            <span className="font-medium">Check-In Baggage:</span> {checkIn || "15 Kgs (1 piece only)"} / Adult
          </p>
        </div>
      </div>

      {/* Extra Baggage Promotion */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Luggage className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            Got excess baggage? Don't stress, buy extra check-in baggage allowance for <span className="font-semibold">{routeCode}</span> at fab rates!
          </p>
        </div>
        <button className="text-blue-600 text-sm font-bold hover:text-blue-700 whitespace-nowrap ml-2">
          ADD BAGGAGE
        </button>
      </div>
    </div>
  );
}
