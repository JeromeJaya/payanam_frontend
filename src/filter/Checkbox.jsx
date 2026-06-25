import { useState } from "react";

export default function SingleSeaterFilter({ title, text }) {
  const [checkedItems, setCheckedItems] = useState({});

  const handleToggle = (item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <div className="h-auto rounded-3xl shadow-3xl bg-grey-50 hover:bg-slate-200 p-3">
      <h2 className="text-lg font-semibold text-gray-700 mb-5">
        {title}
      </h2>

      {text.map((txt, index) => (
        <div
          key={index}
          onClick={() => handleToggle(txt)}
          className="flex items-start gap-4 cursor-pointer mb-3"
        >
          <div
            className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-200 ${
              checkedItems[txt]
                ? "border-blue-600 bg-blue-600"
                : "border-gray-400"
            }`}
          >
            {checkedItems[txt] && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">{txt}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}