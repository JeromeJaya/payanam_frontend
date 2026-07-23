import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";

export default function TravellerDetails({ onContactValidation }) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Contact details state
  const [countryCode, setCountryCode] = useState("91");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [selectedState, setSelectedState] = useState("");
  
  // Validation errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateMobile = (value) => {
    if (!value.trim()) {
      return "Mobile number is required";
    }
    // Remove any non-digit characters for validation
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      return "Mobile number must be at least 10 digits";
    }
    if (digitsOnly.length > 15) {
      return "Mobile number cannot exceed 15 digits";
    }
    // Indian mobile number validation (starts with 6-9)
    if (countryCode === "91" && !/^[6-9]\d{9}$/.test(digitsOnly)) {
      return "Invalid Indian mobile number";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email is required";
    }
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Handle mobile change with validation
  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Only allow digits and common separators
    const sanitized = value.replace(/[^\d+\-\s()]/g, "");
    setMobile(sanitized);
    setTouched(prev => ({ ...prev, mobile: true }));
    
    // Validate on change
    const error = validateMobile(sanitized);
    setErrors(prev => ({ ...prev, mobile: error }));
  };

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setTouched(prev => ({ ...prev, email: true }));
    
    // Validate on change
    const error = validateEmail(value);
    setErrors(prev => ({ ...prev, email: error }));
  };

  // Handle blur (when field loses focus)
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === "mobile") {
      const error = validateMobile(mobile);
      setErrors(prev => ({ ...prev, mobile: error }));
    } else if (field === "email") {
      const error = validateEmail(email);
      setErrors(prev => ({ ...prev, email: error }));
    }
  };

  const addAdult = () => {
    setShowAddForm(true);
  };

  // Compute validation state - memoized to prevent unnecessary recalculations
  const validationState = useMemo(() => {
    const isValid = !errors.mobile && !errors.email && mobile.trim() && email.trim();
    return {
      isValid,
      mobile,
      email,
      countryCode,
      errors
    };
  }, [mobile, email, countryCode, errors]);

  // Notify parent component about validation state
  useEffect(() => {
    if (onContactValidation) {
      onContactValidation(validationState);
    }
  }, [onContactValidation, validationState]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Traveller Details</h3>

      {/* Adult Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-900">ADULT (12 yrs+)</h4>
          <span className="text-sm text-gray-600">0/1 added</span>
        </div>
        
        {!showAddForm && (
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
            <select 
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="91">India (91)</option>
              <option value="1">USA (1)</option>
              <option value="44">UK (44)</option>
              <option value="65">Singapore (65)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mobile No *</label>
            <input 
              type="tel" 
              placeholder="10-digit mobile number" 
              value={mobile}
              onChange={handleMobileChange}
              onBlur={() => handleBlur("mobile")}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none ${
                touched.mobile && errors.mobile 
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {touched.mobile && errors.mobile && (
              <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur("email")}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none ${
                touched.email && errors.email 
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
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
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select your state</option>
            {["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"].map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
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