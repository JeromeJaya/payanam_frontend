import { useState, useEffect } from "react";

export default function SingleSeaterFilter({ title, text, value = {}, onChange }) {
  const items = Array.isArray(text) ? text : typeof text === "string" ? [text] : [];

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
  }, [items, onChange]);

  const handleToggle = (item) => {
    if (!onChange) return;
    onChange((prev) => ({ ...prev, [item]: !prev[item] }));
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
          <div
            className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-200 ${
              value[txt] ? "border-blue-600 bg-blue-600" : "border-gray-400"
            }`}
          >
            {value[txt] && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
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
