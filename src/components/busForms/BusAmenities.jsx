const AMENITIES_OPTIONS = [
  "WiFi",
  "Charging Point",
  "Blanket",
  "Water Bottle",
  "Reading Light",
  "GPS Tracking",
  "Emergency Exit",
  "CCTV"
];

export default function BusAmenities({ selectedAmenities, handleAmenityToggle }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
        Amenities
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {AMENITIES_OPTIONS.map(amenity => (
          <label
            key={amenity}
            className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
              selectedAmenities.includes(amenity)
                ? "border-lime-500 bg-lime-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedAmenities.includes(amenity)}
              onChange={() => handleAmenityToggle(amenity)}
              className="w-4 h-4 text-lime-600 border-slate-300 rounded focus:ring-lime-500"
            />
            <span className="text-sm font-medium text-slate-700">{amenity}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
