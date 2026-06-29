import { ArrowRightLeft, Calendar, MapPin, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios.js";

export default function SearchBar({ from, setFrom, to, setTo, date, setDate, searchData, handleFetchBus }) {

  const swap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    // Kept py-1 for a tight outer container layout wrapper
    <div className="w-full bg-white border-b border-slate-200 shadow-xs py-1">
      <div className="max-w-8xl mx-auto sm:px-3 lg:px-4">
        
        <div className="flex flex-col xl:flex-row items-stretch gap-2 bg-white">
          
          {/* Main Route & Date Inputs Grid - Reduced outer padding from p-2 to p-1 */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-1.5 border border-slate-200 rounded-xl p-1 bg-slate-50/50 shadow-inner">
            
            {/* From Input Section - Reduced inner padding to p-1.5 */}
            <div className="md:col-span-4 flex items-center gap-2 bg-white rounded-lg p-1.5 border border-slate-100 focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-500/10 transition-all">
              <MapPin size={18} className="text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">From</label>
                <input 
                  type="text"
                  className="w-full text-xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none bg-transparent mt-0.5 leading-tight"
                  placeholder="Source City"
                  onChange={(e) => setFrom(e.target.value)} 
                  value={from}
                />
              </div>
            </div>

            {/* Swap Button Interactive Layer - Scaled down to w-8 h-8 to fit thin container */}
            <div className="md:col-span-1 flex items-center justify-center -my-1.5 md:my-0">
              <button 
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:text-lime-600 shadow-xs hover:scale-105 transition active:scale-95 z-10"
                onClick={swap}
                title="Swap Locations"
              >
                <ArrowRightLeft size={14} className="rotate-90 md:rotate-0" />
              </button>
            </div>

            {/* To Input Section - Reduced inner padding to p-1.5 */}
            <div className="md:col-span-4 flex items-center gap-2 bg-white rounded-lg p-1.5 border border-slate-100 focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-500/10 transition-all">
              <MapPin size={18} className="text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">To</label>
                <input 
                  type="text"
                  className="w-full text-xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none bg-transparent mt-0.5 leading-tight"
                  placeholder="Destination City"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
            </div>

            {/* Date Input Section - Reduced inner padding to p-1.5 */}
            <div className={`flex items-center gap-2 bg-white rounded-lg p-1.5 border border-slate-100 focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-500/10 transition-all md:col-span-3`}>
              <Calendar size={18} className="text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Depart Date</label>
                <input
                  type="date"
                  className="w-full text-xl font-bold text-slate-800 focus:outline-none bg-transparent mt-0.5 cursor-pointer accent-lime-600 leading-tight"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* Optional Seats/Passengers Container - Shrunk from py-3 to py-1.5 */}
          {searchData?.NoOfSeats && (
            <div className="w-full xl:w-40 flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-1.5 shadow-3xs">
              <Users size={18} className="text-slate-400 shrink-0" />
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Passengers</span>
                <span className="block text-base font-extrabold text-slate-800 mt-0.5 leading-none">{searchData.NoOfSeats} Seats</span>
              </div>
            </div>
          )}

          {/* Search Button - Changed rounded corners and updated target structures to match height */}
          <button 
            type="button"
            className="w-full xl:w-36 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-extrabold text-base tracking-wider transition-all duration-150 shadow-xs active:scale-[0.99] py-2.5 xl:py-0 flex items-center justify-center uppercase"
            onClick={handleFetchBus}
          >
            Search
          </button>

        </div>
        
      </div>
    </div>
  );
}