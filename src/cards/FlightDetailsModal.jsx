import { useState } from 'react';
import { X, Clock, Luggage, ShieldAlert, Receipt } from 'lucide-react';

export default function FlightDetailsModal({ isOpen, onClose, flightData }) {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen) return null;

  // Fallback defaults to keep the component safe if props are missing
  const data = flightData || {
    airlineName: "IndiGo",
    flightNumber: "6E 6490",
    aircraft: "Airbus A320",
    departureTime: "04:55",
    departureDate: "Tue, 30 Jun 2026",
    departureAirport: "Indira Gandhi Intl Airport, Terminal 3",
    departureCity: "New Delhi",
    arrivalTime: "10:10",
    arrivalDate: "Tue, 30 Jun 2026",
    arrivalAirport: "Chhatrapati Shivaji Intl Airport, Terminal 2",
    arrivalCity: "Mumbai",
    duration: "05h 15m",
    layover: "1h 10m stop via Indore (IDR)",
    baggage: { checkIn: "15 kg (1 piece)", cabin: "7 kg (1 piece)" },
    fare: { base: 5200, taxes: 1242, total: 6442 }
  };

  const tabs = [
    { id: 'details', label: 'Flight Details', icon: Clock },
    { id: 'baggage', label: 'Baggage Policy', icon: Luggage },
    { id: 'fare', label: 'Fare Summary', icon: Receipt },
    { id: 'cancellation', label: 'Cancellation', icon: ShieldAlert },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      {/* Modal Container */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4 bg-gray-50">
          <div>
            <h3 className="font-black text-lg text-gray-900">Flight Details</h3>
            <p className="text-xs text-gray-500 font-medium">
              {data.departureCity} → {data.arrivalCity} | {data.departureDate}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="flex border-b border-gray-200 bg-white px-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider relative transition-all whitespace-nowrap ${
                  isActive ? 'text-blue-600 font-black' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon size={15} />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-t" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Inner Panel Viewport */}
        <div className="p-6 overflow-y-auto flex-1 bg-white text-sm text-gray-700">
          
          {/* TAB 1: FLIGHT DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Route Segment segment */}
              <div className="flex items-start gap-4">
                {/* Visual Timeline Bar */}
                <div className="flex flex-col items-center justify-between h-32 py-1 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <div className="w-[2px] flex-1 bg-dashed bg-gray-300 my-1 border-l-2 border-dashed border-gray-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                </div>

                {/* Left Origin / Right Destination Segment Grid */}
                <div className="flex-1 space-y-8">
                  {/* Departure Point */}
                  <div className="grid grid-cols-[80px_1fr] gap-2">
                    <div>
                      <span className="text-lg font-black text-gray-900 block">{data.departureTime}</span>
                      <span className="text-xs text-gray-400 font-medium">{data.departureDate}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">{data.departureCity}</span>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{data.departureAirport}</p>
                    </div>
                  </div>

                  {/* Mid Segment Info (Airline / Duration) */}
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between text-xs my-2 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-900 rounded flex items-center justify-center text-white font-bold text-[10px]">6E</div>
                      <div>
                        <span className="font-bold text-gray-900 block">{data.airlineName} · {data.flightNumber}</span>
                        <span className="text-gray-400 font-medium">{data.aircraft}</span>
                      </div>
                    </div>
                    <div className="text-right font-medium text-gray-500">
                      Duration: <span className="font-bold text-gray-800">{data.duration}</span>
                    </div>
                  </div>

                  {/* Arrival Point */}
                  <div className="grid grid-cols-[80px_1fr] gap-2 pt-1">
                    <div>
                      <span className="text-lg font-black text-gray-900 block">{data.arrivalTime}</span>
                      <span className="text-xs text-gray-400 font-medium">{data.arrivalDate}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">{data.arrivalCity}</span>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{data.arrivalAirport}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layover Alert Bar Info */}
              {data.layover && (
                <div className="bg-amber-50 text-amber-900 text-xs px-4 py-2 rounded border border-amber-100 font-medium flex items-center gap-2">
                  <Clock size={14} className="text-amber-600" />
                  <span>{data.layover}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BAGGAGE POLICY */}
          {activeTab === 'baggage' && (
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="p-3">Baggage Type</th>
                    <th className="p-3">Check-In Limit</th>
                    <th className="p-3">Cabin Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-medium">
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900">Adult Passenger</td>
                    <td className="p-3 text-gray-600">{data.baggage.checkIn}</td>
                    <td className="p-3 text-gray-600">{data.baggage.cabin}</td>
                  </tr>
                </tbody>
              </table>
              <div className="p-3 bg-gray-50 text-[11px] text-gray-400 font-medium border-t border-gray-100">
                *Note: Additional baggage fees apply for overweight or extra luggage allocations natively.
              </div>
            </div>
          )}

          {/* TAB 3: FARE SUMMARY */}
          {activeTab === 'fare' && (
            <div className="max-w-md space-y-3 bg-gray-50 border border-gray-200 rounded-xl p-4 mx-auto">
              <h4 className="font-bold text-sm text-gray-800 border-b border-gray-200 pb-2">Price Breakdown</h4>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-500">Base Fare (1 Adult)</span>
                <span className="font-semibold text-gray-900">₹ {data.fare.base.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-medium border-b border-gray-200 pb-3">
                <span className="text-gray-500">Taxes, Fees & Surcharges</span>
                <span className="font-semibold text-gray-900">₹ {data.fare.taxes.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-1">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-blue-600 text-base">₹ {data.fare.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* TAB 4: CANCELLATION RULES */}
          {activeTab === 'cancellation' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-100 text-red-900 text-xs px-4 py-2.5 rounded font-medium">
                Cancellation charges are dynamic and based on how close you cancel relative to the scheduled departure time slot.
              </div>
              <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 font-bold border-b border-gray-200 text-gray-500">
                    <th className="p-3">Timeframe Before Departure</th>
                    <th className="p-3 text-right">Cancellation Fee Penalty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  <tr>
                    <td className="p-3 text-gray-600">0 hours to 4 hours</td>
                    <td className="p-3 text-right text-red-600 font-bold">Non-Refundable</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-600">4 hours to 4 days</td>
                    <td className="p-3 text-right text-gray-900 font-bold">₹ 3,500</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-600">4 days to 30 days</td>
                    <td className="p-3 text-right text-gray-900 font-bold">₹ 3,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}