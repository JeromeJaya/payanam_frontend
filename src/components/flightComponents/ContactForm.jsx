export default function ContactForm({
  contactValidation,
  onMobileChange,
  onEmailChange,
  onCountryCodeChange,
  onBlur,
}) {
  const { mobile, email, countryCode, errors, touched } = contactValidation;

  return (
    <div className="border-t border-gray-200 pt-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">
        Booking details will be sent to
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Country Code
          </label>
          <select
            value={countryCode}
            onChange={onCountryCodeChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="91">India (91)</option>
            <option value="1">USA (1)</option>
            <option value="44">UK (44)</option>
            <option value="65">Singapore (65)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Mobile No *
          </label>
          <input
            type="tel"
            placeholder="10-digit mobile number"
            value={mobile}
            onChange={onMobileChange}
            onBlur={() => onBlur("mobile")}
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
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={onEmailChange}
            onBlur={() => onBlur("email")}
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
    </div>
  );
}
