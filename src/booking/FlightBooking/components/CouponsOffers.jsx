import { useState } from "react";
import { Tag } from "lucide-react";

export default function CouponsOffers() {
  const [couponCode, setCouponCode] = useState("");
  
  // Mock coupon data
  const availableCoupons = [
    {
      id: 1,
      code: "MMTC15",
      discount: "15% OFF",
      description: "Get MYR 15.66 OFF on this booking",
      color: "blue"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 rounded-lg p-5 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
          <Tag className="w-5 h-5 text-amber-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900">Coupons and Offers</h3>
      </div>

      {/* Coupon Input */}
      <div className="bg-white rounded-lg p-3 mb-4">
        <input 
          type="text" 
          placeholder="Enter coupon code" 
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Available Coupons */}
      <div className="space-y-3">
        {availableCoupons.map((coupon) => (
          <div 
            key={coupon.id} 
            className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600">
                  <Tag className="w-5 h-5" />
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{coupon.code}</p>
                <p className="text-xs text-gray-600">{coupon.description}</p>
              </div>
            </div>
            <button 
              onClick={() => setCouponCode(coupon.code)}
              className="text-blue-600 text-sm font-bold hover:text-blue-700 whitespace-nowrap"
            >
              APPLY
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}