import { useState, useEffect, useMemo } from "react";

export default function SingleSeaterFilter({ title, text, value = {}, onChange, type = "multiple" }) {
  // Memoize items to prevent the useEffect from re-running on every render 
  const items = useMemo(() => {
    return Array.isArray(text) ? text : typeof text === "string" ? [text] : [];
  }, [text]);

  // Safely backfill missing properties without tracking 'value' directly to prevent render thrashing
  useEffect(() => {
    if (!onChange) return;
    const missing = items.filter((it) => !(it in value));
    if (missing.length > 0) {
      onChange((prev) => {
        const next = { ...prev };
        let updated = false;
        missing.forEach((it) => { 
          if (!(it in next)) {
            next[it] = false;
            updated = true;
          }
        });
        return updated ? next : prev;
      });
    }
  }, [items, onChange]);

  const handleToggle = (item) => {
    if (!onChange) return;

    onChange((prev) => {
      if (type === "single") {
        const next = {};
        items.forEach((it) => {
          next[it] = it === item ? !prev[it] : false;
        });
        return { ...prev, ...next };
      }
      return { ...prev, [item]: !prev[item] };
    });
  };

  return (
    /* Enforces a stable min-width on the component so it never collapses into a narrow vertical strip */
    <div className="w-full min-w-[240px] h-auto rounded-xl sm:rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-3 shadow-sm transition-all">
      <h2 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-slate-200 mb-2.5 tracking-wide uppercase text-left truncate">
        {title}
      </h2>
      
      {/* Scroll-safe wrapper container */}
      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
        {items.map((txt, index) => (
          <div
            key={index}
            onClick={() => handleToggle(txt)}
            className="flex items-start gap-2.5 cursor-pointer select-none group p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors duration-150 w-full min-w-0"
          >
            {/* Control Wrapper (Checkbox / Radio Indicator) */}
            {/* Added explicit min-w-4 (min-width: 1rem) so layout engines can't shrink the checkbox down */}
            <div
              className={`w-4 h-4 md:w-4.5 md:h-4.5 border flex items-center justify-center transition-all duration-200 shrink-0 min-w-[16px] mt-0.5 ${
                type === "single" ? "rounded-full" : "rounded-md"
              } ${
                value[txt] 
                  ? "border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-500 shadow-sm" 
                  : "border-gray-300 dark:border-slate-600 group-hover:border-gray-400 dark:group-hover:border-slate-500 bg-white dark:bg-slate-700"
              }`}
            >
              {value[txt] && (
                type === "single" ? (
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                ) : (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )
              )}
            </div>

            {/* Text Content Block */}
            <div className="min-w-0 flex-1 break-words text-left">
              {txt.split("\n").map((line, i) =>
                i === 0 ? (
                  <h3 key={i} className="font-semibold text-gray-700 dark:text-slate-300 text-xs md:text-sm leading-snug">
                    {line}
                  </h3>
                ) : (
                  <p key={i} className="text-[10px] md:text-xs text-gray-500 dark:text-slate-400 leading-normal mt-0.5 whitespace-pre-line">
                    {line}
                  </p>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}