import { Bus, Wifi, BatteryCharging, Bed, Droplets, BookOpen, MapPin, ShieldAlert, Video } from "lucide-react";

const amenityIcons = {
  "WiFi": Wifi,
  "Charging Point": BatteryCharging,
  "Blanket": Bed,
  "Water Bottle": Droplets,
  "Reading Light": BookOpen,
  "GPS Tracking": MapPin,
  "Emergency Exit": ShieldAlert,
  "CCTV": Video,
};

export default function BusAmenitiesSection({ bus }) {
  return (
    <>
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3">Features</h4>
        <div className="flex flex-wrap gap-2">
          {bus.isAC && <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">AC</span>}
          {bus.isSleeper && <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">Sleeper</span>}
          {bus.isSeater && <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">Seater</span>}
          {bus.isGPSAvailable && <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold">GPS</span>}
          {bus.isLiveTrackingEnabled && <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">Live Tracking</span>}
        </div>
      </div>

      {bus.amenities && bus.amenities.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3">Amenities</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {bus.amenities.map((amenity, idx) => {
              const Icon = amenityIcons[amenity] || Bus;
              return (
                <div key={idx} className="flex items-center gap-2 bg-lime-50 rounded-lg px-3 py-2">
                  <Icon className="w-4 h-4 text-lime-600" />
                  <span className="text-xs font-semibold text-lime-800">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
