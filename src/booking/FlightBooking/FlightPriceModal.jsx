import { X, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FlightPriceModal({ flight, onClose }) {
  const navigate = useNavigate();

  if (!flight) return null;

  // Mock fare options - in real app, this would come from API
  const fareOptions = [
    {
      id: "saver",
      type: "SAVER",
      price: flight.pricing?.calculatedFare || flight.pricing?.baseFare || 5000,
      originalPrice: Math.round((flight.pricing?.calculatedFare || flight.pricing?.baseFare || 5000) * 1.15),
      discount: "15% OFF",
      baggage: ["7 Kgs Cabin Baggage", "15 Kgs Check-in Baggage"],
      cancellation: "Cancellation fee starts at MYR 213.80 (up to 3 hours before departure)",
      dateChange: "Date Change fee starts at MYR 128.26 up to 3 hrs before departure",
      seats: "Chargeable Seats",
      meals: "Chargeable Meals",
      color: "blue"
    },
    {
      id: "flexi",
      type: "FLEXI",
      price: Math.round((flight.pricing?.calculatedFare || flight.pricing?.baseFare || 5000) * 1.12),
      originalPrice: Math.round((flight.pricing?.calculatedFare || flight.pricing?.baseFare || 5000) * 1.25),
      discount: "12% OFF",
      baggage: ["7 Kgs Cabin Baggage", "15 Kgs Check-in Baggage"],
      cancellation: "Lower Cancellation fee of MYR 106.88 (up to 24 hours before departure)",
      dateChange: "Lower Date Change fee MYR 42.73 up to 3 hrs before departure",
      seats: "Free Seats",
      meals: "Complimentary Meals",
      color: "purple"
    },
    {
      id: "special",
      type: "MMTC SPECIAL",
      price: Math.round((flight.pricing?.calculatedFare || flight.pricing?.baseFare || 5000) * 1.10),
      originalPrice: Math.round((flight.pricing?.calculatedFare || flight.pricing?.baseFare || 5000) * 1.18),
      discount: "10% OFF",
      fareBy: "FARE BY MAKEMYTRIP",
      badge: "MMTC SPECIAL",
      baggage: ["7 Kgs Cabin Baggage", "15 Kgs Check-in Baggage"],
      cancellation: "Cancellation fee starts at MYR 213.80 (up to 3 hours before departure)",
      dateChange: "Date Change fee starts at MYR 128.26 up to 3 hrs before departure",
      seats: "Chargeable Seats",
      meals: "Chargeable Meals",
      benefits: ["Trip Secure"],
      color: "orange"
    }
  ];

  const handleBookNow = (fare) => {
    // Navigate to flight booking checkout page
    navigate('/flight-checkout', { 
      state: { 
        flight, 
        fare,
        serviceType: 'flight',
        scheduleId: flight.scheduleId || flight._id
      } 
    });
    onClose();
  };

  const getBadgeColor = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'orange': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getButtonColor = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-600 hover:bg-blue-700';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700';
      case 'orange': return 'bg-orange-600 hover:bg-orange-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Flight Details and Fare Options available for you!</h2>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {flight.journey?.source?.split('(')[0]?.trim()} - {flight.journey?.destination?.split('(')[0]?.trim()}
              </span>
              <span className="text-gray-400">|</span>
              <span className="font-medium">{flight.flight?.airlineName || "Akasa Air"}</span>
              <span className="text-gray-400">|</span>
              <span>{flight.journey?.departureDate ? new Date(flight.journey.departureDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : "Mon, 6 Jul 26"}</span>
              <span className="text-gray-400">|</span>
              <span>Departure at {flight.journey?.departureTime ? formatTime(flight.journey.departureTime) : "20:10"}</span>
              <span>-</span>
              <span>Arrival at {flight.journey?.arrivalTime ? formatTime(flight.journey.arrivalTime) : "23:10"}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Fare Options Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {fareOptions.map((fare) => (
            <div key={fare.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
              {/* Price Header */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  MYR {fare.price} <span className="text-sm font-normal text-gray-500">per adult</span>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-gray-600 uppercase">{fare.type}</span>
                  {fare.discount && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getBadgeColor(fare.color)}`}>
                      {fare.discount}
                    </span>
                  )}
                </div>
                {fare.fareBy && (
                  <p className="text-xs text-gray-500 mt-1">{fare.fareBy}</p>
                )}
                {fare.originalPrice > fare.price && (
                  <p className="text-xs text-gray-400 line-through">MYR {fare.originalPrice}</p>
                )}
              </div>

              {/* Promo Code */}
              <div className={`flex items-center gap-2 p-2 rounded-lg mb-4 border ${getBadgeColor(fare.color)}`}>
                <span className="text-xs font-medium">
                  Get MYR 15.66 OFF on this booking using...
                </span>
                <span className="text-xs">ℹ</span>
              </div>

              {/* Baggage */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-900 mb-2">Baggage</h4>
                <ul className="space-y-1.5">
                  {fare.baggage.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Flexibility */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-900 mb-2">Flexibility</h4>
                <p className="text-xs text-gray-700 leading-relaxed">{fare.cancellation}</p>
                <p className="text-xs text-gray-700 leading-relaxed mt-1">{fare.dateChange}</p>
              </div>

              {/* Seats, Meals & More */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-900 mb-2">Seats, Meals & More</h4>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2 text-xs text-gray-700">
                    <Check size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{fare.seats}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-700">
                    <Check size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{fare.meals}</span>
                  </li>
                </ul>
              </div>

              {/* Benefits Included */}
              {fare.benefits && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-900 mb-2">BENEFITS INCLUDED</h4>
                  <ul className="space-y-1.5">
                    {fare.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                        <Check size={14} className="text-green-600 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price Drop Protection */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      Add Price Drop Protection at MYR {Math.round(fare.price * 0.03)}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">See a fare drop? We refund the difference.</p>
                  </div>
                </label>
              </div>

              {/* Book Now Button */}
              <button 
                onClick={() => handleBookNow(fare)}
                className={`w-full ${getButtonColor(fare.color)} text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors`}
              >
                BOOK NOW
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTime(timeValue) {
  if (!timeValue) return "--:--";
  const parts = String(timeValue).split(":");
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return timeValue;
}