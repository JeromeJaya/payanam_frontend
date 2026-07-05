import {AlertTriangle,  CheckCircle } from "lucide-react";

export default function ImportantInfo() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-bold text-gray-900">Important Information</h3>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Get a quick summary, just ask Myra!</span>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <h4 className="text-sm font-semibold text-gray-900">Check travel guidelines and baggage information below:</h4>
          </div>
          <ul className="space-y-1.5 ml-6">
            <li className="text-sm text-gray-700 list-disc">
              Carry no more than 1 check-in baggage and 1 hand baggage per passenger. If violated, airline may levy extra charges.
            </li>
            <li className="text-sm text-gray-700 list-disc">
              Please note, the check-in counters will close 60 minutes before departure and late arrivals may be denied boarding.
            </li>
          </ul>
        </div>

        <div>
          <div className="flex items-start gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <h4 className="text-sm font-semibold text-gray-900">Availability of Boarding Pass:</h4>
          </div>
          <p className="text-sm text-gray-700 ml-6">
            Once web check-in is completed, your boarding pass will be available within 6 hours of your flight departure.
          </p>
        </div>

        <div>
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <h4 className="text-sm font-semibold text-gray-900">Unaccompanied Minors Travelling:</h4>
          </div>
          <ul className="space-y-1.5 ml-6">
            <li className="text-sm text-gray-700 list-disc">
              An unaccompanied minor usually refers to a child traveling without an adult aged 18 or older.
            </li>
            <li className="text-sm text-gray-700 list-disc">
              Please check with the airline for their rules and regulations regarding unaccompanied minors, as these can differ between airlines.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}