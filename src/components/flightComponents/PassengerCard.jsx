import { User } from "lucide-react";

export default function PassengerCard({ passenger, onChange }) {
  const { index, firstName, lastName, age, gender } = passenger;

  const handleFieldChange = (field) => (e) => {
    onChange(index, field, e.target.value);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <User size={16} className="text-gray-500" />
        <span className="text-sm font-semibold text-gray-900">
          Adult {index + 1}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={handleFieldChange("firstName")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={handleFieldChange("lastName")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Age *
          </label>
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={handleFieldChange("age")}
            min="1"
            max="120"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Gender *
          </label>
          <select
            value={gender}
            onChange={handleFieldChange("gender")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
