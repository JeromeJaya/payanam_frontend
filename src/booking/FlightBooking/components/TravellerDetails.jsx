import { useState } from "react";
import { User, Plus, ChevronDown } from "lucide-react";

export default function TravellerDetails() {
  const [adults, setAdults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const addAdult = () => {
    setShowAddForm(true);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Traveller Details</h3>

      {/* Adult Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-900">ADULT (12 yrs+)</h4>
          <span className="text-sm text-gray-600">{adults.length}/1 added</span>
        </div>
        
        {adults.length === 0 && (
          <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-3">You have not added any adults to the list</p>
            {!showAddForm && (
              <button 
                onClick={addAdult}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1 mx-auto"
              >
                <Plus size={16} />
                ADD NEW ADULT
              </button>
            )}
          </div>
        )}
      </div>

      {/* Contact Details */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Booking details will be sent to</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Country Code</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>India (91)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mobile No</label>
            <input 
              type="tel" 
              placeholder="Mobile No" 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* GST Number */}
        <div className="flex items-start gap-2 mb-3">
          <input type="checkbox" id="gst" className="mt-1" />
          <label htmlFor="gst" className="text-sm text-gray-700">
            I have a GST number <span className="text-gray-500">(Optional)</span>
          </label>
        </div>
      </div>

      {/* State Selection */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">Your State</h4>
        <p className="text-xs text-gray-600 mb-3">(Required for GST purpose on your tax invoice. You can edit this anytime later in your profile section.)</p>
        
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">Select the State</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Tamil Nadu</option>
          </select>
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" id="saveBilling" className="mt-1" />
          <label htmlFor="saveBilling" className="text-sm text-gray-700">
            Confirm and save billing details to your profile
          </label>
        </div>
      </div>
    </div>
  );
}