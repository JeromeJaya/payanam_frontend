function formatTime(timeValue) {
  if (!timeValue) return "--:--";
  const parts = String(timeValue).split(":");
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return timeValue;
}

export default function FlightTimeline({ departureTime, departureLocation, departureIATA, arrivalTime, arrivalLocation, arrivalIATA, durationText, stopsCount, layovers }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <div className="text-2xl font-bold text-gray-900">{formatTime(departureTime)}</div>
          <div className="text-sm text-gray-600 font-medium">{departureLocation}</div>
          {departureIATA && <div className="text-xs text-gray-500">({departureIATA})</div>}
        </div>
        
        <div className="flex-1 mx-4 text-center">
          <div className="text-sm text-gray-500 font-medium">{durationText}</div>
          <div className="relative my-2">
            <div className="w-full h-1 bg-gray-300 rounded-full"></div>
            {stopsCount > 0 && <div className="absolute w-2 h-2 bg-orange-500 rounded-full border-2 border-white" style={{ left: '50%', top: '-3px' }}></div>}
          </div>
          <div className="text-xs text-blue-600 font-medium">{stopsCount === 0 ? 'Non-stop' : `${stopsCount} stop(s)`}</div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{formatTime(arrivalTime)}</div>
          <div className="text-sm text-gray-600 font-medium">{arrivalLocation}</div>
          {arrivalIATA && <div className="text-xs text-gray-500">({arrivalIATA})</div>}
        </div>
      </div>
    </div>
  );
}