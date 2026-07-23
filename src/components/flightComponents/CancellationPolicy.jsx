export default function CancellationPolicy({ cancellation, dateChange }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Flexibility</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-700">{cancellation}</p>
        <p className="text-sm text-gray-700">{dateChange}</p>
      </div>
    </div>
  );
}