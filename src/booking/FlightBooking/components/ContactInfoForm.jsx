import { Mail, Phone } from "lucide-react";

export default function ContactInfoForm({
  email,
  phone,
  onEmailChange,
  onPhoneChange,
  errors,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
      <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-4">
        Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Email *
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Enter email address"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                errors?.email
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-slate-600"
              } bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
            />
            {errors?.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Phone Number *
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="Enter phone number"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                errors?.phone
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-slate-600"
              } bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
            />
            {errors?.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
