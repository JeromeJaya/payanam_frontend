import { useState } from "react";
import { Tag, Check, X } from "lucide-react";

export default function CouponsOffers({ onCouponApplied, totalAmount }) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [status, setStatus] = useState(null); // null | 'invalid' | 'applied'
  
  const availableCoupons = [
    {
      id: 1,
      code: "MMTC15",
      description: "Get 15% OFF (max ₹500) on this booking",
    }
  ];

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );
    if (!coupon) {
      setStatus("invalid");
      setAppliedCoupon(null);
      if (onCouponApplied) onCouponApplied(null);
      return;
    }
    const discount = Math.min(totalAmount * 0.15, 500);
    setAppliedCoupon({ ...coupon, discount });
    setStatus("applied");
    if (onCouponApplied) onCouponApplied({ code: coupon.code, discount });
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setStatus(null);
    if (onCouponApplied) onCouponApplied(null);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 rounded-lg p-3 sm:p-5 mb-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 rounded-lg flex items-center justify-center">
          <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-gray-900">Coupons and Offers</h3>
      </div>

      {status === "applied" ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-green-700 truncate">{appliedCoupon.code} applied!</span>
            <span className="text-[10px] sm:text-xs text-green-600 shrink-0">-₹{appliedCoupon.discount.toFixed(0)}</span>
          </div>
          <button onClick={handleRemoveCoupon} className="p-1 hover:bg-green-100 rounded shrink-0">
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
            <div className="flex gap-1.5 sm:gap-2">
              <input 
                type="text" 
                placeholder="Enter code" 
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value); setStatus(null); }}
                className="flex-1 border border-gray-300 rounded-lg px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 min-w-0"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim()}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Apply
              </button>
            </div>
            {status === "invalid" && (
              <p className="mt-1 text-xs text-red-500">Invalid coupon code</p>
            )}
          </div>

          <div className="space-y-2 sm:space-y-3">
            {availableCoupons.map((coupon) => (
              <div 
                key={coupon.id} 
                className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 flex items-center justify-between hover:shadow-md transition-shadow gap-2"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600">
                      <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{coupon.code}</p>
                    <p className="text-[10px] sm:text-xs text-gray-600 truncate">{coupon.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setCouponCode(coupon.code); setStatus(null); }}
                  className="text-blue-600 text-xs sm:text-sm font-bold hover:text-blue-700 whitespace-nowrap shrink-0"
                >
                  APPLY
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}