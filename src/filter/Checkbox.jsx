import { useState, useEffect, useMemo } from "react";

export default function SingleSeaterFilter({ title, text, value = {}, onChange, type = "multiple" }) {
  // Memoize items to prevent the useEffect from re-running on every render 
  // since an array literal [...] creates a new reference each time.
  const items = useMemo(() => {
    return Array.isArray(text) ? text : typeof text === "string" ? [text] : [];
  }, [text]);

  useEffect(() => {
    if (!onChange) return;
    const missing = items.filter((it) => !(it in value));
    if (missing.length > 0) {
      onChange((prev) => {
        const next = { ...prev };
        missing.forEach((it) => { if (!(it in next)) next[it] = false; });
        return next;
      });
    }
  }, [items, onChange, value]);

  const handleToggle = (item) => {
    if (!onChange) return;

    onChange((prev) => {
      // If single select mode
      if (type === "single") {
        const next = {};
        // Set all known items to false except the toggled one
        items.forEach((it) => {
          next[it] = it === item ? !prev[item] : false;
        });
        return { ...prev, ...next };
      }

      // Default: multiple select mode
      return { ...prev, [item]: !prev[item] };
    });
  };

  return (
    <div className="h-auto rounded-3xl shadow-3xl bg-grey-50 hover:bg-slate-200 p-3">
      <h2 className="text-lg font-semibold text-gray-700 mb-5">{title}</h2>
      {items.map((txt, index) => (
        <div
          key={index}
          onClick={() => handleToggle(txt)}
          className="flex items-start gap-4 cursor-pointer mb-3"
        >
          {/* Changed rounding behavior slightly based on type for better UX (circle for radio/single) */}
          <div
            className={`w-5 h-5 border flex items-center justify-center transition-all duration-200 ${
              type === "single" ? "rounded-full" : "rounded"
            } ${
              value[txt] ? "border-blue-600 bg-blue-600" : "border-gray-400"
            }`}
          >
            {value[txt] && (
              type === "single" ? (
                // Radio style inner dot for single selection
                <div className="w-2 h-2 bg-white rounded-full" />
              ) : (
                // Checkmark for multiple selection
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )
            )}
          </div>
          <div className="min-w-0">
            {txt.split("\n").map((line, i) =>
              i === 0 ? (
                <h3 key={i} className="font-semibold text-gray-700">{line}</h3>
              ) : (
                <p key={i} className="text-xs text-gray-500 leading-tight">{line}</p>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}