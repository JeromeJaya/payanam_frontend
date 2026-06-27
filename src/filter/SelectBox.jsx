import { useState } from "react";

export default function SelectBox({ title, text = [], value, onChange }) {
  const [internalSelected, setInternalSelected] = useState(text[0] ?? "");
  const selected = value !== undefined ? value : internalSelected;

  const handleSelect = (option) => {
    if (value === undefined) {
      setInternalSelected(option);
    }
    if (typeof onChange === "function") {
      onChange(option);
    }
  };

  return (
    <div className="w-full max-w-md h-auto rounded-3xl shadow-3xl bg-grey-50 hover:bg-slate-200 p-4 my-1 flex-col">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="flex flex-wrap gap-2">
        {text.map((txt) => (
          <button
            key={txt}
            type="button"
            onClick={() => handleSelect(txt)}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-2 py-2 rounded-xl border transition-all duration-300 ${
              selected === txt
                ? "border-blue-500 text-gray-800 bg-white shadow-sm"
                : "border-gray-300 text-gray-500"
            }`}
          >
            {/* <Snowflake size={18} /> */}
            <span>{txt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
