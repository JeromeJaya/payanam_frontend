import { useState, useEffect, useMemo, useCallback } from "react";
import { User, Plus, ChevronDown, Save, CheckCircle } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function TravellerDetails({ onContactValidation }) {
  const { isAuthenticated } = useAuth();
  
  const [adults, setAdults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Contact details state - restore from sessionStorage on mount
  const [countryCode, setCountryCode] = useState(() => sessionStorage.getItem("payanam_contact_countryCode") || "91");
  const [mobile, setMobile] = useState(() => sessionStorage.getItem("payanam_contact_mobile") || "");
  const [email, setEmail] = useState(() => sessionStorage.getItem("payanam_contact_email") || "");
  
  // Save billing details to profile state
  const [saveBilling, setSaveBilling] = useState(false);
  const [billingSaveStatus, setBillingSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
  const [billingSaveMessage, setBillingSaveMessage] = useState("");
  
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
    sessionStorage.setItem("payanam_contact_mobile", sanitized);
    setTouched(prev => ({ ...prev, mobile: true }));
    
    // Validate on change
    const error = validateMobile(sanitized);
    setErrors(prev => ({ ...prev, mobile: error }));
  };

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    sessionStorage.setItem("payanam_contact_email", value);
    setTouched(prev => ({ ...prev, email: true }));
    
    // Validate on change
    const error = validateEmail(value);
    setErrors(prev => ({ ...prev, email: error }));
  };

  // Handle country code change - persist to sessionStorage
  const handleCountryCodeChange = (e) => {
    const value = e.target.value;
    setCountryCode(value);
    sessionStorage.setItem("payanam_contact_countryCode", value);
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
  }, [mobile, email, countryCode, errors.mobile, errors.email]);

  // Notify parent component about validation state
  useEffect(() => {
    if (onContactValidation) {
      onContactValidation(validationState);
    }
  }, [validationState.isValid, validationState.mobile, validationState.email, validationState.countryCode]);

  // Save billing details to user profile
  const handleSaveBillingToProfile = async () => {
    if (!isAuthenticated) {
      setBillingSaveStatus("error");
      setBillingSaveMessage("Please login to save billing details.");
      return;
    }

    setBillingSaveStatus("saving");
    setBillingSaveMessage("");

    try {
      // Build the phone number with country code
      const phoneNumber = `+${countryCode}${mobile.replace(/\D/g, "")}`;

      await api.put("/api/users/profile", {
        phoneNo: phoneNumber,
        email: email.trim(),
      });

      setBillingSaveStatus("saved");
      setBillingSaveMessage("Billing details saved to your profile!");
    } catch (err) {
      console.error("Failed to save billing details:", err);
      setBillingSaveStatus("error");
      setBillingSaveMessage(err.response?.data?.message || "Failed to save. Please try again.");
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Traveller Details</h3>
     

      {/* Contact Details */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Booking details will be sent to</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Country Code</label>
            <select 
              value={countryCode}
              onChange={handleCountryCodeChange}
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
              className={`w-full border rounded-lg px-3 py-2 text-sm ${
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
              className={`w-full border rounded-lg px-3 py-2 text-sm ${
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

       {/* State Selection - Only show if there are multiple states to choose from */}
       <div className="border-t border-gray-200 pt-4">
         <h4 className="text-sm font-semibold text-gray-900 mb-1">Your State</h4>
         <p className="text-xs text-gray-600 mb-3">(Required for GST purpose on your tax invoice. You can edit this anytime later in your profile section.)</p>
         
         <div className="mb-3">
           <label className="block text-xs font-medium text-gray-700 mb-1">Select the State</label>
           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" disabled>
             <option>Tamil Nadu</option>
           </select>
           <p className="text-xs text-gray-500 mt-1">More states will be added soon</p>
         </div>

         <div className="flex items-start gap-2">
           <input 
             type="checkbox" 
             id="saveBilling" 
             className="mt-1" 
             checked={saveBilling}
             onChange={(e) => {
               setSaveBilling(e.target.checked);
               // Reset status when unchecked
               if (!e.target.checked) {
                 setBillingSaveStatus(null);
                 setBillingSaveMessage("");
               }
             }}
           />
           <label htmlFor="saveBilling" className="text-sm text-gray-700">
             Confirm and save billing details to your profile
           </label>
         </div>

         {/* Save Billing Button & Status */}
         {saveBilling && (
           <div className="mt-3 flex items-center gap-3">
             <button
               type="button"
               onClick={handleSaveBillingToProfile}
               disabled={billingSaveStatus === "saving" || !mobile.trim() || !email.trim()}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                 billingSaveStatus === "saved"
                   ? "bg-green-100 text-green-700 border border-green-300"
                   : billingSaveStatus === "saving"
                   ? "bg-gray-100 text-gray-500 cursor-wait border border-gray-200"
                   : !mobile.trim() || !email.trim()
                   ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                   : "bg-blue-600 text-white hover:bg-blue-700"
               }`}
             >
               {billingSaveStatus === "saving" ? (
                 <>
                   <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                   Saving...
                 </>
               ) : billingSaveStatus === "saved" ? (
                 <>
                   <CheckCircle size={16} />
                   Saved!
                 </>
               ) : (
                 <>
                   <Save size={16} />
                   Save to Profile
                 </>
               )}
             </button>
             {billingSaveMessage && (
               <span className={`text-xs font-medium ${
                 billingSaveStatus === "saved" ? "text-green-600" : billingSaveStatus === "error" ? "text-red-500" : "text-gray-500"
               }`}>
                 {billingSaveMessage}
               </span>
             )}
           </div>
         )}
       </div>
    </div>
  );
}