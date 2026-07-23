export default function FlightSeatPreview({ seatLayoutLength }) {
  if (seatLayoutLength === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
        Seat Layout Preview
      </h3>
      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="text-sm text-slate-600 mb-2">
          Total seats generated: <span className="font-bold text-slate-900">{seatLayoutLength}</span>
        </p>
        <p className="text-xs text-slate-500">
          Seat layout will be automatically generated based on cabin class configuration. 
          You can customize individual seat fares after creation.
        </p>
      </div>
    </div>
  );
}
