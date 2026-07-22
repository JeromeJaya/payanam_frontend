import { useState } from "react";

export default function SelectBox({ title, text = [], value, onChange }) {
  const [internalSelected, setInternalSelected] = useState(text[0] ?? "");
  const selected = value !== undefined ? value : internalSelected;

  const handleChange = (e) => {
    const option = e.target.value;
    if (value === undefined) {
      setInternalSelected(option);
    }
    if (typeof onChange === "function") {
      onChange(option);
    }
  };

  return (
    <div className="w-full max-w-md h-auto rounded-3xl shadow-3xl bg-grey-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-3 md:p-4 my-1 flex-col">
      <label className="text-sm md:text-lg font-semibold mb-2 md:mb-4 text-gray-800 dark:text-slate-100 block">{title}</label>

      <select
        value={selected}
        onChange={handleChange}
        className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 text-sm md:text-base transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {text.map((txt) => (
          <option key={txt} value={txt}>
            {txt === "ANY" ? "Any" : txt.replace(/_/g, " ").toLowerCase().replace(/^./, (c) => c.toUpperCase())}
          </option>
        ))}
      </select>
    </div>
  );
}