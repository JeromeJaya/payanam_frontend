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
    <div className="w-full max-w-md h-auto rounded-3xl shadow-3xl bg-grey-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-3 md:p-4 my-1 flex-col">
      <h3 className="text-sm md:text-lg font-semibold mb-2 md:mb-4 text-gray-800 dark:text-slate-100">{title}</h3>

      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {text.map((txt) => (
          <button
            key={txt}
            type="button"
            onClick={() => handleSelect(txt)}
            className={`flex-1 min-w-[70px] md:min-w-[90px] flex items-center justify-center gap-2 py-1.5 md:py-2 rounded-xl border transition-all duration-300 text-[10px] md:text-sm ${
              selected === txt
                ? "border-blue-500 dark:border-blue-400 text-gray-800 dark:text-slate-200 bg-white dark:bg-slate-700 shadow-sm"
                : "border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400"
            }`}
          >
            <span>{txt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}