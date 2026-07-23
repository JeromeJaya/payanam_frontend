import { useState, useEffect, useMemo } from "react";
import { Plus, Save, CheckCircle } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ContactForm from "./ContactForm";
import PassengerCard from "./PassengerCard";

const indianStates = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

export default function TravellerDetails({ onContactValidation }) {
  const { isAuthenticated } = useAuth();
  const [adults, setAdults] = useState([]);
  const [countryCode, setCountryCode] = useState(() => sessionStorage.getItem("payanam_contact_countryCode") || "91");
  const [mobile, setMobile] = useState(() => sessionStorage.getItem("payanam_contact_mobile") || "");
  const [email, setEmail] = useState(() => sessionStorage.getItem("payanam_contact_email") || "");
  const [saveBilling, setSaveBilling] = useState(false);
  const [billingSaveStatus, setBillingSaveStatus] = useState(null);
  const [billingSaveMessage, setBillingSaveMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateMobile = (value) => {
    if (!value.trim()) return "Mobile number is required";
    const d = value.replace(/\D/g, "");
    if (d.length < 10) return "Mobile number must be at least 10 digits";
    if (d.length > 15) return "Mobile number cannot exceed 15 digits";
    return countryCode === "91" && !/^[6-9]\d{9}$/.test(d) ? "Invalid Indian mobile number" : "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email address";
  };

  const handleMobileChange = (e) => {
    const v = e.target.value.replace(/[^\d+\-\s()]/g, "");
    setMobile(v);
    sessionStorage.setItem("payanam_contact_mobile", v);
    setTouched((p) => ({ ...p, mobile: true }));
    setErrors((p) => ({ ...p, mobile: validateMobile(v) }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    sessionStorage.setItem("payanam_contact_email", e.target.value);
    setTouched((p) => ({ ...p, email: true }));
    setErrors((p) => ({ ...p, email: validateEmail(e.target.value) }));
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
    sessionStorage.setItem("payanam_contact_countryCode", e.target.value);
  };

  const handleBlur = (field) => {
    setTouched((p) => ({ ...p, [field]: true }));
    if (field === "mobile") setErrors((p) => ({ ...p, mobile: validateMobile(mobile) }));
    if (field === "email") setErrors((p) => ({ ...p, email: validateEmail(email) }));
  };

  const addAdult = () => setAdults((p) => [...p, { firstName: "", lastName: "", age: "", gender: "male" }]);

  const handlePassengerChange = (i, field, value) => setAdults((p) => p.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)));

  const validationState = useMemo(() => ({
    isValid: !errors.mobile && !errors.email && mobile.trim() && email.trim(),
    mobile, email, countryCode, errors,
  }), [mobile, email, countryCode, errors]);

  useEffect(() => {
    if (onContactValidation) onContactValidation(validationState);
  }, [onContactValidation, validationState]);

  const handleSaveBillingToProfile = async () => {
    if (!isAuthenticated) {
      setBillingSaveStatus("error");
      setBillingSaveMessage("Please login to save billing details.");
      return;
    }
    setBillingSaveStatus("saving");
    setBillingSaveMessage("");
    try {
      await api.put("/api/users/profile", { phoneNo: `+${countryCode}${mobile.replace(/\D/g, "")}`, email: email.trim() });
      setBillingSaveStatus("saved");
      setBillingSaveMessage("Billing details saved to your profile!");
    } catch (err) {
      console.error("Failed to save billing details:", err);
      setBillingSaveStatus("error");
      setBillingSaveMessage(err.response?.data?.message || "Failed to save. Please try again.");
    }
  };

  const btnStyle = billingSaveStatus === "saved" ? "bg-green-100 text-green-700 border border-green-300"
    : billingSaveStatus === "saving" ? "bg-gray-100 text-gray-500 cursor-wait border border-gray-200"
    : !mobile.trim() || !email.trim() ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
    : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Traveller Details</h3>

      {adults.length > 0 && (
        <div className="space-y-3 mb-4">
          {adults.map((passenger, index) => (
            <PassengerCard key={index} passenger={{ ...passenger, index }} onChange={handlePassengerChange} />
          ))}
        </div>
      )}

      <button type="button" onClick={addAdult} className="flex items-center gap-2 text-sm text-blue-600 font-semibold mb-4">
        <Plus size={16} /> Add Adult
      </button>

      <ContactForm
        contactValidation={{ mobile, email, countryCode, errors, touched }}
        onMobileChange={handleMobileChange}
        onEmailChange={handleEmailChange}
        onCountryCodeChange={handleCountryCodeChange}
        onBlur={handleBlur}
      />

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-start gap-2 mb-3">
          <input type="checkbox" id="gst" className="mt-1" />
          <label htmlFor="gst" className="text-sm text-gray-700">I have a GST number <span className="text-gray-500">(Optional)</span></label>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">Your State</h4>
        <p className="text-xs text-gray-600 mb-3">(Required for GST purpose on your tax invoice. You can edit this anytime later in your profile section.)</p>
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">Select the State</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Select a state</option>
            {indianStates.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" id="saveBilling" className="mt-1" checked={saveBilling}
            onChange={(e) => { setSaveBilling(e.target.checked); if (!e.target.checked) { setBillingSaveStatus(null); setBillingSaveMessage(""); } }} />
          <label htmlFor="saveBilling" className="text-sm text-gray-700">Confirm and save billing details to your profile</label>
        </div>

        {saveBilling && (
          <div className="mt-3 flex items-center gap-3">
            <button type="button" onClick={handleSaveBillingToProfile} disabled={billingSaveStatus === "saving" || !mobile.trim() || !email.trim()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${btnStyle}`}>
              {billingSaveStatus === "saving" ? (
                <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</>
              ) : billingSaveStatus === "saved" ? (
                <><CheckCircle size={16} /> Saved!</>
              ) : (
                <><Save size={16} /> Save to Profile</>
              )}
            </button>
            {billingSaveMessage && (
              <span className={`text-xs font-medium ${billingSaveStatus === "saved" ? "text-green-600" : billingSaveStatus === "error" ? "text-red-500" : "text-gray-500"}`}>
                {billingSaveMessage}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
