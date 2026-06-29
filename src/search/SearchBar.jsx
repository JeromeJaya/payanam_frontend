import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ input, service }) {
  const navigate = useNavigate();
  const s = input?.length || 0;
  const inputRef = useRef({});
  const today = new Date().toISOString().split("T")[0];
  const day = String(new Date()).slice(0, 3);

  const serviceBooking = "/"+service+"booking"
  console.log(serviceBooking)

  const handleSearch = () => {
    const formData = {};
    Object.keys(inputRef.current).forEach((key) => {
      formData[key] = inputRef.current[key]?.value || "";
    });
    navigate(serviceBooking, { state: { searchData: formData } });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: s <= 2 ? "1fr" : "repeat(2, minmax(0, 1fr))",
        }}
      >
        {input.map((field, idx) => {
          const inputValue = field.type === "date" ? today : field.mid;
          const todayDay = field.type === "date" ? day : field.below;
          const isLast = idx === s - 1;
          const isOdd = idx % 2 !== 0;
          return (
            <div
              key={idx}
              className={`
                p-4 sm:p-5
                ${!isLast && s > 2 && !isOdd ? "border-r border-slate-200" : ""}
                ${idx >= 2 && s > 2 ? "border-t border-slate-200" : ""}
              `}
            >
              <label className="block text-slate-500 text-sm font-medium mb-1.5" htmlFor={field.name}>
                {field.label}
              </label>
              <input
                id={field.name}
                className="w-full text-lg sm:text-xl font-semibold bg-transparent outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-1"
                placeholder={field.mid}
                type={field.type || "text"}
                defaultValue={inputValue}
                ref={(el) => { inputRef.current[field.name] = el; }}
                aria-label={field.label}
              />
              <p className="text-slate-500 mt-1 text-xs sm:text-sm">{todayDay}</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end py-4 sm:py-6 px-4 sm:px-6 bg-slate-50 border-t border-slate-200">
        <button
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600
           text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-200
           hover:-translate-y-0.5 hover:shadow-lg focus:ring-4 focus:ring-blue-500/30"
          onClick={handleSearch}
        >
          {`Search ${service ? service.charAt(0).toUpperCase() + service.slice(1) : "Search"}`}
          {console.log(service.charAt(0).toUpperCase()) }
        </button>
      </div>
    </div>
  );
}