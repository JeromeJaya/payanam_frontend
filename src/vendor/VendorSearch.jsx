import React, { useRef } from "react";
import { Search } from "lucide-react";

export default function VendorSearch({
  searchQuery,
  setSearchQuery,
  searchServiceType,
  setSearchServiceType,
  searching,
  searchError,
  onSearch,
}) {
  const searchInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">Quick Search</span>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <select
              value={searchServiceType}
              onChange={(e) => setSearchServiceType(e.target.value)}
              className="px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
            >
              <option value="bus">Bus</option>
              <option value="flight">Flight</option>
              <option value="train">Train</option>
              <option value="hotel">Hotel</option>
            </select>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Enter ${searchServiceType} ID...`}
              className="flex-1 px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
            />
          </div>
          <button
            onClick={onSearch}
            disabled={searching || !searchQuery.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
          >
            {searching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
        </div>
      </div>
      {searchError && (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
          {searchError}
        </div>
      )}
    </div>
  );
}
