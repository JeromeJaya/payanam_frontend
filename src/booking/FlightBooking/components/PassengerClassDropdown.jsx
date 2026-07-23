import { useRef, useState, useEffect, useMemo } from 'react';
import { Minus, Plus } from "lucide-react";

export default function PassengerClassDropdown({
  adults,
  children,
  infants,
  cabinClass,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onCabinClassChange
}) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const passengerClass = useMemo(() => {
    const parts = [`${adults} Adult${adults > 1 ? 's' : ''}`];
    if (children > 0) parts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
    if (infants > 0) parts.push(`${infants} Infant${infants > 1 ? 's' : ''}`);
    parts.push(cabinClass);
    return parts.join(', ');
  }, [adults, children, infants, cabinClass]);

  const updateCount = (setter, delta, max = 9) => {
    setter((prev) => {
      const newVal = prev + delta;
      if (newVal < 0 || newVal > max) return prev;
      return newVal;
    });
  };

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setShow(!show)}
        className="flex-1 min-w-[160px] bg-gray-50 border border-gray-200 rounded-lg p-1.5 md:p-2 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Passengers & Class</label>
        <div className="font-bold text-xs md:text-sm mt-0.5 text-gray-900 truncate">{passengerClass}</div>
      </div>
      {show && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 md:p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs md:text-sm font-medium text-gray-900">Adults</div>
                <div className="text-[10px] md:text-xs text-gray-500">12+ yrs</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateCount(onAdultsChange, -1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{adults}</span>
                <button
                  type="button"
                  onClick={() => updateCount(onAdultsChange, 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs md:text-sm font-medium text-gray-900">Children</div>
                <div className="text-[10px] md:text-xs text-gray-500">2-12 yrs</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateCount(onChildrenChange, -1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{children}</span>
                <button
                  type="button"
                  onClick={() => updateCount(onChildrenChange, 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs md:text-sm font-medium text-gray-900">Infants</div>
                <div className="text-[10px] md:text-xs text-gray-500">0-2 yrs</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateCount(onInfantsChange, -1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{infants}</span>
                <button
                  type="button"
                  onClick={() => updateCount(onInfantsChange, 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div>
              <div className="text-xs md:text-sm font-medium text-gray-900 mb-1">Cabin Class</div>
              <select
                value={cabinClass}
                onChange={(e) => onCabinClassChange(e.target.value)}
                className="w-full text-xs md:text-sm border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
