import { ArrowRightLeft } from "lucide-react";
import {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios.js"

export default function SearchBar({from, setFrom, to, setTo, date, setDate, searchData, handleFetchBus}) {

  const swap = () =>{
    const temp = from;
    setFrom(to)
    setTo(temp)
  }

  function formatDisplayDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${days[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
//  console.log("hi")


  return (

    <div className="w-auto bg-white shadow-md flex items-center gap-2 px-60 py-3">

      {/* From */}
      <div className="flex-1 border rounded-2xl p-1">
        <p className="text-gray-500 text-sm uppercase justify-left">
          From
        </p>
        <input className="text-2xl font-semibold"
        onChange = {(e) => {setFrom(e.target.value);}} 
        value = {from}/> 
        
      </div>

      {/* Swap Button */}
      <button className="w-12 h-12 rounded-full flex items-center justify-center border bg-white shadow-sm hover:bg-gray-50"
      onClick= {swap}>
        <ArrowRightLeft
          size={22}
          className="text-sky-500"
        />
      </button>

      {/* To */}
      <div className="flex-1 border rounded-2xl p-1">
        <p className="text-gray-500 text-sm uppercase justify-left">
          To
        </p>
        <input className="text-2xl font-semibold"
        value = {to}
        onChange = {(e)=>setTo(e.target.value)}/>
      </div>

      {/* Date */}
      <div className="w-72 border rounded-2xl px-4 py-1.5">
        <p className="text-gray-500 text-sm uppercase">
          Depart
        </p>
        <input
          type="date"
          className="w-full text-2xl font-semibold bg-transparent"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        
      </div>

      {/* Passengers (if available) */}
      {searchData.NoOfSeats && (
        <div className="w-52 border rounded-2xl px-4 py-1.5">
          <p className="text-gray-500 text-sm uppercase">
            Passengers
          </p>
          <p className="text-2xl font-semibold">{searchData.NoOfSeats}</p>
        </div>
      )}

      {/* Search Button */}
      <button className="w-64 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-2xl hover:opacity-90 transition"
      onClick= {handleFetchBus}>
        SEARCH
      </button>

    </div>
  );
}